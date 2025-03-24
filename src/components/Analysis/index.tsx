"use client"
import React, {useMemo} from 'react';
import styles from './Analysis.module.css'
import RatingsAndNews from '../RatingsAndNews';
import GoDeeper from '../GoDeeper';
import Providers from '../Providers';
import RelatedSymbols from '../Related';
import AnalysisPart from '../AnalysisPart';
import ActionsGroup from '../ActionsGroup';
import copyToClipboard from '../Chat/utils/copyToClipboard';
import shareContent from '../Chat/utils/shareContent';
import SymbolChart from '../DataDriven/SymbolChart';
import AnalysisPartLoader from '../Loaders/AnalysisPartLoader';
import GoDeeperLoader from '../Loaders/GoDeeperLoader';

interface AnalysisProps {
  data: any; // You should type this more specifically if possible
  handleManualFunctionCall: (...args: any[]) => void;
  newSearch: (prompt: string) => Promise<void>

}

const Analysis: React.FC<AnalysisProps> = ({ data, handleManualFunctionCall, newSearch }) => {
  const dataForAnalysis = data.data.response;

  const {
    symbol,
    asset_type,
    analysis: rawAnalysis,
    symbol_id,
  } = dataForAnalysis;

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

  const positives = ai_response.positives;
  const negatives = ai_response.risks_and_concerns;
  const summary = ai_response.summary;
  const prompts = ai_response.suggested_prompts;
  const symbolName = symbol;

  return (
    <div className={styles.container}>
<SymbolChart symbol={symbol}/>

{/* Good Things Section */}
{positives ? (
  <AnalysisPart 
    title="Good Things" 
    name={symbolName}
    type="list"
    content={positives}
    icon="positives"
    tagColor="#001A0E"
    tagSize={20}
  />
) : (
  <AnalysisPartLoader />
)}

{/* Bad Things Section */}
{negatives ? (
  <AnalysisPart 
    title="Bad Things"
    name={symbolName}
    type="list"
    content={negatives}
    icon="negatives"
    tagColor="#2E0403"
    tagSize={20}
  />
) : (
  <AnalysisPartLoader />
)}

{/* Ratings & News (Only if Asset is NOT Crypto) */}
{asset_type !== "crypto" && <RatingsAndNews symbol={symbol} />}

{/* Summary Section */}
{summary ? (
  <AnalysisPart 
    title="Summary" 
    name={symbolName}
    type="text"
    content={summary}
    icon="conclusions_icon"
    tagColor="var(--default-icon-background)"
    tagSize={18}    
  />
) : (
  <AnalysisPartLoader />
)}

{/* Go Deeper Section */}
{prompts ? (
  <GoDeeper items={prompts} newSearch={newSearch} />
) : (
  <GoDeeperLoader/>
)}
         <Providers symbol={symbol}/>
         <RelatedSymbols symbol_id={symbol_id} handleManualFunctionCall={handleManualFunctionCall}/>
         <ActionsGroup
        actions={[
          { iconName: "share", text: "Share", onClick: () => shareContent("hello") },
          { iconName: "copy", text: "Copy", onClick: () => copyToClipboard("hello") }, // ✅ Pass function properly
        ]}
        disabled={false}
      /> 

      </div>
  
  );
};

export default Analysis;

