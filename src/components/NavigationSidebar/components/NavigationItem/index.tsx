import React from "react";
// import { useConversation } from "../../../../app/context/conversationContext";
import styles from "./NavigationItem.module.css";

interface NavigationItemProps {
  label: string;
  // index: string;
  isSelected: boolean;
  // isEdgeItem: boolean;
  onSelect: () => void;
  // useVisibilityControl?: boolean; 
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  label, 
  isSelected, 
  // isEdgeItem, 
  onSelect, 
  // useVisibilityControl = false 
}) => {


  // const { areNavigationItemsVisible } = useConversation();
  // const shouldShowLabel = useVisibilityControl ? areNavigationItemsVisible : true;

  return (
    <div
      className={`${styles.item} ${isSelected ? styles.active : ""} `}
      onClick={onSelect}
    >
      <div className={`${styles.circle} ${isSelected ? styles.activeCircle :  ""}`}></div>
     
        <span className={`${styles.label} ${isSelected ? styles.activeLabel :  ""}`}>
          {label}
        </span>
      
    </div>
  );
};

export default NavigationItem;
