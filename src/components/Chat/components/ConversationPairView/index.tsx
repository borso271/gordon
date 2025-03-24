import React, {RefObject} from "react";
import { motion } from "framer-motion";
import UserMessage from "../UserMessage";
import AssistantMessage from "../AssistantMessage";
import CodeMessage from "../CodeMessage";
import Analysis from "../../../Analysis";
import Suggestion from "../../../Suggestion";
import Loading from "../../../Loading";
import styles from "./ConversationPairView.module.css";
import { extractTwoValues } from "../../utils/extractTwoValues";


interface ConversationPair {
  user: string;
  assistant?: string | null;
  code?: string | null;
  analysisData?:any;
  suggestionData?: any;
}

interface ConversationPairViewProps {
  pair: ConversationPair;
  direction: "up" | "down";
  responseRef: RefObject<HTMLDivElement>;
  handleManualFunctionCall: (functionName: string, args: any) => void;
 newSearch: (prompt: string) => Promise<void>

}

const ConversationPairView: React.FC<ConversationPairViewProps> = ({
  pair,
  direction,
  responseRef,
  handleManualFunctionCall,
  newSearch,
}) => {
  const nothingYet =
    !pair.assistant && !pair.code && !pair.analysisData && !pair.suggestionData;

  const [responseHeading, responseContent] = extractTwoValues(pair.assistant || "");

  return (
    <motion.div
      key={pair.user}
      initial={{ y: direction === "up" ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: direction === "up" ? -100 : 100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={styles.pairWrapper}
    >
      <div ref={responseRef} className={styles.pair}>
        <UserMessage text={pair.user} />

        <div className={styles.assistantResponse}>
          {nothingYet ? (
            <Loading />
          ) : (
            <>
              {pair.assistant && (
                <AssistantMessage heading={responseHeading} text={responseContent} />
              )}

              {pair.code && <CodeMessage text={pair.code} />}

              {pair.analysisData && (
                <Analysis
                  data={pair.analysisData}
                  handleManualFunctionCall={handleManualFunctionCall}
                  newSearch={newSearch}
                />
              )}

              {pair.suggestionData && (
                <Suggestion
                  data={pair.suggestionData}
                  handleManualFunctionCall={handleManualFunctionCall}
                />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationPairView;