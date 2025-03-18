"use client"

import React from 'react';

import styles from './Analysis.module.css'
import RatingsAndNews from '../RatingsAndNews';
import GoDeeper from '../GoDeeper';
import Providers from '../Providers';
import RelatedSymbols from '../Related';
import AnalysisPart from '../AnalysisPart';
import ActionsGroup from '../ActionsGroup';
import copyToClipboard from '../Chat/utils/copyToClipboard';
import shareContent from '../Chat/utils/shareContent';
import Sc from '../DataDriven/Sc';
import AnalysisPartLoader from '../Loaders/AnalysisPartLoader';
const Analysis = ({data,handleManualFunctionCall, newSearch}) => {

 console.log("DATA PASSED TO ANALYSIS IS: ", data)
 const dataForAnalysis = (data.data.response);

 const created_at = dataForAnalysis.created_at;
 console.log("created at is: ", created_at)

 const symbol = dataForAnalysis.symbol;
 console.log("symbol is: ", symbol);

 const asset_type = dataForAnalysis.asset_type;
 console.log("asset type is: ", asset_type);

 let ai_response = dataForAnalysis.analysis;

 const symbol_id = dataForAnalysis.symbol_id;

try {
  // If it's a stringified object, parse it
  if (typeof ai_response === "string") {
    ai_response = JSON.parse(ai_response);
  }
} catch (error) {
  console.error("❌ Error parsing JSON:", error.message);
  // If parsing fails, keep the original string
}

console.log("✅ AI response as object:", ai_response);

const positives = ai_response.positives;
const negatives = ai_response.risks_and_concerns;
const summary = ai_response.summary;
const prompts = ai_response.suggested_prompts;


  const symbolName = "Apple";
const handleIconClick = (item) => {
  console.log(`Action taken for: ${item.text}, Action: ${item.action}`);
};

  return (
   
    <div className={styles.main}>

<Sc symbol={symbol} symbol_id={symbol_id}/>

{/* Good Things Section */}
{positives ? (
  <AnalysisPart 
    title="Good Things" 
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
    tagSize={16}    
  />
) : (
  <AnalysisPartLoader />
)}

{/* Go Deeper Section */}
{prompts ? (
  <GoDeeper items={prompts} onIconClick={handleIconClick} newSearch={newSearch} />
) : (
  <GoDeeperLoader />
)}

{/*  
<AnalysisPart 
      title="Good Things" 
      type="list"
      content={positives}
      icon="positives"
      tagColor="#001A0E"  // Red background for the tag
      tagSize={20}
      
    />
     <AnalysisPart 
      title="Bad Things"
      type="list"
      content={negatives}
      icon="negatives"
      tagColor="#2E0403"  // Red background for the tag
      tagSize={20}
    />

{asset_type != "crypto" && <RatingsAndNews symbol={symbol}/>}
       <AnalysisPart 
        title="Summary" 
        name={symbolName}
        type="text"
        content={summary}
        icon="conclusions_icon"
        tagColor="var(--default-icon-background)"  // Red background for the tag
        tagSize={16}    />

         <GoDeeper items={prompts} onIconClick={handleIconClick} newSearch={newSearch} />
 */}





         <Providers symbol={symbol}/>
         <RelatedSymbols symbol_id={symbol_id} handleManualFunctionCall={handleManualFunctionCall}/>
         <ActionsGroup

        actions={[
          { iconName: "share", text: "Share", onClick: () => shareContent("hello") },
          { iconName: "copy", text: "Copy", onClick: () => copyToClipboard("hello") }, // ✅ Pass function properly
        ]}
      /> 

      </div>
  
  );
};

export default Analysis;

