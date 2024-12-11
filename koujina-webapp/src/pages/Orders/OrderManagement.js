// OrderManagement.js

import "./OrderManagement.css";

import React, { useEffect, useState } from "react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import OrderList from "../../components/OrderManagement/OrderList";
import { useOrderData } from "../../hooks/useOrderData";
import { useTranslation } from "react-i18next";

const OrderManagement = () => {
  const { t } = useTranslation();
  const { orders, loading, error, fetchOrders } = useOrderData();
  const [view, setView] = useState("actualDeliveries");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);  // Added fetchOrders as a dependency

  const filterOrders = (statusList) => {
    return orders.filter(order => statusList.includes(order.status));
  };

  const actualDeliveries = filterOrders(['pending', 'preparing', 'ready', 'out for delivery']);
  const orderHistory = filterOrders(['delivered', 'cancelled']);

  return (
    <div className="order-management">
      <h2>{t("orders.title")}</h2>

      <div className="category-buttons">
        <button onClick={() => setView("actualDeliveries")} className={view === "actualDeliveries" ? "active" : ""}>
          {t("orders.actualDeliveries")}
        </button>
        <button onClick={() => setView("orderHistory")} className={view === "orderHistory" ? "active" : ""}>
          {t("orders.orderHistory")}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p>{t("orders.fetchError")}</p>}
      {!loading && !error && (
        <>
          {view === "actualDeliveries" && actualDeliveries.length > 0 ? (
            <OrderList orders={actualDeliveries} />
          ) : view === "orderHistory" && orderHistory.length > 0 ? (
            <OrderList orders={orderHistory} />
          ) : (
            <p>{t("orders.noOrders")}</p>
          )}
        </>
      )}
    </div>
  );
};

export default OrderManagement;
