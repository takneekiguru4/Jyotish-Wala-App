/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Compass,
  Home,
  User
} from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import {
  getWpAppSettings,
  isFeatureModuleEnabled,
  WpAppFeatureSettings
} from '../services/wpApiClient';

export type MainTabType = 'home' | 'jyotish' | 'panchang' | 'dharma' | 'profile';

interface BottomNavProps {
  currentTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  currentLang: LanguageCode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  currentLang
}) => {
  const t = DICTIONARY[currentLang] || DICTIONARY.hi;
  const [wpSettings, setWpSettings] = useState<WpAppFeatureSettings>(getWpAppSettings);

  useEffect(() => {
    const handleSettingsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<WpAppFeatureSettings>;
      if (customEvent.detail) {
        setWpSettings(customEvent.detail);
      } else {
        setWpSettings(getWpAppSettings());
      }
    };

    window.addEventListener('jyotishwala_app_settings_changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('jyotishwala_app_settings_changed', handleSettingsChanged);
    };
  }, []);

  const hasJyotish =
    isFeatureModuleEnabled(wpSettings, 'enable_kundli') ||
    isFeatureModuleEnabled(wpSettings, 'enable_milan') ||
    isFeatureModuleEnabled(wpSettings, 'enable_gochar') ||
    isFeatureModuleEnabled(wpSettings, 'enable_calculators');

  const hasPanchang = isFeatureModuleEnabled(wpSettings, 'enable_panchang');
  const hasDharma = isFeatureModuleEnabled(wpSettings, 'enable_dharma');

  const allTabs: { id: MainTabType; label: string; icon: React.FC<{ className?: string }>; visible: boolean }[] = [
    { id: 'home', label: t.home, icon: Home, visible: true },
    { id: 'jyotish', label: t.jyotish, icon: Compass, visible: hasJyotish },
    { id: 'panchang', label: t.panchang, icon: CalendarDays, visible: hasPanchang },
    { id: 'dharma', label: t.dharma, icon: BookOpen, visible: hasDharma },
    { id: 'profile', label: t.profile, icon: User, visible: true },
  ];

  const visibleTabs = allTabs.filter((tab) => tab.visible);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D1B1E]/95 backdrop-blur-md border-t border-teal-500/20 py-1.5 px-2 shadow-lg transition-colors">
      <div
        className="max-w-md mx-auto grid items-center justify-around"
        style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, minmax(0, 1fr))` }}
      >
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-teal-700 dark:text-teal-300 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#008080] dark:text-[#2dd4bf]' : ''
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
