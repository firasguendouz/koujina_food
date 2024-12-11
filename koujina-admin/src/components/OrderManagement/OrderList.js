// OrderList.js

import './OrderList.css'

import OrderCard from "./OrderCard";
import React from "react";

const OrderList = ({ orders }) => {
  return (
    <div className="order-list">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
