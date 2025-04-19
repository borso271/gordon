// components/ChatThread.tsx

import React, { useEffect,useLayoutEffect,useState, useRef } from "react";
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
  const { chatSession, activeInteraction, setActiveInteraction, isRunning } = useConversation();
  const { onManualFunctionCall } = useFunctionExecution();

  // --- State for calculated filler height ---
  const [fillerHeight, setFillerHeight] = useState(0);

  const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  // --- Ref for the list of conversations ---
  const contentListRef = useRef<HTMLDivElement | null>(null); // Ref for the direct content list

  const { isVisible: isScrollDownButtonVisible, scrollToBottom } = useScrollToBottomButton(containerRef);

  // --- Ref to track previous interactions length ---
  const prevInteractionsLength = useRef(chatSession.interactions.length);

  // --- Initial Scroll To Bottom (Keep if desired) ---
  useEffect(() => {
    const timerId = setTimeout(() => {
       if (containerRef.current) {
           console.log('[Mount] Scrolling to bottom');
           scrollToBottom(); // Provided by useScrollToBottomButton hook
       }
    }, 50);
    return () => clearTimeout(timerId);
  }, [scrollToBottom]); // Dependency needed


  useLayoutEffect(() => {
    const container = containerRef.current;
    const contentList = contentListRef.current;
  
    if (!container || !contentList) return;
  
    const containerHeight = container.clientHeight;
  
    // 👇 Measure the last interaction directly
    const lastInteraction = chatSession.interactions.at(-1);
    const lastElement = lastInteraction ? interactionRefs.current[lastInteraction.id] : null;
  
    if (lastElement) {
      const lastElementHeight = lastElement.offsetHeight;
  
      // ❗ Here's the correct logic: create enough filler space to scroll last message to top
      const requiredFiller = containerHeight - lastElementHeight;
  
      if (requiredFiller !== fillerHeight && requiredFiller > 0) {
        console.log(`[Fill] Setting fillerHeight to ${requiredFiller}`);
        setFillerHeight(requiredFiller-8);
      }
    }
  }, [chatSession.interactions, fillerHeight,isRunning]);
  

  // --- Ref Assignment ---
  const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
    if (typeof id === "string") {
      if (el) { interactionRefs.current[id] = el; }
      else { delete interactionRefs.current[id]; }
    }
  };

  // --- Scroll NEW Interactions to TOP using scrollIntoView ---
  useEffect(() => {
    const currentLength = chatSession.interactions.length;
    const container = containerRef.current;

    // Only run if an item was added
    if (container && currentLength > prevInteractionsLength.current && currentLength > 0) {
      console.log("New interaction detected, attempting scrollIntoView({ block: 'start' }).");

      const lastInteraction = chatSession.interactions[currentLength - 1];
      const lastInteractionId = lastInteraction?.id;

      if (!lastInteractionId) {
        console.warn("Newly added interaction missing ID.");
      } else {
        // Use a timeout to allow fillerHeight state to update and DOM to rerender
        const timerId = setTimeout(() => {
          const lastElement = interactionRefs.current[lastInteractionId];
          if (lastElement) {
             console.log(`Scrolling element ID ${lastInteractionId} into view (block: start).`);
             console.log(`Current filler height applied: ${fillerHeight}px`); // Log filler height at time of scroll

             lastElement.scrollIntoView({
               behavior: 'smooth', // Can change to 'auto' for testing
               block: 'start',     // This relies on the filler (if > 0) or natural overflow
               inline: 'nearest',
             });

          } else {
             console.warn(`Ref for new interaction ${lastInteractionId} not found in time.`);
          }
        }, 50); // Timeout allows state update & rerender before scroll

        // return () => clearTimeout(timerId); // Optional cleanup
      }
    }

    // Update previous length ref *after* the check
    prevInteractionsLength.current = currentLength;

  }, [chatSession.interactions, fillerHeight]); // Add fillerHeight dependency - scroll should happen *after* filler might have changed


  // --- Intersection Observer (Keep as is) ---
   const prevActivatedId = useRef<string | null>(null);
   const debounceTimer = useRef<NodeJS.Timeout | null>(null);
   useEffect(() => {
     // ... (Intersection observer logic remains exactly the same) ...
     if (!containerRef.current) return;
      const MIN_ACTIVATION_RATIO = 0.1; const DEBOUNCE_DELAY_MS = 100; let ratioMap = new Map<string, number>();
      const observer = new IntersectionObserver(/* ... callback ... */ (entries) => { /* ... */ for (const entry of entries) { const id = entry.target.getAttribute("data-id"); if (id) { ratioMap.set(id, entry.intersectionRatio); } } let bestVisibleId: string | null = null; let bestVisibleRatio = 0; for (const [id, ratio] of ratioMap.entries()) { if (ratio >= MIN_ACTIVATION_RATIO && ratio > bestVisibleRatio) { bestVisibleRatio = ratio; bestVisibleId = id; } } if (bestVisibleId) { if (bestVisibleId !== activeInteraction && bestVisibleId !== prevActivatedId.current) { if (debounceTimer.current) { clearTimeout(debounceTimer.current); } debounceTimer.current = setTimeout(() => { if (bestVisibleId && bestVisibleId !== activeInteraction) { prevActivatedId.current = bestVisibleId; setActiveInteraction(bestVisibleId); } }, DEBOUNCE_DELAY_MS); } } }, { root: containerRef.current, rootMargin: '0px', threshold: [0, MIN_ACTIVATION_RATIO, 0.95], });
      const currentRefs = interactionRefs.current; Object.values(currentRefs).forEach((el) => { if (el) observer.unobserve(el); });
      chatSession.interactions.forEach(interaction => { const id = interaction.id; if (id && currentRefs[id]) { observer.observe(currentRefs[id]!); } });
      return () => { observer.disconnect(); if (debounceTimer.current) { clearTimeout(debounceTimer.current); } };
   }, [chatSession.interactions, containerRef, activeInteraction, setActiveInteraction]);


  // --- Component Render ---
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

      {/* Scroll Container - Needs height + overflow */}
      <div className={styles.slideContainer} ref={containerRef} >

        {/* Attach ref to measure content height */}
        <div className={styles.conversationList} ref={contentListRef}>
          {chatSession.interactions.map((interaction, index) => (
            // This div gets the ref for scrollIntoView
            <div
              key={interaction.id || index}
              data-id={interaction.id}
              ref={(el) => assignRef(el, interaction.id)}
              className={styles.interactionWrapper} // 👈 add this
            >
              <ConversationPairView
                interaction={interaction}
                responseRef={index === chatSession.interactions.length - 1 ? responseRef : null}
                handleManualFunctionCall={onManualFunctionCall}
              />
            </div>
          ))}
        </div>

        {/* --- Filler div - Apply calculated height --- */}
        <div
          className={styles.filler}
          style={{
             height: `${fillerHeight}px`,
             minHeight: `${fillerHeight}px`, // Ensure min-height also respects calculated value
             visibility: fillerHeight > 0 ? 'hidden' : 'hidden', // Keep hidden, maybe 'visible' with background for debug
             // background: 'rgba(255,0,0,0.1)', // Optional: for debugging visibility
          }}
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
};

export default ChatThread;


// interface ChatThreadProps {
//   currentIndex: number; 
//   responseRef: React.RefObject<HTMLDivElement>; 
// }

// const ChatThread: React.FC<ChatThreadProps> = ({
//   currentIndex,
//   responseRef,
// }) => {
//   const { chatSession, activeInteraction, setActiveInteraction } = useConversation();
//   const { onManualFunctionCall } = useFunctionExecution();

//   useEffect(() => {
   
//       scrollToBottom();
   
//   }, []); // ✅ Track only the length

//   // const [fillerHeight, setFillerHeight] = useState(0);

//   const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const containerRef = useRef<HTMLDivElement | null>(null);
//  // --- Ref to track the previous number of interactions ---
//  const prevInteractionsLength = useRef(chatSession.interactions.length);

//  // --- Ref Handling Function (Keep as is) ---
//  const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
//    if (typeof id === "string") {
//      if (el) {
//        interactionRefs.current[id] = el;
//      } else {
//        delete interactionRefs.current[id];
//      }
//    }
//  };



//   // --- Scroll NEW Interactions to TOP ---
//   useEffect(() => {
//     const currentLength = chatSession.interactions.length;
//     const container = containerRef.current;

//     // --- CONDITION CHECK ---
//     // Only proceed if:
//     // 1. Container ref is available.
//     // 2. The current length is GREATER than the previous length (item added).
//     // 3. There's at least one interaction.
//     if (container && currentLength > prevInteractionsLength.current && currentLength > 0) {
//       console.log("New interaction detected, scrolling to top."); // Debug log

//       const lastInteraction = chatSession.interactions[currentLength - 1];
//       const lastInteractionId = lastInteraction?.id;

//       if (!lastInteractionId) {
//         console.warn("ChatThread: Newly added interaction missing ID, cannot scroll.");
//         // Still update the length ref below
//       } else {
//         // Use timeout to ensure DOM update and ref assignment before scrolling
//         const timerId = setTimeout(() => {
//           const lastElement = interactionRefs.current[lastInteractionId];
//           if (lastElement) {
//             lastElement.scrollIntoView({
//               behavior: 'smooth', // Or 'auto'
//               block: 'start',
//               inline: 'nearest',
//             });
//              // console.log(`Scrolled new interaction ${lastInteractionId} to top.`);
//           } else {
//              // console.warn(`ChatThread: Ref for new interaction ${lastInteractionId} not found.`);
//           }
//         }, 0); // Defer execution slightly

//         // No need for explicit cleanup for such a short timeout usually
//         // return () => clearTimeout(timerId); // This would clear if dependencies change *before* timeout
//       }
//     } else {
//        // Optional: Log why scroll didn't happen if debugging
//        // if (container && currentLength <= prevInteractionsLength.current) {
//        //   console.log("Interaction change detected, but length did not increase. No scroll.");
//        // }
//     }

//     // --- UPDATE PREVIOUS LENGTH REF ---
//     // Always update the ref to the current length *after* the check,
//     // so it's correct for the *next* render/effect run.
//     prevInteractionsLength.current = currentLength;

//   // --- DEPENDENCIES ---
//   // Still depend on chatSession.interactions because we need the effect
//   // to RUN when it changes, so we can PERFORM the length check.
//   }, [chatSession.interactions]);



//   // For showing "Scroll to bottom" button
//   const { isVisible, scrollToBottom } = useScrollToBottomButton(containerRef);
  
//   // console.log("is visible is: ", isVisible)
//   // Track the previously activated ID to prevent redundant updates
//   const prevActivatedId = useRef<string | null>(null);

//   // Debounce timer ref
//   const debounceTimer = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {

//     if (!containerRef.current) {
//         console.warn("ChatThread: containerRef is not available for IntersectionObserver.");
//         return;
//     };

//     // --- CONFIGURATION ---
//     // Adjust this value based on testing. Higher values mean an item
//     // must be more visible to become "active". 0.6 means 60% visible.
//     const MIN_ACTIVATION_RATIO = 0.1;
//     // Shorter debounce to feel more responsive, but still prevent rapid flicker
//     const DEBOUNCE_DELAY_MS = 100;
//     // --- END CONFIGURATION ---

//     // ratioMap captures the intersectionRatio per block on each observer callback
//     let ratioMap = new Map<string, number>();

//     const observer = new IntersectionObserver(
     
//       (entries) => {
//         console.log("--- Observer Callback Fired ---", new Date().toLocaleTimeString()); // <-- ADD THIS

//         // Record each entry's current ratio
//         for (const entry of entries) {
//           const id = entry.target.getAttribute("data-id");
//           if (id) {
//             // Use entry.intersectionRatio which reflects the *current* visibility
//             ratioMap.set(id, entry.intersectionRatio);
//             // console.log("Ratio Map:", Object.fromEntries(ratioMap)); // <-- Log the calculated ratios
//           }
//         }

//         // Determine which *currently sufficiently visible* ID has the highest ratio
//         let bestVisibleId: string | null = null;
//         let bestVisibleRatio = 0;

//         for (const [id, ratio] of ratioMap.entries()) {
//           // IMPORTANT: Only consider elements meeting the MIN_ACTIVATION_RATIO
//           if (ratio >= MIN_ACTIVATION_RATIO && ratio > bestVisibleRatio) {
//             bestVisibleRatio = ratio;
//             bestVisibleId = id;
//           }
//         }

//         // If we found a sufficiently visible element...
//         if (bestVisibleId) {
          
//           if (bestVisibleId !== activeInteraction && bestVisibleId !== prevActivatedId.current) {

//             // Clear any pending debounce timer for a *different* ID
//             if (debounceTimer.current) {
//               clearTimeout(debounceTimer.current);
//             }

//             // Set a new debounce timer to update the active state
//             debounceTimer.current = setTimeout(() => {
    
//               // Only update if it's still relevant and not already active
//               if (bestVisibleId && bestVisibleId !== activeInteraction) {
                
//                  prevActivatedId.current = bestVisibleId; // Track what *we* last set
//                  setActiveInteraction(bestVisibleId);
//               }
//             }, DEBOUNCE_DELAY_MS);
//           }
//         }
        
//       },
//       {
//         root: containerRef.current,
//         rootMargin: '0px', // No margin
      
//         threshold: [0, MIN_ACTIVATION_RATIO, 0.95], // Fine-tune thresholds
//       }
//     );

//     // Clear previous refs before observing new ones (important on re-renders)
//     const currentRefs = interactionRefs.current;
//     Object.values(currentRefs).forEach((el) => {
//       if (el) observer.unobserve(el);
//     });
//     // interactionRefs.current = {}; // Resetting refs might be needed if IDs change drastically

//     // Observe each current interaction block
//     let observedCount = 0;
//     chatSession.interactions.forEach(interaction => {
//         const id = interaction.id;
//         if (id && currentRefs[id]) {
//             observer.observe(currentRefs[id]!);
//             observedCount++;
//         }
//     });
  
//     // Cleanup function
//     return () => {
//       // console.log("IntersectionObserver disconnecting.");
//       observer.disconnect();
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }
//     };
 
//   }, [chatSession.interactions, containerRef, activeInteraction, setActiveInteraction]);


//   return (
//     <div className={styles.outerWrapper} >

//       <div className={styles.speechOverlayContainer}>
//       <SpeechOverlay/>
//       </div>

//       {isVisible && ( 
//         <div className={styles.scrollDownButton}>

//           <CircledIconButton onClick={scrollToBottom} iconName={"arrow_down"}           
//           />
//         </div>
//      )}

//       <div className={styles.slideContainer} ref={containerRef} >   
//         <div className={styles.conversationList}>
//           {chatSession.interactions.map((interaction, index) => (
//             <div
//               key={interaction.id || index}
//               data-id={interaction.id}
//               // Use the ref assignment function
//               ref={(el) => assignRef(el, interaction.id)}
//             >
//               <ConversationPairView
//                 interaction={interaction}
//                 responseRef={index === chatSession.interactions.length - 1 ? responseRef : null}
//                 handleManualFunctionCall={onManualFunctionCall}
//               />
//             </div>
//           ))}
//         </div>
//          {/* --- Filler div, styled by CSS --- */}
    
//          <div className={styles.filler} aria-hidden="true"></div>

//       </div>
//     </div>
//   );
// };

// export default ChatThread;