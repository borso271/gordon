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

    if (isSubmittingRef.current) {
      console.log("is submitting ref!!");
      return}
    isSubmittingRef.current = true;


    console.log("thread is is: ", threadId);
    const inputToSend = customQuery ?? userInput;
    const finalThreadId = overrideThreadId ?? threadId;

    console.log("INPUT TO SEND: ", inputToSend);
    console.log("Final Thread Id: ", finalThreadId)
    if (!inputToSend.trim() || !finalThreadId) {
      console.log("is isSubmittingRef.current = false!");
      isSubmittingRef.current = false;
      return;
    }

    setInputDisabled(true);
    setIsRunning(true);

    if (addMessage) {
      console.log("ADD MESSAGE IS TRUE")
      addUserMessage(inputToSend, true);
    }
    else {
      console.log("ADD MESSAGE IS FALSE")
      addUserMessage(inputToSend, false);
    
    }

    setUserInput("");

    try {
      console.log("SENDING MESSAGE WITH DATA: ", finalThreadId, inputToSend)
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