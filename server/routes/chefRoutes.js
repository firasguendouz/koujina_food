// routes/chefRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const chefController = require('../controllers/chefController');

const router = express.Router();

// Middleware to restrict access to authenticated chefs and admins
const chefAccess = [authMiddleware, roleMiddleware(['chef'])];
const adminAccess = [authMiddleware, roleMiddleware(['admin'])];

// Plate (Dish) Management by Chef

// Add a new plate (dish) to chef's list, including supplements (ingredients)
router.post('/plate/add', ...chefAccess, chefController.addPlate);

// Update a plate's details (e.g., ingredients, description) in chef's list
router.put('/plate/update/:plateId', ...chefAccess, chefController.updatePlateDetails);

// View all plates created by the chef
router.get('/plates', ...chefAccess, chefController.getChefPlates);

// Order Management for Chef

// Get orders assigned to the chef
router.get('/orders', ...chefAccess, chefController.getAssignedOrders);

// Update order status to indicate it's ready for delivery
router.put('/order/update-status/:orderId', ...chefAccess, chefController.updateOrderStatus);

// Admin routes for managing chefs and their plates

// View all chefs and their specialties (Admin only)
router.get('/list', ...adminAccess, chefController.getAllChefs);

// Assign an order to a specific chef (Admin only)
router.post('/assign-order/:chefId/:orderId', ...adminAccess, chefController.assignOrderToChef);

// View a specific chef's plates (Admin only)
router.get('/chef-plates/:chefId', ...adminAccess, chefController.getChefPlatesByAdmin);

// Update chef profile details (Admin only)
router.put('/update/:chefId', ...adminAccess, chefController.updateChefDetails);

// Remove a chef from the system (Admin only)
router.delete('/delete/:chefId', ...adminAccess, chefController.deleteChef);

module.exports = router;
