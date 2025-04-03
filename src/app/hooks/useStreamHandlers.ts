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

type ToolCall = {
  type: "code_interpreter" | string;
  [key: string]: any;
};


function prepareToolOutput(output: unknown, fallback = "No output provided."): string {
  if (output === null || output === undefined) {
    return fallback;
  }

  if (typeof output === "string") {
    return output;
  }

  try {
    return JSON.stringify(output);
  } catch (err) {
    console.warn("Could not stringify tool output:", err);
    return fallback;
  }
}


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
    console.log("📝 onTextCreated")
  }, []);


  const onTextDelta = useCallback((delta: any) => {
  
    if (delta.value) {
      // console.log("🔄 onTextDelta", {
      //   delta: delta.delta,
      //   timestamp: new Date().toISOString()
      // });
      appendAssistantText(delta.value);
    }
  }, [appendAssistantText]);

 
  
  const onToolCallCreated = useCallback((toolCall: ToolCall) => {
    console.log("🛠️ onToolCallCreated", {
      toolCall: toolCall,
      toolName: toolCall.name,
      args: toolCall.args,
      timestamp: new Date().toISOString()
    });
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


  // const availableSymbols = ["AAPL", "TSLA", "MSFT"]; // or fetch dynamically if needed

  // if (functionName === "analyze_security") {
  //   const symbol = parsedArgs.symbol;
    
  //     if (!availableSymbols.includes(symbol)) {
        
  //       const friendlyMessage = `The selected stock "${symbol}" is not available since this is only a prototype. Inform the user about this and tell the user that the available symbols are: ${availableSymbols.join(", ")}. The user speaks ${userLanguage} so reply in this language.`;
  
  //     toolCallOutputs.push({
  //       tool_call_id: toolCall.id,
  //       output:  friendlyMessage,
      
  //     });
  
  //     console.log("⚠️ Symbol not supported, sending custom output to OpenAI:", symbol);
  //     continue; // ❌ Skip normal function call
  //   }
  // }





  // const onRequiresAction = useCallback(
  //   async (
  //     event: any,
  //     functionCallHandler: (toolCall: any) => Promise<string>
  //   ) => {
  //     console.log("📥 onRequiresAction", {
  //       event,
  //       timestamp: new Date().toISOString()
  //     });
  //     const userLanguage = languageMap[currentLangRef.current]

  //     const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
  //     const runId = event.data.id;

  
  //     const toolCallOutputs: { tool_call_id: string; output: string }[] = [];
  
  //     for (const toolCall of toolCalls) {
  //       // toolCall.function.arguments.language = currentLang;
  //       const functionName = toolCall.function?.name;
  //       console.log("And name of tool call function is: ", functionName)

  //       const parsedArgs = JSON.parse(toolCall.function.arguments);

  //       // console.log("parsed args are: ", parsedArgs)

  //       const result = await functionCallHandler(toolCall);
  //       const parsedResult = JSON.parse(result);
  
  //       // Update local UI state based on function

  //       setConversationPairs((prev) => {
  //         if (prev.length === 0) return prev;
  //         const last = { ...prev[prev.length - 1] };
  //         last.assistant = "";
  
  //         if (functionName === "analyze_security") {
  //           last.analysisData = parsedResult;
            
  //           // console.log("thread id in analyze secrutiry is : ", threadIdRef.current);
  //           toolCallOutputs.push({
  //             tool_call_id: toolCall.id,
  //             output: parsedResult,
  //           });

  //         } else if (functionName === "suggest_securities") {
  //           last.suggestionData = parsedResult;
  //         }
  //         else if (functionName === "list_tickers") {

  //           // console.log("parsed results are: ", parsedResult)
  //           if (parsedResult.success == true){
  //           last.tickerListData = parsedResult.response;
  //           // console.log("parsed results is: ", parsedResult);
  //           toolCallOutputs.push({
  //             tool_call_id: toolCall.id,
  //             output: JSON.stringify(parsedResult.response),
  //           });
            
  //         }
  //           else {
  //             toolCallOutputs.push({
  //               tool_call_id: toolCall.id,
  //               output: `the custom search failed, so call search_web instead for a list of tickers satisfying the user request. Tell the user that for some reason we could not find the data requested in our database, but you search the web instead, and found something. The user speaks ${userLanguage} so reply in this language.`,
  //             });
  //           }
  //         }  
  //         return [...prev.slice(0, -1), last];
  //       });
        
  //       // ✅ Only push to OpenAI if function is "search_web"

  //       if (functionName === "search_web") {
  //         toolCallOutputs.push({
  //           tool_call_id: toolCall.id,
  //           output:  `The user speaks ${userLanguage} so reply in this language. These are the search results: ` + result,
  //         });
  //       }
  //     }

  //     // ✅ Only submit back to OpenAI and continue the stream if allowed
  //     if (toolCallOutputs.length > 0) {

  //       const response = await submitActionResult(threadIdRef.current, runId, toolCallOutputs);
        
  //       const stream = AssistantStream.fromReadableStream(response.body);

  //       attachHandlers(stream);

  //     } else {
  //       // ❌ If nothing to submit to OpenAI, just re-enable input
  //       setInputDisabled(false);
  //     }
  //   },
  //   [setConversationPairs, threadId, attachHandlers]
  // );


  const onRequiresAction = useCallback(
      async (
        event: any,
        functionCallHandler: (toolCall: any) => Promise<string>
      ) => {
    
      // Figure out user language for fallback messages
      const userLanguage = languageMap[currentLangRef.current];
      // Extract the relevant arrays from event data
      const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls || [];
      const runId = event.data.id;

      // We'll accumulate these to send back to OpenAI
      const toolCallOutputs: { tool_call_id: string; output: string }[] = [];

      for (const toolCall of toolCalls) {
        const functionName = toolCall.function?.name;
        console.log("action required, and function name is: ", functionName)
     
        const parsedArgs = JSON.parse(toolCall.function.arguments || "{}");

        // 1) Evaluate the function call via your external handler

        const result = await functionCallHandler(toolCall);

        const parsedResult = JSON.parse(result); // result string → JSON object
        console.log("PARSED RESULTS ARE: ", parsedResult)
        // 2) Create the BotMessagePart and handle the logic for each functionName
        //    (Here we store everything in a "data" object, or use specialized types.)
        let newPart: BotMessagePart | null = null;

        switch (functionName) {

          case "show_tickers_chart":
            console.log("show chart called and arguments are: ", parsedArgs)
            newPart = {
              type: "tickers_chart",
              data: parsedArgs,
            };
            // Add to toolCallOutputs if needed
            // toolCallOutputs.push({
            //   tool_call_id: toolCall.id,
            //   output: JSON.stringify(parsedResult),
            // });

            break;

            case "analyze_ticker":
              console.log("analyze_ticker called and arguments are: ", parsedArgs)
              const toolCallOutput = prepareToolOutput(parsedResult.data.response);
              console.log("tool call output is: ", toolCallOutput)
              // Add to toolCallOutputs if needed
              toolCallOutputs.push({
                tool_call_id: toolCall.id,
                output: toolCallOutput,
              });
              break;

              case "show_financial_data":
                console.log("show_financial_data called and arguments are: ", parsedArgs)
                newPart = {
                  type: "financials_table",
                  data: parsedResult.data.response,
                };
                // No need to add to toolCallOutputs for this function
                // toolCallOutputs.push({
                //   tool_call_id: toolCall.id,
                //   output: JSON.stringify(parsedResult),
                // });

                break;

          case "analyze_security":
            newPart = {
              type: "ticker_analysis",
              data: parsedResult,
            };
            // Add to toolCallOutputs if needed
            toolCallOutputs.push({
              tool_call_id: toolCall.id,
              output: JSON.stringify(parsedResult),
            });
            break;

          case "suggest_securities":
            newPart = {
              type: "assistantText",
              content: "Here are some suggestions", // or a multi-language object
              data: parsedResult,
            };
            // Maybe we do not push to toolCallOutputs for this function
            break;

          case "list_tickers":
            if (parsedResult.success) {
              newPart = {
                type: "tickers_list",
                data: parsedResult.response,
              };
              // Also push to OpenAI
              toolCallOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify(parsedResult.response),
              });
            } else {
              // Fallback: partial success or fail → instruct the assistant to do something else
              newPart = {
                type: "assistantText",
                content: `For some reason, no data found. Searching the web... (User speaks ${userLanguage}).`,
                data: parsedResult,
              };
              toolCallOutputs.push({
                tool_call_id: toolCall.id,
                output: `the custom search failed, so call search_web instead for a list of tickers. The user speaks ${userLanguage}, so reply in this language.`
              });
            }
            break;

          case "search_web":
            // newPart = {
            //   type: "assistantText",
            //   content: "Got these search results:",
            //   data: parsedResult,
            // };
            // Return the results to the model so it can proceed
            toolCallOutputs.push({
              tool_call_id: toolCall.id,
              output: `The user speaks ${userLanguage}. These are the search results: ${result}`,
            });
            break;

          default:
            // If no specialized logic, just store result in a general text/data part
            newPart = {
              type: "assistantText",
              content: `Function ${functionName} not explicitly handled. Data: ${JSON.stringify(parsedResult)}`,
              data: parsedResult,
            };
            break;
        }

        // 3) Update the last interaction's bot message, if we have a part
        if (newPart) {
          updateLastInteractionBotPart(newPart);
        }
      }

      // 4) If we have toolCallOutputs, we must submit them back to OpenAI
      if (toolCallOutputs.length > 0) {
        const response = await submitActionResult(threadIdRef.current, runId, toolCallOutputs);
        const stream = AssistantStream.fromReadableStream(response.body);
        attachHandlers(stream);
      } else {
        // If nothing to submit, re-enable user input
        setInputDisabled(false);
      }
    },
    [
      currentLangRef,
      threadIdRef,
      setInputDisabled,
      attachHandlers,
      functionCallHandler,
    ]
  );


  return { onTextCreated, onTextDelta, onToolCallCreated, onToolCallDelta, onRequiresAction, attachHandlers };
}

/* here check the stock openai is asking analysis for, and if not in database, return to openai the data,
and set */









/*



{
  "name": "show_tickers_chart",
  "description": "A function to show tickers chart with ticker symbols and currency.",
  "strict": true,
  "parameters": {
    "type": "object",
    "required": [
      "tickers",
      "currency",
      "chart_type",
      "style"
    ],
    "properties": {
      "tickers": {
        "type": "array",
        "description": "Array of ticker symbols to show in the chart",
        "items": {
          "type": "string",
          "description": "Ticker symbol"
        }
      },
      "currency": {
        "type": "string",
        "description": "Currency for the tickers, defaults to USD if not provided"
      },
      "chart_type": {
        "type": "string",
        "description": "Type of chart to display, can be 'single' or 'comparison'",
        "enum": [
          "single",
          "comparison"
        ]
      },
      "style": {
        "type": "string",
        "description": "Style of the chart, can be 'simple' or 'advanced', defaults to 'simple'",
        "enum": [
          "simple",
          "advanced"
        ]
      }
    },
    "additionalProperties": false
  }
}

*/