'use client';
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import AIAgent from '@/components/AIAgent';
import BusinessCard from '@/components/BusinessCard';
import BookingForm from '@/components/BookingForm';

export default function Home() {
  const [list, setList] = useState([]);
  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetch(`${API}/api/locations`).then(r => r.json()).then(setPlaces).catch(() => {}); }, []);
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/businesses${place ? `?location=${encodeURIComponent(place)}` : ''}`)
      .then(r => r.json()).then(d => setList(Array.isArray(d) ? d : [])).catch(() => setList([])).finally(() => setLoading(false));
  }, [place]);

  const book = (b) => { setSelected(b); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      <section id="home" className="hero-bg text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <h1 className="font-display max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">Find a good table nearby and book it in a minute.</h1>
          <p className="mt-4 max-w-xl text-lg font-medium text-white/80">Tell the agent what you feel like eating and your budget. It picks three places near you.</p>
          <div id="ai" className="mt-10"><AIAgent onBook={book} defaultLocation="Pimpri" /></div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold">Restaurants near you</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by area">
            {['', ...places].map(p => (
              <button key={p || 'all'} onClick={() => setPlace(p)} aria-pressed={place === p}
                className={`rounded-full px-4 py-2 text-sm font-bold ${place === p ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-navy/10'}`}>{p || 'All areas'}</button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map(b => <BusinessCard key={b._id} b={b} onBook={book} />)}</div>
        {loading && <p className="mt-8 font-medium text-navy/60">Loading restaurants…</p>}
        {!loading && !list.length && <p className="mt-8 font-medium text-navy/60">No restaurants found. Check that the backend is running and seeded.</p>}
      </section>

      <section id="book" className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="font-display mb-6 text-3xl font-extrabold">Book a table</h2>
        <BookingForm list={list} selected={selected} onSelect={setSelected} />
      </section>
    </>
  );
}
