/* use this to define and use important states like what conversationsPairs is visible */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { ConversationPair } from "../../interfaces";
import { useLanguage } from "../hooks/useLanguage";
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
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  threadId: string;
  setThreadId: React.Dispatch<React.SetStateAction<string>>;
  inputDisabled: boolean;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  resetConversationState: () => void; // ✅ Added function type

}

// Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(undefined);
// Context Provider Component
export const ConversationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [activeConversationPair, setActiveConversationPair] = useState<ConversationPair | null>(null);
  const [areNavigationItemsVisible, setAreNavigationItemsVisible] = useState<boolean>(false);
  const [isMobileNavigationVisible, setIsMobileNavigationVisible] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>("");
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const {currentLang} = useLanguage();
  const LOCAL_STORAGE_KEY = "conversationPairs";
  const LOCAL_STORAGE_INDEX_KEY = "currentIndex";

// ✅ Load initial value from localStorage
const [currentIndex, setCurrentIndex] = useState<number>(() => {
  const storedIndex = localStorage.getItem(LOCAL_STORAGE_INDEX_KEY);
  // console.log("Loading stored currentIndex:", storedIndex);
  return storedIndex !== null ? JSON.parse(storedIndex) : -1;
});

// ✅ Save currentIndex to localStorage whenever it changes
useEffect(() => {
  // console.log("Updating localStorage with new currentIndex:", currentIndex);
  localStorage.setItem(LOCAL_STORAGE_INDEX_KEY, JSON.stringify(currentIndex));
}, [currentIndex]);

const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>(() => {
  const storedPairs = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedPairs ? JSON.parse(storedPairs) : [];
});

  // ✅ Load conversationPairs from localStorage on mount
  useEffect(() => {
    const storedPairs = localStorage.getItem(LOCAL_STORAGE_KEY);
    // console.log("STORED PAIRS ARE: ", storedPairs)
    if (storedPairs) {
      setConversationPairs(JSON.parse(storedPairs));
    }
  }, []);

  // console.log("conversation pairs are: ", conversationPairs)
  // ✅ Save conversationPairs to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(conversationPairs));
  }, [conversationPairs]);

  // ✅ Generate a new conversation pair with a UUID
  const addUserMessage = useCallback((message: string) => {
    const newPair: ConversationPair = {
      id: uuidv4(),
      user: message,
      assistant: "",
      language: currentLang
    };

    setConversationPairs((prev) => {
      const updatedPairs = [...prev, newPair];
      setCurrentIndex(updatedPairs.length - 1);
      return updatedPairs;
    });
  }, []);

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

  const updateLastPair = useCallback((update: Partial<ConversationPair>) => {
    setConversationPairs((prev) => {
      if (prev.length === 0) return prev;
      return prev.map((pair, index) =>
        index === prev.length - 1 ? { ...pair, ...update } : pair
      );
    });
  }, []);


 const resetConversationState = () => {
  // console.log("Resetting conversation state...");

  setConversationPairs([]);
  setCurrentIndex(-1);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([])); // ✅ Reset conversationPairs in localStorage
  localStorage.setItem(LOCAL_STORAGE_INDEX_KEY, JSON.stringify(-1)); // ✅ Reset currentIndex in localStorage
};


  return (
    <ConversationContext.Provider
      value={{
        threadId,
        conversationPairs,
        activeConversationPair,
        currentIndex,
        areNavigationItemsVisible,
        isMobileNavigationVisible,
        userInput,
        inputDisabled,
        setThreadId,
        setConversationPairs,
        setActiveConversationPair,
        setCurrentIndex,
        addUserMessage,
        appendAssistantText,
        updateLastPair,
        setAreNavigationItemsVisible,
        setIsMobileNavigationVisible,
        setUserInput,
        setInputDisabled,
        resetConversationState
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
