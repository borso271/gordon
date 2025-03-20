import React, { useState, useRef, useEffect } from "react";

export function useMobileSlideshowNavigation(
  currentIndex: number,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  conversationPairsLength: number
) {
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const responseRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMoveY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  const SWIPE_THRESHOLD = 50;
  const DEBOUNCE_DELAY = 200;

  const goNextPair = () => {
    if (currentIndex < conversationPairsLength - 1) {
      console.log("goNextPair: Incrementing currentIndex to", currentIndex + 1); // Debug
      setDirection("down");
      setCurrentIndex((prev) => prev + 1);
    } else {
      console.log("goNextPair: Already at the last pair");
    }
  };

  const goPrevPair = () => {
    if (currentIndex > 0) {
      console.log("goPrevPair: Decrementing currentIndex to", currentIndex - 1); // Debug
      setDirection("up");
      setCurrentIndex((prev) => prev - 1);
    } else {
      console.log("goPrevPair: Already at the first pair");
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchMoveY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchMoveY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchMoveY.current) return;

    const deltaY = touchMoveY.current - touchStartY.current;
    const isSwipingUp = deltaY < -SWIPE_THRESHOLD;
    const isSwipingDown = deltaY > SWIPE_THRESHOLD;

    console.log("TouchEnd: deltaY =", deltaY, "isSwipingUp =", isSwipingUp, "isSwipingDown =", isSwipingDown, "isAtBottom =", isAtBottom, "isAtTop =", isAtTop); // Debug

    if (isSwiping.current) {
      console.log("TouchEnd: Swiping is debounced");
      return;
    }

    if (isSwipingUp && isAtBottom) {
      console.log("TouchEnd: Swiping Up AND at Bottom - Calling goNextPair"); // Debug
      isSwiping.current = true;
      goNextPair();
    } else if (isSwipingDown && isAtTop) {
      console.log("TouchEnd: Swiping Down AND at Top - Calling goPrevPair"); // Debug
      isSwiping.current = true;
      goPrevPair();
    } else {
      console.log("TouchEnd: Swipe conditions not met"); // Debug
    }

    setTimeout(() => {
      isSwiping.current = false;
    }, DEBOUNCE_DELAY);

    touchStartY.current = null;
    touchMoveY.current = null;
  };

  useEffect(() => {
    const el = responseRef.current;
    if (!el) {
      console.log("useEffect: responseRef is null!");
      return;
    }

    function checkScrollPosition() {
      const newIsAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 1;
      const newIsAtTop = el.scrollTop <= 1;

      if (newIsAtBottom !== isAtBottom) {
          console.log("Scroll: isAtBottom changed from", isAtBottom, "to", newIsAtBottom);
          setIsAtBottom(newIsAtBottom);
      }

      if (newIsAtTop !== isAtTop) {
          console.log("Scroll: isAtTop changed from", isAtTop, "to", newIsAtTop);
          setIsAtTop(newIsAtTop);
      }
    }

    console.log("useEffect: Adding scroll listener for currentIndex", currentIndex); // Debug
    el.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // Initial check

    return () => {
      console.log("useEffect: Removing scroll listener for currentIndex", currentIndex); // Debug
      el.removeEventListener("scroll", checkScrollPosition);
    };
  }, [currentIndex, isAtBottom, isAtTop]); // Added isAtBottom and isAtTop as dependencies to update when those change


  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    responseRef,
    direction,
    isAtBottom,
    isAtTop,
  };
}
// import { useState, useRef, useEffect } from "react";


// export function useMobileSlideshowNavigation(
//   currentIndex: number,
//   setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
//   conversationPairsLength: number
// ) {
//   const [direction, setDirection] = useState<"up" | "down">("down"); // Initial direction
//   const responseRef = useRef<HTMLDivElement | null>(null);
//   const touchStartY = useRef<number | null>(null);
//   const touchMoveY = useRef<number | null>(null);
//   const isSwiping = useRef(false); // Debounce flag

//   const SWIPE_THRESHOLD = 50;
//   const DEBOUNCE_DELAY = 200; // Reduced debounce delay.

//   const goNextPair = () => {
//     if (currentIndex < conversationPairsLength - 1) {
//       setDirection("down"); // Going *down* the list
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const goPrevPair = () => {
//     if (currentIndex > 0) {
//       setDirection("up"); // Going *up* the list
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
//     touchStartY.current = e.touches[0].clientY;
//     touchMoveY.current = null;
//   };

//   const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
//     touchMoveY.current = e.touches[0].clientY;
//   };

//   const handleTouchEnd = () => {
//     if (!touchStartY.current || !touchMoveY.current) return;

//     const deltaY = touchMoveY.current - touchStartY.current;
//     const isSwipingUp = deltaY < -SWIPE_THRESHOLD;
//     const isSwipingDown = deltaY > SWIPE_THRESHOLD;

//     if (isSwiping.current) return; // Debounce

//     if (isSwipingUp) {
//         isSwiping.current = true;
//         goNextPair();
//     } else if (isSwipingDown) {
//         isSwiping.current = true;
//         goPrevPair();
//     }

//     setTimeout(() => {
//       isSwiping.current = false;
//     }, DEBOUNCE_DELAY);

//     touchStartY.current = null;
//     touchMoveY.current = null;
//   };



//   return {
//     handleTouchStart,
//     handleTouchMove,
//     handleTouchEnd,
//     responseRef,
//     direction,
//   };
// }



// export function useMobileSlideshowNavigation(
//   currentIndex: number,
//   setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
//   conversationPairsLength: number
// ) {
//   const [direction, setDirection] = useState<"up" | "down">("up");
//   const [isAtBottom, setIsAtBottom] = useState(false);
//   const [isAwayFromBottom, setIsAwayFromBottom] = useState(false);

//   const responseRef = useRef<HTMLDivElement | null>(null);
//   const touchStartY = useRef<number | null>(null);
//   const touchMoveY = useRef<number | null>(null);
//   const isSwiping = useRef(false);

//   const SWIPE_THRESHOLD = 50;
//   const BOTTOM_OFFSET = 300;

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

//   const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
//     touchStartY.current = e.touches[0].clientY;
//     touchMoveY.current = null;
//   };

//   const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
//     touchMoveY.current = e.touches[0].clientY;
//   };


//   const handleTouchEnd = () => {
//     if (!touchStartY.current || !touchMoveY.current) return;

//     const deltaY = touchMoveY.current - touchStartY.current;
//     const isSwipingUp = deltaY < -SWIPE_THRESHOLD;
//     const isSwipingDown = deltaY > SWIPE_THRESHOLD;

//     if (isSwiping.current) return;

//     if (isSwipingUp && isAtBottom) {
//       isSwiping.current = true;
//       goNextPair();
//     } else if (isSwipingDown) {
//       isSwiping.current = true;
//       goPrevPair();
//     }

//     setTimeout(() => {
//       isSwiping.current = false;
//     }, 500);

//     touchStartY.current = null;
//     touchMoveY.current = null;
//   };




//   useEffect(() => {
//     const el = responseRef.current;
//     if (!el) return;

//     function checkScrollPosition() {
//       const scrollDistanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
//       setIsAtBottom(scrollDistanceFromBottom <= 1);
//       setIsAwayFromBottom(scrollDistanceFromBottom > BOTTOM_OFFSET);
//     }

//     el.addEventListener("scroll", checkScrollPosition);
//     checkScrollPosition();

//     return () => el.removeEventListener("scroll", checkScrollPosition);
//   }, [responseRef.current]);

//   useEffect(() => {
//     setIsAtBottom(false);
//     setIsAwayFromBottom(false);
//   }, [currentIndex]);

//   return {
//     handleTouchStart,
//     handleTouchMove,
//     handleTouchEnd,
//     responseRef,
//     direction,
//     isAtBottom,
//     isAwayFromBottom,
//   };
// }
