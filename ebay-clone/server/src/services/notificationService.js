const { PrismaClient } = require('@prisma/client');
const { getIO } = require('./socketService');
const { sendEmail } = require('./emailService');

const prisma = new PrismaClient();

const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data
      }
    });

    // Emit real-time notification
    const io = getIO();
    io.to(`user_${userId}`).emit('notification', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

const notifyBidPlaced = async (productId, bidAmount, bidderId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: true,
      bids: {
        orderBy: { amount: 'desc' },
        take: 2,
        include: { user: true }
      }
    }
  });

  // Notify seller
  await createNotification(
    product.sellerId,
    'BID_PLACED',
    'New Bid on Your Item',
    `Someone placed a bid of $${bidAmount} on ${product.title}`,
    { productId, bidAmount, bidderId }
  );

  // Notify previous highest bidder if outbid
  if (product.bids.length >= 2 && product.bids[1].userId !== bidderId) {
    const previousBidder = product.bids[1].user;
    await createNotification(
      previousBidder.id,
      'OUTBID',
      'You\'ve Been Outbid!',
      `Someone placed a higher bid of $${bidAmount} on ${product.title}`,
      { productId, bidAmount }
    );

    // Send email
    await sendEmail({
      to: previousBidder.email,
      subject: `You've been outbid on ${product.title}`,
      html: `
        <h1>You've been outbid!</h1>
        <p>A new bid of $${bidAmount} has been placed on ${product.title}.</p>
        <a href="${process.env.CLIENT_URL}/product/${productId}">View Item</a>
      `
    });
  }
};

const notifyAuctionWon = async (productId, winnerId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  await createNotification(
    winnerId,
    'AUCTION_WON',
    'Congratulations! You Won the Auction',
    `You won the auction for ${product.title}`,
    { productId }
  );

  // Send email
  const winner = await prisma.user.findUnique({
    where: { id: winnerId }
  });

  await sendEmail({
    to: winner.email,
    subject: `You won the auction for ${product.title}!`,
    html: `
      <h1>Congratulations!</h1>
      <p>You won the auction for ${product.title}.</p>
      <p>Please complete your purchase within 48 hours.</p>
      <a href="${process.env.CLIENT_URL}/checkout?product=${productId}">Complete Purchase</a>
    `
  });
};

const notifyOrderShipped = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  await createNotification(
    order.userId,
    'ORDER_SHIPPED',
    'Your Order Has Shipped!',
    `Your order #${order.id} is on its way`,
    { orderId }
  );

  // Send email
  await sendEmail({
    to: order.user.email,
    subject: `Your order #${order.id} has shipped!`,
    html: `
      <h1>Your Order Has Shipped!</h1>
      <p>Your order #${order.id} is on its way.</p>
      <p>Track your package to see when it will arrive.</p>
      <a href="${process.env.CLIENT_URL}/orders/${orderId}">Track Order</a>
    `
  });
};

const notifyNewMessage = async (senderId, receiverId, messageContent) => {
  const sender = await prisma.user.findUnique({
    where: { id: senderId }
  });

  await createNotification(
    receiverId,
    'NEW_MESSAGE',
    `New Message from ${sender.username}`,
    messageContent.length > 50 ? messageContent.substring(0, 50) + '...' : messageContent,
    { senderId }
  );
};

const notifyItemSold = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { seller: true }
  });

  await createNotification(
    product.sellerId,
    'ITEM_SOLD',
    'Your Item Has Sold!',
    `Congratulations! ${product.title} has been sold`,
    { productId }
  );

  // Send email
  await sendEmail({
    to: product.seller.email,
    subject: `Your item ${product.title} has sold!`,
    html: `
      <h1>Congratulations!</h1>
      <p>Your item ${product.title} has been sold.</p>
      <p>Please arrange shipping within 2 business days.</p>
      <a href="${process.env.CLIENT_URL}/seller/orders">View Order</a>
    `
  });
};

module.exports = {
  createNotification,
  notifyBidPlaced,
  notifyAuctionWon,
  notifyOrderShipped,
  notifyNewMessage,
  notifyItemSold
};