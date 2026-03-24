const { db } = require('../config/firebase');

exports.syncUser = async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;

        // Check if user exists in Firestore
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        let userData;

        if (!doc.exists) {
            // Create new user
            userData = {
                firebaseUid: uid,
                email,
                name: name || '',
                profileImage: picture || '',
                role: 'renter', // Default role
                createdAt: new Date().toISOString()
            };
            await userRef.set(userData);
            userData._id = uid; // Map id for frontend compatibility
        } else {
            userData = doc.data();
            userData._id = doc.id;
        }

        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.user.uid).get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userData = doc.data();
        userData._id = doc.id;

        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
