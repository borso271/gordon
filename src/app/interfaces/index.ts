
export interface ConversationPair {
    id: string; // ✅ Unique identifier
    user: string;
    assistant: string;
    code?: string;
    analysisData?: any;
    suggestionData?: any;
  }