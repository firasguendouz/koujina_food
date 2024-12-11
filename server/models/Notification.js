const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Can refer to User, Admin, Employee, etc.
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Can refer to User, Admin, Employee, etc.
        default: null
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success', 'alert', 'update'],
        default: 'info'
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String, // URL to provide context or additional information, if necessary
        default: null
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date, // Optional expiration date for the notification
        default: null
    }
});

// Static Methods

NotificationSchema.statics.markAsRead = async function(notificationId) {
    const notification = await this.findById(notificationId);
    if (notification) {
        notification.readStatus = true;
        await notification.save();
    }
};

// Instance Methods

NotificationSchema.methods.markAsUnread = function() {
    this.readStatus = false;
    return this.save();
};

NotificationSchema.methods.isExpired = function() {
    return this.expiresAt && this.expiresAt < Date.now();
};

// Pre-save Hook to Delete Expired Notifications
NotificationSchema.pre('save', async function (next) {
    if (this.isExpired()) {
        await this.remove();
    }
    next();
});

module.exports = mongoose.model('Notification', NotificationSchema);
