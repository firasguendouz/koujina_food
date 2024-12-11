const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    history: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            pointsAdded: {
                type: Number,
                default: 0
            },
            pointsRedeemed: {
                type: Number,
                default: 0
            },
            description: String
        }
    ]
});

module.exports = mongoose.model('Loyalty', loyaltySchema);
