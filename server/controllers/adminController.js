// controllers/adminController.js - 

//   ## Part 1: Basic Setup and Utility Functions

const Promotion = require('../models/Promotion'); // Assuming you have a Promotion model

const User = require('../models/User');
const Plate = require('../models/Plate');
const Order = require('../models/Order');
const Chef = require('../models/Chef');
const DeliveryPerson = require('../models/DeliveryPerson');
const Supplement = require('../models/Supplement');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};
// Admin Registration
exports.registerAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return createResponse(res, 400, 'Admin already exists with this email');
        }

        // Create new admin
        const newAdmin = new Admin({
            name,
            email,
            password,
            role: role || 'admin'
        });

        // Hash password before saving
        newAdmin.password = password;

        // Save the new admin to the database
        await newAdmin.save();

        // Return a success response
        createResponse(res, 201, 'Admin registered successfully', newAdmin);
    } catch (error) {
        console.error('Error registering admin:', error);
        createResponse(res, 500, 'Error registering admin');
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return createResponse(res, 400, 'Please provide both email and password');
    }

    try {
        // Check if the admin exists and explicitly select the password field
        const admin = await Admin.findOne({ email }).select('+password');
        
        if (!admin) {
            return createResponse(res, 400, 'Invalid email or password');
        }

        console.log('Admin found:', admin);  // Log admin details
        console.log('Password from request:', password);  // Log password from request

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('Password match result:', isMatch);  // Log the result of bcrypt comparison
        
        if (!isMatch) {
            return createResponse(res, 400, 'Invalid email or password');
        }

        // Generate JWT token
        const payload = { adminId: admin._id, role: admin.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send success response with the token
        createResponse(res, 200, 'Login successful', { token });
    } catch (error) {
        console.error('Error logging in admin:', error);
        createResponse(res, 500, 'Error logging in');
    }
};



// Dashboard Function
exports.getDashboard = async (req, res) => {
    try {
        const [userCount, orderCount, plateCount, chefCount, deliveryPersonCount] = await Promise.all([
            User.countDocuments(),
            Order.countDocuments(),
            Plate.countDocuments(),
            Chef.countDocuments({ status: 'active' }),
            DeliveryPerson.countDocuments({ status: 'active' })
        ]);

        createResponse(res, 200, 'Dashboard metrics retrieved successfully', {
            userCount,
            orderCount,
            plateCount,
            chefCount,
            deliveryPersonCount
        });
    } catch (error) {
        console.error('Error retrieving dashboard metrics:', error);
        createResponse(res, 500, 'Failed to retrieve dashboard metrics');
    }
};
//   ## Part 2: User Management


// Admin User Management
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        createResponse(res, 201, 'User created successfully', newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        createResponse(res, 500, 'Failed to create user');
    }
};

exports.updateUserDetails = async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
  
      // Find the user by ID and update with the data from the request body
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
  
      if (!updatedUser) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user details:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update user details',
        error: error.message,
      });
    }
  };

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        createResponse(res, 200, 'User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        createResponse(res, 500, 'Failed to delete user');
    }
};

exports.downgradeUserToEmployee = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { role: 'employee' }, { new: true });
        if (!user) return createResponse(res, 404, 'User not found');
        createResponse(res, 200, 'User downgraded to employee', user);
    } catch (error) {
        console.error('Error downgrading user to employee:', error);
        createResponse(res, 500, 'Failed to downgrade user');
    }
};

exports.promoteUserToAdmin = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { role: 'admin' }, { new: true });
        if (!user) return createResponse(res, 404, 'User not found');
        createResponse(res, 200, 'User promoted to admin', user);
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        createResponse(res, 500, 'Failed to promote user');
    }
};

exports.activateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { status: 'active' }, { new: true });
        if (!user) return createResponse(res, 404, 'User not found');
        createResponse(res, 200, 'User activated successfully', user);
    } catch (error) {
        console.error('Error activating user:', error);
        createResponse(res, 500, 'Failed to activate user');
    }
};

exports.deactivateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { status: 'inactive' }, { new: true });
        if (!user) return createResponse(res, 404, 'User not found');
        createResponse(res, 200, 'User deactivated successfully', user);
    } catch (error) {
        console.error('Error deactivating user:', error);
        createResponse(res, 500, 'Failed to deactivate user');
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        createResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        createResponse(res, 500, 'Failed to retrieve users');
    }
};

// Bulk User Actions
exports.bulkActivateUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        await User.updateMany({ _id: { $in: userIds } }, { status: 'active' });
        createResponse(res, 200, 'Users activated successfully');
    } catch (error) {
        console.error('Error activating users:', error);
        createResponse(res, 500, 'Failed to activate users');
    }
};

exports.bulkDeactivateUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        await User.updateMany({ _id: { $in: userIds } }, { status: 'inactive' });
        createResponse(res, 200, 'Users deactivated successfully');
    } catch (error) {
        console.error('Error deactivating users:', error);
        createResponse(res, 500, 'Failed to deactivate users');
    }
};


//   ## Part 3: Plate Management


// Plate Management
exports.addPlate = async (req, res) => {
    try {
        console.log("Incoming payload:", req.body); // Log the entire incoming payload

        const { chef, photo, ...plateData } = req.body; // Extract 'chef' and 'photo' from req.body

        // Create the new plate with the chef ID and photo URL included
        const newPlate = await Plate.create({ ...plateData, chef, photo });

        // Update the chef’s specialty plates list
        const updatedChef = await Chef.findByIdAndUpdate(
            chef,
            {
                $push: {
                    specialtyPlates: {
                        plateId: newPlate._id,
                        name: newPlate.name,
                        description: newPlate.description,
                        photo: newPlate.photo // Include photo URL in chef's specialty plates
                    }
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedChef) {
            // Rollback if chef not found
            await Plate.findByIdAndDelete(newPlate._id);
            return createResponse(res, 404, 'Chef not found');
        }

        createResponse(res, 201, "Plate created and added to chef's specialty plates successfully", newPlate);
    } catch (error) {
        console.error("Error creating plate:", error);
        createResponse(res, 500, "Failed to create plate");
    }
};




exports.updatePlate = async (req, res) => {
    try {
        const updatedPlate = await Plate.findByIdAndUpdate(req.params.plateId, req.body, { new: true });
        if (!updatedPlate) return createResponse(res, 404, 'Plate not found');
        createResponse(res, 200, 'Plate updated successfully', updatedPlate);
    } catch (error) {
        console.error('Error updating plate:', error);
        createResponse(res, 500, 'Failed to update plate');
    }
};

exports.deletePlate = async (req, res) => {
    try {
        await Plate.findByIdAndDelete(req.params.plateId);
        createResponse(res, 200, 'Plate deleted successfully');
    } catch (error) {
        console.error('Error deleting plate:', error);
        createResponse(res, 500, 'Failed to delete plate');
    }
};

exports.listPlates = async (req, res) => {
    try {
        const plates = await Plate.find();
        createResponse(res, 200, 'Plates retrieved successfully', plates);
    } catch (error) {
        console.error('Error retrieving plates:', error);
        createResponse(res, 500, 'Failed to retrieve plates');
    }
};


//   ## Part 4: Order Management


// Order Management
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer chef deliveryPerson');
        createResponse(res, 200, 'Orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        createResponse(res, 500, 'Failed to retrieve orders');
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('customer chef deliveryPerson');
        if (!order) return createResponse(res, 404, 'Order not found');
        createResponse(res, 200, 'Order details retrieved successfully', order);
    } catch (error) {
        console.error('Error retrieving order details:', error);
        createResponse(res, 500, 'Failed to retrieve order details');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, { status: req.body.status }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');
        createResponse(res, 200, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        createResponse(res, 500, 'Failed to update order status');
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        createResponse(res, 200, 'Order deleted successfully');
    } catch (error) {
        console.error('Error deleting order:', error);
        createResponse(res, 500, 'Failed to delete order');
    }
};
//   ## Part 5: Cooker Management


// Cooker Management
// Retrieve plates for a specific cooker
exports.getCookerPlates = async (req, res) => {
    try {
        const { cookerId } = req.params;

        // Find the cooker by ID and populate the specialtyPlates array
        const cooker = await Chef.findById(cookerId).populate('specialtyPlates.plateId', 'name description');

        if (!cooker) {
            return createResponse(res, 404, 'Cooker not found');
        }

        // Return the cooker's specialty plates
        createResponse(res, 200, 'Cooker specialty plates retrieved successfully', cooker.specialtyPlates);
    } catch (error) {
        console.error('Error retrieving cookers specialty plates:', error);
        createResponse(res, 500, 'Failed to retrieve cookers specialty plates');
    }
};

exports.addCooker = async (req, res) => {
    try {
        const newCooker = await Chef.create(req.body);
        createResponse(res, 201, 'Cooker created successfully', newCooker);
    } catch (error) {
        console.error('Error creating cooker:', error);
        createResponse(res, 500, 'Failed to create cooker');
    }
};

exports.updateCooker = async (req, res) => {
    try {
        const updatedCooker = await Chef.findByIdAndUpdate(req.params.cookerId, req.body, { new: true });
        if (!updatedCooker) return createResponse(res, 404, 'Cooker not found');
        createResponse(res, 200, 'Cooker updated successfully', updatedCooker);
    } catch (error) {
        console.error('Error updating cooker:', error);
        createResponse(res, 500, 'Failed to update cooker');
    }
};

exports.deleteCooker = async (req, res) => {
    try {
        await Chef.findByIdAndDelete(req.params.cookerId);
        createResponse(res, 200, 'Cooker deleted successfully');
    } catch (error) {
        console.error('Error deleting cooker:', error);
        createResponse(res, 500, 'Failed to delete cooker');
    }
};

exports.listCookers = async (req, res) => {
    try {
        const cookers = await Chef.find();
        createResponse(res, 200, 'Cookers retrieved successfully', cookers);
    } catch (error) {
        console.error('Error retrieving cookers:', error);
        createResponse(res, 500, 'Failed to retrieve cookers');
    }
};
//   ## Part 6: Delivery Personnel Management


// Create a new delivery person
exports.createDeliveryPerson = async (req, res) => {
    try {
        const { name, email, contactNumber, status } = req.body;
        const password = "securepass"; // default password; update as required
        const newDeliveryPerson = await DeliveryPerson.create({
            name, email, contactNumber, status, password
        });
        res.status(201).json({ status: 'success', data: newDeliveryPerson });
    } catch (error) {
        console.error('Error creating delivery person:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create delivery person' });
    }
};

// Update delivery person
exports.updateDeliveryPerson = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        const updateData = req.body;
        const updatedPerson = await DeliveryPerson.findByIdAndUpdate(deliveryId, updateData, { new: true });
        if (!updatedPerson) return res.status(404).json({ status: 'error', message: 'Delivery person not found' });
        res.status(200).json({ status: 'success', data: updatedPerson });
    } catch (error) {
        console.error('Error updating delivery person:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update delivery person' });
    }
};

// Delete a delivery person
exports.deleteDeliveryPerson = async (req, res) => {
    try {
        const { deliveryId } = req.params;
        await DeliveryPerson.findByIdAndDelete(deliveryId);
        res.status(200).json({ status: 'success', message: 'Delivery person deleted successfully' });
    } catch (error) {
        console.error('Error deleting delivery person:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete delivery person' });
    }
};

// List all delivery personnel
exports.listDeliveryPersonnel = async (req, res) => {
    try {
        const deliveryPersonnel = await DeliveryPerson.find();
        res.status(200).json({ status: 'success', data: deliveryPersonnel });
    } catch (error) {
        console.error('Error retrieving delivery personnel:', error);
        res.status(500).json({ status: 'error', message: 'Failed to retrieve delivery personnel' });
    }
};

exports.listDeliveryPersonnel = async (req, res) => {
    try {
        const deliveryPersonnel = await DeliveryPerson.find();
        createResponse(res, 200, 'Delivery personnel retrieved successfully', deliveryPersonnel);
    } catch (error) {
        console.error('Error retrieving delivery personnel:', error);
        createResponse(res, 500, 'Failed to retrieve delivery personnel');
    }
};
//   ## Part 7: Supplement Management


// Supplement Management
exports.addSupplement = async (req, res) => {
    try {
        const newSupplement = await Supplement.create(req.body);
        createResponse(res, 201, 'Supplement created successfully', newSupplement);
    } catch (error) {
        console.error('Error creating supplement:', error);
        createResponse(res, 500, 'Failed to create supplement');
    }
};

exports.updateSupplement = async (req, res) => {
    try {
        const updatedSupplement = await Supplement.findByIdAndUpdate(req.params.supplementId, req.body, { new: true });
        if (!updatedSupplement) return createResponse(res, 404, 'Supplement not found');
        createResponse(res, 200, 'Supplement updated successfully', updatedSupplement);
    } catch (error) {
        console.error('Error updating supplement:', error);
        createResponse(res, 500, 'Failed to update supplement');
    }
};

exports.deleteSupplement = async (req, res) => {
    try {
        await Supplement.findByIdAndDelete(req.params.supplementId);
        createResponse(res, 200, 'Supplement deleted successfully');
    } catch (error) {
        console.error('Error deleting supplement:', error);
        createResponse(res, 500, 'Failed to delete supplement');
    }
};

exports.listSupplements = async (req, res) => {
    try {
        const supplements = await Supplement.find();
        createResponse(res, 200, 'Supplements retrieved successfully', supplements);
    } catch (error) {
        console.error('Error retrieving supplements:', error);
        createResponse(res, 500, 'Failed to retrieve supplements');
    }
};
//   ## Part 8: Notification Management


// Notification Management
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        createResponse(res, 200, 'Notifications retrieved successfully', notifications);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        createResponse(res, 500, 'Failed to retrieve notifications');
    }
};

exports.sendNotification = async (req, res) => {
    try {
      const { content, recipientType, specificUsers, postalCode, creationDateRange, type } = req.body;
      
      let recipients = [];
  
      // Select recipients based on recipientType
      if (recipientType === 'all') {
        recipients = await User.find();
      } else if (recipientType === 'allEmployees') {
        recipients = await Employee.find({ role: { $in: ['manager', 'support', 'operations'] } });
      } else if (recipientType === 'specificUsers' && specificUsers && specificUsers.length) {
        recipients = await User.find({ _id: { $in: specificUsers } });
      }
  
      // Additional filtering by postal code and creation date range
      if (postalCode) {
        recipients = recipients.filter(user => user.postalCode === postalCode);
      }
      if (creationDateRange) {
        const [start, end] = creationDateRange;
        recipients = recipients.filter(user =>
          user.creationDate >= new Date(start) && user.creationDate <= new Date(end)
        );
      }
  
      // Create notifications for each recipient
      const notifications = recipients.map(user => ({
        recipient: user._id,
        content,
        type,
        timestamp: new Date(),
      }));
  
      const createdNotifications = await Notification.insertMany(notifications);
      res.status(201).json({ status: 'success', message: 'Notifications sent successfully', data: createdNotifications });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ status: 'error', message: 'Failed to send notifications' });
    }
  };

exports.bulkSendNotifications = async (req, res) => {
    try {
        const { notifications } = req.body; // Assuming notifications is an array of notification objects
        const createdNotifications = await Notification.insertMany(notifications);
        createResponse(res, 201, 'Bulk notifications sent successfully', createdNotifications);
    } catch (error) {
        console.error('Error sending bulk notifications:', error);
        createResponse(res, 500, 'Failed to send bulk notifications');
    }
};

//   ## Part 9: Metrics



// Metrics

exports.getOrderMetrics = async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        const revenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
        const totalRevenue = revenue[0]?.total || 0;

        createResponse(res, 200, 'Order metrics retrieved successfully', { orderCount, totalRevenue });
    } catch (error) {
        console.error('Error retrieving order metrics:', error);
        createResponse(res, 500, 'Failed to retrieve order metrics');
    }
};

exports.getDeliveryMetrics = async (req, res) => {
    try {
        const deliveries = await Order.aggregate([
            { $match: { status: 'delivered' } },
            {
                $group: {
                    _id: null,
                    averageDeliveryTime: { $avg: { $subtract: ["$deliveredAt", "$outForDeliveryAt"] } }
                }
            }
        ]);

        createResponse(res, 200, 'Delivery metrics retrieved successfully', {
            averageDeliveryTime: deliveries[0]?.averageDeliveryTime || 0
        });
    } catch (error) {
        console.error('Error retrieving delivery metrics:', error);
        createResponse(res, 500, 'Failed to retrieve delivery metrics');
    }
};

exports.getRevenueMetrics = async (req, res) => {
    try {
        const revenueData = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    status: 'delivered' // Only include fully completed and paid orders
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$timestamps.orderedAt" },
                        month: { $month: "$timestamps.orderedAt" },
                        year: { $year: "$timestamps.orderedAt" }
                    },
                    totalRevenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }
            }
        ]);

        // Transform the data into a more usable format
        const dailyRevenue = revenueData.map(dayData => ({
            date: new Date(dayData._id.year, dayData._id.month - 1, dayData._id.day),
            totalRevenue: dayData.totalRevenue,
            orderCount: dayData.orderCount
        }));

        // Additional grouping if needed for weekly or monthly
        // Calculate total revenue if required
        const totalRevenue = dailyRevenue.reduce((acc, curr) => acc + curr.totalRevenue, 0);

        createResponse(res, 200, 'Revenue metrics retrieved successfully', {
            totalRevenue,
            dailyRevenue,
        });
    } catch (error) {
        console.error('Error retrieving revenue metrics:', error);
        createResponse(res, 500, 'Failed to retrieve revenue metrics');
    }
};


exports.getUserMetrics = async (req, res) => {
    try {
        // Count all users, active users, and specific roles
        const userCount = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const chefCount = await Chef.countDocuments({ status: 'active' });
        const supportEmployeeCount = await Employee.countDocuments({ role: 'support', status: 'active' });
        const operationEmployeeCount = await Employee.countDocuments({ role: 'operations', status: 'active' });
        const managerEmployeeCount = await Employee.countDocuments({ role: 'manager', status: 'active' });
        const adminCount = await Admin.countDocuments({ role: 'admin' });

        createResponse(res, 200, 'User metrics retrieved successfully', { 
            userCount, 
            activeUsers, 
            chefCount, 
            supportEmployeeCount,
            operationEmployeeCount,
            managerEmployeeCount,
            adminCount 
        });
    } catch (error) {
        console.error('Error retrieving user metrics:', error);
        createResponse(res, 500, 'Failed to retrieve user metrics');
    }
};


exports.getDeliveryEfficiency = async (req, res) => {
    try {
        const deliveries = await Order.find({ status: 'delivered' });
        const onTimeDeliveries = deliveries.filter(order => order.deliveredAt <= order.estimatedDeliveryTime).length;

        const deliveryEfficiency = (onTimeDeliveries / deliveries.length) * 100;
        createResponse(res, 200, 'Delivery efficiency metrics retrieved successfully', { deliveryEfficiency });
    } catch (error) {
        console.error('Error retrieving delivery efficiency metrics:', error);
        createResponse(res, 500, 'Failed to retrieve delivery efficiency metrics');
    }
};
//   ## Part 10: Analytics


// Analytics

exports.getTopPlates = async (req, res) => {
    try {
        const topPlates = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.plateId", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        createResponse(res, 200, 'Top plates retrieved successfully', topPlates);
    } catch (error) {
        console.error('Error retrieving top plates:', error);
        createResponse(res, 500, 'Failed to retrieve top plates');
    }
};

exports.getBusiestOrderTimes = async (req, res) => {
    try {
        const ordersByHour = await Order.aggregate([
            { $project: { hour: { $hour: "$orderedAt" } } },
            { $group: { _id: "$hour", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        createResponse(res, 200, 'Busiest order times retrieved successfully', ordersByHour);
    } catch (error) {
        console.error('Error retrieving busiest order times:', error);
        createResponse(res, 500, 'Failed to retrieve busiest order times');
    }
};

exports.getTopCustomers = async (req, res) => {
    try {
        const topCustomers = await Order.aggregate([
            { $group: { _id: "$customer", totalSpent: { $sum: "$totalAmount" } } },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);

        createResponse(res, 200, 'Top customers retrieved successfully', topCustomers);
    } catch (error) {
        console.error('Error retrieving top customers:', error);
        createResponse(res, 500, 'Failed to retrieve top customers');
    }
};

// Example of calculating customer lifetime value
exports.getCustomerLifetimeValue = async (req, res) => {
    try {
        const lifetimeValue = await Order.aggregate([
            { $group: { _id: "$customer", totalSpent: { $sum: "$totalAmount" } } }
        ]);

        createResponse(res, 200, 'Customer lifetime value retrieved successfully', lifetimeValue);
    } catch (error) {
        console.error('Error retrieving customer lifetime value:', error);
        createResponse(res, 500, 'Failed to retrieve customer lifetime value');
    }
};






// Analytics: Order Frequency per User
exports.getOrderFrequency = async (req, res) => {
    try {
        const orderFrequency = await Order.aggregate([
            { $group: { _id: "$customer", orderCount: { $sum: 1 } } },
            { $sort: { orderCount: -1 } }
        ]);

        createResponse(res, 200, 'Order frequency per user retrieved successfully', orderFrequency);
    } catch (error) {
        logger.error('Error retrieving order frequency:', error);
        createResponse(res, 500, 'Failed to retrieve order frequency');
    }
};

// Analytics: Average Order Value
exports.getAverageOrderValue = async (req, res) => {
    try {
        const avgOrderValue = await Order.aggregate([
            { $group: { _id: null, avgValue: { $avg: "$totalAmount" } } }
        ]);

        createResponse(res, 200, 'Average order value retrieved successfully', avgOrderValue[0]?.avgValue || 0);
    } catch (error) {
        logger.error('Error retrieving average order value:', error);
        createResponse(res, 500, 'Failed to retrieve average order value');
    }
};

// Analytics: Average Preparation Time
exports.getAveragePreparationTime = async (req, res) => {
    try {
        const avgPrepTime = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, avgPrepTime: { $avg: { $subtract: ["$deliveredAt", "$createdAt"] } } } }
        ]);

        createResponse(res, 200, 'Average preparation time retrieved successfully', avgPrepTime[0]?.avgPrepTime || 0);
    } catch (error) {
        logger.error('Error retrieving average preparation time:', error);
        createResponse(res, 500, 'Failed to retrieve average preparation time');
    }
};

// Analytics: Customer Retention Rate
exports.getCustomerRetentionRate = async (req, res) => {
    try {
        const customers = await User.aggregate([
            { $match: { status: 'active' } },
            { $lookup: { from: 'orders', localField: '_id', foreignField: 'customer', as: 'orders' } },
            { $project: { name: 1, orderCount: { $size: '$orders' } } },
            { $match: { orderCount: { $gt: 1 } } }
        ]);

        const retentionRate = (customers.length / await User.countDocuments({ status: 'active' })) * 100;
        createResponse(res, 200, 'Customer retention rate retrieved successfully', { retentionRate });
    } catch (error) {
        logger.error('Error retrieving customer retention rate:', error);
        createResponse(res, 500, 'Failed to retrieve customer retention rate');
    }
};

// Analytics: Order Growth Rate (Monthly or Yearly)
exports.getOrderGrowthRate = async (req, res) => {
    try {
        const growthRate = await Order.aggregate([
            { $group: { _id: { $month: "$createdAt" }, totalOrders: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        createResponse(res, 200, 'Order growth rate retrieved successfully', growthRate);
    } catch (error) {
        logger.error('Error retrieving order growth rate:', error);
        createResponse(res, 500, 'Failed to retrieve order growth rate');
    }
};

// Analytics: Delivery Success Rate
exports.getDeliverySuccessRate = async (req, res) => {
    try {
        const deliverySuccess = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, successCount: { $sum: 1 } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const successRate = (deliverySuccess[0]?.successCount / totalOrders) * 100;

        createResponse(res, 200, 'Delivery success rate retrieved successfully', { successRate });
    } catch (error) {
        logger.error('Error retrieving delivery success rate:', error);
        createResponse(res, 500, 'Failed to retrieve delivery success rate');
    }
};

// Analytics: Most Used Supplements
exports.getMostUsedSupplements = async (req, res) => {
    try {
        const mostUsedSupplements = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.supplement", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        createResponse(res, 200, 'Most used supplements retrieved successfully', mostUsedSupplements);
    } catch (error) {
        logger.error('Error retrieving most used supplements:', error);
        createResponse(res, 500, 'Failed to retrieve most used supplements');
    }
};

// Analytics: Delivery Time Performance
exports.getDeliveryTimePerformance = async (req, res) => {
    try {
        const deliveryPerformance = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $project: { deliveryTime: { $subtract: ["$deliveredAt", "$orderedAt"] } } },
            { $group: { _id: null, avgDeliveryTime: { $avg: "$deliveryTime" } } }
        ]);

        createResponse(res, 200, 'Delivery time performance retrieved successfully', deliveryPerformance[0]?.avgDeliveryTime || 0);
    } catch (error) {
        logger.error('Error retrieving delivery time performance:', error);
        createResponse(res, 500, 'Failed to retrieve delivery time performance');
    }
};

// Analytics: Most Profitable Plates
exports.getMostProfitablePlates = async (req, res) => {
    try {
        const mostProfitablePlates = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.plateId", totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        createResponse(res, 200, 'Most profitable plates retrieved successfully', mostProfitablePlates);
    } catch (error) {
        logger.error('Error retrieving most profitable plates:', error);
        createResponse(res, 500, 'Failed to retrieve most profitable plates');
    }
};

// Analytics: Return Customers
exports.getReturnCustomerStats = async (req, res) => {
    try {
        const returnCustomers = await Order.aggregate([
            { $group: { _id: "$customer", orderCount: { $sum: 1 } } },
            { $match: { orderCount: { $gt: 1 } } }
        ]);

        createResponse(res, 200, 'Return customer statistics retrieved successfully', returnCustomers);
    } catch (error) {
        logger.error('Error retrieving return customer stats:', error);
        createResponse(res, 500, 'Failed to retrieve return customer stats');
    }
};

// Analytics: Average Items per Order
exports.getAverageItemsPerOrder = async (req, res) => {
    try {
        const avgItemsPerOrder = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$_id", totalItems: { $sum: "$items.quantity" } } },
            { $group: { _id: null, avgItems: { $avg: "$totalItems" } } }
        ]);

        createResponse(res, 200, 'Average items per order retrieved successfully', avgItemsPerOrder[0]?.avgItems || 0);
    } catch (error) {
        logger.error('Error retrieving average items per order:', error);
        createResponse(res, 500, 'Failed to retrieve average items per order');
    }
};

// Analytics: Low Inventory Supplements
exports.getLowInventorySupplements = async (req, res) => {
    try {
        const lowStockSupplements = await Supplement.find({ quantity: { $lt: 10 } });
        createResponse(res, 200, 'Low inventory supplements retrieved successfully', lowStockSupplements);
    } catch (error) {
        logger.error('Error retrieving low inventory supplements:', error);
        createResponse(res, 500, 'Failed to retrieve low inventory supplements');
    }
};

// Analytics: Cook Efficiency
exports.getCookEfficiency = async (req, res) => {
    try {
        const cookEfficiency = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: "$chef", avgPrepTime: { $avg: { $subtract: ["$deliveredAt", "$createdAt"] } } } },
            { $sort: { avgPrepTime: 1 } }
        ]);

        createResponse(res, 200, 'Cook efficiency retrieved successfully', cookEfficiency);
    } catch (error) {
        logger.error('Error retrieving cook efficiency:', error);
        createResponse(res, 500, 'Failed to retrieve cook efficiency');
    }
};

// Analytics: Delivery Heatmap
exports.getDeliveryHeatmap = async (req, res) => {
    try {
        const heatmapData = await Order.aggregate([
            { $group: { _id: { lat: "$deliveryAddress.lat", long: "$deliveryAddress.long" }, count: { $sum: 1 } } }
        ]);

        createResponse(res, 200, 'Delivery heatmap data retrieved successfully', heatmapData);
    } catch (error) {
        logger.error('Error retrieving delivery heatmap data:', error);
        createResponse(res, 500, 'Failed to retrieve delivery heatmap data');
    }
};





//   ## Part 11: System Logs and Audits


// System Logs and Audits

exports.getSystemLogs = async (req, res) => {
    try {
        // Example: retrieve system logs from a logging service or file system
        const logs = []; // Replace with actual logs retrieval logic
        createResponse(res, 200, 'System logs retrieved successfully', logs);
    } catch (error) {
        console.error('Error retrieving system logs:', error);
        createResponse(res, 500, 'Failed to retrieve system logs');
    }
};

exports.getUserActivityLogs = async (req, res) => {
    try {
        // Example: retrieve user activity logs, perhaps stored in a dedicated "logs" collection
        const logs = []; // Replace with actual activity log retrieval logic
        createResponse(res, 200, 'User activity logs retrieved successfully', logs);
    } catch (error) {
        console.error('Error retrieving user activity logs:', error);
        createResponse(res, 500, 'Failed to retrieve user activity logs');
    }
};

exports.getErrorLogs = async (req, res) => {
    try {
        // Example: retrieve error logs from error-tracking service
        const errorLogs = []; // Replace with actual error log retrieval logic
        createResponse(res, 200, 'Error logs retrieved successfully', errorLogs);
    } catch (error) {
        console.error('Error retrieving error logs:', error);
        createResponse(res, 500, 'Failed to retrieve error logs');
    }
};



// Create a new promotion
exports.addPromotion = async (req, res) => {
    try {
        const { text, photo, validUntil, available } = req.body;

        const newPromotion = await Promotion.create({
            text,
            photo,
            validUntil,
            available: available !== undefined ? available : true, // Default to true if not provided
        });

        createResponse(res, 201, 'Promotion added successfully', newPromotion);
    } catch (error) {
        console.error('Error adding promotion:', error);
        createResponse(res, 500, 'Failed to add promotion');
    }
};


// Update an existing promotion
exports.updatePromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;
        const updateData = req.body;

        const updatedPromotion = await Promotion.findByIdAndUpdate(
            promotionId,
            updateData,
            { new: true }
        );

        if (!updatedPromotion) return createResponse(res, 404, 'Promotion not found');
        createResponse(res, 200, 'Promotion updated successfully', updatedPromotion);
    } catch (error) {
        console.error('Error updating promotion:', error);
        createResponse(res, 500, 'Failed to update promotion');
    }
};


// Delete a promotion
exports.deletePromotion = async (req, res) => {
    try {
        const { promotionId } = req.params;

        await Promotion.findByIdAndDelete(promotionId);

        createResponse(res, 200, 'Promotion deleted successfully');
    } catch (error) {
        console.error('Error deleting promotion:', error);
        createResponse(res, 500, 'Failed to delete promotion');
    }
};


// List all promotions (Open to all users)
exports.listPromotions = async (req, res) => {
    try {
        const { showAll } = req.query; // Optionally include unavailable promotions
        const filter = showAll === 'true' ? {} : { available: true };

        const promotions = await Promotion.find(filter);

        createResponse(res, 200, 'Promotions retrieved successfully', promotions);
    } catch (error) {
        console.error('Error retrieving promotions:', error);
        createResponse(res, 500, 'Failed to retrieve promotions');
    }
};

