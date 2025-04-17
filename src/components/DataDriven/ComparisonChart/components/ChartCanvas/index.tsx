
import {useRef} from "react";
import styles from "./ChartCanvas.module.css";
import { useComparisonChartCanvas } from "../../../../../app/hooks/useComparisonChartCanvas";
import ChartTooltip from "../ChartTooltip";
// import { useChartSizeObserver } from "../../../../../app/hooks/useChartSizeObserver";
import { PricePoint } from "../../../../../interfaces";
import { tickersPalette } from "../../../../../constants";
// or Map<string, PricePoint[]>;

interface ChartCanvasProps {
  dataMap: Record<string, PricePoint[]>;
  minPrice: number;
  language?: string;
  area?: boolean;
  marketOpen?: boolean;
  curvy?: boolean;
  width?:number;
  height?:number;
}

const ChartCanvas: React.FC<ChartCanvasProps> = ({
  dataMap,
  minPrice,
  language,
  area = true,
  marketOpen = true,
  curvy = false,
  width,
  height
}) => {
  // 1) use the new multi-line hook

  const {
    svgRef,
    containerRef,
    hoveredPoints,
    hoverPositions,
    chartPaths, 
    handlePointerMove,
    handlePointerLeave,
  } = useComparisonChartCanvas({
    dataMap,
    minPrice,
    area,
    marketOpen,
    curvy,
  });

  const totalPoints = Object.values(dataMap).reduce(
    (sum, points) => sum + points.length,
    0
  );
  
  

  // 1️⃣  Choose a fallback height if none was passed
const chartHeight = height ?? 240;          // px; choose a sensible default
const chartWidth  = width  ?? "100%";       // keep existing behaviour

// 2️⃣  Pre‑compute the 5 Y‑positions (0, 25 %, 50 %, 75 %, 100 %)
const gridY = Array.from({ length: 5 }, (_, i) => (chartHeight / 4) * i);


  if (totalPoints < 2) {
    return (
      <div className={styles.chartWrapper} ref={containerRef}>
        <svg ref={svgRef} className={styles.canvas} />
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
        {/* We'll define a gradient for each ticker if needed, or a single one if you prefer */}
       
  {/* ───── GRID 5 horizontal dashed lines ───── */}
  <g className={styles.grid}>
    {/* 0 % (top) */}
    {/* <line x1="0" x2="100%" y1="0%"   y2="0%"   stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" /> */}
    {/* 25 % */}
    <line x1="0" x2="100%" y1="25%"  y2="25%"  stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
    {/* 50 % (middle) */}
    <line x1="0" x2="100%" y1="50%"  y2="50%"  stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
    {/* 75 % */}
    <line x1="0" x2="100%" y1="75%"  y2="75%"  stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
    {/* 100 % (bottom) */}
    <line x1="0" x2="100%" y1="100%" y2="100%" stroke="var(--black-700)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
  </g>

        {/* 3) Render line+area for each ticker in chartPaths */}
        {Object.entries(chartPaths).map(([ticker, { linePath, areaPath, lastX, lastY }], index) => {
  const color = tickersPalette[index % tickersPalette.length]; // Cycle if > 4 tickers

  return (
    <g key={ticker}>
      <defs>
        <linearGradient id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={linePath} fill="none" stroke={color} strokeWidth={2} />

      {area && (
        <path d={areaPath} fill={`url(#gradient-${ticker})`} stroke="none" />
      )}

      {marketOpen && (
        <circle cx={lastX} cy={lastY} r={5} fill={color} />
      )}
    </g>
  );
})}

        {/* Example single crosshair/hover circle if hoveredPoint exists */}

        {Object.entries(hoveredPoints).map(([ticker, point]) => {
  const index = Object.keys(chartPaths).indexOf(ticker); // ✅ get the same index used for lines
  const color = tickersPalette[index % tickersPalette.length];

  return point ? (
    <g key={ticker}>
      <circle
        cx={point.x}
        cy={point.y}
        r={4}
        fill={color}
        strokeWidth={2}
        pointerEvents="none"
      />
    </g>
  ) : null;
})}


{Object.values(hoveredPoints).length === 2 && (
  <line
    x1={Object.values(hoveredPoints)[0]!.x}
    x2={Object.values(hoveredPoints)[0]!.x}
    y1={Math.min(
      Object.values(hoveredPoints)[0]!.y,
      Object.values(hoveredPoints)[1]!.y
    )}
    y2={height}

    stroke={"rgba(98, 98, 98, 0.4)"}

    strokeWidth={1}
    strokeDasharray="4 2"
    pointerEvents="none"
  />
)}
      </svg>

      {/* 4) Tooltip */}
      {Object.keys(hoveredPoints).length > 0 && (
  <ChartTooltip
    hoveredPoints={hoveredPoints}
    mousePos={hoverPositions.global}
    containerRef={containerRef}
    language={language}
  />
)}

      
    </div>
  );
};

export default ChartCanvas;
