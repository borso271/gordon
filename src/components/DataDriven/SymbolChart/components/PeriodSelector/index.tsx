import React from "react";
import styles from "./PeriodSelector.module.css";
import { Period } from "../../../../../interfaces";

interface PeriodSelectorProps {
  selectedPeriod: Period;
  setSelectedPeriod: (period: Period) => void;
}

const periods: Period[] = ["1D", "1W", "1M", "1Y", "5Y"];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, setSelectedPeriod }) => {
  return (
    <div className={styles.container}>
      {periods.map((period) => (
        <button
          key={period}
          className={`${styles.button} ${selectedPeriod === period ? styles.active : ""}`}
          onClick={() => setSelectedPeriod(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;