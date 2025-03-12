import { useCallback } from "react";

interface UseStreamHandlersProps {
  updateLastPair: (update: Partial<any>) => void;
  appendAssistantText: (text: string) => void;
  setConversationPairs: React.Dispatch<React.SetStateAction<any>>;
}

export function useStreamHandlers({
  updateLastPair,
  appendAssistantText,
  setConversationPairs,
}: UseStreamHandlersProps) {
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
      setConversationPairs((prev: any) => {
        const last = { ...prev[prev.length - 1] };
        last.code = (last.code || "") + delta.code_interpreter.input;
        return [...prev.slice(0, -1), last];
      });
    }
  }, [setConversationPairs]);

  const onRequiresAction = useCallback(
    async (event: any, functionCallHandler: (toolCall: any) => Promise<string>) => {
      const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
      await Promise.all(
        toolCalls.map(async (toolCall: any) => {
          const result = await functionCallHandler(toolCall);
          const parsedResult = JSON.parse(result);
          setConversationPairs((prev: any) => {
            const last = { ...prev[prev.length - 1] };
            // Remove the assistant's text response:
            last.assistant = "";
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
    },
    [setConversationPairs]
  );

  return { onTextCreated, onTextDelta, onToolCallCreated, onToolCallDelta, onRequiresAction };
}
