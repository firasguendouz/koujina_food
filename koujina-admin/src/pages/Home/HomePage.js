// Home.js

import "./Home.css";

import React, { useEffect, useState } from "react";

import Banner from "../../components/Home/Banner";
import InfoSection from "../../components/Home/InfoSection";
import Promotions from "../../components/Home/Promotions";
import TestimonialCarousel from "../../components/Home/TestimonialCarousel";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    setIsLoggedIn(checkAuthStatus());

    const handleStorageChange = () => setIsLoggedIn(checkAuthStatus());
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <main className="home">
      <Banner isLoggedIn={isLoggedIn} />
      <TestimonialCarousel />

      <Promotions />
      <InfoSection title={t("home.aboutUsTitle")} description={t("home.aboutUsDescription")} />
      <InfoSection title={t("home.whatWeCookTitle")} description={t("home.whatWeCookDescription")} />
      <InfoSection title={t("home.forWhomWeCookTitle")} description={t("home.forWhomWeCookDescription")} />
      <InfoSection title={t("home.whoWithUsTitle")} description={t("home.whoWithUsDescription")} />
      
    </main>
  );
}

export default Home;
