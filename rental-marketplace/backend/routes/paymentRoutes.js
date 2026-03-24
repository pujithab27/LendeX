const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/create-order', requireAuth, createOrder);
router.post('/verify', requireAuth, verifyPayment);

module.exports = router;
