const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        recipientName: { type: String, required: true },
        recipientPhone: { type: String, required: true }
    },
    customerEmail: {
        type: String,
        required: true
    },
    items: [
        {
            plateId: { type: Schema.Types.ObjectId, ref: 'Plate', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            feedback: { type: Schema.Types.ObjectId, ref: 'Feedback', default: null } // Add feedback reference
 

        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'out for delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'refunded'],
        default: 'unpaid'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        default: 'cash'
    },
    chef: {
        type: Schema.Types.ObjectId,
        ref: 'Chef',
        default: null
    },
    deliveryPerson: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryPerson',
        default: null
    },
    timestamps: {
        orderedAt: { type: Date, default: Date.now },
        preparedAt: { type: Date },
        outForDeliveryAt: { type: Date },
        deliveredAt: { type: Date }
    },
    specialInstructions: {
        type: String,
        trim: true,
        default: ''
    },
    cancellationReason: {
        type: String,
        default: null
    },
    cancellationReason: {
        type: String,
        default: null
    },
    
});

module.exports = mongoose.model('Order', OrderSchema);
