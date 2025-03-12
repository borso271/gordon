"use client"

import React from 'react';
import styles from './page.module.css'
import BotChat from "../../../components/Chat";
import { functionCallHandler} from '../../utils/functionCallHandler'

const TestChatPage = () => {
 
  return (
    <div className={styles.main}>
      <BotChat functionCallHandler={functionCallHandler} />
      </div>
  
  );
};

export default TestChatPage;
