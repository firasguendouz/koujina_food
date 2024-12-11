// DeliveryAddressForm.js

import React from "react";
import { useTranslation } from "react-i18next";

const DeliveryAddressForm = ({ deliveryAddress, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="delivery-address">
      <h3>{t("payment.deliveryAddress")}</h3>
      {["recipientName", "recipientPhone", "street", "city", "state", "postalCode", "country"].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={t(`payment.${field}`)}
          value={deliveryAddress[field]}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default DeliveryAddressForm;
