import { useState, useRef, useEffect } from "react";

export function useSlideshowNavigation(
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  conversationPairsLength: number
) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAwayFromBottom, setIsAwayFromBottom] = useState(false);

  const responseRef = useRef<HTMLDivElement | null>(null);

  // --- Same "accumulator" logic ---
  const scrollAccumulator = useRef(0);
  const lastScrollDirection = useRef<"up" | "down" | null>(null);
  const isScrolling = useRef(false);

  // --- For touch logic ---
  const touchStartY = useRef<number | null>(null);

  // --- Configurable constants ---
  const SCROLL_THRESHOLD = 1200;
  const DECAY_RATE = 0.95;
  const DECAY_INTERVAL = 50;
  const BOTTOM_OFFSET = 300;
  const SCROLL_COOLDOWN = 500; // Time (ms) after triggering a navigation

  // Navigation helpers
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

  // ------------------------
  // 1) Desktop wheel logic
  // ------------------------
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;

    const el = responseRef.current;
    if (!el) return;

    const currentScrollDirection = e.deltaY > 0 ? "down" : "up";
    const isAtTop = el.scrollTop <= 0;
    const isFullyScrolledDown = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

    // If at topmost with wheel-up (and first pair), ignore
    if (currentIndex === 0 && currentScrollDirection === "up") return;

    // Reset accumulation if wheel direction changes
    if (lastScrollDirection.current && lastScrollDirection.current !== currentScrollDirection) {
      scrollAccumulator.current = 0;
    }
    lastScrollDirection.current = currentScrollDirection;

    // Only accumulate if the user is at the top scrolling up or at the bottom scrolling down
    let shouldAccumulate = false;
    if (currentScrollDirection === "down" && isFullyScrolledDown) shouldAccumulate = true;
    if (currentScrollDirection === "up" && isAtTop) shouldAccumulate = true;
    if (!shouldAccumulate) return;

    // Accumulate the delta
    scrollAccumulator.current += e.deltaY;

    // Check threshold
    if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
      isScrolling.current = true;
      if (scrollAccumulator.current > 0) {
        goNextPair();
      } else {
        goPrevPair();
      }
      scrollAccumulator.current = 0;

      // Cooldown
      setTimeout(() => {
        isScrolling.current = false;
      }, SCROLL_COOLDOWN);
    }
  };

  // ------------------------
  // 2) Mobile touch logic
  // ------------------------
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Record where the touch started
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // We only want to track direction & distance while the user is moving
    // but we won't finalize the nav until they lift their finger (touchend)
  };

  const handleTouchEnd = () => {
    if (isScrolling.current) return;

    const el = responseRef.current;
    if (!el || touchStartY.current === null) return;

    const isAtTop = el.scrollTop <= 0;
    const isFullyScrolledDown = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

    // Check how far the user swiped (in the container's vertical direction).
    // If they ended above where they started, delta > 0 => swiping up => content goes down => "down" direction
    // If ended below where they started, delta < 0 => swiping down => content goes up => "up" direction
    // We'll handle sign carefully to match the same "accumulator" usage from wheel logic
    // 
    // We'll measure the final finger position in handleTouchEnd via changedTouches[0].clientY 
    // because that's the last known position. If you only get it in handleTouchEnd, it's often the same as the last move
    // but let's do it for completeness:
  };

  // Actually, to measure the distance properly, we need the final Y in handleTouchEnd or handleTouchMove:
  // We'll store it in handleTouchMove in a ref as well, then compute delta in handleTouchEnd:

  const touchMoveY = useRef<number | null>(null);

  const handleTouchMoveEnhanced = (e: React.TouchEvent<HTMLDivElement>) => {
    // update current finger position
    touchMoveY.current = e.touches[0].clientY;
  };

  const handleTouchEndEnhanced = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;
    const el = responseRef.current;
    if (!el || touchStartY.current === null || touchMoveY.current === null) {
      touchStartY.current = null;
      touchMoveY.current = null;
      return;
    }

    const isAtTop = el.scrollTop <= 0;
    const isFullyScrolledDown = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

    // The distance the finger moved
    const distanceMoved = touchStartY.current - touchMoveY.current;
    // If distanceMoved > 0 => user swiped up => content scrolls down => "down" direction for the container
    // If distanceMoved < 0 => user swiped down => content scrolls up => "up" direction for the container
    // We'll mimic "deltaY" logic from wheel: e.deltaY > 0 => "down", e.deltaY < 0 => "up"

    // Only accumulate if at top or bottom
    let shouldAccumulate = false;
    let currentScrollDirection: "up" | "down" = distanceMoved > 0 ? "down" : "up";

    if (currentScrollDirection === "down" && isFullyScrolledDown) shouldAccumulate = true;
    if (currentScrollDirection === "up" && isAtTop) shouldAccumulate = true;

    if (shouldAccumulate) {
      // Same approach: reset if direction changed
      if (lastScrollDirection.current && lastScrollDirection.current !== currentScrollDirection) {
        scrollAccumulator.current = 0;
      }
      lastScrollDirection.current = currentScrollDirection;

      // Accumulate
      scrollAccumulator.current += distanceMoved;

      // Check threshold
      if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
        isScrolling.current = true;
        if (scrollAccumulator.current > 0) {
          // Means net was "down" direction => go next
          goNextPair();
        } else {
          // Means net was "up" => go prev
          goPrevPair();
        }
        scrollAccumulator.current = 0;

        // Cooldown
        setTimeout(() => {
          isScrolling.current = false;
        }, SCROLL_COOLDOWN);
      }
    }

    // Reset
    touchStartY.current = null;
    touchMoveY.current = null;
  };

  // ------------------------
  // 3) Decay the scroll accumulator over time
  // ------------------------
  useEffect(() => {
    const decayIntervalId = setInterval(() => {
      if (scrollAccumulator.current !== 0) {
        scrollAccumulator.current *= DECAY_RATE;
        if (Math.abs(scrollAccumulator.current) < 1) {
          scrollAccumulator.current = 0;
        }
      }
    }, DECAY_INTERVAL);

    return () => clearInterval(decayIntervalId);
  }, []);

  // ------------------------
  // 4) Track bottom offset for your UI
  // ------------------------
  useEffect(() => {
    const el = responseRef.current;
    if (!el) return;

    function checkScrollPosition() {
      const scrollDistanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setIsAtBottom(scrollDistanceFromBottom <= 1);
      setIsAwayFromBottom(scrollDistanceFromBottom > BOTTOM_OFFSET);
    }

    el.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // Run once on mount

    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, [responseRef.current]);

  // Reset bottom flags whenever index changes
  useEffect(() => {
    setIsAtBottom(false);
    setIsAwayFromBottom(false);
  }, [currentIndex]);

  return {
    responseRef,
    // For desktop
    handleWheel,

    // For mobile (must attach these to the same container):
    handleTouchStart,
    handleTouchMove: handleTouchMoveEnhanced,
    handleTouchEnd: handleTouchEndEnhanced,

    direction,
    isAtBottom,
    isAwayFromBottom,
  };
}


// import { useState, useRef, useEffect } from "react";
// export function useSlideshowNavigation(
//   currentIndex: number,
//   setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
//   conversationPairsLength: number
// ) {
//   const [direction, setDirection] = useState<"up" | "down">("up");
//   const [isAtBottom, setIsAtBottom] = useState(false);
//   const [isAwayFromBottom, setIsAwayFromBottom] = useState(false); // ✅ New state

//   const responseRef = useRef<HTMLDivElement | null>(null);

//   // For the threshold-based wheel logic
//   const scrollAccumulator = useRef(0);
//   const lastScrollDirection = useRef<"up" | "down" | null>(null);
//   const isScrolling = useRef(false);

//   const SCROLL_THRESHOLD = 1200;
//   const DECAY_RATE = 0.95;
//   const DECAY_INTERVAL = 50;
//   const BOTTOM_OFFSET = 300; // ✅ Threshold for isAwayFromBottom

//   const goNextPair = () => {
//     if (currentIndex < conversationPairsLength - 1) {
//       setDirection("up");
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const goPrevPair = () => {
//     if (currentIndex > 0) {
//       setDirection("down");
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   // Threshold-based wheel handling
//   const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
//     if (isScrolling.current) return;

//     const el = responseRef.current;
//     if (!el) return;

//     const currentScrollDirection = e.deltaY > 0 ? "down" : "up";
//     const isAtTop = el.scrollTop === 0;
//     const isFullyScrolledDown =
//       el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

//     // If at topmost with wheel-up (and first pair), ignore
//     if (currentIndex === 0 && currentScrollDirection === "up") return;

//     // Reset accumulation if wheel direction changes
//     if (lastScrollDirection.current && lastScrollDirection.current !== currentScrollDirection) {
//       scrollAccumulator.current = 0;
//     }
//     lastScrollDirection.current = currentScrollDirection;

//     let shouldAccumulate = false;
//     if (currentScrollDirection === "down" && isFullyScrolledDown)
//       shouldAccumulate = true;
//     if (currentScrollDirection === "up" && isAtTop)
//       shouldAccumulate = true;

//     if (!shouldAccumulate) return;

//     scrollAccumulator.current += e.deltaY;
//     if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
//       isScrolling.current = true;
//       if (scrollAccumulator.current > 0) goNextPair();
//       else goPrevPair();

//       scrollAccumulator.current = 0;
//       setTimeout(() => {
//         isScrolling.current = false;
//       }, 500);
//     }
//   };

//   // Decay the scroll accumulator over time
//   useEffect(() => {
//     const decayInterval = setInterval(() => {
//       if (scrollAccumulator.current !== 0) {
//         scrollAccumulator.current *= DECAY_RATE;
//         if (Math.abs(scrollAccumulator.current) < 1) {
//           scrollAccumulator.current = 0;
//         }
//       }
//     }, DECAY_INTERVAL);
//     return () => clearInterval(decayInterval);
//   }, []);

//   // Watch for scrolling inside the response ref to detect bottom and distance from bottom
//   useEffect(() => {
//     const el = responseRef.current;
//     if (!el) return;

//     function checkScrollPosition() {
//       const scrollDistanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
//       setIsAtBottom(scrollDistanceFromBottom <= 1);
//       setIsAwayFromBottom(scrollDistanceFromBottom > BOTTOM_OFFSET);
//     }

//     el.addEventListener("scroll", checkScrollPosition);
//     checkScrollPosition(); // Run once on mount to get initial state

//     return () => el.removeEventListener("scroll", checkScrollPosition);
//   }, [responseRef.current]);

//   // Reset `isAtBottom` and `isAwayFromBottom` whenever index changes
//   useEffect(() => {
//     setIsAtBottom(false);
//     setIsAwayFromBottom(false);
//   }, [currentIndex]);

//   return {
//     handleWheel,
//     responseRef,
//     direction,
//     isAtBottom,
//     isAwayFromBottom, // ✅ New return value
//   };
// }

