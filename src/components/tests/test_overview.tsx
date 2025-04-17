// components/TestPortfolioOverview.tsx
"use client";

import { useState } from "react";

export default function TestPortfolioOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/portfolio_overview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "abc",
          start_date: "2022-01-01",
          language: "en",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to fetch");
      } else {
        setData(json);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Portfolio Overview</h2>
      <button onClick={handleFetch} disabled={loading}>
        {loading ? "Loading..." : "Fetch Portfolio Overview"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data && (
        <pre style={{ marginTop: 20, background: "black", padding: 10 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
