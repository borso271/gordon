import React from "react";
import styles from "./PriceChangeOverview.module.css";
import Icon from "../../../../Icons/Icon";
import { Period } from "../../../../../interfaces";

type PriceChange = {
  period: Period;
  last_price: number;
 
};

interface PriceChangeOverviewProps {
  current_price: number;
  language: string;
  changes: PriceChange[];
}

const PriceChangeOverview: React.FC<PriceChangeOverviewProps> = ({ current_price, language, changes }) => {
  const filteredChanges = changes.filter(({ period }) =>
    ["1W", "1M", "1Y"].includes(period)
  );

  const getArabicPeriod = (period: string): string => {
    switch (period) {
      case "1W":
        return "أسبوع";
      case "1M":
        return "شهر";
      case "1Y":
        return "سنة";
      default:
        return period; // fallback to original
    }
  };
  

  return (
    <div className={styles.container}>
      {filteredChanges.map(({ last_price, period }, index) => {
        const percentageChange = ((current_price - last_price) / last_price) * 100;
        const changeColor = percentageChange >= 0 ? styles.positive : styles.negative;
        const trendIcon = percentageChange >= 0 ? "positive_trend" : "negative_trend";

        return (
          <div key={index} className={styles.item}>
            <div className={styles.period}>
  {language === "ar" ? getArabicPeriod(period) : period}
</div>

         
            <div className={styles.changeGroup}>
              <Icon name={trendIcon} size={8.5} />
              <div className={`${styles.change} ${changeColor}`}>
                {percentageChange.toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceChangeOverview;
