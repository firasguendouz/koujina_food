const Chat = require('../models/Chat'); // Assuming a Chat schema/model exists
const Message = require('../models/Message'); // Assuming a Message schema/model exists
const User = require('../models/User');

// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};

// Start a new chat session (User initiates chat with Support)
exports.startChat = async (req, res) => {
    try {
        const { userId, employeeId } = req.body;

        // Check if chat already exists between user and employee
        let chat = await Chat.findOne({ user: userId, employee: employeeId });
        if (!chat) {
            chat = await Chat.create({ user: userId, employee: employeeId, isActive: true });
        }

        createResponse(res, 201, 'Chat started successfully', chat);
    } catch (error) {
        console.error('Error starting chat:', error);
        createResponse(res, 500, 'Failed to start chat');
    }
};

// Send a message (Either user or employee can send a message)
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, senderId, content } = req.body;

        // Create and save a new message
        const message = await Message.create({ chat: chatId, sender: senderId, content });
        
        // Add message to chat's messages array
        await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id }, lastUpdated: Date.now() });
        
        createResponse(res, 201, 'Message sent successfully', message);
    } catch (error) {
        console.error('Error sending message:', error);
        createResponse(res, 500, 'Failed to send message');
    }
};

// Get chat history by chat ID (User can view their own chat history)
exports.getChatHistory = async (req, res) => {
    try {
        const { chatId } = req.params;
        
        // Populate messages in the chat
        const chat = await Chat.findById(chatId).populate({
            path: 'messages',
            populate: { path: 'sender', select: 'name role' }
        });

        if (!chat) return createResponse(res, 404, 'Chat not found');
        
        createResponse(res, 200, 'Chat history retrieved successfully', chat);
    } catch (error) {
        console.error('Error retrieving chat history:', error);
        createResponse(res, 500, 'Failed to retrieve chat history');
    }
};

// Get all chats (Employee view - only for support and admin roles)
exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find().populate('user employee', 'name role');
        createResponse(res, 200, 'All chats retrieved successfully', chats);
    } catch (error) {
        console.error('Error retrieving all chats:', error);
        createResponse(res, 500, 'Failed to retrieve all chats');
    }
};

// Get recent chats (Employee view for recently active chats)
exports.getRecentChats = async (req, res) => {
    try {
        const recentChats = await Chat.find({ isActive: true }).sort({ lastUpdated: -1 }).limit(10).populate('user employee', 'name role');
        createResponse(res, 200, 'Recent chats retrieved successfully', recentChats);
    } catch (error) {
        console.error('Error retrieving recent chats:', error);
        createResponse(res, 500, 'Failed to retrieve recent chats');
    }
};

// Search chats by user ID (Employee can search all chats by user ID)
exports.searchChatsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const chats = await Chat.find({ user: userId }).populate('user employee', 'name role');
        createResponse(res, 200, 'Chats retrieved successfully for the user', chats);
    } catch (error) {
        console.error('Error searching chats by user ID:', error);
        createResponse(res, 500, 'Failed to retrieve chats for the user');
    }
};

// Mark messages as read (Employee marks a user's message as read)
exports.markAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Update unread messages in the specified chat to mark them as read
        await Message.updateMany({ chat: chatId, read: false }, { read: true });

        createResponse(res, 200, 'Messages marked as read');
    } catch (error) {
        console.error('Error marking messages as read:', error);
        createResponse(res, 500, 'Failed to mark messages as read');
    }
};

// Get unread messages for a specific chat (User or employee can view unread messages)
exports.getUnreadMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Find unread messages in the specified chat
        const unreadMessages = await Message.find({ chat: chatId, read: false });

        createResponse(res, 200, 'Unread messages retrieved successfully', unreadMessages);
    } catch (error) {
        console.error('Error retrieving unread messages:', error);
        createResponse(res, 500, 'Failed to retrieve unread messages');
    }
};

// Close a chat (Employee or user can close the chat)
exports.closeChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Update the chat to set it as inactive
        const chat = await Chat.findByIdAndUpdate(chatId, { isActive: false }, { new: true });
        if (!chat) return createResponse(res, 404, 'Chat not found');

        createResponse(res, 200, 'Chat closed successfully', chat);
    } catch (error) {
        console.error('Error closing chat:', error);
        createResponse(res, 500, 'Failed to close chat');
    }
};

// Delete a chat (Admin can delete chat permanently)
exports.deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Delete the chat and its associated messages
        await Message.deleteMany({ chat: chatId });
        await Chat.findByIdAndDelete(chatId);

        createResponse(res, 200, 'Chat deleted successfully');
    } catch (error) {
        console.error('Error deleting chat:', error);
        createResponse(res, 500, 'Failed to delete chat');
    }
};
