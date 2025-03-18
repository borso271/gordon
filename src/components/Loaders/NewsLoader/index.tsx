import React from "react";
import styles from "./NewsLoader.module.css";

const NewsLoader: React.FC = () => {
  return (
    <div className={styles.latestNews}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.headerContainer}>
          <div className={styles.frame}></div>
          <div className={styles.div}></div>
        </div>

        {/* News Items Container */}
        <div className={styles.newsItemsContainer}>
          {/* News Item 1 */}
          <div className={styles.newsRow}>
            <div className={styles.frame2}></div>
            <div className={styles.newsTitle}>
              <div className={styles.frame3}></div>
              <div className={styles.frame4}>
                <div className={styles.frame5}></div>
                <div className={styles.frame5}></div>
              </div>
            </div>
          </div>
          <div className={styles.line}  />

          {/* News Item 2 */}
          <div className={styles.newsRow}>
            <div className={styles.frame2}></div>
            <div className={styles.newsTitle}>
              <div className={styles.frame3}></div>
              <div className={styles.frame4}>
                <div className={styles.frame5}></div>
                <div className={styles.frame5}></div>
              </div>
            </div>
          </div>
          <div className={styles.line}  />

          {/* News Item 3 */}
          <div className={styles.newsRow}>
            <div className={styles.frame2}></div>
            <div className={styles.newsTitle}>
              <div className={styles.frame3}></div>
              <div className={styles.frame4}>
                <div className={styles.frame5}></div>
                <div className={styles.frame5}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLoader;
