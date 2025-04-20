import React from "react";
import styles from "./PortfolioTable.module.css";
import { useState } from "react";
import Icon from "../../../../../components/Icons/Icon";
import SymbolTitle from "../Watchlist/SymbolTitle";
import ActionsPart from "./components/ActionsPart";
import TerziaryH2 from "../../../../../components/Headings/TerziaryH2";
import ProgressBar from "../../../../../components/ProgressBar";
import MagicButton from "../../../../../components/Buttons/MagicButton";
import ValueTrend from "../../../../../components/ValueTrend";
import { useTranslation } from "react-i18next";
import { PortfolioItem } from "../../../../../interfaces";
import { useManualActionRequests } from "../../../../hooks/useManualActionRequests";

type Props = {
  portfolio: any;
};

const PortfolioTable: React.FC<Props> = ({ portfolio }) => {
  const { t } = useTranslation();

  const [sortKey, setSortKey] = useState<keyof PortfolioItem | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [filter, setFilter] = useState<"all" | "stock" | "crypto" | "etf">("all");

  
  const {handleOuterSummarize} = useManualActionRequests();
  const handleSort = (key: keyof PortfolioItem) => { // Use keyof
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // Filtering logic remains the same
  const filtered = portfolio.filter((item) =>
    filter === "all" ? true : item.asset_type === filter
  );

  // Sorting logic remains the same (make sure types are handled)
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey] as any; // Type assertion might be needed depending on PortfolioItem
    const valB = b[sortKey] as any;
    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === "string" && typeof valB === 'string') {
      return sortAsc
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else if (typeof valA === "number" && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    } else {
        return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }
  });

  // ——— helpers ———
  const assetTypes = ["all", "stock", "crypto", "etf"] as const;

  const renderHeader = (key: keyof PortfolioItem, i18nKey: string) => (
    <div
      className={`${styles.gridHeaderCell} ${key === sortKey ? styles.sorted : ''}`}
      onClick={() => handleSort(key)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleSort(key)}
    >
      <div className={styles.headerContent}>
        <span>{t(i18nKey)}</span>
        <Icon
          name="sort"
          size={16}
          className={styles.sortIcon}
        />
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* ——— table header / filter chips ——— */}
      <div className={styles.portfolioHeader}>
        <div className={styles.headerTop}>
          <TerziaryH2>{t('portfolio.overview.title')}</TerziaryH2>
          <MagicButton text={t('portfolio.overview.insights')} onClick={() => handleOuterSummarize()} />
        </div>

        <div className={styles.filterButtons}>
          {assetTypes.map((type) => (
            <button
              key={type}
              className={`${styles.filterButton} ${filter === type ? styles.active : ""}`}
              onClick={() => setFilter(type)}
            >
              {t(`asset_type.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* ——— grid table ——— */}
      <div className={styles.gridTableWrapper}>
        <div className={styles.gridTable}>
          <div className={styles.gridHeaderRow}>
            {renderHeader("name",        'portfolio_table.headers.name')}
            {renderHeader("last_price",  'portfolio_table.headers.price')}
            {renderHeader("allocation",  'portfolio_table.headers.allocation')}
            {renderHeader("pnl",         'portfolio_table.headers.pnl')}
            {renderHeader("quantity",    'portfolio_table.headers.amount')}
           
            <div className={styles.gridHeaderCell}>
              {t('portfolio_table.headers.actions')}
            </div>
          </div>

          {/* ——— data rows ——— */}
          {sorted.map((item) => (
            <div key={item.symbol_id} className={styles.gridRow}>
               
              <div className={styles.gridCell} data-label={t('portfolio_table.headers.name')}>
                <SymbolTitle {...item} />
              </div>

              <div className={styles.gridCell} data-label={t('portfolio_table.headers.price')}>
                {item.last_price != null ? `$${item.last_price.toFixed(2)}` : t('common.na')}
              </div>
                
              <div className={styles.gridCell} data-label={t('portfolio_table.headers.allocation')}>
                <div className={styles.allocationContent}>
                 
                  <div className={styles.allocationChange}>{`${item.allocation ?? 0}%`}</div>

                  <div className={styles.allocationBar}>
                    <ProgressBar
                      percentage={item.allocation ?? 0}
                      backgroundColor="var(--card-background-light)"
                      fillColor="#F9FFE5"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.gridCell} data-label={t('portfolio_table.headers.pnl')}>
                <ValueTrend value={(item.last_price-item.avg_price)/item.avg_price} />
              </div>
              <div className={styles.gridCell} data-label={t('portfolio_table.headers.amount')}>
                <ValueTrend
                  value={item.quantity * item.last_price}
                  currencySymbol="$"
                  applyColor={false}
                  isPercentage={false}
                />
              </div>


              <div className={styles.gridCell} data-label={t('portfolio_table.headers.actions')}>
                <ActionsPart item={item} />
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioTable;

// const PortfolioTable: React.FC<Props> = ({ portfolio }) => {
//   const [sortKey, setSortKey] = useState<keyof PortfolioItem | null>(null); // Use keyof for type safety
//   const [sortAsc, setSortAsc] = useState(true);
//   const [filter, setFilter] = useState<"all" | "stock" | "crypto" | "etf">("all");

//   const handleSort = (key: keyof PortfolioItem) => { // Use keyof
//     if (key === sortKey) {
//       setSortAsc(!sortAsc);
//     } else {
//       setSortKey(key);
//       setSortAsc(true);
//     }
//   };

//   // Filtering logic remains the same
//   const filtered = portfolio.filter((item) =>
//     filter === "all" ? true : item.asset_type === filter
//   );

//   // Sorting logic remains the same (make sure types are handled)
//   const sorted = [...filtered].sort((a, b) => {
//     if (!sortKey) return 0;
//     const valA = a[sortKey] as any; // Type assertion might be needed depending on PortfolioItem
//     const valB = b[sortKey] as any;
//     if (valA == null) return 1;
//     if (valB == null) return -1;

//     if (typeof valA === "string" && typeof valB === 'string') {
//       return sortAsc
//         ? valA.localeCompare(valB)
//         : valB.localeCompare(valA);
//     } else if (typeof valA === "number" && typeof valB === 'number') {
//       return sortAsc ? valA - valB : valB - valA;
//     } else {
//         return sortAsc
//         ? String(valA).localeCompare(String(valB))
//         : String(valB).localeCompare(String(valA));
//     }
//   });

//   // Updated function to render header cells as divs
//   const renderHeader = (label: string, key: keyof PortfolioItem) => ( // Use keyof
//     <div
//       className={`${styles.gridHeaderCell} ${key === sortKey ? styles.sorted : ''}`}
//       onClick={() => handleSort(key)}
//       role="button" // Accessibility
//       tabIndex={0} // Accessibility
//       onKeyDown={(e) => e.key === 'Enter' && handleSort(key)} // Accessibility
//     >
//       <div className={styles.headerContent}>
//         <span>{label}</span>
//         {/* Conditionally show sort direction indicator */}
//         <Icon
//           name={key === sortKey ? (sortAsc ? 'sort' : 'sort') : "sort"}
//           size={16}
//           className={styles.sortIcon} // Add class for styling icon
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className={styles.container}>
//       {/* Header and Filters remain the same */}
//       <div className={styles.portfolioHeader}>
//         <div className={styles.headerTop}>
//           <TerziaryH2>Portfolio Overview</TerziaryH2>
//           <MagicButton text="Insights" onClick={() => {}} />
//         </div>
//         <div className={styles.filterButtons}>
//           {["all", "stock", "crypto", "etf"].map((type) => (
//             <button
//               key={type}
//               className={`${styles.filterButton} ${filter === type ? styles.active : ""}`}
//               onClick={() => setFilter(type as any)}
//             >
//               {type.charAt(0).toUpperCase() + type.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className={styles.gridTableWrapper}>
//         {/* The Grid Container */}
//         <div className={styles.gridTable}>
//           {/* Header Row (Direct child of gridTable) */}
//           <div className={styles.gridHeaderRow}>
//             {renderHeader("Name", "name")}
//             {renderHeader("Price", "last_price")}
//             {renderHeader("Allocation", "allocation" as keyof PortfolioItem)} {/* Ensure 'allocation' is in PortfolioItem */}
//             {renderHeader("Amount", "quantity")}
//             {renderHeader("PnL ($)", "pnl")}
//             {/* Actions header cell */}
//             <div className={styles.gridHeaderCell}>Actions</div>
//           </div>

//           {/* Data Rows */}
//           {sorted.map((item) => (
//             <div key={item.symbol_id} className={styles.gridRow}>
//               {/* Cells as direct children of gridTable */}
//               <div className={styles.gridCell} data-label="Name"> {/* Optional: data-label for mobile */}
//                 <SymbolTitle name={item.name} ticker={item.ticker} asset_type={item.asset_type} />
//               </div>
//               <div className={styles.gridCell} data-label="Price">
//                 {item.last_price !== null ? `$${item.last_price.toFixed(2)}` : "N/A"}
//               </div>
//               <div className={styles.gridCell} data-label="Allocation">
//                  {/* Content for Allocation */}
//                  <div className={styles.allocationContent}>

//                     <div className={styles.allocationBar}> 
//                      <ProgressBar
//                          percentage={item.allocation ?? 0} // Handle null
//                          backgroundColor='var(--card-background-light)'
//                          fillColor='#F9FFE5'
                         
//                      /> </div>
//                      <span>{`${item.allocation ?? 0}%`}</span> {/* Handle null allocation */}
//                  </div>
//               </div>
//               <div className={styles.gridCell} data-label="Amount">
// <ValueTrend value={item.quantity*item.last_price} currencySymbol={"$"} applyColor={false} isPercentage={false}/>
//               </div>
//               <div
//                 className={styles.gridCell}
//                 data-label="PnL ($)">
// <ValueTrend value={item.pnl}/>
//                 {/* {item.pnl !== null ? `${item.pnl.toFixed(2)}` : "N/A"} */}
//               </div>
//               <div className={styles.gridCell} data-label="Actions">
//                 <ActionsPart item={item} />
//               </div>
//             </div>
//           ))}
//         </div> 
//       </div> 


//     </div>
//   );
// };

// export default PortfolioTable;
