'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/settings" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-lg">Privacy Policy</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 text-sm leading-relaxed text-[var(--vb-text)]">
        <p className="text-xs text-[var(--vb-text-secondary)]">Last updated: April 5, 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. Introduction</h2>
          <p className="text-[var(--vb-text-secondary)]">
            ValueBite (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
            our mobile application and website (collectively, the &ldquo;Service&rdquo;).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. Information We Collect</h2>
          <p className="text-[var(--vb-text-secondary)]">We may collect the following types of information:</p>
          <ul className="list-disc pl-5 space-y-1 text-[var(--vb-text-secondary)]">
            <li><strong>Account Information:</strong> Name, email address, display name, and profile photo when you create an account.</li>
            <li><strong>Location Data:</strong> Your device location to show nearby restaurants. You can disable this in your device settings.</li>
            <li><strong>Usage Data:</strong> How you interact with the Service, including pages visited, features used, and search queries.</li>
            <li><strong>User Content:</strong> Reviews, ratings, photos, and other content you submit.</li>
            <li><strong>Device Information:</strong> Device type, operating system, and app version for troubleshooting and analytics.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. How We Use Your Information</h2>
          <p className="text-[var(--vb-text-secondary)]">We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1 text-[var(--vb-text-secondary)]">
            <li>Provide, maintain, and improve the Service</li>
            <li>Show you relevant nearby restaurants and personalized recommendations</li>
            <li>Process and display your reviews and contributions</li>
            <li>Track your dining budget (stored locally on your device)</li>
            <li>Send notifications about price changes and deals (if enabled)</li>
            <li>Analyze usage patterns to improve the Service</li>
            <li>Prevent fraud and enforce our Terms of Service</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. Information Sharing</h2>
          <p className="text-[var(--vb-text-secondary)]">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[var(--vb-text-secondary)]">
            <li><strong>Public Content:</strong> Reviews, ratings, and profile information you choose to make public.</li>
            <li><strong>Service Providers:</strong> Third-party companies that help us operate the Service (hosting, analytics).</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. Data Storage & Security</h2>
          <p className="text-[var(--vb-text-secondary)]">
            We implement industry-standard security measures to protect your data. Budget tracking data is stored
            locally on your device. Account and review data is stored on secure servers. While we strive to protect
            your information, no method of electronic storage is 100% secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. Your Rights</h2>
          <p className="text-[var(--vb-text-secondary)]">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-[var(--vb-text-secondary)]">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Opt out of marketing communications</li>
            <li>Restrict or object to certain data processing</li>
          </ul>
          <p className="text-[var(--vb-text-secondary)]">
            To exercise these rights, contact us at{' '}
            <a href="mailto:privacy@valuebite.app" className="text-[var(--vb-primary)] underline">
              privacy@valuebite.app
            </a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. Cookies & Tracking</h2>
          <p className="text-[var(--vb-text-secondary)]">
            We use local storage and similar technologies to save your preferences (such as language, city, and display settings).
            We may use analytics tools to understand Service usage. You can manage your cookie preferences in your browser settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. Children&apos;s Privacy</h2>
          <p className="text-[var(--vb-text-secondary)]">
            The Service is not intended for children under 13. We do not knowingly collect personal information
            from children under 13. If we become aware that we have collected such information, we will take
            steps to delete it promptly.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. Changes to This Policy</h2>
          <p className="text-[var(--vb-text-secondary)]">
            We may update this Privacy Policy from time to time. We will notify you of material changes by
            posting the updated policy on the Service. Your continued use of the Service after changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">10. Contact Us</h2>
          <p className="text-[var(--vb-text-secondary)]">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@valuebite.app" className="text-[var(--vb-primary)] underline">
              privacy@valuebite.app
            </a>.
          </p>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
