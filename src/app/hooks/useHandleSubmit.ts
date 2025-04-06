import { FormEvent } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import { useConversation } from "../context/conversationContext";
import { useStreamHandlers } from "./useStreamHandlers";
import { sendMessage } from "../utils/apiActions";
import { useThread } from "./useThread";
// import { functionCallHandler } from "../utils/functionCallHandler";
import {useRouter} from "next/navigation"

export function useHandleSubmit() {
    const router = useRouter();
    const { createThread } = useThread();
    const {
      addUserMessage,
      userInput,
      setUserInput,
      setInputDisabled,
      setIsRunning,
      threadId,
      setThreadId,
    } = useConversation();
  
    const { attachHandlers } = useStreamHandlers();
  
    const handleSubmit = async (
      e?: FormEvent | MouseEvent | null,
      isLandingPage: boolean = false,
      customQuery?: string
    ) => {
      if (e && "preventDefault" in e) {
        e.preventDefault();
      }
  
      const inputToSend = customQuery ?? userInput;
  
      if (!inputToSend.trim()) return;
  
      setInputDisabled(true);
      setIsRunning(true);
      addUserMessage(userInput);
      setUserInput("");
  
      let finalThreadId = threadId;
  
      if (isLandingPage) {
        if (!finalThreadId) {
          const createdId = await createThread();
          finalThreadId = createdId;
          setThreadId(createdId);
        }
        router.push(`/chat?threadId=${finalThreadId}`);
      }
  
      try {
        const response = await sendMessage(finalThreadId, inputToSend);
        const stream = AssistantStream.fromReadableStream(response.body);
        attachHandlers(stream);
      } finally {
        
      }
    };
  
    return { handleSubmit };
  }
  