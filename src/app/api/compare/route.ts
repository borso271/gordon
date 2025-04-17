/*

*/

import { NextRequest, NextResponse } from "next/server";
import { return_comparison_data } from "../../../services/compare";
import { extractDataForComparisonTable } from "./extract_functions";
import { extractFinancialMetricData } from "./extract_functions";
import { extractTickerSymbols } from "./extract_functions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { asset_type, tickers, language } = body;

    if (!Array.isArray(tickers) || typeof asset_type !== "string") {
      return NextResponse.json(
        { error: "Invalid format. Expecting asset_type and tickers array." },
        { status: 400 }
      );
    }

    // Normalize input
    const normalizedInput = tickers.map((symbol: string) => ({
      asset_type,
      symbol,
    }));

    // Fetch and transform data
    const raw_data = await return_comparison_data(normalizedInput);

    // Extract required comparison sections
    const comparison_table_data = extractDataForComparisonTable(raw_data);
    const metric_comparison_data = extractFinancialMetricData(raw_data);
    const comparison_chart_data = extractTickerSymbols(raw_data);

    // 🔍 Extract ratings and snapshots separately
    const ratings = raw_data.map((item) => ({
      ticker: item.ticker_symbol,
      ratings: item.ratings,
    }));

    const snapshots = raw_data.map((item) => ({
      symbol_id: item.id,
      name:item.name,
      ticker: item.ticker_symbol,
      asset_type: item.asset_type,
      snapshot: item.ticker_snapshot,
    }));

    // Return structured response
    const result = {
      prompt_for_ai: `Provide a comparison of the following tickers in ${language || "en"}`,
      data: {
        comparison_table_data,
        metric_comparison_data,
        comparison_chart_data,
        ratings,
        snapshots,
      },
    };

    console.log("✅ Final result:", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Error in /api/compare:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { asset_type, tickers, language } = body;

//     if (!Array.isArray(tickers) || typeof asset_type !== "string") {
//       return NextResponse.json(
//         { error: "Invalid format. Expecting asset_type and tickers array." },
//         { status: 400 }
//       );
//     }

//     // Normalize input
//     const normalizedInput = tickers.map((symbol: string) => ({
//       asset_type,
//       symbol,
//     }));

//     // Fetch and transform data
//     const raw_data = await return_comparison_data(normalizedInput);

//     // Extract required comparison sections
//     const comparison_table_data = extractDataForComparisonTable(raw_data);
//     const metric_comparison_data = extractFinancialMetricData(raw_data);
//     const comparison_chart_data = extractTickerSymbols(raw_data);

//     // 🔍 Extract ratings and snapshots separately
//     const ratings = raw_data.map((item) => ({
//       ticker: item.ticker_symbol,
//       ratings: item.ratings,
//     }));

//     const snapshots = raw_data.map((item) => ({
//       ticker: item.ticker_symbol,
//       snapshot: item.ticker_snapshot,
//     }));

//     // Return structured response
//     const result = {
//       prompt_for_ai: `Provide a comparison of the following tickers in ${language || "en"}`,
//       data: {
//         comparison_table_data,
//         metric_comparison_data,
//         comparison_chart_data,
//         ratings,
//         snapshots,
//       },
//     };

//     console.log("✅ Final result:", result);

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error("❌ Error in /api/compare:", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

    
    /*

    WE ARRIVE AT RESULTS AND RESULTS ARE:  {
  prompt_for_ai: 'Provide a comparison of the following tickers in en',
  data: {
    comparison_table_data: [ [Object], [Object] ],
    metric_comparison_data: [ [Object], [Object] ],
    comparison_chart_data: [ 'AAPL', 'TSLA' ]
  }
}



*/

// export async function POST(req: NextRequest) {
//       try {
//         const body = await req.json();
    
//         console.log("📥 Incoming request body:", JSON.stringify(body, null, 2));
    
//         if (!Array.isArray(body)) {
//           console.warn("❌ Body is not an array");
//           return NextResponse.json({ error: "Expected array of tickers" }, { status: 400 });
//         }
    
//         const validInput = body.every((item, index) => {
//           const isValid =
//             typeof item === "object" &&
//             typeof item.asset_type === "string" &&
//             typeof item.symbol === "string";
    
//           if (!isValid) {
//             console.warn(`❌ Invalid format at index ${index}:`, item);
//           }
    
//           return isValid;
//         });
    
//         if (!validInput) {
//           return NextResponse.json({ error: "Invalid ticker format" }, { status: 400 });
//         }
    
//         console.log("✅ Input validated successfully");
    
//         const raw_data = await return_comparison_data(body);
//         console.log("📊 Raw data returned from return_comparison_data:", raw_data);
    
//         const comparison_table_data = extractDataForComparisonTable(raw_data);
//         console.log("📋 Comparison Table Data:", comparison_table_data);
    
//         const metric_comparison_data = extractFinancialMetricData(raw_data);
//         console.log("📈 Metric Comparison Data:", metric_comparison_data);
    
//         const comparison_chart_data = extractTickerSymbols(raw_data);
//         console.log("📌 Chart Data (tickers):", comparison_chart_data);
    
//         const result = {
//           prompt_for_ai: "Provide to the user a comparison between apple and tesla, based on what you know",
//           data: {
//             comparison_table_data,
//             metric_comparison_data,
//             comparison_chart_data,
//           },
//         };
    
//         console.log("✅ Final Result:", result);
    
//         return NextResponse.json(result);
//       } catch (error: any) {
//         console.error("❌ Error in /api/compare:", error.message);
//         console.error(error.stack);
//         return NextResponse.json(
//           { error: "Internal Server Error" },
//           { status: 500 }
//         );
//       }
//     }
    