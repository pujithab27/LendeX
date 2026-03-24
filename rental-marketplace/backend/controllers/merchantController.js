const { db } = require('../config/firebase');

exports.applyMerchant = async (req, res) => {
    try {
        const { phone, bankDetails, idProofUrl } = req.body;

        // Create application in Firestore
        const appRef = db.collection('merchant_applications').doc();
        await appRef.set({
            userId: req.user.uid,
            phone,
            bankDetails,
            idProofUrl,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const snapshot = await db.collection('merchant_applications').get();
        const apps = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, count: apps.length, data: apps });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.approveMerchant = async (req, res) => {
    try {
        const { id } = req.params;

        const appRef = db.collection('merchant_applications').doc(id);
        const doc = await appRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }

        const application = doc.data();

        // Update application
        await appRef.update({ status: 'APPROVED' });

        // Update user role to merchant
        await db.collection('users').doc(application.userId).update({
            role: 'merchant',
            phone: application.phone
        });

        res.status(200).json({ success: true, data: { ...application, status: 'APPROVED' } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
