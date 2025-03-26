import { useCallback } from "react";
import { useConversation } from "../context/conversationContext";
import { submitActionResult } from "../utils/apiActions";
import { AssistantStream } from "openai/lib/AssistantStream";
// import { functionCallHandler } from "../utils/functionCallHandler";
import { attachStreamHandlers } from "../utils/streamHandlers";
import { useFunctionCallHandler } from "./useFunctionCallHandler";

export function useStreamHandlers() {
  const { updateLastPair, appendAssistantText, setConversationPairs, setInputDisabled, threadId } = useConversation(); // ✅ Use context

  // console.log("THREAD ID IS: ", threadId)
  
  const {functionCallHandler} = useFunctionCallHandler()

  const onTextCreated = useCallback(() => {
    updateLastPair({ assistant: "" });
  }, [updateLastPair]);

  const onTextDelta = useCallback((delta: any) => {
    if (delta.value) {
      appendAssistantText(delta.value);
    }
  }, [appendAssistantText]);

  const onToolCallCreated = useCallback((toolCall: any) => {
    if (toolCall.type === "code_interpreter") {
      updateLastPair({ code: "" });
    }
  }, [updateLastPair]);

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
      const availableSymbols = ["AAPL", "TSLA", "MSFT"]; // or fetch dynamically if needed

      const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
      const runId = event.data.id;

  
      const toolCallOutputs: { tool_call_id: string; output: string }[] = [];
  
      for (const toolCall of toolCalls) {
        // toolCall.function.arguments.language = currentLang;
        
        const functionName = toolCall.function?.name;
        const parsedArgs = JSON.parse(toolCall.function.arguments);

        console.log("parsed args are: ", parsedArgs)


if (functionName === "analyze_security") {
  const symbol = parsedArgs.symbol;
  
  if (!availableSymbols.includes(symbol)) {
    const friendlyMessage = `The selected stock "${symbol}" is not available since this is only a prototype. Inform the user about this and tell the user that the available symbols are: ${availableSymbols.join(", ")}.`;

    toolCallOutputs.push({
      tool_call_id: toolCall.id,
      output:  friendlyMessage ,
    });

    console.log("⚠️ Symbol not supported, sending custom output to OpenAI:", symbol);
    continue; // ❌ Skip normal function call
  }
}
        const result = await functionCallHandler(toolCall);
        const parsedResult = JSON.parse(result);

  
        // Update local UI state based on function
        setConversationPairs((prev) => {
          if (prev.length === 0) return prev;
          const last = { ...prev[prev.length - 1] };
          last.assistant = "";
  
          if (functionName === "analyze_security") {
            last.analysisData = parsedResult;
            
            // console.log("parsed results is: ", parsedResult);
            submitActionResult(threadId, runId, parsedResult.response.analysis);

          } else if (functionName === "suggest_securities") {
            last.suggestionData = parsedResult;
          }
  
          return [...prev.slice(0, -1), last];
        });
        
        // ✅ Only push to OpenAI if function is "search_web"

        if (functionName === "search_web") {
          toolCallOutputs.push({
            tool_call_id: toolCall.id,
            output: result,
          });
        }
      }
  
      // ✅ Only submit back to OpenAI and continue the stream if allowed
      if (toolCallOutputs.length > 0) {
        console.log("we arrive at this point", toolCallOutputs)
        const response = await submitActionResult(threadId, runId, toolCallOutputs);
        const stream = AssistantStream.fromReadableStream(response.body);
        attachHandlers(stream);
      } else {
        // ❌ If nothing to submit to OpenAI, just re-enable input
        setInputDisabled(false);
      }
    },
    [setConversationPairs, threadId, attachHandlers]
  );

  return { onTextCreated, onTextDelta, onToolCallCreated, onToolCallDelta, onRequiresAction, attachHandlers };
}

/* here check the stock openai is asking analysis for, and if not in database, return to openai the data,
and set */




  // const onRequiresAction = useCallback(
  //   async (
  //     event: any,
  //     functionCallHandler: (toolCall: any) => Promise<string>
  //   ) => {

  //     const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
  //     const runId = event.data.id;

  
  //     const toolCallOutputs: { tool_call_id: string; output: string }[] = [];
  
  //     for (const toolCall of toolCalls) {
  //       // toolCall.function.arguments.language = currentLang;
        
  //       const toolCallArguments = toolCall.function.arguments;
  //       const functionName = toolCall.function?.name;
  //       const result = await functionCallHandler(toolCall);

  //       const parsedResult = JSON.parse(result);
       
  
  //       // Update local UI state based on function
  //       setConversationPairs((prev) => {
  //         if (prev.length === 0) return prev;
  //         const last = { ...prev[prev.length - 1] };
  //         last.assistant = "";
  
  //         if (functionName === "analyze_security") {
  //           last.analysisData = parsedResult;
            
  //           // console.log("parsed results is: ", parsedResult);
  //           submitActionResult(threadId, runId, parsedResult.response.analysis);

  //         } else if (functionName === "suggest_securities") {
  //           last.suggestionData = parsedResult;
  //         }
  
  //         return [...prev.slice(0, -1), last];
  //       });
        
  //       // ✅ Only push to OpenAI if function is "search_web"

  //       if (functionName === "search_web") {
  //         toolCallOutputs.push({
  //           tool_call_id: toolCall.id,
  //           output: result,
  //         });
  //       }
  //     }
  
  //     // ✅ Only submit back to OpenAI and continue the stream if allowed
  //     if (toolCallOutputs.length > 0) {
  //       const response = await submitActionResult(threadId, runId, toolCallOutputs);
  //       const stream = AssistantStream.fromReadableStream(response.body);
  //       attachHandlers(stream);
  //     } else {
  //       // ❌ If nothing to submit to OpenAI, just re-enable input
  //       setInputDisabled(false);
  //     }
  //   },
  //   [setConversationPairs, threadId, attachHandlers]
  // );