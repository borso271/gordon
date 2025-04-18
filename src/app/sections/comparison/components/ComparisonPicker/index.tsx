// ComparisonPicker.tsx
import React, { useState } from "react";
import DropdownSelect from "../../../../../components/Dropdowns/DropdownSelect";
import { SimpleTicker } from "../../../../../interfaces";
import SecondaryButton from "../../../../../components/Buttons/SecondaryButton";
import styles from "./ComparisonPicker.module.css";
import SidebarHeading from "../../../../../components/Headings/SidebarHeading";

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


  

  const leftTicker  = leftIdx  >= 0 ? tickers[leftIdx]  : undefined;
  const rightTicker = rightIdx >= 0 ? tickers[rightIdx] : undefined;
  const disabled =
    !leftTicker || !rightTicker || leftTicker.symbol_id === rightTicker.symbol_id;

  return (
    <div className={styles.container}>
     
<SidebarHeading text={title}></SidebarHeading>
      <div className={styles.row}>
        <DropdownSelect
          items={tickers}
          placeholder="Ticker 1"
          selectedIndex={leftIdx}
          onSelect={setLeftIdx}
          rtl={rtl}
        />
        <DropdownSelect
          items={tickers}
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
