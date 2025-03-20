"use client";
import React, { useState, useEffect, useRef ,FormEvent} from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import ChatInput from './components/ChatInput';

import { sendMessage } from "./utils/apiActions";
import ConversationPairView from "./components/ConversationPairView";
import { useSlideshowNavigation } from "../../app/hooks/useSlideShowNavigation";

import { useManualFunctionCall } from "../../app/hooks/useHandleManualFunctionCall";

import { useThread } from "../../app/hooks/useThread";
import { useConversation } from "../../app/context/conversationContext";
import { useStreamHandlers } from "../../app/hooks/useStreamHandlers";
import DropdownButton from "../Buttons/DropdownButton";
import useSmoothScrollToBottom from "../../app/hooks/useSmoothScrollToBottom";
import { useHandleSubmit } from "../../app/hooks/useHandleSubmit";


import { functionCallHandler } from "../../app/utils/functionCallHandler";

import { useFunctionExecution } from "../../app/context/functionExecutionContext";



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


  console.log("CONVERSATION PAIRS ARE: ", conversationPairs)

  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    responseRef,
    direction,
    isAtBottom,
    isAwayFromBottom
   
  } = useSlideshowNavigation(
    currentIndex,
    setCurrentIndex,
    conversationPairs.length
  );

  console.log("IS AT BOTTOM IS: ", isAtBottom)

   const {handleSubmit, attachHandlers} = useHandleSubmit();

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


