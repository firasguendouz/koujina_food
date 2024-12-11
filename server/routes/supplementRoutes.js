// routes/supplementRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const supplementController = require('../controllers/supplementController');

const router = express.Router();

// Middleware to restrict access to authenticated chefs and admins
const chefAccess = [authMiddleware, roleMiddleware(['chef'])];
const adminAccess = [authMiddleware, roleMiddleware(['admin'])];

// Chef and Admin Routes for Supplements

// Add a new supplement (Admin only)
router.post('/add', ...adminAccess, supplementController.addSupplement);

// Update supplement details (e.g., name, quantity, expiration date)
router.put('/update/:supplementId', ...adminAccess, supplementController.updateSupplement);

// Delete a supplement from inventory
router.delete('/delete/:supplementId', ...adminAccess, supplementController.deleteSupplement);

// Get all supplements (Admin and chef access)
router.get('/all', ...adminAccess, supplementController.getAllSupplements);

// Get supplements with low stock levels (Admin view)
router.get('/low-stock', ...adminAccess, supplementController.getLowStockSupplements);

// Get supplements by expiration date (Admin and chef view)
router.get('/by-expiration', ...adminAccess, supplementController.getSupplementsByExpiration);

// Chef-specific route to view assigned supplements and quantities for plates
router.get('/assigned', ...chefAccess, supplementController.getAssignedSupplements);

// Admin Metrics for Supplements

// Generate supplement usage metrics (e.g., most-used supplements)
router.get('/metrics/usage', ...adminAccess, supplementController.getSupplementUsageMetrics);

// Generate alerts for soon-to-expire supplements
router.get('/metrics/expiring', ...adminAccess, supplementController.getExpiringSupplementsAlert);

module.exports = router;
