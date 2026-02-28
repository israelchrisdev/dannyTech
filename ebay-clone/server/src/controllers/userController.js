const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { uploadToS3 } = require('../services/fileService');

const prisma = new PrismaClient();

exports.getProfile = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      address: true,
      store: true,
      _count: {
        select: {
          products: true,
          orders: true,
          reviews: true
        }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const { firstName, lastName, phone, bio } = req.body;
  let avatarUrl;

  if (req.file) {
    avatarUrl = await uploadToS3(req.file);
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      firstName,
      lastName,
      phone,
      bio,
      ...(avatarUrl && { avatar: avatarUrl })
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatar: true,
      bio: true
    }
  });

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword }
  });

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

exports.getSellerInfo = catchAsync(async (req, res) => {
  const { id } = req.params;

  const seller = await prisma.user.findUnique({
    where: { id },
    include: {
      store: true,
      _count: {
        select: {
          products: {
            where: { status: 'ACTIVE' }
          },
          sellerReviews: true
        }
      }
    }
  });

  if (!seller) {
    throw new AppError('Seller not found', 404);
  }

  // Calculate average rating
  const reviews = await prisma.review.aggregate({
    where: { sellerId: id },
    _avg: { rating: true }
  });

  // Get recent products
  const products = await prisma.product.findMany({
    where: {
      sellerId: id,
      status: 'ACTIVE'
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        take: 1
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      seller: {
        ...seller,
        averageRating: reviews._avg.rating || 0
      },
      recentProducts: products
    }
  });
});

exports.getSellerReviews = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reviews = await prisma.review.findMany({
    where: { sellerId: id },
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      product: {
        select: {
          id: true,
          title: true,
          images: {
            take: 1
          }
        }
      }
    }
  });

  const total = await prisma.review.count({
    where: { sellerId: id }
  });

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

exports.getOrders = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const userId = req.user.id;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    userId
  };

  if (status) {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                take: 1
              }
            }
          }
        }
      },
      payment: true
    }
  });

  const total = await prisma.order.count({ where });

  res.status(200).json({
    status: 'success',
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

exports.getMessages = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user.id;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      receiver: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      }
    }
  });

  const total = await prisma.message.count({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }
  });

  // Mark messages as read
  const unreadMessageIds = messages
    .filter(m => m.receiverId === userId && !m.read)
    .map(m => m.id);

  if (unreadMessageIds.length > 0) {
    await prisma.message.updateMany({
      where: { id: { in: unreadMessageIds } },
      data: { read: true }
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

exports.getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const userId = req.user.id;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    userId
  };

  if (unreadOnly === 'true') {
    where.read = false;
  }

  const notifications = await prisma.notification.findMany({
    where,
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' }
  });

  const total = await prisma.notification.count({ where });
  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      read: false
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

exports.markNotificationRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await prisma.notification.update({
    where: { id },
    data: { read: true }
  });

  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read'
  });
});

exports.getStore = catchAsync(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { userId: req.user.id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true
        }
      },
      products: {
        where: { status: 'ACTIVE' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          images: {
            take: 1
          }
        }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { store }
  });
});

exports.updateStore = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  let logoUrl, bannerUrl;

  if (req.files) {
    if (req.files.logo) {
      logoUrl = await uploadToS3(req.files.logo[0]);
    }
    if (req.files.banner) {
      bannerUrl = await uploadToS3(req.files.banner[0]);
    }
  }

  const store = await prisma.store.upsert({
    where: { userId: req.user.id },
    update: {
      name,
      description,
      ...(logoUrl && { logo: logoUrl }),
      ...(bannerUrl && { banner: bannerUrl })
    },
    create: {
      name,
      description,
      userId: req.user.id,
      ...(logoUrl && { logo: logoUrl }),
      ...(bannerUrl && { banner: bannerUrl })
    }
  });

  res.status(200).json({
    status: 'success',
    data: { store }
  });
});