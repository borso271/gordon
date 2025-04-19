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
import { useSaveInteraction } from "./useSaveInteraction";
// import { useFlowRunner } from "./useFlow";

type ToolCall = {
  type: "code_interpreter" | string;
  [key: string]: any;
};

// function prepareToolOutput(output: unknown, fallback = "No output provided."): string {
//   if (output === null || output === undefined) {
//     return fallback;
//   }

//   if (typeof output === "string") {
//     return output;
//   }

//   try {
//     return JSON.stringify(output);
//   } catch (err) {
//     console.warn("Could not stringify tool output:", err);
//     return fallback;
//   }
// }

export function useStreamHandlers() {

  const { updateLastInteractionBotParts, appendAssistantText, setConversationPairs, setInputDisabled, setIsRunning} = useConversation(); // ✅ Use context
  // const threadIdRef = useRef(threadId);
  const {saveInteraction} = useSaveInteraction();
  const {currentLang} = useLanguage();
  const currentLangRef = useRef(currentLang);

useEffect(() => {
  currentLangRef.current = currentLang;
}, [currentLang]);
  
  const {functionCallHandler} = useFunctionCallHandler()

  const onTextCreated = useCallback(() => {
    console.log("📝 onTextCreated")
  }, []);


  const onTextDelta = useCallback((delta: any, threadId: string) => {
    if (delta.value) {
      appendAssistantText(delta.value, threadId); // ✅ Provide threadId
    }
  }, [appendAssistantText]);


  

  const onToolCallCreated = useCallback((toolCall: ToolCall) => {
    console.log("🛠️ onToolCallCreated", {
      toolCall: toolCall,
      toolName: toolCall.name,
      args: toolCall.args,
      timestamp: new Date().toISOString()
    });
 
  }, [updateLastInteractionBotParts]);


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


  const attachHandlers = useCallback((stream: AssistantStream, threadId: string) => {
    attachStreamHandlers(stream, {
      onTextCreated: () => {
        console.log("🟢 onTextCreated");
        onTextCreated();
      },
     
     
      onTextDelta: (event) => {
        onTextDelta(event, threadId); // ✅ Make sure threadId is passed correctly
      },
     
      
      onToolCallCreated: (event) => {
        console.log("🛠️ onToolCallCreated:", event);
        onToolCallCreated(event);
      },
      onToolCallDelta: (event) => {
        console.log("🧩 onToolCallDelta:", event);
        onToolCallDelta(event);
      },
      onRequiresAction: async (event: any) => {
        console.log("🚧 onRequiresAction:", event);
        await onRequiresAction(event, threadId, functionCallHandler);
        setInputDisabled(false);
      },
      onRunCompleted: async () => {
        console.log("✅ onRunCompleted");
        setInputDisabled(false);
        setIsRunning(false);
        await saveInteraction();
      },
    });
  }, [
    onTextCreated,
    onTextDelta,
    onToolCallCreated,
    onToolCallDelta,
    // onRequiresAction,
    functionCallHandler,
    setInputDisabled,
    setIsRunning,
    saveInteraction
  ]);
 
  const onRequiresAction = useCallback(
      async (
        event: any,
        threadId:string,
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

      //  console.log("action required, and TOOL CALL is: ", toolCall)
     
        const parsedArgs = JSON.parse(toolCall.function.arguments || "{}");

        const result = await functionCallHandler(toolCall);
      
        const parsedResult = JSON.parse(result); // result string → JSON object

        console.log("PARSED RESULTS ARE: ", parsedResult)

        // 2) Create the BotMessagePart and handle the logic for each functionName
        //    (Here we store everything in a "data" object, or use specialized types.)
        let newParts: BotMessagePart[] | null = null;

        switch (functionName) {
          case "show_tickers_chart":
            console.log("show chart called and arguments are: ", parsedArgs)
            newParts = [{
              type: "tickers_chart",
              data: parsedArgs,
              sidebar: true,
            }];

          //  Add to toolCallOutputs if needed
            toolCallOutputs.push({
              tool_call_id: toolCall.id,
              output: "ok chart has been shown to user",
            });

            break;

            case "portfolio_overview":
              // console.log("portfolio_overview called and arguments are: ", parsedArgs)
              newParts = [{
                type: "portfolio_overview",
                data: parsedResult.data_for_component,
                sidebar: true,
              }];
  
            //  Add to toolCallOutputs if needed
              toolCallOutputs.push({
                tool_call_id: toolCall.id,
                output: parsedResult.prompt_for_ai,
              });
  
              break;

              case "suggest_tickers_to_compare":
                // console.log("portfolio_overview called and arguments are: ", parsedArgs)
                newParts = [{
                  type: "comparison_pair_picker",
                  data: [], // parsedResult.data_for_component,
                  sidebar: true,
                }];
    
              //  Add to toolCallOutputs if needed
                toolCallOutputs.push({
                  tool_call_id: toolCall.id,
                  output:`The user has been shown some options in the sidebar, tell him to select his choice from the sidebar, or to write to you with another choice if he has any. The user speaks ${userLanguage}, so reply in this language.`
                });
    
                break;

              case "analyze_ticker":
                if (parsedResult.status == "success") {
                  newParts = [{
                    type: "analyze_ticker",
                    data: parsedResult.data_for_component,
                    sidebar: true,
                  },

                {
                    type: "latest_news",
                    data: parsedResult.data_for_component.latest_news,
                    sidebar: false,
                  }];
                  // Also push to OpenAI
                  toolCallOutputs.push({
                    tool_call_id: toolCall.id,
                    output: JSON.stringify(parsedResult.prompt_for_ai),
                  });
                } else {
                 
                  toolCallOutputs.push({
                    tool_call_id: toolCall.id,
                    output: `the custom function failed, so call search_web instead. The user speaks ${userLanguage}, so reply in this language.`
                  });
                }
                break;

              case "show_financial_data":
                console.log("show_financial_data called and arguments are: ", parsedArgs)
                console.log("data in part is: ", parsedResult.data.response)
                newParts = [{
                  type: "financials_table", 
                  data: parsedResult.data.response,
                }];
              //  No need to add to toolCallOutputs for this function
                toolCallOutputs.push({
                  tool_call_id: toolCall.id,
                  output: `This data has been shown to the user: ${parsedResult.data.response}.`,
                });

                break;

                case "compare_tickers": {
                  if (parsedResult.status === "success") {
                    /* normal happy‑path */
                    newParts = [
                      {
                        type: "comparison_sidebar",
                        data: parsedResult.data,   // table / metrics / chart payload
                        sidebar: true,
                      },
                    ];
                
                    toolCallOutputs.push({
                      tool_call_id: toolCall.id,
                      output: parsedResult.prompt_for_ai, // analyst prompt string
                    });
                  } else {
                    /* failure‑path: tell assistant to try web search instead */
                    toolCallOutputs.push({
                      tool_call_id: toolCall.id,
                      output: `The custom comparison function returned failure, so use information you have or call search_web instead. The user speaks ${userLanguage}; reply in that language.`,
                    });
                  }
                  break;
                }
      
         
          case "list_tickers":
            if (parsedResult.status == "success") {
              newParts = [{
                type: "assets_list",
                data: parsedResult.response.data_for_component,
                sidebar:true
              }];
              // Also push to OpenAI
              toolCallOutputs.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify(parsedResult.response.prompt_for_ai),
              });
            } else {
             
              toolCallOutputs.push({
                tool_call_id: toolCall.id,
                output: `the custom search failed, so call search_web instead for a list of tickers. The user speaks ${userLanguage}, so reply in this language.`
              });
            }
            break;

          case "search_web":
            newParts = [{
              type: "annotations",
              data: parsedResult.data_for_component,
              sidebar: true,
            }];
            
            toolCallOutputs.push({
              tool_call_id: toolCall.id,
              output: `The user speaks ${userLanguage}, so reply in this language. These are the search results: ${JSON.stringify(parsedResult.data_for_ai)}. Include links in your response.`,
            });
            break;

          default:
            // If no specialized logic, just store result in a general text/data part
            newParts = [{
              type: "assistantText",
              text: `Function ${functionName} not explicitly handled. Data: ${JSON.stringify(parsedResult)}`,
              data: parsedResult,
            }];
            break;
        }

        // 3) Update the last interaction's bot message, if we have a part
        if (newParts) {
          updateLastInteractionBotParts(newParts);
        }
      }

      // 4) If we have toolCallOutputs, we must submit them back to OpenAI

      if (toolCallOutputs.length > 0) {
        console.log('NOW calling SUBMIT ACTION RESULT AND THREAD ID IS: ', "while thread id is: ", threadId)
        const response = await submitActionResult(threadId, runId, toolCallOutputs);
        const stream = AssistantStream.fromReadableStream(response.body);
        attachHandlers(stream, threadId);
      } else {
       
        setInputDisabled(false);
      }
    },
    [
      currentLangRef,
      // threadIdRef,
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
EventStream.ts:159 Uncaught (in promise) OpenAIError: Final run has not been received
at AssistantStream._EventStream_handleError (EventStream.ts:159:40)
Caused by: Error: Final run has not been received
at AssistantStream._AssistantStream_endRequest (AssistantStream.ts:414:32)
at AssistantStream._fromReadableStream (AssistantStream.ts:181:41)
*/