import React from 'react';
import styles from './ComparisonItem.module.css';
import SymbolTitle from '../../../../../(pages)/(dashboard)/components/Watchlist/SymbolTitle';
import { SimpleTicker } from '../../../../../../interfaces';

import { useManualSubmit } from '../../../../../hooks/useManualSubmit';

interface ComparisonItemProps {
  left: SimpleTicker;
  right: SimpleTicker;
  threadId?: string;
}

const ComparisonItem: React.FC<ComparisonItemProps> = ({ left, right, threadId }) => {
  const { submitQuery } = useManualSubmit();

  const handleClick = () => {
    const query = `Compare these stocks: ${left.name} (ticker: ${left.ticker}) and ${right.name} (ticker: ${right.ticker})`;
    submitQuery(query, false, threadId); // 👈 suppress user message
  };

  return (
    <div className={styles.comparisonContainer} onClick={handleClick}>
      <div className={styles.tickerBox}>
        <SymbolTitle
          name={left.name}
          ticker={left.ticker}
          asset_type={left.asset_type}
        />
      </div>

      <div className={styles.vsCircle}>VS</div>

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
