"use client"

import React, {useEffect, FormEvent} from 'react';

import styles from './page.module.css'
import { useConversation } from '../../context/conversationContext';
import ChatInput from '../../../components/Chat/components/ChatInput';
import { useHandleSubmit } from '../../hooks/useHandleSubmit';
import {useThread} from '../../hooks/useThread';

const TestChatPage = () => {

   const {setAreNavigationItemsVisible, inputDisabled, setInputDisabled,userInput, setUserInput,setThreadId, resetConversationState} = useConversation();

  // ✅ Reset threadId only on mount
  useEffect(() => {
   resetConversationState();
   setInputDisabled(false);
    setThreadId(""); // ✅ Runs only once on mount
  }, []);

  // const { threadId } = useThread();

  const {handleSubmit} = useHandleSubmit();

  
// ✅ Create a wrapper that sets isLandingPage = true
const landingHandleSubmit = (e?: FormEvent | MouseEvent | null) => {
  return handleSubmit(e, true);
};


  return (
    <div className={styles.container}>
      <div className={styles.sidebarWrapper}
      id="sidebarWrapper"
       onMouseEnter={() => setAreNavigationItemsVisible(true)} 
       onMouseLeave={() => setAreNavigationItemsVisible(false)}>
      </div>
      <div className={styles.chatWrapper}>
      
      <ChatInput
        isFirstPrompt={true}
        userInput={userInput}
        setUserInput={setUserInput}
        handleSubmit={landingHandleSubmit}
        inputDisabled={inputDisabled}
      />
      </div>
    </div>
  );
};

export default TestChatPage;