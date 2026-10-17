import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'KB FASHIONS — Better Clothes. Better Prices.',
  description: 'KB FASHIONS (Kalwaral, Kamareddy, Telangana) — Ancestral textile occupation and village store bringing genuine, durable clothes directly online.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-white text-kbBlack font-sans antialiased selection:bg-kbBlack selection:text-white min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
