'use client';

import React, { useEffect, useState } from 'react';

const TestSymbolSnapshot: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const response = await fetch('/api/price_snapshot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol_id: 1,
            symbol: 'AAPL',
            asset_type: 'stock',
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Unknown error');
          return;
        }

        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch snapshot');
      }
    }

    fetchSnapshot();
  }, []);

  if (error) return <div style={{ color: 'red' }}>❌ Error: {error}</div>;
  if (!data) return <div>Loading snapshot...</div>;

  return (
    <div>
      <h2>📈 Snapshot for {data.ticker}</h2>
      <ul>
        <li><strong>Current Price:</strong> {data.current_price}</li>
        <li><strong>Last Close:</strong> {data.last_close}</li>
        <li><strong>Day High:</strong> {data.day_high}</li>
        <li><strong>Day Low:</strong> {data.day_low}</li>
        <li><strong>Updated:</strong> {new Date(data.updated).toLocaleString()}</li>
      </ul>
    </div>
  );
};

export default TestSymbolSnapshot;
