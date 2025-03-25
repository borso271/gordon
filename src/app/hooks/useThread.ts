import { useEffect, useCallback } from "react";
import { createThread as createThreadAPI } from "../utils/apiActions";
import { useConversation } from "../context/conversationContext";

export function useThread() {
  const { threadId, setThreadId } = useConversation();

  // Auto-create a thread once on mount if needed
  useEffect(() => {
    if (!threadId) {
      createThread(); // fire and forget
    }
  }, []); // Only on mount

  // Manual trigger to create a new thread and update state
  const createThread = useCallback(async () => {
    const data = await createThreadAPI();
    setThreadId(data.threadId);
    return data.threadId;
  }, [setThreadId]);

  return { threadId, createThread };
}
