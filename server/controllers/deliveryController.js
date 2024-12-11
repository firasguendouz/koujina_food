const DeliveryPerson = require('../models/DeliveryPerson');
const Order = require('../models/Order');
const User = require('../models/User');

// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};

// Delivery Personnel-Specific Routes

// Get all orders assigned to the delivery personnel
exports.getAssignedOrders = async (req, res) => {
    try {
        const deliveryPersonId = req.user._id;
        const orders = await Order.find({ deliveryPerson: deliveryPersonId, status: { $in: ['out for delivery', 'assigned'] } }).populate('customer', 'name address');

        createResponse(res, 200, 'Assigned orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving assigned orders:', error);
        createResponse(res, 500, 'Failed to retrieve assigned orders');
    }
};

// Update the delivery status of an order (e.g., "Out for Delivery", "Delivered")
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['out for delivery', 'delivered'];
        if (!validStatuses.includes(status)) {
            return createResponse(res, 400, 'Invalid status');
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        createResponse(res, 500, 'Failed to update order status');
    }
};

// View delivery metrics (e.g., average delivery time, delivery success rate)
exports.getPerformanceMetrics = async (req, res) => {
    try {
        const deliveryPersonId = req.user._id;
        const completedDeliveries = await Order.find({ deliveryPerson: deliveryPersonId, status: 'delivered' });

        const totalDeliveries = completedDeliveries.length;
        const onTimeDeliveries = completedDeliveries.filter(order => order.deliveredAt <= order.estimatedDeliveryTime).length;

        const averageDeliveryTime = completedDeliveries.reduce((sum, order) => sum + (order.deliveredAt - order.outForDeliveryAt), 0) / totalDeliveries || 0;
        const successRate = (onTimeDeliveries / totalDeliveries) * 100 || 0;

        createResponse(res, 200, 'Delivery performance metrics retrieved successfully', { averageDeliveryTime, successRate });
    } catch (error) {
        console.error('Error retrieving delivery performance metrics:', error);
        createResponse(res, 500, 'Failed to retrieve delivery performance metrics');
    }
};

// Admin Routes for Managing Delivery Personnel

// Assign an order to delivery personnel (Admin only)
exports.assignOrderToDelivery = async (req, res) => {
    try {
        const { deliveryId, orderId } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { deliveryPerson: deliveryId, status: 'assigned' }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order assigned to delivery person successfully', updatedOrder);
    } catch (error) {
        console.error('Error assigning order to delivery person:', error);
        createResponse(res, 500, 'Failed to assign order to delivery person');
    }
};

// Get a list of all delivery personnel (Admin only)
exports.getAllDeliveryPersonnel = async (req, res) => {
    try {
        const deliveryPersonnel = await DeliveryPerson.find();
        createResponse(res, 200, 'Delivery personnel retrieved successfully', deliveryPersonnel);
    } catch (error) {
        console.error('Error retrieving delivery personnel:', error);
        createResponse(res, 500, 'Failed to retrieve delivery personnel');
    }
};

// Update delivery personnel details (Admin only)
exports.updateDeliveryDetails = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(deliveryId, req.body, { new: true });

        if (!updatedDeliveryPerson) return createResponse(res, 404, 'Delivery person not found');

        createResponse(res, 200, 'Delivery personnel details updated successfully', updatedDeliveryPerson);
    } catch (error) {
        console.error('Error updating delivery personnel details:', error);
        createResponse(res, 500, 'Failed to update delivery personnel details');
    }
};

// Remove delivery personnel from the system (Admin only)
exports.deleteDeliveryPerson = async (req, res) => {
    try {
        const { deliveryId } = req.params;

        await DeliveryPerson.findByIdAndDelete(deliveryId);
        createResponse(res, 200, 'Delivery personnel deleted successfully');
    } catch (error) {
        console.error('Error deleting delivery personnel:', error);
        createResponse(res, 500, 'Failed to delete delivery personnel');
    }
};

// View performance metrics of a specific delivery personnel (Admin only)
exports.getDeliveryPerformance = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const completedDeliveries = await Order.find({ deliveryPerson: deliveryId, status: 'delivered' });

        const totalDeliveries = completedDeliveries.length;
        const onTimeDeliveries = completedDeliveries.filter(order => order.deliveredAt <= order.estimatedDeliveryTime).length;

        const averageDeliveryTime = completedDeliveries.reduce((sum, order) => sum + (order.deliveredAt - order.outForDeliveryAt), 0) / totalDeliveries || 0;
        const successRate = (onTimeDeliveries / totalDeliveries) * 100 || 0;

        createResponse(res, 200, 'Delivery performance metrics for specific personnel retrieved successfully', { totalDeliveries, averageDeliveryTime, successRate });
    } catch (error) {
        console.error('Error retrieving delivery performance metrics:', error);
        createResponse(res, 500, 'Failed to retrieve delivery performance metrics');
    }
};
