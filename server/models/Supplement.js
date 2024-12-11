const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplementSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    supplier: {
        name: { type: String, required: true, trim: true },
        contactNumber: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true }
    },
    unitCost: {
        type: Number,
        required: true
    },
    unitType: {
        type: String,
        enum: ['grams', 'units', 'ml', 'kg', 'liters'],
        required: true
    },
    quantityAvailable: {
        type: Number,
        required: true
    },
    minimumStock: {
        type: Number,
        default: 10 // Threshold for low stock alerts
    },
    expirationDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['in stock', 'out of stock', 'expired'],
        default: 'in stock'
    },
    usageCount: {
        type: Number,
        default: 0 // Tracks how often this supplement is used in plates
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Static Methods

SupplementSchema.statics.checkStock = async function(supplementId) {
    const supplement = await this.findById(supplementId);
    if (supplement) {
        if (supplement.quantityAvailable <= supplement.minimumStock) {
            supplement.status = 'out of stock';
            await supplement.save();
        }
    }
};

// Instance Methods

SupplementSchema.methods.reduceStock = function(amountUsed) {
    if (this.quantityAvailable >= amountUsed) {
        this.quantityAvailable -= amountUsed;
        if (this.quantityAvailable <= this.minimumStock) {
            this.status = 'out of stock';
        }
        this.usageCount += 1;
        return this.save();
    }
    throw new Error('Insufficient stock');
};

SupplementSchema.methods.checkExpiration = function() {
    if (this.expirationDate && this.expirationDate < Date.now()) {
        this.status = 'expired';
        return this.save();
    }
    return Promise.resolve();
};

// Pre-save Hook to Update Timestamps and Check Expiration
SupplementSchema.pre('save', async function(next) {
    this.updatedAt = Date.now();
    await this.checkExpiration();
    next();
});

module.exports = mongoose.model('Supplement', SupplementSchema);
