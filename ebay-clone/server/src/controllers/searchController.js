const { PrismaClient } = require('@prisma/client');
const { searchProducts } = require('../services/searchService');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const prisma = new PrismaClient();

/**
 * Search for products with filters
 * @route GET /api/v1/search
 * @access Public
 */
exports.search = catchAsync(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    condition,
    type,
    sellerId,
    page = 1,
    limit = 20,
    sort = 'relevance'
  } = req.query;

  // Use Elasticsearch for full-text search
  if (q) {
    const results = await searchProducts(q, {
      category,
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
      condition,
      type,
      sellerId,
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    });

    return res.status(200).json({
      status: 'success',
      data: {
        products: results.products,
        pagination: {
          page: results.page,
          limit: results.limit,
          total: results.total,
          pages: results.pages
        },
        aggregations: results.aggregations
      }
    });
  }

  // Use database search for filtered queries without text search
  const where = { status: 'ACTIVE' };
  
  if (category) where.categoryId = category;
  if (sellerId) where.sellerId = sellerId;
  if (type) where.type = type;
  if (condition) where.condition = condition;
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Sorting
  let orderBy = {};
  switch (sort) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'bids_desc':
      orderBy = { bids: { _count: 'desc' } };
      break;
    case 'ending_soon':
      orderBy = { endTime: 'asc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
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
        },
        _count: {
          select: { bids: true }
        }
      }
    }),
    prisma.product.count({ where })
  ]);

  // Get category aggregations
  const categories = await prisma.product.groupBy({
    by: ['categoryId'],
    where,
    _count: true
  });

  // Get condition aggregations
  const conditions = await prisma.product.groupBy({
    by: ['condition'],
    where,
    _count: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      aggregations: {
        categories,
        conditions,
        priceRange: {
          min: minPrice || 0,
          max: maxPrice || 10000
        }
      }
    }
  });
});

/**
 * Get search suggestions
 * @route GET /api/v1/search/suggestions
 * @access Public
 */
exports.getSuggestions = catchAsync(async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json({
      status: 'success',
      data: { suggestions: [] }
    });
  }

  // Get product title suggestions
  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      title: {
        contains: q,
        mode: 'insensitive'
      }
    },
    select: {
      title: true
    },
    distinct: ['title'],
    take: 5
  });

  // Get category suggestions
  const categories = await prisma.category.findMany({
    where: {
      name: {
        contains: q,
        mode: 'insensitive'
      }
    },
    select: {
      name: true,
      slug: true
    },
    take: 3
  });

  const suggestions = [
    ...products.map(p => ({
      type: 'product',
      text: p.title
    })),
    ...categories.map(c => ({
      type: 'category',
      text: c.name,
      slug: c.slug
    }))
  ];

  res.status(200).json({
    status: 'success',
    data: { suggestions }
  });
});

/**
 * Get popular searches
 * @route GET /api/v1/search/popular
 * @access Public
 */
exports.getPopularSearches = catchAsync(async (req, res) => {
  // This would typically come from analytics data
  // For now, return static popular searches
  const popularSearches = [
    { query: 'iphone', count: 1234 },
    { query: 'vintage camera', count: 987 },
    { query: 'designer bag', count: 876 },
    { query: 'smart watch', count: 765 },
    { query: 'gaming laptop', count: 654 }
  ];

  res.status(200).json({
    status: 'success',
    data: { popularSearches }
  });
});

/**
 * Save search for user
 * @route POST /api/v1/search/save
 * @access Private
 */
exports.saveSearch = catchAsync(async (req, res) => {
  const { query, filters, frequency } = req.body;
  const userId = req.user.id;

  const savedSearch = await prisma.savedSearch.create({
    data: {
      userId,
      query,
      filters,
      frequency: frequency || 'daily'
    }
  });

  res.status(201).json({
    status: 'success',
    data: { savedSearch }
  });
});

/**
 * Get user's saved searches
 * @route GET /api/v1/search/saved
 * @access Private
 */
exports.getSavedSearches = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    data: { savedSearches }
  });
});

/**
 * Delete saved search
 * @route DELETE /api/v1/search/saved/:id
 * @access Private
 */
exports.deleteSavedSearch = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const savedSearch = await prisma.savedSearch.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!savedSearch) {
    throw new AppError('Saved search not found', 404);
  }

  await prisma.savedSearch.delete({
    where: { id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Get related searches
 * @route GET /api/v1/search/related
 * @access Public
 */
exports.getRelatedSearches = catchAsync(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({
      status: 'success',
      data: { related: [] }
    });
  }

  // This would use more sophisticated logic in production
  // For now, return simple related terms
  const related = [
    `${q} new`,
    `${q} used`,
    `${q} cheap`,
    `vintage ${q}`,
    `antique ${q}`
  ];

  res.status(200).json({
    status: 'success',
    data: { related }
  });
});