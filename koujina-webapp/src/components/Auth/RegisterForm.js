import './RegisterForm.css';

import React, { useState } from "react";

import DEFlag from "react-world-flags"; // Import the flag library
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function RegisterForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); // Exclude `+49` from state
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    // Regex for validating German phone numbers (for future use)
  //  const isValidGermanPhoneNumber = (number) => {
   //     const germanPhoneRegex = /^\d{10,13}$/; // Only digits allowed (10-13 digits after +49)
   //     return germanPhoneRegex.test(number);
   // };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const fullPhoneNumber = `+49${phoneNumber}`; // Add the +49 prefix

            // Call API directly to register the user without verification
            const response = await api.register({ name, email, phoneNumber: fullPhoneNumber, password });
            if (response.status === "success") {
                alert(t("auth.registrationComplete"));
                navigate("/menu"); // Redirect after successful registration
            } else {
                setError(response.message || t("auth.error"));
            }
        } catch (err) {
            setError(t("auth.error"));
        }

        // Future implementation for phone/email verification:
        // Uncomment below to include verification flow
        /*
        if (!isValidGermanPhoneNumber(phoneNumber)) {
            setError(t("auth.invalidPhoneNumber"));
            return;
        }

        try {
            // Step 1: Send verification code (future implementation)
            const response = await api.register({ name, email, phoneNumber: fullPhoneNumber, password });
            if (response.status === "success") {
                setStep(2); // Move to phone verification step
            } else {
                setError(response.message || t("auth.error"));
            }
        } catch (err) {
            setError(t("auth.error"));
        }
        */
    };

    return (
        <form className="auth-form" onSubmit={handleRegistrationSubmit}>
            <h2>{t("auth.register")}</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label>{t("auth.name")}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>{t("auth.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>{t("auth.phoneNumber")}</label>
                <div className="phone-input">
                    <span className="phone-prefix">
                        <DEFlag code="DE" style={{ width: 20, height: 15, marginRight: 5 }} /> +49
                    </span>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))} // Only allow digits
                        placeholder="XXXXXXXXXX"
                        required
                    />
                </div>
            </div>
            <div className="form-group">
                <label>{t("auth.password")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="auth-button">{t("auth.registerButton")}</button>
        </form>
    );
}

export default RegisterForm;
