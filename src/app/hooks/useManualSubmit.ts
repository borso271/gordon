import { useHandleSubmit } from "./useHandleSubmit";
import { useOverlay } from "../context/overlayContext";
import { useConversation } from "../context/conversationContext";

export function useManualSubmit() {
  const { handleSubmit } = useHandleSubmit();
  const { setOverlay } = useOverlay();
  const { startNewChatSession } = useConversation();

  const submitQuery = async (query: string, addMessage: boolean = true) => {
    if (!query.trim()) return;

    try {
      // 1️⃣ Show the overlay
      setOverlay("chat");

      // 2️⃣ Start a new chat session
      const newSession = await startNewChatSession();

      // 3️⃣ Submit the query with control over message logging
      await handleSubmit(null, query, newSession.id, addMessage);
    } catch (err) {
      console.error("Manual submit failed:", err);
    }
  };

  return { submitQuery };
}


