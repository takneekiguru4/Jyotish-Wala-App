import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  X,
  Star,
  MessageSquarePlus,
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { LanguageCode } from '../types';
import { DICTIONARY } from '../i18n/translations';
import {
  AppReviewItem,
  ReviewServiceCategory,
  ReviewSystemMeta,
  REVIEW_SERVICE_CATEGORIES,
  getApprovedReviews,
  getReviewMeta,
  submitUserReview
} from '../services/reviewService';
import { formatToDdMmYyyy } from '../components/DatePicker';

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: ReviewServiceCategory;
  onSubmitted?: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'सम्पूर्ण ऐप अनुभव (JyotishWala)',
  onSubmitted
}) => {
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [serviceCategory, setServiceCategory] =
    useState<ReviewServiceCategory>(defaultService);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setServiceCategory(defaultService);
    setSubmittedMsg(null);
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen, defaultService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;
    const { review } = submitUserReview({
      userName,
      userCity,
      serviceCategory,
      rating,
      comment
    });
    if (onSubmitted) {
      onSubmitted();
    }
    setSubmittedMsg(
      review.status === 'approved'
        ? 'आपकी समीक्षा सफलतापूर्वक प्रकाशित हो गई है! हार्दिक धन्यवाद।'
        : 'आपकी समीक्षा प्राप्त हो गई है और अनुमोदन के बाद प्रदर्शित होगी। धन्यवाद!'
    );
    setTimeout(() => {
      setUserName('');
      setUserCity('');
      setRating(5);
      setComment('');
      setSubmittedMsg(null);
      onClose();
    }, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto overscroll-none"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#112226] rounded-2xl border border-[#008080]/30 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#008080] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-white shrink-0" />
            <h3 className="text-sm sm:text-base font-extrabold">
              अपनी समीक्षा एवं रेटिंग दें
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto overscroll-contain flex-1">
          {submittedMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{submittedMsg}</span>
            </div>
          )}

          {/* Select Any Service in the App */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              आप किस सेवा के लिए समीक्षा देना चाहते हैं? *
            </label>
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value as ReviewServiceCategory)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-bold outline-none"
            >
              {REVIEW_SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive 1-5 Star Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              आपकी रेटिंग (1 से 5 स्टार चुनें) *
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/20">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition hover:scale-110 cursor-pointer"
                  title={`${star} स्टार`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-[#FF7F33] fill-[#FF7F33]'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-extrabold text-[#008080] dark:text-teal-300">
                {rating} / 5 स्टार ({rating === 5 ? 'उत्कृष्ट' : rating === 4 ? 'बहुत अच्छा' : rating === 3 ? 'अच्छा' : 'सामान्य'})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                आपका शुभ नाम *
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="जैसे: राजेश शर्मा"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                आपका शहर / स्थान
              </label>
              <input
                type="text"
                value={userCity}
                onChange={(e) => setUserCity(e.target.value)}
                placeholder="जैसे: वाराणसी, उत्तर प्रदेश"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              आपका अनुभव एवं समीक्षा *
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="इस सेवा के बारे में अपना अनुभव यहाँ लिखें..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#008080]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FF7F33] hover:bg-[#e86b22] text-white font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <MessageSquarePlus className="w-4 h-4 text-white" />
              <span>समीक्षा सबमिट करें</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReviewsViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  currentLang,
  onClosePage,
  onGoBack
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;

  const [meta, setMeta] = useState<ReviewSystemMeta>(() => getReviewMeta());
  const [reviews, setReviews] = useState<AppReviewItem[]>(() => getApprovedReviews());
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const syncReviews = () => {
      setMeta(getReviewMeta());
      const updated = getApprovedReviews();
      setReviews(updated);
      setActiveSlideIdx((prev) => (updated.length > 0 ? prev % updated.length : 0));
    };
    window.addEventListener('jyotishwala_reviews_changed', syncReviews);
    return () => window.removeEventListener('jyotishwala_reviews_changed', syncReviews);
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % reviews.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const avgRating = React.useMemo(() => {
    if (reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const currentReview = reviews[activeSlideIdx] || reviews[0];

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
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वापस</span>
          </button>

          <button
            type="button"
            onClick={onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>{dict.closePage || 'बंद करें'}</span>
          </button>
        </div>

        {/* Row 2: Page Title & Tagline */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Star className="w-5 h-5 text-white fill-white" />
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

        {/* Row 3: Rating Summary Strip with Single Review Button */}
        <div className="rounded-xl bg-gradient-to-r from-[#008080] to-[#006666] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-black/25 px-4 py-2.5 rounded-xl border border-white/15 text-center shrink-0">
              <span className="text-2xl font-black text-white block leading-none">
                {avgRating}
              </span>
              <div className="flex items-center justify-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-[#FF7F33] fill-[#FF7F33]" />
                ))}
              </div>
              <span className="text-[10px] text-teal-100 font-bold block">
                {reviews.length} सत्यापित समीक्षाएं
              </span>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FF7F33] text-white text-[10px] font-extrabold">
                <Sparkles className="w-3 h-3 text-white" />
                <span>सभी सेवाओं की प्रामाणिक रेटिंग</span>
              </span>
              <h2 className="text-xs sm:text-sm font-extrabold text-white">
                पंचांग, कुंडली, मिलान, पूजा-पाठ एवं पंडित परामर्श पर श्रद्धालुओं का विश्वास
              </h2>
              <p className="text-[11px] text-teal-100">
                आप भी ऐप की किसी भी सेवा के लिए अपना अनुभव साझा कर सकते हैं।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-amber-50 text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
          >
            <Star className="w-3.5 h-3.5 text-[#FF7F33] fill-[#FF7F33]" />
            <span>रेटिंग व रिव्यू दें</span>
          </button>
        </div>
      </div>

      {/* 2. Only Heading + Auto-Sliding Review Card */}
      {currentReview && (
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#008080] dark:text-teal-400" />
              <span>समीक्षाएं (Reviews)</span>
            </h2>
          </div>

          <div
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null || reviews.length <= 1) return;
              const diff = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
              if (Math.abs(diff) > 40) {
                if (diff < 0) {
                  setActiveSlideIdx((prev) => (prev + 1) % reviews.length);
                } else {
                  setActiveSlideIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
                }
              }
              touchStartX.current = null;
            }}
            className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs transition-all duration-500 flex flex-col justify-between gap-3"
          >
            <div className="space-y-2.5">
              {/* Top Row: User Info + Rating */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#008080]/15">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#008080] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {currentReview.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {currentReview.userName}
                      </h3>
                      {currentReview.isVerified && (
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0"
                          title="सत्यापित यजमान / उपयोगकर्ता"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>सत्यापित</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#FF7F33] shrink-0" />
                      <span>{currentReview.userCity}</span>
                      <span>•</span>
                      <span>{formatToDdMmYyyy(currentReview.date)}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg border border-[#FF7F33]/25">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= currentReview.rating
                          ? 'text-[#FF7F33] fill-[#FF7F33]'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Service Badge */}
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-teal-300 text-[10px] font-extrabold">
                  सेवा: {currentReview.serviceCategory}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                “{currentReview.comment}”
              </p>

              {/* Admin Reply if present */}
              {currentReview.adminReply && (
                <div className="p-2.5 rounded-r-xl rounded-l-none bg-teal-50/70 dark:bg-teal-950/30 border-l-3 border-[#008080] text-[11px] text-slate-700 dark:text-slate-300">
                  <strong className="text-[#008080] dark:text-teal-300 block mb-0.5">
                    JyotishWala संस्थान का उत्तर:
                  </strong>
                  <span>{currentReview.adminReply}</span>
                </div>
              )}
            </div>

            {reviews.length > 1 && (
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#008080]/15">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIdx((prev) => (prev - 1 + reviews.length) % reviews.length)
                  }
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  aria-label="पिछली समीक्षा"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {reviews.map((r, idx) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setActiveSlideIdx(idx)}
                      aria-label={`समीक्षा स्लाइड ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeSlideIdx
                          ? 'w-6 bg-[#008080]'
                          : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#008080]/60'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSlideIdx((prev) => (prev + 1) % reviews.length)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  aria-label="अगली समीक्षा"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Submit Review Modal */}
      <ReviewSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        defaultService="सम्पूर्ण ऐप अनुभव (JyotishWala)"
        onSubmitted={() => setReviews(getApprovedReviews())}
      />
    </div>
  );
};

export default ReviewsView;
