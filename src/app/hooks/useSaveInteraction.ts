// import { Interaction } from "../../interfaces";
'use client'
import { useEffect, useRef } from 'react';
import { useConversation } from "../context/conversationContext";


export function useSaveInteraction() {

  const { interactionRef, chatSession } = useConversation();

  // ✅ This ref will always point to the latest chatSession
  const sessionRef = useRef(chatSession);

  useEffect(() => {
    sessionRef.current = chatSession;
  }, [chatSession]);


  const saveInteraction = async (): Promise<boolean> => {
    const lastInteraction = interactionRef.current;
  
    console.group("useSaveInteraction - saveInteraction");
    console.log("Current chatSession from ref:", sessionRef.current);
  
    const latestSession = sessionRef.current;
    if (!latestSession) {
      console.warn("❌ No active chat session.");
      console.groupEnd();
      return false;
    }
  
    if (!lastInteraction) {
      console.warn("❌ No interactions to save.");
      console.groupEnd();
      return false;
    }
  
    // ✅ Skip saving if already saved
    if (lastInteraction.saved) {
      console.log("⏩ Interaction already saved. Skipping.");
      console.groupEnd();
      return true;
    }
  
    const payload = {
      thread_id: latestSession.id,
      interaction_id: lastInteraction.id,
      language: lastInteraction.language,
      userMessage: lastInteraction.userMessage,
      botMessage: lastInteraction.botMessage,
    };
  
    console.log("Payload to be sent:", payload);
  
    try {
      const response = await fetch('/api/save_interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to save interaction:", errorData.error);
        console.groupEnd();
        return false;
      }
  
      const data = await response.json();
      console.log("✅ Interaction saved successfully:", data);
  
      // ✅ Mark the interaction as saved
      interactionRef.current.saved = true;
  
      // (Optional) relabel logic
      if (lastInteraction.status === "success") {
        const assistantPart = lastInteraction.botMessage?.parts?.find(
          (p): p is { type: 'assistantText'; text: string } => p.type === "assistantText"
        );
  
        if (assistantPart) {
          try {
            const relabelPayload = {
              thread_id: latestSession.id,
              question: lastInteraction.userMessage?.text,
              answer: assistantPart.text,
            };
  
            console.log("Calling relabel route with:", relabelPayload);
  
            const relabelResponse = await fetch("/api/update_conversation_label", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(relabelPayload),
            });
  
            if (!relabelResponse.ok) {
              const relabelErrorData = await relabelResponse.json();
              console.error("❌ Failed to relabel conversation:", relabelErrorData.error);
            } else {
              const relabelData = await relabelResponse.json();
              console.log("✅ Conversation relabeled successfully:", relabelData);
            }
          } catch (err) {
            console.error("❌ Error calling relabel route:", err);
          }
        }
      }
  
      console.groupEnd();
      return true;
  
    } catch (error) {
      console.error("❌ Error saving interaction:", error);
      console.groupEnd();
      return false;
    }
  };
  


  // const saveInteraction = async (): Promise<boolean> => {

  // const lastInteraction = interactionRef.current;
  //   console.group("useSaveInteraction - saveInteraction");
  //   console.log("Current chatSession from ref:", sessionRef.current);

  //   const latestSession = sessionRef.current;
  //   if (!latestSession) {
  //     console.warn("❌ No active chat session.");
  //     console.groupEnd();
  //     return false;
  //   }

  //   //const lastInteraction = latestSession.interactions.at(-1);
  //   console.log("Last interaction:", lastInteraction);
  //   if (!lastInteraction) {
  //     console.warn("❌ No interactions to save.");
  //     console.groupEnd();
  //     return false;
  //   }

  //   const payload = {
  //     thread_id: latestSession.id,
  //     interaction_id: lastInteraction.id,
  //     language: lastInteraction.language,
  //     userMessage: lastInteraction.userMessage,
  //     botMessage: lastInteraction.botMessage,
  //   };

  //   console.log("Payload to be sent:", payload);

  //   try {
  //     const response = await fetch('/api/save_interaction', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //     });

  //     console.log("Response status:", response.status);

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error("❌ Failed to save interaction:", errorData.error);
  //       console.groupEnd();
  //       return false;
  //     }

  //     const data = await response.json();
  //     console.log("✅ Interaction saved successfully:", data);

  //     if (lastInteraction.status === "success") {
  //       // 2. Find the part in `botMessage.parts` with type = "assistantText"
  //       const assistantPart = lastInteraction.botMessage?.parts?.find(
  //           (p): p is { type: 'assistantText'; text: string } => p.type === "assistantText"
  //         );
          
  //     // 3. If found, call our relabel route
  //     if (assistantPart) {
  //       try {
  //         const relabelPayload = {
  //           thread_id: latestSession.id,
  //           question: lastInteraction.userMessage?.text,
  //           answer: assistantPart.text, // or whatever property holds the text
  //         };

  //         console.log("Calling relabel route with:", relabelPayload);

  //         const relabelResponse = await fetch("/api/update_conversation_label", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(relabelPayload),
  //         });

  //         if (!relabelResponse.ok) {
  //           const relabelErrorData = await relabelResponse.json();
  //           console.error(
  //             "❌ Failed to relabel conversation:",
  //             relabelErrorData.error
  //           );
  //         } else {
  //           const relabelData = await relabelResponse.json();
  //           console.log("✅ Conversation relabeled successfully:", relabelData);
  //         }
  //       } catch (err) {
  //         console.error("❌ Error calling relabel route:", err);
  //       }
  //     }
  //   }

  //     console.groupEnd();
  //     return true;

  //   } catch (error) {
  //     console.error("❌ Error saving interaction:", error);
  //     console.groupEnd();
  //     return false;
  //   }
  // };





  return { saveInteraction };
}





// import { useConversation } from "../context/conversationContext";

// export function useSaveInteraction() {
//   const { chatSession } = useConversation();

//   const saveInteraction = async (): Promise<boolean> => {
//     if (!chatSession) {
//       console.warn("❌ No active chat session.");
//       return false;
//     }

//     const lastInteraction = chatSession.interactions.at(-1);
//     if (!lastInteraction) {
//       console.warn("❌ No interactions to save.");
//       return false;
//     }

//     const payload = {
//       thread_id: chatSession.id,
//       interaction_id: lastInteraction.id,
//       language: lastInteraction.language,
//       userMessage: lastInteraction.userMessage,
//       botMessage: lastInteraction.botMessage,
//     };

//     try {
//       const response = await fetch('/api/save_interaction', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("❌ Failed to save interaction:", errorData.error);
//         return false;
//       }

//       console.log("✅ Interaction saved successfully.");
//       return true;
//     } catch (error) {
//       console.error("❌ Error saving interaction:", error);
//       return false;
//     }
//   };

//   return { saveInteraction };
// }

// export function useSaveInteraction() {

//   const saveInteraction = async (interaction: Interaction, threadId: string): Promise<boolean> => {
//     const payload = {
//       thread_id: threadId,
//       interaction_id: interaction.id,
//       language: interaction.language,
//       userMessage: interaction.userMessage,
//       botMessage: interaction.botMessage,
//     };

//     try {
//       const response = await fetch('/api/interactions', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("❌ Failed to save interaction:", errorData.error);
//         return false;
//       }

//       console.log("✅ Interaction saved successfully.");
//       return true;

//     } catch (error) {
//       console.error("❌ Error saving interaction:", error);
//       return false;
//     }
//   };

//   return { saveInteraction };
// }
