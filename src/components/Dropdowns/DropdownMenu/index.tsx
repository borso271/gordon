import React from "react";
import styles from "./DropdownMenu.module.css";
import CircledIcon from "../../Icons/CircledIcon";

interface DropdownItem {
  label: string;
  icon: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  isOpen: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  selectedIndex,
  setSelectedIndex,
  isOpen,
}) => {
  return (
    <div className={`${styles.dropdownMenu} ${isOpen ? styles.show : ""}`}>
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
          <CircledIcon name={item.icon} size={18} />
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
