import React from "react";
import styles from "./TransactionHistoryTable.module.css";
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

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeadCell}>{t("transaction.name")}</th>
              <th className={styles.tableHeadCell}>{t("transaction.datetime")}</th>
              <th className={styles.tableHeadCell}>{t("transaction.type")}</th>
              <th className={styles.tableHeadCell}>{t("transaction.price")}</th>
              <th className={styles.tableHeadCell}>{t("transaction.amount")}</th>
              <th className={styles.tableHeadCell}>{t("transaction.status")}</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {transactions.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <SymbolTitle name={item.name} ticker={item.ticker} />
                </td>
                <td className={styles.tableCell}>
                  {formatUnixTimestamp(item.date)}
                </td>

                <td className={styles.tableCell}>
  <div
    className={`${styles.transactionType} ${
      item.type === "Buy" ? styles.buy : styles.sell
    }`}
  >
   
    <div className={styles.transactionTypeText}>{t(`transaction.types.${item.type}`)}</div>
    <Icon name={item.type === "Buy" ? "arrow_up" : "arrow_down"} />
  </div>
</td>

                <td className={styles.tableCell}>{item.price}</td>
                <td className={styles.tableCell}>{item.quantity}</td>
                <td className={styles.tableCell}>
  <div className={`${styles.status} ${styles[item.status]}`}>
    {t(`transaction.statuses.${item.status}`)}
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistoryTable;
