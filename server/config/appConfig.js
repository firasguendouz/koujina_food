// config/appConfig.js

module.exports = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    tokenExpiry: process.env.JWT_EXPIRY || '1h',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Koujina',

};
