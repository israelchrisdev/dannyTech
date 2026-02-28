const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { createPaymentIntent } = require('../services/paymentService');
const { sendOrderConfirmation } = require('../services/emailService');

const prisma = new PrismaClient();

exports.createOrder = catchAsync(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  const userId = req.user.id;

  // Validate items and calculate total
  let total = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    });

    if (!product) {
      throw new AppError(`Product ${item.productId} not found`, 404);
    }

    if (product.quantity < item.quantity) {
      throw new AppError(`Insufficient quantity for product ${product.title}`, 400);
    }

    if (product.status !== 'ACTIVE') {
      throw new AppError(`Product ${product.title} is not available`, 400);
    }

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price
    });
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      shippingAddress,
      status: 'PENDING',
      items: {
        create: orderItems
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  // Create payment intent
  const paymentIntent = await createPaymentIntent(total, 'usd');

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: total,
      method: paymentMethod,
      status: 'PENDING',
      transactionId: paymentIntent.id
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      order,
      clientSecret: paymentIntent.client_secret
    }
  });
});

exports.getOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.user.id;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = { userId };
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

exports.getOrderById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const order = await prisma.order.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { 
          items: {
            some: {
              product: {
                sellerId: userId
              }
            }
          }
        }
      ]
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              seller: {
                select: {
                  id: true,
                  username: true,
                  email: true
                }
              }
            }
          }
        }
      },
      payment: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const order = await prisma.order.findFirst({
    where: {
      id,
      items: {
        some: {
          product: {
            sellerId: userId
          }
        }
      }
    }
  });

  if (!order) {
    throw new AppError('Order not found or you do not have permission', 404);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: true
    }
  });

  // Send email notification to buyer
  if (status === 'SHIPPED') {
    await sendOrderConfirmation(updatedOrder.user.email, updatedOrder);
  }

  res.status(200).json({
    status: 'success',
    data: { order: updatedOrder }
  });
});

exports.cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId,
      status: 'PENDING'
    }
  });

  if (!order) {
    throw new AppError('Order not found or cannot be cancelled', 404);
  }

  const cancelledOrder = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: {
      items: true
    }
  });

  // Restore product quantities
  for (const item of cancelledOrder.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantity: {
          increment: item.quantity
        }
      }
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Order cancelled successfully'
  });
});