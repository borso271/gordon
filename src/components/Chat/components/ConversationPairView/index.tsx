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
import NewsList from "../../../NewNews/NewsList";
import MessageActions from "../../../MessageActions";

interface ConversationPairViewProps {
  interaction: Interaction;    // renamed from pair
  direction?: "up" | "down";
  responseRef?: React.RefObject<HTMLDivElement>;
  handleManualFunctionCall?: (...args: any) => void;
  newSearch?: (prompt: string) => Promise<void>;
}


const handleNewSuggestions = async (
  suggestions: string[],
  interaction: Interaction,
 
  setFollowUpSuggestions: React.Dispatch<React.SetStateAction<string[]>>,
  updateLastInteractionBotParts: any
) => {
  // 1. Update local state
  setFollowUpSuggestions(suggestions);

  const followUpsPart = {
    type: 'follow_ups',
    data: suggestions,
    sidebar: false,
    both: false,
  } as const;

  updateLastInteractionBotParts([followUpsPart], interaction.id)
  // interaction.botMessage.parts.push(followUpsPart);

  // 3. Save to backend
  try {
    await fetch("/api/save_follow_ups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
    
        interaction_id: interaction.id,
        bot_message_id: interaction.botMessage.id,
        suggestions,
      }),
    });
  } catch (error) {
    console.error("Failed to save follow-ups:", error);
  }
};


const ConversationPairView: React.FC<ConversationPairViewProps> = ({
  interaction,
  direction,
  responseRef,
  handleManualFunctionCall,
  newSearch,
}) => {

const { t } = useTranslation();
const { currentLang } = useLanguage();
const {appendAssistantText, setInputDisabled, updateLastInteractionBotParts} = useConversation();

const [assistantText, setAssistantText] = useState("");

const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);



const [followUpSuggestions, setFollowUpSuggestions] = useState<Array<string>>([]);

const userText = interaction.userMessage.text || "";
const botParts = interaction.botMessage.parts || [];


console.log("BOT PARTS ARE: ", botParts)

const filteredParts = botParts.filter(
  (part) => part.sidebar !== true
);

const { isRunning } = useConversation(); // from Zustand or context
useEffect(() => {
  const followUpsPart = botParts.find(p => p.type === 'follow_ups');
if (followUpsPart) setFollowUpSuggestions(Array.isArray(followUpsPart.data) ? followUpsPart.data : JSON.parse(followUpsPart.data));

}, [botParts]);

const prevIsRunning = useRef<boolean>(isRunning);


useEffect(() => {
 
    console.log("Bot finished running (transitioned from true to false)");

    // ✅ Extract assistant text here
    const text = filteredParts
      .filter((part) => part.type === "assistantText")
      .map((part) => part.text)
      .join("\n");

    setAssistantText(text); // 👈 store it for speech or analysis
},[]);


/* THIS IS RECALLED EVERY TIME AND RE-RENDERED */
useEffect(() => {
  if (prevIsRunning.current === true && isRunning === false && followUpSuggestions.length ==0) {
    console.log("Bot finished running (transitioned from true to false)");

    // ✅ Extract assistant text here
    const text = filteredParts
      .filter((part) => part.type === "assistantText")
      .map((part) => part.text)
      .join("\n");

    setAssistantText(text); // 👈 store it for speech or analysis

    const query = createQueryFromBotParts(filteredParts, 300);

    if (query) {
      fetch("/api/follow_ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.result) && data.result.length > 0) {
            // setFollowUpSuggestions(data.result);
            handleNewSuggestions(data.result, interaction,setFollowUpSuggestions,updateLastInteractionBotParts);

           
          } else {
            setFollowUpSuggestions([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching follow-ups:", err);
          setFollowUpSuggestions([]);
        });
    }
  }

  prevIsRunning.current = isRunning;
}, [isRunning, filteredParts]);


useEffect(() => {
  //console.log("RE-RENDER: isRunning is now", isRunning);
}, [isRunning]);

  // Check if we have *no* content from the bot yet (use your own logic)
  // e.g., if only one text part with empty content, or array is empty => "nothingYet"
  const nothingYet =
    filteredParts.length === 0 ||
    (filteredParts.length === 1 &&
      filteredParts[0].type === "assistantText" &&
      filteredParts[0].text.trim() === "");

  // Timeout logic (similar to your old approach)
  useEffect(() => {
    if (nothingYet) {
      const timeout = setTimeout(() => {
        setShowTimeoutMessage(true);
        appendAssistantText(messages[lang].text);
        interaction.status = "failure";
        setInputDisabled(false)
      }, 120000); // 40s or whatever you need
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
    console.log("we are calling this with PART type IS: ", part);
    switch (part.type) {
      case "assistantText":
        // If you used to do "pair.assistant" → text, you can parse heading vs text if you want
        return (
          <AssistantMessage
            key={index}
            heading={""} // or parse a heading from content if you want
            text={part.text}
          />
        );

        case "tickers_chart":
          return (
          <TradingViewSingleChart
          language = {interaction.language}
            symbol = {part.data.tickers[0]}
             currency = {part.data.currency}
                /> )


      case "latest_news":
        console.log("case latest new ")
        return (
        <NewsList 
        // title = {part.data.title}
        data = {part.data}
        />)
      
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


  "e27e3a8d-5c21-489a-8ae7-d7d5c9a39c1a"

  console.log("INTERACTION IS: ", interaction);
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

          filteredParts.map((part, index) => (
              <React.Fragment key={part.type + "-" + index}>
                {renderBotPart(part, index)}
              </React.Fragment>
            ))

          )}
          
        </div>

        <MessageActions
       
        text={assistantText}
        language={interaction.language}
      
      />



{followUpSuggestions.length > 0 && (
          <FollowUps suggestions={followUpSuggestions} newSearch={newSearch} />
         
        )}
        </div>
      
    </motion.div>
  );
};

export default ConversationPairView;


/* Do it only once,
save them as you are doing one,
when you fetch them render them in the follow up part) */