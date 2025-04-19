
import { useCallback } from "react";
import { useConversation } from "../context/conversationContext";
import { useOverlay } from "../context/overlayContext";


export function useSessionCallback() {
    const { startNewChatSession, resetConversationState } = useConversation();
    const { setOverlay } = useOverlay();
  
    const withNewSession = useCallback(
      async (
        fn: (sessionId: string) => void,
        delayMs: number = 0,
        showOverlay: boolean = false
      ) => {
        resetConversationState();
        if (showOverlay) {
          setTimeout(() => setOverlay("chat"), 200);
        }
        const newSession = await startNewChatSession();
        if (delayMs > 0) {
          setTimeout(() => fn(newSession.id), delayMs);
        } else {
          fn(newSession.id);
        }
      },
      [startNewChatSession, resetConversationState, setOverlay]
    );
  
    const createSession = useCallback(
      async ({
        delay = 0,
        showOverlay = false,
      }: { delay?: number; showOverlay?: boolean } = {}) => {
        resetConversationState();
        if (showOverlay) {
          setTimeout(() => setOverlay("chat"), 200);
        }
        const newSession = await startNewChatSession();
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        return newSession.id;
      },
      [startNewChatSession, resetConversationState, setOverlay]
    );
  
    return { withNewSession, createSession };
  }
  

// export function useSessionCallback() {
//   const { startNewChatSession } = useConversation();

//   const withNewSession = useCallback(
//     async (
//       fn: (sessionId: string) => void,
//       delayMs: number = 0
//     ) => {
//       const newSession = await startNewChatSession();

//       if (delayMs > 0) {
//         setTimeout(() => {
//           fn(newSession.id);
//         }, delayMs);
//       } else {
//         fn(newSession.id);
//       }
//     },
//     [startNewChatSession]
//   );

//   return { withNewSession };
// }