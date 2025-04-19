import { useCallback } from "react";
import { useConversation } from "../context/conversationContext";
import { BotMessagePart } from "../../interfaces";

export function useKnowledgeCenter() {
  const { updateLastInteractionBotParts } = useConversation();

  const openKnowledgeBrowser = useCallback((interactionId?: string) => {
    const knowledgePart: BotMessagePart = {
      type: "knowledge_browser",
      data: [],
      sidebar: true,
    };

    updateLastInteractionBotParts([knowledgePart], interactionId);
  }, [updateLastInteractionBotParts]);

  return { openKnowledgeBrowser };
}
