import React from "react";
import styles from "./SecondaryH2.module.css";

const PrimaryH2 = ({ children }) => {
  return <h2 className={styles.primaryH2}>{children}</h2>;
};

export default PrimaryH2;
