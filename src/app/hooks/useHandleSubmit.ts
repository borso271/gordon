import { FormEvent } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import { useConversation } from "../context/conversationContext";
import { useStreamHandlers } from "./useStreamHandlers";
import { sendMessage } from "../utils/apiActions";
import { useRef } from "react";

export function useHandleSubmit() {
  
  const {
    addUserMessage,
    userInput,
    setUserInput,
    setInputDisabled,
    setIsRunning,
    threadId,
  } = useConversation();

  const { attachHandlers } = useStreamHandlers();

  // 🚫 Prevent multiple submits
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (
    e?: FormEvent | MouseEvent | null,
    customQuery?: string,
    overrideThreadId?: string
  ) => {
    if (e && "preventDefault" in e) e.preventDefault();

    if (isSubmittingRef.current) return; // 🚫 Already submitting
    isSubmittingRef.current = true;

    const inputToSend = customQuery ?? userInput;
    const finalThreadId = overrideThreadId ?? threadId;

    if (!inputToSend.trim() || !finalThreadId) {
      isSubmittingRef.current = false; // reset flag
      return;
    }

    setInputDisabled(true);
    setIsRunning(true);
    addUserMessage(inputToSend);
    setUserInput("");

    try {
      const response = await sendMessage(finalThreadId, inputToSend);
      const stream = AssistantStream.fromReadableStream(response.body);
      attachHandlers(stream, finalThreadId);
    } finally {
      // ✅ Reset flag after processing
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}