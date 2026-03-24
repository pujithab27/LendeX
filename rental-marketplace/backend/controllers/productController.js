const { db } = require('../config/firebase');

exports.createProduct = async (req, res) => {
    try {
        // req.user has the UID from verifyToken
        const newProduct = {
            ...req.body,
            merchant: req.user.uid,
            status: 'AVAILABLE',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('products').add(newProduct);
        res.status(201).json({ success: true, data: { _id: docRef.id, ...newProduct } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = db.collection('products');

        // Basic filtering (Firestore doesn't natively do text-search like Mongoose regex, 
        // so we'll fetch all matching category and optionally filter search client-side/in-memory for simple search)

        if (category) {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        let products = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

        // In-memory text search fallback since Firestore lacks full-text search
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p => p.title.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower));
        }

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const doc = await db.collection('products').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        const prod = { _id: doc.id, ...doc.data() };

        // Fetch merchant data optionally (populate sim)
        const mDoc = await db.collection('users').doc(prod.merchant).get();
        if (mDoc.exists) {
            prod.merchant = { _id: mDoc.id, name: mDoc.data().name, email: mDoc.data().email };
        }

        res.status(200).json({ success: true, data: prod });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const prodRef = db.collection('products').doc(req.params.id);
        const doc = await prodRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // verification of owner
        if (doc.data().merchant !== req.user.uid && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized to update this product' });
        }

        await prodRef.update(req.body);
        const updated = await prodRef.get();

        res.status(200).json({ success: true, data: { _id: updated.id, ...updated.data() } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const prodRef = db.collection('products').doc(req.params.id);
        const doc = await prodRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        if (doc.data().merchant !== req.user.uid && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        await prodRef.delete();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
