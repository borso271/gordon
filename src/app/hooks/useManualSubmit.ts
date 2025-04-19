import { useHandleSubmit } from "./useHandleSubmit";
import { useOverlay } from "../context/overlayContext";
import { useConversation } from "../context/conversationContext";

export function useManualSubmit() {
    const { handleSubmit } = useHandleSubmit();
    const { setOverlay } = useOverlay();
    const { startNewChatSession } = useConversation();
  
    const submitQuery = async (
      query: string,
      addMessage: boolean = true,
      threadId?: string
    ) => {
      if (!query.trim()) return;
  
      try {
        // 1️⃣ Show the overlay
        setOverlay("chat");
  
        // 2️⃣ If no threadId is provided, start a new session
        const sessionId = threadId ?? (await startNewChatSession()).id;
  
        // 3️⃣ Submit the query using the provided or new session ID
        await handleSubmit(null, query, sessionId, addMessage);
      } catch (err) {
        console.error("Manual submit failed:", err);
      }
    };
  
    return { submitQuery };
  }
  

