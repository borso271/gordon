import React from "react";
import ComparisonPicker from "../../app/sections/comparison/components/ComparisonPicker";
import { SimpleTicker } from "../../interfaces";

const sampleTickers: SimpleTicker[] = [
  {
    symbol_id: 1,
    ticker: "AAPL",
    name: "Apple Inc.",
    asset_type: "stock",
  },
  {
    symbol_id: 2,
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    asset_type: "stock",
  },
  {
    symbol_id: 3,
    ticker: "MSFT",
    name: "Microsoft Corp.",
    asset_type: "stock",
  },
  {
    symbol_id: 4,
    ticker: "ETH",
    name: "Ethereum",
    asset_type: "crypto",
  },
];

export default function CompareTest() {
  /** what to do when user presses “Compare Symbols” */
  const handleCompare = (left: SimpleTicker, right: SimpleTicker) => {
    console.log("Compare requested:", left.ticker, "vs", right.ticker);
    // 👉 call your compare API / navigate / show chart, etc.
  };

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto" }}>
      <ComparisonPicker
        tickers={sampleTickers}
        title="Compare two symbols"
    
        rtl={false /* or i18n.dir() === 'rtl' */}
      />
    </div>
  );
}
