const Supplement = require('../models/Supplement');
const Plate = require('../models/Plate');

// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};

// Admin Routes for Managing Supplements

// Add a new supplement (Admin only)
exports.addSupplement = async (req, res) => {
    try {
        const { name, supplier, quantity, unit, pricePerUnit, expirationDate } = req.body;

        const newSupplement = await Supplement.create({
            name,
            supplier,
            quantity,
            unit,
            pricePerUnit,
            expirationDate
        });

        createResponse(res, 201, 'Supplement added successfully', newSupplement);
    } catch (error) {
        console.error('Error adding supplement:', error);
        createResponse(res, 500, 'Failed to add supplement');
    }
};

// Update supplement details (Admin only)
exports.updateSupplement = async (req, res) => {
    try {
        const { supplementId } = req.params;
        const updatedData = req.body;

        const updatedSupplement = await Supplement.findByIdAndUpdate(supplementId, updatedData, { new: true });
        if (!updatedSupplement) return createResponse(res, 404, 'Supplement not found');

        createResponse(res, 200, 'Supplement updated successfully', updatedSupplement);
    } catch (error) {
        console.error('Error updating supplement:', error);
        createResponse(res, 500, 'Failed to update supplement');
    }
};

// Delete a supplement from inventory (Admin only)
exports.deleteSupplement = async (req, res) => {
    try {
        const { supplementId } = req.params;

        await Supplement.findByIdAndDelete(supplementId);
        createResponse(res, 200, 'Supplement deleted successfully');
    } catch (error) {
        console.error('Error deleting supplement:', error);
        createResponse(res, 500, 'Failed to delete supplement');
    }
};

// Get all supplements (Admin and chef access)
exports.getAllSupplements = async (req, res) => {
    try {
        const supplements = await Supplement.find();

        createResponse(res, 200, 'Supplements retrieved successfully', supplements);
    } catch (error) {
        console.error('Error retrieving supplements:', error);
        createResponse(res, 500, 'Failed to retrieve supplements');
    }
};

// Get supplements with low stock levels (Admin view)
exports.getLowStockSupplements = async (req, res) => {
    try {
        const threshold = req.query.threshold || 10; // Set a default low stock threshold
        const lowStockSupplements = await Supplement.find({ quantity: { $lt: threshold } });

        createResponse(res, 200, 'Low stock supplements retrieved successfully', lowStockSupplements);
    } catch (error) {
        console.error('Error retrieving low stock supplements:', error);
        createResponse(res, 500, 'Failed to retrieve low stock supplements');
    }
};

// Get supplements by expiration date (Admin and chef view)
exports.getSupplementsByExpiration = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const expirationFilter = {};
        if (startDate) expirationFilter.$gte = new Date(startDate);
        if (endDate) expirationFilter.$lte = new Date(endDate);

        const supplements = await Supplement.find({ expirationDate: expirationFilter });
        createResponse(res, 200, 'Supplements by expiration date retrieved successfully', supplements);
    } catch (error) {
        console.error('Error retrieving supplements by expiration date:', error);
        createResponse(res, 500, 'Failed to retrieve supplements by expiration date');
    }
};

// Chef-specific route to view assigned supplements and quantities for plates
exports.getAssignedSupplements = async (req, res) => {
    try {
        const chefId = req.user._id;
        const plates = await Plate.find({ chef: chefId }).populate('supplements.supplement', 'name quantity');

        const supplements = plates.flatMap(plate => plate.supplements);
        createResponse(res, 200, 'Assigned supplements retrieved successfully', supplements);
    } catch (error) {
        console.error('Error retrieving assigned supplements:', error);
        createResponse(res, 500, 'Failed to retrieve assigned supplements');
    }
};

// Admin Metrics for Supplements

// Generate supplement usage metrics (e.g., most-used supplements)
exports.getSupplementUsageMetrics = async (req, res) => {
    try {
        const usageMetrics = await Plate.aggregate([
            { $unwind: '$supplements' },
            { $group: { _id: '$supplements.supplement', totalUsed: { $sum: '$supplements.quantity' } } },
            { $sort: { totalUsed: -1 } }
        ]);

        createResponse(res, 200, 'Supplement usage metrics retrieved successfully', usageMetrics);
    } catch (error) {
        console.error('Error retrieving supplement usage metrics:', error);
        createResponse(res, 500, 'Failed to retrieve supplement usage metrics');
    }
};

// Generate alerts for soon-to-expire supplements
exports.getExpiringSupplementsAlert = async (req, res) => {
    try {
        const thresholdDate = new Date();
        thresholdDate.setMonth(thresholdDate.getMonth() + 1); // 1-month expiration threshold

        const expiringSupplements = await Supplement.find({ expirationDate: { $lte: thresholdDate } });
        createResponse(res, 200, 'Expiring supplements alert retrieved successfully', expiringSupplements);
    } catch (error) {
        console.error('Error retrieving expiring supplements alert:', error);
        createResponse(res, 500, 'Failed to retrieve expiring supplements alert');
    }
};
