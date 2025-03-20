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


// import { useState, useRef } from "react";

// export function useMobileSlideshowNavigation(
//   currentIndex: number,
//   setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
//   conversationPairsLength: number
// ) {
//   const [direction, setDirection] = useState<"up" | "down">("down");
//   const responseRef = useRef<HTMLDivElement | null>(null);
//   const touchStartY = useRef<number | null>(null);
//   const touchMoveY = useRef<number | null>(null);
//   const isSwiping = useRef(false);

//   const SWIPE_THRESHOLD = 50;
//   const DEBOUNCE_DELAY = 200;

//   const goNextPair = () => {
//     if (currentIndex < conversationPairsLength - 1) {
//       setDirection("down");
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const goPrevPair = () => {
//     if (currentIndex > 0) {
//       setDirection("up");
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
//     touchStartY.current = e.touches[0].clientY;
//     touchMoveY.current = null;

//     // Check if the user is at the top or bottom when starting the swipe
//     const el = responseRef.current;
//     console.log("EL IS: ", el)
//     if (el) {
//       const isAtTop = el.scrollTop <= 1;
//       const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 1;


//       console.log("is at top is: ", isAtTop);

//       console.log("is at bottom is: ", isAtBottom);
//       // Store these values for later comparison
//       el.dataset.atTop = isAtTop ? "true" : "false";
//       el.dataset.atBottom = isAtBottom ? "true" : "false";
//     }
//   };

//   const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
//     touchMoveY.current = e.touches[0].clientY;
//   };

//   const handleTouchEnd = () => {
//     if (!touchStartY.current || !touchMoveY.current) return;
//     if (isSwiping.current) return;

//     const deltaY = touchMoveY.current - touchStartY.current;
//     const isSwipingUp = deltaY < -SWIPE_THRESHOLD;
//     const isSwipingDown = deltaY > SWIPE_THRESHOLD;

//     const el = responseRef.current;
//     if (!el) return;

//     // Retrieve whether the user was at the top/bottom when they started the swipe
//     const startedAtTop = el.dataset.atTop === "true";
//     const startedAtBottom = el.dataset.atBottom === "true";

//     if (isSwipingUp && startedAtBottom) {
//       isSwiping.current = true;
//       goNextPair();
//     } else if (isSwipingDown && startedAtTop) {
//       isSwiping.current = true;
//       goPrevPair();
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
