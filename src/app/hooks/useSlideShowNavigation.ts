import { useState, useRef, useEffect } from "react";
export function useSlideshowNavigation(
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  conversationPairsLength: number
) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAwayFromBottom, setIsAwayFromBottom] = useState(false); // ✅ New state

  const responseRef = useRef<HTMLDivElement | null>(null);

  // For the threshold-based wheel logic
  const scrollAccumulator = useRef(0);
  const lastScrollDirection = useRef<"up" | "down" | null>(null);
  const isScrolling = useRef(false);

  const SCROLL_THRESHOLD = 1200;
  const DECAY_RATE = 0.95;
  const DECAY_INTERVAL = 50;
  const BOTTOM_OFFSET = 300; // ✅ Threshold for isAwayFromBottom

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

  // Threshold-based wheel handling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;

    const el = responseRef.current;
    if (!el) return;

    const currentScrollDirection = e.deltaY > 0 ? "down" : "up";
    const isAtTop = el.scrollTop === 0;
    const isFullyScrolledDown =
      el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

    // If at topmost with wheel-up (and first pair), ignore
    if (currentIndex === 0 && currentScrollDirection === "up") return;

    // Reset accumulation if wheel direction changes
    if (lastScrollDirection.current && lastScrollDirection.current !== currentScrollDirection) {
      scrollAccumulator.current = 0;
    }
    lastScrollDirection.current = currentScrollDirection;

    let shouldAccumulate = false;
    if (currentScrollDirection === "down" && isFullyScrolledDown)
      shouldAccumulate = true;
    if (currentScrollDirection === "up" && isAtTop)
      shouldAccumulate = true;

    if (!shouldAccumulate) return;

    scrollAccumulator.current += e.deltaY;
    if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
      isScrolling.current = true;
      if (scrollAccumulator.current > 0) goNextPair();
      else goPrevPair();

      scrollAccumulator.current = 0;
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  // Decay the scroll accumulator over time
  useEffect(() => {
    const decayInterval = setInterval(() => {
      if (scrollAccumulator.current !== 0) {
        scrollAccumulator.current *= DECAY_RATE;
        if (Math.abs(scrollAccumulator.current) < 1) {
          scrollAccumulator.current = 0;
        }
      }
    }, DECAY_INTERVAL);
    return () => clearInterval(decayInterval);
  }, []);

  // Watch for scrolling inside the response ref to detect bottom and distance from bottom
  useEffect(() => {
    const el = responseRef.current;
    if (!el) return;

    function checkScrollPosition() {
      const scrollDistanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setIsAtBottom(scrollDistanceFromBottom <= 1);
      setIsAwayFromBottom(scrollDistanceFromBottom > BOTTOM_OFFSET);
    }

    el.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // Run once on mount to get initial state

    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, [responseRef.current]);

  // Reset `isAtBottom` and `isAwayFromBottom` whenever index changes
  useEffect(() => {
    setIsAtBottom(false);
    setIsAwayFromBottom(false);
  }, [currentIndex]);

  return {
    handleWheel,
    responseRef,
    direction,
    isAtBottom,
    isAwayFromBottom, // ✅ New return value
  };
}

