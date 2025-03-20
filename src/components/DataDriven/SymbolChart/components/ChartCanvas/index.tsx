// import { useEffect, useRef } from "react";
// import styles from "./ChartCanvas.module.css";

// import React from "react";
// import styles from "./ChartCanvas.module.css";
import React from "react";
import styles from "./ChartCanvas.module.css";
import { useChartCanvas } from "../../../../../app/hooks/useChartCanvas";
import ChartTooltip from "../ChartTooltip";

interface ChartCanvasProps {
  data?: any[];
  minPrice: number;
  isPositiveChange: boolean;
  width?: number;
  height?: number;
  area?: boolean;
  marketOpen?: boolean;
  curvy?: boolean;
}

const ChartCanvas: React.FC<ChartCanvasProps> = ({
  data = [],
  minPrice,
  isPositiveChange,
  width = 500,
  height = 300,
  area = true,
  marketOpen = true,
  curvy = true,
}) => {
  const {
    svgRef,
    containerRef,
    hoveredPoint,
    hoverPos,
    linePath,
    areaPath,
    lastX,
    lastY,
    handlePointerMove,  // renamed from handleMouseMove
    handlePointerLeave, // renamed from handleMouseLeave
    lineColor,
    stopColor1,
    stopColor2,
    strokeWidth,
    dashArray,
    circleRadius,
    circleStrokeWidth,
  } = useChartCanvas({
    data,
    minPrice,
    isPositiveChange,
    width,
    height,
    area,
    marketOpen,
    curvy,
  });

  // If the data has fewer than 2 points, just return the empty chart.
  if (data.length < 2) {
    return (
      <div className={styles.chartWrapper} ref={containerRef}>
        <svg
          ref={svgRef}
          className={styles.canvas}
          width={width}
          height={height}
        />
      </div>
    );
  }

  return (
    <div className={styles.chartWrapper} ref={containerRef}>
      <svg
        ref={svgRef}
        className={styles.canvas}
        width="100%"
        height="100%"
        // Important: unify mouse and touch using pointer events
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        // This ensures the browser doesn't treat drags as scroll/zoom
        // (especially for mobile). You may want to fine-tune or remove
        // if you still want to allow e.g. page scrolling with a drag.
       // style={{ touchAction: "none" }}
       

      >
        <g>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stopColor1} stopOpacity="0.4" />
              <stop offset="100%" stopColor={stopColor2} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Line path */}
          <path
            d={linePath}
            fill="none"
            stroke={lineColor}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />

          {/* Area fill */}
          {area && <path d={areaPath} fill="url(#lineGradient)" stroke="none" />}

          {/* Pulsing circle if marketOpen */}
          {marketOpen && (
            <circle
              cx={lastX}
              cy={lastY}
              r={8}
              className={styles.pulsatingCircle}
              fill={lineColor}
            />
          )}

          {/* Static circle at last data point */}
          <circle cx={lastX} cy={lastY} r={3} fill={lineColor} />

          {/* Hover crosshair & circle */}
          {hoveredPoint && (
            <>
              <line
                x1={hoveredPoint.x}
                x2={hoveredPoint.x}
                y1={hoveredPoint.y}
                y2={2000}
                stroke={lineColor}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                // Keep pointerEvents off so the line itself doesn't block pointer
                pointerEvents="none"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r={circleRadius}
                fill="#0F0F0F"
                stroke={lineColor}
                strokeWidth={circleStrokeWidth}
                pointerEvents="none"
              />
            </>
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <ChartTooltip
          hoveredPoint={hoveredPoint}
          mousePos={hoverPos}
          containerRef={containerRef}
        />
      )}
    </div>
  );
};

export default ChartCanvas;


// import React from "react";
// import styles from "./ChartCanvas.module.css"; // Adjust path
// import { useChartCanvas } from "../../../../../app/hooks/useChartCanvas";
// import ChartTooltip from "../ChartTooltip";

// interface ChartCanvasProps {
//   data?: any[];
//   minPrice: number;
//   isPositiveChange: boolean;
//   width?: number;
//   height?: number;
//   area?: boolean;
//   marketOpen?: boolean;
//   curvy?: boolean;
// }

// const ChartCanvas: React.FC<ChartCanvasProps> = ({
//   data = [],
//   minPrice,
//   isPositiveChange,
//   width = 500,
//   height = 300,
//   area = true,
//   marketOpen = true,
//   curvy = true,
// }) => {
//   // ✅ Call the custom hook
//   const {
//     svgRef,
//     containerRef,
//     hoveredPoint,
//     hoverPos,
//     linePath,
//     areaPath,
//     lastX,
//     lastY,
//     handleMouseMove,
//     handleMouseLeave,
//     lineColor,
//     stopColor1,
//     stopColor2,
//     strokeWidth,
//     dashArray,
//     circleRadius,
//     circleStrokeWidth,
//   } = useChartCanvas({
//     data,
//     minPrice,
//     isPositiveChange,
//     width,
//     height,
//     area,
//     marketOpen,
//     curvy,
//   });

//   // Original fallback if < 2 points
//   if (data.length < 2) {
//     return (
//       <div className={styles.chartWrapper} ref={containerRef}>
//         <svg
//           ref={svgRef}
//           className={styles.canvas}
//           width={width}
//           height={height}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className={styles.chartWrapper} ref={containerRef}>
//       <svg
//         ref={svgRef}
//         className={styles.canvas}
//         width="100%"
//         height="100%"
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//       >
//         <g>
//           <defs>
//             <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor={stopColor1} stopOpacity="0.4" />
//               <stop offset="100%" stopColor={stopColor2} stopOpacity="0" />
//             </linearGradient>
//           </defs>

//           {/* Line path */}
//           <path
//             d={linePath}
//             fill="none"
//             stroke={lineColor}
//             strokeWidth={2}
//             vectorEffect="non-scaling-stroke"
//           />

//           {/* Area fill */}
//           {area && <path d={areaPath} fill="url(#lineGradient)" stroke="none" />}

//           {/* Pulsing circle if marketOpen */}
//           {marketOpen && (
//             <circle
//               cx={lastX}
//               cy={lastY}
//               r={8}
//               className={styles.pulsatingCircle}
//               fill={lineColor}
//             />
//           )}

//           {/* Static circle at last data point */}
//           <circle cx={lastX} cy={lastY} r={3} fill={lineColor} />

//           {/* Hover crosshair & circle */}
//           {hoveredPoint && (
//             <>
//               <line
//                 x1={hoveredPoint.x}
//                 x2={hoveredPoint.x}
//                 y1={hoveredPoint.y}
//                 y2={2000}
//                 stroke={lineColor}
//                 strokeWidth={strokeWidth}
//                 strokeDasharray={dashArray}
//               />

//               <circle
//                 cx={hoveredPoint.x}
//                 cy={hoveredPoint.y}
//                 r={circleRadius}
//                 fill="#0F0F0F"
//                 stroke={lineColor}
//                 strokeWidth={circleStrokeWidth}
//               />
//             </>
//           )}
//         </g>
//       </svg>

//       {/* Tooltip */}
//       {hoveredPoint && (
//         <ChartTooltip
//           hoveredPoint={hoveredPoint}
//           mousePos={hoverPos}
//           containerRef={containerRef}
//         />
//       )}
//     </div>
//   );
// };

// export default ChartCanvas;



// /**
//  * @param {Object[]} data Array of points with { time, price }
//  * @param {number} minTime Minimum time on X scale
//  * @param {number} maxTime Maximum time on X scale
//  * @param {number} minPrice Minimum price on Y scale
//  * @param {number} maxPrice Maximum price on Y scale
//  * @param {number} width SVG width
//  * @param {number} height SVG height
//  * @param {boolean} area Whether to fill area under the line
//  * @param {boolean} marketOpen If true, show an extra pulsating circle at the last point
//  */


// import React, { useState, useRef, useEffect, useCallback } from "react";
// import styles from "./ChartCanvas.module.css";
// import ChartTooltip from "../ChartTooltip";
// import * as d3 from "d3";
// import { useScreenSize } from "../../../../../app/context/screenSizeContext"; // Import the custom hook

// const ChartCanvas = ({
//   data = [],
//   minPrice,
//   isPositiveChange,
//   width = 500,
//   height = 300,
//   area = true,
//   marketOpen = true,
//   curvy = true,
// }) => {

//   const svgRef = useRef(null);
//   // 🔹 NEW: containerRef to clamp tooltip inside
//   const containerRef = useRef(null);
//   const { isMobile } = useScreenSize(); // ✅ Get isMobile globally

//   // Store the hovered point + local coordinates for tooltip
//   const [hoveredPoint, setHoveredPoint] = useState(null);  // e.g. { time, price, x, y }
//   const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 }); // x/y in container space

//   // 1. Sort by 'time' in ascending order (if needed)
//   const sortedData = data; // or [...data].sort((a, b) => a.time - b.time);

//   if (data.length < 2) {
//     return (
//       <div className={styles.chartWrapper} ref={containerRef}>
//         <svg
//           ref={svgRef}
//           className={styles.canvas}
//           width={width}
//           height={height}
         
//         />
//       </div>
//     );
//   }

//   // ---------------------------
//   //  Generate paths (line/area)
//   // ---------------------------
//   const generateLinePath = (sortedData, curvy) => {
//     if (!sortedData.length) return "";
//     if (curvy) {
//       const lineGenerator = d3
//         .line()
//         .x((d) => d.x)
//         .y((d) => d.y)
//         .curve(d3.curveMonotoneX);
//       return lineGenerator(sortedData);
//     } else {
//       return sortedData.reduce((acc, point, i) => {
//         return i === 0
//           ? `M ${point.x},${point.y}`
//           : `${acc} L ${point.x},${point.y}`;
//       }, "");
//     }
//   };

//   const generateAreaPath = (data, minPrice, curvy, area) => {
//     if (!area || !data.length) return "";
//     // Extra "bottom" so area goes off-screen (or to your chart’s baseline)
//     const bottomY = 2000;

//     const lastX = data[data.length - 1].x;
//     const firstX = data[0].x;

//     const extendedData = [
//       ...data,
//       { x: lastX, y: bottomY }, // bottom-right
//       { x: firstX, y: bottomY }, // bottom-left
//     ];

//     if (curvy) {
//       const areaGenerator = d3
//         .area()
//         .x((d) => d.x)
//         .y0(() => minPrice)
//         .y1((d) => d.y)
//         .curve(d3.curveMonotoneX);
//       return areaGenerator(extendedData);
//     } else {
//       let areaPath = `M ${data[0].x},${data[0].y}`;
//       for (let i = 1; i < data.length; i++) {
//         areaPath += ` L ${data[i].x},${data[i].y}`;
//       }
//       areaPath += ` L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
//       return areaPath;
//     }
//   };

//   const computeLastPoint = (data) => {
//     if (!data.length) return { lastX: 0, lastY: 0 };
//     const { x: lastX, y: lastY } = data[data.length - 1];
//     return { lastX, lastY };
//   };

//   const linePath = generateLinePath(sortedData, curvy);
//   const areaPath = generateAreaPath(sortedData, minPrice, curvy, area);
//   const { lastX, lastY } = computeLastPoint(sortedData);

//   // ---------------------------
//   //  Mouse move & nearest point
//   // ---------------------------
//   const handleMouseMove = (e) => {
//     if (!svgRef.current || !containerRef.current) return;

//     // 1) Calculate pointer position relative to container
//     const containerRect = containerRef.current.getBoundingClientRect();
//     const offsetX = e.clientX - containerRect.left;
//     const offsetY = e.clientY - containerRect.top;
//     setHoverPos({ x: offsetX, y: offsetY });

//     // 2) Convert to SVG coordinate system
//     const pt = svgRef.current.createSVGPoint();
//     pt.x = e.clientX;
//     pt.y = e.clientY;
//     const svgCoords = pt.matrixTransform(
//       svgRef.current.getScreenCTM().inverse()
//     );

//     // 3) Find nearest data point
//     const mouseX = svgCoords.x;
//     let nearest = data[0];
//     let minDist = Math.abs(nearest.x - mouseX);
//     for (let i = 1; i < data.length; i++) {
//       const dist = Math.abs(data[i].x - mouseX);
//       if (dist < minDist) {
//         nearest = data[i];
//         minDist = dist;
//       }
//     }

//     // 4) Update hovered point
//     setHoveredPoint({
//       ...nearest,
//       x: nearest.x, // exact chart x
//       y: nearest.y, // exact chart y
//     });
//   };

//   const handleMouseLeave = () => {
//     setHoveredPoint(null);
//   };

//   const lineColor = isPositiveChange ? "#1AED87" : "#ED441A";
//   const stopColor1 =isPositiveChange ?  "rgba(26, 237, 135, 0.1)" : "rgba(237, 68, 26, 0.1)";
//   const stopColor2 = isPositiveChange ? "rgba(26, 237, 135, 0.2)" : "rgba(237, 68, 26, 0.2)";

//   {/* Define mobile-specific properties */}
// const strokeWidth = isMobile ? 1 : 1.5;
// const dashArray = isMobile ? "5,3" : "6,4"; // 1px shorter dash & gap
// const circleRadius = isMobile ? 4 : 5; // Smaller radius for mobile
// const circleStrokeWidth = isMobile ? 1.5 : 2; // Thinner stroke for mobile

//   return (
//     <div className={styles.chartWrapper} ref={containerRef}>
//       <svg
//         ref={svgRef}
//         className={styles.canvas}
//         width="100%"
//         height="100%"
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
       
//       >
//         <g>
//           {/* gradient definition */}
//           <defs>
//             <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop
//                 offset="0%"
//                 stopColor={stopColor1}
//                 stopOpacity="0.4"
//               />
//               <stop
//                 offset="100%"
//                 stopColor={stopColor2}
//                 stopOpacity="0"
//               />
//             </linearGradient>
//           </defs>

//           {/* Line path */}
//           <path
//             d={linePath}
//             fill="none"
//             stroke={lineColor}
//             strokeWidth={2}
//             vectorEffect="non-scaling-stroke"
//           />

//           {/* Area fill */}
//           {area && (
//             <path d={areaPath} fill="url(#lineGradient)" stroke="none" />
//           )}

//           {/* Pulsing circle at last data point if marketOpen */}
//           {marketOpen && (
//             <circle cx={lastX} cy={lastY} r={8} className={styles.pulsatingCircle}  fill={lineColor}  />
//           )}
          

//           {/* Static circle at last data point */}
//           <circle cx={lastX} cy={lastY} r={3} fill={lineColor} />

//           {/* Hover crosshair & circle */}
//           {hoveredPoint && (
//             <>
            
// {/* 🔹 Vertical Line (Down from circle to bottom) */}
// {/* 🔹 Vertical Line (Down from circle to bottom) */}
// <line
//   x1={hoveredPoint.x} x2={hoveredPoint.x} // Same x-coordinate
//   y1={hoveredPoint.y} y2={2000} // Goes down to bottom
//   stroke={lineColor} // Dynamic color
//   strokeWidth={strokeWidth} // ✅ Adjusted stroke width for mobile
//   strokeDasharray={dashArray} // ✅ Adjusted dash length for mobile
// />

// {/* 🔴 Hover circle (Hollow, only stroke) */}
// <circle 
//   cx={hoveredPoint.x} 
//   cy={hoveredPoint.y} 
//   r={circleRadius} // ✅ Adjusted circle size for mobile
//   fill="#0F0F0F" // ✅ Hollow circle
//   stroke={lineColor} // Dynamic stroke color
//   strokeWidth={circleStrokeWidth} // ✅ Adjusted stroke thickness for mobile
// />
//             </>
//           )}
//         </g>
//       </svg>
//       {/* Tooltip inside container, using absolute positioning */}
//       {hoveredPoint && (
//         <ChartTooltip
//           hoveredPoint={hoveredPoint}
//           mousePos={hoverPos}         // local container coordinates
//           containerRef={containerRef} // needed for clamping logic
//         />
//       )}
//     </div>
//   );
// };

// export default ChartCanvas;


