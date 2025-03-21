"use client"

import React from 'react';
import styles from './page.module.css'
import BotChat from "../../../components/Chat";
import NavigationSidebar from '../../../components/NavigationSidebar';
import { useConversation } from '../../context/conversationContext';

const TestChatPage = () => {
  const { setAreNavigationItemsVisible } = useConversation();
  return (
    <div className={styles.container}>
      {/* <MobileNavigation/> */}
      <div className={styles.sidebarWrapper}
      id="sidebarWrapper"
       onMouseEnter={() => setAreNavigationItemsVisible(true)} 
       onMouseLeave={() => setAreNavigationItemsVisible(false)}>
        <NavigationSidebar />
      </div>
      <div className={styles.chatWrapper}>
        <BotChat />
      </div>
    </div>
  );
};

export default TestChatPage;
