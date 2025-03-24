// apiActions.ts
export async function createThread(): Promise<{ threadId: string }> {
    const res = await fetch(`/api/assistants/threads`, { method: "POST" });
    return await res.json();
  }
  export async function sendMessage(threadId: string, text: string): Promise<Response> {
    return fetch(`/api/assistants/threads/${threadId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content: text }),
    });
  }
  export async function submitActionResult(
    threadId: string,
    runId: string,
    toolCallOutputs: any
  ): Promise<Response> {
    return fetch(`/api/assistants/threads/${threadId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId, toolCallOutputs }),
    });
  }
  