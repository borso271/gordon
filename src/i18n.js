import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import nextI18NextConfig from "../next-i18next.config.js"; // Import Next.js i18n config

i18n
  .use(HttpBackend) // Load translations from public folder
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Initialize i18next with React
  .init({
    fallbackLng: nextI18NextConfig.i18n.defaultLocale, // Default language
    supportedLngs: nextI18NextConfig.i18n.locales, // Supported languages
    debug: false,
    interpolation: {
      escapeValue: false, // Prevent XSS vulnerabilities
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"], // How to detect language
      caches: ["localStorage", "cookie"], // Save user selection
    },
  });

export default i18n;
