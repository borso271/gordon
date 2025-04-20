import React from "react";
import styles from "./ActionsPart.module.css";
import Icon from "../../../../../../../components/Icons/Icon";
import TradeButton from "../../../../../../../components/Buttons/TradeButton";
import { useAnalyzeStock } from "../../../../../../hooks/useManualAnalyzeStock";
import { SimpleTicker } from "../../../../../../../interfaces";

interface ActionsPartProps {
  item: SimpleTicker;
}

const ActionsPart: React.FC<ActionsPartProps> = ({ item }) => {

  const { analyzeStock } = useAnalyzeStock();

  // Convert PortfolioItem to Stock shape
  const ticker: SimpleTicker = {
    symbol_id: item.symbol_id!,
    ticker: item.ticker ?? "",
    name: item.name ?? "",
    asset_type: item.asset_type as "stock" | "crypto" | "etf",
  };

  return (
    <div className={styles.actions}>
      <TradeButton ticker={ticker} />

      <button
  className={styles.iconButton}
  onClick={() => analyzeStock(ticker)}
>
        <Icon
          name="current_magic_stick"
          size={18}
          style={{
            fill: "white",
          }}
        />
      </button>
    </div>
  );
};

export default ActionsPart;
