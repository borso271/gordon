import React from "react";
import styles from "./SendButton.module.css"; // Optional CSS module
import Icon from "../../Icons/Icon/index.tsx";

type SendButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};
const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button className={styles.sendButton} onClick={onClick} disabled={disabled}>
      <Icon name="send" size={22} />
    </button>
  );
};

export default SendButton;
