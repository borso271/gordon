/* use this to define and use important states like what conversationsPairs is visible */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { ConversationPair, Message, Interaction, ChatSession, BotMessagePart } from "../../interfaces";
import { useLanguage } from "../hooks/useLanguage";

// Define the shape of our context
interface ConversationContextType {
 
  chatSession: ChatSession;
  setChatSession: React.Dispatch<React.SetStateAction<ChatSession>>;
  conversationPairs: ConversationPair[];
  activeConversationPair: ConversationPair | null;
  currentIndex: number;
  setConversationPairs: React.Dispatch<React.SetStateAction<ConversationPair[]>>;
  
  setActiveConversationPair: React.Dispatch<React.SetStateAction<ConversationPair | null>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
 updateLastInteractionBotPart: (newPart: BotMessagePart) => void

  addUserMessage: (message: string) => void;

  appendAssistantText: (text: string) => void;

  // updateLastPair: (update: Partial<ConversationPair>) => void;

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
export const ConversationProvider: React.FC<{ children: ReactNode, forceNewSession:boolean }> = ({ children,forceNewSession = false  }) => {


  const [activeConversationPair, setActiveConversationPair] = useState<ConversationPair | null>(null);
  const [areNavigationItemsVisible, setAreNavigationItemsVisible] = useState<boolean>(false);
  const [isMobileNavigationVisible, setIsMobileNavigationVisible] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>("");
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const {currentLang} = useLanguage();

  const LOCAL_STORAGE_KEY = "chatSession";
  const LOCAL_STORAGE_MESSAGES_KEY = "messages";
  const LOCAL_STORAGE_INDEX_KEY = "currentIndex";

// ✅ Load initial value from localStorage
const [currentIndex, setCurrentIndex] = useState<number>(() => {
  const storedIndex = localStorage.getItem(LOCAL_STORAGE_INDEX_KEY);
  // console.log("Loading stored currentIndex:", storedIndex);
  return storedIndex !== null ? JSON.parse(storedIndex) : -1;
});

useEffect(() => {
  // console.log("Updating localStorage with new currentIndex:", currentIndex);
  localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(currentIndex));
}, [currentIndex]);

const [messages, setMessages] = useState<Message[]>(() => {
  const storedMessages = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
  return storedMessages ? JSON.parse(storedMessages) : [];
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
  // const addUserMessage2 = useCallback((message: string) => {
  //   console.log("CURRENT LANG AT THIS POINT IS: ", currentLang)

  //   const newPair: ConversationPair = {
  //     id: uuidv4(),
  //     user: message,
  //     assistant: "",
  //     language: currentLang
  //   };

  //   setConversationPairs((prev) => {
  //     const updatedPairs = [...prev, newPair];
  //     setCurrentIndex(updatedPairs.length - 1);
  //     return updatedPairs;
  //   });
  // });
    


  const [chatSession, setChatSession] = useState<ChatSession>(() => {
    console.log('Initializing chat session state...'); // For debugging



    // 1. Try to load from localStorage
    const storedSessionJson = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedSessionJson && !forceNewSession) {
      try {
        const storedSession: ChatSession = JSON.parse(storedSessionJson);

        // 2. Basic Validation (Optional but recommended)
        //    Ensure the loaded data has the essential structure.
        if (
          storedSession &&
          typeof storedSession.id === 'string' &&
          typeof storedSession.title === 'string' &&
          Array.isArray(storedSession.interactions) &&
          typeof storedSession.createdAt === 'string' && // Check types match
          typeof storedSession.updatedAt === 'string'
        ) {
           // You could add more specific validation for interaction structure if needed
          console.log(`Loaded chat session "${storedSession.title}" (${storedSession.id}) from localStorage.`);
          return storedSession; // Return the valid, loaded session
        } else {
          // Data structure is wrong, discard it
          console.warn('Stored chat session data has invalid structure. Discarding.');
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clean up bad data
        }
      } catch (error) {
        console.error('Error parsing chat session from localStorage:', error);
        // If parsing fails, remove the corrupted item
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    // 3. If load failed or no data, create a new default session
    console.log('No valid session in localStorage. Creating a new chat session.');
    const newSession: ChatSession = {
      id: uuidv4(),
      title: "New Chat",
      interactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newSession;
  });

  // 4. Persist changes back to localStorage whenever chatSession updates
  useEffect(() => {
    // console.log(`Saving chat session "${chatSession.title}" (${chatSession.id}) to localStorage.`);
    // Update the timestamp whenever we save
    const sessionToSave = {
        ...chatSession,
        updatedAt: new Date().toISOString() // Keep updatedAt fresh on save
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionToSave));
  }, [chatSession]); // Dependency array ensures this runs when chatSession changes


  const addUserMessage = useCallback((message: string) => {
    const newInteraction: Interaction = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      language: currentLang,
      userMessage: {
        id: uuidv4(),
        role: "user",
        text: message,
        language: currentLang,
        metadata: {},
        createdAt: new Date().toISOString(),
      },
      botMessage: {
        id: uuidv4(),
        role: "assistant",
        language: currentLang,
        parts: [
          { type: "assistantText", content: "" } // For streaming updates
        ],
        metadata: {},
        createdAt: new Date().toISOString(),
      },
    };
  
    setChatSession((prevSession) => {
      const updatedInteractions = [...prevSession.interactions, newInteraction];
      return {
        ...prevSession,
        interactions: updatedInteractions,
        updatedAt: new Date().toISOString(),
      };
    });
  
    // If you track the current interaction index or similar:
    setCurrentIndex((prev) => prev + 1);
  }, [currentLang]);
  
  const appendAssistantText = useCallback((text: string) => {
    setChatSession((prevSession) => {
      const lastIndex = prevSession.interactions.length - 1;
      if (lastIndex < 0) return prevSession;
  
      const lastInteraction = prevSession.interactions[lastIndex];
      const bot = lastInteraction.botMessage;
  
      const newParts = bot.parts.map((part, i) =>
        i === 0 && part.type === "assistantText"
          ? { ...part, content: part.content + text }
          : part
      );
  
      const updatedInteraction = {
        ...lastInteraction,
        botMessage: {
          ...bot,
          parts: newParts,
        },
      };
  
      return {
        ...prevSession,
        interactions: [
          ...prevSession.interactions.slice(0, lastIndex),
          updatedInteraction,
        ],
      };
    });
  }, []);
  
    // const appendAssistantText = useCallback((text: string) => {
    //   setChatSession((prevSession) => {
    //     if (prevSession.interactions.length === 0) return prevSession;
    
    //     return {
    //       ...prevSession,
    //       interactions: prevSession.interactions.map((interaction, index) => {
    //         if (index !== prevSession.interactions.length - 1) return interaction;
  
    //         const bot = interaction.botMessage;
    //         const newParts = bot.parts.map((part, i) =>
    //           i === 0 && part.type === "assistantText"
    //             ? { ...part, content: part.content + text }
    //             : part
    //         );
    
    //         return {
    //           ...interaction,
    //           botMessage: {
    //             ...bot,
    //             parts: newParts,
    //           },
    //         };
    //       }),
    //     };
    //   });
    // }, []);


  // const updateLastMessage = useCallback((update: Partial<Message>) => {
  //   setMessages((prev) => {
  //     if (prev.length === 0) return prev;
  //     return prev.map((message, index) =>
  //       index === prev.length - 1 ? { ...message, ...update } : message
  //     );
  //   });
  // }, []);


  const updateLastInteractionBotPart = useCallback((newPart: BotMessagePart) => {
    setChatSession((prevSession) => {
      const interactions = [...prevSession.interactions];
      if (interactions.length === 0) return prevSession;

      const lastIndex = interactions.length - 1;
      const lastInteraction = interactions[lastIndex];

      const updatedParts = [...lastInteraction.botMessage.parts, newPart];

      const updatedInteraction: Interaction = {
        ...lastInteraction,
        botMessage: {
          ...lastInteraction.botMessage,
          parts: updatedParts,
        },
      };

      interactions[lastIndex] = updatedInteraction;

      return {
        ...prevSession,
        interactions,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setChatSession]);




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
        chatSession,
        setChatSession,
        setThreadId,
        setConversationPairs,
        setActiveConversationPair,
        setCurrentIndex,
        addUserMessage,
        appendAssistantText,
        updateLastInteractionBotPart,
        // updateLastMessage,
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
