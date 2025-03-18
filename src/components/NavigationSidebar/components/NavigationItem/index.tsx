import React from "react";
import { useConversation } from "../../../../app/context/conversationContext";
import styles from "./NavigationItem.module.css";

interface NavigationItemProps {
  label: string;
  index: string;
  isSelected: boolean;
  isEdgeItem: boolean;
  onSelect: () => void;
  useVisibilityControl?: boolean; // Optional: Controls whether visibility is dynamic
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  label, 
  index,
  isSelected, 
  isEdgeItem, 
  onSelect, 
  useVisibilityControl = false // Default to false (always visible unless controlled)
}) => {
  const { areNavigationItemsVisible } = useConversation();
  const shouldShowLabel = useVisibilityControl ? areNavigationItemsVisible : true;

  return (
    <div
      className={`${styles.item} ${isSelected ? styles.active : ""}`}
      onClick={onSelect}
    >
      <div className={`${styles.circle} ${isSelected ? styles.activeCircle : isEdgeItem ? styles.edgeCircle : ""}`}></div>
      {shouldShowLabel && (
        <span className={`${styles.label} ${isSelected ? styles.activeLabel : isEdgeItem ? styles.edgeLabel : ""}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default NavigationItem;
