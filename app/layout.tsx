import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DAYMES — Modern Healthcare & Pharmacy Platform',
  description:
    'Order prescription and OTC medicines, book licensed doctor teleconsultations, and access 24/7 emergency medical assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
