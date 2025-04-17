

import React from "react";
import styles from "./CompareRatings.module.css";
import { useTranslation } from "react-i18next";
import { useAnalystRatings } from "../../../app/hooks/useAnalystRatings";
import SectionHeader from "../../Headings/SectionHeader";
import ComparisonProgressBars from "./ComparisonProgressBars";
import TickersLegend from "./TickersLegend";


interface RatingEntry {
  ticker: string;
  ratings: any;
}

interface CompareRatingsProps {
  ratings: RatingEntry[];
}

const CompareRatings: React.FC<CompareRatingsProps> = ({ ratings }) => {
  
    const { t } = useTranslation();

    // Fallback values if ratings is invalid
    const [leftEntry, rightEntry] = ratings || [];
  
    const leftRatings = leftEntry?.ratings || [];
    const rightRatings = rightEntry?.ratings || [];
    const leftTicker = leftEntry?.ticker || "";
    const rightTicker = rightEntry?.ticker || "";
  
    const {
      getPercentage: getLeftPct,
      totalRatings: totalLeft,
      error: leftError,
    } = useAnalystRatings(leftRatings);
  
    const {
      getPercentage: getRightPct,
      totalRatings: totalRight,
      error: rightError,
    } = useAnalystRatings(rightRatings);
  
    // Conditional rendering AFTER hooks
    if (!Array.isArray(ratings) || ratings.length !== 2) return null;

  const buyScore = (r: any) => (r?.buy_count || 0) + (r?.strong_buy_count || 0);

  const leftBuyPct = getLeftPct(buyScore(leftRatings));
  const rightBuyPct = getRightPct(buyScore(rightRatings));

  const title =
    leftBuyPct > rightBuyPct
      ? t("comparison_ratings.title", { name: leftTicker })
      : t("comparison_ratings.title", { name: rightTicker });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SectionHeader icon="ratings_icon" title={title} size={24} />
        <p className={styles.subheading}>
          {t("comparison_ratings.subheading", {
            leftCount: totalLeft,
            rightCount: totalRight,
          })}
        </p>
      </div>

      {(leftError || rightError) && (
        <p className={styles.error}>
          ❌ {t("error")}: {leftError || rightError}
        </p>
      )}

      <div className={styles.grid}>
        {["strong_buy", "buy", "hold", "sell", "strong_sell"].map(
          (labelKey) => (
            <div key={labelKey} className={styles.row}>
              <div className={styles.label}>
                {t(`comparison_ratings.${labelKey}`)}
              </div>
              
              <ComparisonProgressBars
                value1={getLeftPct(leftRatings[`${labelKey}_count`])}
                value2={getRightPct(rightRatings[`${labelKey}_count`])}
              />
            </div>
          )
        )}
      </div>

      <TickersLegend tickers={[leftTicker, rightTicker]} />
    </div>
  );
};

export default CompareRatings;