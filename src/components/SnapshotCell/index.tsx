import React from "react";
import styles from "./SnapshotCell.module.css"; // reuse existing CSS
import ValueTrend from "../ValueTrend";


interface SnapshotCellProps {
  label: string;
  value: number | null;
  withCurrency?: boolean;
  currencySymbol?: string;
  fontSize?: string;
  type?: "type1" | "type2";
  isPercentage?: boolean;
  applyColor?: boolean;
}

const SnapshotCell: React.FC<SnapshotCellProps> = ({
  label,
  value,
  withCurrency = true,
  currencySymbol = "$",

  type = "type1",
  isPercentage = true,
  applyColor = true,
}) => {
  return (
    <div className={styles.cell}>
      <div className={styles.label}>{label}</div>

      <div className={styles.value}>
        {value !== null ? (
          <ValueTrend
            value={value}
          
            type={type}
            isPercentage={isPercentage}
            currencySymbol={withCurrency ? currencySymbol : null}
            applyColor={applyColor}
          />
        ) : (
          "--"
        )}
      </div>
    </div>
  );
};

export default SnapshotCell;
