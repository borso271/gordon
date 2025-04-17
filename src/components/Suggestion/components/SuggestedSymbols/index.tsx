import React from "react";
import styles from "./SuggestedSymbols.module.css";
import SymbolSnapshot from "../../../DataDriven/Snapshot";
import { useLanguage } from "../../../../app/hooks/useLanguage";
import TradingViewSingleQuote from "../../../TradingView/Snapshot"

interface SuggestedSymbolItem {
  symbol: string;
  asset_type: "stock" | "crypto" | "etf";
  exchange_mic: string;
}

interface SuggestedSymbolsProps {
  data: {
    suggestions: SuggestedSymbolItem[];
  };
  handleManualFunctionCall: (functionName: string, args: Record<string, any>) => void;
}

const SuggestedSymbols: React.FC<SuggestedSymbolsProps> = ({ data, handleManualFunctionCall }) => {
  const {currentLang} = useLanguage()

  return (
    <div className={styles.cardsContainer}>
      {data.suggestions.map((item, index) => (
        <SymbolSnapshot
          key={index}
          onClick={() =>
            handleManualFunctionCall("analyze_security", {
              language: currentLang,
              symbol: item.symbol,
              asset_type: item.asset_type,
            })
          }
          symbol={item.symbol}
          icon={true}
        />
      ))}
    </div>
  );
};

export default SuggestedSymbols;




// trading view version:

// interface SuggestedSymbolItem {
//   symbol: string;
//   asset_type: string;
//   exchange_mic: string;
// }

// interface SuggestedSymbolsProps {
//   data: {
//     suggestions: SuggestedSymbolItem[];
//   };
//   handleManualFunctionCall: (functionName: string, args: Record<string, any>) => void;
// }

// const SuggestedSymbols: React.FC<SuggestedSymbolsProps> = ({ data, handleManualFunctionCall }) => {
//   const { currentLang } = useLanguage();

//   return (
//     <div className={styles.cardsContainer}>
//       {data.suggestions.map((item, index) => (
//         <div
//           key={index}
//           className={styles.cardWrapper} // you can add hover/click styles here
//           onClick={() =>
//             handleManualFunctionCall('analyze_security', {
//               language: currentLang,
//               symbol: item.symbol,
//               asset_type: item.asset_type,
//             })
//           }
//           style={{ cursor: 'pointer' }}
//         >
//           <TradingViewSingleQuote
//             symbol={`${item.symbol}`}
//             language={currentLang === 'ar' ? 'ar' : 'en'}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SuggestedSymbols;