const Employee = require('../models/Employee');
const Order = require('../models/Order');
const Chat = require('../models/Chat');
const SupportCase = require('../models/SupportCase');
const Feedback = require('../models/Feedback.js');
const Goal = require('../models/Goal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Utility function for consistent JSON responses
const createResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        status: status < 400 ? 'success' : 'error',
        message,
        data
    });
};


// Employee Registration
exports.registerEmployee = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if the employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return createResponse(res, 400, 'Employee already exists with this email');
        }

        // Create new employee
        const newEmployee = new Employee({
            name,
            email,
            password,
            role: role || 'employee'
        });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        newEmployee.password = await bcrypt.hash(password, salt);

        // Save the new employee to the database
        await newEmployee.save();

        // Return a success response
        createResponse(res, 201, 'Employee registered successfully', newEmployee);
    } catch (error) {
        console.error('Error registering employee:', error);
        createResponse(res, 500, 'Error registering employee');
    }
};

// Employee Login
exports.loginEmployee = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return createResponse(res, 400, 'Please provide both email and password');
    }

    try {
        // Check if the employee exists
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return createResponse(res, 400, 'Invalid email or password');
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return createResponse(res, 400, 'Invalid email or password');
        }

        // Generate JWT token
        const payload = { employeeId: employee._id, role: employee.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send success response with the token
        createResponse(res, 200, 'Login successful', { token });
    } catch (error) {
        console.error('Error logging in employee:', error);
        createResponse(res, 500, 'Error logging in');
    }
};

// Employee-Specific Routes

// Get all assigned orders with filtering options (status, priority)
exports.getAssignedOrders = async (req, res) => {
    try {
        const { status, priority } = req.query;
        const filter = { assignedTo: req.user._id };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const orders = await Order.find(filter);
        createResponse(res, 200, 'Assigned orders retrieved successfully', orders);
    } catch (error) {
        console.error('Error retrieving assigned orders:', error);
        createResponse(res, 500, 'Failed to retrieve assigned orders');
    }
};

// Update order priority (e.g., high, medium, low) for prioritization
exports.updateOrderPriority = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { priority } = req.body;

        const validPriorities = ['high', 'medium', 'low'];
        if (!validPriorities.includes(priority)) return createResponse(res, 400, 'Invalid priority');

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { priority }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order priority updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating order priority:', error);
        createResponse(res, 500, 'Failed to update order priority');
    }
};

// Update order status (e.g., "In Preparation," "Ready for Delivery")
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        createResponse(res, 500, 'Failed to update order status');
    }
};

// Assign an order to a specific delivery personnel
exports.assignOrderToDelivery = async (req, res) => {
    try {
        const { orderId, deliveryId } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { deliveryPerson: deliveryId, status: 'assigned to delivery' }, { new: true });
        if (!updatedOrder) return createResponse(res, 404, 'Order not found');

        createResponse(res, 200, 'Order assigned to delivery personnel successfully', updatedOrder);
    } catch (error) {
        console.error('Error assigning order to delivery personnel:', error);
        createResponse(res, 500, 'Failed to assign order to delivery personnel');
    }
};

// Access customer support chat sessions
exports.getChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId).populate('messages');

        if (!chat) return createResponse(res, 404, 'Chat not found');
        
        createResponse(res, 200, 'Chat retrieved successfully', chat);
    } catch (error) {
        console.error('Error retrieving chat:', error);
        createResponse(res, 500, 'Failed to retrieve chat');
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { senderId, content } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) return createResponse(res, 404, 'Chat not found');

        const message = await Message.create({ chat: chatId, sender: senderId, content });
        chat.messages.push(message);
        await chat.save();

        createResponse(res, 201, 'Message sent successfully', message);
    } catch (error) {
        console.error('Error sending message:', error);
        createResponse(res, 500, 'Failed to send message');
    }
};

// Track and manage unresolved cases with options to escalate
exports.getUnresolvedCases = async (req, res) => {
    try {
        const unresolvedCases = await SupportCase.find({ status: 'unresolved' });

        createResponse(res, 200, 'Unresolved support cases retrieved successfully', unresolvedCases);
    } catch (error) {
        console.error('Error retrieving unresolved cases:', error);
        createResponse(res, 500, 'Failed to retrieve unresolved cases');
    }
};

exports.resolveSupportCase = async (req, res) => {
    try {
        const { caseId } = req.params;

        const resolvedCase = await SupportCase.findByIdAndUpdate(caseId, { status: 'resolved' }, { new: true });
        if (!resolvedCase) return createResponse(res, 404, 'Support case not found');

        createResponse(res, 200, 'Support case resolved successfully', resolvedCase);
    } catch (error) {
        console.error('Error resolving support case:', error);
        createResponse(res, 500, 'Failed to resolve support case');
    }
};

exports.escalateSupportCase = async (req, res) => {
    try {
        const { caseId } = req.params;

        const escalatedCase = await SupportCase.findByIdAndUpdate(caseId, { status: 'escalated' }, { new: true });
        if (!escalatedCase) return createResponse(res, 404, 'Support case not found');

        createResponse(res, 200, 'Support case escalated successfully', escalatedCase);
    } catch (error) {
        console.error('Error escalating support case:', error);
        createResponse(res, 500, 'Failed to escalate support case');
    }
};

// Access and manage customer feedback
exports.getCustomerFeedback = async (req, res) => {
    try {
        const { orderId } = req.params;
        const feedback = await Feedback.findOne({ order: orderId });

        if (!feedback) return createResponse(res, 404, 'Feedback not found');
        
        createResponse(res, 200, 'Customer feedback retrieved successfully', feedback);
    } catch (error) {
        console.error('Error retrieving customer feedback:', error);
        createResponse(res, 500, 'Failed to retrieve customer feedback');
    }
};

exports.respondToFeedback = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { response } = req.body;

        const feedback = await Feedback.findOneAndUpdate({ order: orderId }, { response }, { new: true });
        if (!feedback) return createResponse(res, 404, 'Feedback not found');

        createResponse(res, 200, 'Response to customer feedback saved successfully', feedback);
    } catch (error) {
        console.error('Error responding to feedback:', error);
        createResponse(res, 500, 'Failed to respond to customer feedback');
    }
};

// View detailed performance metrics
exports.getPerformanceMetrics = async (req, res) => {
    try {
        const employeeId = req.user._id;

        const metrics = await Employee.aggregate([
            { $match: { _id: employeeId } },
            { $project: { performanceMetrics: 1 } }
        ]);

        createResponse(res, 200, 'Performance metrics retrieved successfully', metrics);
    } catch (error) {
        console.error('Error retrieving performance metrics:', error);
        createResponse(res, 500, 'Failed to retrieve performance metrics');
    }
};

// Access targeted goals assigned by admins and view progress
exports.getAssignedGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ assignedTo: req.user._id });

        createResponse(res, 200, 'Assigned goals retrieved successfully', goals);
    } catch (error) {
        console.error('Error retrieving assigned goals:', error);
        createResponse(res, 500, 'Failed to retrieve assigned goals');
    }
};

exports.updateGoalProgress = async (req, res) => {
    try {
        const { goalId } = req.params;
        const { progress } = req.body;

        const updatedGoal = await Goal.findByIdAndUpdate(goalId, { progress }, { new: true });
        if (!updatedGoal) return createResponse(res, 404, 'Goal not found');

        createResponse(res, 200, 'Goal progress updated successfully', updatedGoal);
    } catch (error) {
        console.error('Error updating goal progress:', error);
        createResponse(res, 500, 'Failed to update goal progress');
    }
};

// Admin Routes for Managing Employees

// View a list of all employees with filters (role, department, performance rating)
exports.getAllEmployees = async (req, res) => {
    try {
        const { role, department, performanceRating } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (department) filter.department = department;
        if (performanceRating) filter.performanceRating = performanceRating;

        const employees = await Employee.find(filter);
        createResponse(res, 200, 'Employees retrieved successfully', employees);
    } catch (error) {
        console.error('Error retrieving employees:', error);
        createResponse(res, 500, 'Failed to retrieve employees');
    }
};

// Assign and manage individual goals for employees
exports.assignGoal = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { goal, target } = req.body;

        const newGoal = await Goal.create({ assignedTo: employeeId, goal, target });
        createResponse(res, 201, 'Goal assigned successfully', newGoal);
    } catch (error) {
        console.error('Error assigning goal:', error);
        createResponse(res, 500, 'Failed to assign goal');
    }
};

exports.updateEmployeeGoal = async (req, res) => {
    try {
        const { employeeId, goalId } = req.params;
        const { goal, target, progress } = req.body;

        const updatedGoal = await Goal.findOneAndUpdate({ _id: goalId, assignedTo: employeeId }, { goal, target, progress }, { new: true });
        if (!updatedGoal) return createResponse(res, 404, 'Goal not found');

        createResponse(res, 200, 'Goal updated successfully', updatedGoal);
    } catch (error) {
        console.error('Error updating employee goal:', error);
        createResponse(res, 500, 'Failed to update employee goal');
    }
};

// Update employee details (Admin only)
exports.updateEmployeeDetails = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, req.body, { new: true });

        if (!updatedEmployee) return createResponse(res, 404, 'Employee not found');

        createResponse(res, 200, 'Employee details updated successfully', updatedEmployee);
    } catch (error) {
        console.error('Error updating employee details:', error);
        createResponse(res, 500, 'Failed to update employee details');
    }
};

// Remove an employee from the system (Admin only)
exports.deleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        await Employee.findByIdAndDelete(employeeId);
        createResponse(res, 200, 'Employee deleted successfully');
    } catch (error) {
        console.error('Error deleting employee:', error);
        createResponse(res, 500, 'Failed to delete employee');
    }
};

// View detailed performance of a specific employee (Admin only)
exports.getEmployeePerformance = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const performance = await Employee.findById(employeeId, 'performanceMetrics');
        if (!performance) return createResponse(res, 404, 'Employee not found');

        createResponse(res, 200, 'Employee performance metrics retrieved successfully', performance);
    } catch (error) {
        console.error('Error retrieving employee performance:', error);
        createResponse(res, 500, 'Failed to retrieve employee performance');
    }
};

// Generate a comprehensive performance report with customizable time range and metrics (Admin only)
exports.generatePerformanceReport = async (req, res) => {
    try {
        const { startDate, endDate, metrics } = req.query;

        // Example report generation logic
        const report = await Employee.aggregate([
            { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
            { $project: { performanceMetrics: 1, metrics } }
        ]);

        createResponse(res, 200, 'Performance report generated successfully', report);
    } catch (error) {
        console.error('Error generating performance report:', error);
        createResponse(res, 500, 'Failed to generate performance report');
    }
};
