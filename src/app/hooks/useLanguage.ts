import { useEffect, useState } from "react";
import i18n from "../../i18n";

export function useLanguage() {
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Sync when language changes externally
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };
    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // No need to call setCurrentLang manually — the listener will do it
  };

  return {
    currentLang,
    changeLanguage,
  };
}
