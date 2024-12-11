// Auth.js

import "./Auth.css";

import React, { useState } from "react";

import LoginForm from "../../components/Auth/LoginForm";
import RecoverPasswordForm from "../../components/Auth/RecoverPasswordForm";
import RegisterForm from "../../components/Auth/RegisterForm";
import { useTranslation } from "react-i18next";

function Auth() {
    const { t } = useTranslation();
    const [view, setView] = useState("login"); // 'login', 'register', or 'recover'

    const isLogin = view === "login";
    const isRegister = view === "register";
    const isRecovering = view === "recover";

    return (
        <div className="auth-page">

            <div className="auth-container">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? "active" : ""}`}
                        onClick={() => setView("login")}
                        aria-pressed={isLogin}
                    >
                        {t("auth.login")}
                    </button>
                    <button
                        className={`auth-tab ${isRegister ? "active" : ""}`}
                        onClick={() => setView("register")}
                        aria-pressed={isRegister}
                    >
                        {t("auth.register")}
                    </button>
                </div>

                {isRecovering ? (
                    <RecoverPasswordForm onCancel={() => setView("login")} />
                ) : isLogin ? (
                    <LoginForm onRecoverPassword={() => setView("recover")} />
                ) : (
                    <RegisterForm />
                )}
            </div>
        </div>
    );
}

export default Auth;
