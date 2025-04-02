"use client"
import React, {useMemo, useEffect} from 'react';
import styles from './Analysis.module.css'
import RatingsAndNews from '../RatingsAndNews';
import GoDeeper from '../GoDeeper';
import Providers from '../Providers';
import RelatedSymbols from '../Related';
import AnalysisPart from '../AnalysisPart';
import ActionsGroup from '../ActionsGroup';
import copyToClipboard from '../../app/utils/copyToClipboard';
import shareContent from '../../app/utils/shareContent';
import SymbolChart from '../DataDriven/SymbolChart';
import AnalysisPartLoader from '../Loaders/AnalysisPartLoader';
import GoDeeperLoader from '../Loaders/GoDeeperLoader';
import { useTranslation } from 'react-i18next';
import { useGetAnalysisData } from '../../app/hooks/useGetAnalysisData';
import { getFormattedText } from '../../app/utils/getFormattedText';
/*
fetch all data at top component, including
names, and other stuff that you need to use
save all in the pair, so that is can also be copied,
etc.
TOMORROW: ADD SEARCH USING BING API? Search content, and return it,
search website, 
*/
import TradingViewChart from '../TradingView/Chart'

interface AnalysisProps {
  data: any; // You should type this more specifically if possible
  language: string;
  handleManualFunctionCall: (...args: any[]) => void;
  newSearch: (prompt: string) => Promise<void>
}

const Analysis: React.FC<AnalysisProps> = ({ data, language, handleManualFunctionCall, newSearch }) => {
  const dataForAnalysis = data.data.response;
 
const { t } = useTranslation();
  const {
    symbol,
    asset_type,
    analysis: rawAnalysis,
    symbol_id,
  } = dataForAnalysis;

  const analysisData = useGetAnalysisData(rawAnalysis, symbol, symbol_id);

// Log only serializable properties (omit functions)
useEffect(() => {
  const { positives, negatives, summary, prompts, news, related_symbols, providers, ratings, loading, error } = analysisData;

  // console.log("🧪 getAnalysisData:", JSON.stringify({
  //   positives,
  //   negatives,
  //   summary,
  //   prompts,
  //   news,
  //   related_symbols,
  //   providers,
  //   ratings: {
  //     totalRatings: ratings?.totalRatings,
  //     mostVotedRating: ratings?.mostVotedRating,
  //     ratings: ratings?.ratings,
  //     loading: ratings?.loading,
  //     error: ratings?.error
  //   },
  //   loading,
  //   error
  // }, null, 2));

}, [analysisData]);

  const ai_response = useMemo(() => {
    if (typeof rawAnalysis === "string") {
      try {
        return JSON.parse(rawAnalysis);
      } catch (error) {
        console.error("❌ Error parsing JSON:", (error as Error).message);
        return {};
      }
    }
    return rawAnalysis || {};
  }, [rawAnalysis]);

  const prompts = ai_response.suggested_prompts;
  const symbolName = symbol;

const positivesHeading = language == "en" ? "Good Things" : "أشياء إيجابية";
const negativesHeading = language == "en" ? "Bad Things" : "أشياء سلبية";
const summaryHeading   = language == "en" ? "Key Takeaways" : "الخلاصات الرئيسية";

const positives = ai_response.positives;
const negatives = ai_response.risks_and_concerns;
const summary = ai_response.summary;



  // 1) Build the multiline text:
  const textToCopy = getFormattedText({
    positivesHeading,
    negativesHeading,
    summaryHeading,
    positives,
    negatives,
    summary,
  });


  return (
  <div className={styles.container}>
  <TradingViewChart
  language={language}
  symbol={symbol}
  currency="USD"/>

{/* 
<SymbolChart symbol={symbol} language={language}/> */}

{/* Good Things Section */}
{positives ? (
  <AnalysisPart 
    title={positivesHeading} 
    name={symbolName}
    type="list"
    content={positives}
    icon="positives"
    tagColor="#001A0E"
    tagSize={20}
    language={language}
  />
) : (
  <AnalysisPartLoader />
)}

{/* Bad Things Section */}
{negatives ? (
  <AnalysisPart 
    title={negativesHeading}
    name={symbolName}
    type="list"
    content={negatives}
    icon="negatives"
    tagColor="#2E0403"
    tagSize={20}
    language={language}
  />
) : (
  <AnalysisPartLoader />
)}

{/* Ratings & News (Only if Asset is NOT Crypto) */}
{asset_type !== "crypto" && <RatingsAndNews symbol={symbol} language={language} />}

{/* Summary Section */}
{summary ? (
  <AnalysisPart 
    title={summaryHeading} 
    name={symbolName}
    type="text"
    content={summary}
    icon="conclusions_icon"
    tagColor="var(--default-icon-background)"
    tagSize={18}    
    language={language}
  />
) : (
  <AnalysisPartLoader />
)}

{/* Go Deeper Section */}
{prompts ? (
  <GoDeeper items={prompts} newSearch={newSearch} language={language} />
) : (
  <GoDeeperLoader/>
)}
         <Providers symbol={symbol} language={language}/>
         <RelatedSymbols symbol_id={symbol_id} language={language} handleManualFunctionCall={handleManualFunctionCall}/>
         <ActionsGroup
          actions={[
            { iconName: "share", text: t("share"), onClick: () => shareContent(textToCopy) },
            { iconName: "copy", text: t("copy"), onClick: () => copyToClipboard(textToCopy) }, // ✅ Pass function properly
          ]}
        disabled={false}
      /> 
      </div>
  
  );
};

export default Analysis;

