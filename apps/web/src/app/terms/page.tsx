'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/settings" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-lg">Terms of Service</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 text-sm leading-relaxed text-[var(--vb-text)]">
        <p className="text-xs text-[var(--vb-text-secondary)]">Last updated: April 5, 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. Acceptance of Terms</h2>
          <p className="text-[var(--vb-text-secondary)]">
            By accessing or using the ValueBite application, website, or services (collectively, the &ldquo;Service&rdquo;),
            you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. Description of Service</h2>
          <p className="text-[var(--vb-text-secondary)]">
            ValueBite provides a platform for discovering budget-friendly restaurants, reading and writing reviews,
            tracking dining expenses, and engaging with a community of value-conscious diners. The Service may include
            features such as restaurant listings, price comparisons, budget tracking tools, and user-generated content.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. User Accounts</h2>
          <p className="text-[var(--vb-text-secondary)]">
            You may be required to create an account to access certain features. You are responsible for maintaining
            the confidentiality of your account credentials and for all activities that occur under your account.
            You must provide accurate and complete information when creating your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. User-Generated Content</h2>
          <p className="text-[var(--vb-text-secondary)]">
            You retain ownership of content you submit (reviews, photos, etc.), but grant ValueBite a non-exclusive,
            worldwide, royalty-free license to use, display, and distribute your content within the Service. You agree
            not to submit content that is false, misleading, defamatory, or violates any third-party rights.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. Acceptable Use</h2>
          <p className="text-[var(--vb-text-secondary)]">
            You agree not to: (a) use the Service for any unlawful purpose; (b) submit fake reviews or manipulate
            ratings; (c) harass, abuse, or harm other users; (d) attempt to gain unauthorized access to the Service;
            (e) use automated systems to scrape or extract data from the Service; or (f) interfere with the proper
            operation of the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. Restaurant Information</h2>
          <p className="text-[var(--vb-text-secondary)]">
            ValueBite strives to provide accurate restaurant information, including prices, hours, and locations.
            However, this information may change without notice. ValueBite does not guarantee the accuracy, completeness,
            or timeliness of any restaurant data and is not responsible for any discrepancies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. Intellectual Property</h2>
          <p className="text-[var(--vb-text-secondary)]">
            The Service and its original content (excluding user-generated content), features, and functionality are
            owned by ValueBite and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. Termination</h2>
          <p className="text-[var(--vb-text-secondary)]">
            We may terminate or suspend your account and access to the Service immediately, without prior notice,
            for conduct that we believe violates these Terms or is harmful to other users, us, or third parties,
            or for any other reason at our sole discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. Limitation of Liability</h2>
          <p className="text-[var(--vb-text-secondary)]">
            To the maximum extent permitted by law, ValueBite shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
            directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting
            from your use of the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">10. Changes to Terms</h2>
          <p className="text-[var(--vb-text-secondary)]">
            We reserve the right to modify these terms at any time. We will notify users of material changes
            by posting the updated terms on the Service. Your continued use of the Service after changes
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">11. Contact</h2>
          <p className="text-[var(--vb-text-secondary)]">
            If you have questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@valuebite.app" className="text-[var(--vb-primary)] underline">
              legal@valuebite.app
            </a>.
          </p>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
