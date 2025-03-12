import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"
import styles from "./Navbar.module.css";
import LogoGroup from "../../LogoGroup";
import DropdownButton from "../../Buttons/DropdownButton";
import DropdownMenu from "../../Dropdowns/DropdownMenu"; // Import the dropdown menu component
import ExpandableDropdown from "../../Dropdowns/ExpandableDropdown"; // Import the dropdown menu component
import Link from "next/link";
import i18n from "../../../i18n";
const Navbar = () => {
    const router = useRouter();
    const isHome = router.pathname === "/";
  
    const [openDropdown, setOpenDropdown] = useState(null);
    const [currentLang, setCurrentLang] = useState(i18n.language); // Track language state

    const defaultIndex = currentLang === "ar" ? 1 : 0;
    const [selectedIndex, setSelectedIndex] = useState(defaultIndex); // Stores selected item

    // Toggle dropdowns, closing others when opening a new one
    const handleToggleDropdown = (dropdownName) => {
      setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };
  
    // Function to change the language
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng); // Change language in i18n
      setCurrentLang(lng); // Update local state to force re-render
      setOpenDropdown(null); // Close dropdown
    };
  
    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!event.target.closest(`.${styles.navbar}`)) {
          setOpenDropdown(null);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);
  
    return (
      <nav className={styles.navbar}>
        {/* Left Side - Logo (Hidden on Homepage) */}
        {!isHome && (
          <div className={styles.left}>
            <Link href="/">
              <LogoGroup />
            </Link>
          </div>
        )}
  
        {/* Right Side - Dropdown Buttons */}
        <div className={styles.right}>
          {/* Language Dropdown */}
          <div className={styles.dropdownContainer}>
            <DropdownButton
              text={currentLang.toUpperCase()} // ✅ Updates immediately
              leftIcon={currentLang === "ar" ? "arabic" : "english"} // ✅ Updates icon immediately
              rightIcon="chevron_down"
              onClick={() => handleToggleDropdown("language")}
            />
            {openDropdown === "language" && (
              <DropdownMenu
                items={[
                  { icon: "english", label: "English", onClick: () => changeLanguage("en") },
                  { icon: "arabic", label: "Arabic", onClick: () => changeLanguage("ar") },
                ]}
                selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                isOpen={openDropdown === "language"}
              />
            )}
          </div>
  
          {/* Options Dropdown */}
          <div className={styles.dropdownContainer}>
            <DropdownButton
              text=""
              rightIcon="dotdotdot"
             
              onClick={() => handleToggleDropdown("options")}
            />
            {openDropdown === "options" && (
              <ExpandableDropdown
              items={[
                {
                    label: "About Gordon AI",
                    content: "Gordon AI is your intelligent financial assistant, utilizing cutting-edge AI to provide insightful analysis of stocks and cryptocurrencies. We leverage comprehensive data from leading providers like Eodhd and Polygon.io to deliver accurate and timely financial intelligence, empowering you to make informed investment decisions.\n\nGordon AI's mission is to democratize access to sophisticated financial analysis, helping individuals navigate the complexities of the market.\n\nLearn more about our dedicated team and the technology behind Gordon AI on our website.",
                },
                {
                    label: "Gordon's Services",
                    content: "Gordon AI offers a suite of powerful services designed to simplify your financial journey. We provide in-depth reports and real-time data analysis on thousands of stocks and cryptocurrencies, enabling informed decisions.\n\nOur portfolio optimization service delivers recommendations to improve your portfolio's performance based on your individual risk tolerance and investment goals.\n\nStay ahead of market trends with our predictive models, which forecast potential market movements. Gordon AI also offers personalized financial assistance, answering your specific financial questions with tailored insights. You can set up customizable alerts to receive notifications about price changes, news, and other important market events.\n\nWe are continually expanding our services to adapt to the evolving financial landscape.",
                },
                {
                    label: "Contact Gordon's Team",
                    content: "We'd love to hear from you! For questions, feedback, or assistance, please contact us via email at gordon.ai.support@example.com.\n\nWe aim to respond to all inquiries within 24-48 hours.\n\nPlease remember that while Gordon AI provides financial analysis, it does not offer personalized financial advice. It is essential to consult with a qualified financial advisor before making any investment decisions.",
                },
            ]}
              />
            )}
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  

// const Navbar = () => {
//   const router = useRouter();
//   const isHome = router.pathname === "/";

//   const [openDropdown, setOpenDropdown] = useState(null);

//   // Toggle dropdowns, closing others when opening a new one
//   const handleToggleDropdown = (dropdownName) => {
//     setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
//   };

//   // Function to change the language
//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(`.${styles.navbar}`)) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <nav className={styles.navbar}>
//       {/* Left Side - Logo (Hidden on Homepage) */}
//       {!isHome && (
//         <div className={styles.left}>
//           <Link href="/">
//             <LogoGroup />
//           </Link>
//         </div>
//       )}

//       {/* Right Side - Dropdown Buttons */}
//       <div className={styles.right}>
//         {/* Language Dropdown */}
//         <div className={styles.dropdownContainer}>
//           <DropdownButton
//             text={i18n.language.toUpperCase()} // Show current language
//             leftIcon={i18n.language === "ar" ? "arabic" : "english"} // Change icon dynamically
//             rightIcon="chevron_down"
//             onClick={() => handleToggleDropdown("language")}
//           />
//           {openDropdown === "language" && (
//             <DropdownMenu
//               items={[
//                 { icon: "english", label: "English", onClick: () => changeLanguage("en") },
//                 { icon: "arabic", label: "Arabic", onClick: () => changeLanguage("ar") },
//               ]}
//               isOpen={openDropdown === "language"}
//             />
//           )}
//         </div>

//         {/* Options Dropdown */}
//         <div className={styles.dropdownContainer}>
//           <DropdownButton
//             text=""
//             rightIcon="dotdotdot"
//             onClick={() => handleToggleDropdown("options")}
//           />
//           {openDropdown === "options" && (
//             <ExpandableDropdown
//               items={[
//                 { label: "About", content: "This is the about section with more details." },
//                 { label: "Services", content: "Here are the services we provide." },
//                 { label: "Contact", content: "Reach out to us via email or phone." },
//               ]}
//             />
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// const Navbar = () => {
//   const router = useRouter();
//   const isHome = router.pathname === "/";

//   // Track which dropdown is open
//   const [openDropdown, setOpenDropdown] = useState(null);

//   // Toggle dropdowns, closing others when opening a new one
//   const handleToggleDropdown = (dropdownName) => {
//     console.log("button clicked!")
//     setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(`.${styles.navbar}`)) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <nav className={styles.navbar}>
//       {/* Left Side - Logo (Hidden on Homepage) */}
        
//     {!isHome && (
//     <div className={styles.left}>
//         <Link href="/">
//         <LogoGroup />
//         </Link>
//     </div>
//     )}

//       {/* Right Side - Dropdown Buttons */}
//       <div className={styles.right}>
//         {/* Language Dropdown */}
//         <div className={styles.dropdownContainer}>
//           <DropdownButton
//             text="eng"
//             leftIcon="english"
//             rightIcon="chevron_down"
//             onClick={() => handleToggleDropdown("language")}
//           />
//           {openDropdown === "language" && (
//             <DropdownMenu
//               items={[
//                 { icon: "english", label: "English", onClick: () => alert("English selected") },
//                 { icon: "arabic", label: "Arabic", onClick: () => alert("French selected") },
                
//               ]}
//               isOpen={openDropdown === "language"} /* Pass isOpen prop */
//             />
//           )}
//         </div>

//         {/* Options Dropdown */}
//         <div className={styles.dropdownContainer}>
//           <DropdownButton
//             text=""
//             rightIcon="dotdotdot"
//             onClick={() => handleToggleDropdown("options")}
//           />
//           {openDropdown === "options" && (
//             <ExpandableDropdown
//               items={[
//                 { label: "About", content: "This is the about section with more details." },
//    { label: "Services", content: "Here are the services we provide." },
//    { label: "Contact", content: "Reach out to us via email or phone." },
//               ]}
//             />
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

