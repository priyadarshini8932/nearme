'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { API } from '@/lib/api';

function Bookings() {
  const params = useSearchParams();
  const [phone, setPhone] = useState(params.get('phone') || '');
  const [rows, setRows] = useState(null);

  const load = (p) => fetch(`${API}/api/bookings?phone=${encodeURIComponent(p)}`).then(r => r.json()).then(setRows).catch(() => setRows([]));
  useEffect(() => { if (params.get('phone')) load(params.get('phone')); }, []); // eslint-disable-line

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold">My bookings</h1>
      <form onSubmit={e => { e.preventDefault(); if (phone) load(phone); }} className="mt-6 flex gap-3">
        <input className="input" placeholder="Phone number used for booking" value={phone} onChange={e => setPhone(e.target.value)} />
        <button className="btn btn-navy">Find</button>
      </form>
      <div className="mt-8 space-y-4">
        {rows?.length === 0 && <p className="font-medium text-navy/60">No bookings found for that number.</p>}
        {rows?.map(b => (
          <div key={b._id} className="panel p-5">
            <p className="font-display text-lg font-extrabold">{b.business}</p>
            <p className="mt-1 font-medium">{b.date} at {b.time} · {b.guests} guests · {b.service}</p>
            <p className="mt-1 text-sm font-bold text-teal">{b.status} · Ref {b._id.slice(-6).toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={null}><Bookings /></Suspense>; }
