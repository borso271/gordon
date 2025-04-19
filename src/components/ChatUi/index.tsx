'use client';

import { useEffect } from 'react';
import { useConversation } from '../../app/context/conversationContext';
import ChatLayout from '../Layout/ChatLayout';
import { useSearchParams } from 'next/navigation';
import BotChat from '../Chat';
import BotLanding from '../BotLanding';
import styles from './ChatUi.module.css';

const ChatUI = () => {

    const { chatSession, setChatSession,threadId, setThreadId } = useConversation();
    const searchParams = useSearchParams();
    const threadIdFromUrl = searchParams.get('threadId') ?? '';
// console.log("THREAD IS FROM URL IS: ", threadIdFromUrl, threadId);

    useEffect(() => {
      if (threadId) {
        setThreadId(threadId);
      } else {
      //  setThreadId('');
        return; // no threadId, skip fetch
      }
  
      const fetchSessionIfNeeded = async () => {
        if (!chatSession || chatSession.id !== threadId) {
          console.log('THREAD ID TO SEND TO THE BACKEND IS: ', threadId);
          try {
            const res = await fetch('/api/fetch_chat_session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ threadId: threadId }),
            });
  
            const json = await res.json();
            console.log("chat session sent by backend is: ", json);
            if (json?.chatSession) {
              setChatSession(json.chatSession);
            } else {
              console.warn('No chat session found for threadId:', threadId);
            }
          } catch (error) {
            console.error('Failed to fetch chat session:', error);
          }
        }
      };
  
      fetchSessionIfNeeded();
    }, [threadIdFromUrl, chatSession, setChatSession, setThreadId, threadId]);
  
    return (
      <ChatLayout>
        
          {threadId && chatSession ? <BotChat /> : <BotLanding />}
      
      </ChatLayout>
    );
  };
  
  export default ChatUI;