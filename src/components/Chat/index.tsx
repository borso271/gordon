"use client";
import React, { useState, useEffect, useRef ,FormEvent} from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
// @ts-expect-error - no types for this yet
import ChatInput from './components/ChatInput';
import { attachStreamHandlers } from "./utils/streamHandlers";
import { createThread, sendMessage, submitActionResult } from "./utils/apiActions";
import ConversationPairView from "./components/ConversationPairView";
import { useSlideshowNavigation } from "../../app/hooks/useSlideShowNavigation";
import { handleManualFunctionCall } from "./utils/handleManualFunctionCall";
import { useThread } from "./hooks/useThread";
import { useConversation } from "./hooks/useConversation";
import { useStreamHandlers } from "./hooks/useStreamHandlers";

interface ChatProps {
  functionCallHandler?: (toolCall: any) => Promise<string>;
}
export default function BotChat({ functionCallHandler = () => Promise.resolve("") }: ChatProps) {
  // Custom hook for thread management
  const { threadId, initThread } = useThread();

  // Custom hook for conversation state management
  const { conversationPairs, addUserMessage, appendAssistantText, updateLastPair, setConversationPairs } = useConversation();

  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { handleWheel, responseRef, direction } = useSlideshowNavigation(
    currentIndex,
    setCurrentIndex,
    conversationPairs.length
  );

  // Ensure thread is initialized
  useEffect(() => {
    initThread();
  }, [initThread]);

  // Custom hook to get stream event handlers
  const { onTextCreated, onTextDelta, onToolCallCreated, onToolCallDelta, onRequiresAction } =
    useStreamHandlers({ updateLastPair, appendAssistantText, setConversationPairs });

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
    setCurrentIndex((prev) => prev + 1);
    setUserInput("");
    setInputDisabled(true);
    const response = await sendMessage(threadId, userInput);
    const stream = AssistantStream.fromReadableStream(response.body);
    attachHandlers(stream);
  };

  const newSearch = async (prompt: string) => {
    if (!prompt.trim()) return;
    addUserMessage(prompt);
    setCurrentIndex((prev) => prev + 1);
    setUserInput("");
    setInputDisabled(true);
    const response = await sendMessage(threadId, prompt);
    const stream = AssistantStream.fromReadableStream(response.body);
    attachHandlers(stream);
  };

  const onManualFunctionCall = async (functionName: string, args: any) => {
    await handleManualFunctionCall(functionName, args, setConversationPairs, setCurrentIndex, functionCallHandler);
  };

  return (
    <div className={styles.slideContainer} onWheel={handleWheel} ref={containerRef}>
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
      <ChatInput
        isFirstPrompt={conversationPairs.length === 0}
        userInput={userInput}
        setUserInput={setUserInput}
        handleSubmit={handleSubmit}
        inputDisabled={inputDisabled}
        handleManualFunctionCall={onManualFunctionCall}
      />
    </div>
  );
}