import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  Compass,
  Layers,
  Activity,
  ChevronDown,
  ChevronUp,
  Trash2,
  FileDown,
  ExternalLink,
  List,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { KundliChartData, LanguageCode } from '../types';
import { generateKundli, RASHI_NAMES } from '../services/astrologyEngine';
import { NorthIndianChart } from '../components/NorthIndianChart';
import { generateAndDownloadKundliPdf } from '../utils/kundliPdfGenerator';
import { DICTIONARY, trTerm } from '../i18n/translations';
import { PaginationControls } from '../components/PaginationControls';
import { formatToDdMmYyyy } from '../components/DatePicker';

const KUNDLIS_PER_PAGE = 10;

interface SavedKundlisViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
  onNavigateToGenerator: () => void;
  initialKundliId?: string | null;
}

type KundliTabId =
  | 'lagna'
  | 'chandra'
  | 'navamsha'
  | 'avakahada'
  | 'planets'
  | 'dasha';

export const SAVED_KUNDLIS_STORAGE_KEY = 'jyotishwala_saved_kundlis_v3';

export function loadSavedKundlisList(): KundliChartData[] {
  try {
    const raw =
      localStorage.getItem(SAVED_KUNDLIS_STORAGE_KEY) ||
      localStorage.getItem('jyotishwala_saved_kundlis_v2');
    if (!raw) return [];
    const parsed: KundliChartData[] = JSON.parse(raw);
    return parsed.map((item) => {
      if (
        !item.vimshottariDasha ||
        item.vimshottariDasha.length < 9 ||
        !item.vimshottariDasha[0]?.startTime ||
        !item.vimshottariDasha[0]?.antarDashas?.[0]?.pratyantarDashas
      ) {
        const fresh = generateKundli(
          item.name,
          item.birthDate,
          item.birthTime,
          item.birthPlace,
          item.latitude,
          item.longitude,
          item.gender
        );
        return { ...fresh, id: item.id };
      }
      return item;
    });
  } catch {
    return [];
  }
}

export const SavedKundlisView: React.FC<SavedKundlisViewProps> = ({
  currentLang,
  onClosePage,
  onGoBack,
  onNavigateToGenerator,
  initialKundliId
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  const [savedCharts, setSavedCharts] = useState<KundliChartData[]>(() => loadSavedKundlisList());
  const [openedKundli, setOpenedKundli] = useState<KundliChartData | null>(() => {
    if (!initialKundliId) return null;
    const list = loadSavedKundlisList();
    return list.find((c) => c.id === initialKundliId) || null;
  });

  const [activeTab, setActiveTab] = useState<KundliTabId>('lagna');
  const [expandedDashaIdx, setExpandedDashaIdx] = useState<number | null>(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleOpenSavedKundli = (sc: KundliChartData) => {
    setOpenedKundli(sc);
    setPdfBlobUrl(null);
    setActiveTab('lagna');
    const activeIdx = sc.vimshottariDasha.findIndex((d) => d.isCurrent);
    setExpandedDashaIdx(activeIdx >= 0 ? activeIdx : 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSavedChart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedCharts.filter((c) => c.id !== id);
    localStorage.setItem(SAVED_KUNDLIS_STORAGE_KEY, JSON.stringify(updated));
    setSavedCharts(updated);
    void import('../services/wpApiClient')
      .then(({ deleteKundliFromWpCloud }) => deleteKundliFromWpCloud(id))
      .catch(() => undefined);
    const maxPage = Math.max(1, Math.ceil(updated.length / KUNDLIS_PER_PAGE));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
    if (openedKundli?.id === id) {
      setOpenedKundli(null);
    }
  };

  const handleDownloadPdf = async (targetChart: KundliChartData) => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const url = await generateAndDownloadKundliPdf(targetChart);
      setPdfBlobUrl(url);
    } catch {
      // Ignore PDF error
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const kundliTabs: { id: KundliTabId; label: string }[] = [
    { id: 'lagna', label: 'लग्न कुंडली' },
    { id: 'chandra', label: 'चंद्र कुंडली' },
    { id: 'navamsha', label: 'नवांश कुंडली' },
    { id: 'avakahada', label: 'अवकहड़ा चक्र' },
    { id: 'planets', label: 'ग्रह स्पष्ट' },
    { id: 'dasha', label: 'विंशोत्तरी दशा' }
  ];

  // ==================== OPENED SAVED KUNDLI FULL DETAILS VIEW ====================
  if (openedKundli) {
    const av = openedKundli.avakahada;
    const lagnaRashiName = RASHI_NAMES[(openedKundli.lagnaSign - 1) % 12]?.hi || av.lagna;
    const chandraRashiName = RASHI_NAMES[(openedKundli.chandraSign - 1) % 12]?.hi || av.rashi;

    return (
      <div className="space-y-4 mb-6">
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-6 border border-[#008080]/20 shadow-xs space-y-5">
          {/* Top Button Row: Back & Close Buttons in One Row at Very Top */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#008080]/15">
            <button
              type="button"
              onClick={() => setOpenedKundli(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title="सहेजी गई सूची पर वापस जाएं"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>वापस सूची</span>
            </button>

            <button
              type="button"
              onClick={onClosePage}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              title="पेज बंद करें"
            >
              <X className="w-4 h-4" />
              <span>{dict.closePage || 'बंद करें'}</span>
            </button>
          </div>

          {/* Heading Section: Kundli Name, Info Badges & PDF Action Buttons Below */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#008080]/15">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {openedKundli.name} की जन्म कुंडली
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#008080] text-white">
                  लग्न: {trTerm(lagnaRashiName, currentLang)}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#FF7F33] text-white">
                  राशि: {trTerm(chandraRashiName, currentLang)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                जन्म दिनांक: {formatToDdMmYyyy(openedKundli.birthDate)} • समय: {openedKundli.birthTime} • स्थान: {trTerm(openedKundli.birthPlace, currentLang)} • {dict.nakshatra}: {av.nakshatra} (चरण {av.nakshatraPada})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadPdf(openedKundli)}
                disabled={isDownloadingPdf}
                className="px-3.5 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <FileDown className="w-4 h-4" />
                <span>{isDownloadingPdf ? 'PDF बन रहा है...' : 'कुंडली PDF डाउनलोड'}</span>
              </button>

              {pdfBlobUrl && (
                <a
                  href={pdfBlobUrl}
                  download={`JyotishWala_Kundli_${(openedKundli.name || 'Kundli').replace(/\s+/g, '_')}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>PDF खोलें</span>
                </a>
              )}
            </div>
          </div>

          {/* Complete Birth Details Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 border-b border-[#008080]/15 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">जातक का नाम</span>
              <span className="font-bold text-slate-900 dark:text-white">{openedKundli.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">जन्म तिथि व समय</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatToDdMmYyyy(openedKundli.birthDate)} ({openedKundli.birthTime})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">जन्म स्थान</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {trTerm(openedKundli.birthPlace, currentLang)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">तिथि / वार / नक्षत्र</span>
              <span className="font-bold text-[#008080] dark:text-teal-300">
                {av.tithi} • {av.vara} • {av.nakshatra}
              </span>
            </div>
          </div>

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
                    chartData={openedKundli}
                    title="लग्न कुंडली"
                    chartType="lagna"
                    currentLang={currentLang}
                  />
                </div>
              </div>
            )}

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
                    chartData={openedKundli}
                    title="चंद्र कुंडली"
                    chartType="chandra"
                    currentLang={currentLang}
                  />
                </div>
              </div>
            )}

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
                    chartData={openedKundli}
                    title="नवांश कुंडली (D9)"
                    chartType="navamsha"
                    currentLang={currentLang}
                  />
                </div>
              </div>
            )}

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
                      {openedKundli.planets.map((pos, idx) => {
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

            {activeTab === 'dasha' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#008080]/15">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#FF7F33]" />
                    <span>{dict.vimshottariTab} (120 वर्ष चक्र • तिथि व समय सहित)</span>
                  </h3>
                  <span className="px-3 py-1 rounded-lg bg-[#008080] text-white text-xs font-bold">
                    सक्रिय दशा: {trTerm(openedKundli.currentDasha.mahaDasha, currentLang)} - {trTerm(openedKundli.currentDasha.antarDasha, currentLang)} - {trTerm(openedKundli.currentDasha.pratyantarDasha, currentLang)}
                  </span>
                </div>

                <div className="divide-y divide-[#008080]/15">
                  {openedKundli.vimshottariDasha.map((maha, idx) => {
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
    );
  }

  // ==================== SAVED KUNDLIS LIST PAGE ====================
  return (
    <div className="space-y-4 mb-6">
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-6 border border-[#008080]/20 shadow-xs space-y-4">
        {/* Top Button Row: Back & Close Buttons on One Line at the Very Top */}
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
            <span>{dict.closePage || 'बंद करें'}</span>
          </button>
        </div>

        {/* Heading Section Placed Below the Top Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#008080]/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#008080] flex items-center justify-center text-white shrink-0">
              <List className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                सहेजी गई कुंडलियां ({savedCharts.length})
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                किसी भी सहेजी गई कुंडली पर क्लिक करके उसकी संपूर्ण कुंडली और विवरण देखें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToGenerator}
            className="px-3.5 py-1.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>नई कुंडली बनाएं</span>
          </button>
        </div>

        {savedCharts.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              अभी कोई कुंडली सहेजी नहीं गई है।
            </p>
            <button
              type="button"
              onClick={onNavigateToGenerator}
              className="px-4 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>नई कुंडली बनाएं व सहेजें</span>
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#008080]/15">
              {savedCharts
                .slice((currentPage - 1) * KUNDLIS_PER_PAGE, currentPage * KUNDLIS_PER_PAGE)
                .map((sc) => {
                  const lagnaName = RASHI_NAMES[(sc.lagnaSign - 1) % 12]?.hi || sc.avakahada.lagna;
                  const rashiName = RASHI_NAMES[(sc.chandraSign - 1) % 12]?.hi || sc.avakahada.rashi;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => handleOpenSavedKundli(sc)}
                      className="py-3.5 px-2 hover:bg-teal-50/60 dark:hover:bg-teal-950/25 transition flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#008080] transition">
                            {sc.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#008080]/15 text-[#008080] dark:text-teal-300 text-[10px] font-bold">
                            लग्न: {trTerm(lagnaName, currentLang)}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#FF7F33]/15 text-[#FF7F33] text-[10px] font-bold">
                            राशि: {trTerm(rashiName, currentLang)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          दिनांक: {formatToDdMmYyyy(sc.birthDate)} • समय: {sc.birthTime} • स्थान: {trTerm(sc.birthPlace, currentLang)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#008080] text-white text-xs font-bold">
                          <span>कुंडली खोलें</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteSavedChart(sc.id, e)}
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-red-500 transition cursor-pointer"
                          title="कुंडली हटाएं"
                          aria-label="सहेजी गई कुंडली हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalItems={savedCharts.length}
              pageSize={KUNDLIS_PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              itemLabel="सहेजी गई कुंडलियां"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SavedKundlisView;
