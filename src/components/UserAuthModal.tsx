/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Mail,
  Phone,
  Lock,
  MapPin,
  Sparkles,
  LogIn,
  UserPlus,
  KeyRound,
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { AdminUser } from '../types';
import {
  loginUserViaWp,
  registerUserViaWp,
  forgotPasswordViaWp,
  forgotEmailViaWp
} from '../services/wpApiClient';
import { saveRegisteredPanditAccount } from '../services/sanatanPlatformService';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot_password' | 'forgot_email';
type AccountTypeOption = 'user' | 'pandit';

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [accountType, setAccountType] = useState<AccountTypeOption>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [gotra, setGotra] = useState('');

  // Pandit Registration Specific Fields (Section 6.2)
  const [panditEducation, setPanditEducation] = useState('');
  const [panditKarmakandQual, setPanditKarmakandQual] = useState('');
  const [panditExpYears, setPanditExpYears] = useState('10');
  const [panditServices, setPanditServices] = useState('जन्मकुंडली विश्लेषण, रुद्राभिषेक, सत्यनारायण कथा, वास्तु शांति');
  const [panditDakshina, setPanditDakshina] = useState('₹501 - ₹2,100');
  const [panditCertificate, setPanditCertificate] = useState('');

  // Forgot Email search state
  const [lookupQuery, setLookupQuery] = useState('');
  const [foundAccounts, setFoundAccounts] = useState<
    Array<{ name: string; email: string; phone: string; city?: string }>
  >([]);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAllFields = () => {
    setMode('login');
    setAccountType('user');
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setCity('');
    setGotra('');
    setPanditEducation('');
    setPanditKarmakandQual('');
    setLookupQuery('');
    setFoundAccounts([]);
    setShowPassword(false);
    setError('');
    setSuccessMsg('');
  };

  useEffect(() => {
    if (isOpen) {
      resetAllFields();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('कृपया अपना ईमेल या मोबाइल नंबर और पासवर्ड दर्ज करें।');
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await loginUserViaWp({
          identifier: email.trim(),
          password
        });
        if (!res.ok || !res.user) {
          setError(
            res.message ||
              'ईमेल/मोबाइल नंबर या पासवर्ड गलत है। यदि पासवर्ड भूल गए हैं, तो नीचे "पासवर्ड भूल गए?" पर क्लिक करें।'
          );
          return;
        }
        resetAllFields();
        onLoginSuccess(res.user);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        setError('कृपया नाम, ईमेल, मोबाइल नंबर और पासवर्ड अवश्य भरें।');
        return;
      }
      if (!email.includes('@')) {
        setError('कृपया सही ईमेल पता दर्ज करें (उदाहरण: name@gmail.com)।');
        return;
      }
      if (password.length < 6) {
        setError('सुरक्षा के लिए पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await registerUserViaWp({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          city: city.trim(),
          gotra: gotra.trim()
        });
        if (!res.ok || !res.user) {
          setError(res.message || 'पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।');
          return;
        }

        if (accountType === 'pandit') {
          await saveRegisteredPanditAccount({
            id: `pandit_${Date.now()}`,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            city: city.trim() || 'ऋषिकेश',
            languages: ['हिंदी', 'संस्कृत'],
            education: panditEducation.trim() || 'ज्योतिष एवं संस्कृत शास्त्री',
            karmakandQualification:
              panditKarmakandQual.trim() || 'वैदिक कर्मकांड एवं अनुष्ठान आचार्य',
            experienceYears: Number(panditExpYears) || 10,
            specialServices: panditServices
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            dakshinaRange: panditDakshina.trim() || '₹501 - ₹2,100',
            availability: 'प्रातः ०८:०० से रात्रि ०८:००',
            avatarUrl:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            certificateDetails: panditCertificate.trim() || 'सत्यापन हेतु प्रमाणपत्र प्रस्तुत',
            verificationStatus: 'pending_verification',
            registeredAt: new Date().toLocaleDateString('hi-IN')
          });
        }

        resetAllFields();
        onLoginSuccess(res.user);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'forgot_password') {
      if (!email.trim()) {
        setError('कृपया अपना पंजीकृत ईमेल पता या 10 अंकों का मोबाइल नंबर दर्ज करें।');
        return;
      }
      if (password.length < 6) {
        setError('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
        return;
      }
      if (password !== confirmPassword) {
        setError('नया पासवर्ड और पुष्टि पासवर्ड दोनों एक समान होने चाहिए।');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await forgotPasswordViaWp({
          identifier: email.trim(),
          newPassword: password
        });
        if (!res.ok || !res.user) {
          setError(
            res.message ||
              'इस ईमेल या मोबाइल नंबर से कोई खाता नहीं मिला। कृपया सही विवरण दर्ज करें।'
          );
          return;
        }
        resetAllFields();
        onLoginSuccess(res.user);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'forgot_email') {
      if (!lookupQuery.trim() || lookupQuery.trim().length < 2) {
        setError('कृपया अपना पंजीकृत 10 अंकों का मोबाइल नंबर या अपना नाम दर्ज करें।');
        return;
      }
      setIsSubmitting(true);
      setFoundAccounts([]);
      try {
        const res = await forgotEmailViaWp({ query: lookupQuery.trim() });
        if (!res.ok || !res.accounts || res.accounts.length === 0) {
          setError(
            res.message ||
              'इस मोबाइल नंबर या नाम से कोई पंजीकृत ईमेल नहीं मिला। कृपया नया खाता बनाएं।'
          );
          return;
        }
        setFoundAccounts(res.accounts);
        setSuccessMsg('आपका पंजीकृत खाता मिल गया है! नीचे दिए गए विकल्प से लॉगिन करें।');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-[#112226] rounded-2xl border border-[#008080]/30 shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="bg-[#008080] px-5 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/25 shrink-0">
              <Sparkles className="w-5 h-5 text-[#FF7F33]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold tracking-wide truncate">
                {mode === 'login' && 'यजमान खाता लॉगिन'}
                {mode === 'signup' && 'नया यजमान खाता बनाएं'}
                {mode === 'forgot_password' && 'पासवर्ड रीसेट करें (Forgot Password)'}
                {mode === 'forgot_email' && 'अपना ईमेल खोजें (Forgot Email)'}
              </h2>
              <p className="text-[11px] text-teal-100 truncate">
                JyotishWala (ज्योतिषवाला) • सुरक्षित डेटाबेस खाता
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer shrink-0"
            title="बंद करें"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switch Tabs (Login / Signup) */}
        <div className="grid grid-cols-2 p-2 bg-[#FAF7F2] dark:bg-slate-900 border-b border-[#008080]/15 gap-2">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              mode === 'login'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>लॉगिन करें (Login)</span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#FF7F33] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>नया खाता बनाएं (Sign Up)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 leading-relaxed">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ==================== MODE 1 & 2: LOGIN & SIGNUP ==================== */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              {mode === 'signup' && (
                <>
                  {/* Account Type Selection (Section 6.1) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      खाता प्रकार चुनें (Select Account Type) *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAccountType('user')}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold transition cursor-pointer ${
                          accountType === 'user'
                            ? 'bg-[#008080] text-white border-[#008080]'
                            : 'bg-[#FAF7F2] dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#008080]/30'
                        }`}
                      >
                        सामान्य उपयोगकर्ता / यजमान
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('pandit')}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold transition cursor-pointer ${
                          accountType === 'pandit'
                            ? 'bg-[#FF7F33] text-white border-[#FF7F33]'
                            : 'bg-[#FAF7F2] dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-[#008080]/30'
                        }`}
                      >
                        पंडित / पुरोहित पंजीकरण
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पूरा नाम (Full Name) *
                    </label>
                    <div className="relative">
                      <UserCheck className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={
                          accountType === 'pandit'
                            ? 'उदा. आचार्य चक्रधर शास्त्री'
                            : 'अपना शुभ नाम लिखें'
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {mode === 'login'
                    ? 'ईमेल पता या मोबाइल नंबर (Email or Mobile) *'
                    : 'ईमेल पता (Email ID) *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={mode === 'login' ? 'text' : 'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      mode === 'login'
                        ? 'ईमेल या 10 अंकों का मोबाइल नंबर लिखें'
                        : 'example@gmail.com'
                    }
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    मोबाइल / व्हाट्सएप नंबर (Mobile No.) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पासवर्ड (Password) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="कम से कम 6 अक्षरों का पासवर्ड"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#008080] cursor-pointer"
                    title={showPassword ? 'पासवर्ड छिपाएं' : 'पासवर्ड देखें'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPassword('');
                      setConfirmPassword('');
                      switchMode('forgot_password');
                    }}
                    className="text-xs font-extrabold text-[#FF7F33] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>पासवर्ड भूल गए? (Forgot Password)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLookupQuery('');
                      setFoundAccounts([]);
                      switchMode('forgot_email');
                    }}
                    className="text-xs font-extrabold text-[#008080] dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>ईमेल भूल गए? (Forgot Email)</span>
                  </button>
                </div>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      शहर / स्थान (City)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="जैसे: ऋषिकेश, वाराणसी"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      गोत्र (Gotra - वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      placeholder="जैसे: कश्यप, भारद्वाज"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                    />
                  </div>
                </div>
              )}

              {/* Pandit / Purohit Specific Fields (Section 6.2 & 6.3) */}
              {mode === 'signup' && accountType === 'pandit' && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-[#FF7F33]/35 space-y-2.5">
                  <div className="text-[11px] font-extrabold text-[#FF7F33]">
                    पंडित / पुरोहित योग्यता एवं सेवा विवरण (बैकएंड सत्यापन पश्चात "सत्यापित आचार्य" बैज मिलेगा)
                  </div>
                  <input
                    type="text"
                    value={panditEducation}
                    onChange={(e) => setPanditEducation(e.target.value)}
                    placeholder="संस्कृत / ज्योतिष शैक्षणिक उपाधि (उदा. आचार्य - फलित ज्योतिष)"
                    className="w-full px-3 py-2 rounded-lg border border-[#008080]/30 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={panditKarmakandQual}
                    onChange={(e) => setPanditKarmakandQual(e.target.value)}
                    placeholder="कर्मकांड विशेषज्ञता (रुद्राभिषेक, वास्तु शांति, विवाह संस्कार आदि)"
                    className="w-full px-3 py-2 rounded-lg border border-[#008080]/30 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={panditExpYears}
                      onChange={(e) => setPanditExpYears(e.target.value)}
                      placeholder="अनुभव (वर्ष)"
                      className="w-full px-3 py-2 rounded-lg border border-[#008080]/30 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={panditDakshina}
                      onChange={(e) => setPanditDakshina(e.target.value)}
                      placeholder="दक्षिणा शुल्क सीमा"
                      className="w-full px-3 py-2 rounded-lg border border-[#008080]/30 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <input
                    type="text"
                    value={panditCertificate}
                    onChange={(e) => setPanditCertificate(e.target.value)}
                    placeholder="विश्वविद्यालय / संस्कृत अकादमी प्रमाणपत्र विवरण"
                    className="w-full px-3 py-2 rounded-lg border border-[#008080]/30 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#FF7F33] hover:bg-[#e66a20] disabled:opacity-60 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
                >
                  {isSubmitting
                    ? 'प्रतीक्षा करें...'
                    : mode === 'login'
                      ? 'लॉगिन करें'
                      : 'खाता बनाएं और लॉगिन करें'}
                </button>
              </div>
            </>
          )}

          {/* ==================== MODE 3: FORGOT PASSWORD ==================== */}
          {mode === 'forgot_password' && (
            <>
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-[#FF7F33]/30 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                अपना पंजीकृत <strong>ईमेल पता</strong> या <strong>10 अंकों का मोबाइल नंबर</strong> दर्ज करें और अपना नया पासवर्ड बनाएं।
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पंजीकृत ईमेल पता या मोबाइल नंबर *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com या 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  नया पासवर्ड (New Password) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="कम से कम 6 अक्षरों का नया पासवर्ड"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#008080] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  नए पासवर्ड की पुष्टि करें (Confirm New Password) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="नया पासवर्ड दोबारा लिखें"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>वापस लॉगिन पर</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#FF7F33] hover:bg-[#e66a20] disabled:opacity-60 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
                >
                  {isSubmitting ? 'बदला जा रहा है...' : 'पासवर्ड बदलें और लॉगिन करें'}
                </button>
              </div>
            </>
          )}

          {/* ==================== MODE 4: FORGOT EMAIL ==================== */}
          {mode === 'forgot_email' && (
            <>
              <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/30 border border-[#008080]/25 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                यदि आप अपना ईमेल भूल गए हैं, तो अपना <strong>मोबाइल नंबर</strong> या <strong>पूरा नाम</strong> नीचे लिखें। हम आपका पंजीकृत ईमेल खोज देंगे।
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पंजीकृत मोबाइल नंबर या नाम लिखें *
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#008080] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="9876543210 या अपना नाम लिखें"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#008080]/30 bg-[#FAF7F2] dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#008080]"
                  />
                </div>
              </div>

              {foundAccounts.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-extrabold text-[#008080] dark:text-teal-300">
                    मिले हुए खाते ({foundAccounts.length}):
                  </p>
                  {foundAccounts.map((acc, idx) => (
                    <div
                      key={`${acc.email}-${idx}`}
                      className="p-3 rounded-xl bg-[#FAF7F2] dark:bg-slate-900 border border-[#008080]/30 flex flex-col gap-2"
                    >
                      <div className="text-xs">
                        <p className="font-extrabold text-slate-900 dark:text-white">{acc.name}</p>
                        <p className="font-bold text-[#008080] dark:text-teal-300 break-all">
                          ईमेल: {acc.email}
                        </p>
                        {acc.phone && (
                          <p className="text-[11px] text-slate-500">मोबाइल: {acc.phone}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(acc.email);
                            switchMode('login');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#008080] text-white text-[11px] font-bold cursor-pointer"
                        >
                          इस ईमेल से लॉगिन करें
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEmail(acc.email);
                            setPassword('');
                            setConfirmPassword('');
                            switchMode('forgot_password');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FF7F33] text-white text-[11px] font-bold cursor-pointer"
                        >
                          पासवर्ड रीसेट करें
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>वापस लॉगिन पर</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#008080] hover:bg-teal-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
                >
                  {isSubmitting ? 'खोजा जा रहा है...' : 'ईमेल खोजें'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
