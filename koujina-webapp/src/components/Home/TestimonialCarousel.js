import "./TestimonialCarousel.css";

import React, { useEffect, useRef, useState } from "react";

import { api } from "../../services/api";
import { useTranslation } from "react-i18next";

const TestimonialCarousel = () => {
  const { t } = useTranslation();
  const [plates, setPlates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchPlates = async () => {
      try {
        const plates = await api.getAllPlates();
        console.log("Plates data:", plates); // Check if this is an array
        setPlates(plates);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Failed to fetch plates:", error);
        setError(t("home.errorFetchingDishes") || "Failed to load dishes."); // Update error message
        setLoading(false); // Set loading to false on error
      }
    };

    fetchPlates();
  }, [t]);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) {
    return <p>{t("loading") || "Loading..."}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (plates.length === 0) {
    return <p>{t("home.noDishesAvailable") || "No dishes available at the moment."}</p>;
  }

  return (
    <section className="testimonial-carousel">
      <h2>{t("home.availableDishesTitle") || "Available Dishes"}</h2>
      <div className="carousel-wrapper">
        <button className="carousel-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="carousel-container" ref={carouselRef}>
          {plates.map((plate) => (
            <div key={plate._id} className="carousel-item">
              <img src={plate.photo} alt={plate.name} className="plate-photo" />
              <p className="plate-name">{plate.name}</p>
              <p className="plate-description">{plate.description}</p>
            </div>
          ))}
        </div>
        <button className="carousel-button right" onClick={scrollRight}>
          &gt;
        </button>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
