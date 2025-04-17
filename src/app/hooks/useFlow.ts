/*

Try make a hook,

- You update the same both response with more parts...
- You automatically send more queries,
- You dinamically change the message (not just thinking).
- You keep input disabled throughout this...

If one presses the stop button, you interrupt all of it.

The idea is that this hook takes anyflow in...

The analysis should start the flow, with analysis type,
and you should manage state too...

*/

import { useState, useCallback,useEffect, useRef } from "react";
import { useConversation } from "../context/conversationContext";
import { useFunctionCallHandler } from "./useFunctionCallHandler";
import { useLanguage } from "./useLanguage";
import { languageMap } from "../../constants";
import { BotMessagePart } from "../../interfaces";
import { AssistantStream } from "openai/lib/AssistantStream";

import { sendMessage } from "../utils/apiActions";

  interface Step {
    loadingMessage: string;
    action?: () => Promise<any>;
    prompt?: string | ((actionResult: any) => Promise<string> | string);
  }
  type Flow = Step[];
  const firstStepToolCall = {
    function: {
      name: "show_financial_data",
      arguments: '{"ticker":"AAPL","asset_type":"stock","data_type":"income_statement"}',
    },
  };

  const secondStepToolCall = {
    function: {
      name: "show_financial_data",
      arguments: '{"ticker":"AAPL","asset_type":"stock","data_type":"cash_flow_statement"}',
    },
  };

  const thirdStepToolCall = {
    function: {
      name: "show_financial_data",
      arguments: '{"ticker":"AAPL","asset_type":"stock","data_type":"balance_sheet"}',
    },
  };

  export function useFlowRunner(flowId: string, attachHandlers: (stream: AssistantStream) => void) {
    const [isFlowRunning, setIsFlowRunning] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [responseLog, setResponseLog] = useState<string[]>([]);
    const { isRunning, updateLastInteractionBotPart, threadId } = useConversation(); // ✅ Use context
    const threadIdRef = useRef(threadId);
    const { currentLang } = useLanguage();
    const currentLangRef = useRef(currentLang);
  
    useEffect(() => {
      threadIdRef.current = threadId;
    }, [threadId]);
  
    useEffect(() => {
      currentLangRef.current = currentLang;
    }, [currentLang]);
  
    const { functionCallHandler } = useFunctionCallHandler();
  
    // EXAMPLE "tool calls" that each step can invoke
  
    // This function is invoked by each flow step's `action`
    // Returns data so we can feed it into the step.prompt(...) next
    const handleFlowFunction = useCallback(
      async (toolCall: any) => {
        const { name: functionName } = toolCall.function || {};
  
        // Actually call the function via your universal functionCallHandler
        const result = await functionCallHandler(toolCall);
        const parsedResult = JSON.parse(result); // result string → JSON object
        
        console.log("WE ARRIVE INSIDE HANDLE FLOW FUNCTIONS AND NAME IS: ", functionName, " parsed results are: ", parsedResult);

        let newPart: BotMessagePart | null = null;
        let returnValue: any = null;
  
        switch (functionName) {
          case "show_financial_data": {
            // The data from the tool
            const dataResponse = parsedResult.data.response;
  
            // Possibly show a specialized "financials_table" part in the UI
            newPart = {
              type: "financials_table",
              data: dataResponse,
            };
  
            // Optionally send a short message that "we have shown the data to user"
            // Only do this if you still want it:

            const newInput = `This data has been shown to the user: ${JSON.stringify(dataResponse)}.`;
            const response = await sendMessage(threadIdRef.current, newInput);
            const stream = AssistantStream.fromReadableStream(response.body);
            attachHandlers(stream);
  
            // Return the data so we can incorporate it into the next prompt
            returnValue = dataResponse;
            break;
          }
  
          default:
            // If no recognized function, do nothing special
            break;
        }
  
        // Update the last bot message with part, if relevant
        if (newPart) {
          updateLastInteractionBotPart(newPart);
        }
  
        // Return any data you want the step to pass to `prompt(...)`
        return returnValue;
      },
      [functionCallHandler, attachHandlers, updateLastInteractionBotPart]
    );
  
    // Define your multi-step flow
    const stock_analysis_flow: Flow = [
      {
        loadingMessage: "Fetching Stock Overview...",
        action: () => handleFlowFunction(firstStepToolCall),
        prompt: (financialData) =>
          `Can you explain these numbers? The positives, negatives, and implications:\n\n${JSON.stringify(financialData)}`,
      },
      {
        loadingMessage: "Fetching Technical Indicators...",
        action: () => handleFlowFunction(secondStepToolCall),
        prompt: (financialData) =>
          `Now can you do the same analysis for these new numbers?\n\n${JSON.stringify(financialData)}`,
      },
      {
        loadingMessage: "Fetching Income Statement...",
        action: () => handleFlowFunction(thirdStepToolCall),
        prompt: (financialData) =>
          `Finally, any key takeaways from this data?\n\n${JSON.stringify(financialData)}`,
      },
    ];
  
    // You may add more flows if needed
    const flows: Record<string, Flow> = {
      stock_analysis: stock_analysis_flow,
      // ...other flows
    };
  
    const steps = flows[flowId] || [];
    const isStepInProgress = useRef(false);
  
    // When the bot finishes responding (`isRunning` goes false), move to next step
    useEffect(() => {


      if (!isRunning && isStepInProgress.current && isFlowRunning) {
        isStepInProgress.current = false;
  
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
          setCurrentStepIndex(nextIndex);
        } else {
          // Flow is done
          setIsFlowRunning(false);
        }
      }
    }, [isRunning, isFlowRunning, currentStepIndex, steps.length]);
  
    // Whenever `currentStepIndex` changes (and we are in "flow running" mode),
    // run that step's action + send the prompt
    useEffect(() => {

      // -1 false true 
      if (!isFlowRunning || isRunning) return;
  
      const step = steps[currentStepIndex];
      if (!step) return;
  
      isStepInProgress.current = true;
      setLoadingMessage(step.loadingMessage);
  
      const runStep = async () => {
        let actionResult = null;
  
        // 1) Run the step's action (e.g. tool call) if any
        if (step.action) {
          actionResult = await step.action();
        }
  
        // 2) Generate the prompt from the action result
        let promptText =
          typeof step.prompt === "function"
            ? await step.prompt(actionResult)
            : step.prompt;
         console.log("PROMPT TEXT IS: ", promptText);
        if (promptText) {
          console.log("ok we are sending THE MESSAGE");
          // 3) Actually send that prompt to the bot so we get a new assistant response
          const response = await sendMessage(threadIdRef.current, promptText);
          const stream = AssistantStream.fromReadableStream(response.body);
          attachHandlers(stream);
        }
      };
  
      runStep();
    }, [currentStepIndex, isFlowRunning, isRunning, steps, attachHandlers]);
  
    // Initiate the flow from step index 0
    const startFlow = () => {
      console.log("🚀 STARTING FLOW...");
      setCurrentStepIndex(0);
      setResponseLog([]);
      setIsFlowRunning(true);
    };
  
    return {
      isFlowRunning,
      currentStepIndex,
      loadingMessage,
      startFlow,
      responseLog,
    };
  }
  