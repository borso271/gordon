"use client";

import { useState } from "react";

export default function FollowUpTester() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSuggestions(null);
    setError(null);

    try {
      const res = await fetch("/api/follow_ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuggestions(data.result);
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error or server not available.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <input
        type="text"
        className="w-full border rounded px-3 py-2"
        placeholder="Enter your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Loading..." : "Send"}
      </button>

      {error && <p className="text-red-600">⚠️ {error}</p>}

      {suggestions && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Suggestions:</h3>
          <ul className="list-disc pl-5">
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
