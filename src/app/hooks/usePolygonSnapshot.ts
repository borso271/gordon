import { useEffect, useState } from "react";

type TickerInput = {
    ticker_id: number;
  symbol: string;
  asset_type: "stock" | "crypto" | "etf";
};

type PolygonSnapshotResult = {
  symbol: string;
  asset_type: "stock" | "crypto" | "etf";
  polygon_data: any; // Adjust this based on your expected schema
};

export function usePolygonSnapshot(tickers: TickerInput[]) {
  const [data, setData] = useState<PolygonSnapshotResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tickers.length) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/polygon_snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tickers),
        });

        if (!res.ok) {
          const errorJson = await res.json();
          throw new Error(errorJson.error || "Failed to fetch snapshot");
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(tickers)]); // Serialize tickers for dependency comparison

  return { data, loading, error };
}
