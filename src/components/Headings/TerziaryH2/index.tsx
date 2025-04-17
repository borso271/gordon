import React, { ReactNode } from "react";
import styles from "./TerziaryH2.module.css";

interface TerziaryH2Props {
  children: ReactNode;
}

const TerziaryH2: React.FC<TerziaryH2Props> = ({ children }) => {
  return <h2 className={styles.TerziaryH2}>{children}</h2>;
};

export default TerziaryH2;
