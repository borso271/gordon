import React, {useState, useEffect, useRef} from "react";
import { motion } from "framer-motion";
import UserMessage from "../UserMessage";
import AssistantMessage from "../AssistantMessage";
import CodeMessage from "../CodeMessage";
import Analysis from "../../../Analysis";
import Suggestion from "../../../Suggestion";
import Loading from "../../../Loading";
import styles from "./ConversationPairView.module.css";
import { extractTwoValues } from "../../../../app/utils/extractTwoValues";
import { Interaction, BotMessagePart} from "../../../../interfaces";
import TickerList from "../../../TickerList";
import { useLanguage } from "../../../../app/hooks/useLanguage";
// import TradingViewChart from '../../../TradingView/Chart'
import TradingViewSingleChart from '../../../TradingView/SingleChart'
import ActionsGroup from "../../../ActionsGroup";
import shareContent from "../../../../app/utils/shareContent";
import copyToClipboard from "../../../../app/utils/copyToClipboard";
import { useTranslation } from 'react-i18next';
import DataTable from "../../../DataTable";
import FollowUps from "../../../FollowUps";
import { useConversation } from "../../../../app/context/conversationContext";
import { createQueryFromBotParts } from "../../../../app/utils/createQueryFromBotParts";
interface ConversationPairViewProps {
  interaction: Interaction;    // renamed from pair
  direction?: "up" | "down";
  responseRef?: React.RefObject<HTMLDivElement>;
  handleManualFunctionCall?: (...args: any) => void;
  newSearch?: (prompt: string) => Promise<void>;
}

const ConversationPairView: React.FC<ConversationPairViewProps> = ({
  interaction,
  direction,
  responseRef,
  handleManualFunctionCall,
  newSearch,
}) => {

  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

const [followUpSuggestions, setFollowUpSuggestions] = useState<Array<string>>([]);


const userText = interaction.userMessage.text || "";

// Extract bot parts
const botParts = interaction.botMessage.parts || [];
// inside your component


const { isRunning } = useConversation(); // from Zustand or context
// const prevIsRunning = useRef<boolean>(false);
console.log("initial is Running is: ", isRunning)
useEffect(() => {
 console.log("is running is: ", isRunning)
}, [isRunning, botParts]);

const prevIsRunning = useRef<boolean>(isRunning);

useEffect(() => {
  // Detect transition from true → false
  if (prevIsRunning.current === true && isRunning === false) {
    console.log("Bot finished running (transitioned from true to false)");

    const query = createQueryFromBotParts(botParts, 300);

    if (query) {
      fetch("/api/follow_ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.result) && data.result.length > 0) {
            setFollowUpSuggestions(data.result);
          } else {
            setFollowUpSuggestions([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching follow-ups:", err);
          setFollowUpSuggestions([]); // fallback to empty array on error
        });
    }
  }

  // Update ref so next render can compare
  prevIsRunning.current = isRunning;
}, [isRunning, botParts]);


useEffect(() => {
  console.log("RE-RENDER: isRunning is now", isRunning);
}, [isRunning]);

  // Check if we have *no* content from the bot yet (use your own logic)
  // e.g., if only one text part with empty content, or array is empty => "nothingYet"
  const nothingYet =
    botParts.length === 0 ||
    (botParts.length === 1 &&
      botParts[0].type === "assistantText" &&
      botParts[0].content.trim() === "");

  // Timeout logic (similar to your old approach)
  useEffect(() => {
    if (nothingYet) {
      const timeout = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 40000); // 40s or whatever you need
      return () => clearTimeout(timeout);
    }
  }, [nothingYet]);

  // If no content arrives, show a fallback
  const messages = {
    en: {
      heading: "Sorry... For some reason I could not process your request.",
      text: "Sorry... For some reason I could not process your request. Please try again or ask for support at hi.finh.cc@gmail.com!",
    },
    ar: {
      heading: "عذرًا... لم أتمكن من معالجة طلبك لسبب ما.",
      text: "يرجى المحاولة مرة أخرى أو طلب الدعم على hi.finh.cc@gmail.com! عذرًا... لم أتمكن من معالجة طلبك لسبب ما.",
    },
  };
  const lang = currentLang === "ar" ? "ar" : "en"; // fallback to 'en'

  // Render logic for each part
  const renderBotPart = (part: BotMessagePart, index: number) => {
    //console.log("PART type IS: ", part.type);
    switch (part.type) {
      case "assistantText":
        // If you used to do "pair.assistant" → text, you can parse heading vs text if you want
        return (
          <AssistantMessage
            key={index}
            heading={""} // or parse a heading from content if you want
            text={part.content}
          />
        );

        case "tickers_chart":
          return (
          <TradingViewSingleChart
          language = {interaction.language}
            symbol = {part.data.tickers[0]}
             currency = {part.data.currency}
                /> )

      case "ticker_analysis":
        return (
        <Analysis
                data={part.data}
                language={interaction.language}
                handleManualFunctionCall={handleManualFunctionCall}
                newSearch={newSearch}
              /> )

      case "financials_table":
        return (
        <DataTable 
        title = {part.data.title}
        data = {part.data.data}
        />)
        return null;

      case "tool_output":
        // Could be code interpreter or something else
        if (part.toolName === "code_interpreter") {
          // render the result of code interpreter, or some
          // specialized <CodeInterpreterOutput> component
          return <div key={index}>Code interpreter output goes here</div>;
        }
        return null;

      default:
        return null;
    }
  };

  // Determine language direction for this conversation
  const languageClass =
    interaction.userMessage.language === "ar" ? "rightToLeft" : "leftToRight";

  return (
    <motion.div
      key={interaction.id}
      initial={{ y: direction === "up" ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: direction === "up" ? -100 : 100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className={styles.pairWrapper}
    >
      <div ref={responseRef} className={`${styles.pair} ${languageClass}`}>
        {/* Show user message */}

        <UserMessage text={userText} />
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

          //  We have some bot parts, so render them all
          //  botParts.map(renderBotPart)

            botParts.map((part, index) => (
              <React.Fragment key={part.type + "-" + index}>
                {renderBotPart(part, index)}
              </React.Fragment>
            ))

          )}
          
        </div>
        <ActionsGroup
        actions={[
          { iconName: "share", text: t("share"), onClick: () => shareContent("hello") },
          { iconName: "copy", text: t("copy"), onClick: () => copyToClipboard("hello") },
        ]}

        
        
        /* here you show the follow ups, when the response is finished...
        you send the first part of the response */

      />

{followUpSuggestions.length > 0 && (
 
    
          <FollowUps suggestions={followUpSuggestions} newSearch={newSearch} />
         
        )}
        </div>
      
    </motion.div>
  );
};

export default ConversationPairView;
// interface ConversationPairViewProps {
//   pair: Interaction;
//   direction: "up" | "down";
//   responseRef: RefObject<HTMLDivElement>;
//   handleManualFunctionCall: (functionName: string, args: any) => void;
//  newSearch: (prompt: string) => Promise<void>
// }

// const ConversationPairView: React.FC<ConversationPairViewProps> = ({
//   pair,
//   direction,
//   responseRef,
//   handleManualFunctionCall,
//   newSearch,
// }) => {

//   const nothingYet = !pair.assistant && !pair.code && !pair.analysisData && !pair.suggestionData;
//   const {currentLang} = useLanguage()
//   const [responseHeading, responseContent] = extractTwoValues(pair.assistant || "");
//   const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

//   const messages = {
//     en: {
//       heading: "Sorry... For some reason I could not process your request.",
//       text: "Please try again or ask for support at hi.finh.cc@gmail.com!",
//     },
//     ar: {
//       heading: "عذرًا... لم أتمكن من معالجة طلبك لسبب ما.",
//       text: "يرجى المحاولة مرة أخرى أو طلب الدعم على hi.finh.cc@gmail.com!",
//     },
//   };
  
//   const lang = currentLang === "ar" ? "ar" : "en"; // default to 'en'
  
//   useEffect(() => {
//     if (nothingYet) {
//       const timeout = setTimeout(() => {
//         setShowTimeoutMessage(true);
//       }, 40000); // ⏱ 10 seconds (adjust as needed)
  
//       return () => clearTimeout(timeout); // cleanup if component unmounts or re-renders
//     }
//   }, [nothingYet]);
  
//   const languageClass =
//   pair.language === "ar"
//     ? "rightToLeft"
//     : "leftToRight";

//   return (
//     <motion.div
//       key={pair.user}
//       initial={{ y: direction === "up" ? 100 : -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       exit={{ y: direction === "up" ? -100 : 100, opacity: 0 }}
//       transition={{ duration: 1, ease: "easeInOut" }}
//       className={styles.pairWrapper}
//     >
//       <div ref={responseRef} className={`${styles.pair} ${languageClass}`}>
//         <UserMessage text={pair.user} />

//         <div className={styles.assistantResponse}>
          
//         {nothingYet ? (
//   showTimeoutMessage ? (
// <AssistantMessage
//   heading={messages[lang].heading}
//   text={messages[lang].text}
// />
//   ) : (
//     <Loading />
//   )
// ) : (
//   <>
//     {pair.assistant &&
//     !pair.analysisData &&
//     !pair.tickerListData && (
//       <AssistantMessage heading={responseHeading} text={responseContent} />
//     )}

//     {pair.code && <CodeMessage text={pair.code} />}

//     {pair.analysisData && (
//       <Analysis
//         data={pair.analysisData}
//         language={pair.language}
//         handleManualFunctionCall={handleManualFunctionCall}
//         newSearch={newSearch}
//       />
//     )}

//     {pair.suggestionData && (
//       <Suggestion
//         data={pair.suggestionData}
//         language={pair.language}
//         handleManualFunctionCall={handleManualFunctionCall}
//       />
//     )}

// {pair.tickerListData && (
//       <TickerList
//         data={pair.tickerListData}
//         language={pair.language}
//         // handleManualFunctionCall={handleManualFunctionCall}
//         // newSearch={newSearch}
//       />
//     )}
//   </>
// )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ConversationPairView;



