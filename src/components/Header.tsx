/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Languages,
  Menu,
  Moon,
  Search,
  Sun,
  Wifi,
  WifiOff,
  X
} from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import { getWpAppSettings, WpAppFeatureSettings } from '../services/wpApiClient';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  isOfflineMode,
  onToggleOfflineMode,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenSearch,
  onOpenMenu,
  onGoHome
}) => {
  const t = DICTIONARY[currentLang] || DICTIONARY.hi;
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [selectedLangOption, setSelectedLangOption] = useState<LanguageCode>(currentLang);
  const [wpSettings, setWpSettings] = useState<WpAppFeatureSettings>(() => getWpAppSettings());

  useEffect(() => {
    setSelectedLangOption(currentLang);
  }, [currentLang]);

  useEffect(() => {
    const onSettingsUpdate = () => setWpSettings(getWpAppSettings());
    window.addEventListener('jyotishwala_app_settings_changed', onSettingsUpdate);
    return () => window.removeEventListener('jyotishwala_app_settings_changed', onSettingsUpdate);
  }, []);

  useEffect(() => {
    if (!isLangModalOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isLangModalOpen]);

  const handleOpenLangModal = () => {
    setSelectedLangOption(currentLang);
    setIsLangModalOpen(true);
  };

  const handleSaveLanguage = () => {
    onLanguageChange(selectedLangOption);
    setIsLangModalOpen(false);
  };

  const brandTitle = wpSettings.app_name || 'JyotishWala';
  const brandTagline =
    currentLang === 'en'
      ? wpSettings.app_tagline_en || wpSettings.app_tagline || t.tagline
      : wpSettings.app_tagline_hi || wpSettings.app_tagline || t.tagline;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0D1B1E] border-b border-[#008080]/20 shadow-xs transition-colors">
        <div className="w-full px-3 h-16 flex items-center justify-between gap-2">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onOpenMenu}
              aria-label="मेनू खोलें"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 active:scale-95 transition shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-[#008080] dark:text-teal-400" />
            </button>

            <div
              onClick={onGoHome}
              className="flex items-center gap-2 select-none cursor-pointer min-w-0"
            >
              {wpSettings.app_logo_url && (
                <img
                  src={wpSettings.app_logo_url}
                  alt={brandTitle}
                  className="w-8 h-8 rounded-lg object-contain shrink-0"
                />
              )}
              <div className="min-w-0">
                <div className="flex items-center leading-none">
                  <span className="font-extrabold text-[15px] sm:text-[17px] tracking-tight text-[#008080] dark:text-teal-300 truncate">
                    {brandTitle}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block truncate mt-0.5">
                  {brandTagline}
                </p>
              </div>
            </div>
          </div>

          {/* Right Actions: Search, Offline, Language Icon, Notifications, Dark Mode */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onOpenSearch}
              aria-label={t.search}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 active:scale-95 transition cursor-pointer"
              title={t.search}
            >
              <Search className="w-4 h-4 text-[#008080] dark:text-teal-400" />
            </button>

            <button
              onClick={onToggleOfflineMode}
              className={`hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition border cursor-pointer ${
                isOfflineMode
                  ? 'bg-[#FF7F33]/10 text-[#FF7F33] border-[#FF7F33]/30'
                  : 'bg-[#008080]/10 text-[#008080] dark:text-teal-300 border-[#008080]/30'
              }`}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-[#FF7F33]" />
                  <span>{t.offlineMode}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#008080] dark:text-teal-300" />
                  <span>{t.onlineMode}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenLangModal}
              aria-label={currentLang === 'en' ? 'Select Language' : 'भाषा चुनें'}
              title={currentLang === 'en' ? 'Change Language' : 'भाषा बदलें'}
              className="p-2 rounded-xl bg-teal-50 dark:bg-[#15272B] border border-[#008080]/25 text-[#008080] dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 active:scale-95 transition cursor-pointer"
            >
              <Languages className="w-4 h-4 text-[#008080] dark:text-teal-300" />
            </button>

            <button
              onClick={onOpenNotifications}
              aria-label={t.notifications}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 active:scale-95 transition cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#008080] dark:text-teal-400" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF7F33] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              className="p-2 rounded-xl bg-teal-50 dark:bg-[#15272B] border border-[#008080]/20 text-slate-700 dark:text-slate-200 hover:bg-teal-100 dark:hover:bg-teal-900/50 active:scale-95 transition cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#FF7F33]" />
              ) : (
                <Moon className="w-4 h-4 text-[#008080]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Language Selection Popup Modal */}
      {isLangModalOpen && (
        <div
          data-no-translate="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overscroll-none"
          onClick={() => setIsLangModalOpen(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-[#112226] rounded-2xl border border-[#008080]/30 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-3.5 bg-[#008080] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-white shrink-0" />
                <h3 className="text-sm font-extrabold">
                  {currentLang === 'en' ? 'Select App Language' : 'ऐप की भाषा चुनें'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="p-1 rounded-lg hover:bg-black/20 text-white transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Body: 2 Language Buttons + 1 Full-Width Save Button */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Hindi Button */}
                <button
                  type="button"
                  onClick={() => setSelectedLangOption('hi')}
                  className={`py-3.5 px-4 rounded-xl border font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    selectedLangOption === 'hi'
                      ? 'bg-[#008080] text-white border-[#008080] shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-[#008080]/25 hover:border-[#008080]'
                  }`}
                >
                  <span>हिंदी</span>
                  {selectedLangOption === 'hi' && <Check className="w-4 h-4 text-white shrink-0" />}
                </button>

                {/* 2. English Button */}
                <button
                  type="button"
                  onClick={() => setSelectedLangOption('en')}
                  className={`py-3.5 px-4 rounded-xl border font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    selectedLangOption === 'en'
                      ? 'bg-[#008080] text-white border-[#008080] shadow-xs'
                      : 'bg-[#FAF7F2] dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-[#008080]/25 hover:border-[#008080]'
                  }`}
                >
                  <span>English</span>
                  {selectedLangOption === 'en' && <Check className="w-4 h-4 text-white shrink-0" />}
                </button>
              </div>

              {/* Full-width Save Button */}
              <button
                type="button"
                onClick={handleSaveLanguage}
                className="w-full py-3 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white font-extrabold text-sm shadow-xs transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Check className="w-4 h-4 text-white" />
                <span>{selectedLangOption === 'en' ? 'Save Language' : 'सेव करें (Save)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
