/*

if compare stocks is called,
tables and charts are added to the chat,
and you say the bot; this is the data, explain it to the user, and give an overview of this comparison.

OK

---
*/

import { getAnalystRatings } from "../database/fetch_analyst_ratings";
import fetchFormatData from "../analysis/fetch_and_format_data/fetch_and_format_data";
import { extractImportantFinancials } from "./filter_financials";
import { fetchTickerSnapshot } from "../analyze_ticker/polygon_ticker";

type TickerInput = {
  asset_type: "stock" | "crypto" | "etf";
  symbol: string;
};

type ResultItem = {
  id: number;
  name: string;
  ticker_symbol: string;
  asset_type: "stock" | "crypto" | "etf";
  data_for_ai: any;
  ratings: any;
  ticker_snapshot: any;
};

type ComparisonReturn = {
  status: "success" | "failure";
  data: ResultItem[];
};

export async function return_comparison_data(
  tickers: TickerInput[]
): Promise<ComparisonReturn> {
  const results: ResultItem[] = [];
  let hadFailure = false;

  for (const { symbol, asset_type } of tickers) {
    try {
      /* fetchFormatData will throw if symbol_id is missing */
      const { id, name, data_for_ai } = await fetchFormatData(symbol, asset_type);

      if (!data_for_ai) {
        console.warn(`⚠️ No data_for_ai returned for ${symbol}`);
        hadFailure = true;
        continue;
      }

      const ratings        = await getAnalystRatings(symbol);
      const tickerSnapshot = await fetchTickerSnapshot(symbol, asset_type);

      const updatedData = {
        ...data_for_ai,
        Financials: extractImportantFinancials(data_for_ai.Financials),
      };

      results.push({
        id,
        name,
        ticker_symbol: symbol,
        asset_type,
        data_for_ai: updatedData,
        ratings,
        ticker_snapshot: tickerSnapshot,
      });
    } catch (err: any) {
      hadFailure = true;

      // Optional: log specific reason (symbol not found vs. network etc.)
      console.error(`❌ Unable to process ${symbol}:`, err?.message ?? err);
    }
  }

  return {
    status: hadFailure ? "failure" : "success",
    data: results,
  };
}


// import { getAnalystRatings } from "../database/fetch_analyst_ratings";

// import fetchFormatData from "../analysis/fetch_and_format_data/fetch_and_format_data";

// import { extractImportantFinancials } from "./filter_financials";
// import { fetchTickerSnapshot } from "../analyze_ticker/polygon_ticker";
// type TickerInput = {
//   asset_type: "stock" | "crypto" | "etf";
//   symbol: string;
// };

// export async function return_comparison_data(tickers: TickerInput[]) {
//   const results: {
//     id: number;
//     name: string;
//     ticker_symbol: string;
//     asset_type: "stock" | "crypto" | "etf";
//     data_for_ai: any;
//     ratings: any;
//     ticker_snapshot: any;
//   }[] = [];

//   for (const { symbol, asset_type } of tickers) {
//     try {
//       const { id, name,data_for_ai } = await fetchFormatData(symbol, asset_type);
      
//       if (!data_for_ai) {
//         console.warn(`⚠️ No data_for_ai returned for ${symbol}`);
//         continue;
//       }

//       const ratings = await getAnalystRatings(symbol);
//       const ticker_snapshot = await fetchTickerSnapshot(symbol, asset_type);


//       const updatedData = {
//         ...data_for_ai,
//         Financials: extractImportantFinancials(data_for_ai.Financials),
//       };

//       results.push({
//         id: id,
//         name: name,
//         ticker_symbol: symbol,
//         asset_type: asset_type,
//         data_for_ai: updatedData,
//         ratings: ratings,
//         ticker_snapshot: ticker_snapshot,
//       });

//     } catch (error) {
//       console.error(`❌ Failed to process ${symbol}:`, error);
//     }
//   }

//   return results;
// }





// fetch and format financials, extract only the keys that we need, return to frontend and print,
// then build the graphics and the bot response...

/*

You fetch general data
You fetch specific financials...
You return this data in a way that can be:
- Fed to gpt
- Shown to the user

You should be wary of the asset type, whether the user wants to compare stocks or cryptos...

If the user asks to compare bitcoin with nvidia, you should probably alert the user, or not show tables.

--- --- ---

You need to display:
- a chart
- a table
- a multi graphs bar table

*/






// I need a function that takes as input a list of objects like this:

//  {
//   'Company Profile': {
//     name: 'Nvidia Corp',
//     description: 'Nvidia is a leading developer of graphics processing units. Traditionally, GPUs were used to enhance the experience on computing platforms, most notably in gaming applications on PCs. GPU use cases have since emerged as important semiconductors used in artificial intelligence. Nvidia not only offers AI GPUs, but also a software platform, Cuda, used for AI model development and training. Nvidia is also expanding its data center networking solutions, helping to tie GPUs together to handle complex workloads.'
//   },

//   'Technical Indicators': {
//     'Relative Strength Index': 50.84807978,
//     'Simple Moving Average': 134.586,
//     'Exponential Moving Average': 134.24082191,
//     'MACD Value': 0.97692496,
//     'MACD Signal': -0.40792511,
//     'MACD Histogram': 1.38485007
//   },

//   Financials: {
//     balance_sheet: {
//       Assets: [Object],
//       'Current Assets': [Object],
//       Inventory: [Object],
//       'Other Current Assets': [Object],
//       'Noncurrent Assets': [Object],
//       'Fixed Assets': [Object],
//       'Intangible Assets': [Object],
//       'Other Non-current Assets': [Object],
//       Liabilities: [Object],
//       'Current Liabilities': [Object],
//       'Accounts Payable': [Object],
//       Wages: [Object],
//       'Other Current Liabilities': [Object],
//       'Noncurrent Liabilities': [Object],
//       'Long-term Debt': [Object],
//       'Other Non-current Liabilities': [Object],
//       Equity: [Object],
//       'Equity Attributable To Parent': [Object],
//       'Liabilities And Equity': [Object]
//     },

//     cash_flow_statement: {
//       'Net Cash Flow From Operating Activities': [Object],
//       'Net Cash Flow From Investing Activities': [Object],
//       'Net Cash Flow From Financing Activities': [Object],
//       'Net Cash Flow': [Object]
//     },

//     income_statement: {
//       Revenues: [Object],
//       'Benefits Costs and Expenses': [Object],
//       'Cost Of Revenue': [Object],
//       'Costs And Expenses': [Object],
//       'Gross Profit': [Object],
//       'Nonoperating Income/Loss': [Object],
//       'Operating Expenses': [Object],
//       'Selling, General, and Administrative Expenses': [Object],
//       'Research and Development': [Object],
//       'Operating Income/Loss': [Object],
//       'Income Tax Expense/Benefit': [Object],
//       'Income Tax Expense/Benefit, Deferred': [Object],
//       'Net Income/Loss': [Object],
//       'Net Income/Loss Attributable To Parent': [Object],
//       'Net Income/Loss Available To Common Stockholders, Basic': [Object],
//       'Basic Earnings Per Share': [Object],
//       'Diluted Earnings Per Share': [Object],
//       'Basic Average Shares': [Object],
//       'Diluted Average Shares': [Object]
//     }
//   }
// }

// and generate another list of objects where the financials are filtered by removing many keys,
// what we want to remain is only: 
// Financials: {
//   balance_sheet: {
//     Assets: [Object],
//     'Current Assets': [Object],
//     Inventory: [Object],
//     Liabilities: [Object],
//     'Current Liabilities': [Object],
//     'Long-term Debt': [Object],
//     Equity: [Object],

//   },

//   cash_flow_statement: {
//     'Net Cash Flow': [Object]
//   },

//   income_statement: {
//     Revenues: [Object],
//     'Cost Of Revenue': [Object],
//     'Costs And Expenses': [Object],
//     'Gross Profit': [Object],
//     'Operating Expenses': [Object],
//     'Research and Development': [Object],
//     'Operating Income/Loss': [Object],
//     'Income Tax Expense/Benefit': [Object],
//     'Net Income/Loss': [Object],
//     'Basic Earnings Per Share': [Object],
//     'Basic Average Shares': [Object],
//   }
// }