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

interface ChatProps {
  functionCallHandler?: (toolCall: any) => Promise<string>;
}
export default function BotChat({ functionCallHandler = () => Promise.resolve("") }: ChatProps) {
  // Custom hook for thread management
  const { threadId, initThread } = useThread();
  const { handleManualFunctionCall } = useManualFunctionCall(); // ✅ Get function from hook

  const {
    conversationPairs,
    activeConversationPair,
    setConversationPairs,
    setActiveConversationPair,
    addUserMessage,
    appendAssistantText,
    updateLastPair,
    currentIndex,
    setCurrentIndex
  } = useConversation();


  console.log("params are: ", conversationPairs, currentIndex)

  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  
  console.log("CONVERSATION PAIRS ARE: ", conversationPairs)
  console.log("current index is: ", currentIndex)
  
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