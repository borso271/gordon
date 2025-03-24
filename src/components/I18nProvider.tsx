"use client";

import { useEffect, useState, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

interface I18nProviderProps {
  children: ReactNode;
}
export default function I18nProvider({ children }: I18nProviderProps) {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    console.log("🔍 i18n language:", i18n.language);
    console.log("🌍 Loaded namespaces:", i18n.options.ns);
    console.log("📂 i18n resource store:", i18n.store.data);
  }, []);

  
  useEffect(() => {
    setReady(true); // Hydrate on the client
  }, []);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
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
