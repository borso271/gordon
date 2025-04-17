import React from "react";
import styles from "./DropdownMenu.module.css";
import CircledIcon from "../../Icons/CircledIcon";

interface DropdownItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  isOpen: boolean;
  top?: string; // <-- New optional prop
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  selectedIndex,
  setSelectedIndex,
  isOpen,
  top = "105%", // default to appear right below the trigger
}) => {
  return (
  

<div
  className={`${styles.dropdownMenu} ${isOpen ? styles.show : ""}`}
  style={{ top }}
>
  <div className={styles.scrollContainer}>
    {items.map((item, index) => (
      <div
        key={index}
        className={`${styles.menuItem} ${
          selectedIndex === index ? styles.active : ""
        }`}
        onClick={() => {
          setSelectedIndex(index);
          item.onClick();
        }}
      >
        {item.icon && <CircledIcon name={item.icon} size={18} />}
        <span className={styles.label}>{item.label}</span>
      </div>
    ))}
  </div>
</div>

  );
};

export default DropdownMenu;
