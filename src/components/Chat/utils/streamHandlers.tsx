// streamHandlers.ts
import { AssistantStream, AssistantStreamEvent } from "./AssistantStream";

type HandlersOptions = {
  onTextCreated: () => void;
  onTextDelta: (delta: any) => void;
  onImageFileDone: (image: any) => void;
  onToolCallCreated: (toolCall: any) => void;
  onToolCallDelta: (delta: any, snapshot: any) => void;
  onRequiresAction: (event: AssistantStreamEvent.ThreadRunRequiresAction) => void;
  onRunCompleted: () => void;
};

export function attachStreamHandlers(
  stream: AssistantStream,
  {
    onTextCreated,
    onTextDelta,
    onImageFileDone,
    onToolCallCreated,
    onToolCallDelta,
    onRequiresAction,
    onRunCompleted,
  }: HandlersOptions
) {
  // messages
  stream.on("textCreated", onTextCreated);
  stream.on("textDelta", onTextDelta);

  // images
  stream.on("imageFileDone", onImageFileDone);

  // tool calls
  stream.on("toolCallCreated", onToolCallCreated);
  stream.on("toolCallDelta", onToolCallDelta);

  // generic events
  stream.on("event", (event) => {
    if (event.event === "thread.run.requires_action") onRequiresAction(event);
    if (event.event === "thread.run.completed") onRunCompleted();
  });
}
