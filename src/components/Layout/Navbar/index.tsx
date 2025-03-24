import React, {useEffect} from "react";
import styles from "./Navbar.module.css";
import LogoGroup from "../../LogoGroup";
import DropdownButton from "../../Buttons/DropdownButton";
import DropdownMenu from "../../Dropdowns/DropdownMenu"; // Import the dropdown menu component
import ExpandableDropdown from "../../Dropdowns/ExpandableDropdown"; // Import the dropdown menu component
import Link from "next/link";
import MobileNavigation from "../../MobileNavigation";
import { useNavbarLogic } from "../../../app/hooks/useNavbarLogic";
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const english_label_text = t("english")
  const arabic_label_text = t("arabic")

  
  const {
    openDropdown,
    currentLang,
    selectedIndex,
    setSelectedIndex,
    handleToggleDropdown,
    changeLanguage,
    setOpenDropdown,
    conversationPairs,
    faqItems,
  } = useNavbarLogic();


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
   
        <div className={styles.left}>
          <Link href="/">
            <LogoGroup />
          </Link>
        </div>
      
      <div className={styles.right}>
        {conversationPairs.length > 1 && (
          <div className={styles.historyButton}>
            <DropdownButton
              text=""
              rightIcon="history"
              className={openDropdown === "history" ? "activeButton" : undefined} 
              onClick={() => handleToggleDropdown("history")}
            />
             {openDropdown === "history" && (
            <MobileNavigation />)}
          </div>
        )}

        {/* Language Dropdown */}
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
            
              // items={[
              //   { icon: "usa", label: english_label_text, onClick: () => changeLanguage("en") },
              //   { icon: "arabic", label: arabic_label_text, onClick: () => changeLanguage("ar") },
              // ]}

              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              isOpen={openDropdown === "language"}
            />
          )}
        </div>

        {/* Options Dropdown */}
        <div className={styles.dropdownContainer}>
          <DropdownButton
            text=""
            rightIcon={openDropdown === "options" ? "cross" : "dotdotdot"}
            rightIconSize={openDropdown === "options" ? 14 : 20}
            onClick={() => handleToggleDropdown("options")}
            className={openDropdown === "options" ? "activeButton" : undefined} 
            width={40}

          />
          {openDropdown === "options" && (
            <ExpandableDropdown
            items={faqItems}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// const Navbar = () => {
//     const router = useRouter();
//     const isHome = router.pathname === "/";
  
//     const [openDropdown, setOpenDropdown] = useState(null);
//     const [currentLang, setCurrentLang] = useState(i18n.language); // Track language state

//     const defaultIndex = currentLang === "ar" ? 1 : 0;
//     const [selectedIndex, setSelectedIndex] = useState(defaultIndex); // Stores selected item
    
//     const {conversationPairs, setIsMobileNavigationVisible, isMobileNavigationVisible} = useConversation();


//     // Toggle dropdowns, closing others when opening a new one
//     const handleShowNavigation = () => {
//       setIsMobileNavigationVisible(!isMobileNavigationVisible)
//     };
  

//     const handleToggleDropdown = (dropdownName) => {
//       setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//     };

    
  
//     // Function to change the language
//     const changeLanguage = (lng) => {
//       i18n.changeLanguage(lng); // Change language in i18n
//       setCurrentLang(lng); // Update local state to force re-render
//       setOpenDropdown(null); // Close dropdown
//     };
  
//     // Close dropdowns when clicking outside
//     useEffect(() => {
//       const handleClickOutside = (event) => {
//         if (!event.target.closest(`.${styles.navbar}`)) {
//           setOpenDropdown(null);
//         }
//       };
//       document.addEventListener("click", handleClickOutside);
//       return () => document.removeEventListener("click", handleClickOutside);
//     }, []);
  
//     return (
//       <nav className={styles.navbar}>
//         {/* Left Side - Logo (Hidden on Homepage) */}
//         {!isHome && (
//           <div className={styles.left}>
//             <Link href="/">
//               <LogoGroup />
//             </Link>
//           </div>
//         )}
  
//         {/* Right Side - Dropdown Buttons */}
//         <div className={styles.right}>

//          {conversationPairs.length > 0 && 
//           <div className={styles.historyButton}>
//         <DropdownButton text="" rightIcon="history" onClick={() => handleShowNavigation()}  /> 
//           <MobileNavigation/>
//         </div>}


//           {/* Language Dropdown */}
//           <div className={styles.dropdownContainer}>
//             <DropdownButton
//               text={currentLang.toUpperCase()} // ✅ Updates immediately
//               leftIcon={currentLang === "ar" ? "arabic" : "english"} // ✅ Updates icon immediately
//               rightIcon="chevron_down"
//               onClick={() => handleToggleDropdown("language")}
//             />
//             {openDropdown === "language" && (
//               <DropdownMenu
//                 items={[
//                   { icon: "english", label: "English", onClick: () => changeLanguage("en") },
//                   { icon: "arabic", label: "Arabic", onClick: () => changeLanguage("ar") },
//                 ]}
//                 selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
//                 isOpen={openDropdown === "language"}
//               />
//             )}
//           </div>
  
//           {/* Options Dropdown */}
//           <div className={styles.dropdownContainer}>
//             <DropdownButton
//               text=""
//               rightIcon="dotdotdot"
//               onClick={() => handleToggleDropdown("options")}
//             />
//             {openDropdown === "options" && (
//               <ExpandableDropdown
//               items={[
//                 {
//                     label: "About Gordon AI",
//                     content: "Gordon AI is your intelligent financial assistant, utilizing cutting-edge AI to provide insightful analysis of stocks and cryptocurrencies. We leverage comprehensive data from leading providers like Eodhd and Polygon.io to deliver accurate and timely financial intelligence, empowering you to make informed investment decisions.\n\nGordon AI's mission is to democratize access to sophisticated financial analysis, helping individuals navigate the complexities of the market.\n\nLearn more about our dedicated team and the technology behind Gordon AI on our website.",
//                 },
//                 {
//                     label: "Gordon's Services",
//                     content: "Gordon AI offers a suite of powerful services designed to simplify your financial journey. We provide in-depth reports and real-time data analysis on thousands of stocks and cryptocurrencies, enabling informed decisions.\n\nOur portfolio optimization service delivers recommendations to improve your portfolio's performance based on your individual risk tolerance and investment goals.\n\nStay ahead of market trends with our predictive models, which forecast potential market movements. Gordon AI also offers personalized financial assistance, answering your specific financial questions with tailored insights. You can set up customizable alerts to receive notifications about price changes, news, and other important market events.\n\nWe are continually expanding our services to adapt to the evolving financial landscape.",
//                 },
//                 {
//                     label: "Contact Gordon's Team",
//                     content: "We'd love to hear from you! For questions, feedback, or assistance, please contact us via email at gordon.ai.support@example.com.\n\nWe aim to respond to all inquiries within 24-48 hours.\n\nPlease remember that while Gordon AI provides financial analysis, it does not offer personalized financial advice. It is essential to consult with a qualified financial advisor before making any investment decisions.",
//                 },
//             ]}
//               />
//             )}
//           </div>
//         </div>
//       </nav>
//     );
//   };
  
//   export default Navbar;
  