"use client";
import React, { useState, useEffect, useRef ,FormEvent} from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
// @ts-expect-error - no types for this yet
import ChatInput from './components/ChatInput';
import { attachStreamHandlers } from "./utils/streamHandlers";
import { createThread, sendMessage, submitActionResult } from "./utils/apiActions";
import ConversationPairView from "./components/ConversationPairView";
import { useSlideshowNavigation } from "../../app/hooks/useSlideShowNavigation";
import { handleManualFunctionCall } from "./utils/handleManualFunctionCall";

export interface ConversationPair {
  user: string;
  assistant: string;
  code?: string;
  analysisData?: any; // or a more specific type if you know the shape of the analysis
  suggestionData?: any; // or a more specific type if you know the shape of the analysis
}

interface ChatProps {
  functionCallHandler?: (toolCall: any) => Promise<string>;
}

export default function BotChat({
  functionCallHandler = () => Promise.resolve(""),
}: ChatProps) {
  
  
  const [conversationPairs, setConversationPairs] = useState<ConversationPair[]>([]);
  const isFirstPrompt = conversationPairs.length === 0; 
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");

  // Which pair is currently shown (slideshow index)
  const [currentIndex, setCurrentIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { handleWheel, responseRef, direction } = useSlideshowNavigation(currentIndex, setCurrentIndex, conversationPairs.length);

  useEffect(() => {
    async function setupThread() {
      const data = await createThread();
      setThreadId(data.threadId);
    }
    setupThread();
  }, []);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setConversationPairs((prev) => [...prev, { user: userInput, assistant: "" }]);
    setCurrentIndex((prev) => prev + 1);
    setUserInput("");
    setInputDisabled(true);
    const response = await sendMessage(threadId, userInput);
    const stream = AssistantStream.fromReadableStream(response.body);
    attachHandlers(stream);
  };

  const newSearch = async (prompt: string) => {
    if (!prompt.trim()) return;
  
    setConversationPairs((prev) => [...prev, { user: prompt, assistant: "" }]);
    setCurrentIndex((prev) => prev + 1);
    setUserInput(""); // Clear the input (optional)
    setInputDisabled(true);
  
    // Send message to OpenAI
    const response = await sendMessage(threadId, prompt);
    
    const stream = AssistantStream.fromReadableStream(response.body);
    attachHandlers(stream);
  };
  

const onManualFunctionCall = async (functionName: string, args: any) => {
 // setIsLoading(true); // ✅ Start loading before function call
  await handleManualFunctionCall(
    functionName,
    args,
    setConversationPairs,
    setCurrentIndex,
    functionCallHandler
  );
  // setIsLoading(false); // ✅ Start loading before function call
};

  const onTextCreated = () => {
   
    setConversationPairs((prev) => {
      const last = { ...prev[prev.length - 1] };
      if (last.assistant === undefined) {
        last.assistant = "";
      }
      return [...prev.slice(0, -1), last];
    });

  };

  const onTextDelta = (delta: any) => {
    
    if (delta.value) {
      setConversationPairs((prev) => {
        const last = { ...prev[prev.length - 1] };
        last.assistant += delta.value;
        return [...prev.slice(0, -1), last];
      });

    }
  };


  const onToolCallCreated = (toolCall: any) => {
    if (toolCall.type === "code_interpreter") {
      setConversationPairs((prev) => {
        const last = { ...prev[prev.length - 1] };
        if (!last.code) last.code = "";
        return [...prev.slice(0, -1), last];
      });
    }
  };

  const onToolCallDelta = (delta: any, snapshot: any) => {
    if (delta.type === "code_interpreter" && delta.code_interpreter?.input) {
      setConversationPairs((prev) => {
        const last = { ...prev[prev.length - 1] };
        if (!last.code) last.code = "";
        last.code += delta.code_interpreter.input;
        return [...prev.slice(0, -1), last];
      });
    }
  };


const onRequiresAction = async (event: any) => {
  const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
  
  const toolCallOutputs = await Promise.all(
    toolCalls.map(async (toolCall: any) => {
      const result = await functionCallHandler(toolCall);
      const parsedResult = JSON.parse(result);

      setConversationPairs((prev) => {
        const last = { ...prev[prev.length - 1] };

        // ✅ Remove assistant's text response
        last.assistant = ""; 

        // ✅ Store function results correctly
        if (toolCall.function?.name === "analyze_security") {
          last.analysisData = parsedResult;
        } else if (toolCall.function?.name === "suggest_securities") {
          last.suggestionData = parsedResult;
        }

        return [...prev.slice(0, -1), last];
      });

      return { output: result, tool_call_id: toolCall.id };
    })
  );

  // ✅ Remove OpenAI’s follow-up response
  // DO NOT CALL submitActionResult(threadId, runId, toolCallOutputs);

  setInputDisabled(false); // ✅ Allow user input again
};



  const onRunCompleted = () => {
    setInputDisabled(false);
  };

  /* Attach event handlers to the stream */
  const attachHandlers = (stream: AssistantStream) => {
    attachStreamHandlers(stream, {
      onTextCreated,
      onTextDelta,
      onToolCallCreated,
      onToolCallDelta,
      onRequiresAction,
      onRunCompleted,
    });
  };

  /*  Render  */

  return (
    <div
      className={styles.slideContainer}
      onWheel={handleWheel}
      ref={containerRef}
    >

{conversationPairs.length > 0 && (
  <ConversationPairView
    key={currentIndex} // ✅ Keeps scrolling functional
    pair={conversationPairs[currentIndex]} // ✅ Uses `currentIndex`
    direction={direction}
    responseRef={responseRef}
    handleManualFunctionCall={onManualFunctionCall}
    newSearch={newSearch}
  />
)

}

<ChatInput
  isFirstPrompt={isFirstPrompt}
  userInput={userInput}
  setUserInput={setUserInput}
  handleSubmit={handleSubmit}
  inputDisabled={inputDisabled}
  handleManualFunctionCall={onManualFunctionCall} // <-- NEW PROP
  
/></div>

   
  );
}

