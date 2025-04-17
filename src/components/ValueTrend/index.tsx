import React from "react";
import Icon from "../Icons/Icon"; // Adjust path as needed
import styles from "./PercentageTrend.module.css";

type ValueTrendProps = {
  value: number;
  variant?: "small" | "medium" | "large"; // ✨ NEW
  type?: "type1" | "type2";
  isPercentage?: boolean;
  currencySymbol?: string | null;
  applyColor?: boolean;
};

const ValueTrend: React.FC<ValueTrendProps> = ({
  value,
  variant = "medium",
  type = "type1",
  isPercentage = true,
  currencySymbol = null,
  applyColor = true,
}) => {
  const isPositive = value >= 0;

  const iconName =
    type === "type2"
      ? isPositive
        ? "positive_trend"
        : "negative_trend"
      : isPositive
      ? "up_triangle"
      : "down_triangle";

  const formattedValue = isPercentage
    ? `${Math.abs(value).toFixed(2)}%`
    : `${currencySymbol ? `${currencySymbol}` : ""}${Math.abs(value).toFixed(2)}`;

  const className = [
    styles.trend,
    styles[variant], // ✨ Use variant-based class
    applyColor && isPositive ? styles.positive : "",
    applyColor && !isPositive ? styles.negative : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>

      {applyColor && <Icon name={iconName} size={13} />}
      <div className={styles.value}>{formattedValue}</div>
    </div>
  );
};

export default ValueTrend;

