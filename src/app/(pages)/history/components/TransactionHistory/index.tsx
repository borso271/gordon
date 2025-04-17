"use client";

"use client";

import { useEffect, useState } from "react";
import styles from "./TradingHistory.module.css";
import TradingHistoryTable from "../TransactionHistoryTable";
import { useUser } from "../../../../hooks/useUser";
import { MyDarkDatePicker } from "../DarkDayPicker";
import "react-datepicker/dist/react-datepicker.css";
import { fake_transaction_history } from "../../../../fake_data/history";


export default function TransactionHistory() {

  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }
  
  const today = new Date();
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  
  const [startDate, setStartDate] = useState<Date | undefined>(tenYearsAgo);
  const [endDate, setEndDate] = useState<Date | undefined>(today);
  
  const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);

  const [allTransactions, setAllTransactions] = useState(fake_transaction_history);
  const { user } = useUser(); // assumes user.id available

  useEffect(() => {

    setAllTransactions(fake_transaction_history);

  }, [user?.id]);

  const filtered = allTransactions.filter((t) => {
   
    const txDate = new Date(Number(t.date));

    return (
      (!startDate || txDate >= startDate) &&
      (!endDate || txDate <= endDate)
    );
  });

  console.log("filtered are: ", filtered)
  

  return (
    <div className={styles.container}>

      <div className={styles.header}>
      <h2 className={styles.title}>Transaction History</h2>
<div className={styles.dateFilter}>
  <div className={styles.dateInput}>

<MyDarkDatePicker
  selected={startDate}
  onSelect={setStartDate}
  isOpen={openPicker === "start"}
  setOpen={(open) => setOpenPicker(open ? "start" : null)}
/>

  </div>

  <div className={styles.dateInput}>

<MyDarkDatePicker
  selected={endDate}
  onSelect={setEndDate}
  isOpen={openPicker === "end"}
  setOpen={(open) => setOpenPicker(open ? "end" : null)}
/>

  </div>
</div>
</div>

      <TradingHistoryTable transactions={filtered} />
     
    </div>
  );
}



    // if (!user?.id) return;

    // fetch("/api/fetch_user_transactions", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ user_id: user.id }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setAllTransactions(data.transactions || []);
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching transactions", err);
    //   });