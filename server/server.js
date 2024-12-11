const http = require('http');
const app = require('./app');
const logger = require('./utils/logger'); // Assuming logger is available in utils/logger.js
const { bot } = require('./controllers/telegramBot'); // Import the bot

const PORT = process.env.PORT || 3001;

// Create the server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
    logger.info(`[${new Date().toISOString()}] Server running on port ${PORT}`);

    // Start the Telegram bot
    logger.info(`[${new Date().toISOString()}] Telegram bot is starting...`);
    bot.on('polling_error', (error) => {
        logger.error(`Telegram Bot Polling Error: ${error.message}`);
    });
});

// Graceful shutdown function
const gracefulShutdown = (signal) => {
    logger.info(`\n[${new Date().toISOString()}] Received ${signal}. Shutting down gracefully...`);

    // Stop the Telegram bot
    bot.stopPolling()
        .then(() => logger.info(`[${new Date().toISOString()}] Telegram bot stopped`))
        .catch((error) => logger.error(`Error stopping Telegram bot: ${error.message}`));

    server.close(() => {
        logger.info(`[${new Date().toISOString()}] Server closed`);
        process.exit(0);
    });
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Catch unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    server.close(() => process.exit(1));
});
