// routes/employeeRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

// Middleware to restrict access to authenticated employees and admins
const employeeAccess = [authMiddleware, roleMiddleware(['employee'])];
const adminAccess = [authMiddleware, roleMiddleware(['admin'])];

// Employee Registration Route
router.post('/koujinaEmployeeCreate/register', employeeController.registerEmployee);

// Employee Login Route
router.post('/koujinaEmployeeProfile/login', employeeController.loginEmployee);

// Employee-Specific Routes

// Get all assigned orders with filtering options (status, priority)
router.get('/assigned-orders', ...employeeAccess, employeeController.getAssignedOrders);

// Update order priority (e.g., high, medium, low) for prioritization
router.put('/update-order-priority/:orderId', ...employeeAccess, employeeController.updateOrderPriority);

// Update order status (e.g., "In Preparation," "Ready for Delivery")
router.put('/update-order-status/:orderId', ...employeeAccess, employeeController.updateOrderStatus);

// Assign an order to a specific delivery personnel
router.post('/assign-to-delivery/:orderId/:deliveryId', ...employeeAccess, employeeController.assignOrderToDelivery);

// Access customer support chat sessions
router.get('/chat/:chatId', ...employeeAccess, employeeController.getChat);
router.post('/chat/:chatId/send', ...employeeAccess, employeeController.sendMessage);

// Track and manage unresolved cases with options to escalate
router.get('/support-case/unresolved', ...employeeAccess, employeeController.getUnresolvedCases);
router.put('/support-case/resolve/:caseId', ...employeeAccess, employeeController.resolveSupportCase);
router.put('/support-case/escalate/:caseId', ...employeeAccess, employeeController.escalateSupportCase);

// Access and manage customer feedback
router.get('/feedback/:orderId', ...employeeAccess, employeeController.getCustomerFeedback);
router.post('/feedback/:orderId/respond', ...employeeAccess, employeeController.respondToFeedback);

// View detailed performance metrics
router.get('/performance-metrics', ...employeeAccess, employeeController.getPerformanceMetrics);

// Access targeted goals assigned by admins and view progress
router.get('/goals', ...employeeAccess, employeeController.getAssignedGoals);
router.put('/goals/update-progress/:goalId', ...employeeAccess, employeeController.updateGoalProgress);

// Admin Routes for Managing Employees

// View a list of all employees with filters (role, department, performance rating)
router.get('/list', ...adminAccess, employeeController.getAllEmployees);

// Assign and manage individual goals for employees
router.post('/assign-goal/:employeeId', ...adminAccess, employeeController.assignGoal);
router.put('/update-goal/:employeeId/:goalId', ...adminAccess, employeeController.updateEmployeeGoal);

// Update employee details (Admin only)
router.put('/update/:employeeId', ...adminAccess, employeeController.updateEmployeeDetails);

// Remove an employee from the system (Admin only)
router.delete('/delete/:employeeId', ...adminAccess, employeeController.deleteEmployee);

// View detailed performance of a specific employee (Admin only)
router.get('/performance/:employeeId', ...adminAccess, employeeController.getEmployeePerformance);

// Generate a comprehensive performance report with customizable time range and metrics (Admin only)
router.get('/generate-report', ...adminAccess, employeeController.generatePerformanceReport);

module.exports = router;
