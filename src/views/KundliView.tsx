import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  X,
  Compass,
  Layers,
  Activity,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowLeft,
  FolderOpen
} from 'lucide-react';
import { KundliChartData, LanguageCode } from '../types';
import { CITIES, CityLocation, searchLocationsViaApi } from '../services/panchangEngine';
import { generateKundli, RASHI_NAMES } from '../services/astrologyEngine';
import { NorthIndianChart } from '../components/NorthIndianChart';
import { DICTIONARY, trTerm } from '../i18n/translations';
import { SAVED_KUNDLIS_STORAGE_KEY, loadSavedKundlisList } from './SavedKundlisView';
import { DatePicker, formatToDdMmYyyy } from '../components/DatePicker';
import { getWpAppSettings, WpKundliCalcSettings } from '../services/wpApiClient';

function getCurrentIstDate(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().split('T')[0];
}

function getCurrentIstTime(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(11, 16);
}

interface KundliViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
  onOpenSavedKundlisPage?: () => void;
}

type KundliTabId =
  | 'lagna'
  | 'chandra'
  | 'navamsha'
  | 'avakahada'
  | 'planets'
  | 'dasha';

export const KundliView: React.FC<KundliViewProps> = ({
  currentLang,
  onClosePage,
  onGoBack,
  onOpenSavedKundlisPage
}) => {
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

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [birthDate, setBirthDate] = useState<string>(() => getCurrentIstDate());
  const [birthTime, setBirthTime] = useState<string>(() => getCurrentIstTime());
  const [selectedCity, setSelectedCity] = useState<CityLocation>(CITIES[0]);
  const [hasGeneratedKundli, setHasGeneratedKundli] = useState<boolean>(false);

  // Live Type-to-Search Location State (Same as Panchang)
  const [locationQuery, setLocationQuery] = useState(CITIES[0].name);
  const [suggestions, setSuggestions] = useState<CityLocation[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isSearchingLoc, setIsSearchingLoc] = useState(false);
  const locContainerRef = useRef<HTMLDivElement>(null);

  const [kundli, setKundli] = useState<KundliChartData>(() =>
    generateKundli(
      '',
      getCurrentIstDate(),
      getCurrentIstTime(),
      CITIES[0].name,
      CITIES[0].lat,
      CITIES[0].lng,
      'male'
    )
  );

  const [activeTab, setActiveTab] = useState<KundliTabId>('lagna');
  const [expandedDashaIdx, setExpandedDashaIdx] = useState<number | null>(0);
  const [saveMessage, setSaveMessage] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locContainerRef.current && !locContainerRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
        setLocationQuery(selectedCity.name);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCity]);

  useEffect(() => {
    if (!isSuggestionsOpen) return;
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
    }, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [locationQuery, isSuggestionsOpen]);

  const handleSelectLocation = (loc: CityLocation) => {
    setSelectedCity(loc);
    setLocationQuery(loc.name);
    setIsSuggestionsOpen(false);
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

  const buildCurrentKundliFromInputs = async (): Promise<KundliChartData> => {
    let cityToUse = selectedCity;
    if (locationQuery.trim() && locationQuery.trim() !== selectedCity.name) {
      const found = await searchLocationsViaApi(locationQuery.trim());
      if (found.length > 0) {
        cityToUse = found[0];
        setSelectedCity(cityToUse);
        setLocationQuery(cityToUse.name);
      }
    }

    const finalName = name.trim() || 'अपना नाम लिखें';
    const generated = generateKundli(
      finalName,
      birthDate,
      birthTime,
      cityToUse.name,
      cityToUse.lat,
      cityToUse.lng,
      gender
    );
    setKundli(generated);
    setHasGeneratedKundli(true);
    const activeIdx = generated.vimshottariDasha.findIndex((d) => d.isCurrent);
    setExpandedDashaIdx(activeIdx >= 0 ? activeIdx : 0);
    return generated;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await buildCurrentKundliFromInputs();
  };

  const handleSaveChart = async () => {
    const chartToSave = await buildCurrentKundliFromInputs();
    const existing = loadSavedKundlisList();
    const filtered = existing.filter(
      (c) =>
        !(
          c.name === chartToSave.name &&
          c.birthDate === chartToSave.birthDate &&
          c.birthTime === chartToSave.birthTime
        )
    );
    const updated = [chartToSave, ...filtered].slice(0, 100);
    localStorage.setItem(SAVED_KUNDLIS_STORAGE_KEY, JSON.stringify(updated));
    void import('../services/wpApiClient')
      .then(({ saveKundliToWpCloud }) => saveKundliToWpCloud(chartToSave))
      .catch(() => undefined);
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2500);
  };

  const kundliTabs: { id: KundliTabId; label: string }[] = [
    { id: 'lagna', label: 'लग्न कुंडली' },
    ...(kundliSettings.enable_chandra_chart !== false
      ? [{ id: 'chandra' as KundliTabId, label: 'चंद्र कुंडली' }]
      : []),
    ...(kundliSettings.enable_navamsha_d9 !== false
      ? [{ id: 'navamsha' as KundliTabId, label: 'नवांश कुंडली' }]
      : []),
    ...(kundliSettings.enable_avakahada !== false
      ? [{ id: 'avakahada' as KundliTabId, label: 'अवकहड़ा चक्र' }]
      : []),
    { id: 'planets', label: 'ग्रह स्पष्ट' },
    { id: 'dasha', label: 'विंशोत्तरी दशा' }
  ];

  const av = kundli.avakahada;
  const lagnaRashiName = RASHI_NAMES[(kundli.lagnaSign - 1) % 12]?.hi || av.lagna;
  const chandraRashiName = RASHI_NAMES[(kundli.chandraSign - 1) % 12]?.hi || av.rashi;

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Birth Details Input Form with Close Button at Top & 50-50 Generate/Save Buttons */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs">
            {/* Row 1: Back and Close Buttons at Very Start of Card */}
            <div className="flex items-center justify-between gap-3 pb-2.5 mb-3 border-b border-[#008080]/15">
              <button
                type="button"
                onClick={onGoBack || onClosePage}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                title="पिछले पृष्ठ पर वापस जाएं"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>वापस</span>
              </button>

              <button
                type="button"
                onClick={onClosePage}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                title="पेज बंद करें"
              >
                <X className="w-3.5 h-3.5" />
                <span>{dict.closePage || 'बंद करें'}</span>
              </button>
            </div>

            {/* Row 2: Kundli Heading Below Buttons */}
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#008080]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {dict.kundliGenerator}
              </h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {dict.FullName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="अपना नाम लिखें"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {dict.Gender}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 rounded-xl font-bold border transition cursor-pointer ${
                      gender === 'male'
                        ? 'bg-[#008080] text-white border-[#008080]'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#008080]/20'
                    }`}
                  >
                    {dict.Male}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 rounded-xl font-bold border transition cursor-pointer ${
                      gender === 'female'
                        ? 'bg-[#008080] text-white border-[#008080]'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#008080]/20'
                    }`}
                  >
                    {dict.Female}
                  </button>
                </div>
              </div>

              {/* 50-50 Birth Date and Birth Time on the Same Single Line */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {dict.BirthDate}
                  </label>
                  <DatePicker
                    value={birthDate}
                    onChange={(val) => val && setBirthDate(val)}
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
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full pl-8 pr-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Automatic Type-to-Search Location Input */}
              <div ref={locContainerRef} className="relative">
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {dict.BirthPlace} (शहर टाइप करें)
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 focus-within:border-[#008080] rounded-xl px-3 py-2 transition">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7F33] shrink-0 mr-2" />
                  <input
                    type="text"
                    value={locationQuery}
                    onFocus={() => {
                      setIsSuggestionsOpen(true);
                      setLocationQuery('');
                      setSuggestions([]);
                    }}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      setIsSuggestionsOpen(true);
                    }}
                    onKeyDown={handleLocationKeyDown}
                    placeholder="जन्म स्थान टाइप करें (जैसे: ऋषिकेश, दिल्ली)..."
                    className="w-full bg-transparent text-slate-900 dark:text-white font-semibold text-xs outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </div>

                {isSuggestionsOpen && locationQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-[#112226] text-slate-900 dark:text-white rounded-xl shadow-xl border border-[#008080]/30 z-30 max-h-52 overflow-y-auto overscroll-contain divide-y divide-[#008080]/10">
                    {isSearchingLoc && (
                      <div className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">
                        स्थान खोजा जा रहा है...
                      </div>
                    )}
                    {!isSearchingLoc && suggestions.length === 0 && (
                      <div className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">
                        कोई स्थान नहीं मिला
                      </div>
                    )}
                    {suggestions.map((loc, idx) => (
                      <button
                        key={`${loc.name}_${idx}`}
                        type="button"
                        onClick={() => handleSelectLocation(loc)}
                        className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between gap-2 transition cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#FF7F33] shrink-0" />
                          <span className="truncate">{loc.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {loc.lat.toFixed(2)}°N
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 50-50 Split Row: 1st Button = कुंडली बनाएं, 2nd Button = कुंडली सहेजें */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 px-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{dict.GenerateKundli}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveChart}
                  className="w-full py-2.5 px-2 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {saveMessage ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Save className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="truncate">{saveMessage ? 'कुंडली सुरक्षित!' : dict.SaveKundli}</span>
                </button>
              </div>

              {/* Open Saved Kundlis List Button (कुंडली खोलें) */}
              {onOpenSavedKundlisPage && (
                <button
                  type="button"
                  onClick={onOpenSavedKundlisPage}
                  className="w-full py-2.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-[#008080] text-[#008080] dark:text-teal-300 hover:text-white border border-[#008080]/30 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>{dict.OpenSavedKundli || 'कुंडली खोलें'}</span>
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Single Card Containing Generated Kundli Summary (only after Generate clicked) & Active Tab Content */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
            {/* Show Name, DOB, TOB, POB, Lagna & Rashi ONLY after user clicks 'कुंडली बनाएं' */}
            {hasGeneratedKundli && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#008080]/15">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      {kundli.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#008080] text-white">
                      लग्न: {trTerm(lagnaRashiName, currentLang)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#FF7F33] text-white">
                      राशि: {trTerm(chandraRashiName, currentLang)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    जन्म तिथि: {formatToDdMmYyyy(kundli.birthDate)} • जन्म समय: {kundli.birthTime} • जन्म स्थान: {trTerm(kundli.birthPlace, currentLang)}
                  </p>
                </div>
              </div>
            )}

            {/* Tab-wise Buttons for All Kundli Options */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-3.5 border-b border-[#008080]/15">
                {kundliTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                        isActive
                          ? 'bg-[#008080] text-white shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-slate-700 dark:text-slate-300 border border-[#008080]/15'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: लग्न कुंडली (Lagna Chart D1) */}
              {activeTab === 'lagna' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        लग्न कुंडली (जन्म लग्न चक्र - D1)
                      </h3>
                      <p className="text-xs text-slate-500">
                        लग्न राशि: {trTerm(lagnaRashiName, currentLang)} • लग्नेश: {trTerm(av.lagnaLord, currentLang)}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-teal-300 text-xs font-bold">
                      प्रथम भाव: {trTerm(lagnaRashiName, currentLang)}
                    </span>
                  </div>

                  <div className="max-w-sm mx-auto py-2">
                    <NorthIndianChart
                      chartData={kundli}
                      title="लग्न कुंडली"
                      chartType="lagna"
                      currentLang={currentLang}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: चंद्र कुंडली (Moon Chart) */}
              {activeTab === 'chandra' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        चंद्र कुंडली (राशि कुंडली)
                      </h3>
                      <p className="text-xs text-slate-500">
                        जन्म राशि: {trTerm(chandraRashiName, currentLang)} • राशि स्वामी: {trTerm(av.rashiLord, currentLang)}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#FF7F33]/15 text-[#FF7F33] text-xs font-bold">
                      चंद्र लग्न: {trTerm(chandraRashiName, currentLang)}
                    </span>
                  </div>

                  <div className="max-w-sm mx-auto py-2">
                    <NorthIndianChart
                      chartData={kundli}
                      title="चंद्र कुंडली"
                      chartType="chandra"
                      currentLang={currentLang}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: नवांश कुंडली (Navamsha Chart D9) */}
              {activeTab === 'navamsha' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        नवांश कुंडली (भाग्य एवं वैवाहिक विचार - D9)
                      </h3>
                      <p className="text-xs text-slate-500">
                        ग्रहों के वास्तविक बलाबल, धर्म एवं दांपत्य सुख के सूक्ष्म विश्लेषण हेतु नवांश चक्र
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-teal-300 text-xs font-bold">
                      नवांश (D9)
                    </span>
                  </div>

                  <div className="max-w-sm mx-auto py-2">
                    <NorthIndianChart
                      chartData={kundli}
                      title="नवांश कुंडली (D9)"
                      chartType="navamsha"
                      currentLang={currentLang}
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: अवकहड़ा चक्र (Avakahada Chakra — Flat Divider Rows) */}
              {activeTab === 'avakahada' && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2 border-b border-[#008080]/15 pb-2.5">
                    <Compass className="w-4 h-4 text-[#008080]" />
                    <span>अवकहड़ा चक्र एवं जन्म पंचांग विवरण</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3 text-xs">
                    {[
                      { label: 'लग्न', value: trTerm(av.lagna, currentLang) },
                      { label: 'लग्नेश', value: trTerm(av.lagnaLord, currentLang) },
                      { label: 'चंद्र राशि', value: trTerm(av.rashi, currentLang) },
                      { label: 'राशि स्वामी', value: trTerm(av.rashiLord, currentLang) },
                      { label: dict.nakshatra, value: av.nakshatra },
                      { label: 'नक्षत्र चरण', value: String(av.nakshatraPada) },
                      { label: 'नक्षत्र स्वामी', value: trTerm(av.nakshatraLord, currentLang) },
                      { label: 'वर्ण', value: av.varna },
                      { label: 'वश्य', value: av.vashya },
                      { label: 'योनि', value: av.yoni },
                      { label: 'गण', value: av.gana },
                      { label: 'नाड़ी', value: av.nadi },
                      { label: 'पाया', value: av.paya },
                      { label: 'नामाक्षर', value: av.nameAlphabet },
                      { label: dict.tithi, value: av.tithi },
                      { label: dict.vara, value: av.vara },
                      { label: dict.yoga, value: av.yoga },
                      { label: dict.karana, value: av.karana }
                    ].map((item, idx) => (
                      <div key={idx} className="border-b border-[#008080]/15 pb-2">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                          {item.label}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: ग्रह स्पष्ट (Planetary Positions Table) */}
              {activeTab === 'planets' && (
                <div className="space-y-3">
                  <div className="pb-2.5 border-b border-[#008080]/15 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#008080]" />
                      <span>नवग्रह स्पष्ट एवं नक्षत्र तालिका</span>
                    </h3>
                    <span className="text-[11px] font-bold text-[#008080] dark:text-teal-300">
                      लहिरी अयनांश आधारित
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#008080]/20 text-[10px] font-bold uppercase text-slate-500">
                          <th className="py-2 px-2.5">ग्रह</th>
                          <th className="py-2 px-2.5">राशि</th>
                          <th className="py-2 px-2.5">भाव</th>
                          <th className="py-2 px-2.5">अंश-कला</th>
                          <th className="py-2 px-2.5">{dict.nakshatra} (चरण)</th>
                          <th className="py-2 px-2.5">नक्षत्र स्वामी</th>
                          <th className="py-2 px-2.5">अवस्था</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#008080]/10">
                        {kundli.planets.map((pos, idx) => {
                          const symbols = `${pos.isRetrograde ? '^' : ''}${pos.isCombust ? '*' : ''}`;
                          return (
                            <tr key={idx}>
                              <td className="py-2 px-2.5 font-bold text-slate-900 dark:text-white">
                                <span>{trTerm(pos.hindiName, currentLang)}</span>
                                {symbols && (
                                  <sup className="ml-0.5 text-[11px] font-black text-[#FF7F33]">
                                    {symbols}
                                  </sup>
                                )}
                                {pos.isRetrograde && (
                                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] rounded bg-[#FF7F33]/15 text-[#FF7F33]">
                                    वक्री
                                  </span>
                                )}
                                {pos.isCombust && (
                                  <span className="ml-1 px-1.5 py-0.5 text-[9px] rounded bg-amber-500/15 text-amber-600">
                                    अस्त
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300 font-semibold">
                                {trTerm(pos.signHindiName, currentLang)}
                              </td>
                              <td className="py-2 px-2.5 font-bold text-[#008080] dark:text-teal-300">
                                {pos.house}
                              </td>
                              <td className="py-2 px-2.5 font-mono text-slate-600 dark:text-slate-400">
                                {pos.degree}°{pos.minutes}&apos;{pos.seconds}&quot;
                              </td>
                              <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300">
                                {pos.nakshatra} ({pos.pada})
                              </td>
                              <td className="py-2 px-2.5 text-slate-700 dark:text-slate-300">
                                {pos.nakshatraLord}
                              </td>
                              <td className="py-2 px-2.5 font-semibold text-[#008080] dark:text-teal-300">
                                {trTerm(pos.statusHindi, currentLang)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: विंशोत्तरी दशा (Vimshottari Mahadasha, Antardasha & Pratyantardasha with Date & Time) */}
              {activeTab === 'dasha' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#008080]/15">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#FF7F33]" />
                      <span>{dict.vimshottariTab} (120 वर्ष चक्र • तिथि व समय सहित)</span>
                    </h3>
                    <span className="px-3 py-1 rounded-lg bg-[#008080] text-white text-xs font-bold">
                      सक्रिय दशा: {trTerm(kundli.currentDasha.mahaDasha, currentLang)} - {trTerm(kundli.currentDasha.antarDasha, currentLang)} - {trTerm(kundli.currentDasha.pratyantarDasha, currentLang)}
                    </span>
                  </div>

                  <div className="divide-y divide-[#008080]/15">
                    {kundli.vimshottariDasha.map((maha, idx) => {
                      const isExpanded = expandedDashaIdx === idx;
                      return (
                        <div key={idx} className="py-2.5">
                          <button
                            type="button"
                            onClick={() => setExpandedDashaIdx(isExpanded ? null : idx)}
                            className="w-full py-1.5 flex items-center justify-between text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                                  maha.isCurrent ? 'bg-[#008080]' : 'bg-slate-600'
                                }`}
                              >
                                {trTerm(maha.planet, currentLang).slice(0, 2)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    {trTerm(maha.planet, currentLang)} महादशा ({maha.durationYears} वर्ष)
                                  </span>
                                  {maha.balanceText && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-[#008080] dark:text-teal-300">
                                      {maha.balanceText}
                                    </span>
                                  )}
                                  {maha.isCurrent && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF7F33] text-white">
                                      सक्रिय
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {maha.startDate} {maha.startTime || ''} से {maha.endDate} {maha.endTime || ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#008080] dark:text-teal-300">
                              <span>अंतर्दशा व प्रत्यंतर</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="pt-3 mt-2 border-t border-[#008080]/10 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
                                {maha.antarDashas.map((antar, aIdx) => (
                                  <div
                                    key={aIdx}
                                    className="py-2 border-b border-[#008080]/10 space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {trTerm(maha.planet, currentLang)} - {trTerm(antar.planet, currentLang)}
                                        {antar.isCurrent && (
                                          <span className="ml-1.5 text-[10px] text-[#FF7F33] font-extrabold">
                                            (सक्रिय अंतर्दशा)
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-[11px] font-mono font-semibold text-[#008080] dark:text-teal-300">
                                        {antar.startDate} से {antar.endDate} {antar.endTime || ''}
                                      </span>
                                    </div>

                                    {antar.pratyantarDashas && antar.pratyantarDashas.length > 0 && (
                                      <div className="pl-2.5 border-l-2 border-[#008080]/25 grid grid-cols-1 gap-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                                        {antar.pratyantarDashas.map((pItem, pIdx) => (
                                          <div
                                            key={pIdx}
                                            className={`flex items-center justify-between py-0.5 ${
                                              pItem.isCurrent ? 'text-[#FF7F33] font-bold' : ''
                                            }`}
                                          >
                                            <span>
                                              प्रत्यंतर: {trTerm(maha.planet, currentLang)}-{trTerm(antar.planet, currentLang)}-{trTerm(pItem.planet, currentLang)}
                                            </span>
                                            <span className="font-mono text-[10px]">
                                              {pItem.startDate} {pItem.startTime} — {pItem.endDate} {pItem.endTime}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Standalone Note Outside and Below the Kundli Card */}
          <div className="bg-white dark:bg-[#112226] rounded-2xl px-4 py-3 border border-[#008080]/20 shadow-xs text-center">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
              <span className="text-[#FF7F33] font-extrabold">नोट:</span> ग्रह के नाम के ऊपर{' '}
              <span className="text-[#FF7F33] font-mono font-black">( ^ )</span> चिह्न का अर्थ{' '}
              <strong className="text-[#008080] dark:text-teal-300">&lsquo;वक्री ग्रह&rsquo;</strong> है तथा{' '}
              <span className="text-[#FF7F33] font-mono font-black">( * )</span> चिह्न का अर्थ{' '}
              <strong className="text-[#FF7F33]">&lsquo;अस्त ग्रह&rsquo;</strong> है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KundliView;
