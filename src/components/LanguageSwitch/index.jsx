"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "../SecondaryButton";

function LanguageSwitch({ items }) {
  const { i18n } = useTranslation();
  const languages = ["en", "ar"];

  // Initialize index based on current language (default to "en")
  const initialIndex = languages.indexOf(i18n.language) !== -1 ? languages.indexOf(i18n.language) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // Icon on left for LTR (English), on right for RTL (Arabic)
  const [iconLeft, setIconLeft] = useState(i18n.language !== "ar");

  useEffect(() => {
    const index = languages.indexOf(i18n.language);
    setCurrentIndex(index !== -1 ? index : 0);
    setIconLeft(i18n.language !== "ar");
  }, [i18n.language]);

  const toggleItem = async () => {
    const nextIndex = currentIndex === 0 ? 1 : 0;
    const newLanguage = languages[nextIndex];
    await i18n.changeLanguage(newLanguage); // Await to ensure language change
    setCurrentIndex(nextIndex);
    setIconLeft(newLanguage !== "ar");
    localStorage.setItem("language", newLanguage);
  };

  const currentItem = items[currentIndex];

  return (
    <div>
      <SecondaryButton
        btn_text={currentItem.btn_text}
        logo_path={currentItem.logo_path}
        onClick={toggleItem}
        iconLeft={iconLeft}
        
      />
    </div>
  );
}

export default LanguageSwitch;


// "use client"; // Ensure it's a client component

// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { SecondaryButton } from "../SecondaryButton";

// function LanguageSwitch({ items }) {

//   const { i18n } = useTranslation();
//   const languages = ["en", "ar"]; // Define available languages
  
//   const [currentIndex, setCurrentIndex] = useState( languages.indexOf(i18n.language) ||0); //||
//   const [iconLeft, setIconLeft] = useState(true); // Track icon position

//   useEffect(() => {
//     // Ensure selected language is updated when `i18next` changes
//     const index = languages.indexOf(i18n.language);
//     setCurrentIndex(index !== -1 ? index : 0); // If not found, set to 0
//   }, [i18n.language]);
  
//   const toggleItem = () => {
//     const nextIndex = currentIndex === 0 ? 1 : 0;
//     const newLanguage = languages[nextIndex];
//     // Change the language in i18n
//     i18n.changeLanguage(newLanguage);
//     setCurrentIndex(nextIndex);
//     setIconLeft((prev) => !prev); // Toggle icon position
//     localStorage.setItem("language", newLanguage);
//   };

//   const currentItem = items[currentIndex];

//   return (
//     <div>
//       <SecondaryButton
//         btn_text={currentItem.btn_text}
//         logo_path={currentItem.logo_path}
//         onClick={toggleItem}
//         iconLeft={iconLeft}
//         backgroundColor="white"
//         textColor="var(--dark)"
//         paddingX="12px"
//         paddingY="24px"
//       />
//     </div>
//   );
// }

// export default LanguageSwitch;
