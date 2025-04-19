import { useEffect, useLayoutEffect, useRef } from 'react';
import { Interaction } from '../../interfaces';

export function useNewInteractionScroll(
  interactions: Interaction[],
  containerRef: React.RefObject<HTMLDivElement>,
  fillerRef: React.RefObject<HTMLDivElement>
) {
  const prevLength = useRef(interactions.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const filler = fillerRef.current;
    if (!container || !filler) return;

    const newInteractionAdded = interactions.length > prevLength.current;

    if (newInteractionAdded) {
      console.log('NEW INTERACTION ADDED!')
      const lastInteractionId = interactions[interactions.length - 1].id;
      const newInteractionEl = container.querySelector(`[data-id="${lastInteractionId}"]`) as HTMLElement;

      if (newInteractionEl) {
        // Calculate required filler height:
        const containerHeight = container.clientHeight;
        const newInteractionHeight = newInteractionEl.offsetHeight;

        // Set filler to exactly fill remaining viewport height:
        const fillerHeight = Math.max(0, containerHeight - newInteractionHeight - 20); // 20px padding
        console.log("filler height is: ", fillerHeight)
        filler.style.height = `${fillerHeight}px`;

        // Scroll the new interaction to top:
        container.scrollTo({
          top: newInteractionEl.offsetTop - 20, // 20px padding from top
          behavior: "smooth",
        });
      }
    } else {
      filler.style.height = '0px';
    }

    prevLength.current = interactions.length;
  }, [interactions, containerRef, fillerRef]);
}
