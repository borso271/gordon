import React from "react";
import styles from "./GoDeeperLoader.module.css";
import PrimaryDivider from "../../Layout/PrimaryDivider";
const GoDeeperLoader: React.FC = () => {
  return (
    <div className={styles.goDeeper}>
      <div className={styles.headerContainer}>
        <div className={styles.frame}></div>
        <div className={styles.div}></div>
      </div>
      <div className={styles.questionsContainer}>
        {[...Array(5)].map((_, index) => (
          <React.Fragment key={index}>
            <div className={styles.div2}>
              <div className={styles.frame2}></div>
              <div className={styles.frame3}></div>
            </div>
            <PrimaryDivider />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GoDeeperLoader;
