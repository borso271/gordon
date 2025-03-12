import React, { useState, useEffect } from "react";
import styles from "./ChartTooltip.module.css";
import { useScreenSize } from "../../../../../app/context/screenSizeContext";
type ChartTooltipProps = {
  hoveredPoint: { price: number; time: number; x: number; y: number };
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;

};

const ChartTooltip = ({ hoveredPoint, mousePos, containerRef }: ChartTooltipProps) => {
  if (!hoveredPoint || !containerRef.current) return null;

  const { isMobile } = useScreenSize(); // ✅ Get isMobile globally
  // ✅ Use `isMobile` prop to determine tooltip size
  const tooltipSize = {
    width: isMobile ? 120 : 145,
    height: isMobile ? 56 : 60,
  };


  // 📌 2) Format time in 24-hour format (HH:mm)
  const formattedTime = new Date(hoveredPoint.time).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // 📌 3) Get container bounds
  const rect = containerRef.current.getBoundingClientRect();

  // 📌 4) Start with “ideal” position near the cursor
  let left = mousePos.x + 10;
  let top = mousePos.y + 10;

  // 📌 5) Clamp the tooltip inside the container
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
        width: tooltipSize.width, // Dynamically adjusted width
        height: tooltipSize.height, // Dynamically adjusted height
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



// import React from "react";
// import styles from "./ChartTooltip.module.css";

// const ChartTooltip = ({ hoveredPoint, screenX, screenY }) => {

//   //// console.log("DATA FOR TOOLTIP", hoveredPoint, screenX, screenY)
//   if (!hoveredPoint) return null;

 
//   const formattedTime = new Date(hoveredPoint.time).toLocaleString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
  

//   return (
//     <div
//       className={styles.tooltip}
    
//         style={{
//           left: screenX + 10,
//           top: screenY + 10,
//         }}
      
//     >
//       <div className={styles.price}> ${hoveredPoint.price.toFixed(2)}</div>
//       <div className={styles.date}> {formattedTime}</div>
//     </div>
//   );
// };

// export default ChartTooltip;

