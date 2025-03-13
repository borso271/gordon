import React from "react";
import styles from "./MarketCardLoader.module.css";

const MarketCardLoader: React.FC = () => {
  return (
    <div className={styles.marketCard}>
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.logo}></div>
          <div className={styles.bankInfo}>
            <div className={styles.frame}></div>
            <div className={styles.div}></div>
          </div>
        </header>

        {/* Divider Line */}
        <div className={styles.line}/>

        {/* Features Section */}
        <div className={styles.features}>
          <div className={styles.frame2}></div>
          <div className={styles.frame2}></div>
          <div className={styles.frame2}></div>
        </div>
      </div>

      {/* Additional Frame */}
      <div className={styles.frame3}></div>
    </div>
  );
};

export default MarketCardLoader;
