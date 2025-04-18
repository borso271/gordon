import React, { useState } from 'react';
import styles from './PortfolioSummary.module.css';
import OverviewContent from './components/OverviewContent';
import { PortfolioItem, Transaction } from '../../../../interfaces';
import { filterTransactionsByAssetType } from './utils/filterTransactionsByAssetType';
import { useTranslation } from 'react-i18next';
import SidebarHeading from '../../../../components/Headings/SidebarHeading';



interface Allocation {
  label: string;
  value: number;
}

interface PortfolioData {
  start_date: string;
  user_cash:number;
  user_balance: number;
  totalInvested: number;
  unrealizedGainLoss: number;
  number_of_transactions: number;
  realized_gains: number;
  assets: PortfolioItem[];
  history: Transaction[];
  assetTypeAllocation: Allocation[];
  stockSectorAllocation: Allocation[];
}


interface PortfolioSummaryProps {
  data: PortfolioData;
}

function formatDate(date: string | Date) {
  const d = new Date(date);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}


const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ data }) => {
  const { t } = useTranslation();
  const [selectedAssetType, setSelectedAssetType] = useState<'all' | 'stock' | 'crypto' | 'etf'>('all');



  const dataForHeader = {
    number_of_transactions: data.number_of_transactions,
    realized_gains: data.realized_gains,
    user_balance: data.user_balance,
    user_cash: data.user_cash,
    start_date: data.start_date,
    unrealizedGainLoss: data.unrealizedGainLoss,
    totalInvested: data.totalInvested,
  };

  const filteredAssets =
    selectedAssetType === 'all'
      ? data.assets
      : data.assets.filter(asset => asset.asset_type === selectedAssetType);

  const filteredHistory = filterTransactionsByAssetType(data.history, selectedAssetType);

  const handleFilterClick = (type: 'all' | 'stock' | 'crypto' | 'etf') => {
    setSelectedAssetType(type);
  };

  const assetTypes = ['all', 'stock', 'crypto', 'etf'] as const;

  return (
    <div className={styles.container}>
      <div className={styles.top}>

      <h2 className={styles.title}>
  {t('portfolio_summary.title')}{": "}
  <span className={styles.dateRange}>
    <span className={styles.date}>{formatDate(data.start_date)}</span>
    {" "}
    {t('portfolio_summary.to')}
    {" "}
    <span className={styles.date}>{formatDate(new Date())}</span>
  </span>
</h2>

        <div className={styles.buttonGroup}>
          {assetTypes.map(type => (
            <button
              key={type}
              className={`${styles.filterButton} ${selectedAssetType === type ? styles.active : ''}`}
              onClick={() => handleFilterClick(type)}
            >
              {t(`asset_type.${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <OverviewContent
        dataForHeader={dataForHeader}
          filteredAssets={filteredAssets}
          filteredHistory={filteredHistory}
          selectedAssetType={selectedAssetType}
          data={data}
        />
      </div>
    </div>
  );
};

export default PortfolioSummary;


// const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ data }) => {
//   const [selectedAssetType, setSelectedAssetType] = useState<'all' | 'stock' | 'crypto' | 'etf'>('all');

//   const filteredAssets = selectedAssetType === 'all'
//     ? data.assets
//     : data.assets.filter(asset => asset.asset_type === selectedAssetType);

//   const filteredHistory = filterTransactionsByAssetType(data.history, selectedAssetType);

//   const handleFilterClick = (type: 'all' | 'stock' | 'crypto' | 'etf') => {
//     setSelectedAssetType(type);
//   };

//   return (
//     <div className={styles.container}>

//       <div className={styles.top}>
//       <h2 className={styles.title}>Portfolio Summary</h2>

//       <div className={styles.buttonGroup}>
//         {['all', 'stock', 'crypto', 'etf'].map(type => (
//           <button
//             key={type}
//             className={`${styles.filterButton} ${selectedAssetType === type ? styles.active : ''}`}
//             onClick={() => handleFilterClick(type as typeof selectedAssetType)}
//           >
//             {type.charAt(0).toUpperCase() + type.slice(1)}
//           </button>
//         ))}
//       </div>
//       </div> 
//       <div className={styles.content}>
//       <OverviewContent
//       filteredAssets={filteredAssets}
//       filteredHistory={filteredHistory}
//       selectedAssetType={selectedAssetType}
//       data={data}
      
//       />
//       </div>
//     </div>
//   );
// };

// export default PortfolioSummary;


// format of incoming data:
// {
//   "number_of_transactions": 25,
//   "realized_gains": 0,
//   "user_balance": 100000,
//   "start_date": "2024-04-13",
//   "assets": [
//       {
//           "symbol_id": 101,
//           "ticker": "AAPL",
//           "name": "Apple Inc.",
//           "currency": "USD",
//           "quantity": 50,
//           "avg_price": 155.75,
//           "asset_type": "stock",
//           "sector": "Technology",
//           "last_close": 191.49,
//           "first_acquired": "1678886400000",
//           "last_updated": "1718086400000",
//           "created_at": "1678886410000",
//           "last_price": 192.1,
//           "last_price_timestamp": "1718086400000",
//           "pnl": 1817.5
//       },
//       {
//           "symbol_id": 102,
//           "ticker": "MSFT",
//           "name": "Microsoft Corporation",
//           "currency": "USD",
//           "quantity": 30,
//           "avg_price": 380.5,
//           "asset_type": "stock",
//           "sector": "Technology",
//           "last_close": 427.87,
//           "first_acquired": "1681478400000",
//           "last_updated": "1718086399000",
//           "created_at": "1681478415000",
//           "last_price": 429.3,
//           "last_price_timestamp": "1718086399000",
//           "pnl": 1464
//       },
//       {
//           "symbol_id": 103,
//           "ticker": "GOOGL",
//           "name": "Alphabet Inc. (Class A)",
//           "currency": "USD",
//           "quantity": 25,
//           "avg_price": 135.2,
//           "asset_type": "stock",
//           "sector": "Communication Services",
//           "last_close": 176.44,
//           "first_acquired": "1673788800000",
//           "last_updated": "1718086398000",
//           "created_at": "1673788812000",
//           "last_price": 177.15,
//           "last_price_timestamp": "1718086398000",
//           "pnl": 1048.75
//       },
//       {
//           "symbol_id": 104,
//           "ticker": "AMZN",
//           "name": "Amazon.com, Inc.",
//           "currency": "USD",
//           "quantity": 40,
//           "avg_price": 140,
//           "asset_type": "stock",
//           "sector": "Consumer Cyclical",
//           "last_close": 187.06,
//           "first_acquired": "1693574400000",
//           "last_updated": "1718086397000",
//           "created_at": "1693574420000",
//           "last_price": 186.8,
//           "last_price_timestamp": "1718086397000",
//           "pnl": 1872
//       },
//       {
//           "symbol_id": 105,
//           "ticker": "NVDA",
//           "name": "NVIDIA Corporation",
//           "currency": "USD",
//           "quantity": 15,
//           "avg_price": 750,
//           "asset_type": "stock",
//           "sector": "Technology",
//           "last_close": 120.91,
//           "first_acquired": "1704067200000",
//           "last_updated": "1718086396000",
//           "created_at": "1704067218000",
//           "last_price": 121.5,
//           "pnl": -9427.5
//       },
//       {
//           "symbol_id": 106,
//           "ticker": "META",
//           "name": "Meta Platforms, Inc.",
//           "currency": "USD",
//           "quantity": 20,
//           "avg_price": 350.8,
//           "asset_type": "stock",
//           "sector": "Communication Services",
//           "last_close": 502.3,
//           "first_acquired": "1696166400000",
//           "last_updated": "1718086395000",
//           "created_at": "1696166411000",
//           "last_price": 505,
//           "last_price_timestamp": "1718086395000",
//           "pnl": 3084
//       },
//       {
//           "symbol_id": 107,
//           "ticker": "TSLA",
//           "name": "Tesla, Inc.",
//           "currency": "USD",
//           "quantity": 35,
//           "avg_price": 210,
//           "asset_type": "stock",
//           "sector": "Consumer Cyclical",
//           "last_close": 177.29,
//           "first_acquired": "1689331200000",
//           "last_updated": "1718086394000",
//           "created_at": "1689331213000",
//           "last_price": 175.5,
//           "last_price_timestamp": "1718086394000",
//           "pnl": -1207.5
//       },
//       {
//           "symbol_id": 108,
//           "ticker": "BTCUSD",
//           "name": "Bitcoin",
//           "currency": "USD",
//           "quantity": 0.05,
//           "avg_price": 45000,
//           "asset_type": "crypto",
//           "sector": null,
//           "last_close": 69500,
//           "first_acquired": "1698844800000",
//           "last_updated": "1718086393000",
//           "created_at": "1698844819000",
//           "last_price": 69650,
//           "last_price_timestamp": "1718086393000",
//           "pnl": 1232.5
//       },
//       {
//           "symbol_id": 109,
//           "ticker": "ETHUSD",
//           "name": "Ethereum",
//           "currency": "USD",
//           "quantity": 1.5,
//           "avg_price": 2800,
//           "asset_type": "crypto",
//           "sector": null,
//           "last_close": 3680,
//           "first_acquired": "1701388800000",
//           "last_updated": "1718086392000",
//           "created_at": "1701388814000",
//           "last_price": 3675,
//           "last_price_timestamp": "1718086392000",
//           "pnl": 1312.5
//       },
//       {
//           "symbol_id": 110,
//           "ticker": "VOO",
//           "name": "Vanguard S&P 500 ETF",
//           "currency": "USD",
//           "quantity": 50,
//           "avg_price": 450,
//           "asset_type": "etf",
//           "sector": null,
//           "last_close": 502.15,
//           "first_acquired": "1672531200000",
//           "last_updated": "1718086391000",
//           "created_at": "1672531210000",
//           "last_price": 503.5,
//           "last_price_timestamp": "1718086391000",
//           "pnl": 2675
//       },
//       {
//           "symbol_id": 111,
//           "ticker": "QQQ",
//           "name": "Invesco QQQ Trust",
//           "currency": "USD",
//           "quantity": 40,
//           "avg_price": 390,
//           "asset_type": "etf",
//           "sector": null,
//           "last_close": 460.54,
//           "first_acquired": "1675209600000",
//           "last_updated": "1718086390000",
//           "created_at": "1675209617000",
//           "last_price": 462.2,
//           "last_price_timestamp": "1718086390000",
//           "pnl": 2888
//       },
//       {
//           "symbol_id": 112,
//           "ticker": "JPM",
//           "name": "JPMorgan Chase & Co.",
//           "currency": "USD",
//           "quantity": 60,
//           "avg_price": 170.1,
//           "asset_type": "stock",
//           "sector": "Financial Services",
//           "last_close": 195.86,
//           "first_acquired": "1684080000000",
//           "last_updated": "1718086389000",
//           "created_at": "1684080015000",
//           "last_price": 196.5,
//           "last_price_timestamp": "1718086389000",
//           "pnl": 1584
//       },
//       {
//           "symbol_id": 113,
//           "ticker": "JNJ",
//           "name": "Johnson & Johnson",
//           "currency": "USD",
//           "quantity": 75,
//           "avg_price": 150,
//           "asset_type": "stock",
//           "sector": "Health Care",
//           "last_close": 147.16,
//           "first_acquired": "1677628800000",
//           "last_updated": "1718086388000",
//           "created_at": "1677628818000",
//           "last_price": 147.5,
//           "last_price_timestamp": "1718086388000",
//           "pnl": -187.5
//       },
//       {
//           "symbol_id": 114,
//           "ticker": "V",
//           "name": "Visa Inc.",
//           "currency": "USD",
//           "quantity": 55,
//           "avg_price": 250.25,
//           "asset_type": "stock",
//           "sector": "Technology",
//           "last_close": 274.87,
//           "first_acquired": "1686739200000",
//           "last_updated": "1718086387000",
//           "created_at": "1686739212000",
//           "last_price": 276,
//           "last_price_timestamp": "1718086387000",
//           "pnl": 1416.25
//       },
//       {
//           "symbol_id": 115,
//           "ticker": "WMT",
//           "name": "Walmart Inc.",
//           "currency": "USD",
//           "quantity": 100,
//           "avg_price": 55,
//           "asset_type": "stock",
//           "sector": "Consumer Defensive",
//           "last_close": 66.71,
//           "first_acquired": "1690848000000",
//           "last_updated": "1718086386000",
//           "created_at": "1690848014000",
//           "last_price": 66.9,
//           "last_price_timestamp": "1718086386000",
//           "pnl": 1190
//       },
//       {
//           "symbol_id": 116,
//           "ticker": "BRK-B",
//           "name": "Berkshire Hathaway Inc. (Class B)",
//           "currency": "USD",
//           "quantity": 25,
//           "avg_price": 385.5,
//           "asset_type": "stock",
//           "sector": "Financial Services",
//           "last_close": 409.75,
//           "first_acquired": "1706745600000",
//           "last_updated": "1718086385000",
//           "created_at": "1706745619000",
//           "last_price": 410.2,
//           "last_price_timestamp": "1718086385000",
//           "pnl": 617.5
//       },
//       {
//           "symbol_id": 117,
//           "ticker": "UNH",
//           "name": "UnitedHealth Group Incorporated",
//           "currency": "USD",
//           "quantity": 15,
//           "avg_price": 510,
//           "asset_type": "stock",
//           "sector": "Health Care",
//           "last_close": 498.82,
//           "first_acquired": "1694784000000",
//           "last_updated": "1718086384000",
//           "created_at": "1694784013000",
//           "last_price": 495.5,
//           "last_price_timestamp": "1718086384000",
//           "pnl": -217.5
//       },
//       {
//           "symbol_id": 118,
//           "ticker": "PG",
//           "name": "Procter & Gamble Company",
//           "currency": "USD",
//           "quantity": 80,
//           "avg_price": 160,
//           "asset_type": "stock",
//           "sector": "Consumer Defensive",
//           "last_close": 166.78,
//           "first_acquired": "1688169600000",
//           "last_updated": "1718086383000",
//           "created_at": "1688169611000",
//           "last_price": 167.2,
//           "last_price_timestamp": "1718086383000",
//           "pnl": 576
//       },
//       {
//           "symbol_id": 119,
//           "ticker": "SOL",
//           "name": "Solana",
//           "currency": "USD",
//           "quantity": 25,
//           "avg_price": 100,
//           "asset_type": "crypto",
//           "sector": null,
//           "last_close": 158.5,
//           "first_acquired": "1709251200000",
//           "last_updated": "1718086382000",
//           "created_at": "1709251215000",
//           "last_price": 159.8,
//           "last_price_timestamp": "1718086382000",
//           "pnl": 1495
//       },
//       {
//           "symbol_id": 120,
//           "ticker": "SPY",
//           "name": "SPDR S&P 500 ETF Trust",
//           "currency": "USD",
//           "quantity": 30,
//           "avg_price": 480,
//           "asset_type": "etf",
//           "sector": null,
//           "last_close": 534.01,
//           "first_acquired": "1672531200000",
//           "last_updated": "1718086381000",
//           "created_at": "1672531216000",
//           "last_price": 535.1,
//           "last_price_timestamp": "1718086381000",
//           "pnl": 1653
//       }
//   ],
//   "unrealizedGainLoss": 14886,
//   "totalInvested": 186055.75,
//   "assetTypeAllocation": {
//       "stock": 63.82,
//       "crypto": 6.46,
//       "etf": 29.72
//   },
//   "stockSectorAllocation": {
//       "Technology": 30.79,
//       "Communication Services": 11.33,
//       "Consumer Cyclical": 10.62,
//       "Financial Services": 17.19,
//       "Health Care": 14.42,
//       "Consumer Defensive": 15.65
//   }
// }