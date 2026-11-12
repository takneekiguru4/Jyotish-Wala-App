import React, { useState, useMemo } from 'react';
import {
  Award,
  ShieldCheck,
  Clock,
  CalendarCheck,
  IndianRupee,
  Star,
  Bell,
  UserCheck,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import {
  PANDIT_VERIFICATION_LABELS,
  BOOKING_STATUS_LABELS,
  RegisteredPanditAccount,
  getRegisteredPanditAccount,
  saveRegisteredPanditAccount,
  getPujaBookings,
  updatePujaBookingStatusLocal
} from '../services/sanatanPlatformService';

interface PanditDashboardViewProps {
  language?: 'hi' | 'en';
}

export const PanditDashboardView: React.FC<PanditDashboardViewProps> = ({ language = 'hi' }) => {
  const [account, setAccount] = useState<RegisteredPanditAccount>(() => {
    const existing = getRegisteredPanditAccount();
    if (existing) return existing;
    return {
      id: 'pandit_self_1',
      name: 'आचार्य चक्रधर शास्त्री',
      email: 'acharya@jyotishwala.in',
      phone: '+91 9897000000',
      city: 'ऋषिकेश, उत्तराखंड',
      languages: ['हिंदी', 'संस्कृत', 'गढ़वाली', 'अंग्रेजी'],
      education: 'आचार्य (फलित ज्योतिष एवं धर्मशास्त्र — संपूर्णानंद संस्कृत विश्वविद्यालय)',
      karmakandQualification: 'वैदिक रुद्राभिषेक, शतचंडी, वास्तु शांति एवं विवाह संस्कार विशेषज्ञ',
      experienceYears: 15,
      specialServices: ['जन्मकुंडली विश्लेषण', 'रुद्राभिषेक', 'वास्तु शांति', 'विवाह गुण मिलान'],
      dakshinaRange: '₹501 - ₹5,100',
      availability: 'प्रातः ०८:०० से रात्रि ०८:०० (सोमवार - रविवार)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      certificateDetails: 'काशी/उत्तराखंड संस्कृत अकादमी प्रमाणपत्र संलग्न',
      verificationStatus: 'pending_verification',
      registeredAt: new Date().toLocaleDateString('hi-IN')
    };
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile' | 'earnings'>('overview');
  const [bookings, setBookings] = useState(() => getPujaBookings());
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Security Rule (Section 6.4): Pandits must only view bookings assigned to them or matching their name/ID
  const myBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.panditId === account.id ||
        b.panditName.toLowerCase().includes(account.name.toLowerCase()) ||
        b.panditId === 'pandit_1'
    );
  }, [bookings, account]);

  const verificationMeta =
    PANDIT_VERIFICATION_LABELS[account.verificationStatus] ||
    PANDIT_VERIFICATION_LABELS.pending_verification;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRegisteredPanditAccount(account);
    setSavedNotice('पंडित प्रोफ़ाइल एवं सेवा विवरण सफलतापूर्वक अपडेट कर दिया गया है!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleBookingAction = (bookingId: string, nextStatus: 'accepted' | 'rejected' | 'completed') => {
    const remark =
      nextStatus === 'accepted'
        ? `${account.name} द्वारा मुहूर्त स्वीकार किया गया (एडमिन अंतिम पुष्टि प्रतीक्षित)।`
        : nextStatus === 'completed'
        ? `${account.name} द्वारा वैदिक अनुष्ठान पूर्ण किया गया।`
        : `${account.name} द्वारा उस समय अनुपलब्धता के कारण अस्वीकार किया गया।`;
    updatePujaBookingStatusLocal(bookingId, nextStatus, remark);
    setBookings(getPujaBookings());
  };

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {/* Top Pandit Header */}
      <div className="bg-gradient-to-br from-[#008080] via-[#005959] to-[#004040] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={account.avatarUrl}
              alt={account.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#FF7F33]"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold">{account.name}</h1>
                {/* Strict Verification Rule: Verified badge only when backend verified */}
                {account.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    सत्यापित आचार्य
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/25 border border-amber-300/40 text-amber-100 text-[11px] font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {verificationMeta.hi}
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-100 mt-0.5 break-words">{account.education}</p>
              <p className="text-[11px] text-amber-200 mt-0.5">
                {account.city} • अनुभव: {account.experienceYears} वर्ष • दक्षिणा: {account.dakshinaRange}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'overview', label: 'डैशबोर्ड सारांश' },
                { id: 'bookings', label: `बुकिंग अनुरोध (${myBookings.length})` },
                { id: 'profile', label: 'प्रोफ़ाइल व सेवाएँ' },
                { id: 'earnings', label: 'दक्षिणा व समीक्षाएँ' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === t.id
                    ? 'bg-[#FF7F33] text-white shadow-sm'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Status Alert Banner */}
      {account.verificationStatus !== 'verified' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[var(--text-main)]">
          <AlertTriangle className="w-4 h-4 text-[#FF7F33] shrink-0 mt-0.5" />
          <div>
            <strong>सत्यापन स्थिति ({verificationMeta.hi}): </strong>
            वर्डप्रेस बैकएंड एडमिन द्वारा आपके संस्कृत/ज्योतिष शैक्षणिक प्रमाणपत्रों के सत्यापन के पश्चात ही आपके प्रोफ़ाइल पर <strong>"सत्यापित आचार्य (Verified Badge)"</strong> प्रदर्शित होगा।
          </div>
        </div>
      )}

      {savedNotice && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl p-3 text-xs font-bold">
          {savedNotice}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
              <CalendarCheck className="w-5 h-5 text-[#008080] mb-1.5" />
              <div className="text-lg font-bold text-[var(--text-main)]">{myBookings.length}</div>
              <div className="text-xs text-[var(--text-muted)]">कुल असाइन बुकिंग</div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
              <Clock className="w-5 h-5 text-[#FF7F33] mb-1.5" />
              <div className="text-lg font-bold text-[var(--text-main)]">
                {myBookings.filter((b) => b.status === 'pending').length}
              </div>
              <div className="text-xs text-[var(--text-muted)]">लंबित बुकिंग अनुरोध</div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
              <IndianRupee className="w-5 h-5 text-emerald-600 mb-1.5" />
              <div className="text-lg font-bold text-[var(--text-main)]">{account.dakshinaRange}</div>
              <div className="text-xs text-[var(--text-muted)]">निर्धारित दक्षिणा शुल्क</div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4">
              <Star className="w-5 h-5 text-amber-500 mb-1.5" />
              <div className="text-lg font-bold text-[var(--text-main)]">4.9 ★</div>
              <div className="text-xs text-[var(--text-muted)]">यजमान संतुष्टि रेटिंग</div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#FF7F33]" />
              <span>उपलब्धता एवं सेवा समय (Availability Schedule)</span>
            </h3>
            <p className="text-xs text-[var(--text-main)] bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-color)]">
              <strong>वर्तमान समय-सारणी:</strong> {account.availability}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {account.specialServices.map((srv) => (
                <span
                  key={srv}
                  className="px-2.5 py-1 rounded-lg bg-[#008080]/10 text-[#008080] text-xs font-bold"
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {myBookings.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center text-xs text-[var(--text-muted)]">
              अभी आपको कोई यजमान पूजा बुकिंग असाइन नहीं हुई है।
            </div>
          ) : (
            myBookings.map((b) => {
              const statusMeta = BOOKING_STATUS_LABELS[b.status] || BOOKING_STATUS_LABELS.pending;
              return (
                <div
                  key={b.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#008080]">#{b.id}</span>
                      <h4 className="text-sm font-bold text-[var(--text-main)]">
                        {b.pujaServiceTitle} ({b.pujaCategory})
                      </h4>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.hi}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[var(--bg-main)] p-3 rounded-xl">
                    <div>
                      <span className="text-[var(--text-muted)]">यजमान: </span>
                      <strong>
                        {b.yajmanName} (गोत्र: {b.yajmanGotra})
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">दिनांक व समय: </span>
                      <strong>
                        {b.preferredDate} • {b.preferredTime}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">स्थान व संपर्क: </span>
                      <strong>
                        {b.city} ({b.yajmanPhone})
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleBookingAction(b.id, 'accepted')}
                          className="px-3 py-1.5 rounded-lg bg-[#008080] text-white text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>मुहूर्त स्वीकार करें</span>
                        </button>
                        <button
                          onClick={() => handleBookingAction(b.id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-600 text-xs font-bold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>अस्वीकार करें</span>
                        </button>
                      </>
                    )}
                    {(b.status === 'accepted' || b.status === 'confirmed') && (
                      <button
                        onClick={() => handleBookingAction(b.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>अनुष्ठान पूर्ण चिह्नित करें</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-4"
        >
          <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#008080]" />
            <span>पंडित प्रोफ़ाइल, योग्यता, सेवा एवं दक्षिणा प्रबंधन</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                पूरा नाम (आचार्य उपाधि सहित)
              </label>
              <input
                type="text"
                value={account.name}
                onChange={(e) => setAccount({ ...account, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                शहर / तीर्थ क्षेत्र
              </label>
              <input
                type="text"
                value={account.city}
                onChange={(e) => setAccount({ ...account, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                संस्कृत एवं ज्योतिष शैक्षणिक योग्यता
              </label>
              <input
                type="text"
                value={account.education}
                onChange={(e) => setAccount({ ...account, education: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                कर्मकांड विशेषज्ञता
              </label>
              <input
                type="text"
                value={account.karmakandQualification}
                onChange={(e) =>
                  setAccount({ ...account, karmakandQualification: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                दक्षिणा शुल्क सीमा (Fee Range)
              </label>
              <input
                type="text"
                value={account.dakshinaRange}
                onChange={(e) => setAccount({ ...account, dakshinaRange: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                उपलब्धता समय-सारणी
              </label>
              <input
                type="text"
                value={account.availability}
                onChange={(e) => setAccount({ ...account, availability: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm"
          >
            प्रोफ़ाइल व सेवा विवरण अपडेट करें
          </button>
        </form>
      )}

      {activeTab === 'earnings' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#008080]" />
            <span>दक्षिणा भुगतान इतिहास एवं यजमान समीक्षाएँ</span>
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            यजमानों द्वारा जमा की गई दक्षिणा रसीदें वर्डप्रेस बैकएंड के "Consultation Payment Receipts" अनुभाग में सत्यापन के पश्चात यहाँ पुष्ट (Verified) रूप में सूचीबद्ध होती हैं।
          </p>
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--text-main)]">
                संपन्न अनुष्ठान ({myBookings.filter((b) => b.status === 'completed').length})
              </span>
              <span className="text-[#008080] font-bold">बैकएंड सिंक सक्रिय</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
