// ErrorMessage.js

import React from "react";

const ErrorMessage = ({ message, onDismiss }) => (
  <div className="error-message">
    <p>{message}</p>
    <button onClick={onDismiss} className="dismiss-button">×</button>
  </div>
);

export default ErrorMessage;
