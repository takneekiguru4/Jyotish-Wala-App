/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Moon,
  Search,
  Sparkles,
  Sun,
  ArrowLeft,
  X
} from 'lucide-react';
import { LanguageCode, PanchangData } from '../types';
import {
  CityLocation,
  fetchPanchangViaApi,
  getPanchangForDate,
  searchLocationsViaApi
} from '../services/panchangEngine';
import { DICTIONARY } from '../i18n/translations';
import { DatePicker, formatToDdMmYyyy } from '../components/DatePicker';
import { getWpAppSettings, WpPanchangCalcSettings } from '../services/wpApiClient';

interface PanchangViewProps {
  initialPanchang: PanchangData;
  selectedCity: CityLocation;
  onCityChange: (city: CityLocation) => void;
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const PanchangView: React.FC<PanchangViewProps> = ({
  initialPanchang,
  selectedCity,
  onCityChange,
  currentLang,
  onClosePage,
  onGoBack
}) => {
  const t = DICTIONARY[currentLang] || DICTIONARY.hi;

  const [selectedDate, setSelectedDate] = useState<string>(initialPanchang.date);
  const [activeTab, setActiveTab] = useState<'panchang' | 'choghadiya' | 'muhurat'>('panchang');
  const [panchangSettings, setPanchangSettings] = useState<WpPanchangCalcSettings>(() => {
    return getWpAppSettings().panchangSettings || {};
  });

  useEffect(() => {
    const updateSettings = () => {
      setPanchangSettings(getWpAppSettings().panchangSettings || {});
    };
    window.addEventListener('jyotishwala_app_settings_changed', updateSettings);
    return () => window.removeEventListener('jyotishwala_app_settings_changed', updateSettings);
  }, []);

  useEffect(() => {
    if (panchangSettings.show_chaughadiya === false && activeTab === 'choghadiya') {
      setActiveTab('panchang');
    }
  }, [panchangSettings.show_chaughadiya, activeTab]);

  const [panchang, setPanchang] = useState<PanchangData>(() =>
    getPanchangForDate(initialPanchang.date, selectedCity)
  );

  // Location Popup Modal State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityLocation[]>([]);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const locInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    let mounted = true;
    const base = getPanchangForDate(selectedDate, selectedCity);
    setPanchang(base);
    fetchPanchangViaApi(selectedDate, selectedCity).then((apiData) => {
      if (mounted) setPanchang(apiData);
    });
    return () => {
      mounted = false;
    };
  }, [selectedDate, selectedCity]);

  const handlePrevDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() - 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().split('T')[0]);
  };

  // Ordered Card 1 items filtered by WordPress Admin toggles
  const card1OrderedItems = [
    ...(panchangSettings.show_tithi !== false
      ? [
          {
            label: 'तिथि',
            value: `${panchang.tithi.name} (${panchang.tithi.endTime} तक)`,
            sub: panchang.tithi.nextTithi
              ? `इसके बाद: ${panchang.tithi.nextTithi} (${panchang.tithi.endTime} से ${panchang.tithi.nextEndTime || ''} तक)`
              : undefined
          },
          { label: 'पक्ष', value: panchang.tithi.paksha }
        ]
      : []),
    ...(panchangSettings.show_nakshatra !== false
      ? [
          {
            label: 'नक्षत्र',
            value: `${panchang.nakshatra.name} (${panchang.nakshatra.endTime} तक)`,
            sub: panchang.nakshatra.nextNakshatra
              ? `इसके बाद: ${panchang.nakshatra.nextNakshatra} (${panchang.nakshatra.endTime} से ${panchang.nakshatra.nextEndTime || ''} तक)`
              : undefined
          }
        ]
      : []),
    ...(panchangSettings.show_yoga !== false
      ? [
          {
            label: 'योग',
            value: `${panchang.yoga.name} (${panchang.yoga.endTime} तक)`,
            sub: panchang.yoga.nextYoga
              ? `इसके बाद: ${panchang.yoga.nextYoga} (${panchang.yoga.endTime} से ${panchang.yoga.nextEndTime || ''} तक)`
              : undefined
          }
        ]
      : []),
    ...(panchangSettings.show_karana !== false
      ? [
          {
            label: 'करण',
            value: `${panchang.karana.name} (${panchang.karana.endTime} तक)`,
            sub: panchang.karana.nextKarana
              ? `इसके बाद: ${panchang.karana.nextKarana} (${panchang.karana.endTime} से ${panchang.karana.nextEndTime || ''} तक)`
              : undefined
          }
        ]
      : []),
    {
      label: 'माह अमावस्यांत',
      value: panchang.samvat.maahAmavasyant,
      sub: 'अमावस्या के साथ अंत होने वाला माह'
    },
    {
      label: 'माह पूर्णिमांत',
      value: panchang.samvat.maahPurnimant,
      sub: 'पूर्णिमा के साथ अंत होने वाला माह'
    },
    { label: 'चंद्र राशि', value: panchang.sunMoon.moonSign },
    { label: 'सूर्य राशि', value: panchang.sunMoon.sunSign },
    { label: 'ऋतु', value: panchang.samvat.ritu },
    { label: 'अयन', value: panchang.samvat.ayanam },
    { label: 'संवत्सर', value: panchang.samvat.samvatsarName },
    { label: 'विक्रम संवत', value: String(panchang.samvat.vikram) },
    { label: 'सौर प्रविष्टे', value: panchang.samvat.saurPravishte }
  ];

  // Ordered Card 2 items filtered by WordPress Admin toggles
  const card2OrderedItems = [
    ...(panchangSettings.show_sunrise_sunset !== false
      ? [
          { label: 'सूर्योदय', value: panchang.sunMoon.sunrise },
          { label: 'सूर्यास्त', value: panchang.sunMoon.sunset }
        ]
      : []),
    { label: 'चंद्रोदय', value: panchang.sunMoon.moonrise },
    { label: 'चंद्रास्त', value: panchang.sunMoon.moonset },
    { label: 'लग्न', value: panchang.sunMoon.lagna },
    { label: 'सूर्य नक्षत्र', value: panchang.sunMoon.suryaNakshatra },
    { label: 'चंद्र नक्षत्र', value: panchang.sunMoon.chandraNakshatra }
  ];

  const renderPanchangCategoryTabs = () => {
    const showChoghadiya = panchangSettings.show_chaughadiya !== false;
    return (
      <div className={`grid ${showChoghadiya ? 'grid-cols-3' : 'grid-cols-2'} gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl text-xs font-bold`}>
        <button
          type="button"
          onClick={() => setActiveTab('panchang')}
          className={`py-2 px-2 rounded-lg text-center transition truncate cursor-pointer ${
            activeTab === 'panchang'
              ? 'bg-[#008080] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
          }`}
        >
          1. {t.panchang}
        </button>
        {showChoghadiya && (
          <button
            type="button"
            onClick={() => setActiveTab('choghadiya')}
            className={`py-2 px-2 rounded-lg text-center transition truncate cursor-pointer ${
              activeTab === 'choghadiya'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
            }`}
          >
            2. {t.choghadiya}
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('muhurat')}
          className={`py-2 px-2 rounded-lg text-center transition truncate cursor-pointer ${
            activeTab === 'muhurat'
              ? 'bg-[#008080] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-[#008080]'
          }`}
        >
          {showChoghadiya ? '3. ' : '2. '}{t.shubhMuhurat}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Controls Card: Header, Location Search, Date Picker & Tabs */}
      <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/20 shadow-xs space-y-4">
        {/* Row 1: Back and Close Buttons at Very Start of Card */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#008080]/15">
          <button
            type="button"
            onClick={onGoBack || onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            title="पिछले पृष्ठ पर वापस जाएं"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वापस</span>
          </button>

          <button
            type="button"
            onClick={onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            title="पेज बंद करें"
          >
            <X className="w-4 h-4" />
            <span>{t.closePage}</span>
          </button>
        </div>

        {/* Row 2: Title and Subtitle Below Navigation Buttons */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {t.panchang} • {selectedCity.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              अक्षांश {selectedCity.lat.toFixed(2)}°N, देशांतर {selectedCity.lng.toFixed(2)}°E • {formatToDdMmYyyy(panchang.date)}
            </p>
          </div>
        </div>

        {/* Step 2: Full-Width Date Controls Row (Prev + DatePicker + Location Icon + Today + Next) Matching the 3-Tab Width Below */}
        <div className="w-full">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
            {t.selectDate}
          </label>
          <div className="w-full flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 hover:bg-teal-50 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer flex items-center justify-center"
              title={t.prevDay}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 min-w-0">
              <DatePicker
                value={selectedDate}
                onChange={(val) => val && setSelectedDate(val)}
              />
            </div>

            {/* Strictly Icon-Only Location Button right next to DatePicker */}
            <button
              type="button"
              onClick={handleOpenLocationModal}
              className="p-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs"
              title="स्थान चुनें / बदलें"
              aria-label="स्थान चुनें"
            >
              <MapPin className="w-4 h-4 text-white shrink-0" />
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="text-xs font-bold px-3.5 sm:px-5 py-2.5 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white transition shrink-0 cursor-pointer"
            >
              {t.today}
            </button>

            <button
              type="button"
              onClick={handleNextDay}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 hover:bg-teal-50 text-slate-700 dark:text-slate-200 transition shrink-0 cursor-pointer flex items-center justify-center"
              title={t.nextDay}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Teal Summary Banner (Always visible above Panchang Vivaran Card) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#008080] text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-lg sm:text-xl font-extrabold">
            {panchang.tithi.name} ({panchang.vara.name})
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-[#FF7F33] text-white shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-white" />
            {formatToDdMmYyyy(panchang.date)}
          </span>
        </div>

        <p className="text-xs text-teal-100 mt-1">
          नक्षत्र: {panchang.nakshatra.name} • योग: {panchang.yoga.name} • करण: {panchang.karana.name} • विक्रम संवत {panchang.samvat.vikram}
        </p>
      </div>

      {/* MainTab 1: Sampoorn Panchang Details (With the 3 Tabs at the Very Top of the Panchang Vivaran Card) */}
      {activeTab === 'panchang' && (
        <div className="space-y-4">
          {/* CARD 1: पंचांग विवरण (With the 3 Category Tabs at the Very Top of this Card) */}
          <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/20 shadow-xs space-y-4">
            {/* Category Tabs Placed at the Very Top of the Panchang Vivaran Card */}
            {renderPanchangCategoryTabs()}

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-teal-300 flex items-center gap-1.5 border-b border-[#008080]/15 pb-2.5">
              <Compass className="w-4 h-4 text-[#FF7F33]" />
              <span>पंचांग विवरण (तिथि से सौर प्रविष्टे तक क्रमवार)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3 text-xs">
              {card1OrderedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-[#008080]/15 pb-2"
                >
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    {idx + 1}. {item.label}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#008080] dark:text-teal-200 block mt-0.5">
                    {item.value}
                  </span>
                  {item.sub && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {item.sub}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: सूर्योदय, सूर्यास्त, चंद्रोदय, चंद्रास्त, लग्न, सूर्य नक्षत्र, चंद्र नक्षत्र (Single Card, Flat Rows) */}
          <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/20 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-teal-300 flex items-center gap-1.5 border-b border-[#008080]/15 pb-2.5">
              <Sun className="w-4 h-4 text-[#FF7F33]" />
              <span>सूर्योदय, चंद्रोदय, लग्न एवं नक्षत्र विवरण</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3 text-xs">
              {card2OrderedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-[#008080]/15 pb-2"
                >
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                    {idx + 1}. {item.label}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 block mt-0.5">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Choghadiya Table (With the 3 Tabs at the Very Top of the First Card) */}
      {activeTab === 'choghadiya' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/20 shadow-xs space-y-4">
            {/* Category Tabs Placed at the Very Top of the Card */}
            {renderPanchangCategoryTabs()}

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-teal-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#FF7F33]" />
              {t.dayChoghadiya}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#008080]/20 text-slate-500 dark:text-slate-400 text-[11px]">
                    <th className="py-2 px-2 font-bold">{t.choghadiya}</th>
                    <th className="py-2 px-2 font-bold">प्रभाव</th>
                    <th className="py-2 px-2 font-bold">समय</th>
                    <th className="py-2 px-2 font-bold">स्वामी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#008080]/10">
                  {panchang.choghadiyaDay.map((slot, i) => (
                    <tr key={i}>
                      <td className="py-2 px-2 font-bold text-slate-800 dark:text-slate-100">
                        {slot.hindiName}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            slot.type === 'amrit' || slot.type === 'shubh' || slot.type === 'labh'
                              ? 'bg-[#008080]/15 text-[#008080] dark:text-teal-300'
                              : slot.type === 'char'
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : 'bg-red-500/15 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {slot.nature}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">
                        {slot.startTime} - {slot.endTime}
                      </td>
                      <td className="py-2 px-2 text-slate-500">{slot.ruler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/20 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-teal-300 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-[#008080]" />
              {t.nightChoghadiya}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#008080]/20 text-slate-500 dark:text-slate-400 text-[11px]">
                    <th className="py-2 px-2 font-bold">{t.choghadiya}</th>
                    <th className="py-2 px-2 font-bold">प्रभाव</th>
                    <th className="py-2 px-2 font-bold">समय</th>
                    <th className="py-2 px-2 font-bold">स्वामी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#008080]/10">
                  {panchang.choghadiyaNight.map((slot, i) => (
                    <tr key={i}>
                      <td className="py-2 px-2 font-bold text-slate-800 dark:text-slate-100">
                        {slot.hindiName}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            slot.type === 'amrit' || slot.type === 'shubh' || slot.type === 'labh'
                              ? 'bg-[#008080]/15 text-[#008080] dark:text-teal-300'
                              : slot.type === 'char'
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : 'bg-red-500/15 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {slot.nature}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-semibold text-slate-600 dark:text-slate-300">
                        {slot.startTime} - {slot.endTime}
                      </td>
                      <td className="py-2 px-2 text-slate-500">{slot.ruler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Shubh & Ashubh Muhurat (With the 3 Tabs at the Very Top of the First Card) */}
      {activeTab === 'muhurat' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-[#008080]/25 shadow-xs space-y-4">
            {/* Category Tabs Placed at the Very Top of the Card */}
            {renderPanchangCategoryTabs()}

            <h3 className="text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-teal-400 flex items-center gap-1.5 border-b border-[#008080]/15 pb-2.5">
              <Sparkles className="w-4 h-4 text-[#008080]" />
              {t.shubhMuhurat}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {panchangSettings.show_abhijit_muhurta !== false && (
                <div className="border-b border-[#008080]/15 pb-2.5 space-y-0.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    {t.abhijitMuhurat}
                  </span>
                  <span className="text-sm font-extrabold text-[#008080] dark:text-teal-300 block">
                    {panchang.shubhMuhurat.abhijit.start} - {panchang.shubhMuhurat.abhijit.end}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    सभी प्रकार के नए कार्य, यात्रा व व्यापार आरंभ हेतु सर्वश्रेष्ठ।
                  </p>
                </div>
              )}

              <div className="border-b border-[#008080]/15 pb-2.5 space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  {t.brahmaMuhurat}
                </span>
                <span className="text-sm font-extrabold text-[#008080] dark:text-teal-300 block">
                  {panchang.shubhMuhurat.brahma.start} - {panchang.shubhMuhurat.brahma.end}
                </span>
                <p className="text-[11px] text-slate-500">
                  ईश्वर आराधना, योग, ध्यान व अध्ययन के लिए सर्वोत्तम काल।
                </p>
              </div>

              <div className="border-b border-[#008080]/15 pb-2.5 space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  {t.godhuliMuhurat}
                </span>
                <span className="text-sm font-extrabold text-[#008080] dark:text-teal-300 block">
                  {panchang.shubhMuhurat.godhuli.start} - {panchang.shubhMuhurat.godhuli.end}
                </span>
                <p className="text-[11px] text-slate-500">
                  संध्या वंदन, दीपदान व शांति अनुष्ठान हेतु उपयुक्त।
                </p>
              </div>

              <div className="border-b border-[#008080]/15 pb-2.5 space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  {t.amritKaal}
                </span>
                <span className="text-sm font-extrabold text-[#008080] dark:text-teal-300 block">
                  {panchang.shubhMuhurat.amritKaal.start} - {panchang.shubhMuhurat.amritKaal.end}
                </span>
                <p className="text-[11px] text-slate-500">
                  मांगलिक कार्य एवं गृह प्रवेश हेतु उत्तम।
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#112226] p-4 sm:p-5 rounded-2xl border border-red-500/25 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5 border-b border-red-500/15 pb-2.5">
              <Clock className="w-4 h-4 text-red-500" />
              {t.ashubhMuhurat}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {panchangSettings.show_rahu_kaal !== false && (
                <div className="border-b border-red-500/15 pb-2.5 space-y-0.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    {t.rahuKaal}
                  </span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400 block">
                    {panchang.ashubhMuhurat.rahuKaal.start} - {panchang.ashubhMuhurat.rahuKaal.end}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    इस समय नया कार्य या क्रय-विक्रय न करें।
                  </p>
                </div>
              )}

              {panchangSettings.show_yamaganda !== false && (
                <div className="border-b border-red-500/15 pb-2.5 space-y-0.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    {t.yamaganda}
                  </span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400 block">
                    {panchang.ashubhMuhurat.yamaganda.start} - {panchang.ashubhMuhurat.yamaganda.end}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    शुभ कार्य वर्जित।
                  </p>
                </div>
              )}

              {panchangSettings.show_gulika !== false && (
                <div className="border-b border-red-500/15 pb-2.5 space-y-0.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">
                    {t.gulikaKaal}
                  </span>
                  <span className="text-sm font-extrabold text-red-600 dark:text-red-400 block">
                    {panchang.ashubhMuhurat.gulikaKaal.start} - {panchang.ashubhMuhurat.gulikaKaal.end}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    नए अनुबंध टालें।
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
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
