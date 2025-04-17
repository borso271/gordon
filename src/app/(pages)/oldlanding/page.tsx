"use client"

import React, {useEffect, FormEvent} from 'react';

import styles from './page.module.css'
import { useConversation } from '../../context/conversationContext';
import ChatInput from '../../../components/Chat/components/ChatInput';
import { useHandleSubmit } from '../../hooks/useHandleSubmit';
import { useRouter } from 'next/navigation';
import BotHeading from '../../../components/Headings/BotHeading';
import LandingSuggestion from './components/Suggestion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';


const ChatLanding = () => {
  const LOCAL_STORAGE_KEY = "chatSession";
   const router = useRouter();
  const { t } = useTranslation();

  const {currentLang} = useLanguage();
   const {setAreNavigationItemsVisible, inputDisabled, setInputDisabled,userInput, setUserInput,setThreadId, resetConversationState, startNewChatSession} = useConversation();

  // ✅ Reset threadId only on mount
  useEffect(() => {
   resetConversationState();
   setInputDisabled(false);
   localStorage.removeItem(LOCAL_STORAGE_KEY);
    setThreadId(""); // ✅ Runs only once on mount
  }, []);

  // const { threadId } = useThread();

  const {handleSubmit} = useHandleSubmit();

const handleLandingSubmit = async (e?: FormEvent) => {
  e?.preventDefault();
  
  console.log("handleLandingSubmit called");

  const newSession = await startNewChatSession();
  console.log("New Chat Session Created and id is: ", newSession.id);

  // router.push(`/chat?threadId=${newSession.id}`);

  setTimeout(() => {
    console.log("WE ARE ABOUT TO CALL HANDLESUBMIT")
    handleSubmit(null, userInput, newSession.id); // Or pass `userInput` here explicitly if needed
  }, 50);
};

  return (
    <div className={styles.container}>


      <div className={styles.chatWrapper}>
      
      <div className={styles.landingHeading}>
      <h1 className={styles.landingTitle}>
      {t("hi_message")}</h1>
      
<h2 className={styles.landingSubtitle}> {t("hi_subtitle")}</h2>
      </div>


      <ChatInput
        isFirstPrompt={true}
        userInput={userInput}
        setUserInput={setUserInput}
        handleSubmit={handleLandingSubmit}
        inputDisabled={inputDisabled}
      />

      <div className={styles.landingSuggestions}>
      <LandingSuggestion
  icon="green_magic_stick"
  label="Suggest a stock"
  prompt="Can you suggest a good tech stock for 2025?"
/>
<LandingSuggestion
  icon="green_magic_stick"
  label="Suggest a stock"
  prompt="Can you suggest a good tech stock for 2025?"
/>
<LandingSuggestion
  icon="green_magic_stick"
  label="Suggest a stock"
  prompt="Can you suggest a good tech stock for 2025?"
/>
<LandingSuggestion
  icon="green_magic_stick"
  label="Suggest a stock"
  prompt="Can you suggest a good tech stock for 2025?"
/>

      </div>
      </div>
    </div>
  );
};

export default ChatLanding;






// const handleLandingSubmit = async () => {
//   console.log("handleLandingSubmit called")
//   const newSession = await startNewChatSession(); // creates + sets chatSession + threadId
//   console.log("New Chat Session Created and id is: ", newSession.id)
//   router.push(`/chat?threadId=${newSession.id}`);
//   setTimeout(() => {
//     handleSubmit(null); // or pass the query separately
//   }, 50);
// };