import React, { ReactNode } from "react";
import styles from "./BotHeading.module.css";

interface BotHeadingProps {
  children: ReactNode;
  className?: string;
}

const BotHeading: React.FC<BotHeadingProps> = ({ children, className }) => {
  return <h1 className={`${styles.botHeading} ${className || ""}`}>{children}</h1>;
};

export default BotHeading;
