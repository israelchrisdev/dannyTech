const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Join product rooms for watching bids
    socket.on('watch_product', (productId) => {
      socket.join(`product_${productId}`);
    });

    socket.on('unwatch_product', (productId) => {
      socket.leave(`product_${productId}`);
    });

    // Handle new bids
    socket.on('new_bid', async (data) => {
      // Broadcast to all users watching this product
      socket.to(`product_${data.productId}`).emit('bid_updated', data);
    });

    // Handle new messages
    socket.on('send_message', (data) => {
      socket.to(`user_${data.receiverId}`).emit('new_message', {
        ...data,
        senderId: socket.userId,
        timestamp: new Date()
      });
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(`user_${data.receiverId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };