const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
        select: false // Ensures password is not returned in queries by default
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'support', 'manager'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    permissions: {
        type: [String], // List of specific permissions, e.g., ['user_management', 'order_management']
        default: []
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
    lastLogin: {
        type: Date
    },
    accountCreated: {
        type: Date,
        default: Date.now
    },
    activityLogs: [
        {
            action: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            details: {
                type: String
            }
        }
    ],
    notifications: [
        {
            message: { type: String, required: true },
            seen: { type: Boolean, default: false },
            date: { type: Date, default: Date.now }
        }
    ]
});

// Static Methods

AdminSchema.statics.logActivity = async function(adminId, action, details = '') {
    const admin = await this.findById(adminId);
    if (admin) {
        admin.activityLogs.push({ action, details });
        await admin.save();
    }
};

// Instance Methods

AdminSchema.methods.activate = function() {
    this.status = 'active';
    return this.save();
};

AdminSchema.methods.deactivate = function() {
    this.status = 'inactive';
    return this.save();
};

AdminSchema.methods.suspend = function() {
    this.status = 'suspended';
    return this.save();
};

AdminSchema.methods.hasPermission = function(permission) {
    return this.permissions.includes(permission);
};

// Pre-save Hook for Password Hashing
AdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('Admin', AdminSchema);
