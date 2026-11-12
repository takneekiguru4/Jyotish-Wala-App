import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Search,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Compass,
  Sparkles,
  ExternalLink,
  Landmark
} from 'lucide-react';
import {
  TEMPLE_CATEGORIES,
  INITIAL_TEMPLES,
  TempleTirthaItem,
  isItemBookmarked,
  togglePersonalLibraryBookmark,
  recordReadingHistory
} from '../services/sanatanPlatformService';

interface TemplesTirthaViewProps {
  language?: 'hi' | 'en';
}

export const TemplesTirthaView: React.FC<TemplesTirthaViewProps> = ({ language = 'hi' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemple, setActiveTemple] = useState<TempleTirthaItem | null>(null);
  const [bookmarkTrigger, setBookmarkTrigger] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const temples = useMemo(() => {
    try {
      const wpRaw = localStorage.getItem('jyotishwala_wp_sync_cache_v1');
      if (wpRaw) {
        const parsed = JSON.parse(wpRaw);
        if (Array.isArray(parsed?.temples) && parsed.temples.length > 0) {
          return [...parsed.temples, ...INITIAL_TEMPLES];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_TEMPLES;
  }, []);

  const filteredTemples = useMemo(() => {
    return temples.filter((t) => {
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          t.nameHi.toLowerCase().includes(q) ||
          t.nameEn.toLowerCase().includes(q) ||
          t.cityStateHi.toLowerCase().includes(q) ||
          t.deityHi.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [temples, selectedCategory, searchQuery]);

  useEffect(() => {
    if (activeTemple) {
      recordReadingHistory({
        itemType: 'temple',
        title: activeTemple.nameHi,
        subtitle: `${activeTemple.category} • ${activeTemple.cityStateHi}`,
        targetPage: 'temples'
      });
    }
  }, [activeTemple]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleBookmark = (temple: TempleTirthaItem) => {
    const res = togglePersonalLibraryBookmark({
      itemType: 'temple',
      refId: temple.id,
      title: temple.nameHi,
      subtitle: `${temple.category} • ${temple.cityStateHi}`,
      sanskritOrContent: `आराध्य: ${temple.deityHi}\nदर्शन/आरती समय: ${temple.verifiedDarshanTimingsHi}`,
      meaningOrNotes: `${temple.religiousSignificanceHi}\nपता: ${temple.addressHi}`
    });
    setBookmarkTrigger((prev) => prev + 1);
    showToast(
      res.added
        ? 'तीर्थ/मंदिर विवरण "मेरा पुस्तकालय" में सहेजा गया!'
        : 'मेरा पुस्तकालय से हटाया गया।'
    );
  };

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#008080] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF7F33]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#008080] via-[#005959] to-[#FF7F33] rounded-2xl p-5 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 text-[11px] font-bold mb-2">
          <Landmark className="w-3.5 h-3.5" />
          <span>भारतवर्ष के पावन मंदिर, ज्योतिर्लिंग, चार धाम एवं सप्त तीर्थ</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">
          {language === 'en'
            ? 'Temples & Sacred Tirtha Directory'
            : 'मंदिर एवं तीर्थ डायरेक्टरी (द्वादश ज्योतिर्लिंग, चार धाम व शक्तिपीठ)'}
        </h1>
        <p className="text-xs text-teal-50 mt-1">
          पौराणिक इतिहास, आराध्य स्वरूप, सत्यापित दर्शन-आरती समय एवं भौगोलिक निर्देशांक
        </p>
      </div>

      {activeTemple ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
          {/* Banner Image */}
          <div className="relative h-52 sm:h-64 bg-slate-900">
            <img
              src={activeTemple.imageUrl}
              alt={activeTemple.nameHi}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <button
                onClick={() => setActiveTemple(null)}
                className="px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs font-bold flex items-center gap-1 backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>वापस जाएं</span>
              </button>
              <button
                onClick={() => handleBookmark(activeTemple)}
                data-trigger={bookmarkTrigger}
                className="px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm"
              >
                {isItemBookmarked(activeTemple.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-[#FF7F33]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span>{isItemBookmarked(activeTemple.id) ? 'सहेजा गया' : 'सहेजें'}</span>
              </button>
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="px-2.5 py-0.5 rounded bg-[#FF7F33] text-white text-[11px] font-bold">
                {activeTemple.category}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold mt-1">{activeTemple.nameHi}</h2>
              <p className="text-xs text-teal-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF7F33]" />
                {activeTemple.cityStateHi}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Deity & Verified Timings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#008080]/10 border border-[#008080]/25 rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-[#008080] uppercase">
                  आराध्य भगवान / अधिष्ठात्री शक्ति
                </div>
                <div className="text-sm font-bold text-[var(--text-main)] mt-1">
                  {activeTemple.deityHi}
                </div>
              </div>
              <div className="bg-[#FF7F33]/10 border border-[#FF7F33]/25 rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-[#FF7F33] uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  सत्यापित दर्शन एवं आरती समय (Verified Timings)
                </div>
                <div className="text-xs font-semibold text-[var(--text-main)] mt-1 leading-relaxed">
                  {activeTemple.verifiedDarshanTimingsHi}
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[#008080]">१. तीर्थ एवं मंदिर परिचय</h3>
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {activeTemple.introductionHi}
              </p>
            </div>

            {/* Religious Significance */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[#FF7F33]">
                २. शास्त्रीय एवं पौराणिक माहात्म्य (Religious Significance)
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {activeTemple.religiousSignificanceHi}
              </p>
            </div>

            {/* History & Architecture */}
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[#008080]">३. ऐतिहासिक विवरण एवं स्थापत्य</h3>
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {activeTemple.historyHi}
              </p>
            </div>

            {/* Location & Coordinates */}
            <div className="bg-[#008080]/5 border border-[#008080]/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#008080]" />
                  <span>पता: {activeTemple.addressHi}</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  भौगोलिक निर्देशांक (Coordinates): {activeTemple.latitude.toFixed(4)}° N,{' '}
                  {activeTemple.longitude.toFixed(4)}° E
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeTemple.latitude},${activeTemple.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-center"
              >
                <span>मानचित्र (Map) में देखें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
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
              placeholder="काशी विश्वनाथ, केदारनाथ, बद्रीनाथ, अयोध्या, कामाख्या, ऋषिकेश या माँ गंगा खोजें..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] focus:outline-none focus:border-[#008080]"
            />
          </div>

          {/* 8 Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-[#008080] text-white'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
              }`}
            >
              सभी ८ श्रेणियाँ
            </button>
            {TEMPLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#FF7F33] text-white'
                    : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Temple Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemples.map((temple) => {
              const saved = isItemBookmarked(temple.id);
              return (
                <div
                  key={temple.id}
                  data-trigger={bookmarkTrigger}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#008080] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition"
                >
                  <div>
                    <div
                      onClick={() => setActiveTemple(temple)}
                      className="relative h-40 bg-slate-900 cursor-pointer"
                    >
                      <img
                        src={temple.imageUrl}
                        alt={temple.nameHi}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#FF7F33] text-white text-[10px] font-bold">
                        {temple.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(temple);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 text-white"
                      >
                        {saved ? (
                          <BookmarkCheck className="w-4 h-4 text-[#FF7F33]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <h3 className="text-sm sm:text-base font-bold line-clamp-1">
                          {temple.nameHi}
                        </h3>
                        <p className="text-[11px] text-teal-100 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF7F33]" />
                          {temple.cityStateHi}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <div className="text-xs font-bold text-[#008080]">{temple.deityHi}</div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                        {temple.introductionHi}
                      </p>
                      <div className="text-[11px] text-[var(--text-main)] bg-[var(--bg-main)] p-2 rounded-lg line-clamp-1">
                        <Clock className="w-3 h-3 inline mr-1 text-[#FF7F33]" />
                        {temple.verifiedDarshanTimingsHi}
                      </div>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3.5 flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {temple.latitude.toFixed(2)}°N, {temple.longitude.toFixed(2)}°E
                    </span>
                    <button
                      onClick={() => setActiveTemple(temple)}
                      className="px-3 py-1.5 rounded-lg bg-[#008080] text-white text-xs font-bold hover:bg-[#006666]"
                    >
                      दर्शन व माहात्म्य देखें
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
