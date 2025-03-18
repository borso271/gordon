import React from "react";
import styles from "./ChartTooltip.module.css";
import { useScreenSize } from "../../../../../app/context/screenSizeContext";

type ChartTooltipProps = {
  hoveredPoint: { price: number; time: number; x: number; y: number } | null;
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
};

const ChartTooltip = ({ hoveredPoint, mousePos, containerRef }: ChartTooltipProps) => {
  const { isMobile } = useScreenSize(); // ✅ Hook moved to the top

  if (!hoveredPoint || !containerRef.current) return null; // ✅ Safe to have early return now

  const tooltipSize = {
    width: isMobile ? 125 : 150,
    height: isMobile ? 56 : 60,
  };

  // 📌 Format time in 24-hour format (HH:mm)
  const formattedTime = new Date(hoveredPoint.time).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // 📌 Get container bounds
  const rect = containerRef.current.getBoundingClientRect();

  // 📌 Start with “ideal” position near the cursor
  let left = mousePos.x + 10;
  let top = mousePos.y + 10;

  // 📌 Clamp the tooltip inside the container
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
        width: tooltipSize.width,
        height: tooltipSize.height,
        left,
        top,
      }}
    >
      <div className={styles.price}>${hoveredPoint.price.toFixed(2)}</div>
      <div className={styles.date}>{formattedTime}</div>
    </div>
  );
};

export default ChartTooltip;
