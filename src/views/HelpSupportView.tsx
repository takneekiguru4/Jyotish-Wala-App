import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquarePlus,
  CheckCircle2,
  Database,
  Phone,
  Mail,
  Info,
  ChevronDown,
  ChevronUp,
  Server
} from 'lucide-react';
import {
  SUPPORT_FAQS,
  ADMIN_FEATURE_REGISTRY,
  SupportTicketItem,
  getSupportTickets,
  submitSupportTicket
} from '../services/sanatanPlatformService';

interface HelpSupportViewProps {
  language?: 'hi' | 'en';
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ language = 'hi' }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'ticket' | 'manifest'>('faq');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const [ticketType, setTicketType] = useState<'support' | 'issue_report' | 'feedback'>('support');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('पंचांग एवं कुंडली गणना');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<SupportTicketItem[]>(() => getSupportTickets());
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !userName.trim() || !message.trim()) return;
    const tkt = await submitSupportTicket({
      ticketType,
      subject: subject.trim(),
      category,
      userName: userName.trim(),
      userEmail: userEmail.trim() || 'user@jyotishwala.in',
      userPhone: userPhone.trim(),
      message: message.trim()
    });
    setTickets(getSupportTickets());
    setSubject('');
    setMessage('');
    setSubmittedNotice(
      `आपका सहायता टिकट (${tkt.id}) सफलतापूर्वक दर्ज हो गया है और वर्डप्रेस एडमिन सपोर्ट पैनल को प्रेषित कर दिया गया है।`
    );
  };

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#008080] via-[#006666] to-[#004d4d] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/15 text-[11px] font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF7F33]" />
              <span>सहायता केंद्र, सामान्य प्रश्न एवं प्लगइन एकीकरण रजिस्ट्री</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {language === 'en'
                ? 'Help, Support & Plugin Feature Registry'
                : 'सहायता एवं समर्थन केंद्र (Help & Support)'}
            </h1>
            <p className="text-xs text-teal-100 mt-1">
              सामान्य प्रश्न (FAQ), समस्या रिपोर्ट, सुझाव टिकट एवं वर्डप्रेस एडमिन प्लगइन फीचर मैनिफेस्ट
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'faq'
                  ? 'bg-[#FF7F33] text-white'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              सामान्य प्रश्न (FAQ)
            </button>
            <button
              onClick={() => setActiveTab('ticket')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ticket'
                  ? 'bg-[#FF7F33] text-white'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              सहायता टिकट ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('manifest')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'manifest'
                  ? 'bg-[#FF7F33] text-white'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              एडमिन प्लगइन रजिस्ट्री ({ADMIN_FEATURE_REGISTRY.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: FAQs & Contact Info */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="space-y-2.5">
            {SUPPORT_FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#008080]/10 text-[#008080] text-[10px] font-bold">
                        {faq.category}
                      </span>
                      <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] mt-1">
                        {faq.qHi}
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#008080] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[var(--text-muted)] border-t border-[var(--border-color)] leading-relaxed">
                      {faq.aHi}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact & App Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#008080]" />
              <div>
                <div className="text-[11px] text-[var(--text-muted)]">आधिकारिक सहायता ईमेल</div>
                <div className="text-xs font-bold text-[var(--text-main)]">
                  support@jyotishwala.in
                </div>
              </div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#FF7F33]" />
              <div>
                <div className="text-[11px] text-[var(--text-muted)]">कार्यालय समय (ऋषिकेश केंद्र)</div>
                <div className="text-xs font-bold text-[var(--text-main)]">
                  प्रातः ०९:०० - सायं ०७:०० (IST)
                </div>
              </div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3">
              <Info className="w-5 h-5 text-[#008080]" />
              <div>
                <div className="text-[11px] text-[var(--text-muted)]">ऐप संस्करण एवं इंजन</div>
                <div className="text-xs font-bold text-[var(--text-main)]">
                  JyotishWala v4.0 (WP Plugin Sync)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Submit Support Ticket / Issue Report / Feedback */}
      {activeTab === 'ticket' && (
        <div className="space-y-4">
          {submittedNotice && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{submittedNotice}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmitTicket}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 space-y-3.5"
          >
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-[#008080]" />
              <span>नया सहायता अनुरोध / समस्या रिपोर्ट / सुझाव भेजें</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  अनुरोध का प्रकार
                </label>
                <select
                  value={ticketType}
                  onChange={(e) =>
                    setTicketType(e.target.value as 'support' | 'issue_report' | 'feedback')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                >
                  <option value="support">सहायता टिकट (Support Ticket)</option>
                  <option value="issue_report">तकनीकी समस्या रिपोर्ट (Issue Report)</option>
                  <option value="feedback">सुझाव एवं प्रतिक्रिया (Feedback)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  संबंधित विभाग
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                >
                  <option value="पंचांग एवं कुंडली गणना">पंचांग एवं कुंडली गणना</option>
                  <option value="पूजा बुकिंग एवं पंडित परामर्श">पूजा बुकिंग एवं पंडित परामर्श</option>
                  <option value="दक्षिणा भुगतान एवं रसीद सत्यापन">दक्षिणा भुगतान एवं रसीद सत्यापन</option>
                  <option value="ज्ञान विभाग / शास्त्र / संस्कृत">ज्ञान विभाग / शास्त्र / संस्कृत</option>
                  <option value="अन्य सहायता">अन्य सहायता</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  आपका नाम *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="अपना नाम लिखें"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  ईमेल पता
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  मोबाइल नंबर
                </label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                विषय (Subject) *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="संक्षेप में अपना विषय लिखें"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                विस्तृत विवरण *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="अपनी समस्या या प्रश्न का पूरा विवरण लिखें..."
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold"
            >
              सहायता टिकट सबमिट करें
            </button>
          </form>

          {/* Submitted Tickets History */}
          {tickets.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[var(--text-main)]">
                आपके द्वारा भेजे गए सहायता टिकट ({tickets.length})
              </h4>
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#008080]">
                      {t.id} • {t.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 text-[10px] font-bold">
                      {t.status === 'resolved' ? 'समाधान पूर्ण' : 'समीक्षाधीन (Open)'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{t.message}</p>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    श्रेणी: {t.category} • समय: {t.createdAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Admin Feature Registry & Plugin Integration Manifest */}
      {activeTab === 'manifest' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-start gap-2.5">
            <Server className="w-5 h-5 text-[#008080] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Admin Feature Registry & WordPress Plugin Integration Manifest
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                प्रत्येक फ्रंटएंड मॉड्यूल का संबंधित वर्डप्रेस एडमिन प्लगइन पेज, डेटाबेस तालिका, REST API एंडपॉइंट, अनुमति (Permissions) एवं ON/OFF नियंत्रण कुंजी:
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {ADMIN_FEATURE_REGISTRY.map((entry) => (
              <div
                key={entry.featureId}
                className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3.5 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-[var(--text-main)]">
                    {entry.frontendFeatureNameHi}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#008080]/15 text-[#008080] text-[10px] font-bold">
                    Toggle Key: {entry.onOffSettingKey}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-[var(--text-muted)]">
                  <div>
                    <strong className="text-[var(--text-main)]">Frontend View:</strong>{' '}
                    <code>{entry.frontendComponent}</code>
                  </div>
                  <div>
                    <strong className="text-[var(--text-main)]">WP Admin Module:</strong>{' '}
                    {entry.adminPluginModule}
                  </div>
                  <div>
                    <strong className="text-[var(--text-main)]">Database Tables:</strong>{' '}
                    <span className="text-[#008080] font-medium">
                      {entry.databaseTables.join(', ')}
                    </span>
                  </div>
                  <div>
                    <strong className="text-[var(--text-main)]">REST API Endpoints:</strong>{' '}
                    <code className="text-[#FF7F33]">{entry.restEndpoints.join(' | ')}</code>
                  </div>
                </div>
                <div className="text-[11px] text-[var(--text-main)] pt-1 border-t border-[var(--border-color)] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                  <span>{entry.contentManagementCapabilities}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
