"use client";
import React, { useRef, useState, useEffect} from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import ChatInput from './components/ChatInput';
import { sendMessage } from "../../app/utils/apiActions";
import { useSlideshowNavigation } from "../../app/hooks/useSlideShowNavigation";
import { useConversation } from "../../app/context/conversationContext";
import { useHandleSubmit } from "../../app/hooks/useHandleSubmit";
import { scrollDownManually } from "../../app/utils/scrollDownManually";
import { useStreamHandlers } from "../../app/hooks/useStreamHandlers";
import ChatSidebar from "../ChatSidebar";
import ChatThread from "../ChatThread";
import Icon from "../Icons/Icon";

// --- Simple hook to check screen size (copy from previous example or import) ---
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    // Ensure window is defined (for SSR compatibility, though less likely needed here)
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mediaQueryList.matches); // Set initial state

    // Use modern addEventListener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      mediaQueryList.addListener(listener); // Fallback
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener); // Fallback
      }
    };
  }, [query]);
  return matches;
};
// --- End useMediaQuery Hook ---


export default function BotChat() {
  const {
    chatSession,
    currentIndex,
    setCurrentIndex,
    userInput,
    setUserInput,
    inputDisabled,
  } = useConversation();

  // --- State for Drawer ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)'); // Match CSS breakpoint

  // --- Existing Hooks & Refs ---
  const showSidebar = true; // Keep this logic if you sometimes hide the sidebar entirely
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { responseRef, isAwayFromBottom } = useSlideshowNavigation(
    currentIndex,
    setCurrentIndex,
    chatSession.interactions.length
  );
  const { handleSubmit } = useHandleSubmit();
  // const { attachHandlers } = useStreamHandlers(); // Uncomment if needed
  const chatInputRef = useRef<HTMLDivElement>(null);
  // const spacerRef = useRef<HTMLDivElement>(null); // Removing spacer logic as padding handles it now

  // --- Drawer Toggle Handler ---
  const handleDrawerToggle = () => {
    if (isSmallScreen) {
      setIsDrawerOpen(!isDrawerOpen);
    }
    // Add logic here if the button should do something else on large screens
  };

  // --- Scroll Down Handler ---
  const handleManualScrollDown = () => {
    // This might need adjustment depending on whether the drawer is open
    // For now, it scrolls the thread, which is likely correct
    setCurrentIndex(chatSession.interactions.length - 1);
    if(responseRef.current) { // Check if ref is valid before scrolling
       scrollDownManually(responseRef);
    } else if (containerRef.current) { // Fallback scroll container to bottom
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // console.log("chat session is: ", chatSession)
  // --- New Search Handler ---
  const newSearch = async (prompt: string) => {
    if (!prompt.trim()) return;
    // Implement your new search logic
    console.log("New search triggered with:", prompt);
  };

  // --- Dynamic Classes and Styles ---
  const sidebarColumnClasses = [
    styles.sidebarColumn,
    isSmallScreen ? styles.drawer : '',
    isSmallScreen && isDrawerOpen ? styles.drawerOpen : '',
  ].filter(Boolean).join(' ');

  // Calculate dynamic padding for chat column based on drawer state on small screens
  // Match these values (e.g., '50px', '50vh') to your CSS drawer heights
  const chatColumnPaddingBottom = isSmallScreen
    ? isDrawerOpen ? '50vh' // Or match drawer expanded height
    : '50px' // Match drawer collapsed header height
    : '20px'; // Default padding on large screens (match CSS)

  const chatColumnStyles = {
     paddingBottom: chatColumnPaddingBottom,
     // Keep original padding sides/top if needed, or rely on CSS
     paddingLeft: '20px',
     paddingRight: '20px',
     paddingTop: '20px',
  };

  return (
    <div className={styles.mainWrapper}>
      {/* Column 1: Conversation area */}
      {/* Apply dynamic style for padding */}
      <div className={styles.chatColumn} style={chatColumnStyles}>
        <div className={styles.chatThreadWrapper} ref={containerRef}>
          <ChatThread
            currentIndex={currentIndex}
            containerRef={containerRef}
            responseRef={responseRef}
          />
        </div>
        <div className={styles.chatInput} ref={chatInputRef}>
          <ChatInput
            isFirstPrompt={false} // Determine this dynamically if needed
            userInput={userInput}
            setUserInput={setUserInput}
            inputDisabled={inputDisabled}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Column 2: Optional Sidebar / Drawer */}
      {showSidebar && (
        // Apply dynamic classes for sidebar/drawer behavior
        <div className={sidebarColumnClasses}>
          {/* --- Conditionally render Drawer Header on small screens --- */}
          {isSmallScreen && (
            <div className={styles.drawerHeader} onClick={handleDrawerToggle}>
              {/* Replace with your desired title */}
              <span className={styles.drawerTitle}>Insights & Details</span>
              {/* Icon indicates state and toggles */}
              <Icon name={isDrawerOpen ? 'chevron_down' : 'chevron_up'} size={20} />
            </div>
          )}

          {/* --- Sidebar Content Wrapper (for both layouts) --- */}
          <div className={styles.sidebarContentWrapper}>
            {/* Your actual sidebar content goes here */}
            <ChatSidebar />
          </div>
        </div>
      )}
    </div>
  );
}

// export default function BotChat() {
//   const {
//     chatSession,
   
//     currentIndex,
//     setCurrentIndex,
//     userInput,
//     setUserInput,
//     inputDisabled,
 
 
//   } = useConversation();
//   const showSidebar = true;
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const {
//     responseRef,
//     isAwayFromBottom
//   } = useSlideshowNavigation(
//     currentIndex,
//     setCurrentIndex,
//     chatSession.interactions.length
//   );

//   const {handleSubmit} = useHandleSubmit();

//   const {attachHandlers} = useStreamHandlers();

//   const handleManualScrollDown = () => {
//     setCurrentIndex(chatSession.interactions.length - 1);
//     scrollDownManually(responseRef)
//   }
  
//   const newSearch = async (prompt: string) => {
//     if (!prompt.trim()) return;
    
//   };

// const chatInputRef = useRef<HTMLDivElement>(null);
// const spacerRef = useRef<HTMLDivElement>(null);

// useEffect(() => {
//   const updateSpacerHeight = () => {
//     if (chatInputRef.current && spacerRef.current) {
//       const height = chatInputRef.current.offsetHeight;
//       spacerRef.current.style.height = `${height}px`;
//     }
//   };

//   updateSpacerHeight();
//   const resizeObserver = new ResizeObserver(updateSpacerHeight);
//   if (chatInputRef.current) resizeObserver.observe(chatInputRef.current);
//   return () => resizeObserver.disconnect();
// }, []);


// return (
//   <div className={styles.mainWrapper}>
//     {/* Column 1: Conversation area */}
   
//     <div className={styles.chatColumn}>
//   <div className={styles.chatThreadWrapper}>
//     <ChatThread
//       currentIndex={currentIndex}
//       // isAwayFromBottom={isAwayFromBottom}
//       containerRef={containerRef}
//       responseRef={responseRef}
//       // newSearch={newSearch}
//     />
//   </div>

//   <div className={styles.chatInput} ref={chatInputRef}>
//     <ChatInput
//       isFirstPrompt={false}
//       userInput={userInput}
//       setUserInput={setUserInput}
//       inputDisabled={inputDisabled}
//       handleSubmit={handleSubmit}
//     />
//   </div>
// </div>

//     {/* Column 2: Optional Sidebar */}
//     {showSidebar && (
//       <div className={styles.sidebarColumn}>
//         <ChatSidebar />
//       </div>
//     )}
//   </div>
// );
// }
