/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Landmark,
  Library,
  MapPin,
  Moon,
  Phone,
  Search,
  Sparkles,
  Sun,
  Scroll,
  Star,
  MessageSquarePlus,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';
import { LanguageCode, PanchangData, RashifalPeriod } from '../types';
import { CityLocation, searchLocationsViaApi } from '../services/panchangEngine';
import { getHoroscopesByPeriod } from '../services/horoscopeService';
import { getArticles, syncArticlesFromServer } from '../services/articleService';
import { getPandits, FALLBACK_PANDIT_AVATAR } from '../services/astrologerService';
import {
  getSiteContent,
  HomeSlideItem,
  getSlideBackgroundImage
} from '../services/siteContentService';
import { DICTIONARY, trTerm } from '../i18n/translations';
import { getManagedTyoharListForYear, HINDI_MONTH_TABS } from '../data/tyoharData';
import { PaginationControls } from '../components/PaginationControls';
import { formatToDdMmYyyy } from '../components/DatePicker';
import {
  AppReviewItem,
  ReviewSystemMeta,
  getApprovedReviews,
  getReviewMeta
} from '../services/reviewService';
import { ReviewSubmitModal } from './ReviewsView';
import {
  getWpAppSettings,
  isFeatureModuleEnabled,
  WpAppFeatureSettings
} from '../services/wpApiClient';

interface HomeViewProps {
  panchang: PanchangData;
  selectedCity: CityLocation;
  onCityChange: (city: CityLocation) => void;
  currentLang: LanguageCode;
  onNavigate: (screen: string, extraData?: unknown) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  panchang,
  selectedCity,
  onCityChange,
  currentLang,
  onNavigate
}) => {
  const t = DICTIONARY[currentLang] || DICTIONARY.hi;

  const [rashifalPeriod, setRashifalPeriod] = useState<RashifalPeriod>('daily');
  const [selectedRashiIdx, setSelectedRashiIdx] = useState(0);
  const [homeTyoharMonth, setHomeTyoharMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  // WordPress App Settings Live State
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

  // Home Auto-Sliding Category Carousel State (Synced with Admin Panel)
  const [slides, setSlides] = useState<HomeSlideItem[]>(() => getSiteContent().slides);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  useEffect(() => {
    const syncSlides = () => {
      const updated = getSiteContent().slides;
      setSlides(updated);
      setActiveSlideIdx((prev) => (updated.length > 0 ? prev % updated.length : 0));
    };
    window.addEventListener('jyotishwala_site_content_changed', syncSlides);
    return () => window.removeEventListener('jyotishwala_site_content_changed', syncSlides);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const getSlideThemeClasses = (theme: HomeSlideItem['theme']) => {
    switch (theme) {
      case 'saffron':
        return 'bg-gradient-to-r from-[#d95f18] to-[#FF7F33] text-white';
      case 'dark':
        return 'bg-gradient-to-r from-[#0D1B1E] to-[#1a383f] text-white';
      case 'emerald':
        return 'bg-gradient-to-r from-[#065f46] to-[#008080] text-white';
      case 'indigo':
        return 'bg-gradient-to-r from-[#1e3a8a] to-[#008080] text-white';
      case 'teal':
      default:
        return 'bg-gradient-to-r from-[#006666] to-[#008080] text-white';
    }
  };

  // Location Popup Modal State on Panchang Card
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityLocation[]>([]);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const locInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLocationModalOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isLocationModalOpen]);

  useEffect(() => {
    if (!isLocationModalOpen) return;
    if (!locationQuery.trim()) {
      setSuggestions([]);
      setIsSearchingLoc(false);
      return;
    }
    let active = true;
    setIsSearchingLoc(true);
    const timer = setTimeout(() => {
      searchLocationsViaApi(locationQuery).then((res) => {
        if (active) {
          setSuggestions(res);
          setIsSearchingLoc(false);
        }
      });
    }, 150);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [locationQuery, isLocationModalOpen]);

  const handleOpenLocationModal = () => {
    setLocationQuery('');
    setSuggestions([]);
    setIsLocationModalOpen(true);
    setTimeout(() => {
      locInputRef.current?.focus();
    }, 50);
  };

  const handleSelectLocation = (loc: CityLocation) => {
    onCityChange(loc);
    setIsLocationModalOpen(false);
  };

  const handleLocationKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelectLocation(suggestions[0]);
      } else {
        const res = await searchLocationsViaApi(locationQuery);
        if (res.length > 0) {
          handleSelectLocation(res[0]);
        }
      }
    }
  };

  const [homeArticles, setHomeArticles] = useState(() => getArticles());
  const [articlePage, setArticlePage] = useState<number>(1);
  const HOME_ARTICLES_PER_PAGE = 4;

  useEffect(() => {
    void syncArticlesFromServer().then((fresh) => setHomeArticles(fresh));
    const handleSync = () => setHomeArticles(getArticles());
    window.addEventListener('jw-articles-updated', handleSync);
    return () => window.removeEventListener('jw-articles-updated', handleSync);
  }, []);

  const [tyoharRefresh, setTyoharRefresh] = useState(0);
  useEffect(() => {
    const syncHomeData = () => setTyoharRefresh((prev) => prev + 1);
    window.addEventListener('jyotishwala_tyohar_changed', syncHomeData);
    window.addEventListener('jyotishwala_pandits_changed', syncHomeData);
    window.addEventListener('jyotishwala_rashifal_changed', syncHomeData);
    window.addEventListener('jyotishwala_app_settings_changed', syncHomeData);
    return () => {
      window.removeEventListener('jyotishwala_tyohar_changed', syncHomeData);
      window.removeEventListener('jyotishwala_pandits_changed', syncHomeData);
      window.removeEventListener('jyotishwala_rashifal_changed', syncHomeData);
      window.removeEventListener('jyotishwala_app_settings_changed', syncHomeData);
    };
  }, []);

  const horoscopes = React.useMemo(
    () => getHoroscopesByPeriod(rashifalPeriod),
    [rashifalPeriod, tyoharRefresh]
  );
  const currentRashi = horoscopes[selectedRashiIdx] || horoscopes[0];
  const paginatedArticles = homeArticles.slice(
    (articlePage - 1) * HOME_ARTICLES_PER_PAGE,
    articlePage * HOME_ARTICLES_PER_PAGE
  );
  const pandits = React.useMemo(() => getPandits(), [tyoharRefresh]);
  const featuredPandit = React.useMemo(() => pandits.find((p) => p.isChief) || pandits[0], [pandits]);

  const homeTyoharPreview = React.useMemo(() => {
    const list = getManagedTyoharListForYear(new Date().getFullYear());
    return list
      .filter((item) => homeTyoharMonth === 0 || item.monthNumber === homeTyoharMonth)
      .slice(0, 4);
  }, [homeTyoharMonth, tyoharRefresh]);

  // Home User Reviews Auto-Sliding Carousel State (Synced with Admin Panel & User Submissions)
  const [approvedReviews, setApprovedReviews] = useState<AppReviewItem[]>(() =>
    getApprovedReviews()
  );
  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);
  const reviewTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    const syncReviews = () => {
      const updated = getApprovedReviews();
      setApprovedReviews(updated);
      setActiveReviewIdx((prev) => (updated.length > 0 ? prev % updated.length : 0));
    };
    window.addEventListener('jyotishwala_reviews_changed', syncReviews);
    return () => window.removeEventListener('jyotishwala_reviews_changed', syncReviews);
  }, []);

  useEffect(() => {
    if (approvedReviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % approvedReviews.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [approvedReviews.length]);

  const currentReview = approvedReviews[activeReviewIdx] || approvedReviews[0];

  // Top 4 core Panchang items on Home Card; clicking "और देखें" opens the dedicated Panchang page
  const homePanchangSummaryItems = [
    {
      label: 'तिथि',
      value: `${panchang.tithi.name} (${panchang.tithi.endTime} तक)`,
      sub: panchang.tithi.nextTithi
        ? `इसके बाद: ${panchang.tithi.nextTithi} (${panchang.tithi.nextEndTime || ''} तक)`
        : `समाप्ति: ${panchang.tithi.endTime}`
    },
    { label: 'पक्ष', value: panchang.tithi.paksha, sub: `माह: ${panchang.samvat.maahPurnimant} (पूर्णिमांत) / ${panchang.samvat.maahAmavasyant} (अमावस्यांत)` },
    {
      label: 'नक्षत्र',
      value: `${panchang.nakshatra.name} (${panchang.nakshatra.endTime} तक)`,
      sub: panchang.nakshatra.nextNakshatra
        ? `इसके बाद: ${panchang.nakshatra.nextNakshatra} (${panchang.nakshatra.nextEndTime || ''} तक)`
        : `समाप्ति: ${panchang.nakshatra.endTime}`
    },
    {
      label: 'योग',
      value: `${panchang.yoga.name} (${panchang.yoga.endTime} तक)`,
      sub: panchang.yoga.nextYoga
        ? `इसके बाद: ${panchang.yoga.nextYoga} (${panchang.yoga.nextEndTime || ''} तक)`
        : `समाप्ति: ${panchang.yoga.endTime}`
    }
  ];

  const currentSlide = slides[activeSlideIdx] || slides[0];

  return (
    <div className="space-y-5 pb-8">
      {/* 0. Auto-Sliding App Category Hero Carousel (With Subtle Category Background Image Behind Colored Overlay) */}
      {isFeatureModuleEnabled(wpSettings, 'enable_banners') !== false && slides.length > 0 && currentSlide && (
        <section
          className={`rounded-2xl ${getSlideThemeClasses(currentSlide.theme)} p-4 sm:p-5 shadow-md relative overflow-hidden transition-all duration-500 min-h-[136px] sm:min-h-[148px] flex flex-col justify-between border border-white/15`}
        >
          {/* Subtle Category Background Image & Sacred Vedic Motif Layer */}
          <img
            src={getSlideBackgroundImage(currentSlide)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none select-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none select-none text-white"
          >
            {currentSlide.targetScreen === 'kundli' && <Compass className="w-36 h-36" />}
            {currentSlide.targetScreen === 'panchang' && <Sun className="w-36 h-36" />}
            {currentSlide.targetScreen === 'milan' && <HeartHandshake className="w-36 h-36" />}
            {currentSlide.targetScreen === 'chat' && <Phone className="w-36 h-36" />}
            {currentSlide.targetScreen === 'dharma' && <Flame className="w-36 h-36" />}
            {!['kundli', 'panchang', 'milan', 'chat', 'dharma'].includes(
              currentSlide.targetScreen
            ) && <Sparkles className="w-36 h-36" />}
          </div>

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="space-y-1.5 max-w-2xl">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-2xs text-white text-[10px] sm:text-xs font-extrabold tracking-wide">
                <Sparkles className="w-3 h-3 text-white shrink-0" />
                <span>{currentSlide.badge}</span>
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug drop-shadow-2xs">
                {currentSlide.title}
              </h2>
              <p className="text-xs text-white/95 leading-relaxed line-clamp-2">
                {currentSlide.description}
              </p>
            </div>

            {slides.length > 1 && (
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)
                  }
                  className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
                  aria-label="पिछली स्लाइड"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlideIdx((prev) => (prev + 1) % slides.length)}
                  className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
                  aria-label="अगली स्लाइड"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mt-3.5 pt-2.5 border-t border-white/20">
            <button
              type="button"
              onClick={() => onNavigate(currentSlide.targetScreen)}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-amber-50 font-extrabold text-xs shadow-xs transition inline-flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>{currentSlide.buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#008080]" />
            </button>

            {slides.length > 1 && (
              <div className="flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    aria-label={`स्लाइड ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeSlideIdx
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 1. Interactive Location-Based Panchang Hero Card (With Outside Heading Like Other Sections) */}
      {isFeatureModuleEnabled(wpSettings, 'enable_panchang') && (
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#008080] dark:text-teal-400" />
              <span>{t.panchang}</span>
            </h2>
          </div>

          <div className="rounded-2xl bg-[#008080] text-white p-4 sm:p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              {/* Top Row: Date Pill + Icon-Only Location Button Right Next to It (Vikram Samvat line removed) */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 border-b border-white/20 pb-3.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Current Date Pill with Solid Harmonious Saffron (#FF7F33) Background */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#FF7F33] text-white shadow-xs border border-white/20">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    <span>{formatToDdMmYyyy(panchang.date)}</span>
                  </span>

                  {/* Location Icon Button right next to Date (Strictly Icon Only) */}
                  <button
                    type="button"
                    onClick={handleOpenLocationModal}
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 transition cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
                    title={`स्थान बदलें (${selectedCity.name})`}
                    aria-label="पंचांग स्थान चुनें"
                  >
                    <MapPin className="w-4 h-4 text-white shrink-0" />
                  </button>
                </div>
              </div>

              {/* SECTION 1: Ordered Panchang Details (Flat rows directly inside the main card, NO inner cards) */}
              <div className="mb-4">
                <div className="flex items-center justify-between gap-1.5 text-xs font-extrabold text-teal-100 mb-3 border-b border-white/20 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>पंचांग विवरण • {selectedCity.name}</span>
                  </span>
                  <span className="text-white font-bold">{panchang.vara.name}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-3">
                  {homePanchangSummaryItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b border-white/15 pb-2 flex flex-col justify-between"
                    >
                      <span className="text-[11px] text-teal-100 block">{item.label}</span>
                      <span className="text-xs sm:text-sm font-extrabold text-white block mt-0.5">
                        {item.value}
                      </span>
                      {item.sub && (
                        <span className="text-[10px] text-teal-100/90 font-medium block mt-0.5">
                          {item.sub}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar: "और देखें" Button that navigates to the dedicated Panchang page */}
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center">
                <button
                  type="button"
                  onClick={() => onNavigate('panchang')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF7F33] hover:bg-[#e86b22] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.seeMorePanchang || 'और देखें'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Quick Action Feature Grid */}
      {(() => {
        const hasKundli = isFeatureModuleEnabled(wpSettings, 'enable_kundli');
        const hasMilan = isFeatureModuleEnabled(wpSettings, 'enable_milan');
        const hasGochar = isFeatureModuleEnabled(wpSettings, 'enable_gochar');
        const hasDharma = isFeatureModuleEnabled(wpSettings, 'enable_dharma');
        const hasCalculators = isFeatureModuleEnabled(wpSettings, 'enable_calculators');
        const hasChat = isFeatureModuleEnabled(wpSettings, 'enable_pandit_chat');
        const hasSankalp = isFeatureModuleEnabled(wpSettings, 'enable_sankalp');
        const hasAnyQuick = hasKundli || hasMilan || hasGochar || hasDharma || hasCalculators || hasChat || hasSankalp;

        if (!hasAnyQuick) return null;

        return (
          <section>
            {(hasKundli || hasMilan || hasGochar || hasDharma || hasCalculators || hasChat) && (
              <>
                <div className="flex items-center justify-between mb-2.5">
                  <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#008080] dark:text-teal-400" />
                    {t.jyotish}
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {hasKundli && (
                    <div
                      onClick={() => onNavigate('kundli')}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#008080]/10 text-[#008080] dark:text-teal-300 flex items-center justify-center mb-2">
                          <Compass className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {t.kundliGenerator}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        {t.avakahadaTab}
                      </p>
                    </div>
                  )}

                  {hasMilan && (
                    <div
                      onClick={() => onNavigate('milan')}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center mb-2">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {t.kundliMilan}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        36 गुण मिलान
                      </p>
                    </div>
                  )}

                  {hasGochar && (
                    <div
                      onClick={() => onNavigate('gochar')}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#008080]/10 text-[#008080] dark:text-teal-300 flex items-center justify-center mb-2">
                          <Flame className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {t.grahGochar}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        नवग्रह राशि परिवर्तन
                      </p>
                    </div>
                  )}

                  {hasDharma && (
                    <div
                      onClick={() => onNavigate('dharma')}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center mb-2">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {t.dharma || 'सनातन धर्म'}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        108 जप माला व मंत्र
                      </p>
                    </div>
                  )}

                  {hasCalculators && (
                    <div
                      onClick={() => onNavigate('calculators')}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#008080]/10 text-[#008080] dark:text-teal-300 flex items-center justify-center mb-2">
                          <Sun className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {t.calculators || 'ज्योतिष कैलकुलेटर'}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        रत्न व अंक ज्योतिष
                      </p>
                    </div>
                  )}

                  {hasChat && (
                    <div
                      onClick={() => onNavigate('chat')}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center mb-2">
                          <Phone className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {t.talkToPandit}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        परामर्श हेतु अलग पेज
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {hasSankalp && (
              <>
                {/* Section Heading for Sankalp Mantra */}
                <div className="mt-4 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FF7F33]/15 text-[#FF7F33] flex items-center justify-center shrink-0">
                      <Scroll className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      दैनिक संकल्प मंत्र
                    </h2>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    पूजा, व्रत व अनुष्ठान विधि
                  </span>
                </div>

                {/* 2-Box Width Sankalp Mantra Action Card directly under the 6 boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => onNavigate('sankalp')}
                    className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 via-white to-orange-50/50 dark:from-[#112226] dark:via-[#13282d] dark:to-[#172023] border border-[#008080]/30 hover:border-[#008080] shadow-xs cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#008080] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition">
                        <Scroll className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            संकल्प मंत्र
                          </h3>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FF7F33] text-white shrink-0">
                            दैनिक लाइव
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                          13 पंचांगीय अंग, लघु व विस्तृत संकल्प पाठ विधि
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#008080] dark:text-teal-300 shrink-0">
                      <span>खोलें</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Sanatan Shastra, Puja Karmakand, Sanskrit, Temples & Booking Expansion Grid */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#008080] dark:text-teal-400" />
                  <span>सनातन शास्त्र, कर्मकांड, संस्कृत एवं तीर्थ सेवाएं</span>
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#008080]/10 text-[#008080] dark:text-teal-300">
                  संपूर्ण मंच
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {isFeatureModuleEnabled(wpSettings, 'enable_gyan') && (
                  <div
                    onClick={() => onNavigate('gyan')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#008080]/10 text-[#008080] dark:text-teal-300 flex items-center justify-center mb-2">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        ज्ञान विभाग (7 शास्त्र)
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      वेद, उपनिषद, गीता व पुराण
                    </p>
                  </div>
                )}

                {isFeatureModuleEnabled(wpSettings, 'enable_puja_vidhi') && (
                  <div
                    onClick={() => onNavigate('puja')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center mb-2">
                        <Flame className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        पूजा एवं कर्मकांड
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      19 श्रेणी • सामग्री व विधि
                    </p>
                  </div>
                )}

                {isFeatureModuleEnabled(wpSettings, 'enable_sanskrit') && (
                  <div
                    onClick={() => onNavigate('sanskrit')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#008080]/10 text-[#008080] dark:text-teal-300 flex items-center justify-center mb-2">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        संस्कृत शिक्षा
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      4 स्तर • व्याकरण व प्रश्नोत्तरी
                    </p>
                  </div>
                )}

                {isFeatureModuleEnabled(wpSettings, 'enable_temples') && (
                  <div
                    onClick={() => onNavigate('temples')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center mb-2">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        मंदिर एवं तीर्थ
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      ज्योतिर्लिंग, चार धाम व आरती समय
                    </p>
                  </div>
                )}

                {isFeatureModuleEnabled(wpSettings, 'enable_puja_booking') && (
                  <div
                    onClick={() => onNavigate('puja_booking')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center mb-2">
                        <CalendarPlus className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        यजमान पूजा बुकिंग
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      पंडित बुकिंग व स्थिति ट्रैकिंग
                    </p>
                  </div>
                )}

                <div
                  onClick={() => onNavigate('pandit_dashboard')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#008080]/10 text-[#008080] dark:text-teal-300 flex items-center justify-center mb-2">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      पंडित डैशबोर्ड
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    पुरोहित पंजीकरण व बुकिंग प्रबंधन
                  </p>
                </div>

                {isFeatureModuleEnabled(wpSettings, 'enable_personal_library') && (
                  <div
                    onClick={() => onNavigate('library')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#008080]/10 text-[#008080] dark:text-teal-300 flex items-center justify-center mb-2">
                        <Library className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        मेरा पुस्तकालय
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      बुकमार्क, नोट्स व पठन इतिहास
                    </p>
                  </div>
                )}

                {isFeatureModuleEnabled(wpSettings, 'enable_support_tickets') && (
                  <div
                    onClick={() => onNavigate('support')}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center mb-2">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        सहायता केंद्र
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      FAQ, टिकट व एडमिन रजिस्ट्री
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 3. Horoscope Section (दैनिक, मासिक, वार्षिक राशिफल — Single Card, No Nested Cards) */}
      {isFeatureModuleEnabled(wpSettings, 'enable_rashifal') && (
        <section className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/20 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF7F33]/10 text-[#FF7F33] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {rashifalPeriod === 'daily'
              ? t.dailyHoroscope
              : rashifalPeriod === 'monthly'
              ? t.monthlyHoroscope
              : t.yearlyHoroscope}
          </h2>
        </div>

        {/* Period Switcher: Width Equals Card Width */}
        <div className="w-full grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setRashifalPeriod('daily')}
            className={`w-full py-2 px-2 rounded-lg transition cursor-pointer text-center ${
              rashifalPeriod === 'daily'
                ? 'bg-[#008080] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            {t.dailyHoroscope}
          </button>
          <button
            type="button"
            onClick={() => setRashifalPeriod('monthly')}
            className={`w-full py-2 px-2 rounded-lg transition cursor-pointer text-center ${
              rashifalPeriod === 'monthly'
                ? 'bg-[#008080] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            {t.monthlyHoroscope}
          </button>
          <button
            type="button"
            onClick={() => setRashifalPeriod('yearly')}
            className={`w-full py-2 px-2 rounded-lg transition cursor-pointer text-center ${
              rashifalPeriod === 'yearly'
                ? 'bg-[#008080] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            {t.yearlyHoroscope}
          </button>
        </div>

        {/* Rashi Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
          {horoscopes.map((h, idx) => (
            <button
              key={`rashi_tab_${h.signIndex}_${idx}`}
              type="button"
              onClick={() => setSelectedRashiIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border shrink-0 cursor-pointer ${
                selectedRashiIdx === idx
                  ? 'bg-[#008080] text-white border-[#008080]'
                  : 'bg-slate-50 dark:bg-slate-900 border-[#008080]/20 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-sm">{h.symbol}</span>
              <span>{trTerm(h.hindiName, currentLang)}</span>
            </button>
          ))}
        </div>

        {/* Selected Rashi Details (Flat inside the main Horoscope card, NO inner cards) */}
        {currentRashi && (
          <div
            key={`${rashifalPeriod}_${currentRashi.signIndex}`}
            className="pt-3 border-t border-[#008080]/15 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#008080]/15 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#008080] dark:text-teal-200 flex items-center gap-1.5">
                    <span className="text-lg">{currentRashi.symbol}</span>
                    <span>{trTerm(currentRashi.hindiName, currentLang)}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF7F33] text-white text-[10px] font-extrabold">
                    {rashifalPeriod === 'daily'
                      ? t.dailyHoroscope
                      : rashifalPeriod === 'monthly'
                      ? t.monthlyHoroscope
                      : t.yearlyHoroscope}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  स्वामी: {trTerm(currentRashi.ruler, currentLang)} • तत्व: {currentRashi.element}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#008080]/10 font-bold text-[#008080] dark:text-teal-300">
                  शुभ अंक: {currentRashi.luckyNumber}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FF7F33]/10 font-bold text-[#FF7F33]">
                  शुभ रंग: {currentRashi.luckyColor}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {currentRashi.general}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#008080]/15">
              <div className="sm:border-r border-[#008080]/15 sm:pr-3">
                <strong className="text-[#008080] dark:text-teal-300 block mb-0.5">
                  करियर व व्यापार:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {currentRashi.career}
                </p>
              </div>

              <div>
                <strong className="text-[#FF7F33] block mb-0.5">
                  वैदिक उपाय:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {currentRashi.remedy}
                </p>
              </div>
            </div>

            {/* Button to open full detailed horoscope page */}
            <div className="pt-2 border-t border-[#008080]/15 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                प्रेम, स्वास्थ्य, करियर, वित्त व संपूर्ण 12 राशियों का फलादेश
              </span>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('jw_active_rashi_idx', String(currentRashi.signIndex));
                    localStorage.setItem('jw_active_rashifal_period', rashifalPeriod);
                  } catch {
                    // ignore
                  }
                  onNavigate('rashifal');
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#008080] to-[#006666] hover:from-[#006666] hover:to-[#004d4d] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#FF7F33]" />
                <span className="font-bold text-xs tracking-wide">पूरा पढ़ें</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-white/90" />
              </button>
            </div>
          </div>
        )}
        </section>
      )}

      {/* 4. Dedicated Pandit Ji Consultation Section with Heading */}
      {isFeatureModuleEnabled(wpSettings, 'enable_pandit_chat') && featuredPandit && (
        <section className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#008080] text-white flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-[#FF7F33]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                पंडित जी से परामर्श (ज्योतिषीय मार्गदर्शन)
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                वैदिक ज्योतिषाचार्य से अपनी कुंडली, वास्तु एवं जीवन समस्याओं पर सीधा संपर्क करें
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <img
                src={featuredPandit.avatar || FALLBACK_PANDIT_AVATAR}
                alt={featuredPandit.name}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== FALLBACK_PANDIT_AVATAR) {
                    target.src = FALLBACK_PANDIT_AVATAR;
                  }
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#008080] ring-2 ring-[#FF7F33]/25 shrink-0 bg-teal-50 dark:bg-teal-950 shadow-xs"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {featuredPandit.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-[#008080] text-white text-[10px] font-bold">
                    मुख्य ज्योतिषाचार्य
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 break-words whitespace-normal leading-snug">
                  <span className="font-semibold text-[#FF7F33]">{featuredPandit.qualification}</span> • {featuredPandit.experienceYears} वर्ष अनुभव
                </p>
                <div className="text-[11px] text-[#008080] dark:text-teal-300 mt-1 font-semibold flex items-center gap-2 flex-wrap">
                  <span>{featuredPandit.mobile}</span>
                  <span>•</span>
                  <span>{featuredPandit.dakshinaInfo}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('chat', { panditId: featuredPandit.id })}
              className="w-full sm:w-auto py-2.5 px-4 bg-[#008080] hover:bg-[#006666] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#FF7F33]" />
              <span>{t.talkToPandit}</span>
            </button>
          </div>
        </section>
      )}

      {/* 5. Home Page Tyohar Section (Standalone Single Festival Cards, No Outer Wrapper Card) */}
      {isFeatureModuleEnabled(wpSettings, 'enable_tyohar') && (
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#008080] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#FF7F33]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {t.tyohar || 'प्रमुख त्योहार एवं व्रत कैलेंडर'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                महीने एवं तारीख के अनुसार प्रमुख सनातन हिंदू पर्वों की संक्षिप्त जानकारी
              </p>
            </div>
          </div>

          {/* Month Selector Pills on Home Tyohar Section */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {HINDI_MONTH_TABS.slice(1).map((m) => (
              <button
                key={m.monthNumber}
                type="button"
                onClick={() => setHomeTyoharMonth(m.monthNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border cursor-pointer shrink-0 ${
                  homeTyoharMonth === m.monthNumber
                    ? 'bg-[#008080] text-white border-[#008080]'
                    : 'bg-white dark:bg-[#112226] text-slate-700 dark:text-slate-300 border-[#008080]/20'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Festival Cards Preview (Refined Single Card per Festival, No Nested Sub-Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
            {homeTyoharPreview.map((fest) => {
              const slashDate = fest.date.split('-').reverse().join('/');
              const dayNum = fest.date.split('-')[2] || '01';
              const isHighlight =
                fest.category === 'प्रमुख महापर्व' || fest.category === 'एकादशी एवं व्रत';
              return (
                <div
                  key={fest.id}
                  onClick={() => onNavigate('tyohar')}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs transition cursor-pointer flex flex-col justify-between gap-2.5 h-full"
                >
                  <div className="space-y-2">
                    {/* Top Header Row: Date Circle + Full Date/Vara & Category Tag */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#008080]/15">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${
                            isHighlight ? 'bg-[#FF7F33]' : 'bg-[#008080]'
                          }`}
                        >
                          {dayNum}
                        </span>
                        <div className="min-w-0">
                          <span className="block text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {slashDate} - {fest.vara}
                          </span>
                          <span className="block text-[11px] font-bold text-[#008080] dark:text-teal-300 truncate">
                            {fest.hindiMaas} • {fest.pakshaTithi}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold leading-none shrink-0 ${
                          isHighlight
                            ? 'bg-[#FF7F33]/15 text-[#FF7F33]'
                            : 'bg-[#008080]/10 text-[#008080] dark:text-teal-300'
                        }`}
                      >
                        {fest.category}
                      </span>
                    </div>

                    {/* Festival Title */}
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {fest.name}
                    </h3>
                  </div>

                  {/* Concise Info */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1.5 border-t border-dashed border-[#008080]/15">
                    {fest.shortInfo}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Button Redirecting to Full Tyohar Page */}
          <div className="pt-1 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => onNavigate('tyohar')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>संपूर्ण 1 वर्ष के सभी त्योहार विस्तार से देखें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* 6. Featured Articles with Thumbnail Image */}
      {isFeatureModuleEnabled(wpSettings, 'enable_articles') && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#008080] dark:text-teal-400" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t.articles}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('articles')}
              className="text-xs font-bold text-[#008080] dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {t.readMore} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {paginatedArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate('articles', { articleId: art.id })}
                className="rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs cursor-pointer transition flex flex-col overflow-hidden"
              >
                {currentLang !== 'en' && art.imageUrl && (
                  <div className="h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={art.imageUrl}
                      alt={art.imageAlt || art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#008080]/10 text-[#008080] dark:text-teal-300 font-bold">
                        {art.categoryHindi}
                      </span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#008080]/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{art.author}</span>
                    <span className="text-[#008080] dark:text-teal-300 font-bold">
                      {t.readMore} →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {homeArticles.length > HOME_ARTICLES_PER_PAGE && (
            <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 shadow-xs">
              <PaginationControls
                currentPage={articlePage}
                totalItems={homeArticles.length}
                pageSize={HOME_ARTICLES_PER_PAGE}
                onPageChange={setArticlePage}
                itemLabel="ब्लॉग लेख"
                centered={true}
              />
            </div>
          )}
        </section>
      )}

      {/* 7. Reviews Section: Only Heading + Auto-Sliding Review Card */}
      {isFeatureModuleEnabled(wpSettings, 'enable_reviews') && currentReview && (
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#008080] dark:text-teal-400" />
              <span>समीक्षाएं (Reviews)</span>
            </h2>
          </div>

          <div
            onTouchStart={(e) => {
              reviewTouchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (reviewTouchStartX.current === null || approvedReviews.length <= 1) return;
              const diff = (e.changedTouches[0]?.clientX ?? 0) - reviewTouchStartX.current;
              if (Math.abs(diff) > 40) {
                if (diff < 0) {
                  setActiveReviewIdx((prev) => (prev + 1) % approvedReviews.length);
                } else {
                  setActiveReviewIdx(
                    (prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length
                  );
                }
              }
              reviewTouchStartX.current = null;
            }}
            className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs transition-all duration-500 flex flex-col justify-between gap-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#008080]/15">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#008080] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {currentReview.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {currentReview.userName}
                      </h3>
                      {currentReview.isVerified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>सत्यापित</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {currentReview.userCity} • {formatToDdMmYyyy(currentReview.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg border border-[#FF7F33]/25">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= currentReview.rating
                          ? 'text-[#FF7F33] fill-[#FF7F33]'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-teal-300 text-[10px] font-extrabold">
                  सेवा: {currentReview.serviceCategory}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                “{currentReview.comment}”
              </p>

              {currentReview.adminReply && (
                <div className="p-2.5 rounded-r-xl rounded-l-none bg-teal-50/70 dark:bg-teal-950/30 border-l-3 border-[#008080] text-[11px] text-slate-700 dark:text-slate-300">
                  <strong className="text-[#008080] dark:text-teal-300 block mb-0.5">
                    JyotishWala संस्थान का उत्तर:
                  </strong>
                  <span>{currentReview.adminReply}</span>
                </div>
              )}
            </div>

            {approvedReviews.length > 1 && (
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#008080]/15">
                <button
                  type="button"
                  onClick={() =>
                    setActiveReviewIdx(
                      (prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length
                    )
                  }
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  aria-label="पिछली समीक्षा"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {approvedReviews.map((r, idx) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setActiveReviewIdx(idx)}
                      aria-label={`समीक्षा स्लाइड ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeReviewIdx
                          ? 'w-6 bg-[#008080]'
                          : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#008080]/60'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveReviewIdx((prev) => (prev + 1) % approvedReviews.length)
                  }
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  aria-label="अगली समीक्षा"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Location Search Popup Modal */}
      {isLocationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overscroll-none"
          onClick={() => setIsLocationModalOpen(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#112226] rounded-2xl border border-[#008080]/30 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="px-4 py-3.5 bg-[#008080] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <h3 className="text-sm font-extrabold">पंचांग स्थान / शहर चुनें</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 rounded-lg hover:bg-black/20 text-white transition cursor-pointer"
                title="बंद करें"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Search Box & Auto-complete City List */}
            <div className="p-4 space-y-3">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#008080] dark:text-teal-400 absolute left-3 pointer-events-none" />
                <input
                  ref={locInputRef}
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={handleLocationKeyDown}
                  placeholder="शहर या जगह का नाम टाइप करें (जैसे: ऋषिकेश, काशी, दिल्ली)..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm font-bold bg-slate-50 dark:bg-slate-900 border border-[#008080]/35 focus:border-[#008080] text-slate-900 dark:text-white rounded-xl outline-none"
                />
                {locationQuery && (
                  <button
                    type="button"
                    onClick={() => setLocationQuery('')}
                    className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {locationQuery.trim().length > 0 && (
                <div className="max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-[#008080]/15 divide-y divide-[#008080]/10 bg-slate-50/50 dark:bg-slate-900/50">
                  {isSearchingLoc && (
                    <div className="px-3.5 py-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                      स्थान खोजा जा रहा है...
                    </div>
                  )}
                  {!isSearchingLoc && suggestions.length === 0 && (
                    <div className="px-3.5 py-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                      कोई स्थान नहीं मिला
                    </div>
                  )}
                  {suggestions.map((loc, idx) => {
                    const isCurrent = loc.name === selectedCity.name;
                    return (
                      <button
                        key={`${loc.name}_${idx}`}
                        type="button"
                        onClick={() => handleSelectLocation(loc)}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center justify-between gap-2 transition cursor-pointer ${
                          isCurrent
                            ? 'bg-[#008080] text-white'
                            : 'text-slate-800 dark:text-slate-100 hover:bg-teal-50 dark:hover:bg-teal-950/40'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-[#FF7F33]'}`} />
                          <span className="truncate">{loc.name}</span>
                        </span>
                        <span className={`text-[10px] font-mono shrink-0 ${isCurrent ? 'text-teal-100' : 'text-slate-400'}`}>
                          {loc.lat.toFixed(2)}°N, {loc.lng.toFixed(2)}°E
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
