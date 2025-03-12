import React from "react";
import styles from "./PrimaryH3.module.css";

export function PrimaryH3({ children, className }) {
  return <h1 className={`${styles.primaryH3} ${className || ""}`}>{children}</h1>;
}
