import React from "react";
import styles from "./CircledIcon.module.css";
import Icon from "../Icon/index.tsx";

const CircledIcon = ({ name, size = 40, bgColor = "#fff", iconColor = "black", border = false }) => {
  return (
    <div
      className={`${styles.circle} ${border ? styles.border : ""}`}
      style={{ width: size, height: size, backgroundColor: bgColor }}
    >
      <Icon name={name} size={size*1.5} color={iconColor} />
    </div>
  );
};

export default CircledIcon;
