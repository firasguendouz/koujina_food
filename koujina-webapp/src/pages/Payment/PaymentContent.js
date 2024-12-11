// PaymentContent.js

import './PaymentContent.css';

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

import DeliveryAddressForm from "../../components/Payment/DeliveryAddressForm";
import OrderSummary from "../../components/Payment/OrderSummary";
import PaymentMethodSelector from "../../components/Payment/PaymentMethodSelector";
import StripeCardInput from "../../components/Payment/StripeCardInput";
import { api } from "../../services/api";
import { useBasket } from "../../context/BasketContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentContent = () => {
  const { t } = useTranslation();
  const { items = [], clearBasket } = useBasket();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [clientSecret, setClientSecret] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    recipientName: "",
    recipientPhone: "",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate("/menu");
    } else {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalPrice(total);
      createPaymentIntent(total);
    }
  }, [items, navigate]);

  const createPaymentIntent = async (total) => {
    try {
      const { data } = await api.createPaymentIntent({ totalAmount: total });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent", error);
    }
  };

  const handleOrder = async (paymentStatus) => {
    try {
      const orderData = {
        items: items.map((item) => ({
          plateId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
        deliveryAddress,
        paymentMethod,
        paymentStatus,
      };
      const response = await api.createOrder(orderData);
      clearBasket();
      navigate("/order-success", { state: { order: response.data } });
    } catch (error) {
      console.error("Error creating order", error);
    }
  };

  const handleStripePayment = async () => {
    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      console.error("Stripe payment error", error);
      alert(t("payment.failed"));
    } else if (paymentIntent.status === "succeeded") {
      handleOrder("paid");
    }
  };

  const handleProceedToPayment = () => {
    if (Object.values(deliveryAddress).some((value) => !value)) {
      alert(t("payment.fillAddress"));
      return;
    }
    if (paymentMethod === "stripe") {
      handleStripePayment();
    } else {
      handleOrder("unpaid");
    }
  };

  return (
    <div className="payment">
      <h2>{t("payment.title")}</h2>
      <OrderSummary items={items} totalPrice={totalPrice} />
      <DeliveryAddressForm deliveryAddress={deliveryAddress} onChange={handleAddressChange} />
      <PaymentMethodSelector paymentMethod={paymentMethod} onChange={setPaymentMethod} />
      {paymentMethod === "stripe" && <StripeCardInput />}
      <button className="payment-button" onClick={handleProceedToPayment}>
        {t("payment.proceedToPayment")}
      </button>
    </div>
  );
};

export default PaymentContent;
