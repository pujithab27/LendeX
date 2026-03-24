const { admin } = require('../config/firebase');

exports.requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: 'Unauthorized, No Token' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // contains firebase uid

        // Optional: fetch DB user for role-based routes if needed
        // const { db } = require('../config/firebase');
        // const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        // req.dbUser = userDoc.data();

        next();
    } catch (error) {
        console.error('Auth verification error:', error);
        res.status(401).json({ success: false, error: 'Unauthorized, Invalid Token' });
    }
};

exports.requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            // Ensure req.user is set by requireAuth middleware
            if (!req.user || !req.user.uid) {
                return res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated' });
            }

            const { db } = require('../config/firebase');
            const userDoc = await db.collection('users').doc(req.user.uid).get();

            if (!userDoc.exists) {
                return res.status(403).json({ success: false, error: 'User record not found' });
            }

            const userRole = userDoc.data().role;
            const allowed = Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;

            if (!allowed) {
                return res.status(403).json({ success: false, error: 'Forbidden: Insufficient Permissions' });
            }
            next();
        } catch (error) {
            console.error('Role authorization error:', error);
            res.status(500).json({ success: false, error: 'Internal server error during role check' });
        }
    };
};
