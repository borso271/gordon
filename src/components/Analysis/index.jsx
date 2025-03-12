"use client"

import React from 'react';

import styles from './Analysis.module.css'
import RatingsAndNews from '../RatingsAndNews';
import GoDeeper from '../GoDeeper';
import Providers from '../Providers';
  import RelatedSymbols from '../Related';
  import AnalysisPart from '../AnalysisPart';
  import ActionsGroup from '../ActionsGroup';
//   import Query from '../Query';
// import SymbolChart from '../Data_driven/SymbolChartNew';
import copyToClipboard from '../Chat/utils/copyToClipboard';
import shareContent from '../Chat/utils/shareContent';
import Sc from '../DataDriven/Sc';

import fetch_symbol_info from '../../utils/fetch_symbol_info';
import supabase_client from '../../lib/supabaseClient';
// import {staticItems} from './staticItems'

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

 
<AnalysisPart 
      title="Good Things" 
      type="list"
      content={positives}
      icon="positives"
      tagColor="#001A0E"  // Red background for the tag
    />
     <AnalysisPart 
      title="Bad Things"
      type="list"
      content={negatives}
      
      icon="negatives"
      tagColor="#2E0403"  // Red background for the tag
    />


          <RatingsAndNews symbol={symbol}/>

<AnalysisPart 
      title="Summary" 
      name={symbolName}
      type="text"
      content={summary}
      icon={false}
      tagColor="#2E0403"  // Red background for the tag
    />

  <GoDeeper items={prompts} onIconClick={handleIconClick} newSearch={newSearch} />

         <Providers/>

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







// {
//     "positives": [
//         "Apple has reported a significant increase in gross profit, which has gone up by 32.81% in the last quarter, indicating improved efficiency or revenue growth.",
//         "Operating income shows a strong rise of 44.75%, which suggests that Apple is effective in managing its operational costs.",
//         "Net income is up by 146.54% over the last quarter, showing robust profitability.",
//         "The comprehensive income has also shown significant growth, which indicates a strong overall financial performance.",
//         "Despite a decrease in current liabilities, Apple has increased its equity by 17.22%, highlighting its financial strengthening.",
//         "The increase in investing activities cash flow by 577.65% quarter-over-quarter suggests active investment in future growth avenues.",
//         "Increased quarterly revenue by 30.94% showcases Apple's strong sales performance.",
//         "The Basic and Diluted Earnings Per Share have increased significantly, showing strong returns for shareholders."
//     ],
//     "risks_and_concerns": [
//         "Overall net cash flow has dramatically decreased by 89.24% in the last quarter, which is concerning for liquidity.",
//         "Total assets have decreased by 5.72% over the last quarter, which could indicate declining company resources or investments.",
//         "The RSI is at 41.53, suggesting that the stock is neither overbought nor oversold, but it leans more towards a neutral to potentially oversold position, indicating market caution.",
//         "Current assets have decreased by 12.91% in the past quarter, potentially impacting short-term financial stability.",
//         "There's a negative MACD histogram, reflecting potential bearish momentum in stock price movements.",
//         "Net cash flow from financing activities has been significantly negative, indicating potential outflows related to debt servicing or dividends which might pressure cash reserves.",
//         "Operating cash flow decreased by 24.97% year over year, reflecting possible operational cash generation issues."
//     ],
//     "summary": "Apple Inc. shows a robust financial position with significant improvements in income and profitability metrics, as evidenced by high growth in gross and operating income, and net income figures. However, challenges remain as cash flows have contracted dramatically, and the company's operational cash generation seems pressured. Operating efficiently with its current financial structure and resolving cash flow issues should be a priority. Apple's stock appears to be neutrally positioned in the market, neither overbought nor oversold, potentially providing investors with a calculated entry point if coupled with caution over liquidity concerns. Overall, while the income figures and equity growth are promising, attention to cash flow management and market sentiment is crucial."
// }