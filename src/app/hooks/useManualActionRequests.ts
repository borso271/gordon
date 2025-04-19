import { useTranslation } from 'react-i18next';
import { useManualSubmit } from './useManualSubmit';
import { useSimulatedRequest } from './useSimulatedRequest';
import { useSessionCallback } from './useSessionCallback';

export function useManualActionRequests() {
  const { t } = useTranslation();
  const { submitQuery } = useManualSubmit();
  const { sendSimulatedRequest } = useSimulatedRequest();
  const {withNewSession} = useSessionCallback();
  // 🧠 Base Handlers

  const handleLearn = (threadId?: string) => {
    sendSimulatedRequest(
      "I want to learn about finance.",
      t("knowledge.introMessage"),
      [{type:"knowledge_browser",data:[],sidebar:true}],
      false,
      false,
    );
  };
  
  const handleSuggest = (threadId?: string) => {
    submitQuery(t('suggest.prompt'), false, threadId);
  };
  

  const handleCompare = (threadId?: string) => {
    sendSimulatedRequest(
      "I want to compare two stocks.",
      t("compare.introMessage"),
      [{ type: "comparison_pair_picker",data:[], sidebar:true}],
      false,
      false,
  
    );
  };

  const handleSummarize = (threadId?: string) => {
    submitQuery(t('portfolio_overview.prompt'), false, threadId);
  };
  
  const handleAnalyze = (threadId?: string) => {

sendSimulatedRequest(
  "I want to analyze a stock.",
  t("analyze.introMessage"),
  [
    {
      type: "follow_ups",
      data: [
        t("analyze.followUps.apple"),
        t("analyze.followUps.tesla"),
        t("analyze.followUps.google"),
      ],
      sidebar: false,
    },
  ],
  false,
  false
);
  };
  
  // 🌱 Landing Variants → Just wrap the base
  const handleLandingSuggest = () => withNewSession((sessionId) => handleSuggest(sessionId), 50);
  const handleLandingCompare = () => withNewSession((sessionId) => handleCompare(sessionId), 50);
  const handleLandingSummarize = () => withNewSession((sessionId) => handleSummarize(sessionId), 50);
  const handleLandingAnalyze = () => withNewSession((sessionId) => handleAnalyze(sessionId), 50);
  const handleLandingLearn = () => withNewSession((sessionId) => handleLearn(sessionId), 50);
  
  const handleOuterSuggest = () => withNewSession((sessionId) => handleSuggest(sessionId), 50, true);
  const handleOuterCompare = () => withNewSession((sessionId) => handleCompare(sessionId), 50, true);
  const handleOuterSummarize = () => withNewSession((sessionId) => handleSummarize(sessionId), 50, true);
  const handleOuterAnalyze = () => withNewSession((sessionId) => handleAnalyze(sessionId), 50, true);
  const handleOuterLearn = () => withNewSession((sessionId) => handleLearn(sessionId), 50, true);
  

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
    handleLandingLearn,

    handleOuterSummarize
  };
}
