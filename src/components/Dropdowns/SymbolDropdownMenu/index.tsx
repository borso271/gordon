import React from "react";
import styles from "./SymbolDropdownMenu.module.css";
import SymbolIcon from "../../Icons/SymbolIcon";
import { SimpleTicker } from "../../../interfaces";

interface DropdownMenuProps {
  items: SimpleTicker[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  isOpen: boolean;
  top?: string;
  left?: string;
  right?: string; // ✅ New
  width?: string;
}

const SymbolDropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  selectedIndex,
  setSelectedIndex,
  isOpen,
  top = "105%",
  left,
  right, // ✅ Accept it
  width,
}) => {

    console.log("items are: ", items)
  return (
    <div
      className={`${styles.dropdownMenu} ${isOpen ? styles.show : ""}`}
      style={{
        top,
        ...(left && { left }),
        ...(right && { right }),
        ...(width && { width }),
      }}
    >
      <div className={styles.scrollContainer}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.menuItem} ${
              selectedIndex === index ? styles.active : ""
            }`}
            onClick={() => {
              setSelectedIndex(index);
              
            }}
          >
           <SymbolIcon asset_type={item.asset_type} ticker_symbol={item.ticker} size={28} />
            <span className={styles.label}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymbolDropdownMenu;
