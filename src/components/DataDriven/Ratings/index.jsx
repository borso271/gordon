import React, { useState,useMemo, useEffect } from "react";
import styles from "./Ratings.module.css";
import PercentageBar from "../../PercentageBar";
import fetch_symbol_info from "../../../utils/fetch_symbol_info";
import supabase_client from "../../../lib/supabaseClient";
import SectionHeader from "../../Headings/SectionHeader";
import AnalystRatingLoader from "../../Loaders/RatingsLoader";



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

  // Compute the most voted rating
  const mostVotedRating = useMemo(() => {
    if (!ratings) return null;

    const ratingCounts = {
      strong_buy_count: ratings.strong_buy_count,
      buy_count: ratings.buy_count,
      hold_count: ratings.hold_count,
      sell_count: ratings.sell_count,
      strong_sell_count: ratings.strong_sell_count
    };

    // Find the rating with the highest count
    const [mostVotedKey, mostVotedCount] = Object.entries(ratingCounts).reduce(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      ["", 0]
    );

    // Mapping the key to a human-readable label
    const labelMapping = {
      strong_buy_count: "Strong Buy",
      buy_count: "Buy",
      hold_count: "Hold",
      sell_count: "Sell",
      strong_sell_count: "Strong Sell"
    };

    return { label: labelMapping[mostVotedKey] || "Unknown", count: mostVotedCount };
  }, [ratings]);

  // Convert counts into percentages
  const getPercentage = (count) => (totalRatings ? ((count / totalRatings) * 100).toFixed(1) : "0");
  
 

    const dynamicTitle = mostVotedRating ? (
      <>
        {getPercentage(mostVotedRating.count)}%
        <span className={styles.says}> says </span> 
      {mostVotedRating.label}
      </>
    ) : "Ratings";


  if (!ratings) {
    return <AnalystRatingLoader />;
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <SectionHeader title={dynamicTitle} icon={"ratings_icon"} />
        <p className={styles.subheading}>Based on {totalRatings} analyst ratings</p>
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
              { label: "Strong Sell", count: ratings.strong_sell_count }
            ].map(({ label, count }) => (
              <div key={label} className={styles.row}>
                <div className={styles.label}>{label}</div>
                <div className={styles.percentageBarContainer}>
                  <PercentageBar percentage={getPercentage(count)} />
                </div>
                <div className={styles.percentage}>{getPercentage(count)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalystRatings;

// const AnalystRatings = ({ ticker_symbol }) => {
//   const [ratings, setRatings] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!ticker_symbol) return;

//     const fetchRatings = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const { id: symbol_id } = await fetch_symbol_info(ticker_symbol) || {};

//         if (!symbol_id) throw new Error(`Symbol ID not found for ${ticker_symbol}`);

//         const { data, error } = await supabase_client
//           .from("analyst_ratings")
//           .select("*")
//           .eq("symbol_id", symbol_id)
//           .single();

//         if (error) throw new Error(`Error fetching ratings: ${error.message}`);

//         setRatings(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRatings();
//   }, [ticker_symbol]);

//   // Compute total ratings
//   const totalRatings = ratings
//     ? ratings.strong_buy_count + ratings.buy_count + ratings.hold_count + ratings.sell_count + ratings.strong_sell_count
//     : 0;

//   // Convert counts into percentages
//   const getPercentage = (count) => (totalRatings ? ((count / totalRatings) * 100).toFixed(1) : "0");


//   if (!ratings){
//     return (
//    < AnalystRatingLoader/>)
//   }
//   return (
//     <div className={styles.container}>
//        {/* <div className={styles.ratingsWrapper}> */}
//       {/* Header Section */}
//       <div className={styles.header}>
//      <SectionHeader title={"Ratings"} icon={"ratings_icon"}/>
       
//       <p className={styles.subheading}>
//           Based on {totalRatings} analyst ratings
//         </p>
    
//       </div>

//       {/* Main Grid Section */}
//       {loading && <p className={styles.loading}>Loading...</p>}
//       {error && <p className={styles.error}>❌ {error}</p>}
//       {ratings && (
//         <div className={styles.gridContainer}>
//         <div className={styles.grid}>
//           {[
//             { label: "Strong Buy", count: ratings.strong_buy_count },
//             { label: "Buy", count: ratings.buy_count },
//             { label: "Hold", count: ratings.hold_count },
//             { label: "Sell", count: ratings.sell_count },
//             { label: "Strong Sell", count: ratings.strong_sell_count },
//           ].map(({ label, count }) => (
//             <div key={label} className={styles.row}>
//               <div className={styles.label}>{label}</div>
//               <div className={styles.percentageBarContainer}>
//               <PercentageBar percentage={getPercentage(count)} /></div>
//               <div className={styles.percentage}>{getPercentage(count)}%</div>
//             </div>
//           ))}
//         </div></div>
//       )}
//     </div>
//     // </div>
//   );
// };

// export default AnalystRatings;
