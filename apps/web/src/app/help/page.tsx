'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import {
  ArrowLeft, ChevronDown, ChevronUp, Search, MapPin, Star, Wallet,
  UserCircle, Mail, HelpCircle,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQ_DATA: FAQSection[] = [
  {
    title: 'Getting Started',
    icon: <MapPin size={18} />,
    items: [
      {
        question: 'How do I find budget restaurants near me?',
        answer: 'ValueBite automatically detects your location and shows affordable restaurants nearby. You can also set your city in Settings. Use the map or list view to browse options, and filter by cuisine or price range.',
      },
      {
        question: 'How do I set my budget?',
        answer: 'Go to your Profile page and tap the Budget tab. You can set a monthly dining budget there, and ValueBite will track your spending to help you stay on target.',
      },
      {
        question: 'What cities are supported?',
        answer: 'ValueBite currently supports cities across Japan, the United States, United Kingdom, Germany, South Korea, Thailand, Vietnam, India, and more. We are continuously expanding to new cities.',
      },
      {
        question: 'How does the map view work?',
        answer: 'The map view shows restaurants as pins on an interactive map. Tap any pin to see details including price range, rating, and distance. You can toggle between map and list views using the button in the header.',
      },
    ],
  },
  {
    title: 'Reviews & Ratings',
    icon: <Star size={18} />,
    items: [
      {
        question: 'How do reviews work on ValueBite?',
        answer: 'Anyone can write a review after visiting a restaurant. Reviews include a star rating, text review, and optionally photos. Your reviews earn you XP points and can unlock badges.',
      },
      {
        question: 'What is the difference between Google and ValueBite reviews?',
        answer: 'ValueBite reviews focus specifically on value for money. Our community rates restaurants based on portion size, price fairness, and overall bang-for-your-buck, while Google reviews cover general dining experience.',
      },
      {
        question: 'How do I earn badges?',
        answer: 'Badges are earned by contributing to the community. Write reviews, upload menu photos, verify restaurant details, and maintain streaks. Check your Profile page to see available badges and your progress.',
      },
    ],
  },
  {
    title: 'Budget Tracker',
    icon: <Wallet size={18} />,
    items: [
      {
        question: 'How does the budget tracker work?',
        answer: 'The budget tracker lets you set a monthly dining-out budget. Log your meals and the tracker shows your spending progress, daily average, and how much you have remaining for the month.',
      },
      {
        question: 'How do I set or change my budget?',
        answer: 'Navigate to Profile, then tap Edit Profile. You can set your monthly dining budget there. The tracker resets automatically at the beginning of each month.',
      },
      {
        question: 'Can I track spending in different currencies?',
        answer: 'Yes! ValueBite adjusts the currency based on your selected region. If you travel, change your city in Settings and the currency will update automatically.',
      },
    ],
  },
  {
    title: 'Account & Privacy',
    icon: <UserCircle size={18} />,
    items: [
      {
        question: 'How do I delete my account?',
        answer: 'Go to Settings and scroll to the bottom. Tap "Delete Account" and confirm. This will permanently remove your profile, reviews, and all associated data. This action cannot be undone.',
      },
      {
        question: 'What data does ValueBite collect?',
        answer: 'We collect basic profile information, your reviews, and location data to show nearby restaurants. We do not sell your personal data. Read our full Privacy Policy for more details.',
      },
      {
        question: 'Can I make my profile private?',
        answer: 'Currently, reviews are public by default. Your personal information (email, exact location) is never shared. We are working on additional privacy controls for a future update.',
      },
    ],
  },
  {
    title: 'Contact & Support',
    icon: <Mail size={18} />,
    items: [
      {
        question: 'How can I contact ValueBite?',
        answer: 'You can reach us at support@valuebite.app for general inquiries, or report bugs via the in-app feedback option. We aim to respond within 24-48 hours.',
      },
      {
        question: 'How do I report incorrect restaurant information?',
        answer: 'On any restaurant detail page, tap the three-dot menu and select "Report Issue." You can report incorrect prices, hours, location, or closure. Our team reviews reports promptly.',
      },
      {
        question: 'Where can I follow ValueBite for updates?',
        answer: 'Follow us on X (Twitter) @ValueBiteApp and Instagram @valuebite for the latest updates, featured restaurants, and community highlights.',
      },
    ],
  },
];

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--vb-border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-3.5 text-left"
      >
        <span className="text-sm font-medium flex-1">{item.question}</span>
        {open ? (
          <ChevronUp size={16} className="shrink-0 text-[var(--vb-text-secondary)]" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-[var(--vb-text-secondary)]" />
        )}
      </button>
      {open && (
        <div className="pb-3.5 text-sm text-[var(--vb-text-secondary)] leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = FAQ_DATA.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/settings" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-lg">Help Center</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--vb-text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)] focus:border-transparent"
          />
        </div>

        {/* FAQ Sections */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle size={40} className="mx-auto mb-3 text-[var(--vb-text-secondary)] opacity-40" />
            <p className="text-sm text-[var(--vb-text-secondary)]">No results found. Try a different search term.</p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[var(--vb-primary)]">{section.icon}</span>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--vb-text-secondary)]">
                  {section.title}
                </h2>
              </div>
              <div className="bg-[var(--vb-bg-secondary)] rounded-xl px-4">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} item={item} />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Contact Footer */}
        <div className="bg-[var(--vb-bg-secondary)] rounded-xl p-5 text-center space-y-2">
          <h3 className="font-semibold text-sm">Still need help?</h3>
          <p className="text-xs text-[var(--vb-text-secondary)]">
            Reach out to us and we will get back to you within 24-48 hours.
          </p>
          <a
            href="mailto:support@valuebite.app"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--vb-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            <Mail size={16} />
            Contact Support
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
