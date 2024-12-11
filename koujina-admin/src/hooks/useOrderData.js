// useOrderData.js

import { useCallback, useState } from "react";

import { api } from "../services/api";

export const useOrderData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUserOrderHistory();
      setOrders(response.data.sort((a, b) => new Date(b.timestamps.orderedAt) - new Date(a.timestamps.orderedAt)));
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, loading, error, fetchOrders };
};
