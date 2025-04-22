import React from "react";
import styles from "./BarChart.module.css";


// Helper functions (assuming they exist and work correctly)
// const computeRange = (min: number, max: number): [number, number] => { ... };
// const computeZeroHeight = (maxHeight: number, rangeMin: number, rangeMax: number): number => { ... };

// --- Dummy implementations for testing ---

// Helper functions (assuming they exist and work correctly)
// const computeRange = (min: number, max: number): [number, number] => { ... };
// const computeZeroHeight = (maxHeight: number, rangeMin: number, rangeMax: number): number => { ... };

// --- Dummy implementations for testing ---
const computeRange = (min: number, max: number): [number, number] => {
    // Ensure range includes zero if signs are mixed or one value is zero
    const effectiveMin = Math.min(0, min);
    const effectiveMax = Math.max(0, max);
     // Avoid range being zero if min/max are the same non-zero value
    if (effectiveMin === 0 && effectiveMax === 0 && (min !== 0 || max !== 0)) {
       if (min > 0) return [0, max];
       if (max < 0) return [min, 0];
    }
    // If min/max are identical and non-zero, create a small range around them including zero
    if (min === max && min > 0) return [0, max * 1.1]; // Add 10% padding
    if (min === max && min < 0) return [min * 1.1, 0]; // Add 10% padding
    if (min === max && min === 0) return [0, 0]; // Handle the zero case


    return [effectiveMin, effectiveMax];
};

const computeZeroHeight = (chartAreaHeight: number, rangeMin: number, rangeMax: number): number => {
  const totalRange = rangeMax - rangeMin;

  if (rangeMin >= 0) {
    return 0; // All positive or zero, zero line is at the bottom of the area
  }
  if (rangeMax <= 0) {
    return chartAreaHeight; // All negative or zero, zero line is at the top of the area
  }
   if (totalRange <= 0) {
     // Should ideally not happen if computeRange handles zero range correctly
     return chartAreaHeight / 2; // Default to middle if range is zero
   }
  // Zero line position within the area is proportional to the negative part
  return chartAreaHeight * (Math.abs(rangeMin) / totalRange);
};
// --- End Dummy implementations ---


interface BarData {
  ticker: string;
  value: number;
}

interface BarChartProps {
  colors: string[];
  data: BarData[];
  isPercentage?: boolean;
  maxHeight?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  colors,
  data,
  isPercentage = false,
  maxHeight = 140, // Total height of the container
}) => {
  if (data.length === 0) return null;

  // --- Space Reservation ---
  // Decide how much space labels need at the top/bottom, regardless of zero line position
  const labelSpaceTop = 35; // Space reserved at the very top (for neg labels)
  const labelSpaceBottom = 35; // Space reserved at the very bottom (for pos labels + ticker?) - Adjust as needed

  // Ensure there's enough space to actually draw anything
  const chartAreaHeight = maxHeight - labelSpaceTop - labelSpaceBottom;
  if (chartAreaHeight <= 0) {
      console.warn("BarChart: maxHeight is too small to display chart content with reserved label space.");
      return <div style={{height: `${maxHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'grey'}}>Chart height too small</div>; // Or return null
  }
  // --- End Space Reservation ---


  const values = data.map((d) => d.value);
  const [rangeMin, rangeMax] = computeRange(Math.min(...values), Math.max(...values));

  // Calculate zero position *within the chartAreaHeight*
  const zeroHeightInArea = computeZeroHeight(chartAreaHeight, rangeMin, rangeMax);

  // Calculate the absolute position of the zero line from the bottom of the *maxHeight* container
  const absoluteZeroPosition = zeroHeightInArea + labelSpaceBottom;

  console.log('maxHeight:', maxHeight);
  console.log('chartAreaHeight:', chartAreaHeight);
  console.log('ranges:', rangeMin, rangeMax);
  console.log('zeroHeightInArea:', zeroHeightInArea);
  console.log('absoluteZeroPosition:', absoluteZeroPosition);


  const gap = 8;
  const barMinWidth = 32;
  const totalWidth = data.length * barMinWidth + (data.length - 1) * gap;

  // Constants for label positioning offsets *relative to the absoluteZeroPosition*
  // These might need slight tweaking now compared to before
  const labelOffsetBelow = 30; // How far below absolute zero line for positive label
  const labelOffsetAbove = 11; // How far above absolute zero line for negative label

  return (
    <div className={styles.chartWrapper} style={{ height: `${maxHeight}px` }}>
      {/* Zero line - positioned using absoluteZeroPosition */}
      <div className={styles.zeroLine} style={{ bottom: `${absoluteZeroPosition}px` }} />

      <div className={styles.scrollWrapper}>
        <div
          className={styles.barContainer}
          style={{
            minWidth: `${totalWidth}px`,
            gap: `${gap}px`,
            // No padding needed here if calculations below account for labelSpaceTop/Bottom
          }}
        >
          {data.map((item, index) => {
            const color = colors[index % colors.length];
            const isPositive = item.value >= 0;

            // Calculate available space above/below zero *within the chart area*
            const spaceAboveZeroInArea = chartAreaHeight - zeroHeightInArea;
            const spaceBelowZeroInArea = zeroHeightInArea;

            // Calculate bar height using space within the chart area
            let height = 0;
            if (isPositive && rangeMax > 0) {
              // Use space above zero in the chart area
              height = spaceAboveZeroInArea * (item.value / rangeMax);
            } else if (!isPositive && rangeMin < 0) {
              // Use space below zero in the chart area
              // Height is positive length, calculated from negative value and negative range bound
              height = spaceBelowZeroInArea * (item.value / rangeMin);
            }
            height = Math.max(0, height || 0); // Ensure non-negative height

            // Calculate empty spaces, including the reserved labelSpace
            const emptySpaceAboveHeight = labelSpaceTop + (isPositive
                ? Math.max(0, spaceAboveZeroInArea - height) // Space left above bar in chart area
                : spaceAboveZeroInArea); // Full space above zero in chart area for negative bars

            const emptySpaceBelowHeight = labelSpaceBottom + (isPositive
                ? spaceBelowZeroInArea // Full space below zero in chart area for positive bars
                : Math.max(0, spaceBelowZeroInArea - height)); // Space left below bar in chart area

             // Sanity check (optional): Sum should approximately equal maxHeight
             // console.log(`Bar ${index}: H=${height.toFixed(1)}, Above=${emptySpaceAboveHeight.toFixed(1)}, Below=${emptySpaceBelowHeight.toFixed(1)}, Sum=${(height + emptySpaceAboveHeight + emptySpaceBelowHeight).toFixed(1)} vs ${maxHeight}`);


            const displayValue = isPercentage
              ? `${item.value.toFixed(1)}%`
              : item.value;

            // Position label relative to the absoluteZeroPosition
            const labelStyle: React.CSSProperties = {
              bottom: isPositive
                ? `${absoluteZeroPosition - labelOffsetBelow}px`
                : `${absoluteZeroPosition + labelOffsetAbove}px`,
            };

            const barTitle = `${item.ticker}: ${displayValue}`;

            return (
              <div key={item.ticker} className={styles.barWrapper} style={{ minWidth: `${barMinWidth}px` }}>
                 {/* Top Empty Space */}
                <div
                  className={styles.emptySpace}
                  style={{ height: `${emptySpaceAboveHeight}px`, width: '100%' }}
                />
                 {/* Bar */}
                <div
                  className={styles.bar}
                  style={{ height: `${height}px`, backgroundColor: color, width: '100%' }}
                  title={barTitle}
                />
                 {/* Bottom Empty Space */}
                <div
                  className={styles.emptySpace}
                  style={{ height: `${emptySpaceBelowHeight}px`, width: '100%' }}
                />
                 {/* Value Label */}
                <div className={styles.valueLabel} style={labelStyle}>
                  {displayValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;

// const BarChart: React.FC<BarChartProps> = ({ colors, data, isPercentage, maxHeight = 200 }) => {
//   if (data.length === 0) return null;

//   const values = data.map((d) => d.value);
//   const [rangeMin, rangeMax] = computeRange(Math.min(...values), Math.max(...values));
//   const zeroHeight = computeZeroHeight(maxHeight, rangeMin, rangeMax);


//   console.log("ranges are : ", rangeMin, rangeMax);
//   console.log("zeroheight is: ", zeroHeight);

//   const gap = 8;
// const barMinWidth = 32;
// const totalWidth = data.length * barMinWidth + (data.length - 1) * gap;


// return (
//     <div className={styles.chartWrapper} style={{ height: `${maxHeight}px` }}>
//       {/* Zero line */}
//       <div className={styles.zeroLine} style={{ bottom: `${zeroHeight}px` }} />
  
//       {/* Horizontal scrollable container */}
//       <div className={styles.scrollWrapper}>
//         <div
//           className={styles.barContainer}
//           style={{
//             minWidth: `${totalWidth}px`,
//             gap: `${gap}px`,
//           }}
//         >
         
//           {data.map((item, index) => {
//             const color = colors[index % colors.length];
//             const isPositive = item.value >= 0;
  
//             const height = isPositive
//               ? (maxHeight - zeroHeight) * (item.value / rangeMax)
//               : zeroHeight * (item.value / rangeMin);
  
//             return (
//               <div key={item.ticker} className={styles.barWrapper}>
//                 <div
//                   className={styles.emptySpace}
//                   style={{
//                     height: isPositive
//                       ? `${maxHeight - zeroHeight - height}px`
//                       : "0px",
//                   }}
//                 />
//                 <div
//                   className={styles.bar}
//                   style={{
//                     height: `${Math.abs(height)}px`,
//                     backgroundColor: color,
//                   }}
//                   title={`${item.ticker}: ${item.value}${isPercentage ? "%" : ""}`}
//                 />
//                 <div
//                   className={styles.emptySpace}
//                   style={{
//                     height: isPositive
//                       ? `${zeroHeight}px`
//                       : `${zeroHeight - height}px`,
//                   }}
//                 />
//               </div>
//             );
//           })}

//         </div>
//       </div>
//     </div>
//   );
  
// };

// export default BarChart;
