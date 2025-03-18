import React from "react";
import styles from "./SecondaryButton.module.css";
import Icon from "../../Icons/Icon";
const SecondaryButton = ({ text, onClick, disabled, className = "", icon = null }) => {
  return (
    <button
      className={[
        styles.secondaryButton,
        ...className.split(" ").map(cls => styles[cls] || cls), // Handle multiple classes properly
        disabled ? styles.disabled : ""
      ].filter(Boolean).join(" ")} // Ensure only valid class names are applied
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size={20} color="white" />
        </span>
      )}
      {text}
    </button>
  );
};

export default SecondaryButton;
