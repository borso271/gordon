import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./PeriodSelector.module.css"; // adjust path as needed

import { Period } from "../../../../../interfaces";
interface PeriodSelectorProps {
  selectedPeriod: Period;
  setSelectedPeriod: (p: Period) => void;
}

const periods: Period[] = ["1D", "1W", "1M", "1Y", "5Y"];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, setSelectedPeriod }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {periods.map((period) => (
        <button
          key={period}
          className={`${styles.button} ${selectedPeriod === period ? styles.active : ""}`}
          onClick={() => setSelectedPeriod(period)}
        >
          {t(`chart.${period}`)}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;

// const periods: Period[] = ["1D", "1W", "1M", "1Y", "5Y"];

// const getLocalizedPeriod = (period: Period, language: string): string => {
//   if (language === "ar") {
//     switch (period) {
//       case "1D":
//         return "يوم";
//       case "1W":
//         return "أسبوع";
//       case "1M":
//         return "شهر";
//       case "1Y":
//         return "سنة";
//       case "5Y":
//         return "٥ سنوات";
//       default:
//         return period;
//     }
//   }

//   // Default to English
//   return period;
// };


// const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, setSelectedPeriod, language }) => {
//   return (
//     <div className={styles.container}>
//       {periods.map((period) => (
//         <button
//           key={period}
//           className={`${styles.button} ${selectedPeriod === period ? styles.active : ""}`}
//           onClick={() => setSelectedPeriod(period)}
//         >
//           {getLocalizedPeriod(period, language)}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default PeriodSelector;