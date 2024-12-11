const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false // Ensures password is not returned by default
    },
    contactNumber: {
        type: String,
        trim: true
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true }
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'employee'],
        default: 'customer'
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'suspended'],
        default: 'pending'
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    orderHistory: [
        {
            orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
            date: { type: Date, default: Date.now },
            totalAmount: { type: Number }
        }
    ],
    notifications: [
        {
            message: { type: String, required: true },
            seen: { type: Boolean, default: false },
            date: { type: Date, default: Date.now }
        }
    ],
    lastLogin: {
        type: Date
    },
    accountCreated: {
        type: Date,
        default: Date.now
    }
});

// Static Methods

UserSchema.statics.updateRole = async function(userId, newRole) {
    const user = await this.findById(userId);
    if (user) {
        user.role = newRole;
        await user.save();
    }
};

// Instance Methods

UserSchema.methods.incrementLoyaltyPoints = function(points) {
    this.loyaltyPoints += points;
    return this.save();
};

UserSchema.methods.redeemLoyaltyPoints = function(points) {
    if (this.loyaltyPoints >= points) {
        this.loyaltyPoints -= points;
        return this.save();
    }
    throw new Error('Insufficient loyalty points');
};

UserSchema.methods.markNotificationAsSeen = function(notificationId) {
    const notification = this.notifications.id(notificationId);
    if (notification) {
        notification.seen = true;
        return this.save();
    }
    throw new Error('Notification not found');
};

// Pre-save Hook for Password Hashing
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
