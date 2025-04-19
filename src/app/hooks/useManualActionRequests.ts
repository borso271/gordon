import { useTranslation } from 'react-i18next';
import { useManualSubmit } from './useManualSubmit';
import { useKnowledgeCenter } from './useKnowledgeCenter';
import { useSessionCallback } from './useSessionCallback';

export function useManualActionRequests() {
  const { t } = useTranslation();
  const { submitQuery } = useManualSubmit();
  const { sendKnowledgeMessage } = useKnowledgeCenter();
  const {withNewSession} = useSessionCallback();
  // 🧠 Base Handlers

  const handleLearn = (threadId?: string) => {
    sendKnowledgeMessage(
      "I want to learn about finance.",
      t("knowledge.introMessage"),
      false,
    //   threadId
    );
  };
  
  const handleSuggest = (threadId?: string) => {
    submitQuery(t('suggest.prompt'), false, threadId);
  };
  
  const handleCompare = (threadId?: string) => {
    submitQuery(t('landing.suggestions.compare.prompt'), false, threadId);
  };
  
  const handleSummarize = (threadId?: string) => {
    submitQuery(t('portfolio_overview.prompt'), false, threadId);
  };
  
  const handleAnalyze = (threadId?: string) => {
    submitQuery(t('landing.suggestions.analyze.prompt'), false, threadId);
  };
  

  // 🌱 Landing Variants → Just wrap the base
  const handleLandingSuggest = () => withNewSession(() => handleSuggest(), 50);
  const handleLandingCompare = () => withNewSession(() => handleCompare(), 50);
  const handleLandingSummarize = () => withNewSession(() => handleSummarize(), 50);
  const handleLandingAnalyze = () => withNewSession(() => handleAnalyze(), 50);
  const handleLandingLearn = () => withNewSession(() => handleLearn(), 50);

  return {
    // Regular usage
    handleSuggest,
    handleCompare,
    handleSummarize,
    handleAnalyze,
    handleLearn,

    // Landing version
    handleLandingSuggest,
    handleLandingCompare,
    handleLandingSummarize,
    handleLandingAnalyze,
    handleLandingLearn
  };
}
