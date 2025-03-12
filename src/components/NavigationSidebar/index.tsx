import React from "react";
import styles from "./SidebarNavigation.module.css";
import NavigationItem from "./components/NavigationItem";

interface NavigationItemProps {
  label: string;
  index: number;
}

interface SidebarNavigationProps {
  items: NavigationItemProps[];
  onSelect: (index: number) => void;
  selectedIndex?: number;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ items, onSelect, selectedIndex }) => {
  return (
    <div className={styles.sidebar}>
      {items.map((item) => (
        <NavigationItem
          key={item.index}
          label={item.label}
          index={item.index}
          isSelected={selectedIndex === item.index}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default SidebarNavigation;
