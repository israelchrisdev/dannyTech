const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getSellerInfo,
  getSellerReviews,
  updatePassword,
  getOrders,
  getMessages,
  getNotifications,
  markNotificationRead,
  updateStore,
  getStore
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.patch(
  '/profile',
  upload.single('avatar'),
  [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('phone').optional().isString(),
    body('bio').optional().isString()
  ],
  validate,
  updateProfile
);

router.patch(
  '/password',
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  validate,
  updatePassword
);

router.get('/orders', getOrders);
router.get('/messages', getMessages);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

router.route('/store')
  .get(getStore)
  .patch(
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 }
    ]),
    [
      body('name').optional().isString(),
      body('description').optional().isString()
    ],
    validate,
    updateStore
  );

router.get('/:id', getSellerInfo);
router.get('/:id/reviews', getSellerReviews);

module.exports = router;