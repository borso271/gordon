import React from "react";
import styles from "./PriceMiniOverview.module.css";
import SecondaryH2 from "../../../../Headings/SecondaryH2";
import { Period } from "../../../../../interfaces";
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

const getLongPeriodLabel = (period: Period, t: (key: string) => string): string => {
  switch (period) {
    case "1W":
      return t("price_overview.periods.1w");
    case "1M":
      return t("price_overview.periods.1m");
    case "1Y":
      return t("price_overview.periods.1y");
    case "5Y":
      return t("price_overview.periods.5y");
    default:
      return t("price_overview.periods.1d");
  }
};

const PriceMiniOverview: React.FC<PriceMiniOverviewProps> = ({ current_price, changes, period }) => {
  const { t } = useTranslation();

  const longPeriod = getLongPeriodLabel(period, t);
  const selectedChange = changes.find((change) => change.period === period);

  const percentageChange = selectedChange
    ? ((current_price - selectedChange.last_price) / selectedChange.last_price) * 100
    : null;

  const isPositive = percentageChange !== null && percentageChange >= 0;
  const changeColor = isPositive ? styles.positive : styles.negative;
  const sign = isPositive ? "+" : "-";

  return (
    <div className={styles.container}>
      <SecondaryH2>{t("price_overview.title")}</SecondaryH2>

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
          <p className={styles.noData}>{t("price_overview.no_data")}</p>
        )}
      </div>
    </div>
  );
};

export default PriceMiniOverview;


// const getLongPeriodLabel = (period: Period, language: string): string => {
//   if (language === "ar") {
//     switch (period) {
//       case "1W":
//         return "الأسبوع الماضي";
//       case "1M":
//         return "الشهر الماضي";
//       case "1Y":
//         return "العام الماضي";
//       case "5Y":
//         return "الخمسة أعوام الماضية";
//       default:
//         return "اليوم الماضي";
//     }
//   }

//   // Default: English
//   switch (period) {
//     case "1W":
//       return "Last Week";
//     case "1M":
//       return "Last Month";
//     case "1Y":
//       return "Last Year";
//     case "5Y":
//       return "Last Five Years";
//     default:
//       return "Last Day";
//   }
// };

// const PriceMiniOverview: React.FC<PriceMiniOverviewProps> = ({ current_price, changes, period, language }) => {
 
//   const priceChartHeading = language == "en" ? "Price Chart" : "مخطط السعر";
//   const noDataAvailableText = language == "en" ? "No data available for this period." : "لا توجد بيانات لهذه الفترة.";
  
//   const longPeriod = getLongPeriodLabel(period, language);
//   const selectedChange = changes.find((change) => change.period === period);

//   const percentageChange = selectedChange
//     ? ((current_price - selectedChange.last_price) / selectedChange.last_price) * 100
//     : null;

//   const isPositive = percentageChange !== null && percentageChange >= 0;
//   const changeColor = isPositive ? styles.positive : styles.negative;
//   const sign = isPositive ? "+" : "-";

//   return (
//     <div className={styles.container}>
//       <SecondaryH2>{priceChartHeading}</SecondaryH2>

//       <div className={styles.container}>
//         {percentageChange !== null ? (
//           <div className={styles.item}>
//             <span className={`${styles.change} ${changeColor}`}>
//               {sign}
//               {Math.abs(percentageChange).toFixed(2)}%
//             </span>
//             <span className={styles.period}>{longPeriod}</span>
//           </div>
//         ) : (
//           <p className={styles.noData}>{noDataAvailableText}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PriceMiniOverview;

  