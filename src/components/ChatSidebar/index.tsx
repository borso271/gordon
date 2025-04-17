import React, { useEffect,useMemo, useRef } from "react";
import styles from "./ChatSidebar.module.css";
import { useConversation } from "../../app/context/conversationContext";
import BotMessagePartRenderer from "../ChatThread/ResponsePartRenderer";

const ChatSidebar: React.FC = () => {
  const { chatSession, activeInteraction } = useConversation();
  const lastValidSidebarInteraction = useRef<string | null>(null);

  // console.log("chat session is: ", chatSession, activeInteraction);

  const currentInteraction = useMemo(() => {
    return chatSession.interactions.find((i) => i.id === activeInteraction) || null;
  }, [chatSession.interactions, activeInteraction]);

  // memoized reference to sidebar parts of current interaction
  const currentSidebarParts = useMemo(() => {
    if (!currentInteraction) return [];
    return currentInteraction.botMessage.parts.filter((part) => part.sidebar === true);
  }, [currentInteraction]);

  // only update ref if currentSidebarParts are not empty
  useEffect(() => {
    if (currentInteraction && currentSidebarParts.length > 0) {
      lastValidSidebarInteraction.current = currentInteraction.id;
    }
  }, [currentInteraction, currentSidebarParts]);

  // fallback if current has no sidebar parts
  const fallbackInteraction = useMemo(() => {
    if (currentSidebarParts.length > 0) return null;
    return chatSession.interactions.find(
      (i) => i.id === lastValidSidebarInteraction.current
    ) || null;
  }, [chatSession.interactions, currentSidebarParts]);

  const partsToRender = useMemo(() => {
    if (currentSidebarParts.length > 0) return currentSidebarParts;
    return fallbackInteraction?.botMessage.parts.filter((p) => p.sidebar) ?? [];
  }, [currentSidebarParts, fallbackInteraction]);

  const sidebarLanguage = useMemo(() => {
    return currentSidebarParts.length > 0
      ? currentInteraction?.botMessage.language
      : fallbackInteraction?.botMessage.language;
  }, [currentSidebarParts, currentInteraction, fallbackInteraction]);

  return (
    <div className={styles.sidebarContainer}>
      {/* <h3>{activeInteraction}</h3> */}
      {partsToRender.map((part, index) => (
        <BotMessagePartRenderer key={index} part={part} language={sidebarLanguage} />
      ))}
    </div>
  );
};
export default ChatSidebar
