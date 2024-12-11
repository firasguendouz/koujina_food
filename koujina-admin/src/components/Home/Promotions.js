import "./Promotions.css";

import React, { useEffect, useState } from "react";

import { api } from "../../services/api"; // Import the API module
import { useTranslation } from "react-i18next";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPromotions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.getPromotions(); // Use the correct API method
        if (response && Array.isArray(response.data)) {
          setPromotions(response.data); // Update state with the promotions array
        } else {
          throw new Error("Invalid response format"); // Handle unexpected response
        }
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError("Failed to fetch promotions. Please try again later.");
      } finally {
        setIsLoading(false); // Stop the loading spinner
      }
    };

    fetchPromotions();
  }, []);

  return (
    <section className="promotions">
      <h2>{t("home.todayspromotions")}</h2>

      {/* Display loading state */}
      {isLoading ? (
        <p>{t("home.Loadingpromotions")}</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="promotions-section">
          <h3>{t("home.promotions")}</h3>
          {promotions.length > 0 ? (
            <ul>
              {promotions.map((promotion, index) => (
                <li key={index} className="promotion-item">
                  <img
                    src={promotion.photo}
                    alt={promotion.text}
                    className="promotion-photo"
                  />
                  <span>{promotion.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No promotions available at the moment.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Promotions;
