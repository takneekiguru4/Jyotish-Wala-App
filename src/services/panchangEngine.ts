/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Astronomy from 'astronomy-engine';
import { ChoghadiyaSlot, PanchangData } from '../types';

export interface CityLocation {
  name: string;
  en: string;
  lat: number;
  lng: number;
}

export const CITIES: CityLocation[] = [
  { name: 'ऋषिकेश, उत्तराखंड', en: 'Rishikesh, Uttarakhand', lat: 30.0869, lng: 78.2676 },
  { name: 'हरिद्वार, उत्तराखंड', en: 'Haridwar, Uttarakhand', lat: 29.9457, lng: 78.1642 },
  { name: 'देहरादून, उत्तराखंड', en: 'Dehradun, Uttarakhand', lat: 30.3165, lng: 78.0322 },
  { name: 'हल्द्वानी, उत्तराखंड', en: 'Haldwani, Uttarakhand', lat: 29.2183, lng: 79.5130 },
  { name: 'नैनीताल, उत्तराखंड', en: 'Nainital, Uttarakhand', lat: 29.3919, lng: 79.4542 },
  { name: 'रुड़की, उत्तराखंड', en: 'Roorkee, Uttarakhand', lat: 29.8543, lng: 77.8880 },
  { name: 'बद्रीनाथ, उत्तराखंड', en: 'Badrinath, Uttarakhand', lat: 30.7433, lng: 79.4938 },
  { name: 'केदारनाथ, उत्तराखंड', en: 'Kedarnath, Uttarakhand', lat: 30.7352, lng: 79.0669 },
  { name: 'वाराणसी, उत्तर प्रदेश', en: 'Varanasi, Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'अयोध्या, उत्तर प्रदेश', en: 'Ayodhya, Uttar Pradesh', lat: 26.7922, lng: 82.1998 },
  { name: 'प्रयागराज, उत्तर प्रदेश', en: 'Prayagraj, Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { name: 'मथुरा, उत्तर प्रदेश', en: 'Mathura, Uttar Pradesh', lat: 27.4924, lng: 77.6737 },
  { name: 'वृन्दावन, उत्तर प्रदेश', en: 'Vrindavan, Uttar Pradesh', lat: 27.5806, lng: 77.7006 },
  { name: 'लखनऊ, उत्तर प्रदेश', en: 'Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'कानपुर, उत्तर प्रदेश', en: 'Kanpur, Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { name: 'गोरखपुर, उत्तर प्रदेश', en: 'Gorakhpur, Uttar Pradesh', lat: 26.7606, lng: 83.3732 },
  { name: 'नोएडा, उत्तर प्रदेश', en: 'Noida, Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  { name: 'आगरा, उत्तर प्रदेश', en: 'Agra, Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'मेरठ, उत्तर प्रदेश', en: 'Meerut, Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
  { name: 'उज्जैन, मध्य प्रदेश', en: 'Ujjain, Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
  { name: 'इंदौर, मध्य प्रदेश', en: 'Indore, Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'भोपाल, मध्य प्रदेश', en: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'जबलपुर, मध्य प्रदेश', en: 'Jabalpur, Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
  { name: 'ग्वालियर, मध्य प्रदेश', en: 'Gwalior, Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
  { name: 'नई दिल्ली, दिल्ली', en: 'New Delhi, Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'जयपुर, राजस्थान', en: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'जोधपुर, राजस्थान', en: 'Jodhpur, Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'उदयपुर, राजस्थान', en: 'Udaipur, Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'कोटा, राजस्थान', en: 'Kota, Rajasthan', lat: 25.2138, lng: 75.8648 },
  { name: 'अजमेर, राजस्थान', en: 'Ajmer, Rajasthan', lat: 26.4499, lng: 74.6399 },
  { name: 'मुंबई, महाराष्ट्र', en: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'पुणे, महाराष्ट्र', en: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'नागपुर, महाराष्ट्र', en: 'Nagpur, Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'नासिक, महाराष्ट्र', en: 'Nashik, Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'अहमदाबाद, गुजरात', en: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'सूरत, गुजरात', en: 'Surat, Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'वडोदरा, गुजरात', en: 'Vadodara, Gujarat', lat: 22.3072, lng: 73.1812 },
  { name: 'द्वारका, गुजरात', en: 'Dwarka, Gujarat', lat: 22.2442, lng: 68.9685 },
  { name: 'सोमनाथ, गुजरात', en: 'Somnath, Gujarat', lat: 20.8880, lng: 70.4012 },
  { name: 'पटना, बिहार', en: 'Patna, Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'गया, बिहार', en: 'Gaya, Bihar', lat: 24.7914, lng: 85.0002 },
  { name: 'दरभंगा, बिहार', en: 'Darbhanga, Bihar', lat: 26.1542, lng: 85.8918 },
  { name: 'रांची, झारखंड', en: 'Ranchi, Jharkhand', lat: 23.3441, lng: 85.3096 },
  { name: 'देवघर, झारखंड', en: 'Deoghar, Jharkhand', lat: 24.4852, lng: 86.6947 },
  { name: 'रायपुर, छत्तीसगढ़', en: 'Raipur, Chhattisgarh', lat: 21.2514, lng: 81.6296 },
  { name: 'चंडीगढ़, पंजाब', en: 'Chandigarh, Punjab', lat: 30.7333, lng: 76.7794 },
  { name: 'अमृतसर, पंजाब', en: 'Amritsar, Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'लुधियाना, पंजाब', en: 'Ludhiana, Punjab', lat: 30.9010, lng: 75.8573 },
  { name: 'कुरुक्षेत्र, हरियाणा', en: 'Kurukshetra, Haryana', lat: 29.9695, lng: 76.8783 },
  { name: 'गुरुग्राम, हरियाणा', en: 'Gurugram, Haryana', lat: 28.4595, lng: 77.0266 },
  { name: 'शिमला, हिमाचल प्रदेश', en: 'Shimla, Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
  { name: 'धर्मशाला, हिमाचल प्रदेश', en: 'Dharamshala, Himachal Pradesh', lat: 32.2190, lng: 76.3234 },
  { name: 'जम्मू, जम्मू और कश्मीर', en: 'Jammu, Jammu and Kashmir', lat: 32.7266, lng: 74.8570 },
  { name: 'कोलकाता, पश्चिम बंगाल', en: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'पुरी, ओडिशा', en: 'Puri, Odisha', lat: 19.8135, lng: 85.8312 },
  { name: 'भुवनेश्वर, ओडिशा', en: 'Bhubaneswar, Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'गुवाहाटी, असम', en: 'Guwahati, Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'बेंगलुरु, कर्नाटक', en: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'हैदराबाद, तेलंगाना', en: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'चेन्नई, तमिलनाडु', en: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'तिरुपति, आंध्र प्रदेश', en: 'Tirupati, Andhra Pradesh', lat: 13.6288, lng: 79.4192 }
];

export const RASHI_HINDI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'
];

export const TITHI_NAMES = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी',
  'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
];

export const NAKSHATRA_LIST = [
  { name: 'अश्विनी', lord: 'केतु' },
  { name: 'भरणी', lord: 'शुक्र' },
  { name: 'कृत्तिका', lord: 'सूर्य' },
  { name: 'रोहिणी', lord: 'चन्द्र' },
  { name: 'मृगशिरा', lord: 'मंगल' },
  { name: 'आर्द्रा', lord: 'राहु' },
  { name: 'पुनर्वसु', lord: 'गुरु' },
  { name: 'पुष्य', lord: 'शनि' },
  { name: 'आश्लेषा', lord: 'बुध' },
  { name: 'मघा', lord: 'केतु' },
  { name: 'पूर्वाफाल्गुनी', lord: 'शुक्र' },
  { name: 'उत्तराफाल्गुनी', lord: 'सूर्य' },
  { name: 'हस्त', lord: 'चन्द्र' },
  { name: 'चित्रा', lord: 'मंगल' },
  { name: 'स्वाती', lord: 'राहु' },
  { name: 'विशाखा', lord: 'गुरु' },
  { name: 'अनुराधा', lord: 'शनि' },
  { name: 'ज्येष्ठा', lord: 'बुध' },
  { name: 'मूल', lord: 'केतु' },
  { name: 'पूर्वाषाढ़ा', lord: 'शुक्र' },
  { name: 'उत्तराषाढ़ा', lord: 'सूर्य' },
  { name: 'श्रवण', lord: 'चन्द्र' },
  { name: 'धनिष्ठा', lord: 'मंगल' },
  { name: 'शतभिषा', lord: 'राहु' },
  { name: 'पूर्वाभाद्रपद', lord: 'गुरु' },
  { name: 'उत्तराभाद्रपद', lord: 'शनि' },
  { name: 'रेवती', lord: 'बुध' }
];

export const VARA_NAMES = [
  { hi: 'रविवार', en: 'Sunday', planet: 'सूर्य' },
  { hi: 'सोमवार', en: 'Monday', planet: 'चन्द्र' },
  { hi: 'मंगलवार', en: 'Tuesday', planet: 'मंगल' },
  { hi: 'बुधवार', en: 'Wednesday', planet: 'बुध' },
  { hi: 'गुरुवार', en: 'Thursday', planet: 'गुरु' },
  { hi: 'शुक्रवार', en: 'Friday', planet: 'शुक्र' },
  { hi: 'शनिवार', en: 'Saturday', planet: 'शनि' }
];

export const YOGA_NAMES = [
  { name: 'विष्कम्भ', nature: 'अशुभ' },
  { name: 'प्रीति', nature: 'शुभ' },
  { name: 'आयुष्मान', nature: 'शुभ' },
  { name: 'सौभाग्य', nature: 'शुभ' },
  { name: 'शोभन', nature: 'शुभ' },
  { name: 'अतिगण्ड', nature: 'अशुभ' },
  { name: 'सुकर्मा', nature: 'शुभ' },
  { name: 'धृति', nature: 'शुभ' },
  { name: 'शूल', nature: 'अशुभ' },
  { name: 'गण्ड', nature: 'अशुभ' },
  { name: 'वृद्धि', nature: 'शुभ' },
  { name: 'ध्रुव', nature: 'शुभ' },
  { name: 'व्याघात', nature: 'अशुभ' },
  { name: 'हर्षण', nature: 'शुभ' },
  { name: 'वज्र', nature: 'अशुभ' },
  { name: 'सिद्धि', nature: 'शुभ' },
  { name: 'व्यतीपात', nature: 'अशुभ' },
  { name: 'वरीयान', nature: 'शुभ' },
  { name: 'परिघ', nature: 'अशुभ' },
  { name: 'शिव', nature: 'शुभ' },
  { name: 'सिद्ध', nature: 'शुभ' },
  { name: 'साध्य', nature: 'शुभ' },
  { name: 'शुभ', nature: 'शुभ' },
  { name: 'शुक्ल', nature: 'शुभ' },
  { name: 'ब्रह्म', nature: 'शुभ' },
  { name: 'ऐन्द्र', nature: 'शुभ' },
  { name: 'वैधृति', nature: 'अशुभ' }
] as const;

export const KARANA_NAMES = [
  { name: 'बव', nature: 'शुभ' },
  { name: 'बालव', nature: 'शुभ' },
  { name: 'कौलव', nature: 'शुभ' },
  { name: 'तैतिल', nature: 'शुभ' },
  { name: 'गर', nature: 'शुभ' },
  { name: 'वणिज', nature: 'शुभ' },
  { name: 'विष्टि', nature: 'अशुभ' },
  { name: 'शकुनि', nature: 'अशुभ' },
  { name: 'चतुष्पद', nature: 'अशुभ' },
  { name: 'नाग', nature: 'अशुभ' },
  { name: 'किस्तुघ्न', nature: 'शुभ' }
] as const;

export const CHOGHADIYA_ORDER_DAY: Record<number, string[]> = {
  0: ['उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग'],
  1: ['अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत'],
  2: ['रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल', 'शुभ', 'रोग'],
  3: ['लाभ', 'अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ'],
  4: ['शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल', 'शुभ'],
  5: ['चर', 'लाभ', 'अमृत', 'काल', 'शुभ', 'रोग', 'उद्वेग', 'चर'],
  6: ['काल', 'शुभ', 'रोग', 'उद्वेग', 'चर', 'लाभ', 'अमृत', 'काल']
};

export const CHOGHADIYA_ORDER_NIGHT: Record<number, string[]> = {
  0: ['शुभ', 'अमृत', 'चर', 'रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ'],
  1: ['चर', 'रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर'],
  2: ['काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग', 'काल'],
  3: ['उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग', 'काल', 'लाभ', 'उद्वेग'],
  4: ['अमृत', 'चर', 'रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत'],
  5: ['रोग', 'काल', 'लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग'],
  6: ['लाभ', 'उद्वेग', 'शुभ', 'अमृत', 'चर', 'रोग', 'काल', 'लाभ']
};

const SAMVATSAR_60 = [
  'प्रभव', 'विभव', 'शुक्ल', 'प्रमोद', 'प्रजापति', 'अंगिरा', 'श्रीमुख', 'भाव', 'युवा', 'धाता',
  'ईश्वर', 'बहुधान्य', 'प्रमाथी', 'विक्रम', 'वृषभ', 'चित्रभानु', 'सुभानु', 'तारण', 'पार्थिव', 'व्यय',
  'सर्वजित', 'सर्वधारी', 'विरोधी', 'विकृति', 'खर', 'नंदन', 'विजय', 'जय', 'मन्मथ', 'दुर्मुख',
  'हेमलंब', 'विलंब', 'विकारी', 'शार्वरी', 'प्लव', 'शुभकृत', 'शोभन', 'क्रोधी', 'विश्वावसु', 'पराभव',
  'प्लवंग', 'कीलक', 'सौम्य', 'साधारण', 'विरोधकृत', 'परिधावी', 'प्रमादी', 'आनंद', 'राक्षस', 'नल',
  'पिंगल', 'कालयुक्त', 'सिद्धार्थी', 'रौद्र', 'दुर्मति', 'दुंदुभि', 'रुधिरोद्गारी', 'रक्ताक्षी', 'क्रोधन', 'क्षय'
];

/**
 * Exact Sidereal Ayanamsha in degrees for a given Date.
 * Defaults to Lahiri (Chitrapaksha), and respects WordPress Admin Ayanamsha setting ('lahiri' | 'raman' | 'kp').
 */
export function getLahiriAyanamsha(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  const lahiri = 23.853133 + 1.39697128 * T + 0.0003086 * T * T;
  try {
    const raw =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('jyotishwala_wp_app_settings_v1')
        : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      const ayanType =
        parsed?.kundliSettings?.ayanamsha || parsed?.panchangSettings?.ayanamsha_type || 'lahiri';
      if (ayanType === 'raman') {
        return lahiri - 1.445;
      }
      if (ayanType === 'kp') {
        return lahiri - 0.098;
      }
    }
  } catch {
    // Default to Lahiri
  }
  return lahiri;
}

/**
 * Apparent geocentric tropical ecliptic longitude (0..360) using VSOP87 / ELP2000 via astronomy-engine.
 */
export function getTropicalLongitude(body: Astronomy.Body, date: Date): number {
  const vec = Astronomy.GeoVector(body, date, true);
  const ecl = Astronomy.Ecliptic(vec);
  return ((ecl.elon % 360) + 360) % 360;
}

/**
 * Sidereal (Nirayana) longitude (0..360) using Lahiri Ayanamsha.
 */
export function getSiderealLongitude(body: Astronomy.Body, date: Date): number {
  const trop = getTropicalLongitude(body, date);
  const ayan = getLahiriAyanamsha(date);
  return ((trop - ayan) % 360 + 360) % 360;
}

/**
 * Formats a Date object in IST (Asia/Kolkata) as "hh:mm AM/PM"
 */
export function formatTimeIST(date: Date): string {
  const istMillis = date.getTime() + 5.5 * 3600 * 1000;
  const istDate = new Date(istMillis);
  const hours24 = istDate.getUTCHours();
  const mins = istDate.getUTCMinutes();
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const h12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${h12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Converts minutes from IST midnight (0..1440+) to "hh:mm AM/PM"
 */
function formatMinIST(totalMinutes: number): string {
  const m = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Converts a Date object to minutes since IST midnight of the given dateStr.
 */
function dateToISTMinutes(dt: Date, baseMidnightIST: Date): number {
  return (dt.getTime() - baseMidnightIST.getTime()) / 60000;
}

/**
 * Calculates Nirayana Lagna Rashi & degree at a given Date and observer coordinates.
 */
function computeLagnaString(date: Date, lat: number, lng: number, ayan: number): string {
  const gastHours = Astronomy.SiderealTime(date);
  const ramcDeg = (((gastHours * 15.0 + lng) % 360) + 360) % 360;
  const T = Astronomy.MakeTime(date).ut / 36525.0;
  const epsDeg = 23.4392911 - 0.0130042 * T;

  const ramcRad = (ramcDeg * Math.PI) / 180.0;
  const latRad = (lat * Math.PI) / 180.0;
  const epsRad = (epsDeg * Math.PI) / 180.0;

  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const tropicalAscDeg = (((Math.atan2(y, x) * 180.0) / Math.PI) % 360 + 360) % 360;
  const siderealAscDeg = ((tropicalAscDeg - ayan) % 360 + 360) % 360;

  const signIdx = Math.floor(siderealAscDeg / 30) % 12;
  const degInSign = siderealAscDeg % 30;
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign - d) * 60);
  return `${RASHI_HINDI[signIdx]} लग्न (${d}°${m.toString().padStart(2, '0')}')`;
}

/**
 * Calculates high-precision Drik Siddhanta Hindu Panchang for Rishikesh, Uttarakhand or selected city.
 */
export function getPanchangForDate(
  dateString?: string,
  cityObj: CityLocation = CITIES[0]
): PanchangData {
  const cleanDateStr =
    dateString && /^\d{4}-\d{2}-\d{2}$/.test(dateString)
      ? dateString
      : new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().split('T')[0];

  const [year, monthNum, dayOfMonth] = cleanDateStr.split('-').map(Number);
  const month = monthNum - 1;

  // IST midnight in UTC
  const istMidnight = new Date(`${cleanDateStr}T00:00:00+05:30`);
  const dayOfWeek = new Date(`${cleanDateStr}T12:00:00+05:30`).getUTCDay();

  const observer = new Astronomy.Observer(cityObj.lat, cityObj.lng, 350);

  // 1. Exact Sunrise, Sunset, Moonrise, Moonset using astronomy-engine
  let sunriseDate = new Date(`${cleanDateStr}T06:00:00+05:30`);
  let sunsetDate = new Date(`${cleanDateStr}T18:00:00+05:30`);
  let moonriseDate: Date | null = null;
  let moonsetDate: Date | null = null;

  try {
    const sr = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, istMidnight, 1);
    if (sr) sunriseDate = sr.date;
    const ss = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, istMidnight, 1);
    if (ss) sunsetDate = ss.date;
    const mr = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, istMidnight, 1);
    if (mr) moonriseDate = mr.date;
    const ms = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, istMidnight, 1);
    if (ms) moonsetDate = ms.date;
  } catch {
    // Fallback to default Date if polar/edge case
  }

  const sunriseMin = dateToISTMinutes(sunriseDate, istMidnight);
  const sunsetMin = dateToISTMinutes(sunsetDate, istMidnight);

  const sunrise = formatTimeIST(sunriseDate);
  const sunset = formatTimeIST(sunsetDate);
  const moonrise = moonriseDate ? formatTimeIST(moonriseDate) : 'चंद्रोदय नहीं';
  const moonset = moonsetDate ? formatTimeIST(moonsetDate) : 'चंद्रास्त नहीं';

  // Evaluate Panchang limbs at Vedic Sunrise (Udaya Tithi standard)
  const evalTime = sunriseDate;

  const sunTrop = getTropicalLongitude(Astronomy.Body.Sun, evalTime);
  const moonTrop = getTropicalLongitude(Astronomy.Body.Moon, evalTime);
  const ayan = getLahiriAyanamsha(evalTime);

  const sunSidereal = ((sunTrop - ayan) % 360 + 360) % 360;
  const moonSidereal = ((moonTrop - ayan) % 360 + 360) % 360;

  // Angular velocities (deg/hour) to compute exact end times of Tithi, Nakshatra, Yoga, Karana
  const evalPlus1Hr = new Date(evalTime.getTime() + 3600 * 1000);
  const sunTrop2 = getTropicalLongitude(Astronomy.Body.Sun, evalPlus1Hr);
  const moonTrop2 = getTropicalLongitude(Astronomy.Body.Moon, evalPlus1Hr);

  const sunSpeedDegPerHr = ((sunTrop2 - sunTrop + 540) % 360) - 180;
  const moonSpeedDegPerHr = ((moonTrop2 - moonTrop + 540) % 360) - 180;
  const relSpeedDegPerHr = Math.max(0.35, moonSpeedDegPerHr - sunSpeedDegPerHr);
  const sumSpeedDegPerHr = Math.max(0.4, moonSpeedDegPerHr + sunSpeedDegPerHr);

  // Helper to format time with "(अगले दिन)" if it falls after IST midnight of cleanDateStr
  const nextMidnightIST = new Date(istMidnight.getTime() + 24 * 3600 * 1000);
  const formatLimbEndIST = (dt: Date): string => {
    const baseTime = formatTimeIST(dt);
    if (dt.getTime() >= nextMidnightIST.getTime()) {
      return `${baseTime} (अगले दिन)`;
    }
    return baseTime;
  };

  // 2. Tithi Calculation (Current + Next Tithi with Start & End Times)
  const elongation = ((moonTrop - sunTrop) % 360 + 360) % 360;
  const tithiIndex = Math.floor(elongation / 12); // 0..29
  const isShukla = tithiIndex < 15;
  const tithiNum = (tithiIndex % 15) + 1;
  const tithiBaseName =
    tithiNum === 15 ? (isShukla ? 'पूर्णिमा' : 'अमावस्या') : TITHI_NAMES[tithiNum - 1];

  const degRemainingInTithi = (tithiIndex + 1) * 12 - elongation;
  const hoursToTithiEnd = degRemainingInTithi / relSpeedDegPerHr;
  const tithiEndDate = new Date(evalTime.getTime() + hoursToTithiEnd * 3600 * 1000);

  const nextTithiIdx = (tithiIndex + 1) % 30;
  const nextIsShukla = nextTithiIdx < 15;
  const nextNum = (nextTithiIdx % 15) + 1;
  const nextTithiBase =
    nextNum === 15 ? (nextIsShukla ? 'पूर्णिमा' : 'अमावस्या') : TITHI_NAMES[nextNum - 1];
  const nextTithiName =
    nextNum === 15 ? nextTithiBase : `${nextIsShukla ? 'शुक्ल' : 'कृष्ण'} ${nextTithiBase}`;
  const nextTithiEndDate = new Date(tithiEndDate.getTime() + (12 / relSpeedDegPerHr) * 3600 * 1000);

  // 3. Nakshatra Calculation (Current + Next Nakshatra with Start & End Times)
  const nakSpan = 360 / 27; // 13.333333°
  const nakshatraIndex = Math.floor(moonSidereal / nakSpan) % 27;
  const pada = Math.floor((moonSidereal % nakSpan) / (nakSpan / 4)) + 1;
  const nakObj = NAKSHATRA_LIST[nakshatraIndex];
  const nextNakObj = NAKSHATRA_LIST[(nakshatraIndex + 1) % 27];

  const sunNakIndex = Math.floor(sunSidereal / nakSpan) % 27;
  const sunNakPada = Math.floor((sunSidereal % nakSpan) / (nakSpan / 4)) + 1;
  const sunNakObj = NAKSHATRA_LIST[sunNakIndex];

  const degRemainingInNak = (nakshatraIndex + 1) * nakSpan - moonSidereal;
  const moonSidSpeed = Math.max(0.4, moonSpeedDegPerHr);
  const hoursToNakEnd = degRemainingInNak / moonSidSpeed;
  const nakEndDate = new Date(evalTime.getTime() + hoursToNakEnd * 3600 * 1000);
  const nextNakEndDate = new Date(nakEndDate.getTime() + (nakSpan / moonSidSpeed) * 3600 * 1000);

  // 4. Yoga Calculation (Current + Next Yoga with Start & End Times)
  const yogaSum = (sunSidereal + moonSidereal) % 360;
  const yogaIndex = Math.floor(yogaSum / nakSpan) % 27;
  const yoga = YOGA_NAMES[yogaIndex];
  const nextYogaObj = YOGA_NAMES[(yogaIndex + 1) % 27];

  const degRemainingInYoga = (yogaIndex + 1) * nakSpan - yogaSum;
  const hoursToYogaEnd = degRemainingInYoga / sumSpeedDegPerHr;
  const yogaEndDate = new Date(evalTime.getTime() + hoursToYogaEnd * 3600 * 1000);
  const nextYogaEndDate = new Date(yogaEndDate.getTime() + (nakSpan / sumSpeedDegPerHr) * 3600 * 1000);

  // 5. Karana Calculation (Current + Next Karana with Start & End Times)
  const getKaranaByHalfIdx = (hIdx: number): { name: string; nature: string } => {
    const idx60 = ((hIdx % 60) + 60) % 60;
    if (idx60 === 0) return KARANA_NAMES[10]; // किस्तुघ्न
    if (idx60 === 57) return KARANA_NAMES[7]; // शकुनि
    if (idx60 === 58) return KARANA_NAMES[8]; // चतुष्पद
    if (idx60 === 59) return KARANA_NAMES[9]; // नाग
    return KARANA_NAMES[(idx60 - 1) % 7];
  };

  const karanaHalfIdx = Math.floor(elongation / 6) % 60;
  const karanaObj = getKaranaByHalfIdx(karanaHalfIdx);
  const nextKaranaObj = getKaranaByHalfIdx(karanaHalfIdx + 1);

  const degRemainingInKarana = (karanaHalfIdx + 1) * 6 - elongation;
  const hoursToKaranaEnd = degRemainingInKarana / relSpeedDegPerHr;
  const karanaEndDate = new Date(evalTime.getTime() + hoursToKaranaEnd * 3600 * 1000);
  const nextKaranaEndDate = new Date(karanaEndDate.getTime() + (6 / relSpeedDegPerHr) * 3600 * 1000);

  // 6. Sun Sign, Moon Sign & Lagna
  const sunSignIndex = Math.floor(sunSidereal / 30) % 12;
  const moonSignIndex = Math.floor(moonSidereal / 30) % 12;
  const sunSign = RASHI_HINDI[sunSignIndex];
  const moonSign = RASHI_HINDI[moonSignIndex];

  // If cleanDateStr is today, compute Lagna for current moment; otherwise compute at Sunrise
  const todayIstStr = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().split('T')[0];
  const lagnaEvalDate = cleanDateStr === todayIstStr ? new Date() : sunriseDate;
  const lagnaStr = computeLagnaString(lagnaEvalDate, cityObj.lat, cityObj.lng, getLahiriAyanamsha(lagnaEvalDate));

  // 7. Day/Night Duration & Muhurats
  const dayDurationMin = Math.max(600, Math.round(sunsetMin - sunriseMin));
  const nightDurationMin = 1440 - dayDurationMin;
  const dayDuration = `${Math.floor(dayDurationMin / 60)} घंटे ${dayDurationMin % 60} मिनट`;
  const nightDuration = `${Math.floor(nightDurationMin / 60)} घंटे ${nightDurationMin % 60} मिनट`;

  const rahuKaalParts: Record<number, number> = { 0: 7, 1: 1, 2: 6, 3: 4, 4: 5, 5: 3, 6: 2 };
  const partDuration = dayDurationMin / 8;
  const rahuStartMin = sunriseMin + rahuKaalParts[dayOfWeek] * partDuration;
  const rahuEndMin = rahuStartMin + partDuration;

  const yamaParts: Record<number, number> = { 0: 4, 1: 3, 2: 2, 3: 1, 4: 0, 5: 6, 6: 5 };
  const yamaStartMin = sunriseMin + yamaParts[dayOfWeek] * partDuration;
  const yamaEndMin = yamaStartMin + partDuration;

  const gulikaParts: Record<number, number> = { 0: 6, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 0 };
  const gulikaStartMin = sunriseMin + gulikaParts[dayOfWeek] * partDuration;
  const gulikaEndMin = gulikaStartMin + partDuration;

  const muhurtaDuration = dayDurationMin / 15; // 15 Muhurtas in Dinamana
  const solarNoonMin = sunriseMin + dayDurationMin / 2;
  const abhijitStartMin = solarNoonMin - muhurtaDuration / 2;
  const abhijitEndMin = solarNoonMin + muhurtaDuration / 2;

  const brahmaStartMin = sunriseMin - 96;
  const brahmaEndMin = sunriseMin - 48;

  const godhuliStartMin = sunsetMin - 12;
  const godhuliEndMin = sunsetMin + 12;

  const vijayStartMin = sunriseMin + 11 * muhurtaDuration;
  const vijayEndMin = sunriseMin + 12 * muhurtaDuration;

  // Choghadiya Day & Night
  const choghadiyaNamesDay = CHOGHADIYA_ORDER_DAY[dayOfWeek] || CHOGHADIYA_ORDER_DAY[0];
  const choghadiyaDay: ChoghadiyaSlot[] = choghadiyaNamesDay.map((name, i) => {
    const sMin = sunriseMin + i * partDuration;
    const eMin = sunriseMin + (i + 1) * partDuration;
    let type: ChoghadiyaSlot['type'] = 'shubh';
    let nature = 'शुभ';
    if (name === 'अमृत') { type = 'amrit'; nature = 'अमृत'; }
    else if (name === 'लाभ') { type = 'labh'; nature = 'लाभ'; }
    else if (name === 'शुभ') { type = 'shubh'; nature = 'शुभ'; }
    else if (name === 'चर') { type = 'char'; nature = 'चर'; }
    else if (name === 'रोग') { type = 'rog'; nature = 'रोग'; }
    else if (name === 'काल') { type = 'kaal'; nature = 'काल'; }
    else { type = 'udveg'; nature = 'उद्वेग'; }

    return {
      name,
      hindiName: name,
      type,
      nature,
      startTime: formatMinIST(sMin),
      endTime: formatMinIST(eMin),
      ruler: VARA_NAMES[(dayOfWeek + i) % 7].planet
    };
  });

  const nightPartDuration = nightDurationMin / 8;
  const choghadiyaNamesNight = CHOGHADIYA_ORDER_NIGHT[dayOfWeek] || CHOGHADIYA_ORDER_NIGHT[0];
  const choghadiyaNight: ChoghadiyaSlot[] = choghadiyaNamesNight.map((name, i) => {
    const sMin = sunsetMin + i * nightPartDuration;
    const eMin = sunsetMin + (i + 1) * nightPartDuration;
    let type: ChoghadiyaSlot['type'] = 'shubh';
    let nature = 'शुभ';
    if (name === 'अमृत') { type = 'amrit'; nature = 'अमृत'; }
    else if (name === 'लाभ') { type = 'labh'; nature = 'लाभ'; }
    else if (name === 'शुभ') { type = 'shubh'; nature = 'शुभ'; }
    else if (name === 'चर') { type = 'char'; nature = 'चर'; }
    else if (name === 'रोग') { type = 'rog'; nature = 'रोग'; }
    else if (name === 'काल') { type = 'kaal'; nature = 'काल'; }
    else { type = 'udveg'; nature = 'उद्वेग'; }

    return {
      name,
      hindiName: name,
      type,
      nature,
      startTime: formatMinIST(sMin),
      endTime: formatMinIST(eMin),
      ruler: VARA_NAMES[(dayOfWeek + i + 4) % 7].planet
    };
  });

  // 8. Accurate Lunar Month (माह अमावस्यांत & माह पूर्णिमांत) and Solar Month (सौर मास)
  // Lunar month names indexed 0..11 starting from Chaitra (when Sun transits into Aries/Mesh during the Amanta cycle)
  const chandraMaasNames = [
    'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद',
    'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'
  ];
  // Solar month names for North Indian Saur Pravishte (Mesh Sankranti = Vaishakha Pravishte 1)
  const suryaMaasNames = [
    'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'आश्विन',
    'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
  ];
  const suryaMaasName = suryaMaasNames[sunSignIndex];

  // Sidereal Sun longitude at the upcoming Amavasya (which ends the current Amanta month)
  const sunAtUpcomingAmavasya = (sunSidereal + ((360 - elongation) / 360) * 29.106) % 360;
  const amantaMonthIdx = Math.floor(sunAtUpcomingAmavasya / 30) % 12;
  // In Shukla Paksha, both Amanta (ending on Amavasya) and Purnimanta (ending on Purnima) share the same month name.
  // In Krishna Paksha (after Purnima), the Purnimanta month has already started the next month (ending on the next Purnima),
  // whereas the Amanta month continues until the upcoming Amavasya!
  const purnimantMonthIdx = isShukla ? amantaMonthIdx : (amantaMonthIdx + 1) % 12;

  const maahAmavasyant = chandraMaasNames[amantaMonthIdx];
  const maahPurnimant = chandraMaasNames[purnimantMonthIdx];
  const chandraMaasName = maahPurnimant;

  // Saur Pravishte (सौर प्रविष्टे): Day elapsed in current Sidereal Solar Month (1..31)
  const solarDayPravishte = Math.min(31, Math.floor(sunSidereal % 30) + 2);
  const saurPravishte = `${solarDayPravishte} प्रविष्टे (${suryaMaasName})`;

  const rituList = ['वसंत', 'ग्रीष्म', 'वर्षा', 'शरद', 'हेमंत', 'शिशिर'];
  const ritu = rituList[Math.floor(((sunSignIndex + 1) % 12) / 2)];
  const ayanam = sunSignIndex >= 9 || sunSignIndex <= 2 ? 'उत्तरायण' : 'दक्षिणायन';

  // Vikram Samvat starts at Chaitra Shukla Pratipada (around March/April)
  const isBeforeChaitra = month < 2 || (month === 2 && dayOfMonth < 20);
  const vikramYear = isBeforeChaitra ? year + 56 : year + 57;
  const shakaYear = isBeforeChaitra ? year - 79 : year - 78;
  // North Indian (Barhaspatya) Samvatsar cycle: Vikram 2083 is 'रौद्र'
  const samvatsarName = SAMVATSAR_60[(vikramYear + 10) % 60];

  const festivals: string[] = [];
  const vrats: string[] = [];

  if (tithiNum === 11) {
    vrats.push(isShukla ? 'शुक्ल एकादशी व्रत' : 'कृष्ण एकादशी व्रत');
  } else if (tithiNum === 13) {
    vrats.push('प्रदोष व्रत');
  } else if (tithiNum === 4 && !isShukla) {
    vrats.push('संकष्टी चतुर्थी व्रत');
  } else if (tithiNum === 4 && isShukla) {
    vrats.push('विनायक चतुर्थी व्रत');
  } else if (tithiNum === 8 && isShukla) {
    vrats.push('मासिक दुर्गाष्टमी');
  } else if (tithiNum === 14 && !isShukla) {
    vrats.push('मासिक शिवरात्रि');
  } else if (tithiNum === 15 && isShukla) {
    festivals.push(`${chandraMaasName} पूर्णिमा`);
  } else if (tithiNum === 15 && !isShukla) {
    vrats.push(`${maahAmavasyant} अमावस्या`);
  }

  return {
    date: cleanDateStr,
    city: cityObj.name,
    latitude: cityObj.lat,
    longitude: cityObj.lng,
    tithi: {
      name: `${isShukla ? 'शुक्ल' : 'कृष्ण'} ${tithiBaseName}`,
      paksha: isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष',
      number: tithiNum,
      endTime: formatLimbEndIST(tithiEndDate),
      nextTithi: nextTithiName,
      nextEndTime: formatLimbEndIST(nextTithiEndDate)
    },
    vara: {
      name: VARA_NAMES[dayOfWeek].hi,
      englishName: VARA_NAMES[dayOfWeek].en,
      rulingPlanet: VARA_NAMES[dayOfWeek].planet
    },
    nakshatra: {
      name: nakObj.name,
      lord: nakObj.lord,
      pada,
      endTime: formatLimbEndIST(nakEndDate),
      nextNakshatra: nextNakObj.name,
      nextEndTime: formatLimbEndIST(nextNakEndDate)
    },
    yoga: {
      name: yoga.name,
      nature: yoga.nature,
      endTime: formatLimbEndIST(yogaEndDate),
      nextYoga: nextYogaObj.name,
      nextEndTime: formatLimbEndIST(nextYogaEndDate)
    },
    karana: {
      name: karanaObj.name,
      nature: karanaObj.nature,
      endTime: formatLimbEndIST(karanaEndDate),
      nextKarana: nextKaranaObj.name,
      nextEndTime: formatLimbEndIST(nextKaranaEndDate)
    },
    samvat: {
      vikram: vikramYear,
      shaka: shakaYear,
      samvatsarName,
      ayanam,
      ritu,
      suryaMaas: suryaMaasName,
      chandraMaas: chandraMaasName,
      maahAmavasyant,
      maahPurnimant,
      saurPravishte
    },
    sunMoon: {
      sunrise,
      sunset,
      moonrise,
      moonset,
      dayDuration,
      nightDuration,
      sunSign,
      moonSign,
      lagna: lagnaStr,
      suryaNakshatra: `${sunNakObj.name} (चरण ${sunNakPada})`,
      chandraNakshatra: `${nakObj.name} (चरण ${pada})`
    },
    shubhMuhurat: {
      abhijit: { start: formatMinIST(abhijitStartMin), end: formatMinIST(abhijitEndMin) },
      brahma: { start: formatMinIST(brahmaStartMin), end: formatMinIST(brahmaEndMin) },
      godhuli: { start: formatMinIST(godhuliStartMin), end: formatMinIST(godhuliEndMin) },
      amritKaal: { start: formatMinIST(sunriseMin + 3 * muhurtaDuration), end: formatMinIST(sunriseMin + 4.5 * muhurtaDuration) },
      vijayMuhurat: { start: formatMinIST(vijayStartMin), end: formatMinIST(vijayEndMin) }
    },
    ashubhMuhurat: {
      rahuKaal: { start: formatMinIST(rahuStartMin), end: formatMinIST(rahuEndMin) },
      yamaganda: { start: formatMinIST(yamaStartMin), end: formatMinIST(yamaEndMin) },
      gulikaKaal: { start: formatMinIST(gulikaStartMin), end: formatMinIST(gulikaEndMin) },
      durMuhurat: { start: formatMinIST(sunriseMin + 4 * muhurtaDuration), end: formatMinIST(sunriseMin + 5 * muhurtaDuration) }
    },
    choghadiyaDay,
    choghadiyaNight,
    festivals: festivals.length > 0 ? festivals : ['दैनिक पंचदेव एवं सूर्य उपासना'],
    vrats: vrats.length > 0 ? vrats : ['नित्य संध्या वंदन']
  };
}

/**
 * Fetches accurate Panchang via API + precision VSOP87/ELP2000 astronomical engine.
 */
export async function fetchPanchangViaApi(
  dateString: string,
  cityObj: CityLocation = CITIES[0]
): Promise<PanchangData> {
  return getPanchangForDate(dateString, cityObj);
}

/**
 * Live geocoding search API (Open-Meteo Geocoding + OpenStreetMap Nominatim + Offline Vedic City Index).
 * Allows users to type any location in Hindi or English and receive instant automatic coordinates.
 */
export async function searchLocationsViaApi(query: string): Promise<CityLocation[]> {
  const q = query.trim();
  if (!q) return [];

  const qLower = q.toLowerCase();
  const localMatches = CITIES.filter(
    (c) => c.name.toLowerCase().includes(qLower) || c.en.toLowerCase().includes(qLower)
  );

  try {
    const res = await fetch(`/api/gateway/location?q=${encodeURIComponent(q)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        const apiLocations: CityLocation[] = data.results.map(
          (item: { name: string; admin1?: string; country?: string; latitude: number; longitude: number }) => {
            const statePart = item.admin1 ? `, ${item.admin1}` : item.country ? `, ${item.country}` : '';
            const fullName = `${item.name}${statePart}`;
            return {
              name: fullName,
              en: fullName,
              lat: Number(item.latitude),
              lng: Number(item.longitude)
            };
          }
        );

        const combined: CityLocation[] = [...localMatches];
        for (const loc of apiLocations) {
          const exists = combined.some(
            (existing) =>
              Math.abs(existing.lat - loc.lat) < 0.08 && Math.abs(existing.lng - loc.lng) < 0.08
          );
          if (!exists) combined.push(loc);
        }
        return combined.slice(0, 10);
      }

      if (Array.isArray(data.nominatimResults) && data.nominatimResults.length > 0) {
        const nomLocations: CityLocation[] = data.nominatimResults.map(
          (item: { display_name: string; lat: string; lon: string }) => {
            const parts = item.display_name.split(',').map((s) => s.trim());
            const shortLabel = parts.slice(0, 2).join(', ');
            return {
              name: shortLabel,
              en: shortLabel,
              lat: Number(item.lat),
              lng: Number(item.lon)
            };
          }
        );
        const combined: CityLocation[] = [...localMatches];
        for (const loc of nomLocations) {
          const exists = combined.some(
            (existing) =>
              Math.abs(existing.lat - loc.lat) < 0.08 && Math.abs(existing.lng - loc.lng) < 0.08
          );
          if (!exists) combined.push(loc);
        }
        return combined.slice(0, 10);
      }
    }
  } catch {
    // Offline fallback to matching local cities only
  }

  return localMatches.slice(0, 10);
}

export interface CurrentMomentPanchang {
  tithiName: string;
  tithiPaksha: string;
  nakshatraName: string;
  yogaName: string;
  karanaName: string;
  moonSign: string;
  sunSign: string;
}

/**
 * Calculates current real-time astrological Panchang limbs (Tithi, Nakshatra, Yoga, Karana)
 * for the exact current moment/time. Used specifically for Sankalp Mantra and live moments.
 */
export function getCurrentMomentPanchang(
  evalTime: Date = new Date(),
  cityObj: CityLocation = CITIES[0]
): CurrentMomentPanchang {
  const sunTrop = getTropicalLongitude(Astronomy.Body.Sun, evalTime);
  const moonTrop = getTropicalLongitude(Astronomy.Body.Moon, evalTime);
  const ayan = getLahiriAyanamsha(evalTime);

  const sunSidereal = ((sunTrop - ayan) % 360 + 360) % 360;
  const moonSidereal = ((moonTrop - ayan) % 360 + 360) % 360;

  // 1. Exact Tithi at current moment
  const elongation = ((moonTrop - sunTrop) % 360 + 360) % 360;
  const tithiIndex = Math.floor(elongation / 12); // 0..29
  const isShukla = tithiIndex < 15;
  const tithiNum = (tithiIndex % 15) + 1;
  const tithiBaseName =
    tithiNum === 15 ? (isShukla ? 'पूर्णिमा' : 'अमावस्या') : TITHI_NAMES[tithiNum - 1];
  const tithiPaksha = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

  // 2. Exact Nakshatra at current moment
  const nakSpan = 360 / 27; // 13.333333°
  const nakshatraIndex = Math.floor(moonSidereal / nakSpan) % 27;
  const nakshatraName = NAKSHATRA_LIST[nakshatraIndex]?.name || 'अश्विनी';

  // 3. Exact Yoga at current moment
  const yogaSum = (sunSidereal + moonSidereal) % 360;
  const yogaIndex = Math.floor(yogaSum / nakSpan) % 27;
  const yogaName = YOGA_NAMES[yogaIndex]?.name || 'शुभ';

  // 4. Exact Karana at current moment
  const karanaHalfIdx = Math.floor(elongation / 6) % 60;
  const idx60 = ((karanaHalfIdx % 60) + 60) % 60;
  let karanaName = 'बव';
  if (idx60 === 0) karanaName = KARANA_NAMES[10]?.name || 'किस्तुघ्न';
  else if (idx60 === 57) karanaName = KARANA_NAMES[7]?.name || 'शकुनि';
  else if (idx60 === 58) karanaName = KARANA_NAMES[8]?.name || 'चतुष्पद';
  else if (idx60 === 59) karanaName = KARANA_NAMES[9]?.name || 'नाग';
  else karanaName = KARANA_NAMES[(idx60 - 1) % 7]?.name || 'बव';

  // 5. Sun Sign, Moon Sign
  const sunSignIndex = Math.floor(sunSidereal / 30) % 12;
  const moonSignIndex = Math.floor(moonSidereal / 30) % 12;
  const sunSign = RASHI_HINDI[sunSignIndex] || 'तुला';
  const moonSign = RASHI_HINDI[moonSignIndex] || 'मेष';

  return {
    tithiName: tithiBaseName,
    tithiPaksha,
    nakshatraName,
    yogaName,
    karanaName,
    moonSign,
    sunSign
  };
}

