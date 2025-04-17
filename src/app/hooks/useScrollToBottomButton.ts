import { useEffect, useState, useCallback } from "react";

export function useScrollToBottomButton(containerRef: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  // Check if scroll is needed (overflow exists)
  const checkOverflow = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const shouldShow = el.scrollHeight > el.clientHeight && el.scrollTop < el.scrollHeight - el.clientHeight - 20;
    setIsVisible(shouldShow);
  }, [containerRef]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkOverflow(); // Initial check

    const handleScroll = () => checkOverflow();
    el.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [checkOverflow, containerRef]);

  return { isVisible, scrollToBottom };
}
