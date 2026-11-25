import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['600', '800'], variable: '--font-display' });
const body = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-body' });

export const metadata = { title: 'NearMe Restaurant – Find and book a table nearby', description: 'Ask the AI agent for a nearby restaurant and book a table in under a minute.' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <footer className="bg-navy py-8 text-center text-sm font-medium text-white/70">NearMe Restaurant</footer>
      </body>
    </html>
  );
}
