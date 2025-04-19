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

  const isSubmittingRef = useRef(false);

  const handleSubmit = async (
    e?: FormEvent | MouseEvent | null,
    customQuery?: string,
    overrideThreadId?: string,
    addMessage: boolean = true // ✅ New optional parameter
  ) => {
    if (e && "preventDefault" in e) e.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const inputToSend = customQuery ?? userInput;
    const finalThreadId = overrideThreadId ?? threadId;

    if (!inputToSend.trim() || !finalThreadId) {
      isSubmittingRef.current = false;
      return;
    }

    setInputDisabled(true);
    setIsRunning(true);

    if (addMessage) {
      addUserMessage(inputToSend);
    }

    setUserInput("");

    try {
      const response = await sendMessage(finalThreadId, inputToSend);
      const stream = AssistantStream.fromReadableStream(response.body);
      attachHandlers(stream, finalThreadId);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmit };
}


export default useHandleSubmit