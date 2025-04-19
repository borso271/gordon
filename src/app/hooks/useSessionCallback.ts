import { useCallback } from "react";
import { useConversation } from "../context/conversationContext";

export function useSessionCallback() {
  const { startNewChatSession } = useConversation();

  /**
   * Accepts a function to run after creating a new session.
   * Optionally delays the execution with a timeout (default: 0ms).
   */
  
  const withNewSession = useCallback(
    async (
      fn: (sessionId: string) => void,
      delayMs: number = 0
    ) => {
      const newSession = await startNewChatSession();

      if (delayMs > 0) {
        setTimeout(() => {
          fn(newSession.id);
        }, delayMs);
      } else {
        fn(newSession.id);
      }
    },
    [startNewChatSession]
  );

  return { withNewSession };
}