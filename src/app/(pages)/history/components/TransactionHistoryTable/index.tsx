import React, {useState} from "react";
import styles from "./Th2.module.css";
import SymbolTitle from "../../../(dashboard)/components/Watchlist/SymbolTitle";
import { useTranslation } from "react-i18next";
import Icon from "../../../../../components/Icons/Icon";
import { Transaction } from "../../../../../interfaces";

type Props = {
    transactions: Transaction[];
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
  const { t } = useTranslation();


  const [sortKey, setSortKey] = useState<keyof Transaction | null>(null);
const [sortAsc, setSortAsc] = useState(true);

const handleSort = (key: keyof Transaction) => {
  if (key === sortKey) {
    setSortAsc(!sortAsc);
  } else {
    setSortKey(key);
    setSortAsc(true);
  }
};
const sortedTransactions = [...transactions].sort((a, b) => {
  if (!sortKey) return 0;
  const valA = a[sortKey];
  const valB = b[sortKey];

  if (valA == null) return 1;
  if (valB == null) return -1;

  if (typeof valA === "string" && typeof valB === "string") {
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  } else if (typeof valA === "number" && typeof valB === "number") {
    return sortAsc ? valA - valB : valB - valA;
  } else {
    return 0;
  }
});



const renderHeader = (key: keyof Transaction, label: string) => (
  <div
    className={`${styles.gridHeaderCell} ${sortKey === key ? styles.sorted : ""}`}
    onClick={() => handleSort(key)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && handleSort(key)}
  >
    <div className={styles.headerContent}>
      <span>{t(label)}</span>
      <Icon
        name={"sort"}
        size={16}
        className={styles.sortIcon}
      />
    </div>
  </div>
);



  return (
    <div className={styles.container}>
      <div className={styles.gridTableWrapper}>
        <div className={styles.gridTable}>
          {/* Header Row */}
          <div className={styles.gridHeaderRow}>
  {renderHeader("name", "transaction.name")}
  {renderHeader("date", "transaction.datetime")}
  {renderHeader("type", "transaction.type")}
  {renderHeader("price", "transaction.price")}
  {renderHeader("quantity", "transaction.amount")}
  {renderHeader("status", "transaction.status")}
</div>


          {/* Data Rows */}


          {sortedTransactions.map((item) => (
            <div key={item.id} className={styles.gridRow}>
              <div className={styles.gridCell} data-label={t("transaction.name")}>
                <div className={styles.cellContentFirst}>
                  <SymbolTitle name={item.name} ticker={item.ticker} />
                </div>
              </div>

              <div className={styles.gridCell} data-label={t("transaction.datetime")}>
                {formatUnixTimestamp(item.date)}
              </div>

              <div className={styles.gridCell} data-label={t("transaction.type")}>
                <div
                  className={`${styles.transactionType} ${
                    item.type === "Buy" ? styles.buy : styles.sell
                  }`}
                >
                  <div className={styles.transactionTypeText}>
                    {t(`transaction.types.${item.type}`)}
                  </div>
                  <Icon name={item.type === "Buy" ? "arrow_up" : "arrow_down"} />
                </div>
              </div>

              <div className={styles.gridCell} data-label={t("transaction.price")}>
                {item.price}
              </div>

              <div className={styles.gridCell} data-label={t("transaction.amount")}>
                {item.quantity}
              </div>

              <div className={styles.gridCell} data-label={t("transaction.status")}>
                <div className={`${styles.status} ${styles[item.status]}`}>
                  {t(`transaction.statuses.${item.status}`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// export default TransactionHistoryTable;

//   return (
//     <div className={styles.container}>
//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead className={styles.tableHead}>
//             <tr className={styles.tableHeadRow}>
//               <th className={styles.tableHeadCell}>{t("transaction.name")}</th>
//               <th className={styles.tableHeadCell}>{t("transaction.datetime")}</th>
//               <th className={styles.tableHeadCell}>{t("transaction.type")}</th>
//               <th className={styles.tableHeadCell}>{t("transaction.price")}</th>
//               <th className={styles.tableHeadCell}>{t("transaction.amount")}</th>
//               <th className={styles.tableHeadCell}>{t("transaction.status")}</th>
//             </tr>
//           </thead>
//           <tbody className={styles.tableBody}>
//             {transactions.map((item) => (
//               <tr key={item.id} className={styles.tableRow}>
//                 <td className={styles.tableCell}>
//                   <SymbolTitle name={item.name} ticker={item.ticker} />
//                 </td>
//                 <td className={styles.tableCell}>
//                   {formatUnixTimestamp(item.date)}
//                 </td>

//                 <td className={styles.tableCell}>
//   <div
//     className={`${styles.transactionType} ${
//       item.type === "Buy" ? styles.buy : styles.sell
//     }`}
//   >
   
//     <div className={styles.transactionTypeText}>{t(`transaction.types.${item.type}`)}</div>
//     <Icon name={item.type === "Buy" ? "arrow_up" : "arrow_down"} />
//   </div>
// </td>

//                 <td className={styles.tableCell}>{item.price}</td>
//                 <td className={styles.tableCell}>{item.quantity}</td>
//                 <td className={styles.tableCell}>
//   <div className={`${styles.status} ${styles[item.status]}`}>
//     {t(`transaction.statuses.${item.status}`)}
//   </div>
// </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

export default TransactionHistoryTable;
