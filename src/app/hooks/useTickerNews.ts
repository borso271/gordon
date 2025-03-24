import { useEffect, useState } from "react";
import { getNewsForSymbol } from "../../services/database/fetch_news";

export function useTickerNews(ticker_symbol: string) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker_symbol) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNewsForSymbol(ticker_symbol);
        setNews(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker_symbol]);

  return { news, loading, error };
}
