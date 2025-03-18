/* use this to define and use important states like what conversationsPairs is visible */

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID generator
import { ConversationPair } from "../interfaces";

// Define the shape of our context
interface ConversationContextType {
  conversationPairs: ConversationPair[];
  activeConversationPair: ConversationPair | null;
  currentIndex: number;
  setConversationPairs: React.Dispatch<React.SetStateAction<ConversationPair[]>>;
  setActiveConversationPair: React.Dispatch<React.SetStateAction<ConversationPair | null>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  addUserMessage: (message: string) => void;
  appendAssistantText: (text: string) => void;
  updateLastPair: (update: Partial<ConversationPair>) => void;
  areNavigationItemsVisible: boolean;
  setAreNavigationItemsVisible: (visible: boolean) => void;
  isMobileNavigationVisible: boolean;
  setIsMobileNavigationVisible: (visible: boolean) => void;
}

// Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Context Provider Component
export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [activeConversationPair, setActiveConversationPair] = useState<ConversationPair | null>(null);
  const [areNavigationItemsVisible, setAreNavigationItemsVisible] = useState<boolean>(false); // ✅ New state
  const [isMobileNavigationVisible, setIsMobileNavigationVisible] = useState<boolean>(false); // ✅ New state

  // ✅ Generate a new conversation pair with a UUID
  const addUserMessage = useCallback((message: string) => {
    const newPair: ConversationPair = {
      id: uuidv4(), // ✅ Assign a unique id
      user: message,
      assistant: "",
    };
  
    setConversationPairs((prev) => {
      const updatedPairs = [...prev, newPair];
      setCurrentIndex(updatedPairs.length - 1); // ✅ Set index to the latest message
      return updatedPairs;
    });
  }, []);
  
  // const addUserMessage = useCallback((message: string) => {
  //   const newPair: ConversationPair = {
  //     id: uuidv4(), // ✅ Assign a unique id
  //     user: message,
  //     assistant: "",
  //   };

  //   setConversationPairs((prev) => [...prev, newPair]);
  //   setCurrentIndex((prev) => prev + 1);
  // }, []);

  // ✅ Ensure updates apply to the correct conversation by matching `id`

  const appendAssistantText = useCallback((text: string) => {
    setConversationPairs((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((pair, index) =>
        index === prev.length - 1
          ? { ...pair, assistant: (pair.assistant || "") + text }
          : pair
      );
    });
  }, []);

  // ✅ Update the last conversation pair safely
  const updateLastPair = useCallback((update: Partial<ConversationPair>) => {
    setConversationPairs((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((pair, index) =>
        index === prev.length - 1 ? { ...pair, ...update } : pair
      );
    });
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        conversationPairs,
        activeConversationPair,
        currentIndex,
        areNavigationItemsVisible,
        isMobileNavigationVisible,
        setConversationPairs,
        setActiveConversationPair,
        setCurrentIndex,
        addUserMessage,
        appendAssistantText,
        updateLastPair,
        setAreNavigationItemsVisible,
        setIsMobileNavigationVisible
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
