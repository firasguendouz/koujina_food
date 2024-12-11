// OrderCard.js

import './OrderCard.css'

import React, { useState } from "react";

import FeedbackForm from "./FeedbackForm";
import OrderStatusBar from "../common/OrderStatusBar";
import { api } from "../../services/api";
import { useTranslation } from "react-i18next";

const OrderCard = ({ order }) => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState({});
  const isRefunded = order.paymentStatus === "refunded";
  const rewardPoints = order.items.length; // Assuming 1 RP per item

  const handleFeedbackChange = (field, value) => {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitFeedback = async () => {
    try {
      await api.submitOrderFeedback(order._id, { feedback });
      alert(t("orders.feedback.success"));
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(t("orders.feedback.error"));
    }
  };

  return (
    <div className="order-card">
      <h3>{t("orders.orderId")}: {order._id}</h3>
      <span className="rp-points">{t("orders.rp")}: {rewardPoints} RP</span>

      <p>
        {t("orders.customerName")}: {order.customerName} ({order.customerEmail})
      </p>
      <p>{t("orders.orderedAt")}: {new Date(order.timestamps.orderedAt).toLocaleString()}</p>

      <div className="order-items">
        <h4>{t("orders.items")}:</h4>
        {order.items.map((item) => (
          <div key={item._id} className="order-item">
            <span>{item.name} x {item.quantity}</span>
            <span>{item.price.toFixed(2)} €</span>
          </div>
        ))}
      </div>

      <p>{t("orders.totalAmount")}: {order.totalAmount.toFixed(2)} €</p>
      <p>
        {t(`orders.paymentStatus.${order.paymentStatus}`)} {t(`orders.paymentMethod.${order.paymentMethod}`)}
      </p>

      <OrderStatusBar status={order.status} isRefunded={isRefunded} />

      <div className="order-address">
        <h4>{t("orders.deliveryAddress")}</h4>
        <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
        <p>{order.deliveryAddress.state}, {order.deliveryAddress.postalCode}, {order.deliveryAddress.country}</p>
        <p>{t("orders.recipientName")}: {order.deliveryAddress.recipientName}</p>
        <p>{t("orders.recipientPhone")}: {order.deliveryAddress.recipientPhone}</p>
      </div>

      {order.specialInstructions && (
        <p className="special-instructions">
          {t("orders.specialInstructions")}: {order.specialInstructions}
        </p>
      )}

      {order.status === "delivered" && (
        <div className="feedback-section">
          <h4>{t("orders.feedbackTitle")}</h4>
          <FeedbackForm
            feedback={feedback}
            onFeedbackChange={handleFeedbackChange}
            onSubmit={handleSubmitFeedback}
          />
        </div>
      )}
    </div>
  );
};

export default OrderCard;
