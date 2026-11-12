import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ScrollText,
  Type,
  Library,
  ArrowRight
} from 'lucide-react';
import {
  GYAN_DEPARTMENTS,
  INITIAL_GYAN_ITEMS,
  GyanDepartmentId,
  GyanContentItem,
  isItemBookmarked,
  togglePersonalLibraryBookmark,
  recordReadingHistory
} from '../services/sanatanPlatformService';

interface GyanVibhagViewProps {
  onNavigate?: (page: string) => void;
  language?: 'hi' | 'en';
}

export const GyanVibhagView: React.FC<GyanVibhagViewProps> = ({
  onNavigate,
  language = 'hi'
}) => {
  const [selectedDept, setSelectedDept] = useState<GyanDepartmentId | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<GyanContentItem | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkTrigger, setBookmarkTrigger] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const items = useMemo(() => {
    try {
      const wpRaw = localStorage.getItem('jyotishwala_wp_sync_cache_v1');
      if (wpRaw) {
        const parsed = JSON.parse(wpRaw);
        if (Array.isArray(parsed?.knowledge) && parsed.knowledge.length > 0) {
          return [...parsed.knowledge, ...INITIAL_GYAN_ITEMS];
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_GYAN_ITEMS;
  }, []);

  const currentDepartmentObj = useMemo(
    () => GYAN_DEPARTMENTS.find((d) => d.id === selectedDept),
    [selectedDept]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedDept !== 'all' && item.department !== selectedDept) return false;
      if (
        selectedSubcategory !== 'all' &&
        item.category !== selectedSubcategory &&
        item.subcategory !== selectedSubcategory
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.titleHi.toLowerCase().includes(q) ||
          item.titleEn.toLowerCase().includes(q) ||
          item.sanskritText.toLowerCase().includes(q) ||
          item.meaningHi.toLowerCase().includes(q) ||
          item.commentaryHi.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some((t: string) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [items, selectedDept, selectedSubcategory, searchQuery]);

  useEffect(() => {
    if (activeItem) {
      recordReadingHistory({
        itemType: 'shastra',
        title: activeItem.titleHi,
        subtitle: `${activeItem.departmentLabelHi} • ${activeItem.sourceReference}`,
        targetPage: 'gyan'
      });
    }
  }, [activeItem]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const handleBookmark = (item: GyanContentItem) => {
    const res = togglePersonalLibraryBookmark({
      itemType: 'shloka',
      refId: item.id,
      title: item.titleHi,
      subtitle: `${item.departmentLabelHi} • ${item.sourceReference}`,
      sanskritOrContent: item.sanskritText,
      meaningOrNotes: `${item.meaningHi}\n\nभाष्य: ${item.commentaryHi}`
    });
    setBookmarkTrigger((prev) => prev + 1);
    showToast(
      res.added
        ? 'मेरा पुस्तकालय (Personal Library) में सहेजा गया!'
        : 'मेरा पुस्तकालय से हटाया गया।'
    );
  };

  const handleCopy = (item: GyanContentItem) => {
    const text = `${item.titleHi}\n\n${item.sanskritText}\n\nहिंदी अर्थ: ${item.meaningHi}\n\nसंदर्भ: ${item.sourceReference}\n— JyotishWala सनातन ज्ञान विभाग`;
    navigator.clipboard?.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('श्लोक एवं अर्थ क्लिपबोर्ड पर कॉपी हो गया!');
  };

  const handleShare = async (item: GyanContentItem) => {
    const shareText = `📖 ${item.titleHi}\n\n${item.sanskritText}\n\nअर्थ: ${item.meaningHi}\n(${item.sourceReference})`;
    if (navigator.share) {
      try {
        await navigator.share({ title: item.titleHi, text: shareText });
        return;
      } catch {
        // fallback to copy
      }
    }
    handleCopy(item);
  };

  const activeIndex = useMemo(() => {
    if (!activeItem) return -1;
    return filteredItems.findIndex((i) => i.id === activeItem.id);
  }, [activeItem, filteredItems]);

  const fontSizeClass =
    fontSize === 'sm'
      ? 'text-sm leading-relaxed'
      : fontSize === 'lg'
      ? 'text-xl leading-loose'
      : 'text-base leading-relaxed';

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#008080] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 border border-white/20">
          <Sparkles className="w-4 h-4 text-[#FF7F33]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-[#008080] via-[#006666] to-[#004d4d] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 text-[11px] font-bold tracking-wide mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#FF7F33]" />
              <span>सनातन शास्त्र एवं स्वाध्याय केंद्र</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold leading-snug">
              {language === 'en'
                ? 'Complete Knowledge Section (Shastra Library)'
                : 'संपूर्ण ज्ञान विभाग (वेद, उपनिषद, गीता, पुराण व दर्शन)'}
            </h1>
            <p className="text-xs text-teal-100 mt-1">
              प्रामाणिक संस्कृत मूल पाठ, अन्वय, हिंदी-अंग्रेजी भावार्थ एवं शास्त्रीय व्याख्या
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {onNavigate && (
              <button
                onClick={() => onNavigate('library')}
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Library className="w-3.5 h-3.5 text-[#FF7F33]" />
                <span>मेरा पुस्तकालय</span>
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('articles')}
                className="px-3 py-2 rounded-xl bg-[#FF7F33] hover:bg-[#e66a22] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>वेबसाइट लेख</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* If Reader Detail View is open */}
      {activeItem ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
          {/* Top Reader Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]">
            <button
              onClick={() => setActiveItem(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008080] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>सभी शास्त्र अध्यायों पर वापस जाएं</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Font size control */}
              <div className="inline-flex items-center bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg p-0.5">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    fontSize === 'sm' ? 'bg-[#008080] text-white' : 'text-[var(--text-muted)]'
                  }`}
                  title="छोटा फ़ॉन्ट"
                >
                  अ-
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    fontSize === 'md' ? 'bg-[#008080] text-white' : 'text-[var(--text-muted)]'
                  }`}
                  title="सामान्य फ़ॉन्ट"
                >
                  <Type className="w-3.5 h-3.5 inline" />
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 rounded text-sm font-bold ${
                    fontSize === 'lg' ? 'bg-[#008080] text-white' : 'text-[var(--text-muted)]'
                  }`}
                  title="बड़ा फ़ॉन्ट"
                >
                  अ+
                </button>
              </div>

              <button
                onClick={() => handleBookmark(activeItem)}
                data-trigger={bookmarkTrigger}
                className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                  isItemBookmarked(activeItem.id)
                    ? 'bg-[#FF7F33]/15 border-[#FF7F33] text-[#FF7F33]'
                    : 'border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#008080]'
                }`}
              >
                {isItemBookmarked(activeItem.id) ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isItemBookmarked(activeItem.id) ? 'सहेजा गया' : 'सहेजें'}
                </span>
              </button>

              <button
                onClick={() => handleCopy(activeItem)}
                className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#008080] text-xs font-bold flex items-center gap-1"
              >
                {copiedId === activeItem.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => handleShare(activeItem)}
                className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#008080] text-xs font-bold flex items-center gap-1"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metadata Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#008080]/10 text-[#008080] text-[11px] font-bold">
                {activeItem.departmentLabelHi}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#FF7F33]/15 text-[#FF7F33] text-[11px] font-bold">
                {activeItem.category}
              </span>
              {activeItem.chapterOrSection && (
                <span className="text-[11px] text-[var(--text-muted)] font-semibold">
                  • {activeItem.chapterOrSection}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)]">
              {activeItem.titleHi}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{activeItem.titleEn}</p>
          </div>

          {/* Original Sanskrit Box */}
          <div className="bg-gradient-to-br from-[#FF7F33]/10 via-amber-500/5 to-[#008080]/10 border-l-4 border-[#FF7F33] rounded-xl p-4 sm:p-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF7F33] mb-2">
              मूल संस्कृत पाठ / मंत्र (Original Sanskrit Verse)
            </div>
            <p
              className={`font-bold text-[var(--text-main)] whitespace-pre-line ${fontSizeClass}`}
            >
              {activeItem.sanskritText}
            </p>
            {activeItem.transliteration && (
              <p className="text-xs italic text-[var(--text-muted)] mt-3 pt-2 border-t border-[var(--border-color)]">
                {activeItem.transliteration}
              </p>
            )}
          </div>

          {/* Hindi Translation */}
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#008080] uppercase tracking-wider">
              हिंदी अनुवाद एवं भावार्थ (Hindi Meaning)
            </h3>
            <p className={`text-[var(--text-main)] whitespace-pre-line ${fontSizeClass}`}>
              {activeItem.meaningHi}
            </p>
          </div>

          {/* English Meaning if available */}
          {activeItem.meaningEn && (
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-1.5">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                English Translation
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {activeItem.meaningEn}
              </p>
            </div>
          )}

          {/* Detailed Shastric Commentary */}
          <div className="bg-[#008080]/5 border border-[#008080]/20 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#008080] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF7F33]" />
              <span>शास्त्रीय भाष्य, व्याख्या एवं सार (Detailed Commentary)</span>
            </h3>
            <p className={`text-[var(--text-main)] whitespace-pre-line ${fontSizeClass}`}>
              {activeItem.commentaryHi}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)] border-t border-[#008080]/15">
              <span>
                <strong>प्रामाणिक शास्त्र संदर्भ:</strong> {activeItem.sourceReference}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Previous / Next Navigation */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border-color)]">
            <button
              disabled={activeIndex <= 0}
              onClick={() => activeIndex > 0 && setActiveItem(filteredItems[activeIndex - 1])}
              className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 hover:border-[#008080] text-[var(--text-main)]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>पिछला अध्याय / श्लोक</span>
            </button>
            <span className="text-xs text-[var(--text-muted)] font-semibold">
              {activeIndex + 1} / {filteredItems.length}
            </span>
            <button
              disabled={activeIndex < 0 || activeIndex >= filteredItems.length - 1}
              onClick={() =>
                activeIndex < filteredItems.length - 1 &&
                setActiveItem(filteredItems[activeIndex + 1])
              }
              className="px-3.5 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 hover:bg-[#006666]"
            >
              <span>अगला अध्याय / श्लोक</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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
              placeholder="वेद, उपनिषद, गीता अध्याय, पुराण, रामायण, दर्शन या श्लोक खोजें..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] focus:outline-none focus:border-[#008080]"
            />
          </div>

          {/* 7 Department Cards / Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => {
                setSelectedDept('all');
                setSelectedSubcategory('all');
              }}
              className={`p-3 rounded-xl border text-left transition ${
                selectedDept === 'all'
                  ? 'bg-[#008080] text-white border-[#008080] shadow-sm'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-main)] hover:border-[#008080]/50'
              }`}
            >
              <div className="text-xs font-bold">संपूर्ण शास्त्र (सभी ७ विभाग)</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  selectedDept === 'all' ? 'text-teal-100' : 'text-[var(--text-muted)]'
                }`}
              >
                कुल {items.length} प्रामाणिक ग्रंथ प्रविष्टियाँ
              </div>
            </button>

            {GYAN_DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => {
                    setSelectedDept(dept.id);
                    setSelectedSubcategory('all');
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-[#008080] text-white border-[#008080] shadow-sm'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-main)] hover:border-[#008080]/50'
                  }`}
                >
                  <div className="text-xs font-bold line-clamp-1">{dept.titleHi}</div>
                  <div
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-teal-100' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {dept.subtitleHi}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Subcategory Filter Chips when a specific department is selected */}
          {currentDepartmentObj && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[#008080]">
                    {currentDepartmentObj.titleHi}
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {currentDepartmentObj.subtitleHi}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedSubcategory === 'all'
                      ? 'bg-[#FF7F33] text-white'
                      : 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)]'
                  }`}
                >
                  सभी उप-विभाग
                </button>
                {currentDepartmentObj.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      selectedSubcategory === sub
                        ? 'bg-[#FF7F33] text-white'
                        : 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)]'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Cards List */}
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-[#008080] mx-auto opacity-60" />
                <p className="text-sm font-bold text-[var(--text-main)]">
                  इस श्रेणी या खोज शब्द में कोई प्रविष्टि नहीं मिली।
                </p>
                <button
                  onClick={() => {
                    setSelectedDept('all');
                    setSelectedSubcategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#008080] text-white text-xs font-bold"
                >
                  सभी शास्त्र देखें
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const saved = isItemBookmarked(item.id);
                return (
                  <div
                    key={item.id}
                    data-trigger={bookmarkTrigger}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#008080]/50 rounded-2xl p-4 shadow-sm transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded bg-[#008080]/10 text-[#008080] text-[10px] font-bold">
                            {item.departmentLabelHi}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#FF7F33]/15 text-[#FF7F33] text-[10px] font-bold">
                            {item.category}
                          </span>
                          {item.chapterOrSection && (
                            <span className="text-[10px] text-[var(--text-muted)] font-medium">
                              • {item.chapterOrSection}
                            </span>
                          )}
                        </div>
                        <h3
                          onClick={() => setActiveItem(item)}
                          className="text-sm sm:text-base font-bold text-[var(--text-main)] hover:text-[#008080] cursor-pointer"
                        >
                          {item.titleHi}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleBookmark(item)}
                        className={`p-2 rounded-lg border transition shrink-0 ${
                          saved
                            ? 'bg-[#FF7F33]/15 border-[#FF7F33] text-[#FF7F33]'
                            : 'border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#008080]'
                        }`}
                        title="मेरा पुस्तकालय में सहेजें"
                      >
                        {saved ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Sanskrit Preview */}
                    <div
                      onClick={() => setActiveItem(item)}
                      className="bg-[var(--bg-main)] border-l-4 border-[#FF7F33] rounded-lg p-3 cursor-pointer"
                    >
                      <p className="text-xs sm:text-sm font-bold text-[var(--text-main)] line-clamp-3 whitespace-pre-line">
                        {item.sanskritText}
                      </p>
                    </div>

                    {/* Meaning Preview */}
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      <strong className="text-[var(--text-main)]">भावार्थ: </strong>
                      {item.meaningHi}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                      <span className="text-[11px] text-[var(--text-muted)] font-medium">
                        संदर्भ: {item.sourceReference}
                      </span>
                      <button
                        onClick={() => setActiveItem(item)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#008080] hover:text-[#FF7F33] transition"
                      >
                        <span>संपूर्ण पाठ एवं भाष्य पढ़ें</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
