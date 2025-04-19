import { SimpleTicker } from "../../interfaces";
import { useSessionCallback } from "./useSessionCallback";
import { useManualSubmit } from "./useManualSubmit";

export function useAnalyzeStock() {
  const { withNewSession } = useSessionCallback();
  const { submitQuery } = useManualSubmit();

  const analyzeStock = async (ticker: SimpleTicker) => {
    if (!ticker.name || !ticker.ticker) return;

    const query = `Can you give me an analysis of ${ticker.name} (${ticker.ticker})?`;

    withNewSession((sessionId) => {
      submitQuery(query, false,sessionId);
    }, 100, true); // delay = 100ms, openOverlay = true
  };

  return { analyzeStock };
}
