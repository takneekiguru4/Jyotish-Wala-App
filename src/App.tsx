import React, { useState, useEffect, useRef } from 'react';
import { Home, Calendar, User, Sparkles, ShieldCheck, ArrowLeft, X } from 'lucide-react';
import { Header } from './components/Header';
import { HamburgerMenu } from './components/HamburgerMenu';
import { UserAuthModal } from './components/UserAuthModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import {
  NotificationModal,
  NotificationTopicPrefs,
  DEFAULT_NOTIFICATION_PREFS
} from './components/NotificationModal';

import { HomeView } from './views/HomeView';
import { PanchangView } from './views/PanchangView';
import { KundliView } from './views/KundliView';
import { SavedKundlisView } from './views/SavedKundlisView';
import { MilanView } from './views/MilanView';
import { RashifalView } from './views/RashifalView';
import { GocharView } from './views/GocharView';
import { PanditChatView } from './views/PanditChatView';
import CalculatorsView from './views/CalculatorsView';
import DharmaView from './views/DharmaView';
import { ArticlesView } from './views/ArticlesView';
import { TyoharView } from './views/TyoharView';
import { ProfileView } from './views/ProfileView';
import { SankalpView } from './views/SankalpView';
import { AboutUsView } from './views/AboutUsView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { GalleryView } from './views/GalleryView';
import { ReviewsView } from './views/ReviewsView';
import { GyanVibhagView } from './views/GyanVibhagView';
import { PujaKarmakandView } from './views/PujaKarmakandView';
import { SanskritLearningView } from './views/SanskritLearningView';
import { TemplesTirthaView } from './views/TemplesTirthaView';
import { PujaBookingView } from './views/PujaBookingView';
import { PanditDashboardView } from './views/PanditDashboardView';
import { PersonalLibraryView } from './views/PersonalLibraryView';
import { HelpSupportView } from './views/HelpSupportView';
import { syncSanatanPlatformWithWp } from './services/sanatanPlatformService';

import { AdminUser, PushNotification, LanguageCode } from './types';
import {
  getActiveUser,
  setActiveUser
} from './services/authAndRoleService';
import {
  syncAllFromWordPressBackend,
  logoutUserViaWp,
  getWpAppSettings,
  isFeatureModuleEnabled,
  WpAppFeatureSettings
} from './services/wpApiClient';
import { getPanchangForDate, CITIES, CityLocation } from './services/panchangEngine';
import { DICTIONARY, applyGlobalDomTranslation } from './i18n/translations';

const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'n1',
    title: 'ऋषिकेश अभिजीत मुहूर्त अलर्ट',
    body: 'आज दोपहर अभिजीत मुहूर्त में शुभ कार्य प्रारंभ करने का श्रेष्ठ समय है।',
    time: '10 मिनट पहले',
    category: 'muhurat',
    read: false
  },
  {
    id: 'n2',
    title: 'शनि गोचर विशेष अपडेट',
    body: 'शनि देव कुम्भ राशि में संचरण कर रहे हैं। अपना राशिफल देखें।',
    time: '2 घंटे पहले',
    category: 'transit',
    read: false
  },
  {
    id: 'n3',
    title: 'दैनिक पंचांग एवं तिथि अपडेट',
    body: 'आज के सूर्योदय, तिथि, नक्षत्र, योग एवं करण की संपूर्ण गणना उपलब्ध है।',
    time: 'आज प्रातः 06:00',
    category: 'panchang',
    read: false
  },
  {
    id: 'n4',
    title: 'दैनिक राशिफल सूचना',
    body: 'मेष से मीन तक सभी 12 राशियों का आज का दैनिक राशिफल अपडेट हो गया है।',
    time: 'आज प्रातः 06:30',
    category: 'horoscope',
    read: true
  },
  {
    id: 'n5',
    title: 'आगामी एकादशी एवं प्रदोष व्रत',
    body: 'इस पक्ष के प्रमुख व्रत एवं पर्वों की सूची पंचांग में देखें।',
    time: 'कल',
    category: 'festival',
    read: true
  }
];

export default function App() {
  const appRootRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedSavedKundliId, setSelectedSavedKundliId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('jw_theme') === 'dark';
  });
  // Default language is strictly Hindi ('hi'), with English ('en') as the only second language
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('jw_lang') as LanguageCode | null;
    return saved === 'en' ? 'en' : 'hi';
  });
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Selected Panchang Location (Default: Rishikesh, Uttarakhand)
  const [selectedCity, setSelectedCity] = useState<CityLocation>(() => {
    try {
      const saved = localStorage.getItem('jw_selected_city');
      return saved ? JSON.parse(saved) : CITIES[0];
    } catch {
      return CITIES[0];
    }
  });

  const handleCityChange = (city: CityLocation) => {
    setSelectedCity(city);
    try {
      localStorage.setItem('jw_selected_city', JSON.stringify(city));
    } catch {
      // Ignore storage error
    }
  };

  // Auth State
  const [activeUser, setActiveUserState] = useState<AdminUser | null>(() => getActiveUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    try {
      const saved = localStorage.getItem('jyotishwala_notifications_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_NOTIFICATIONS;
  });
  const [wpSettings, setWpSettings] = useState<WpAppFeatureSettings>(() => getWpAppSettings());
  const [notifPrefs, setNotifPrefs] = useState<NotificationTopicPrefs>(() => {
    try {
      const saved = localStorage.getItem('jw_notif_prefs_v1');
      return saved ? { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(saved) } : DEFAULT_NOTIFICATION_PREFS;
    } catch {
      return DEFAULT_NOTIFICATION_PREFS;
    }
  });

  const handleToggleNotifPref = (key: keyof NotificationTopicPrefs) => {
    setNotifPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('jw_notif_prefs_v1', JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  // Current IST Panchang for Selected City
  const todayStr = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().split('T')[0];
  const rishikeshPanchang = getPanchangForDate(todayStr, selectedCity);

  // Apply Dark Mode class to <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('jw_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('jw_theme', 'light');
    }
  }, [isDarkMode]);

  // Strict Background Scroll Lock whenever Drawer or any Modal/Popup in the App is open
  useEffect(() => {
    const syncScrollLock = () => {
      const hasDomModal = Boolean(document.querySelector('.fixed.inset-0.z-50'));
      const anyModalOpen =
        isDrawerOpen || isLoginModalOpen || isSearchOpen || isNotifOpen || hasDomModal;
      if (anyModalOpen) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };

    syncScrollLock();

    const rootEl = appRootRef.current || document.body;
    const observer = new MutationObserver(() => {
      syncScrollLock();
    });
    observer.observe(rootEl, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isDrawerOpen, isLoginModalOpen, isSearchOpen, isNotifOpen]);

  const handleSelectLang = (lang: LanguageCode) => {
    setCurrentLang(lang);
    localStorage.setItem('jw_lang', lang);
  };

  // 100% App-Wide Uniform Language Translation Synchronizer
  useEffect(() => {
    const rootEl = appRootRef.current;
    if (!rootEl) return;

    let isApplying = false;
    const runTranslation = () => {
      if (isApplying) return;
      isApplying = true;
      try {
        applyGlobalDomTranslation(rootEl, currentLang);
      } finally {
        isApplying = false;
      }
    };

    runTranslation();

    const observer = new MutationObserver(() => {
      runTranslation();
    });

    observer.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [currentLang, activePage, isDrawerOpen, isLoginModalOpen, isSearchOpen, isNotifOpen]);

  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);

  useEffect(() => {
    void syncAllFromWordPressBackend();
    void syncSanatanPlatformWithWp();
    const syncTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        void syncAllFromWordPressBackend();
        void syncSanatanPlatformWithWp();
      }
    }, 20000);
    const handleOnline = () => {
      setIsOffline(false);
      void syncAllFromWordPressBackend();
    };
    const handleOffline = () => setIsOffline(true);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void syncAllFromWordPressBackend();
      }
    };
    const handleNotifsChanged = () => {
      try {
        const raw = localStorage.getItem('jyotishwala_notifications_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setNotifications(parsed);
        }
      } catch {
        // Ignore
      }
    };
    const handleAppSettingsChanged = () => {
      const next = getWpAppSettings();
      setWpSettings(next);
      if (
        !localStorage.getItem('jw_selected_city') &&
        next.panchangSettings?.default_latitude &&
        next.panchangSettings?.default_longitude
      ) {
        setSelectedCity({
          name: next.panchangSettings.default_city_name || CITIES[0].name,
          en: next.panchangSettings.default_city_name || CITIES[0].en,
          lat: Number(next.panchangSettings.default_latitude),
          lng: Number(next.panchangSettings.default_longitude)
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('jyotishwala_notifications_changed', handleNotifsChanged);
    window.addEventListener('jyotishwala_app_settings_changed', handleAppSettingsChanged);
    return () => {
      window.clearInterval(syncTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('jyotishwala_notifications_changed', handleNotifsChanged);
      window.removeEventListener('jyotishwala_app_settings_changed', handleAppSettingsChanged);
    };
  }, []);

  useEffect(() => {
    const isTextEntryElement = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === 'TEXTAREA') return true;
      if (tag === 'INPUT') {
        const type = ((el as HTMLInputElement).type || 'text').toLowerCase();
        return !['button', 'checkbox', 'radio', 'submit', 'reset', 'file', 'range', 'color'].includes(type);
      }
      return (el as HTMLElement).isContentEditable === true;
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (window.innerWidth < 768 && isTextEntryElement(e.target as Element)) {
        setIsMobileKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        if (!isTextEntryElement(document.activeElement)) {
          setIsMobileKeyboardOpen(false);
        }
      }, 100);
    };

    const handleViewportResize = () => {
      if (!window.visualViewport || window.innerWidth >= 768) return;
      const heightRatio = window.visualViewport.height / window.screen.height;
      if (heightRatio < 0.72 || isTextEntryElement(document.activeElement)) {
        setIsMobileKeyboardOpen(true);
      } else {
        setIsMobileKeyboardOpen(false);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  // Navigation History Stack for step-by-step back navigation
  interface NavHistoryState {
    page: string;
    articleId?: string | null;
    savedKundliId?: string | null;
  }
  const [navHistory, setNavHistory] = useState<NavHistoryState[]>([{ page: 'home' }]);

  const handleNavigate = (page: string, extraData?: unknown) => {
    const targetPage = page === 'admin' ? 'profile' : page;
    let newArticleId: string | null = null;
    let newKundliId: string | null = null;

    if (
      targetPage === 'articles' &&
      extraData &&
      typeof extraData === 'object' &&
      'articleId' in extraData &&
      typeof (extraData as { articleId?: unknown }).articleId === 'string'
    ) {
      newArticleId = (extraData as { articleId: string }).articleId;
    }

    if (
      targetPage === 'saved_kundlis' &&
      extraData &&
      typeof extraData === 'object' &&
      'kundliId' in extraData &&
      typeof (extraData as { kundliId?: unknown }).kundliId === 'string'
    ) {
      newKundliId = (extraData as { kundliId: string }).kundliId;
    }

    // Push previous state onto history stack
    setNavHistory((prev) => {
      const current: NavHistoryState = {
        page: activePage,
        articleId: selectedArticleId,
        savedKundliId: selectedSavedKundliId
      };
      const last = prev[prev.length - 1];
      if (
        last &&
        last.page === current.page &&
        last.articleId === current.articleId &&
        last.savedKundliId === current.savedKundliId
      ) {
        return prev;
      }
      return [...prev, current];
    });

    setSelectedArticleId(newArticleId);
    setSelectedSavedKundliId(newKundliId);
    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step-by-step Back function: comes back one-by-one to previous page
  const handleGoBack = () => {
    setNavHistory((prev) => {
      if (prev.length <= 1) {
        setSelectedArticleId(null);
        setSelectedSavedKundliId(null);
        setActivePage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return [{ page: 'home' }];
      }
      const updated = [...prev];
      const prevState = updated.pop()!;
      setActivePage(prevState.page || 'home');
      setSelectedArticleId(prevState.articleId || null);
      setSelectedSavedKundliId(prevState.savedKundliId || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return updated;
    });
  };

  // Close function: takes directly to Home page and clears stack
  const handleCloseToHome = () => {
    setSelectedArticleId(null);
    setSelectedSavedKundliId(null);
    setActivePage('home');
    setNavHistory([{ page: 'home' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    void logoutUserViaWp();
    setActiveUser(null);
    setActiveUserState(null);
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && notifPrefs[n.category] !== false
  ).length;
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  const isProfileTabActive =
    activePage === 'profile' || activePage === 'vault';

  const isCurrentPageDisabled = (() => {
    switch (activePage) {
      case 'panchang':
        return !isFeatureModuleEnabled(wpSettings, 'enable_panchang');
      case 'kundli':
      case 'saved_kundlis':
        return !isFeatureModuleEnabled(wpSettings, 'enable_kundli');
      case 'milan':
        return !isFeatureModuleEnabled(wpSettings, 'enable_milan');
      case 'rashifal':
        return !isFeatureModuleEnabled(wpSettings, 'enable_rashifal');
      case 'gochar':
        return !isFeatureModuleEnabled(wpSettings, 'enable_gochar');
      case 'tyohar':
        return !isFeatureModuleEnabled(wpSettings, 'enable_tyohar');
      case 'calculators':
        return !isFeatureModuleEnabled(wpSettings, 'enable_calculators');
      case 'dharma':
        return !isFeatureModuleEnabled(wpSettings, 'enable_dharma');
      case 'sankalp':
        return !isFeatureModuleEnabled(wpSettings, 'enable_sankalp');
      case 'chat':
      case 'pandit':
        return !isFeatureModuleEnabled(wpSettings, 'enable_pandit_chat');
      case 'articles':
        return !isFeatureModuleEnabled(wpSettings, 'enable_articles');
      case 'gallery':
        return !isFeatureModuleEnabled(wpSettings, 'enable_gallery');
      case 'reviews':
        return !isFeatureModuleEnabled(wpSettings, 'enable_reviews');
      case 'gyan':
        return !isFeatureModuleEnabled(wpSettings, 'enable_gyan');
      case 'puja':
        return !isFeatureModuleEnabled(wpSettings, 'enable_puja_vidhi');
      case 'sanskrit':
        return !isFeatureModuleEnabled(wpSettings, 'enable_sanskrit');
      case 'temples':
        return !isFeatureModuleEnabled(wpSettings, 'enable_temples');
      case 'puja_booking':
        return !isFeatureModuleEnabled(wpSettings, 'enable_puja_booking');
      case 'library':
        return !isFeatureModuleEnabled(wpSettings, 'enable_personal_library');
      case 'support':
        return !isFeatureModuleEnabled(wpSettings, 'enable_support_tickets');
      default:
        return false;
    }
  })();

  const isExpandedView = [
    'gyan',
    'puja',
    'sanskrit',
    'temples',
    'puja_booking',
    'pandit_dashboard',
    'library',
    'support'
  ].includes(activePage);

  return (
    <div className="min-h-screen w-full bg-[#EDE7DF] dark:bg-[#060D0F] flex justify-center items-start selection:bg-[#008080] selection:text-white transition-colors duration-200">
      {/* Mobile-App Viewport Container: Identical Mobile View on both Desktop and Mobile */}
      <div
        ref={appRootRef}
        className="w-full max-w-[480px] min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#0D1B1E] text-slate-900 dark:text-slate-100 shadow-2xl relative sm:border-x border-[#008080]/20 transition-colors overflow-x-hidden pb-16"
      >
        {/* Sticky Header with Hamburger Button */}
        <Header
          currentLang={currentLang}
          onLanguageChange={handleSelectLang}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          isOfflineMode={isOffline}
          onToggleOfflineMode={() => setIsOffline((prev) => !prev)}
          unreadNotifsCount={unreadCount}
          onOpenNotifications={() => setIsNotifOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMenu={() => setIsDrawerOpen(true)}
          onGoHome={handleCloseToHome}
        />

        {/* Slide-out Hamburger Menu accessible from all screens */}
        <HamburgerMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onNavigate={handleNavigate}
          currentScreen={activePage}
          currentLang={currentLang}
          activeUser={activeUser}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          isOfflineMode={isOffline}
          onToggleOfflineMode={() => setIsOffline((prev) => !prev)}
          onOpenAdminLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Container */}
        <main className="flex-1 w-full px-3.5 pt-3.5 pb-6">
        {wpSettings.maintenance_mode && activePage !== 'profile' && activePage !== 'vault' ? (
          <div className="bg-white dark:bg-[#112226] rounded-2xl p-6 sm:p-8 border border-[#FF7F33]/40 shadow-sm text-center space-y-3 my-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FF7F33]/15 text-[#FF7F33] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              ऐप रखरखाव मोड (Maintenance Mode) सक्रिय है
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {wpSettings.maintenance_message ||
                'ज्योतिषवाला ऐप में अभी रखरखाव और पंचांग डेटा अपडेट चल रहा है। कृपया कुछ समय पश्चात पुनः प्रयास करें।'}
            </p>
          </div>
        ) : isCurrentPageDisabled ? (
          <div className="bg-white dark:bg-[#112226] rounded-2xl p-8 border border-[#008080]/30 shadow-md text-center space-y-4 my-8 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              यह सुविधा व्यवस्थापक (Admin) द्वारा बंद की गई है
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              WordPress Admin Dashboard &rarr; 9. App Settings से इस सुविधा को कभी भी पुनः चालू (Enable) किया जा सकता है।
            </p>
            <button
              type="button"
              onClick={handleCloseToHome}
              className="px-5 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-extrabold transition shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>गृह पृष्ठ पर लौटें (Return Home)</span>
            </button>
          </div>
        ) : (
          <>
            {isExpandedView && (
              <div className="flex items-center justify-between gap-2 mb-3 bg-white dark:bg-[#112226] px-3.5 py-2.5 rounded-2xl border border-[#008080]/20 shadow-2xs">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>वापस</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseToHome}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{dict.closePage || 'बंद करें'}</span>
                </button>
              </div>
            )}

            {activePage === 'home' && (
              <HomeView
                panchang={rishikeshPanchang}
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
                currentLang={currentLang}
                onNavigate={handleNavigate}
              />
            )}

        {activePage === 'panchang' && (
          <PanchangView
            initialPanchang={rishikeshPanchang}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'tyohar' && (
          <TyoharView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'kundli' && (
          <KundliView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
            onOpenSavedKundlisPage={() => handleNavigate('saved_kundlis')}
          />
        )}

        {activePage === 'saved_kundlis' && (
          <SavedKundlisView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
            onNavigateToGenerator={() => handleNavigate('kundli')}
            initialKundliId={selectedSavedKundliId}
          />
        )}

        {activePage === 'milan' && (
          <MilanView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'rashifal' && (
          <RashifalView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'gochar' && (
          <GocharView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {(activePage === 'chat' || activePage === 'pandit') && (
          <PanditChatView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'calculators' && (
          <CalculatorsView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'dharma' && (
          <DharmaView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'sankalp' && (
          <SankalpView
            currentLang={currentLang}
            selectedCity={selectedCity}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'gyan' && (
          <GyanVibhagView
            language={currentLang === 'en' ? 'en' : 'hi'}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'puja' && (
          <PujaKarmakandView
            language={currentLang === 'en' ? 'en' : 'hi'}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'sanskrit' && (
          <SanskritLearningView
            language={currentLang === 'en' ? 'en' : 'hi'}
          />
        )}

        {activePage === 'temples' && (
          <TemplesTirthaView
            language={currentLang === 'en' ? 'en' : 'hi'}
          />
        )}

        {activePage === 'puja_booking' && (
          <PujaBookingView
            language={currentLang === 'en' ? 'en' : 'hi'}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'pandit_dashboard' && (
          <PanditDashboardView
            language={currentLang === 'en' ? 'en' : 'hi'}
          />
        )}

        {activePage === 'library' && (
          <PersonalLibraryView
            language={currentLang === 'en' ? 'en' : 'hi'}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'support' && (
          <HelpSupportView
            language={currentLang === 'en' ? 'en' : 'hi'}
          />
        )}

        {activePage === 'about' && (
          <AboutUsView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicyView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'gallery' && (
          <GalleryView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'reviews' && (
          <ReviewsView
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
          />
        )}

        {activePage === 'articles' && (
          <ArticlesView
            activeUser={activeUser}
            currentLang={currentLang}
            onGoBack={handleGoBack}
            onClosePage={handleCloseToHome}
            onNavigate={handleNavigate}
            initialArticleId={selectedArticleId}
            onClearInitialArticle={() => setSelectedArticleId(null)}
          />
        )}

            {(activePage === 'vault' || activePage === 'profile') && (
              <ProfileView
                activeUser={activeUser}
                onUpdateUser={(updated) => setActiveUserState(updated)}
                onOpenLoginModal={() => setIsLoginModalOpen(true)}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                currentLang={currentLang}
                onLanguageChange={handleSelectLang}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
                selectedCity={selectedCity}
                onGoBack={handleGoBack}
                onClosePage={handleCloseToHome}
              />
            )}
          </>
        )}
      </main>

      {/* Website Footer on Every Page: 2-Line App Description + Copyright */}
      <footer className="bg-teal-50/70 dark:bg-[#112226] border-t border-[#008080]/20 px-3.5 py-3.5">
        <div className="w-full flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="text-[11px] leading-snug text-slate-600 dark:text-slate-300">
            <p className="font-bold text-slate-800 dark:text-slate-100">
              {dict.footerAboutLine1}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              {dict.footerAboutLine2}
            </p>
          </div>
          <div className="text-[10px] font-extrabold text-[#008080] dark:text-teal-300 shrink-0">
            {dict.footerCopyright}
          </div>
        </div>
      </footer>

      {/* Strictly Fixed 5-Icon Bottom Navigation Bar (Stays out of the way when mobile virtual keypad opens) */}
      <nav
        aria-label="मुख्य नेविगेशन"
        className={`fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-40 h-16 bg-white dark:bg-[#0D1B1E] border-t border-[#008080]/25 sm:border-x shadow-lg ${
          isMobileKeyboardOpen ? 'hidden' : ''
        }`}
      >
        <div className="w-full px-1.5 h-full grid grid-cols-5 items-center">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition cursor-pointer ${
              activePage === 'home'
                ? 'text-[#008080] dark:text-teal-300 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            <Home
              className={`w-5 h-5 ${
                activePage === 'home' ? 'text-[#FF7F33]' : 'text-current'
              }`}
            />
            <span className="text-[11px] leading-none">{dict.home || 'गृह'}</span>
          </button>

          {/* 2. Kundli (Authentic Vedic Kundli Chart Icon + Label) */}
          <button
            type="button"
            onClick={() => handleNavigate('kundli')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition cursor-pointer ${
              activePage === 'kundli'
                ? 'text-[#008080] dark:text-teal-300 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-5 h-5 ${
                activePage === 'kundli' ? 'text-[#FF7F33]' : 'text-current'
              }`}
            >
              <rect x="3" y="3" width="18" height="18" rx="1.5" />
              <line x1="3" y1="3" x2="21" y2="21" />
              <line x1="21" y1="3" x2="3" y2="21" />
              <polygon points="12,3 3,12 12,21 21,12" />
            </svg>
            <span className="text-[11px] leading-none">{dict.kundli || 'कुंडली'}</span>
          </button>

          {/* 3. Panchang */}
          <button
            type="button"
            onClick={() => handleNavigate('panchang')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition cursor-pointer ${
              activePage === 'panchang'
                ? 'text-[#008080] dark:text-teal-300 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            <Calendar
              className={`w-5 h-5 ${
                activePage === 'panchang' ? 'text-[#FF7F33]' : 'text-current'
              }`}
            />
            <span className="text-[11px] leading-none">{dict.panchang || 'पंचांग'}</span>
          </button>

          {/* 4. Tyohar (त्योहार) */}
          <button
            type="button"
            onClick={() => handleNavigate('tyohar')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition cursor-pointer ${
              activePage === 'tyohar'
                ? 'text-[#008080] dark:text-teal-300 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            <Sparkles
              className={`w-5 h-5 ${
                activePage === 'tyohar' ? 'text-[#FF7F33]' : 'text-current'
              }`}
            />
            <span className="text-[11px] leading-none">{dict.tyohar || 'त्योहार'}</span>
          </button>

          {/* 5. Profile (Shows Admin Photo when logged in, otherwise Profile Icon) */}
          <button
            type="button"
            onClick={() => handleNavigate('profile')}
            className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition cursor-pointer ${
              isProfileTabActive
                ? 'text-[#008080] dark:text-teal-300 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            {activeUser ? (
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className={`w-5 h-5 rounded-full object-cover border ${
                  isProfileTabActive ? 'border-[#FF7F33] ring-2 ring-[#FF7F33]/30' : 'border-[#008080]'
                }`}
              />
            ) : (
              <User
                className={`w-5 h-5 ${
                  isProfileTabActive ? 'text-[#FF7F33]' : 'text-current'
                }`}
              />
            )}
            <span className="text-[11px] leading-none">{dict.profile}</span>
          </button>
        </div>
      </nav>

      {/* Global Modals */}
      <UserAuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setActiveUserState(user);
          setActivePage('profile');
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        prefs={notifPrefs}
        onTogglePref={handleToggleNotifPref}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
      />
      </div>
    </div>
  );
}
