
import supabase_client from '../../../../lib/supabaseClient.js';

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import AnalysisSchema from "./analysis_schema.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
 // apiKey: process.env.OPENAI_API_KEY, // Ensure you set this in your .env
   apiKey: OPENAI_API_KEY
});

/**
 * Fetches a structured OpenAI response for a given symbol,
 * either from a Supabase cache or directly from OpenAI.
 * 
 * @param {string} ticker_symbol - Asset's ticker symbol (e.g., "AAPL" or "BTC-USD").
 * @param {number} symbol_id - Corresponding symbol ID in your database.
 * @param {string} language - Desired language of the analysis (e.g., "English", "Spanish").
 * @param {Object} company_data - Data object containing "Company Profile", "Technical Indicators", etc.
 * @returns {Object|boolean} - Parsed analysis from OpenAI or boolean `false` if something fails.
 */


async function fetch_openai_response_structured(ticker_symbol, asset_type, symbol_id, language, company_data) {
  try {
    // Extract the company name from the nested data object
    const company_name = company_data["Company Profile"]?.["Name"] || ticker_symbol;

    // 1️⃣ CHECK CACHE: Query the most recent entry from the "stock_analysis" table
    const { data: existingEntries, error: dbError } = await supabase_client
      .from("stock_analysis")
      .select("created_at, analysis") // ✅ Select only required fields
      .eq("symbol_id", symbol_id)
      .eq("agent_name", "gpt4o_structured")
      .order("created_at", { ascending: false })
      .limit(1);

    if (dbError) {
      console.error("❌ Database query error:", dbError.message);
    }

    // ✅ Validate if cached analysis is still valid (within 24 hours)
    if (existingEntries && existingEntries.length > 0) {
      const cachedEntry = existingEntries[0];
      const cachedTime = new Date(cachedEntry.created_at).getTime();
      const now = Date.now();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (now - cachedTime < TWENTY_FOUR_HOURS) {
        console.log("✅ Returning valid cached result from DB");

        return {
          prestored: true,
          created_at: cachedEntry.created_at,
          analysis: cachedEntry.analysis,
          symbol: ticker_symbol,
          asset_type: asset_type,
          symbol_id: symbol_id,
          failed: false
        };
      } else {
        console.log("⚠️ Cached result is older than 24 hours. Fetching a new one...");
      }
    } else {
      console.log("🚀 No cached analysis found, generating new response...");
    }

    // 2️⃣ NO VALID CACHE: Generate a new analysis via OpenAI
    let userPrompt = `Analyze the financial data of ${company_name}: ${JSON.stringify(company_data)}`;
    if (language && language.toLowerCase() !== "english") {
      userPrompt += `\nPlease provide the analysis in ${language}.`;
    }

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst providing insights on companies based on financial data.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(AnalysisSchema, "financial_analysis"),
    });

    // 3️⃣ PARSE THE STRUCTURED RESPONSE
    const financial_analysis = completion.choices[0].message.parsed;
    console.log("✅ Fetched new structured analysis");

    // ✅ Return the newly fetched structured analysis in the new format
    return {
      prestored: false,
      created_at: new Date().toISOString(),
      analysis: financial_analysis,
      symbol: ticker_symbol,
      asset_type: asset_type,
      symbol_id: symbol_id,
      failed: false
    };

  } catch (error) {
    console.error("❌ Error with OpenAI completion:", error.message);
    return { prestored: false, created_at: new Date().toISOString(), analysis: "Error retrieving analysis.", failed: true };
  }
}

export default fetch_openai_response_structured;