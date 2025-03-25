import { RefObject } from "react";

export const scrollDownManually = (responseRef: RefObject<HTMLElement>): void => {
    // 1) Jump to last conversation pair in state

    // 2) Wait a brief moment for React to start rendering that last pair
    setTimeout(() => {
      const el = responseRef.current;
      if (!el) return;
  
      // We'll check the height every 100 ms
      let stableCount = 0;
      let lastHeight = el.scrollHeight;
      const checkInterval = setInterval(() => {
        // If the element disappeared, stop
        if (!el) {
          clearInterval(checkInterval);
          return;
        }
        // If scrollHeight changed, reset stability count
        if (el.scrollHeight !== lastHeight) {
          stableCount = 0;
          lastHeight = el.scrollHeight;
        } else {
          // The height stayed the same => it's stable for this check
          stableCount++;
          // if stable for ~300ms (3×100ms), assume it's fully rendered
          if (stableCount >= 3) {
            clearInterval(checkInterval);
  
            // 3) Now do exactly one smooth scroll
            el.scrollTo({
              top: el.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      }, 50);
    }, 50);
  };