// orderUtils.js

export const getStatusProgress = (status, t) => {
    const progressMap = {
      pending: { width: "20%", label: t("orders.status.pending") },
      preparing: { width: "40%", label: t("orders.status.preparing") },
      ready: { width: "60%", label: t("orders.status.ready") },
      "out for delivery": { width: "80%", label: t("orders.status.outForDelivery") },
      delivered: { width: "100%", label: t("orders.status.delivered") },
      cancelled: { width: "100%", label: t("orders.status.cancelled") },
    };
    return progressMap[status] || { width: "0%", label: "" };
  };
  