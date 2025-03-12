import { useState } from "react";
import { createThread } from "../utils/apiActions"; // adjust path as needed

export function useThread() {
  const [threadId, setThreadId] = useState("");

  // Call thread creation once when needed.
  const initThread = async () => {
    if (!threadId) {
      const data = await createThread();
      setThreadId(data.threadId);
    }
  };

  return { threadId, initThread, setThreadId };
}
