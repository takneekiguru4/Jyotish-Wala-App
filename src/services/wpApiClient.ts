/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * WordPress Backend REST API Client (/wp-json/jyotishwala/v1/*)
 * Connects the JyotishWala Frontend App to the jyotishwala-backend WordPress Plugin
 * with automatic local proxy fallback (/api/wp/jyotishwala/v1/*) and two-way live sync.
 */

import { AdminUser, KundliChartData, PaymentReceiptSubmission } from '../types';
import {
  getActiveUser,
  setActiveUser,
  DEFAULT_OWNER_AVATAR
} from './authAndRoleService';
import { syncTyoharFromWp, TyoharItem } from '../data/tyoharData';

export interface UserCloudReceipt extends PaymentReceiptSubmission {
  status?: 'pending' | 'verified' | 'rejected';
  adminRemarks?: string;
}

const WP_TOKEN_STORAGE_KEY = 'jyotishwala_wp_bearer_token_v1';
const WP_API_BASE_STORAGE_KEY = 'jyotishwala_wp_api_base_url_v1';
const WP_APP_SETTINGS_STORAGE_KEY = 'jyotishwala_wp_app_settings_v1';
const LOCAL_USER_ACCOUNTS_MIRROR_KEY = 'jyotishwala_user_accounts_mirror_v1';

export interface WpPanchangCalcSettings {
  default_latitude?: number;
  default_longitude?: number;
  default_city_name?: string;
  ayanamsha_type?: string;
  sunrise_zenith_deg?: number;
  samvat_offset_vikram?: number;
  samvat_offset_shaka?: number;
  enable_choghadiya?: boolean;
  enable_muhurat_alerts?: boolean;
  cache_ttl_minutes?: number;
  show_tithi?: boolean;
  show_vara?: boolean;
  show_nakshatra?: boolean;
  show_yoga?: boolean;
  show_karana?: boolean;
  show_sunrise_sunset?: boolean;
  show_rahu_kaal?: boolean;
  show_yamaganda?: boolean;
  show_gulika?: boolean;
  show_abhijit_muhurta?: boolean;
  show_chaughadiya?: boolean;
}

export interface WpKundliCalcSettings {
  ayanamsha?: string;
  house_system?: string;
  dasha_year_length_days?: number;
  enable_shodashvarga?: boolean;
  enable_navamsha_d9?: boolean;
  enable_chandra_chart?: boolean;
  enable_avakahada?: boolean;
  enable_ashtakoot_milan?: boolean;
  enable_manglik_check?: boolean;
  enable_manglik_cancellation?: boolean;
  minimum_recommended_guna?: number;
  default_chart_style?: string;
}

export interface WpAppFeatureSettings {
  app_name?: string;
  app_tagline?: string;
  app_tagline_hi?: string;
  app_tagline_en?: string;
  app_logo_url?: string;
  default_language?: 'hi' | 'en';
  default_city?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  enable_panchang?: boolean;
  enable_kundli?: boolean;
  enable_milan?: boolean;
  enable_rashifal?: boolean;
  enable_gochar?: boolean;
  enable_tyohar?: boolean;
  enable_calculators?: boolean;
  enable_dharma?: boolean;
  enable_sankalp?: boolean;
  enable_pandit_chat?: boolean;
  enable_articles?: boolean;
  enable_gallery?: boolean;
  enable_reviews?: boolean;
  enable_banners?: boolean;
  enable_gyan?: boolean;
  enable_puja_vidhi?: boolean;
  enable_sanskrit?: boolean;
  enable_temples?: boolean;
  enable_puja_booking?: boolean;
  enable_personal_library?: boolean;
  enable_support_tickets?: boolean;
  maintenance_mode?: boolean;
  maintenance_message?: string;
  support_email?: string;
  support_whatsapp?: string;
  panchangSettings?: WpPanchangCalcSettings;
  kundliSettings?: WpKundliCalcSettings;
}

interface MirroredUserAccount extends AdminUser {
  password: string;
}

function normalizePhoneDigits(phone?: string): string {
  const digits = String(phone || '').replace(/\D+/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function loadMirroredAccounts(): MirroredUserAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_USER_ACCOUNTS_MIRROR_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMirroredAccounts(list: MirroredUserAccount[]): void {
  try {
    localStorage.setItem(LOCAL_USER_ACCOUNTS_MIRROR_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage error
  }
}

function upsertMirroredAccount(account: MirroredUserAccount): void {
  const list = loadMirroredAccounts();
  const cleanEmail = (account.email || '').trim().toLowerCase();
  const cleanDigits = normalizePhoneDigits(account.phone);
  const idx = list.findIndex(
    (u) =>
      (u.email || '').toLowerCase() === cleanEmail ||
      (cleanDigits.length >= 10 && normalizePhoneDigits(u.phone) === cleanDigits)
  );
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...account, email: cleanEmail };
  } else {
    list.push({ ...account, email: cleanEmail });
  }
  saveMirroredAccounts(list);
}

function findMirroredAccount(identifier: string): MirroredUserAccount | undefined {
  const clean = String(identifier || '').trim().toLowerCase();
  if (!clean) return undefined;
  const digits = normalizePhoneDigits(clean);
  const list = loadMirroredAccounts();
  return list.find((u) => {
    if ((u.email || '').toLowerCase() === clean) return true;
    if ((u.name || '').toLowerCase() === clean) return true;
    if (digits.length >= 10 && normalizePhoneDigits(u.phone) === digits) return true;
    return false;
  });
}

function mapWpUserToAdminUser(u: {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  gotra?: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
}): AdminUser {
  return {
    id: String(u.id || `usr_${Date.now()}`),
    name: u.name || 'श्रद्धालु यजमान',
    role: 'writer',
    designation: u.gotra || '',
    email: (u.email || '').trim().toLowerCase(),
    phone: u.phone || '',
    address: u.city || '',
    bio: u.bio || '',
    avatar: u.avatar || DEFAULT_OWNER_AVATAR,
    isOwner: false,
    joinedAt: u.createdAt || new Date().toISOString().split('T')[0]
  };
}

export function isFeatureModuleEnabled(
  settings: WpAppFeatureSettings | undefined,
  key: keyof WpAppFeatureSettings,
  defaultValue = true
): boolean {
  if (!settings) return defaultValue;
  const val: unknown = settings[key];
  if (val === undefined || val === null) return defaultValue;
  if (val === false || val === 0 || val === '0' || val === 'false' || val === 'off' || val === '') {
    return false;
  }
  return true;
}

export function getWpAppSettings(): WpAppFeatureSettings {
  try {
    const raw = localStorage.getItem(WP_APP_SETTINGS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return {
      ...parsed,
      enable_panchang: isFeatureModuleEnabled(parsed, 'enable_panchang'),
      enable_kundli: isFeatureModuleEnabled(parsed, 'enable_kundli'),
      enable_milan: isFeatureModuleEnabled(parsed, 'enable_milan'),
      enable_rashifal: isFeatureModuleEnabled(parsed, 'enable_rashifal'),
      enable_gochar: isFeatureModuleEnabled(parsed, 'enable_gochar'),
      enable_tyohar: isFeatureModuleEnabled(parsed, 'enable_tyohar'),
      enable_calculators: isFeatureModuleEnabled(parsed, 'enable_calculators'),
      enable_dharma: isFeatureModuleEnabled(parsed, 'enable_dharma'),
      enable_sankalp: isFeatureModuleEnabled(parsed, 'enable_sankalp'),
      enable_pandit_chat: isFeatureModuleEnabled(parsed, 'enable_pandit_chat'),
      enable_articles: isFeatureModuleEnabled(parsed, 'enable_articles'),
      enable_gallery: isFeatureModuleEnabled(parsed, 'enable_gallery'),
      enable_reviews: isFeatureModuleEnabled(parsed, 'enable_reviews'),
      enable_gyan: isFeatureModuleEnabled(parsed, 'enable_gyan'),
      enable_puja_vidhi: isFeatureModuleEnabled(parsed, 'enable_puja_vidhi'),
      enable_sanskrit: isFeatureModuleEnabled(parsed, 'enable_sanskrit'),
      enable_temples: isFeatureModuleEnabled(parsed, 'enable_temples'),
      enable_puja_booking: isFeatureModuleEnabled(parsed, 'enable_puja_booking'),
      enable_personal_library: isFeatureModuleEnabled(parsed, 'enable_personal_library'),
      enable_support_tickets: isFeatureModuleEnabled(parsed, 'enable_support_tickets'),
      maintenance_mode: isFeatureModuleEnabled(parsed, 'maintenance_mode', false),
    };
  } catch {
    return {};
  }
}

/**
 * Resolves the active WordPress REST base URL.
 */
export function getWpApiBaseUrls(): string[] {
  const candidates: string[] = [];
  try {
    const custom = localStorage.getItem(WP_API_BASE_STORAGE_KEY);
    if (custom && custom.trim()) {
      candidates.push(custom.trim().replace(/\/$/, ''));
    }
  } catch {
    // Ignore
  }

  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_WP_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    candidates.push(envUrl.trim().replace(/\/$/, ''));
  }

  if (typeof window !== 'undefined' && window.location.hostname.includes('jyotishwala.com')) {
    candidates.push(`${window.location.origin}/wp-json/jyotishwala/v1`);
  }

  candidates.push('/api/wp/jyotishwala/v1');
  candidates.push('https://jyotishwala.com/wp-json/jyotishwala/v1');

  return Array.from(new Set(candidates));
}

export function getWpApiBaseUrl(): string {
  const urls = getWpApiBaseUrls();
  return urls[0] || '/api/wp/jyotishwala/v1';
}

export function getWpBearerToken(): string | null {
  try {
    return localStorage.getItem(WP_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setWpBearerToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(WP_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(WP_TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export interface WpApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Performs an authenticated or public request against the WordPress plugin API
 * with automatic fallback across candidate endpoints and cache busting for GET requests.
 */
export async function wpApiFetch<T = unknown>(
  route: string,
  options: RequestInit = {}
): Promise<WpApiResponse<T>> {
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  const method = (options.method || 'GET').toUpperCase();
  const routeWithCb =
    method === 'GET'
      ? `${cleanRoute}${cleanRoute.includes('?') ? '&' : '?'}_t=${Date.now()}`
      : cleanRoute;
  const bases = getWpApiBaseUrls();
  const token = getWpBearerToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string> | undefined)
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let lastErrorMsg = 'सर्वर से संपर्क नहीं हो सका।';

  for (const base of bases) {
    try {
      const resp = await fetch(`${base}${routeWithCb}`, {
        ...options,
        headers,
        cache: 'no-store',
        signal: options.signal || AbortSignal.timeout(7500)
      });

      const contentType = resp.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        continue;
      }

      const json = await resp.json();
      if (resp.status === 404 && json?.code === 'rest_no_route') {
        continue;
      }

      if (!resp.ok || json?.success === false) {
        lastErrorMsg = json?.message || `HTTP ${resp.status}`;
        if (resp.status >= 400 && resp.status < 500 && resp.status !== 404) {
          return {
            success: false,
            message: lastErrorMsg
          };
        }
        continue;
      }

      return {
        success: true,
        data: (json.data !== undefined ? json.data : json) as T,
        message: json.message
      };
    } catch (err) {
      if (err instanceof Error) {
        lastErrorMsg = err.message;
      }
    }
  }

  return {
    success: false,
    message: lastErrorMsg
  };
}

// ============================================================================
// 1. USER AUTHENTICATION & PROFILE SYNC (/user/register, /user/login, /user/forgot-password, /user/forgot-email)
// ============================================================================

export async function registerUserViaWp(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  city?: string;
  gotra?: string;
}): Promise<{ ok: boolean; user?: AdminUser; message?: string }> {
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanPhone = payload.phone.trim();
  const cleanName = payload.name.trim() || 'श्रद्धालु यजमान';

  const res = await wpApiFetch<{
    token: string;
    expiresAt: string;
    user: {
      id: string | number;
      name: string;
      email: string;
      phone?: string;
      city?: string;
      gotra?: string;
      bio?: string;
      avatar?: string;
      createdAt?: string;
    };
  }>('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res.success && res.data?.user) {
    if (res.data.token) {
      setWpBearerToken(res.data.token);
    }
    const profile = mapWpUserToAdminUser({
      ...res.data.user,
      name: res.data.user.name || cleanName,
      email: res.data.user.email || cleanEmail,
      phone: res.data.user.phone || cleanPhone,
      city: res.data.user.city || payload.city || '',
      gotra: res.data.user.gotra || payload.gotra || ''
    });
    upsertMirroredAccount({
      ...profile,
      password: payload.password
    });
    setActiveUser(profile);
    return { ok: true, user: profile };
  }

  // Fallback to local mirror if offline
  const mirroredProfile = mapWpUserToAdminUser({
    id: `usr_${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    city: payload.city || '',
    gotra: payload.gotra || ''
  });
  upsertMirroredAccount({
    ...mirroredProfile,
    password: payload.password
  });
  setActiveUser(mirroredProfile);
  return { ok: true, user: mirroredProfile };
}

export async function loginUserViaWp(payload: {
  identifier: string;
  password: string;
}): Promise<{ ok: boolean; user?: AdminUser; message?: string }> {
  const res = await wpApiFetch<{
    token: string;
    expiresAt: string;
    user: {
      id: string | number;
      name: string;
      email: string;
      phone?: string;
      city?: string;
      gotra?: string;
      bio?: string;
      avatar?: string;
      createdAt?: string;
    };
  }>('/user/login', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.identifier,
      username: payload.identifier,
      phone: payload.identifier,
      password: payload.password
    })
  });

  if (res.success && res.data?.user) {
    if (res.data.token) {
      setWpBearerToken(res.data.token);
    }
    const profile = mapWpUserToAdminUser({
      ...res.data.user,
      email: res.data.user.email || payload.identifier
    });
    upsertMirroredAccount({
      ...profile,
      password: payload.password
    });
    setActiveUser(profile);
    return { ok: true, user: profile };
  }

  // Check local mirrored account (handles accounts created before plugin upgrade or during offline mode)
  const localMatch = findMirroredAccount(payload.identifier);
  if (localMatch && localMatch.password === payload.password) {
    const { password: _pw, ...profile } = localMatch;
    setActiveUser(profile);
    // Sync this account up to WordPress in background
    void wpApiFetch('/user/register', {
      method: 'POST',
      body: JSON.stringify({
        name: localMatch.name,
        email: localMatch.email,
        phone: localMatch.phone,
        password: localMatch.password,
        city: localMatch.address,
        gotra: localMatch.designation
      })
    });
    return { ok: true, user: profile };
  }

  return {
    ok: false,
    message:
      res.message ||
      'ईमेल/मोबाइल नंबर या पासवर्ड गलत है। यदि आप पासवर्ड भूल गए हैं, तो नीचे "पासवर्ड भूल गए?" पर क्लिक करें।'
  };
}

export async function forgotPasswordViaWp(payload: {
  identifier: string;
  newPassword: string;
}): Promise<{ ok: boolean; user?: AdminUser; message?: string }> {
  const res = await wpApiFetch<{
    token?: string;
    expiresAt?: string;
    user?: {
      id: string | number;
      name: string;
      email: string;
      phone?: string;
      city?: string;
      gotra?: string;
      bio?: string;
      avatar?: string;
      createdAt?: string;
    };
  }>('/user/forgot-password', {
    method: 'POST',
    body: JSON.stringify({
      identifier: payload.identifier,
      email: payload.identifier,
      phone: payload.identifier,
      newPassword: payload.newPassword
    })
  });

  if (res.success && res.data?.user) {
    if (res.data.token) {
      setWpBearerToken(res.data.token);
    }
    const profile = mapWpUserToAdminUser({
      ...res.data.user,
      email: res.data.user.email || payload.identifier
    });
    upsertMirroredAccount({
      ...profile,
      password: payload.newPassword
    });
    setActiveUser(profile);
    return {
      ok: true,
      user: profile,
      message: res.message || 'आपका पासवर्ड सफलतापूर्वक बदल दिया गया है।'
    };
  }

  // Also check local mirrored accounts
  const localMatch = findMirroredAccount(payload.identifier);
  if (localMatch) {
    localMatch.password = payload.newPassword;
    upsertMirroredAccount(localMatch);
    const { password: _pw, ...profile } = localMatch;
    setActiveUser(profile);
    void wpApiFetch('/user/register', {
      method: 'POST',
      body: JSON.stringify({
        name: localMatch.name,
        email: localMatch.email,
        phone: localMatch.phone,
        password: payload.newPassword,
        city: localMatch.address,
        gotra: localMatch.designation
      })
    });
    return {
      ok: true,
      user: profile,
      message: 'आपका नया पासवर्ड सुरक्षित कर दिया गया है और आप लॉगिन हो गए हैं।'
    };
  }

  return {
    ok: false,
    message:
      res.message ||
      'इस ईमेल या मोबाइल नंबर से कोई खाता नहीं मिला। कृपया सही ईमेल/मोबाइल दर्ज करें या "नया खाता बनाएं" चुनें।'
  };
}

export async function forgotEmailViaWp(payload: {
  query: string;
}): Promise<{
  ok: boolean;
  accounts?: Array<{ name: string; email: string; phone: string; city?: string }>;
  message?: string;
}> {
  const res = await wpApiFetch<{
    accounts: Array<{ name: string; email: string; phone: string; city?: string }>;
  }>('/user/forgot-email', {
    method: 'POST',
    body: JSON.stringify({ query: payload.query, phone: payload.query, name: payload.query })
  });

  const combined: Array<{ name: string; email: string; phone: string; city?: string }> = [];
  if (res.success && Array.isArray(res.data?.accounts)) {
    combined.push(...res.data.accounts);
  }

  const qClean = payload.query.trim().toLowerCase();
  const qDigits = normalizePhoneDigits(qClean);
  const localList = loadMirroredAccounts();
  for (const item of localList) {
    const matchesPhone = qDigits.length >= 10 && normalizePhoneDigits(item.phone) === qDigits;
    const matchesName = qClean.length >= 2 && item.name.toLowerCase().includes(qClean);
    if (matchesPhone || matchesName) {
      if (!combined.some((c) => c.email.toLowerCase() === item.email.toLowerCase())) {
        combined.push({
          name: item.name,
          email: item.email,
          phone: item.phone || '',
          city: item.address
        });
      }
    }
  }

  if (combined.length > 0) {
    return {
      ok: true,
      accounts: combined
    };
  }

  return {
    ok: false,
    message:
      res.message ||
      'इस मोबाइल नंबर या नाम से कोई पंजीकृत ईमेल पता नहीं मिला। कृपया नया खाता बनाएं।'
  };
}

export async function logoutUserViaWp(): Promise<void> {
  const token = getWpBearerToken();
  if (token) {
    await wpApiFetch('/user/logout', { method: 'POST' });
  }
  setWpBearerToken(null);
  setActiveUser(null);
}

export async function updateUserProfileViaWp(updates: {
  name?: string;
  phone?: string;
  city?: string;
  gotra?: string;
  bio?: string;
  avatar?: string;
  password?: string;
}): Promise<AdminUser | null> {
  const current = getActiveUser();
  if (!current) return null;

  const merged: AdminUser = {
    ...current,
    name: updates.name !== undefined ? updates.name : current.name,
    phone: updates.phone !== undefined ? updates.phone : current.phone,
    address: updates.city !== undefined ? updates.city : current.address,
    designation: updates.gotra !== undefined ? updates.gotra : current.designation,
    bio: updates.bio !== undefined ? updates.bio : current.bio,
    avatar: updates.avatar !== undefined ? updates.avatar : current.avatar
  };
  setActiveUser(merged);

  const mirrored = findMirroredAccount(merged.email);
  if (mirrored) {
    upsertMirroredAccount({
      ...mirrored,
      ...merged,
      password: updates.password || mirrored.password
    });
  }

  await wpApiFetch('/user/profile', {
    method: 'POST',
    body: JSON.stringify(updates)
  });

  return merged;
}

export const updateProfileViaWp = updateUserProfileViaWp;

// ============================================================================
// 2. SAVED KUNDLIS & RECEIPTS CLOUD SYNC (/user/saved-kundlis, /user/receipts)
// ============================================================================

export async function fetchUserSavedKundlisFromWp(): Promise<KundliChartData[]> {
  if (!getWpBearerToken()) return [];
  const res = await wpApiFetch<{ kundlis?: KundliChartData[] }>('/user/saved-kundlis');
  if (res.success && Array.isArray(res.data?.kundlis)) {
    return res.data.kundlis;
  }
  return [];
}

export async function saveKundliToWpCloud(chart: KundliChartData): Promise<void> {
  await wpApiFetch('/user/saved-kundlis', {
    method: 'POST',
    body: JSON.stringify({
      id: chart.id,
      name: chart.name,
      gender: chart.gender,
      birthDate: chart.birthDate,
      birthTime: chart.birthTime,
      birthPlace: chart.birthPlace,
      latitude: chart.latitude,
      longitude: chart.longitude,
      timezone: 5.5,
      chartData: chart
    })
  });
}

export async function deleteKundliFromWpCloud(id: string): Promise<void> {
  if (!getWpBearerToken()) return;
  await wpApiFetch(`/user/saved-kundlis/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}

export async function fetchUserReceiptsFromWp(): Promise<UserCloudReceipt[]> {
  if (!getWpBearerToken()) return [];
  const res = await wpApiFetch<{ receipts?: UserCloudReceipt[] }>('/user/receipts');
  if (res.success && Array.isArray(res.data?.receipts)) {
    return res.data.receipts;
  }
  return [];
}

// ============================================================================
// 3. CONSULTATION PAYMENT RECEIPTS & REVIEWS SUBMISSION
// ============================================================================

export async function submitPaymentReceiptToWp(receipt: {
  id: string;
  panditId: string;
  panditName: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  amount: string;
  utrNumber: string;
  note?: string;
  receiptImageUrl?: string;
}): Promise<boolean> {
  const session = getActiveUser();
  const res = await wpApiFetch('/receipts', {
    method: 'POST',
    body: JSON.stringify({
      ...receipt,
      userId: session?.id || '',
      userEmail: receipt.userEmail || session?.email || ''
    })
  });
  return res.success;
}

export async function submitReviewToWp(review: {
  userName: string;
  userCity: string;
  serviceCategory: string;
  rating: number;
  comment: string;
}): Promise<boolean> {
  const res = await wpApiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  });
  return res.success;
}

// ============================================================================
// 4. INITIAL APP BOOTSTRAP SYNC (Pulls Pandits, Gallery, Reviews, Site Content,
//    Rashifal, Tyohar, Deleted Tyohars, Notifications, and Feature Toggles)
// ============================================================================

export async function syncAllFromWordPressBackend(): Promise<void> {
  try {
    const homeRes = await wpApiFetch<{
      appSettings?: WpAppFeatureSettings;
      siteContent?: {
        slides?: unknown[];
        sankalp?: unknown;
        aboutUs?: unknown;
        privacyPolicy?: unknown;
      };
      pandits?: unknown[];
      gallery?: { meta?: unknown; items?: unknown[] };
      reviews?: { meta?: unknown; items?: unknown[] };
      rashifal?:
        | unknown[]
        | {
            daily?: unknown[];
            weekly?: unknown[];
            monthly?: unknown[];
            yearly?: unknown[];
          };
      tyohar?: Partial<TyoharItem>[];
      deletedTyoharIds?: string[];
      notifications?: unknown[];
    }>('/home');

    if (!homeRes.success || !homeRes.data) {
      return;
    }

    const data = homeRes.data;

    // 1. Sync App Feature Toggles, Branding & Calculation Settings
    if (data.appSettings && typeof data.appSettings === 'object') {
      const normalizedSettings: WpAppFeatureSettings = {
        ...data.appSettings,
        enable_panchang: isFeatureModuleEnabled(data.appSettings, 'enable_panchang'),
        enable_kundli: isFeatureModuleEnabled(data.appSettings, 'enable_kundli'),
        enable_milan: isFeatureModuleEnabled(data.appSettings, 'enable_milan'),
        enable_rashifal: isFeatureModuleEnabled(data.appSettings, 'enable_rashifal'),
        enable_gochar: isFeatureModuleEnabled(data.appSettings, 'enable_gochar'),
        enable_tyohar: isFeatureModuleEnabled(data.appSettings, 'enable_tyohar'),
        enable_calculators: isFeatureModuleEnabled(data.appSettings, 'enable_calculators'),
        enable_dharma: isFeatureModuleEnabled(data.appSettings, 'enable_dharma'),
        enable_sankalp: isFeatureModuleEnabled(data.appSettings, 'enable_sankalp'),
        enable_pandit_chat: isFeatureModuleEnabled(data.appSettings, 'enable_pandit_chat'),
        enable_articles: isFeatureModuleEnabled(data.appSettings, 'enable_articles'),
        enable_gallery: isFeatureModuleEnabled(data.appSettings, 'enable_gallery'),
        enable_reviews: isFeatureModuleEnabled(data.appSettings, 'enable_reviews'),
        enable_banners: isFeatureModuleEnabled(data.appSettings, 'enable_banners'),
        enable_gyan: isFeatureModuleEnabled(data.appSettings, 'enable_gyan'),
        enable_puja_vidhi: isFeatureModuleEnabled(data.appSettings, 'enable_puja_vidhi'),
        enable_sanskrit: isFeatureModuleEnabled(data.appSettings, 'enable_sanskrit'),
        enable_temples: isFeatureModuleEnabled(data.appSettings, 'enable_temples'),
        enable_puja_booking: isFeatureModuleEnabled(data.appSettings, 'enable_puja_booking'),
        enable_personal_library: isFeatureModuleEnabled(data.appSettings, 'enable_personal_library'),
        enable_support_tickets: isFeatureModuleEnabled(data.appSettings, 'enable_support_tickets'),
        maintenance_mode: isFeatureModuleEnabled(data.appSettings, 'maintenance_mode', false),
      };
      localStorage.setItem(WP_APP_SETTINGS_STORAGE_KEY, JSON.stringify(normalizedSettings));
      if (normalizedSettings.app_name && typeof document !== 'undefined') {
        document.title = normalizedSettings.app_name;
      }
      window.dispatchEvent(
        new CustomEvent('jyotishwala_app_settings_changed', { detail: normalizedSettings })
      );
    }

    // 2. Sync Site Content (Banners/Slides, Sankalp, About Us, Privacy Policy)
    if (data.siteContent && typeof data.siteContent === 'object') {
      const existingRaw = localStorage.getItem('jyotishwala_site_content_config');
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const merged: Record<string, unknown> = {
        ...existing
      };
      if (Array.isArray(data.siteContent.slides)) {
        merged.slides = data.siteContent.slides;
        localStorage.setItem('jyotishwala_wp_slides_synced', '1');
      }
      if (data.siteContent.sankalp && typeof data.siteContent.sankalp === 'object') {
        merged.sankalp = { ...(existing.sankalp || {}), ...data.siteContent.sankalp };
      }
      if (data.siteContent.aboutUs && typeof data.siteContent.aboutUs === 'object') {
        merged.aboutUs = { ...(existing.aboutUs || {}), ...data.siteContent.aboutUs };
      }
      if (data.siteContent.privacyPolicy && typeof data.siteContent.privacyPolicy === 'object') {
        merged.privacyPolicy = {
          ...(existing.privacyPolicy || {}),
          ...data.siteContent.privacyPolicy
        };
      }
      localStorage.setItem('jyotishwala_site_content_config', JSON.stringify(merged));
      localStorage.setItem('jyotishwala_site_content_v1', JSON.stringify(merged));
      window.dispatchEvent(
        new CustomEvent('jyotishwala_site_content_changed', { detail: merged })
      );
    }

    // 3. Sync Pandits (including when edited or deleted in WordPress)
    if (Array.isArray(data.pandits)) {
      localStorage.setItem('jyotishwala_wp_pandits_synced', '1');
      localStorage.setItem('jyotishwala_pandit_profiles_v3', JSON.stringify(data.pandits));
      localStorage.setItem('jyotishwala_pandits_v2', JSON.stringify(data.pandits));
      window.dispatchEvent(new CustomEvent('jyotishwala_pandits_changed'));
    }

    // 4. Sync Gallery Meta & Items (including when deleted in WordPress)
    if (data.gallery) {
      if (data.gallery.meta && typeof data.gallery.meta === 'object') {
        localStorage.setItem(
          'jyotishwala_gallery_meta_v2',
          JSON.stringify(data.gallery.meta)
        );
      }
      if (Array.isArray(data.gallery.items)) {
        localStorage.setItem('jyotishwala_wp_gallery_synced', '1');
        localStorage.setItem(
          'jyotishwala_gallery_photos_v2',
          JSON.stringify(data.gallery.items)
        );
      }
      window.dispatchEvent(new CustomEvent('jyotishwala_gallery_changed'));
    }

    // 5. Sync Reviews Meta & Items (including when deleted or moderated in WordPress)
    if (data.reviews) {
      if (data.reviews.meta && typeof data.reviews.meta === 'object') {
        localStorage.setItem(
          'jyotishwala_reviews_meta_v1',
          JSON.stringify(data.reviews.meta)
        );
      }
      if (Array.isArray(data.reviews.items)) {
        localStorage.setItem('jyotishwala_wp_reviews_synced', '1');
        localStorage.setItem(
          'jyotishwala_reviews_list_v1',
          JSON.stringify(data.reviews.items)
        );
      }
      window.dispatchEvent(new CustomEvent('jyotishwala_reviews_changed'));
    }

    // 6. Sync Rashifal (All 12 signs x Daily / Weekly / Monthly / Yearly)
    const normalizeRashifalArray = (arr: unknown[]) => {
      const slugMap: Record<string, number> = {
        mesh: 0,
        aries: 0,
        vrishabh: 1,
        taurus: 1,
        mithun: 2,
        gemini: 2,
        kark: 3,
        karka: 3,
        cancer: 3,
        simha: 4,
        leo: 4,
        kanya: 5,
        virgo: 5,
        tula: 6,
        libra: 6,
        vrishchik: 7,
        scorpio: 7,
        dhanu: 8,
        sagittarius: 8,
        makar: 9,
        capricorn: 9,
        kumbh: 10,
        aquarius: 10,
        meen: 11,
        pisces: 11
      };
      const seen = new Set<number>();
      return arr.map((item, idx) => {
        if (!item || typeof item !== 'object') return item;
        const record = item as Record<string, unknown>;
        let sIdx: number | undefined;
        if (typeof record.signIndex === 'number' && record.signIndex >= 0 && record.signIndex < 12) {
          sIdx = record.signIndex;
        } else if (typeof record.signName === 'string') {
          sIdx = slugMap[record.signName.toLowerCase()];
        } else if (typeof record.rashi_id === 'string') {
          sIdx = slugMap[record.rashi_id.toLowerCase()];
        }
        if (sIdx === undefined || seen.has(sIdx)) {
          for (let cand = 0; cand < 12; cand++) {
            if (!seen.has(cand)) {
              sIdx = cand;
              break;
            }
          }
          if (sIdx === undefined) sIdx = idx % 12;
        }
        seen.add(sIdx);
        return {
          ...record,
          signIndex: sIdx
        };
      });
    };

    if (data.rashifal) {
      if (Array.isArray(data.rashifal) && data.rashifal.length > 0) {
        localStorage.setItem(
          'jyotishwala_rashifal_v3_daily',
          JSON.stringify(normalizeRashifalArray(data.rashifal))
        );
      } else if (typeof data.rashifal === 'object') {
        const rObj = data.rashifal as {
          daily?: unknown[];
          weekly?: unknown[];
          monthly?: unknown[];
          yearly?: unknown[];
        };
        if (Array.isArray(rObj.daily) && rObj.daily.length > 0) {
          localStorage.setItem(
            'jyotishwala_rashifal_v3_daily',
            JSON.stringify(normalizeRashifalArray(rObj.daily))
          );
        }
        if (Array.isArray(rObj.weekly) && rObj.weekly.length > 0) {
          localStorage.setItem(
            'jyotishwala_rashifal_v3_weekly',
            JSON.stringify(normalizeRashifalArray(rObj.weekly))
          );
        }
        if (Array.isArray(rObj.monthly) && rObj.monthly.length > 0) {
          localStorage.setItem(
            'jyotishwala_rashifal_v3_monthly',
            JSON.stringify(normalizeRashifalArray(rObj.monthly))
          );
        }
        if (Array.isArray(rObj.yearly) && rObj.yearly.length > 0) {
          localStorage.setItem(
            'jyotishwala_rashifal_v3_yearly',
            JSON.stringify(normalizeRashifalArray(rObj.yearly))
          );
        }
      }
      window.dispatchEvent(new CustomEvent('jyotishwala_rashifal_changed'));
    }

    // 7. Sync Tyohar (Additions, 8-Section Edits, and Deletions)
    if (Array.isArray(data.tyohar) || Array.isArray(data.deletedTyoharIds)) {
      syncTyoharFromWp(
        Array.isArray(data.tyohar) ? data.tyohar : [],
        Array.isArray(data.deletedTyoharIds) ? data.deletedTyoharIds : []
      );
    }

    // 8. Sync Push Notifications
    if (Array.isArray(data.notifications)) {
      localStorage.setItem(
        'jyotishwala_notifications_v1',
        JSON.stringify(data.notifications)
      );
      window.dispatchEvent(new CustomEvent('jyotishwala_notifications_changed'));
    }
  } catch {
    // Silent fallback to local storage data
  }
}
