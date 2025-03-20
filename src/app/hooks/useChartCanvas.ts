
import React, { useState, useRef, useMemo } from "react";

import * as d3 from "d3";
import { useScreenSize } from "../context/screenSizeContext";
// Import any components/functions you use: ChartTooltip, etc.
// But the main point is the logic, which we move out of ChartCanvas.

interface UseChartCanvasProps {
  data?: any[];
  minPrice: number;
  isPositiveChange: boolean;
  width?: number;
  height?: number;
  area?: boolean;
  marketOpen?: boolean;
  curvy?: boolean;
}

/**
 * Custom hook with all the logic from ChartCanvas,
 * returning just the data & handlers used in the JSX.
 */
export function useChartCanvas({
  data = [],
  minPrice,
  isPositiveChange,
  width = 500,
  height = 300,
  area = true,
  marketOpen = true,
  curvy = true,
}: UseChartCanvasProps) {
  // ----------------------------
  //  Refs, states, dependencies
  // ----------------------------
  const svgRef = useRef<SVGSVGElement | null>(null);
  // 🔹 containerRef to clamp tooltip inside
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isMobile } = useScreenSize(); // ✅ Same logic as original

  const [hoveredPoint, setHoveredPoint] = useState<any>(null); // e.g. { time, price, x, y }
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });    // container-space coords

  // 1) Sort the data if needed
  // (Original code: "const sortedData = data;")
  const sortedData = data;




















  
  // 2) Generate line path
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

  // 5) Build final line & area paths
  const linePath = useMemo(() => generateLinePath(sortedData, curvy), [sortedData, curvy]);
  const areaPath = useMemo(() => generateAreaPath(sortedData, minPrice, curvy, area), [
    sortedData,
    minPrice,
    curvy,
    area,
  ]);
  const { lastX, lastY } = useMemo(() => computeLastPoint(sortedData), [sortedData]);

  // 6) Mouse move & nearest point
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !containerRef.current) return;

    // 6.1) pointer position relative to container
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;
    setHoverPos({ x: offsetX, y: offsetY });

    // 6.2) Convert to SVG coordinate system
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgCoords = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());

    // 6.3) Find nearest data point
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

    // 6.4) Update hovered point
    setHoveredPoint({
      ...nearest,
      x: nearest.x, // exact chart x
      y: nearest.y, // exact chart y
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };



  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {

    console.log("handle pointer move detected")
    if (!svgRef.current || !containerRef.current) return;
  
    console.log("this logs too")
    // 1) pointer position relative to container
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;
    setHoverPos({ x: offsetX, y: offsetY });
  
    // 2) Convert to SVG coordinate system
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgCoords = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
  
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
      x: nearest.x,
      y: nearest.y,
    });
  };
  
  const handlePointerLeave = () => {
    setHoveredPoint(null);
  };

  

  // 7) Colors & styles
  const lineColor = isPositiveChange ? "#1AED87" : "#ED441A";
  const stopColor1 = isPositiveChange
    ? "rgba(26, 237, 135, 0.1)"
    : "rgba(237, 68, 26, 0.1)";
  const stopColor2 = isPositiveChange
    ? "rgba(26, 237, 135, 0.2)"
    : "rgba(237, 68, 26, 0.2)";

  const strokeWidth = isMobile ? 1 : 1.5;
  const dashArray = isMobile ? "5,3" : "6,4";
  const circleRadius = isMobile ? 4 : 5;
  const circleStrokeWidth = isMobile ? 1.5 : 2;

  // Return everything the component needs for rendering:
  return {
    svgRef,
    containerRef,
    hoveredPoint,
    hoverPos,
    linePath,
    areaPath,
    lastX,
    lastY,
    handleMouseMove,
    handleMouseLeave,
    handlePointerMove,
    handlePointerLeave,
    lineColor,
    stopColor1,
    stopColor2,
    strokeWidth,
    dashArray,
    circleRadius,
    circleStrokeWidth,
    width,
    height,
    area,
    marketOpen,
  };
}
