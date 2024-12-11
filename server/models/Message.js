const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Can refer to User, Admin, Employee, etc.
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Can refer to User, Admin, Employee, etc.
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Message', // Refers to another message for threaded replies
        default: null
    },
    attachments: [
        {
            fileUrl: { type: String },
            fileType: { type: String }
        }
    ]
});

// Static Methods

MessageSchema.statics.markAsRead = async function(messageId) {
    const message = await this.findById(messageId);
    if (message) {
        message.readStatus = true;
        await message.save();
    }
};

// Instance Methods

MessageSchema.methods.reply = function(content, sender, receiver) {
    return this.model('Message').create({
        sender,
        receiver,
        content,
        replyTo: this._id
    });
};

module.exports = mongoose.model('Message', MessageSchema);
