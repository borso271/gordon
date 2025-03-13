import React from "react";
import styles from "./SnapshotLoader.module.css"; // ✅ Import module styles

const SnapshotLoader: React.FC = () => {
  return (
    <div className={styles.stockCryptoCard}>
      <div className={styles.container}>
        <div className={styles.containerWrapper}>
          <div className={styles.div}>
            <div className={styles.ellipse} /> {/* ✅ Placeholder for image/logo */}
            <div className={styles.stockInfo}>
              <div className={styles.frame} />  {/* ✅ Placeholder for stock name */}
              <div className={styles.frame2} /> {/* ✅ Placeholder for stock details */}
            </div>
          </div>
        </div>
        <div className={styles.container2}>
          <div className={styles.frame3} /> {/* ✅ Placeholder for graph/bar */}
          <div className={styles.percentage} /> {/* ✅ Placeholder for percentage change */}
        </div>
      </div>
    </div>
  );
};

export default SnapshotLoader;
