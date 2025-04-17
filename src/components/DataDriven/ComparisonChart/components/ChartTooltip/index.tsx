"use client";
import React from "react";
import styles from "./ChartTooltip.module.css";
import { useScreenSize } from "../../../../../app/context/screenSizeContext";

type ChartTooltipProps = {
  hoveredPoints: any;
  mousePos: { x: number; y: number };
  language: string;
  containerRef: React.RefObject<HTMLDivElement>;
};

const ChartTooltip = ({
  hoveredPoints,
  mousePos,
  language,
  containerRef,
}: ChartTooltipProps) => {
  const { isMobile } = useScreenSize();
  const tickers = Object.keys(hoveredPoints);

  if (tickers.length === 0 || !containerRef.current) return null;

  const tooltipSize = {
    width: isMobile ? 140 : 160,
    height: isMobile ? 40 + tickers.length * 20 : 50 + tickers.length * 24,
  };

  const locale = language === "ar" ? "ar" : "en-US";

  // Get time from the first ticker
  const firstTicker = tickers[0];
  const formattedTime = new Date(hoveredPoints[firstTicker].time).toLocaleString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // 📌 Position logic
  const rect = containerRef.current.getBoundingClientRect();
  let left = mousePos.x + 10;
  let top = mousePos.y + 10;

  if (left + tooltipSize.width > rect.width) {
    left = rect.width - tooltipSize.width;
  }
  if (top + tooltipSize.height > rect.height) {
    top = rect.height - tooltipSize.height;
  }
  left = Math.max(0, left);
  top = Math.max(0, top);

  return (
    <div
      className={styles.tooltip}
      style={{
        position: "absolute",
        left,
        top,
        width: tooltipSize.width,
        height: tooltipSize.height,
      }}
    >
      <div className={styles.date}>{formattedTime}</div>
      {tickers.map((ticker) => {
        const pt = hoveredPoints[ticker];
        return (
          <div key={ticker} className={styles.priceRow}>
            <span className={styles.ticker}>{ticker}:</span>
            <span className={styles.price}>${pt.price.toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ChartTooltip