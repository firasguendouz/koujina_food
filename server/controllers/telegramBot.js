const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Import required models
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize the bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Utility function to send notifications to admin
const sendNotification = async (message) => {
  try {
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error.message);
  }
};

// Function to handle errors gracefully
const handleError = async (chatId, error, context = 'An error occurred') => {
  console.error(`❌ ${context}:`, error.message || error);
  await bot.sendMessage(chatId, `❌ ${context}. Please try again later.`);
};

// Map to store admin interaction states
const adminStates = new Map();

// Welcome and Help Commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
👋 Welcome Admin! 
Here are the available commands:
/help - Show available commands
/orders - View all orders
/users - View all users
/order [orderId] - View specific order details
/user [userId] - View specific user details
/update_order - Update order details
/update_user - Update user details
  `);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
📚 Available Commands:
/orders - View all orders
/users - View all users
/order [orderId] - View specific order details
/user [userId] - View specific user details
/update_order - Update order details
/update_user - Update user details

💡 Examples:
/order 12345 - View details of order with ID 12345
/update_order - Start updating an order interactively
  `);
});

// Fetch all orders with buttons for selection
bot.onText(/\/orders/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const orders = await Order.find().limit(10).sort({ 'timestamps.orderedAt': -1 });
    if (orders.length === 0) {
      return bot.sendMessage(chatId, '📦 No orders found.');
    }

    const orderButtons = orders.map((order) => [
      {
        text: `Order ${order._id} - ${order.status}`,
        callback_data: `view_order_${order._id}`,
      },
    ]);

    bot.sendMessage(chatId, '📦 Recent Orders:', {
      reply_markup: {
        inline_keyboard: orderButtons,
      },
    });
  } catch (error) {
    handleError(chatId, error, 'Failed to retrieve orders');
  }
});

// Fetch all users with buttons for selection
bot.onText(/\/users/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const users = await User.find().limit(10);
    if (users.length === 0) {
      return bot.sendMessage(chatId, '👤 No users found.');
    }

    const userButtons = users.map((user) => [
      {
        text: `${user.name} (${user.email})`,
        callback_data: `view_user_${user._id}`,
      },
    ]);

    bot.sendMessage(chatId, '👤 Users:', {
      reply_markup: {
        inline_keyboard: userButtons,
      },
    });
  } catch (error) {
    handleError(chatId, error, 'Failed to retrieve users');
  }
});

// Start interactive order update
bot.onText(/\/update_order/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const orders = await Order.find().limit(10).sort({ 'timestamps.orderedAt': -1 });
    if (orders.length === 0) {
      return bot.sendMessage(chatId, '📦 No orders found to update.');
    }

    const orderButtons = orders.map((order) => [
      {
        text: `Order ${order._id} - ${order.status}`,
        callback_data: `update_order_${order._id}`,
      },
    ]);

    bot.sendMessage(chatId, 'Select an order to update:', {
      reply_markup: {
        inline_keyboard: orderButtons,
      },
    });
  } catch (error) {
    handleError(chatId, error, 'Failed to retrieve orders for update');
  }
});

// Start interactive user update
bot.onText(/\/update_user/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const users = await User.find().limit(10);
    if (users.length === 0) {
      return bot.sendMessage(chatId, '👤 No users found to update.');
    }

    const userButtons = users.map((user) => [
      {
        text: `${user.name} (${user.email})`,
        callback_data: `update_user_${user._id}`,
      },
    ]);

    bot.sendMessage(chatId, 'Select a user to update:', {
      reply_markup: {
        inline_keyboard: userButtons,
      },
    });
  } catch (error) {
    handleError(chatId, error, 'Failed to retrieve users for update');
  }
});

// Handle callback queries from inline buttons
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  console.log('Callback Data:', data); // Log callback data for debugging

  if (data.startsWith('view_order_')) {
    const orderId = data.split('_')[2];
    await sendOrderDetails(chatId, orderId);
  } else if (data.startsWith('view_user_')) {
    const userId = data.split('_')[2];
    await sendUserDetails(chatId, userId);
  } else if (data.startsWith('update_order_')) {
    const orderId = data.split('_')[2];
    await promptOrderUpdate(chatId, orderId);
  } else if (data.startsWith('set_order_status_')) {
    const parts = data.split('_');
    const orderId = parts[3];
    const status = parts.slice(4).join('_').replace(/_/g, ' ');
    await updateOrderStatus(chatId, orderId, status);
  } else if (data.startsWith('update_user_')) {
    const userId = data.split('_')[2];
    await promptUserUpdate(chatId, userId);
  } else if (data.startsWith('set_user_status_')) {
    const parts = data.split('_');
    const userId = parts[3];
    const status = parts.slice(4).join('_').replace(/_/g, ' ');
    await updateUserStatus(chatId, userId, status);
  }
});

// Send order details
const sendOrderDetails = async (chatId, orderId) => {
  try {
    const order = await Order.findById(orderId).populate('customer chef deliveryPerson');
    if (!order) {
      return bot.sendMessage(chatId, '❌ Order not found.');
    }

    bot.sendMessage(chatId, `
📦 Order Details:
🆔 ID: ${order._id}
👤 Customer: ${order.customerName} (${order.customerEmail})
💰 Total Amount: ${order.totalAmount}
🏷️ Status: ${order.status}
🛠️ Payment Status: ${order.paymentStatus}
📋 Special Instructions: ${order.specialInstructions || 'None'}
`);
  } catch (error) {
    handleError(chatId, error, 'Failed to retrieve order details');
  }
};

// Send user details
const sendUserDetails = async (chatId, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return bot.sendMessage(chatId, '❌ User not found.');
    }

    bot.sendMessage(chatId, `
👤 User Details:
🆔 ID: ${user._id}
🧑 Name: ${user.name}
📧 Email: ${user.email}
🏷️ Status: ${user.status}
🛡️ Role: ${user.role}
`);
  } catch (error) {
    handleError(chatId, error, 'Failed to retrieve user details');
  }
};

// Prompt for order update
const promptOrderUpdate = async (chatId, orderId) => {
  try {
    const statusButtons = [
      [
        { text: 'Pending', callback_data: `set_order_status_${orderId}_pending` },
        { text: 'Preparing', callback_data: `set_order_status_${orderId}_preparing` },
        { text: 'Ready', callback_data: `set_order_status_${orderId}_ready` },
      ],
      [
        { text: 'Out for Delivery', callback_data: `set_order_status_${orderId}_out_for_delivery` },
        { text: 'Delivered', callback_data: `set_order_status_${orderId}_delivered` },
        { text: 'Cancelled', callback_data: `set_order_status_${orderId}_cancelled` },
      ],
    ];

    bot.sendMessage(chatId, 'Select new status for the order:', {
      reply_markup: {
        inline_keyboard: statusButtons,
      },
    });
  } catch (error) {
    handleError(chatId, error, 'Failed to prompt for order update');
  }
};

// Update order status
const updateOrderStatus = async (chatId, orderId, status) => {
  try {
    const validStatuses = ['pending', 'preparing', 'ready', 'out for delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return bot.sendMessage(chatId, `❌ Invalid status. Allowed statuses: ${validStatuses.join(', ')}`);
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      return bot.sendMessage(chatId, '❌ Order not found.');
    }

    bot.sendMessage(chatId, `✅ Order Updated:\n🆔 ID: ${updatedOrder._id}\n🏷️ New Status: ${updatedOrder.status}`);
  } catch (error) {
    handleError(chatId, error, 'Failed to update order status');
  }
};

// Prompt for user update
const promptUserUpdate = async (chatId, userId) => {
  try {
    const statusButtons = [
      [
        { text: 'Active', callback_data: `set_user_status_${userId}_active` },
        { text: 'Inactive', callback_data: `set_user_status_${userId}_inactive` },
      ],
    ];

    bot.sendMessage(chatId, 'Select new status for the user:', {
      reply_markup: {
        inline_keyboard: statusButtons,
      },
    });
  } catch (error) {
    handleError(chatId, error, 'Failed to prompt for user update');
  }
};

// Update user status
const updateUserStatus = async (chatId, userId, status) => {
  try {
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status)) {
      return bot.sendMessage(chatId, `❌ Invalid status. Allowed statuses: ${validStatuses.join(', ')}`);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!updatedUser) {
      return bot.sendMessage(chatId, '❌ User not found.');
    }

    bot.sendMessage(chatId, `✅ User Updated:\n🆔 ID: ${updatedUser._id}\n🏷️ New Status: ${updatedUser.status}`);
  } catch (error) {
    handleError(chatId, error, 'Failed to update user status');
  }
};

module.exports = { bot, sendNotification };
