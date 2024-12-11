const User = require('../models/User');
const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription'); // Assuming a Subscription model exists
const Loyalty = require('../models/Loyalty'); // Assuming a Loyalty model exists
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { send2FACode, verify2FACode } = require('../utils/2faService'); // Hypothetical 2FA utility functions
const { sendNotification } = require('./telegramBot');

const Plate = require('../models/Plate');

// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};

// Public Routes

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email,phoneNumber });
        if (existingUser) {
            return createResponse(res, 400, 'User already exists.');
        }

        // Generate and send verification code
        //const verificationCode = await send2FACode(phoneNumber); // Hypothetical utility for sending 2FA code

        //if (!verificationCode) {
        //    return createResponse(res, 500, 'Failed to send verification code.');
        //}

        // Save temporary registration details in the database or in-memory cache (for simplicity)
        // Ideally, store in a separate temporary collection for unverified users.
        await User.create({
            name,
            email,
            contactNumber: phoneNumber,
            password, // This will be hashed in the `pre('save')` hook
            status: 'active', // Indicate the user is unverified
        });
// Notify admin
sendNotification(`🆕 New User Registered:\nName: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}`);

        createResponse(res, 200, 'Verification code sent. Complete the registration by verifying your phone number.');
   
    } catch (error) {
        console.error('Error during registration:', error);
        createResponse(res, 500, 'Failed to initiate registration.');
    }
};
exports.verifyPhone = async (req, res) => {
    const { phoneNumber, verificationCode } = req.body;

    if (!phoneNumber || !verificationCode) {
        return createResponse(res, 400, 'Phone number and verification code are required.');
    }

    try {
        // Verify the code
        const isVerified = await verify2FACode(phoneNumber, verificationCode); // Hypothetical utility for verifying 2FA code

        if (!isVerified) {
            return createResponse(res, 400, 'Invalid or expired verification code.');
        }

        // Update the user status to active
        const user = await User.findOneAndUpdate(
            { contactNumber: phoneNumber, status: 'pending' },
            { status: 'active' },
            { new: true }
        );

        if (!user) {
            return createResponse(res, 404, 'User not found or already verified.');
        }

        createResponse(res, 200, 'Phone number verified successfully. Registration complete.', user);
    } catch (error) {
        console.error('Error verifying phone number:', error);
        createResponse(res, 500, 'Failed to verify phone number.');
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return createResponse(res, 400, 'Please provide both email and password');
    }

    try {
        // Check if the user exists and explicitly select the password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return createResponse(res, 400, 'Invalid email or password');
        }

        console.log('User found:', user);  // Log user details
        console.log('Password from request:', password);  // Log password from request

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);  // Log the result of bcrypt comparison

        if (!isMatch) {
            return createResponse(res, 400, 'Invalid email or password');
        }

        // Generate JWT token
        const payload = { userId: user._id, role: user.role ,name: user.name,   email: user.email};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        sendNotification(
            `🆕 User Logged In:\nID: ${user._id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`
        );
        // Send success response with the token
        createResponse(res, 200, 'Login successful', { token });
    } catch (error) {
        console.error('Error logging in user:', error);
        createResponse(res, 500, 'Error logging in');
    }
};


// User-Specific Routes

// Get the user's profile information
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        createResponse(res, 200, 'User profile retrieved successfully', user);
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        createResponse(res, 500, 'Failed to retrieve user profile');
    }
};

// Update the user's profile information
exports.updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true });
        createResponse(res, 200, 'User profile updated successfully', updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        createResponse(res, 500, 'Failed to update user profile');
    }
};

// Change user password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (!(await bcrypt.compare(oldPassword, user.password))) {
            return createResponse(res, 400, 'Old password is incorrect');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        createResponse(res, 200, 'Password changed successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        createResponse(res, 500, 'Failed to change password');
    }
};

// Upload a profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.userId, { profilePicture: req.file.path }, { new: true });
        createResponse(res, 200, 'Profile picture uploaded successfully', user);
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        createResponse(res, 500, 'Failed to upload profile picture');
    }
};

// Subscription management for the user
exports.subscribeToService = async (req, res) => {
    try {
        const subscription = await Subscription.create({ userId: req.user.userId, status: 'active' });
        createResponse(res, 200, 'Subscribed successfully', subscription);
    } catch (error) {
        console.error('Error subscribing to service:', error);
        createResponse(res, 500, 'Failed to subscribe to service');
    }
};

exports.unsubscribeFromService = async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndUpdate({ userId: req.user.userId }, { status: 'inactive' }, { new: true });
        createResponse(res, 200, 'Unsubscribed successfully', subscription);
    } catch (error) {
        console.error('Error unsubscribing from service:', error);
        createResponse(res, 500, 'Failed to unsubscribe from service');
    }
};

// View user's subscription status and details
exports.getSubscriptionStatus = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.user.userId });
        createResponse(res, 200, 'Subscription status retrieved successfully', subscription);
    } catch (error) {
        console.error('Error retrieving subscription status:', error);
        createResponse(res, 500, 'Failed to retrieve subscription status');
    }
};

// Manage notifications for the user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId });
        createResponse(res, 200, 'Notifications retrieved successfully', notifications);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        createResponse(res, 500, 'Failed to retrieve notifications');
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        createResponse(res, 200, 'Notification marked as read');
    } catch (error) {
        console.error('Error marking notification as read:', error);
        createResponse(res, 500, 'Failed to mark notification as read');
    }
};

exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.userId, read: false }, { read: true });
        createResponse(res, 200, 'All notifications marked as read');
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        createResponse(res, 500, 'Failed to mark all notifications as read');
    }
};

// View and redeem loyalty points for the user
exports.getLoyaltyPoints = async (req, res) => {
    try {
        const loyaltyPoints = await Loyalty.findOne({ userId: req.user.userId });
        createResponse(res, 200, 'Loyalty points retrieved successfully', loyaltyPoints);
    } catch (error) {
        console.error('Error retrieving loyalty points:', error);
        createResponse(res, 500, 'Failed to retrieve loyalty points');
    }
};

exports.redeemLoyaltyPoints = async (req, res) => {
    try {
        const { points } = req.body;
        const loyalty = await Loyalty.findOne({ userId: req.user.userId });

        if (loyalty.points < points) return createResponse(res, 400, 'Insufficient loyalty points');

        loyalty.points -= points;
        await loyalty.save();
        createResponse(res, 200, 'Loyalty points redeemed successfully', { remainingPoints: loyalty.points });
    } catch (error) {
        console.error('Error redeeming loyalty points:', error);
        createResponse(res, 500, 'Failed to redeem loyalty points');
    }
};

// User order history and tracking
exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId });
        createResponse(res, 200, 'Order history retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving order history:', error);
        createResponse(res, 500, 'Failed to retrieve order history');
    }
};

exports.trackOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) return createResponse(res, 404, 'Order not found');
        createResponse(res, 200, 'Order status retrieved successfully', { status: order.status });
    } catch (error) {
        console.error('Error tracking order status:', error);
        createResponse(res, 500, 'Failed to track order status');
    }
};

// Security: Two-Factor Authentication (2FA)
exports.enableTwoFactorAuthentication = async (req, res) => {
    try {
        const code = await send2FACode(req.user.userId);
        createResponse(res, 200, 'Two-factor authentication enabled', { code });
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        createResponse(res, 500, 'Failed to enable two-factor authentication');
    }
};

exports.verifyTwoFactorCode = async (req, res) => {
    try {
        const { code } = req.body;
        const verified = await verify2FACode(req.user.userId, code);

        if (!verified) return createResponse(res, 400, 'Invalid two-factor authentication code');
        createResponse(res, 200, 'Two-factor authentication verified');
    } catch (error) {
        console.error('Error verifying 2FA code:', error);
        createResponse(res, 500, 'Failed to verify two-factor authentication code');
    }
};

exports.disableTwoFactorAuthentication = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.userId, { twoFactorEnabled: false });
        createResponse(res, 200, 'Two-factor authentication disabled');
    } catch (error) {
        console.error('Error disabling 2FA:', error);
        createResponse(res, 500, 'Failed to disable two-factor authentication');
    }
};

// Admin Routes for Managing Users

// Get list of all users with filters (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const { role, status } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (status) filter.status = status;

        const users = await User.find(filter);
        createResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        createResponse(res, 500, 'Failed to retrieve users');
    }
};

// View a specific user profile by ID (Admin only)
exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) return createResponse(res, 404, 'User not found');
        createResponse(res, 200, 'User profile retrieved successfully', user);
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        createResponse(res, 500, 'Failed to retrieve user profile');
    }
};

// Update a user profile by Admin
exports.updateUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!updatedUser) return createResponse(res, 404, 'User not found');
        createResponse(res, 200, 'User profile updated successfully', updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        createResponse(res, 500, 'Failed to update user profile');
    }
};

// Manage user subscription by Admin
exports.manageUserSubscription = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const subscription = await Subscription.findOneAndUpdate({ userId }, { status }, { new: true });
        createResponse(res, 200, 'User subscription updated successfully', subscription);
    } catch (error) {
        console.error('Error updating user subscription:', error);
        createResponse(res, 500, 'Failed to update user subscription');
    }
};

// Add loyalty points to user account (Admin only)
exports.addLoyaltyPoints = async (req, res) => {
    try {
        const { userId } = req.params;
        const { points } = req.body;

        const loyalty = await Loyalty.findOneAndUpdate({ userId }, { $inc: { points } }, { new: true });
        createResponse(res, 200, 'Loyalty points added successfully', loyalty);
    } catch (error) {
        console.error('Error adding loyalty points:', error);
        createResponse(res, 500, 'Failed to add loyalty points');
    }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);

        createResponse(res, 200, 'User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        createResponse(res, 500, 'Failed to delete user');
    }
};



exports.getAvailablePlates = async (req, res) => {
    try {
        const availablePlates = await Plate.find({}); // or your specific query logic
        res.status(200).json(availablePlates);
    } catch (error) {
        console.error("Error fetching plates:", error);
        res.status(500).json({ message: 'Server error: unable to retrieve plates' });
    }
};

