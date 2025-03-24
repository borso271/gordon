import { useEffect, useState } from "react";
import { useConversation } from "../context/conversationContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./useLanguage";

export function useNavbarLogic() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { currentLang, changeLanguage } = useLanguage();
  const defaultIndex = currentLang === "ar" ? 1 : 0;
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const { conversationPairs, currentIndex } = useConversation();
  const { t } = useTranslation();

  const faqItems = [
    {
      label: t("about_gordon_label"),
      content: t("about_gordon_content"),
    },
    {
      label: t("gordon_services_label"),
      content: t("gordon_services_content"),
    },
    {
      label: t("contact_gordon_label"),
      content: t("contact_gordon_content"),
    },
  ];

  useEffect(() => {
    setOpenDropdown(null);
  }, [currentIndex]);

  const handleToggleDropdown = (dropdownName: string) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  return {
    openDropdown,
    setOpenDropdown,
    currentLang,
    selectedIndex,
    setSelectedIndex,
    handleToggleDropdown,
    changeLanguage,
    conversationPairs,
    faqItems,
  };
}


// import { useTranslation } from 'react-i18next';
// export function useNavbarLogic() {

//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const [currentLang, setCurrentLang] = useState<string>(i18n.language);
//   const defaultIndex = currentLang === "ar" ? 1 : 0;
//   const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
//   const { conversationPairs, currentIndex } = useConversation();
  
// const { t } = useTranslation();

//   const faqItems = [
//     {
//         label: t("about_gordon_label"),
//         content: t("about_gordon_content"),
//     },
//     {
//         label: t("gordon_services_label"),
//         content: t("gordon_services_content"),
//     },
//     {
//         label: t("contact_gordon_label"),
//         content: t("contact_gordon_content"),
//     },
// ]
//   // Close dropdown on conversation index change
//   useEffect(() => {
//     setOpenDropdown(null);
//   }, [currentIndex]);

//   // Close dropdowns when clicking outside

//   const handleToggleDropdown = (dropdownName: string) => {
//     setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const changeLanguage = (lng: string) => {
//     i18n.changeLanguage(lng);
//     setCurrentLang(lng);
//     setOpenDropdown(null);
//   };

//   return {
//     openDropdown,
//     setOpenDropdown,
//     currentLang,
//     selectedIndex,
//     setSelectedIndex,
//     handleToggleDropdown,
//     changeLanguage,
//     conversationPairs,
//     faqItems,
//   };
// }
