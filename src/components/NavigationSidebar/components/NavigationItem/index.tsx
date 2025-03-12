import React from "react";
import styles from "./NavigationItem.module.css";

interface NavigationItemProps {
  label: string;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ label, index, isSelected, onSelect }) => {
  return (
    <div
      className={`${styles.item} ${isSelected ? styles.selected : ""}`}
      onClick={() => onSelect(index)}
    >
      {label}
    </div>
  );
};

export default NavigationItem;
