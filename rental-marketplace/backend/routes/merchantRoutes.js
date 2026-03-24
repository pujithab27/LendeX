const express = require('express');
const router = express.Router();
const { applyMerchant, getApplications, approveMerchant } = require('../controllers/merchantController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.post('/apply', requireAuth, applyMerchant);
router.get('/applications', requireAuth, requireRole(['admin']), getApplications);
router.get('/me', requireAuth, requireRole(['merchant', 'admin']), (req, res) => res.status(501).json({ message: "Not implemented" }));
router.put('/:id/approve', requireAuth, requireRole(['admin']), approveMerchant);

module.exports = router;
