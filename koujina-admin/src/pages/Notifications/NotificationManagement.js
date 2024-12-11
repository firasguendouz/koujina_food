import React, { useEffect, useState } from 'react';

import { api } from "../../services/api";
import { useTranslation } from "react-i18next";

const NotificationManagement = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.getNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>{t("notifications.title")}</h2>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id}>
            <p>{notification.message}</p>
          </div>
        ))
      ) : (
        <p>{t("notifications.noNotifications")}</p>
      )}
    </div>
  );
};

export default NotificationManagement;
