import type { Metadata, Viewport } from 'next';
import { HtmlLangUpdater } from '@/components/HtmlLangUpdater';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'ValueBite — Smart Budget Dining',
  description: 'Find the best-value restaurants near you. AI-powered budget dining for 28 countries.',
  manifest: '/manifest.json',
  applicationName: 'ValueBite',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ValueBite',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'ValueBite',
    title: 'ValueBite — Smart Budget Dining',
    description: 'Find the best-value restaurants near you. AI-powered budget dining for 28 countries.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ValueBite — Smart Budget Dining',
    description: 'Find the best-value restaurants near you.',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Google AdSense — only loads when client ID is configured (Tier 2 monetization).
            Until Jay applies + gets approved at https://www.google.com/adsense, this renders nothing. */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-[var(--vb-bg)] text-[var(--vb-text)]">
        <HtmlLangUpdater />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
