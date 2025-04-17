// state.ts
import { type BaseMessage } from "@langchain/core/messages";

// Use MessagesState if available, otherwise define manually
// Assuming MessagesState looks something like this:
export interface MessagesState {
  messages: BaseMessage[];
}

// Extend the state to include our index
export interface AppState extends MessagesState {
  index: number;
}

// Define the annotation for LangGraph
export const AppStateAnnotation = {
  messages: {
    reducer: (x?: BaseMessage[], y?: BaseMessage[]) => (x ?? []).concat(y ?? []),
    default: () => [],
  },
  index: {
    reducer: (_?: number, y?: number) => y, // Always take the new value
    default: () => 0, // Default starting index
  },
};