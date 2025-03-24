import { useEffect, useMemo, useState } from "react";
import fetch_symbol_info from "../../services/database/fetch_symbol_info";
import supabase_client from "../../lib/supabaseClient";

interface AnalystRating {
  strong_buy_count: number;
  buy_count: number;
  hold_count: number;
  sell_count: number;
  strong_sell_count: number;
}

export function useAnalystRatings(ticker_symbol: string) {
  const [ratings, setRatings] = useState<AnalystRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker_symbol) return;
  
    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const res = await fetch("/api/database/analyst_ratings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbol: ticker_symbol }),
        });
  
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch");
        }
  
        const data = await res.json();
        setRatings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRatings();
  }, [ticker_symbol]);
  
//   useEffect(() => {
//     if (!ticker_symbol) return;

//     const fetchRatings = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const { id: symbol_id } = await fetch_symbol_info(ticker_symbol) || {};

//         if (!symbol_id) throw new Error(`Symbol ID not found for ${ticker_symbol}`);

//         const { data, error } = await supabase_client
//           .from("analyst_ratings")
//           .select("*")
//           .eq("symbol_id", symbol_id)
//           .single();

//         if (error) throw new Error(`Error fetching ratings: ${error.message}`);

//         setRatings(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRatings();
//   }, [ticker_symbol]);

  const totalRatings = useMemo(() => {
    if (!ratings) return 0;
    return (
      ratings.strong_buy_count +
      ratings.buy_count +
      ratings.hold_count +
      ratings.sell_count +
      ratings.strong_sell_count
    );
  }, [ratings]);

  const mostVotedRating = useMemo(() => {
    if (!ratings) return null;

    const ratingCounts = {
      strong_buy_count: ratings.strong_buy_count,
      buy_count: ratings.buy_count,
      hold_count: ratings.hold_count,
      sell_count: ratings.sell_count,
      strong_sell_count: ratings.strong_sell_count,
    };

    const [mostVotedKey, mostVotedCount] = Object.entries(ratingCounts).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0]
    );

    const labelMapping: Record<string, string> = {
      strong_buy_count: "Strong Buy",
      buy_count: "Buy",
      hold_count: "Hold",
      sell_count: "Sell",
      strong_sell_count: "Strong Sell",
    };

    return {
      label: labelMapping[mostVotedKey] || "Unknown",
      count: mostVotedCount,
    };
  }, [ratings]);

  const getPercentage = (count: number): number => {
    return  totalRatings ? Math.round((count / totalRatings) * 100) : 0;
  };

  return {
    ratings,
    loading,
    error,
    totalRatings,
    mostVotedRating,
    getPercentage,
  };
}
