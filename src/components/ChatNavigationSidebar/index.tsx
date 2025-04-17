"use client";

import { useState } from "react";
import styles from "./ChatNavigationSidebar.module.css";
import Icon from "../Icons/Icon";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import ConversationHistory from "./components/ChatHistory";
import CircledIconButton from "../Buttons/CircleActionButton";
import { useChatNavigationSidebar } from "../../app/context/chatNavigationContext";
import { useConversation } from "../../app/context/conversationContext";
// Mock user data

export default function ChatNavigationSidebar({
    onToggle,
    expanded,
  }: {
    onToggle?: (expanded: boolean) => void;
    expanded?: boolean;
  }) {
   
const {setThreadId} = useConversation();

  
const handleNewChatClick = () => {
    
  setThreadId("");
   // router.push("/landing");

  };

  return (
    <aside className={styles.sidebar}>

    <div className={styles.topActions}>

        <CircledIconButton 
        onClick={handleNewChatClick}
        iconName={"new_chat"} iconSize={22}/>
      
     <CircledIconButton 
  
        onClick={() => onToggle(true)}  // or false, or !expanded, or whatever is intended

        iconName={"history"} iconSize={22}/> 
        </div>
      

      <div className={styles.menu}>
      <ConversationHistory user_id="abc"/>
  </div>
    </aside>
  );
}
