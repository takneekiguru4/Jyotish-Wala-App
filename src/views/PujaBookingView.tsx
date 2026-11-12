import React, { useState, useEffect } from 'react';
import {
  CalendarPlus,
  UserCheck,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileText,
  Phone,
  Users
} from 'lucide-react';
import {
  PUJA_CATEGORIES,
  INITIAL_PUJA_VIDHIS,
  BOOKING_STATUS_LABELS,
  PujaBookingRecord,
  getPujaBookings,
  createPujaBookingRequest,
  updatePujaBookingStatusLocal
} from '../services/sanatanPlatformService';
import { getPanditRoster } from '../services/astrologerService';

interface PujaBookingViewProps {
  onNavigate?: (page: string) => void;
  language?: 'hi' | 'en';
}

export const PujaBookingView: React.FC<PujaBookingViewProps> = ({
  onNavigate,
  language = 'hi'
}) => {
  const [activeTab, setActiveTab] = useState<'new_booking' | 'my_bookings'>('new_booking');
  const pandits = getPanditRoster();

  const [pujaCategory, setPujaCategory] = useState<string>(PUJA_CATEGORIES[0]);
  const [pujaServiceTitle, setPujaServiceTitle] = useState<string>(
    INITIAL_PUJA_VIDHIS[0]?.titleHi || 'श्री गणेश षोडशोपचार पूजन'
  );
  const [selectedPanditId, setSelectedPanditId] = useState<string>(pandits[0]?.id || 'pandit_1');
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState<string>('08:30');
  const [mode, setMode] = useState<'in_person' | 'online_sankalp'>('in_person');
  const [yajmanName, setYajmanName] = useState<string>('');
  const [yajmanGotra, setYajmanGotra] = useState<string>('कश्यप');
  const [yajmanPravar, setYajmanPravar] = useState<string>('');
  const [yajmanPhone, setYajmanPhone] = useState<string>('');
  const [city, setCity] = useState<string>('ऋषिकेश, उत्तराखंड');
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  const [bookings, setBookings] = useState<PujaBookingRecord[]>(() => getPujaBookings());
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setBookings(getPujaBookings());
    window.addEventListener('jyotishwala_bookings_changed', sync);
    return () => window.removeEventListener('jyotishwala_bookings_changed', sync);
  }, []);

  const selectedPandit = pandits.find((p) => p.id === selectedPanditId) || pandits[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yajmanName.trim() || !yajmanPhone.trim()) {
      setFeedbackMsg('कृपया यजमान का नाम और मोबाइल नंबर अवश्य भरें।');
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    const res = await createPujaBookingRequest({
      pujaCategory,
      pujaServiceTitle,
      panditId: selectedPandit?.id || 'pandit_1',
      panditName: selectedPandit?.name || 'आचार्य चक्रधर शास्त्री',
      preferredDate,
      preferredTime,
      yajmanName: yajmanName.trim(),
      yajmanGotra: yajmanGotra.trim() || 'कश्यप',
      yajmanPravar: yajmanPravar.trim(),
      yajmanPhone: yajmanPhone.trim(),
      locationAddress:
        mode === 'online_sankalp'
          ? 'ऑनलाइन वीडियो संकल्प अनुष्ठान'
          : locationAddress.trim() || city,
      city: city.trim() || 'ऋषिकेश',
      mode,
      specialInstructions: specialInstructions.trim(),
      dakshinaAmount: selectedPandit?.dakshinaInfo || '₹1,100'
    });

    setSubmitting(false);
    setBookings(getPujaBookings());
    setFeedbackMsg(res.messageHi);
    setActiveTab('my_bookings');
  };

  const handleCancelBooking = (bookingId: string) => {
    updatePujaBookingStatusLocal(
      bookingId,
      'cancelled',
      'यजमान द्वारा स्वयं अनुरोध रद्द किया गया।'
    );
    setBookings(getPujaBookings());
  };

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#008080] via-[#006666] to-[#FF7F33] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 text-[11px] font-bold mb-2">
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>वैदिक अनुष्ठान एवं यजमान पूजा बुकिंग प्रणाली</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {language === 'en'
                ? 'Yajman & Vedic Puja Booking'
                : 'यजमान एवं वैदिक पूजा बुकिंग'}
            </h1>
            <p className="text-xs text-teal-50 mt-1">
              अनुभवी वैदिक आचार्यों द्वारा गृह प्रवेश, रुद्राभिषेक, सत्यनारायण कथा, नवग्रह शांति एवं संस्कार बुकिंग
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('new_booking')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'new_booking'
                  ? 'bg-white text-[#008080] shadow-sm'
                  : 'bg-black/25 text-white hover:bg-black/35'
              }`}
            >
              नया बुकिंग फॉर्म
            </button>
            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'my_bookings'
                  ? 'bg-white text-[#008080] shadow-sm'
                  : 'bg-black/25 text-white hover:bg-black/35'
              }`}
            >
              मेरी बुकिंग ({bookings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Strict Backend Verification Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[var(--text-main)]">
        <ShieldAlert className="w-4 h-4 text-[#FF7F33] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#FF7F33]">बुकिंग पुष्टि नियम (Strict Verification Policy): </strong>
          फॉर्म सबमिट करने पर बुकिंग की प्रारंभिक स्थिति <strong>"लंबित (Pending)"</strong> रहती है। जब तक वर्डप्रेस बैकएंड एडमिन एवं संबंधित आचार्य द्वारा मुहूर्त व उपलब्धता की पुष्टि नहीं की जाती, तब तक कोई भी बुकिंग स्वतः पुष्ट (Confirmed) नहीं मानी जाती।
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-[#008080]/10 border border-[#008080]/30 rounded-xl p-4 flex items-start gap-2.5 text-xs font-bold text-[#008080]">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#FF7F33]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {activeTab === 'new_booking' ? (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4"
        >
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Sparkles className="w-4 h-4 text-[#FF7F33]" />
            <span>पूजा, आचार्य एवं यजमान संकल्प विवरण भरें</span>
          </h2>

          {/* Step 1: Select Puja Category & Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                १. पूजा / कर्मकांड श्रेणी चुनें *
              </label>
              <select
                value={pujaCategory}
                onChange={(e) => {
                  const cat = e.target.value;
                  setPujaCategory(cat);
                  const match = INITIAL_PUJA_VIDHIS.find((p) => p.category === cat);
                  setPujaServiceTitle(match ? match.titleHi : `${cat} वैदिक अनुष्ठान`);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              >
                {PUJA_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                २. विशिष्ट पूजा / अनुष्ठान का नाम *
              </label>
              <input
                type="text"
                value={pujaServiceTitle}
                onChange={(e) => setPujaServiceTitle(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
          </div>

          {/* Step 2: Select Pandit */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
              ३. वैदिक आचार्य / पुरोहित चुनें *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pandits.map((p) => {
                const isSelected = p.id === selectedPanditId;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setSelectedPanditId(p.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                      isSelected
                        ? 'bg-[#008080]/10 border-[#008080] ring-1 ring-[#008080]'
                        : 'bg-[var(--bg-main)] border-[var(--border-color)] hover:border-[#008080]/50'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#008080]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[var(--text-main)] truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] break-words">
                        {p.qualification} • {p.experienceYears} वर्ष अनुभव
                      </div>
                      <div className="text-[11px] font-bold text-[#008080] mt-0.5">
                        {p.dakshinaInfo}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Preferred Date, Time & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                ४. अभिप्रेत दिनांक (Preferred Date) *
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                ५. अभिप्रेत समय (Preferred Time) *
              </label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                ६. पूजन माध्यम (Mode) *
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'in_person' | 'online_sankalp')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              >
                <option value="in_person">प्रत्यक्ष गृह / मंदिर पूजन (In-Person)</option>
                <option value="online_sankalp">ऑनलाइन संकल्प एवं लाइव पूजन</option>
              </select>
            </div>
          </div>

          {/* Step 4: Yajman Details (Name, Gotra, Pravar, Phone) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                ७. मुख्य यजमान का पूरा नाम *
              </label>
              <input
                type="text"
                value={yajmanName}
                onChange={(e) => setYajmanName(e.target.value)}
                placeholder="उदा. श्री राकेश कुमार शर्मा"
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                ८. मोबाइल / व्हाट्सऐप नंबर *
              </label>
              <input
                type="tel"
                value={yajmanPhone}
                onChange={(e) => setYajmanPhone(e.target.value)}
                placeholder="+91 98XXXXXXXX"
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                ९. यजमान का गोत्र (Gotra) *
              </label>
              <input
                type="text"
                value={yajmanGotra}
                onChange={(e) => setYajmanGotra(e.target.value)}
                placeholder="उदा. कश्यप / भारद्वाज / वशिष्ठ / गर्ग"
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                १०. प्रवर / कुलदेवता / परिवार विवरण (वैकल्पिक)
              </label>
              <input
                type="text"
                value={yajmanPravar}
                onChange={(e) => setYajmanPravar(e.target.value)}
                placeholder="सपत्नीक / सपरिवार नाम व प्रवर"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
          </div>

          {/* Step 5: Location & Special Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                ११. शहर / तीर्थ स्थान *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                १२. पूर्ण पता (पूजा स्थल)
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="मकान संख्या, गली, कॉलोनी व लैंडमार्क"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
              १३. विशेष निर्देश / संकल्प कामना (Special Instructions)
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="पूजा सामग्री व्यवस्था, विशिष्ट मुहूर्त या संकल्प कामना यहाँ लिखें..."
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)]"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-color)]">
            <div className="text-xs text-[var(--text-muted)]">
              चयनित आचार्य: <strong className="text-[var(--text-main)]">{selectedPandit?.name}</strong> •{' '}
              <strong className="text-[#008080]">{selectedPandit?.dakshinaInfo}</strong>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs sm:text-sm font-bold shadow-sm transition"
            >
              {submitting ? 'अनुरोध भेजा जा रहा है...' : 'पूजा बुकिंग अनुरोध सबमिट करें'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-[#008080] mx-auto opacity-60" />
              <p className="text-sm font-bold text-[var(--text-main)]">
                अभी आपकी कोई पूजा बुकिंग दर्ज नहीं है।
              </p>
              <button
                onClick={() => setActiveTab('new_booking')}
                className="px-4 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold"
              >
                पहली पूजा बुक करें
              </button>
            </div>
          ) : (
            bookings.map((b) => {
              const statusMeta = BOOKING_STATUS_LABELS[b.status] || BOOKING_STATUS_LABELS.pending;
              return (
                <div
                  key={b.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#008080]">#{b.id}</span>
                        <span className="px-2 py-0.5 rounded bg-[#FF7F33]/15 text-[#FF7F33] text-[10px] font-bold">
                          {b.pujaCategory}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-main)] mt-0.5">
                        {b.pujaServiceTitle}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.hi}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[var(--bg-main)] rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#008080]" />
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)]">आचार्य / पुरोहित</div>
                        <div className="font-bold text-[var(--text-main)]">{b.panditName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#FF7F33]" />
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)]">अभिप्रेत दिनांक व समय</div>
                        <div className="font-bold text-[var(--text-main)]">
                          {b.preferredDate} • {b.preferredTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#008080]" />
                      <div>
                        <div className="text-[10px] text-[var(--text-muted)]">यजमान व गोत्र</div>
                        <div className="font-bold text-[var(--text-main)]">
                          {b.yajmanName} ({b.yajmanGotra})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)] pt-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#008080]" />
                        {b.locationAddress} ({b.city})
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {b.yajmanPhone}
                      </span>
                    </div>

                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>बुकिंग रद्द करें</span>
                      </button>
                    )}
                  </div>

                  {b.adminOrPanditRemarks && (
                    <div className="text-xs bg-[#008080]/5 border border-[#008080]/20 p-2.5 rounded-lg text-[var(--text-main)]">
                      <strong>टिप्पणी:</strong> {b.adminOrPanditRemarks}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {onNavigate && (
        <div className="flex justify-end">
          <button
            onClick={() => onNavigate('pandit')}
            className="text-xs font-bold text-[#008080] hover:underline"
          >
            पंडित परामर्श एवं दक्षिणा QR पेज पर जाएं →
          </button>
        </div>
      )}
    </div>
  );
};
