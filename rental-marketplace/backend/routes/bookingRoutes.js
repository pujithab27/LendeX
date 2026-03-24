const express = require('express');
const router = express.Router();
const { createBooking, getRenterBookings, getMerchantBookings, updateBookingStatus } = require('../controllers/bookingController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.post('/', requireAuth, createBooking);
router.get('/my-rentals', requireAuth, getRenterBookings);
router.get('/merchant', requireAuth, requireRole(['merchant', 'admin']), getMerchantBookings);
router.put('/:id/status', requireAuth, updateBookingStatus);

module.exports = router;
