// FeedbackForm.js

import './FeedbackForm.css'

import FeedbackRating from "./FeedbackRating";
import React from "react";
import { useTranslation } from "react-i18next";

const FeedbackForm = ({ feedback, onFeedbackChange, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div className="feedback-form">
      <FeedbackRating title={t("orders.feedback.deliveryTime")} field="deliveryTime" feedback={feedback} onChange={onFeedbackChange} />
      <FeedbackRating title={t("orders.feedback.taste")} field="taste" feedback={feedback} onChange={onFeedbackChange} />
      <FeedbackRating title={t("orders.feedback.presentation")} field="presentation" feedback={feedback} onChange={onFeedbackChange} />
      <textarea
        placeholder={t("orders.feedback.notes")}
        value={feedback.notes || ""}
        onChange={(e) => onFeedbackChange("notes", e.target.value)}
      />
      <button onClick={onSubmit}>{t("orders.feedback.submit")}</button>
    </div>
  );
};

export default FeedbackForm;
