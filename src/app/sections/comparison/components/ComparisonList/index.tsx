import React from 'react';
import ComparisonItem from './ComparisonItem';
import { SimpleTicker } from '../../../../../interfaces';
import styles from './ComparisonList.module.css'
interface ComparisonListProps {
  comparisonPairs: [SimpleTicker, SimpleTicker][];
}

const ComparisonList: React.FC<ComparisonListProps> = ({ comparisonPairs }) => {
  return (
    <div className={styles.container}>
      {comparisonPairs.map(([left, right], index) => (
        <ComparisonItem key={index} left={left} right={right} />
      ))}
    </div>
  );
};

export default ComparisonList;
