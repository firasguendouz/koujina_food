// Banner.js

import "./Banner.css";

import { Link } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";

const Banner = ({ isLoggedIn }) => {
  const { t } = useTranslation();

  return (
    <section className="banner">
      <div className="banner-buttons">
        {!isLoggedIn && (
          <Link to="/auth" className="banner-button">
            {t("home.register")}
          </Link>
        )}
        <Link to={isLoggedIn ? "/orderManagement" : "/menu"} className="banner-button">
          {isLoggedIn ? t("navbar.ordersManagement") : t("home.orderNow")}
        </Link>
      </div>
    </section>
  );
};

export default Banner;
