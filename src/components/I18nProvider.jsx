"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

export default function I18nProvider({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true); // Hydrate on the client
  }, []);

  useEffect(() => {
    // Define a handler that sets the direction attribute
    const handleLanguageChanged = (lng) => {
      const newDir = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("dir", newDir);
    };

    // Set the initial direction
    handleLanguageChanged(i18n.language || "en");

    // Listen to language change events from i18next
    i18n.on("languageChanged", handleLanguageChanged);

    // Cleanup listener on unmount
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  if (!ready) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}


// "use client";

// import { useEffect, useState } from "react";
// import { I18nextProvider } from "react-i18next";
// import i18n from "../i18n";

// export default function I18nProvider({ children }) {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     setReady(true); // Ensure hydration on the client
//   }, []);

//   useEffect(() => {
//     // Update document direction based on current language
//     // Note: i18n.language might initially be undefined so default to "en"
//     const currentLang = i18n.language || "en";
//     document.documentElement.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");
//   }, [i18n.language]);

//   if (!ready) return null;

//   return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
// }
