import { useLayoutEffect, useRef, useState } from 'react';
import { Interaction } from '../../interfaces';

export function useScrollNewInteractionToTop(
  interactions: Interaction[],
  containerRef: React.RefObject<HTMLDivElement>
) {

  const [fillerHeight, setFillerHeight] = useState(0);
  const previousInteractionCount = useRef(interactions.length);

  console.log("FILLER HEIGHT IS ", fillerHeight);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || interactions.length === 0) return;

    // Only trigger when a new interaction is added
    if (interactions.length <= previousInteractionCount.current) {
      previousInteractionCount.current = interactions.length;
      return;
    }

    previousInteractionCount.current = interactions.length;

    const lastInteractionId = interactions[interactions.length - 1]?.id;
    const lastInteractionEl = container.querySelector(
      `[data-id="${lastInteractionId}"]`
    ) as HTMLElement;

    if (!lastInteractionEl) return;

    const containerHeight = container.clientHeight;

    // Compute extra space needed for the unfolding stream
    const lastInteractionHeight = lastInteractionEl.offsetHeight;
    const requiredFiller = Math.max(containerHeight - lastInteractionHeight - 20, 0);

    setFillerHeight(requiredFiller);

    // Scroll last interaction to top of viewport smoothly
    lastInteractionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  }, [interactions, containerRef]);

  return { fillerHeight };
}
