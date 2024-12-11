const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupportCaseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open',
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SupportCase', SupportCaseSchema);
