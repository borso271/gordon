import React from 'react';
import styles from './TickerList.module.css';
import SecondaryButton from '../Buttons/SecondaryButton';
import { columnLabels } from '../../constants';
import { useInsightsClick } from '../../app/hooks/useInsightsClick';
type TableProps = {
  data: Record<string, any>[];
  language?: string;
};

function formatValue(value: any): string {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && (value.trim() === '' || value.trim().toLowerCase() === 'none'))
  ) {
    return 'Not Provided';
  }
  return String(value);
}

function TickerList({ data, language }: TableProps) {
  
    const {onInsightsClick}= useInsightsClick()
    const isArabic = language === "ar";
    const translations = {
      errorMessage: isArabic
        ? "عذرًا! حدث خطأ ما. حاول مرة أخرى."
        : "Sorry! Something went wrong. Please try again.",
      insights: isArabic ? "تحليلات" : "Insights",
    };
  
    if (data.length === 0) {
      return <div>{translations.errorMessage}</div>;
    }
  
    const headers = Object.keys(data[0]);
  
    return (
      <div className={styles.tableContainer}>
          <div className={styles.scrollableTableWrapper}>
        <table className={styles.table}>
         
        <thead className={styles.thead}>
  <tr>
    {headers.map((header) => (
      <th key={header} className={styles.th}>
        {columnLabels[header] || header}
      </th>
    ))}
    <th className={`${styles.th} ${styles.thSticky}`}></th>
  </tr>
</thead>
<tbody>
  {data.map((row, rowIndex) => (
    <tr key={rowIndex} className={styles.trHover}>
      {headers.map((header) => (
        <td key={header} className={styles.td}>
          {formatValue(row[header])}
        </td>
      ))}
      <td className={`${styles.td} ${styles.tdSticky}`}>
        <SecondaryButton text={translations.insights} onClick={() => onInsightsClick(row)} />
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
      </div>
    );
  }
  
  export default TickerList