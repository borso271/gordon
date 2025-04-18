
// export async function fetchTickerDataWithInsightAndPolygon(tickerIds: number[]): Promise<TickerInsightResult[]>

import { fetchSymbolSnapshots } from "../database/fetch_symbols_for_list";
import { fetchTickerDataWithInsightAndPolygon } from "../ticker_insight";

/* ─── 1. Sort field type ─── */
type SortField = "price" | "volume" | "revenue" | "popularity" | "market_cap";

export async function list_tickers(args: {
  asset_type: "stock" | "crypto" | "etf";
  sectors?: string[];
  sort_by?: SortField;
  language?: string;
}) {
  const {
    asset_type,
    sectors = [],
    sort_by = "price",
    language = "en",
  } = args;

  const userLanguage =
    language === "ar" ? "Arabic (Saudi Arabia)" : "English";

  try {
    /* 2️⃣ Fetch snapshots (make sure snapshot includes price, volume, and market_cap if available) */
    const snapshots = await fetchSymbolSnapshots(asset_type, sectors);

    if (!snapshots?.length) {
      return {
        status: "failure",
        response: { prompt_for_ai: "", data_for_component: [] },
      };
    }

    /* 3️⃣ Sorting logic */
    const sorted = snapshots
      .filter((s) => s.price != null && s.volume != null)
      .sort((a, b) => {
        switch (sort_by) {
          case "volume":
            return Number(b.volume) - Number(a.volume);

          case "market_cap":
            // Prefer true market_cap if exists, otherwise fallback to price × volume
            const capA = a.market_cap ?? Number(a.price) * Number(a.volume);
            const capB = b.market_cap ?? Number(b.price) * Number(b.volume);
            return capB - capA;

          case "revenue":
          case "popularity":
            return Number(b.price) * Number(b.volume) -
                   Number(a.price) * Number(a.volume);

          case "price":
          default:
            return Number(b.price) - Number(a.price);
        }
      })
      .slice(0, 5);

    /* 4️⃣ Prompt label */
    const sortLabel =
      sort_by === "volume"     ? "volume"
    : sort_by === "market_cap" ? "market capitalization"
    : sort_by === "revenue"    ? "revenue" // incorrect
    : sort_by === "popularity" ? "popularity" // incorrect
    : "price";

    /* 5️⃣ Prompt for AI */
    const promptForAi = `
We identified the top 5 tickers by ${sortLabel}:
${sorted.map((s) => `- ${s.ticker}`).join("\n")}

These tickers are already displayed in the sidebar. Ask the user if they would like more details or to refine their search.
Respond in ${userLanguage}.`.trim();

    /* 6️⃣ Fetch richer data for UI */
    const dataForComponent = await fetchTickerDataWithInsightAndPolygon(
      sorted.map((s) => s.symbol_id)
    );

    return {
      status: "success",
      response: {
        prompt_for_ai: promptForAi,
        data_for_component: dataForComponent,
      },
    };
  } catch (error: any) {
    console.error("❌ list_tickers error:", error.message);
    return {
      status: "failure",
      response: { prompt_for_ai: "", data_for_component: [] },
    };
  }
}

// export async function list_tickers(args: {
//   asset_type: "stock" | "crypto" | "etf";
//   sectors?: string[];
//   sort_by?: "price" | "volume";
//   language?: string
// }) {
//   const { asset_type, sectors = [], sort_by, language} = args;

//   let userLanguage = "English";
//   if (language == 'ar') {
//     userLanguage = "Arabic (Saudi Arabia)"
//   }
//   try {
//     // 1) Fetch snapshots
//     const snapshots = await fetchSymbolSnapshots(asset_type, sectors);

//     if (!snapshots || snapshots.length === 0) {
//       return {
//         success: false,
//         response: { prompt_for_ai: "", data_for_component: [] },
//       };
//     }

//     const sorted = snapshots
//       .filter((s) => s.price != null && s.volume != null)
//       .sort((a, b) => {
//         if (sort_by === "volume") return Number(b.volume) - Number(a.volume);
//         return Number(b.price) - Number(a.price);
//       })
//       // 3) Slice top 5
//       .slice(0, 5);



// const promptForAi = `We have identified the top 5 tickers by ${
//   sort_by === "volume" ? "volume" : "price"
// }:
// ${sorted
//   .map((s) => `- ${s.ticker}`)
//   .join("\n")}

// These tickers are already displayed to the user to the sidebar, ask him if he needs more information or wants to refine his search. The user language is ${userLanguage}, respond in this language.`;

//     const dataForComponent = await fetchTickerDataWithInsightAndPolygon(
//       sorted.map((s) => s.symbol_id) // or adapt to your real field
//     );

//     console.log("we fetch data for component and it is: ", dataForComponent)

//     return {
//       success: true,
//       response: {
//         prompt_for_ai: promptForAi,
//         data_for_component: dataForComponent,
//       },
//     };
//   } catch (error: any) {
//     console.error("❌ Error in list_tickers:", error.message);
//     return {
//       success: false,
//       response: { prompt_for_ai: "", data_for_component: [] },
//     };
//   }
// }

