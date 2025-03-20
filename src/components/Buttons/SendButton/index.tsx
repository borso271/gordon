import React from "react";
import styles from "./SendButton.module.css"; // Import CSS module
import Icon from "../../Icons/Icon";
import { useHandleSubmit } from "../../../app/hooks/useHandleSubmit";

type SendButtonProps = {
  disabled?: boolean;
  isFirstPrompt?: boolean;
  className?: "isMobile" | "isDesktop"; // Ensuring it matches module class keys
};

const SendButton: React.FC<SendButtonProps> = ({ disabled = false, isFirstPrompt, className }) => {
  const { handleSubmit } = useHandleSubmit();
  const computedClassName = className ? styles[className] : "";

  return (
    <button
      className={`${styles.sendButton} ${computedClassName}`}
      onClick={() => {
        console.log("BUTTON CLICKED"); // ✅ Debug: Check if click happens
        handleSubmit(null, isFirstPrompt); // ✅ Pass `null` instead of event
      }}
      disabled={disabled}
    >
      <Icon name={disabled ? "disabled_arrow" : "send"} size={22} />
    </button>
  );
};

export default SendButton;
