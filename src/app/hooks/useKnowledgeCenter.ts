import { useCallback } from "react";
import { useConversation } from "../context/conversationContext";
import { useSimulatedChat } from "./useSimulateChat";
import { BotMessagePart } from "../../interfaces";

export function useKnowledgeCenter() {
  const { updateLastInteractionBotParts } = useConversation();
  const { sendSimulatedMessage } = useSimulatedChat();

  const openKnowledgeBrowser = useCallback((interactionId?: string) => {
    const knowledgePart: BotMessagePart = {
      type: "knowledge_browser",
      data: [],
      sidebar: true,
    };

    updateLastInteractionBotParts([knowledgePart], interactionId);
  }, [updateLastInteractionBotParts]);

  const sendKnowledgeMessage = useCallback(
    async (
      userText: string,
      assistantResponse: string,
      showUser: boolean = true
    ) => {
      const interactionId = await sendSimulatedMessage(userText, assistantResponse, showUser);
      
      // ⏳ Wait until stream is finished before appending the browser
      const knowledgePart: BotMessagePart = {
        type: "knowledge_browser",
        data: [],
        sidebar: true,
      };

      updateLastInteractionBotParts([knowledgePart], interactionId);
    },
    [sendSimulatedMessage, updateLastInteractionBotParts]
  );

  return { openKnowledgeBrowser, sendKnowledgeMessage };
}
