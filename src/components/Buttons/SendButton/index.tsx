
import React, {  FormEvent } from "react";
import styles from "./SendButton.module.css"; // Import CSS module
import Icon from "../../Icons/Icon";
import { useHandleSubmit } from "../../../app/hooks/useHandleSubmit";

type SendButtonProps = {
  disabled?: boolean;
  isFirstPrompt?: boolean;
  className?: "isMobile" | "isDesktop"; // Ensuring it matches module class keys
  handleSubmit: (event: FormEvent | MouseEvent | null) => void;

};

const SendButton: React.FC<SendButtonProps> = ({ disabled = false, isFirstPrompt, className,handleSubmit}) => {
  // const { handleSubmit } = useHandleSubmit();
  const computedClassName = className ? styles[className] : "";

  return (
    <button
      className={`${styles.sendButton} ${computedClassName}`}
      onClick={() => {
        handleSubmit(null); // ✅ Pass `null` instead of event
      }}
      disabled={disabled}
    >
      <div className={styles.iconWrapper}>
      <Icon name={disabled ? "send" : "send"} size={16} />
      </div>
    </button>
  );
};

export default SendButton;
