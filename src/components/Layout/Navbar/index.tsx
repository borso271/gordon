import React, {useEffect } from "react";
import styles from "./Navbar.module.css";

import DropdownMenu from "../../Dropdowns/DropdownMenu"; // Import the dropdown menu component

import MobileNavigation from "../../MobileNavigation";
import { useNavbarLogic } from "../../../app/hooks/useNavbarLogic";

import { useLanguage } from "../../../app/hooks/useLanguage";
import Icon from "../../Icons/Icon";
import { useOverlay } from "../../../app/context/overlayContext";
import { useTranslation } from "react-i18next";
import { useBuySellModal } from "../../../app/context/buySellModalContext";


// import PrimaryButton from "../../Buttons/PrimaryButton";
import Button3 from "../../Buttons/Button3";
const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { setOverlay } = useOverlay();
  const english_label_text = t("english")
  const arabic_label_text = t("arabic")

  // const [showBuySellModal, setShowBuySellModal] = useState(false);

  const { showModal } = useBuySellModal();
  // console.log("SHOW BUY SELL MODAL IS: ", showBuySellModal)
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
      <Button3 text={t("trade")} onClick={showModal} />

</div>




<div className={styles.navbarIcons}>

{conversationPairs.length > 1 && (
          <div className={styles.historyButton}>
            <div className={styles.navbarIconWrapper} onClick={() => handleToggleDropdown("history")}>
<Icon name="eye" size={30}></Icon>
</div>

           
             {openDropdown === "history" && (
            <MobileNavigation />)}
          </div>
        )} 

<div className={styles.navbarIconWrapper} >
<Icon name="notifications"></Icon>
</div>

<div className={styles.navbarIconWrapper}  onClick={() => handleToggleDropdown("language")}>
<Icon name="world" size={24}></Icon>
</div>

          {openDropdown === "language" && (
            <div className={styles.languageDropdownWrapper}>
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
            /></div>
          )}


<div className={styles.gordonIconWrapper}   onClick={() => setOverlay("chat")}>
<Icon name="gordon_logo_black" size={18}></Icon>
</div>



        </div>

</div>

    </nav>

  );
};

export default Navbar;















// const Navbar: React.FC = () => {
//   const { t } = useTranslation();
//   const english_label_text = t("english")
//   const arabic_label_text = t("arabic")

//   const {
//     openDropdown,
//     selectedIndex,
//     setSelectedIndex,
//     handleToggleDropdown,
//     changeLanguage,
//     setOpenDropdown,
//     conversationPairs,
//     faqItems,
//   } = useNavbarLogic();

//  const {currentLang} = useLanguage();

//   const handleLanguageChange = (lang: string) => {
//     changeLanguage(lang);
//     handleToggleDropdown(null);
//   };
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (!(event.target as HTMLElement).closest(`.${styles.navbar}`)) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <nav className={styles.navbar}>
   
//         {/* <div className={styles.left}>
//           <Link href="/">
//             <LogoGroup />
//           </Link>
//         </div> */}
      
//       <div className={styles.right}>
// {/*         
//         {conversationPairs.length > 1 && (
//           <div className={styles.historyButton}>
//             <DropdownButton
//               text=""
//               rightIcon="history"
//               className={openDropdown === "history" ? "activeButton" : undefined} 
//               onClick={() => handleToggleDropdown("history")}
//             />
//              {openDropdown === "history" && (
//             <MobileNavigation />)}
//           </div>
//         )} */}


// <Button3 text="Buy & Sell"/>

// <div className={styles.navbarIconWrapper}>
// <Icon name="eye"></Icon>
// </div>
//         {/* Language Dropdown */}
//         <div className={styles.dropdownContainer}>
//           <DropdownButton
//             text={currentLang.toUpperCase()}
//             leftIcon={currentLang === "ar" ? "arabic" : "usa"}
//             rightIcon={openDropdown === "language" ? "chevron_up" : "chevron_down"}
//             className={openDropdown === "language" ? "activeButton" : undefined} 
//             onClick={() => handleToggleDropdown("language")}
//           />

//           {openDropdown === "language" && (
//             <DropdownMenu
//             items={[
//               {
//                 icon: "usa",
//                 label: english_label_text,
//                 onClick: () => handleLanguageChange("en"),
//               },
//               {
//                 icon: "arabic",
//                 label: arabic_label_text,
//                 onClick: () => handleLanguageChange("ar"),
//               },
//             ]}
            
//               // items={[
//               //   { icon: "usa", label: english_label_text, onClick: () => changeLanguage("en") },
//               //   { icon: "arabic", label: arabic_label_text, onClick: () => changeLanguage("ar") },
//               // ]}

//               selectedIndex={selectedIndex}
//               setSelectedIndex={setSelectedIndex}
//               isOpen={openDropdown === "language"}
//             />
//           )}
//         </div>

//         {/* Options Dropdown */}
//         <div className={styles.dropdownContainer}>
//           <DropdownButton
//             text=""
//             rightIcon={openDropdown === "options" ? "cross" : "dotdotdot"}
//             rightIconSize={openDropdown === "options" ? 14 : 20}
//             onClick={() => handleToggleDropdown("options")}
//             className={openDropdown === "options" ? "activeButton" : undefined} 
//             width={40}

//           />
//           {openDropdown === "options" && (
//             <ExpandableDropdown
//             items={faqItems}
//             />
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
