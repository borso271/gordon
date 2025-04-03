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
        setInputDisabled(false);
      }
    };
  
    return { handleSubmit };
  }
  
// export function useHandleSubmit() {

//     const router = useRouter();
//     const { createThread } = useThread();
//     const {
//       addUserMessage,
//       userInput,
//       setUserInput,
//       setInputDisabled,
//       threadId,
//       setThreadId,
//     } = useConversation();
   
//     const { attachHandlers } = useStreamHandlers();
//     const handleSubmit = async (
//       e?: FormEvent | MouseEvent | null,
//       isLandingPage: boolean = false
//     ) => {
//       if (e && "preventDefault" in e) {
//         e.preventDefault();
//       }
  
//       if (!userInput.trim()) return;
  
//       setInputDisabled(true);
//       addUserMessage(userInput);
//       setUserInput("");
  
//       let finalThreadId = threadId;
  
//       if (isLandingPage) {
//         // ✅ Create thread before navigating
//         if (!finalThreadId) {
//           const createdId = await createThread();
//           finalThreadId = createdId;
//           setThreadId(createdId); // optional, keep this if you use it elsewhere
//         }

//         // ✅ Redirect to /chat with threadId as a query param
//         router.push(`/chat?threadId=${finalThreadId}`);
//       }
      
//       try {
//         const response = await sendMessage(finalThreadId, userInput);
//         const stream = AssistantStream.fromReadableStream(response.body);
//         attachHandlers(stream);
//       } finally {
//         setInputDisabled(false);
//       }
//     };
  
//     return { handleSubmit };
//   }

  



// export function useHandleSubmit() {
//     const router = useRouter();
//     const {createThread} = useThread()
//     const {
//       addUserMessage,
//       userInput,
//       setUserInput,
//       setInputDisabled,
//       threadId,
//     } = useConversation();
  
//     const { attachHandlers } =
//       useStreamHandlers();
  
//     const handleSubmit = async (
//       e?: FormEvent | MouseEvent | null, // ✅ Accepts both form and button events
//       isLandingPage: boolean = false
//     ) => {
     
  
//       // ✅ Only call preventDefault if e exists and it's a FormEvent
//       if (e && "preventDefault" in e) {
//         e.preventDefault();
//       }
  
//       if (!userInput.trim()) {
//         return;
//       }
  
//       if (isLandingPage) {
//         router.push("/chat");
//       }
  
//       addUserMessage(userInput);

//       setUserInput("");
//       setInputDisabled(true);
  
//       try {
//         const response = await sendMessage(threadId, userInput);
//         const stream = AssistantStream.fromReadableStream(response.body);
//         attachHandlers(stream);
//       } finally {
//         setInputDisabled(false);
//       }
//     };
  
//     return { handleSubmit, attachHandlers };
//   }
  
  