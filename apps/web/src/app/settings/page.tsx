'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { REGIONS, LANGUAGES } from '@/lib/regions';
import { BottomNav } from '@/components/BottomNav';
import {
  ArrowLeft, Globe, Languages, Bell, Moon, Eye, Shield, HelpCircle,
  MessageSquare, Star, ExternalLink, ChevronRight, Smartphone, Trash2,
  X, MapPin, Check, ChevronDown,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { locale, setLocale, countryCode, setCountryCode, cityId, cityName, setCityId, setUserLocation, showChains, toggleShowChains } = useAppStore();
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [regionTab, setRegionTab] = useState<'region' | 'language'>('region');
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [showNativeAds, setShowNativeAds] = useState(true);

  const currentLang = LANGUAGES.find((l) => l.code === locale);

  function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-[var(--vb-primary)]' : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <div
          className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200"
          style={{ left: on ? '22px' : '2px' }}
        />
      </button>
    );
  }

  function SettingRow({ icon: Icon, label, value, onClick, trailing }: {
    icon: any; label: string; value?: string; onClick?: () => void; trailing?: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--vb-bg-secondary)] transition"
      >
        <Icon size={20} className="text-[var(--vb-text-secondary)] shrink-0" />
        <span className="flex-1 text-left text-sm">{label}</span>
        {value && <span className="text-sm text-[var(--vb-text-secondary)]">{value}</span>}
        {trailing || (onClick && <ChevronRight size={16} className="text-[var(--vb-text-secondary)]" />)}
      </button>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/profile" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-semibold text-lg">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Region & Language */}
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase tracking-wider">Region & Language</h2>
        </div>
        <SettingRow icon={Globe} label="City" value={cityName || 'Tokyo'} onClick={() => setShowRegionSelector(true)} />
        <SettingRow icon={Languages} label="Language" value={currentLang?.native || 'English'} onClick={() => setShowRegionSelector(true)} />
        <div className="border-b border-[var(--vb-border)] mx-4" />

        {/* Preferences */}
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase tracking-wider">Preferences</h2>
        </div>
        <SettingRow
          icon={Moon} label="Dark Mode"
          trailing={<Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />}
        />
        <SettingRow
          icon={Eye} label="Show Chain Restaurants"
          trailing={<Toggle on={showChains} onToggle={toggleShowChains} />}
        />
        <div className="border-b border-[var(--vb-border)] mx-4" />

        {/* Notifications */}
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase tracking-wider">Notifications</h2>
        </div>
        <SettingRow
          icon={Bell} label="Push Notifications"
          trailing={<Toggle on={pushNotifications} onToggle={() => setPushNotifications(!pushNotifications)} />}
        />
        <SettingRow
          icon={Bell} label="Price Change Alerts"
          trailing={<Toggle on={priceAlerts} onToggle={() => setPriceAlerts(!priceAlerts)} />}
        />
        <SettingRow
          icon={MessageSquare} label="Weekly Value Report"
          trailing={<Toggle on={weeklyReport} onToggle={() => setWeeklyReport(!weeklyReport)} />}
        />
        <div className="border-b border-[var(--vb-border)] mx-4" />

        {/* Privacy */}
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase tracking-wider">Privacy & Ads</h2>
        </div>
        <SettingRow
          icon={Eye} label="Personalized Ads"
          trailing={<Toggle on={showNativeAds} onToggle={() => setShowNativeAds(!showNativeAds)} />}
        />
        <SettingRow icon={Shield} label="Privacy Policy" onClick={() => router.push('/privacy')} />
        <SettingRow icon={Shield} label="Terms of Service" onClick={() => router.push('/terms')} />
        <div className="border-b border-[var(--vb-border)] mx-4" />

        {/* Support */}
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase tracking-wider">Support</h2>
        </div>
        <SettingRow icon={HelpCircle} label="Help Center" onClick={() => router.push('/help')} />
        <SettingRow icon={MessageSquare} label="Contact Us" onClick={() => router.push('/help')} />
        <SettingRow icon={Star} label="Rate ValueBite" onClick={() => alert('Thank you for your interest! Rating will be available once ValueBite is live on the App Store.')} />
        <SettingRow icon={Smartphone} label="App Version" value="1.0.0" />
        <div className="border-b border-[var(--vb-border)] mx-4" />

        {/* Account */}
        <div className="px-4 pt-4 pb-1">
          <h2 className="text-xs font-semibold text-[var(--vb-text-secondary)] uppercase tracking-wider">Account</h2>
        </div>
        <SettingRow icon={ExternalLink} label="Sign Out" onClick={() => { if (confirm('Are you sure you want to sign out?')) { alert('Signed out successfully.'); } }} />
        <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition">
          <Trash2 size={20} className="text-red-500 shrink-0" />
          <span className="text-sm text-red-500">Delete Account</span>
        </button>

        <div className="px-4 py-6 text-center">
          <p className="text-xs text-[var(--vb-text-secondary)]">ValueBite v1.0.0</p>
          <p className="text-xs text-[var(--vb-text-secondary)] mt-1">Made with care for budget-conscious diners worldwide</p>
        </div>
      </div>

      {/* Region/Language Modal */}
      {showRegionSelector && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRegionSelector(false)} />
          <div className="relative w-full max-w-md max-h-[80vh] bg-[var(--vb-bg)] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--vb-border)]">
              <h3 className="font-semibold">Region & Language</h3>
              <button onClick={() => setShowRegionSelector(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex border-b border-[var(--vb-border)]">
              <button
                onClick={() => setRegionTab('region')}
                className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition ${
                  regionTab === 'region' ? 'text-[var(--vb-primary)] border-b-2 border-[var(--vb-primary)]' : 'text-[var(--vb-text-secondary)]'
                }`}
              >
                <MapPin size={14} /> Region
              </button>
              <button
                onClick={() => setRegionTab('language')}
                className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition ${
                  regionTab === 'language' ? 'text-[var(--vb-primary)] border-b-2 border-[var(--vb-primary)]' : 'text-[var(--vb-text-secondary)]'
                }`}
              >
                <Languages size={14} /> Language
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {regionTab === 'region' ? (
                <div className="py-1">
                  {REGIONS.map((country) => (
                    <div key={country.code}>
                      <button
                        onClick={() => setExpandedCountry(expandedCountry === country.code ? null : country.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--vb-bg-secondary)] transition ${
                          countryCode === country.code ? 'font-semibold' : ''
                        }`}
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="flex-1 text-left">{country.name}</span>
                        {countryCode === country.code && (
                          <span className="text-xs text-[var(--vb-primary)]">{cityName}</span>
                        )}
                        <ChevronDown size={14} className={`text-[var(--vb-text-secondary)] transition ${expandedCountry === country.code ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedCountry === country.code && (
                        <div className="bg-[var(--vb-bg-secondary)] py-1">
                          {country.cities.map((city) => (
                            <button
                              key={city.id}
                              onClick={() => {
                                setCountryCode(country.code);
                                setCityId(city.id, city.name);
                                setUserLocation(city.lat, city.lng);
                                setShowRegionSelector(false);
                              }}
                              className="w-full flex items-center gap-3 px-8 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                              <span className="flex-1 text-left">{city.name}</span>
                              {cityId === city.id && <Check size={16} className="text-[var(--vb-primary)]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1 p-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); setShowRegionSelector(false); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition ${
                        locale === lang.code ? 'bg-[var(--vb-primary)] text-white' : 'hover:bg-[var(--vb-bg-secondary)]'
                      }`}
                    >
                      <span className="font-medium">{lang.native}</span>
                      {locale === lang.code && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
