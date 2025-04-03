

import { useCallback, useRef, useEffect } from "react";
import { useConversation } from "../context/conversationContext";
import { submitActionResult } from "../utils/apiActions";
import { AssistantStream } from "openai/lib/AssistantStream";
// import { functionCallHandler } from "../utils/functionCallHandler";
import { attachStreamHandlers } from "../utils/streamHandlers";
import { useFunctionCallHandler } from "./useFunctionCallHandler";
import { useLanguage } from "./useLanguage";
import { languageMap } from "../../constants";
import { BotMessagePart } from "../../interfaces";

export interface ParsedResult {
  success: boolean;
  response: any; // The main data returned by the function
}

export interface ToolCall {
  id: string;
  type: "code_interpreter" | string;
  function: {
    name: string;
    arguments: string;
  };
}

/**
 * - successPart?: returns either a BotMessagePart or null if we don't want to show anything in the UI
 * - successOutput: always returns a string (the message for the model to consume)
 * - failOutput: message for the model if success=false
 */

export interface FunctionHandlerConfig {
  successPart?: (parsedResult: ParsedResult, userLanguage: string) => BotMessagePart | null;
  successOutput: (parsedResult: ParsedResult, userLanguage: string) => string;
  failOutput: (parsedResult: ParsedResult, userLanguage: string) => string;
}

export const functionHandlers: Record<string, FunctionHandlerConfig> = {
  analyze_security: {
    // We DO want a part in the UI
    successPart: (parsedResult, userLanguage) => ({
      type: "ticker_analysis",
      data: parsedResult.response,
    }),
    // We'll send a combined JSON object: a "message" plus the raw "data"
    successOutput: (parsedResult, userLanguage) => JSON.stringify({
      message: `Analysis complete in ${userLanguage}`,
      data: parsedResult.response,
    }),
    failOutput: (parsedResult, userLanguage) =>
      `We encountered an error analyzing the security. The user speaks ${userLanguage}.`
  },

  list_tickers: {
    // We DO want a part in the UI
    successPart: (parsedResult, userLanguage) => ({
      type: "tickers_list",
      data: parsedResult.response,
    }),
    successOutput: (parsedResult, userLanguage) => JSON.stringify({
      message: `We found these tickers. The user speaks ${userLanguage}.`,
      data: parsedResult.response,
    }),
    failOutput: (parsedResult, userLanguage) =>
      `Listing tickers failed. The user speaks ${userLanguage}.`
  },

  // Example: "some_tool" has NO UI part on success
  // we just want to return data to GPT and let GPT figure out the next step
  some_tool: {
    // No successPart property -> no UI part
    successOutput: (parsedResult, userLanguage) => JSON.stringify({
      message: `some_tool result. The user is ${userLanguage}.`,
      data: parsedResult.response
    }),
    failOutput: (parsedResult, userLanguage) =>
      `some_tool failed. The user speaks ${userLanguage}.`
  },
};

/**
 * A default config for unrecognized function names
 */

export const defaultFunctionHandler: FunctionHandlerConfig = {
  successOutput: (parsedResult, userLanguage) => JSON.stringify({
    message: `Function not recognized. The user speaks ${userLanguage}.`,
    data: parsedResult.response
  }),
  failOutput: (parsedResult, userLanguage) =>
    `Function not recognized. The user speaks ${userLanguage}.`,
};

export function useStreamHandlers() {

  const { updateLastInteractionBotPart, appendAssistantText, setConversationPairs, setInputDisabled, threadId } = useConversation(); // ✅ Use context
  const threadIdRef = useRef(threadId);

  const {currentLang} = useLanguage();
  const currentLangRef = useRef(currentLang);

// Update the ref whenever threadId changes
useEffect(() => {
  threadIdRef.current = threadId;
}, [threadId]);
  
useEffect(() => {
  currentLangRef.current = currentLang;
}, [currentLang]);
  
  const {functionCallHandler} = useFunctionCallHandler()
  const onTextCreated = useCallback(() => {
   return
  }, []);

  const onTextDelta = useCallback((delta: any) => {
    if (delta.value) {
      appendAssistantText(delta.value);
    }
  }, [appendAssistantText]);
  
  const onToolCallCreated = useCallback((toolCall: ToolCall) => {
    if (toolCall.type === "code_interpreter") {
      updateLastInteractionBotPart({
        type: "tool_output",
        toolName: "code_interpreter",
        input: "",
      });
    }
  }, [updateLastInteractionBotPart]);
  
  const onToolCallDelta = useCallback((delta: any) => {
    if (delta.type === "code_interpreter" && delta.code_interpreter?.input) {
      setConversationPairs((prev) => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        last.code = (last.code || "") + delta.code_interpreter.input;
        return [...prev.slice(0, -1), last];
      });
    }
  }, [setConversationPairs]);

  const attachHandlers = (stream: AssistantStream) => {
    attachStreamHandlers(stream, {
      onTextCreated,
      onTextDelta,
      onToolCallCreated,
      onToolCallDelta,
      onRequiresAction: async (event: any) => {
        await onRequiresAction(event, functionCallHandler);
        setInputDisabled(false);
      },
      onRunCompleted: () => setInputDisabled(false),
    });
  };

  const onRequiresAction = useCallback(
  async (
    event: any,
    functionCallHandler: (toolCall: any) => Promise<string>
  ) => {
    // Extract needed info from event
    const toolCalls: ToolCall[] =
      event?.data?.required_action?.submit_tool_outputs?.tool_calls || [];
    const runId = event?.data?.id;
  
    // We'll accumulate these to send back to OpenAI
    const toolCallOutputs: { tool_call_id: string; output: string }[] = [];
  
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function?.name || "unknown_function";
      const functionConfig = functionHandlers[functionName] || defaultFunctionHandler;
  
      // call the function
      const resultString = await functionCallHandler(toolCall);
      const parsedResult: ParsedResult = JSON.parse(resultString);
  
      if (parsedResult.success) {
        // Optionally add a UI part if successPart is defined
        if (functionConfig.successPart) {
          const newPart = functionConfig.successPart(parsedResult,  currentLangRef.current );
          if (newPart) {
            updateLastInteractionBotPart(newPart);
          }
        }
  
        // Always send successOutput to the model
        toolCallOutputs.push({
          tool_call_id: toolCall.id,
          output: functionConfig.successOutput(parsedResult,  currentLangRef.current ),
        });
      } else {
        // fail → no UI part, just send failOutput
        toolCallOutputs.push({
          tool_call_id: toolCall.id,
          output: functionConfig.failOutput(parsedResult,  currentLangRef.current ),
        });
      }
    }
  
    if (toolCallOutputs.length > 0) {
      // Submit back to the model
      const response = await submitActionResult(threadId, runId, toolCallOutputs);
      const stream = AssistantStream.fromReadableStream(response.body);
      attachHandlers(stream);
    } else {
      // If no outputs, re-enable user input
      setInputDisabled(false);
    }
  }, [ [threadId, attachHandlers]])

  return { onTextCreated, onTextDelta, onToolCallCreated, onToolCallDelta, onRequiresAction, attachHandlers };
}




/* here check the stock openai is asking analysis for, and if not in database, return to openai the data,
and set */

/*
The way we are doing it now,
it add parts to a list to be displayed...

but we are displaying a stream...
so it should always first speak, and then show you stuff...

What if it is able to call and show graphs?

You should be able to add a function:
show_chart...
and see what happens when you do it...

Because again what you do it adding to parts, and it will be rendered...

Option 1:
1. Before adding the part to the component, 











- SEE HOW THE STREAM OF EVENTS ACTUALLY WORK TO DECIDE HOW TO HANDLE IT.
- ...




The other option is that you give gpt the ability to:
- Display a chart or a table or a graph of different kind
- Fetch financial information about particular equities
- Search the web



---

And give back the results as well to him by saying: chart has been shown to user.

Etc.

FetchTickersSnaphotInfo
FetchTickersFinancials
FetchComparisonData
ShowComparisonTable
ShowComparisonChart

And gpt will know how to do it.


*/



/*
Another option is: WHERE THERE IS THE TOOL CALL
YOU INSERT A COMPONENT, THAT IS GENERIC FOR DATA_COMPONENT...
AND THEN THE DATA WILL BE GENERATED THERE... BUT THE STREAM CONTINUES...

SO THAT GPT CAN ... 

PROBABLY THIS WOULD BE THE BEST WAY...
And can be done also for strategies... and portfolios... show the portfolio table... and then 

*/