// routes/adminRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Middleware to restrict access to admins
const adminAccess = [authMiddleware, roleMiddleware(['admin'])];

// Admin Dashboard
router.get('/dashboard', ...adminAccess, adminController.getDashboard);
// Admin Registration Route
router.post('/koujinaAdminCreate/register', adminController.registerAdmin);

// Admin Login Route
router.post('/koujinaAdminProfile/login', adminController.loginAdmin);
// Admin User Management
router.post('/user/create', ...adminAccess, adminController.createUser);
router.delete('/user/delete/:userId', ...adminAccess, adminController.deleteUser);
router.put('/user/downgrade/:userId', ...adminAccess, adminController.downgradeUserToEmployee);
router.put('/user/promote/:userId', ...adminAccess, adminController.promoteUserToAdmin);
router.put('/user/activate/:userId', ...adminAccess, adminController.activateUser);
router.put('/user/deactivate/:userId', ...adminAccess, adminController.deactivateUser);
router.get('/user/list', ...adminAccess, adminController.listUsers); // List all users
router.put('/user/update/:userId', ...adminAccess, adminController.updateUserDetails);

// Bulk Actions for User Management
router.post('/user/bulk-activate', ...adminAccess, adminController.bulkActivateUsers);
router.post('/user/bulk-deactivate', ...adminAccess, adminController.bulkDeactivateUsers);

// Plate Management
router.post('/plate/create', ...adminAccess, adminController.addPlate);
router.put('/plate/update/:plateId', ...adminAccess, adminController.updatePlate);
router.delete('/plate/delete/:plateId', ...adminAccess, adminController.deletePlate);
router.get('/plate/list', ...adminAccess, adminController.listPlates); // List all plates

// Order Management
router.get('/order/list', ...adminAccess, adminController.getAllOrders);
router.get('/order/details/:orderId', ...adminAccess, adminController.getOrderDetails);
router.put('/order/update-status/:orderId', ...adminAccess, adminController.updateOrderStatus);
router.delete('/order/delete/:orderId', ...adminAccess, adminController.deleteOrder);

// Cooker Management
router.post('/cooker/create', ...adminAccess, adminController.addCooker);
router.put('/cooker/update/:cookerId', ...adminAccess, adminController.updateCooker);
router.delete('/cooker/delete/:cookerId', ...adminAccess, adminController.deleteCooker);
router.get('/cooker/list', ...adminAccess, adminController.listCookers); // List all cookers
router.get('/cooker/:cookerId/plates', ...adminAccess, adminController.getCookerPlates);

// Delivery Personnel Management
router.post('/delivery-person/create', ...adminAccess, adminController.createDeliveryPerson);
router.put('/delivery-person/update/:deliveryId', ...adminAccess, adminController.updateDeliveryPerson);
router.delete('/delivery-person/delete/:deliveryId', ...adminAccess, adminController.deleteDeliveryPerson);
router.get('/delivery-person/list', ...adminAccess, adminController.listDeliveryPersonnel); // List all delivery personnel

// Supplement Management
router.post('/supplement/create', ...adminAccess, adminController.addSupplement);
router.put('/supplement/update/:supplementId', ...adminAccess, adminController.updateSupplement);
router.delete('/supplement/delete/:supplementId', ...adminAccess, adminController.deleteSupplement);
router.get('/supplement/list', ...adminAccess, adminController.listSupplements); // List all supplements

// Notification Management
router.get('/notifications', ...adminAccess, adminController.getAllNotifications);
router.post('/notifications/send', ...adminAccess, adminController.sendNotification);
router.post('/notifications/bulk-send', ...adminAccess, adminController.bulkSendNotifications); // Bulk notifications

// Metrics and Analytics
router.get('/metrics/orders', ...adminAccess, adminController.getOrderMetrics);
router.get('/metrics/delivery', ...adminAccess, adminController.getDeliveryMetrics);
//router.get('/metrics/plates', ...adminAccess, adminController.getPlateMetrics);
router.get('/metrics/revenue', ...adminAccess, adminController.getRevenueMetrics); // Revenue-related metrics
router.get('/metrics/users', ...adminAccess, adminController.getUserMetrics); // User activity metrics
router.get('/metrics/delivery-efficiency', ...adminAccess, adminController.getDeliveryEfficiency); // Delivery efficiency metrics

// System Logs and Audits
router.get('/logs/system', ...adminAccess, adminController.getSystemLogs);
router.get('/logs/user-activity', ...adminAccess, adminController.getUserActivityLogs);
router.get('/logs/error-logs', ...adminAccess, adminController.getErrorLogs); // View error logs

// Advanced Analytics for Admin
router.get('/analytics/top-plates', ...adminAccess, adminController.getTopPlates); // Most ordered plates
router.get('/analytics/busiest-times', ...adminAccess, adminController.getBusiestOrderTimes); // Peak order times
router.get('/analytics/top-customers', ...adminAccess, adminController.getTopCustomers); // Most active customers
//router.get('/analytics/geographic-distribution', ...adminAccess, adminController.getOrderGeographicDistribution); // Order distribution by location

// Additional Analytics Metrics
router.get('/analytics/customer-lifetime-value', ...adminAccess, adminController.getCustomerLifetimeValue); // Total revenue generated by each customer

router.get('/analytics/order-frequency', ...adminAccess, adminController.getOrderFrequency); // Order frequency per user
router.get('/analytics/average-order-value', ...adminAccess, adminController.getAverageOrderValue); // Average value of each order
router.get('/analytics/average-preparation-time', ...adminAccess, adminController.getAveragePreparationTime); // Average plate preparation time
router.get('/analytics/customer-retention-rate', ...adminAccess, adminController.getCustomerRetentionRate); // Customer retention rate
router.get('/analytics/order-growth-rate', ...adminAccess, adminController.getOrderGrowthRate); // Monthly or yearly order growth rate
router.get('/analytics/delivery-success-rate', ...adminAccess, adminController.getDeliverySuccessRate); // Percentage of successful deliveries
router.get('/analytics/most-used-supplements', ...adminAccess, adminController.getMostUsedSupplements); // Most frequently used supplements
router.get('/analytics/delivery-time-performance', ...adminAccess, adminController.getDeliveryTimePerformance); // Delivery time performance metrics
router.get('/analytics/most-profitable-plates', ...adminAccess, adminController.getMostProfitablePlates); // Plates with the highest profit margins
router.get('/analytics/return-customers', ...adminAccess, adminController.getReturnCustomerStats); // Statistics on returning customers
router.get('/analytics/average-items-per-order', ...adminAccess, adminController.getAverageItemsPerOrder); // Average number of items per order
router.get('/analytics/low-inventory-supplements', ...adminAccess, adminController.getLowInventorySupplements); // Supplements with low stock
router.get('/analytics/cook-efficiency', ...adminAccess, adminController.getCookEfficiency); // Efficiency metrics for cooks based on order prep times
router.get('/analytics/delivery-heatmap', ...adminAccess, adminController.getDeliveryHeatmap); // Heatmap data for delivery locations
// Routes for promotion management
router.post('/promotion/create', ...adminAccess, adminController.addPromotion);
router.put('/promotion/update/:promotionId', ...adminAccess, adminController.updatePromotion);
router.delete('/promotion/delete/:promotionId', ...adminAccess, adminController.deletePromotion);

// Open route for listing promotions
router.get('/promotion/list', adminController.listPromotions);
module.exports = router;

module.exports = router;
