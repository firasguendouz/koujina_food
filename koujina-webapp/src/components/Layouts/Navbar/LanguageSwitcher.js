import "./LanguageSwitcher.css";

import React, { useEffect, useRef } from "react";

import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function LanguageSwitcher({ showDropdown, toggleDropdown }) {
  const { t, i18n } = useTranslation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    const handleOutsideClick = (event) => {
      // Check if the click is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        toggleDropdown(false); // Close the dropdown after selecting a language
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handleOutsideClick);
    };


    
  }, [i18n,showDropdown, toggleDropdown]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    toggleDropdown(false); // Close the dropdown after selecting a language

  };




  
  return (
    <div className="language-switcher">
      <button
        onClick={toggleDropdown}
        className="language-button"
        aria-expanded={showDropdown}
        aria-label="Select Language"
      >
        🌐 <FiChevronDown />
      </button>
      {showDropdown && (
        <div className="language-dropdown" role="menu">
          {["en", "ar", "de", "fr"].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              aria-label={t(`languages.${lang}`)}
            >
              {t(`languages.${lang}_flag`)} {t(`languages.${lang}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
