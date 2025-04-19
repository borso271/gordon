import { useCallback, useRef, useEffect } from "react";
import { useConversation } from "../context/conversationContext";

/** How fast to stream – chars / ms */

import { BotMessagePart } from "../../interfaces";
const CHAR_INTERVAL = 10;

export function useSimulatedChat() {
  const { addUserMessage, appendAssistantText, updateLastInteractionBotParts } = useConversation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sendSimulatedMessage = useCallback(
    (
      userText: string,
      assistantText: string,
      showUser = true,
      sendSimulatedMessage = false,
      finalParts: BotMessagePart[] = []
    ): Promise<string> => {
      return new Promise((resolve) => {
        if (!userText.trim() || !assistantText.trim()) return;

        const interactionId = addUserMessage(userText, showUser,sendSimulatedMessage);
        let idx = 0;
        let buffer = '';

        timerRef.current = setInterval(() => {
          if (idx < assistantText.length) {
            buffer += assistantText[idx];
            idx++;

            if (buffer.length >= 6 || idx === assistantText.length) {
              appendAssistantText(buffer);
              buffer = '';
            }
          } else {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;

              if (finalParts.length > 0) {
                updateLastInteractionBotParts(finalParts, interactionId);
              }

              resolve(interactionId); // ✅ resolve after stream completes
            }
          }
        }, CHAR_INTERVAL);
      });
    },
    [addUserMessage, appendAssistantText, updateLastInteractionBotParts]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { sendSimulatedMessage };
}
