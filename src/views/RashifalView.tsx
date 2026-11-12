import React, { useState, useEffect } from 'react';
import { Sparkles, Briefcase, Heart, Activity, Coins, ShieldCheck, X, ArrowLeft } from 'lucide-react';
import { HoroscopePrediction, RashifalPeriod, LanguageCode } from '../types';
import { getHoroscopesByPeriod } from '../services/horoscopeService';
import { DICTIONARY, trTerm } from '../i18n/translations';

interface RashifalViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const RashifalView: React.FC<RashifalViewProps> = ({ currentLang, onClosePage, onGoBack }) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;
  const [period, setPeriod] = useState<RashifalPeriod>(() => {
    try {
      const saved = localStorage.getItem('jw_active_rashifal_period') as RashifalPeriod;
      if (saved && ['daily', 'monthly', 'yearly'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'daily';
  });
  const [horoscopes, setHoroscopes] = useState<HoroscopePrediction[]>(() => {
    try {
      const savedPeriod = (localStorage.getItem('jw_active_rashifal_period') as RashifalPeriod) || 'daily';
      return getHoroscopesByPeriod(savedPeriod);
    } catch {
      return getHoroscopesByPeriod('daily');
    }
  });
  const [selectedRashi, setSelectedRashi] = useState<HoroscopePrediction>(() => {
    try {
      const savedPeriod = (localStorage.getItem('jw_active_rashifal_period') as RashifalPeriod) || 'daily';
      const list = getHoroscopesByPeriod(savedPeriod);
      const savedIdx = localStorage.getItem('jw_active_rashi_idx');
      if (savedIdx !== null) {
        const idx = parseInt(savedIdx, 10);
        const match = list.find((r) => r.signIndex === idx);
        if (match) return match;
      }
      return list[0];
    } catch {
      return getHoroscopesByPeriod('daily')[0];
    }
  });

  useEffect(() => {
    const syncRashifal = () => {
      const list = getHoroscopesByPeriod(period);
      setHoroscopes(list);
      setSelectedRashi((prev) => list.find((r) => r.signIndex === prev.signIndex) || list[0]);
    };
    syncRashifal();
    window.addEventListener('jyotishwala_rashifal_changed', syncRashifal);
    return () => window.removeEventListener('jyotishwala_rashifal_changed', syncRashifal);
  }, [period]);

  return (
    <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-6 border border-[#008080]/20 shadow-xs space-y-5 mb-6">
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

      {/* Row 2: Title and Subtitle Below Navigation Buttons */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FF7F33] flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {period === 'daily'
              ? dict.dailyHoroscope
              : period === 'monthly'
              ? dict.monthlyHoroscope
              : dict.yearlyHoroscope}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            मेष से मीन तक 12 राशियों का सटीक फलादेश
          </p>
        </div>
      </div>

      {/* Period Selector: Dainik, Masik, Varshik */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl">
        <button
          onClick={() => setPeriod('daily')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
            period === 'daily'
              ? 'bg-[#008080] text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {dict.dailyHoroscope}
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
            period === 'monthly'
              ? 'bg-[#008080] text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {dict.monthlyHoroscope}
        </button>
        <button
          onClick={() => setPeriod('yearly')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
            period === 'yearly'
              ? 'bg-[#FF7F33] text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {dict.yearlyHoroscope}
        </button>
      </div>

      {/* 12 Zodiac Selector Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
        {horoscopes.map((rashi, idx) => {
          const isSelected = rashi.signIndex === selectedRashi.signIndex;
          return (
            <button
              key={`rashi_grid_${rashi.signIndex}_${idx}`}
              onClick={() => setSelectedRashi(rashi)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-[#008080] text-white border-[#008080] shadow-xs'
                  : 'bg-white dark:bg-[#112226] border-[#008080]/20 hover:border-[#008080] text-slate-800 dark:text-slate-200'
              }`}
            >
              <span className="text-xl">{rashi.symbol}</span>
              <span className="text-xs font-bold">{trTerm(rashi.hindiName, currentLang)}</span>
              <span className={`text-[10px] ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                {trTerm(rashi.ruler, currentLang)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Rashi Detailed Prediction (Flat Sections Inside Single Card — No Card Inside a Card) */}
      <div className="pt-4 border-t border-[#008080]/20 space-y-4">
        <div className="bg-[#008080] p-4 sm:p-5 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
              {selectedRashi.symbol}
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-teal-100">
                {period === 'daily'
                  ? dict.dailyHoroscope
                  : period === 'monthly'
                  ? dict.monthlyHoroscope
                  : dict.yearlyHoroscope}
              </span>
              <h2 className="text-lg sm:text-xl font-bold">{trTerm(selectedRashi.hindiName, currentLang)}</h2>
              <p className="text-xs text-teal-100 mt-0.5">
                स्वामी: {trTerm(selectedRashi.ruler, currentLang)} • तत्व: {selectedRashi.element}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-white/15">
              <span className="text-[10px] text-teal-100 block">शुभ अंक</span>
              <span className="text-xs font-bold">{selectedRashi.luckyNumber}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/15">
              <span className="text-[10px] text-teal-100 block">शुभ रंग</span>
              <span className="text-xs font-bold">{selectedRashi.luckyColor}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/15">
              <span className="text-[10px] text-teal-100 block">शुभ समय</span>
              <span className="text-xs font-bold">{selectedRashi.luckyTime}</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#008080]/15">
          <div className="pb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#008080] dark:text-teal-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> फलादेश
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {selectedRashi.general}
            </p>
          </div>

          <div className="py-3.5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#008080]" /> करियर एवं व्यवसाय
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedRashi.career}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#FF7F33]" /> आर्थिक स्थिति
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedRashi.finance}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> प्रेम एवं पारिवारिक जीवन
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedRashi.love}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" /> स्वास्थ्य
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedRashi.health}
              </p>
            </div>
          </div>

          <div className="pt-3.5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#FF7F33] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#FF7F33] block mb-0.5">
                ज्योतिषीय उपाय
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {selectedRashi.remedy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RashifalView;
