import { useState, useRef, useEffect } from "react";

export function useMobileSlideshowNavigation(
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  conversationPairsLength: number
) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAwayFromBottom, setIsAwayFromBottom] = useState(false);

  const responseRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMoveY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const SWIPE_THRESHOLD = 50;
  const BOTTOM_OFFSET = 300;

  const goNextPair = () => {
    if (currentIndex < conversationPairsLength - 1) {
      setDirection("up");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevPair = () => {
    if (currentIndex > 0) {
      setDirection("down");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchMoveY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchMoveY.current = e.touches[0].clientY;
  };




//   const handleTouchEnd = () => {
//     if (!touchStartY.current || !touchMoveY.current) return;
  
//     const deltaY = touchMoveY.current - touchStartY.current;
//     const isSwipingUp = deltaY < -SWIPE_THRESHOLD;
//     const isSwipingDown = deltaY > SWIPE_THRESHOLD;
  
//     if (isSwiping.current) return;
  
//     const el = responseRef.current;
//     if (!el) return;
  
//     const isAtTop = el.scrollTop <= 1;
//     const isFullyScrolledDown = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;
  
//     if (isSwipingUp && isFullyScrolledDown) {
//       isSwiping.current = true;
//       goNextPair();
//     } else if (isSwipingDown && isAtTop) {
//       isSwiping.current = true;
//       goPrevPair();
//     }
  
//     setTimeout(() => {
//       isSwiping.current = false;
//     }, 500);
  
//     touchStartY.current = null;
//     touchMoveY.current = null;
//   };
  
  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchMoveY.current) return;

    const deltaY = touchMoveY.current - touchStartY.current;
    const isSwipingUp = deltaY < -SWIPE_THRESHOLD;
    const isSwipingDown = deltaY > SWIPE_THRESHOLD;

    if (isSwiping.current) return;

    if (isSwipingUp && isAtBottom) {
      isSwiping.current = true;
      goNextPair();
    } else if (isSwipingDown) {
      isSwiping.current = true;
      goPrevPair();
    }

    setTimeout(() => {
      isSwiping.current = false;
    }, 500);

    touchStartY.current = null;
    touchMoveY.current = null;
  };





  useEffect(() => {
    const el = responseRef.current;
    if (!el) return;

    function checkScrollPosition() {
      const scrollDistanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setIsAtBottom(scrollDistanceFromBottom <= 1);
      setIsAwayFromBottom(scrollDistanceFromBottom > BOTTOM_OFFSET);
    }

    el.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition();

    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, [responseRef.current]);

  useEffect(() => {
    setIsAtBottom(false);
    setIsAwayFromBottom(false);
  }, [currentIndex]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    responseRef,
    direction,
    isAtBottom,
    isAwayFromBottom,
  };
}
