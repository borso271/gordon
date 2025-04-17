"use client";

import { useState } from "react";

const CompareTestComponent = () => {
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCompare = async () => {
    setLoading(true);
    setResponseData(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { symbol: "AAPL", asset_type: "stock" },
          { symbol: "TSLA", asset_type: "stock" },
        ]),
      });

      const data = await res.json();
      setResponseData(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setResponseData({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={testCompare} disabled={loading}>
        {loading ? "Loading..." : "Test Compare API"}
      </button>

      <pre
        style={{
          marginTop: "1rem",
          background: "black",
          padding: "1rem",
          borderRadius: "6px",
          maxHeight: "500px",
          overflowY: "auto",
          fontSize: "0.85rem",
        }}
      >
        {responseData ? JSON.stringify(responseData, null, 2) : "No data yet"}
      </pre>
    </div>
  );
};

export default CompareTestComponent;
