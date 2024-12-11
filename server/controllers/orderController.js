const Order = require('../models/Order');
const Chef = require('../models/Chef');
const DeliveryPerson = require('../models/DeliveryPerson');
const RefundRequest = require('../models/RefundRequest'); // Assuming a RefundRequest model exists
const Plate = require('../models/Plate');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Feedback = require('../models/Feedback'); // Import the Feedback model
const User = require('../models/User'); // Import the User model if needed
const { sendNotification } = require('./telegramBot');

// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};

// User-Specific Routes

// Place a new order



// Create Payment Intent for Stripe
exports.createStripePaymentIntent = async (req, res) => {
    const { totalAmount } = req.body; // Amount should be in dollars or equivalent currency
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents for Stripe
            currency: 'usd',
            payment_method_types: ['card'],
        });
        createResponse(res, 200, 'Payment intent created successfully', { clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating Stripe payment intent:', error);
        createResponse(res, 500, 'Failed to initiate payment');
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, specialInstructions, paymentMethod, paymentIntentId } = req.body;
        const userId = req.user.userId;
        const userName = req.user.name;
        const userEmail = req.user.email;

        // Log received data for verification
        console.log('Received request to create order with the following details:');
        console.log(`User ID: ${userId}`);
        console.log(`User Name: ${userName}`);
        console.log(`User Email: ${userEmail}`);
        console.log('Order Items:', items);
        console.log('Total Amount:', totalAmount);
        console.log('Delivery Address:', deliveryAddress);
        console.log('Special Instructions:', specialInstructions);
        console.log('Payment Method:', paymentMethod);
        console.log('Payment Intent ID (if Stripe):', paymentIntentId);

        // Check Stripe payment status if the method is Stripe
        if (paymentMethod === 'stripe') {
            console.log('Verifying Stripe payment status...');
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            console.log('Stripe Payment Intent Status:', paymentIntent.status);

            if (paymentIntent.status !== 'succeeded') {
                console.log('Payment not confirmed. Order creation aborted.');
                return createResponse(res, 400, 'Payment not confirmed. Order cannot be created.');
            }
        }

        // Create a new order
        console.log('Creating new order in the database...');
        const newOrder = await Order.create({
            customer: userId,
            customerName: userName,
            customerEmail: userEmail,
            items,
            totalAmount,
            deliveryAddress: {
                street: deliveryAddress.street,
                city: deliveryAddress.city,
                state: deliveryAddress.state,
                postalCode: deliveryAddress.postalCode,
                country: deliveryAddress.country,
                recipientName: deliveryAddress.recipientName,
                recipientPhone: deliveryAddress.recipientPhone
            },
            specialInstructions,
            paymentMethod,
            paymentStatus: paymentMethod === 'cash' ? 'unpaid' : 'paid', // Paid if Stripe, Unpaid if Cash
            status: 'pending'
        });
        console.log('New order created:', newOrder);

        // Add order to user's orderHistory
        console.log('Updating user order history...');
        const user = await User.findById(userId);
        user.orderHistory.push({
            orderId: newOrder._id,
            date: new Date(),
            totalAmount: newOrder.totalAmount
        });
        await user.save();
        console.log('User order history updated successfully.');
  // Notify admin
  sendNotification(`📦 New Order Created:\nOrder ID: ${newOrder._id}\nAmount: ${totalAmount}\nStatus: Pending`);

        createResponse(res, 201, 'Order created successfully', newOrder);
        console.log('Order creation process completed and response sent to client.');
    } catch (error) {
        console.error('Error creating order:', error);
        createResponse(res, 500, 'Failed to create order');
    }
};




exports.processRefund = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return createResponse(res, 404, 'Order not found');

        if (order.paymentMethod === 'stripe' && order.paymentStatus === 'paid') {
            const refund = await stripe.refunds.create({ payment_intent: order.paymentIntentId });
            if (refund.status !== 'succeeded') {
                return createResponse(res, 500, 'Failed to process refund through Stripe');
            }
        }

        const refundRequest = await RefundRequest.findOneAndUpdate(
            { order: orderId }, 
            { status: 'processed' }, 
            { new: true }
        );
        createResponse(res, 200, 'Refund processed successfully', refundRequest);
    } catch (error) {
        console.error('Error processing refund:', error);
        createResponse(res, 500, 'Failed to process refund');
    }
};








// View authenticated user's order history
// View authenticated user's order history
// View authenticated user's order history
exports.getUserOrderHistory = async (req, res) => {
    try {
        console.log('req.user:', req.user);

        const userId = req.user?.userId;
        if (!userId) {
            console.log('User ID is missing in req.user');
            return createResponse(res, 400, 'User ID is missing');
        }

        console.log(`Received request to fetch order history for user ID: ${userId}`);

        const user = await User.findById(userId).select('orderHistory');
        console.log(`Fetched user document: ${JSON.stringify(user)}`);

        if (!user) {
            console.log('User not found');
            return createResponse(res, 404, 'User not found');
        }

        if (user.orderHistory.length === 0) {
            console.log('No orders found in user\'s order history');
            return createResponse(res, 200, 'No orders found for the authenticated user');
        }

        const orderIds = user.orderHistory.map(order => order.orderId);
        console.log(`Order IDs in user's history: ${orderIds}`);

        const orders = await Order.find({ _id: { $in: orderIds } })
            .populate('items.plateId')
            .select('deliveryAddress timestamps.orderedAt customerName customerEmail items totalAmount status paymentStatus paymentMethod');
        console.log(`Fetched orders: ${JSON.stringify(orders)}`);

        if (!orders || orders.length === 0) {
            console.log('No orders found in the database for provided order IDs');
            return createResponse(res, 200, 'No orders found for the authenticated user');
        }

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            deliveryAddress: {
                street: order.deliveryAddress.street,
                city: order.deliveryAddress.city,
                state: order.deliveryAddress.state,
                postalCode: order.deliveryAddress.postalCode,
                country: order.deliveryAddress.country,
                recipientName: order.deliveryAddress.recipientName,
                recipientPhone: order.deliveryAddress.recipientPhone
            },
            timestamps: { orderedAt: order.timestamps.orderedAt },
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            items: order.items.map(item => ({
                _id: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: order.totalAmount,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod
        }));
        

        createResponse(res, 200, 'Order history retrieved successfully', formattedOrders);
        console.log('Order history successfully retrieved and sent to client');
    } catch (error) {
        console.error('Error retrieving order history:', error);
        createResponse(res, 500, 'Failed to retrieve order history');
    }
};






// Track order status
exports.trackOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) return createResponse(res, 404, 'Order not found');
        
        createResponse(res, 200, 'Order status retrieved successfully', { status: order.status });
    } catch (error) {
        console.error('Error tracking order status:', error);
        createResponse(res, 500, 'Failed to track order status');
    }
};

// Request a refund for an order
exports.requestRefund = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) return createResponse(res, 404, 'Order not found');

        const refundRequest = await RefundRequest.create({ order: orderId, status: 'pending' });

        createResponse(res, 201, 'Refund request submitted successfully', refundRequest);
    } catch (error) {
        console.error('Error requesting refund:', error);
        createResponse(res, 500, 'Failed to request refund');
    }
};

// Chef-Specific Routes

// View orders assigned to the chef
exports.getOrdersAssignedToChef = async (req, res) => {
    try {
        const chefId = req.user._id;
        const orders = await Order.find({ chef: chefId });

        createResponse(res, 200, 'Assigned orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving assigned orders:', error);
        createResponse(res, 500, 'Failed to retrieve assigned orders');
    }
};

// Update the preparation status of an order
exports.updatePreparationStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order preparation status updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating preparation status:', error);
        createResponse(res, 500, 'Failed to update preparation status');
    }
};

// View detailed metrics on order prep times for chef's assigned orders
exports.getPreparationMetrics = async (req, res) => {
    try {
        const chefId = req.user._id;

        const metrics = await Order.aggregate([
            { $match: { chef: chefId } },
            { $group: { _id: '$status', avgPrepTime: { $avg: { $subtract: ['$readyAt', '$createdAt'] } } } }
        ]);

        createResponse(res, 200, 'Preparation metrics retrieved successfully', metrics);
    } catch (error) {
        console.error('Error retrieving preparation metrics:', error);
        createResponse(res, 500, 'Failed to retrieve preparation metrics');
    }
};

// Delivery Personnel Routes

// View orders assigned to the delivery person
exports.getOrdersAssignedToDelivery = async (req, res) => {
    try {
        const deliveryPersonId = req.user._id;
        const orders = await Order.find({ deliveryPerson: deliveryPersonId });

        createResponse(res, 200, 'Assigned orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving assigned orders:', error);
        createResponse(res, 500, 'Failed to retrieve assigned orders');
    }
};

// Update delivery status of an order
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['out for delivery', 'delivered'];
        if (!validStatuses.includes(status)) return createResponse(res, 400, 'Invalid status');

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Delivery status updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating delivery status:', error);
        createResponse(res, 500, 'Failed to update delivery status');
    }
};
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        // Notify admin
        sendNotification(`🚚 Order Updated:\nOrder ID: ${orderId}\nNew Status: ${status}`);

        createResponse(res, 200, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        createResponse(res, 500, 'Failed to update order status');
    }
};
// Real-time tracking of delivery progress
exports.trackDeliveryProgress = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { location } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { location }, { new: true });
        if (!order) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Delivery progress updated successfully', order);
    } catch (error) {
        console.error('Error tracking delivery progress:', error);
        createResponse(res, 500, 'Failed to track delivery progress');
    }
};


// View delivery performance metrics
exports.getDeliveryPerformanceMetrics = async (req, res) => {
    try {
        const deliveryPersonId = req.user._id;

        const metrics = await Order.aggregate([
            { $match: { deliveryPerson: deliveryPersonId, status: 'delivered' } },
            { $group: { _id: null, avgDeliveryTime: { $avg: { $subtract: ['$deliveredAt', '$outForDeliveryAt'] } } } }
        ]);

        createResponse(res, 200, 'Delivery performance metrics retrieved successfully', metrics[0]);
    } catch (error) {
        console.error('Error retrieving delivery performance metrics:', error);
        createResponse(res, 500, 'Failed to retrieve delivery performance metrics');
    }
};

// Admin Routes for Managing Orders

// View all orders with optional filters (e.g., by status, priority, date range)
exports.getAllOrders = async (req, res) => {
    try {
        const { status, priority, startDate, endDate } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (startDate && endDate) filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };

        const orders = await Order.find(filter);
        createResponse(res, 200, 'Orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving all orders:', error);
        createResponse(res, 500, 'Failed to retrieve all orders');
    }
};

// Assign an order to a chef
exports.assignOrderToChef = async (req, res) => {
    try {
        const { orderId, chefId } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { chef: chefId, status: 'assigned to chef' }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order assigned to chef successfully', updatedOrder);
    } catch (error) {
        console.error('Error assigning order to chef:', error);
        createResponse(res, 500, 'Failed to assign order to chef');
    }
};

// Assign an order to a delivery person
exports.assignOrderToDelivery = async (req, res) => {
    try {
        const { orderId, deliveryId } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { deliveryPerson: deliveryId, status: 'assigned to delivery' }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order assigned to delivery person successfully', updatedOrder);
    } catch (error) {
        console.error('Error assigning order to delivery person:', error);
        createResponse(res, 500, 'Failed to assign order to delivery person');
    }
};

// Update any details in an order
// Update any details in an order
// Backend function to update order details
// OrderController.js

exports.updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const updateFields = req.body;  // should be a flat object without nesting

        // Debug: Log the received fields
        console.log("Received update fields:", updateFields);

        // Update the order with only the fields present in the request
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order details updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating order details:', error);
        createResponse(res, 500, 'Failed to update order details');
    }
};

  



// Cancel an order and handle refund if applicable
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByIdAndDelete(orderId);
        if (!order) return createResponse(res, 404, 'Order not found');

        if (order.paymentStatus === 'paid') {
            // Handle refund logic here if applicable
            await RefundRequest.create({ order: orderId, status: 'initiated' });
        }

        createResponse(res, 200, 'Order canceled successfully');
    } catch (error) {
        console.error('Error canceling order:', error);
        createResponse(res, 500, 'Failed to cancel order');
    }
};

// Generate advanced order analytics
exports.getOrderAnalytics = async (req, res) => {
    try {
        const analytics = await Order.aggregate([
            { $group: { _id: '$items.plateId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        createResponse(res, 200, 'Order analytics retrieved successfully', analytics);
    } catch (error) {
        console.error('Error retrieving order analytics:', error);
        createResponse(res, 500, 'Failed to retrieve order analytics');
    }
};

// Generate monthly order summary
exports.getMonthlyOrderSummary = async (req, res) => {
    try {
        const summary = await Order.aggregate([
            { $group: { _id: { $month: "$createdAt" }, totalRevenue: { $sum: "$totalAmount" }, orderCount: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        createResponse(res, 200, 'Monthly order summary retrieved successfully', summary);
    } catch (error) {
        console.error('Error retrieving monthly order summary:', error);
        createResponse(res, 500, 'Failed to retrieve monthly order summary');
    }
};

// Manage refund requests
exports.getRefundRequests = async (req, res) => {
    try {
        const refundRequests = await RefundRequest.find({ status: 'pending' });

        createResponse(res, 200, 'Refund requests retrieved successfully', refundRequests);
    } catch (error) {
        console.error('Error retrieving refund requests:', error);
        createResponse(res, 500, 'Failed to retrieve refund requests');
    }
};


exports.submitOrderFeedback = async (req, res) => {
    try {
        const { orderId, feedback } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        // Log feedback payload and order items for debugging
        console.log("Order Items:", order.items);
        console.log("Feedback Payload:", feedback);

        const feedbackPromises = order.items.map(async (item) => {
            const itemFeedback = feedback[item.plateId.toString()];
            if (itemFeedback) {
                const feedbackEntry = await Feedback.create({
                    orderId,
                    plateId: item.plateId,
                    deliveryTime: itemFeedback.deliveryTime,
                    taste: itemFeedback.taste,
                    presentation: itemFeedback.presentation,
                    notes: itemFeedback.notes || ""
                });
                item.feedback = feedbackEntry._id;
            }
        });

        await Promise.all(feedbackPromises);
        await order.save();

        res.status(200).json({
            status: 'success',
            message: 'Feedback submitted successfully',
            data: order
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ status: 'error', message: 'Failed to submit feedback' });
    }
};



