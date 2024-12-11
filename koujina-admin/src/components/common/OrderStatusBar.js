import './OrderStatusBar.css';

import React from "react";
import { getStatusProgress } from "../../utils/orderUtils";
import { useTranslation } from "react-i18next";

const OrderStatusBar = ({ status, isRefunded }) => {
  const { t } = useTranslation();
  const { width, label } = getStatusProgress(status, t);

  return (
    <div className="order-status-bar">
      {isRefunded ? (
        <div className="status-bar refunded">
          <span>{t("orders.status.refunded")}</span>
        </div>
      ) : (
        <div className="status-bar">
          <div className="progress" style={{ width }}></div>
          <p className="status-label">{label}</p>
        </div>
      )}
      <div className="status-word">
        <span>{label}</span>
      </div>
    </div>
  );
};

export default OrderStatusBar;
