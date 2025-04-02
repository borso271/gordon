'use client';

import { useState } from 'react';

export default function WebSearchTest() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [citations, setCitations] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setResult(null);
    setCitations([]);

    try {
      const res = await fetch('/api/openai_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          location: {
            country: 'SA',
            city: 'Riyadh',
            region: 'Riyadh'
          }
        })
      });

      const data = await res.json();
      setResult(data.result);
      setCitations(data.citations || []);
    } catch (err) {
      setResult('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Web Search Test</h2>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Ask something..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Result:</h3>
          <p>{result}</p>

          {citations.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Citations:</h4>
              <ul className="list-disc list-inside text-sm text-blue-700">
                {citations.map((c, idx) => (
                  <li key={idx}>
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      {c.title || c.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
