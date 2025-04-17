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
