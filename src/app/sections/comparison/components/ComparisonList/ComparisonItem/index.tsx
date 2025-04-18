import React from 'react';
import styles from './ComparisonItem.module.css';
import SymbolTitle from '../../../../../(pages)/(dashboard)/components/Watchlist/SymbolTitle';
import { SimpleTicker } from '../../../../../../interfaces';

interface ComparisonItemProps {
  left: SimpleTicker;
  right: SimpleTicker;
}

const ComparisonItem: React.FC<ComparisonItemProps> = ({ left, right }) => {
  return (
    <div className={styles.comparisonContainer}>
      {/* Left side */}
      <div className={styles.tickerBox}>
        <SymbolTitle
          name={left.name}
          ticker={left.ticker}
          asset_type={left.asset_type}
        />
      </div>

      {/* Middle circle with VS */}
      <div className={styles.vsCircle}>VS</div>

      {/* Right side */}
      <div className={styles.tickerBox}>
        <SymbolTitle
          name={right.name}
          ticker={right.ticker}
          asset_type={right.asset_type}
        />
      </div>
    </div>
  );
};

export default ComparisonItem;
