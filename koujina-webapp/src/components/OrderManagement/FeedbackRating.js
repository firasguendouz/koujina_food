// FeedbackRating.js

import './FeedbackRating.css'

import React from "react";

const FeedbackRating = ({ title, field, feedback, onChange }) => {
  return (
    <div className="rating-container">
      <p>{title}:</p>
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={`${field}-${i + 1}`}>
            <input
              type="radio"
              id={`${field}-star-${i + 1}`}
              name={field}
              value={i + 1}
              checked={feedback[field] === i + 1}
              onChange={() => onChange(field, i + 1)}
            />
            <label htmlFor={`${field}-star-${i + 1}`}>★</label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FeedbackRating;
