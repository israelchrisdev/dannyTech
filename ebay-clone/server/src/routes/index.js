const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const categoryRoutes = require('./categoryRoutes');
const searchRoutes = require('./searchRoutes');
const messageRoutes = require('./messageRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);
router.use('/messages', messageRoutes);

module.exports = router;