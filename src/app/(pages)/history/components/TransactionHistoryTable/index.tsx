import React from "react";
import styles from "./TransactionHistoryTable.module.css";
import PrimaryH2 from "../../../../../components/Headings/PrimaryH2";
import SymbolTitle from "../../../(dashboard)/components/Watchlist/SymbolTitle";


type TransactionItem = {
  id: number | null;
  ticker: string | null;
  name: string | null;
  date: number | null;
  type: string | null;
  price: number;
  quantity: number;
  
};

type Props = {
    transactions: TransactionItem[];
};


export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear().toString().slice(-2);
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}/${month}/${day} · ${hours}.${minutes}.${seconds}`;
}

const TransactionHistoryTable: React.FC<Props> = ({ transactions }) => {
  return (
    <div className={styles.container}>
       
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeadCell}>Name</th>
            <th className={styles.tableHeadCell}>Date/Time</th>
            <th className={styles.tableHeadCell}>Type</th>
            <th className={styles.tableHeadCell}>Price</th>
            <th className={styles.tableHeadCell}>Amount</th>
            <th className={styles.tableHeadCell}>Status</th>
           
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {transactions.map((item) => (
            <tr key={item.id} className={styles.tableRow}>
              <td className={styles.tableCell}><SymbolTitle name={item.name} ticker={item.ticker} /></td>
              <td className={styles.tableCell}>
              {formatUnixTimestamp(item.date)}
              </td>
              <td className={styles.tableCell}>{item.type}</td> 
              <td className={styles.tableCell}>{item.price}</td>
              <td className={styles.tableCell}>{item.quantity}</td>
            
              <td className={styles.tableCell}>Confirmed</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default TransactionHistoryTable;
