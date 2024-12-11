import os

# Define the project structure with additional locales for language support
project_structure = {
    "assets": {
        "images": {}
    },
    "components": {
        "Navbar": {
            "Navbar.js": 'import "./Navbar.css";\n\nfunction Navbar() {\n    return <nav>Navbar</nav>;\n}\n\nexport default Navbar;',
            "Navbar.css": "/* Navbar styles */"
        },
        "Footer": {
            "Footer.js": 'import "./Footer.css";\n\nfunction Footer() {\n    return <footer>Footer</footer>;\n}\n\nexport default Footer;',
            "Footer.css": "/* Footer styles */"
        },
        "Basket": {
            "Basket.js": 'import "./Basket.css";\n\nfunction Basket() {\n    return <div>Basket</div>;\n}\n\nexport default Basket;',
            "Basket.css": "/* Basket styles */"
        },
        "ProfileCard": {
            "ProfileCard.js": 'import "./ProfileCard.css";\n\nfunction ProfileCard() {\n    return <div>Profile Card</div>;\n}\n\nexport default ProfileCard;',
            "ProfileCard.css": "/* ProfileCard styles */"
        },
        "OrderModal": {
            "OrderModal.js": 'import "./OrderModal.css";\n\nfunction OrderModal() {\n    return <div>Order Modal</div>;\n}\n\nexport default OrderModal;',
            "OrderModal.css": "/* OrderModal styles */"
        }
    },
    "pages": {
        "Home": {
            "Home.js": 'import "./Home.css";\n\nfunction Home() {\n    return <main>Home Page</main>;\n}\n\nexport default Home;',
            "Home.css": "/* Home page styles */"
        },
        "Dishes": {
            "Dishes.js": 'import "./Dishes.css";\n\nfunction Dishes() {\n    return <div>Dishes Page</div>;\n}\n\nexport default Dishes;',
            "Dishes.css": "/* Dishes page styles */"
        },
        "Auth": {
            "Auth.js": 'import "./Auth.css";\n\nfunction Auth() {\n    return <div>Authentication Page</div>;\n}\n\nexport default Auth;',
            "Auth.css": "/* Auth page styles */"
        },
        "Order": {
            "Order.js": 'import "./Order.css";\n\nfunction Order() {\n    return <div>Order Page</div>;\n}\n\nexport default Order;',
            "Order.css": "/* Order page styles */"
        },
        "Payment": {
            "Payment.js": 'import "./Payment.css";\n\nfunction Payment() {\n    return <div>Payment Page</div>;\n}\n\nexport default Payment;',
            "Payment.css": "/* Payment page styles */"
        },
        "ErrorPage": {
            "ErrorPage.js": 'import "./ErrorPage.css";\n\nfunction ErrorPage() {\n    return <div>404 - Page Not Found</div>;\n}\n\nexport default ErrorPage;',
            "ErrorPage.css": "/* Error page styles */"
        }
    },
    "services": {
        "api.js": 'import axios from "axios";\n\nconst api = axios.create({\n    baseURL: "http://localhost:3000/api",\n    headers: { "Content-Type": "application/json" }\n});\n\nexport default api;'
    },
    "styles": {
        "index.css": "/* Global styles and resets */",
        "variables.css": "/* CSS variables for consistent theming */"
    },
    "locales": {
        "en": {
            "translation.json": '{"welcome": "Welcome to Koujina", "register": "Register", "order_now": "Order Now"}'
        },
        "ar": {
            "translation.json": '{"welcome": "مرحبًا بك في كوجينا", "register": "تسجيل", "order_now": "اطلب الآن"}'
        },
        "de": {
            "translation.json": '{"welcome": "Willkommen bei Koujina", "register": "Registrieren", "order_now": "Jetzt bestellen"}'
        },
        "fr": {
            "translation.json": '{"welcome": "Bienvenue chez Koujina", "register": "S\'inscrire", "order_now": "Commander maintenant"}'
        }
    },
    "App.js": 'import React from "react";\nimport { BrowserRouter as Router, Route, Switch } from "react-router-dom";\nimport { useTranslation } from "react-i18next";\n\nfunction App() {\n    const { t, i18n } = useTranslation();\n\n    const changeLanguage = (lng) => {\n        i18n.changeLanguage(lng);\n    };\n\n    return (\n        <Router>\n            <header>\n                <div className="language-switcher">\n                    <button onClick={() => changeLanguage("en")}>🇬🇧</button>\n                    <button onClick={() => changeLanguage("ar")}>🇸🇦</button>\n                    <button onClick={() => changeLanguage("de")}>🇩🇪</button>\n                    <button onClick={() => changeLanguage("fr")}>🇫🇷</button>\n                </div>\n            </header>\n            <main>\n                <h1>{t("welcome")}</h1>\n            </main>\n        </Router>\n    );\n}\n\nexport default App;',
    "index.js": 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\nimport "./styles/index.css";\nimport "./i18n";\n\nReactDOM.render(\n    <React.StrictMode>\n        <App />\n    </React.StrictMode>,\n    document.getElementById("root")\n);',
    "i18n.js": 'import i18n from "i18next";\nimport { initReactI18next } from "react-i18next";\nimport translationEN from "./locales/en/translation.json";\nimport translationAR from "./locales/ar/translation.json";\nimport translationDE from "./locales/de/translation.json";\nimport translationFR from "./locales/fr/translation.json";\n\nconst resources = {\n    en: { translation: translationEN },\n    ar: { translation: translationAR },\n    de: { translation: translationDE },\n    fr: { translation: translationFR }\n};\n\ni18n\n    .use(initReactI18next)\n    .init({\n        resources,\n        lng: "en",\n        fallbackLng: "en",\n        interpolation: {\n            escapeValue: false\n        }\n    });\n\nexport default i18n;'
}

# Helper function to create directories and files
def create_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            # Create a directory and recursively create subdirectories/files
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            # Create a file with the specified content and UTF-8 encoding
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)

# Define the base path for the project
base_path = "src"

# Create the project structure
create_structure(base_path, project_structure)
