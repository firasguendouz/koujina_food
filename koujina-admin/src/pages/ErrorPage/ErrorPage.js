import "./ErrorPage.css";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ErrorPage() {
    const { t } = useTranslation();

    return (
        <div className="error-page">
            <h1>{t("errorPage.title")}</h1>
            <p>{t("errorPage.message")}</p>
            <p>{t("errorPage.description")}</p>
            <Link to="/" className="home-button">{t("errorPage.homeButton")}</Link>
        </div>
    );
}

export default ErrorPage;
