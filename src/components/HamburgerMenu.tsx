/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  Award,
  BookOpen,
  CalendarDays,
  CalendarPlus,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Home,
  KeyRound,
  Landmark,
  Library,
  LogOut,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  User,
  UserCheck,
  Wifi,
  WifiOff,
  Scroll,
  Info,
  Shield,
  Image as ImageIcon,
  Star,
  X
} from 'lucide-react';
import { AdminUser, LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import { getWpAppSettings, isFeatureModuleEnabled, WpAppFeatureSettings } from '../services/wpApiClient';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
  currentLang: LanguageCode;
  activeUser: AdminUser | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenAdminLogin: () => void;
  onLogout?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentScreen,
  currentLang,
  activeUser,
  onOpenAdminLogin,
  onLogout
}) => {
  const t = DICTIONARY[currentLang] || DICTIONARY.hi;
  const wpSettings: WpAppFeatureSettings = getWpAppSettings();

  useEffect(() => {
    if (!isOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const brandTitle = wpSettings.app_name || 'JyotishWala';
  const brandTagline =
    currentLang === 'en'
      ? wpSettings.app_tagline_en || wpSettings.app_tagline || t.tagline
      : wpSettings.app_tagline_hi || wpSettings.app_tagline || t.tagline;

  const rawMenuItems = [
    { id: 'home', label: t.home, icon: Home, enabled: true },
    {
      id: 'panchang',
      label: t.panchangRishikesh,
      icon: CalendarDays,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_panchang')
    },
    {
      id: 'tyohar',
      label: t.tyohar || 'त्योहार',
      icon: Sparkles,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_tyohar')
    },
    {
      id: 'kundli',
      label: t.kundliGenerator,
      icon: Compass,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_kundli')
    },
    {
      id: 'saved_kundlis',
      label: 'सहेजी गई कुंडलियां',
      icon: Compass,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_kundli')
    },
    {
      id: 'milan',
      label: t.kundliMilan,
      icon: HeartHandshake,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_milan')
    },
    {
      id: 'rashifal',
      label: t.dailyHoroscope,
      icon: Sparkles,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_rashifal')
    },
    {
      id: 'gochar',
      label: t.grahGochar,
      icon: Flame,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_gochar')
    },
    {
      id: 'chat',
      label: t.talkToPandit,
      icon: Phone,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_pandit_chat')
    },
    {
      id: 'puja_booking',
      label: 'यजमान पूजा बुकिंग',
      icon: CalendarPlus,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_puja_booking')
    },
    {
      id: 'pandit_dashboard',
      label: 'पंडित डैशबोर्ड व सत्यापन',
      icon: UserCheck,
      enabled: true
    },
    {
      id: 'gyan',
      label: 'ज्ञान विभाग (वेद, गीता व शास्त्र)',
      icon: BookOpen,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_gyan')
    },
    {
      id: 'puja',
      label: 'पूजा एवं कर्मकांड विधि (19 श्रेणी)',
      icon: Flame,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_puja_vidhi')
    },
    {
      id: 'sanskrit',
      label: 'संस्कृत शिक्षा पाठ्यक्रम',
      icon: GraduationCap,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_sanskrit')
    },
    {
      id: 'temples',
      label: 'मंदिर एवं तीर्थ डायरेक्टरी',
      icon: Landmark,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_temples')
    },
    {
      id: 'library',
      label: 'मेरा पुस्तकालय (बुकमार्क व इतिहास)',
      icon: Library,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_personal_library')
    },
    {
      id: 'articles',
      label: t.articles,
      icon: FileText,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_articles')
    },
    {
      id: 'calculators',
      label: t.calculators,
      icon: Award,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_calculators')
    },
    {
      id: 'dharma',
      label: `${t.dharma} (मंत्र व स्तोत्र कोष)`,
      icon: BookOpen,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_dharma')
    },
    {
      id: 'sankalp',
      label: 'संकल्प मंत्र एवं पत्र जनरेटर',
      icon: Scroll,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_sankalp')
    },
    {
      id: 'gallery',
      label: 'पूजा व कार्य गैलरी',
      icon: ImageIcon,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_gallery')
    },
    {
      id: 'reviews',
      label: 'उपयोगकर्ता समीक्षाएं',
      icon: Star,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_reviews')
    },
    {
      id: 'support',
      label: 'सहायता एवं समर्थन केंद्र',
      icon: HelpCircle,
      enabled: isFeatureModuleEnabled(wpSettings, 'enable_support_tickets')
    },
    { id: 'about', label: 'हमारे बारे में', icon: Info, enabled: true },
    { id: 'privacy', label: 'गोपनीयता नीति', icon: Shield, enabled: true }
  ];

  const menuItems = rawMenuItems.filter((m) => m.enabled);

  return (
    <div
      className="fixed inset-0 z-50 flex overscroll-none"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-[#0D1B1E] shadow-2xl flex flex-col z-10 border-r border-[#008080]/20 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#008080] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {wpSettings.app_logo_url ? (
              <img
                src={wpSettings.app_logo_url}
                alt={brandTitle}
                className="w-9 h-9 rounded-xl bg-white/15 object-contain p-1 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#FF7F33] flex items-center justify-center text-white shadow-xs shrink-0">
                <Compass className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-extrabold text-base tracking-wide leading-tight truncate">
                {brandTitle}
              </h2>
              <p className="text-[10px] text-teal-100 truncate">{brandTagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.closePage}
            className="p-1.5 rounded-lg text-white hover:bg-black/20 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation List (Overscroll contained) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#008080] text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-[#15272B]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#008080] dark:text-teal-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Very Bottom Footer: 50-50 Profile and Logout/Login Buttons in One Line */}
        <div className="p-3 border-t border-[#008080]/20 bg-slate-50 dark:bg-[#0A1518] shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('profile');
                onClose();
              }}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition cursor-pointer border shadow-2xs ${
                currentScreen === 'profile' || currentScreen === 'vault'
                  ? 'bg-[#008080] text-white border-[#008080]'
                  : 'bg-white dark:bg-[#112226] text-slate-700 dark:text-slate-200 border-[#008080]/25 hover:bg-teal-50 dark:hover:bg-[#15272B]'
              }`}
              title="प्रोफ़ाइल व सेटिंग्स"
            >
              <User className={`w-4 h-4 ${currentScreen === 'profile' || currentScreen === 'vault' ? 'text-white' : 'text-[#008080] dark:text-teal-400'}`} />
              <span className="truncate">{t.profile || 'प्रोफ़ाइल'}</span>
            </button>

            {activeUser ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onLogout) {
                    onLogout();
                  }
                  onNavigate('home');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition cursor-pointer border border-rose-200 dark:border-rose-900/50 shadow-2xs"
                title="लॉग आउट करें"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span className="truncate">लॉग आउट</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/60 text-[#008080] dark:text-teal-300 font-bold text-xs transition cursor-pointer border border-[#008080]/30 shadow-2xs"
                title="यजमान लॉगिन करें"
              >
                <KeyRound className="w-4 h-4 text-[#008080] dark:text-teal-400" />
                <span className="truncate">लॉगिन</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
