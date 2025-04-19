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
  currentIndex: number; // Review if still needed for its original purpose
  responseRef: React.RefObject<HTMLDivElement>; // Review if still needed
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
    // Don't scroll if there are no interactions yet
    if (!containerRef.current || chatSession.interactions.length === 0) {
      return;
    }

    const lastInteraction = chatSession.interactions[chatSession.interactions.length - 1];
    const lastInteractionId = lastInteraction?.id;

    if (!lastInteractionId) {
      console.warn("ChatThread: Last interaction missing ID, cannot scroll new message to top.");
      return;
    }

    // Use timeout to ensure DOM update and ref assignment before scrolling
    const timerId = setTimeout(() => {
      const lastElement = interactionRefs.current[lastInteractionId];
      if (lastElement) {
        // The filler element ensures this reliably scrolls to the top edge
        lastElement.scrollIntoView({
          behavior: 'smooth', // Or 'auto'
          block: 'start',    // Align top of element with top of scroll container
          inline: 'nearest',
        });
        // console.log(`Scrolled new interaction ${lastInteractionId} to top.`);
      } else {
        // console.warn(`ChatThread: Ref for new interaction ${lastInteractionId} not found for scrolling.`);
      }
    }, 0); // Defer execution slightly

    return () => clearTimeout(timerId); // Cleanup timeout on unmount or dependency change

  }, [chatSession.interactions]);


  // --- Intersection Observer for ACTIVE Interaction (Keep as is) ---
  const prevActivatedId = useRef<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      // console.warn("ChatThread: containerRef not available for IntersectionObserver.");
      return;
    };
    const MIN_ACTIVATION_RATIO = 0.1;
    const DEBOUNCE_DELAY_MS = 100;
    let ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        // console.log("--- Observer Callback Fired ---", new Date().toLocaleTimeString());
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-id");
          if (id) {
            ratioMap.set(id, entry.intersectionRatio);
          }
        }
        let bestVisibleId: string | null = null;
        let bestVisibleRatio = 0;
        for (const [id, ratio] of ratioMap.entries()) {
          if (ratio >= MIN_ACTIVATION_RATIO && ratio > bestVisibleRatio) {
            bestVisibleRatio = ratio;
            bestVisibleId = id;
          }
        }
        if (bestVisibleId) {
          if (bestVisibleId !== activeInteraction && bestVisibleId !== prevActivatedId.current) {
            if (debounceTimer.current) {
              clearTimeout(debounceTimer.current);
            }
            debounceTimer.current = setTimeout(() => {
              if (bestVisibleId && bestVisibleId !== activeInteraction) {
                prevActivatedId.current = bestVisibleId;
                setActiveInteraction(bestVisibleId);
              }
            }, DEBOUNCE_DELAY_MS);
          }
        }
      },
      {
        root: containerRef.current, // Observe within the scroll container
        rootMargin: '0px',
        // Trigger when element enters/leaves and crosses thresholds
        threshold: [0, MIN_ACTIVATION_RATIO, 0.95],
      }
    );

    const currentRefs = interactionRefs.current;
    Object.values(currentRefs).forEach((el) => {
      if (el) observer.unobserve(el); // Unobserve previous elements
    });

    // Observe currently rendered interaction elements
    let observedCount = 0;
    chatSession.interactions.forEach(interaction => {
      const id = interaction.id;
      if (id && currentRefs[id]) {
        observer.observe(currentRefs[id]!);
        observedCount++;
      }
    });
    // console.log(`IntersectionObserver observing ${observedCount} elements.`);

    return () => {
      // console.log("IntersectionObserver disconnecting.");
      observer.disconnect();
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };

    // Re-run observer setup if interactions, container, or active state logic changes
  }, [chatSession.interactions, containerRef, activeInteraction, setActiveInteraction]);


  // --- Component Render ---
  return (
    <div className={styles.outerWrapper} >

      {/* Keep Speech Overlay */}
      <div className={styles.speechOverlayContainer}>
        <SpeechOverlay />
      </div>

      {/* --- Keep Scroll Down Button --- */}
      {/* Show button only when the hook determines user isn't at the bottom */}
      {isScrollDownButtonVisible && (
        <div className={styles.scrollDownButton}>
          <CircledIconButton
            onClick={scrollToBottom} // Use function provided by the hook
            iconName={"arrow_down"}
          />
        </div>
      )}

      {/* Scrollable Container with Flexbox */}
      <div className={styles.slideContainer} ref={containerRef} >
        {/* List of Interactions */}
        <div className={styles.conversationList}>
          {chatSession.interactions.map((interaction, index) => (
            <div
              key={interaction.id || index} // Use ID if available, fallback to index
              data-id={interaction.id}      // For IntersectionObserver
              ref={(el) => assignRef(el, interaction.id)} // Assign ref for scrolling/observing
              className={styles.interactionWrapper} // Optional styling class
            >
             
              <ConversationPairView
                interaction={interaction}
                // Review if responseRef is still needed for its original purpose
                responseRef={index === chatSession.interactions.length - 1 ? responseRef : null}
                handleManualFunctionCall={onManualFunctionCall}
              />
                  </div>
         
          ))}
        </div>

        {/* --- Filler Element --- */}
        {/* This pushes content up and enables scrolling new items to the top */}
        <div className={styles.filler} aria-hidden="true"></div>
      </div> {/* End slideContainer */}

    </div> // End outerWrapper
  );
};

export default ChatThread;

// interface ChatThreadProps {
//   currentIndex: number;
//   responseRef: React.RefObject<HTMLDivElement>;
//  }

// const ChatThread: React.FC<ChatThreadProps> = ({
//   currentIndex,
//   responseRef,
// }) => {
//   const { chatSession, activeInteraction, setActiveInteraction } = useConversation();
//   const { onManualFunctionCall } = useFunctionExecution();

//   useEffect(() => {
   
//       scrollToBottom();
   
//   }, []); // ✅ Track only the length

//   const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const containerRef = useRef<HTMLDivElement | null>(null);
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


//   // --- Ref Handling ---
//   // Function to assign refs, ensuring cleanup if IDs/elements change
//   const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
//     if (typeof id === "string") {
//       if (el) {
//         interactionRefs.current[id] = el;
//       } else {
//         // Element is unmounting or ID changed, remove from refs
//         delete interactionRefs.current[id];
//       }
//     }
//   };


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
//       </div>
//     </div>
//   );
// };

// export default ChatThread;













//  const ChatThread: React.FC<ChatThreadProps> = ({
//   currentIndex,
//   responseRef,
// }) => {
//   const { chatSession, activeInteraction, setActiveInteraction } = useConversation();
//   const { onManualFunctionCall } = useFunctionExecution();

//   const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { isVisible, scrollToBottom } = useScrollToBottomButton(containerRef);

//   useInteractionScroll(chatSession.interactions, containerRef); // ✅ use the custom hook here

//   // Intersection observer logic (unchanged)
//   const prevActivatedId = useRef<string | null>(null);
//   const debounceTimer = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const MIN_ACTIVATION_RATIO = 0.1;
//     const DEBOUNCE_DELAY_MS = 100;
//     const ratioMap = new Map<string, number>();

//     const observer = new IntersectionObserver(
//       (entries) => {
//         for (const entry of entries) {
//           const id = entry.target.getAttribute("data-id");
//           if (id) ratioMap.set(id, entry.intersectionRatio);
//         }

//         let bestVisibleId: string | null = null;
//         let bestVisibleRatio = 0;

//         for (const [id, ratio] of ratioMap.entries()) {
//           if (ratio >= MIN_ACTIVATION_RATIO && ratio > bestVisibleRatio) {
//             bestVisibleRatio = ratio;
//             bestVisibleId = id;
//           }
//         }

//         if (bestVisibleId && bestVisibleId !== activeInteraction && bestVisibleId !== prevActivatedId.current) {
//           if (debounceTimer.current) clearTimeout(debounceTimer.current);
//           debounceTimer.current = setTimeout(() => {
//             if (bestVisibleId !== activeInteraction) {
//               prevActivatedId.current = bestVisibleId;
//               setActiveInteraction(bestVisibleId);
//             }
//           }, DEBOUNCE_DELAY_MS);
//         }
//       },
//       { root: containerRef.current, rootMargin: '0px', threshold: [0, MIN_ACTIVATION_RATIO, 0.95] }
//     );

//     const currentRefs = interactionRefs.current;
//     Object.values(currentRefs).forEach(el => el && observer.unobserve(el));
//     chatSession.interactions.forEach(interaction => {
//       const id = interaction.id;
//       if (id && currentRefs[id]) observer.observe(currentRefs[id]!);
//     });

//     return () => {
//       observer.disconnect();
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     };
//   }, [chatSession.interactions, activeInteraction, setActiveInteraction]);

//   const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
//     if (!id) return;
//     if (el) interactionRefs.current[id] = el;
//     else delete interactionRefs.current[id];
//   };

//   return (
//     <div className={styles.outerWrapper}>
//       <div className={styles.speechOverlayContainer}>
//         <SpeechOverlay />
//       </div>

//       {isVisible && (
//         <div className={styles.scrollDownButton}>
//           <CircledIconButton onClick={scrollToBottom} iconName="arrow_down" />
//         </div>
//       )}

//       <div className={styles.slideContainer} ref={containerRef}>
//         <div className={styles.conversationList}>
//           {chatSession.interactions.map((interaction, index) => (
//             <div
//               key={interaction.id}
//               data-id={interaction.id}
//               ref={(el) => assignRef(el, interaction.id)}
//             >
//               <ConversationPairView
//                 interaction={interaction}
//                 responseRef={
//                   index === chatSession.interactions.length - 1 ? responseRef : null
//                 }
//                 handleManualFunctionCall={onManualFunctionCall}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatThread

//  const ChatThread: React.FC<ChatThreadProps> = ({
//   currentIndex,
//   responseRef,
// }) => {
//   const { chatSession, activeInteraction, setActiveInteraction } = useConversation();
//   const { onManualFunctionCall } = useFunctionExecution();

//   const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { isVisible, scrollToBottom } = useScrollToBottomButton(containerRef);

//   useEffect(() => {
//       scrollToBottom();
//   }, []); 

//   const { fillerHeight } = useScrollNewInteractionToTop(chatSession.interactions, containerRef);

//   const prevActivatedId = useRef<string | null>(null);
//   const debounceTimer = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const MIN_ACTIVATION_RATIO = 0.1;
//     const DEBOUNCE_DELAY_MS = 100;
//     const ratioMap = new Map<string, number>();

//     const observer = new IntersectionObserver(
//       (entries) => {
//         for (const entry of entries) {
//           const id = entry.target.getAttribute("data-id");
//           if (id) ratioMap.set(id, entry.intersectionRatio);
//         }

//         let bestVisibleId: string | null = null;
//         let bestVisibleRatio = 0;

//         for (const [id, ratio] of ratioMap.entries()) {
//           if (ratio >= MIN_ACTIVATION_RATIO && ratio > bestVisibleRatio) {
//             bestVisibleRatio = ratio;
//             bestVisibleId = id;
//           }
//         }

//         if (bestVisibleId && bestVisibleId !== activeInteraction && bestVisibleId !== prevActivatedId.current) {
//           if (debounceTimer.current) clearTimeout(debounceTimer.current);
//           debounceTimer.current = setTimeout(() => {
//             if (bestVisibleId !== activeInteraction) {
//               prevActivatedId.current = bestVisibleId;
//               setActiveInteraction(bestVisibleId);
//             }
//           }, DEBOUNCE_DELAY_MS);
//         }
//       },
//       { root: containerRef.current, rootMargin: '0px', threshold: [0, MIN_ACTIVATION_RATIO, 0.95] }
//     );

//     const currentRefs = interactionRefs.current;
//     Object.values(currentRefs).forEach(el => el && observer.unobserve(el));
//     chatSession.interactions.forEach(interaction => {
//       const id = interaction.id;
//       if (id && currentRefs[id]) observer.observe(currentRefs[id]!);
//     });

//     return () => {
//       observer.disconnect();
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     };
//   }, [chatSession.interactions, activeInteraction, setActiveInteraction]);

//   const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
//     if (!id) return;
//     if (el) interactionRefs.current[id] = el;
//     else delete interactionRefs.current[id];
//   };

//   return (
//     <div className={styles.outerWrapper}>
//       <div className={styles.speechOverlayContainer}>
//         <SpeechOverlay />
//       </div>

//       {isVisible && (
//         <div className={styles.scrollDownButton}>
//           <CircledIconButton onClick={scrollToBottom} iconName="arrow_down" />
//         </div>
//       )}

//       <div className={styles.slideContainer} ref={containerRef}>
//         <div className={styles.conversationList}>
//           {chatSession.interactions.map((interaction, index) => (
//             <div
//               key={interaction.id}
//               data-id={interaction.id}
//               ref={(el) => assignRef(el, interaction.id)}
//             >
//               <ConversationPairView
//                 interaction={interaction}
//                 responseRef={
//                   index === chatSession.interactions.length - 1 ? responseRef : null
//                 }
//                 handleManualFunctionCall={onManualFunctionCall}
//               />
//             </div>
//           ))}

//           {/* Dynamically added filler height */}
//           {fillerHeight > 0 && <div style={{ height: fillerHeight }} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatThread;



// const ChatThread: React.FC<ChatThreadProps> = ({
//   currentIndex,
//   responseRef,
// }) => {
//   const { chatSession, activeInteraction, setActiveInteraction } = useConversation();
//   const { onManualFunctionCall } = useFunctionExecution();

//   useEffect(() => {
   
//       scrollToBottom();
   
//   }, []); // ✅ Track only the length

//   // This state will hold “just enough” extra height

//   const [fillerHeight, setFillerHeight] = useState(0);

//   console.log("filler height: ", fillerHeight)
// useLayoutEffect(() => {
//   const container = containerRef.current;
//   if (!container) return;

//   const contentHeight = container.scrollHeight;
//   const containerHeight = container.clientHeight;

//   const gap = containerHeight - contentHeight;
//   setFillerHeight(gap > 0 ? gap : 0);
// }, [chatSession.interactions.length]);


//   // 2) Compute exactly how much “filler” we need so that when we
//   //    scroll the new item to top, there’s enough space _below_ it
//   //    for the streaming to grow into without immediate scrollbar.
//   useLayoutEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // total content height = scrollHeight minus any existing padding/margins
//     const contentHeight = container.scrollHeight;
//     const viewHeight = container.clientHeight;

//     // If content is shorter than the view, we need some filler:
//     const gap = viewHeight - contentHeight;
//     setFillerHeight(gap > 0 ? gap : 0);
//   }, [chatSession.interactions.length]);


//   const interactionRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const containerRef = useRef<HTMLDivElement | null>(null);
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


//   // --- Ref Handling ---
//   // Function to assign refs, ensuring cleanup if IDs/elements change
//   const assignRef = (el: HTMLDivElement | null, id: string | undefined) => {
//     if (typeof id === "string") {
//       if (el) {
//         interactionRefs.current[id] = el;
//       } else {
//         // Element is unmounting or ID changed, remove from refs
//         delete interactionRefs.current[id];
//       }
//     }
//   };

  

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
//       </div>
//     </div>
//   );
// };

// export default ChatThread;