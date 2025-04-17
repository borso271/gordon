import React, { useRef, useState } from "react";
import styles from "./RightSidebar.module.css";
import BotChat from "../Chat";
const RightSidebar: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0); // px from right
  const [isOpen, setIsOpen] = useState(false);

  const startX = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const distance = startX.current - e.clientX;
    const maxWidth = 400;
    setOffset(Math.min(Math.max(distance, 0), maxWidth));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const threshold = 100;
    if (offset > threshold) {
      setIsOpen(true);
      setOffset(400); // fully open
    } else {
      setIsOpen(false);
      setOffset(0); // snap back
    }
  };

  // Bind / unbind mouse move when dragging
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging]);

  return (
    <>
      {/* Invisible drag handle on the right edge */}
      <div
        className={styles.dragHandle}
        onMouseDown={handleMouseDown}
      />

      {/* Sidebar wrapper */}
      <div
        ref={sidebarRef}
        className={styles.sidebar}
        style={{
          transform: `translateX(${400 - offset}px)`, // starts at +400 and moves left
        }}
      >
        {(isDragging || isOpen) && <BotChat />}
      </div>
    </>
  );
};

export default RightSidebar;
