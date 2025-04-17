import React from "react";
import { usePolygonSnapshot } from "../../app/hooks/usePolygonSnapshot";

const TestPolygonSnapshot = () => {
  const { data, loading, error } = usePolygonSnapshot([
     { ticker_id: 3, symbol: "A", asset_type: "stock"},
    // { symbol: "BTCUSD", asset_type: "crypto" },
    //  { symbol: "QQQ", asset_type: "etf" },
  ]);

  return (
    <div>
      <h2>📊 Polygon Snapshot Test</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      <pre style={{ whiteSpace: "pre-wrap" }}>
        {data ? JSON.stringify(data, null, 2) : "No data yet."}
      </pre>
    </div>
  );
};

export default TestPolygonSnapshot;
