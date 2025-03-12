import React from "react";
import styles from "./LogoGroup.module.css";
import Icon from "../Icons/Icon/index.tsx";

const LogoGroup = ({ text = "Gordon", icon = "logo" }) => {
    
  return (


    <div className={styles.logoGroup}>
      {/* Left: Icon */}
    
      {/* Right: Text */}
      <span className={styles.text}>{text}</span>
      <Icon name={"temp_logo"} size={12} color="currentColor" className={styles.icon} />
      
    </div>
  );
};

export default LogoGroup;


