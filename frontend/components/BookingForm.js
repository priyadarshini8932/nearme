'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API } from '@/lib/api';

const SLOTS = ['12:00', '13:00', '14:00', '19:00', '20:00', '21:00'];
const today = () => new Date().toISOString().slice(0, 10);

export default function BookingForm({ list, selected, onSelect }) {
  const [f, setF] = useState({ name: '', phone: '', date: today(), time: '20:00', guests: 2, service: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => { if (selected) setF(cur => ({ ...cur, service: selected.services?.[0] || '' })); }, [selected]);

  const submit = async (e) => {
    e.preventDefault();
    if (!selected) return setErr('Choose a restaurant first.');
    setErr(''); setBusy(true);
    try {
      const r = await fetch(`${API}/api/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, business: selected.name, location: selected.location }) });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || 'Booking failed');
      setDone(d.booking);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  if (done) return (
    <div className="panel p-8 text-center">
      <p className="font-display text-3xl font-extrabold">Table confirmed</p>
      <p className="mt-4 text-lg font-medium">{done.business}, {done.location}</p>
      <p className="mt-1 font-bold">{done.date} at {done.time} · {done.guests} guests</p>
      <p className="mt-3 text-sm font-medium text-navy/60">Reference {done._id.slice(-6).toUpperCase()}. Show this at the restaurant.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href={`/bookings?phone=${encodeURIComponent(done.phone)}`} className="btn btn-navy">View my bookings</Link>
        <button onClick={() => setDone(null)} className="btn btn-line">Book another</button>
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} className="panel grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <select className="input sm:col-span-2" value={selected?._id || ''} onChange={e => onSelect(list.find(b => b._id === e.target.value) || null)} aria-label="Restaurant" required>
        <option value="">Choose a restaurant</option>
        {list.map(b => <option key={b._id} value={b._id}>{b.name} · {b.location}</option>)}
      </select>
      <input required className="input" placeholder="Your name" value={f.name} onChange={set('name')} />
      <input required className="input" placeholder="Phone number" inputMode="tel" pattern="[0-9+ ]{10,15}" value={f.phone} onChange={set('phone')} />
      <select className="input" value={f.service} onChange={set('service')} aria-label="Service">
        {(selected?.services?.length ? selected.services : ['Dine-in']).map(s => <option key={s}>{s}</option>)}
      </select>
      <input className="input bg-cloud" value={selected ? `${selected.location} · ${selected.distance} km` : 'Location fills in when you pick a restaurant'} readOnly aria-label="Location" />
      <input required type="date" min={today()} className="input" value={f.date} onChange={set('date')} aria-label="Date" />
      <select className="input" value={f.time} onChange={set('time')} aria-label="Time">{SLOTS.map(s => <option key={s}>{s}</option>)}</select>
      <input type="number" min="1" max="20" className="input" value={f.guests} onChange={set('guests')} aria-label="Number of guests" />
      <button disabled={busy} className="btn btn-teal">{busy ? 'Confirming…' : 'Confirm booking'}</button>
      {err && <p className="font-bold text-red-600 sm:col-span-2" role="alert">{err}</p>}
    </form>
  );
}
