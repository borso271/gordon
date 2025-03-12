import React from "react";
import { motion } from "framer-motion";
import UserMessage from "../UserMessage";
import AssistantMessage from "../AssistantMessage";
import CodeMessage from "../CodeMessage";
import Analysis from "../../../Analysis";
import Suggestion from "../../../Suggestion";
import Loading from "../../../Loading";
import styles from "./ConversationPairView.module.css";


function extractTwoValues(inputString) {
  const pattern = /"([^"]+)":"/g; // Matches: `"any-key":"` capturing `any-key`
  let matches = [...inputString.matchAll(pattern)];

  if (matches.length === 0) {
      return ["", ""]; // No matches found
  }

  // Get first match index
  let firstMatchIndex = matches[0].index + matches[0][0].length;
  let firstValueEnd = matches[1] ? matches[1].index : inputString.length;

  let firstValue = inputString.slice(firstMatchIndex, firstValueEnd);
  let secondValue = "";

  if (matches.length > 1) {
      let secondMatchIndex = matches[1].index + matches[1][0].length;
      secondValue = inputString.slice(secondMatchIndex);
  }

  // Remove trailing `",` from firstValue
  firstValue = firstValue.replace(/",?$/, "");

  // Remove trailing `}"` from secondValue
  secondValue = secondValue.replace(/"}"?$/, "");

  return [firstValue, secondValue];
}


function ConversationPairView({ pair, direction, responseRef, handleManualFunctionCall, newSearch}) {
  // Check if the assistant's response is still "empty"
  const nothingYet = !pair.assistant && !pair.code && !pair.analysisData && !pair.suggestionData;

    console.log("NOTHING YET IS :", nothingYet)

 const [responseHeading, responseContent] = extractTwoValues(pair.assistant);

  return (
    <motion.div
      key={pair.user}
      initial={{ y: direction === "up" ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: direction === "up" ? -100 : 100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={styles.pairWrapper}
    >
      {/* User message */}
      <UserMessage text={pair.user} />

      {/* Assistant's response (text, code, analysis, suggestions) */}
      <div ref={responseRef} className={styles.assistantResponse}>
        { nothingYet ? (
          // ✅ Show LOADING until we have some assistant content
          <Loading />
        ) : (
          <>
            {/* Show partial or complete assistant text */}
            {pair.assistant && <AssistantMessage heading={responseHeading} text={responseContent} />}

            {/* Show code if present */}
            {pair.code && <CodeMessage text={pair.code} />}

            {/* Render Analysis if analysisData is available */}
            {pair.analysisData && (
              <Analysis data={pair.analysisData} handleManualFunctionCall={handleManualFunctionCall} newSearch={newSearch} />
            )}

            {/* Render Suggestion if suggestionData is available */}
            {pair.suggestionData && (
              <Suggestion data={pair.suggestionData} handleManualFunctionCall={handleManualFunctionCall} />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ConversationPairView;


// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import UserMessage from "../UserMessage";
// import AssistantMessage from "../AssistantMessage";
// import CodeMessage from "../CodeMessage";
// import Analysis from '../../../Analysis'
// import Suggestion from '../../../Suggestion'
// import styles from "./ConversationPairView.module.css";

// interface ConversationPair {
//   user: string;
//   assistant: string; // Will accumulate streaming text
//   code?: string;
//   analysisData?: { 
//     symbol: string;
//     asset_type: "stock" | "crypto";
//     result: any; 
//   };
//   suggestionData?: {
//     category: string;
//     suggestions: string[];
//   };
  
// }

// interface Props {
//   pair: ConversationPair;
//   direction: "up" | "down";
//   responseRef: React.RefObject<HTMLDivElement>;
//   handleManualFunctionCall: any;

// }

// function ConversationPairView({ pair, direction, responseRef,handleManualFunctionCall }: Props) {
 
// console.log("RENDERING THE PAIR: ", pair, direction, responseRef)
//   return (
//     <motion.div
//       key={pair.user}
//       initial={{ y: direction === "up" ? 100 : -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       exit={{ y: direction === "up" ? -100 : 100, opacity: 0 }}
//       transition={{ duration: 1, ease: "easeInOut" }}
//       className={styles.pairWrapper}
//     >
//       {/* User message */}
//       <UserMessage text={pair.user} />

//       {/* Assistant's response (text, code, analysis, suggestions) */}
//       <div ref={responseRef} className={styles.assistantResponse}>
//         {pair.assistant && <AssistantMessage text={pair.assistant} />}
//         {pair.code && <CodeMessage text={pair.code} />}

//         {/* Render Analysis component if analysisData is available */}
//         {pair.analysisData && <Analysis data={pair.analysisData} handleManualFunctionCall={handleManualFunctionCall}/>}

//         {/* Render Suggestions component if suggestionData is available */}
//         {pair.suggestionData && <Suggestion data={pair.suggestionData} handleManualFunctionCall={handleManualFunctionCall}/>}
//       </div>
//     </motion.div>
//   );
// }

// export default ConversationPairView;
