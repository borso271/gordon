import { useEffect, useState } from "react";
import { fetchRelatedSymbols } from "../../services/database/fetch_related_symbols";

export function useRelatedSymbols(symbol_id: string) {
  const [relatedSymbols, setRelatedSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol_id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRelatedSymbols(symbol_id);
        setRelatedSymbols(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol_id]);

  return { relatedSymbols, loading, error };
}
