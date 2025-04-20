import React from "react";
import styles from "./CircleActionButton.module.css";
import Icon from "../../Icons/Icon";

interface CircledIconButtonProps {
  onClick: () => void;
  iconName: string;
  iconSize?: number;
  size?: number; // This controls the button's width/height
}

const CircledIconButton: React.FC<CircledIconButtonProps> = ({
  onClick,
  iconName,
  iconSize = 20,
  size
}) => {
  return (
    <div
      className={styles.circledButton}
      onClick={onClick}
      style={size ? { width: size, height: size } : undefined}
    >
      <Icon name={iconName} size={iconSize} />
    </div>
  );
};

export default CircledIconButton;
