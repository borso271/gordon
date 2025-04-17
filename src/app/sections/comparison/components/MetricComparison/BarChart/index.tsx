import React from "react";
import styles from "./BarChart.module.css";
import { computeRange } from "../../../utils";
import { computeZeroHeight } from "../../../utils";

type BarChartProps = {
  colors: any;
  data: { ticker: string; value: number }[];
  isPercentage: boolean;
  maxHeight?: number; // Optional override
};

const BarChart: React.FC<BarChartProps> = ({ colors, data, isPercentage, maxHeight = 200 }) => {
  if (data.length === 0) return null;

  const values = data.map((d) => d.value);
  const [rangeMin, rangeMax] = computeRange(Math.min(...values), Math.max(...values));
  const zeroHeight = computeZeroHeight(maxHeight, rangeMin, rangeMax);


  console.log("ranges are : ", rangeMin, rangeMax);
  console.log("zeroheight is: ", zeroHeight);

  const gap = 8;
const barMinWidth = 32;
const totalWidth = data.length * barMinWidth + (data.length - 1) * gap;


return (
    <div className={styles.chartWrapper} style={{ height: `${maxHeight}px` }}>
      {/* Zero line */}
      <div className={styles.zeroLine} style={{ bottom: `${zeroHeight}px` }} />
  
      {/* Horizontal scrollable container */}
      <div className={styles.scrollWrapper}>
        <div
          className={styles.barContainer}
          style={{
            minWidth: `${totalWidth}px`,
            gap: `${gap}px`,
          }}
        >
          {data.map((item, index) => {
            const color = colors[index % colors.length];
            const isPositive = item.value >= 0;
  
            const height = isPositive
              ? (maxHeight - zeroHeight) * (item.value / rangeMax)
              : zeroHeight * (item.value / rangeMin);
  
            return (
              <div key={item.ticker} className={styles.barWrapper}>
                <div
                  className={styles.emptySpace}
                  style={{
                    height: isPositive
                      ? `${maxHeight - zeroHeight - height}px`
                      : "0px",
                  }}
                />
                <div
                  className={styles.bar}
                  style={{
                    height: `${Math.abs(height)}px`,
                    backgroundColor: color,
                  }}
                  title={`${item.ticker}: ${item.value}${isPercentage ? "%" : ""}`}
                />
                <div
                  className={styles.emptySpace}
                  style={{
                    height: isPositive
                      ? `${zeroHeight}px`
                      : `${zeroHeight - height}px`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  
//   return (

//     <div className={styles.chartWrapper} style={{ height: `${maxHeight}px` }}>
      
//       <div className={styles.zeroLine} style={{ bottom: `${zeroHeight}px` }} />

//       {/* Bars */}
//       <div className={styles.barContainer}>
        

//       {data.map((item, index) => {
//   const color = COLORS[index % COLORS.length];
//   const isPositive = item.value >= 0;

//   const height = isPositive
//     ? (maxHeight - zeroHeight) * (item.value / rangeMax)
//     : zeroHeight * (item.value / rangeMin); // value and rangeMin are both negative

//   return (
//     <div key={item.ticker} className={styles.barWrapper}>
//       <div className={styles.emptySpace} style={{ height: isPositive ? `${maxHeight - zeroHeight - height}px` : "0px" }} />
//       <div
//         className={styles.bar}
//         style={{
//           height: `${Math.abs(height)}px`,
//           backgroundColor: color,
//         }}
//         title={`${item.ticker}: ${item.value}${isPercentage ? "%" : ""}`}
//       />
//       <div className={styles.emptySpace} style={{ height: isPositive ? zeroHeight : `${zeroHeight - height}px` }} />
//     </div>
//   );

// })}


//       </div>
//     </div>
//   );
};

export default BarChart;
