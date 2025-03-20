import React, {useState, useEffect} from "react";
import styles from "./ChartTooltip.module.css";
import { useScreenSize } from "../../../../../app/context/screenSizeContext";


type ChartTooltipProps = {
  hoveredPoint: { price: number; time: number; x: number; y: number } | null;
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement>;
};

const ChartTooltip = ({ hoveredPoint, mousePos, containerRef }: ChartTooltipProps) => {
  const { isMobile } = useScreenSize();
  if (!hoveredPoint || !containerRef.current) return null;

  // 1) Track whether user is dragging
  const [isDragging, setIsDragging] = useState(false);
  // 2) Store the drag offsets to correctly position the tooltip under the mouse
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // 3) Store the final position of the tooltip when dragging
  const [dragPosition, setDragPosition] = useState<{ left: number; top: number } | null>(null);

  // Determine the "auto" (non-dragged) position as before
  const tooltipSize = {
    width: isMobile ? 125 : 150,
    height: isMobile ? 56 : 60,
  };

  const rect = containerRef.current.getBoundingClientRect();
  let autoLeft = mousePos.x + 10;
  let autoTop = mousePos.y + 10;

  // Clamp to container
  if (autoLeft + tooltipSize.width > rect.width) {
    autoLeft = rect.width - tooltipSize.width;
  }
  if (autoTop + tooltipSize.height > rect.height) {
    autoTop = rect.height - tooltipSize.height;
  }
  autoLeft = Math.max(0, autoLeft);
  autoTop = Math.max(0, autoTop);

  // Decide which position to use:
  // If dragging, use the dragPosition
  // Otherwise, use the auto-position
  const finalLeft = dragPosition ? dragPosition.left : autoLeft;
  const finalTop = dragPosition ? dragPosition.top : autoTop;

  // --------------------------
  //   Mouse Events for Dragging
  // --------------------------
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    // Calculate the offset between the mouse and the tooltip’s top-left
    const offsetX = e.clientX - finalLeft;
    const offsetY = e.clientY - finalTop;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();

    // The new position is the mouse position minus the original offset
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;

    // Clamp inside container
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const clampedLeft = Math.max(0, Math.min(newLeft, rect.width - tooltipSize.width));
      const clampedTop = Math.max(0, Math.min(newTop, rect.height - tooltipSize.height));
      setDragPosition({ left: clampedLeft, top: clampedTop });
    }
  };

  // Add global mouse listeners so user can drag beyond tooltip boundaries
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

  // --------------------------
  //   Render the Tooltip
  // --------------------------
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
        cursor: isDragging ? "grabbing" : "grab", // Visual feedback
      }}
      onMouseDown={handleMouseDown} // Start drag
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
