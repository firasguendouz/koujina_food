// Payment.js

import "./Payment.css";

import { Elements } from "@stripe/react-stripe-js";
import PaymentContent from "./PaymentContent"; // Separate main content into PaymentContent
import React from "react";
import stripePromise from "../../services/stripe";

export default function PaymentWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentContent />
    </Elements>
  );
}
