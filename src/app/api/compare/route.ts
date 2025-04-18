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
    /* ------------- 1. Parse & validate body ------------- */
    const body = await req.json();
    const { asset_type, tickers, language } = body;

    if (!Array.isArray(tickers) || typeof asset_type !== "string") {
      return NextResponse.json(
        { status: "failure", error: "Invalid format. Expecting asset_type (string) and tickers (array)." },
        { status: 400 }
      );
    }
    if (!isValidAssetType(asset_type)) {
      return NextResponse.json(
        { status: "failure", error: `Invalid asset_type: "${asset_type}". Must be stock, crypto or etf.` },
        { status: 400 }
      );
    }

    /* ------------- 2. Normalise input ------------- */
    const normalizedInput: TickerInput[] = tickers.map((symbol: string) => ({
      asset_type,
      symbol,
    }));

    /* ------------- 3. Fetch comparison data ------------- */
    const { status: fetchStatus, data } = await return_comparison_data(normalizedInput);

    /* Require at least two tickers’ data to proceed */
    if (data.length < 2) {
      return NextResponse.json(
        { status: "failure", error: "Not enough data to compare tickers." },
        { status: 200 }
      );
    }

    /* ------------- 4. Extract/transform for the UI ------------- */
    const comparison_table_data = extractDataForComparisonTable(data);
    const metric_comparison_data = extractFinancialMetricData(data);
    const comparison_chart_data = extractTickerSymbols(data);

    const ratings = data.map((d) => ({ ticker: d.ticker_symbol, ratings: d.ratings }));
    const snapshots = data.map((d) => ({
      symbol_id: d.id,
      name: d.name,
      ticker: d.ticker_symbol,
      asset_type: d.asset_type,
      snapshot: d.ticker_snapshot,
    }));

    /* ------------- 5. Build analyst prompt ------------- */
    const promptLanguage = typeof language === "string" && language.trim() ? language : "en";

    const firstData  = data[0].data_for_ai;
    const secondData = data[1].data_for_ai;

    const prompt_for_ai = `
You are a financial analyst. Compare the following two stocks in ${promptLanguage}.
Your response must be discursive and contain 10 well‑structured subsections, reference **key metrics and trends**, provide insights (not just raw numbers), and finish with a short conclusion on which equity might be preferable and why.

🔹 Ticker 1 data:
${firstData}

🔹 Ticker 2 data:
${secondData}
`;

    /* ------------- 6. Return unified response ------------- */
    return NextResponse.json({
      status: fetchStatus,           // "success" | "failure" from the service
      prompt_for_ai,
      data: {
        comparison_table_data,
        metric_comparison_data,
        comparison_chart_data,
        ratings,
        snapshots,
      },
    });
  } catch (error: any) {
    console.error("❌ /api/compare error:", error);
    return NextResponse.json(
      { status: "failure", error: "Internal Server Error", details: error?.message ?? "" },
      { status: 500 }
    );
  }
}


// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { asset_type, tickers, language } = body; // asset_type is initially 'any' or 'unknown'

//     // --- Validation ---
//     if (!Array.isArray(tickers) || typeof asset_type !== "string") {
//       return NextResponse.json(
//         { error: "Invalid format. Expecting asset_type (string) and tickers (array)." },
//         { status: 400 }
//       );
//     }

//     // --- Type Validation/Guard ---
//     if (!isValidAssetType(asset_type)) {
//       return NextResponse.json(
//         { error: `Invalid asset_type: "${asset_type}". Must be one of: stock, crypto, etf.` },
//         { status: 400 }
//       );
//     }
//     // --- End Validation ---

//     // --- At this point, TypeScript knows `asset_type` is ValidAssetType ---

//     // Normalize input - now correctly typed
//     const normalizedInput: TickerInput[] = tickers.map((symbol: string) => ({
//       asset_type: asset_type, // Now known to be ValidAssetType
//       symbol: symbol,
//       // Add ticker_id here if needed by TickerInput/return_comparison_data
//     }));

//  const raw_data = await return_comparison_data(normalizedInput);

//     // Placeholder extract functions - replace with your actual implementations
//     // Extract required comparison sections

//     const comparison_table_data = extractDataForComparisonTable(raw_data);
//     const metric_comparison_data = extractFinancialMetricData(raw_data);
//     const comparison_chart_data = extractTickerSymbols(raw_data);


//     console.log(JSON.stringify(metric_comparison_data));
//     // 🔍 Extract ratings and snapshots separately
//     const ratings = raw_data.map((item) => ({
//       ticker: item.ticker_symbol,
//       ratings: item.ratings,
//     }));

//     const snapshots = raw_data.map((item) => ({
//       symbol_id: item.id, // Assuming id is available, adjust if needed
//       name: item.name,
//       ticker: item.ticker_symbol,
//       asset_type: item.asset_type,
//       snapshot: item.ticker_snapshot,
//     }));

//     // Build prompt string safely
//     const promptLanguage = typeof language === 'string' && language.trim() !== '' ? language : 'en';

//     const firstData = raw_data[0].data_for_ai;
//     console.log(JSON.stringify(firstData));
// const secondData = raw_data[1].data_for_ai;
// console.log(JSON.stringify(secondData));

//     const prompt_for_ai = `
// You are a financial analyst. Compare the following two stocks in ${promptLanguage} using the data provided. Your response should be:

// - Discursive and analytical, comprehensive and insightful, it should contain 10 subsections.n
// - Report the specific metrics or trends you are mentioning or analysing.
// - Offering **insights** on what makes one ticker potentially better or worse than the other
// - End with a short conclusion on which equity might be the better choice and why (if possible)

// Here is the data to base your reasoning on:

// 🔹 Ticker 1:
// ${firstData}

// 🔹 Ticker 2:
// ${secondData}
// `;

//     // Return structured response
//     const result = {
//       prompt_for_ai,
//       data: {
//         comparison_table_data,
//         metric_comparison_data,
//         comparison_chart_data,
//         ratings,
//         snapshots,
//       },
//     };

//     console.log("✅ Final result structure prepared");

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error("❌ Error in /api/compare:", error); // Log the full error object
//     const message = error instanceof Error ? error.message : "Unknown internal error";
//     return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
//   }
// }
