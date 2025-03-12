import { useState, useCallback } from "react";
import { ConversationPair } from "../../../app/interfaces";

export function useConversation(initialPairs: ConversationPair[] = []) {
  const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>(initialPairs);

  const addUserMessage = useCallback((message: string) => {
    setConversationPairs((prev) => [...prev, { user: message, assistant: "" }]);
  }, []);

  const appendAssistantText = useCallback((text: string) => {
    setConversationPairs((prev) => {
      const last = { ...prev[prev.length - 1] };
      last.assistant = (last.assistant || "") + text;
      return [...prev.slice(0, -1), last];
    });
  }, []);

  const updateLastPair = useCallback((update: Partial<ConversationPair>) => {
    setConversationPairs((prev) => {
      const last = { ...prev[prev.length - 1], ...update };
      return [...prev.slice(0, -1), last];
    });
  }, []);

  return { conversationPairs, addUserMessage, appendAssistantText, updateLastPair, setConversationPairs };
}
