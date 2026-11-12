import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, UserCheck, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { Article, PanditProfile } from '../types';
import { getPandits } from '../services/astrologerService';
import { getArticles } from '../services/articleService';
import { getWpAppSettings, isFeatureModuleEnabled } from '../services/wpApiClient';
import {
  INITIAL_GYAN_ITEMS,
  INITIAL_PUJA_VIDHIS,
  INITIAL_TEMPLES
} from '../services/sanatanPlatformService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const QUICK_FEATURES = [
  { title: 'ऋषिकेश दैनिक पंचांग एवं शुभ मुहूर्त', category: 'पंचांग', page: 'panchang', moduleKey: 'enable_panchang' as const },
  { title: 'वैदिक जन्म कुंडली, चंद्र एवं नवांश चक्र', category: 'कुंडली', page: 'kundli', moduleKey: 'enable_kundli' as const },
  { title: 'अष्टकूट कुंडली मिलान (36 गुण)', category: 'मिलान', page: 'milan', moduleKey: 'enable_milan' as const },
  { title: 'दैनिक, मासिक एवं वार्षिक राशिफल', category: 'राशिफल', page: 'rashifal', moduleKey: 'enable_rashifal' as const },
  { title: 'नवग्रह गोचर एवं राशि परिवर्तन', category: 'गोचर', page: 'gochar', moduleKey: 'enable_gochar' as const },
  { title: 'रत्न, मूलांक एवं शनि साढ़ेसाती कैलकुलेटर', category: 'कैलकुलेटर', page: 'calculators', moduleKey: 'enable_calculators' as const },
  { title: 'वैदिक मंत्र, 108 जप माला, स्तोत्र एवं पर्व कैलेंडर', category: 'धर्म', page: 'dharma', moduleKey: 'enable_dharma' as const },
  { title: 'पंडित जी से संपर्क एवं परामर्श', category: 'परामर्श', page: 'chat', moduleKey: 'enable_pandit_chat' as const },
  { title: 'संपूर्ण ज्ञान विभाग (वेद, उपनिषद, गीता, पुराण, रामायण, दर्शन)', category: 'शास्त्र ज्ञान', page: 'gyan', moduleKey: 'enable_dharma' as const },
  { title: 'पूजा एवं कर्मकांड विधि (१९ श्रेणियाँ व सामग्री सूची)', category: 'कर्मकांड', page: 'puja', moduleKey: 'enable_dharma' as const },
  { title: 'संस्कृत शिक्षा पाठ्यक्रम एवं प्रश्नोत्तरी (४ स्तर)', category: 'संस्कृत', page: 'sanskrit', moduleKey: 'enable_dharma' as const },
  { title: 'मंदिर एवं तीर्थ डायरेक्टरी (द्वादश ज्योतिर्लिंग व चार धाम)', category: 'तीर्थ', page: 'temples', moduleKey: 'enable_dharma' as const },
  { title: 'यजमान एवं वैदिक पूजा बुकिंग', category: 'पूजा बुकिंग', page: 'puja_booking', moduleKey: 'enable_pandit_chat' as const },
  { title: 'मेरा पुस्तकालय (बुकमार्क, इतिहास व रसीदें)', category: 'पुस्तकालय', page: 'library', moduleKey: 'enable_dharma' as const },
  { title: 'सहायता केंद्र, FAQ एवं एडमिन फीचर रजिस्ट्री', category: 'सहायता', page: 'support', moduleKey: 'enable_dharma' as const },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'features' | 'shastra' | 'articles' | 'pandits'>('all');
  const wpSettings = getWpAppSettings();

  useEffect(() => {
    if (!isOpen) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const pandits: PanditProfile[] = isFeatureModuleEnabled(wpSettings, 'enable_pandit_chat') ? getPandits() : [];
  const articles: Article[] = isFeatureModuleEnabled(wpSettings, 'enable_articles') ? getArticles() : [];

  const activeFeatures = QUICK_FEATURES.filter((f) => isFeatureModuleEnabled(wpSettings, f.moduleKey));

  const matchedFeatures = activeFeatures.filter(
    (f) => !q || f.title.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );

  const shastraEntries = [
    ...INITIAL_GYAN_ITEMS.map((g) => ({
      id: g.id,
      title: g.titleHi,
      subtitle: `${g.departmentLabelHi} • ${g.sourceReference}`,
      page: 'gyan'
    })),
    ...INITIAL_PUJA_VIDHIS.map((p) => ({
      id: p.id,
      title: p.titleHi,
      subtitle: `पूजा एवं कर्मकांड • ${p.category}`,
      page: 'puja'
    })),
    ...INITIAL_TEMPLES.map((t) => ({
      id: t.id,
      title: t.nameHi,
      subtitle: `${t.category} • ${t.cityStateHi}`,
      page: 'temples'
    }))
  ];

  const matchedShastra = shastraEntries.filter(
    (s) => !q || s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
  );

  const matchedArticles = articles.filter(
    (a) => !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.categoryHindi.toLowerCase().includes(q)
  );

  const matchedPandits = pandits.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.specialties.some((s) => s.toLowerCase().includes(q))
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center p-4 pt-14 overscroll-none"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white dark:bg-[#112226] rounded-2xl max-w-2xl w-full border border-[#008080]/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#008080]/20 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#008080] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="पंचांग, कुंडली, वेद, गीता, पूजा विधि, मंदिर, लेख या पंडित जी खोजें..."
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
          />
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
            <span>बंद करें</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-[#008080]/15 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'सभी परिणाम' },
            { id: 'features', label: 'प्रमुख सेवाएं' },
            { id: 'shastra', label: 'शास्त्र, पूजा व तीर्थ' },
            { id: 'articles', label: 'वेबसाइट लेख' },
            { id: 'pandits', label: 'पंडित जी' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#008080] text-white'
                  : 'bg-white dark:bg-[#112226] text-slate-600 dark:text-slate-300 border border-[#008080]/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[65vh] overflow-y-auto overscroll-contain p-4 space-y-4">
          {(filter === 'all' || filter === 'features') && matchedFeatures.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#008080]" /> प्रमुख मॉड्यूल एवं सेवाएं
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedFeatures.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onNavigate(f.page);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-[#008080]/15 text-left flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{f.title}</p>
                      <span className="text-[10px] text-[#008080] dark:text-teal-300 font-semibold">{f.category}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'shastra') && matchedShastra.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7F33]" /> शास्त्र, पूजा विधि एवं तीर्थ ({matchedShastra.length})
              </h4>
              <div className="space-y-2">
                {matchedShastra.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onNavigate(s.page);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-[#008080]/15 text-left flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{s.title}</p>
                      <p className="text-[11px] text-[#008080] dark:text-teal-300 truncate">{s.subtitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'articles') && matchedArticles.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FF7F33]" /> वेबसाइट लेख ({matchedArticles.length})
              </h4>
              <div className="space-y-2">
                {matchedArticles.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onNavigate('articles');
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-[#008080]/15 text-left flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{a.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{a.categoryHindi} • {a.author}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {(filter === 'all' || filter === 'pandits') && matchedPandits.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#008080]" /> विशेषज्ञ पंडित जी
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedPandits.map((ast) => (
                  <button
                    key={ast.id}
                    onClick={() => {
                      onNavigate('chat');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-[#008080]/15 text-left flex items-center gap-3 transition cursor-pointer"
                  >
                    <img src={ast.avatar} alt={ast.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{ast.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{ast.qualification}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;

