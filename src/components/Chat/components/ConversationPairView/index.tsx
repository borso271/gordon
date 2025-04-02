import React, {useState, useEffect, RefObject} from "react";
import { motion } from "framer-motion";
import UserMessage from "../UserMessage";
import AssistantMessage from "../AssistantMessage";
import CodeMessage from "../CodeMessage";
import Analysis from "../../../Analysis";
import Suggestion from "../../../Suggestion";
import Loading from "../../../Loading";
import styles from "./ConversationPairView.module.css";
import { extractTwoValues } from "../../../../app/utils/extractTwoValues";
import { ConversationPair } from "../../../../interfaces";
import TickerList from "../../../TickerList";
import { useLanguage } from "../../../../app/hooks/useLanguage";

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


  const nothingYet = !pair.assistant && !pair.code && !pair.analysisData && !pair.suggestionData;
  const {currentLang} = useLanguage()
  const [responseHeading, responseContent] = extractTwoValues(pair.assistant || "");
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  const messages = {
    en: {
      heading: "Sorry... For some reason I could not process your request.",
      text: "Please try again or ask for support at hi.finh.cc@gmail.com!",
    },
    ar: {
      heading: "عذرًا... لم أتمكن من معالجة طلبك لسبب ما.",
      text: "يرجى المحاولة مرة أخرى أو طلب الدعم على hi.finh.cc@gmail.com!",
    },
  };
  
  const lang = currentLang === "ar" ? "ar" : "en"; // default to 'en'

  
  useEffect(() => {
    if (nothingYet) {
      const timeout = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 40000); // ⏱ 10 seconds (adjust as needed)
  
      return () => clearTimeout(timeout); // cleanup if component unmounts or re-renders
    }
  }, [nothingYet]);
  
  const languageClass =
  pair.language === "ar"
    ? "rightToLeft"
    : "leftToRight";

  return (
    <motion.div
      key={pair.user}
      initial={{ y: direction === "up" ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: direction === "up" ? -100 : 100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={styles.pairWrapper}
    >
      <div ref={responseRef} className={`${styles.pair} ${languageClass}`}>
        <UserMessage text={pair.user} />

        <div className={styles.assistantResponse}>
          
        {nothingYet ? (
  showTimeoutMessage ? (
<AssistantMessage
  heading={messages[lang].heading}
  text={messages[lang].text}
/>
  ) : (
    <Loading />
  )
) : (
  <>
    {pair.assistant &&
    !pair.analysisData &&
    !pair.tickerListData && (
      <AssistantMessage heading={responseHeading} text={responseContent} />
    )}

    {pair.code && <CodeMessage text={pair.code} />}

    {pair.analysisData && (
      <Analysis
        data={pair.analysisData}
        language={pair.language}
        handleManualFunctionCall={handleManualFunctionCall}
        newSearch={newSearch}
      />
    )}

    {pair.suggestionData && (
      <Suggestion
        data={pair.suggestionData}
        language={pair.language}
        handleManualFunctionCall={handleManualFunctionCall}
      />
    )}

{pair.tickerListData && (
      <TickerList
        data={pair.tickerListData}
        language={pair.language}
        // handleManualFunctionCall={handleManualFunctionCall}
        // newSearch={newSearch}
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