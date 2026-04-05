import type { Metadata, Viewport } from 'next';
import { HtmlLangUpdater } from '@/components/HtmlLangUpdater';
import './globals.css';

export const metadata: Metadata = {
  title: 'ValueBite - Smart Budget Dining',
  description: 'Find the best value restaurants near you. Budget-friendly dining powered by AI.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#22c55e',
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
      </head>
      <body className="min-h-screen bg-[var(--vb-bg)] text-[var(--vb-text)]">
        <HtmlLangUpdater />
        {children}
      </body>
    </html>
  );
}
