import React from "react";
import styles from "./LogoGroup.module.css";
import Icon from "../Icons/Icon/index.tsx";

const LogoGroup = ({ text = "Gordon", icon = "logo" }) => {
    
  return (
    <div className={styles.logoGroup}>
      {/* Left: Icon */}
      <Icon name={"gordon_logo"} size={16} color="currentColor" className={styles.icon} />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default LogoGroup;


