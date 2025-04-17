'use client';

import React, { useEffect, useState } from 'react';
import { fetchUserPortfolioWithPrices } from '../../services/portfolio_overview/fetch_portfolio_performance';
type EnrichedPortfolioEntry = Awaited<ReturnType<typeof fetchUserPortfolioWithPrices>>[number];

const PortfolioWithPricesTest: React.FC = () => {
  const [portfolio, setPortfolio] = useState<EnrichedPortfolioEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = 'abc'; // Replace or make dynamic as needed

    const fetchData = async () => {
      try {
        const data = await fetchUserPortfolioWithPrices(userId);
        setPortfolio(data);
      } catch (err: any) {
        console.error('❌ Error fetching portfolio with prices:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading portfolio...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!portfolio || portfolio.length === 0) return <div>No holdings found.</div>;

  return (
    <div>
      <h2>Enriched Portfolio</h2>
      <ul>
        {portfolio.map((entry) => (
          <li key={entry.symbol_id}>
            <strong>{entry.ticker}</strong> - {entry.name}<br />
            Quantity: {entry.quantity} @ Avg: ${entry.avg_price}<br />
            AssetType: {entry.asset_type}<br />
            Price: ${entry.current_price} | Value: ${(entry.quantity * entry.current_price).toFixed(2)}<br />
            Sector: {entry.sector}, Exchange: {entry.exchange_mic}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioWithPricesTest;
