import React, { ReactNode } from "react";
import styles from "./PrimaryH2.module.css";

interface PrimaryH2Props {
  children: ReactNode;
}

const PrimaryH2: React.FC<PrimaryH2Props> = ({ children }) => {
  return <h2 className={styles.primaryH2}>{children}</h2>;
};

export default PrimaryH2;
