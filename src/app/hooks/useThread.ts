import { useEffect } from "react";
import { createThread } from "../../components/Chat/utils/apiActions";
import { useConversation } from "../context/conversationContext";

export function useThread() {
  const { threadId, setThreadId } = useConversation();

  useEffect(() => {
    const initThread = async () => {
      if (!threadId) {
        const data = await createThread();
        setThreadId(data.threadId);
      }
    };

    initThread();
  }, []); // ✅ Runs only once

  return { threadId };
}
