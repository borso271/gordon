"use client"

import React from 'react';
import styles from './page.module.css'
import BotChat from "../../../components/Chat";
import { functionCallHandler} from '../../utils/functionCallHandler'
import NavigationSidebar from '../../../components/NavigationSidebar';

const TestChatPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarWrapper}>
        {/* <NavigationSidebar /> */}
      </div>

      <div className={styles.chatWrapper}>
        <BotChat functionCallHandler={functionCallHandler} />
      </div>

      <div className={styles.mockDiv}></div> {/* ✅ Mock div for centering */}
    </div>
  );
};

export default TestChatPage;
