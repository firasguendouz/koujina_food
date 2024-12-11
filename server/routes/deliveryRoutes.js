// routes/deliveryRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const deliveryController = require('../controllers/deliveryController');

const router = express.Router();

// Middleware to restrict access to authenticated delivery personnel and admins
const deliveryAccess = [authMiddleware, roleMiddleware(['deliveryPerson'])];
const adminAccess = [authMiddleware, roleMiddleware(['admin'])];

// Delivery Personnel-Specific Routes

// Get all orders assigned to the delivery personnel
router.get('/assigned-orders', ...deliveryAccess, deliveryController.getAssignedOrders);

// Update the delivery status of an order (e.g., "Out for Delivery", "Delivered")
router.put('/update-status/:orderId', ...deliveryAccess, deliveryController.updateOrderStatus);

// View delivery metrics (e.g., average delivery time, delivery success rate)
router.get('/performance-metrics', ...deliveryAccess, deliveryController.getPerformanceMetrics);

// Admin routes for managing delivery personnel

// Assign an order to delivery personnel (Admin only)
router.post('/assign-order/:deliveryId/:orderId', ...adminAccess, deliveryController.assignOrderToDelivery);

// Get a list of all delivery personnel (Admin only)
router.get('/list', ...adminAccess, deliveryController.getAllDeliveryPersonnel);

// Update delivery personnel details (Admin only)
router.put('/update/:deliveryId', ...adminAccess, deliveryController.updateDeliveryDetails);

// Remove delivery personnel from the system (Admin only)
router.delete('/delete/:deliveryId', ...adminAccess, deliveryController.deleteDeliveryPerson);

// View performance metrics of a specific delivery personnel (Admin only)
router.get('/performance/:deliveryId', ...adminAccess, deliveryController.getDeliveryPerformance);

module.exports = router;
