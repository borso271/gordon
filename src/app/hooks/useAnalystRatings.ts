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

export function useAnalystRatings(ratings: any) {
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
