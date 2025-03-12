import React, { useState, useEffect } from "react";
import styles from "./Ratings.module.css";
import SecondaryH2 from "../../Headings/SecondaryH2"
import PercentageBar from "../../PercentageBar";
import fetch_symbol_info from "../../../utils/fetch_symbol_info";
import supabase_client from "../../../lib/supabaseClient";

const AnalystRatings = ({ ticker_symbol }) => {
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker_symbol) return;

    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { id: symbol_id } = await fetch_symbol_info(ticker_symbol) || {};

        if (!symbol_id) throw new Error(`Symbol ID not found for ${ticker_symbol}`);

        const { data, error } = await supabase_client
          .from("analyst_ratings")
          .select("*")
          .eq("symbol_id", symbol_id)
          .single();

        if (error) throw new Error(`Error fetching ratings: ${error.message}`);

        setRatings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [ticker_symbol]);

  // Compute total ratings
  const totalRatings = ratings
    ? ratings.strong_buy_count + ratings.buy_count + ratings.hold_count + ratings.sell_count + ratings.strong_sell_count
    : 0;

  // Convert counts into percentages
  const getPercentage = (count) => (totalRatings ? ((count / totalRatings) * 100).toFixed(1) : "0");

  return (
    <div className={styles.container}>
       {/* <div className={styles.ratingsWrapper}> */}
      {/* Header Section */}
      <div className={styles.header}>
        <SecondaryH2>Analyst Ratings</SecondaryH2>
       
      <p className={styles.subheading}>
          Based on {totalRatings} analyst ratings
        </p>
    
      </div>

      {/* Main Grid Section */}
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>❌ {error}</p>}
      {ratings && (
        <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {[
            { label: "Strong Buy", count: ratings.strong_buy_count },
            { label: "Buy", count: ratings.buy_count },
            { label: "Hold", count: ratings.hold_count },
            { label: "Sell", count: ratings.sell_count },
            { label: "Strong Sell", count: ratings.strong_sell_count },
          ].map(({ label, count }) => (
            <div key={label} className={styles.row}>
              <div className={styles.label}>{label}</div>
              
              <PercentageBar percentage={getPercentage(count)} />
              <div className={styles.percentage}>{getPercentage(count)}%</div>
            </div>
          ))}
        </div></div>
      )}
    </div>
    // </div>
  );
};

export default AnalystRatings;
