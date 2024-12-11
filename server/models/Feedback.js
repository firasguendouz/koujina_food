// models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    plateId: { type: mongoose.Schema.Types.ObjectId, ref: "Plate", required: true },
    deliveryTime: { type: Number, required: true },
    taste: { type: Number, required: true },
    presentation: { type: Number, required: true },
    notes: { type: String, default: "" }
}, { collection: "feedbacks" });

module.exports = mongoose.model("Feedback", feedbackSchema);
