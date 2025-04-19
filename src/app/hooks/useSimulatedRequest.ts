import { useCallback } from "react";
import { useConversation } from "../context/conversationContext";
import { useSimulatedChat } from "./useSimulateChat";
import { BotMessagePart } from "../../interfaces";
import { BotMessagePartType } from "../../interfaces";
import { useSaveInteraction } from "./useSaveInteraction";

export function useSimulatedRequest() {
  const {
    setInputDisabled,
    setIsRunning,
    updateLastInteractionBotParts,
  } = useConversation();

  const { saveInteraction } = useSaveInteraction();
  const { sendSimulatedMessage } = useSimulatedChat();

  const sendSimulatedRequest = useCallback(
    async (
      userText: string,
      type: BotMessagePartType,
      assistantResponse: string,
      showUser: boolean = true
    ) => {
      if (!userText.trim() || !assistantResponse.trim()) return;

      // 1️⃣ UI: disable input + show loading
      setInputDisabled(true);
      setIsRunning(true);

      // 2️⃣ Simulate stream
      const interactionId = await sendSimulatedMessage(userText, assistantResponse, showUser);

      // 3️⃣ Re-enable UI
      setInputDisabled(false);
      setIsRunning(false);

      // 4️⃣ Add extra part
      const extraPart: BotMessagePart = {
        type,
        data: [],
        sidebar: true,
      };
      updateLastInteractionBotParts([extraPart], interactionId);

      // 5️⃣ Wait 100ms before saving
      setTimeout(() => {
        saveInteraction();
      }, 100);
    },
    [
      sendSimulatedMessage,
      updateLastInteractionBotParts,
      setInputDisabled,
      setIsRunning,
      saveInteraction,
    ]
  );

  return { sendSimulatedRequest };
}


// export function useSimulatedRequest() {
//   const { updateLastInteractionBotParts } = useConversation();
//   const { sendSimulatedMessage } = useSimulatedChat();

//   const sendSimulatedRequest = useCallback(
//     async (
//       userText: string,
//       type: BotMessagePartType,
//       assistantResponse: string,
//       showUser: boolean = true
//     ) => {

//       const interactionId = await sendSimulatedMessage(userText, assistantResponse, showUser);
//       // ⏳ Wait until stream is finished before appending the browser
//       const knowledgePart: BotMessagePart = {
//         type: type,
//         data: [],
//         sidebar: true,
//       };

//       updateLastInteractionBotParts([knowledgePart], interactionId);
//     },
//     [sendSimulatedMessage, updateLastInteractionBotParts]
//   );

//   return {  sendSimulatedRequest };
// }
