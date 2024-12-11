// src/pages/OrderSuccess/OrderSuccess.js

import "./OrderSuccess.css";

import { useLocation, useNavigate } from "react-router-dom";

import React from "react";
import { useTranslation } from "react-i18next";

const OrderSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const handleReturnToMenu = () => {
    navigate("/menu");
  };

  if (!order) {
    return <p>{t("orderSuccess.errorMessage")}</p>;
  }

  return (
    <div className="order-success">
      <h2>{t("orderSuccess.title")}</h2>
      <div className="order-details">
        <h3>{t("orderSuccess.orderDetails")}</h3>
        <p><strong>{t("orderSuccess.orderId")}:</strong> {order._id}</p>
        <p><strong>{t("orderSuccess.recipient")}:</strong> {order.customerName}</p>
        <p><strong>{t("orderSuccess.email")}:</strong> {order.customerEmail}</p>
        <p><strong>{t("orderSuccess.deliveryAddress")}:</strong> {`${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}, ${order.deliveryAddress.postalCode}, ${order.deliveryAddress.country}`}</p>
        <p><strong>{t("orderSuccess.orderDate")}:</strong> {new Date(order.timestamps.orderedAt).toLocaleString()}</p>
      </div>
      <div className="order-items">
        <h3>{t("orderSuccess.items")}</h3>
        <ul>
          {order.items.map((item) => (
            <li key={item._id}>{item.name} x {item.quantity} - {(item.price * item.quantity).toFixed(2)} €</li>
          ))}
        </ul>
        <p><strong>{t("orderSuccess.totalAmount")}:</strong> {order.totalAmount.toFixed(2)} €</p>
      </div>
      <div className="order-payment">
        <h3>{t("orderSuccess.paymentInfo")}</h3>
        <p><strong>{t("orderSuccess.paymentMethod")}:</strong> {order.paymentMethod}</p>
        <p><strong>{t("orderSuccess.paymentStatus")}:</strong> {order.paymentStatus === "paid" ? t("orderSuccess.paid") : t("orderSuccess.unpaid")}</p>
      </div>
      <button onClick={handleReturnToMenu} className="return-button">{t("orderSuccess.returnToMenu")}</button>
    </div>
  );
};

export default OrderSuccess;
