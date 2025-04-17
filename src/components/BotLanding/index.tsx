"use client"

import React, {useEffect, FormEvent} from 'react';

import styles from './BotLanding.module.css'
import { useConversation } from '../../app/context/conversationContext';
import ChatInput from '../Chat/components/ChatInput';
import { useHandleSubmit } from '../../app/hooks/useHandleSubmit';
import { useRouter } from 'next/navigation';
import Icon from '../Icons/Icon';
import LandingSuggestion from '../LandingSuggestion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../app/hooks/useLanguage';


const BotLanding = () => {
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
    // setThreadId(""); 
  }, []);

  // const { threadId } = useThread();

  const {handleSubmit} = useHandleSubmit();

const handleLandingSubmit = async (e?: FormEvent) => {
  e?.preventDefault();
  

  const newSession = await startNewChatSession();

  //  router.push(`/landing?threadId=${newSession.id}`);

  setTimeout(() => {
   
    handleSubmit(null, userInput, newSession.id); // Or pass `userInput` here explicitly if needed
  }, 50);
};

  return (
    <div className={styles.container}>
      <div className={styles.chatWrapper}>
      <div className={styles.landingHeading}>
      <div className={styles.gordonIconWrapper}  >
<Icon name="gordon_logo_black" size={27}></Icon>
</div>


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



{/* search_asset,comparison,summarize,suggest,lamp */}
<div className={styles.landingSuggestions}>
      <div className={styles.suggestionsRow}>
        <LandingSuggestion
          icon="search_asset"
          label={t('landing.suggestions.suggest.label')}
          prompt={t('landing.suggestions.suggest.prompt')}
        />
        <LandingSuggestion
          icon="comparison"
          label={t('landing.suggestions.compare.label')}
          prompt={t('landing.suggestions.compare.prompt')}
        />
        <LandingSuggestion
          icon="lamp"
          label={t('landing.suggestions.learn.label')}
          prompt={t('landing.suggestions.learn.prompt')}
        />
      </div>
      <div className={styles.suggestionsRow}>
        <LandingSuggestion
          icon="summarize"
          label={t('landing.suggestions.summarize.label')}
          prompt={t('landing.suggestions.summarize.prompt')}
        />
        <LandingSuggestion
          icon="suggest"
          label={t('landing.suggestions.analyze.label')}
          prompt={t('landing.suggestions.analyze.prompt')}
        />
      </div>
    
      </div>
      </div>
    </div>
  );
};

export default BotLanding;