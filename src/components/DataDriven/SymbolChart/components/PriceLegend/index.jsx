

import styles from './PriceLegend.module.css'
const PriceLegend = ({ height, metadata, yoffset }) => {
    if (!metadata || metadata.length === 0) return null;
  
    const numTicks = metadata.length;
    const tickSpacing = height / (numTicks - 1); // Compute spacing in pixels
  
    return (
        <div className={styles.priceLegend}>
      <svg width="70" height={height} viewBox={`0 0 70 ${height}`} xmlns="http://www.w3.org/2000/svg">
        {metadata.map((item, index) => {
          const yPosition = height - index * tickSpacing; // Flip y-axis so lowest price is at the bottom
  
          // ❌ Skip first and last labels
         // if ( index === 0 || index === metadata.length - 1) return null;
          if ( index %2 === 0) return null;
  
          return (
            <g key={item.index} transform={`translate(0, ${yPosition+yoffset})`}>
              <text x="0" y="0" fontSize="12" textAnchor="start" dominantBaseline="middle"
              fill="#757575" /* ✅ Corrected: Use fill instead of color */
              fontFamily="Inter" /* ✅ Corrected: Use = instead of : */>

             
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
  