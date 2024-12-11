// utils/metricsService.js
const Order = require('../models/Order');
const User = require('../models/User');
const logger = require('./logger');

const getOrderMetrics = async () => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        return {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0
        };
    } catch (error) {
        logger.error(`Failed to get order metrics: ${error.message}`);
        return null;
    }
};

const getUserMetrics = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });

        return {
            totalUsers,
            activeUsers
        };
    } catch (error) {
        logger.error(`Failed to get user metrics: ${error.message}`);
        return null;
    }
};

const logPerformanceMetrics = (startTime, endTime, functionName) => {
    const duration = endTime - startTime;
    logger.info(`Performance: ${functionName} took ${duration} ms`);
};

module.exports = { getOrderMetrics, getUserMetrics, logPerformanceMetrics };
