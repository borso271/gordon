import React from "react";
import styles from "./SecondaryButton.module.css";

const SecondaryButton = ({ text, onClick, disabled, className="" }) => {
  return (
    <button
      className={[
        styles.secondaryButton, 
        styles[className] || className, // Check if className exists in styles
        disabled ? styles.disabled : ""
      ].filter(Boolean).join(" ")} // Ensure only valid class names are applied
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
