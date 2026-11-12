import React, { useMemo } from 'react';
import { Orbit, RefreshCw, Sparkles, Compass, X, ArrowLeft, Calendar, Shield, Award, AlertCircle } from 'lucide-react';
import { CURRENT_TRANSITS } from '../services/horoscopeService';
import { generateKundli, RASHI_NAMES } from '../services/astrologyEngine';
import { CITIES } from '../services/panchangEngine';
import { LanguageCode } from '../types';
import { DICTIONARY, trTerm } from '../i18n/translations';

interface GocharViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const GocharView: React.FC<GocharViewProps> = ({ currentLang, onClosePage, onGoBack }) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  const liveTransits = useMemo(() => {
    const nowIst = new Date(Date.now() + 5.5 * 3600 * 1000);
    const dateStr = nowIst.toISOString().split('T')[0];
    const timeStr = `${nowIst.getUTCHours().toString().padStart(2, '0')}:${nowIst.getUTCMinutes().toString().padStart(2, '0')}`;
    const nowChart = generateKundli(
      'गोचर कुंडली',
      dateStr,
      timeStr,
      CITIES[0].name,
      CITIES[0].lat,
      CITIES[0].lng
    );

    return CURRENT_TRANSITS.map((tr) => {
      const livePlanet = nowChart.planets.find(
        (p) =>
          p.hindiName === tr.planet ||
          (tr.planet === 'चंद्र' && p.hindiName === 'चन्द्र') ||
          (tr.planet === 'बृहस्पति' && p.hindiName === 'गुरु')
      );
      if (!livePlanet) return tr;

      const nextSignIdx = livePlanet.isRetrograde
        ? (livePlanet.signIndex + 11) % 12
        : (livePlanet.signIndex + 1) % 12;

      return {
        ...tr,
        currentSign: livePlanet.signHindiName,
        nextSign: RASHI_NAMES[nextSignIdx].hi,
        retrograde: livePlanet.isRetrograde,
        isCombust: livePlanet.isCombust,
        degree: `${livePlanet.degree}° ${livePlanet.minutes}' ${livePlanet.seconds}"`,
        nakshatra: `${livePlanet.nakshatra} (चरण ${livePlanet.pada})`,
        transitDate: `${livePlanet.degree}°${livePlanet.minutes}' (${livePlanet.nakshatra} - चरण ${livePlanet.pada})`
      };
    });
  }, []);

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header Card with Back and Close Buttons */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
        {/* Row 1: Back and Close Buttons */}
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

        {/* Row 2: Title and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center text-white shrink-0">
            <Orbit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {dict.grahGochar || 'नवग्रह गोचर एवं राशि परिवर्तन'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              सभी 9 ग्रहों की वास्तविक वर्तमान स्थिति, स्पष्ट अंश, वक्री/मार्गी स्थिति, स्वराशि, उच्च-नीच अंश एवं राशि परिवर्तन विवरण
            </p>
          </div>
        </div>
      </div>

      {/* Planetary Cards Grid (All 9 Vedic Planets with High Precision) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveTransits.map((tr, idx) => {
          const isRetro = tr.retrograde;
          const isCombust = (tr as any).isCombust;
          const motionText = isCombust ? 'अस्त' : isRetro ? 'वक्री' : 'मार्गी';

          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs hover:border-[#008080] transition flex flex-col justify-between gap-3"
            >
              <div className="space-y-3">
                {/* Header: Planet Name, Lord, Motion Status */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#008080]/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {trTerm(tr.planet, currentLang).slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        {tr.hindiName}
                      </h2>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        ग्रह: {tr.planet}
                      </span>
                    </div>
                  </div>

                  {/* Motion Badge: वक्री / मार्गी / अस्त */}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                      isCombust
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : isRetro
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{motionText}</span>
                  </span>
                </div>

                {/* Current Sign & Exact Degrees */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#008080]/10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">वर्तमान राशि</span>
                    <span className="text-sm font-extrabold text-[#008080] dark:text-teal-400">
                      {trTerm(tr.currentSign, currentLang)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">स्पष्ट अंश व नक्षत्र</span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {tr.transitDate}
                    </span>
                  </div>
                </div>

                {/* Swarashi, Uchha Rashi, Neech Rashi with Exact Degrees */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#008080]/10">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#008080]" /> स्वराशि:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {tr.swarashi}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#008080]/10">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600" /> उच्च राशि (परमोच्च अंश):
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {tr.uchhaRashi}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] py-1 border-b border-[#008080]/10">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-rose-500" /> नीच राशि (परमनीच अंश):
                    </span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {tr.neechRashi}
                    </span>
                  </div>

                  {/* Next Sign & Change Date */}
                  <div className="flex items-center justify-between text-[11px] py-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#FF7F33]" /> आगामी राशि परिवर्तन:
                    </span>
                    <span className="font-bold text-[#FF7F33]">
                      {trTerm(tr.nextSign, currentLang)} ({tr.transitChangeDate || tr.transitDate})
                    </span>
                  </div>
                </div>

                {/* Astrological Impact Summary */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-[#008080]/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7F33] inline mr-1" />
                  {tr.impactSummary}
                </p>
              </div>

              {/* Auspicious Rashis */}
              <div className="pt-2.5 border-t border-[#008080]/10 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#008080]" /> शुभ राशियां:
                </span>
                <span className="font-bold text-[#008080] dark:text-teal-300">
                  {tr.auspiciousRashis.map((r) => trTerm(r, currentLang)).join(', ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GocharView;
