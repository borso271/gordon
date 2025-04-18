import React, {useEffect } from "react";
import styles from "./Navbar.module.css";

import DropdownMenu from "../../Dropdowns/DropdownMenu"; // Import the dropdown menu component

import MobileNavigation from "../../MobileNavigation";
import DropdownButton from "../../Buttons/DropdownButton";
import { useNavbarLogic } from "../../../app/hooks/useNavbarLogic";
import LanguageSelectorDropdown from "../../Dropdowns/LanguageSelector";
import { useLanguage } from "../../../app/hooks/useLanguage";
import Icon from "../../Icons/Icon";
import { useOverlay } from "../../../app/context/overlayContext";
import { useTranslation } from "react-i18next";
import { useBuySellModal } from "../../../app/context/buySellModalContext";


// import PrimaryButton from "../../Buttons/PrimaryButton";
import Button3 from "../../Buttons/Button3";
const Navbar: React.FC = () => {
  const { t,i18n} = useTranslation();

const isRTL = i18n.dir() === "rtl";

  const { setOverlay } = useOverlay();
  const english_label_text = t("english")
  const arabic_label_text = t("arabic")

  // const [showBuySellModal, setShowBuySellModal] = useState(false);

  const { showModal } = useBuySellModal();
  
  const {
    openDropdown,
    selectedIndex,
    setSelectedIndex,
    handleToggleDropdown,
    changeLanguage,
    setOpenDropdown,
    conversationPairs,
    faqItems,
  } = useNavbarLogic();

 const {currentLang} = useLanguage();

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    handleToggleDropdown(null);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(`.${styles.navbar}`)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
   
      
      <div className={styles.right}>


      <div className={styles.buyWrapper}>
      <Button3 text={t("trade")} onClick={() => showModal()} />


</div>




<div className={styles.navbarIcons}>


          <div className={styles.historyButton}>
            <div className={styles.navbarIconWrapper} onClick={() => {}}>
<Icon name="eye" size={30}></Icon>
</div>

           
          </div>
        

<div className={styles.navbarIconWrapper} >
<Icon name="notifications"></Icon>
</div>

<LanguageSelectorDropdown
  openDropdown={openDropdown}
  selectedIndex={selectedIndex}
  setSelectedIndex={setSelectedIndex}
  handleLanguageChange={handleLanguageChange}
  handleToggleDropdown={handleToggleDropdown}
/>


{/* 
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
              isOpen={openDropdown === "language"}
            />
          )}
        </div>

         */}


<div className={styles.gordonIconWrapper}   onClick={() => setOverlay("chat")}>
<Icon name="gordon_logo_black" size={18}></Icon>
</div>



        </div>

</div>

    </nav>

  );
};

export default Navbar;













