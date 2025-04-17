import React from "react";
import styles from "./PeriodSelector.module.css";
import { Period } from "../../../../../interfaces";

interface PeriodSelectorProps {
  selectedPeriod: Period;
  setSelectedPeriod: (period: Period) => void;
  language: string;
}

const periods: Period[] = ["1D", "1W", "1M", "1Y", "5Y"];

const getLocalizedPeriod = (period: Period, language: string): string => {
  if (language === "ar") {
    switch (period) {
      case "1D":
        return "يوم";
      case "1W":
        return "أسبوع";
      case "1M":
        return "شهر";
      case "1Y":
        return "سنة";
      case "5Y":
        return "٥ سنوات";
      default:
        return period;
    }
  }

  // Default to English
  return period;
};


const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, setSelectedPeriod, language }) => {
  return (
    <div className={styles.container}>
      {periods.map((period) => (
        <button
          key={period}
          className={`${styles.button} ${selectedPeriod === period ? styles.active : ""}`}
          onClick={() => setSelectedPeriod(period)}
        >
          {getLocalizedPeriod(period, language)}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;