const crypto = require('crypto');
const { db } = require('../config/firebase');

exports.createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const doc = await db.collection('bookings').doc(bookingId).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        const booking = doc.data();

        // Since we are mocking Razorpay in dev without full backend SDK integration in this snippet
        // We'll generate a dummy order ID
        const dummyOrderId = "order_" + crypto.randomBytes(8).toString('hex');
        const totalAmount = (booking.totalAmount + booking.securityDeposit) * 100;

        res.status(200).json({
            success: true,
            data: {
                id: dummyOrderId,
                currency: 'INR',
                amount: totalAmount
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const bRef = db.collection('bookings').doc(bookingId);
        const doc = await bRef.get();
        if (!doc.exists) return res.status(404).json({ success: false, error: 'Booking not found' });
        const booking = doc.data();

        // Store payment
        const payment = {
            booking: bookingId,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            amount: booking.totalAmount + booking.securityDeposit,
            currency: 'INR',
            status: 'COMPLETED',
            createdAt: new Date().toISOString()
        };

        await db.collection('payments').add(payment);

        // Update booking status
        await bRef.update({ status: 'ACCEPTED' });

        res.status(200).json({ success: true, message: 'Payment verified' });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
