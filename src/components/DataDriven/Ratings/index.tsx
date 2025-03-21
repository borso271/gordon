import React from "react";
import styles from "./Ratings.module.css";
import PercentageBar from "../../PercentageBar";
import SectionHeader from "../../Headings/SectionHeader";
import AnalystRatingLoader from "../../Loaders/RatingsLoader";
import { useAnalystRatings } from "../../../app/hooks/useAnalystRatings";

const AnalystRatings = ({ ticker_symbol }) => {
  const {
    ratings,
    loading,
    error,
    totalRatings,
    mostVotedRating,
    getPercentage,
  } = useAnalystRatings(ticker_symbol);

  const dynamicTitle = mostVotedRating ? (
    <>
      {getPercentage(mostVotedRating.count)}%
      <span className={styles.says}> says </span>
      {mostVotedRating.label}
    </>
  ) : (
    "Ratings"
  );

  if (!ratings) {
    return <AnalystRatingLoader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SectionHeader icon={"ratings_icon"}  title={dynamicTitle} size={24} />
        <p className={styles.subheading}>Based on {totalRatings} analyst ratings</p>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>❌ {error}</p>}

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {[
            { label: "Strong Buy", count: ratings.strong_buy_count },
            { label: "Buy", count: ratings.buy_count },
            { label: "Hold", count: ratings.hold_count },
            { label: "Sell", count: ratings.sell_count },
            { label: "Strong Sell", count: ratings.strong_sell_count },
          ].map(({ label, count }) => (
            <div key={label} className={styles.row}>
              <div className={styles.label}>{label}</div>
              <div className={styles.percentageBarContainer}>
                <PercentageBar percentage={getPercentage(count)} />
              </div>
              <div className={styles.percentage}>{getPercentage(count)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalystRatings;