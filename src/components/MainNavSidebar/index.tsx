"use client";

import { useState } from "react";
import styles from "./MainNavSidebar.module.css";
import Icon from "../Icons/Icon";
import { useRouter } from "next/navigation";
type MenuItem = {
    icon: string;
    label: string;
    path: string;
  };
  
  const menuItems: MenuItem[] = [
    { icon: "history", label: "Dashboard", path: "/dashboard" },
    { icon: "history", label: "History", path: "/history" },
    { icon: "history", label: "Bot", path: "/landing" },
  ];
  

export default function MainNavSidebar({
  onToggle,
}: {
  onToggle?: (expanded: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next);
  };

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
      <div className={styles.menu}>
        <div className={styles.menuItem} onClick={toggle}>
          <Icon name="gordon_logo" size={20} className={styles.icon} />
          {expanded && <span className={styles.label}>Menu</span>}
        </div>

        {menuItems.map((item, index) => (
          <div
            key={index}
            className={styles.menuItem}
            onClick={() => router.push(item.path)}
          >
            <Icon name={item.icon} size={20} className={styles.icon} />
            {expanded && <span className={styles.label}>{item.label}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}
