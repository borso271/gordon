"use client";
import React, { useRef, useEffect} from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import ChatInput from './components/ChatInput';
import { sendMessage } from "../../app/utils/apiActions";
import ConversationPairView from "./components/ConversationPairView";
import { useSlideshowNavigation } from "../../app/hooks/useSlideShowNavigation";
import { useConversation } from "../../app/context/conversationContext";
import DropdownButton from "../Buttons/DropdownButton";
import { useHandleSubmit } from "../../app/hooks/useHandleSubmit";
import { useMobileSlideshowNavigation } from "../../app/hooks/useMobileSlideShowNavigation";
import { useFunctionExecution } from "../../app/context/functionExecutionContext";
import { scrollDownManually } from "../../app/utils/scrollDownManually";
import { useStreamHandlers } from "../../app/hooks/useStreamHandlers";

export default function BotChat() {
  const { onManualFunctionCall } = useFunctionExecution();
  const {
    chatSession,
    addUserMessage,
    currentIndex,
    setCurrentIndex,
    userInput,
    setUserInput,
    inputDisabled,
    setInputDisabled,
    threadId
  } = useConversation();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    responseRef,
    direction,
    isAwayFromBottom
  } = useSlideshowNavigation(
    currentIndex,
    setCurrentIndex,
    chatSession.interactions.length
  );

  const {handleSubmit} = useHandleSubmit();
  const {attachHandlers} = useStreamHandlers();
  const handleManualScrollDown = () => {
    setCurrentIndex(chatSession.interactions.length - 1);
    scrollDownManually(responseRef)
  }
  
  const newSearch = async (prompt: string) => {
    if (!prompt.trim()) return;
    addUserMessage(prompt);
    setUserInput("");
    setInputDisabled(true);
    const response = await sendMessage(threadId, prompt);
    const stream = AssistantStream.fromReadableStream(response.body);
    attachHandlers(stream);
  };

const chatInputRef = useRef<HTMLDivElement>(null);
const spacerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const updateSpacerHeight = () => {
    if (chatInputRef.current && spacerRef.current) {
      const height = chatInputRef.current.offsetHeight;
      spacerRef.current.style.height = `${height}px`;
    }
  };

  updateSpacerHeight();

  const resizeObserver = new ResizeObserver(updateSpacerHeight);
  if (chatInputRef.current) resizeObserver.observe(chatInputRef.current);

  return () => resizeObserver.disconnect();
}, []);

  return (


<div className={styles.slideContainer} ref={containerRef}>
  {/* Scroll button */}
  { (currentIndex < chatSession.interactions.length - 1 ||
  (isAwayFromBottom)) && (
  <div className={styles.scrollDownButton}>
     
     <DropdownButton
        text=""
        rightIcon="arrow_down"
        rightIconSize={20} // Provide a default size for the right icon
        leftIcon={null} // If you don't need a left icon, set it to null
        className="scrollDownButton"
        width={40}
        onClick={() => handleManualScrollDown()}
      />
    </div>
  )}

  {/* Scrollable message area */}
  <div className={styles.conversationList}>
    <div className={styles.conversationPair}>
      {chatSession.interactions.map((interaction, index) => (
        <ConversationPairView
          key={interaction.id || index}
          interaction={interaction}
          direction={direction}
          responseRef={index === currentIndex ? responseRef : null}
          handleManualFunctionCall={onManualFunctionCall}
          newSearch={newSearch}
        />
      ))}
    </div>
  </div>

  {/* Input stays at bottom */}
  <div className={styles.chatInput} ref={chatInputRef}>
    <ChatInput
      isFirstPrompt={false}
      userInput={userInput}
      setUserInput={setUserInput}
      inputDisabled={inputDisabled}
      handleSubmit={handleSubmit}
    />
  </div>
</div>

  );
}








// <div
// className={styles.slideContainer}
// ref={containerRef}>
  
// {/* Show scrollDown button conditionally */}
// { (currentIndex < chatSession.interactions.length - 1 ||
//   (isAwayFromBottom)) && (
//   <div className={styles.scrollDownButton}>

// <DropdownButton
//   text=""
//   rightIcon="arrow_down"
//   rightIconSize={20} // Provide a default size for the right icon
//   leftIcon={null} // If you don't need a left icon, set it to null
//   className="scrollDownButton"
//   width={40}
//   onClick={() => handleManualScrollDown()}
// />
//   </div>
// )}


// <div className={styles.conversationList}>
// <div className={styles.conversationPair}>
// {chatSession.interactions.map((interaction, index) => (
// <ConversationPairView
// key={interaction.id || index}
// interaction={interaction}
// direction={direction}
// // isCurrent={index === currentIndex}
// responseRef={index === currentIndex ? responseRef : null}
// handleManualFunctionCall={onManualFunctionCall}
// newSearch={newSearch}
// />
// ))}
// </div>
// </div>

// <div className={styles.chatInput} ref={chatInputRef}>
// <ChatInput
//   isFirstPrompt={false}
//   userInput={userInput}
//   setUserInput={setUserInput}
//   inputDisabled={inputDisabled}
//   handleSubmit={handleSubmit}
// />
// </div>
// </div>