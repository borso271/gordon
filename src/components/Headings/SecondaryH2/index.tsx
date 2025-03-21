import React, { ReactNode } from "react";
import styles from "./SecondaryH2.module.css";

interface SecondaryH2Props {
  children: ReactNode;
}

const SecondaryH2: React.FC<SecondaryH2Props> = ({ children }) => {
  return <h2 className={styles.secondaryH2}>{children}</h2>;
};

export default SecondaryH2;
