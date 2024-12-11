// routes/chatRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Middleware to restrict access to authenticated users and employees
const userAccess = [authMiddleware];
const employeeAccess = [authMiddleware, roleMiddleware(['admin', 'employee'])];

// Start a new chat session (User initiates chat with Support)
router.post('/start', ...userAccess, chatController.startChat);

// Send a message (Either user or employee can send a message)
router.post('/send-message', ...userAccess, chatController.sendMessage);

// Get chat history by chat ID (User can view their own chat history)
router.get('/history/:chatId', ...userAccess, chatController.getChatHistory);

// Get all chats (Employee view - only for support and admin roles)
router.get('/all-chats', ...employeeAccess, chatController.getAllChats);

// Get recent chats (Employee view for recently active chats)
router.get('/recent-chats', ...employeeAccess, chatController.getRecentChats);

// Search chats by user ID (Employee can search all chats by user ID)
router.get('/search/:userId', ...employeeAccess, chatController.searchChatsByUser);

// Mark messages as read (Employee marks a user's message as read)
router.put('/mark-as-read/:chatId', ...employeeAccess, chatController.markAsRead);

// Get unread messages for a specific chat (User or employee can view unread messages)
router.get('/unread/:chatId', ...userAccess, chatController.getUnreadMessages);

// Close a chat (Employee or user can close the chat)
router.put('/close/:chatId', ...userAccess, chatController.closeChat);

// Delete a chat (Admin can delete chat permanently)
router.delete('/delete/:chatId', ...employeeAccess, roleMiddleware(['admin']), chatController.deleteChat);

module.exports = router;
