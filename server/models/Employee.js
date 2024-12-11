const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false // Exclude password from queries by default
    },
    contactNumber: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['support', 'operations', 'manager'],
        default: 'support'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    permissions: {
        type: [String], // Specific permissions assigned, e.g., ['order_management', 'user_support']
        default: []
    },
    tasksAssigned: [
        {
            taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
            assignedAt: { type: Date, default: Date.now },
            status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' }
        }
    ],
    performanceMetrics: {
        tasksCompleted: { type: Number, default: 0 },
        avgTaskCompletionTime: { type: Number, default: 0 }, // in minutes
        customerSatisfactionRating: { type: Number, default: 0 } // rating out of 5
    },
    activityLogs: [
        {
            action: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            details: {
                type: String
            }
        }
    ],
    lastLogin: {
        type: Date
    },
    accountCreated: {
        type: Date,
        default: Date.now
    }
});

// Static Methods

EmployeeSchema.statics.logActivity = async function(employeeId, action, details = '') {
    const employee = await this.findById(employeeId);
    if (employee) {
        employee.activityLogs.push({ action, details });
        await employee.save();
    }
};

// Instance Methods

EmployeeSchema.methods.updateStatus = function(status) {
    this.status = status;
    return this.save();
};

EmployeeSchema.methods.assignTask = function(taskId) {
    this.tasksAssigned.push({ taskId, status: 'pending' });
    return this.save();
};

EmployeeSchema.methods.completeTask = function(taskId, completionTime) {
    const task = this.tasksAssigned.find(task => task.taskId.toString() === taskId.toString());
    if (task) {
        task.status = 'completed';
        
        // Update performance metrics
        this.performanceMetrics.tasksCompleted += 1;
        this.performanceMetrics.avgTaskCompletionTime = 
            ((this.performanceMetrics.avgTaskCompletionTime * (this.performanceMetrics.tasksCompleted - 1)) + completionTime) / 
            this.performanceMetrics.tasksCompleted;
        
        return this.save();
    }
    throw new Error('Task not found');
};

// Pre-save Hook for Password Hashing
EmployeeSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);
