
import React, { useState, useRef, useMemo } from "react";
import { PricePoint } from "../../interfaces";
import * as d3 from "d3";



interface UseComparisonChartCanvasProps {
  dataMap:  Record<string, PricePoint[]>;  // e.g. Map { "AAPL" => [ {x,y}, ...], "TSLA" => [... ] }
  minPrice: number;
  area?: boolean;
  marketOpen?: boolean;
  curvy?: boolean;
}

// Helpers
export function useComparisonChartCanvas({
  dataMap,
  minPrice,
  area = true,
  marketOpen = true,
  curvy = false,
}: UseComparisonChartCanvasProps) {

  // Refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);


  // const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // 1) Generate line + area for each ticker => store in { ticker: { linePath, areaPath, lastX, lastY } }
  const chartPaths = useMemo(() => {
    const result: Record<
      string,
      {
        linePath: string;
        areaPath: string;
        lastX: number;
        lastY: number;
      }
    > = {};
  
    for (const [ticker, sortedData] of Object.entries(dataMap)) {
      // console.log("ticker is, sortedData is: ", ticker, sortedData);
      const linePath = generateLinePath(sortedData, curvy);
      const areaPath = generateAreaPath(sortedData, minPrice, curvy, area);
      const { lastX, lastY } = computeLastPoint(sortedData);
      // console.log("linePath is: ", linePath);
  
      result[ticker] = { linePath, areaPath, lastX, lastY };
    }
  
    return result;
  }, [dataMap, minPrice, curvy, area]);

  // 2) Single pointer logic

  

  const [hoveredPoints, setHoveredPoints] = useState<Record<string, PricePoint | null>>({});
  const [hoverPositions, setHoverPositions] = useState<Record<string, { x: number; y: number }>>({});
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current || !containerRef.current) return;
  
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
  
    setHoverPositions({ global: { x: offsetX, y: offsetY } });
  
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgCoords = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    const mouseX = svgCoords.x;
  
    const newHoveredPoints: Record<string, PricePoint> = {};
  
    for (const [ticker, points] of Object.entries(dataMap)) {
      if (!points?.length) continue;
  
      let nearest = points[0];
      let minDist = Math.abs(nearest.x - mouseX);
  
      for (let i = 1; i < points.length; i++) {
        const dist = Math.abs(points[i].x - mouseX);
        if (dist < minDist) {
          nearest = points[i];
          minDist = dist;
        }
      }
  
      newHoveredPoints[ticker] = nearest;
    }
  
    setHoveredPoints(newHoveredPoints);
  };
  

  const handlePointerLeave = () => {
    setHoveredPoints({});
    setHoverPositions({});
  };

  const isPositiveChange = true; // example
  const lineColor = isPositiveChange ? "#1AED87" : "#ED441A";

  // 4) Return everything needed for multi-line chart
  return {
    svgRef,
    containerRef,
    hoveredPoints,
    hoverPositions,
    handlePointerMove,
    handlePointerLeave,
    chartPaths,   // { AAPL: {linePath, areaPath, lastX, lastY}, TSLA: {...}, ... }
    lineColor,
    area,
    marketOpen
  };
}


const generateLinePath = (sortedData: any[], curvy: boolean) => {
  if (!sortedData.length) return "";
  if (curvy) {
    const lineGenerator = d3
      .line<any>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveMonotoneX);
    return lineGenerator(sortedData) || "";
  } else {
    return sortedData.reduce((acc, point, i) => {
      return i === 0
        ? `M ${point.x},${point.y}`
        : `${acc} L ${point.x},${point.y}`;
    }, "");
  }
};

// 3) Generate area path
const generateAreaPath = (
  data: any[],
  minPrice: number,
  curvy: boolean,
  area: boolean
) => {
  if (!area || !data.length) return "";
  // Extra "bottom" so area goes off-screen
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
      .area<any>()
      .x((d) => d.x)
      .y0(() => minPrice)
      .y1((d) => d.y)
      .curve(d3.curveMonotoneX);
    return areaGenerator(extendedData) || "";
  } else {
    let areaPath = `M ${data[0].x},${data[0].y}`;
    for (let i = 1; i < data.length; i++) {
      areaPath += ` L ${data[i].x},${data[i].y}`;
    }
    areaPath += ` L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
    return areaPath;
  }
};

// 4) Compute last data point
const computeLastPoint = (data: any[]) => {
  if (!data.length) return { lastX: 0, lastY: 0 };
  const { x: lastX, y: lastY } = data[data.length - 1];
  return { lastX, lastY };
};
