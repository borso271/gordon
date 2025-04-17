

import { useState } from "react";

export default function StreamingAgent() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    setLoading(true);
    setResponse("");

    const res = await fetch("/api/langgraph", {
      method: "POST",
      body: JSON.stringify({ question }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setResponse((prev) => prev + chunk);
    }

    setLoading(false);
  }

  return (
    <main className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Ask the LangGraph Assistant</h1>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
        placeholder="Ask anything..."
      />
      <button
        onClick={askQuestion}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      <div className="whitespace-pre-wrap border-t pt-4">
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </main>
  );
}

// export default function TestLanggraph() {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function askQuestion() {
//     setLoading(true);
//     setAnswer("");

//     const res = await fetch("/api/langgraph", {
//       method: "POST",
//       body: JSON.stringify({ question }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await res.json();
//     setAnswer(data.content);
//     setLoading(false);
//   }

//   return (
//     <main className="p-6 max-w-xl mx-auto space-y-4">
//       <h1 className="text-2xl font-bold">Ask the Assistant</h1>
//       <input
//         type="text"
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         placeholder="Ask something like: what's the weather in Tokyo?"
//         className="w-full border border-gray-300 p-2 rounded"
//       />
//       <button
//         onClick={askQuestion}
//         disabled={loading}
//         className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//       >
//         {loading ? "Thinking..." : "Ask"}
//       </button>
//       <div className="mt-4 border-t pt-4">
//         <p className="font-medium">Response:</p>
//         <p>{answer}</p>
//       </div>
//     </main>
//   );
// }
