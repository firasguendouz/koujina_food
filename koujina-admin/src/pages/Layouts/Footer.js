import "./Footer.css";

import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { href: "https://facebook.com/koujinaTN", icon: <FaFacebook />, label: "Facebook" },
        { href: "https://instagram.com/koujinaTN", icon: <FaInstagram />, label: "Instagram" },
        { href: "https://x.com/koujinaTN", icon: <FaTwitter />, label: "Twitter" },
    ];

    const legalLinks = [
        { to: "/PrivacyPolicy", label: t("footer.privacyPolicy") },
        { to: "/CookiesPolicy", label: t("footer.cookies") },
        { to: "/LegalMentions", label: t("footer.legalMentions") },
    ];

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Social Media Icons */}
                <div className="social-icons" aria-label="Social media links">
                    {socialLinks.map(({ href, icon, label }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="social-link"
                        >
                            {icon}
                        </a>
                    ))}
                </div>

                {/* Legal and Contact Links */}
                <div className="legal-links" aria-label="Legal information">
                    {legalLinks.map(({ to, label }) => (
                        <Link key={label} to={to} className="legal-link">
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Copyright */}
                <div className="footer-copyright">
                    © {currentYear} Koujina. {t("footer.copyright")}
                </div>
            </div>
        </footer>
    );
}

export default Footer;
