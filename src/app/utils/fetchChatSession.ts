import { ChatSession } from "../../interfaces";

export async function fetchChatSessionFromDB(threadId: string): Promise<ChatSession | null> {
  if (!threadId) return null;

  try {
    const response = await fetch(`/api/chat-session?threadId=${encodeURIComponent(threadId)}`);
    if (!response.ok) {
      console.warn(`Failed to fetch session for thread ${threadId}:`, response.status);
      return null;
    }

    const data = await response.json();
    return data.chatSession as ChatSession;
  } catch (err) {
    console.error('Error fetching chat session:', err);
    return null;
  }
}
