const { db } = require('../config/firebase');

exports.createBooking = async (req, res) => {
    try {
        const { productId, startDate, endDate } = req.body;

        // Validate product exists
        const prodDoc = await db.collection('products').doc(productId).get();
        if (!prodDoc.exists) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        const product = prodDoc.data();

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return res.status(400).json({ success: false, error: 'Invalid dates' });
        }

        // Manual Overlap Validation (Firestore no overlap natively)
        const bookingsSnap = await db.collection('bookings')
            .where('product', '==', productId)
            .where('status', 'in', ['REQUESTED', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'IN_USE'])
            .get();

        let isOverlap = false;
        bookingsSnap.forEach(doc => {
            const b = doc.data();
            const bStart = new Date(b.startDate);
            const bEnd = new Date(b.endDate);
            if (start <= bEnd && end >= bStart) {
                isOverlap = true;
            }
        });

        if (isOverlap) {
            return res.status(400).json({ success: false, error: 'Dates already booked' });
        }

        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalAmount = diffDays * product.pricePerDay;

        const newBooking = {
            product: productId,
            renter: req.user.uid,
            merchant: product.merchant,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            totalAmount,
            securityDeposit: product.securityDeposit,
            status: 'REQUESTED',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('bookings').add(newBooking);

        res.status(201).json({ success: true, data: { _id: docRef.id, ...newBooking } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getRenterBookings = async (req, res) => {
    try {
        const snapshot = await db.collection('bookings')
            .where('renter', '==', req.user.uid)
            .get();

        const bookings = await Promise.all(snapshot.docs.map(async bDoc => {
            const b = { _id: bDoc.id, ...bDoc.data() };
            // populate product manually
            const pDoc = await db.collection('products').doc(b.product).get();
            if (pDoc.exists) b.productData = { _id: pDoc.id, ...pDoc.data() };
            return b;
        }));

        // Map `productData` back to `product` for frontend compat
        const formatted = bookings.map(b => ({ ...b, product: b.productData }));

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getMerchantBookings = async (req, res) => {
    try {
        const snapshot = await db.collection('bookings')
            .where('merchant', '==', req.user.uid)
            .get();

        const bookings = await Promise.all(snapshot.docs.map(async bDoc => {
            const b = { _id: bDoc.id, ...bDoc.data() };
            const pDoc = await db.collection('products').doc(b.product).get();
            if (pDoc.exists) b.productData = pDoc.data();

            const rDoc = await db.collection('users').doc(b.renter).get();
            if (rDoc.exists) b.renterData = rDoc.data();

            return b;
        }));

        const formatted = bookings.map(b => ({
            ...b,
            product: b.productData,
            renter: b.renterData
        }));

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingRef = db.collection('bookings').doc(req.params.id);
        const doc = await bookingRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        await bookingRef.update({ status });
        const updated = await bookingRef.get();

        res.status(200).json({ success: true, data: { _id: updated.id, ...updated.data() } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
