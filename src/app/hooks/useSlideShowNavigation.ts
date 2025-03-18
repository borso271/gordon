import { useState, useRef, useEffect } from "react";

export function useSlideshowNavigation(
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  conversationPairsLength: number
) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const responseRef = useRef<HTMLDivElement | null>(null);

  const scrollAccumulator = useRef(0);
  const lastScrollDirection = useRef<"up" | "down" | null>(null);
  const isScrolling = useRef(false);

  const SCROLL_THRESHOLD = 1200; // Adjust for sensitivity
  const DECAY_RATE = 0.95;       // Adjust for faster/slower decay
  const DECAY_INTERVAL = 50;     // Interval in milliseconds

  const goNextPair = () => {
    if (currentIndex < conversationPairsLength - 1) {
      console.log("✅ Switching to next pair:", currentIndex + 1);
      setDirection("up");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrevPair = () => {
    if (currentIndex > 0) {
      console.log("✅ Switching to previous pair:", currentIndex - 1);
      setDirection("down");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrolling.current) return;

    const el = responseRef.current;
    if (!el) return;

    const currentScrollDirection = e.deltaY > 0 ? "down" : "up";
    const isAtTop = el.scrollTop === 0;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

    if (currentIndex === 0 && currentScrollDirection === "up") return;
    if (currentIndex === conversationPairsLength - 1 && currentScrollDirection === "down") return;

    if (lastScrollDirection.current && lastScrollDirection.current !== currentScrollDirection) {
      scrollAccumulator.current = 0;
    }
    lastScrollDirection.current = currentScrollDirection;

    let shouldAccumulate = false;
    if (currentScrollDirection === "down" && isAtBottom) shouldAccumulate = true;
    if (currentScrollDirection === "up" && isAtTop) shouldAccumulate = true;

    if (!shouldAccumulate) return;

    scrollAccumulator.current += e.deltaY;
    console.log("Scroll Accumulator:", scrollAccumulator.current);

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

  // Always run an interval to decay the accumulator over time.
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
  }, []); // Empty dependency array so it runs once on mount

  return { handleWheel, responseRef, direction };
}

// import { useState, useRef } from "react";

// export function useSlideshowNavigation(
//   currentIndex: number,
//   setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
//   conversationPairsLength: number
// ) {
//   const [direction, setDirection] = useState<"up" | "down">("up");
//   // This ref points to the scrollable div in the current pair
//   const responseRef = useRef<HTMLDivElement | null>(null);

//   // Keep these in refs so they are not reset on each re-render:
//   const scrollAccumulator = useRef(0);
//   const lastScrollDirection = useRef<"up" | "down" | null>(null);
//   const isScrolling = useRef(false);

//   const SCROLL_THRESHOLD = 1200; // Adjust for sensitivity

//   const goNextPair = () => {
   
//     if (currentIndex < conversationPairsLength - 1) {
//         console.log("✅ Switching to next pair:", currentIndex + 1);
//       setDirection("up");
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };
  
//   const goPrevPair = () => {
   
//     if (currentIndex > 0) {
//         console.log("✅ Switching to previous pair:", currentIndex - 1);
//       setDirection("down");
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };
  
//   const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
//     // If we're locked (already switching screens), ignore further wheel events
//     if (isScrolling.current) return;

//     const el = responseRef.current;
//     if (!el) return;

//     const currentScrollDirection = e.deltaY > 0 ? "down" : "up";

//     // Check if we are at the top or bottom of the container
//     const isAtTop = el.scrollTop === 0;
//     const isAtBottom =
//       el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

//     // Optional: disallow scrolling beyond first or last pair
//     if (currentIndex === 0 && currentScrollDirection === "up") return;
//     if (
//       currentIndex === conversationPairsLength - 1 &&
//       currentScrollDirection === "down"
//     )
//       return;

//     // If direction changed, reset the accumulator
//     if (
//       lastScrollDirection.current &&
//       lastScrollDirection.current !== currentScrollDirection
//     ) {
//       scrollAccumulator.current = 0;
//     }
//     lastScrollDirection.current = currentScrollDirection;

//     // Only accumulate if there's NO further scrolling to do in that direction
//     let shouldAccumulate = false;

//     // If scrolling down, only accumulate once we're at bottom
//     if (currentScrollDirection === "down" && isAtBottom) {
//       shouldAccumulate = true;
//     }
//     // If scrolling up, only accumulate once we're at top
//     else if (currentScrollDirection === "up" && isAtTop) {
//       shouldAccumulate = true;
//     }

//     // If we can still scroll within the container, do nothing special:
//     if (!shouldAccumulate) {
//       return; // Let the normal container scrolling happen
//     }

//     // If we are at the boundary, accumulate scroll
//     scrollAccumulator.current += e.deltaY;
// console.log(scrollAccumulator.current)
//     // Check threshold
//     if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
//       // Lock so we don’t fire multiple times on a big wheel event
//       isScrolling.current = true;

//       // Decide which direction to move
//       if (scrollAccumulator.current > 0) {
//         // Going down
//         goNextPair();
//       } else {
//         // Going up
//         goPrevPair();
//       }

//       // Reset accumulator
//       scrollAccumulator.current = 0;

//       // Unlock after a small delay (tweak as needed)
//       setTimeout(() => {
//         isScrolling.current = false;
//       }, 500);
//     }
//   };

//   return { handleWheel, responseRef, direction };
// }