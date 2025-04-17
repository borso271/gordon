import React, { useState } from 'react';
import styles from './SingleAsset.module.css';
import SymbolTitle from '../../../app/(pages)/(dashboard)/components/Watchlist/SymbolTitle';
import TradeButton from '../../Buttons/TradeButton';
import ValueTrend from '../../ValueTrend';

import { PortfolioItem } from '../../../interfaces';


const SingleAssetComponent: React.FC<PortfolioItem> = ( asset ) => {

  const { ticker, symbol_id, name, last_price, asset_type, last_close } = asset;

  const [isHovered, setIsHovered] = useState(false);

  const currency = "$";
  const changePercent =
    typeof last_close === 'number' &&
    typeof last_price === 'number' &&
    last_close !== 0
      ? ((last_price - last_close) / last_close) * 100
      : 0;

  return (
    <div
      className={styles.row}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.nameBox}>
        <SymbolTitle name={name} ticker={ticker} asset_type={asset_type} />
      </div>
      <div className={styles.priceBox}>
        <div className={styles.price}><span>{currency}</span>{last_price.toFixed(2)}</div>
        <ValueTrend value={changePercent} />
      </div>
      <div className={styles.actionBox}>

        <TradeButton
          
          isHovered={isHovered} ticker={{
            symbol_id: 0,
            ticker: '',
            name: '',
            asset_type: 'stock',
            polygon_snapshot: {
              current_price: 0,
              last_close: 0,
              day_high: 0,
              day_low: 0,
              updated: 0
            }
          }}        />
      </div>
    </div>
  );
};

export default SingleAssetComponent;

