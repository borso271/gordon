import { useMemo } from "react";
import { useTickerNews } from "./useTickerNews"; // adjust path
import { useRelatedSymbols } from "./useRelatedSymbols"; // adjust path
import { useProviders } from "./useProviders"; // adjust path
import { useAnalystRatings } from "./useAnalystRatings"; // 👈 Import
import { useLanguage } from "./useLanguage";

export interface AiAnalysisData {
  positives?: string[] | null;
  negatives?: string[] | null;
  summary?: string | null;
  prompts?: string[] | null;
  ratings?: ReturnType<typeof useAnalystRatings>; // 👈 Typed from the original hook
  news?: any;
  related_symbols?: string[];
  providers?: any;
  loading: boolean;
  error: string | null;
}

// add the labels or text parts depending on the language currently set...
// and save it as well, with the rest, like in a dictionary...

export const useGetAnalysisData = (
  rawAnalysis: string | object | undefined,
  symbol: string,
  symbol_id: string
): AiAnalysisData => {

  const parsed = useMemo(() => {
    if (!rawAnalysis) return {};
    if (typeof rawAnalysis === "string") {
      try {
        return JSON.parse(rawAnalysis);
      } catch (error) {
        console.error("❌ Error parsing JSON:", (error as Error).message);
        return {};
      }
    }
    return rawAnalysis;
  }, [rawAnalysis]);

  const {
    news,
    loading: newsLoading,
    error: newsError,
  } = useTickerNews(symbol);

  const {
    relatedSymbols,
    loading: relatedLoading,
    error: relatedError,
  } = useRelatedSymbols(symbol_id);

  const {
    providers,
    loading: providersLoading,
    error: providersError,
  } = useProviders();

  const analystRatings = useAnalystRatings(symbol);

  const mergedLoading =
  newsLoading || relatedLoading || providersLoading || analystRatings.loading;
  const mergedError =
  newsError || relatedError || providersError || analystRatings.error;

  return {
    positives: parsed.positives ?? null,
    negatives: parsed.risks_and_concerns ?? null,
    summary: parsed.summary ?? null,
    prompts: parsed.suggested_prompts ?? null,
    ratings: analystRatings, // ✅ Structured just like useAnalystRatings returns
    news,
    related_symbols: relatedSymbols,
    providers,
    loading: mergedLoading,
    error: mergedError,
  };
};



