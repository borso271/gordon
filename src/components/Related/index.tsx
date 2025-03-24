
import React from "react";
import { useState, useEffect } from "react";
import styles from "./RelatedSymbols.module.css";
import SymbolSnapshot from "../DataDriven/Snapshot";
import {fetchRelatedSymbols} from "../../services/get_components_data/fetch_related_symbols"
import SectionHeader from "../Headings/SectionHeader";
import SuggestionsLoader from "../Loaders/SuggestionsLoader";

interface RelatedSymbolsProps {
  symbol_id: string;
  handleManualFunctionCall: (functionName: string, args: Record<string, any>) => void;
}

const RelatedSymbols: React.FC<RelatedSymbolsProps> = ({
  symbol_id,
  handleManualFunctionCall,
}) => {
  const [relatedTickers, setRelatedTickers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol_id) return;

    setLoading(true);
    setError(null);

    fetchRelatedSymbols(symbol_id)
      .then((tickers: string[]) => {
        setRelatedTickers(tickers);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [symbol_id]);

  if (loading) return <SuggestionsLoader />;
  if (error)
    return <p>Sorry! For some reason we couldn’t load the related symbols.</p>;

  const displayTickers = relatedTickers.length
    ? relatedTickers
    : ["AAPL", "MSFT", "NVDA"];

  return (
    <div className={styles.container}>
      <SectionHeader title="Related Symbols" icon="related_icon" size={18} />
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
                language: "en",
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedSymbols;
