// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const database = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chefRoutes = require('./routes/chefRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const supplementRoutes = require('./routes/supplementRoutes');
const chatRoutes = require('./routes/chatRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Database connection
database.connect();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

// Custom headers
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'KoujinaApp');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// Route setup
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/employee', employeeRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
