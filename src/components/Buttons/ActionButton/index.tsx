import React, { useState } from "react";
import styles from "./ActionButton.module.css";
import Icon from "../../Icons/Icon";

interface ActionButtonProps {
  iconName: string;
  successIcon?: string;
  text: string;
  onClick: () => Promise<void> | void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  iconName,
  successIcon = "check",
  text,
  onClick,
  disabled = false,
}) => {
  const [currentIcon, setCurrentIcon] = useState<string>(iconName);

  const handleClick = async () => {
    if (disabled) return;

    try {
      await onClick();

      if (text === "Copy") {
        setCurrentIcon(successIcon);
        setTimeout(() => {
          setCurrentIcon(iconName);
        }, 1500);
      }
    } catch (error) {
      console.error("Error in ActionButton:", error);
    }
  };

  return (
    <button onClick={handleClick} className={styles.actionButton} disabled={disabled}>
      <Icon name={currentIcon} className={styles.icon} size={18} />
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default ActionButton;
