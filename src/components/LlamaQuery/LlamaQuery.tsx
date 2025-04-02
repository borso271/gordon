'use client';
import { useState } from "react";

export default function LlamaQuery() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const askLlama = async () => {
    const res = await fetch("/api/llama_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something about IPOs..."
        className="border p-2 w-full mb-4"
      />
      <button onClick={askLlama} className="bg-blue-500 text-white p-2 rounded">
        Ask
      </button>
      {answer && <p className="mt-4 bg-gray-100 p-4 rounded">{answer}</p>}
    </div>
  );
}
