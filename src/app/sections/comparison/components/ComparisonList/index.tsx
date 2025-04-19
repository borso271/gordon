import React from 'react';
import ComparisonItem from './ComparisonItem';
import { SimpleTicker } from '../../../../../interfaces';
import styles from './ComparisonList.module.css'
interface ComparisonListProps {
  comparisonPairs: [SimpleTicker, SimpleTicker][];
  threadId?: string;
}

const ComparisonList: React.FC<ComparisonListProps> = ({ comparisonPairs, threadId }) => {
  return (
    <div className={styles.container}>
      {comparisonPairs.map(([left, right], index) => (
        <ComparisonItem key={index} left={left} right={right} threadId={threadId} />
      ))}
    </div>
  );
};

export default ComparisonList;
