// ComparisonPicker.tsx
import React, { useState } from "react";
import DropdownSelect from "../../../../../components/Dropdowns/DropdownSelect";
import { DropdownItem } from "../../../../../components/Dropdowns/DropdownSelect";
import SecondaryButton from "../../../../../components/Buttons/SecondaryButton";
import styles from "./ComparisonPicker.module.css";
import { SimpleTicker } from "../../../../../interfaces";

interface ComparisonPickerProps {
  tickers: SimpleTicker[];
  title: string;
  onCompare: (left: SimpleTicker, right: SimpleTicker) => void;
  rtl?: boolean;
}

const ComparisonPicker: React.FC<ComparisonPickerProps> = ({
  tickers,
  title,
  onCompare,
  rtl = false,
}) => {
  const [leftIdx,  setLeftIdx]  = useState(-1);
  const [rightIdx, setRightIdx] = useState(-1);

  const dropdownItems: DropdownItem[] = tickers.map(t => ({
    icon: t.asset_type, label: t.ticker, onClick: () => {}
  }));

  const leftTicker  = leftIdx  >= 0 ? tickers[leftIdx]  : undefined;
  const rightTicker = rightIdx >= 0 ? tickers[rightIdx] : undefined;
  const disabled =
    !leftTicker || !rightTicker || leftTicker.symbol_id === rightTicker.symbol_id;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.row}>
        <DropdownSelect
          items={dropdownItems}
          placeholder="Ticker 1"
          selectedIndex={leftIdx}
          onSelect={setLeftIdx}
          rtl={rtl}
        />
        <DropdownSelect
          items={dropdownItems}
          placeholder="Ticker 2"
          selectedIndex={rightIdx}
          onSelect={setRightIdx}
          rtl={rtl}
        />
      </div>

      <button
       
        disabled={disabled}
        onClick={() => leftTicker && rightTicker && onCompare(leftTicker, rightTicker)}
        className={styles.compareBtn}
      >Compare Symbols</button>
    </div>
  );
};

export default ComparisonPicker;
