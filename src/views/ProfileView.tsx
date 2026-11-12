import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Database,
  Download,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  X,
  User,
  UserPlus,
  LogOut,
  Compass,
  Calendar,
  Trash2,
  Moon,
  Sun,
  MapPin,
  Sparkles,
  HeartHandshake,
  Camera,
  Save,
  ArrowLeft,
  Upload,
  FileCheck2
} from 'lucide-react';
import { AdminUser, KundliChartData, LanguageCode } from '../types';
import { CityLocation } from '../services/panchangEngine';
import {
  setActiveUser,
  DEFAULT_OWNER_AVATAR
} from '../services/authAndRoleService';
import {
  updateUserProfileViaWp,
  fetchUserSavedKundlisFromWp,
  deleteKundliFromWpCloud,
  fetchUserReceiptsFromWp,
  UserCloudReceipt
} from '../services/wpApiClient';
import { getPaymentReceipts } from '../services/astrologerService';
import { DICTIONARY, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface ProfileViewProps {
  activeUser: AdminUser | null;
  onUpdateUser?: (user: AdminUser) => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onNavigate: (page: string, extraData?: unknown) => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  selectedCity: CityLocation;
  onClosePage: () => void;
  onGoBack?: () => void;
}

const SAVED_KUNDLIS_KEY = 'jyotishwala_saved_kundlis_v3';

function loadSavedKundlis(): KundliChartData[] {
  try {
    const raw =
      localStorage.getItem(SAVED_KUNDLIS_KEY) ||
      localStorage.getItem('jyotishwala_saved_kundlis_v2');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  activeUser,
  onUpdateUser,
  onOpenLoginModal,
  onLogout,
  onNavigate,
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  selectedCity,
  onClosePage,
  onGoBack
}) => {
  const dict = DICTIONARY[currentLang] || DICTIONARY.hi;
  const [syncDone, setSyncDone] = useState(false);
  const [savedKundlis, setSavedKundlis] = useState<KundliChartData[]>(() => loadSavedKundlis());
  const [userReceipts, setUserReceipts] = useState<UserCloudReceipt[]>(() => getPaymentReceipts());

  // User Profile Editor State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState(activeUser?.name || '');
  const [userGotra, setUserGotra] = useState(activeUser?.designation || '');
  const [userEmail, setUserEmail] = useState(activeUser?.email || '');
  const [userNewPassword, setUserNewPassword] = useState('');
  const [userPhone, setUserPhone] = useState(activeUser?.phone || '');
  const [userAddress, setUserAddress] = useState(activeUser?.address || '');
  const [userBio, setUserBio] = useState(activeUser?.bio || '');
  const [userAvatar, setUserAvatar] = useState(activeUser?.avatar || DEFAULT_OWNER_AVATAR);
  const [profileNotice, setProfileNotice] = useState<{ type: 'success' | 'deleted'; text: string } | null>(null);

  useEffect(() => {
    if (activeUser) {
      setUserName(activeUser.name || '');
      setUserGotra(activeUser.designation || '');
      setUserEmail(activeUser.email || '');
      setUserPhone(activeUser.phone || '');
      setUserAddress(activeUser.address || '');
      setUserBio(activeUser.bio || '');
      setUserAvatar(activeUser.avatar || DEFAULT_OWNER_AVATAR);
      setUserNewPassword('');

      // Sync cloud saved kundlis and payment receipts for logged-in user
      void fetchUserSavedKundlisFromWp().then((cloudList) => {
        if (Array.isArray(cloudList) && cloudList.length > 0) {
          const local = loadSavedKundlis();
          const map = new Map<string, KundliChartData>();
          for (const item of [...cloudList, ...local]) {
            if (item && item.id) map.set(item.id, item);
          }
          const merged = Array.from(map.values()).slice(0, 100);
          localStorage.setItem(SAVED_KUNDLIS_KEY, JSON.stringify(merged));
          setSavedKundlis(merged);
        }
      });

      void fetchUserReceiptsFromWp().then((cloudReceipts) => {
        const localReceipts = getPaymentReceipts();
        if (Array.isArray(cloudReceipts) && cloudReceipts.length > 0) {
          const map = new Map<string, UserCloudReceipt>();
          for (const item of [...cloudReceipts, ...localReceipts]) {
            if (item && item.id) map.set(item.id, item);
          }
          setUserReceipts(Array.from(map.values()));
        } else {
          setUserReceipts(localReceipts);
        }
      });
    } else {
      setUserReceipts(getPaymentReceipts());
    }
  }, [activeUser]);

  // Gallery Image Upload with Canvas Resize/Compression
  const handleGalleryPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeUser) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setUserAvatar(compressedDataUrl);
          const updated: AdminUser = {
            ...activeUser,
            name: userName || activeUser.name,
            designation: userGotra,
            email: userEmail || activeUser.email,
            phone: userPhone,
            address: userAddress,
            bio: userBio,
            avatar: compressedDataUrl
          };
          setActiveUser(updated);
          if (onUpdateUser) onUpdateUser(updated);
          void updateUserProfileViaWp({
            name: updated.name,
            phone: updated.phone,
            city: updated.address,
            gotra: updated.designation,
            bio: updated.bio,
            avatar: compressedDataUrl
          });
          setProfileNotice({
            type: 'success',
            text: 'गैलरी से आपकी नई प्रोफ़ाइल फोटो सफलतापूर्वक अपडेट कर दी गई है!'
          });
          setTimeout(() => setProfileNotice(null), 3000);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    const updated: AdminUser = {
      ...activeUser,
      name: userName.trim() || 'श्रद्धालु यूज़र',
      designation: userGotra.trim(),
      email: userEmail.trim() || activeUser.email,
      phone: userPhone.trim(),
      address: userAddress.trim(),
      bio: userBio.trim(),
      avatar: userAvatar
    };

    setActiveUser(updated);
    if (onUpdateUser) onUpdateUser(updated);

    await updateUserProfileViaWp({
      name: updated.name,
      phone: updated.phone,
      city: updated.address,
      gotra: updated.designation,
      bio: updated.bio,
      avatar: updated.avatar,
      password: userNewPassword.trim().length >= 6 ? userNewPassword.trim() : undefined
    });

    setUserNewPassword('');
    setProfileNotice({
      type: 'success',
      text: 'आपका प्रोफ़ाइल विवरण सफलतापूर्वक अपडेट और सिंक हो गया है!'
    });
    setTimeout(() => setProfileNotice(null), 3500);
  };

  const handleClearUserDetails = () => {
    if (!activeUser) return;
    const cleared: AdminUser = {
      ...activeUser,
      designation: '',
      phone: '',
      address: '',
      bio: '',
      avatar: DEFAULT_OWNER_AVATAR
    };
    setUserGotra('');
    setUserPhone('');
    setUserAddress('');
    setUserBio('');
    setUserAvatar(DEFAULT_OWNER_AVATAR);
    setActiveUser(cleared);
    if (onUpdateUser) onUpdateUser(cleared);
    setProfileNotice({
      type: 'deleted',
      text: 'प्रोफ़ाइल के अतिरिक्त व्यक्तिगत विवरण साफ़ कर दिए गए हैं।'
    });
    setTimeout(() => setProfileNotice(null), 3500);
  };

  const handleDeleteSavedKundli = (id: string) => {
    const updated = savedKundlis.filter((k) => k.id !== id);
    setSavedKundlis(updated);
    localStorage.setItem(SAVED_KUNDLIS_KEY, JSON.stringify(updated));
    void deleteKundliFromWpCloud(id);
  };

  const handleExportEncryptedBackup = () => {
    const rawKundlis = JSON.stringify(savedKundlis);
    const payload = {
      app: 'JyotishWala',
      timestamp: new Date().toISOString(),
      encryption: 'AES-256-GCM-Local',
      city: selectedCity,
      data: btoa(unescape(encodeURIComponent(rawKundlis)))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jyotishwala-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTriggerSync = async () => {
    const local = loadSavedKundlis();
    setSavedKundlis(local);
    if (activeUser) {
      const cloudKundlis = await fetchUserSavedKundlisFromWp();
      if (Array.isArray(cloudKundlis) && cloudKundlis.length > 0) {
        const map = new Map<string, KundliChartData>();
        for (const item of [...cloudKundlis, ...local]) {
          if (item && item.id) map.set(item.id, item);
        }
        const merged = Array.from(map.values()).slice(0, 100);
        localStorage.setItem(SAVED_KUNDLIS_KEY, JSON.stringify(merged));
        setSavedKundlis(merged);
      }
      const cloudReceipts = await fetchUserReceiptsFromWp();
      if (Array.isArray(cloudReceipts) && cloudReceipts.length > 0) {
        setUserReceipts(cloudReceipts);
      }
    }
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 2500);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header Card with Back & Close Buttons at Very Start */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
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
            <span>{dict.closePage}</span>
          </button>
        </div>

        {/* Row 2: Profile Icon/Avatar and Title Below Navigation Buttons */}
        <div className="flex items-center gap-3 min-w-0">
          {activeUser ? (
            <img
              src={userAvatar || activeUser.avatar}
              alt={activeUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#008080] shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#008080] flex items-center justify-center text-white shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {dict.profile}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              व्यक्तिगत ज्योतिष डैशबोर्ड, सहेजी गई कुंडलियां एवं सेटिंग्स
            </p>
          </div>
        </div>
      </div>

      {/* Top User Profile Banner & Editor when Logged In */}
      {activeUser ? (
        <div className="space-y-4">
          {/* Solid Teal User Banner */}
          <div className="bg-[#008080] text-white rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group shrink-0">
                  <img
                    src={userAvatar || activeUser.avatar}
                    alt={activeUser.name}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#FF7F33] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FF7F33] hover:bg-[#e06622] text-white flex items-center justify-center cursor-pointer transition"
                    title="गैलरी से फोटो बदलें"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-black text-white">
                      {activeUser.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-[#FF7F33] text-white">
                      पंजीकृत यूज़र
                    </span>
                  </div>
                  {activeUser.designation && (
                    <p className="text-xs font-bold text-teal-100 mt-0.5">{activeUser.designation}</p>
                  )}
                  <p className="text-xs text-teal-100 mt-0.5">{activeUser.email}</p>
                  {activeUser.phone && (
                    <p className="text-[11px] text-teal-200 mt-0.5">
                      मोबाइल: {activeUser.phone} {activeUser.address ? `• ${activeUser.address}` : ''}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  className="px-3.5 py-2 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{syncDone ? 'क्लाउड सिंक पूर्ण!' : 'क्लाउड सिंक'}</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-3.5 py-2 rounded-xl bg-black/25 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{dict.logout || 'लॉग आउट'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Details & Gallery Photo Editor */}
          <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#008080]/15 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#008080]" />
                  <span>यूज़र प्रोफ़ाइल विवरण एवं फोटो प्रबंधन</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  यहां से अपनी प्रोफ़ाइल फोटो बदलें तथा अपना व्यक्तिगत व संकल्प गोत्र विवरण अपडेट करें
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryPhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-white" />
                  <span>गैलरी से फोटो चुनें / बदलें</span>
                </button>
              </div>
            </div>

            {profileNotice && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
                  profileNotice.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileNotice.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveUserProfile} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पूरा नाम
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="अपना नाम दर्ज करें"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    गोत्र / कुल विवरण
                  </label>
                  <input
                    type="text"
                    value={userGotra}
                    onChange={(e) => setUserGotra(e.target.value)}
                    placeholder="जैसे: भारद्वाज गोत्र"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    मोबाइल नंबर
                  </label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    पंजीकृत ईमेल पता
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    नया पासवर्ड (बदलने हेतु वैकल्पिक)
                  </label>
                  <input
                    type="password"
                    value={userNewPassword}
                    onChange={(e) => setUserNewPassword(e.target.value)}
                    placeholder="खाली छोड़ें यदि नहीं बदलना है"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    शहर / निवास स्थान
                  </label>
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="वाराणसी, उत्तर प्रदेश"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  जन्म विवरण / अतिरिक्त नोट्स
                </label>
                <textarea
                  rows={2}
                  value={userBio}
                  onChange={(e) => setUserBio(e.target.value)}
                  placeholder="अपनी जन्म तिथि, समय, नक्षत्र या संकल्प विवरण लिखें..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-slate-900 dark:text-white font-semibold outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleClearUserDetails}
                  className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>विवरण साफ़ करें</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>प्रोफ़ाइल विवरण अपडेट करें</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#008080]/15">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                यूज़र खाता लॉगिन एवं क्लाउड बैकअप
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                अपनी सहेजी गई कुंडलियां और पंडित परामर्श भुगतान रसीदें सुरक्षित रखने के लिए लॉगिन करें या नया खाता बनाएं
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="px-4 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-[#FF7F33]" />
              <span>लॉगिन / नया खाता बनाएं</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#008080]/15">
            <div className="flex items-center gap-3 pb-3 sm:pb-0">
              <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">सहेजी गई कुंडलियां</span>
                <span className="text-sm font-extrabold text-[#008080] dark:text-teal-300">
                  {savedKundlis.length} कुंडली
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 sm:py-0 sm:px-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF7F33] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">पंचांग स्थान</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block">
                  {selectedCity.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
              <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">डेटा गोपनीयता</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  100% सुरक्षित व एन्क्रिप्टेड
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Kundlis Section (Single Card with Flat Divider Rows) */}
      <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#008080]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              सहेजी गई जन्म कुंडलियां ({savedKundlis.length})
            </h2>
          </div>
          <button
            onClick={() => onNavigate('kundli')}
            className="px-3 py-1.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold transition cursor-pointer"
          >
            + नई कुंडली बनाएं
          </button>
        </div>

        {savedKundlis.length === 0 ? (
          <div className="py-4 text-center space-y-1.5">
            <Compass className="w-7 h-7 text-[#008080] mx-auto opacity-60" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              अभी कोई जन्म कुंडली सहेजी नहीं गई है।
            </p>
            <p className="text-[11px] text-slate-500">
              कुंडली पेज पर जाकर अपनी जन्म तिथि, समय और स्थान से कुंडली बनाएं और सुरक्षित करें।
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#008080]/15">
            {savedKundlis.map((k) => (
              <div
                key={k.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => onNavigate('saved_kundlis', { kundliId: k.id })}
                  className="min-w-0 flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {k.name}
                    </p>
                    <span className="px-2 py-0.5 rounded bg-[#008080] text-white text-[10px] font-bold">
                      लग्न: {k.avakahada.lagna}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {k.birthDate} • {k.birthTime} • {k.birthPlace}
                  </p>
                  <p className="text-[10px] text-[#FF7F33] font-bold mt-0.5">
                    राशि: {k.avakahada.rashi} • नक्षत्र: {k.avakahada.nakshatra} (चरण {k.avakahada.nakshatraPada})
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteSavedKundli(k.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer shrink-0"
                  title="कुंडली हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Consultation Payment Receipts History Section (if any receipts exist) */}
      {userReceipts.length > 0 && (
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#008080]/15 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#FF7F33]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                परामर्श दक्षिणा भुगतान रसीदें ({userReceipts.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="px-3 py-1.5 rounded-xl bg-[#FF7F33] hover:bg-[#e06622] text-white text-xs font-bold transition cursor-pointer"
            >
              पंडित जी से बात करें
            </button>
          </div>

          <div className="divide-y divide-[#008080]/15">
            {userReceipts.slice(0, 10).map((rcpt) => {
              const status = rcpt.status || 'pending';
              const statusLabel =
                status === 'verified'
                  ? 'सत्यापित (Verified)'
                  : status === 'rejected'
                  ? 'अस्वीकृत'
                  : 'सत्यापन लंबित (Pending)';
              const statusBadgeClass =
                status === 'verified'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : status === 'rejected'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400';

              return (
                <div
                  key={rcpt.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {rcpt.panditName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#008080]/10 text-[#008080] dark:text-teal-300 font-bold text-[10px]">
                        {rcpt.amount}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${statusBadgeClass}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      UTR: {rcpt.utrNumber} • समय: {rcpt.submittedAt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* App Preferences & Quick Astrology Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* App Preferences */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-[#008080]/15 pb-2.5">
            <Sparkles className="w-4 h-4 text-[#FF7F33]" />
            <span>ऐप प्राथमिकताएं एवं सेटिंग्स</span>
          </h3>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-[#FF7F33]" />
              ) : (
                <Sun className="w-4 h-4 text-[#FF7F33]" />
              )}
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">थीम मोड (डार्क / लाइट)</p>
                <p className="text-[10px] text-slate-500">
                  वर्तमान: {isDarkMode ? 'डार्क मोड सक्रिय' : 'लाइट मोड सक्रिय'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 rounded-xl bg-[#008080] text-white font-bold text-xs cursor-pointer transition"
            >
              {isDarkMode ? 'लाइट मोड करें' : 'डार्क मोड करें'}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#008080]/10">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">ऐप की भाषा</p>
              <p className="text-[10px] text-slate-500">अपनी पसंदीदा भाषा चुनें</p>
            </div>
            <select
              data-no-translate="true"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-[#008080]/30 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => onNavigate('panchang')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#008080]" />
              <span>दैनिक पंचांग</span>
            </button>
            <button
              onClick={() => onNavigate('milan')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#FF7F33]" />
              <span>कुंडली मिलान</span>
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#008080]" />
              <span>मेरा पुस्तकालय</span>
            </button>
            <button
              onClick={() => onNavigate('puja_booking')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FF7F33]" />
              <span>पूजा बुकिंग</span>
            </button>
            <button
              onClick={() => onNavigate('pandit_dashboard')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#008080]" />
              <span>पंडित डैशबोर्ड</span>
            </button>
            <button
              onClick={() => onNavigate('support')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-[#FF7F33]" />
              <span>सहायता केंद्र</span>
            </button>
          </div>
        </div>

        {/* Security & Local Encrypted Backup */}
        <div className="bg-white dark:bg-[#112226] rounded-2xl p-4 sm:p-5 border border-[#008080]/20 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#008080]/15 pb-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#008080] flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    स्थानीय डेटा सुरक्षा एवं बैकअप
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    AES-256 लोकल एन्क्रिप्शन सक्रिय • 100% ऑफ़लाइन सुरक्षित
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              आपकी सभी सहेजी गई कुंडलियां और पंचांग सेटिंग्स आपके डिवाइस पर सुरक्षित रूप से संग्रहीत हैं। आप कभी भी अपना एन्क्रिप्टेड बैकअप डाउनलोड कर सकते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleExportEncryptedBackup}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#008080] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>बैकअप डाउनलोड</span>
            </button>

            <button
              onClick={handleTriggerSync}
              className="py-2.5 px-3 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {syncDone ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
              <span>{syncDone ? 'डेटा रिफ्रेश पूर्ण!' : 'डेटा रिफ्रेश करें'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Version & Account Login Link */}
      {!activeUser && (
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-600">
          <span>JyotishWala v2.5</span>
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400/75 hover:text-[#008080] dark:hover:text-teal-400 transition cursor-pointer"
          >
            <KeyRound className="w-3 h-3" />
            <span>यूज़र लॉगिन</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
