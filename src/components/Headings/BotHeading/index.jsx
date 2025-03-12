import React from "react";
import styles from "./BotHeading.module.css";

function BotHeading({ children, className }) {
  return <h1 className={`${styles.botHeading} ${className || ""}`}>{children}</h1>;
}

export default BotHeading