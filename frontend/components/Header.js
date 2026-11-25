import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="font-display text-xl font-extrabold">Near<span className="text-teal">Me</span></Link>
        <nav className="ml-auto flex items-center gap-4 text-sm font-bold sm:gap-6">
          <Link href="/#home" className="hidden hover:text-teal sm:block">Home</Link>
          <Link href="/#services" className="hidden hover:text-teal sm:block">Services</Link>
          <Link href="/#ai" className="hover:text-teal">AI Agent</Link>
          <Link href="/bookings" className="hover:text-teal">My bookings</Link>
          <Link href="/#book" className="btn btn-teal !px-4 !py-2">Book</Link>
        </nav>
      </div>
    </header>
  );
}
