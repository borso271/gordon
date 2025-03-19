import { useCallback } from "react";


function useSmoothScrollToBottom(responseRef: React.RefObject<HTMLDivElement>) {
  
  
//     const smoothScrollToBottom = useCallback(() => {
//     const el = responseRef.current;
//     if (!el) return;

//     let attempts = 0;
//     const maxAttempts = 20; // Try for ~1 second (20 x 50ms)
//     const delayBetweenAttempts = 50; // Milliseconds

//     function tryScroll() {
//       requestAnimationFrame(() => {
//         const bottomOffset = el.scrollHeight - el.scrollTop - el.clientHeight;

//         if (bottomOffset > 5 && attempts < maxAttempts) {
//           // Keep scrolling until we are truly at the bottom
//           el.scrollTo({
//             top: el.scrollHeight,
//             behavior: "smooth",
//           });

//           // Try again after a short delay
//           attempts += 1;
//           setTimeout(tryScroll, delayBetweenAttempts);
//         }
//       });
//     }

//     tryScroll();
//   }, [responseRef]);
const smoothScrollToBottom = useCallback(() => {
    const el = responseRef.current;
    if (!el) return;
  
    // 🚀 Just go way beyond, let browser stop at max
    el.scrollTo({
      top: el.scrollHeight + 10000, // Scroll insanely far down
      behavior: "smooth",
    });
  }, [responseRef]);
  
  return smoothScrollToBottom;
}

export default useSmoothScrollToBottom;


// function useSmoothScrollToBottom(responseRef: React.RefObject<HTMLDivElement>) {
//   const smoothScrollToBottom = useCallback(() => {
//     const el = responseRef.current;
//     if (!el) return;

//     let previousScrollHeight = 3000;
//     let attempts = 0;
//     const maxAttempts = 10;

//     function scrollUntilStable() {
//       requestAnimationFrame(() => {
//         const currentScrollHeight = 3000;

//         if (currentScrollHeight !== previousScrollHeight && attempts < maxAttempts) {
//           // Keep scrolling down immediately while content is expanding
//           el.scrollTop = 3000;

//           // Update height tracking and try again
//           previousScrollHeight = 3000;
//           attempts += 1;
//           scrollUntilStable();
//         } else {
//           // ✅ Scroll slightly beyond the bottom to ensure visibility
//           el.scrollTo({ top: 3000, behavior: "smooth" });
//         }
//       });
//     }

//     scrollUntilStable();
//   }, [responseRef]);

//   return smoothScrollToBottom;
// }

// export default useSmoothScrollToBottom;
