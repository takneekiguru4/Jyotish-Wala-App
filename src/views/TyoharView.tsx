/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  X,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Sparkles,
  Flame,
  Scroll,
  Clock
} from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import {
  HINDI_MONTH_TABS,
  TyoharItem,
  getManagedTyoharListForYear,
  getTyoharDetailedSections
} from '../data/tyoharData';
import { PaginationControls } from '../components/PaginationControls';
import { DatePicker, formatToDdMmYyyy } from '../components/DatePicker';
import { getPanchangForDate } from '../services/panchangEngine';

interface TyoharViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
  initialFestivalId?: string | null;
}

const ITEMS_PER_PAGE = 10;

function formatSlashDateWithVara(isoDate: string, vara: string): string {
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]} - ${vara}`;
  }
  return `${isoDate} - ${vara}`;
}

export const TyoharView: React.FC<TyoharViewProps> = ({
  currentLang,
  onClosePage,
  onGoBack,
  initialFestivalId
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  const todayIso = useMemo(
    () => new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().split('T')[0],
    []
  );

  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [filterByExactDate, setFilterByExactDate] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = All 12 months
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refreshTick, setRefreshTick] = useState<number>(0);
  const [selectedFestival, setSelectedFestival] = useState<TyoharItem | null>(null);

  useEffect(() => {
    const handleSync = () => setRefreshTick((t) => t + 1);
    window.addEventListener('jyotishwala_tyohar_changed', handleSync);
    return () => window.removeEventListener('jyotishwala_tyohar_changed', handleSync);
  }, []);

  const selectedYear = useMemo(() => {
    const yr = Number(selectedDate.split('-')[0]);
    return yr && !Number.isNaN(yr) ? yr : new Date().getFullYear();
  }, [selectedDate]);

  const yearTyoharList = useMemo(
    () => getManagedTyoharListForYear(selectedYear),
    [selectedYear, refreshTick]
  );

  // If navigated with an initialFestivalId, open that festival detail automatically
  useEffect(() => {
    if (!initialFestivalId) return;
    const found = yearTyoharList.find(
      (f) => f.id === initialFestivalId || f.id.startsWith(initialFestivalId)
    );
    if (found) {
      setSelectedFestival(found);
    }
  }, [initialFestivalId, yearTyoharList]);

  const categories = [
    'सभी',
    'प्रमुख महापर्व',
    'एकादशी एवं व्रत',
    'शक्ति एवं शिव पर्व',
    'संक्रांति एवं जयंती'
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedCategory, selectedDate, filterByExactDate]);

  // Compute festival(s) and daily Panchang parva/vrat for the exact chosen date
  const exactDateFestivals = useMemo((): TyoharItem[] => {
    const matched = yearTyoharList.filter((item) => item.date === selectedDate);
    if (matched.length > 0) return matched;

    const panchang = getPanchangForDate(selectedDate);
    const parts = selectedDate.split('-').map(Number);
    const mNum = parts[1] || 1;
    const dNum = parts[2] || 1;
    const mLabel =
      HINDI_MONTH_TABS.find((m) => m.monthNumber === mNum)?.label || '';

    const tithiName = panchang.tithi.name;
    let specialParvaName = `${panchang.samvat.maahPurnimant} ${panchang.tithi.paksha} ${tithiName} पर्व`;
    let category: TyoharItem['category'] = 'प्रमुख महापर्व';
    let shortInfo = `इस तिथि को ${panchang.samvat.maahPurnimant} मास (${panchang.tithi.paksha}) की ${tithiName}, ${panchang.nakshatra.name} नक्षत्र एवं ${panchang.yoga.name} योग का संयोग है। दैनिक पंचदेव उपासना, इष्ट मंत्र जप एवं दान-पुण्य हेतु शुभ दिवस।`;

    if (tithiName.includes('एकादशी')) {
      specialParvaName = `${panchang.samvat.maahPurnimant} ${panchang.tithi.paksha} एकादशी व्रत`;
      category = 'एकादशी एवं व्रत';
      shortInfo = `भगवान श्री हरि विष्णु की कृपा प्राप्ति हेतु पावन एकादशी व्रत। इस दिन अन्न का त्याग कर फलाहार, विष्णु सहस्रनाम पाठ एवं रात्रि जागरण करने से समस्त पापों का नाश होता है।`;
    } else if (tithiName.includes('त्रयोदशी')) {
      specialParvaName = `${panchang.tithi.paksha} प्रदोष व्रत`;
      category = 'शक्ति एवं शिव पर्व';
      shortInfo = `भगवान आशुतोष शिव एवं माता पार्वती की प्रसन्नता हेतु पावन प्रदोष व्रत। सूर्यास्त के पश्चात प्रदोष काल में शिवलिंग अभिषेक एवं महामृत्युंजय मंत्र का जप विशेष फलदायी है।`;
    } else if (tithiName.includes('चतुर्थी')) {
      specialParvaName = panchang.tithi.paksha.includes('कृष्ण')
        ? 'संकष्टी गणेश चतुर्थी व्रत'
        : 'विनायक गणेश चतुर्थी व्रत';
      category = 'एकादशी एवं व्रत';
      shortInfo = `प्रथम पूज्य भगवान श्री गणेश जी की आराधना एवं विघ्न निवारण हेतु पावन चतुर्थी व्रत। गणेश अथर्वशीर्ष का पाठ एवं दूर्वा अर्पण करने से समस्त संकट दूर होते हैं।`;
    } else if (tithiName.includes('पूर्णिमा')) {
      specialParvaName = `${panchang.samvat.maahPurnimant} पूर्णिमा व्रत एवं सत्यनारायण पूजा`;
      category = 'प्रमुख महापर्व';
      shortInfo = `पवित्र नदी स्नान, दान-पुण्य, भगवान श्री सत्यनारायण कथा श्रवण एवं चंद्र अर्घ्य का महापर्व।`;
    } else if (tithiName.includes('अमावस्या')) {
      specialParvaName = `${panchang.samvat.maahPurnimant} दर्श अमावस्या (स्नान-दान व पितृ तर्पण)`;
      category = 'संक्रांति एवं जयंती';
      shortInfo = `पितरों के निमित्त तर्पण, पिंडदान, पीपल वृक्ष पूजन एवं पवित्र तीर्थ स्नान-दान की पुण्य तिथि।`;
    } else if (tithiName.includes('अष्टमी')) {
      specialParvaName = `${panchang.tithi.paksha} दुर्गाष्टमी / कालाष्टमी पर्व`;
      category = 'शक्ति एवं शिव पर्व';
      shortInfo = `मां भगवती जगदंबा एवं भगवान कालभैरव की विशेष उपासना व कवच पाठ की पावन तिथि।`;
    }

    return [
      {
        id: `daily_parva_${selectedDate}`,
        name: specialParvaName,
        date: selectedDate,
        displayDate: `${dNum} ${mLabel} ${selectedYear}`,
        monthNumber: mNum,
        monthName: mLabel,
        hindiMaas: `${panchang.samvat.maahPurnimant} ${panchang.tithi.paksha}`,
        pakshaTithi: `${tithiName} (${panchang.tithi.endTime} तक)`,
        vara: panchang.vara.name,
        category,
        shortInfo
      }
    ];
  }, [selectedDate, selectedYear, yearTyoharList]);

  const filteredFestivals = useMemo(() => {
    if (filterByExactDate) {
      return exactDateFestivals;
    }

    return yearTyoharList.filter((item) => {
      const matchesMonth =
        selectedMonth === 0 || item.monthNumber === selectedMonth;

      const matchesCategory =
        selectedCategory === 'सभी' || item.category === selectedCategory;

      return matchesMonth && matchesCategory;
    });
  }, [filterByExactDate, exactDateFestivals, yearTyoharList, selectedMonth, selectedCategory]);

  // Total festival count per month in the filtered set
  const monthTotalCountMap = useMemo(() => {
    const counts = new Map<number, number>();
    filteredFestivals.forEach((f) => {
      counts.set(f.monthNumber, (counts.get(f.monthNumber) || 0) + 1);
    });
    return counts;
  }, [filteredFestivals]);

  // Paginated festivals (10 per page)
  const paginatedFestivals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFestivals.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFestivals, currentPage]);

  // Group current page's festivals by month
  const groupedByMonth = useMemo(() => {
    const map = new Map<number, TyoharItem[]>();
    paginatedFestivals.forEach((f) => {
      const existing = map.get(f.monthNumber) || [];
      existing.push(f);
      map.set(f.monthNumber, existing);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [paginatedFestivals]);

  const handleDatePickerChange = (iso: string) => {
    if (!iso) return;
    setSelectedDate(iso);
    setFilterByExactDate(true);
    const mNum = Number(iso.split('-')[1]);
    if (mNum >= 1 && mNum <= 12) {
      setSelectedMonth(mNum);
    }
  };

  // --- DEDICATED FESTIVAL DETAIL PAGE VIEW ---
  if (selectedFestival) {
    const festPanchang = getPanchangForDate(selectedFestival.date);
    const details = getTyoharDetailedSections(selectedFestival);
    const festYear = selectedFestival.date.split('-')[0] || String(selectedYear);
    const pakshaOnly = selectedFestival.hindiMaas.includes('शुक्ल')
      ? 'शुक्ल पक्ष'
      : selectedFestival.hindiMaas.includes('कृष्ण')
      ? 'कृष्ण पक्ष'
      : festPanchang.tithi.paksha;

    return (
      <div className="pb-6 space-y-4">
        {/* Top Header & Complete Panchang Metadata Card */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
          {/* Row 1: Back and Close Buttons at Very Start of Card */}
          <div className="flex items-center justify-between gap-3 border-b border-[#008080]/15 pb-3">
            <button
              type="button"
              onClick={() => {
                setSelectedFestival(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="वापस त्योहार सूची पर जाएं"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>वापस</span>
            </button>

            <button
              type="button"
              onClick={onClosePage}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              title="पेज बंद करें"
            >
              <X className="w-4 h-4" />
              <span>{dict.closePage || 'बंद करें'}</span>
            </button>
          </div>

          {/* Row 2: Festival Title & Category Badge */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#008080] text-white text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>{selectedFestival.category}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FF7F33] text-white text-xs font-extrabold">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>{formatSlashDateWithVara(selectedFestival.date, selectedFestival.vara)}</span>
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug pt-1">
              {selectedFestival.name}
            </h1>
          </div>

          {/* Row 3: Complete Festival Date, Month, Paksha, Tithi & Panchang Grid at Top */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF7F2] dark:bg-slate-900/90 border border-[#008080]/20">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#008080] dark:text-teal-300 mb-3 pb-2 border-b border-[#008080]/15 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FF7F33]" />
              <span>पर्व का संपूर्ण पंचांग एवं तिथि विवरण</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs">
              <div className="border-b border-[#008080]/10 pb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  अंग्रेजी तारीख एवं वार
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                  {formatToDdMmYyyy(selectedFestival.date)} ({selectedFestival.vara})
                </span>
              </div>

              <div className="border-b border-[#008080]/10 pb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  महीना एवं वर्ष
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                  {selectedFestival.monthName} {festYear}
                </span>
              </div>

              <div className="border-b border-[#008080]/10 pb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  हिंदू वैदिक मास
                </span>
                <span className="font-extrabold text-[#008080] dark:text-teal-300 block mt-0.5">
                  {selectedFestival.hindiMaas}
                </span>
              </div>

              <div className="border-b border-[#008080]/10 pb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  पक्ष
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                  {pakshaOnly}
                </span>
              </div>

              <div className="border-b border-[#008080]/10 pb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  पर्व की मुख्य तिथि
                </span>
                <span className="font-extrabold text-[#FF7F33] block mt-0.5">
                  {selectedFestival.pakshaTithi}
                </span>
              </div>

              <div className="border-b border-[#008080]/10 pb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  नक्षत्र एवं योग (पंचांग से)
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                  {festPanchang.nakshatra.name} • {festPanchang.yoga.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Section 1: Short Overview & Significance (क्यों मनाया जाता है और महत्व) */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-[#008080] dark:text-teal-300 flex items-center gap-2 pb-2.5 border-b border-[#008080]/15">
            <BookOpen className="w-4 h-4 text-[#FF7F33] shrink-0" />
            <span>पर्व का धार्मिक महत्व एवं यह क्यों मनाया जाता है?</span>
          </h2>

          <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-[#008080]/20 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
            {selectedFestival.shortInfo}
          </div>

          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
            {details.detailedSignificance}
          </div>

          {details.historyAndPauranik && (
            <div className="pt-2 border-t border-[#008080]/15 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#008080] dark:text-teal-300">
                पौराणिक इतिहास एवं शास्त्र प्रमाण
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {details.historyAndPauranik}
              </p>
            </div>
          )}
        </div>

        {/* Detailed Section 2: Puja Vidhi & Vrat Niyam */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-[#008080] dark:text-teal-300 flex items-center gap-2 pb-2.5 border-b border-[#008080]/15">
            <Flame className="w-4 h-4 text-[#FF7F33] shrink-0" />
            <span>पूजा विधि, शुभ मुहूर्त एवं व्रत के नियम</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-[#FF7F33]/25 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="inline-flex items-center gap-1.5 text-[#008080] dark:text-teal-300">
              <Clock className="w-3.5 h-3.5 text-[#FF7F33]" />
              <span>सूर्योदय: {festPanchang.sunMoon.sunrise}</span>
            </span>
            <span>•</span>
            <span>
              अभिजीत मुहूर्त: {festPanchang.shubhMuhurat.abhijit.start} से{' '}
              {festPanchang.shubhMuhurat.abhijit.end}
            </span>
            <span>•</span>
            <span>
              ब्रह्म मुहूर्त: {festPanchang.shubhMuhurat.brahma.start} से{' '}
              {festPanchang.shubhMuhurat.brahma.end}
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {details.pujaVidhi}
          </div>

          {details.vratAndRules && (
            <div className="pt-2 border-t border-[#008080]/15 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#008080] dark:text-teal-300">
                व्रत के नियम एवं संयम
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {details.vratAndRules}
              </p>
            </div>
          )}

          {details.sankalp && (
            <div className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#FF7F33]/30 space-y-1">
              <h3 className="text-xs font-extrabold text-[#FF7F33]">पर्व विशेष संकल्प मंत्र</h3>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                {details.sankalp}
              </p>
            </div>
          )}
        </div>

        {/* Detailed Section 3: Special Mantra, Do & Don'ts, Daan & Upay */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-[#008080] dark:text-teal-300 flex items-center gap-2 pb-2.5 border-b border-[#008080]/15">
            <Scroll className="w-4 h-4 text-[#FF7F33] shrink-0" />
            <span>विशेष उपासना मंत्र, कथा सार एवं फलश्रुति</span>
          </h2>

          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {details.kathaOrMantra}
          </div>

          {details.doAndDonts && (
            <div className="pt-2 border-t border-[#008080]/15 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#008080] dark:text-teal-300">
                क्या करें और क्या न करें (Do&apos;s &amp; Don&apos;ts)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {details.doAndDonts}
              </p>
            </div>
          )}

          {details.daanAndUpay && (
            <div className="pt-2 border-t border-[#008080]/15 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#FF7F33]">
                विशेष दान एवं ज्योतिषीय उपाय
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {details.daanAndUpay}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6 space-y-4">
      {/* Top Controls Card: Back & Close Buttons on Top, Heading, DatePicker, and Filters */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3.5">
        {/* Row 1: Back & Close Buttons at the very start of the card */}
        <div className="flex items-center justify-between gap-3 border-b border-[#008080]/15 pb-2.5">
          <button
            type="button"
            onClick={onGoBack || onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="पिछले पृष्ठ पर जाएं"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस</span>
          </button>

          <button
            type="button"
            onClick={onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            title="बंद करें"
          >
            <X className="w-3.5 h-3.5" />
            <span>{dict.closePage || 'बंद करें'}</span>
          </button>
        </div>

        {/* Row 2: Heading */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
              प्रमुख त्योहार ({selectedYear})
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              तारीख, महीना और साल चुनकर किसी भी तिथि या वर्ष के त्योहार विस्तार से पढ़ें
            </p>
          </div>
          {filterByExactDate && (
            <button
              type="button"
              onClick={() => {
                setFilterByExactDate(false);
                setSelectedMonth(0);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-2xs"
              title="संपूर्ण वर्ष के त्योहार देखें"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white" />
              <span>संपूर्ण {selectedYear} के त्योहार</span>
            </button>
          )}
        </div>

        {/* Date Picker Input (Replacing Search Input) */}
        <div>
          <DatePicker
            value={selectedDate}
            onChange={handleDatePickerChange}
          />
        </div>

        {/* Two Dropdowns in One Line Below DatePicker: 1. Festival Category, 2. Month Name */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* 1st Dropdown: Festival Category */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setFilterByExactDate(false);
              setSelectedCategory(e.target.value);
            }}
            aria-label="त्योहारों की श्रेणी"
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/25 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#008080] cursor-pointer truncate"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'सभी' ? 'त्योहारों की श्रेणी' : cat}
              </option>
            ))}
          </select>

          {/* 2nd Dropdown: Month Name */}
          <select
            value={selectedMonth}
            onChange={(e) => {
              setFilterByExactDate(false);
              setSelectedMonth(Number(e.target.value));
            }}
            aria-label="महीनों के नाम"
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/25 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-[#008080] cursor-pointer truncate"
          >
            {HINDI_MONTH_TABS.map((m) => (
              <option key={m.monthNumber} value={m.monthNumber}>
                {m.monthNumber === 0 ? 'महीनों के नाम' : `${m.label} ${selectedYear}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Festivals List Grouped by Month (Standalone Single Cards with Bottom-Right Arrow Button) */}
      {filteredFestivals.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 text-center space-y-2 shadow-xs">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            चयनित फ़िल्टर के अनुसार कोई त्योहार नहीं मिला।
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterByExactDate(false);
              setSelectedMonth(0);
              setSelectedCategory('सभी');
            }}
            className="px-4 py-1.5 rounded-xl bg-[#008080] text-white text-xs font-bold cursor-pointer"
          >
            सभी त्योहार देखें
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {groupedByMonth.map(([mNum, monthItems]) => {
            const monthMeta = HINDI_MONTH_TABS.find((t) => t.monthNumber === mNum);
            const totalInMonth = monthTotalCountMap.get(mNum) || monthItems.length;
            return (
              <div key={mNum} className="space-y-3">
                {/* Teal Month Banner */}
                <div className="px-4 py-2.5 rounded-xl bg-[#008080] text-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-white shrink-0" />
                    <h2 className="text-sm font-extrabold">
                      {filterByExactDate
                        ? `चयनित तिथि (${formatToDdMmYyyy(selectedDate)}) के त्योहार एवं पर्व`
                        : `${monthMeta?.label} ${selectedYear}`}
                    </h2>
                  </div>
                  <span className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-[#FF7F33] text-white text-xs font-extrabold shrink-0 shadow-2xs">
                    {totalInMonth} पर्व
                  </span>
                </div>

                {/* Standalone Single Festival Cards Grid with Bottom-Right Arrow Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
                  {monthItems.map((fest) => {
                    const isHighlight =
                      fest.category === 'प्रमुख महापर्व' || fest.category === 'एकादशी एवं व्रत';
                    const dayNum = fest.date.split('-')[2] || '01';
                    return (
                      <div
                        key={fest.id}
                        onClick={() => {
                          setSelectedFestival(fest);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-4 rounded-2xl bg-white dark:bg-[#112226] border border-[#008080]/20 hover:border-[#008080] shadow-xs transition cursor-pointer flex flex-col justify-between gap-3 h-full group"
                      >
                        <div className="space-y-2.5">
                          {/* Top Header Row: Left Date Circle + Full Date/Vara & Right Category Tag */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#008080]/15">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${
                                  isHighlight ? 'bg-[#FF7F33]' : 'bg-[#008080]'
                                }`}
                              >
                                {dayNum}
                              </span>
                              <div className="min-w-0">
                                <span className="block text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                  {formatSlashDateWithVara(fest.date, fest.vara)}
                                </span>
                                <span className="block text-[11px] font-bold text-[#008080] dark:text-teal-300 truncate">
                                  {fest.hindiMaas} • {fest.pakshaTithi}
                                </span>
                              </div>
                            </div>

                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold shrink-0 ${
                                isHighlight
                                  ? 'bg-[#FF7F33]/15 text-[#FF7F33]'
                                  : 'bg-[#008080]/10 text-[#008080] dark:text-teal-300'
                              }`}
                            >
                              {fest.category}
                            </span>
                          </div>

                          {/* Festival / Vrat Title */}
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#008080] dark:group-hover:text-teal-300 transition">
                            {fest.name}
                          </h3>
                        </div>

                        {/* Bottom Description Row + Right-Bottom Arrow Button */}
                        <div className="flex items-end justify-between gap-3 pt-2 border-t border-dashed border-[#008080]/15">
                          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-1 min-w-0">
                            <BookOpen className="w-3.5 h-3.5 text-[#FF7F33] shrink-0 mt-0.5" />
                            <p className="line-clamp-2">{fest.shortInfo}</p>
                          </div>

                          {/* Right-Bottom Arrow Button to Open Full Festival Detail Page */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFestival(fest);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            title="विस्तार से पढ़ें"
                            aria-label={`${fest.name} के बारे में विस्तार से पढ़ें`}
                            className="w-8 h-8 rounded-xl bg-[#008080] group-hover:bg-[#FF7F33] text-white flex items-center justify-center shrink-0 transition shadow-2xs cursor-pointer"
                          >
                            <ArrowRight className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredFestivals.length > ITEMS_PER_PAGE && (
            <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 border border-[#008080]/20 shadow-xs">
              <PaginationControls
                currentPage={currentPage}
                totalItems={filteredFestivals.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                itemLabel="पर्व/त्योहार"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TyoharView;
