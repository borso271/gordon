import React from 'react';
import styles from './ValueChangeDisplay.module.css';
import Icon from '../../../Icons/Icon';

interface ValueChangeDisplayProps {
  change: number;
  percentChange: number;
}

const ValueChangeDisplay: React.FC<ValueChangeDisplayProps> = ({
  change,
  percentChange,
}) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const iconName = isPositive ? 'positive_trend' : isNegative ? 'negative_trend' : '';

  const changeClass = `${styles.changeValue} ${
    isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral
  }`;

  return (
    <div className={changeClass}>
      {!isNeutral && (
        <div>
          <Icon name={iconName} size={14} />
        </div>
      )}

      <div className={styles.currencyAndAmount}>
        <div className={styles.currency}>$</div>
        <div className={styles.amount}>
          {Math.abs(change).toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })}
        </div>
      </div>

      <div className={styles.pchange}>
        ({Math.abs(percentChange).toFixed(2)}%)
      </div>
    </div>
  );
};

export default ValueChangeDisplay;
