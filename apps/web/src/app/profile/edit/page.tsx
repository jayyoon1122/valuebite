'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/BottomNav';
import { useAppStore } from '@/lib/store';
import { LANGUAGES } from '@/lib/regions';
import {
  ArrowLeft, Camera, User, MapPin, Languages, Utensils, Wallet, Save,
} from 'lucide-react';

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free',
  'Dairy-Free', 'Nut-Free', 'Pescatarian', 'Low-Carb', 'Keto',
];

export default function EditProfilePage() {
  const { locale, cityName } = useAppStore();

  const [displayName, setDisplayName] = useState('TokyoFoodie');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [homeCity, setHomeCity] = useState(cityName || 'Tokyo');
  const [preferredLanguage, setPreferredLanguage] = useState(locale || 'en');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState('50000');
  const [saved, setSaved] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === preferredLanguage);

  const toggleDietary = (option: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((d) => d !== option)
        : [...prev, option]
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-[var(--vb-bg)] border-b border-[var(--vb-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-semibold text-lg">Edit Profile</h1>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--vb-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </header>

      {saved && (
        <div className="mx-4 mt-3 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl text-sm text-center font-medium">
          Profile saved successfully!
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--vb-primary)] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:opacity-90 transition">
              <Camera size={16} className="text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p className="text-xs text-[var(--vb-text-secondary)]">Tap camera icon to change photo</p>
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--vb-text-secondary)]">
            <User size={16} />
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)] focus:border-transparent"
            placeholder="Enter your display name"
          />
        </div>

        {/* Home City */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--vb-text-secondary)]">
            <MapPin size={16} />
            Home City
          </label>
          <input
            type="text"
            value={homeCity}
            onChange={(e) => setHomeCity(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)] focus:border-transparent"
            placeholder="Enter your home city"
          />
        </div>

        {/* Preferred Language */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--vb-text-secondary)]">
            <Languages size={16} />
            Preferred Language
          </label>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)] focus:border-transparent appearance-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* Monthly Dining Budget */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--vb-text-secondary)]">
            <Wallet size={16} />
            Monthly Dining Budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--vb-text-secondary)]">¥</span>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-[var(--vb-border)] bg-[var(--vb-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vb-primary)] focus:border-transparent"
              placeholder="50000"
            />
          </div>
          <p className="text-xs text-[var(--vb-text-secondary)]">Used by the budget tracker to help you stay on target</p>
        </div>

        {/* Dietary Preferences */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--vb-text-secondary)]">
            <Utensils size={16} />
            Dietary Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((option) => {
              const isSelected = dietaryPreferences.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleDietary(option)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    isSelected
                      ? 'bg-[var(--vb-primary)] text-white'
                      : 'bg-[var(--vb-bg-secondary)] text-[var(--vb-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[var(--vb-text-secondary)]">Select all that apply. This helps us recommend restaurants for you.</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
