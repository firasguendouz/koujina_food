const Chef = require('../models/Chef');
const Plate = require('../models/Plate');
const Order = require('../models/Order');
const Supplement = require('../models/Supplement');
const User = require('../models/User');

// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};

// Plate (Dish) Management by Chef

// Add a new plate (dish) to chef's list, including supplements (ingredients)
exports.addPlate = async (req, res) => {
    try {
        const { name, description, supplements } = req.body;
        const chefId = req.user._id;

        // Create a new plate
        const newPlate = await Plate.create({ name, description, chef: chefId, supplements });

        createResponse(res, 201, 'Plate added successfully', newPlate);
    } catch (error) {
        console.error('Error adding plate:', error);
        createResponse(res, 500, 'Failed to add plate');
    }
};

// Update a plate's details (e.g., ingredients, description) in chef's list
exports.updatePlateDetails = async (req, res) => {
    try {
        const { plateId } = req.params;
        const { name, description, supplements } = req.body;

        const updatedPlate = await Plate.findByIdAndUpdate(plateId, { name, description, supplements }, { new: true });
        if (!updatedPlate) return createResponse(res, 404, 'Plate not found');
        
        createResponse(res, 200, 'Plate details updated successfully', updatedPlate);
    } catch (error) {
        console.error('Error updating plate details:', error);
        createResponse(res, 500, 'Failed to update plate details');
    }
};

// View all plates created by the chef
exports.getChefPlates = async (req, res) => {
    try {
        const chefId = req.user._id;
        const plates = await Plate.find({ chef: chefId });

        createResponse(res, 200, 'Chef plates retrieved successfully', plates);
    } catch (error) {
        console.error('Error retrieving chef plates:', error);
        createResponse(res, 500, 'Failed to retrieve chef plates');
    }
};

// Order Management for Chef

// Get orders assigned to the chef
exports.getAssignedOrders = async (req, res) => {
    try {
        const chefId = req.user._id;
        const orders = await Order.find({ chef: chefId }).populate('customer', 'name address');

        createResponse(res, 200, 'Assigned orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving assigned orders:', error);
        createResponse(res, 500, 'Failed to retrieve assigned orders');
    }
};

// Update order status to indicate it's ready for delivery
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(orderId, { status: 'ready for delivery' }, { new: true });

        if (!order) return createResponse(res, 404, 'Order not found');
        
        createResponse(res, 200, 'Order status updated successfully', order);
    } catch (error) {
        console.error('Error updating order status:', error);
        createResponse(res, 500, 'Failed to update order status');
    }
};

// Admin Routes for Managing Chefs and Their Plates

// View all chefs and their specialties (Admin only)
exports.getAllChefs = async (req, res) => {
    try {
        const chefs = await Chef.find().populate('specialties');

        createResponse(res, 200, 'All chefs retrieved successfully', chefs);
    } catch (error) {
        console.error('Error retrieving chefs:', error);
        createResponse(res, 500, 'Failed to retrieve chefs');
    }
};

// Assign an order to a specific chef (Admin only)
exports.assignOrderToChef = async (req, res) => {
    try {
        const { chefId, orderId } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { chef: chefId, status: 'assigned' }, { new: true });

        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order assigned to chef successfully', updatedOrder);
    } catch (error) {
        console.error('Error assigning order to chef:', error);
        createResponse(res, 500, 'Failed to assign order to chef');
    }
};

// View a specific chef's plates (Admin only)
exports.getChefPlatesByAdmin = async (req, res) => {
    try {
        const { chefId } = req.params;
        const plates = await Plate.find({ chef: chefId });

        createResponse(res, 200, 'Chef plates retrieved successfully', plates);
    } catch (error) {
        console.error('Error retrieving chef plates by admin:', error);
        createResponse(res, 500, 'Failed to retrieve chef plates by admin');
    }
};

// Update chef profile details (Admin only)
exports.updateChefDetails = async (req, res) => {
    try {
        const { chefId } = req.params;
        const updatedChef = await Chef.findByIdAndUpdate(chefId, req.body, { new: true });

        if (!updatedChef) return createResponse(res, 404, 'Chef not found');

        createResponse(res, 200, 'Chef profile updated successfully', updatedChef);
    } catch (error) {
        console.error('Error updating chef details:', error);
        createResponse(res, 500, 'Failed to update chef details');
    }
};

// Remove a chef from the system (Admin only)
exports.deleteChef = async (req, res) => {
    try {
        const { chefId } = req.params;

        await Chef.findByIdAndDelete(chefId);
        await Plate.deleteMany({ chef: chefId }); // Optionally, delete all plates associated with the chef

        createResponse(res, 200, 'Chef deleted successfully');
    } catch (error) {
        console.error('Error deleting chef:', error);
        createResponse(res, 500, 'Failed to delete chef');
    }
};
