// models/Chat.js
const mongoose = require('mongoose');

// Define the schema for a chat message
const chatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        sentAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a method to add a message to the chat
chatSchema.methods.addMessage = function(senderId, messageContent) {
    this.messages.push({
        sender: senderId,
        content: messageContent,
        sentAt: new Date()
    });
    this.updatedAt = new Date();
    return this.save();
};

// Export the Chat model
module.exports = mongoose.model('Chat', chatSchema);
