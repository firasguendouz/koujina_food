import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationAR from "./locales/ar/translation.json";
import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";
import translationFR from "./locales/fr/translation.json";

const resources = {
    en: { translation: translationEN },
    ar: { translation: translationAR },
    de: { translation: translationDE },
    fr: { translation: translationFR }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("language") || "en", // Load saved language or default to English
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'], // Check localStorage first
            caches: ['localStorage']
        }
    });

// Save language preference
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem("language", lng); // Save language to localStorage
});

export default i18n;
