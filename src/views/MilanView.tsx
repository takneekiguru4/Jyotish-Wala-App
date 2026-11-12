import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  X,
  Calendar,
  Clock,
  MapPin,
  Search,
  ArrowLeft
} from 'lucide-react';
import { GunaMilanResult, KundliChartData, LanguageCode } from '../types';
import {
  NAKSHATRAS,
  RASHI_NAMES,
  calculateGunaMilan,
  generateKundli,
  isChartManglik
} from '../services/astrologyEngine';
import { CITIES, CityLocation, searchLocationsViaApi } from '../services/panchangEngine';
import { DICTIONARY } from '../i18n/translations';
import { DatePicker } from '../components/DatePicker';
import { getWpAppSettings, WpKundliCalcSettings } from '../services/wpApiClient';

interface MilanViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const MilanView: React.FC<MilanViewProps> = ({ currentLang, onClosePage, onGoBack }) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  const [kundliSettings, setKundliSettings] = useState<WpKundliCalcSettings>(() => {
    return getWpAppSettings().kundliSettings || {};
  });

  useEffect(() => {
    const updateSettings = () => {
      setKundliSettings(getWpAppSettings().kundliSettings || {});
    };
    window.addEventListener('jyotishwala_app_settings_changed', updateSettings);
    return () => window.removeEventListener('jyotishwala_app_settings_changed', updateSettings);
  }, []);

  const [inputMode, setInputMode] = useState<'birthDetails' | 'nakshatra'>('birthDetails');

  // ============================================================================
  // MODE 1 STATE: जन्म तिथि व समय द्वारा (Completely Separate from Nakshatra Mode)
  // ============================================================================
  const [bdBoyName, setBdBoyName] = useState('');
  const [bdBoyDate, setBdBoyDate] = useState('1994-11-12');
  const [bdBoyTime, setBdBoyTime] = useState('09:15');
  const [bdBoyCity, setBdBoyCity] = useState<CityLocation>(CITIES[0]);
  const [bdBoyLocQuery, setBdBoyLocQuery] = useState(CITIES[0].name);
  const [bdBoySuggestions, setBdBoySuggestions] = useState<CityLocation[]>([]);
  const [isBoySugOpen, setIsBoySugOpen] = useState(false);
  const [isSearchingBoyLoc, setIsSearchingBoyLoc] = useState(false);
  const boyLocRef = useRef<HTMLDivElement>(null);

  const [bdGirlName, setBdGirlName] = useState('');
  const [bdGirlDate, setBdGirlDate] = useState('1996-05-22');
  const [bdGirlTime, setBdGirlTime] = useState('14:40');
  const [bdGirlCity, setBdGirlCity] = useState<CityLocation>(CITIES[0]);
  const [bdGirlLocQuery, setBdGirlLocQuery] = useState(CITIES[0].name);
  const [bdGirlSuggestions, setBdGirlSuggestions] = useState<CityLocation[]>([]);
  const [isGirlSugOpen, setIsGirlSugOpen] = useState(false);
  const [isSearchingGirlLoc, setIsSearchingGirlLoc] = useState(false);
  const girlLocRef = useRef<HTMLDivElement>(null);

  const [bdBoyChart, setBdBoyChart] = useState<KundliChartData>(() =>
    generateKundli('वर', '1994-11-12', '09:15', CITIES[0].name, CITIES[0].lat, CITIES[0].lng, 'male')
  );
  const [bdGirlChart, setBdGirlChart] = useState<KundliChartData>(() =>
    generateKundli('कन्या', '1996-05-22', '14:40', CITIES[0].name, CITIES[0].lat, CITIES[0].lng, 'female')
  );

  const [bdResult, setBdResult] = useState<GunaMilanResult>(() => {
    const bNakIdx = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === bdBoyChart.avakahada.nakshatra));
    const gNakIdx = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === bdGirlChart.avakahada.nakshatra));
    const bPada = bdBoyChart.avakahada.nakshatraPada || 1;
    const gPada = bdGirlChart.avakahada.nakshatraPada || 1;
    return calculateGunaMilan(
      bNakIdx,
      gNakIdx,
      isChartManglik(bdBoyChart),
      isChartManglik(bdGirlChart),
      bPada,
      gPada,
      bdBoyChart,
      bdGirlChart
    );
  });

  // ============================================================================
  // MODE 2 STATE: नक्षत्र व चरण द्वारा (Completely Separate from Birth Details Mode)
  // ============================================================================
  const [nakBoyName, setNakBoyName] = useState('');
  const [nakBoyNakshatraIdx, setNakBoyNakshatraIdx] = useState(0); // अश्विनी
  const [nakBoyPada, setNakBoyPada] = useState(1);

  const [nakGirlName, setNakGirlName] = useState('');
  const [nakGirlNakshatraIdx, setNakGirlNakshatraIdx] = useState(3); // रोहिणी
  const [nakGirlPada, setNakGirlPada] = useState(2);

  const [nakResult, setNakResult] = useState<GunaMilanResult>(() =>
    calculateGunaMilan(0, 3, false, false, 1, 2)
  );

  // Close city suggestion dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boyLocRef.current && !boyLocRef.current.contains(e.target as Node)) {
        setIsBoySugOpen(false);
        if (!bdBoyLocQuery.trim()) setBdBoyLocQuery(bdBoyCity.name);
      }
      if (girlLocRef.current && !girlLocRef.current.contains(e.target as Node)) {
        setIsGirlSugOpen(false);
        if (!bdGirlLocQuery.trim()) setBdGirlLocQuery(bdGirlCity.name);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bdBoyCity, bdGirlCity, bdBoyLocQuery, bdGirlLocQuery]);

  // Live Type-to-Search for Var (Boy) City
  useEffect(() => {
    if (!isBoySugOpen) return;
    if (!bdBoyLocQuery.trim()) {
      setBdBoySuggestions([]);
      setIsSearchingBoyLoc(false);
      return;
    }
    let active = true;
    setIsSearchingBoyLoc(true);
    const timer = setTimeout(() => {
      searchLocationsViaApi(bdBoyLocQuery).then((res) => {
        if (active) {
          setBdBoySuggestions(res);
          setIsSearchingBoyLoc(false);
        }
      });
    }, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [bdBoyLocQuery, isBoySugOpen]);

  // Live Type-to-Search for Kanya (Girl) City
  useEffect(() => {
    if (!isGirlSugOpen) return;
    if (!bdGirlLocQuery.trim()) {
      setBdGirlSuggestions([]);
      setIsSearchingGirlLoc(false);
      return;
    }
    let active = true;
    setIsSearchingGirlLoc(true);
    const timer = setTimeout(() => {
      searchLocationsViaApi(bdGirlLocQuery).then((res) => {
        if (active) {
          setBdGirlSuggestions(res);
          setIsSearchingGirlLoc(false);
        }
      });
    }, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [bdGirlLocQuery, isGirlSugOpen]);

  const handleSelectBoyCity = (loc: CityLocation) => {
    setBdBoyCity(loc);
    setBdBoyLocQuery(loc.name);
    setIsBoySugOpen(false);
  };

  const handleSelectGirlCity = (loc: CityLocation) => {
    setBdGirlCity(loc);
    setBdGirlLocQuery(loc.name);
    setIsGirlSugOpen(false);
  };

  const handleBoyLocKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (bdBoySuggestions.length > 0) {
        handleSelectBoyCity(bdBoySuggestions[0]);
      } else if (bdBoyLocQuery.trim()) {
        const res = await searchLocationsViaApi(bdBoyLocQuery);
        if (res.length > 0) handleSelectBoyCity(res[0]);
      }
    }
  };

  const handleGirlLocKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (bdGirlSuggestions.length > 0) {
        handleSelectGirlCity(bdGirlSuggestions[0]);
      } else if (bdGirlLocQuery.trim()) {
        const res = await searchLocationsViaApi(bdGirlLocQuery);
        if (res.length > 0) handleSelectGirlCity(res[0]);
      }
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMode === 'birthDetails') {
      let boyCityToUse = bdBoyCity;
      if (bdBoyLocQuery.trim() && bdBoyLocQuery.trim() !== bdBoyCity.name) {
        const found = await searchLocationsViaApi(bdBoyLocQuery.trim());
        if (found.length > 0) {
          boyCityToUse = found[0];
        } else {
          boyCityToUse = { ...bdBoyCity, name: bdBoyLocQuery.trim(), en: bdBoyLocQuery.trim() };
        }
        setBdBoyCity(boyCityToUse);
        setBdBoyLocQuery(boyCityToUse.name);
      }

      let girlCityToUse = bdGirlCity;
      if (bdGirlLocQuery.trim() && bdGirlLocQuery.trim() !== bdGirlCity.name) {
        const found = await searchLocationsViaApi(bdGirlLocQuery.trim());
        if (found.length > 0) {
          girlCityToUse = found[0];
        } else {
          girlCityToUse = { ...bdGirlCity, name: bdGirlLocQuery.trim(), en: bdGirlLocQuery.trim() };
        }
        setBdGirlCity(girlCityToUse);
        setBdGirlLocQuery(girlCityToUse.name);
      }

      const finalBoyName = bdBoyName.trim() || 'वर';
      const finalGirlName = bdGirlName.trim() || 'कन्या';

      const newBoyKundli = generateKundli(
        finalBoyName,
        bdBoyDate,
        bdBoyTime,
        boyCityToUse.name,
        boyCityToUse.lat,
        boyCityToUse.lng,
        'male'
      );
      const newGirlKundli = generateKundli(
        finalGirlName,
        bdGirlDate,
        bdGirlTime,
        girlCityToUse.name,
        girlCityToUse.lat,
        girlCityToUse.lng,
        'female'
      );

      setBdBoyChart(newBoyKundli);
      setBdGirlChart(newGirlKundli);

      const bNakIdx = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === newBoyKundli.avakahada.nakshatra));
      const gNakIdx = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === newGirlKundli.avakahada.nakshatra));
      const bPada = newBoyKundli.avakahada.nakshatraPada || 1;
      const gPada = newGirlKundli.avakahada.nakshatraPada || 1;

      setBdResult(
        calculateGunaMilan(
          bNakIdx,
          gNakIdx,
          isChartManglik(newBoyKundli),
          isChartManglik(newGirlKundli),
          bPada,
          gPada,
          newBoyKundli,
          newGirlKundli
        )
      );
    } else {
      // Mode 2: Nakshatra & Pada Mode (Completely independent calculation)
      setNakResult(
        calculateGunaMilan(
          nakBoyNakshatraIdx,
          nakGirlNakshatraIdx,
          false,
          false,
          nakBoyPada,
          nakGirlPada
        )
      );
    }
  };

  // Active Mode Derived Values (Mode 1 vs Mode 2 never mix!)
  const activeResult = inputMode === 'birthDetails' ? bdResult : nakResult;

  const bdBoyNakIdx = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === bdBoyChart.avakahada.nakshatra));
  const bdGirlNakIdx = Math.max(0, NAKSHATRAS.findIndex((n) => n.name === bdGirlChart.avakahada.nakshatra));
  const bdBoyPadaVal = bdBoyChart.avakahada.nakshatraPada || 1;
  const bdGirlPadaVal = bdGirlChart.avakahada.nakshatraPada || 1;

  const activeBoyNakIdx = inputMode === 'birthDetails' ? bdBoyNakIdx : nakBoyNakshatraIdx;
  const activeGirlNakIdx = inputMode === 'birthDetails' ? bdGirlNakIdx : nakGirlNakshatraIdx;
  const activeBoyPada = inputMode === 'birthDetails' ? bdBoyPadaVal : nakBoyPada;
  const activeGirlPada = inputMode === 'birthDetails' ? bdGirlPadaVal : nakGirlPada;

  const activeBoyRashiIdx = Math.floor((activeBoyNakIdx * 4 + (activeBoyPada - 1)) / 9) % 12;
  const activeGirlRashiIdx = Math.floor((activeGirlNakIdx * 4 + (activeGirlPada - 1)) / 9) % 12;

  const activeBoyDisplayName =
    inputMode === 'birthDetails' ? bdBoyName.trim() || 'वर' : nakBoyName.trim() || 'वर';
  const activeGirlDisplayName =
    inputMode === 'birthDetails' ? bdGirlName.trim() || 'कन्या' : nakGirlName.trim() || 'कन्या';

  const kootaRows = [
    { name: 'वर्ण', boyVal: activeResult.varna.boyVarna, girlVal: activeResult.varna.girlVarna, max: activeResult.varna.max, scored: activeResult.varna.scored, desc: activeResult.varna.description },
    { name: 'वश्य', boyVal: activeResult.vashya.boyVashya, girlVal: activeResult.vashya.girlVashya, max: activeResult.vashya.max, scored: activeResult.vashya.scored, desc: activeResult.vashya.description },
    { name: 'तारा', boyVal: activeResult.tara.boyTara, girlVal: activeResult.tara.girlTara, max: activeResult.tara.max, scored: activeResult.tara.scored, desc: activeResult.tara.description },
    { name: 'योनि', boyVal: activeResult.yoni.boyYoni, girlVal: activeResult.yoni.girlYoni, max: activeResult.yoni.max, scored: activeResult.yoni.scored, desc: activeResult.yoni.description },
    { name: 'ग्रह मैत्री', boyVal: activeResult.grahaMaitri.boyLord, girlVal: activeResult.grahaMaitri.girlLord, max: activeResult.grahaMaitri.max, scored: activeResult.grahaMaitri.scored, desc: activeResult.grahaMaitri.description },
    { name: 'गण', boyVal: activeResult.gana.boyGana, girlVal: activeResult.gana.girlGana, max: activeResult.gana.max, scored: activeResult.gana.scored, desc: activeResult.gana.description },
    { name: 'भकूट', boyVal: RASHI_NAMES[activeBoyRashiIdx].hi, girlVal: RASHI_NAMES[activeGirlRashiIdx].hi, max: activeResult.bhakoot.max, scored: activeResult.bhakoot.scored, desc: activeResult.bhakoot.description },
    { name: 'नाड़ी', boyVal: activeResult.nadi.boyNadi, girlVal: activeResult.nadi.girlNadi, max: activeResult.nadi.max, scored: activeResult.nadi.scored, desc: activeResult.nadi.description }
  ];

  // In Nakshatra-only mode, filter out Manglik from Dosha list if birth details weren't used, or show all 4 cleanly
  const displayedDoshas =
    inputMode === 'nakshatra'
      ? activeResult.doshaAnalysis.filter((d) => d.id !== 'manglik')
      : activeResult.doshaAnalysis;

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header Card with Close Button & Mode Switcher */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
        {/* Row 1: Back and Close Buttons at Very Start of Card */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#008080]/15">
          <button
            type="button"
            onClick={onGoBack || onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            title="पिछले पृष्ठ पर वापस जाएं"
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
            <span>{dict.closePage}</span>
          </button>
        </div>

        {/* Row 2: Title and Mode Switcher Below Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#FF7F33] flex items-center justify-center text-white shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {dict.kundliMilan}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                अष्टकूट 36 गुण मिलान एवं सरल दोष निवारण
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setInputMode('birthDetails')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                inputMode === 'birthDetails'
                  ? 'bg-[#008080] text-white'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              जन्म तिथि व समय द्वारा
            </button>
            <button
              type="button"
              onClick={() => setInputMode('nakshatra')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                inputMode === 'nakshatra'
                  ? 'bg-[#008080] text-white'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              नक्षत्र व चरण द्वारा
            </button>
          </div>
        </div>
      </div>

      {/* Input Forms for Boy & Girl */}
      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Boy Details Card */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#008080]/15">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#008080] text-white flex items-center justify-center font-bold">
                वर
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                वर का विवरण
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-[#008080] dark:text-teal-300 font-bold text-[11px]">
              राशि: {RASHI_NAMES[activeBoyRashiIdx].hi} • {NAKSHATRAS[activeBoyNakIdx].name} ({activeBoyPada})
            </span>
          </div>

          {inputMode === 'birthDetails' ? (
            <>
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">वर का नाम</label>
                <input
                  type="text"
                  value={bdBoyName}
                  onChange={(e) => setBdBoyName(e.target.value)}
                  placeholder="यहां नाम दर्ज करें"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                />
              </div>

              {/* 50-50 Birth Date and Birth Time on the Same Single Line */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {dict.BirthDate}
                  </label>
                  <DatePicker
                    value={bdBoyDate}
                    onChange={(val) => val && setBdBoyDate(val)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {dict.BirthTime}
                  </label>
                  <div className="relative flex items-center">
                    <Clock className="w-3.5 h-3.5 text-[#FF7F33] absolute left-2.5 pointer-events-none" />
                    <input
                      type="time"
                      required
                      value={bdBoyTime}
                      onChange={(e) => setBdBoyTime(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Automatic Type-to-Search Location Input for Var */}
              <div ref={boyLocRef} className="relative">
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {dict.BirthPlace} (शहर टाइप करें)
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 focus-within:border-[#008080] rounded-xl px-3 py-2 transition">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7F33] shrink-0 mr-2" />
                  <input
                    type="text"
                    value={bdBoyLocQuery}
                    onFocus={() => {
                      setIsBoySugOpen(true);
                      setBdBoyLocQuery('');
                      setBdBoySuggestions([]);
                    }}
                    onChange={(e) => {
                      setBdBoyLocQuery(e.target.value);
                      setIsBoySugOpen(true);
                    }}
                    onKeyDown={handleBoyLocKeyDown}
                    placeholder="जन्म स्थान टाइप करें (जैसे: ऋषिकेश, दिल्ली, जयपुर)..."
                    className="w-full bg-transparent text-slate-900 dark:text-white font-semibold text-xs outline-none placeholder:text-slate-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </div>

                {isBoySugOpen && bdBoyLocQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#112226] text-slate-900 dark:text-white rounded-xl shadow-xl border border-[#008080]/30 z-30 max-h-52 overflow-y-auto divide-y divide-[#008080]/10">
                    {isSearchingBoyLoc && (
                      <div className="px-3 py-2 text-[11px] text-slate-500">
                        शहर खोजा जा रहा है...
                      </div>
                    )}
                    {!isSearchingBoyLoc && bdBoySuggestions.length === 0 && (
                      <div className="px-3 py-2 text-[11px] text-slate-500">
                        कोई शहर नहीं मिला
                      </div>
                    )}
                    {bdBoySuggestions.map((loc, idx) => (
                      <button
                        key={`${loc.name}_${idx}`}
                        type="button"
                        onClick={() => handleSelectBoyCity(loc)}
                        className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between gap-2 transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#FF7F33] shrink-0" />
                          <span className="truncate">{loc.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {loc.lat.toFixed(2)}°N, {loc.lng.toFixed(2)}°E
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">वर का नाम</label>
                <input
                  type="text"
                  value={nakBoyName}
                  onChange={(e) => setNakBoyName(e.target.value)}
                  placeholder="यहां नाम दर्ज करें"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">वर का जन्म नक्षत्र</label>
                  <select
                    value={nakBoyNakshatraIdx}
                    onChange={(e) => setNakBoyNakshatraIdx(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    {NAKSHATRAS.map((n, idx) => (
                      <option key={n.name} value={idx}>
                        {n.name} ({n.lord})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">चरण (1-4)</label>
                  <select
                    value={nakBoyPada}
                    onChange={(e) => setNakBoyPada(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    {[1, 2, 3, 4].map((p) => (
                      <option key={p} value={p}>
                        चरण {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Girl Details Card */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#008080]/15">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FF7F33] text-white flex items-center justify-center font-bold">
                वधू
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                कन्या का विवरण
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/40 text-[#FF7F33] font-bold text-[11px]">
              राशि: {RASHI_NAMES[activeGirlRashiIdx].hi} • {NAKSHATRAS[activeGirlNakIdx].name} ({activeGirlPada})
            </span>
          </div>

          {inputMode === 'birthDetails' ? (
            <>
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">कन्या का नाम</label>
                <input
                  type="text"
                  value={bdGirlName}
                  onChange={(e) => setBdGirlName(e.target.value)}
                  placeholder="यहां नाम दर्ज करें"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                />
              </div>

              {/* 50-50 Birth Date and Birth Time on the Same Single Line */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {dict.BirthDate}
                  </label>
                  <DatePicker
                    value={bdGirlDate}
                    onChange={(val) => val && setBdGirlDate(val)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {dict.BirthTime}
                  </label>
                  <div className="relative flex items-center">
                    <Clock className="w-3.5 h-3.5 text-[#FF7F33] absolute left-2.5 pointer-events-none" />
                    <input
                      type="time"
                      required
                      value={bdGirlTime}
                      onChange={(e) => setBdGirlTime(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Automatic Type-to-Search Location Input for Kanya */}
              <div ref={girlLocRef} className="relative">
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {dict.BirthPlace} (शहर टाइप करें)
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 focus-within:border-[#008080] rounded-xl px-3 py-2 transition">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7F33] shrink-0 mr-2" />
                  <input
                    type="text"
                    value={bdGirlLocQuery}
                    onFocus={() => {
                      setIsGirlSugOpen(true);
                      setBdGirlLocQuery('');
                      setBdGirlSuggestions([]);
                    }}
                    onChange={(e) => {
                      setBdGirlLocQuery(e.target.value);
                      setIsGirlSugOpen(true);
                    }}
                    onKeyDown={handleGirlLocKeyDown}
                    placeholder="जन्म स्थान टाइप करें (जैसे: ऋषिकेश, दिल्ली, जयपुर)..."
                    className="w-full bg-transparent text-slate-900 dark:text-white font-semibold text-xs outline-none placeholder:text-slate-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </div>

                {isGirlSugOpen && bdGirlLocQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#112226] text-slate-900 dark:text-white rounded-xl shadow-xl border border-[#008080]/30 z-30 max-h-52 overflow-y-auto divide-y divide-[#008080]/10">
                    {isSearchingGirlLoc && (
                      <div className="px-3 py-2 text-[11px] text-slate-500">
                        शहर खोजा जा रहा है...
                      </div>
                    )}
                    {!isSearchingGirlLoc && bdGirlSuggestions.length === 0 && (
                      <div className="px-3 py-2 text-[11px] text-slate-500">
                        कोई शहर नहीं मिला
                      </div>
                    )}
                    {bdGirlSuggestions.map((loc, idx) => (
                      <button
                        key={`${loc.name}_${idx}`}
                        type="button"
                        onClick={() => handleSelectGirlCity(loc)}
                        className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between gap-2 transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#FF7F33] shrink-0" />
                          <span className="truncate">{loc.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {loc.lat.toFixed(2)}°N, {loc.lng.toFixed(2)}°E
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">कन्या का नाम</label>
                <input
                  type="text"
                  value={nakGirlName}
                  onChange={(e) => setNakGirlName(e.target.value)}
                  placeholder="यहां नाम दर्ज करें"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">कन्या का जन्म नक्षत्र</label>
                  <select
                    value={nakGirlNakshatraIdx}
                    onChange={(e) => setNakGirlNakshatraIdx(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    {NAKSHATRAS.map((n, idx) => (
                      <option key={n.name} value={idx}>
                        {n.name} ({n.lord})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">चरण (1-4)</label>
                  <select
                    value={nakGirlPada}
                    onChange={(e) => setNakGirlPada(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    {[1, 2, 3, 4].map((p) => (
                      <option key={p} value={p}>
                        चरण {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {inputMode === 'birthDetails'
                ? 'जन्म विवरण से कुंडली मिलान करें'
                : 'नक्षत्र व चरण से गुण मिलान करें'}
            </span>
          </button>
        </div>
      </form>

      {/* Score Summary Card (Single Card, No Nested Boxes) */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-4 flex flex-col items-center justify-center pb-4 lg:pb-0 lg:pr-5 border-b lg:border-b-0 lg:border-r border-[#008080]/15 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-teal-400 mb-1">
              प्राप्त गुण ({inputMode === 'birthDetails' ? 'जन्म विवरण द्वारा' : 'नक्षत्र व चरण द्वारा'})
            </span>
            <div className="text-3xl font-extrabold text-[#008080] dark:text-teal-400">
              {activeResult.totalScore} <span className="text-lg font-normal text-slate-400">/ {activeResult.maxScore}</span>
            </div>
            <span className="mt-2 px-3 py-1 rounded-lg text-xs font-bold bg-[#008080] text-white">
              {activeResult.verdict}
            </span>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {activeBoyDisplayName} एवं {activeGirlDisplayName} का मिलान परिणाम
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {inputMode === 'birthDetails'
                ? activeResult.manglikCompatibility
                : `वर राशि: ${RASHI_NAMES[activeBoyRashiIdx].hi} (${NAKSHATRAS[activeBoyNakIdx].name}, चरण ${activeBoyPada}) • कन्या राशि: ${RASHI_NAMES[activeGirlRashiIdx].hi} (${NAKSHATRAS[activeGirlNakIdx].name}, चरण ${activeGirlPada})`}
            </p>

            {inputMode === 'birthDetails' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-[#008080]/15">
                <div className="flex items-center gap-2.5">
                  {activeResult.isManglikBoy ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-[11px] text-slate-500">वर मांगलिक स्थिति</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {activeResult.isManglikBoy ? 'मांगलिक दोष उपस्थित' : 'मांगलिक दोष मुक्त'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {activeResult.isManglikGirl ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-[11px] text-slate-500">कन्या मांगलिक स्थिति</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {activeResult.isManglikGirl ? 'मांगलिक दोष उपस्थित' : 'मांगलिक दोष मुक्त'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ashtakoot 8 Koota Table (Clean Full-Width Card) */}
      {kundliSettings.enable_ashtakoot_milan !== false && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl border border-[#008080]/20 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-[#008080]/15">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              अष्टकूट (8 कूट) गुण मिलान तालिका
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 text-[11px] font-bold text-slate-500">
                  <th className="py-2.5 px-4">कूट</th>
                  <th className="py-2.5 px-4">वर</th>
                  <th className="py-2.5 px-4">कन्या</th>
                  <th className="py-2.5 px-4">अधिकतम गुण</th>
                  <th className="py-2.5 px-4">प्राप्त गुण</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#008080]/10">
                {kootaRows.map((k, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{k.name}</p>
                      <p className="text-[11px] text-slate-400">{k.desc}</p>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">{k.boyVal}</td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">{k.girlVal}</td>
                    <td className="py-2.5 px-4 text-slate-500">{k.max}</td>
                    <td className="py-2.5 px-4 font-extrabold text-[#008080] dark:text-teal-300">{k.scored}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Simple, Clean & Easy-to-Read Dosha & Remedy Card */}
      {kundliSettings.enable_manglik_check !== false && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#008080]/15">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#008080]" />
              <span>कुंडली दोष एवं निवारण (सरल विश्लेषण)</span>
            </h2>
          </div>

          <div className="divide-y divide-[#008080]/15">
          {displayedDoshas.map((item) => {
            const statusBadge =
              item.status === 'absent'
                ? 'bg-emerald-600 text-white'
                : item.status === 'cancelled'
                ? 'bg-[#008080] text-white'
                : 'bg-[#FF7F33] text-white';

            return (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold shrink-0 ${statusBadge}`}>
                    {item.statusLabel}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {item.pariharReason && (
                  <p className="text-[#008080] dark:text-teal-300 font-semibold leading-relaxed">
                    • <strong>दोष क्यों कट रहा है:</strong> {item.pariharReason}
                  </p>
                )}

                {item.remedy && (
                  <p className="text-[#FF7F33] font-semibold leading-relaxed">
                    • <strong>उपाय:</strong> {item.remedy}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    )}
    </div>
  );
};

export default MilanView;
