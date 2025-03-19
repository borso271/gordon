"use client";
import React, { useState, useEffect, useRef ,FormEvent} from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import ChatInput from './components/ChatInput';
import { attachStreamHandlers } from "./utils/streamHandlers";
import { sendMessage } from "./utils/apiActions";
import ConversationPairView from "./components/ConversationPairView";
import { useSlideshowNavigation } from "../../app/hooks/useSlideShowNavigation";
import { useManualFunctionCall } from "./hooks/useHandleManualFunctionCall";
import { useThread } from "./hooks/useThread";
import { useConversation } from "../../app/context/conversationContext";
import { useStreamHandlers } from "./hooks/useStreamHandlers";
import DropdownButton from "../Buttons/DropdownButton";
import useSmoothScrollToBottom from "../../app/hooks/useSmoothScrollToBottom";

interface ChatProps {
  functionCallHandler?: (toolCall: any) => Promise<string>;
}


export default function BotChat({ functionCallHandler = () => Promise.resolve("") }: ChatProps) {
  // Custom hook for thread management
  const { threadId, initThread } = useThread();
  const { handleManualFunctionCall } = useManualFunctionCall(); // ✅ Get function from hook
   

  const {
    conversationPairs,
    addUserMessage,
    currentIndex,
    setCurrentIndex
  } = useConversation();

  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    handleWheel,
    responseRef,
    direction,
    isAtBottom,
   
  } = useSlideshowNavigation(
    currentIndex,
    setCurrentIndex,
    conversationPairs.length
  );




  // const smoothScrollToBottom = useSmoothScrollToBottom(responseRef);

  // const scrollDownManually = () => {
  //   setCurrentIndex(conversationPairs.length - 1);
  
  //   setTimeout(() => {
  //     smoothScrollToBottom();
  //   }, 50);
  // };
  const scrollDownManually = () => {
    // 1) Jump to last conversation pair in state
    setCurrentIndex(conversationPairs.length - 1);
  
    // 2) Wait a brief moment for React to start rendering that last pair
    setTimeout(() => {
      const el = responseRef.current;
      if (!el) return;
  
      // We'll check the height every 100 ms
      let stableCount = 0;
      let lastHeight = el.scrollHeight;
      const checkInterval = setInterval(() => {
        // If the element disappeared, stop
        if (!el) {
          clearInterval(checkInterval);
          return;
        }
        // If scrollHeight changed, reset stability count
        if (el.scrollHeight !== lastHeight) {
          stableCount = 0;
          lastHeight = el.scrollHeight;
        } else {
          // The height stayed the same => it's stable for this check
          stableCount++;
          // if stable for ~300ms (3×100ms), assume it's fully rendered
          if (stableCount >= 3) {
            clearInterval(checkInterval);
  
            // 3) Now do exactly one smooth scroll
            el.scrollTo({
              top: el.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      }, 50);
    }, 50);
  };
  

  // Ensure thread is initialized
  useEffect(() => {
    initThread();
  }, [initThread]);

  // Custom hook to get stream event handlers
  const { onTextCreated, onTextDelta, onToolCallCreated, onToolCallDelta, onRequiresAction } =
    useStreamHandlers();

  const attachHandlers = (stream: AssistantStream) => {
    attachStreamHandlers(stream, {
      onTextCreated,
      onTextDelta,
      onToolCallCreated,
      onToolCallDelta,
      onRequiresAction: async (event: any) => {
        await onRequiresAction(event, functionCallHandler);
        setInputDisabled(false);
      },
      onRunCompleted: () => setInputDisabled(false),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    addUserMessage(userInput);
  
    setUserInput("");
    setInputDisabled(true);
    const response = await sendMessage(threadId, userInput);
    const stream = AssistantStream.fromReadableStream(response.body);
    attachHandlers(stream);
  };

  const newSearch = async (prompt: string) => {
    if (!prompt.trim()) return;
    addUserMessage(prompt);
    setUserInput("");
    setInputDisabled(true);
    const response = await sendMessage(threadId, prompt);
    const stream = AssistantStream.fromReadableStream(response.body);
    attachHandlers(stream);
  };

  const onManualFunctionCall = async (functionName: string, args: any) => {
    await handleManualFunctionCall(functionName, args, functionCallHandler);
  };


  
  return (
    <div
      className={styles.slideContainer}
      onWheel={handleWheel}
      ref={containerRef}
    >
      {/* Show scrollDown button conditionally */}
      {(currentIndex < conversationPairs.length - 1 ||
        (currentIndex === conversationPairs.length - 1 && !isAtBottom)) && (
        <div className={styles.scrollDownButton}>
          <DropdownButton
            text=""
            rightIcon="arrow_down"
            className="scrollDownButton"
            width={40}
            onClick={() => scrollDownManually()}
          
          />
        </div>
      )}

      <div className={styles.conversationPair}>
        {conversationPairs.length > 0 && (
          <ConversationPairView
            key={currentIndex}
            pair={conversationPairs[currentIndex]}
            direction={direction}
            responseRef={responseRef}
            handleManualFunctionCall={onManualFunctionCall}
            newSearch={newSearch}
          />
        )}
      </div>

      <div className={styles.chatInput}>
      <ChatInput
       isFirstPrompt={conversationPairs.length === 0}
        userInput={userInput}
        setUserInput={setUserInput}
        handleSubmit={handleSubmit}
        inputDisabled={inputDisabled}
        handleManualFunctionCall={onManualFunctionCall}
      />
      </div>
    </div>
  );
}

// export default function BotChat({ functionCallHandler = () => Promise.resolve("") }: ChatProps) {
//   // Custom hook for thread management
//   const { threadId, initThread } = useThread();
//   const { handleManualFunctionCall } = useManualFunctionCall(); // ✅ Get function from hook

//   const {
//     conversationPairs,
//     addUserMessage,
//     currentIndex,
//     setCurrentIndex
//   } = useConversation();

//   const [userInput, setUserInput] = useState("");
//   const [inputDisabled, setInputDisabled] = useState(false);
//   const containerRef = useRef<HTMLDivElement | null>(null);
  
//   const { handleWheel, responseRef, direction } = useSlideshowNavigation(
//     currentIndex,
//     setCurrentIndex,
//     conversationPairs.length
//   );

//   // Ensure thread is initialized
//   useEffect(() => {
//     initThread();
//   }, [initThread]);

//   // Custom hook to get stream event handlers
//   const { onTextCreated, onTextDelta, onToolCallCreated, onToolCallDelta, onRequiresAction } =
//     useStreamHandlers();

//   const attachHandlers = (stream: AssistantStream) => {
//     attachStreamHandlers(stream, {
//       onTextCreated,
//       onTextDelta,
//       onToolCallCreated,
//       onToolCallDelta,
//       onRequiresAction: async (event: any) => {
//         await onRequiresAction(event, functionCallHandler);
//         setInputDisabled(false);
//       },
//       onRunCompleted: () => setInputDisabled(false),
//     });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;
//     addUserMessage(userInput);
  
//     setUserInput("");
//     setInputDisabled(true);
//     const response = await sendMessage(threadId, userInput);
//     const stream = AssistantStream.fromReadableStream(response.body);
//     attachHandlers(stream);
//   };

//   const newSearch = async (prompt: string) => {
//     if (!prompt.trim()) return;
//     addUserMessage(prompt);
//     setUserInput("");
//     setInputDisabled(true);
//     const response = await sendMessage(threadId, prompt);
//     const stream = AssistantStream.fromReadableStream(response.body);
//     attachHandlers(stream);
//   };

//   const onManualFunctionCall = async (functionName: string, args: any) => {
//     await handleManualFunctionCall(functionName, args, functionCallHandler);
//   };
//   return (
//     <div className={styles.slideContainer} onWheel={handleWheel} ref={containerRef}>
//       <div className={styles.scrollDownButton}>
//         {/* This is the ScrollDown Button */}
//          <DropdownButton
//               text=""
//               rightIcon="arrow_down"
//               className="scrollDownButton" 
//               width={40}
//               onClick="uga"
//             />

// </div>
//       <div className={styles.conversationPair}>
//       {conversationPairs.length > 0 && (
//         <ConversationPairView
//           key={currentIndex}
//           pair={conversationPairs[currentIndex]}
//           direction={direction}
//           responseRef={responseRef}
//           handleManualFunctionCall={onManualFunctionCall}
//           newSearch={newSearch}
//         />
//       )} </div>
  
//       <div className={styles.chatInput}>
//       <ChatInput
//         isFirstPrompt={conversationPairs.length === 0}
//         userInput={userInput}
//         setUserInput={setUserInput}
//         handleSubmit={handleSubmit}
//         inputDisabled={inputDisabled}
//         handleManualFunctionCall={onManualFunctionCall}
//       />
//     </div>
//     </div>
//   );
// }