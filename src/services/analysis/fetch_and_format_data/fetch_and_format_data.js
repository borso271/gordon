
import fetchExternalIndicators from "./fetch/fetch_external_indicators.js";
import fetchCompanyProfile from "./fetch/fetch_profile.js";
import fetchFinancials from "./fetch/fetch_financials.js";
import fetchTechnicalIndicators from "./fetch/fetch_technical_indicators.js";
import formatFinancialData from "./format/format_financials";
import fetch_symbol_info from "../../database/fetch_symbol_info.js";
import supabase_client from "../../../lib/supabaseClient.js";
/**
 * Fetches and formats financial data for a given ticker symbol.
 * This function retrieves different sets of data depending on whether the asset type is a stock or crypto.
 *
 * @param {string} ticker_symbol - The ticker symbol of the asset (e.g., "AAPL", "BTC-USD").
 * @param {string} asset_type - The type of asset ("stock" or "crypto").
 * @returns {Promise<Object>} - A structured object containing financial data for AI processing.
 * @throws {Error} - If the symbol ID is not found in the database.
 */

async function fetchFormatData(ticker_symbol, asset_type) {
    /* 1️⃣  Look up symbol in DB */
    const { id: symbol_id, name } = (await fetch_symbol_info(ticker_symbol)) || {};
  
    /* 2️⃣  Handle “symbol not found” gracefully */
    if (!symbol_id) {
      return { status: "failure", reason: "symbol_not_found", ticker: ticker_symbol };
    }
  
    /* 3️⃣  CRYPTO branch */
    if (asset_type === "crypto") {
      const companyProfile       = await fetchCompanyProfile(ticker_symbol, symbol_id, supabase_client);
      const technicalIndicators  = await fetchTechnicalIndicators(ticker_symbol, symbol_id, supabase_client);
      const externalIndicators   = await fetchExternalIndicators(ticker_symbol, symbol_id, supabase_client);
  
      return {
        status: "success",
        id: symbol_id,
        name,
        ticker_symbol,
        data_for_ai: {
          "Company Profile":      companyProfile,
          "Technical Indicators": { ...technicalIndicators, ...externalIndicators },
        },
      };
    }
  
    /* 4️⃣  STOCK branch */
    if (asset_type === "stock") {
      const companyProfile      = await fetchCompanyProfile(ticker_symbol, symbol_id, supabase_client);
      const technicalIndicators = await fetchTechnicalIndicators(ticker_symbol, symbol_id, supabase_client);
      const financials          = await fetchFinancials(ticker_symbol, symbol_id, supabase_client);
      const formattedFinancials = formatFinancialData(financials);
  
      return {
        status: "success",
        id: symbol_id,
        name,
        ticker_symbol,
        data_for_ai: {
          "Company Profile":      companyProfile,
          "Technical Indicators": technicalIndicators,
          "Financials":           formattedFinancials,
        },
      };
    }
  
    /* 5️⃣  Unsupported asset type */
    return {
      status: "failure",
      reason: "unsupported_asset_type",
      ticker: ticker_symbol,
      asset_type,
    };
  }
  
  export default fetchFormatData;
  
// async function fetchFormatData(ticker_symbol, asset_type) {
//     // 🔍 Fetch the symbol ID from the database
//     const { id: symbol_id, name } = await fetch_symbol_info(ticker_symbol) || {};
    
//     // ❌ If symbol ID is not found, throw an error to prevent further processing
   
//     if (!symbol_id) {
//         return { status: "failure", reason: "symbol_not_found", ticker: ticker_symbol };
//       }

//     // ✅ Fetch data for CRYPTO assets
//     if (asset_type === "crypto") {
//         // Get company profile data (metadata about the cryptocurrency)
//         const companyProfile = await fetchCompanyProfile(ticker_symbol, symbol_id, supabase_client);

//         // Get technical indicators (e.g., moving averages, RSI, MACD)
//         const technical_indicators = await fetchTechnicalIndicators(ticker_symbol, symbol_id, supabase_client);

//         // Get external indicators (e.g., sentiment data, market trends)
//         const external_indicators = await fetchExternalIndicators(ticker_symbol, symbol_id, supabase_client);
    
//         return {
//             "id": symbol_id,
//             "name": name,
//             "ticker_symbol": ticker_symbol,
//             "data_for_ai": {
//                 "Company Profile": companyProfile,
//                  "Technical Indicators": {
//                 ...technical_indicators,  // 🔄 Merge technical indicators
//                 ...external_indicators    // 🔄 Merge external indicators
//             }
//             }
//         };
//     }
    
//     // ✅ Fetch data for STOCK assets
//     else if (asset_type === "stock") {

//         // Fetch company profile data

//         const companyProfile = await fetchCompanyProfile(ticker_symbol, symbol_id, supabase_client);
        
//         // Fetch technical indicators (e.g., moving averages, volatility)
//         const technical_indicators = await fetchTechnicalIndicators(ticker_symbol, symbol_id, supabase_client);
        
//         // Fetch raw financial data (e.g., revenue, earnings, balance sheets)
//         const financials = await fetchFinancials(ticker_symbol, symbol_id, supabase_client);
        
//         // 📊 Format financial data to be more structured for AI processing
        
//         const formatted_financials = formatFinancialData(financials);
//         console.log("formatted data is: ", formatted_financials)

//         return {
//             "id": symbol_id,
//             "name": name,
//             "ticker_symbol": ticker_symbol,
//             "data_for_ai": {
//                 "Company Profile": companyProfile,
//                 "Technical Indicators": technical_indicators,
//                 "Financials": formatted_financials
//             }
//         };
//     }
// }

// export default fetchFormatData;
