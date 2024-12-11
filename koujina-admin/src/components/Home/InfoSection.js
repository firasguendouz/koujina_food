// InfoSection.js

import "./InfoSection.css";

import React from "react";

const InfoSection = ({ icon, title, description }) => {
  return (
    <section className="info-section">
      <i className={`info-icon ${icon}`}></i>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};

export default InfoSection;
