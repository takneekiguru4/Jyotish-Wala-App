import React, { useState, useEffect } from 'react';
import {
  Library,
  Bookmark,
  History,
  Trash2,
  GraduationCap,
  CalendarCheck,
  Receipt,
  StickyNote,
  Plus,
  Compass,
  Sparkles
} from 'lucide-react';
import {
  PersonalLibraryItem,
  ReadingHistoryEntry,
  getPersonalLibraryItems,
  removePersonalLibraryItem,
  togglePersonalLibraryBookmark,
  getReadingHistory,
  getSanskritProgress,
  getPujaBookings,
  BOOKING_STATUS_LABELS
} from '../services/sanatanPlatformService';
import { getUserPaymentReceipts } from '../services/astrologerService';

interface PersonalLibraryViewProps {
  onNavigate?: (page: string) => void;
  language?: 'hi' | 'en';
}

export const PersonalLibraryView: React.FC<PersonalLibraryViewProps> = ({
  onNavigate,
  language = 'hi'
}) => {
  const [activeTab, setActiveTab] = useState<
    'bookmarks' | 'history' | 'sanskrit' | 'bookings' | 'receipts' | 'notes'
  >('bookmarks');
  const [items, setItems] = useState<PersonalLibraryItem[]>(() => getPersonalLibraryItems());
  const [history, setHistory] = useState<ReadingHistoryEntry[]>(() => getReadingHistory());
  const [sanskritProgress] = useState(() => getSanskritProgress());
  const [bookings] = useState(() => getPujaBookings());
  const [receipts] = useState(() => getUserPaymentReceipts());

  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  useEffect(() => {
    const refresh = () => {
      setItems(getPersonalLibraryItems());
      setHistory(getReadingHistory());
    };
    window.addEventListener('jyotishwala_library_changed', refresh);
    return () => window.removeEventListener('jyotishwala_library_changed', refresh);
  }, []);

  const handleDelete = (id: string) => {
    removePersonalLibraryItem(id);
    setItems(getPersonalLibraryItems());
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteBody.trim()) return;
    togglePersonalLibraryBookmark({
      itemType: 'note',
      refId: `note_${Date.now()}`,
      title: noteTitle.trim(),
      subtitle: 'व्यक्तिगत स्वाध्याय नोट',
      sanskritOrContent: noteBody.trim()
    });
    setNoteTitle('');
    setNoteBody('');
    setItems(getPersonalLibraryItems());
  };

  const bookmarkedItems = items.filter((i) => i.itemType !== 'note');
  const personalNotes = items.filter((i) => i.itemType === 'note');

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#008080] via-[#006666] to-[#004d4d] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 text-[11px] font-bold mb-2">
              <Library className="w-3.5 h-3.5 text-[#FF7F33]" />
              <span>मेरा आध्यात्मिक संग्रह एवं स्वाध्याय रिकॉर्ड</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {language === 'en' ? 'My Personal Library' : 'मेरा पुस्तकालय (Personal Library)'}
            </h1>
            <p className="text-xs text-teal-100 mt-1">
              सहेजे गए श्लोक, मंत्र, पूजा विधियाँ, संकल्प पत्र, अध्ययन इतिहास, संस्कृत प्रगति एवं बुकिंग रसीदें
            </p>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('kundli')}
              className="px-3.5 py-2 rounded-xl bg-[#FF7F33] text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-center shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>जन्मकुंडली खोलें</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {(
          [
            { id: 'bookmarks', label: `बुकमार्क संग्रह (${bookmarkedItems.length})`, icon: Bookmark },
            { id: 'notes', label: `मेरे नोट्स (${personalNotes.length})`, icon: StickyNote },
            { id: 'history', label: `अध्ययन इतिहास (${history.length})`, icon: History },
            { id: 'sanskrit', label: 'संस्कृत प्रगति', icon: GraduationCap },
            { id: 'bookings', label: `पूजा बुकिंग (${bookings.length})`, icon: CalendarCheck },
            { id: 'receipts', label: `दक्षिणा रसीदें (${receipts.length})`, icon: Receipt }
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                isSelected
                  ? 'bg-[#008080] text-white shadow-sm'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarkedItems.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-[#008080] mx-auto opacity-60" />
              <p className="text-sm font-bold text-[var(--text-main)]">
                अभी आपके पुस्तकालय में कोई श्लोक, मंत्र, पूजा विधि या संकल्प पत्र सहेजा नहीं गया है।
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('gyan')}
                  className="px-4 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold"
                >
                  ज्ञान विभाग में स्वाध्याय करें
                </button>
              )}
            </div>
          ) : (
            bookmarkedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#008080]/10 text-[#008080] text-[10px] font-bold uppercase">
                      {item.itemType}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] mt-1">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-[11px] text-[var(--text-muted)]">{item.subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-[var(--bg-main)] border-l-4 border-[#FF7F33] rounded-lg p-3 text-xs sm:text-sm font-bold text-[var(--text-main)] whitespace-pre-line">
                  {item.sanskritOrContent}
                </div>

                {item.meaningOrNotes && (
                  <p className="text-xs text-[var(--text-muted)] whitespace-pre-line leading-relaxed">
                    {item.meaningOrNotes}
                  </p>
                )}

                <div className="text-[10px] text-[var(--text-muted)] pt-1">
                  सहेजा गया समय: {item.savedAt}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Personal Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <form
            onSubmit={handleAddNote}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 space-y-3"
          >
            <h3 className="text-xs font-bold text-[#008080] flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>नया आध्यात्मिक / स्वाध्याय नोट जोड़ें</span>
            </h3>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="नोट का शीर्षक (उदा. एकादशी व्रत संकल्प नियम)"
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
            />
            <textarea
              rows={3}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="अपना स्वाध्याय नोट, श्लोक या विचार यहाँ लिखें..."
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold"
            >
              नोट सहेजें
            </button>
          </form>

          {personalNotes.map((n) => (
            <div
              key={n.id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[var(--text-main)]">{n.title}</h4>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-rose-500 p-1 rounded hover:bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[var(--text-main)] whitespace-pre-line">
                {n.sanskritOrContent}
              </p>
              <div className="text-[10px] text-[var(--text-muted)]">{n.savedAt}</div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Reading History */}
      {activeTab === 'history' && (
        <div className="space-y-2.5">
          {history.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 text-center text-xs text-[var(--text-muted)]">
              अभी कोई अध्ययन इतिहास दर्ज नहीं है।
            </div>
          ) : (
            history.map((h) => (
              <div
                key={h.id}
                onClick={() => onNavigate && onNavigate(h.targetPage)}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#008080] rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                    {h.title}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">{h.subtitle}</div>
                </div>
                <span className="text-[10px] text-[#008080] font-semibold shrink-0">
                  {h.viewedAt}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Sanskrit Progress */}
      {activeTab === 'sanskrit' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7F33]" />
              <span>संस्कृत शिक्षा पाठ्यक्रम प्रगति</span>
            </h3>
            {onNavigate && (
              <button
                onClick={() => onNavigate('sanskrit')}
                className="px-3 py-1.5 rounded-lg bg-[#008080] text-white text-xs font-bold"
              >
                संस्कृत कक्षा खोलें
              </button>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            पूर्ण किए गए संस्कृत पाठ: <strong>{sanskritProgress.completedLessonIds.length}</strong>
          </p>
          <div className="space-y-2">
            {Object.entries(sanskritProgress.quizScores).map(([lessonId, s]) => (
              <div
                key={lessonId}
                className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between text-xs"
              >
                <span className="font-bold text-[var(--text-main)]">पाठ आईडी: {lessonId}</span>
                <span className="text-emerald-600 font-bold">
                  स्कोर: {s.score}/{s.total} ({s.completedAt})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {bookings.map((b) => {
            const statusMeta = BOOKING_STATUS_LABELS[b.status] || BOOKING_STATUS_LABELS.pending;
            return (
              <div
                key={b.id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-sm font-bold text-[var(--text-main)]">
                    {b.pujaServiceTitle} — {b.panditName}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    दिनांक: {b.preferredDate} ({b.preferredTime}) • यजमान: {b.yajmanName}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold self-start sm:self-center ${statusMeta.badgeClass}`}
                >
                  {statusMeta.hi}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Payment Receipts History */}
      {activeTab === 'receipts' && (
        <div className="space-y-3">
          {receipts.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 text-center text-xs text-[var(--text-muted)]">
              अभी कोई दक्षिणा भुगतान रसीद जमा नहीं की गई है।
            </div>
          ) : (
            receipts.map((r) => {
              const rcptStatus = (r as { status?: string }).status || 'pending';
              return (
                <div
                  key={r.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-sm font-bold text-[var(--text-main)]">
                      {r.panditName} — दक्षिणा: {r.amount}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      UTR/Ref: {r.utrNumber} • दिनांक: {r.submittedAt}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      rcptStatus === 'approved' || rcptStatus === 'verified'
                        ? 'bg-emerald-500/15 text-emerald-700'
                        : rcptStatus === 'rejected'
                        ? 'bg-rose-500/15 text-rose-700'
                        : 'bg-amber-500/15 text-amber-700'
                    }`}
                  >
                    {rcptStatus === 'approved' || rcptStatus === 'verified'
                      ? 'स्वीकृत / सत्यापित (Verified)'
                      : rcptStatus === 'rejected'
                      ? 'अस्वीकृत (Rejected)'
                      : 'सत्यापन लंबित (Pending Backend Verification)'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
