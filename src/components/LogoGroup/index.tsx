import React from "react";
import styles from "./LogoGroup.module.css";
import Icon from "../Icons/Icon";

interface LogoGroupProps {
  text?: string;
}

const LogoGroup: React.FC<LogoGroupProps> = ({ text = "Gordon" }) => {
  return (
    <div className={styles.logoGroup}>
      <Icon
        name={"gordon_logo"} // you can use `icon` here if you want to make it dynamic
        size={16}
        className={styles.icon}
      />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default LogoGroup;
