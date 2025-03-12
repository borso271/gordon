// import { useEffect, useRef } from "react";
// import styles from "./ChartCanvas.module.css";

// import React from "react";
// import styles from "./ChartCanvas.module.css";

/**
 * @param {Object[]} data Array of points with { time, price }
 * @param {number} minTime Minimum time on X scale
 * @param {number} maxTime Maximum time on X scale
 * @param {number} minPrice Minimum price on Y scale
 * @param {number} maxPrice Maximum price on Y scale
 * @param {number} width SVG width
 * @param {number} height SVG height
 * @param {boolean} area Whether to fill area under the line
 * @param {boolean} marketOpen If true, show an extra pulsating circle at the last point
 */


import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./ChartCanvas.module.css";
import ChartTooltip from "../ChartTooltip";
import * as d3 from "d3";
import { useScreenSize } from "../../../../../app/context/screenSizeContext"; // Import the custom hook


const ChartCanvasSVG = ({
  data = [],
  todayData = [],
  selectedPeriod,
  minTime,
  maxTime,
  minPrice,
  maxPrice,
  isPositiveChange,
  
  width = 500,
  height = 300,
  area = true,
  marketOpen = true,
  curvy = false,
}) => {

  console.log("IS POSITIVE CHANGE IS: ", isPositiveChange)
  const svgRef = useRef(null);
  // 🔹 NEW: containerRef to clamp tooltip inside
  const containerRef = useRef(null);
  const { isMobile } = useScreenSize(); // ✅ Get isMobile globally

  // Store the hovered point + local coordinates for tooltip
  const [hoveredPoint, setHoveredPoint] = useState(null);  // e.g. { time, price, x, y }
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 }); // x/y in container space

  // 1. Sort by 'time' in ascending order (if needed)
  const sortedData = data; // or [...data].sort((a, b) => a.time - b.time);

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

  // ---------------------------
  //  Generate paths (line/area)
  // ---------------------------
  const generateLinePath = (sortedData, curvy) => {
    if (!sortedData.length) return "";
    if (curvy) {
      const lineGenerator = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveMonotoneX);
      return lineGenerator(sortedData);
    } else {
      return sortedData.reduce((acc, point, i) => {
        return i === 0
          ? `M ${point.x},${point.y}`
          : `${acc} L ${point.x},${point.y}`;
      }, "");
    }
  };

  const generateAreaPath = (data, minPrice, curvy, area) => {
    if (!area || !data.length) return "";
    // Extra "bottom" so area goes off-screen (or to your chart’s baseline)
    const bottomY = 2000;

    const lastX = data[data.length - 1].x;
    const firstX = data[0].x;

    const extendedData = [
      ...data,
      { x: lastX, y: bottomY }, // bottom-right
      { x: firstX, y: bottomY }, // bottom-left
    ];

    if (curvy) {
      const areaGenerator = d3
        .area()
        .x((d) => d.x)
        .y0(() => minPrice)
        .y1((d) => d.y)
        .curve(d3.curveMonotoneX);
      return areaGenerator(extendedData);
    } else {
      let areaPath = `M ${data[0].x},${data[0].y}`;
      for (let i = 1; i < data.length; i++) {
        areaPath += ` L ${data[i].x},${data[i].y}`;
      }
      areaPath += ` L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
      return areaPath;
    }
  };

  const computeLastPoint = (data) => {
    if (!data.length) return { lastX: 0, lastY: 0 };
    const { x: lastX, y: lastY } = data[data.length - 1];
    return { lastX, lastY };
  };

  const linePath = generateLinePath(sortedData, curvy);
  const areaPath = generateAreaPath(sortedData, minPrice, curvy, area);
  const { lastX, lastY } = computeLastPoint(sortedData);

  // ---------------------------
  //  Mouse move & nearest point
  // ---------------------------
  const handleMouseMove = (e) => {
    if (!svgRef.current || !containerRef.current) return;

    // 1) Calculate pointer position relative to container
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;
    setHoverPos({ x: offsetX, y: offsetY });

    // 2) Convert to SVG coordinate system
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgCoords = pt.matrixTransform(
      svgRef.current.getScreenCTM().inverse()
    );

    // 3) Find nearest data point
    const mouseX = svgCoords.x;
    let nearest = data[0];
    let minDist = Math.abs(nearest.x - mouseX);
    for (let i = 1; i < data.length; i++) {
      const dist = Math.abs(data[i].x - mouseX);
      if (dist < minDist) {
        nearest = data[i];
        minDist = dist;
      }
    }

    // 4) Update hovered point
    setHoveredPoint({
      ...nearest,
      x: nearest.x, // exact chart x
      y: nearest.y, // exact chart y
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };


  const lineColor = isPositiveChange ? "#1AED87" : "#ED441A";
  const stopColor1 =isPositiveChange ?  "rgba(26, 237, 135, 0.1)" : "rgba(237, 68, 26, 0.1)";
  const stopColor2 = isPositiveChange ? "rgba(26, 237, 135, 0.2)" : "rgba(237, 68, 26, 0.2)";

  {/* Define mobile-specific properties */}
const strokeWidth = isMobile ? 1 : 1.5;
const dashArray = isMobile ? "5,3" : "6,4"; // 1px shorter dash & gap
const circleRadius = isMobile ? 4 : 5; // Smaller radius for mobile
const circleStrokeWidth = isMobile ? 1.5 : 2; // Thinner stroke for mobile



  return (
    <div className={styles.chartWrapper} ref={containerRef}>
      <svg
        ref={svgRef}
        className={styles.canvas}
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
       
      >
        <g>
          {/* gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={stopColor1}
                stopOpacity="0.4"
              />
              <stop
                offset="100%"
                stopColor={stopColor2}
                stopOpacity="0"
              />
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
          {area && (
            <path d={areaPath} fill="url(#lineGradient)" stroke="none" />
          )}

          {/* Pulsing circle at last data point if marketOpen */}
          {marketOpen && (
            <circle cx={lastX} cy={lastY} r={8} className={styles.pulsatingCircle} />
          )}

          {/* Static circle at last data point */}
          <circle cx={lastX} cy={lastY} r={3} fill="#007bff" />

          {/* Hover crosshair & circle */}
          {hoveredPoint && (
            <>
            
{/* 🔹 Vertical Line (Down from circle to bottom) */}
{/* 🔹 Vertical Line (Down from circle to bottom) */}
<line
  x1={hoveredPoint.x} x2={hoveredPoint.x} // Same x-coordinate
  y1={hoveredPoint.y} y2={2000} // Goes down to bottom
  stroke={lineColor} // Dynamic color
  strokeWidth={strokeWidth} // ✅ Adjusted stroke width for mobile
  strokeDasharray={dashArray} // ✅ Adjusted dash length for mobile
/>

{/* 🔴 Hover circle (Hollow, only stroke) */}
<circle 
  cx={hoveredPoint.x} 
  cy={hoveredPoint.y} 
  r={circleRadius} // ✅ Adjusted circle size for mobile
  fill="#0F0F0F" // ✅ Hollow circle
  stroke={lineColor} // Dynamic stroke color
  strokeWidth={circleStrokeWidth} // ✅ Adjusted stroke thickness for mobile
/>
            </>
          )}
        </g>
      </svg>

      {/* Tooltip inside container, using absolute positioning */}
      {hoveredPoint && (
        <ChartTooltip
          hoveredPoint={hoveredPoint}
          mousePos={hoverPos}         // local container coordinates
          containerRef={containerRef} // needed for clamping logic
       
        />
      )}
    </div>
  );
};

export default ChartCanvasSVG;


// const ChartCanvasSVG = ({
//   data = [],
//   todayData = [],
//   selectedPeriod,
//   minTime,
//   maxTime,
//   minPrice,
//   maxPrice,

//   width = 500,
//   height = 300,
//   area = true,
//   marketOpen = true,
//   curvy = false,
// }) => {

// // // console.log("DATA IS: ", data)
//   const svgRef = useRef(null);

//   // Store the hovered point + screen coordinates for tooltip
//   const [hoveredPoint, setHoveredPoint] = useState(null);    // e.g. { time, price }
//   const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });  // x/y in screen space


// // 1. Sort by 'time' in ascending order
// const sortedData = data; // [...data].sort((a, b) => a.time - b.time);

// // Scale functions

// if (data.length < 2) {
//   return (
//     <div className={styles.chartWrapper}>
//       <svg
//         ref={svgRef}
//         className={styles.canvas}
//         width={width}
//         height={height}
//         style={{ background: "#fff" }}
//       />
//     </div>
//   );
// }


// const generateLinePath = (sortedData, curvy) => {
//   if (sortedData.length === 0) return "";

//   if (curvy) {
//     // 🟢 Use D3 smooth curve with precomputed x/y values
//     const lineGenerator = d3.line()
//       .x(d => d.x)  // Use precomputed x
//       .y(d => d.y)  // Use precomputed y
//       .curve(d3.curveMonotoneX);  

//     return lineGenerator(sortedData);
//   } else {
//     // 🔵 Standard sharp lines with precomputed x/y
//     return sortedData.reduce((acc, point, i) => {
//       return i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
//     }, "");
//   }
// };
// const generateAreaPath = (data, minPrice, curvy, area) => {
//   if (!area || data.length === 0) return ""; // No area requested or empty data

//   const lastX = data[data.length - 1].x;
//   const firstX = data[0].x;
//   const bottomY = 2000; // Extra padding to ensure masking fully covers the bottom

//   // 🔹 Create a new array that includes the extra points
//   const extendedData = [
//     ...data, // Original curved data points
//     { x: lastX, y: bottomY },  // 🔥 Extra bottom-right point
//     { x: firstX, y: bottomY }, // 🔥 Extra bottom-left point
//   ];

//   if (curvy) {
//     // 🟢 Use D3 smooth area with extended data
//     const areaGenerator = d3.area()
//       .x(d => d.x)  
//       .y0(() => minPrice) 
//       .y1(d => d.y)
//       .curve(d3.curveMonotoneX);  

//     return areaGenerator(extendedData);
//   } else {
//     // 🔵 Standard sharp-edged area
//     let areaPath = `M ${firstX},${data[0].y}`;

//     for (let i = 1; i < data.length; i++) {
//       areaPath += ` L ${data[i].x},${data[i].y}`;
//     }

//     areaPath += ` L ${lastX},${bottomY} L ${firstX},${bottomY} Z`; // Close shape

//     return areaPath;
//   }
// };

// const computeLastPoint = (data) => {
//   if (data.length === 0) return { lastX: 0, lastY: 0 };

//   const { x: lastX, y: lastY } = data[data.length - 1]; // Directly use x, y
//   return { lastX, lastY };
// };

// const linePath = generateLinePath(sortedData,  curvy);
// const areaPath = generateAreaPath(sortedData,  minPrice, curvy, area);
// const { lastX, lastY } = computeLastPoint(sortedData);


// const handleMouseMove = (e) => {
//   if (!svgRef.current) return;

//   // Convert mouse event position to SVG coordinates
//   const pt = svgRef.current.createSVGPoint();
//   pt.x = e.clientX;
//   pt.y = e.clientY;
  
//   const svgCoords = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
//   const mouseX = svgCoords.x; // 🔥 This is in SVG coordinate space

//   // 1️⃣ Find the nearest data point (closest X)
//   let nearest = data[0];
//   let minDist = Math.abs(nearest.x - mouseX); // Compare using x-coordinates

//   for (let i = 1; i < data.length; i++) {
//     const dist = Math.abs(data[i].x - mouseX); // Compare distances
//     if (dist < minDist) {
//       nearest = data[i];
//       minDist = dist;
//     }
//   }

//   // 2️⃣ Snap hover circle to nearest data point
//   setHoveredPoint({
//     ...nearest, 
//     x: nearest.x,  // ✅ Use nearest data point's x
//     y: nearest.y,  // ✅ Use nearest data point's y
//   });

//   // 3️⃣ Keep screen position for external tooltip
//   setHoverPos({
//     x: e.clientX,
//     y: e.clientY,
//   });
// };

// // Clear hover when mouse leaves the SVG
// const handleMouseLeave = () => {
//   setHoveredPoint(null);
// };


// return (
//   <div className={styles.chartWrapper}>
//     <svg
//       ref={svgRef}
//       className={styles.canvas}
//       width="100%" // ✅ Responsive width
//       height="100%" // ✅ Responsive height
     
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//     >
//       {/* Scaling group */}
//       <g> {/* ✅ Change scale values as needed */}
      
//         {/* Area gradient */}
//         <defs>
//           <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="0%" stopColor="rgba(26, 237, 135, 0.1)" stopOpacity="0.4" />
//             <stop offset="100%" stopColor="rgba(26, 237, 135, 0.2)" stopOpacity="0" />
//           </linearGradient>
//         </defs>

//         {/* 1) The line path */}
//         <path 
//           d={linePath} 
//           fill="none" 
//           stroke="#1AED87" 
//           strokeWidth={2} 
//           vectorEffect="non-scaling-stroke" // ✅ Keeps stroke width constant
//         />

//         {/* 2) The area fill */}
//         {area && <path d={areaPath} fill="url(#lineGradient)" stroke="none" />}

//         {/* 3) Pulsing circle at last data point if marketOpen */}
//         {marketOpen && <circle cx={lastX} cy={lastY} r={8} className={styles.pulsatingCircle} />}

//         {/* 4) Small, static circle at last data point */}
//         <circle cx={lastX} cy={lastY} r={3} fill="#007bff" />

//         {/* 5) Hover crosshair lines */}
//         {hoveredPoint && (
//           <>
        

//             {/* 🔹 Vertical Line (Down from circle to bottom) */}
//             <line
//               x1={hoveredPoint.x} x2={hoveredPoint.x} // Same x-coordinate
//               y1={hoveredPoint.y} y2={2000} // Goes down to bottom
//               stroke="gray"
//               strokeWidth="1"
//               strokeDasharray="4" // Dashed line
//             />

//             {/* 🔹 Horizontal Line (Right from circle to right edge) */}
//             <line
//               x1={hoveredPoint.x} x2={2000} // Goes right to edge
//               y1={hoveredPoint.y} y2={hoveredPoint.y} // Same y-coordinate
//               stroke="gray"
//               strokeWidth="1"
//               strokeDasharray="4" // Dashed line
//             />

//             {/* 🔴 Hover circle */}
//             <circle 
//               cx={hoveredPoint.x} 
//               cy={hoveredPoint.y} 
//               r={4} 
//               fill="#ff0000" 
//               stroke="#fff" 
//               strokeWidth={1} 
//             />
//           </>
//         )}
//       </g>
//     </svg>
//     {hoveredPoint && ( <ChartTooltip hoveredPoint={hoveredPoint}  screenX={hoveredPoint.x} screenY={hoveredPoint.y} />)}

//   </div>
// );


// };

// export default ChartCanvasSVG;








