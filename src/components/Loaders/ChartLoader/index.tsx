import React from "react";
import styles from "./ChartLoader.module.css"; // ✅ Import module styles
const ChartLoader: React.FC = () => {
  return (
    <div className={styles.chartGroup}>

      <div className={styles.stockInfo}>
        {/* Placeholder for image */}
   

        <div className={styles.stockData}>
 
        <div className={styles.stockDetails}>
        <div className={styles.group} /> 
        <div className={styles.rightGroup}>
            <div className={styles.frame} /> {/* Placeholder for stock name */}
            <div className={styles.div} /> {/* Placeholder for stock price */}
            </div>
          </div>
          <div className={styles.frame2}>
            <div className={styles.stockNameText} /> {/* Placeholder for stock details */}
            <div className={styles.timeRangeOptions}>
              <div className={styles.frame3} />
              <div className={styles.frame3} />
              <div className={styles.frame3} />
            </div>
          </div>
        </div>

      </div>

      {/* Placeholder for dividing line */}
      <div className={styles.line} /> 

      <div className={styles.chartContainer}>
        <div className={styles.overlapGroup}>
          <div className={styles.chartData}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitle} /> {/* Placeholder for title */}
              <div className={styles.chartInfo}>
                <div className={styles.chartStats} /> {/* Placeholder for stats */}
                <div className={styles.frame4} />
              </div>
            </div>

            <div className={styles.chart}>
              <div className={styles.amount}>
                <div className={styles.frame5} />
                <div className={styles.frame5} />
                <div className={styles.frame5} />
                <div className={styles.frame5} />
                <div className={styles.frame5} />
              </div>
              <div className={styles.graphs} /> {/* Placeholder for chart */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartLoader;
