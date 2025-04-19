import { useEffect, useState, useCallback } from "react";

export function useScrollToBottomButton(containerRef: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  // Check if scroll is needed (overflow exists)
  const checkOverflow = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 20;
    const shouldShow =
      el.scrollHeight > el.clientHeight &&
      el.scrollTop < el.scrollHeight - el.clientHeight - threshold;

    setIsVisible(shouldShow);
  }, [containerRef]);

  // Scroll to bottom (safely after DOM updates)
  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        });
      });
    }
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkOverflow(); // Initial check

    const handleScroll = () => checkOverflow();
    el.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(() => checkOverflow());
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [checkOverflow, containerRef]);

  return { isVisible, scrollToBottom };
}
