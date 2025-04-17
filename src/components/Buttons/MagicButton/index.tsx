import React from "react";
import styles from "./MagicButton.module.css";
import Icon from "../../Icons/Icon";

interface MagicButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: string | null;
}

const MagicButton: React.FC<MagicButtonProps> = ({
  text,
  onClick,
  disabled = false,
  className = "",
  icon = "green_magic_stick",
}) => {
  const combinedClassName = [
    styles.magicButton,
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
       
          <Icon name={icon} size={16} />
     
      )}
      {text}
    </button>
  );
};

export default MagicButton;
