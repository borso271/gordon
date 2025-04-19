// components/ChatThread.tsx

import React, { useEffect, useRef } from "react";
import { useConversation } from "../../app/context/conversationContext";
import ConversationPairView from "../Chat/components/ConversationPairView";
import DropdownButton from "../Buttons/DropdownButton";
import styles from "./ChatThread.module.css";
import { useFunctionExecution } from "../../app/context/functionExecutionContext";
import { useScrollToBottomButton } from "../../app/hooks/useScrollToBottomButton";
import SpeechOverlay from "../SpeechOverlay";
import CircledIconButton from "../Buttons/CircleActionButton";

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

  console.log("chat session is: ", chatSession)

  useEffect(() => {
   
      scrollToBottom();
   
  }, []); // ✅ Track only the length


  // Each interaction block is stored in a ref
  const prevInteractionCount = useRef<number>(chatSession.interactions.length);
  useEffect(() => {
    const currentCount = chatSession.interactions.length;
  
    if (currentCount > prevInteractionCount.current) {
      // New interaction added
      scrollToBottom();
    }
  
    prevInteractionCount.current = currentCount;
  }, [chatSession.interactions.length]); // ✅ Track only the length

  const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  // For showing "Scroll to bottom" button
  const { isVisible, scrollToBottom } = useScrollToBottomButton(containerRef);
  
  // console.log("is visible is: ", isVisible)
  // Track the previously activated ID to prevent redundant updates
  const prevActivatedId = useRef<string | null>(null);

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    if (!containerRef.current) {
        console.warn("ChatThread: containerRef is not available for IntersectionObserver.");
        return;
    };

    // --- CONFIGURATION ---
    // Adjust this value based on testing. Higher values mean an item
    // must be more visible to become "active". 0.6 means 60% visible.
    const MIN_ACTIVATION_RATIO = 0.1;
    // Shorter debounce to feel more responsive, but still prevent rapid flicker
    const DEBOUNCE_DELAY_MS = 100;
    // --- END CONFIGURATION ---

    // ratioMap captures the intersectionRatio per block on each observer callback
    let ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
     
      (entries) => {
        console.log("--- Observer Callback Fired ---", new Date().toLocaleTimeString()); // <-- ADD THIS

        // Record each entry's current ratio
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-id");
          if (id) {
            // Use entry.intersectionRatio which reflects the *current* visibility
            ratioMap.set(id, entry.intersectionRatio);
            // console.log("Ratio Map:", Object.fromEntries(ratioMap)); // <-- Log the calculated ratios
          }
        }

        // Determine which *currently sufficiently visible* ID has the highest ratio
        let bestVisibleId: string | null = null;
        let bestVisibleRatio = 0;

        for (const [id, ratio] of ratioMap.entries()) {
          // IMPORTANT: Only consider elements meeting the MIN_ACTIVATION_RATIO
          if (ratio >= MIN_ACTIVATION_RATIO && ratio > bestVisibleRatio) {
            bestVisibleRatio = ratio;
            bestVisibleId = id;
          }
        }

        // If we found a sufficiently visible element...
        if (bestVisibleId) {
          
          if (bestVisibleId !== activeInteraction && bestVisibleId !== prevActivatedId.current) {

            // Clear any pending debounce timer for a *different* ID
            if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
            }

            // Set a new debounce timer to update the active state
            debounceTimer.current = setTimeout(() => {
    
              // Only update if it's still relevant and not already active
              if (bestVisibleId && bestVisibleId !== activeInteraction) {
                
                 prevActivatedId.current = bestVisibleId; // Track what *we* last set
                 setActiveInteraction(bestVisibleId);
              }
            }, DEBOUNCE_DELAY_MS);
          }
        }
        
      },
      {
        root: containerRef.current,
        rootMargin: '0px', // No margin
      
        threshold: [0, MIN_ACTIVATION_RATIO, 0.95], // Fine-tune thresholds
      }
    );

    // Clear previous refs before observing new ones (important on re-renders)
    const currentRefs = interactionRefs.current;
    Object.values(currentRefs).forEach((el) => {
      if (el) observer.unobserve(el);
    });
    // interactionRefs.current = {}; // Resetting refs might be needed if IDs change drastically

    // Observe each current interaction block
    let observedCount = 0;
    chatSession.interactions.forEach(interaction => {
        const id = interaction.id;
        if (id && currentRefs[id]) {
            observer.observe(currentRefs[id]!);
            observedCount++;
        }
    });
  
    // Cleanup function
    return () => {
      // console.log("IntersectionObserver disconnecting.");
      observer.disconnect();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
 
  }, [chatSession.interactions, containerRef, activeInteraction, setActiveInteraction]);


  // --- Ref Handling ---
  // Function to assign refs, ensuring cleanup if IDs/elements change
  const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
    if (typeof id === "string") {
      if (el) {
        interactionRefs.current[id] = el;
      } else {
        // Element is unmounting or ID changed, remove from refs
        delete interactionRefs.current[id];
      }
    }
  };


  return (
    <div className={styles.outerWrapper}>

      <div className={styles.speechOverlayContainer}>
      <SpeechOverlay/>
      </div>

      {isVisible && ( 
        <div className={styles.scrollDownButton}>


          <CircledIconButton onClick={scrollToBottom} iconName={"arrow_down"}           
          />
        </div>
     )}

      <div className={styles.slideContainer} ref={containerRef} >   
        <div className={styles.conversationList}>
          {chatSession.interactions.map((interaction, index) => (
            <div
              key={interaction.id || index}
              data-id={interaction.id}
              // Use the ref assignment function
              ref={(el) => assignRef(el, interaction.id)}
            >
              <ConversationPairView
                interaction={interaction}
                responseRef={index === chatSession.interactions.length - 1 ? responseRef : null}
                handleManualFunctionCall={onManualFunctionCall}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatThread;