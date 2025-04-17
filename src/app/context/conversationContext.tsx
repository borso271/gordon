/* use this to define and use important states like what conversationsPairs is visible */

import React, { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { ConversationPair, Message, Interaction, ChatSession, BotMessagePart } from "../../interfaces";
import { useLanguage } from "../hooks/useLanguage";
import { createThread as createThreadAPI } from "../utils/apiActions";
import { fetchChatSessionFromDB } from "../utils/fetchChatSession";
// Define the shape of our context
interface ConversationContextType {
 
  chatSession: ChatSession;
  setChatSession: React.Dispatch<React.SetStateAction<ChatSession>>;
  conversationPairs: ConversationPair[];
  activeConversationPair: ConversationPair | null;
  currentIndex: number;
  setConversationPairs: React.Dispatch<React.SetStateAction<ConversationPair[]>>;
  
  interactionRef: React.MutableRefObject<Interaction | null>;


  setActiveConversationPair: React.Dispatch<React.SetStateAction<ConversationPair | null>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  updateLastInteractionBotParts: (newParts: BotMessagePart[]) => void;
  addUserMessage: (message: string) => void;
  appendAssistantText: (text: string) => void;

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
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  startNewChatSession: () => Promise<ChatSession>

  activeInteraction: string | null;
setActiveInteraction: (id: string | null) => void;


loadChatSession: (threadId: string) => Promise<void>
}

// Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(undefined);
// Context Provider Component
export const ConversationProvider: React.FC<{ children: ReactNode, forceNewSession:boolean }> = ({ children,forceNewSession = false  }) => {

  const interactionRef = useRef<Interaction | null>(null);

  const [activeConversationPair, setActiveConversationPair] = useState<ConversationPair | null>(null);
  const [areNavigationItemsVisible, setAreNavigationItemsVisible] = useState<boolean>(false);
  const [isMobileNavigationVisible, setIsMobileNavigationVisible] = useState<boolean>(false);


  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const {currentLang} = useLanguage();
  const LOCAL_STORAGE_KEY = "chatSession";
  const LOCAL_STORAGE_MESSAGES_KEY = "messages";
  const LOCAL_STORAGE_INDEX_KEY = "currentIndex";

  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);



  const [threadId, setThreadId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("threadId") || "";
    }
    return "";
  });

  useEffect(() => {
    if (threadId) {
      localStorage.setItem("threadId", threadId);
    }
  }, [threadId]);
  
  
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

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(conversationPairs));
  }, [conversationPairs]);


const [chatSession, setChatSession] = useState<ChatSession | null>(() => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.interactions) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("⚠️ Error reading chat session from localStorage:", err);
  }
  return null;
});

 // console.log("starting new chat session.... id is: ", threadId)

useEffect(() => {
  if (chatSession) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatSession));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}, [chatSession]);


  const startNewChatSession = useCallback(async () => {
    const { threadId: newThreadId } = await createThreadAPI();
    

    console.log("New THread id is: ", threadId)
    const newSession: ChatSession = {
      id: newThreadId,
      title: "New Chat",
      interactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  
    setThreadId(newThreadId);
    setChatSession(newSession);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSession));
  
    return newSession; // ✅ return it here!
  }, [setThreadId, setChatSession]);
  

  const loadChatSession = useCallback(async (threadId: string) => {
    if (chatSession?.id === threadId) return;
  
    const sessionFromDB = await fetchChatSessionFromDB(threadId);
  
    if (sessionFromDB) {
      setChatSession(sessionFromDB);
      setThreadId(sessionFromDB.id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionFromDB));
    } else {
      console.warn("Thread not found");
    }
  }, [chatSession, setChatSession, setThreadId]);
  
  // 4. Persist changes back to localStorage whenever chatSession updates

  useEffect(() => {
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
      status: "success",
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
          { type: "assistantText", text: "" } // For streaming updates
        ],
        metadata: {},
        createdAt: new Date().toISOString(),
      },
    };
  
interactionRef.current = newInteraction;

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
      // console.log("chatSession is: ", JSON.stringify(prevSession));
      const lastIndex = prevSession.interactions.length - 1;

      //console.log("last index is: ", lastIndex);
      if (lastIndex < 0) return prevSession;
  
      const lastInteraction = prevSession.interactions[lastIndex];
      const bot = lastInteraction.botMessage;
  
      const newParts = bot.parts.map((part, i) =>
        i === 0 && part.type === "assistantText"
          ? { ...part, text: part.text + text }
          : part
      );
  
      const updatedInteraction = {
        ...lastInteraction,
        botMessage: {
          ...bot,
          parts: newParts,
        },
      };
      interactionRef.current = updatedInteraction;
  
      return {
        ...prevSession,
        interactions: [
          ...prevSession.interactions.slice(0, lastIndex),
          updatedInteraction,
        ],
      };
    });
  }, []);
  

 


  const updateLastInteractionBotParts = useCallback((
    newParts: BotMessagePart[],
    interactionId?: string
  ) => {
    setChatSession((prevSession) => {
      const interactions = [...prevSession.interactions];
      if (interactions.length === 0) return prevSession;
  
      const indexToUpdate = interactionId
        ? interactions.findIndex(i => i.id === interactionId)
        : interactions.length - 1;
  
      if (indexToUpdate === -1) return prevSession;
  
      const targetInteraction = interactions[indexToUpdate];
      const updatedParts = [...targetInteraction.botMessage.parts, ...newParts];
  
      const updatedInteraction: Interaction = {
        ...targetInteraction,
        botMessage: {
          ...targetInteraction.botMessage,
          parts: updatedParts,
        },
      };
  
      interactionRef.current = updatedInteraction;
      interactions[indexToUpdate] = updatedInteraction;
  
      return {
        ...prevSession,
        interactions,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [setChatSession]);
  

  // const updateLastInteractionBotParts = useCallback((newParts: BotMessagePart[]) => {
  //   setChatSession((prevSession) => {
  //     const interactions = [...prevSession.interactions];
  //     if (interactions.length === 0) return prevSession;
  
  //     const lastIndex = interactions.length - 1;
  //     const lastInteraction = interactions[lastIndex];
  
  //     const updatedParts = [...lastInteraction.botMessage.parts, ...newParts];
  
  //     const updatedInteraction: Interaction = {
  //       ...lastInteraction,
  //       botMessage: {
  //         ...lastInteraction.botMessage,
  //         parts: updatedParts,
  //       },
  //     };
  
  //     interactionRef.current = updatedInteraction;
  //     interactions[lastIndex] = updatedInteraction;
  
  //     return {
  //       ...prevSession,
  //       interactions,
  //       updatedAt: new Date().toISOString(),
  //     };
  //   });
  // }, [setChatSession]);




  


 const resetConversationState = () => {
 
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
        isRunning,
        interactionRef,
        activeInteraction,
    setActiveInteraction,
        setIsRunning,
        setChatSession,
        setThreadId,
        setConversationPairs,
        setActiveConversationPair,
        setCurrentIndex,
        addUserMessage,
        appendAssistantText,
        updateLastInteractionBotParts,
        // updateLastMessage,
        setAreNavigationItemsVisible,
        setIsMobileNavigationVisible,
        setUserInput,
        setInputDisabled,
        resetConversationState,
        startNewChatSession,
        loadChatSession
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
