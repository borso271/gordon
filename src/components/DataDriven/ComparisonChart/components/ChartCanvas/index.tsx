
import {useRef} from "react";
import styles from "./ChartCanvas.module.css";
import { useComparisonChartCanvas } from "../../../../../app/hooks/useComparisonChartCanvas";
import ChartTooltip from "../ChartTooltip";
// import { useChartSizeObserver } from "../../../../../app/hooks/useChartSizeObserver";
import { PricePoint } from "../../../../../interfaces";

// or Map<string, PricePoint[]>;

interface ChartCanvasProps {
  dataMap: Record<string, PricePoint[]>;
  minPrice: number;
  language?: string;
  area?: boolean;
  marketOpen?: boolean;
  curvy?: boolean;
}

const ChartCanvas: React.FC<ChartCanvasProps> = ({
  dataMap,
  minPrice,
  language,
  area = true,
  marketOpen = true,
  curvy = false,
}) => {
  // 1) use the new multi-line hook

  console.log("data map is: ", dataMap)
  const {
    svgRef,
    containerRef,
    hoveredPoints,
    hoverPositions,
    chartPaths,         // Map of ticker => { linePath, areaPath, lastX, lastY }
    handlePointerMove,
    handlePointerLeave,
    // optional color logic
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
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1AED87" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1AED87" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 3) Render line+area for each ticker in chartPaths */}
        {Object.entries(chartPaths).map(([ticker, { linePath, areaPath, lastX, lastY }]) => (
          <g key={ticker}>
            {/* line */}
            <path
              d={linePath}
              fill="none"
              stroke="#1AED87" 
              strokeWidth={2}
            />

            {/* area */}
            {area && (
              <path d={areaPath} fill="url(#lineGradient)" stroke="none" />
            )}

            {/* If marketOpen => circle at last data point */}
            {marketOpen && (
              <circle
                cx={lastX}
                cy={lastY}
                r={5}
                fill="#1AED87"
              />
            )}
          </g>
        ))}

        {/* Example single crosshair/hover circle if hoveredPoint exists */}

        {Object.entries(hoveredPoints).map(([ticker, point]) => (
  point && (
    <g key={ticker}>
      <circle
        cx={point.x}
        cy={point.y}
        r={4}
        fill="#0F0F0F"
        stroke="#1AED87"
        strokeWidth={2}
        pointerEvents="none"
      />
    </g>
  )
))}

{Object.values(hoveredPoints).length === 2 && (
  <line
    x1={Object.values(hoveredPoints)[0]!.x}
    x2={Object.values(hoveredPoints)[0]!.x}
    y1={Math.min(
      Object.values(hoveredPoints)[0]!.y,
      Object.values(hoveredPoints)[1]!.y
    )}
    y2={2000}
    stroke="#1AED87"
    strokeWidth={1.5}
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
