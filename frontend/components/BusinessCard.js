import { rs } from '@/lib/api';

export default function BusinessCard({ b, onBook }) {
  return (
    <article className="panel flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-extrabold leading-tight">{b.name}</h3>
          <p className="mt-1 text-sm font-medium text-navy/60">{b.cuisine} · {b.location}</p>
        </div>
        <span className="shrink-0 rounded-full bg-gold px-3 py-1 text-sm font-bold">★ {b.rating}</span>
      </div>
      {b.description && <p className="mt-3 text-sm font-medium text-navy/70">{b.description}</p>}
      <p className="mt-4 flex gap-4 text-sm font-bold">
        <span>{b.distance} km away</span>
        <span>{rs(b.price)} per person</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(b.services || []).map(s => <span key={s} className="rounded-full bg-cloud px-3 py-1 text-xs font-bold">{s}</span>)}
      </div>
      <button onClick={() => onBook(b)} className="btn btn-navy mt-5">Book a table</button>
    </article>
  );
}
