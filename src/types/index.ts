/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LanguageCode = 'hi' | 'en' | 'sa' | 'mr' | 'gu' | 'bn';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'writer' | 'astrologer_expert';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  designation?: string;
  address?: string;
  bio?: string;
  isOwner: boolean;
  joinedAt: string;
}

export interface MemberInvite {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  token: string;
  status: 'pending' | 'accepted' | 'revoked';
}

export interface PlanetaryPosition {
  name: string;
  hindiName: string;
  symbol: string;
  signIndex: number;
  signName: string;
  signHindiName: string;
  house: number;
  degree: number;
  minutes: number;
  seconds: number;
  isRetrograde: boolean;
  isCombust: boolean;
  status: 'uchcha' | 'neecha' | 'swakshetra' | 'mitra' | 'shatru' | 'sama';
  statusHindi: string;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
}

export interface AvakahadaChakraData {
  varna: string;
  vashya: string;
  yoni: string;
  gana: string;
  nadi: string;
  rashi: string;
  rashiLord: string;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  lagna: string;
  lagnaLord: string;
  tithi: string;
  vara: string;
  yoga: string;
  karana: string;
  nameAlphabet: string;
  paya: string;
}

export interface PratyantarDashaItem {
  planet: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isCurrent?: boolean;
}

export interface AntarDashaItem {
  planet: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  isCurrent?: boolean;
  pratyantarDashas?: PratyantarDashaItem[];
}

export interface DashaPeriodItem {
  planet: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  durationYears: number;
  balanceText?: string;
  isCurrent: boolean;
  antarDashas: AntarDashaItem[];
}

export interface KundliChartData {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: number;
  lagnaSign: number;
  chandraSign: number;
  planets: PlanetaryPosition[];
  houses: { [houseNum: number]: { signIndex: number; signName: string; planets: string[] } };
  horaHouses?: { [houseNum: number]: { signIndex: number; signName: string; planets: string[] } };
  chandraHouses: { [houseNum: number]: { signIndex: number; signName: string; planets: string[] } };
  navamshaHouses: { [houseNum: number]: { signIndex: number; planets: string[] } };
  dashamshaHouses: { [houseNum: number]: { signIndex: number; planets: string[] } };
  avakahada: AvakahadaChakraData;
  vimshottariDasha: DashaPeriodItem[];
  currentDasha: {
    mahaDasha: string;
    antarDasha: string;
    pratyantarDasha: string;
    startDate: string;
    endDate: string;
    pratyantarStartDate?: string;
    pratyantarEndDate?: string;
  };
}

export interface DoshaAnalysisItem {
  id: string;
  name: string;
  status: 'absent' | 'cancelled' | 'active';
  statusLabel: string;
  summary: string;
  pariharReason?: string;
  remedy?: string;
}

export interface GunaMilanResult {
  varna: { max: 1; scored: number; boyVarna: string; girlVarna: string; description: string };
  vashya: { max: 2; scored: number; boyVashya: string; girlVashya: string; description: string };
  tara: { max: 3; scored: number; boyTara: string; girlTara: string; description: string };
  yoni: { max: 4; scored: number; boyYoni: string; girlYoni: string; description: string };
  grahaMaitri: { max: 5; scored: number; boyLord: string; girlLord: string; description: string };
  gana: { max: 6; scored: number; boyGana: string; girlGana: string; description: string };
  bhakoot: { max: 7; scored: number; hasDosha: boolean; description: string };
  nadi: { max: 8; scored: number; boyNadi: string; girlNadi: string; hasDosha: boolean; description: string };
  totalScore: number;
  maxScore: 36;
  isManglikBoy: boolean;
  isManglikGirl: boolean;
  manglikCompatibility: string;
  verdict: string;
  remedies: string[];
  doshaAnalysis: DoshaAnalysisItem[];
}

export interface ChoghadiyaSlot {
  name: string;
  hindiName: string;
  type: 'shubh' | 'labh' | 'amrit' | 'char' | 'rog' | 'kaal' | 'udveg';
  nature: string;
  startTime: string;
  endTime: string;
  ruler: string;
}

export interface PanchangData {
  date: string;
  city: string;
  latitude: number;
  longitude: number;
  tithi: {
    name: string;
    paksha: string;
    number: number;
    endTime: string;
    nextTithi: string;
    nextEndTime?: string;
  };
  vara: {
    name: string;
    englishName: string;
    rulingPlanet: string;
  };
  nakshatra: {
    name: string;
    lord: string;
    pada: number;
    endTime: string;
    nextNakshatra?: string;
    nextEndTime?: string;
  };
  yoga: {
    name: string;
    nature: string;
    endTime: string;
    nextYoga?: string;
    nextEndTime?: string;
  };
  karana: {
    name: string;
    nature: string;
    endTime: string;
    nextKarana?: string;
    nextEndTime?: string;
  };
  samvat: {
    vikram: number;
    shaka: number;
    samvatsarName: string;
    ayanam: string;
    ritu: string;
    suryaMaas: string;
    chandraMaas: string;
    maahAmavasyant: string;
    maahPurnimant: string;
    saurPravishte: string;
  };
  sunMoon: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    dayDuration: string;
    nightDuration: string;
    sunSign: string;
    moonSign: string;
    lagna: string;
    suryaNakshatra: string;
    chandraNakshatra: string;
  };
  shubhMuhurat: {
    abhijit: { start: string; end: string };
    brahma: { start: string; end: string };
    godhuli: { start: string; end: string };
    amritKaal: { start: string; end: string };
    vijayMuhurat: { start: string; end: string };
  };
  ashubhMuhurat: {
    rahuKaal: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulikaKaal: { start: string; end: string };
    durMuhurat: { start: string; end: string };
  };
  choghadiyaDay: ChoghadiyaSlot[];
  choghadiyaNight: ChoghadiyaSlot[];
  festivals: string[];
  vrats: string[];
}

export type RashifalPeriod = 'daily' | 'monthly' | 'yearly';

export interface HoroscopePrediction {
  signIndex: number;
  signName: string;
  hindiName: string;
  symbol: string;
  dateRange: string;
  ruler: string;
  element: string;
  general: string;
  career: string;
  love: string;
  health: string;
  finance: string;
  luckyNumber: number;
  luckyColor: string;
  luckyColorHex: string;
  luckyTime: string;
  remedy: string;
  rating: { career: number; love: number; health: number; finance: number };
}

export interface TransitInfo {
  planet: string;
  hindiName: string;
  currentSign: string;
  degree?: string;
  nakshatra?: string;
  nextSign: string;
  transitDate: string; // Live degrees & nakshatra
  transitChangeDate?: string; // Kab rashi parivartan karega
  retrograde: boolean;
  swarashi: string;
  uchhaRashi: string;
  neechRashi: string;
  impactSummary: string;
  auspiciousRashis: string[];
}

export interface PanditProfile {
  id: string;
  name: string;
  qualification: string;
  experienceYears: number;
  specialties: string[];
  languages: string[];
  mobile: string;
  email: string;
  address: string;
  avatar: string;
  qrCodeUrl: string;
  dakshinaInfo: string;
  about: string;
  isChief?: boolean;
  displayOrder?: number;
}

export interface PaymentReceiptSubmission {
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
  submittedAt: string;
  adminEmail: string;
}

export interface ArticleLinkItem {
  anchorText: string;
  url: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'Panchang' | 'Kundli' | 'Vastu' | 'Grah Gochar' | 'Puja' | 'Remedies' | string;
  categoryHindi: string;
  excerpt: string;
  content: string;
  rawHtml?: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  imageAlt?: string;
  tags: string[];
  shloka?: { sanskrit: string; meaning: string };
  views: number;
  sourceUrl?: string;
  isWordPressPost?: boolean;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    canonicalUrl: string;
    internalLinks: ArticleLinkItem[];
    externalLinks: ArticleLinkItem[];
  };
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  category: 'panchang' | 'horoscope' | 'muhurat' | 'transit' | 'festival';
  read: boolean;
}
