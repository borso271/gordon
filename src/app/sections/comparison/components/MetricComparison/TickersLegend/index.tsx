import React from "react";
import styles from "./TickersLegend.module.css";

interface RawDataEntry {
  ticker: string;
  data: {
    [metricName: string]: {
      value?: string;
      one_quarter_trend?: string;
      one_year_trend?: string;
    };
  };
}

interface TickersLegendProps {
  rawData: RawDataEntry[];
  colors: string[];
}

const TickersLegend: React.FC<TickersLegendProps> = ({ rawData, colors }) => {
  return (
    <div className={styles.legendRow}>
      {rawData.map((entry, index) => (
        <div className={styles.legendItem} key={entry.ticker}>
          <div
            className={styles.colorDot}
            style={{ backgroundColor: colors[index % colors.length] }}
          />
          <span className={styles.ticker}>{entry.ticker}</span>
        </div>
      ))}
    </div>
  );
};

export default TickersLegend;
