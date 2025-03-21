import React from "react";
import styles from "./PriceMiniOverview.module.css";
import SecondaryH2 from "../../../../Headings/SecondaryH2";
import { Period } from "../../../../../app/interfaces";

interface ChangeEntry {
  period: Period;
  last_price: number;
}

interface PriceMiniOverviewProps {
  current_price: number;
  changes: ChangeEntry[];
  period: Period;
}

const PriceMiniOverview: React.FC<PriceMiniOverviewProps> = ({ current_price, changes, period }) => {
  const getLongPeriodLabel = (period: Period): string => {
    switch (period) {
      case "1W":
        return "Last Week";
      case "1M":
        return "Last Month";
      case "1Y":
        return "Last Year";
      case "5Y":
        return "Last Five Years";
      default:
        return "Last Day";
    }
  };

  const longPeriod = getLongPeriodLabel(period);
  const selectedChange = changes.find((change) => change.period === period);

  const percentageChange = selectedChange
    ? ((current_price - selectedChange.last_price) / selectedChange.last_price) * 100
    : null;

  const isPositive = percentageChange !== null && percentageChange >= 0;
  const changeColor = isPositive ? styles.positive : styles.negative;
  const sign = isPositive ? "+" : "-";

  return (
    <div className={styles.container}>
      <SecondaryH2>Price Chart</SecondaryH2>

      <div className={styles.container}>
        {percentageChange !== null ? (
          <div className={styles.item}>
            <span className={`${styles.change} ${changeColor}`}>
              {sign}
              {Math.abs(percentageChange).toFixed(2)}%
            </span>
            <span className={styles.period}>{longPeriod}</span>
          </div>
        ) : (
          <p className={styles.noData}>No data available for this period</p>
        )}
      </div>
    </div>
  );
};

export default PriceMiniOverview;

  