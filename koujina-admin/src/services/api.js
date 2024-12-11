import axios from "axios";

const API_BASE_URL = "https://koujina-backend-server.onrender.com/api";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Inject Authorization token
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic for network issues
axiosInstance.interceptors.response.use(null, async (error) => {
  if (error.config && error.response && error.response.status >= 500) {
    return axiosInstance.request(error.config);
  }
  throw error;
});

// Generic API methods
const get = async (url, params = {}, options = { fullResponse: false }) => {
  try {
    const response = await axiosInstance.get(url, { params });

    // Check if response is HTML instead of JSON
    if (typeof response.data === "string" && response.data.includes("<!DOCTYPE html>")) {
      throw new Error("Received an HTML response from server. Possible ngrok issue.");
    }

    return options.fullResponse ? response : response.data;
  } catch (error) {
    console.error(`GET ${url} failed:`, error.response?.data || error.message);
    throw error;
  }
};


const post = async (url, data = {}, options = { fullResponse: false }) => {
  try {
    const response = await axiosInstance.post(url, data);
    return options.fullResponse ? response : response.data;
  } catch (error) {
    console.error(`POST ${url} failed:`, error.response?.data || error.message);
    throw error;
  }
};

const put = async (url, data = {}, options = { fullResponse: false }) => {
  try {
    const response = await axiosInstance.put(url, data);
    return options.fullResponse ? response : response.data;
  } catch (error) {
    console.error(`PUT ${url} failed:`, error.response?.data || error.message);
    throw error;
  }
};

// User-related and general API calls utilizing the helper functions
const api = {
  // User endpoints
  register: (data) => post("/users/register", data), // Send verification code
  verifyPhone: (data) => post("/users/verify-phone", data), // Verify phone number and complete registration
  login: (data) => post("/users/login", data),
  getUserProfile: () => get("/users/profile"),
  updateUserProfile: (data) => put("/users/profile/update", data),
  changePassword: (data) => put("/users/profile/change-password", data),
  uploadProfilePicture: (file) => post("/users/profile/upload-picture", file),
  getNotifications: () => get("/users/notifications"),
  markNotificationAsRead: (notificationId) => put(`/users/notifications/mark-read/${notificationId}`),
  markAllNotificationsAsRead: () => put("/users/notifications/mark-all-read"),
  getLoyaltyPoints: () => get("/users/loyalty/points"),
  redeemLoyaltyPoints: (points) => post("/users/loyalty/redeem", { points }),

  // Order endpoints
  createOrder: (data) => post("/orders/create", data),
  createPaymentIntent: (data) => post("/orders/create-payment-intent", data),
  getUserOrderHistory: () => get("/orders/history"),
  trackOrderStatus: (orderId) => get(`/orders/status/${orderId}`),
  requestRefund: (orderId, reason) => post(`/orders/request-refund/${orderId}`, { reason }),
  submitOrderFeedback: (orderId, feedback) => post(`/orders/submit-feedback`, { orderId, feedback }),

  // Plate endpoints
  getAllPlates: () => get("/users/plates/available"),
   // Promotion endpoint
   getPromotions: () => get("/admin/promotion/list"),
};

export { api };
