const express = require('express');
const router = express.Router();
const { startConversation, getConversations, getMessages, sendMessage } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/conversation', requireAuth, startConversation);
router.get('/conversations', requireAuth, getConversations);
router.get('/:conversationId/messages', requireAuth, getMessages);
router.post('/:conversationId/messages', requireAuth, sendMessage);

module.exports = router;
