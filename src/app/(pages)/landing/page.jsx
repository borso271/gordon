"use client"

import React, {useEffect} from 'react';
import styles from './page.module.css'
import { useConversation } from '../../context/conversationContext';
import ChatInput from '../../../components/Chat/components/ChatInput';
import { useHandleSubmit } from '../../hooks/useHandleSubmit';
import {useThread} from '../../hooks/useThread';
const TestChatPage = () => {

   const {setAreNavigationItemsVisible, inputDisabled, userInput, setUserInput, setThreadId, resetConversationState} = useConversation();
   

   const {handleSubmit} = useHandleSubmit();

  // ✅ Reset threadId only on mount
  useEffect(() => {

   resetConversationState();
    setThreadId(""); // ✅ Runs only once on mount
  }, []);
   const { threadId } = useThread();
 console.log("thread is is: ", threadId)
  
  return (
    <div className={styles.container}>
      {/* <MobileNavigation/> */}
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
        handleSubmit={handleSubmit}
        inputDisabled={inputDisabled}
      />
      </div>
    </div>
  );
};

export default TestChatPage;




/*
here avoid putting the navigation Sidebar,
reset the state at the top of the page...
and send to botChat whether it is the first or not first prompt. Whether you are coming or not from here */