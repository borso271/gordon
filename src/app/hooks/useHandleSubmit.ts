import { FormEvent } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
import { useConversation } from "../context/conversationContext";
import { useStreamHandlers } from "./useStreamHandlers";
import { attachStreamHandlers } from "../../components/Chat/utils/streamHandlers";
import { sendMessage } from "../../components/Chat/utils/apiActions";
import { functionCallHandler } from "../utils/functionCallHandler";
import {useRouter} from "next/navigation"

export function useHandleSubmit() {
    const router = useRouter();
  
    const {
      addUserMessage,
      userInput,
      setUserInput,
      setInputDisabled,
      threadId,
    } = useConversation();
  
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
  
    const handleSubmit = async (
      e?: FormEvent | MouseEvent | null, // ✅ Accepts both form and button events
      isLandingPage: boolean = false
    ) => {
      console.log("HANDLE SUBMIT CALLED");
  
      // ✅ Only call preventDefault if e exists and it's a FormEvent
      if (e && "preventDefault" in e) {
        console.log("PREVENTING DEFAULT");
        e.preventDefault();
      }
  
      if (!userInput.trim()) {
        console.log("EMPTY INPUT, RETURNING");
        return;
      }
  
      if (isLandingPage) {
        console.log("REDIRECTING TO /CHAT");
        router.push("/chat");
     
      }
  
      addUserMessage(userInput);
      setUserInput("");
      setInputDisabled(true);
  
      try {
        const response = await sendMessage(threadId, userInput);
        const stream = AssistantStream.fromReadableStream(response.body);
        attachHandlers(stream);
      } finally {
        setInputDisabled(false);
      }
    };
  
    return { handleSubmit, attachHandlers };
  }
  
  