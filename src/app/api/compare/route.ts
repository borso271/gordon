/*

*/

import { NextRequest, NextResponse } from "next/server";
import { return_comparison_data } from "../../../services/compare";
import { extractDataForComparisonTable } from "./extract_functions";
import { extractFinancialMetricData } from "./extract_functions";
import { extractTickerSymbols } from "./extract_functions";

import { TickerInput } from "../../../interfaces";
// Ensure this matches the expected input for return_comparison_data
// Add other fields like ticker_id if required by TickerInput
type ValidAssetType = "stock" | "crypto" | "etf";
function isValidAssetType(value: any): value is ValidAssetType {
  return value === "stock" || value === "etf" || value === "crypto";
}

// --- API Route Handler ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { asset_type, tickers, language } = body; // asset_type is initially 'any' or 'unknown'

    // --- Validation ---
    if (!Array.isArray(tickers) || typeof asset_type !== "string") {
      return NextResponse.json(
        { error: "Invalid format. Expecting asset_type (string) and tickers (array)." },
        { status: 400 }
      );
    }

    // --- Type Validation/Guard ---
    if (!isValidAssetType(asset_type)) {
      return NextResponse.json(
        { error: `Invalid asset_type: "${asset_type}". Must be one of: stock, crypto, etf.` },
        { status: 400 }
      );
    }
    // --- End Validation ---

    // --- At this point, TypeScript knows `asset_type` is ValidAssetType ---

    // Normalize input - now correctly typed
    const normalizedInput: TickerInput[] = tickers.map((symbol: string) => ({
      asset_type: asset_type, // Now known to be ValidAssetType
      symbol: symbol,
      // Add ticker_id here if needed by TickerInput/return_comparison_data
    }));

    // Fetch and transform data
    // Assuming return_comparison_data now accepts TickerInput[]
  //  const raw_data: RawComparisonData[] = await return_comparison_data(normalizedInput);
 const raw_data = await return_comparison_data(normalizedInput);

    // Placeholder extract functions - replace with your actual implementations
   
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
      symbol_id: item.id, // Assuming id is available, adjust if needed
      name: item.name,
      ticker: item.ticker_symbol,
      asset_type: item.asset_type,
      snapshot: item.ticker_snapshot,
    }));

    // Build prompt string safely
    const promptLanguage = typeof language === 'string' && language.trim() !== '' ? language : 'en';
    const prompt_for_ai = `Provide a comparison of the following tickers in ${promptLanguage}`;


    // Return structured response
    const result = {
      prompt_for_ai,
      data: {
        comparison_table_data,
        metric_comparison_data,
        comparison_chart_data,
        ratings,
        snapshots,
      },
    };

    console.log("✅ Final result structure prepared");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Error in /api/compare:", error); // Log the full error object
    const message = error instanceof Error ? error.message : "Unknown internal error";
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
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
//       symbol_id: item.id,
//       name:item.name,
//       ticker: item.ticker_symbol,
//       asset_type: item.asset_type,
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
