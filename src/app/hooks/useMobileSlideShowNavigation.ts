import { useState, useRef } from "react";

export function useMobileSlideshowNavigation(
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  conversationPairsLength: number,
  responseRef: React.RefObject<HTMLDivElement> // Accept ref as a prop
) {

  const [direction, setDirection] = useState<"up" | "down">("down");
  const touchStartY = useRef<number | null>(null);
  const touchMoveY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const SWIPE_THRESHOLD = 50;
  const DEBOUNCE_DELAY = 200;

  const goNextPair = () => {
    if (currentIndex < conversationPairsLength - 1) {
      setDirection("down");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevPair = () => {
    if (currentIndex > 0) {
      setDirection("up");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchMoveY.current = null;

    const el = responseRef.current;
    if (el) {
      const isAtTop = el.scrollTop <= 1;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 1;

      el.dataset.atTop = isAtTop ? "true" : "false";
      el.dataset.atBottom = isAtBottom ? "true" : "false";
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchMoveY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchMoveY.current) return;
    if (isSwiping.current) return;

    const deltaY = touchMoveY.current - touchStartY.current;
    const isSwipingUp = deltaY < -SWIPE_THRESHOLD;
    const isSwipingDown = deltaY > SWIPE_THRESHOLD;

    const el = responseRef.current;
    if (!el) return;

    const startedAtTop = el.dataset.atTop === "true";
    const startedAtBottom = el.dataset.atBottom === "true";

    if (isSwipingUp && startedAtBottom) {
      isSwiping.current = true;
      goNextPair();
    } else if (isSwipingDown && startedAtTop) {
      isSwiping.current = true;
      goPrevPair();
    }

    setTimeout(() => {
      isSwiping.current = false;
    }, DEBOUNCE_DELAY);

    touchStartY.current = null;
    touchMoveY.current = null;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    direction,
  };
}
