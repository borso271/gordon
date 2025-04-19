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
    //   threadId
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
    //   threadId
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
