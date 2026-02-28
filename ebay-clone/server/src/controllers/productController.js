const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { indexProduct, searchProducts } = require('../services/searchService');
const { uploadToS3 } = require('../services/fileService');

const prisma = new PrismaClient();

exports.createProduct = catchAsync(async (req, res) => {
  const { title, description, price, condition, quantity, categoryId, type, startPrice, reservePrice, endTime } = req.body;
  const sellerId = req.user.id;

  // Handle image uploads
  const images = [];
  if (req.files) {
    for (const file of req.files) {
      const imageUrl = await uploadToS3(file);
      images.push({ url: imageUrl });
    }
  }

  const product = await prisma.product.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      condition,
      quantity: parseInt(quantity),
      sellerId,
      categoryId,
      type,
      startPrice: startPrice ? parseFloat(startPrice) : null,
      reservePrice: reservePrice ? parseFloat(reservePrice) : null,
      endTime: endTime ? new Date(endTime) : null,
      images: {
        create: images
      }
    },
    include: {
      images: true,
      seller: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      category: true
    }
  });

  // Index in Elasticsearch
  await indexProduct(product);

  res.status(201).json({
    status: 'success',
    data: { product }
  });
});

exports.getProducts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    minPrice,
    maxPrice,
    condition,
    type,
    sort = 'createdAt_desc',
    search
  } = req.query;

  // If search query is provided, use Elasticsearch
  if (search) {
    const searchResults = await searchProducts(search, {
      category,
      minPrice,
      maxPrice,
      condition,
      type,
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    });

    return res.status(200).json({
      status: 'success',
      data: searchResults
    });
  }

  // Otherwise use database query
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const where = {
    status: 'ACTIVE'
  };

  if (category) {
    where.categoryId = category;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (condition) {
    where.condition = condition;
  }

  if (type) {
    where.type = type;
  }

  const [sortField, sortOrder] = sort.split('_');
  const orderBy = {
    [sortField]: sortOrder
  };

  const products = await prisma.product.findMany({
    where,
    skip,
    take: parseInt(limit),
    orderBy,
    include: {
      images: {
        take: 1
      },
      seller: {
        select: {
          id: true,
          username: true,
          avatar: true,
          store: true
        }
      }
    }
  });

  const total = await prisma.product.count({ where });

  res.status(200).json({
    status: 'success',
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

exports.getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      seller: {
        select: {
          id: true,
          username: true,
          avatar: true,
          store: true,
          createdAt: true
        }
      },
      category: true,
      bids: {
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        },
        orderBy: {
          amount: 'desc'
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      }
    }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Increment view count
  await prisma.product.update({
    where: { id },
    data: { views: { increment: 1 } }
  });

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.sellerId !== userId && req.user.role !== 'ADMIN') {
    throw new AppError('You do not have permission to update this product', 403);
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: req.body,
    include: {
      images: true
    }
  });

  // Update in Elasticsearch
  await indexProduct(updatedProduct);

  res.status(200).json({
    status: 'success',
    data: { product: updatedProduct }
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.sellerId !== userId && req.user.role !== 'ADMIN') {
    throw new AppError('You do not have permission to delete this product', 403);
  }

  await prisma.product.delete({
    where: { id }
  });

  // Remove from Elasticsearch (implement this function)

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.placeBid = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const userId = req.user.id;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      bids: {
        orderBy: {
          amount: 'desc'
        },
        take: 1
      }
    }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.type !== 'AUCTION') {
    throw new AppError('This product is not available for bidding', 400);
  }

  if (product.status !== 'ACTIVE') {
    throw new AppError('This auction is no longer active', 400);
  }

  if (product.endTime && new Date() > product.endTime) {
    throw new AppError('This auction has ended', 400);
  }

  if (product.sellerId === userId) {
    throw new AppError('You cannot bid on your own product', 400);
  }

  const currentHighestBid = product.bids[0]?.amount || product.startPrice || 0;
  
  if (amount <= currentHighestBid) {
    throw new AppError('Bid must be higher than current highest bid', 400);
  }

  const bid = await prisma.bid.create({
    data: {
      amount: parseFloat(amount),
      userId,
      productId: id
    },
    include: {
      user: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  // Notify previous highest bidder (implement notification service)

  res.status(201).json({
    status: 'success',
    data: { bid }
  });
});