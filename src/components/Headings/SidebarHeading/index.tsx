import React, { ReactNode } from "react";
import styles from "./SidebarHeading.module.css";
interface PrimaryH2Props {
    text: ReactNode;
  }
  

const SidebarHeading: React.FC<PrimaryH2Props> = ({ text }) => {
  return <h2 className={styles.primaryH2}>{text}</h2>;
};

export default SidebarHeading;
