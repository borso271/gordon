import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'; // Added useState, useLayoutEffect if needed elsewhere

// --- Assuming correct import paths ---
import { useConversation } from './useConversation';
import { useFunctionExecution } from './useFunctionExecution';
import { useScrollToBottomButton } from './useScrollToBottomButton';
import { SpeechOverlay } from './SpeechOverlay';
import { CircledIconButton } from './CircledIconButton';
import { ConversationPairView } from './ConversationPairView';
import styles from './ChatThread.module.css';

interface ChatThreadProps {
  currentIndex: number;
  responseRef: React.RefObject<HTMLDivElement>;
}

const ChatThread: React.FC<ChatThreadProps> = ({
  currentIndex,
  responseRef,
}) => {
  const { chatSession, activeInteraction, setActiveInteraction } = useConversation();
  const { onManualFunctionCall } = useFunctionExecution();

  const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isVisible: isScrollDownButtonVisible, scrollToBottom } = useScrollToBottomButton(containerRef);

  // --- Ref to track the previous number of interactions ---
  const prevInteractionsLength = useRef(chatSession.interactions.length);

  // --- Ref Handling Function (Keep as is) ---
  const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
    if (typeof id === "string") {
      if (el) {
        interactionRefs.current[id] = el;
      } else {
        delete interactionRefs.current[id];
      }
    }
  };

  // --- Scroll NEW Interactions to TOP ---
  useEffect(() => {
    const currentLength = chatSession.interactions.length;
    const container = containerRef.current;

    // --- CONDITION CHECK ---
    // Only proceed if:
    // 1. Container ref is available.
    // 2. The current length is GREATER than the previous length (item added).
    // 3. There's at least one interaction.
    if (container && currentLength > prevInteractionsLength.current && currentLength > 0) {
      console.log("New interaction detected, scrolling to top."); // Debug log

      const lastInteraction = chatSession.interactions[currentLength - 1];
      const lastInteractionId = lastInteraction?.id;

      if (!lastInteractionId) {
        console.warn("ChatThread: Newly added interaction missing ID, cannot scroll.");
        // Still update the length ref below
      } else {
        // Use timeout to ensure DOM update and ref assignment before scrolling
        const timerId = setTimeout(() => {
          const lastElement = interactionRefs.current[lastInteractionId];
          if (lastElement) {
            lastElement.scrollIntoView({
              behavior: 'smooth', // Or 'auto'
              block: 'start',
              inline: 'nearest',
            });
             // console.log(`Scrolled new interaction ${lastInteractionId} to top.`);
          } else {
             // console.warn(`ChatThread: Ref for new interaction ${lastInteractionId} not found.`);
          }
        }, 0); // Defer execution slightly

        // No need for explicit cleanup for such a short timeout usually
        // return () => clearTimeout(timerId); // This would clear if dependencies change *before* timeout
      }
    } else {
       // Optional: Log why scroll didn't happen if debugging
       // if (container && currentLength <= prevInteractionsLength.current) {
       //   console.log("Interaction change detected, but length did not increase. No scroll.");
       // }
    }

    // --- UPDATE PREVIOUS LENGTH REF ---
    // Always update the ref to the current length *after* the check,
    // so it's correct for the *next* render/effect run.
    prevInteractionsLength.current = currentLength;

  // --- DEPENDENCIES ---
  // Still depend on chatSession.interactions because we need the effect
  // to RUN when it changes, so we can PERFORM the length check.
  }, [chatSession.interactions]);


  // --- Intersection Observer for ACTIVE Interaction (Keep as is) ---
  const prevActivatedId = useRef<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // ... (Intersection observer logic remains exactly the same) ...
     if (!containerRef.current) {
      // console.warn("ChatThread: containerRef not available for IntersectionObserver.");
      return;
    };
    const MIN_ACTIVATION_RATIO = 0.1;
    const DEBOUNCE_DELAY_MS = 100;
    let ratioMap = new Map<string, number>();
    const observer = new IntersectionObserver(/* ... callback ... */ (entries) => {
        // ... (your observer callback) ...
        for (const entry of entries) { const id = entry.target.getAttribute("data-id"); if (id) { ratioMap.set(id, entry.intersectionRatio); } } let bestVisibleId: string | null = null; let bestVisibleRatio = 0; for (const [id, ratio] of ratioMap.entries()) { if (ratio >= MIN_ACTIVATION_RATIO && ratio > bestVisibleRatio) { bestVisibleRatio = ratio; bestVisibleId = id; } } if (bestVisibleId) { if (bestVisibleId !== activeInteraction && bestVisibleId !== prevActivatedId.current) { if (debounceTimer.current) { clearTimeout(debounceTimer.current); } debounceTimer.current = setTimeout(() => { if (bestVisibleId && bestVisibleId !== activeInteraction) { prevActivatedId.current = bestVisibleId; setActiveInteraction(bestVisibleId); } }, DEBOUNCE_DELAY_MS); } }
      }, { root: containerRef.current, rootMargin: '0px', threshold: [0, MIN_ACTIVATION_RATIO, 0.95], });
    const currentRefs = interactionRefs.current; Object.values(currentRefs).forEach((el) => { if (el) observer.unobserve(el); }); let observedCount = 0; chatSession.interactions.forEach(interaction => { const id = interaction.id; if (id && currentRefs[id]) { observer.observe(currentRefs[id]!); observedCount++; } });
    return () => { observer.disconnect(); if (debounceTimer.current) { clearTimeout(debounceTimer.current); } };
  }, [chatSession.interactions, containerRef, activeInteraction, setActiveInteraction]);


  // --- Component Render (Keep as is) ---
  return (
    <div className={styles.outerWrapper} >
      <div className={styles.speechOverlayContainer}>
        <SpeechOverlay />
      </div>
      {isScrollDownButtonVisible && (
        <div className={styles.scrollDownButton}>
          <CircledIconButton onClick={scrollToBottom} iconName={"arrow_down"} />
        </div>
      )}
      <div className={styles.slideContainer} ref={containerRef} >
        <div className={styles.conversationList}>
          {chatSession.interactions.map((interaction, index) => (
            <div
              key={interaction.id || index}
              data-id={interaction.id}
              ref={(el) => assignRef(el, interaction.id)}
              className={styles.interactionWrapper} // Ensure you have this class if using flex filler
            >
              <ConversationPairView
                interaction={interaction}
                responseRef={index === chatSession.interactions.length - 1 ? responseRef : null}
                handleManualFunctionCall={onManualFunctionCall}
              />
            </div>
          ))}
        </div>
        {/* --- Filler Element (Assuming Flexbox Approach) --- */}
        <div className={styles.filler} aria-hidden="true"></div>
      </div>
    </div>
  );
};

export default ChatThread;