import React from "react";
import styles from "./PrimaryHeading.module.css";

export function PrimaryHeading({ children, className }) {
  return <h1 className={`${styles.primaryHeading} ${className || ""}`}>{children}</h1>;
}
