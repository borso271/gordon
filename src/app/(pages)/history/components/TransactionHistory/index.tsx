"use client";

"use client";

import { useEffect, useState } from "react";
import styles from "./TradingHistory.module.css";
import TradingHistoryTable from "../TransactionHistoryTable";
import { useUser } from "../../../../hooks/useUser";

export default function TradingHistory() {

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [allTransactions, setAllTransactions] = useState([]);
  const { user } = useUser(); // assumes user.id available

  useEffect(() => {
    if (!user?.id) return;

    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAllTransactions(data.transactions || []);
      })
      .catch((err) => {
        console.error("Error fetching transactions", err);
      });
  }, [user?.id]);

  const filtered = allTransactions.filter((t) => {
    const date = new Date(t.transaction_date).toISOString().split("T")[0];
    return (
      (!startDate || date >= startDate) &&
      (!endDate || date <= endDate)
    );
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Trading History</h2>

      <div className={styles.dateFilter}>
        <div className={styles.dateInput}>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles.dateInput}>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <TradingHistoryTable transactions={filtered} />
    </div>
  );
}
