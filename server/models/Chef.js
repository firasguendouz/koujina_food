const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChefSchema = new Schema({
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
    contactNumber: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    availability: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    specialtyPlates: [
        {
            plateId: { type: Schema.Types.ObjectId, ref: 'Plate', required: true },
            name: { type: String, required: true },
            description: { type: String }
        }
    ],
    assignedOrders: [
        {
            orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
            assignedAt: { type: Date, default: Date.now },
            status: { type: String, enum: ['in preparation', 'ready'], default: 'in preparation' }
        }
    ],
    performanceMetrics: {
        avgPrepTime: { type: Number, default: 0 }, // Average time in minutes for preparing orders
        completedOrders: { type: Number, default: 0 },
        satisfactionRating: { type: Number, default: 0 } // Rating out of 5
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
    lastLogin: {
        type: Date
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

// Static Methods

ChefSchema.statics.logActivity = async function(chefId, action, details = '') {
    const chef = await this.findById(chefId);
    if (chef) {
        chef.activityLogs.push({ action, details });
        await chef.save();
    }
};

// Instance Methods

ChefSchema.methods.updateAvailability = function(status) {
    this.availability = status;
    return this.save();
};

ChefSchema.methods.updateStatus = function(status) {
    this.status = status;
    return this.save();
};

ChefSchema.methods.assignOrder = function(orderId) {
    this.assignedOrders.push({ orderId, status: 'in preparation' });
    return this.save();
};

ChefSchema.methods.completeOrder = function(orderId, prepTime) {
    const order = this.assignedOrders.find(order => order.orderId.toString() === orderId.toString());
    if (order) {
        order.status = 'ready';
        this.performanceMetrics.completedOrders += 1;
        this.performanceMetrics.avgPrepTime = 
            (this.performanceMetrics.avgPrepTime * (this.performanceMetrics.completedOrders - 1) + prepTime) / 
            this.performanceMetrics.completedOrders;
        return this.save();
    }
    throw new Error('Order not found');
};

// Pre-save Hook for Password Hashing
ChefSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('Chef', ChefSchema);
