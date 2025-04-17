import React from "react";
import styles from "./CircleActionButton.module.css";
import Icon from "../../Icons/Icon";
interface CircledIconButtonProps {
  onClick: () => void;
  iconName: string;
  iconSize?: number;
}

const CircledIconButton: React.FC<CircledIconButtonProps> = ({
  onClick,
  iconName,
  iconSize = 20,
}) => {
  return (
    <div className={styles.circledButton} onClick={onClick}>
      <Icon name={iconName} size={iconSize} />
    </div>
  );
};

export default CircledIconButton;
