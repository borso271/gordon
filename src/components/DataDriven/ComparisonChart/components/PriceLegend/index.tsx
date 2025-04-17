import React from 'react';
import styles from './PriceLegend.module.css';

interface LegendItem {
  index: number;
  label: string;
}

interface PriceLegendProps {
  height: number;
  yoffset: number;
  metadata: LegendItem[];
}

const PriceLegend: React.FC<PriceLegendProps> = ({ height, metadata, yoffset }) => {
  if (!metadata || metadata.length === 0) return null;

  const numTicks = metadata.length;
  const tickSpacing = height / (numTicks - 1);

  return (
    <div className={styles.priceLegend}>
      <svg width="70" height={height} viewBox={`0 0 70 ${height}`} xmlns="http://www.w3.org/2000/svg">
        {metadata.map((item, index) => {
          const yPosition = height - index * tickSpacing;

          // Skip even-indexed labels (optional rule, as in original)
          if (index % 2 === 0) return null;

          return (
            <g key={item.index} transform={`translate(0, ${yPosition + yoffset})`}>
              <text
                x="0"
                y="0"
                fontSize="12"
                textAnchor="start"
                dominantBaseline="middle"
                fill="#757575"
                fontFamily="Helvetica"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default PriceLegend;
