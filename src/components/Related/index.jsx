/* Do the similar stock component taking from the database,
but first do the actual snapshot.

Then do the response parts */

import React from "react";

import { useState, useEffect } from "react";
import styles from "./RelatedSymbols.module.css";
import SymbolSnapshot from "../DataDriven/Snapshot";

import supabase_client from "../../lib/supabaseClient";

import SectionHeader from "../Headings/SectionHeader";


/**
 * Fetches up to 6 related symbols for a given symbol_id,
 * then retrieves their ticker from the symbols table.
 *
 * @param {number} symbolId The symbol_id whose related symbols we want
 * @returns {Promise<string[]>} Array of ticker symbols
 */
export async function fetchRelatedSymbols(symbolId) {
  if (!symbolId) {
    return [];
  }

  // 1) Fetch the related_symbol_ids from related_symbols
  //    matching the given symbol_id.
  const { data: relData, error: relError } = await supabase_client
    .from("related_symbols")
    .select("related_symbol_id")
    .eq("symbol_id", symbolId)
    .limit(6);

  if (relError) {
    console.error("Error fetching related_symbol_id from related_symbols:", relError);
    throw relError;
  }

  if (!relData || relData.length === 0) {
    // No related symbols found
    return [];
  }

  // Extract just the IDs
  const relatedIds = relData.map((row) => row.related_symbol_id);

  // 2) Fetch the corresponding ticker from the symbols table
  //    using the IDs from the first query.
  const { data: symData, error: symError } = await supabase_client
    .from("symbols")
    .select("id, ticker")
    .in("id", relatedIds); // .in() filters by an array of IDs

  if (symError) {
    console.error("Error fetching ticker from symbols:", symError);
    throw symError;
  }

  // symData is an array of objects: [{ id: 5, ticker: "AAPL" }, ...]
  // Return just the tickers
  const tickers = symData.map((row) => row.ticker);
  return tickers;
}



export default function RelatedSymbols({ symbol_id, handleManualFunctionCall }) {
  const [relatedTickers, setRelatedTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol_id) return;
    setLoading(true);
    setError(null);

    fetchRelatedSymbols(symbol_id)
      .then((tickers) => {
        setRelatedTickers(tickers);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [symbol_id]);

  if (loading) return <p>Loading related symbols...</p>;
  if (error) return <p>Error: {error}</p>;

  // Ensure we display at least 3 cards (fallback to placeholders if needed)
  const displayTickers = relatedTickers.length
    ? relatedTickers
    : ["AAPL", "MSFT", "NVDA"];

  return (
    <div className={styles.container}>
      <SectionHeader title={"Related Symbols"} icon={"related_icon"} size={16}/>
      <div className={styles.cardsContainer}>
        {displayTickers.map((ticker, idx) => (
          <SymbolSnapshot
            key={idx}
            symbol={ticker}
            icon={true}
            onClick={() =>
              handleManualFunctionCall("analyze_security", {
                symbol: ticker,
                asset_type: "stock",
                language: "en"
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
