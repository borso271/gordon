"use client";
import React, { useRef} from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import ChatInput from './components/ChatInput';
import { sendMessage } from "./utils/apiActions";
import ConversationPairView from "./components/ConversationPairView";
import { useSlideshowNavigation } from "../../app/hooks/useSlideShowNavigation";
import { useConversation } from "../../app/context/conversationContext";
import DropdownButton from "../Buttons/DropdownButton";
import { useHandleSubmit } from "../../app/hooks/useHandleSubmit";
import { useMobileSlideshowNavigation } from "../../app/hooks/useMobileSlideShowNavigation";
import { useFunctionExecution } from "../../app/context/functionExecutionContext";
import { scrollDownManually } from "./utils/scrollDownManually";

export default function BotChat() {

  const { onManualFunctionCall } = useFunctionExecution();
  const {
    conversationPairs,
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
    handleWheel,
    responseRef,
    direction,
    isAwayFromBottom
  } = useSlideshowNavigation(
    currentIndex,
    setCurrentIndex,
    conversationPairs.length
  );

  const {
   handleTouchStart,
   handleTouchEnd,
   handleTouchMove
  }
 = useMobileSlideshowNavigation(
  currentIndex,
  setCurrentIndex,
  conversationPairs.length,
  responseRef
 )

  const {handleSubmit, attachHandlers} = useHandleSubmit();

  const handleManualScrollDown = () => {
    setCurrentIndex(conversationPairs.length - 1);
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

  return (
    <div
      className={styles.slideContainer}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      {/* Show scrollDown button conditionally */}
      { (currentIndex < conversationPairs.length - 1 ||
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

<div className={styles.chatSpacer}></div>
      <div className={styles.chatInput}>
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


