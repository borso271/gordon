import React from 'react';
import styles from './ComparisonBars.module.css';
import ProgressBar from '../../../ProgressBar';

interface ComparisonBarsProps {
  value1: number; // percentage (0–100)
  value2: number; // percentage (0–100)
}

const ComparisonProgressBars: React.FC<ComparisonBarsProps> = ({ value1, value2 }) => {
  
  console.log("values are: ", value1, value2);

  return (
    <div className={styles.wrapper}>
      <span className={styles.percentage}>{value1.toFixed(1)}%</span>

      <div className={styles.bars}>
        <ProgressBar percentage={value1} align="right" />
        <ProgressBar percentage={value2} align="left" fillColor="#FFFFFF" />
      </div>

      <span className={styles.percentage}>{value2.toFixed(1)}%</span>
    </div>
  );
};

export default ComparisonProgressBars;
