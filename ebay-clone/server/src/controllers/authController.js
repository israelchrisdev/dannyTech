const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../services/emailService');

const prisma = new PrismaClient();

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

exports.register = catchAsync(async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName
    }
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Remove password from response
  delete user.password;

  res.status(201).json({
    status: 'success',
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Remove password from response
  delete user.password;

  res.status(200).json({
    status: 'success',
    data: {
      user,
      accessToken,
      refreshToken
    }
  });
});

exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
});

exports.logout = catchAsync(async (req, res) => {
  // In a real app, you might want to blacklist the token
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError('No user found with this email', 404);
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: user.id },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: '1h' }
  );

  // Save reset token to user
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken }
  });

  // Send email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `
  });

  res.status(200).json({
    status: 'success',
    message: 'Password reset email sent'
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        resetToken: token
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    throw new AppError('Invalid or expired reset token', 400);
  }
});