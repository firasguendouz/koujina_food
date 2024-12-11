// routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// Public Routes

// routes/userRoutes.js
router.post('/register', userController.register);       // Step 1: Send verification code
router.post('/verify-phone', userController.verifyPhone); // Step 2: Verify phone number and complete registration

// Login an existing user
router.post('/login', userController.login);

// User-Specific Routes (Authenticated)

// Get the user's profile information
router.get('/profile', authMiddleware, userController.getUserProfile);

// Update the user's profile information
router.put('/profile/update', authMiddleware, userController.updateUserProfile);

// Change user password
router.put('/profile/change-password', authMiddleware, userController.changePassword);

// Upload a profile picture
router.post('/profile/upload-picture', authMiddleware, userController.uploadProfilePicture);

// Subscription management for the user
router.post('/subscription/subscribe', authMiddleware, userController.subscribeToService);
router.post('/subscription/unsubscribe', authMiddleware, userController.unsubscribeFromService);

// View user's subscription status and details
router.get('/subscription/status', authMiddleware, userController.getSubscriptionStatus);

// Manage notifications for the user
router.get('/notifications', authMiddleware, userController.getNotifications);
router.put('/notifications/mark-read/:notificationId', authMiddleware, userController.markNotificationAsRead);
router.put('/notifications/mark-all-read', authMiddleware, userController.markAllNotificationsAsRead);

// View and redeem loyalty points for the user
router.get('/loyalty/points', authMiddleware, userController.getLoyaltyPoints);
router.post('/loyalty/redeem', authMiddleware, userController.redeemLoyaltyPoints);

// User order history and tracking
router.get('/orders/history', authMiddleware, userController.getOrderHistory);
router.get('/orders/status/:orderId', authMiddleware, userController.trackOrderStatus);

// Security: Two-Factor Authentication (2FA)
router.post('/security/enable-2fa', authMiddleware, userController.enableTwoFactorAuthentication);
router.post('/security/verify-2fa', authMiddleware, userController.verifyTwoFactorCode);
router.post('/security/disable-2fa', authMiddleware, userController.disableTwoFactorAuthentication);

// Admin Routes for Managing Users

// Get list of all users with filters (Admin only)
router.get('/all-users', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);

// View a specific user profile by ID (Admin only)
router.get('/view/:userId', authMiddleware, roleMiddleware(['admin']), userController.getUserById);

// Update a user profile by Admin (Admin only)
router.put('/update/:userId', authMiddleware, roleMiddleware(['admin']), userController.updateUserByAdmin);

// Manage user subscription by Admin
router.put('/manage-subscription/:userId', authMiddleware, roleMiddleware(['admin']), userController.manageUserSubscription);

// Add loyalty points to user account (Admin only)
router.post('/add-loyalty-points/:userId', authMiddleware, roleMiddleware(['admin']), userController.addLoyaltyPoints);

// Delete a user (Admin only)
router.delete('/delete/:userId', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);


router.get('/plates/available', userController.getAvailablePlates);


module.exports = router;
