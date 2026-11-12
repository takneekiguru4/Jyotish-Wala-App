import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  X,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Phone,
  Flame
} from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import {
  GalleryPhotoItem,
  GalleryPageMeta,
  getGalleryPhotos,
  getGalleryMeta
} from '../services/galleryService';
import { PaginationControls } from '../components/PaginationControls';

interface GalleryViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
  onNavigate?: (screen: string) => void;
}

const PHOTOS_PER_PAGE = 16;

export const GalleryView: React.FC<GalleryViewProps> = ({
  currentLang,
  onClosePage,
  onGoBack,
  onNavigate
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  const [meta, setMeta] = useState<GalleryPageMeta>(() => getGalleryMeta());
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>(() => getGalleryPhotos());
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [isCategoryTabsExpanded, setIsCategoryTabsExpanded] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [activeGroupSlideIndex, setActiveGroupSlideIndex] = useState<number>(0);

  useEffect(() => {
    const syncGallery = () => {
      setMeta(getGalleryMeta());
      setPhotos(getGalleryPhotos());
    };
    window.addEventListener('jyotishwala_gallery_changed', syncGallery);
    return () => window.removeEventListener('jyotishwala_gallery_changed', syncGallery);
  }, []);

  const categoriesList = React.useMemo(() => {
    const base =
      Array.isArray(meta.categories) && meta.categories.length > 0 ? meta.categories : [];
    return ['सभी', ...base];
  }, [meta.categories]);

  const filteredPhotos = React.useMemo(() => {
    if (selectedCategory === 'सभी') return photos;
    return photos.filter((item) => item.category === selectedCategory);
  }, [photos, selectedCategory]);

  // Reset pagination to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const paginatedPhotos = React.useMemo(() => {
    const startIdx = (currentPage - 1) * PHOTOS_PER_PAGE;
    return filteredPhotos.slice(startIdx, startIdx + PHOTOS_PER_PAGE);
  }, [filteredPhotos, currentPage]);

  const activePhoto =
    activePhotoIndex !== null && filteredPhotos[activePhotoIndex]
      ? filteredPhotos[activePhotoIndex]
      : null;

  const activeGroupList = React.useMemo(() => {
    if (!activePhoto) return [];
    if (Array.isArray(activePhoto.groupImages) && activePhoto.groupImages.length > 1) {
      return activePhoto.groupImages;
    }
    return [activePhoto.imageUrl];
  }, [activePhoto]);

  const handleStepNext = React.useCallback(() => {
    if (activePhotoIndex === null || filteredPhotos.length === 0) return;
    const item = filteredPhotos[activePhotoIndex];
    const grp =
      item && Array.isArray(item.groupImages) && item.groupImages.length > 1
        ? item.groupImages
        : item
        ? [item.imageUrl]
        : [];
    if (activeGroupSlideIndex + 1 < grp.length) {
      setActiveGroupSlideIndex((prev) => prev + 1);
    } else {
      setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : null));
      setActiveGroupSlideIndex(0);
    }
  }, [activePhotoIndex, activeGroupSlideIndex, filteredPhotos]);

  const handleStepPrev = React.useCallback(() => {
    if (activePhotoIndex === null || filteredPhotos.length === 0) return;
    if (activeGroupSlideIndex > 0) {
      setActiveGroupSlideIndex((prev) => prev - 1);
    } else {
      const prevCardIdx = (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
      const prevItem = filteredPhotos[prevCardIdx];
      const prevGrp =
        prevItem && Array.isArray(prevItem.groupImages) && prevItem.groupImages.length > 1
          ? prevItem.groupImages
          : prevItem
          ? [prevItem.imageUrl]
          : [];
      setActivePhotoIndex(prevCardIdx);
      setActiveGroupSlideIndex(Math.max(0, prevGrp.length - 1));
    }
  }, [activePhotoIndex, activeGroupSlideIndex, filteredPhotos]);

  // Support mobile/browser Back button and Escape/Arrow keys when Full-Screen Photo is open
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
        setActiveGroupSlideIndex(0);
      } else if (e.key === 'ArrowRight') {
        handleStepNext();
      } else if (e.key === 'ArrowLeft') {
        handleStepPrev();
      }
    };

    const handlePopState = () => {
      setActivePhotoIndex(null);
      setActiveGroupSlideIndex(0);
    };

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    window.history.pushState({ galleryLightbox: true }, '');
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activePhotoIndex !== null, handleStepNext, handleStepPrev]);

  const handleOpenFullscreen = (photoId: string) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photoId);
    if (idx >= 0) {
      setActivePhotoIndex(idx);
      setActiveGroupSlideIndex(0);
    }
  };

  const handleCloseFullscreen = () => {
    setActivePhotoIndex(null);
    setActiveGroupSlideIndex(0);
  };

  const currentDisplayedImageUrl =
    activeGroupList[activeGroupSlideIndex] || activePhoto?.imageUrl || '';

  return (
    <div className="space-y-4 mb-6">
      {/* 1. Top Header Card with Back & Close Buttons at the Very Start */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
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
            <span>{dict.closePage || 'बंद करें'}</span>
          </button>
        </div>

        {/* Row 2: Page Title & Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
                {meta.pageTitle}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {meta.pageTagline}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-[#008080]/20 text-[#008080] dark:text-teal-300 text-xs font-extrabold shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7F33]" />
            <span>
              कुल {filteredPhotos.length} {meta.countBadgeText || 'दिव्य झलकियां'}
            </span>
          </div>
        </div>

        {/* Row 3: Teal Inner Card (100% Admin Editable & Toggleable) */}
        {meta.showTealBanner !== false && (
          <div className="rounded-xl bg-gradient-to-r from-[#008080] to-[#006666] text-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              {meta.organizationBannerBadge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#FF7F33] text-white text-[10px] font-extrabold">
                  <Flame className="w-3 h-3 text-white shrink-0" />
                  <span>{meta.organizationBannerBadge}</span>
                </div>
              )}
              <h2 className="text-xs sm:text-sm font-extrabold text-white">
                {meta.organizationBannerTitle}
              </h2>
              <p className="text-[11px] text-teal-100 leading-relaxed">
                {meta.organizationBannerSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 shrink-0 text-center bg-black/20 p-2.5 rounded-xl border border-white/15">
              <div className="px-2">
                <span className="text-xs sm:text-sm font-extrabold text-white block">
                  {meta.stat1Value || '500+'}
                </span>
                <span className="text-[10px] text-teal-100 block">
                  {meta.stat1Label || 'संपन्न अनुष्ठान'}
                </span>
              </div>
              <div className="px-2 border-x border-white/15">
                <span className="text-xs sm:text-sm font-extrabold text-[#FF7F33] block">
                  {meta.stat2Value || 'काशी-ऋषिकेश'}
                </span>
                <span className="text-[10px] text-teal-100 block">
                  {meta.stat2Label || 'वैदिक परंपरा'}
                </span>
              </div>
              <div className="px-2">
                <span className="text-xs sm:text-sm font-extrabold text-white block">
                  {meta.stat3Value || '100%'}
                </span>
                <span className="text-[10px] text-teal-100 block">
                  {meta.stat3Label || 'शास्त्रीय विधि'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Row 4: Expandable & Collapsible Category Filter Tabs (NO Horizontal Scroll) */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-[#008080]/20 p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                चयनित श्रेणी:
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#008080] text-white text-xs font-bold">
                {selectedCategory === 'सभी'
                  ? `सभी फ़ोटो (${photos.length})`
                  : `${selectedCategory} (${filteredPhotos.length})`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCategoryTabsExpanded((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-[#008080] dark:text-teal-300 border border-[#008080]/25 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <span>{isCategoryTabsExpanded ? 'श्रेणियां बंद करें' : 'सभी श्रेणियां खोलें'}</span>
              {isCategoryTabsExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {isCategoryTabsExpanded && (
            <div className="pt-2 border-t border-[#008080]/15 flex flex-wrap items-center gap-1.5">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'सभी'
                    ? photos.length
                    : photos.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryTabsExpanded(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#008080] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-[#008080]/15 hover:bg-teal-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'सभी' ? `सभी फ़ोटो (${count})` : `${cat} (${count})`}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Photo Grid View (Reduced Height by 3px, Group vs Single Support, Click to Fullscreen) */}
      {paginatedPhotos.length === 0 ? (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-8 border border-[#008080]/20 text-center space-y-2">
          <ImageIcon className="w-10 h-10 text-[#008080] mx-auto opacity-60" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            इस श्रेणी में अभी कोई फ़ोटो उपलब्ध नहीं है।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {paginatedPhotos.map((item) => {
            const groupCount =
              Array.isArray(item.groupImages) && item.groupImages.length > 1
                ? item.groupImages.length
                : 1;
            const isGroup = groupCount > 1;

            return (
              <div
                key={item.id}
                onClick={() => handleOpenFullscreen(item.id)}
                className="group bg-white dark:bg-[#112226] rounded-2xl border border-[#008080]/20 hover:border-[#008080] shadow-xs hover:shadow-md overflow-hidden transition cursor-pointer"
              >
                {/* Photo Container (Trimmed by 3px height) */}
                <div className="relative aspect-[4/3] -mb-[3px] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Group Photo Count Indicator (Only if Group > 1 photo) */}
                  {isGroup && (
                    <span
                      className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-[#008080]/90 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs"
                      title={`इस पूजा समूह में ${groupCount} फ़ोटो हैं`}
                    >
                      <Layers className="w-3 h-3 text-white shrink-0" />
                      <span>{groupCount} फ़ोटो</span>
                    </span>
                  )}

                  {/* Full-Screen Icon on Top-Right of Photo */}
                  <span
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/55 group-hover:bg-[#008080] text-white flex items-center justify-center transition shadow-xs"
                    title="फुल स्क्रीन में देखें"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </span>
                </div>

                {/* Clean Title Only (Reduced vertical padding by 3px) */}
                <div className="px-2.5 py-2.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#008080] dark:group-hover:text-teal-300 transition">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Centered Pagination Card (Starts automatically when photos > 16) */}
      {filteredPhotos.length > PHOTOS_PER_PAGE && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-3.5 sm:p-4 border border-[#008080]/20 shadow-xs flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredPhotos.length}
            pageSize={PHOTOS_PER_PAGE}
            itemLabel="फ़ोटो"
            centered={true}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* 4. Sansthan Puja & Jyotish Seva Information Card (100% Admin Editable & Toggleable) */}
      {meta.showBottomCard !== false && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1 max-w-2xl">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF7F33]" />
                <span>
                  {meta.bottomCardTitle ||
                    'वैदिक पूजा-पाठ, अनुष्ठान एवं ज्योतिष परामर्श हेतु संपर्क'}
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {meta.bottomCardDescription ||
                  'JyotishWala संस्थान द्वारा काशी एवं ऋषिकेश के विद्वान आचार्यों के माध्यम से महारुद्राभिषेक, महामृत्युंजय जप, नवग्रह शांति, कालसर्प व मांगलिक दोष निवारण, वास्तु पूजन तथा जन्मकुंडली परामर्श पूर्ण शास्त्रीय विधि से संपन्न कराए जाते हैं।'}
              </p>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('chat')}
                className="px-4 py-2.5 rounded-xl bg-[#FF7F33] hover:bg-[#e86b22] text-white text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shrink-0 shadow-xs"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>{meta.bottomCardButtonText || 'पंडित जी से बात करें'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. FULL-SCREEN PHOTO LIGHTBOX MODAL (Supports Single & Multi-Photo Puja Groups) */}
      {activePhoto && activePhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xs flex flex-col justify-between overflow-y-auto overscroll-none"
          onClick={handleCloseFullscreen}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Top Bar inside Full-Screen View: Back Button, Group/Card Counter & Close Button */}
          <div
            className="sticky top-0 z-20 px-4 py-3 bg-black/80 border-b border-white/15 flex items-center justify-between gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseFullscreen}
              className="px-3.5 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="गैलरी में वापस जाएं"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span>वापस</span>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-extrabold text-white/95">
              <span>
                गैलरी कार्ड {activePhotoIndex + 1} / {filteredPhotos.length}
              </span>
              {activeGroupList.length > 1 && (
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FF7F33] text-white text-[11px] font-extrabold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-white" />
                  <span>
                    समूह फ़ोटो {activeGroupSlideIndex + 1} / {activeGroupList.length}
                  </span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCloseFullscreen}
              className="px-3.5 py-2 rounded-xl bg-[#FF7F33] hover:bg-[#e86b22] text-white text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="फुल स्क्रीन बंद करें"
            >
              <X className="w-4 h-4 text-white" />
              <span>बंद करें</span>
            </button>
          </div>

          {/* Center Full-Screen Image with Left/Right Navigation */}
          <div
            className="relative flex-1 flex items-center justify-center px-2 sm:px-12 py-3 min-h-[58vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {(filteredPhotos.length > 1 || activeGroupList.length > 1) && (
              <button
                type="button"
                onClick={handleStepPrev}
                className="absolute left-2 sm:left-5 z-10 p-2.5 rounded-full bg-black/65 hover:bg-[#008080] text-white border border-white/25 transition cursor-pointer"
                title="पिछली फ़ोटो"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}

            <img
              src={currentDisplayedImageUrl}
              alt={activePhoto.title}
              className="max-h-[70vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/15"
            />

            {(filteredPhotos.length > 1 || activeGroupList.length > 1) && (
              <button
                type="button"
                onClick={handleStepNext}
                className="absolute right-2 sm:right-5 z-10 p-2.5 rounded-full bg-black/65 hover:bg-[#008080] text-white border border-white/25 transition cursor-pointer"
                title="अगली फ़ोटो"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Group Thumbnails (when group > 1) + Photo Title + Next/Prev Separate Card Switcher */}
          <div
            className="px-4 py-3 bg-[#0D1B1E] border-t border-[#008080]/30 text-white space-y-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Group Thumbnails Strip if this Puja item has multiple photos */}
            {activeGroupList.length > 1 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-teal-200 text-center">
                  इस पूजा समूह की सभी {activeGroupList.length} फ़ोटो (क्लिक करके देखें):
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {activeGroupList.map((imgUrl, gIdx) => (
                    <button
                      key={`${activePhoto.id}_grp_${gIdx}`}
                      type="button"
                      onClick={() => setActiveGroupSlideIndex(gIdx)}
                      className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                        activeGroupSlideIndex === gIdx
                          ? 'border-[#FF7F33] ring-2 ring-[#FF7F33]/50 scale-105'
                          : 'border-white/20 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${activePhoto.title} - ${gIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 px-1 bg-black/75 text-[9px] font-bold text-white">
                        {gIdx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 max-w-4xl mx-auto">
              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePhotoIndex(
                      (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                    );
                    setActiveGroupSlideIndex(0);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#008080] text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white" />
                  <span>पिछला कार्ड</span>
                </button>
              )}

              <h2 className="text-sm sm:text-base font-extrabold text-white text-center flex-1">
                {activePhoto.title}
              </h2>

              {filteredPhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
                    setActiveGroupSlideIndex(0);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#008080] text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>अगला कार्ड</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
