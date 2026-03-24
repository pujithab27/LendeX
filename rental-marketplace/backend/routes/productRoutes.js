const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct } = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', requireAuth, requireRole(['merchant']), createProduct);
router.put('/:id', requireAuth, requireRole(['merchant', 'admin']), updateProduct);

module.exports = router;
