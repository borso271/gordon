import React from "react";
import styles from "./SendButton.module.css"; // Import CSS module
import Icon from "../../Icons/Icon";

type SendButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  className?: "isMobile" | "isDesktop"; // Ensuring it matches module class keys
};

const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled = false, className }) => {
  // Compute the correct class name from styles
  const computedClassName = className ? styles[className] : "";

  return (
    <button 
      className={`${styles.sendButton} ${computedClassName}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      <Icon name={disabled ? "disabled_arrow" : "send"} size={22} />
    </button>
  );
};


export default SendButton;
