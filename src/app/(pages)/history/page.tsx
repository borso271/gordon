"use client"

import React from 'react';
import styles from './page.module.css'
import BotChat from "../../../components/Chat";
import { useConversation } from '../../context/conversationContext';

const HistoryPage = () => {
 
  return (
    <div className={styles.container}>
    Hello World
    </div>
  );
};

export default HistoryPage;
