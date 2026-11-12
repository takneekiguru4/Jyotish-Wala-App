import React, { useState, useMemo, useEffect } from 'react';
import {
  Flame,
  Search,
  Bookmark,
  BookmarkCheck,
  Printer,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Sparkles,
  CalendarPlus,
  ListChecks,
  ScrollText
} from 'lucide-react';
import {
  PUJA_CATEGORIES,
  INITIAL_PUJA_VIDHIS,
  PujaVidhiItem,
  isItemBookmarked,
  togglePersonalLibraryBookmark,
  recordReadingHistory
} from '../services/sanatanPlatformService';

interface PujaKarmakandViewProps {
  onNavigate?: (page: string) => void;
  language?: 'hi' | 'en';
}

export const PujaKarmakandView: React.FC<PujaKarmakandViewProps> = ({
  onNavigate,
  language = 'hi'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePuja, setActivePuja] = useState<PujaVidhiItem | null>(null);
  const [checkedSamagri, setCheckedSamagri] = useState<Record<string, boolean>>({});
  const [bookmarkTrigger, setBookmarkTrigger] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const pujas = useMemo(() => {
    try {
      const wpRaw = localStorage.getItem('jyotishwala_wp_sync_cache_v1');
      if (wpRaw) {
        const parsed = JSON.parse(wpRaw);
        if (Array.isArray(parsed?.pujas) && parsed.pujas.length > 0) {
          return [...parsed.pujas, ...INITIAL_PUJA_VIDHIS];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PUJA_VIDHIS;
  }, []);

  const filteredPujas = useMemo(() => {
    return pujas.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.titleHi.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.introductionHi.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pujas, selectedCategory, searchQuery]);

  useEffect(() => {
    if (activePuja) {
      recordReadingHistory({
        itemType: 'puja',
        title: activePuja.titleHi,
        subtitle: `${activePuja.category} • अवधि: ${activePuja.duration}`,
        targetPage: 'puja'
      });
    }
  }, [activePuja]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const handleBookmark = (puja: PujaVidhiItem) => {
    const res = togglePersonalLibraryBookmark({
      itemType: 'puja',
      refId: puja.id,
      title: puja.titleHi,
      subtitle: `${puja.category} • अवधि: ${puja.duration}`,
      sanskritOrContent: puja.sankalpaMantra,
      meaningOrNotes: `${puja.introductionHi}\n\nपूजन सामग्री: ${puja.samagriList.join(', ')}`
    });
    setBookmarkTrigger((prev) => prev + 1);
    showToast(
      res.added
        ? 'पूजा विधि "मेरा पुस्तकालय" में सहेजी गई!'
        : 'मेरा पुस्तकालय से हटाई गई।'
    );
  };

  const toggleSamagriItem = (itemText: string) => {
    setCheckedSamagri((prev) => ({ ...prev, [itemText]: !prev[itemText] }));
  };

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#008080] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF7F33]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FF7F33] via-[#e56b20] to-[#008080] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 text-[11px] font-bold mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>वैदिक कर्मकांड एवं षोडशोपचार पूजन पद्धति</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {language === 'en'
                ? 'Puja & Vedic Karmakand Procedures'
                : 'पूजा एवं वैदिक कर्मकांड विधि (१९ श्रेणियाँ)'}
            </h1>
            <p className="text-xs text-orange-50 mt-1">
              पूजन सामग्री, तैयारी, संकल्प, संस्कृत मंत्र, हिंदी अर्थ, क्रमबद्ध विधि एवं आरती
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {onNavigate && (
              <button
                onClick={() => onNavigate('puja_booking')}
                className="px-3.5 py-2 rounded-xl bg-white text-[#008080] hover:bg-teal-50 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <CalendarPlus className="w-4 h-4 text-[#FF7F33]" />
                <span>पंडित / पूजा बुक करें</span>
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('sankalp')}
                className="px-3 py-2 rounded-xl bg-black/25 hover:bg-black/35 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>संकल्प पत्र</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {activePuja ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]">
            <button
              onClick={() => setActivePuja(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008080] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>सभी पूजा विधियों पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBookmark(activePuja)}
                data-trigger={bookmarkTrigger}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition ${
                  isItemBookmarked(activePuja.id)
                    ? 'bg-[#FF7F33]/15 border-[#FF7F33] text-[#FF7F33]'
                    : 'border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#008080]'
                }`}
              >
                {isItemBookmarked(activePuja.id) ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span>{isItemBookmarked(activePuja.id) ? 'सहेजा गया' : 'सहेजें'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-main)] hover:border-[#008080] text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#008080]" />
                <span>प्रिंट / PDF</span>
              </button>
            </div>
          </div>

          {/* Title & Meta */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FF7F33]/15 text-[#FF7F33] text-xs font-bold">
                {activePuja.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#008080] font-bold">
                <Clock className="w-3.5 h-3.5" />
                अनुमानित समय: {activePuja.duration}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)]">
              {activePuja.titleHi}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">{activePuja.titleEn}</p>
          </div>

          {/* 1. Introduction & Significance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[#008080]">१. पूजा परिचय (Introduction)</h3>
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {activePuja.introductionHi}
              </p>
            </div>
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[#FF7F33]">
                २. शास्त्रीय महत्त्व एवं फलश्रुति (Significance)
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {activePuja.significanceHi}
              </p>
            </div>
          </div>

          {/* 3. Preparation */}
          <div className="bg-[#008080]/5 border border-[#008080]/20 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#008080]">
              ३. पूजा पूर्व तैयारी एवं वेदी नियम (Preparation)
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-main)]">
              {activePuja.preparationHi.map((prep, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#008080] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{prep}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Interactive Samagri Checklist */}
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-[#FF7F33]" />
                <span>४. आवश्यक पूजन सामग्री सूची (टैप करके चेकलिस्ट बनाएं)</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activePuja.samagriList.map((samagri, idx) => {
                const isDone = !!checkedSamagri[samagri];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSamagriItem(samagri)}
                    className={`p-2.5 rounded-lg border text-left text-xs flex items-start gap-2 transition ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 line-through'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-main)]'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDone ? 'text-emerald-600' : 'text-[var(--text-muted)]'
                      }`}
                    />
                    <span>{samagri}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Sankalpa Mantra */}
          <div className="bg-gradient-to-r from-[#FF7F33]/10 to-[#008080]/10 border-l-4 border-[#008080] rounded-xl p-4 space-y-1.5">
            <h3 className="text-xs font-bold text-[#008080]">
              ५. प्रधान संकल्प वाक्य (हाथ में जल, अक्षत, पुष्प व दक्षिणा लेकर बोलें)
            </h3>
            <p className="text-sm font-bold text-[var(--text-main)] leading-relaxed">
              {activePuja.sankalpaMantra}
            </p>
          </div>

          {/* 6. Step-by-Step Procedure with Sanskrit Mantras & Hindi Meaning */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              ६. क्रमबद्ध पूजन विधि, संस्कृत मंत्र एवं हिंदी अर्थ
            </h3>
            {activePuja.steps.map((step) => (
              <div
                key={step.stepNo}
                className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#008080] text-white text-xs font-bold">
                    सोपान {step.stepNo}
                  </span>
                  <h4 className="text-sm font-bold text-[var(--text-main)]">{step.titleHi}</h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {step.instructionHi}
                </p>
                <div className="bg-[var(--bg-card)] border-l-4 border-[#FF7F33] rounded-lg p-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#FF7F33] uppercase">संस्कृत मंत्र</div>
                  <p className="text-xs sm:text-sm font-bold text-[var(--text-main)] whitespace-pre-line leading-relaxed">
                    {step.sanskritMantra}
                  </p>
                </div>
                <p className="text-xs text-[var(--text-main)] bg-[#008080]/5 p-2.5 rounded-lg">
                  <strong className="text-[#008080]">मंत्र भावार्थ: </strong>
                  {step.meaningHi}
                </p>
              </div>
            ))}
          </div>

          {/* 7. Aarti & Conclusion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#FF7F33]/10 border border-[#FF7F33]/30 rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[#FF7F33]">७. आरती (Aarti)</h3>
              <p className="text-xs sm:text-sm font-bold text-[var(--text-main)] whitespace-pre-line leading-relaxed">
                {activePuja.aartiHi}
              </p>
            </div>
            <div className="bg-[#008080]/10 border border-[#008080]/30 rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[#008080]">
                ८. क्षमा प्रार्थना एवं विसर्जन/समापन (Conclusion)
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {activePuja.conclusionHi}
              </p>
            </div>
          </div>

          {/* CTA to Book a Pandit for this Puja */}
          {onNavigate && (
            <div className="bg-gradient-to-r from-[#008080] to-[#006666] rounded-xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold">
                  क्या आप "{activePuja.titleHi}" हेतु अनुभवी वैदिक आचार्य बुक करना चाहते हैं?
                </h4>
                <p className="text-xs text-teal-100 mt-0.5">
                  ऑनलाइन संकल्प अथवा अपने गृह पर विधिवत अनुष्ठान के लिए यजमान बुकिंग करें।
                </p>
              </div>
              <button
                onClick={() => onNavigate('puja_booking')}
                className="px-4 py-2 rounded-xl bg-[#FF7F33] hover:bg-[#e56b20] text-white text-xs font-bold shrink-0 shadow-sm"
              >
                अभी पूजा बुक करें
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="गणेश पूजा, रुद्राभिषेक, सत्यनारायण, गृह प्रवेश, नवग्रह शांति या तर्पण खोजें..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] focus:outline-none focus:border-[#008080]"
            />
          </div>

          {/* 19 Categories Horizontal / Wrap Chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-[#008080] text-white shadow-sm'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[#008080]'
              }`}
            >
              सभी १९ श्रेणियाँ
            </button>
            {PUJA_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#FF7F33] text-white shadow-sm'
                    : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[#FF7F33]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Puja Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPujas.map((puja) => {
              const saved = isItemBookmarked(puja.id);
              return (
                <div
                  key={puja.id}
                  data-trigger={bookmarkTrigger}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#008080] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FF7F33]/15 text-[#FF7F33] text-[11px] font-bold">
                        {puja.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#008080] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {puja.duration}
                        </span>
                        <button
                          onClick={() => handleBookmark(puja)}
                          className={`p-1.5 rounded-lg border ${
                            saved
                              ? 'bg-[#FF7F33]/15 border-[#FF7F33] text-[#FF7F33]'
                              : 'border-[var(--border-color)] text-[var(--text-muted)]'
                          }`}
                        >
                          {saved ? (
                            <BookmarkCheck className="w-3.5 h-3.5" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3
                      onClick={() => setActivePuja(puja)}
                      className="text-base font-bold text-[var(--text-main)] hover:text-[#008080] cursor-pointer"
                    >
                      {puja.titleHi}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {puja.introductionHi}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {puja.steps.length} प्रमुख सोपान • {puja.samagriList.length} सामग्री समूह
                    </span>
                    <button
                      onClick={() => setActivePuja(puja)}
                      className="px-3 py-1.5 rounded-lg bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold transition"
                    >
                      संपूर्ण विधि देखें
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
