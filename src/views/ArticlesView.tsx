import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  X,
  ExternalLink,
  Link2,
  ArrowLeft,
  Calendar,
  User,
  Share2,
  MessageSquare,
  CheckCircle2,
  ListChecks,
  Send,
  ShieldCheck,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Article, AdminUser, LanguageCode } from '../types';
import { getArticles, syncArticlesFromServer, decodeHtmlEntities } from '../services/articleService';
import { getOwnerProfile } from '../services/authAndRoleService';
import { DICTIONARY, translateTextContent } from '../i18n/translations';
import { PaginationControls } from '../components/PaginationControls';

const ARTICLES_PER_PAGE = 10;

interface ArticlesViewProps {
  activeUser: AdminUser | null;
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
  onNavigate?: (page: string, extraData?: unknown) => void;
  initialArticleId?: string | null;
  onClearInitialArticle?: () => void;
}

interface BlogCommentItem {
  id: string;
  articleId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

const BLOG_COMMENTS_KEY = 'jyotishwala_blog_comments_v1';

const INITIAL_COMMENTS: BlogCommentItem[] = [
  {
    id: 'c1',
    articleId: 'art_1',
    authorName: 'विकास शर्मा, देहरादून',
    text: 'बहुत ही प्रामाणिक और सरल भाषा में कुंडली योगों की जानकारी दी गई है। धन्यवाद आचार्य जी!',
    createdAt: '2 दिन पहले'
  },
  {
    id: 'c2',
    articleId: 'art_2',
    authorName: 'नेहा मिश्रा, हरिद्वार',
    text: 'वास्तु शास्त्र के ये व्यावहारिक नियम घर में सकारात्मक ऊर्जा बढ़ाने के लिए अत्यंत उपयोगी हैं।',
    createdAt: 'कल'
  }
];

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  activeUser,
  currentLang,
  onClosePage,
  onGoBack,
  onNavigate,
  initialArticleId,
  onClearInitialArticle
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;
  const [articles, setArticles] = useState<Article[]>(() => getArticles());
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<Article | null>(() => {
    if (!initialArticleId) return null;
    const all = getArticles();
    return all.find((a) => a.id === initialArticleId) || null;
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Website Blog Features State
  const [fontScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [, setIsShareMenuOpen] = useState(false);
  const [copiedLinkMsg, setCopiedLinkMsg] = useState(false);
  const [comments, setComments] = useState<BlogCommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(BLOG_COMMENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  const getAuthorAvatar = (art: Article) => {
    if (art.authorAvatar && art.authorAvatar.trim()) return art.authorAvatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(art.author || 'JyotishWala')}&background=008080&color=fff&size=128`;
  };

  useEffect(() => {
    const fresh = getArticles();
    setArticles(fresh);
    if (initialArticleId) {
      const found = fresh.find((a) => a.id === initialArticleId);
      if (found) {
        setReadingArticle(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    void syncArticlesFromServer().then((serverList) => {
      setArticles(serverList);
      if (initialArticleId) {
        const found = serverList.find((a) => a.id === initialArticleId);
        if (found) setReadingArticle(found);
      }
    });

    const handleArticlesUpdate = () => {
      const updatedList = getArticles();
      setArticles(updatedList);
      setReadingArticle((prev) => (prev ? updatedList.find((a) => a.id === prev.id) || prev : null));
    };

    window.addEventListener('jw-articles-updated', handleArticlesUpdate);
    return () => window.removeEventListener('jw-articles-updated', handleArticlesUpdate);
  }, [initialArticleId]);

  const categories = ['सभी', 'कुंडली योग', 'वास्तु शास्त्र', 'पंचांग ज्ञान', 'ग्रह गोचर', 'पूजा विधि', 'दोष निवारण'];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredArticles = articles.filter((a) => {
    const matchesCategory = selectedCategory === 'सभी' || a.categoryHindi === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenArticleFullPage = (article: Article) => {
    setReadingArticle(article);
    setIsShareMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToArticlesList = () => {
    setReadingArticle(null);
    setIsShareMenuOpen(false);
    if (onClearInitialArticle) onClearInitialArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInternalLinkClick = (url: string) => {
    setReadingArticle(null);
    if (onClearInitialArticle) onClearInitialArticle();
    const cleaned = url.replace('#', '').trim();
    if (cleaned && onNavigate) {
      onNavigate(cleaned);
    }
  };

  const handleCopyShareLink = (art: Article) => {
    const shareText = `${art.title} - JyotishWala Blog (${window.location.href})`;
    navigator.clipboard?.writeText(shareText);
    setCopiedLinkMsg(true);
    setTimeout(() => setCopiedLinkMsg(false), 2500);
  };

  const handleNativeShare = async (art: Article) => {
    const shareData = {
      title: art.title,
      text: `${art.title} — ${art.excerpt}`,
      url: window.location.href
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to copy if share sheet dismissed or unsupported
      }
    }
    handleCopyShareLink(art);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readingArticle || !commentAuthor.trim() || !commentText.trim()) return;
    const newComment: BlogCommentItem = {
      id: `cmt_${Date.now()}`,
      articleId: readingArticle.id,
      authorName: commentAuthor.trim(),
      text: commentText.trim(),
      createdAt: 'अभी'
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    setCommentAuthor('');
    setCommentText('');
    try {
      localStorage.setItem(BLOG_COMMENTS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  // ==================== WEBSITE-STYLE FULL PAGE BLOG POST VIEW ====================
  if (readingArticle) {
    const relatedArticles = articles.filter((a) => a.id !== readingArticle.id).slice(0, 3);
    const paragraphs = readingArticle.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const articleComments = comments.filter((c) => c.articleId === readingArticle.id);

    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(`${readingArticle.title} — ${readingArticle.excerpt}`);

    const textSizeClass =
      fontScale === 'sm'
        ? 'text-xs sm:text-sm'
        : fontScale === 'lg'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';

    // Process WordPress Raw HTML to inject anchor IDs and extract headings for Table of Contents
    const headingsList: Array<{ id: string; text: string; level: number }> = [];
    let processedHtml = readingArticle.rawHtml || '';

    if (processedHtml) {
      let headingIndex = 0;
      processedHtml = processedHtml.replace(/<(h[1-4])([^>]*)>(.*?)<\/\1>/gi, (_match, tag, attrs, inner) => {
        headingIndex += 1;
        const textOnly = decodeHtmlEntities(inner.replace(/<[^>]*>/g, '').trim());
        const id = `art-hd-${headingIndex}`;
        const level = parseInt(tag.charAt(1), 10);
        if (textOnly) {
          headingsList.push({
            id,
            text: currentLang === 'en' ? translateTextContent(textOnly, 'en') : textOnly,
            level
          });
        }
        return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
      });

      if (currentLang === 'en') {
        // Hide leading image/figure inside rawHtml when English is active
        processedHtml = processedHtml.replace(/^\s*(<figure\b[^>]*>[\s\S]*?<\/figure>|<p\b[^>]*>\s*<img\b[^>]*>\s*<\/p>|<img\b[^>]*>)/i, '');
        processedHtml = processedHtml.replace(/>([^<]+)</g, (fullMatch, textSegment) => {
          const decoded = decodeHtmlEntities(textSegment);
          if (!decoded.trim()) return fullMatch;
          const translated = translateTextContent(decoded, 'en');
          return `>${translated}<`;
        });
      }
    } else {
      // Fallback: create headings from paragraphs for local articles
      paragraphs.forEach((p, idx) => {
        const isShortHeading = p.length < 65 && !p.endsWith('।') && !p.endsWith('.');
        if (isShortHeading && idx > 0) {
          headingsList.push({
            id: `heading-${idx}`,
            text: currentLang === 'en' ? translateTextContent(p, 'en') : p,
            level: 2
          });
        }
      });
    }

    return (
      <div className="pb-8">
        {/* Single Unified Website Blog Post Container */}
        <article className="bg-white dark:bg-[#112226] rounded-3xl border border-[#008080]/25 shadow-sm overflow-hidden">
          {/* Single-Line Top Bar: ONLY "ब्लॉग सूची पर वापस जाएं" on Left and "बंद करें" on Right */}
          <div className="px-4 sm:px-8 py-3.5 bg-[#FAF7F2] dark:bg-slate-900/90 border-b border-[#008080]/20 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleBackToArticlesList}
              className="px-3.5 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ब्लॉग सूची पर वापस जाएं</span>
            </button>

            <button
              type="button"
              onClick={onClosePage}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#008080]/25 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
              <span>{dict.closePage}</span>
            </button>
          </div>

          {/* Blog Hero Cover Image with 1456x720 Aspect Ratio Container (Shown in Hindi, Hidden in English) */}
          {currentLang !== 'en' && readingArticle.imageUrl && (
            <div className="w-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
              <div className="w-full max-w-[1456px] aspect-[1456/720] relative overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={readingArticle.imageUrl}
                  alt={readingArticle.imageAlt || readingArticle.title}
                  className="w-full h-full object-contain sm:object-cover"
                />
              </div>
            </div>
          )}

          {/* Main Website Blog Post Body Container */}
          <div className="p-5 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-6">
            {/* Blog Title H1 */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {readingArticle.title}
            </h1>

            {/* Compact Author & Date Row Below Title */}
            <div className="border-b border-[#008080]/15 pb-3.5">
              <div className="flex items-center gap-2.5 text-xs">
                <img
                  src={getAuthorAvatar(readingArticle)}
                  alt={readingArticle.author}
                  className="w-8 h-8 rounded-full object-cover border border-[#008080] shrink-0 bg-teal-50 dark:bg-teal-950"
                />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100 text-xs">
                    <span>{readingArticle.author}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#008080]" />
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <Calendar className="w-3 h-3 text-[#FF7F33]" />
                    <span>{readingArticle.publishedAt}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Collapsible Website Blog Table of Contents (अनुक्रमणिका) */}
            {headingsList.length > 0 && (
              <div className="rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsTocOpen((prev) => !prev)}
                  className="w-full px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2 text-left hover:bg-teal-50/50 dark:hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-[#008080]" />
                    <span>अनुक्रमणिका — इस लेख के मुख्य बिंदु ({headingsList.length})</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#008080] dark:text-teal-300 shrink-0">
                    <span>{isTocOpen ? 'बंद करें' : 'खोलें'}</span>
                    {isTocOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {isTocOpen && (
                  <ul className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#008080]/15 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#008080] dark:text-teal-300 font-bold">
                    {headingsList.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-full bg-[#008080]/10 text-[#008080] dark:text-teal-300 text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(h.id);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="hover:underline truncate"
                          title={h.text}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Sanskrit Shloka Callout Box if Available */}
            {readingArticle.shloka && (
              <div className="p-5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/25 border border-[#FF7F33]/35 space-y-2 text-center">
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#FF7F33] text-white text-[10px] font-bold">
                  वैदिक शास्त्र प्रमाण श्लोक
                </span>
                <p className="text-sm sm:text-base font-extrabold text-[#FF7F33]">
                  {readingArticle.shloka.sanskrit}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  अर्थ: {readingArticle.shloka.meaning}
                </p>
              </div>
            )}

            {/* Rich Article Content with Full Format Support: H1, H2, H3, H4, Images, Links, Lists, Tags */}
            {processedHtml ? (
              <div
                className={`wp-article-content text-slate-800 dark:text-slate-200 leading-relaxed ${textSizeClass}`}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            ) : (
              <div className={`space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed ${textSizeClass}`}>
                {paragraphs.map((para, idx) => {
                  const isShortHeading = para.length < 65 && !para.endsWith('।') && !para.endsWith('.');
                  if (isShortHeading && idx > 0) {
                    return (
                      <h2
                        key={idx}
                        id={`heading-${idx}`}
                        className="text-lg sm:text-xl font-extrabold text-[#008080] dark:text-teal-300 pt-3"
                      >
                        {para}
                      </h2>
                    );
                  }
                  return (
                    <p key={idx} className="whitespace-pre-line leading-relaxed text-justify sm:text-left">
                      {para}
                    </p>
                  );
                })}
              </div>
            )}

            {/* Internal & External Links Section */}
            {(readingArticle.seo?.internalLinks?.length ||
              readingArticle.seo?.externalLinks?.length) ? (
              <div className="pt-5 border-t border-[#008080]/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {readingArticle.seo?.internalLinks &&
                  readingArticle.seo.internalLinks.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/20 space-y-2.5">
                      <h4 className="text-xs font-bold text-[#008080] dark:text-teal-300 flex items-center gap-1.5">
                        <Link2 className="w-4 h-4" />
                        <span>संबंधित ज्योतिष सेवाएं</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {readingArticle.seo.internalLinks.map((lnk, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleInternalLinkClick(lnk.url)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#008080]/30 text-xs font-bold text-[#008080] dark:text-teal-300 hover:bg-[#008080] hover:text-white transition cursor-pointer"
                          >
                            {lnk.anchorText}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {readingArticle.seo?.externalLinks &&
                  readingArticle.seo.externalLinks.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-[#FF7F33]/20 space-y-2.5">
                      <h4 className="text-xs font-bold text-[#FF7F33] flex items-center gap-1.5">
                        <ExternalLink className="w-4 h-4" />
                        <span>संदर्भ बाहरी लिंक</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {readingArticle.seo.externalLinks.map((lnk, idx) => (
                          <a
                            key={idx}
                            href={lnk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#FF7F33]/30 text-xs font-bold text-[#FF7F33] hover:bg-[#FF7F33] hover:text-white transition inline-flex items-center gap-1"
                          >
                            <span>{lnk.anchorText}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : null}

            {/* Article Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#008080]/15">
              <span className="text-xs font-bold text-slate-500">टैग्स:</span>
              {readingArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* End of Main Article Post: Share Buttons Row (1. शेयर करें, 2. WhatsApp, 3. Facebook, 4. कॉपी करें) */}
            <div className="pt-4 pb-2 border-t border-[#008080]/20 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
              {/* 1. Primary Share Button */}
              <button
                type="button"
                onClick={() => handleNativeShare(readingArticle)}
                className="px-3.5 py-2 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white font-extrabold flex items-center gap-1.5 cursor-pointer transition shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>शेयर करें</span>
              </button>

              {/* 2. WhatsApp Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shrink-0"
              >
                WhatsApp
              </a>

              {/* 3. Facebook Button */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shrink-0"
              >
                Facebook
              </a>

              {/* 4. Copy Button */}
              <button
                type="button"
                onClick={() => handleCopyShareLink(readingArticle)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-[#008080]/30 hover:border-[#008080] text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer transition shrink-0"
              >
                {copiedLinkMsg ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">कॉपी हुआ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#008080]" />
                    <span>कॉपी करें</span>
                  </>
                )}
              </button>
            </div>

            {/* Website Blog Author Bio Box (Uses Authentic WordPress Author Details) */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={getAuthorAvatar(readingArticle)}
                  alt={readingArticle.author}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#008080] shrink-0 bg-teal-50 dark:bg-teal-950 shadow-xs"
                />
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF7F33]">
                    लेखक परिचय
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {readingArticle.author}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {readingArticle.authorBio ||
                      `${readingArticle.author} — ज्योतिषाचार्य एवं वैदिक सनातन धर्म, पंचांग व कुंडली शोध परंपरा के अधिकृत लेखक।`}
                  </p>
                </div>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('chat')}
                  className="px-4 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs sm:text-sm font-bold shrink-0 cursor-pointer"
                >
                  आचार्य जी से परामर्श लें →
                </button>
              )}
            </div>

            {/* Website Blog Interactive Reader Comments Section */}
            <div className="pt-6 border-t border-[#008080]/20 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#008080]" />
                <span>पाठकों की टिप्पणियाँ ({articleComments.length})</span>
              </h3>

              {/* Add Comment Form */}
              <form
                onSubmit={handleAddComment}
                className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/20 space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="आपका नाम *"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-[#112226] border border-[#008080]/25 text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="इस लेख पर अपना विचार या प्रश्न लिखें..."
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-[#112226] border border-[#008080]/25 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>टिप्पणी प्रकाशित करें</span>
                  </button>
                </div>
              </form>

              {/* Comments List (Flat Divider Rows) */}
              <div className="divide-y divide-[#008080]/15">
                {articleComments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className="py-3 first:pt-0 last:pb-0 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#008080] dark:text-teal-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#FF7F33]" />
                        <span>{cmt.authorName}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{cmt.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {cmt.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Blog Posts Section — Flat Divider Vertical List */}
            {relatedArticles.length > 0 && (
              <div className="pt-6 border-t border-[#008080]/20 space-y-3">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#008080]" />
                  <span>संबंधित ब्लॉग पोस्ट</span>
                </h3>
                <div className="divide-y divide-[#008080]/15">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => handleOpenArticleFullPage(rel)}
                      className="py-3.5 first:pt-1 last:pb-0 cursor-pointer transition flex flex-col items-start gap-2 group"
                    >
                      <div className="flex-1 min-w-0 space-y-1 w-full">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#008080]/10 text-[#008080] dark:text-teal-300">
                            {rel.categoryHindi}
                          </span>
                          <span className="text-[11px] text-slate-400">{rel.readTime}</span>
                        </div>

                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#008080]">
                          {rel.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>

                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#008080] hover:bg-[#006666] text-white text-[11px] font-bold transition">
                            <span>{dict.readMore || 'पूरा पढ़ें'}</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    );
  }

  // ==================== UNIFIED ARTICLES LIST VIEW ====================
  return (
    <div className="space-y-4 pb-8">
      {/* Top Header, Search & Category Filter Card */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#008080]/15 pb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center text-white shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {dict.articles}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                कुल {articles.length} प्रमाणित ब्लॉग उपलब्ध • किसी भी कार्ड पर क्लिक कर वेबसाइट ब्लॉग पढ़ें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={onGoBack || onClosePage}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="पिछले पृष्ठ पर वापस जाएं"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>वापस</span>
            </button>

            <button
              type="button"
              onClick={onClosePage}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="पेज बंद करें"
            >
              <X className="w-4 h-4" />
              <span>{dict.closePage}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.search}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/25 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#008080] text-white'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid (Standalone Single Cards — No Card Inside a Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles
          .slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE)
          .map((article) => (
            <div
              key={article.id}
              onClick={() => handleOpenArticleFullPage(article)}
              className="bg-white dark:bg-[#112226] rounded-2xl border border-[#008080]/20 shadow-xs hover:border-[#008080] transition flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              <div>
                {currentLang !== 'en' && article.imageUrl && (
                  <div className="h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#008080]/10 text-[#008080] dark:text-teal-300">
                      {article.categoryHindi}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-2 hover:text-[#008080] transition">
                    {article.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2.5 border-t border-[#008080]/10 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-500 truncate">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{article.author}</span>
                  <span className="mx-1">•</span>
                  <span>{article.publishedAt}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-[#008080] text-white text-[11px] font-bold transition">
                    {dict.readMore}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {filteredArticles.length > ARTICLES_PER_PAGE && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 border border-[#008080]/20 shadow-xs">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredArticles.length}
            pageSize={ARTICLES_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            itemLabel="ब्लॉग पोस्ट"
          />
        </div>
      )}
    </div>
  );
};

export default ArticlesView;
