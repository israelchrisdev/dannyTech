const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  placeBid,
  getBids,
  addReview,
  getReviews,
  toggleWatchlist,
  getWatchlist
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(
    protect,
    upload.array('images', 10),
    [
      body('title').notEmpty().isLength({ max: 200 }),
      body('description').notEmpty(),
      body('price').isFloat({ min: 0 }),
      body('condition').isIn(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
      body('quantity').isInt({ min: 1 }),
      body('categoryId').notEmpty(),
      body('type').isIn(['FIXED_PRICE', 'AUCTION', 'BEST_OFFER'])
    ],
    validate,
    createProduct
  );

router.get('/watchlist', protect, getWatchlist);

router.route('/:id')
  .get(getProductById)
  .patch(protect, updateProduct)
  .delete(protect, deleteProduct);

router.post(
  '/:id/bids',
  protect,
  [
    body('amount').isFloat({ min: 0.01 })
  ],
  validate,
  placeBid
);

router.get('/:id/bids', getBids);

router.post(
  '/:id/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString()
  ],
  validate,
  addReview
);

router.get('/:id/reviews', getReviews);

router.post('/:id/watchlist', protect, toggleWatchlist);

module.exports = router;