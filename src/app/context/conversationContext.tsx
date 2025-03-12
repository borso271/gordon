/* use this to define and use important states like what conversationsPairs is visible */

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ConversationPair {
  user: string;
  assistant: string;
  code?: string;
  analysisData?: any;
  suggestionData?: any;
}

// Define the shape of our context
interface ConversationContextType {
  conversationPairs: ConversationPair[];
  activeConversationPair: ConversationPair | null;
  setConversationPairs: React.Dispatch<React.SetStateAction<ConversationPair[]>>;
  setActiveConversationPair: React.Dispatch<React.SetStateAction<ConversationPair | null>>;
  addUserMessage: (message: string) => void;
  appendAssistantText: (text: string) => void;
  updateLastPair: (update: Partial<ConversationPair>) => void;
}

// Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Context Provider Component
export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>([]);
  const [activeConversationPair, setActiveConversationPair] = useState<ConversationPair | null>(null);

  const addUserMessage = useCallback((message: string) => {
    setConversationPairs((prev) => [...prev, { user: message, assistant: "" }]);
  }, []);

  const appendAssistantText = useCallback((text: string) => {
    setConversationPairs((prev) => {
      if (prev.length === 0) return prev;
      const last = { ...prev[prev.length - 1] };
      last.assistant = (last.assistant || "") + text;
      return [...prev.slice(0, -1), last];
    });
  }, []);

  const updateLastPair = useCallback((update: Partial<ConversationPair>) => {
    setConversationPairs((prev) => {
      if (prev.length === 0) return prev;
      const last = { ...prev[prev.length - 1], ...update };
      return [...prev.slice(0, -1), last];
    });
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        conversationPairs,
        activeConversationPair,
        setConversationPairs,
        setActiveConversationPair,
        addUserMessage,
        appendAssistantText,
        updateLastPair,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// Hook to use the ConversationContext
export const useConversation = (): ConversationContextType => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
};
