'use client';
import { useState } from 'react';
import { API } from '@/lib/api';
import BusinessCard from './BusinessCard';

const IDEAS = ['Best nearby restaurant', 'Seafood under 800 in Pimpri', 'Vegetarian near me', 'Cheap thali in Alandi'];

export default function AIAgent({ onBook, defaultLocation }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  const ask = async (text) => {
    const question = (text ?? q).trim();
    if (!question) return;
    setQ(question); setBusy(true);
    try {
      const r = await fetch(`${API}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, location: defaultLocation }) });
      setRes(await r.json());
    } catch { setRes({ answer: 'Could not reach the server. Check that the API is running and try again.', results: [] }); }
    setBusy(false);
  };

  return (
    <div>
      <form onSubmit={e => { e.preventDefault(); ask(); }} className="flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={e => setQ(e.target.value)} className="input !border-transparent !py-4 text-lg" placeholder="Ask the agent: best seafood under 800 in Pimpri" aria-label="Ask the AI agent" />
        <button disabled={busy} className="btn btn-teal !py-4 whitespace-nowrap">{busy ? 'Searching…' : 'Ask AI agent'}</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {IDEAS.map(i => <button key={i} onClick={() => ask(i)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white hover:bg-white/20">{i}</button>)}
      </div>
      {res && (
        <div className="mt-6" aria-live="polite">
          <p className="rounded-2xl bg-white/10 p-4 font-medium leading-relaxed text-white">{res.answer}</p>
          {res.results?.length > 0 && (
            <div className="mt-5 grid gap-5 text-navy md:grid-cols-3">{res.results.map(b => <BusinessCard key={b._id} b={b} onBook={onBook} />)}</div>
          )}
        </div>
      )}
    </div>
  );
}
