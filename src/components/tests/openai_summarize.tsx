'use client';

import { useState } from 'react';

export default function ExtractTest() {
  const [query, setQuery] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query || !content) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/openai_summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, content }),
      });

      const data = await res.json();
      setResult(data.result || 'No result returned.');
    } catch (err) {
      setResult('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Test OpenAI Extract API</h2>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Enter your query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <textarea
        className="w-full border rounded px-3 py-2 h-40"
        placeholder="Paste content to extract from..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Extracting...' : 'Extract Info'}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
