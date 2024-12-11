const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliveryPersonSchema = new Schema({
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
        select: false // Exclude password from queries by default
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
    assignedOrders: [
        {
            orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
            assignedAt: { type: Date, default: Date.now },
            deliveryStatus: {
                type: String,
                enum: ['pending', 'out for delivery', 'delivered'],
                default: 'pending'
            },
            deliveryStartTime: Date,
            deliveryEndTime: Date
        }
    ],
    performanceMetrics: {
        totalDeliveries: { type: Number, default: 0 },
        avgDeliveryTime: { type: Number, default: 0 }, // Average delivery time in minutes
        successRate: { type: Number, default: 0 } // Success rate percentage for deliveries
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

DeliveryPersonSchema.statics.logActivity = async function(deliveryPersonId, action, details = '') {
    const deliveryPerson = await this.findById(deliveryPersonId);
    if (deliveryPerson) {
        deliveryPerson.activityLogs.push({ action, details });
        await deliveryPerson.save();
    }
};

// Instance Methods

DeliveryPersonSchema.methods.updateAvailability = function(status) {
    this.availability = status;
    return this.save();
};

DeliveryPersonSchema.methods.updateStatus = function(status) {
    this.status = status;
    return this.save();
};

DeliveryPersonSchema.methods.assignOrder = function(orderId) {
    this.assignedOrders.push({ orderId, deliveryStatus: 'pending' });
    return this.save();
};

DeliveryPersonSchema.methods.startDelivery = function(orderId) {
    const order = this.assignedOrders.find(order => order.orderId.toString() === orderId.toString());
    if (order) {
        order.deliveryStatus = 'out for delivery';
        order.deliveryStartTime = Date.now();
        return this.save();
    }
    throw new Error('Order not found');
};

DeliveryPersonSchema.methods.completeDelivery = function(orderId) {
    const order = this.assignedOrders.find(order => order.orderId.toString() === orderId.toString());
    if (order) {
        order.deliveryStatus = 'delivered';
        order.deliveryEndTime = Date.now();
        
        // Update performance metrics
        const deliveryTime = (order.deliveryEndTime - order.deliveryStartTime) / (1000 * 60); // in minutes
        this.performanceMetrics.totalDeliveries += 1;
        this.performanceMetrics.avgDeliveryTime = 
            ((this.performanceMetrics.avgDeliveryTime * (this.performanceMetrics.totalDeliveries - 1)) + deliveryTime) / 
            this.performanceMetrics.totalDeliveries;
        this.performanceMetrics.successRate = (this.performanceMetrics.totalDeliveries / this.assignedOrders.length) * 100;
        
        return this.save();
    }
    throw new Error('Order not found');
};

// Pre-save Hook for Password Hashing
DeliveryPersonSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('DeliveryPerson', DeliveryPersonSchema);
