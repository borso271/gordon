"use client";
import React, { useState, useEffect } from "react";
import styles from "./ChartTooltip.module.css";
import { useScreenSize } from "../../../../../app/context/screenSizeContext";

type ChartTooltipProps = {
  hoveredPoint: { price: number; time: number; x: number; y: number } | null;
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
};

const ChartTooltip = ({ hoveredPoint, mousePos, containerRef }: ChartTooltipProps) => {
  const { isMobile } = useScreenSize();

  // ✅ Move early return below hooks to avoid conditional hook calls
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState<{ left: number; top: number } | null>(null);

  // ✅ Ensure containerRef.current is checked properly
  const getContainerBounds = () => {
    return containerRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
  };

  const tooltipSize = {
    width: isMobile ? 125 : 150,
    height: isMobile ? 56 : 60,
  };

  // Compute auto-position inside a function
  const computeAutoPosition = () => {
    const rect = getContainerBounds();
    let autoLeft = mousePos.x + 10;
    let autoTop = mousePos.y + 10;

    // ✅ Clamp inside container
    autoLeft = Math.min(rect.width - tooltipSize.width, Math.max(0, autoLeft));
    autoTop = Math.min(rect.height - tooltipSize.height, Math.max(0, autoTop));

    return { left: autoLeft, top: autoTop };
  };

  const { left: autoLeft, top: autoTop } = computeAutoPosition();

  // ✅ Use either dragged position or auto position
  const finalLeft = dragPosition ? dragPosition.left : autoLeft;
  const finalTop = dragPosition ? dragPosition.top : autoTop;

  // --------------------------
  //   Mouse Events for Dragging
  // --------------------------
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({ x: e.clientX - finalLeft, y: e.clientY - finalTop });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();

    const rect = getContainerBounds();
    const newLeft = Math.max(0, Math.min(e.clientX - dragOffset.x, rect.width - tooltipSize.width));
    const newTop = Math.max(0, Math.min(e.clientY - dragOffset.y, rect.height - tooltipSize.height));

    setDragPosition({ left: newLeft, top: newTop });
  };

  const handleMouseUp = () => setIsDragging(false);

  // ✅ UseEffect runs only when isDragging changes
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // ✅ Move early return after all hooks to avoid conditional hook calls
  if (!hoveredPoint) return null;

  const formattedTime = new Date(hoveredPoint.time).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={styles.tooltip}
      style={{
        position: "absolute",
        left: finalLeft,
        top: finalTop,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.price}>${hoveredPoint.price.toFixed(2)}</div>
      <div className={styles.date}>{formattedTime}</div>
    </div>
  );
};

export default ChartTooltip;

// type ChartTooltipProps = {
//   hoveredPoint: { price: number; time: number; x: number; y: number } | null;
//   mousePos: { x: number; y: number };
//   containerRef: React.RefObject<HTMLDivElement>;
// };

// const ChartTooltip = ({ hoveredPoint, mousePos, containerRef }: ChartTooltipProps) => {
//   const { isMobile } = useScreenSize(); // ✅ Hook moved to the top

//   if (!hoveredPoint || !containerRef.current) return null; // ✅ Safe to have early return now

//   const tooltipSize = {
//     width: isMobile ? 125 : 150,
//     height: isMobile ? 56 : 60,
//   };

//   // 📌 Format time in 24-hour format (HH:mm)
//   const formattedTime = new Date(hoveredPoint.time).toLocaleString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

//   // 📌 Get container bounds
//   const rect = containerRef.current.getBoundingClientRect();

//   // 📌 Start with “ideal” position near the cursor
//   let left = mousePos.x + 10;
//   let top = mousePos.y + 10;

//   // 📌 Clamp the tooltip inside the container
//   if (left + tooltipSize.width > rect.width) {
//     left = rect.width - tooltipSize.width;
//   }
//   if (top + tooltipSize.height > rect.height) {
//     top = rect.height - tooltipSize.height;
//   }
//   left = Math.max(0, left);
//   top = Math.max(0, top);

//   return (
//     <div
//       className={styles.tooltip}
//       style={{
//         position: "absolute",
//         // width: tooltipSize.width,
//         // height: tooltipSize.height,
//         left,
//         top,
//       }}
//     >
//       <div className={styles.price}>${hoveredPoint.price.toFixed(2)}</div>
//       <div className={styles.date}>{formattedTime}</div>
//     </div>
//   );
// };

// export default ChartTooltip;
