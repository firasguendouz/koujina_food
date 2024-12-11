// routes/orderRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Middleware to restrict access based on role
const userAccess = [authMiddleware, roleMiddleware(['customer'])];
const chefAccess = [authMiddleware, roleMiddleware(['chef'])];
const deliveryAccess = [authMiddleware, roleMiddleware(['deliveryPerson'])];
const adminAccess = [authMiddleware, roleMiddleware(['admin'])];

// User-Specific Routes
router.post('/submit-feedback', authMiddleware, orderController.submitOrderFeedback);

// Create a new order (requires customer access)
router.post('/create', ...userAccess, orderController.createOrder);

// Create a Stripe payment intent (requires customer access)
router.post('/create-payment-intent', ...userAccess, orderController.createStripePaymentIntent);

// Process a refund request (requires customer access)
router.post('/:orderId/refund', ...userAccess, orderController.processRefund);

// View user's order history
router.get('/history', ...userAccess, orderController.getUserOrderHistory);

// Track order status
router.get('/status/:orderId', ...userAccess, orderController.trackOrderStatus);



// Chef-Specific Routes

// View orders assigned to the chef
router.get('/chef-assigned-orders', ...chefAccess, orderController.getOrdersAssignedToChef);

// Update the preparation status of an order (e.g., "In Preparation", "Ready for Delivery")
router.put('/update-prep-status/:orderId', ...chefAccess, orderController.updatePreparationStatus);

// View detailed metrics on order prep times for chef's assigned orders
router.get('/prep-metrics', ...chefAccess, orderController.getPreparationMetrics);

// Delivery Personnel Routes

// View orders assigned to the delivery person
router.get('/delivery-assigned-orders', ...deliveryAccess, orderController.getOrdersAssignedToDelivery);

// Update delivery status of an order (e.g., "Out for Delivery", "Delivered")
router.put('/update-delivery-status/:orderId', ...deliveryAccess, orderController.updateDeliveryStatus);

// Real-time tracking of delivery progress
router.put('/track-delivery/:orderId', ...deliveryAccess, orderController.trackDeliveryProgress);

// View delivery performance metrics
router.get('/delivery-metrics', ...deliveryAccess, orderController.getDeliveryPerformanceMetrics);

// Admin Routes for Managing Orders

// View all orders with optional filters (e.g., by status, priority, date range)
router.get('/all', ...adminAccess, orderController.getAllOrders);

// Assign an order to a chef (Admin only)
router.post('/assign-to-chef/:orderId/:chefId', ...adminAccess, orderController.assignOrderToChef);

// Assign an order to a delivery person (Admin only)
router.post('/assign-to-delivery/:orderId/:deliveryId', ...adminAccess, orderController.assignOrderToDelivery);

// Update order priority (e.g., high, medium, low) to prioritize certain orders
router.put('/update/:orderId', ...adminAccess, orderController.updateOrder);

// Cancel an order and handle refund if applicable (Admin only)
router.delete('/cancel/:orderId', ...adminAccess, orderController.cancelOrder);

// Generate advanced order analytics (e.g., most ordered items, peak order times, top locations)
router.get('/analytics', ...adminAccess, orderController.getOrderAnalytics);

// Generate monthly order summary for revenue and growth tracking
router.get('/monthly-summary', ...adminAccess, orderController.getMonthlyOrderSummary);

// Manage refund requests for orders
router.get('/refund-requests', ...adminAccess, orderController.getRefundRequests);
router.put('/process-refund/:orderId', ...adminAccess, orderController.processRefund);

module.exports = router;
