import { useState, useRef, useEffect } from "react";


export function useSlideshowNavigation(
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  conversationPairsLength: number
) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isAtBottom, setIsAtBottom] = useState(false);

  const responseRef = useRef<HTMLDivElement | null>(null);

  // For the threshold-based wheel logic
  const scrollAccumulator = useRef(0);
  const lastScrollDirection = useRef<"up" | "down" | null>(null);
  const isScrolling = useRef(false);

  const SCROLL_THRESHOLD = 1200;
  const DECAY_RATE = 0.95;
  const DECAY_INTERVAL = 50;

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

  // Manual scroll-down function for your button
  // - either jump to the next pair
  // - or scroll to bottom in the last pair


  // const scrollDownManually = () => {
  //   // Jump to last conversation pair
  //   setCurrentIndex(conversationPairsLength - 1);

  //   setTimeout(() => {
  //     const el = responseRef.current;
  //     if (!el) return;
    
  //     let attempts = 0;
  //     const maxAttempts = 5;
    
  //     function scrollMultipleTimes() {
  //       requestAnimationFrame(() => {
  //         // Each call restarts from the current position 
  //         // but moves us closer to the new bottom
  //         el.scrollTo({
  //           top: el.scrollHeight,
  //           behavior: "smooth",
  //         });
    
  //         attempts++;
  //         // If more attempts remain, do it again next frame
  //         if (attempts < maxAttempts) {
  //           scrollMultipleTimes();
  //         }
  //       });
  //     }
    
  //     scrollMultipleTimes();
  //   }, 0);
    
  // };
  


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
    // If at bottommost with wheel-down (and last pair), ignore
    if (
      currentIndex === conversationPairsLength - 1 &&
      currentScrollDirection === "down"
    )
      return;

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

  // Watch for scrolling inside the response ref to detect bottom
  useEffect(() => {
    const el = responseRef.current;
    if (!el) return;

    function checkIsAtBottom() {
      // might be “true” if near the bottom
      setIsAtBottom(
        el.scrollHeight - el.scrollTop <= el.clientHeight + 1
      );
    }
    el.addEventListener("scroll", checkIsAtBottom);
    // run once on mount to get initial state
    checkIsAtBottom();

    return () => el.removeEventListener("scroll", checkIsAtBottom);
  }, [responseRef.current]);

  // Reset isAtBottom whenever index changes
  useEffect(() => {
    setIsAtBottom(false);
  }, [currentIndex]);

  return {
    handleWheel,
    responseRef,
    direction,
    isAtBottom,
  };
}


// export function useSlideshowNavigation(
//   currentIndex: number,
//   setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
//   conversationPairsLength: number
// ) {
//   const [direction, setDirection] = useState<"up" | "down">("up");
//   const responseRef = useRef<HTMLDivElement | null>(null);

//   const scrollAccumulator = useRef(0);
//   const lastScrollDirection = useRef<"up" | "down" | null>(null);
//   const isScrolling = useRef(false);

//   const SCROLL_THRESHOLD = 1200; // Adjust for sensitivity
//   const DECAY_RATE = 0.95;       // Adjust for faster/slower decay
//   const DECAY_INTERVAL = 50;     // Interval in milliseconds

//   const goNextPair = () => {
//     if (currentIndex < conversationPairsLength - 1) {
//       console.log("✅ Switching to next pair:", currentIndex + 1);
//       setDirection("up");
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const goPrevPair = () => {
//     if (currentIndex > 0) {
//       console.log("✅ Switching to previous pair:", currentIndex - 1);
//       setDirection("down");
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
//     if (isScrolling.current) return;

//     const el = responseRef.current;
//     if (!el) return;

//     const currentScrollDirection = e.deltaY > 0 ? "down" : "up";
//     const isAtTop = el.scrollTop === 0;
//     const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

//     if (currentIndex === 0 && currentScrollDirection === "up") return;
//     if (currentIndex === conversationPairsLength - 1 && currentScrollDirection === "down") return;

//     if (lastScrollDirection.current && lastScrollDirection.current !== currentScrollDirection) {
//       scrollAccumulator.current = 0;
//     }
//     lastScrollDirection.current = currentScrollDirection;

//     let shouldAccumulate = false;
//     if (currentScrollDirection === "down" && isAtBottom) shouldAccumulate = true;
//     if (currentScrollDirection === "up" && isAtTop) shouldAccumulate = true;

//     if (!shouldAccumulate) return;

//     scrollAccumulator.current += e.deltaY;
//     // console.log("Scroll Accumulator:", scrollAccumulator.current);

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

//   // Always run an interval to decay the accumulator over time.
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
//   }, []); // Empty dependency array so it runs once on mount

//   return { handleWheel, responseRef, direction };
// }
