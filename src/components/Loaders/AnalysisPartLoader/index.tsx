import React from "react";
import styles from "./AnalysisPartLoader.module.css";
const AnalysisPartLoader: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Upper Section */}
      <div className={styles.upperSection}>
      <div className={styles.upperLeft}></div>
      <div className={styles.upperRight}></div>
      </div>
      {/* Lower Section */}
      <div className={styles.lowerSection}>
      <div className={styles.row}></div>
      <div className={styles.row}></div>
      <div className={styles.row}></div>
      <div className={styles.row}></div>
      <div className={styles.row}></div>
      <div className={styles.row}></div>
      </div>
    </div>
  );
};

export default AnalysisPartLoader;
