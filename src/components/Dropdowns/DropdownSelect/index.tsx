// DropdownSelect.tsx
import React, { useState, useRef, useEffect } from "react";
import SymbolDropdownButton from "../../Buttons/SymbolDropdownButton";
import styles from "./DropdownSelect.module.css";
import SymbolDropdownMenu from "../SymbolDropdownMenu";
import { SimpleTicker } from "../../../interfaces";



// export type SimpleTicker = {
//     symbol_id: number,
//     ticker: string,
//     name: string,
//     asset_type: 'stock' | 'crypto' | 'etf';
//     polygon_snapshot?: PolygonSnapshot
//   };

  
interface DropdownSelectProps {
  items: SimpleTicker[];
  placeholder?: string;
  buttonWidth?: number;
  rtl?: boolean;

  /* ── NEW (controlled mode) ── */
  selectedIndex?: number;                 // supply to control externally
  onSelect?: (index: number) => void;     // callback when a choice is made
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
    items,
    placeholder,
    buttonWidth,
    rtl = false,
    selectedIndex: controlledIndex,
    onSelect,
  }) => {
    /* internal index when component is uncontrolled */
    const [internalIndex, setInternalIndex] = useState<number>(-1);
    const isControlled = controlledIndex !== undefined;
    const currentIndex = isControlled ? controlledIndex : internalIndex;
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    /* close on outside click */
    useEffect(() => {
      const handler = (e: MouseEvent) =>
        !ref.current?.contains(e.target as Node) && setOpen(false);
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);
  
    const selectedItem = currentIndex >= 0 ? items[currentIndex] : null;
  
    const handleSelect = (idx: number) => {
      if (!isControlled) setInternalIndex(idx);
      onSelect?.(idx);
      
      setOpen(false);
    };
  
    return (
      <div ref={ref} className={styles.dropdownContainer}>
        <SymbolDropdownButton
          text={selectedItem?.name}
          placeholder={placeholder}
          ticker_symbol={selectedItem?.ticker || ""}
          asset_type={selectedItem?.asset_type || "stock"} // fallback asset_type
          onClick={() => setOpen((o) => !o)}
          width={buttonWidth}
          className={open ? styles.activeButton : undefined}
        />
  
        {open && (
          <SymbolDropdownMenu
            items={items}
            selectedIndex={currentIndex}
            setSelectedIndex={handleSelect}
            isOpen
            {...(rtl ? { left: "0" } : { right: "0" })}
          />
        )}
      </div>
    );
  };
  
  export default DropdownSelect;
  
