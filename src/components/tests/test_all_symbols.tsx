'use client';

import React, { useEffect, useState } from 'react';

interface SymbolData {
  symbol_id: number;
  ticker: string;
  name: string;
  sector?: string;
  industry?: string;
  currency?: string;
  asset_type: "stock" | "crypto" | "etf";
  // price?: number;
  // last_close?: number;
  // price_timestamp?: number;
  // last_close_unix?: number;
}

const TestAllSymbols: React.FC = () => {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch('/api/all_tickers');
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setSymbols(data);
      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSymbols();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>❌ Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📦 All Symbols (Test)</h2>
      <ul>
        {symbols.map((s) => (
          <li key={s.symbol_id}>
            <strong>{s.ticker}</strong> — {s.name} ({s.asset_type})<br />
            {s.sector && <span>Sector: {s.sector} | </span>}
            {s.industry && <span>Industry: {s.industry} | </span>}
            {s.currency && <span>Currency: {s.currency}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestAllSymbols;
