import React from "react";
import styles from "./ProvidersLoader.module.css";
import MarketCardLoader from "../MarketCardLoader";
const ProvidersLoader: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Upper Section */}
      <div className={styles.upperSection}>
      <div className={styles.upperLeft}></div>
      <div className={styles.upperRight}></div>
      </div>
      {/* Lower Section */}
      <div className={styles.lowerSection}>
      <MarketCardLoader/>
      <MarketCardLoader/>
      <MarketCardLoader/>
      </div>
    </div>
  );
};

export default ProvidersLoader;
