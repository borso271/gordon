import React from "react";
import styles from "./PriceMiniOverview.module.css";
import SecondaryH2 from "../../../../Headings/SecondaryH2";
import { Period } from "../../../../../interfaces";
import Icon from "../../../../Icons/Icon";
import { current_balance, old_balance } from "../../../../../constants";
import { useTranslation } from "react-i18next";
interface ChangeEntry {
  period: Period;
  last_price: number;
}

interface PriceMiniOverviewProps {
  current_price: number;
  changes: ChangeEntry[];
  period: Period;
  language: string
}

const getLongPeriodLabel = (period: Period, language: string): string => {
  if (language === "ar") {
    switch (period) {
      case "1W":
        return "الأسبوع الماضي";
      case "1M":
        return "الشهر الماضي";
      case "1Y":
        return "العام الماضي";
      case "5Y":
        return "الخمسة أعوام الماضية";
      default:
        return "اليوم الماضي";
    }
  }

  // Default: English
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

const PriceMiniOverview: React.FC<PriceMiniOverviewProps> = ({ current_price, changes, period, language }) => {
  const { t } = useTranslation();



//const change = current_balance - old_balance;
// const percentChange = (change / old_balance) * 100;

// const isPositive = change >= 0;
// console.log("price overview params are: ",current_price, changes, period )
  
  const longPeriod = getLongPeriodLabel(period, language);
  const selectedChange = changes.find((change) => change.period === period);

  const changeAmount = current_price - selectedChange.last_price;
  const percentageChange = selectedChange
    ? ((current_price - selectedChange.last_price) / selectedChange.last_price) * 100
    : null;

  const isPositive = percentageChange !== null && percentageChange >= 0;

  const iconName = isPositive ? "positive_trend" : "negative_trend";

const changeClass = `${styles.changeValue} ${isPositive ? styles.positive : styles.negative}`;

const currency = "$"
  const changeColor = isPositive ? styles.positive : styles.negative;
  const sign = isPositive ? "+" : "-";

  return (
    <div className={styles.container}>
    
      <div className={styles.smallHeading}>{t('portfolio.total_market_value')}</div>


      <div className={styles.priceContainer}>

       <div className={styles.bigPrice}>{current_price}</div>

       <div className={styles.priceCurrency}>{currency}</div>
      </div>



      <div className={changeClass}>
  <div>
    <Icon name={iconName} size={14}/>
  </div>

  <div className={styles.currencyAndAmount}>
   
    <div className={styles.amount}>
      {Math.abs(changeAmount).toLocaleString(undefined, { maximumFractionDigits: 1 })}
    </div>
    <div className={styles.currency}>$</div>
  </div>

  <div className={styles.pchange}>
  ({Math.abs(percentageChange).toFixed(2)}%)
</div>

</div>


    </div>
  );
};

export default PriceMiniOverview;

  