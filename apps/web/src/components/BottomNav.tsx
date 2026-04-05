'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Search, Target, Users, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Map, label: 'Map' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/purpose', icon: Target, label: 'Purpose' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--vb-bg)] border-t border-[var(--vb-border)] z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors ${
                active ? 'text-[var(--vb-primary)]' : 'text-[var(--vb-text-secondary)]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className={active ? 'font-semibold' : ''}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
