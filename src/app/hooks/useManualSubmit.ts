import { useHandleSubmit } from "./useHandleSubmit";
import { useOverlay } from "../context/overlayContext";
import { useConversation } from "../context/conversationContext";

export function useManualSubmit() {
    const { handleSubmit } = useHandleSubmit();
    const { setOverlay } = useOverlay();
   // const { startNewChatSession, resetConversationState } = useConversation();
  
    const submitQuery = async (
      query: string,
      addMessage: boolean = true,
      threadId?: string
    ) => {
      if (!query.trim()) return;
  
      try {
        // 1️⃣ Reset conversation
     //   resetConversationState();
  
        // 2️⃣ Open overlay with delay (after reset)
     
  
        // 3️⃣ If no threadId is provided, start a new session
       
        // 4️⃣ Submit the query
        await handleSubmit(null, query, threadId,addMessage);
      } catch (err) {
        console.error("Manual submit failed:", err);
      }
    };
  
    return { submitQuery };
  }
  

