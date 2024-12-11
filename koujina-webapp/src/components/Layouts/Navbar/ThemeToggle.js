import "./ThemeToggle.css";

import { FiMoon, FiSun } from "react-icons/fi";
import React, { useEffect, useState } from "react";

function ThemeToggle() {
  // Initial theme from localStorage or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // Detect system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  // Update theme when `isDarkMode` changes
  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  // Toggle function
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <FiSun /> : <FiMoon />}
      <span className="theme-label">{isDarkMode ? "" : ""}</span>
    </button>
  );
}

export default ThemeToggle;
