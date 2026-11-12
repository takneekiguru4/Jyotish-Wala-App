/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Astronomy from 'astronomy-engine';
import {
  AvakahadaChakraData,
  DashaPeriodItem,
  DoshaAnalysisItem,
  GunaMilanResult,
  KundliChartData,
  PlanetaryPosition
} from '../types';
import {
  getLahiriAyanamsha,
  getSiderealLongitude,
  getTropicalLongitude,
  KARANA_NAMES,
  TITHI_NAMES,
  VARA_NAMES,
  YOGA_NAMES
} from './panchangEngine';

export const RASHI_NAMES = [
  { en: 'Aries', hi: 'मेष', lord: 'Mars', lordHi: 'मंगल', element: 'अग्नि', symbol: '♈' },
  { en: 'Taurus', hi: 'वृषभ', lord: 'Venus', lordHi: 'शुक्र', element: 'पृथ्वी', symbol: '♉' },
  { en: 'Gemini', hi: 'मिथुन', lord: 'Mercury', lordHi: 'बुध', element: 'वायु', symbol: '♊' },
  { en: 'Cancer', hi: 'कर्क', lord: 'Moon', lordHi: 'चन्द्र', element: 'जल', symbol: '♋' },
  { en: 'Leo', hi: 'सिंह', lord: 'Sun', lordHi: 'सूर्य', element: 'अग्नि', symbol: '♌' },
  { en: 'Virgo', hi: 'कन्या', lord: 'Mercury', lordHi: 'बुध', element: 'पृथ्वी', symbol: '♍' },
  { en: 'Libra', hi: 'तुला', lord: 'Venus', lordHi: 'शुक्र', element: 'वायु', symbol: '♎' },
  { en: 'Scorpio', hi: 'वृश्चिक', lord: 'Mars', lordHi: 'मंगल', element: 'जल', symbol: '♏' },
  { en: 'Sagittarius', hi: 'धनु', lord: 'Jupiter', lordHi: 'गुरु', element: 'अग्नि', symbol: '♐' },
  { en: 'Capricorn', hi: 'मकर', lord: 'Saturn', lordHi: 'शनि', element: 'पृथ्वी', symbol: '♑' },
  { en: 'Aquarius', hi: 'कुम्भ', lord: 'Saturn', lordHi: 'शनि', element: 'वायु', symbol: '♒' },
  { en: 'Pisces', hi: 'मीन', lord: 'Jupiter', lordHi: 'गुरु', element: 'जल', symbol: '♓' },
];

export const NAKSHATRAS = [
  { name: 'अश्विनी', lord: 'केतु', gana: 'देव', yoni: 'अश्व', nadi: 'आदि', varna: 'क्षत्रिय', vashya: 'चतुष्पद', syllables: ['चू', 'चे', 'चो', 'ला'] },
  { name: 'भरणी', lord: 'शुक्र', gana: 'मनुष्य', yoni: 'गज', nadi: 'मध्य', varna: 'क्षत्रिय', vashya: 'चतुष्पद', syllables: ['ली', 'लू', 'ले', 'लो'] },
  { name: 'कृत्तिका', lord: 'सूर्य', gana: 'राक्षस', yoni: 'मेष', nadi: 'अन्त्य', varna: 'वैश्य', vashya: 'चतुष्पद', syllables: ['अ', 'ई', 'उ', 'ए'] },
  { name: 'रोहिणी', lord: 'चन्द्र', gana: 'मनुष्य', yoni: 'सर्प', nadi: 'अन्त्य', varna: 'वैश्य', vashya: 'चतुष्पद', syllables: ['ओ', 'वा', 'वी', 'वू'] },
  { name: 'मृगशिरा', lord: 'मंगल', gana: 'देव', yoni: 'सर्प', nadi: 'मध्य', varna: 'वैश्य', vashya: 'चतुष्पद', syllables: ['वे', 'वो', 'का', 'की'] },
  { name: 'आर्द्रा', lord: 'राहु', gana: 'मनुष्य', yoni: 'श्वान', nadi: 'आदि', varna: 'शूद्र', vashya: 'मानव', syllables: ['कु', 'घ', 'ङ', 'छ'] },
  { name: 'पुनर्वसु', lord: 'गुरु', gana: 'देव', yoni: 'मार्जार', nadi: 'आदि', varna: 'शूद्र', vashya: 'मानव', syllables: ['के', 'को', 'हा', 'ही'] },
  { name: 'पुष्य', lord: 'शनि', gana: 'देव', yoni: 'मेष', nadi: 'मध्य', varna: 'ब्राह्मण', vashya: 'जलचर', syllables: ['हू', 'हे', 'हो', 'डा'] },
  { name: 'आश्लेषा', lord: 'बुध', gana: 'राक्षस', yoni: 'मार्जार', nadi: 'अन्त्य', varna: 'ब्राह्मण', vashya: 'जलचर', syllables: ['डी', 'डू', 'डे', 'डो'] },
  { name: 'मघा', lord: 'केतु', gana: 'राक्षस', yoni: 'मूषक', nadi: 'अन्त्य', varna: 'क्षत्रिय', vashya: 'वनचर', syllables: ['मा', 'मी', 'मू', 'मे'] },
  { name: 'पूर्वाफाल्गुनी', lord: 'शुक्र', gana: 'मनुष्य', yoni: 'मूषक', nadi: 'मध्य', varna: 'क्षत्रिय', vashya: 'वनचर', syllables: ['मो', 'टा', 'टी', 'टू'] },
  { name: 'उत्तराफाल्गुनी', lord: 'सूर्य', gana: 'मनुष्य', yoni: 'गौ', nadi: 'आदि', varna: 'वैश्य', vashya: 'मानव', syllables: ['टे', 'टो', 'पा', 'पी'] },
  { name: 'हस्त', lord: 'चन्द्र', gana: 'देव', yoni: 'महिष', nadi: 'आदि', varna: 'वैश्य', vashya: 'मानव', syllables: ['पू', 'ष', 'ण', 'ठ'] },
  { name: 'चित्रा', lord: 'मंगल', gana: 'राक्षस', yoni: 'व्याघ्र', nadi: 'मध्य', varna: 'शूद्र', vashya: 'मानव', syllables: ['पे', 'पो', 'रा', 'री'] },
  { name: 'स्वाती', lord: 'राहु', gana: 'देव', yoni: 'महिष', nadi: 'अन्त्य', varna: 'शूद्र', vashya: 'मानव', syllables: ['रू', 'रे', 'रो', 'ता'] },
  { name: 'विशाखा', lord: 'गुरु', gana: 'राक्षस', yoni: 'व्याघ्र', nadi: 'अन्त्य', varna: 'ब्राह्मण', vashya: 'कीट', syllables: ['ती', 'तू', 'ते', 'तो'] },
  { name: 'अनुराधा', lord: 'शनि', gana: 'देव', yoni: 'मृग', nadi: 'मध्य', varna: 'ब्राह्मण', vashya: 'कीट', syllables: ['ना', 'नी', 'नू', 'ने'] },
  { name: 'ज्येष्ठा', lord: 'बुध', gana: 'राक्षस', yoni: 'मृग', nadi: 'आदि', varna: 'ब्राह्मण', vashya: 'कीट', syllables: ['नो', 'या', 'यी', 'यू'] },
  { name: 'मूल', lord: 'केतु', gana: 'राक्षस', yoni: 'श्वान', nadi: 'आदि', varna: 'क्षत्रिय', vashya: 'मानव', syllables: ['ये', 'यो', 'भा', 'भी'] },
  { name: 'पूर्वाषाढ़ा', lord: 'शुक्र', gana: 'मनुष्य', yoni: 'वानर', nadi: 'मध्य', varna: 'क्षत्रिय', vashya: 'मानव', syllables: ['भू', 'धा', 'फा', 'ढा'] },
  { name: 'उत्तराषाढ़ा', lord: 'सूर्य', gana: 'मनुष्य', yoni: 'नकुल', nadi: 'अन्त्य', varna: 'वैश्य', vashya: 'चतुष्पद', syllables: ['भे', 'भो', 'जा', 'जी'] },
  { name: 'श्रवण', lord: 'चन्द्र', gana: 'देव', yoni: 'वानर', nadi: 'अन्त्य', varna: 'वैश्य', vashya: 'चतुष्पद', syllables: ['खी', 'खू', 'खे', 'खो'] },
  { name: 'धनिष्ठा', lord: 'मंगल', gana: 'राक्षस', yoni: 'सिंह', nadi: 'मध्य', varna: 'शूद्र', vashya: 'मानव', syllables: ['गा', 'गी', 'गू', 'गे'] },
  { name: 'शतभिषा', lord: 'राहु', gana: 'राक्षस', yoni: 'अश्व', nadi: 'आदि', varna: 'शूद्र', vashya: 'मानव', syllables: ['गो', 'सा', 'सी', 'सू'] },
  { name: 'पूर्वाभाद्रपद', lord: 'गुरु', gana: 'मनुष्य', yoni: 'सिंह', nadi: 'आदि', varna: 'ब्राह्मण', vashya: 'जलचर', syllables: ['से', 'सो', 'दा', 'दी'] },
  { name: 'उत्तराभाद्रपद', lord: 'शनि', gana: 'मनुष्य', yoni: 'गौ', nadi: 'मध्य', varna: 'ब्राह्मण', vashya: 'जलचर', syllables: ['दू', 'थ', 'झ', 'ञ'] },
  { name: 'रेवती', lord: 'बुध', gana: 'देव', yoni: 'गज', nadi: 'अन्त्य', varna: 'ब्राह्मण', vashya: 'जलचर', syllables: ['दे', 'दो', 'चा', 'ची'] }
];

export const RASHI_VARNA: string[] = [
  'क्षत्रिय', // 0: मेष
  'वैश्य',    // 1: वृषभ
  'शूद्र',    // 2: मिथुन
  'ब्राह्मण', // 3: कर्क
  'क्षत्रिय', // 4: सिंह
  'वैश्य',    // 5: कन्या
  'शूद्र',    // 6: तुला
  'ब्राह्मण', // 7: वृश्चिक
  'क्षत्रिय', // 8: धनु
  'वैश्य',    // 9: मकर
  'शूद्र',    // 10: कुम्भ
  'ब्राह्मण', // 11: मीन
];

export const RASHI_VASHYA: string[] = [
  'चतुष्पद', // 0: मेष
  'चतुष्पद', // 1: वृषभ
  'मानव',    // 2: मिथुन
  'जलचर',    // 3: कर्क
  'वनचर',    // 4: सिंह
  'मानव',    // 5: कन्या
  'मानव',    // 6: तुला
  'कीट',     // 7: वृश्चिक
  'मानव',    // 8: धनु
  'चतुष्पद', // 9: मकर
  'मानव',    // 10: कुम्भ
  'जलचर',    // 11: मीन
];

export const VIMSHOTTARI_ORDER = [
  { planet: 'केतु', years: 7 },
  { planet: 'शुक्र', years: 20 },
  { planet: 'सूर्य', years: 6 },
  { planet: 'चन्द्र', years: 10 },
  { planet: 'मंगल', years: 7 },
  { planet: 'राहु', years: 18 },
  { planet: 'गुरु', years: 16 },
  { planet: 'शनि', years: 19 },
  { planet: 'बुध', years: 17 }
];

export const GRAHA_MAITRI_MATRIX: Record<string, Record<string, number>> = {
  'सूर्य': { 'सूर्य': 5, 'चन्द्र': 5, 'मंगल': 5, 'बुध': 4, 'गुरु': 5, 'शुक्र': 0, 'शनि': 0 },
  'चन्द्र': { 'सूर्य': 5, 'चन्द्र': 5, 'मंगल': 4, 'बुध': 1, 'गुरु': 4, 'शुक्र': 0.5, 'शनि': 0.5 },
  'मंगल': { 'सूर्य': 5, 'चन्द्र': 4, 'मंगल': 5, 'बुध': 0.5, 'गुरु': 5, 'शुक्र': 3, 'शनि': 0.5 },
  'बुध': { 'सूर्य': 4, 'चन्द्र': 1, 'मंगल': 0.5, 'बुध': 5, 'गुरु': 0.5, 'शुक्र': 5, 'शनि': 4 },
  'गुरु': { 'सूर्य': 5, 'चन्द्र': 4, 'मंगल': 5, 'बुध': 0.5, 'गुरु': 5, 'शुक्र': 0.5, 'शनि': 3 },
  'शुक्र': { 'सूर्य': 0, 'चन्द्र': 0.5, 'मंगल': 3, 'बुध': 5, 'गुरु': 0.5, 'शुक्र': 5, 'शनि': 5 },
  'शनि': { 'सूर्य': 0, 'चन्द्र': 0.5, 'मंगल': 0.5, 'बुध': 4, 'गुरु': 3, 'शुक्र': 5, 'शनि': 5 }
};

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(norm360(lon1) - norm360(lon2));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Checks whether a planet is retrograde at the given moment by comparing its apparent geocentric tropical longitude
 * across a 1-hour window.
 */
function isBodyRetrograde(body: Astronomy.Body, date: Date): boolean {
  const t1 = new Date(date.getTime() - 30 * 60 * 1000);
  const t2 = new Date(date.getTime() + 30 * 60 * 1000);
  const lon1 = getTropicalLongitude(body, t1);
  const lon2 = getTropicalLongitude(body, t2);
  let delta = lon2 - lon1;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

/**
 * Calculates the exact Nirayana (Sidereal) Ascendant (Lagna) in degrees [0, 360)
 * using Greenwich Apparent Sidereal Time (GAST), observer coordinates, true obliquity of the ecliptic,
 * and Lahiri (Chitrapaksha) Ayanamsha.
 */
export function calculateSiderealAscendant(
  date: Date,
  latitude: number,
  longitude: number,
  ayanamsha: number
): number {
  const gastHours = Astronomy.SiderealTime(date); // 0..24 hours
  const ramcDeg = norm360(gastHours * 15.0 + longitude);
  const T = Astronomy.MakeTime(date).ut / 36525.0;
  const epsDeg = 23.4392911 - 0.0130042 * T;

  const ramcRad = (ramcDeg * Math.PI) / 180.0;
  const latRad = (latitude * Math.PI) / 180.0;
  const epsRad = (epsDeg * Math.PI) / 180.0;

  // Standard spherical astronomy formula for the ecliptic rising point on the eastern horizon:
  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const tropicalAscDeg = norm360((Math.atan2(y, x) * 180.0) / Math.PI);

  return norm360(tropicalAscDeg - ayanamsha);
}

const IST_OFFSET_MS = 5.5 * 3600 * 1000;

function formatDateDMY(ms: number): string {
  const d = new Date(ms + IST_OFFSET_MS);
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = d.getUTCDate().toString().padStart(2, '0');
  return `${day}/${m}/${y}`;
}

function formatTimeHM(ms: number): string {
  const d = new Date(ms + IST_OFFSET_MS);
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

function addCalendarYearsIST(ms: number, yearsDelta: number): number {
  const d = new Date(ms + IST_OFFSET_MS);
  const targetYear = d.getUTCFullYear() + yearsDelta;
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  const hh = d.getUTCHours();
  const mm = d.getUTCMinutes();
  const ss = d.getUTCSeconds();

  // Clamp Feb 29 to Feb 28 if targetYear is not a leap year
  const maxDayInMonth = new Date(Date.UTC(targetYear, month + 1, 0)).getUTCDate();
  const safeDay = Math.min(day, maxDayInMonth);

  return Date.UTC(targetYear, month, safeDay, hh, mm, ss) - IST_OFFSET_MS;
}

function formatRemainingBalanceText(totalYears: number, remainingFraction: number): string {
  const totalRemYears = totalYears * remainingFraction;
  const yrs = Math.floor(totalRemYears);
  const remMonthsFloat = (totalRemYears - yrs) * 12;
  const mos = Math.floor(remMonthsFloat);
  const days = Math.round((remMonthsFloat - mos) * 30);
  return `शेष: ${yrs}व ${mos}मा ${days}दि`;
}

/**
 * Accurately computes planetary positions (VSOP87/ELP2000 via astronomy-engine),
 * Nirayana Lagna, Chandra Kundli, Navamsha (D9), Dashamsha (D10), Avakahada Chakra,
 * and Vimshottari Mahadasha/Antardasha/Pratyantardasha with exact birth Nakshatra balance.
 */
export function generateKundli(
  name: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string,
  latitude: number = 30.0869,
  longitude: number = 78.2676,
  gender: 'male' | 'female' | 'other' = 'male'
): KundliChartData {
  const timeParts = (birthTime || '12:00').split(':');
  const hh = (timeParts[0] || '12').padStart(2, '0');
  const mm = (timeParts[1] || '00').padStart(2, '0');
  const birthInstant = new Date(`${birthDate}T${hh}:${mm}:00+05:30`);

  const ayanamsha = getLahiriAyanamsha(birthInstant);
  const ascendantDegree = calculateSiderealAscendant(birthInstant, latitude, longitude, ayanamsha);
  const lagnaSignIndex = Math.floor(ascendantDegree / 30) % 12;
  const lagnaHouseSign = lagnaSignIndex + 1;

  // True Sidereal Longitudes for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
  const sunLong = getSiderealLongitude(Astronomy.Body.Sun, birthInstant);
  const moonLong = getSiderealLongitude(Astronomy.Body.Moon, birthInstant);
  const marsLong = getSiderealLongitude(Astronomy.Body.Mars, birthInstant);
  const mercuryLong = getSiderealLongitude(Astronomy.Body.Mercury, birthInstant);
  const jupiterLong = getSiderealLongitude(Astronomy.Body.Jupiter, birthInstant);
  const venusLong = getSiderealLongitude(Astronomy.Body.Venus, birthInstant);
  const saturnLong = getSiderealLongitude(Astronomy.Body.Saturn, birthInstant);

  // Mean Lunar Ascending Node (Rahu) and Descending Node (Ketu)
  const T = Astronomy.MakeTime(birthInstant).ut / 36525.0;
  const meanNodeTropical = norm360(
    125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467470.0
  );
  const rahuLong = norm360(meanNodeTropical - ayanamsha);
  const ketuLong = norm360(rahuLong + 180.0);

  // True Retrograde status from ephemeris velocity
  const marsRetro = isBodyRetrograde(Astronomy.Body.Mars, birthInstant);
  const mercuryRetro = isBodyRetrograde(Astronomy.Body.Mercury, birthInstant);
  const jupiterRetro = isBodyRetrograde(Astronomy.Body.Jupiter, birthInstant);
  const venusRetro = isBodyRetrograde(Astronomy.Body.Venus, birthInstant);
  const saturnRetro = isBodyRetrograde(Astronomy.Body.Saturn, birthInstant);

  // Classical Surya Siddhanta / Parashari combustion (Asta) orbs
  const moonCombust = angularDistance(moonLong, sunLong) < 12;
  const marsCombust = angularDistance(marsLong, sunLong) < 17;
  const mercuryCombust = angularDistance(mercuryLong, sunLong) < (mercuryRetro ? 12 : 14);
  const jupiterCombust = angularDistance(jupiterLong, sunLong) < 11;
  const venusCombust = angularDistance(venusLong, sunLong) < (venusRetro ? 8 : 10);
  const saturnCombust = angularDistance(saturnLong, sunLong) < 15;

  const chandraSignIndex = Math.floor(moonLong / 30) % 12;
  const chandraHouseSign = chandraSignIndex + 1;

  const rawPlanets = [
    { name: 'Lagna', hi: 'लग्न', sym: 'Asc', deg: ascendantDegree, retro: false, combust: false },
    { name: 'Surya', hi: 'सूर्य', sym: 'Su', deg: sunLong, retro: false, combust: false },
    { name: 'Chandra', hi: 'चन्द्र', sym: 'Mo', deg: moonLong, retro: false, combust: moonCombust },
    { name: 'Mangal', hi: 'मंगल', sym: 'Ma', deg: marsLong, retro: marsRetro, combust: marsCombust },
    { name: 'Budh', hi: 'बुध', sym: 'Me', deg: mercuryLong, retro: mercuryRetro, combust: mercuryCombust },
    { name: 'Guru', hi: 'गुरु', sym: 'Ju', deg: jupiterLong, retro: jupiterRetro, combust: jupiterCombust },
    { name: 'Shukra', hi: 'शुक्र', sym: 'Ve', deg: venusLong, retro: venusRetro, combust: venusCombust },
    { name: 'Shani', hi: 'शनि', sym: 'Sa', deg: saturnLong, retro: saturnRetro, combust: saturnCombust },
    { name: 'Rahu', hi: 'राहु', sym: 'Ra', deg: rahuLong, retro: true, combust: false },
    { name: 'Ketu', hi: 'केतु', sym: 'Ke', deg: ketuLong, retro: true, combust: false }
  ];

  const planets: PlanetaryPosition[] = rawPlanets.map((p) => {
    const signIndex = Math.floor(p.deg / 30) % 12;
    const degreeInSign = p.deg % 30;
    const degInt = Math.floor(degreeInSign);
    const minFloat = (degreeInSign - degInt) * 60;
    const minInt = Math.floor(minFloat);
    const secInt = Math.floor((minFloat - minInt) * 60);

    const house = ((signIndex - lagnaSignIndex + 12) % 12) + 1;
    const nakshatraIndex = Math.floor(p.deg / (360 / 27)) % 27;
    const pada = Math.floor((p.deg % (360 / 27)) / (360 / 108)) + 1;
    const nakshatraObj = NAKSHATRAS[nakshatraIndex];

    let status: PlanetaryPosition['status'] = 'sama';
    let statusHindi = 'सम';

    if (p.name === 'Surya') {
      if (signIndex === 0) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 6) { status = 'neecha'; statusHindi = 'नीच'; }
      else if (signIndex === 4) { status = 'swakshetra'; statusHindi = 'स्वक्षेत्र'; }
    } else if (p.name === 'Chandra') {
      if (signIndex === 1) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 7) { status = 'neecha'; statusHindi = 'नीच'; }
      else if (signIndex === 3) { status = 'swakshetra'; statusHindi = 'स्वक्षेत्र'; }
    } else if (p.name === 'Mangal') {
      if (signIndex === 9) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 3) { status = 'neecha'; statusHindi = 'नीच'; }
      else if (signIndex === 0 || signIndex === 7) { status = 'swakshetra'; statusHindi = 'स्वक्षेत्र'; }
    } else if (p.name === 'Guru') {
      if (signIndex === 3) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 9) { status = 'neecha'; statusHindi = 'नीच'; }
      else if (signIndex === 8 || signIndex === 11) { status = 'swakshetra'; statusHindi = 'स्वक्षेत्र'; }
    } else if (p.name === 'Shani') {
      if (signIndex === 6) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 0) { status = 'neecha'; statusHindi = 'नीच'; }
      else if (signIndex === 9 || signIndex === 10) { status = 'swakshetra'; statusHindi = 'स्वक्षेत्र'; }
    } else if (p.name === 'Budh') {
      if (signIndex === 5) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 11) { status = 'neecha'; statusHindi = 'नीच'; }
      else if (signIndex === 2) { status = 'swakshetra'; statusHindi = 'स्वक्षेत्र'; }
    } else if (p.name === 'Shukra') {
      if (signIndex === 11) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 5) { status = 'neecha'; statusHindi = 'नीच'; }
      else if (signIndex === 1 || signIndex === 6) { status = 'swakshetra'; statusHindi = 'स्वक्षेत्र'; }
    } else if (p.name === 'Rahu') {
      if (signIndex === 1 || signIndex === 2) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 7 || signIndex === 8) { status = 'neecha'; statusHindi = 'नीच'; }
    } else if (p.name === 'Ketu') {
      if (signIndex === 7 || signIndex === 8) { status = 'uchcha'; statusHindi = 'उच्च'; }
      else if (signIndex === 1 || signIndex === 2) { status = 'neecha'; statusHindi = 'नीच'; }
    }

    return {
      name: p.name,
      hindiName: p.hi,
      symbol: p.sym,
      signIndex,
      signName: RASHI_NAMES[signIndex].en,
      signHindiName: RASHI_NAMES[signIndex].hi,
      house,
      degree: degInt,
      minutes: minInt,
      seconds: secInt,
      isRetrograde: p.retro,
      isCombust: p.combust,
      status,
      statusHindi,
      nakshatra: nakshatraObj.name,
      nakshatraLord: nakshatraObj.lord,
      pada
    };
  });

  const formatPlanetSymbolLabel = (hiName: string, isRetro?: boolean, isCombust?: boolean): string => {
    let suffix = '';
    if (isRetro) suffix += '^';
    if (isCombust) suffix += '*';
    return `${hiName}${suffix}`;
  };

  // 1. Lagna Chart (D1)
  const houses: KundliChartData['houses'] = {};
  for (let h = 1; h <= 12; h++) {
    const signIndex = (lagnaSignIndex + (h - 1)) % 12;
    const housePlanets = planets
      .filter((p) => p.name !== 'Lagna' && p.house === h)
      .map((p) => formatPlanetSymbolLabel(p.hindiName, p.isRetrograde, p.isCombust));

    houses[h] = {
      signIndex: signIndex + 1,
      signName: RASHI_NAMES[signIndex].hi,
      planets: housePlanets
    };
  }

  // 2. Chandra Kundli (Moon Chart)
  const chandraHouses: KundliChartData['chandraHouses'] = {};
  for (let h = 1; h <= 12; h++) {
    const signIndex = (chandraSignIndex + (h - 1)) % 12;
    const housePlanets = planets
      .filter((p) => p.name !== 'Lagna' && p.signIndex === signIndex)
      .map((p) => formatPlanetSymbolLabel(p.hindiName, p.isRetrograde, p.isCombust));

    chandraHouses[h] = {
      signIndex: signIndex + 1,
      signName: RASHI_NAMES[signIndex].hi,
      planets: housePlanets
    };
  }

  // 3. Navamsha Chart (D9) - Using exact full-precision sidereal longitude
  const navamshaSpan = 30.0 / 9.0; // 3°20' per Navamsha
  const navLagnaSignIdx = Math.floor(ascendantDegree / navamshaSpan) % 12;
  const navamshaHouses: KundliChartData['navamshaHouses'] = {};

  for (let h = 1; h <= 12; h++) {
    const sIdx = (navLagnaSignIdx + (h - 1)) % 12;
    navamshaHouses[h] = { signIndex: sIdx + 1, planets: [] };
  }

  rawPlanets.forEach((rp) => {
    if (rp.name === 'Lagna') return;
    const navSignIdx = Math.floor(rp.deg / navamshaSpan) % 12;
    const navHouse = ((navSignIdx - navLagnaSignIdx + 12) % 12) + 1;
    if (navamshaHouses[navHouse]) {
      navamshaHouses[navHouse].planets.push(formatPlanetSymbolLabel(rp.hi, rp.retro, rp.combust));
    }
  });

  // 4. Dashamsha Chart (D10)
  const dashamshaSpan = 3.0; // 3° per Dashamsha
  const getDashamshaSignIdx = (deg: number): number => {
    const rashiIdx = Math.floor(deg / 30) % 12;
    const part = Math.floor((deg % 30) / dashamshaSpan); // 0..9
    const startSign = rashiIdx % 2 === 0 ? rashiIdx : (rashiIdx + 8) % 12;
    return (startSign + part) % 12;
  };

  const dashLagnaSignIdx = getDashamshaSignIdx(ascendantDegree);
  const dashamshaHouses: KundliChartData['dashamshaHouses'] = {};
  for (let h = 1; h <= 12; h++) {
    const sIdx = (dashLagnaSignIdx + (h - 1)) % 12;
    dashamshaHouses[h] = { signIndex: sIdx + 1, planets: [] };
  }
  rawPlanets.forEach((rp) => {
    if (rp.name === 'Lagna') return;
    const d10SignIdx = getDashamshaSignIdx(rp.deg);
    const d10House = ((d10SignIdx - dashLagnaSignIdx + 12) % 12) + 1;
    if (dashamshaHouses[d10House]) {
      dashamshaHouses[d10House].planets.push(formatPlanetSymbolLabel(rp.hi, rp.retro, rp.combust));
    }
  });

  // 4b. Parashari Hora Chakra (D2)
  const getHoraSignIdx = (deg: number): number => {
    const rashiIdx = Math.floor(deg / 30) % 12;
    const degInSign = deg % 30;
    const isOddSign = rashiIdx % 2 === 0;
    if (isOddSign) {
      return degInSign < 15 ? 4 : 3;
    }
    return degInSign < 15 ? 3 : 4;
  };

  const horaLagnaSignIdx = getHoraSignIdx(ascendantDegree);
  const horaHouses: NonNullable<KundliChartData['horaHouses']> = {};
  for (let h = 1; h <= 12; h++) {
    const sIdx = (horaLagnaSignIdx + (h - 1)) % 12;
    horaHouses[h] = { signIndex: sIdx + 1, signName: RASHI_NAMES[sIdx].hi, planets: [] };
  }
  rawPlanets.forEach((rp) => {
    if (rp.name === 'Lagna') return;
    const d2SignIdx = getHoraSignIdx(rp.deg);
    const d2House = ((d2SignIdx - horaLagnaSignIdx + 12) % 12) + 1;
    if (horaHouses[d2House]) {
      horaHouses[d2House].planets.push(formatPlanetSymbolLabel(rp.hi, rp.retro, rp.combust));
    }
  });

  // 5. Exact Birth Instant Panchang & Avakahada Chakra
  const nakSpan = 360.0 / 27.0;
  const moonNakIdx = Math.floor(moonLong / nakSpan) % 27;
  const moonNakPada = Math.floor((moonLong % nakSpan) / (360.0 / 108.0)) + 1;
  const moonNakObj = NAKSHATRAS[moonNakIdx];

  // Exact Tithi, Yoga, Karana at the moment of birth
  const elongation = norm360(moonLong - sunLong);
  const tithiIdx = Math.floor(elongation / 12.0) % 30;
  const pakshaPrefix = tithiIdx < 15 ? 'शुक्ल' : 'कृष्ण';
  const tithiBaseName =
    tithiIdx === 29 ? 'अमावस्या' : tithiIdx === 14 ? 'पूर्णिमा' : TITHI_NAMES[tithiIdx % 15];
  const birthTithiName =
    tithiIdx === 14 || tithiIdx === 29
      ? tithiBaseName
      : `${pakshaPrefix} ${tithiBaseName}`;

  const yogaSum = norm360(sunLong + moonLong);
  const yogaIdx = Math.floor(yogaSum / nakSpan) % 27;
  const birthYogaName = YOGA_NAMES[yogaIdx].name;

  const halfTithiIdx = Math.floor(elongation / 6.0) % 60;
  let karanaObj: { name: string; nature: string } = KARANA_NAMES[0];
  if (halfTithiIdx === 0) karanaObj = KARANA_NAMES[10];
  else if (halfTithiIdx === 57) karanaObj = KARANA_NAMES[7];
  else if (halfTithiIdx === 58) karanaObj = KARANA_NAMES[8];
  else if (halfTithiIdx === 59) karanaObj = KARANA_NAMES[9];
  else karanaObj = KARANA_NAMES[(halfTithiIdx - 1) % 7];

  const istMidnight = new Date(`${birthDate}T00:00:00+05:30`);
  let localSunriseDate = new Date(`${birthDate}T06:00:00+05:30`);
  try {
    const sr = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      new Astronomy.Observer(latitude, longitude, 350),
      +1,
      istMidnight,
      1
    );
    if (sr) localSunriseDate = sr.date;
  } catch {
    // Fallback to 06:00 IST
  }
  const civilDow = new Date(`${birthDate}T12:00:00+05:30`).getUTCDay();
  const vedicDow = birthInstant.getTime() < localSunriseDate.getTime() ? (civilDow + 6) % 7 : civilDow;
  const birthVaraName = VARA_NAMES[vedicDow].hi;

  const moonHouseFromLagna = ((chandraSignIndex - lagnaSignIndex + 12) % 12) + 1;
  let paya = 'रजत';
  if ([1, 6, 11].includes(moonHouseFromLagna)) paya = 'स्वर्ण';
  else if ([2, 5, 9].includes(moonHouseFromLagna)) paya = 'रजत';
  else if ([3, 7, 10].includes(moonHouseFromLagna)) paya = 'ताम्र';
  else paya = 'लौह';

  const avakahada: AvakahadaChakraData = {
    varna: RASHI_VARNA[chandraSignIndex] || moonNakObj.varna,
    vashya: RASHI_VASHYA[chandraSignIndex] || moonNakObj.vashya,
    yoni: moonNakObj.yoni,
    gana: moonNakObj.gana,
    nadi: moonNakObj.nadi,
    rashi: RASHI_NAMES[chandraSignIndex].hi,
    rashiLord: RASHI_NAMES[chandraSignIndex].lordHi,
    nakshatra: moonNakObj.name,
    nakshatraPada: moonNakPada,
    nakshatraLord: moonNakObj.lord,
    lagna: RASHI_NAMES[lagnaSignIndex].hi,
    lagnaLord: RASHI_NAMES[lagnaSignIndex].lordHi,
    tithi: birthTithiName,
    vara: birthVaraName,
    yoga: birthYogaName,
    karana: karanaObj.name,
    nameAlphabet: moonNakObj.syllables[(moonNakPada - 1) % 4] || moonNakObj.syllables[0],
    paya
  };

  // 6. Vimshottari Mahadasha, Antardasha & Pratyantardasha with Exact Planetary Years & Dates/Times
  const startPlanetIdx = VIMSHOTTARI_ORDER.findIndex((item) => item.planet === moonNakObj.lord);
  const safeStartIdx = startPlanetIdx >= 0 ? startPlanetIdx : 0;

  const posInNak = moonLong - moonNakIdx * nakSpan;
  const elapsedFraction = Math.min(0.999999, Math.max(0, posInNak / nakSpan));
  const remainingFraction = 1.0 - elapsedFraction;

  const firstDashaYears = VIMSHOTTARI_ORDER[safeStartIdx].years;
  const fullFirstSpanMs = addCalendarYearsIST(birthInstant.getTime(), firstDashaYears) - birthInstant.getTime();
  const firstMahaEndMs = birthInstant.getTime() + Math.round(remainingFraction * fullFirstSpanMs);
  const firstMahaStartMs = addCalendarYearsIST(firstMahaEndMs, -firstDashaYears);
  const firstBalanceText = formatRemainingBalanceText(firstDashaYears, remainingFraction);

  const nowMs = Date.now();
  const vimshottariDasha: DashaPeriodItem[] = [];
  let mahaCursorMs = firstMahaStartMs;

  let activeMahaPlanet = VIMSHOTTARI_ORDER[safeStartIdx].planet;
  let activeAntarPlanet = VIMSHOTTARI_ORDER[safeStartIdx].planet;
  let activePratyantarPlanet = VIMSHOTTARI_ORDER[safeStartIdx].planet;
  let activeMahaStartStr = formatDateDMY(firstMahaStartMs);
  let activeMahaEndStr = formatDateDMY(firstMahaEndMs);
  let activePratyantarStartStr = '';
  let activePratyantarEndStr = '';

  for (let i = 0; i < 9; i++) {
    const mahaIdx = (safeStartIdx + i) % 9;
    const dashaMeta = VIMSHOTTARI_ORDER[mahaIdx];
    const mahaStartMs = mahaCursorMs;
    const mahaEndMs = i === 0 ? firstMahaEndMs : addCalendarYearsIST(mahaStartMs, dashaMeta.years);
    const totalMahaSpanMs = mahaEndMs - mahaStartMs;

    const isMahaCurrent = nowMs >= mahaStartMs && nowMs < mahaEndMs;

    // Generate all 9 Antardashas within this Mahadasha
    const antarDashas: DashaPeriodItem['antarDashas'] = [];
    let antarCursorMs = mahaStartMs;

    for (let j = 0; j < 9; j++) {
      const antarIdx = (mahaIdx + j) % 9;
      const antarMeta = VIMSHOTTARI_ORDER[antarIdx];
      const antarStartMs = antarCursorMs;
      const antarEndMs =
        j === 8
          ? mahaEndMs
          : Math.round(antarStartMs + totalMahaSpanMs * (antarMeta.years / 120.0));
      antarCursorMs = antarEndMs;

      const isAntarCurrent = isMahaCurrent && nowMs >= antarStartMs && nowMs < antarEndMs;
      const totalAntarSpanMs = antarEndMs - antarStartMs;

      // Generate all 9 Pratyantardashas within this Antardasha
      const pratyantarDashas: NonNullable<DashaPeriodItem['antarDashas'][number]['pratyantarDashas']> = [];
      let pCursorMs = antarStartMs;

      for (let k = 0; k < 9; k++) {
        const pIdx = (antarIdx + k) % 9;
        const pMeta = VIMSHOTTARI_ORDER[pIdx];
        const pStartMs = pCursorMs;
        const pEndMs =
          k === 8
            ? antarEndMs
            : Math.round(pStartMs + totalAntarSpanMs * (pMeta.years / 120.0));
        pCursorMs = pEndMs;

        const isPCurrent = isAntarCurrent && nowMs >= pStartMs && nowMs < pEndMs;
        const pStartDate = formatDateDMY(pStartMs);
        const pStartTime = formatTimeHM(pStartMs);
        const pEndDate = formatDateDMY(pEndMs);
        const pEndTime = formatTimeHM(pEndMs);

        if (isPCurrent) {
          activePratyantarPlanet = pMeta.planet;
          activePratyantarStartStr = `${pStartDate} ${pStartTime}`;
          activePratyantarEndStr = `${pEndDate} ${pEndTime}`;
        }

        pratyantarDashas.push({
          planet: pMeta.planet,
          startDate: pStartDate,
          startTime: pStartTime,
          endDate: pEndDate,
          endTime: pEndTime,
          isCurrent: isPCurrent
        });
      }

      if (isAntarCurrent) {
        activeAntarPlanet = antarMeta.planet;
      }

      antarDashas.push({
        planet: antarMeta.planet,
        startDate: formatDateDMY(antarStartMs),
        startTime: formatTimeHM(antarStartMs),
        endDate: formatDateDMY(antarEndMs),
        endTime: formatTimeHM(antarEndMs),
        isCurrent: isAntarCurrent,
        pratyantarDashas
      });
    }

    const mStartDate = formatDateDMY(mahaStartMs);
    const mStartTime = formatTimeHM(mahaStartMs);
    const mEndDate = formatDateDMY(mahaEndMs);
    const mEndTime = formatTimeHM(mahaEndMs);

    if (isMahaCurrent) {
      activeMahaPlanet = dashaMeta.planet;
      activeMahaStartStr = `${mStartDate} ${mStartTime}`;
      activeMahaEndStr = `${mEndDate} ${mEndTime}`;
    }

    vimshottariDasha.push({
      planet: dashaMeta.planet,
      startDate: mStartDate,
      startTime: mStartTime,
      endDate: mEndDate,
      endTime: mEndTime,
      durationYears: dashaMeta.years,
      balanceText: i === 0 ? firstBalanceText : undefined,
      isCurrent: isMahaCurrent,
      antarDashas
    });

    mahaCursorMs = mahaEndMs;
  }

  return {
    id: `kundli_${Date.now()}`,
    name,
    gender,
    birthDate,
    birthTime,
    birthPlace,
    latitude,
    longitude,
    timezone: 5.5,
    lagnaSign: lagnaHouseSign,
    chandraSign: chandraHouseSign,
    planets,
    houses,
    chandraHouses,
    navamshaHouses,
    dashamshaHouses,
    horaHouses,
    avakahada,
    vimshottariDasha,
    currentDasha: {
      mahaDasha: activeMahaPlanet,
      antarDasha: activeAntarPlanet,
      pratyantarDasha: activePratyantarPlanet,
      startDate: activeMahaStartStr,
      endDate: activeMahaEndStr,
      pratyantarStartDate: activePratyantarStartStr,
      pratyantarEndDate: activePratyantarEndStr
    }
  };
}

/**
 * Checks whether a chart has Manglik Dosha (Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna).
 */
export function isChartManglik(kundli: KundliChartData): boolean {
  const mars = kundli.planets.find((p) => p.name === 'Mangal');
  if (!mars) return false;
  return [1, 2, 4, 7, 8, 12].includes(mars.house);
}

/**
 * Calculates Ashtakoota Guna Milan (36 points) between Boy and Girl birth details.
 * Supports optional Pada (1..4) or exact Moon Rashi index (0..11) for accurate Rashi-based Kootas
 * (Varna, Vashya, Graha Maitri, Bhakoot).
 */
export function calculateGunaMilan(
  boyNakshatraIndex: number,
  girlNakshatraIndex: number,
  isBoyManglik: boolean = false,
  isGirlManglik: boolean = false,
  boyPada: number = 1,
  girlPada: number = 1,
  boyKundli?: KundliChartData,
  girlKundli?: KundliChartData
): GunaMilanResult {
  const boyNakIdx = ((boyNakshatraIndex % 27) + 27) % 27;
  const girlNakIdx = ((girlNakshatraIndex % 27) + 27) % 27;
  const boy = NAKSHATRAS[boyNakIdx];
  const girl = NAKSHATRAS[girlNakIdx];

  // Exact Rashi index (0..11) from Nakshatra (0..26) and Pada (1..4):
  // Since 27 Nakshatras * 4 Padas = 108 Padas across 12 Rashis -> 9 Padas per Rashi!
  const bPada = Math.min(4, Math.max(1, boyPada));
  const gPada = Math.min(4, Math.max(1, girlPada));
  const boyRashiIdx = Math.floor((boyNakIdx * 4 + (bPada - 1)) / 9) % 12;
  const girlRashiIdx = Math.floor((girlNakIdx * 4 + (gPada - 1)) / 9) % 12;

  const boyRashi = RASHI_NAMES[boyRashiIdx];
  const girlRashi = RASHI_NAMES[girlRashiIdx];

  // 1. Varna Koota (Max 1)
  const varnaOrder: Record<string, number> = { 'ब्राह्मण': 4, 'क्षत्रिय': 3, 'वैश्य': 2, 'शूद्र': 1 };
  const boyVarna = RASHI_VARNA[boyRashiIdx] || boy.varna;
  const girlVarna = RASHI_VARNA[girlRashiIdx] || girl.varna;
  const boyVarnaScore = varnaOrder[boyVarna] || 1;
  const girlVarnaScore = varnaOrder[girlVarna] || 1;
  const varnaScored = boyVarnaScore >= girlVarnaScore ? 1 : 0;

  // 2. Vashya Koota (Max 2)
  const boyVashya = RASHI_VASHYA[boyRashiIdx] || boy.vashya;
  const girlVashya = RASHI_VASHYA[girlRashiIdx] || girl.vashya;
  let vashyaScored = 1;
  if (boyVashya === girlVashya) {
    vashyaScored = 2;
  } else if (
    (boyVashya === 'वनचर' && girlVashya === 'चतुष्पद') ||
    (girlVashya === 'वनचर' && boyVashya === 'चतुष्पद')
  ) {
    vashyaScored = 0;
  } else if (
    (boyVashya === 'मानव' && girlVashya === 'चतुष्पद') ||
    (girlVashya === 'मानव' && boyVashya === 'चतुष्पद')
  ) {
    vashyaScored = 1;
  } else if (
    (boyVashya === 'मानव' && girlVashya === 'जलचर') ||
    (girlVashya === 'मानव' && boyVashya === 'जलचर')
  ) {
    vashyaScored = 0.5;
  } else {
    vashyaScored = 1;
  }

  // 3. Tara Koota (Max 3)
  const diff1 = (((boyNakIdx - girlNakIdx + 27) % 27) % 9) + 1;
  const diff2 = (((girlNakIdx - boyNakIdx + 27) % 27) % 9) + 1;
  const badTaras = [3, 5, 7];
  let taraScored = 3;
  if (badTaras.includes(diff1) && badTaras.includes(diff2)) taraScored = 0;
  else if (badTaras.includes(diff1) || badTaras.includes(diff2)) taraScored = 1.5;

  // 4. Yoni Koota (Max 4)
  const yoniEnemyPairs = [
    ['अश्व', 'महिष'],
    ['गज', 'सिंह'],
    ['मेष', 'वानर'],
    ['सर्प', 'नकुल'],
    ['श्वान', 'मृग'],
    ['मार्जार', 'मूषक'],
    ['गौ', 'व्याघ्र']
  ];
  let yoniScored = 2;
  if (boy.yoni === girl.yoni) {
    yoniScored = 4;
  } else {
    const isEnemy = yoniEnemyPairs.some(
      ([a, b]) => (boy.yoni === a && girl.yoni === b) || (boy.yoni === b && girl.yoni === a)
    );
    yoniScored = isEnemy ? 0 : 2.5;
  }

  // 5. Graha Maitri Koota (Max 5) - Based on Moon Rashi Lords!
  const boyRashiLord = boyRashi.lordHi;
  const girlRashiLord = girlRashi.lordHi;
  let grahaMaitriScored = 4;
  if (
    GRAHA_MAITRI_MATRIX[boyRashiLord] &&
    GRAHA_MAITRI_MATRIX[boyRashiLord][girlRashiLord] !== undefined
  ) {
    grahaMaitriScored = GRAHA_MAITRI_MATRIX[boyRashiLord][girlRashiLord];
  }

  // 6. Gana Koota (Max 6)
  let ganaScored = 6;
  if (boy.gana === girl.gana) {
    ganaScored = 6;
  } else if (boy.gana === 'देव' && girl.gana === 'मनुष्य') {
    ganaScored = 6;
  } else if (boy.gana === 'मनुष्य' && girl.gana === 'देव') {
    ganaScored = 5;
  } else if (
    (boy.gana === 'राक्षस' && girl.gana === 'देव') ||
    (boy.gana === 'देव' && girl.gana === 'राक्षस')
  ) {
    ganaScored = 1;
  } else {
    ganaScored = 0;
  }

  // 7. Bhakoot Koota (Max 7) - Based on Moon Rashi distance (Dwidwadash 2/12, Navapancham 5/9, Shadashtak 6/8)
  const rashiDiff = ((boyRashiIdx - girlRashiIdx + 12) % 12) + 1;
  const sameRashiLord = boyRashiLord === girlRashiLord;
  const friendlyRashiLords = grahaMaitriScored >= 4;
  const hasRawBhakootDosha = [2, 12, 6, 8, 5, 9].includes(rashiDiff);
  // Classical Bhakoot score in Ashtakoot table (0 if raw dosha without same lord, 7 otherwise)
  const hasBhakootDosha = hasRawBhakootDosha && !sameRashiLord;
  const bhakootScored = hasBhakootDosha ? 0 : 7;

  // 8. Nadi Koota (Max 8)
  const hasRawNadiDosha = boy.nadi === girl.nadi;
  const sameNakshatraDiffPada = boyNakIdx === girlNakIdx && bPada !== gPada;
  const sameRashiDiffNakshatra = boyRashiIdx === girlRashiIdx && boyNakIdx !== girlNakIdx;
  const hasNadiDosha = hasRawNadiDosha && !sameNakshatraDiffPada && !sameRashiDiffNakshatra;
  const nadiScored = hasNadiDosha ? 0 : 8;

  const totalScore =
    Math.round(
      (varnaScored +
        vashyaScored +
        taraScored +
        yoniScored +
        grahaMaitriScored +
        ganaScored +
        bhakootScored +
        nadiScored) *
        10
    ) / 10;

  // Clean, Simple & Easy-to-Read Dosha, Parihar (दोष कट रहा है या नहीं) & Remedy Analysis
  const doshaAnalysis: DoshaAnalysisItem[] = [];
  const remedies: string[] = [];

  // --- 1. नाड़ी दोष (Nadi Dosha) ---
  if (!hasRawNadiDosha) {
    doshaAnalysis.push({
      id: 'nadi',
      name: 'नाड़ी दोष',
      status: 'absent',
      statusLabel: 'दोष नहीं है (8/8 गुण)',
      summary: `वर की नाड़ी '${boy.nadi}' और कन्या की नाड़ी '${girl.nadi}' अलग-अलग हैं, इसलिए नाड़ी दोष नहीं है।`
    });
  } else if (sameNakshatraDiffPada) {
    doshaAnalysis.push({
      id: 'nadi',
      name: 'नाड़ी दोष',
      status: 'cancelled',
      statusLabel: 'दोष कट रहा है (परिहार)',
      summary: `दोनों की '${boy.nadi}' नाड़ी एक है, लेकिन यह दोष अपने-आप कट रहा है।`,
      pariharReason: `वर और कन्या का नक्षत्र एक ही (${boy.name}) है परंतु चरण अलग-अलग हैं (चरण ${bPada} और चरण ${gPada}), इसलिए नाड़ी दोष समाप्त हो गया है।`
    });
  } else if (sameRashiDiffNakshatra) {
    doshaAnalysis.push({
      id: 'nadi',
      name: 'नाड़ी दोष',
      status: 'cancelled',
      statusLabel: 'दोष कट रहा है (परिहार)',
      summary: `दोनों की '${boy.nadi}' नाड़ी एक है, लेकिन यह दोष अपने-आप कट रहा है।`,
      pariharReason: `दोनों की राशि एक ही (${boyRashi.hi}) है और जन्म नक्षत्र अलग-अलग (${boy.name} व ${girl.name}) हैं, इसलिए नाड़ी दोष कट रहा है।`
    });
  } else if (sameRashiLord || friendlyRashiLords) {
    doshaAnalysis.push({
      id: 'nadi',
      name: 'नाड़ी दोष',
      status: 'cancelled',
      statusLabel: 'दोष कट रहा है (ग्रह मैत्री से)',
      summary: `दोनों की '${boy.nadi}' नाड़ी समान होने से नाड़ी दोष बन रहा था, परंतु ग्रह मैत्री के कारण यह दोष कट रहा है।`,
      pariharReason: sameRashiLord
        ? `वर (${boyRashi.hi}) और कन्या (${girlRashi.hi}) दोनों की राशि के स्वामी एक ही ग्रह '${boyRashiLord}' हैं, जिससे नाड़ी दोष का प्रभाव कट रहा है।`
        : `वर के राशि स्वामी '${boyRashiLord}' और कन्या के राशि स्वामी '${girlRashiLord}' में आपसी मित्रता (${grahaMaitriScored}/5 गुण) होने से नाड़ी दोष कट रहा है।`,
      remedy: 'शुभता के लिए विवाह से पूर्व महामृत्युंजय मंत्र का जप और अन्न/स्वर्ण दान करें।'
    });
    remedies.push('नाड़ी दोष शांति के लिए महामृत्युंजय मंत्र का जप एवं स्वर्ण/अन्न दान करें।');
  } else {
    doshaAnalysis.push({
      id: 'nadi',
      name: 'नाड़ी दोष',
      status: 'active',
      statusLabel: 'दोष उपलब्ध है (उपाय आवश्यक)',
      summary: `वर और कन्या दोनों की नाड़ी एक ही ('${boy.nadi}' नाड़ी) है और ग्रह मैत्री से यह दोष नहीं कट रहा है।`,
      remedy: 'विवाह से पूर्व महामृत्युंजय मंत्र का जाप, स्वर्ण नाड़ी दान और ब्राह्मण भोजन कराएं।'
    });
    remedies.push('नाड़ी दोष निवारण के लिए महामृत्युंजय मंत्र का जप, स्वर्ण नाड़ी दान एवं ब्राह्मण भोजन कराएं।');
  }

  // --- 2. भकूट दोष (Bhakoot Dosha) ---
  const bhakootTypeLabel =
    rashiDiff === 6 || rashiDiff === 8
      ? 'षडाष्टक (6/8)'
      : rashiDiff === 5 || rashiDiff === 9
      ? 'नवपंचम (5/9)'
      : rashiDiff === 2 || rashiDiff === 12
      ? 'द्विद्वादश (2/12)'
      : 'शुभ भकूट';

  if (!hasRawBhakootDosha) {
    doshaAnalysis.push({
      id: 'bhakoot',
      name: 'भकूट दोष',
      status: 'absent',
      statusLabel: 'दोष नहीं है (7/7 गुण)',
      summary: `वर (${boyRashi.hi}) और कन्या (${girlRashi.hi}) की राशियां आपस में अनुकूल हैं, भकूट दोष नहीं है।`
    });
  } else if (sameRashiLord || friendlyRashiLords || ((rashiDiff === 5 || rashiDiff === 9) && !hasNadiDosha)) {
    let reason = '';
    if (sameRashiLord) {
      reason = `वर (${boyRashi.hi}) और कन्या (${girlRashi.hi}) दोनों राशियों के स्वामी एक ही ग्रह '${boyRashiLord}' हैं, इसलिए भकूट दोष कट रहा है।`;
    } else if (friendlyRashiLords) {
      reason = `वर के राशि स्वामी '${boyRashiLord}' और कन्या के राशि स्वामी '${girlRashiLord}' में मित्रता (ग्रह मैत्री ${grahaMaitriScored}/5) होने से भकूट दोष कट रहा है।`;
    } else {
      reason = `कुंडली में नाड़ी दोष बिल्कुल नहीं है (8/8 गुण), इसलिए ${bhakootTypeLabel} भकूट दोष कट रहा है।`;
    }
    doshaAnalysis.push({
      id: 'bhakoot',
      name: 'भकूट दोष',
      status: 'cancelled',
      statusLabel: 'दोष कट रहा है (परिहार)',
      summary: `राशियों में ${bhakootTypeLabel} भकूट बन रहा है, किंतु ग्रह मैत्री के कारण यह दोष कट रहा है।`,
      pariharReason: reason
    });
  } else {
    doshaAnalysis.push({
      id: 'bhakoot',
      name: 'भकूट दोष',
      status: 'active',
      statusLabel: 'दोष उपलब्ध है (उपाय आवश्यक)',
      summary: `वर (${boyRashi.hi}) और कन्या (${girlRashi.hi}) की राशियों में ${bhakootTypeLabel} भकूट दोष है और यह नहीं कट रहा है।`,
      remedy: 'विवाह से पूर्व भगवान शिव-पार्वती (गौरी-शंकर) का पूजन व रुद्राभिषेक कराएं।'
    });
    remedies.push('भकूट दोष शांति के लिए शिव-पार्वती (गौरी-शंकर) पूजन एवं रुद्राभिषेक कराएं।');
  }

  // --- 3. मांगलिक दोष (Manglik Dosha) ---
  const boyMars = boyKundli?.planets.find((p) => p.name === 'Mangal');
  const girlMars = girlKundli?.planets.find((p) => p.name === 'Mangal');
  const boyGuru = boyKundli?.planets.find((p) => p.name === 'Guru');
  const girlGuru = girlKundli?.planets.find((p) => p.name === 'Guru');

  const boyMarsDignified =
    boyMars && (boyMars.status === 'uchcha' || boyMars.status === 'swakshetra');
  const girlMarsDignified =
    girlMars && (girlMars.status === 'uchcha' || girlMars.status === 'swakshetra');
  const boyGuruAspectMars =
    boyMars &&
    boyGuru &&
    [0, 4, 6, 8].includes((boyMars.house - boyGuru.house + 12) % 12);
  const girlGuruAspectMars =
    girlMars &&
    girlGuru &&
    [0, 4, 6, 8].includes((girlMars.house - girlGuru.house + 12) % 12);

  let manglikCompatibility = 'दोनों कुंडलियों में मांगलिक स्थिति का पूर्ण सामंजस्य है।';

  if (!isBoyManglik && !isGirlManglik) {
    doshaAnalysis.push({
      id: 'manglik',
      name: 'मांगलिक दोष',
      status: 'absent',
      statusLabel: 'दोष नहीं है',
      summary: 'वर और कन्या दोनों की कुंडली मांगलिक दोष से मुक्त है।'
    });
  } else if (isBoyManglik && isGirlManglik) {
    manglikCompatibility =
      'वर और कन्या दोनों मांगलिक हैं, इसलिए दोनों का मांगलिक दोष आपस में कट (समाप्त हो) रहा है।';
    doshaAnalysis.push({
      id: 'manglik',
      name: 'मांगलिक दोष',
      status: 'cancelled',
      statusLabel: 'दोष कट रहा है (परिहार)',
      summary: 'वर और कन्या दोनों की कुंडली में मंगल दोष है, जो आपस में मिलकर कट रहा है।',
      pariharReason: 'जब वर और कन्या दोनों मांगलिक होते हैं, तो मांगलिक दोष स्वतः समाप्त हो जाता है।'
    });
  } else {
    const manglikSide = isBoyManglik ? 'वर' : 'कन्या';
    const activeMars = isBoyManglik ? boyMars : girlMars;
    const isDignified = isBoyManglik ? boyMarsDignified : girlMarsDignified;
    const hasGuruAspect = isBoyManglik ? boyGuruAspectMars : girlGuruAspectMars;
    const otherKundli = isBoyManglik ? girlKundli : boyKundli;
    const shaniOrRahuCounter =
      activeMars &&
      otherKundli?.planets.some(
        (p) =>
          (p.name === 'Shani' || p.name === 'Rahu') && p.house === activeMars.house
      );

    if (isDignified || hasGuruAspect || shaniOrRahuCounter || totalScore >= 27) {
      let simpleReason = `अष्टकूट मिलान में उच्च गुण (${totalScore}/36) और शुभ ग्रह मैत्री होने से मांगलिक दोष का प्रभाव कट रहा है।`;
      if (isDignified && activeMars) {
        simpleReason = `${manglikSide} की कुंडली में मंगल अपनी ही या उच्च राशि (${activeMars.signHindiName}) में बैठा है, इसलिए मांगलिक दोष कट रहा है।`;
      } else if (hasGuruAspect) {
        simpleReason = `${manglikSide} की कुंडली में बृहस्पति (गुरु) की शुभ दृष्टि मंगल पर पड़ने से मांगलिक दोष कट रहा है।`;
      } else if (shaniOrRahuCounter) {
        simpleReason = `दूसरी कुंडली में उसी भाव में शनि/राहु की उपस्थिति से मंगल दोष कट रहा है।`;
      }

      manglikCompatibility = `${manglikSide} की कुंडली में आंशिक मांगलिक योग है, किंतु शुभ ग्रह स्थिति के कारण यह दोष कट रहा है।`;
      doshaAnalysis.push({
        id: 'manglik',
        name: 'मांगलिक दोष',
        status: 'cancelled',
        statusLabel: 'दोष कट रहा है (ग्रह योग से)',
        summary: `${manglikSide} की कुंडली में मांगलिक योग दिख रहा है, लेकिन शुभ ग्रह योग से यह दोष कट रहा है।`,
        pariharReason: simpleReason,
        remedy: 'मंगलवार को हनुमान चालीसा का पाठ करना शुभ रहेगा।'
      });
    } else {
      manglikCompatibility = `${manglikSide} की कुंडली में मांगलिक दोष है जबकि दूसरा पक्ष मांगलिक नहीं है। विवाह से पूर्व इसका उपाय करें।`;
      doshaAnalysis.push({
        id: 'manglik',
        name: 'मांगलिक दोष',
        status: 'active',
        statusLabel: 'दोष उपलब्ध है (उपाय आवश्यक)',
        summary: `${manglikSide} की कुंडली में मंगल ${activeMars ? `${activeMars.house}वें भाव में` : ''} होने से मांगलिक दोष है और यह अपने-आप नहीं कट रहा है।`,
        remedy: 'विवाह से पूर्व कुंभ विवाह/पीपल विवाह कराएं तथा मंगलवार को हनुमान जी की उपासना करें।'
      });
      remedies.push('मांगलिक दोष निवारण के लिए विवाह से पूर्व कुंभ/पीपल विवाह एवं मंगल शांति पूजा कराएं।');
    }
  }

  // --- 4. गण एवं अन्य दोष (Gana / Yoni / Varna Dosha) ---
  if (ganaScored >= 5) {
    doshaAnalysis.push({
      id: 'gana',
      name: 'गण दोष',
      status: 'absent',
      statusLabel: `दोष नहीं है (${ganaScored}/6 गुण)`,
      summary: `वर (${boy.gana} गण) और कन्या (${girl.gana} गण) के स्वभाव व विचारों में अच्छा तालमेल रहेगा।`
    });
  } else if (sameRashiLord || friendlyRashiLords || (!hasBhakootDosha && !hasNadiDosha)) {
    doshaAnalysis.push({
      id: 'gana',
      name: 'गण दोष',
      status: 'cancelled',
      statusLabel: 'दोष कट रहा है (परिहार)',
      summary: `वर का '${boy.gana}' गण और कन्या का '${girl.gana}' गण अलग है, परंतु यह दोष कट रहा है।`,
      pariharReason:
        sameRashiLord || friendlyRashiLords
          ? `दोनों के राशि स्वामियों (${boyRashiLord} और ${girlRashiLord}) में अच्छी मित्रता (${grahaMaitriScored}/5 गुण) होने से गण दोष कट रहा है।`
          : 'कुंडली में भकूट और नाड़ी दोनों शुभ होने के कारण गण दोष कट रहा है।'
    });
  } else {
    doshaAnalysis.push({
      id: 'gana',
      name: 'गण दोष',
      status: 'active',
      statusLabel: 'दोष उपलब्ध है (उपाय आवश्यक)',
      summary: `वर का '${boy.gana}' गण और कन्या का '${girl.gana}' गण होने से गण दोष बन रहा है।`,
      remedy: 'गण दोष शांति हेतु भगवान श्री गणेश और चंद्र देव की पूजा-अर्चना करें।'
    });
    remedies.push('गण दोष शांति के लिए श्री गणेश पूजन एवं नक्षत्र शांति पूजा कराएं।');
  }

  let minRecommendedGuna = 18;
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('jyotishwala_wp_app_settings_v1')
        : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      const customMin = Number(parsed?.kundliSettings?.minimum_recommended_guna);
      if (Number.isFinite(customMin) && customMin >= 1 && customMin <= 36) {
        minRecommendedGuna = customMin;
      }
    }
  } catch {
    // Default 18
  }

  let verdict = 'उत्कृष्ट मिलान';
  if (totalScore >= 28) verdict = 'उत्कृष्ट मिलान';
  else if (totalScore >= Math.max(21, minRecommendedGuna + 3)) verdict = 'शुभ मिलान';
  else if (totalScore >= minRecommendedGuna) verdict = 'मध्यम मिलान';
  else verdict = 'अशुभ मिलान';

  return {
    varna: {
      max: 1,
      scored: varnaScored,
      boyVarna,
      girlVarna,
      description: varnaScored === 1 ? 'वर और कन्या का वर्ण अनुकूल है।' : 'वर्ण में सामान्य गुण प्राप्त।'
    },
    vashya: {
      max: 2,
      scored: vashyaScored,
      boyVashya,
      girlVashya,
      description: 'आपसी आकर्षण और वैवाहिक समन्वय का फल।'
    },
    tara: {
      max: 3,
      scored: taraScored,
      boyTara: `तारा ${diff1}`,
      girlTara: `तारा ${diff2}`,
      description: taraScored >= 1.5 ? 'तारा मिलान शुभ एवं अनुकूल है।' : 'तारा मध्यम प्रभाव वाली है।'
    },
    yoni: {
      max: 4,
      scored: yoniScored,
      boyYoni: boy.yoni,
      girlYoni: girl.yoni,
      description: yoniScored >= 2.5 ? 'योनि अनुकूल होने से दांपत्य प्रेम प्रगाढ़ रहेगा।' : 'योनि विरोध परिहार योग्य है।'
    },
    grahaMaitri: {
      max: 5,
      scored: grahaMaitriScored,
      boyLord: boyRashiLord,
      girlLord: girlRashiLord,
      description: `राशि स्वामियों (${boyRashiLord} एवं ${girlRashiLord}) के मध्य मैत्री का विचार।`
    },
    gana: {
      max: 6,
      scored: ganaScored,
      boyGana: boy.gana,
      girlGana: girl.gana,
      description: ganaScored >= 5 ? 'गण मिलान से स्वभाव व विचारों में सामंजस्य रहेगा।' : 'गण भिन्नता के कारण सामान्य प्रभाव।'
    },
    bhakoot: {
      max: 7,
      scored: bhakootScored,
      hasDosha: hasBhakootDosha,
      description: hasBhakootDosha
        ? `${boyRashi.hi} एवं ${girlRashi.hi} राशि के मध्य भकूट दोष उपस्थित है।`
        : `${boyRashi.hi} एवं ${girlRashi.hi} राशि भकूट अनुकूल है, पारिवारिक वृद्धि होगी।`
    },
    nadi: {
      max: 8,
      scored: nadiScored,
      boyNadi: boy.nadi,
      girlNadi: girl.nadi,
      hasDosha: hasNadiDosha,
      description: hasNadiDosha
        ? `समान नाड़ी (${boy.nadi}) होने के कारण नाड़ी दोष बनता है।`
        : `दोनों की नाड़ी भिन्न (${boy.nadi} एवं ${girl.nadi}) है, जो उत्तम है।`
    },
    totalScore,
    maxScore: 36,
    isManglikBoy: isBoyManglik,
    isManglikGirl: isGirlManglik,
    manglikCompatibility,
    verdict,
    remedies,
    doshaAnalysis
  };
}

