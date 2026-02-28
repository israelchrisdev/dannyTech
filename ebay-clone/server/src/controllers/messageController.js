const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { getIO } = require('../services/socketService');

const prisma = new PrismaClient();

exports.sendMessage = catchAsync(async (req, res) => {
  const { receiverId, content, productId } = req.body;
  const senderId = req.user.id;

  if (senderId === receiverId) {
    throw new AppError('Cannot send message to yourself', 400);
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId }
  });

  if (!receiver) {
    throw new AppError('Receiver not found', 404);
  }

  const message = await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
      productId
    },
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

  // Emit real-time message
  const io = getIO();
  io.to(`user_${receiverId}`).emit('new_message', message);

  // Create notification
  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: 'MESSAGE',
      title: 'New Message',
      message: `You have a new message from ${req.user.username}`,
      data: {
        messageId: message.id,
        senderId,
        content
      }
    }
  });

  res.status(201).json({
    status: 'success',
    data: { message }
  });
});

exports.getConversations = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    distinct: ['senderId', 'receiverId'],
    orderBy: {
      createdAt: 'desc'
    },
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

  // Group messages by conversation
  const conversationMap = new Map();

  conversations.forEach(message => {
    const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
    const otherUser = message.senderId === userId ? message.receiver : message.sender;
    
    if (!conversationMap.has(otherUserId)) {
      conversationMap.set(otherUserId, {
        user: otherUser,
        lastMessage: message,
        product: message.product,
        unreadCount: 0
      });
    }
  });

  // Get unread counts
  for (const [otherUserId, conversation] of conversationMap) {
    const unreadCount = await prisma.message.count({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        read: false
      }
    });
    conversation.unreadCount = unreadCount;
  }

  const conversationsList = Array.from(conversationMap.values());

  res.status(200).json({
    status: 'success',
    data: { conversations: conversationsList }
  });
});

exports.getConversation = catchAsync(async (req, res) => {
  const { userId: otherUserId } = req.params;
  const currentUserId = req.user.id;

  const { page = 1, limit = 50 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: currentUserId,
          receiverId: otherUserId
        },
        {
          senderId: otherUserId,
          receiverId: currentUserId
        }
      ]
    },
    skip,
    take: parseInt(limit),
    orderBy: {
      createdAt: 'desc'
    },
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

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      receiverId: currentUserId,
      read: false
    },
    data: {
      read: true
    }
  });

  const total = await prisma.message.count({
    where: {
      OR: [
        {
          senderId: currentUserId,
          receiverId: otherUserId
        },
        {
          senderId: otherUserId,
          receiverId: currentUserId
        }
      ]
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

exports.markAsRead = catchAsync(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      receiverId: userId
    }
  });

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { read: true }
  });

  res.status(200).json({
    status: 'success',
    message: 'Message marked as read'
  });
});

exports.deleteMessage = catchAsync(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      senderId: userId
    }
  });

  if (!message) {
    throw new AppError('Message not found or you do not have permission to delete it', 404);
  }

  await prisma.message.delete({
    where: { id: messageId }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});