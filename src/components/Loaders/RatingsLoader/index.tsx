import React from "react";
import styles from "./AnalystRatingLoader.module.css";

const AnalystRatingLoader: React.FC = () => {
  return (
    <div className={styles.analystRating}>
      {/* Header Section */}
      <div className={styles.headerContainer}>
        <div className={styles.headerText}>
          <div className={styles.frame}>
            <div className={styles.div}></div>
            <div className={styles.frame2}></div>
          </div>
          <div className={styles.frame3}></div>
        </div>
      </div>

      {/* Rows Container */}
      <div className={styles.rowsContainer}>
        <div className={styles.frame4}></div>
        <div className={styles.frame4}></div>
        <div className={styles.frame4}></div>
        <div className={styles.frame4}></div>
        <div className={styles.frame4}></div>
      </div>
    </div>
  );
};

export default AnalystRatingLoader;
