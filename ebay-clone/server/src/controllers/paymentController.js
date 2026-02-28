const { PrismaClient } = require('@prisma/client');
const stripe = require('../config/stripe');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const prisma = new PrismaClient();

exports.createPaymentIntent = catchAsync(async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user.id;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    }
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      orderId,
      userId
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      clientSecret: paymentIntent.client_secret
    }
  });
});

exports.confirmPayment = catchAsync(async (req, res) => {
  const { paymentIntentId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === 'succeeded') {
    const payment = await prisma.payment.update({
      where: { transactionId: paymentIntentId },
      data: {
        status: 'COMPLETED'
      }
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: 'PROCESSING'
      }
    });

    // Update product quantities
    const order = await prisma.order.findUnique({
      where: { id: payment.orderId },
      include: {
        items: true
      }
    });

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity
          },
          ...(item.product.quantity - item.quantity === 0 && { status: 'SOLD' })
        }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment confirmed successfully'
    });
  } else {
    throw new AppError('Payment not successful', 400);
  }
});

exports.handleWebhook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new AppError(`Webhook Error: ${err.message}`, 400);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSuccessfulPayment(paymentIntent) {
  const { orderId } = paymentIntent.metadata;

  await prisma.payment.update({
    where: { transactionId: paymentIntent.id },
    data: {
      status: 'COMPLETED'
    }
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PROCESSING'
    }
  });
}

async function handleFailedPayment(paymentIntent) {
  await prisma.payment.update({
    where: { transactionId: paymentIntent.id },
    data: {
      status: 'FAILED'
    }
  });
}

exports.getPaymentMethods = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // In a real app, you would retrieve saved payment methods from Stripe
  // This is a simplified version
  const paymentMethods = [
    {
      id: 'pm_card_visa',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025
    }
  ];

  res.status(200).json({
    status: 'success',
    data: { paymentMethods }
  });
});

exports.getPayoutHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const payouts = await prisma.payment.findMany({
    where: {
      order: {
        items: {
          some: {
            product: {
              sellerId: userId
            }
          }
        }
      }
    },
    skip,
    take: parseInt(limit),
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  const total = await prisma.payment.count({
    where: {
      order: {
        items: {
          some: {
            product: {
              sellerId: userId
            }
          }
        }
      }
    }
  });

  // Calculate total earnings
  const earnings = payouts.reduce((sum, payout) => sum + payout.amount, 0);

  res.status(200).json({
    status: 'success',
    data: {
      payouts,
      earnings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});