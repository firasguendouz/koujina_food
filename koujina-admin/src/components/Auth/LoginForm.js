// LoginForm.js

import './LoginForm.css';

import React, { useContext, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import RecoverPasswordButton from "./RecoverPasswordButton";
import { useTranslation } from "react-i18next";

function LoginForm({ onRecoverPassword }) {
    const { t } = useTranslation();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
        } catch (err) {
            setError(t("auth.error"));
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{t("auth.login")}</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label>{t("auth.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>{t("auth.password")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="auth-button">{t("auth.loginButton")}</button>
            <RecoverPasswordButton onClick={onRecoverPassword} />
        </form>
    );
}

export default LoginForm;
