"use client";

import { useState } from "react";

export default function TestExaSearch() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/exa_search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "apple",
          type:"auto",
          category: "financial_report",
          numResults: 3,
          text: false,
          include_summary:true,
          include_images:false
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("❌ Search failed:", err);
      setResult({ error: "Search failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Test Exa Search</h2>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search News"}
      </button>

      {result && (
        <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
