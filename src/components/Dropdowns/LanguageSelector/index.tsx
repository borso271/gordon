import React from "react";
import { useTranslation } from "react-i18next";
import DropdownMenu from "../DropdownMenu";
import DropdownButton from "../../Buttons/DropdownButton";
import styles from "./LanguageSelector.module.css"; // Create or reuse styles


interface LanguageSelectorDropdownProps {
  openDropdown: string | null;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleLanguageChange: (lang: string) => void;
  handleToggleDropdown: (dropdownName: string) => void;
}

const LanguageSelectorDropdown: React.FC<LanguageSelectorDropdownProps> = ({
  openDropdown,
  selectedIndex,
  setSelectedIndex,
  handleLanguageChange,
  handleToggleDropdown,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = i18n.dir() === "rtl";

  const english_label_text = "EN";
  const arabic_label_text = "AR";

  return (
    <div className={styles.dropdownContainer}>
      <DropdownButton
        text={currentLang.toUpperCase()}
        leftIcon={currentLang === "ar" ? "arabic" : "usa"}
        rightIcon={openDropdown === "language" ? "chevron_up" : "chevron_down"}
        className={openDropdown === "language" ? "activeButton" : undefined}
        onClick={() => handleToggleDropdown("language")}
      />

      {openDropdown === "language" && (
        <DropdownMenu
          items={[
            {
              icon: "usa",
              label: english_label_text,
              onClick: () => handleLanguageChange("en"),
            },
            {
              icon: "arabic",
              label: arabic_label_text,
              onClick: () => handleLanguageChange("ar"),
            },
          ]}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          isOpen={true}
          {...(isRTL ? { left: "0" } : { right: "0" })}
        />
      )}
    </div>
  );
};

export default LanguageSelectorDropdown;
