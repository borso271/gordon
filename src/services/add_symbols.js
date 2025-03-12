import fs from "fs";
import {parse} from "csv-parse";

// 🔹 Supabase Config (Replace with your actual keys)
import supabase_client from "../lib/supabaseClient.js";

// 🔹 Map exchange to MIC
const EXCHANGE_MIC_MAP = {
  NYSE: "XNYS",
  NASDAQ: "XNAS",
};

// 🔹 Function to check existing tickers in Supabase
async function getExistingTickers() {
    const { data, error } = await supabase_client
      .from("symbols")
      .select("ticker"); // Fetch only the ticker column
  
    if (error) {
      console.error("❌ Error fetching existing tickers:", error.message);
      return new Set(); // Return empty set to avoid blocking process
    }
  
    return new Set(data.map((entry) => entry.ticker)); // Convert to a Set for fast lookup
  }


// 🔹 Function to Process and Insert CSV Data
async function insertSymbolsFromCSV(csvFilePath) {
    const existingTickers = await getExistingTickers(); // Fetch existing tickers before processing CSV
    const records = [];
  
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on("data", (row) => {
          // Only process NYSE and NASDAQ
          if (!EXCHANGE_MIC_MAP[row.exchange]) return;
  
          // Check ticker length
          if (row.symbol.length > 10) {
            console.error(`🚨 Skipping entry: Symbol '${row.symbol}' is too long (length: ${row.symbol.length})`);
            return; // Skip this entry
          }
  
          // Check for duplicate ticker in Supabase
          if (existingTickers.has(row.symbol)) {
            console.log(`⚠️ Skipping duplicate: Symbol '${row.symbol}' already exists in Supabase`);
            return; // Skip this entry
          }
  
          // Prepare data object for Supabase
          const symbolData = {
            ticker: row.symbol,
            name: row.name,
            asset_type: row.assetType.toLowerCase(),
            exchange_mic: EXCHANGE_MIC_MAP[row.exchange],
            currency: "USD",
            sector: null,
            industry: null,
            figi: null,
            websocket: null,
            polygon_code: null,
            last_updated: new Date().toISOString(),
          };
  
          records.push(symbolData);
        })
        .on("end", async () => {
          if (records.length === 0) {
            console.log("❌ No new valid records found for NYSE/NASDAQ.");
            return resolve();
          }
  
          // Log all records before inserting
          console.log(`📝 Records to insert: ${JSON.stringify(records, null, 2)}`);
  
          // Insert into Supabase
          const { data, error } = await supabase_client.from("symbols").insert(records);
  
          if (error) {
            console.error("❌ Supabase Insert Error:", error.message);
            console.error("🚨 Problematic Entry:", records);
            return reject(error);
          }
  
          console.log(`✅ Successfully inserted ${records.length} new records.`);
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ CSV Read Error:", err.message);
          reject(err);
        });
    });
  }
  
  // Example Usage:
  insertSymbolsFromCSV("listed_stocks.csv")
    .then(() => console.log("🚀 Import completed"))
    .catch((err) => console.error("💥 Import failed:", err));