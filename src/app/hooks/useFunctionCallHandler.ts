import { useLanguage } from "../hooks/useLanguage";
import { useCallback } from "react";

export function useFunctionCallHandler() {
  const { currentLang } = useLanguage();

  const functionCallHandler = useCallback(async (toolCall) => {
    const { name, arguments: functionArgs } = toolCall.function;
    let args;
    try {
      args = JSON.parse(functionArgs);
    } catch (error) {
      console.error("Failed to parse toolCall arguments:", functionArgs);
      return JSON.stringify({ error: "Invalid arguments format" });
    }

    // ✅ Add language from context
    args.language = currentLang;

    if (name === "show_ticker_chart") {
      return JSON.stringify(args);
    }

    const endpointMap = {
      analyze_security: "api/analysis",
      suggest_tickers_to_compare: "api/suggest_tickers_to_compare",
      suggest_securities: "api/suggest",
      portfolio_overview: "api/portfolio_overview",
      compare_tickers: "api/compare",
      search_web: "api/exa_search",
      list_tickers: "api/list_tickers",
      analyze_ticker: "api/analyze_ticker",
      show_financial_data: "api/show_financial_data"
    };

    if (!endpointMap[name]) {
      return JSON.stringify({ error: "Unknown tool function" });
    }

    try {
      const response = await fetch(endpointMap[name], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });

      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error(`Error calling ${endpointMap[name]}:`, error);
      return JSON.stringify({ error: `Failed to call ${name}` });
    }
  }, [currentLang]); // 👈 include currentLang dependency

  return { functionCallHandler };
}

// import { useLanguage } from "../hooks/useLanguage";

// export function useFunctionCallHandler() {
//   const { currentLang } = useLanguage();

//   const functionCallHandler = async (toolCall) => {
//     const { name, arguments: functionArgs } = toolCall.function;
//     let args;
//     try {
//       args = JSON.parse(functionArgs);
//     } catch (error) {
//       console.error("Failed to parse toolCall arguments:", functionArgs);
//       return JSON.stringify({ error: "Invalid arguments format" });
//     }

//     // ✅ Add language from context
//     args.language = currentLang;

//     if (name == "show_ticker_chart") {
//       return JSON.stringify(args); // ✅ Correct
//     }

//     const endpointMap = {
//       analyze_security: "api/analysis",
//       suggest_tickers_to_compare: "api/suggest_tickers_to_compare",
//       suggest_securities: "api/suggest",
//       portfolio_overview: "api/portfolio_overview",
//       compare_tickers: "api/compare",
//       search_web: "api/exa_search",
//       list_tickers: "api/list_tickers", // ✅ Added new function mapping
//       analyze_ticker: "api/analyze_ticker", // ✅ Added new function mapping
//       show_financial_data: "api/show_financial_data"
//     };

//     if (!endpointMap[name]) {
//       return JSON.stringify({ error: "Unknown tool function" });
//     }

//     try {
//       const response = await fetch(endpointMap[name], {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(args),
//       });

//       const data = await response.json();

//       return JSON.stringify(data);
//     } catch (error) {
//       console.error(`Error calling ${endpointMap[name]}:`, error);
//       return JSON.stringify({ error: `Failed to call ${name}` });
//     }
//   };

//   return { functionCallHandler };
// }