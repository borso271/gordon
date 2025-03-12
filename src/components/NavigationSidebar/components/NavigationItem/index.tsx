import React from "react";
import styles from "./NavigationItem.module.css";
interface NavigationItemProps {
    label: string;
    index: string;
    isSelected: boolean;
    onSelect: () => void;
  }
  
  const NavigationItem: React.FC<NavigationItemProps> = ({ label, isSelected, onSelect }) => {
    return (
      <div
        className={`${styles.item} ${isSelected ? styles.active : ""}`} // ✅ Apply active class
        onClick={onSelect}
      >
        {label}
      </div>
    );
  };
  
  export default NavigationItem;
  