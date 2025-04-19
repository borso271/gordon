// ComparisonPicker.tsx
import React, { useState } from "react";
import DropdownSelect from "../../../../../components/Dropdowns/DropdownSelect";
import { SimpleTicker } from "../../../../../interfaces";
import SecondaryButton from "../../../../../components/Buttons/SecondaryButton";
import styles from "./ComparisonPicker.module.css";
import SidebarHeading from "../../../../../components/Headings/SidebarHeading";
import { useManualSubmit } from "../../../../hooks/useManualSubmit";
import { useTranslation } from "react-i18next";

interface ComparisonPickerProps {
  tickers: SimpleTicker[];
  title: string;
  rtl?: boolean;
}

const ComparisonPicker: React.FC<ComparisonPickerProps> = ({
  tickers,
  title,
  rtl = false,
}) => {
  const { t } = useTranslation();
  const [leftIdx, setLeftIdx] = useState(-1);
  const [rightIdx, setRightIdx] = useState(-1);

  const leftTicker = leftIdx >= 0 ? tickers[leftIdx] : undefined;
  const rightTicker = rightIdx >= 0 ? tickers[rightIdx] : undefined;
  const disabled =
    !leftTicker || !rightTicker || leftTicker.symbol_id === rightTicker.symbol_id;

  const { submitQuery } = useManualSubmit();

  const handleCompare = () => {
    if (!leftTicker || !rightTicker) return;

    const query = `${t("compare_query")}: ${leftTicker.name} (ticker: ${leftTicker.ticker}) ${t(
      "and"
    )} ${rightTicker.name} (ticker: ${rightTicker.ticker})`;
    submitQuery(query, false); // ⛔ don't add user message
  };

  return (
    <div className={styles.container}>
      <SidebarHeading text={title} />

      <div className={styles.row}>
        <DropdownSelect
          items={tickers}
          placeholder={t("ticker_1")}
          selectedIndex={leftIdx}
          onSelect={setLeftIdx}
          rtl={rtl}
        />
        <DropdownSelect
          items={tickers}
          placeholder={t("ticker_2")}
          selectedIndex={rightIdx}
          onSelect={setRightIdx}
          rtl={rtl}
        />
      </div>

      <button
        className={styles.compareBtn}
        disabled={disabled}
        onClick={handleCompare}
      >
        {t("compare_symbols")}
      </button>
    </div>
  );
};

export default ComparisonPicker;


// const ComparisonPicker: React.FC<ComparisonPickerProps> = ({
//   tickers,
//   title,
//   rtl = false,
// }) => {
//   const [leftIdx, setLeftIdx] = useState(-1);
//   const [rightIdx, setRightIdx] = useState(-1);

//   const leftTicker = leftIdx >= 0 ? tickers[leftIdx] : undefined;
//   const rightTicker = rightIdx >= 0 ? tickers[rightIdx] : undefined;
//   const disabled =
//     !leftTicker || !rightTicker || leftTicker.symbol_id === rightTicker.symbol_id;

//   const { submitQuery } = useManualSubmit();

//   const handleCompare = () => {
//     if (!leftTicker || !rightTicker) return;

//     const query = `Compare these stocks: ${leftTicker.name} (ticker: ${leftTicker.ticker}) and ${rightTicker.name} (ticker: ${rightTicker.ticker})`;
//     submitQuery(query, false); // ⛔ don't add user message
//   };

//   return (
//     <div className={styles.container}>
//       <SidebarHeading text={title} />

//       <div className={styles.row}>
//         <DropdownSelect
//           items={tickers}
//           placeholder="Ticker 1"
//           selectedIndex={leftIdx}
//           onSelect={setLeftIdx}
//           rtl={rtl}
//         />
//         <DropdownSelect
//           items={tickers}
//           placeholder="Ticker 2"
//           selectedIndex={rightIdx}
//           onSelect={setRightIdx}
//           rtl={rtl}
//         />
//       </div>

//       <button
//         className={styles.compareBtn}
//         disabled={disabled}
//         onClick={handleCompare}>
//         Compare Symbols
//       </button>
//     </div>
//   );
// };

// export default ComparisonPicker;
