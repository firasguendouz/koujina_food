// PaymentMethodSelector.js

import React from "react";
import { useTranslation } from "react-i18next";

const PaymentMethodSelector = ({ paymentMethod, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="payment-method">
      <label>
        <input
          type="radio"
          name="paymentMethod"
          value="cash"
          checked={paymentMethod === "cash"}
          onChange={() => onChange("cash")}
        />
        {t("payment.payWithCash")}
      </label>
      <label>
        <input
          type="radio"
          name="paymentMethod"
          value="stripe"
          checked={paymentMethod === "stripe"}
          onChange={() => onChange("stripe")}
        />
        {t("payment.payWithCard")}
      </label>
    </div>
  );
};

export default PaymentMethodSelector;
