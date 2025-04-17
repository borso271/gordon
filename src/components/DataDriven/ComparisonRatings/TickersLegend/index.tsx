import React from "react";
import styles from "./TickersLegend.module.css";

interface TickersLegendProps {
  tickers: string[];
}

const COLORS = [
  "#B1F625",
  "#FFFFFF",
  "#F18F01",
  "#00B4D8",
  "#FF4D6D",
  "#A06CD5",
  "#FFD166",
];

const TickersLegend: React.FC<TickersLegendProps> = ({ tickers }) => {
  return (
    <div className={styles.legendWrapper}>
      {tickers.map((ticker, index) => (
        <div key={ticker} className={styles.legendItem}>
          <span
            className={styles.colorDot}
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className={styles.tickerText}>{ticker}</span>
        </div>
      ))}
    </div>
  );
};

export default TickersLegend;
