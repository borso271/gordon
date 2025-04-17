import { useHandleSubmit } from "./useHandleSubmit";
import { useOverlay } from "../context/overlayContext";
import { useConversation } from "../context/conversationContext";



export function useManualSubmit() {
    const { handleSubmit }     = useHandleSubmit();
    const { setOverlay }       = useOverlay();          // opens the modal
    const { startNewChatSession } = useConversation();  // returns a new session
  
    const submitQuery = async (query: string) => {
      if (!query.trim()) return;
  
      try {
        // 1️⃣ open the chat overlay immediately (UX: user sees it pop up)
        setOverlay("chat");
  
        // 2️⃣ create a fresh session – await so we know its id
        const newSession = await startNewChatSession(); // { id, … }
  
        // 3️⃣ send the message into that session
        await handleSubmit(null, query, newSession.id);
      } catch (err) {
        console.error("Manual submit failed:", err);
        // Optional UX: close overlay or show error banner
      }
    };
  
    return { submitQuery };
  }
  

