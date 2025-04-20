
import {useRef} from "react";
import styles from "./ChartCanvas.module.css";
import { useChartCanvas } from "../../../../../app/hooks/useChartCanvas";
import ChartTooltip from "../ChartTooltip";
import { useChartSizeObserver } from "../../../../../app/hooks/useChartSizeObserver";
interface ChartCanvasProps {
  data?: any[];
  minPrice: number;
  isPositiveChange: boolean;
  language: string;
  area?: boolean;
  marketOpen?: boolean;
  curvy?: boolean;
  height?: number;
  width?: number;
}

const ChartCanvas: React.FC<ChartCanvasProps> = ({
  data = [],
  minPrice,
  isPositiveChange,
  language,
  area = true,
  marketOpen = true,
  curvy = true,
  height,
  width
 
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
    area,
    marketOpen,
    curvy,
    height
  });


  // 1️⃣  Choose a fallback height if none was passed
const chartHeight = height ?? 240;          // px; choose a sensible default
const chartWidth  = width  ?? "100%";       // keep existing behaviour

// 2️⃣  Pre‑compute the 5 Y‑positions (0, 25 %, 50 %, 75 %, 100 %)
const gridY = Array.from({ length: 5 }, (_, i) => (chartHeight / 4) * i);



  // If the data has fewer than 2 points, just return the empty chart.
  if (data.length < 2) {
    return (
      <div className={styles.chartWrapper} ref={containerRef}>
        <svg
          ref={svgRef}
          className={styles.canvas}
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
  onPointerMove={handlePointerMove}
  onPointerLeave={handlePointerLeave}
  style={{ overflowY: "auto", touchAction: "none" }}
>
  {/* ───── GRID 5 horizontal dashed lines ───── */}
  <g className={styles.grid}>
    {/* 0 % (top) */}
    <line x1="0" x2="100%" y1="0%"   y2="0%"   stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
    {/* 25 % */}
    <line x1="0" x2="100%" y1="25%"  y2="25%"  stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
    {/* 50 % (middle) */}
    <line x1="0" x2="100%" y1="50%"  y2="50%"  stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
    {/* 75 % */}
    <line x1="0" x2="100%" y1="75%"  y2="75%"  stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
    {/* 100 % (bottom) */}
    <line x1="0" x2="100%" y1="100%" y2="100%" stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
  </g>

  {/* ───── GRADIENT DEF ───── */}
  <defs>
    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor={stopColor1} stopOpacity="0.4" />
      <stop offset="100%" stopColor={stopColor2} stopOpacity="0" />
    </linearGradient>
  </defs>

  {/* ───── LINE + AREA ───── */}
  <path d={linePath} fill="none" stroke={lineColor} strokeWidth={2} vectorEffect="non-scaling-stroke" />
  {area && <path d={areaPath} fill="url(#lineGradient)" stroke="none" />}

  {/* ───── HOVER CROSSHAIR / CIRCLE ───── */}
  {hoveredPoint && (
    <>
      <line
        x1={hoveredPoint.x}
        x2={hoveredPoint.x}
        y1={hoveredPoint.y}
        y2="100%"
        stroke="var(--black-700)"
        strokeWidth={1}
        strokeDasharray={dashArray}
        pointerEvents="none"
      />
      <circle
        cx={hoveredPoint.x}
        cy={hoveredPoint.y}
        r={circleRadius}
        fill={lineColor}
        strokeWidth={circleStrokeWidth}
        pointerEvents="none"
      />
    </>
  )}
</svg>

      


      {/* Tooltip */}
      {hoveredPoint && (
        <ChartTooltip
          hoveredPoint={hoveredPoint}
          mousePos={hoverPos}
          containerRef={containerRef}
          language={language}
        />
      )}
    </div>

  );
};

export default ChartCanvas;


// import {useRef} from "react";
// import styles from "./ChartCanvas.module.css";
// import { useChartCanvas } from "../../../../../app/hooks/useChartCanvas";
// import ChartTooltip from "../ChartTooltip";
// import { useChartSizeObserver } from "../../../../../app/hooks/useChartSizeObserver";
// interface ChartCanvasProps {
//   data?: any[];

//   minPrice: number;
//   isPositiveChange: boolean;
//   language: string;

//   area?: boolean;
//   marketOpen?: boolean;
//   curvy?: boolean;
// }

// const ChartCanvas: React.FC<ChartCanvasProps> = ({
//   data = [],
//   minPrice,
//   isPositiveChange,
//   language,
//   area = true,
//   marketOpen = true,
//   curvy = true,
// }) => {

//   const {
//     svgRef,
//     containerRef,
//     hoveredPoint,
//     hoverPos,
//     linePath,
//     areaPath,
//     lastX,
//     lastY,
//     handlePointerMove,  // renamed from handleMouseMove
//     handlePointerLeave, // renamed from handleMouseLeave
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
//     area,
//     marketOpen,
//     curvy,
//   });

//   // If the data has fewer than 2 points, just return the empty chart.
//   if (data.length < 2) {
//     return (
//       <div className={styles.chartWrapper} ref={containerRef}>
//         <svg
//           ref={svgRef}
//           className={styles.canvas}
         
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
//         onPointerMove={handlePointerMove}
//         onPointerLeave={handlePointerLeave}
//        style={{ overflowY: "auto", touchAction: "none" }}
       
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
//           {/* {marketOpen && (
//             <circle
//               cx={lastX}
//               cy={lastY}
//               r={8}
//               className={styles.pulsatingCircle}
//               fill={lineColor}
//             />
//           )}

//           <circle cx={lastX} cy={lastY} r={3} fill={lineColor} /> */}

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
//                 // Keep pointerEvents off so the line itself doesn't block pointer
//                 pointerEvents="none"
//               />
//               <circle
//                 cx={hoveredPoint.x}
//                 cy={hoveredPoint.y}
//                 r={circleRadius}
//                 fill="#0F0F0F"
//                 stroke={lineColor}
//                 strokeWidth={circleStrokeWidth}
//                 pointerEvents="none"
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
//           language={language}
//         />
//       )}
//     </div>
//   );
// };

// export default ChartCanvas;

