const express = require('express');
const router = express.Router();
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/', requireAuth, createReview);
router.get('/product/:productId', getProductReviews);

module.exports = router;
