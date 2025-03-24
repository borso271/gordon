import React from "react";
import styles from "./SecondaryButton.module.css";
import Icon from "../../Icons/Icon";

interface SecondaryButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: string | null;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  text,
  onClick,
  disabled = false,
  className = "",
  icon = null,
}) => {
  const combinedClassName = [
    styles.secondaryButton,
    ...className.split(" ").map((cls) => styles[cls] || cls),
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={combinedClassName}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {icon && (
        <span className={styles.icon}>
          <Icon name={icon} size={20} />
        </span>
      )}
      {text}
    </button>
  );
};

export default SecondaryButton;
