
// export async function fetchTickerDataWithInsightAndPolygon(tickerIds: number[]): Promise<TickerInsightResult[]>

import { fetchSymbolSnapshots } from "../database/fetch_symbols_for_list";
import { fetchTickerDataWithInsightAndPolygon } from "../ticker_insight";
export async function list_tickers(args: {
  asset_type: "stock" | "crypto" | "etf";
  sectors?: string[];
  sort_by?: "price" | "volume";
  language?: string
}) {
  const { asset_type, sectors = [], sort_by, language} = args;

  let userLanguage = "English";
  if (language == 'ar') {
    userLanguage = "Arabic (Saudi Arabia)"
  }
  try {
    // 1) Fetch snapshots
    const snapshots = await fetchSymbolSnapshots(asset_type, sectors);

    console.log("WE ARRIVE AT SNAPSHOTS AND THEY ARE: ", snapshots)
    if (!snapshots || snapshots.length === 0) {
      return {
        success: false,
        response: { prompt_for_ai: "", data_for_component: [] },
      };
    }

    // 2) Filter out incomplete data, then sort

    const sorted = snapshots
      .filter((s) => s.price != null && s.volume != null)
      .sort((a, b) => {
        if (sort_by === "volume") return Number(b.volume) - Number(a.volume);
        return Number(b.price) - Number(a.price);
      })
      // 3) Slice top 5
      .slice(0, 5);

const promptForAi = `We have identified the top 5 tickers by ${
  sort_by === "volume" ? "volume" : "price"
}:
${sorted
  .map((s) => `- ${s.ticker}`)
  .join("\n")}

These tickers are already displayed to the user to the sidebar, ask him if he needs more information or wants to refine his search. The user language is ${userLanguage}, respond in this language.`;

    const dataForComponent = await fetchTickerDataWithInsightAndPolygon(
      sorted.map((s) => s.symbol_id) // or adapt to your real field
    );

    console.log("we fetch data for component and it is: ", dataForComponent)

    return {
      success: true,
      response: {
        prompt_for_ai: promptForAi,
        data_for_component: dataForComponent,
      },
    };
  } catch (error: any) {
    console.error("❌ Error in list_tickers:", error.message);
    return {
      success: false,
      response: { prompt_for_ai: "", data_for_component: [] },
    };
  }
}


// export async function list_tickers(args) {

//   const { asset_type, sectors = [], sort_by, language } = args;

//   try {
//     const snapshots = await fetchSymbolSnapshots(asset_type, sectors);

//     if (!snapshots || snapshots.length === 0) {
//       return {
//         success: false,
//         response: []
//       };
//     }

//     const sorted = snapshots
//       .filter(s => s.price != null && s.volume != null)
//       .sort((a, b) => {
//         if (sort_by === 'volume') return Number(b.volume) - Number(a.volume);
//         return Number(b.price) - Number(a.price);
//       })
//       .slice(0, 5);
       
//     return {
//       success: true,
//       response: sorted.map(s => ({
//         name: s.name,
//         ticker: s.ticker,
//         ytd_return: s.ytd_return != null ? `${s.ytd_return.toFixed(2)}%` : null,
//         ytd_range: s.ytd_range,
//         price: s.price != null ? `$${s.price.toFixed(2)}` : null
//       }))
//     };
//   } catch (error) {
//     console.error("❌ Error in list_tickers:", error.message);
//     return {
//       success: false,
//       response: []
//     };
//   }
// }

