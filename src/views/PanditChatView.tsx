import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Award,
  QrCode,
  X,
  Copy,
  CheckCircle2,
  Search,
  UserCheck,
  Upload,
  Send,
  ShieldCheck,
  Clock,
  Globe,
  ArrowLeft,
  FileCheck2
} from 'lucide-react';
import { PanditProfile, LanguageCode, PaymentReceiptSubmission } from '../types';
import {
  getPandits,
  savePaymentReceipt,
  buildAdminReceiptMailtoUrl,
  ADMIN_RECEIPT_EMAIL,
  FALLBACK_PANDIT_AVATAR
} from '../services/astrologerService';
import { DICTIONARY, trTerm } from '../i18n/translations';
import { PaginationControls } from '../components/PaginationControls';

const PANDITS_PER_PAGE = 10;

interface PanditChatViewProps {
  currentLang: LanguageCode;
  onClosePage: () => void;
  onGoBack?: () => void;
}

export const PanditChatView: React.FC<PanditChatViewProps> = ({ currentLang, onClosePage, onGoBack }) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;
  const [pandits, setPandits] = useState<PanditProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQrPandit, setSelectedQrPandit] = useState<PanditProfile | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Payment Receipt Submission State
  const [receiptUserName, setReceiptUserName] = useState('');
  const [receiptUserPhone, setReceiptUserPhone] = useState('');
  const [receiptUserEmail, setReceiptUserEmail] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('₹501');
  const [receiptUtr, setReceiptUtr] = useState('');
  const [receiptNote, setReceiptNote] = useState('');
  const [receiptImageUrl, setReceiptImageUrl] = useState<string>('');
  const [submittedReceipt, setSubmittedReceipt] = useState<PaymentReceiptSubmission | null>(null);
  const receiptFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncPandits = () => setPandits(getPandits());
    syncPandits();
    window.addEventListener('jyotishwala_pandits_changed', syncPandits);
    return () => window.removeEventListener('jyotishwala_pandits_changed', syncPandits);
  }, []);

  useEffect(() => {
    if (!selectedQrPandit) return;
    const feeMatch = selectedQrPandit.dakshinaInfo.match(/₹\s*\d+/);
    setReceiptAmount(feeMatch ? feeMatch[0] : '₹501');
    setSubmittedReceipt(null);
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [selectedQrPandit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredPandits = pandits.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.qualification.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.specialties.some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleCopyPhone = (id: string, phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2500);
  };

  const handleReceiptImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 700;
        let w = img.width;
        let h = img.height;
        if (w > h && w > MAX_DIM) {
          h = Math.round((h * MAX_DIM) / w);
          w = MAX_DIM;
        } else if (h >= w && h > MAX_DIM) {
          w = Math.round((w * MAX_DIM) / h);
          h = MAX_DIM;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          setReceiptImageUrl(canvas.toDataURL('image/jpeg', 0.82));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSendPaymentReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQrPandit || !receiptUserName.trim() || !receiptUserPhone.trim()) return;

    const nowStr = new Date().toLocaleString('hi-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const newReceipt: PaymentReceiptSubmission = {
      id: `rcpt_${Date.now()}`,
      panditId: selectedQrPandit.id,
      panditName: selectedQrPandit.name,
      userName: receiptUserName.trim(),
      userPhone: receiptUserPhone.trim(),
      userEmail: receiptUserEmail.trim() || undefined,
      amount: receiptAmount.trim() || '₹501',
      utrNumber: receiptUtr.trim() || 'QR-भुगतान',
      note: receiptNote.trim() || undefined,
      receiptImageUrl: receiptImageUrl || undefined,
      submittedAt: nowStr,
      adminEmail: ADMIN_RECEIPT_EMAIL
    };

    savePaymentReceipt(newReceipt);
    setSubmittedReceipt(newReceipt);

    // Trigger email delivery to Admin Email (takneekiguru4@gmail.com)
    const mailtoUrl = buildAdminReceiptMailtoUrl(newReceipt);
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.click();
  };

  return (
    <div className="pb-6 space-y-4">
      {/* Top Page Header Card */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3.5">
        {/* Row 1: Back and Close Buttons at the very start of the card */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#008080]/15">
          <button
            type="button"
            onClick={onGoBack || onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            title="पिछले पृष्ठ पर वापस जाएं"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस</span>
          </button>

          <button
            type="button"
            onClick={onClosePage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7F33] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            title="पेज बंद करें"
          >
            <X className="w-3.5 h-3.5" />
            <span>{dict.closePage}</span>
          </button>
        </div>

        {/* Row 2: Title and Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center text-white shrink-0">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
              पंडित जी एवं ज्योतिषाचार्य परामर्श
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              वैदिक जन्मकुंडली विश्लेषण, वास्तु एवं जीवन समस्याओं पर ज्योतिषाचार्यों से सीधा मार्गदर्शन
            </p>
          </div>
        </div>

        {/* Search Bar for Astrologers */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ज्योतिषाचार्य का नाम, योग्यता, विशेषज्ञता या स्थान खोजें..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-[#008080]/20 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#008080]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Astrologers Consultation Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPandits
          .slice((currentPage - 1) * PANDITS_PER_PAGE, currentPage * PANDITS_PER_PAGE)
          .map((pandit) => (
          <div
            key={pandit.id}
            className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs flex flex-col justify-between gap-3.5"
          >
            <div className="space-y-3">
              {/* Top Row: Pandit Photo + Name, Qualification, Location & Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={pandit.avatar || FALLBACK_PANDIT_AVATAR}
                    alt={pandit.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== FALLBACK_PANDIT_AVATAR) {
                        target.src = FALLBACK_PANDIT_AVATAR;
                      }
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#008080] ring-2 ring-[#FF7F33]/25 shrink-0 bg-teal-50 dark:bg-teal-950 shadow-xs"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                        {pandit.name}
                      </h2>
                      {pandit.isChief ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-[#008080] text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                          ⭐ मुख्य ज्योतिषाचार्य
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-[#FF7F33]/15 text-[#FF7F33] dark:text-amber-400 text-[10px] font-bold">
                          परामर्श ज्योतिषाचार्य
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#FF7F33] flex items-start gap-1.5 mt-1 break-words whitespace-normal leading-snug">
                      <Award className="w-3.5 h-3.5 text-[#FF7F33] shrink-0 mt-0.5" />
                      <span className="break-words whitespace-normal">{pandit.qualification}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#008080] shrink-0" />
                      <span className="truncate">{trTerm(pandit.address, currentLang)}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-teal-300 text-[11px] font-bold shrink-0">
                  {pandit.experienceYears}+ वर्ष अनुभव
                </span>
              </div>

              {/* About */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {pandit.about}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5">
                {pandit.specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-teal-300 text-[11px] font-bold"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Contact Info Row (Flat divider row, NOT nested cards) */}
              <div className="pt-2.5 border-t border-[#008080]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                  <a
                    href={`tel:${pandit.mobile}`}
                    className="font-bold text-slate-800 dark:text-slate-200 hover:text-[#008080]"
                  >
                    {pandit.mobile}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(pandit.id, pandit.mobile)}
                    className="p-1 rounded text-slate-400 hover:text-[#008080] cursor-pointer"
                    title="नंबर कॉपी करें"
                  >
                    {copiedPhoneId === pandit.id ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-[#FF7F33] shrink-0" />
                  <a
                    href={`mailto:${pandit.email}`}
                    className="font-semibold text-slate-600 dark:text-slate-300 hover:text-[#008080] truncate"
                  >
                    {pandit.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons Row at Bottom */}
            <div className="pt-3 border-t border-[#008080]/15 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-xs font-extrabold text-[#008080] dark:text-teal-300">
                {pandit.dakshinaInfo}
              </span>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${pandit.mobile}`}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>कॉल करें</span>
                </a>

                <a
                  href={`mailto:${pandit.email}`}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Mail className="w-3.5 h-3.5 text-[#008080]" />
                  <span>ईमेल</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedQrPandit(pandit)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>पेमेंट</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPandits.length > PANDITS_PER_PAGE && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 border border-[#008080]/20 shadow-xs">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredPandits.length}
            pageSize={PANDITS_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            itemLabel="पंडित जी"
          />
        </div>
      )}

      {/* Professional Single-Surface Payment QR & Receipt Submission Modal */}
      {selectedQrPandit && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-none"
          onClick={() => setSelectedQrPandit(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white dark:bg-[#112226] rounded-2xl max-w-xl w-full p-5 sm:p-7 border border-[#008080]/30 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Merged Modal Header & Close Button */}
            <div className="flex items-center justify-between border-b border-[#008080]/20 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  पेमेंट एवं रसीद प्रेषण
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  QR कोड स्कैन कर दक्षिणा भुगतान करें और नीचे से रसीद एडमिन को भेजें
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQrPandit(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#FF7F33] hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
                <span>{dict.closePage}</span>
              </button>
            </div>

            {/* 1. Prominent Large QR Code at Top + Pandit Ji Details Directly Underneath */}
            <div className="text-center space-y-3 pb-5 border-b border-[#008080]/20">
              <div className="p-4 bg-white rounded-2xl border-2 border-[#008080] inline-block mx-auto shadow-xs">
                <img
                  src={selectedQrPandit.qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-60 h-60 sm:w-64 sm:h-64 object-contain mx-auto"
                />
              </div>

              <div className="space-y-1 pt-1">
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedQrPandit.name}
                </h4>
                <p className="text-sm sm:text-base font-extrabold text-[#FF7F33]">
                  {selectedQrPandit.dakshinaInfo}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
                  मोबाइल नंबर: {selectedQrPandit.mobile} • स्थान: {selectedQrPandit.address}
                </p>
              </div>
            </div>

            {/* 2. Receipt / Screenshot Submission Options Directly Below QR Code */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm sm:text-base font-extrabold text-[#008080] dark:text-teal-300 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-[#FF7F33]" />
                  <span>भुगतान की रसीद या स्क्रीनशॉट भेजें</span>
                </h4>
              </div>

              {submittedReceipt ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-3 text-left">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>आपकी पेमेंट रसीद सफलतापूर्वक दर्ज हो गई है!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    रसीद व स्क्रीनशॉट एडमिन पैनल में सुरक्षित कर दिया गया है।
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <a
                      href={buildAdminReceiptMailtoUrl(submittedReceipt)}
                      className="px-4 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-4 h-4" />
                      <span>रसीद भेजें</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmittedReceipt(null)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#008080]/30 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      दूसरी रसीद भेजें
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendPaymentReceipt} className="space-y-3.5 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        आपका नाम *
                      </label>
                      <input
                        type="text"
                        required
                        value={receiptUserName}
                        onChange={(e) => setReceiptUserName(e.target.value)}
                        placeholder="अपना नाम लिखें"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        मोबाइल / व्हाट्सएप नंबर *
                      </label>
                      <input
                        type="text"
                        required
                        value={receiptUserPhone}
                        onChange={(e) => setReceiptUserPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        भुगतान राशि *
                      </label>
                      <input
                        type="text"
                        required
                        value={receiptAmount}
                        onChange={(e) => setReceiptAmount(e.target.value)}
                        placeholder="₹501"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        UTR / ट्रांजेक्शन नंबर *
                      </label>
                      <input
                        type="text"
                        required
                        value={receiptUtr}
                        onChange={(e) => setReceiptUtr(e.target.value)}
                        placeholder="12-अंकों का UTR नंबर"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      पेमेंट का स्क्रीनशॉट / रसीद फोटो चुनें
                    </label>
                    <input
                      ref={receiptFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => receiptFileRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/35 hover:border-[#008080] text-[#008080] dark:text-teal-300 font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-[#FF7F33]" />
                        <span>{receiptImageUrl ? 'स्क्रीनशॉट बदलें' : 'गैलरी से स्क्रीनशॉट अपलोड करें'}</span>
                      </button>
                      {receiptImageUrl && (
                        <img
                          src={receiptImageUrl}
                          alt="Receipt Preview"
                          className="w-12 h-12 rounded-xl object-cover border border-[#008080]"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      परामर्श संदेश / समय (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      value={receiptNote}
                      onChange={(e) => setReceiptNote(e.target.value)}
                      placeholder="जैसे: कुंडली परामर्श प्रातः 11 बजे"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>रसीद भेजें</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanditChatView;
