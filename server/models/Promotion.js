const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    photo: { type: String, required: true },
    validUntil: { type: Date }, // Optional field
    available: { type: Boolean, default: true }, // New field to indicate availability
});

module.exports = mongoose.model('Promotion', promotionSchema);
