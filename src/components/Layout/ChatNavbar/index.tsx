import React, {useEffect} from "react";
import styles from "./ChatNavbar.module.css";
import LanguageSelectorDropdown from "../../Dropdowns/LanguageSelector";
import { useNavbarLogic } from "../../../app/hooks/useNavbarLogic";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../../../app/hooks/useLanguage";
import { useConversation } from "../../../app/context/conversationContext";
import Icon from "../../Icons/Icon";
import Button3 from "../../Buttons/Button3";
import { useRouter } from "next/navigation";
import { useOverlay } from "../../../app/context/overlayContext";
import { useBuySellModal } from "../../../app/context/buySellModalContext";
import CircledIconButton from "../../Buttons/CircleActionButton";
import { current_balance, old_balance } from "../../../constants";


type NavbarProps = {
    onToggle?: () => void;
    expanded:boolean;
  };
  
  const Navbar: React.FC<NavbarProps> = ({ onToggle,expanded }) => {
const {setOverlay} = useOverlay();
  const { t } = useTranslation();
  const english_label_text = t("english")
  const arabic_label_text = t("arabic")

const change = current_balance - old_balance;
const percentChange = (change / old_balance) * 100;

const isPositive = change >= 0;
const iconName = isPositive ? "positive_trend" : "negative_trend";

const { showModal } = useBuySellModal();
const changeClass = `${styles.changeValue} ${isPositive ? styles.positive : styles.negative}`;

const {setThreadId} = useConversation();
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

  const router = useRouter();


const navigateToDashboard = () => {
  router.push("/");
};


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


const handleNewChatClick = () => {
    
  setThreadId("")
   // router.push("/landing");

  };

  return (
    <nav className={styles.navbar}>
        <div className={styles.left}>

{!expanded && (
         <div className={styles.sidebarActions}>
 
          
      <CircledIconButton 
       onClick={handleNewChatClick}
        iconName={"new_chat"}
        iconSize={22}/>

<CircledIconButton 
       onClick={onToggle}
        iconName={"history"}
        iconSize={22}/>
         </div>
)}

         <div className={styles.balanceOverview}>
         <div

         className={styles.balanceOverviewItem}>
            <div className={styles.balanceOverviewItemLabel}>
            {t('portfolio.balance')}
            </div>

            <div className={styles.balanceValue}>
                <div className={styles.currency}>
                    $
                </div>
                <div className={styles.amount}>
                {"100.000"}
                </div>

            </div>


          </div>
        
          <div
className={styles.balanceOverviewItem} 
          >
             <div className={styles.balanceOverviewItemLabel}>
             {t('portfolio.change24h')}
                </div>

                <div className={changeClass}>
  <div>
    <Icon name={iconName} size={14}/>
  </div>

  <div className={styles.currencyAndAmount}>
    <div className={styles.currency}>$</div>
    <div className={styles.amount}>
      {Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 1 })}
    </div>
  </div>

  <div className={styles.pchange}>
  ({Math.abs(percentChange).toFixed(2)}%)
</div>

</div>

          </div>


         </div>

         
        </div>
      
      <div className={styles.right}>


      <div className={styles.buyWrapper}>
      <Button3 text={t("trade")} onClick={() => showModal()} />
</div>

        {/* Language Dropdown */}
        <LanguageSelectorDropdown
  openDropdown={openDropdown}
  selectedIndex={selectedIndex}
  setSelectedIndex={setSelectedIndex}
  handleLanguageChange={handleLanguageChange}
  handleToggleDropdown={handleToggleDropdown}
/>


        {/* <div className={styles.dropdownContainer}>
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
        </div> */}

        {/* Options Dropdown */}
      
          <div
       //  onClick={navigateToDashboard}
         onClick={() => setOverlay(null)}
         className={styles.circledButton} 
          >
            <Icon name="cross" size={14}></Icon>
          </div>
        
        </div>
   
    </nav>
  );
};

export default Navbar;





// old faq button:
// <div className={styles.dropdownContainer}>
// <DropdownButton
//   text=""
//   rightIcon={openDropdown === "options" ? "cross" : "dotdotdot"}
//   rightIconSize={openDropdown === "options" ? 14 : 20}
//   onClick={() => handleToggleDropdown("options")}
//   className={openDropdown === "options" ? "activeButton" : undefined} 
//   width={40}

// />
// {openDropdown === "options" && (
//   <ExpandableDropdown
//   items={faqItems}
//   />
// )}
// </div>