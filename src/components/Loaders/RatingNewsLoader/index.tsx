import React from "react";
import styles from "./RatingNewsLoader.module.css";
import AnalystRatingLoader from "../RatingsLoader";
import LatestNewsLoader from "../NewsLoader";

const RatingsNewsLoader: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <AnalystRatingLoader />
      </div>
      <div className={styles.rightSection}>
        <LatestNewsLoader />
      </div>
    </div>
  );
};

export default RatingsNewsLoader;
