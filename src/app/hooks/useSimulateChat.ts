import { useCallback, useRef, useEffect } from "react";
import { useConversation } from "../context/conversationContext";

/** How fast to stream – chars / ms */

import { BotMessagePart } from "../../interfaces";

const CHAR_INTERVAL = 15; // example: 15ms between characters


export function useSimulatedChat() {
    const { addUserMessage, appendAssistantText, updateLastInteractionBotParts } = useConversation();
  
    const timerRef = useRef<NodeJS.Timeout | null>(null);
  
    const sendSimulatedMessage = useCallback(
      (
        userText: string,
        assistantText: string,
        showUser = true,
        finalParts: BotMessagePart[] = []
      ): string | undefined => {
        if (!userText.trim() || !assistantText.trim()) return;
  
        // Add user message, returns the interactionId
        console.log("SHOW USER IS: ", showUser)
        const interactionId = addUserMessage(userText, showUser);
  
        let idx = 0;
        timerRef.current = setInterval(() => {
          appendAssistantText(assistantText[idx]);
          idx++;
  
          const isDone = idx >= assistantText.length;
          if (isDone && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
  
            if (finalParts.length > 0) {
              updateLastInteractionBotParts(finalParts, interactionId);
            }
          }
        }, CHAR_INTERVAL);
  
        return interactionId;
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
  