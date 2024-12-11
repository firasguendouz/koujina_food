// RecoverPasswordButton.js

import './RecoverPasswordButton.css';

import React from "react";
import { useTranslation } from "react-i18next";

function RecoverPasswordButton({ onClick }) {
    const { t } = useTranslation();
    return (
        <button type="button" onClick={onClick} className="recover-password-button">
            {t("auth.recoverPassword")}
        </button>
    );
}

export default RecoverPasswordButton;
