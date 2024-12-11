const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    plan: {
        type: String,
        enum: ['basic', 'premium', 'pro'], // Add other plans as needed
        required: true
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
