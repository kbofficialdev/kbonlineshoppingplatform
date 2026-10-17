import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopProgressBar from '@/components/TopProgressBar';
import MobileBottomDock from '@/components/MobileBottomDock';
import { ModalProvider } from '@/components/ModalContext';
import { ToastProvider } from '@/components/ToastContext';

export const metadata: Metadata = {
  title: 'KB FASHIONS — Better Clothes. Better Prices.',
  description: 'KB FASHIONS (Kalwaral, Kamareddy, Telangana) — 20 Years of authentic village retail heritage, handlooms, unstitched suitings & shirtings, Gadwal sarees, and daily essentials.',
  icons: {
    icon: '/images/kb-monogram-logo.png',
    shortcut: '/images/kb-monogram-logo.png',
    apple: '/images/kb-monogram-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/kb-monogram-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/images/kb-monogram-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/kb-monogram-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-gradient-to-b from-[#F8FAFD] via-[#FFFFFF] to-[#F3F5FA] text-kb-black font-sans antialiased selection:bg-kb-blue selection:text-white min-h-screen flex flex-col justify-between">
        <TopProgressBar />
        <ToastProvider>
          <ModalProvider>
            <Header />
            <main className="flex-1 pt-24 sm:pt-[96px] pb-20 sm:pb-0">
              {children}
            </main>
            <MobileBottomDock />
            <Footer />
          </ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
