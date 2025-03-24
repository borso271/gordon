import React from "react";
import styles from "./CircledIcon.module.css";
import Icon from "../Icon";

interface CircledIconProps {
  name: string;
  size?: number;
  bgColor?: string;
  border?: boolean;
}

const CircledIcon: React.FC<CircledIconProps> = ({
  name,
  size = 40,
  bgColor = "#fff",
  border = false,
}) => {
  return (
    <div
      className={`${styles.circle} ${border ? styles.border : ""}`}
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      <Icon name={name} size={size * 1.1} />
    </div>
  );
};

export default CircledIcon;
