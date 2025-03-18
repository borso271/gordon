import React from "react";
import styles from "./DropdownButton.module.css";
import Icon from "../../Icons/Icon/index.tsx";
import CircledIcon from "../../Icons/CircledIcon";


const DropdownButton = ({ text, leftIcon, rightIcon, rightIconSize, onClick, className }) => {
  return (
    <button
    className={`${styles.dropdownButton} ${className ? styles[className] : ""}`.trim()}

      onClick={onClick}
    >
      {/* Left Icon (Optional) */}
      {leftIcon && (
        <span className={styles.icon}>
          <CircledIcon name={leftIcon} size={18} color="white" />
        </span>
      )}

      {/* Button Text (Optional) */}
      {text && <span className={styles.text}>{text}</span>}

      {/* Right Icon (Optional) */}
      {rightIcon && (
        <span className={styles.icon}>
          <Icon name={rightIcon} size={rightIconSize || 20} color="white" />
        </span>
      )}
    </button>
  );
};

export default DropdownButton;
