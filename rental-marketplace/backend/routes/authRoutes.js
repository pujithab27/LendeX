const express = require('express');
const router = express.Router();
const { syncUser, getProfile, updateUserProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/sync', requireAuth, syncUser);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateUserProfile || ((req, res) => res.status(501).json({ message: "Not implemented" })));

module.exports = router;
