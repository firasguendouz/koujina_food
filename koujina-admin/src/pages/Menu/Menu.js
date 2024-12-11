// src/components/Menu/Menu.js

import "./Menu.css";

import React, { useEffect, useState } from 'react';

import { FiPlus } from "react-icons/fi";
import { api } from "../../services/api";
import { useBasket } from "../../context/BasketContext";
import { useTranslation } from "react-i18next";

const Menu = () => {
  const { t } = useTranslation();
  const { addToBasket } = useBasket(); // Import addToBasket from context
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const response = await api.getAllPlates();
        // Sort plates so that 'available' items come first
        const sortedPlates = response.sort((a, b) => a.status === 'unavailable' ? 1 : -1);
        setPlates(sortedPlates);
      } catch (err) {
        setError(t("menu.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchPlates();
  }, [t]);

  if (loading) return <p>{t("menu.loading")}</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="menu-container">
      <h2>{t("menu.title")}</h2>
      <div className="plate-grid">
        {plates.map((plate) => (
          <div key={plate._id} className={`plate-box ${plate.status === 'unavailable' ? 'plate-disabled' : ''}`}>
            <img
              src={plate.photo || "/placeholder-image.jpg"}
              alt={plate.name}
              className="plate-image"
            />
            <div className="plate-info">
              <h3 className="plate-name">{plate.name}</h3>
              <p className="plate-description">
                {plate.description || t("menu.defaultDescription")}
              </p>
              <p className="plate-price">{t("menu.price", { price: plate.price.toFixed(2) })}</p>
            </div>
            <button
              className="add-to-basket-button"
              onClick={() => addToBasket(plate)}
              disabled={plate.status === 'unavailable'}
              title={plate.status === 'unavailable' ? t("menu.unavailable") : t("menu.addToBasket")}
            >
              <FiPlus /> {t("menu.addToBasket")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
