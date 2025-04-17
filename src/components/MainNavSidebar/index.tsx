"use client";

import { useState } from "react";
import styles from "./MainNavSidebar.module.css";
import Icon from "../Icons/Icon";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@gmail.com",
  avatar: "/avatar.jpg", // path to avatar image
};

type MenuItem = {
  icon: string;
  label: string;
  path: string;
};

const topMenuItems: MenuItem[] = [
  { icon: "portfolio", label: "Portfolio", path: "/" },
  { icon: "layers", label: "History", path: "/history" }
  // { icon: "gordon_logo_white", label: "Try Gordon", path: "/landing" },
];

const bottomMenuItems: MenuItem[] = [
  { icon: "settings", label: "Settings", path: "/" },
  { icon: "headphones", label: "Help Center", path: "/" },
];

export default function MainNavSidebar({
  onToggle,
}: {
  onToggle?: (expanded: boolean) => void;
}) {
   
const router = useRouter();
  
const pathname = usePathname(); // this returns a string like "/dashboard"


  const [expanded, setExpanded] = useState(false);
  
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    onToggle?.(next);
  };

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
      {expanded && (
        <div className={styles.closeSidebar} onClick={toggle}>
          <Icon name="closeSidebar" size={24} className={`${styles.icon} flipRTL`} />


        </div>
      )}

      <div className={styles.topItem} onClick={toggle}>
      <div className={styles.iconWrapper}>
        <Icon name="gordon_logo" size={20} className={styles.icon} /></div>
        {expanded && <span className={styles.logoLabel}>Gordon</span>}
      </div>

      {/* Top Menu Group */}
      <div className={styles.menu}>
    
{topMenuItems.map((item, index) => {
   const isActive = pathname === item.path;
  return (
    <div
      key={index}
      className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
      onClick={() => router.push(item.path)}
    >
      <div className={styles.iconWrapper}>
        <Icon name={item.icon} size={20} className={styles.icon} />
      </div>
      {expanded && <span className={styles.label}>{item.label}</span>}
    </div>
  );
})}
      </div>

      <div className={styles.spacer} />

      {/* Bottom Menu Group */}
      <div className={styles.menu}>
        {bottomMenuItems.map((item, index) => (
          <div
            key={index}
            className={styles.menuItem}
            onClick={() => router.push(item.path)}
          >
             <div className={styles.iconWrapper}>
            <Icon name={item.icon} size={20} className={styles.icon} /></div>
            {expanded && <span className={styles.label}>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* User Profile Section */}
      <div className={styles.userProfile}>
     <div className={styles.userAvatar}>JC</div>

        {expanded && (
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
