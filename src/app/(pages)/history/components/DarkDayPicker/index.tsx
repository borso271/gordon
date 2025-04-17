"use client";
import { useRef } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import styles from "./DarkDatePicker.module.css";

import { useClickOutside } from "./use_click_outside";

type MyDarkDatePickerProps = {
    selected: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    isOpen: boolean;
    setOpen: (open: boolean) => void;
  };
  
  export const MyDarkDatePicker: React.FC<MyDarkDatePickerProps> = ({
    selected,
    onSelect,
    isOpen,
    setOpen,
  }) => {

    const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, () => {
    if (isOpen) setOpen(false);
  });


    return (
      <div ref={wrapperRef} className={styles.wrapper}>
        <input
          type="text"
          readOnly
          value={selected ? format(selected, "yyyy-MM-dd") : ""}
          onClick={() => setOpen(!isOpen)}
          className={styles.input}
          placeholder="Select a date"
        />
        {isOpen && (
          <div className={styles.calendarWrapper}>
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                onSelect(date);
                setOpen(false); // close after selection
              }}
            />
          </div>
        )}
      </div>
    );
  };
  