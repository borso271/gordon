import React from 'react';
import styles from './DataTable.module.css'; // Optional: add styles

type NestedData = Record<string, Record<string, string | number | null | undefined>>;

interface DataTableProps {
  title: string;
  data: NestedData;
}

const DataTable: React.FC<DataTableProps> = ({ title, data }) => {
    
  const rowKeys = Object.keys(data);
  const columnKeys = rowKeys.length > 0 ? Object.keys(data[rowKeys[0]]) : [];

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th colSpan={columnKeys.length + 1} className={styles.titleRow}>
            {title}
          </th>
        </tr>
        <tr>
          <th></th>
          {columnKeys.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowKeys.map((rowKey) => (
          <tr key={rowKey}>
            <td className={styles.rowHeader}>{rowKey}</td>
            {columnKeys.map((colKey) => (
              <td key={colKey}>
                {data[rowKey][colKey] !== undefined ? data[rowKey][colKey] : "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;

// <DataTable
//   title="Financial Summary"
//   data={{
//     "2021": { Revenue: 100, Profit: 20 },
//     "2022": { Revenue: 150, Profit: 50 },
//     "2023": { Revenue: 200, Profit: 80 },
//   }}
// />