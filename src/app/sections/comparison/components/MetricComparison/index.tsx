
import React, { useMemo,useState,useCallback, useEffect } from "react";
import BarChart from './BarChart';
import styles from './MetricComparison.module.css'
// import styles from './MetricComparison.module.css'; // Assuming you have styles
import TickersLegend from "./TickersLegend";
// --- Mock Data and Types (Replace with your actual types/imports) ---
import Icon from "../../../../../components/Icons/Icon";
import DropdownMenu from "../../../../../components/Dropdowns/DropdownMenu";
import { useTranslation } from "react-i18next";
import SidebarHeading from "../../../../../components/Headings/SidebarHeading";
import { useLanguage } from "../../../../hooks/useLanguage";
interface RawDataEntry {
  ticker: string;
  data: {
    [metricName: string]: {
      value?: string;
      one_quarter_trend?: string;
      one_year_trend?: string;
    };
  };
}

interface DropdownItem {
  label: string;
  icon?: string;
  onClick: () => void;
}

// interface MetricComparisonProps {
//   rawData: RawDataEntry[];
//   isPercentage?: boolean; // Note: You seem to handle this based on selectedField now
//   maxHeight?: number;
// }

// const VALUE_OPTIONS = ["value", "one_quarter_trend", "one_year_trend"];

const COLORS = ["#F9FFE5", "#B1F625",];

/* MetricComparison.tsx */

// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import Icon from "@/components/ui/Icon";
// import DropdownMenu, { DropdownItem } from "@/components/ui/DropdownMenu";
// import BarChart from "@/components/charts/BarChart";
// import TickersLegend from "@/components/charts/TickersLegend";
// import styles from "./MetricComparison.module.css";

type PeriodValue = "value" | "one_quarter_trend" | "one_year_trend";
type MetricComparisonProps = {
  rawData: RawDataEntry[];
  maxHeight?: number;
};

const VALUE_OPTIONS: PeriodValue[] = ["value", "one_quarter_trend", "one_year_trend"];

interface MetricEntry {
  ticker: string;
  data: Record<string, Record<PeriodValue, string | number>>;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */


/* Turn “Current Assets” → “current_assets” */
const slug = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")     // Replace all non-alphanumeric groups with _
    .replace(/^_+|_+$/g, "");        // Remove leading/trailing underscores

    
const MetricComparison: React.FC<MetricComparisonProps> = ({
  rawData,
  maxHeight = 200,
}) => {
  /* ------------------------------------------------------------------ */
  /* i18n                                                                */
  /* ------------------------------------------------------------------ */
  const { t } = useTranslation();

  /* Words used when parsing “$3.5 Billion”‑style strings */
  const billionWord  = t("units.billion", { defaultValue: "Billion" });
  const millionWord  = t("units.million", { defaultValue: "Million" });
  const thousandWord = t("units.thousand", { defaultValue: "K" });

  const unitRegex = useMemo(
    () =>
      new RegExp(
        `\\s*(${[
          billionWord,
          millionWord,
          thousandWord,
          "Billion",
          "Million",
          "K",
        ]
          .filter(Boolean)
          .join("|")})\\b`,
        "gi"
      ),
    [billionWord, millionWord, thousandWord]
  );

  /* ------------------------------------------------------------------ */
  /* State & derived data                                                */
  /* ------------------------------------------------------------------ */
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedField, setSelectedField]   = useState<PeriodValue>("value");

  const allMetrics   = rawData.length ? Object.keys(rawData[0].data) : [];
  const metricToUse  = selectedMetric ?? allMetrics[0] ?? null;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    allMetrics.findIndex((m) => m === metricToUse) || 0
  );

  /* ------------------------------------------------------------------ */
  /* Localisation helper                                                 */
  /* ------------------------------------------------------------------ */
  const getMetricLabel = useCallback(
    (metric: string) =>
      t(`metrics.${slug(metric)}`, { defaultValue: metric }),
    [t]
  );

  /* Dropdown items – memoised so they only rebuild on language change
     or when metric list itself changes */


  const dropdownItems: DropdownItem[] = useMemo(
    () =>
      allMetrics.map((metric, index) => ({
        label: getMetricLabel(metric),
        onClick: () => {
          setSelectedMetric(metric);
          setDropdownOpen(false);
          setSelectedIndex(index);
        },
      })),
    [allMetrics, getMetricLabel]
  );

  /* ------------------------------------------------------------------ */
  /* Effects                                                             */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (selectedMetric === null && allMetrics.length) {
      setSelectedMetric(allMetrics[0]);
    } else if (selectedMetric && !allMetrics.includes(selectedMetric) && allMetrics.length) {
      setSelectedMetric(allMetrics[0]);
    } else if (selectedMetric && !allMetrics.length) {
      setSelectedMetric(null);
    }
  }, [allMetrics, selectedMetric]);

  /* ------------------------------------------------------------------ */
  /* Guard                                                               */
  /* ------------------------------------------------------------------ */
  if (!metricToUse || !rawData.length) {
    return (
      <div className={styles.container}>
        {t("metric_comparison.loading")}
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Build chart data                                                    */
  /* ------------------------------------------------------------------ */
  const barData = rawData.map(({ ticker, data }) => {
    const rawValue = data[metricToUse]?.[selectedField];
    let value = 0;

    if (typeof rawValue === "string" && rawValue.trim() && rawValue !== "N/A") {
      const cleaned = rawValue
        .replace(/[,$%]/g, "")
        .replace(unitRegex, (_match, unit: string) => {
          const u = unit.toLowerCase();
          if (u === "billion" || u === billionWord.toLowerCase())  return "e9";
          if (u === "million" || u === millionWord.toLowerCase())  return "e6";
          if (u === "k"       || u === thousandWord.toLowerCase()) return "e3";
          return "";
        });

      const numeric = Number(cleaned);
      if (!Number.isNaN(numeric)) value = numeric;
    } else if (typeof rawValue === "number") {
      value = rawValue;
    }

    return { ticker, value };
  });

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div className={styles.container}>
      {/* Metric title */}
      <SidebarHeading text={getMetricLabel(metricToUse)} />

      <div className={styles.controls}>
        <div className={styles.selectWrapper}>
          <div className={styles.dropdownContainer}>
            <div
              className={styles.dropdownHeader}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span>{getMetricLabel(metricToUse)}</span>
              <Icon name={dropdownOpen ? "chevron_up" : "chevron_down"} size={18} />
            </div>

            <div className={styles.dropdownWrapper}>
              <DropdownMenu
                items={dropdownItems}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                isOpen={dropdownOpen}
                top="10px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <BarChart
        key={`${metricToUse}-${selectedField}`}
        colors={COLORS}
        data={barData}
        isPercentage={selectedField !== "value"}
        maxHeight={maxHeight}
      />

      {/* Value‑type buttons */}
      <div className={styles.buttonGroup}>
        {VALUE_OPTIONS.map((key) => (
          <button
            key={key}
            className={`${styles.valueButton} ${selectedField === key ? styles.active : ""}`}
            onClick={() => setSelectedField(key)}
          >
            {t(`metric_comparison.${key}`)}
          </button>
        ))}
      </div>

      <TickersLegend rawData={rawData} colors={COLORS} />
    </div>
  );
};

export default MetricComparison;


  