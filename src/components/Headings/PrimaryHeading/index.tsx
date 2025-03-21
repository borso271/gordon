import React, { ReactNode } from "react";
import styles from "./PrimaryHeading.module.css";

interface PrimaryHeadingProps {
  children: ReactNode;
  className?: string;
}

export function PrimaryHeading({ children, className }: PrimaryHeadingProps) {
  return <h1 className={`${styles.primaryHeading} ${className || ""}`}>{children}</h1>;
}
