// src/components/Basket/Basket.js

import "./Basket.css";

import React, { useContext } from "react";

import { AuthContext } from "../../../context/AuthContext"; // Import AuthContext to check login status
import { useBasket } from "../../../context/BasketContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Basket() {
    const { t } = useTranslation();
    const { items, updateQuantity, clearBasket } = useBasket();
    const { isLoggedIn } = useContext(AuthContext); // Access isLoggedIn from AuthContext
    const navigate = useNavigate();

    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const handleProceedToPayment = () => {
        if (isLoggedIn) {
            navigate("/Payment"); // Redirect to Payment page if logged in
        } else {
            navigate("/Auth"); // Redirect to login page if not logged in
        }
    };

    return (
        <div className="basket">
            <h2>{t("basket.title")}</h2>
            <div className="basket-items">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="basket-item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">{item.price.toFixed(2)} €</span>
                            <div className="item-quantity">
                                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{t("basket.empty")}</p>
                )}
            </div>
            <div className="basket-total">
                <span>{t("basket.total")}</span>
                <span>{totalPrice} €</span>
            </div>
            <button className="clear-basket-button" onClick={clearBasket}>
                {t("basket.clearBasket")}
            </button>
            <button className="basket-button" onClick={handleProceedToPayment}>
                {t("basket.goToPayment")}
            </button>
        </div>
    );
}

export default Basket;
