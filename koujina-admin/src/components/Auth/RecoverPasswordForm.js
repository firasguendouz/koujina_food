// RecoverPasswordForm.js

import './RecoverPasswordForm.css';

import React, { useState } from "react";

import { api } from "../../services/api";
import { useTranslation } from "react-i18next";

function RecoverPasswordForm() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.recoverPassword({ email });
            setMessage(t("auth.recoverPasswordMessage"));
        } catch {
            setMessage(t("auth.recoverPasswordError"));
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{t("auth.recoverPassword")}</h2>
            {message && <p className="info-message">{message}</p>}
            <div className="form-group">
                <label>{t("auth.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="auth-button">{t("auth.recoverPasswordButton")}</button>
        </form>
    );
}

export default RecoverPasswordForm;
