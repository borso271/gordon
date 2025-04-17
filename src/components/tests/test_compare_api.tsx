"use client";

import React, { useState } from "react";

export default function TestCompareAPI() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_type: "stock", // or "etf", "crypto" etc.
          tickers: ["AAPL", "TSLA"],
          language: "en",
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("❌ Compare API failed:", error);
      setResult({ error: "API call failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Compare Apple & Tesla</h2>
      <button onClick={handleCompare} disabled={loading}>
        {loading ? "Comparing..." : "Run Comparison"}
      </button>

      {result && (
        <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap", fontSize: "14px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
