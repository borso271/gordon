import { useCallback } from "react";


function useSmoothScrollToBottom(responseRef: React.RefObject<HTMLDivElement>) {
  
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
