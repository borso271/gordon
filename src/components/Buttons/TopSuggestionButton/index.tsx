import React from "react";
import styles from "./TopSuggestionButton.module.css";
import Icon from "../../Icons/Icon";

interface TopSuggestionProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: string | null;
}

const TopSuggestionButton: React.FC<TopSuggestionProps> = ({
  text,
  onClick,
  disabled = false,
  className = "",
  icon = null,
}) => {
  const combinedClassName = [
    styles.topSuggestionButton,
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
        // <span className={styles.icon}>
          <Icon name={icon} size={20} />
        // </span>
      )}
      {text}
    </button>
  );
};

export default TopSuggestionButton;
