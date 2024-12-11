const mongoose = require('mongoose');
require('dotenv').config(); // To access environment variables from .env file

// MongoDB connection string
const dbURI = process.env.DATABASE_URL;

const connect = () => {
    mongoose
        .connect(dbURI, { useNewUrlParser: true })  // Removed useUnifiedTopology
        .then(() => {
            console.log('[Database] Connected successfully');
        })
        .catch((err) => {
            console.error('[Database] Connection failed', err);
            process.exit(1); // Exit process with failure
        });
};

module.exports = { connect };
