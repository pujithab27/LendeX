const { db } = require('../config/firebase');

exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // Check if user has rented it
        const snaps = await db.collection('bookings')
            .where('product', '==', productId)
            .where('renter', '==', req.user.uid)
            .where('status', '==', 'COMPLETED')
            .get();

        if (snaps.empty) {
            return res.status(400).json({ success: false, error: 'You can only review a product after completing a rental' });
        }

        const review = {
            product: productId,
            user: req.user.uid,
            rating: Number(rating),
            comment,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('reviews').add(review);
        res.status(201).json({ success: true, data: { _id: docRef.id, ...review } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const snaps = await db.collection('reviews').where('product', '==', productId).get();

        const reviews = await Promise.all(snaps.docs.map(async doc => {
            const r = doc.data();
            const uDoc = await db.collection('users').doc(r.user).get();
            if (uDoc.exists) r.userData = { name: uDoc.data().name, profileImage: uDoc.data().profileImage };
            return { _id: doc.id, ...r, user: r.userData };
        }));

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
