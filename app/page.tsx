'use client';
import { useState } from 'react';
export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true); setResponse('');
    const res = await fetch('/api/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    const reader = res.body?.getReader();
    const dec = new TextDecoder();
    while (reader) { const { value, done } = await reader.read(); if (done) break; setResponse(p => p + dec.decode(value)); }
    setLoading(false);
  };
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">AI-PromptCraft</h1>
      <textarea className="w-full h-40 p-4 bg-gray-800 rounded-lg mb-4" placeholder="Enter prompt..." value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={run} disabled={loading} className="bg-blue-600 px-6 py-2 rounded-lg">{loading ? 'Running...' : 'Run Prompt'}</button>
      {response && <div className="mt-6 p-4 bg-gray-800 rounded-lg whitespace-pre-wrap">{response}</div>}
    </main>
  );
}
