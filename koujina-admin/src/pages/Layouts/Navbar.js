// src/components/Navbar/Navbar.js

import "./Navbar.css";

import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import React, { useContext, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import BasketDropdown from "../../components/Layouts/Navbar/BasketDropdown";
import LanguageSwitcher from "../../components/Layouts/Navbar/LanguageSwitcher";
import { Link } from "react-router-dom";
import ThemeToggle from "../../components/Layouts/Navbar/ThemeToggle";
import { useBasket } from "../../context/BasketContext"; // Import useBasket
import { useTranslation } from "react-i18next";

function Navbar({ isDarkMode, toggleTheme, basketItems, onQuantityChange, onCheckout }) {
    const { t } = useTranslation();
    const { isLoggedIn, logout } = useContext(AuthContext);  // Using AuthContext here
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDropdown, setShowDropdown] = useState({
        languageDropdown: false,
        basketDropdown: false,
        profileDropdown: false,
    });
    const {  totalCount } = useBasket(); // Get items and totalCount from BasketContext

    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = (key) => setShowDropdown((prev) => ({ ...prev, [key]: !prev[key] }));

    const handleLogout = () => {
        logout();
        toggleSidebar();  
    };

    return (
<div className="sticky-header">

<button className="hamburger-menu" onClick={toggleSidebar} aria-label="Toggle menu">
                <FiMenu />

            </button>

            <div className="navbar-logo">
            
                <Link to="/" aria-label="Home">
                
                <img src="/Koujina-logo.svg" alt="Logo" />
                </Link>
                
            </div>

            <div className={`sidebar-overlay ${showSidebar ? "active" : ""}`} onClick={toggleSidebar} />
            
            <nav className={`sidebar ${showSidebar ? "open" : ""}`} aria-label="Sidebar Navigation">
                <button className="close-sidebar" onClick={toggleSidebar} aria-label="Close menu">
                    <FiX />
                </button>

                <div className="sidebar-content">
                    <div className="sidebar-utilities">
                        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                        
                    </div>
                    {isLoggedIn ? (
                        <>
                            <Link to="/orderManagement" onClick={toggleSidebar}>{t("navbar.ordersManagement")}</Link>
                            <Link to="/notificationManagement" onClick={toggleSidebar} className="sidebar-icon">
                                <span>{t("navbar.notificationsManagement")}</span>
                            </Link>
                            <Link to="/profileManagement" onClick={toggleSidebar} className="sidebar-icon">
                                <span>{t("navbar.profileManagement")}</span>
                            </Link>
                            <Link to="/" onClick={handleLogout} className="sidebar-icon">
                                <span>{t("navbar.logout")}</span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/auth" onClick={toggleSidebar} className="sidebar-icon">
                            <FiLogIn />
                            <span>{t("navbar.login")}</span>
                        </Link>
                    )}
                    <div className="sidebar-links">
                        <Link to="/" onClick={toggleSidebar}>{t("navbar.home")}</Link>
                        <Link to="/menu" onClick={toggleSidebar}>{t("navbar.menu")}</Link>
                    </div>
                </div>
                
            </nav>

            <BasketDropdown
                showDropdown={showDropdown.basketDropdown}
                toggleDropdown={() => toggleDropdown("basketDropdown")}
                basketItems={basketItems}
                onQuantityChange={onQuantityChange}
                onCheckout={onCheckout}
            />
            {totalCount > 0 && <span className="basket-count">{totalCount}</span>}
            
            <div className="stripe">
            <div  className="lang"><LanguageSwitcher
      showDropdown={showDropdown.languageDropdown}
      toggleDropdown={(state) =>
        setShowDropdown((prev) => ({ ...prev, languageDropdown: state }))
      }
    /></div>
                </div>
        </div>
    );
}

export default Navbar;
