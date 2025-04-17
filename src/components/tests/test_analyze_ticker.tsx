"use client";

import { useState } from "react";

const TestAnalyzeTicker = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);


//   const { ticker_symbol, asset_type, analysis_type, language } = parameters;

    try {
      const res = await fetch("/api/analyze_ticker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticker_symbol: "AAPL",
          asset_type: "stock",
          analysis_type: "in_depth",
          language: "en",
        }),
      });

      const json = await res.json();
      setResult(json);
    } catch (error) {
      console.error("❌ Error calling analyze_ticker API:", error);
      setResult({ error: "Failed to fetch" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Analyze Ticker</h2>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze AAPL"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "black",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default TestAnalyzeTicker;
