// OrderSummary.js

import React from "react";
import { useTranslation } from "react-i18next";

const OrderSummary = ({ items, totalPrice }) => {
  const { t } = useTranslation();

  return (
    <div className="payment-summary">
      <h3>{t("payment.orderSummary")}</h3>
      <div className="payment-items">
        {items.map((item) => (
          <div key={item.id} className="payment-item">
            <img src={item.photo} alt={item.name} className="payment-item-image" />
            <div className="payment-item-details">
              <span className="payment-item-name">{item.name}</span>
              <span className="payment-item-description">{item.description}</span>
              <span className="payment-item-quantity">{t("payment.quantity")}: {item.quantity}</span>
              <span className="payment-item-price">{t("payment.price")}: {(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          </div>
        ))}
      </div>
      <div className="payment-total">
        <span>{t("payment.total")}: </span>
        <span>{totalPrice.toFixed(2)} €</span>
      </div>
    </div>
  );
};

export default OrderSummary;
