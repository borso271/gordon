// DropdownSelect.tsx
import React, { useState, useRef, useEffect } from "react";
import DropdownButton from "../../Buttons/DropdownButton";
import DropdownMenu   from "../DropdownMenu";
import styles from "./DropdownSelect.module.css";

export interface DropdownItem { icon?: string; label: string; onClick: () => void }

interface DropdownSelectProps {
  items: DropdownItem[];
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

  const label = currentIndex >= 0 ? items[currentIndex].label : undefined;
  const leftIcon = currentIndex >= 0 ? items[currentIndex].icon : null;

  const handleSelect = (idx: number) => {
    if (!isControlled) setInternalIndex(idx);
    onSelect?.(idx);            // let parent know
    items[idx].onClick();       // run item action
    setOpen(false);
  };

  return (
    <div ref={ref} className={styles.dropdownContainer}>
      <DropdownButton
        text={label}
        placeholder={placeholder}

        leftIcon={leftIcon}

        rightIcon={open ? "chevron_up" : "chevron_down"}
        onClick={() => setOpen(o => !o)}
        width={buttonWidth}
        className={open ? styles.activeButton : undefined}
      />

      {open && (
        <DropdownMenu
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


