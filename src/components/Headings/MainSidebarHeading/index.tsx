import React, { ReactNode } from "react";
import styles from "./SidebarHeading.module.css";
interface PrimaryH2Props {
    text: ReactNode;
  }
  

const MainSidebarHeading: React.FC<PrimaryH2Props> = ({ text }) => {
  return <h2 className={styles.primaryH2}>{text}</h2>;
};

export default MainSidebarHeading;
