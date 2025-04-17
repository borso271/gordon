import React from "react";
import styles from "./ComparisonBar.module.css";

type ComparisonBarProps = {
  data: { ticker: string; value: number }[];
  isPercentage?: boolean;
};

const ComparisonBar: React.FC<ComparisonBarProps> = ({ data, isPercentage = false }) => {
  return (
    <div className={styles.container}>
      {/* Top row: ValueLegend + BarChart */}
      <div className={styles.topRow}>
        <div className={styles.valueLegend}>
          <ValueLegend data={data} isPercentage={isPercentage} />
        </div>
        <div className={styles.barChart}>
          <BarChart data={data} isPercentage={isPercentage} />
        </div>
      </div>

      {/* Bottom row: NamesLegend */}
      <div className={styles.namesLegend}>
        <NamesLegend data={data} />
      </div>
    </div>
  );
};

export default ComparisonBar;

// Stub components for now
const ValueLegend = ({ data, isPercentage }: any) => (
  <div style={{ padding: "0.5rem" }}>Legend</div>
);

const BarChart = ({ data, isPercentage }: any) => (
  <div style={{ padding: "0.5rem", background: "#eee" }}>Bar Chart</div>
);

const NamesLegend = ({ data }: any) => (
  <div style={{ padding: "0.5rem", background: "#fafafa" }}>Names</div>
);
