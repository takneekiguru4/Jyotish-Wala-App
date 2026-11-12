/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageCode } from '../types';
import {
  EXACT_HI_TO_EN_MAP,
  translateDynamicHindiPatternsToEnglish
} from './englishCorpus';

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string; nativeName: string }[] = [
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'en', label: 'English', nativeName: 'English' }
];

export const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  hi: {
    appName: 'JyotishWala',
    tagline: 'सम्पूर्ण ज्योतिष, पंचांग एवं धर्म संगम',
    home: 'गृह',
    kundli: 'कुंडली',
    jyotish: 'ज्योतिष',
    panchang: 'पंचांग',
    tyohar: 'त्योहार',
    dharma: 'धर्म',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',
    closePage: 'बंद करें',
    closeBtn: 'बंद करें',
    backToHome: 'वापस जाएं',
    dailyHoroscope: 'दैनिक राशिफल',
    monthlyHoroscope: 'मासिक राशिफल',
    yearlyHoroscope: 'वार्षिक राशिफल',
    panchangRishikesh: 'ऋषिकेश पंचांग',
    seeMorePanchang: 'और देखें',
    expandPanchang: 'संपूर्ण पंचांग विस्तार से देखें',
    collapsePanchang: 'पंचांग संक्षिप्त करें',
    kundliGenerator: 'जन्म कुंडली',
    kundliMilan: 'कुंडली मिलन',
    grahGochar: 'ग्रह गोचर',
    talkToPandit: 'पंडित जी से बात करें',
    articles: 'ज्योतिष लेख',
    calculators: 'ज्योतिष कैलकुलेटर',
    navCalculators: 'ज्योतिष कैलकुलेटर',
    navDharma: 'सनातन धर्म एवं मंत्र',
    vastuShastra: 'वास्तु शास्त्र',
    numerology: 'अंक ज्योतिष',
    shubhMuhurat: 'शुभ मुहूर्त',
    ashubhMuhurat: 'अशुभ काल',
    rahuKaal: 'राहुकाल',
    choghadiya: 'चौघड़िया मुहूर्त',
    adminPanel: 'व्यवस्थापक पैनल',
    adminLogin: 'व्यवस्थापक लॉगिन',
    inviteMember: 'सदस्य आमंत्रित करें',
    offlineMode: 'ऑफ़लाइन',
    onlineMode: 'ऑनलाइन',
    search: 'खोजें...',
    notifications: 'सूचनाएं',
    readMore: 'विस्तार से पढ़ें',
    avakahadaTab: 'अवकहड़ा चक्र एवं ग्रह स्पष्ट',
    kundliChartsTab: 'लग्न, चंद्र एवं नवांश कुंडली',
    vimshottariTab: 'विंशोत्तरी दशा',
    lagnaKundli: 'लग्न कुंडली',
    chandraKundli: 'चंद्र कुंडली',
    navamshaKundli: 'नवांश कुंडली',
    FullName: 'जातक का नाम',
    BirthDate: 'जन्म तिथि',
    BirthTime: 'जन्म समय',
    BirthPlace: 'जन्म स्थान',
    Gender: 'लिंग',
    Male: 'पुरुष',
    Female: 'महिला',
    Other: 'अन्य',
    GenerateKundli: 'कुंडली बनाएं',
    SaveKundli: 'कुंडली सहेजें',
    selectCity: 'स्थान चुनें',
    selectDate: 'तिथि चुनें',
    today: 'आज',
    prevDay: 'पिछला दिन',
    nextDay: 'अगला दिन',
    tithi: 'तिथि',
    vara: 'वार',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    moonrise: 'चंद्रोदय',
    moonset: 'चंद्रास्त',
    vikramSamvat: 'विक्रम संवत',
    shakaSamvat: 'शक संवत',
    samvatsar: 'संवत्सर',
    suryaMaas: 'सौर मास',
    chandraMaas: 'चंद्र मास',
    ritu: 'ऋतु',
    ayana: 'अयन',
    abhijitMuhurat: 'अभिजित मुहूर्त',
    brahmaMuhurat: 'ब्रह्म मुहूर्त',
    godhuliMuhurat: 'गोधूलि मुहूर्त',
    amritKaal: 'अमृत काल',
    yamaganda: 'यमगण्ड',
    gulikaKaal: 'गुलिक काल',
    dayChoghadiya: 'दिन का चौघड़िया',
    nightChoghadiya: 'रात्रि का चौघड़िया',
    writeArticle: 'नया लेख लिखें',
    editArticle: 'संपादित करें',
    deleteArticle: 'हटाएं',
    panditDirectory: 'पंडित जी संपर्क एवं परामर्श विवरण',
    scanQrToPay: 'दक्षिणा भुगतान हेतु QR कोड स्कैन करें',
    footerAboutLine1: 'JyotishWala — प्रामाणिक वैदिक पंचांग, जन्म कुंडली, 36 गुण मिलान एवं राशिफल का संपूर्ण मंच।',
    footerAboutLine2: 'अनुभवी ज्योतिषाचार्यों से सीधा परामर्श एवं सनातन धर्म-शास्त्रों पर आधारित सटीक गणना।',
    footerCopyright: '© 2026 JyotishWala • सर्वाधिकार सुरक्षित'
  },
  en: {
    appName: 'JyotishWala',
    tagline: 'Complete Vedic Astrology, Panchang & Sanatan Dharma Platform',
    home: 'Home',
    kundli: 'Kundli',
    jyotish: 'Astrology',
    panchang: 'Panchang',
    tyohar: 'Festivals',
    dharma: 'Dharma',
    profile: 'Profile',
    logout: 'Logout',
    closePage: 'Close',
    closeBtn: 'Close',
    backToHome: 'Back',
    dailyHoroscope: 'Daily Horoscope',
    monthlyHoroscope: 'Monthly Horoscope',
    yearlyHoroscope: 'Yearly Horoscope',
    panchangRishikesh: 'Rishikesh Panchang',
    seeMorePanchang: 'See More',
    expandPanchang: 'Expand Complete Panchang',
    collapsePanchang: 'Collapse Panchang',
    kundliGenerator: 'Birth Kundli',
    kundliMilan: 'Kundli Matching',
    grahGochar: 'Planetary Transits',
    talkToPandit: 'Talk to Pandit Ji',
    articles: 'Astrology Articles',
    calculators: 'Astrology Calculators',
    navCalculators: 'Astrology Calculators',
    navDharma: 'Sanatan Dharma & Mantras',
    vastuShastra: 'Vastu Shastra',
    numerology: 'Numerology',
    shubhMuhurat: 'Auspicious Muhurat',
    ashubhMuhurat: 'Inauspicious Timings',
    rahuKaal: 'Rahu Kaal',
    choghadiya: 'Choghadiya Muhurat',
    adminPanel: 'Admin Panel',
    adminLogin: 'Admin Login',
    inviteMember: 'Invite Member',
    offlineMode: 'Offline',
    onlineMode: 'Online',
    search: 'Search...',
    notifications: 'Notifications',
    readMore: 'Read More',
    avakahadaTab: 'Avakahada Chakra & Planets',
    kundliChartsTab: 'Lagna, Moon & Navamsha Charts',
    vimshottariTab: 'Vimshottari Dasha',
    lagnaKundli: 'Lagna Kundli',
    chandraKundli: 'Moon Chart',
    navamshaKundli: 'Navamsha Chart',
    FullName: 'Full Name',
    BirthDate: 'Date of Birth',
    BirthTime: 'Time of Birth',
    BirthPlace: 'Place of Birth',
    Gender: 'Gender',
    Male: 'Male',
    Female: 'Female',
    Other: 'Other',
    GenerateKundli: 'Generate Kundli',
    SaveKundli: 'Save Kundli',
    selectCity: 'Select Location',
    selectDate: 'Select Date',
    today: 'Today',
    prevDay: 'Previous Day',
    nextDay: 'Next Day',
    tithi: 'Tithi',
    vara: 'Day',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    karana: 'Karana',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    moonrise: 'Moonrise',
    moonset: 'Moonset',
    vikramSamvat: 'Vikram Samvat',
    shakaSamvat: 'Shaka Samvat',
    samvatsar: 'Samvatsar',
    suryaMaas: 'Solar Month',
    chandraMaas: 'Lunar Month',
    ritu: 'Season',
    ayana: 'Ayana',
    abhijitMuhurat: 'Abhijit Muhurat',
    brahmaMuhurat: 'Brahma Muhurat',
    godhuliMuhurat: 'Godhuli Muhurat',
    amritKaal: 'Amrit Kaal',
    yamaganda: 'Yamaganda',
    gulikaKaal: 'Gulika Kaal',
    dayChoghadiya: 'Day Choghadiya',
    nightChoghadiya: 'Night Choghadiya',
    writeArticle: 'Write New Article',
    editArticle: 'Edit',
    deleteArticle: 'Delete',
    panditDirectory: 'Pandit Ji Contact & Consultation Details',
    scanQrToPay: 'Scan QR Code for Dakshina Payment',
    footerAboutLine1: 'JyotishWala — Authentic Vedic Panchang, Birth Kundli, 36 Guna Matching & Horoscope Platform.',
    footerAboutLine2: 'Direct consultation with verified Acharyas and accurate calculations based on Sanatan Shastras.',
    footerCopyright: '© 2026 JyotishWala • All Rights Reserved'
  },
  sa: {
    appName: 'JyotishWala',
    tagline: 'सम्पूर्ण वैदिक ज्योतिषम्, पञ्चाङ्गम् च धर्मग्रन्थाः',
    home: 'गृहम्',
    kundli: 'कुण्डली',
    jyotish: 'ज्योतिषम्',
    panchang: 'पञ्चाङ्गम्',
    tyohar: 'पर्वाणि',
    dharma: 'धर्मः',
    profile: 'विवरणम्',
    logout: 'निर्गमनम्',
    closePage: 'पिधानम्',
    closeBtn: 'पिधानम्',
    backToHome: 'प्रतिगच्छतु',
    dailyHoroscope: 'दैनिकराशिफलम्',
    monthlyHoroscope: 'मासिकराशिफलम्',
    yearlyHoroscope: 'वार्षिकराशिफलम्',
    panchangRishikesh: 'हृषीकेश पञ्चाङ्गम्',
    seeMorePanchang: 'अधिकं पश्यतु',
    expandPanchang: 'सम्पूर्णं पञ्चाङ्गं पश्यतु',
    collapsePanchang: 'सङ्क्षिप्तं करोतु',
    kundliGenerator: 'जन्मकुण्डली',
    kundliMilan: 'कुण्डलीमेलनम्',
    grahGochar: 'ग्रहगोचरः',
    talkToPandit: 'आचार्यपरामर्शः',
    articles: 'ज्योतिषलेखाः',
    calculators: 'गणनायन्त्रम्',
    navCalculators: 'ज्योतिष गणनायन्त्रम्',
    navDharma: 'सनातनधर्मः मन्त्राः च',
    vastuShastra: 'वास्तुशास्त्रम्',
    numerology: 'अङ्कज्योतिषम्',
    shubhMuhurat: 'शुभमुहूर्तः',
    ashubhMuhurat: 'अशुभकालः',
    rahuKaal: 'राहुकालः',
    choghadiya: 'चौघडिया मुहूर्तम्',
    adminPanel: 'प्रशासकपटलम्',
    adminLogin: 'प्रशासकप्रवेशः',
    inviteMember: 'सदस्यामन्त्रणम्',
    offlineMode: 'अन्तर्जालविहीनम्',
    onlineMode: 'सक्रियम्',
    search: 'अन्वेषणम्...',
    notifications: 'सूचनाः',
    readMore: 'विस्तरेण पठतु',
    avakahadaTab: 'अवकहडाचक्रं ग्रहस्पष्टं च',
    kundliChartsTab: 'लग्न-चन्द्र-नवांशकुण्डली',
    vimshottariTab: 'विंशोत्तरी दशा',
    lagnaKundli: 'लग्नकुण्डली',
    chandraKundli: 'चन्द्रकुण्डली',
    navamshaKundli: 'नवांशकुण्डली',
    FullName: 'जातकस्य नाम',
    BirthDate: 'जन्मतिथिः',
    BirthTime: 'जन्मसमयः',
    BirthPlace: 'जन्मस्थानम्',
    Gender: 'लिङ्गम्',
    Male: 'पुरुषः',
    Female: 'स्त्री',
    Other: 'अन्यः',
    GenerateKundli: 'कुण्डलीं रचयतु',
    SaveKundli: 'रक्षतु',
    selectCity: 'स्थानं चिनोतु',
    selectDate: 'दिनाङ्कः',
    today: 'अद्य',
    prevDay: 'पूर्वदिनम्',
    nextDay: 'परदिनम्',
    tithi: 'तिथिः',
    vara: 'वासरः',
    nakshatra: 'नक्षत्रम्',
    yoga: 'योगः',
    karana: 'करणम्',
    sunrise: 'सूर्योदयः',
    sunset: 'सूर्यास्तः',
    moonrise: 'चन्द्रोदयः',
    moonset: 'चन्द्रास्तः',
    vikramSamvat: 'विक्रमसंवत्',
    shakaSamvat: 'शकसंवत्',
    samvatsar: 'संवत्सरः',
    suryaMaas: 'सौरमासः',
    chandraMaas: 'चान्द्रमासः',
    ritu: 'ऋतुः',
    ayana: 'अयनम्',
    abhijitMuhurat: 'अभिजित् मुहूर्तः',
    brahmaMuhurat: 'ब्रह्ममुहूर्तः',
    godhuliMuhurat: 'गोधूलिमुहूर्तः',
    amritKaal: 'अमृतकालः',
    yamaganda: 'यमगण्डः',
    gulikaKaal: 'गुलिककालः',
    dayChoghadiya: 'दिवा चौघडिया',
    nightChoghadiya: 'रात्रि चौघडिया',
    writeArticle: 'नूतनलेखः',
    editArticle: 'सम्पादनम्',
    deleteArticle: 'मार्जनम्',
    panditDirectory: 'आचार्यसम्पर्कविवरणम्',
    scanQrToPay: 'दक्षिणादानार्थं QR पश्यतु',
    footerAboutLine1: 'JyotishWala — प्रामाणिकं वैदिकपञ्चाङ्गम्, जन्मकुण्डली, ३६ गुणमेलनं राशिफलं च।',
    footerAboutLine2: 'विद्वद्भिः ज्योतिषाचार्यैः साक्षात् परामर्शः सनातनशास्त्रसम्मतं सूक्ष्मं गणितं च।',
    footerCopyright: '© 2026 JyotishWala • सर्वाधिकाराः सुरक्षिताः'
  },
  mr: {
    appName: 'JyotishWala',
    tagline: 'संपूर्ण वैदिक ज्योतिष, पंचांग आणि कुंडली मिलन',
    home: 'होम',
    kundli: 'कुंडली',
    jyotish: 'ज्योतिष',
    panchang: 'पंचांग',
    tyohar: 'सण-उत्सव',
    dharma: 'धर्म',
    profile: 'प्रोफाइल',
    logout: 'लॉग आउट',
    closePage: 'बंद करा',
    closeBtn: 'बंद करा',
    backToHome: 'मागे जा',
    dailyHoroscope: 'दैनिक राशीभविष्य',
    monthlyHoroscope: 'मासिक राशीभविष्य',
    yearlyHoroscope: 'वार्षिक राशीभविष्य',
    panchangRishikesh: 'ऋषिकेश पंचांग',
    seeMorePanchang: 'आणखी पहा',
    expandPanchang: 'संपूर्ण पंचांग पहा',
    collapsePanchang: 'संक्षिप्त करा',
    kundliGenerator: 'जन्म कुंडली',
    kundliMilan: 'कुंडली मिलन',
    grahGochar: 'ग्रह गोचर',
    talkToPandit: 'पंडितजींशी संपर्क साधा',
    articles: 'ज्योतिष लेख',
    calculators: 'ज्योतिष कॅल्क्युलेटर',
    navCalculators: 'ज्योतिष कॅल्क्युलेटर',
    navDharma: 'सनातन धर्म आणि मंत्र',
    vastuShastra: 'वास्तू शास्त्र',
    numerology: 'अंकशास्त्र',
    shubhMuhurat: 'शुभ मुहूर्त',
    ashubhMuhurat: 'अशुभ काळ',
    rahuKaal: 'राहु काळ',
    choghadiya: 'चौघडिया',
    adminPanel: 'प्रशासक पॅनेल',
    adminLogin: 'प्रशासक लॉगिन',
    inviteMember: 'सदस्य आमंत्रित करा',
    offlineMode: 'ऑफलाइन',
    onlineMode: 'ऑनलाइन',
    search: 'शोधा...',
    notifications: 'सूचना',
    readMore: 'अधिक वाचा',
    avakahadaTab: 'अवकहडा चक्र आणि ग्रह स्थिती',
    kundliChartsTab: 'लग्न, चंद्र आणि नवांश कुंडली',
    vimshottariTab: 'विंशोत्तरी दशा',
    lagnaKundli: 'लग्न कुंडली',
    chandraKundli: 'चंद्र कुंडली',
    navamshaKundli: 'नवांश कुंडली',
    FullName: 'पूर्ण नाव',
    BirthDate: 'जन्मतारीख',
    BirthTime: 'जन्म वेळ',
    BirthPlace: 'जन्म ठिकाण',
    Gender: 'लिंग',
    Male: 'पुरुष',
    Female: 'स्त्री',
    Other: 'इतर',
    GenerateKundli: 'कुंडली तयार करा',
    SaveKundli: 'जतन करा',
    selectCity: 'शहर निवडा',
    selectDate: 'तारीख निवडा',
    today: 'आज',
    prevDay: 'मागील दिवस',
    nextDay: 'पुढील दिवस',
    tithi: 'तिथी',
    vara: 'वार',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    moonrise: 'चंद्रोदय',
    moonset: 'चंद्रास्त',
    vikramSamvat: 'विक्रम संवत',
    shakaSamvat: 'शक संवत',
    samvatsar: 'संवत्सर',
    suryaMaas: 'सौर मास',
    chandraMaas: 'चंद्र मास',
    ritu: 'ऋतू',
    ayana: 'अयन',
    abhijitMuhurat: 'अभिजित मुहूर्त',
    brahmaMuhurat: 'ब्रह्म मुहूर्त',
    godhuliMuhurat: 'गोधूलि मुहूर्त',
    amritKaal: 'अमृत काळ',
    yamaganda: 'यमगंड',
    gulikaKaal: 'गुलिक काळ',
    dayChoghadiya: 'दिवसाचे चौघडिया',
    nightChoghadiya: 'रात्रीचे चौघडिया',
    writeArticle: 'नवीन लेख लिहा',
    editArticle: 'संपादित करा',
    deleteArticle: 'हटवा',
    panditDirectory: 'पंडितजी संपर्क आणि सल्ला माहिती',
    scanQrToPay: 'दक्षिणा देण्यासाठी QR कोड स्कॅन करा',
    footerAboutLine1: 'JyotishWala — अचूक वैदिक पंचांग, जन्मकुंडली, ३६ गुण मिलन आणि राशीभविष्याचे संपूर्ण व्यासपीठ.',
    footerAboutLine2: 'अनुभवी ज्योतिषाचार्यांशी थेट सल्लामसलत आणि सनातन धर्मशास्त्रांवर आधारित अचूक गणना.',
    footerCopyright: '© 2026 JyotishWala • सर्व हक्क राखीव'
  },
  gu: {
    appName: 'JyotishWala',
    tagline: 'સંપૂર્ણ વૈદિક જ્યોતિષ, પંચાંગ અને કુંડળી મિલન',
    home: 'હોમ',
    kundli: 'કુંડળી',
    jyotish: 'જ્યોતિષ',
    panchang: 'પંચાંગ',
    tyohar: 'તહેવારો',
    dharma: 'ધર્મ',
    profile: 'પ્રોફાઇલ',
    logout: 'લૉગ આઉટ',
    closePage: 'બંધ કરો',
    closeBtn: 'બંધ કરો',
    backToHome: 'પાછા જાઓ',
    dailyHoroscope: 'દૈનિક રાશિફળ',
    monthlyHoroscope: 'માસિક રાશિફળ',
    yearlyHoroscope: 'વાર્ષિક રાશિફળ',
    panchangRishikesh: 'ઋષિકેશ પંચાંગ',
    seeMorePanchang: 'વધુ જુઓ',
    expandPanchang: 'સંપૂર્ણ પંચાંગ જુઓ',
    collapsePanchang: 'સંક્ષિપ્ત કરો',
    kundliGenerator: 'જન્મ કુંડળી',
    kundliMilan: 'કુંડળી મિલન',
    grahGochar: 'ગ્રહ ગોચર',
    talkToPandit: 'પંડિતજીનો સંપર્ક કરો',
    articles: 'જ્યોતિષ લેખો',
    calculators: 'જ્યોતિષ કેલ્ક્યુલેટર',
    navCalculators: 'જ્યોતિષ કેલ્ક્યુલેટર',
    navDharma: 'સનાતન ધર્મ અને મંત્ર',
    vastuShastra: 'વાસ્તુ શાસ્ત્ર',
    numerology: 'અંક જ્યોતિષ',
    shubhMuhurat: 'શુભ મુહૂર્ત',
    ashubhMuhurat: 'અશુભ કાળ',
    rahuKaal: 'રાહુકાળ',
    choghadiya: 'ચોઘડિયા',
    adminPanel: 'એડમિન પેનલ',
    adminLogin: 'એડમિન લૉગિન',
    inviteMember: 'સભ્ય આમંત્રિત કરો',
    offlineMode: 'ઑફલાઇન',
    onlineMode: 'ઑનલાઇન',
    search: 'શોધો...',
    notifications: 'સૂચનાઓ',
    readMore: 'વધુ વાંચો',
    avakahadaTab: 'અવકહડા ચક્ર અને ગ્રહ સ્થિતિ',
    kundliChartsTab: 'લગ્ન, ચંદ્ર અને નવાંશ કુંડળી',
    vimshottariTab: 'વિંશોત્તરી દશા',
    lagnaKundli: 'લગ્ન કુંડળી',
    chandraKundli: 'ચંદ્ર કુંડળી',
    navamshaKundli: 'નવાંશ કુંડળી',
    FullName: 'પૂરું નામ',
    BirthDate: 'જન્મ તારીખ',
    BirthTime: 'જન્મ સમય',
    BirthPlace: 'જન્મ સ્થળ',
    Gender: 'લિંગ',
    Male: 'પુરુષ',
    Female: 'સ્ત્રી',
    Other: 'અન્ય',
    GenerateKundli: 'કુંડળી બનાવો',
    SaveKundli: 'સાચવો',
    selectCity: 'સ્થળ પસંદ કરો',
    selectDate: 'તારીખ પસંદ કરો',
    today: 'આજે',
    prevDay: 'ગઈકાલ',
    nextDay: 'આવતીકાલ',
    tithi: 'તિથિ',
    vara: 'વાર',
    nakshatra: 'નक्षत्र',
    yoga: 'યોગ',
    karana: 'કરણ',
    sunrise: 'સૂર્યોદય',
    sunset: 'સૂર્યાસ્ત',
    moonrise: 'ચંદ્રોદય',
    moonset: 'ચંદ્રાસ્ત',
    vikramSamvat: 'વિક્રમ સંવત',
    shakaSamvat: 'શક સંવત',
    samvatsar: 'સંવત્સર',
    suryaMaas: 'સૌર માસ',
    chandraMaas: 'ચંદ્ર માસ',
    ritu: 'ઋતુ',
    ayana: 'અયન',
    abhijitMuhurat: 'અભિજિત મુહૂર્ત',
    brahmaMuhurat: 'બ્રહ્મ મુહૂર્ત',
    godhuliMuhurat: 'ગોધૂલિ મુહૂર્ત',
    amritKaal: 'અમૃત કાળ',
    yamaganda: 'યમગંડ',
    gulikaKaal: 'ગુલિક કાળ',
    dayChoghadiya: 'દિવસના ચોઘડિયા',
    nightChoghadiya: 'રાત્રિના ચોઘડિયા',
    writeArticle: 'નવો લેખ લખો',
    editArticle: 'સંપાદિત કરો',
    deleteArticle: 'દૂર કરો',
    panditDirectory: 'પંડિતજી સંપર્ક અને પરામર્શ વિગતો',
    scanQrToPay: 'દક્ષિણા ચૂકવવા માટે QR કોડ સ્કેન કરો',
    footerAboutLine1: 'JyotishWala — પ્રમાણભૂત વૈદિક પંચાંગ, જન્મ કુંડળી, ૩૬ ગુણ મિલન અને રાશિફળનું સંપૂર્ણ પ્લેટફોર્મ.',
    footerAboutLine2: 'અનુભવી જ્યોતિષાચાર્યો સાથે સીધો સંપર્ક અને સનાતન શાસ્ત્રો પર આધારિત સચોટ ગણતરી.',
    footerCopyright: '© 2026 JyotishWala • સર્વાધિકાર સુરક્ષિત'
  },
  bn: {
    appName: 'JyotishWala',
    tagline: 'সম্পূর্ণ বৈদিক জ্যোতিষ, পঞ্জিকা ও জন্মকুণ্ডলী মিলন',
    home: 'হোম',
    kundli: 'কুণ্ডলী',
    jyotish: 'জ্যোতিষ',
    panchang: 'পঞ্জিকা',
    tyohar: 'উৎসব',
    dharma: 'ধর্ম',
    profile: 'প্রোফাইল',
    logout: 'লগ আউট',
    closePage: 'বন্ধ করুন',
    closeBtn: 'বন্ধ করুন',
    backToHome: 'ফিরে যান',
    dailyHoroscope: 'দৈনিক রাশিফল',
    monthlyHoroscope: 'মাসিক রাশিফল',
    yearlyHoroscope: 'বার্ষিক রাশিফল',
    panchangRishikesh: 'হৃষীকেশ পঞ্জিকা',
    seeMorePanchang: 'আরও দেখুন',
    expandPanchang: 'সম্পূর্ণ পঞ্জিকা দেখুন',
    collapsePanchang: 'সংক্ষিপ্ত করুন',
    kundliGenerator: 'জন্ম কুণ্ডলী',
    kundliMilan: 'কুণ্ডলী মিলন',
    grahGochar: 'গ্রহ গোচর',
    talkToPandit: 'পণ্ডিতজির সাথে যোগাযোগ',
    articles: 'জ্যোতিষ প্রবন্ধ',
    calculators: 'জ্যোতিষ ক্যালকুলেটর',
    navCalculators: 'জ্যোতিষ ক্যালকুলেটর',
    navDharma: 'সনাতন ধর্ম ও মন্ত্র',
    vastuShastra: 'বাস্তু শাস্ত্র',
    numerology: 'সংখ্যা জ্যোতিষ',
    shubhMuhurat: 'শুভ মুহূর্ত',
    ashubhMuhurat: 'অশুভ কাল',
    rahuKaal: 'রাহু কাল',
    choghadiya: 'চোঘড়িয়া',
    adminPanel: 'অ্যাডমিন প্যানেল',
    adminLogin: 'অ্যাডমিন লগইন',
    inviteMember: 'সদস্য আমন্ত্রণ',
    offlineMode: 'অফলাইন',
    onlineMode: 'অনলাইন',
    search: 'অনুসন্ধান...',
    notifications: 'বিজ্ঞপ্তি',
    readMore: 'বিস্তারিত পড়ুন',
    avakahadaTab: 'অবকহড়া চক্র ও গ্রহ অবস্থান',
    kundliChartsTab: 'লগ্ন, চন্দ্র ও নবাংশ কুণ্ডলী',
    vimshottariTab: 'বিংশোত্তরী দশা',
    lagnaKundli: 'লগ্ন কুণ্ডলী',
    chandraKundli: 'চন্দ্র কুণ্ডলী',
    navamshaKundli: 'নবাংশ কুণ্ডলী',
    FullName: 'সম্পূর্ণ নাম',
    BirthDate: 'জন্ম তারিখ',
    BirthTime: 'জন্ম সময়',
    BirthPlace: 'জন্মস্থান',
    Gender: 'লিঙ্গ',
    Male: 'পুরুষ',
    Female: 'মহিলা',
    Other: 'অন্যান্য',
    GenerateKundli: 'কুণ্ডলী তৈরি করুন',
    SaveKundli: 'সংরক্ষণ করুন',
    selectCity: 'স্থান নির্বাচন করুন',
    selectDate: 'তারিখ নির্বাচন করুন',
    today: 'আজ',
    prevDay: 'আগের দিন',
    nextDay: 'পরের দিন',
    tithi: 'তিথি',
    vara: 'বার',
    nakshatra: 'নক্ষত্র',
    yoga: 'যোগ',
    karana: 'করণ',
    sunrise: 'সূর্যোদয়',
    sunset: 'সূর্যাস্ত',
    moonrise: 'চন্দ্রোদয়',
    moonset: 'চন্দ্রাস্ত',
    vikramSamvat: 'বিক্রম সংবৎ',
    shakaSamvat: 'শক সংবৎ',
    samvatsar: 'সংবৎসর',
    suryaMaas: 'সৌর মাস',
    chandraMaas: 'চন্দ্র মাস',
    ritu: 'ঋতু',
    ayana: 'অয়ন',
    abhijitMuhurat: 'অভিজিৎ মুহূর্ত',
    brahmaMuhurat: 'ব্রহ্ম মুহূর্ত',
    godhuliMuhurat: 'গোধূলি মুহূর্ত',
    amritKaal: 'অমৃত কাল',
    yamaganda: 'যমগণ্ড',
    gulikaKaal: 'গুলিক কাল',
    dayChoghadiya: 'দিনের চোঘড়িয়া',
    nightChoghadiya: 'রাতের চোঘড়িয়া',
    writeArticle: 'নতুন প্রবন্ধ লিখুন',
    editArticle: 'সম্পাদনা',
    deleteArticle: 'মুছুন',
    panditDirectory: 'পণ্ডিতজির যোগাযোগ ও পরামর্শ বিবরণ',
    scanQrToPay: 'দক্ষিণা প্রদানের জন্য QR কোড স্ক্যান করুন',
    footerAboutLine1: 'JyotishWala — প্রামাণিক বৈদিক পঞ্জিকা, জন্ম কুণ্ডলী, ৩৬ গুণ মিলন ও রাশিফলের সম্পূর্ণ মঞ্চ।',
    footerAboutLine2: 'অভিজ্ঞ জ্যোতিষাচার্যদের সাথে সরাসরি পরামর্শ এবং সনাতন শাস্ত্র ভিত্তিক সঠিক গণনা।',
    footerCopyright: '© 2026 JyotishWala • সর্বস্বত্ব সংরক্ষিত'
  }
};

const TERM_MAP: Record<string, Record<LanguageCode, string>> = {
  'मेष': { hi: 'मेष', en: 'Aries', sa: 'मेषः', mr: 'मेष', gu: 'મેષ', bn: 'মেষ' },
  'वृषभ': { hi: 'वृषभ', en: 'Taurus', sa: 'वृषभः', mr: 'वृषभ', gu: 'વૃષભ', bn: 'বৃষ' },
  'मिथुन': { hi: 'मिथुन', en: 'Gemini', sa: 'मिथुनम्', mr: 'मिथुन', gu: 'મિથુન', bn: 'মিথুন' },
  'कर्क': { hi: 'कर्क', en: 'Cancer', sa: 'कर्कटः', mr: 'कर्क', gu: 'કર્ક', bn: 'কর্কট' },
  'सिंह': { hi: 'सिंह', en: 'Leo', sa: 'सिंहः', mr: 'सिंह', gu: 'સિંહ', bn: 'সিংহ' },
  'कन्या': { hi: 'कन्या', en: 'Virgo', sa: 'कन्या', mr: 'कन्या', gu: 'કન્યા', bn: 'কন্যা' },
  'तुला': { hi: 'तुला', en: 'Libra', sa: 'तुला', mr: 'तूळ', gu: 'તુલા', bn: 'তুলা' },
  'वृश्चिक': { hi: 'वृश्चिक', en: 'Scorpio', sa: 'वृश्चिकः', mr: 'वृश्चिक', gu: 'વૃશ્ચિક', bn: 'বৃশ্চিক' },
  'धनु': { hi: 'धनु', en: 'Sagittarius', sa: 'धनुः', mr: 'धनु', gu: 'ધનુ', bn: 'ধনু' },
  'मकर': { hi: 'मकर', en: 'Capricorn', sa: 'मकरः', mr: 'मकर', gu: 'મકર', bn: 'মকর' },
  'कुम्भ': { hi: 'कुम्भ', en: 'Aquarius', sa: 'कुम्भः', mr: 'कुंभ', gu: 'કુંભ', bn: 'কুম্ভ' },
  'कुंभ': { hi: 'कुंभ', en: 'Aquarius', sa: 'कुम्भः', mr: 'कुंभ', gu: 'કુંભ', bn: 'কুম্ভ' },
  'मीन': { hi: 'मीन', en: 'Pisces', sa: 'मीनः', mr: 'मीन', gu: 'મીન', bn: 'মীন' },
  'लग्न': { hi: 'लग्न', en: 'Ascendant', sa: 'लग्नम्', mr: 'लग्न', gu: 'લગ્ન', bn: 'লগ্ন' },
  'सूर्य': { hi: 'सूर्य', en: 'Sun', sa: 'सूर्यः', mr: 'सूर्य', gu: 'સૂર્ય', bn: 'সূর্য' },
  'चन्द्र': { hi: 'चन्द्र', en: 'Moon', sa: 'चन्द्रः', mr: 'चंद्र', gu: 'ચંદ્ર', bn: 'চন্দ্র' },
  'चंद्र': { hi: 'चंद्र', en: 'Moon', sa: 'चन्द्रः', mr: 'चंद्र', gu: 'ચંદ્ર', bn: 'চন্দ্র' },
  'चंद्रमा': { hi: 'चंद्रमा', en: 'Moon', sa: 'चन्द्रः', mr: 'चंद्र', gu: 'ચંદ્ર', bn: 'চন্দ্র' },
  'मंगल': { hi: 'मंगल', en: 'Mars', sa: 'मङ्गलः', mr: 'मंगळ', gu: 'મંગળ', bn: 'মঙ্গল' },
  'बुध': { hi: 'बुध', en: 'Mercury', sa: 'बुधः', mr: 'बुध', gu: 'બુધ', bn: 'বুধ' },
  'गुरु': { hi: 'गुरु', en: 'Jupiter', sa: 'गुरुः', mr: 'गुरू', gu: 'ગુરુ', bn: 'বৃহস্পতি' },
  'बृहस्पति': { hi: 'बृहस्पति', en: 'Jupiter', sa: 'बृहस्पतिः', mr: 'गुरू', gu: 'ગુરુ', bn: 'বৃহস্পতি' },
  'शुक्र': { hi: 'शुक्र', en: 'Venus', sa: 'शुक्रः', mr: 'शुक्र', gu: 'શુક્ર', bn: 'শুক্র' },
  'शनि': { hi: 'शनि', en: 'Saturn', sa: 'शनिः', mr: 'शनी', gu: 'શનિ', bn: 'শনি' },
  'राहु': { hi: 'राहु', en: 'Rahu', sa: 'राहुः', mr: 'राहू', gu: 'રાહુ', bn: 'রাহু' },
  'केतु': { hi: 'केतु', en: 'Ketu', sa: 'केतुः', mr: 'केतू', gu: 'કેતુ', bn: 'কেতু' },
  'ऋषिकेश, उत्तराखंड': { hi: 'ऋषिकेश, उत्तराखंड', en: 'Rishikesh, Uttarakhand', sa: 'हृषीकेशः, उत्तराखण्डः', mr: 'ऋषिकेश, उत्तराखंड', gu: 'ઋષિકેશ, ઉત્તરાખંડ', bn: 'হৃষীকেশ, উত্তরাখণ্ড' },
  'हरिद्वार, उत्तराखंड': { hi: 'हरिद्वार, उत्तराखंड', en: 'Haridwar, Uttarakhand', sa: 'हरिद्वारम्', mr: 'हरिद्वार, उत्तराखंड', gu: 'હરિદ્વાર, ઉત્તરાખંડ', bn: 'হরিদ্বার, উত্তরাখণ্ড' },
  'वाराणसी, उत्तर प्रदेश': { hi: 'वाराणसी, उत्तर प्रदेश', en: 'Varanasi, Uttar Pradesh', sa: 'वाराणसी', mr: 'वाराणसी, उत्तर प्रदेश', gu: 'વારાણસી, ઉત્તર પ્રદેશ', bn: 'বারাণসী, উত্তর প্রদেশ' },
  'उज्जैन, मध्य प्रदेश': { hi: 'उज्जैन, मध्य प्रदेश', en: 'Ujjain, Madhya Pradesh', sa: 'उज्जयिनी', mr: 'उज्जैन, मध्य प्रदेश', gu: 'ઉજ્જૈન, મધ્ય પ્રદેશ', bn: 'উজ্জয়িনী, মধ্যপ্রদেশ' },
  'अयोध्या, उत्तर प्रदेश': { hi: 'अयोध्या, उत्तर प्रदेश', en: 'Ayodhya, Uttar Pradesh', sa: 'अयोध्या', mr: 'अयोध्या, उत्तर प्रदेश', gu: 'અયોધ્યા, ઉત્તર પ્રદેશ', bn: 'অযোধ্যা, উত্তর প্রদেশ' },
  'दिल्ली': { hi: 'दिल्ली', en: 'New Delhi', sa: 'इन्द्रप्रस्थम्', mr: 'दिल्ली', gu: 'દિલ્હી', bn: 'নতুন দিল্লি' },
  'मुंबई, महाराष्ट्र': { hi: 'मुंबई, महाराष्ट्र', en: 'Mumbai, Maharashtra', sa: 'मुम्बई', mr: 'मुंबई, महाराष्ट्र', gu: 'મુંબઈ, મહારાષ્ટ્ર', bn: 'মুম্বাই, মহারাষ্ট্র' },
  'जयपुर, राजस्थान': { hi: 'जयपुर, राजस्थान', en: 'Jaipur, Rajasthan', sa: 'जयपुरम्', mr: 'जयपूर, राजस्थान', gu: 'જયપુર, રાજસ્થાન', bn: 'জয়পুর, রাজস্থান' },
  'उच्च': { hi: 'उच्च', en: 'Exalted', sa: 'उच्चः', mr: 'उच्च', gu: 'ઉચ્ચ', bn: 'উচ্চ' },
  'नीच': { hi: 'नीच', en: 'Debilitated', sa: 'नीचः', mr: 'नीच', gu: 'નીચ', bn: 'নীচ' },
  'स्वक्षेत्र': { hi: 'स्वक्षेत्र', en: 'Own Sign', sa: 'स्वक्षेत्रम्', mr: 'स्वराशी', gu: 'સ્વગૃહી', bn: 'স্বক্ষেত্র' },
  'सम': { hi: 'सम', en: 'Neutral', sa: 'समः', mr: 'सम', gu: 'સમ', bn: 'সম' }
};

export function trTerm(term: string, lang: LanguageCode): string {
  if (!term) return '';
  const clean = term.replace(/\s*\([^)]*\)/g, '').trim();
  const symbolMatch = clean.match(/([\^*]+)$/);
  const symbolSuffix = symbolMatch ? symbolMatch[1] : '';
  const baseTerm = symbolSuffix ? clean.slice(0, -symbolSuffix.length).trim() : clean;

  if (TERM_MAP[baseTerm] && TERM_MAP[baseTerm][lang]) {
    return `${TERM_MAP[baseTerm][lang]}${symbolSuffix}`;
  }
  if (TERM_MAP[term] && TERM_MAP[term][lang]) {
    return `${TERM_MAP[term][lang]}${symbolSuffix}`;
  }
  if (lang !== 'hi') {
    return translateTextContent(clean, lang);
  }
  return clean;
}

export function t(key: string, lang: LanguageCode): string {
  const dict = DICTIONARY[lang] || DICTIONARY.hi;
  return dict[key] || DICTIONARY.hi[key] || key;
}

/**
 * Comprehensive Phrase & Vocabulary Translation Dictionary for 100% App-Wide Language Uniformity.
 * Guarantees that when a language is selected, zero mixed Hindi remains on any screen.
 */
const GLOBAL_PHRASE_MAP: Array<[string, { en: string; sa: string; mr: string; gu: string; bn: string }]> = [
  // Multi-word Phrases & Sentences (Sorted longest first at runtime)
  [
    'पंचांग विवरण (तिथि से सौर प्रविष्टे तक क्रमवार)',
    {
      en: 'Panchang Details (Sequential from Tithi to Solar Day)',
      sa: 'पञ्चाङ्गविवरणम् (तिथितः सौरप्रविष्टे पर्यन्तम्)',
      mr: 'पंचांग तपशील (तिथीपासून सौर प्रविष्टेपर्यंत क्रमवार)',
      gu: 'પંચાંગ વિગત (તિથિથી સૌર પ્રવિષ્ટે સુધી ક્રમવાર)',
      bn: 'পঞ্জিকা বিবরণ (তিথি থেকে সৌর প্রবিষ্টে পর্যন্ত ক্রমানুসারে)'
    }
  ],
  [
    'सूर्योदय, चंद्रोदय, लग्न एवं नक्षत्र विवरण',
    {
      en: 'Sunrise, Moonrise, Ascendant & Nakshatra Details',
      sa: 'सूर्योदय-चन्द्रोदय-लग्न-नक्षत्रविवरणम्',
      mr: 'सूर्योदय, चंद्रोदय, लग्न आणि नक्षत्र तपशील',
      gu: 'સૂર્યોદય, ચંદ્રોદય, લગ્ન અને નક્ષત્ર વિગત',
      bn: 'সূর্যোদয়, চন্দ্রোদয়, লগ্ন এবং নক্ষত্র বিবরণ'
    }
  ],
  [
    '1. अपना स्थान टाइप करें (स्वचालित खोज)',
    {
      en: '1. Type Your Location (Auto Search)',
      sa: '१. स्वस्थानं लिखतु (स्वचालितम् अन्वेषणम्)',
      mr: '१. तुमचे स्थान टाइप करा (स्वयंचलित शोध)',
      gu: '૧. તમારું સ્થળ ટાઇપ કરો (સ્વચાલित શોધ)',
      bn: '১. আপনার স্থান টাইপ করুন (স্বয়ংক্রিয় অনুসন্ধান)'
    }
  ],
  [
    'शहर का नाम लिखें (जैसे: ऋषिकेश, काशी, दिल्ली)...',
    {
      en: 'Type city name (e.g., Rishikesh, Kashi, Delhi)...',
      sa: 'नगरनाम लिखतु (यथा हृषीकेशः, काशी, दिल्ली)...',
      mr: 'शहराचे नाव लिहा (उदा. ऋषिकेश, काशी, दिल्ली)...',
      gu: 'શહેરનું નામ લખો (દા.ત. ઋષિકેશ, કાશી, દિલ્હી)...',
      bn: 'শহরের নাম লিখুন (যেমন: হৃষীকেশ, কাশী, দিল্লি)...'
    }
  ],
  [
    'स्थान टाइप करें (जैसे: ऋषिकेश, दिल्ली)...',
    {
      en: 'Type location (e.g., Rishikesh, Delhi)...',
      sa: 'स्थानं लिखतु (यथा हृषीकेशः, दिल्ली)...',
      mr: 'स्थान टाइप करा (उदा. ऋषिकेश, दिल्ली)...',
      gu: 'સ્થળ ટાઇપ કરો (દા.ત. ઋષિકેશ, દિલ્હી)...',
      bn: 'স্থান টাইপ করুন (যেমন: হৃষীকেশ, দিল্লি)...'
    }
  ],
  [
    'जन्म स्थान टाइप करें (जैसे: ऋषिकेश, दिल्ली)...',
    {
      en: 'Type birth place (e.g., Rishikesh, Delhi)...',
      sa: 'जन्मस्थानं लिखतु (यथा हृषीकेशः, दिल्ली)...',
      mr: 'जन्म ठिकाण टाइप करा (उदा. ऋषिकेश, दिल्ली)...',
      gu: 'જન્મ સ્થળ ટાઇપ કરો (દા.ત. ઋષિકેશ, દિલ્હી)...',
      bn: 'জন্মস্থান টাইপ করুন (যেমন: হৃষীকেশ, দিল্লি)...'
    }
  ],
  [
    'प्रमुख ज्योतिष सेवाएं',
    {
      en: 'Core Astrology Services',
      sa: 'प्रमुखज्योतिषसेवाः',
      mr: 'प्रमुख ज्योतिष सेवा',
      gu: 'મુખ્ય જ્યોતિષ સેવાઓ',
      bn: 'প্রধান জ্যোতিষ পরিষেবা'
    }
  ],
  [
    'अनुभवी ज्योतिषाचार्यों से परामर्श',
    {
      en: 'Consult Experienced Vedic Astrologers',
      sa: 'विद्वद्भिः ज्योतिषाचार्यैः परामर्शः',
      mr: 'अनुभवी ज्योतिषाचार्यांशी सल्लामसलत',
      gu: 'અનુભવી જ્યોતિષાચાર્યો સાથે પરામર્શ',
      bn: 'অভিজ্ঞ জ্যোতিষাচার্যদের সাথে পরামর্শ'
    }
  ],
  [
    'संपूर्ण विवरण एवं QR देखें',
    {
      en: 'View Full Profile & Payment QR',
      sa: 'सम्पूर्णविवरणं QR च पश्यतु',
      mr: 'संपूर्ण माहिती आणि QR पहा',
      gu: 'સંપૂર્ણ વિગત અને QR જુઓ',
      bn: 'সম্পূর্ণ বিবরণ ও QR দেখুন'
    }
  ],
  [
    'सभी पंडित जी देखें',
    {
      en: 'View All Astrologers',
      sa: 'सर्वान् आचार्यान् पश्यतु',
      mr: 'सर्व पंडितजी पहा',
      gu: 'બધા પંડિતજી જુઓ',
      bn: 'সকল পণ্ডিতজি দেখুন'
    }
  ],
  [
    'लग्न, होरा, नवमांश व दशा',
    {
      en: 'Lagna, Hora, Navamsha & Dasha',
      sa: 'लग्नं, होरा, नवांशः दशा च',
      mr: 'लग्न, होरा, नवांश आणि दशा',
      gu: 'લગ્न, હોરા, નવાંશ અને દશા',
      bn: 'লগ্ন, হোরা, নবাংশ ও দশা'
    }
  ],
  [
    'अष्टकूट 36 गुण मिलान',
    {
      en: 'Ashtakoot 36 Guna Matching',
      sa: 'अष्टकूट ३६ गुणमेलनम्',
      mr: 'अष्टकूट ३६ गुण मिलन',
      gu: 'અષ્ટકૂટ ૩૬ ગુણ મિલન',
      bn: 'অষ্টকূট ৩৬ গুণ মিলন'
    }
  ],
  [
    'दैनिक, मासिक व वार्षिक',
    {
      en: 'Daily, Monthly & Yearly',
      sa: 'दैनिकं, मासिकं वार्षिकं च',
      mr: 'दैनिक, मासिक आणि वार्षिक',
      gu: 'દૈનિક, માસિક અને વાર્ષિક',
      bn: 'দৈনিক, মাসিক ও বার্ষিক'
    }
  ],
  [
    'नवग्रह वर्तमान राशि स्थिति',
    {
      en: 'Current Navagraha Planetary Positions',
      sa: 'नवग्रहाणां वर्तमानराशिस्थितिः',
      mr: 'नवग्रहांची वर्तमान राशी स्थिती',
      gu: 'નવગ્રહ વર્તમાન રાશિ સ્થિતિ',
      bn: 'নবগ্রহের বর্তমান রাশি অবস্থান'
    }
  ],
  [
    'चौघड़िया व मुहूर्त',
    {
      en: 'Choghadiya & Muhurat',
      sa: 'चौघडिया शुभमुहूर्तम् च',
      mr: 'चौघडिया आणि मुहूर्त',
      gu: 'ચોઘડિયા અને મુહૂર્ત',
      bn: 'চোঘড়িয়া ও মুহূর্ত'
    }
  ],
  [
    'रत्न, मूलांक व साढ़ेसाती',
    {
      en: 'Gemstones, Numerology & Sade Sati',
      sa: 'रत्नम्, अङ्कज्योतिषं साढेसाती च',
      mr: 'रत्न, मूलांक आणि साडेसाती',
      gu: 'રત્ન, મૂળાંક અને સાડાસાતી',
      bn: 'রত্ন, মূলাঙ্ক ও সাড়েসাতি'
    }
  ],
  [
    '108 जप माला व सिद्ध मंत्र',
    {
      en: '108 Japa Mala & Vedic Mantras',
      sa: '१०८ जपमाला सिद्धमन्त्राः च',
      mr: '१०८ जपमाळ आणि सिद्ध मंत्र',
      gu: '૧૦૮ જપ માળા અને સિદ્ધ મંત્ર',
      bn: '১০৮ জপ মালা ও সিদ্ধ মন্ত্র'
    }
  ],
  [
    'परामर्श एवं दक्षिणा QR',
    {
      en: 'Consultation & Dakshina QR',
      sa: 'परामर्शः दक्षिणा QR च',
      mr: 'सल्ला आणि दक्षिणा QR',
      gu: 'પરામર્શ અને દક્ષિણા QR',
      bn: 'পরামর্শ ও দক্ষিণা QR'
    }
  ],
  [
    'सभी लेख देखें',
    {
      en: 'View All Articles',
      sa: 'सर्वान् लेखान् पश्यतु',
      mr: 'सर्व लेख पहा',
      gu: 'બધા લેખો જુઓ',
      bn: 'সকল প্রবন্ধ দেখুন'
    }
  ],
  [
    'ज्योतिष ज्ञान एवं ब्लॉग पोस्ट',
    {
      en: 'Vedic Astrology Knowledge & Blog Posts',
      sa: 'ज्योतिषज्ञानं लेखाः च',
      mr: 'ज्योतिष ज्ञान आणि ब्लॉग पोस्ट',
      gu: 'જ્યોતિષ જ્ઞાન અને બ્લોગ પોસ્ટ',
      bn: 'জ্যোতিষ জ্ঞান ও ব্লগ পোস্ট'
    }
  ],
  [
    'विस्तार से पूरा लेख पढ़ें',
    {
      en: 'Read Full Article in Detail',
      sa: 'विस्तरेण सम्पूर्णं लेखं पठतु',
      mr: 'सविस्तर पूर्ण लेख वाचा',
      gu: 'વિગતવાર સંપૂર્ણ લેખ વાંચો',
      bn: 'বিস্তারিত সম্পূর্ণ প্রবন্ধ পড়ুন'
    }
  ],
  [
    'सभी 12 राशियां देखें',
    {
      en: 'View All 12 Zodiac Signs',
      sa: 'द्वादशराशीः पश्यतु',
      mr: 'सर्व १२ राशी पहा',
      gu: 'બધી ૧૨ રાશિઓ જુઓ',
      bn: 'সকল ১২টি রাশি দেখুন'
    }
  ],
  [
    'और देखें',
    {
      en: 'See More',
      sa: 'अधिकं पश्यतु',
      mr: 'आणखी पहा',
      gu: 'વધુ જુઓ',
      bn: 'আরও দেখুন'
    }
  ],
  [
    'व्यक्तिगत ज्योतिष डैशबोर्ड, सहेजी गई कुंडलियां एवं सेटिंग्स',
    {
      en: 'Personal Astrology Dashboard, Saved Kundlis & Settings',
      sa: 'व्यक्तिगतज्योतिषपटलम्, रक्षितकुण्डल्यः व्यवस्थाः च',
      mr: 'वैयक्तिक ज्योतिष डॅशबोर्ड, जतन केलेल्या कुंडल्या आणि सेटिंग्ज',
      gu: 'વ્યક્તિગત જ્યોતિષ ડેશબોર્ડ, સાચવેલી કુંડળીઓ અને સેટિંગ્સ',
      bn: 'ব্যক্তিগত জ্যোতিষ ড্যাশবোর্ড, সংরক্ষিত কুণ্ডলী ও সেটিংস'
    }
  ],
  [
    'सहेजी गई जन्म कुंडलियां',
    {
      en: 'Saved Birth Kundlis',
      sa: 'रक्षिताः जन्मकुण्डल्यः',
      mr: 'जतन केलेल्या जन्मकुंडल्या',
      gu: 'સાચવેલી જન્મ કુંડળીઓ',
      bn: 'সংরক্ষিত জন্ম কুণ্ডলী'
    }
  ],
  [
    'सहेजी गई कुंडलियां',
    {
      en: 'Saved Kundlis',
      sa: 'रक्षिताः कुण्डल्यः',
      mr: 'जतन केलेल्या कुंडल्या',
      gu: 'સાચવેલી કુંડળીઓ',
      bn: 'সংরক্ষিত কুণ্ডলী'
    }
  ],
  [
    '+ नई कुंडली बनाएं',
    {
      en: '+ Create New Kundli',
      sa: '+ नूतनां कुण्डलीं रचयतु',
      mr: '+ नवीन कुंडली तयार करा',
      gu: '+ નવી કુંડળી બનાવો',
      bn: '+ নতুন কুণ্ডলী তৈরি করুন'
    }
  ],
  [
    'अभी कोई जन्म कुंडली सहेजी नहीं गई है।',
    {
      en: 'No birth Kundli has been saved yet.',
      sa: 'अधुना कापि जन्मकुण्डली न रक्षिता।',
      mr: 'अद्याप कोणतीही जन्मकुंडली जतन केलेली नाही.',
      gu: 'હજુ સુધી કોઈ જન્મ કુંડળી સાચવવામાં આવી નથી.',
      bn: 'এখনও কোনো জন্ম কুণ্ডলী সংরক্ষণ করা হয়নি।'
    }
  ],
  [
    'कुंडली पेज पर जाकर अपनी जन्म तिथि, समय और स्थान से कुंडली बनाएं और सुरक्षित करें।',
    {
      en: 'Go to the Kundli page to generate and save your chart using birth date, time, and place.',
      sa: 'कुण्डलीपृष्ठे गत्वा जन्मतिथि-समय-स्थानैः कुण्डलीं रचयित्वा रक्षतु।',
      mr: 'कुंडली पेजवर जाऊन तुमची जन्मतारीख, वेळ आणि ठिकाणावरून कुंडली तयार करा आणि जतन करा.',
      gu: 'કુંડળી પેજ પર જઈને તમારી જન્મ તારીખ, સમય અને સ્થળથી કુંડળી બનાવો અને સાચવો.',
      bn: 'কুণ্ডলী পৃষ্ঠায় গিয়ে আপনার জন্ম তারিখ, সময় এবং স্থান দিয়ে কুণ্ডলী তৈরি ও সংরক্ষণ করুন।'
    }
  ],
  [
    'ऐप प्राथमिकताएं एवं सेटिंग्स',
    {
      en: 'App Preferences & Settings',
      sa: 'अनुप्रयोगप्राथमिकताः व्यवस्थाः च',
      mr: 'ॲप प्राधान्ये आणि सेटिंग्ज',
      gu: 'એપ પસંદગીઓ અને સેટિંગ્સ',
      bn: 'অ্যাপ পছন্দ ও সেটিংস'
    }
  ],
  [
    'थीम मोड (डार्क / लाइट)',
    {
      en: 'Theme Mode (Dark / Light)',
      sa: 'वर्णपद्धतिः (तमः / प्रकाशः)',
      mr: 'थीम मोड (डार्क / लाइट)',
      gu: 'થીમ મોડ (ડાર્ક / લાઇટ)',
      bn: 'থিম মোড (ডার্ক / লাইট)'
    }
  ],
  [
    'डार्क मोड सक्रिय',
    {
      en: 'Dark Mode Active',
      sa: 'तमोमोडः सक्रियः',
      mr: 'डार्क मोड सक्रिय',
      gu: 'ડાર્ક મોડ સક્રિય',
      bn: 'ডার্ক মোড সক্রিয়'
    }
  ],
  [
    'लाइट मोड सक्रिय',
    {
      en: 'Light Mode Active',
      sa: 'प्रकाशमोडः सक्रियः',
      mr: 'लाइट मोड सक्रिय',
      gu: 'લાઇટ મોડ સક્રિય',
      bn: 'লাইট মোড সক্রিয়'
    }
  ],
  [
    'लाइट मोड करें',
    {
      en: 'Switch to Light Mode',
      sa: 'प्रकाशमोडं करोतु',
      mr: 'लाइट मोड करा',
      gu: 'લાઇટ મોડ કરો',
      bn: 'লাইট মোড করুন'
    }
  ],
  [
    'डार्क मोड करें',
    {
      en: 'Switch to Dark Mode',
      sa: 'तमोमोडं करोतु',
      mr: 'डार्क मोड करा',
      gu: 'ડાર્ક મોડ કરો',
      bn: 'ডার্ক মোড করুন'
    }
  ],
  [
    'ऐप की भाषा',
    {
      en: 'App Language',
      sa: 'अनुप्रयोगभाषा',
      mr: 'ॲपची भाषा',
      gu: 'એપની ભાષા',
      bn: 'অ্যাপের ভাষা'
    }
  ],
  [
    'अपनी पसंदीदा भाषा चुनें',
    {
      en: 'Choose your preferred language',
      sa: 'स्वप्रियां भाषां चिनोतु',
      mr: 'तुमची पसंतीची भाषा निवडा',
      gu: 'તમારી પસંદગીની ભાષા પસંદ કરો',
      bn: 'আপনার পছন্দের ভাষা নির্বাচন করুন'
    }
  ],
  [
    'दैनिक पंचांग',
    {
      en: 'Daily Panchang',
      sa: 'दैनिकपञ्चाङ्गम्',
      mr: 'दैनिक पंचांग',
      gu: 'દૈનિક પંચાંગ',
      bn: 'দৈনিক পঞ্জিকা'
    }
  ],
  [
    'कुंडली मिलान',
    {
      en: 'Kundli Matching',
      sa: 'कुण्डलीमेलनम्',
      mr: 'कुंडली मिलन',
      gu: 'કુંડળી મિલન',
      bn: 'কুণ্ডলী মিলন'
    }
  ],
  [
    'एन्क्रिप्टेड बैकअप एवं ऑफ़लाइन सिंक',
    {
      en: 'Encrypted Backup & Offline Sync',
      sa: 'गूढरक्षितसञ्चयः ऑफलाइनसमन्वयनं च',
      mr: 'एन्क्रिप्टेड बॅकअप आणि ऑफलाइन सिंक',
      gu: 'એન્ક્રિપ્ટેડ બેકઅપ અને ઑફલાઇન સિંક',
      bn: 'এনক্রিপ্টেড ব্যাকআপ ও অফলাইন সিঙ্ক'
    }
  ],
  [
    'AES-256 स्थानीय सुरक्षा',
    {
      en: 'AES-256 Local Security',
      sa: 'AES-256 स्थानीयसुरक्षा',
      mr: 'AES-256 स्थानिक सुरक्षा',
      gu: 'AES-256 સ્થાનિક સુરક્ષા',
      bn: 'AES-256 স্থানীয় নিরাপত্তা'
    }
  ],
  [
    'आपकी सभी सहेजी गई कुंडलियां और पंचांग सेटिंग्स आपके डिवाइस पर सुरक्षित रूप से रहती हैं और बिना इंटरनेट के भी काम करती हैं।',
    {
      en: 'All your saved Kundlis and Panchang settings stay encrypted on your device and work offline without internet.',
      sa: 'भवतः सर्वाः रक्षिताः कुण्डल्यः पञ्चाङ्गव्यवस्थाः च यन्त्रे सुरक्षिताः सन्ति अन्तर्जालं विनापि कार्यं कुर्वन्ति।',
      mr: 'तुमच्या सर्व जतन केलेल्या कुंडल्या आणि पंचांग सेटिंग्ज तुमच्या डिव्हाइसवर सुरक्षित राहतात आणि इंटरनेटशिवायही काम करतात.',
      gu: 'તમારી બધી સાચવેલી કુંડળીઓ અને પંચાંગ સેટિંગ્સ તમારા ઉપકરણ પર સુરક્ષિત રહે છે અને ઇન્ટરનેટ વિના પણ કામ કરે છે.',
      bn: 'আপনার সমস্ত সংরক্ষিত কুণ্ডলী এবং পঞ্জিকা সেটিংস আপনার ডিভাইসে সুরক্ষিত থাকে এবং ইন্টারনেট ছাড়াও কাজ করে।'
    }
  ],
  [
    'बैकअप डाउनलोड',
    {
      en: 'Download Backup',
      sa: 'सञ्चयं अवतारयतु',
      mr: 'बॅकअप डाउनलोड',
      gu: 'બેકઅપ ડાઉનલોડ',
      bn: 'ব্যাকআপ ডাউনলোড'
    }
  ],
  [
    'डेटा सिंक करें',
    {
      en: 'Sync Data',
      sa: 'दत्तांशं समन्वयतु',
      mr: 'डेटा सिंक करा',
      gu: 'ડેટા સિંક કરો',
      bn: 'ডেটা সিঙ্ক করুন'
    }
  ],
  [
    'डेटा सिंक पूर्ण!',
    {
      en: 'Data Synced!',
      sa: 'दत्तांशसमन्वयनं पूर्णम्!',
      mr: 'डेटा सिंक पूर्ण!',
      gu: 'ડેટા સિંક પૂર્ણ!',
      bn: 'ডেটা সিঙ্ক সম্পন্ন!'
    }
  ],
  [
    'डेटा गोपनीयता',
    {
      en: 'Data Privacy',
      sa: 'दत्तांशगोपनीयता',
      mr: 'डेटा गोपनीयता',
      gu: 'ડેટા ગોપનીયતા',
      bn: 'ডেটা গোপনীয়তা'
    }
  ],
  [
    '100% सुरक्षित व एन्क्रिप्टेड',
    {
      en: '100% Secure & Encrypted',
      sa: '१००% सुरक्षितं गूढरक्षितं च',
      mr: '१००% सुरक्षित आणि एन्क्रिप्टेड',
      gu: '૧૦૦% સુરક્ષિત અને એન્ક્રિપ્ટેડ',
      bn: '১০০% সুরক্ষিত ও এনক্রিপ্টেড'
    }
  ],
  [
    'पंचांग स्थान',
    {
      en: 'Panchang Location',
      sa: 'पञ्चाङ्गस्थानम्',
      mr: 'पंचांग स्थान',
      gu: 'પંચાંગ સ્થળ',
      bn: 'পঞ্জিকা স্থান'
    }
  ],
  [
    'मुख्य मेनू',
    {
      en: 'Main Menu',
      sa: 'मुख्यसूची',
      mr: 'मुख्य मेनू',
      gu: 'મુખ્ય મેનુ',
      bn: 'প্রধান মেনু'
    }
  ],
  [
    'वैदिक पंचांग एवं ज्योतिष',
    {
      en: 'Vedic Panchang & Astrology',
      sa: 'वैदिकपञ्चाङ्गं ज्योतिषं च',
      mr: 'वैदिक पंचांग आणि ज्योतिष',
      gu: 'વૈદિક પંચાંગ અને જ્યોતિષ',
      bn: 'বৈদিক পঞ্জিকা ও জ্যোতিষ'
    }
  ],
  [
    'ज्योतिष सेवाएं एवं अनुभाग',
    {
      en: 'Astrology Services & Sections',
      sa: 'ज्योतिषसेवाः विभागाः च',
      mr: 'ज्योतिष सेवा आणि विभाग',
      gu: 'જ્યોતિષ સેवाઓ અને વિભાગો',
      bn: 'জ্যোতিষ পরিষেবা ও বিভাগসমূহ'
    }
  ],
  [
    'थीम बदलें',
    {
      en: 'Toggle Theme',
      sa: 'वर्णपद्धतिं परिवर्तयतु',
      mr: 'थीम बदला',
      gu: 'થીમ બદલો',
      bn: 'থিম পরিবর্তন করুন'
    }
  ],
  [
    'नेटवर्क मोड',
    {
      en: 'Network Mode',
      sa: 'जालपद्धतिः',
      mr: 'नेटवर्क मोड',
      gu: 'નેટવર્ક મોડ',
      bn: 'নেটওয়ার্ক মোড'
    }
  ],
  [
    'ऋषिकेश पंचांग • वैदिक ज्योतिष एवं धर्म',
    {
      en: 'Rishikesh Panchang • Vedic Astrology & Dharma',
      sa: 'हृषीकेशपञ्चाङ्गम् • वैदिकज्योतिषं धर्मश्च',
      mr: 'ऋषिकेश पंचांग • वैदिक ज्योतिष आणि धर्म',
      gu: 'ઋષિકેશ પંચાંગ • વૈદિક જ્યોતિષ અને ધર્મ',
      bn: 'হৃষীকেশ পঞ্জিকা • বৈদিক জ্যোতিষ ও ধর্ম'
    }
  ],
  [
    'कुंडली PDF डाउनलोड',
    {
      en: 'Download Kundli PDF',
      sa: 'कुण्डली PDF अवतारयतु',
      mr: 'कुंडली PDF डाउनलोड',
      gu: 'કુંડળી PDF ડાઉનલોડ',
      bn: 'কুণ্ডলী PDF ডাউনলোড'
    }
  ],
  [
    'PDF बन रहा है...',
    {
      en: 'Generating PDF...',
      sa: 'PDF निर्मीयते...',
      mr: 'PDF तयार होत आहे...',
      gu: 'PDF બની રહ્યું છે...',
      bn: 'PDF তৈরি হচ্ছে...'
    }
  ],
  [
    'PDF खोलें',
    {
      en: 'Open PDF',
      sa: 'PDF उद्घाटयतु',
      mr: 'PDF उघडा',
      gu: 'PDF ખોલો',
      bn: 'PDF খুলুন'
    }
  ],
  [
    'होरा चक्र',
    {
      en: 'Hora Chart (D2)',
      sa: 'होराचक्रम्',
      mr: 'होरा चक्र',
      gu: 'હોરા ચક્ર',
      bn: 'হোরা চক্র'
    }
  ],
  [
    'दशमांश कुंडली',
    {
      en: 'Dashamsha Chart (D10)',
      sa: 'दशमांशकुण्डली',
      mr: 'दशमांश कुंडली',
      gu: 'દશમાંશ કુંડળી',
      bn: 'দশমাংশ কুণ্ডলী'
    }
  ],
  [
    'अवकहड़ा चक्र',
    {
      en: 'Avakahada Chakra',
      sa: 'अवकहडाचक्रम्',
      mr: 'अवकहडा चक्र',
      gu: 'અવકહડા ચક્ર',
      bn: 'অবকহড়া চক্র'
    }
  ],
  [
    'ग्रह स्पष्ट',
    {
      en: 'Planetary Positions',
      sa: 'ग्रहस्पष्टम्',
      mr: 'ग्रह स्पष्ट',
      gu: 'ગ્રહ સ્પષ્ટ',
      bn: 'গ্রহ স্পষ্ট'
    }
  ],
  [
    'अष्टकूट 36 गुण मिलान एवं दोष निवारण',
    {
      en: 'Ashtakoot 36 Guna Matching & Dosha Remedies',
      sa: 'अष्टकूट ३६ गुणमेलनं दोषनिवारणं च',
      mr: 'अष्टकूट ३६ गुण मिलन आणि दोष निवारण',
      gu: 'અષ્ટકૂટ ૩૬ ગુણ મિલન અને દોષ નિવારણ',
      bn: 'অষ্টকূট ৩৬ গুণ মিলন ও দোষ নিবারণ'
    }
  ],
  [
    'जन्म तिथि व समय द्वारा',
    {
      en: 'By Birth Date & Time',
      sa: 'जन्मतिथि-समयाभ्याम्',
      mr: 'जन्मतारीख आणि वेळेनुसार',
      gu: 'જન્મ તારીખ અને સમય દ્વારા',
      bn: 'জন্ম তারিখ ও সময় দ্বারা'
    }
  ],
  [
    'नक्षत्र व चरण द्वारा',
    {
      en: 'By Nakshatra & Pada',
      sa: 'नक्षत्र-चरणाभ्याम्',
      mr: 'नक्षत्र आणि चरणानुसार',
      gu: 'નક્ષત્ર અને ચરણ દ્વારા',
      bn: 'নক্ষত্র ও চরণ দ্বারা'
    }
  ],
  [
    'वर का विवरण',
    {
      en: 'Groom Details',
      sa: 'वरविवरणम्',
      mr: 'वराचा तपशील',
      gu: 'વરની વિગત',
      bn: 'বরের বিবরণ'
    }
  ],
  [
    'कन्या का विवरण',
    {
      en: 'Bride Details',
      sa: 'कन्याविवरणम्',
      mr: 'वधूचा तपशील',
      gu: 'કન્યાની વિગત',
      bn: 'কনের বিবরণ'
    }
  ],
  [
    'वर का नाम',
    {
      en: 'Groom Name',
      sa: 'वरस्य नाम',
      mr: 'वराचे नाव',
      gu: 'વરનું નામ',
      bn: 'বরের নাম'
    }
  ],
  [
    'कन्या का नाम',
    {
      en: 'Bride Name',
      sa: 'कन्यायाः नाम',
      mr: 'वधूचे नाव',
      gu: 'કન્યાનું નામ',
      bn: 'কনের নাম'
    }
  ],
  [
    'अष्टकूट गुण मिलान करें',
    {
      en: 'Calculate Ashtakoot Guna Matching',
      sa: 'अष्टकूटगुणमेलनं करोतु',
      mr: 'अष्टकूट गुण मिलन करा',
      gu: 'અષ્ટકૂટ ગુણ મિલન કરો',
      bn: 'অষ্টকূট গুণ মিলন করুন'
    }
  ],
  [
    'प्राप्त गुण',
    {
      en: 'Matching Score',
      sa: 'प्राप्तगुणाः',
      mr: 'प्राप्त गुण',
      gu: 'પ્રાપ્ત ગુણ',
      bn: 'প্রাপ্ত গুণ'
    }
  ],
  [
    'दोष निवारण एवं वैदिक उपाय',
    {
      en: 'Dosha Remedies & Vedic Solutions',
      sa: 'दोषनिवारणं वैदिकोपायाः च',
      mr: 'दोष निवारण आणि वैदिक उपाय',
      gu: 'દોષ નિવારણ અને વૈદિક ઉપાયો',
      bn: 'দোষ নিবারণ ও বৈদিক উপায়'
    }
  ],
  [
    'मेष से मीन तक 12 राशियों का सटीक फलादेश',
    {
      en: 'Accurate Horoscope Predictions for All 12 Zodiac Signs',
      sa: 'मेषादिमीनपर्यन्तं द्वादशराशीनां फलादेशः',
      mr: 'मेष ते मीन पर्यंत १२ राशींचे अचूक भविष्य',
      gu: 'મેષથી મીન સુધી ૧૨ રાશિઓનું સચોટ ફળાદેશ',
      bn: 'মেষ থেকে মীন পর্যন্ত ১২টি রাশির সঠিক ফলাফল'
    }
  ],
  [
    'करियर एवं व्यवसाय',
    {
      en: 'Career & Business',
      sa: 'कर्मक्षेत्रं व्यापारश्च',
      mr: 'करिअर आणि व्यवसाय',
      gu: 'કારકિર્દી અને વ્યવસાય',
      bn: 'ক্যারিয়ার ও ব্যবসা'
    }
  ],
  [
    'आर्थिक स्थिति',
    {
      en: 'Financial Outlook',
      sa: 'आर्थिकस्थितिः',
      mr: 'आर्थिक स्थिती',
      gu: 'આર્થિક સ્થિતિ',
      bn: 'আর্থিক অবস্থা'
    }
  ],
  [
    'प्रेम एवं पारिवारिक जीवन',
    {
      en: 'Love & Family Life',
      sa: 'प्रेम पारिवारिकजीवनं च',
      mr: 'प्रेम आणि कौटुंबिक जीवन',
      gu: 'પ્રેમ અને પારિવારિક જીવન',
      bn: 'প্রেম ও পারিবারিক জীবন'
    }
  ],
  [
    'स्वास्थ्य',
    {
      en: 'Health & Wellness',
      sa: 'स्वास्थ्यम्',
      mr: 'आरोग्य',
      gu: 'સ્વાસ્થ્ય',
      bn: 'স্বাস্থ্য'
    }
  ],
  [
    'ज्योतिषीय उपाय',
    {
      en: 'Vedic Astrological Remedy',
      sa: 'ज्योतिषीयोपायः',
      mr: 'ज्योतिषीय उपाय',
      gu: 'જ્યોતિષીય ઉપાય',
      bn: 'জ্যোতিষীয় উপায়'
    }
  ],
  [
    'नवग्रहों की वर्तमान राशि, स्पष्ट अंश एवं नक्षत्र स्थिति',
    {
      en: 'Current Zodiac Sign, Exact Degrees & Nakshatra of All 9 Planets',
      sa: 'नवग्रहाणां वर्तमानराशिः, अंशाः नक्षत्रस्थितिश्च',
      mr: 'नवग्रहांची वर्तमान राशी, स्पष्ट अंश आणि नक्षत्र स्थिती',
      gu: 'નવગ્રહોની વર્તમાન રાશિ, સ્પષ્ટ અંશ અને નક્ષત્ર સ્થિતિ',
      bn: 'নবগ্রহের বর্তমান রাশি, স্পষ্ট অংশ ও নক্ষত্র অবস্থান'
    }
  ],
  [
    'रत्न परामर्श, अंक ज्योतिष एवं शनि साढ़ेसाती जांच',
    {
      en: 'Gemstone Recommendation, Numerology & Shani Sade Sati Check',
      sa: 'रत्नपरामर्शः, अङ्कज्योतिषं शनिसाढेसातीपरीक्षणं च',
      mr: 'रत्न सल्ला, अंकशास्त्र आणि शनी साडेसाती तपासणी',
      gu: 'રત્ન પરામર્શ, અંક જ્યોતિષ અને શનિ સાડાસાતી તપાસ',
      bn: 'রত্ন পরামর্শ, সংখ্যা জ্যোতিষ ও শনি সাড়েসাতি পরীক্ষা'
    }
  ],
  [
    'रत्न परामर्श',
    {
      en: 'Gemstone Guide',
      sa: 'रत्नपरामर्शः',
      mr: 'रत्न सल्ला',
      gu: 'રત્ન પરામર્શ',
      bn: 'রত্ন পরামর্শ'
    }
  ],
  [
    'शनि साढ़ेसाती',
    {
      en: 'Shani Sade Sati',
      sa: 'शनिसाढेसाती',
      mr: 'शनी साडेसाती',
      gu: 'શનિ સાડાસાતી',
      bn: 'শনি সাড়েসাতি'
    }
  ],
  [
    'सिद्ध वैदिक मंत्र, 108 रुद्राक्ष जप माला एवं पर्व कैलेंडर',
    {
      en: 'Sacred Vedic Mantras, 108 Rudraksha Japa Mala & Festival Calendar',
      sa: 'सिद्धवैदिकमन्त्राः, १०८ रुद्राक्षजपमाला पर्वपञ्चाङ्गं च',
      mr: 'सिद्ध वैदिक मंत्र, १०८ रुद्राक्ष जपमाळ आणि सण कॅलेंडर',
      gu: 'સિદ્ધ વૈદિક મંત્રો, ૧૦૮ રુદ્રાક્ષ જપ માળા અને તહેવાર કેલેન્ડર',
      bn: 'সিদ্ধ বৈদিক মন্ত্র, ১০৮ রুদ্রাক্ষ জপ মালা ও উৎসব ক্যালেন্ডার'
    }
  ],
  [
    'डिजिटल 108 जप माला',
    {
      en: 'Digital 108 Japa Mala',
      sa: 'डिजिटल १०८ जपमाला',
      mr: 'डिजिटल १०८ जपमाळ',
      gu: 'ડિજિટલ ૧૦૮ જપ માળા',
      bn: 'ডিজিটাল ১০৮ জপ মালা'
    }
  ],
  [
    'मंत्र जप करें (+1)',
    {
      en: 'Chant Mantra (+1)',
      sa: 'मन्त्रजपं करोतु (+१)',
      mr: 'मंत्र जप करा (+१)',
      gu: 'મંત્ર જપ કરો (+૧)',
      bn: 'মন্ত্র জপ করুন (+১)'
    }
  ],
  [
    'सिद्ध वैदिक मंत्र संग्रह',
    {
      en: 'Sacred Vedic Mantra Collection',
      sa: 'सिद्धवैदिकमन्त्रसङ्ग्रहः',
      mr: 'सिद्ध वैदिक मंत्र संग्रह',
      gu: 'સિદ્ધ વૈદિક મંત્ર સંગ્રહ',
      bn: 'সিদ্ধ বৈদিক মন্ত্র সংগ্রহ'
    }
  ],
  [
    'प्रमुख सनातन व्रत एवं त्यौहार कैलेंडर',
    {
      en: 'Major Sanatan Vrat & Festival Calendar',
      sa: 'प्रमुखसनातनव्रत-पर्वपञ्चाङ्गम्',
      mr: 'प्रमुख सनातन व्रत आणि सण कॅलेंडर',
      gu: 'મુખ્ય સનાતન વ્રત અને તહેવાર કેલેન્ડર',
      bn: 'প্রধান সনাতন ব্রত ও উৎসব ক্যালেন্ডার'
    }
  ],
  [
    'ज्योतिषाचार्य, काशी हिन्दू विश्वविद्यालय',
    {
      en: 'Astrologer, Banaras Hindu University (BHU)',
      sa: 'ज्योतिषाचार्यः, काशीहिन्दूविश्वविद्यालयः',
      mr: 'ज्योतिषाचार्य, काशी हिंदू विद्यापीठ',
      gu: 'જ્યોતિષાચાર્ય, કાશી હિન્દુ યુનિવર્સિટી',
      bn: 'জ্যোতিষাচার্য, কাশী হিন্দু বিশ্ববিদ্যালয়'
    }
  ],
  [
    'वास्तु एवं धर्मशास्त्र विशेषज्ञ, संपूर्णानंद संस्कृत विश्वविद्यालय',
    {
      en: 'Vastu & Dharmashastra Expert, Sampurnanand Sanskrit University',
      sa: 'वास्तु-धर्मशास्त्रविशेषज्ञः, सम्पूर्णानन्दसंस्कृतविश्वविद्यालयः',
      mr: 'वास्तू व धर्मशास्त्र तज्ज्ञ, संपूर्णानंद संस्कृत विद्यापीठ',
      gu: 'વાસ્તુ અને ધર્મશાસ્ત્ર નિષ્ણાત, સંપૂર્ણાનંદ સંસ્કૃત યુનિવર્સિટી',
      bn: 'বাস্তু ও ধর্মশাস্ত্র বিশেষজ্ঞ, সম্পূর্ণানন্দ সংস্কৃত বিশ্ববিদ্যালয়'
    }
  ],
  [
    'फलित ज्योतिष एवं रुद्राभिषेक आचार्य',
    {
      en: 'Predictive Astrology & Rudrabhishek Acharya',
      sa: 'फलितज्योतिष-रुद्राभिषेकाचार्यः',
      mr: 'फलित ज्योतिष आणि रुद्राभिषेक आचार्य',
      gu: 'ફલિત જ્યોતિષ અને રુદ્રાભિષેક આચાર્ય',
      bn: 'ফলিত জ্যোতিষ ও রুদ্রাভিষেক আচার্য'
    }
  ],
  [
    'काशी हिन्दू विश्वविद्यालय से ज्योतिष शास्त्र में आचार्य। विगत 25 वर्षों से ऋषिकेश एवं काशी से सटीक जन्मकुंडली फलादेश, विवाह मिलान तथा वैदिक अनुष्ठान मार्गदर्शन प्रदान कर रहे हैं।',
    {
      en: 'Acharya in Astrology from Banaras Hindu University. Providing accurate birth chart predictions, marriage matching, and Vedic ritual guidance from Rishikesh and Kashi for the past 25 years.',
      sa: 'काशीहिन्दूविश्वविद्यालयात् ज्योतिषशास्त्रे आचार्यः। विगत २५ वर्षेभ्यः हृषीकेश-काशीतः सटीकजन्मकुण्डलीफलादेशं विवाहमेलनं वैदिकानुष्ठानमार्गदर्शनं च प्रददाति।',
      mr: 'काशी हिंदू विद्यापीठातून ज्योतिषशास्त्रात आचार्य. गेल्या २५ वर्षांपासून ऋषिकेश आणि काशी येथून अचूक जन्मकुंडली फलादेश, विवाह मिलन व वैदिक अनुष्ठान मार्गदर्शन करत आहेत.',
      gu: 'કાશી હિન્દુ યુનિવર્સિટીમાંથી જ્યોતિષ શાસ્ત્રમાં આચાર્ય. છેલ્લા ૨૫ વર્ષથી ઋષિકેશ અને કાશીથી સચોટ જન્મકુંડળી ફળાદેશ, લગ્ન મિલન અને વૈદિક અનુષ્ઠાન માર્ગદર્શન પૂરું પાડે છે.',
      bn: 'কাশী হিন্দু বিশ্ববিদ্যালয় থেকে জ্যোতিষশাস্ত্রে আচার্য। বিগত ২৫ বছর ধরে হৃষীকেশ ও কাশী থেকে সঠিক জন্মকুণ্ডলী ফলাফল, বিবাহ মিলন এবং বৈদিক অনুষ্ঠান নির্দেশনা প্রদান করছেন।'
    }
  ],
  [
    'उत्तराखंड के सुप्रसिद्ध ज्योतिर्विद एवं वास्तु विशेषज्ञ। भवन, कार्यालय एवं औद्योगिक वास्तु दोषों के वैदिक निवारण तथा शुभ मुहूर्त गणना में विशेष दक्षता।',
    {
      en: 'Renowned Astrologer and Vastu Expert of Uttarakhand. Specialized in Vedic remedies for home, office, and industrial Vastu defects and auspicious Muhurat calculation.',
      sa: 'उत्तराखण्डस्य सुप्रसिद्धः ज्योतिर्विद् वास्तुविशेषज्ञश्च। भवन-कार्यालय-वास्तुदोषनिवारणे शुभमुहूर्तगणनायां च विशेषदक्षता।',
      mr: 'उत्तराखंडचे सुप्रसिद्ध ज्योतिषी आणि वास्तू तज्ज्ञ. घर, कार्यालय आणि औद्योगिक वास्तू दोषांचे वैदिक निवारण व शुभ मुहूर्त गणनेत विशेष प्राविण्य.',
      gu: 'ઉત્તરાખંડના સુપ્રસિદ્ધ જ્યોતિષી અને વાસ્તુ નિષ્ણાત. મકાન, કાર્યાલય અને ઔદ્યોગિક વાસ્તુ દોષોના વૈદિક નિવારણ તથા શુભ મુહૂર્ત ગણતરીમાં વિશેષ કુશળતા.',
      bn: 'উত্তরাখণ্ডের সুপ্রসিদ্ধ জ্যোতিষী ও বাস্তু বিশেষজ্ঞ। ভবন, কার্যালয় ও শিল্প বাস্তু দোষের বৈদিক প্রতিকার এবং শুভ মুহূর্ত গণনায় বিশেষ দক্ষতা।'
    }
  ],
  [
    'गंगा तट ऋषिकेश के परंपरागत पुरोहित कुल से। गृह प्रवेश, विवाह संस्कार, मुंडन एवं ग्रह शांति अनुष्ठानों के वरिष्ठ मार्गदर्शक।',
    {
      en: 'From a traditional priest lineage on the banks of Ganga in Rishikesh. Senior guide for Griha Pravesh, marriage ceremonies, Mundan, and planetary peace rituals.',
      sa: 'गङ्गातट-हृषीकेशस्य परम्परागतपुरोहितकुलात्। गृहप्रवेश-विवाहसंस्कार-मुण्डन-ग्रहशान्त्यनुष्ठानानां वरिष्ठमार्गदर्शकः।',
      mr: 'गंगा तट ऋषिकेश येथील पारंपरिक पुरोहित कुळातील. गृहप्रवेश, विवाह संस्कार, मुंडन आणि ग्रहशांती अनुष्ठानांचे वरिष्ठ मार्गदर्शक.',
      gu: 'ગંગા તટ ઋષિકેશના પરંપરાગત પુરોહિત કુળમાંથી. ગૃહ પ્રવેશ, લગ્ન સંસ્કાર, મુંડન અને ગ્રહ શાંતિ અનુષ્ઠાનોના વરિષ્ઠ માર્ગદર્શક.',
      bn: 'গঙ্গাতীর হৃষীকেশের ঐতিহ্যবাহী পুরোহিত বংশোদ্ভূত। গৃহপ্রবেশ, বিবাহ সংস্কার, মুণ্ডন এবং গ্রহশান্তি অনুষ্ঠানের বরিष्ठ পথপ্রদর্শক।'
    }
  ],
  [
    'जन्मकुंडली विश्लेषण',
    {
      en: 'Birth Chart Analysis',
      sa: 'जन्मकुण्डलीविश्लेषणम्',
      mr: 'जन्मकुंडली विश्लेषण',
      gu: 'જન્મકુંડળી વિશ્લેષણ',
      bn: 'জন্মকুণ্ডলী বিশ্লেষণ'
    }
  ],
  [
    'दोष निवारण अनुष्ठान',
    {
      en: 'Dosha Remedy Rituals',
      sa: 'दोषनिवारणानुष्ठानम्',
      mr: 'दोष निवारण अनुष्ठान',
      gu: 'દોષ નિવારણ અનુષ્ઠાન',
      bn: 'দোষ নিবারণ অনুষ্ঠান'
    }
  ],
  [
    'वैदिक कर्मकांड',
    {
      en: 'Vedic Rituals',
      sa: 'वैदिककर्मकाण्डम्',
      mr: 'वैदिक कर्मकांड',
      gu: 'વૈદિક કર્મકાંડ',
      bn: 'বৈদিক কর্মকাণ্ড'
    }
  ],
  [
    'वास्तु शास्त्र',
    {
      en: 'Vastu Shastra',
      sa: 'वास्तुशास्त्रम्',
      mr: 'वास्तुशास्त्र',
      gu: 'વાસ્તુ શાસ્ત્ર',
      bn: 'বাস্তুশাস্ত্র'
    }
  ],
  [
    'प्रश्न कुंडली',
    {
      en: 'Horary Astrology (Prashna)',
      sa: 'प्रश्नकुण्डली',
      mr: 'प्रश्न कुंडली',
      gu: 'પ્રશ્ન કુંડળી',
      bn: 'প্রশ্ন কুণ্ডলী'
    }
  ],
  [
    'शुभ मुहूर्त निर्णय',
    {
      en: 'Auspicious Muhurat Selection',
      sa: 'शुभमुहूर्तनिर्णयः',
      mr: 'शुभ मुहूर्त निर्णय',
      gu: 'શુભ મુહૂર્ત નિર્ણય',
      bn: 'শুভ মুহূর্ত নির্ণয়'
    }
  ],
  [
    'मुहूर्त निर्णय',
    {
      en: 'Muhurat Selection',
      sa: 'मुहूर्तनिर्णयः',
      mr: 'मुहूर्त निर्णय',
      gu: 'મુહૂર્ત નિર્ણય',
      bn: 'মুহূর্ত নির্ণয়'
    }
  ],
  [
    'व्यापार वृद्धि उपाय',
    {
      en: 'Business Growth Remedies',
      sa: 'व्यापारवृद्ध्युपायाः',
      mr: 'व्यापार वृद्धी उपाय',
      gu: 'વ્યાપાર વૃદ્ધિ ઉપાય',
      bn: 'ব্যবসা বৃদ্ধির উপায়'
    }
  ],
  [
    'महामृत्युंजय अनुष्ठान',
    {
      en: 'Mahamrityunjaya Ritual',
      sa: 'महामृत्युञ्जयानुष्ठानम्',
      mr: 'महामृत्युंजय अनुष्ठान',
      gu: 'મહામૃત્યુંજય અનુષ્ઠાન',
      bn: 'মহামৃত্যুঞ্জয় অনুষ্ঠান'
    }
  ],
  [
    'कालसर्प व पितृ दोष',
    {
      en: 'Kaal Sarp & Pitra Dosha',
      sa: 'कालसर्प-पितृदोषः',
      mr: 'कालसर्प व पितृदोष',
      gu: 'કાલસર્પ અને પિતૃ દોષ',
      bn: 'কালসর্প ও পিতৃদোষ'
    }
  ],
  [
    'नामकरण संस्कार',
    {
      en: 'Naming Ceremony (Namkaran)',
      sa: 'नामकरणसंस्कारः',
      mr: 'नामकरण संस्कार',
      gu: 'નામકરણ સંસ્કાર',
      bn: 'নামকরণ সংস্কার'
    }
  ],
  [
    'परामर्श दक्षिणा',
    {
      en: 'Consultation Fee',
      sa: 'परामर्शदक्षिणा',
      mr: 'सल्ला दक्षिणा',
      gu: 'પરામર્શ દક્ષિણા',
      bn: 'পরামর্শ দক্ষিণা'
    }
  ],
  [
    'रसीद भेजें',
    {
      en: 'Send Receipt',
      sa: 'रसीदं प्रेषयतु',
      mr: 'पावती पाठवा',
      gu: 'રસીદ મોકલો',
      bn: 'রসিদ পাঠান'
    }
  ],
  [
    'दूसरी रसीद भेजें',
    {
      en: 'Send Another Receipt',
      sa: 'अन्यत् रसीदं प्रेषयतु',
      mr: 'दुसरी पावती पाठवा',
      gu: 'બીજી રસીદ મોકલો',
      bn: 'আরেকটি রসিদ পাঠান'
    }
  ],
  [
    'पेमेंट एवं रसीद प्रेषण',
    {
      en: 'Payment & Receipt Submission',
      sa: 'भुगतानं रसीदप्रेषणं च',
      mr: 'पेमेंट आणि पावती पाठवणे',
      gu: 'પેમેન્ટ અને રસીદ મોકલવી',
      bn: 'পেমেন্ট ও রসিদ প্রেরণ'
    }
  ],
  [
    'भुगतान की रसीद या स्क्रीनशॉट भेजें',
    {
      en: 'Send Payment Receipt or Screenshot',
      sa: 'भुगतानस्य रसीदं चित्रं वा प्रेषयतु',
      mr: 'पेमेंटची पावती किंवा स्क्रीनशॉट पाठवा',
      gu: 'ચુકવણીની રસીદ અથવા સ્ક્રીનશોટ મોકલો',
      bn: 'পেমেন্টের রসিদ বা স্ক্রিনশট পাঠান'
    }
  ],
  [
    'कॉल करें',
    {
      en: 'Call Now',
      sa: 'दूरभाषं करोतु',
      mr: 'कॉल करा',
      gu: 'કૉલ કરો',
      bn: 'কল করুন'
    }
  ],
  [
    'अपना नाम लिखें',
    {
      en: 'Enter your name',
      sa: 'स्वनाम लिखतु',
      mr: 'तुमचे नाव लिहा',
      gu: 'તમારું નામ લખો',
      bn: 'আপনার নাম লিখুন'
    }
  ],
  [
    'यहां नाम दर्ज करें',
    {
      en: 'Enter name here',
      sa: 'अत्र नाम लिखतु',
      mr: 'येथे नाव प्रविष्ट करा',
      gu: 'અહીં નામ દાખલ કરો',
      bn: 'এখানে নাম লিখুন'
    }
  ],
  [
    'संबंधित ब्लॉग पोस्ट',
    {
      en: 'Related Blog Posts',
      sa: 'सम्बद्धलेखाः',
      mr: 'संबंधित ब्लॉग पोस्ट',
      gu: 'સંબંધિત બ્લોગ પોસ્ટ',
      bn: 'সম্পর্কিত ব্লগ পোস্ট'
    }
  ],
  [
    'इस लेख को शेयर करें',
    {
      en: 'Share This Article',
      sa: 'इमं लेखं प्रसारयतु',
      mr: 'हा लेख शेअर करा',
      gu: 'આ લેખ શેર કરો',
      bn: 'এই নিবন্ধটি শেয়ার করুন'
    }
  ],
  [
    'सहेजी गई कुंडलियां',
    {
      en: 'Saved Kundlis',
      sa: 'रक्षितकुण्डल्यः',
      mr: 'जतन केलेल्या कुंडल्या',
      gu: 'સાચવેલી કુંડળીઓ',
      bn: 'সংরক্ষিত কুণ্ডলী'
    }
  ],
  [
    'कुंडली खोलें',
    {
      en: 'Open Kundli',
      sa: 'कुण्डलीं उद्घाटयतु',
      mr: 'कुंडली उघडा',
      gu: 'કુંડળી ખોલો',
      bn: 'কুণ্ডলী খুলুন'
    }
  ],
  [
    'कुंडली PDF डाउनलोड',
    {
      en: 'Download Kundli PDF',
      sa: 'कुण्डली PDF अवतारयतु',
      mr: 'कुंडली PDF डाउनलोड',
      gu: 'કુંડળી PDF ડાઉનલોડ',
      bn: 'কুণ্ডলী PDF ডাউনলোড'
    }
  ]
];

const WORD_VOCAB_MAP: Array<[string, { en: string; sa: string; mr: string; gu: string; bn: string }]> = [
  ['वैदिक ज्योतिषाचार्य', { en: 'Vedic Astrologer', sa: 'वैदिकज्योतिषाचार्यः', mr: 'वैदिक ज्योतिषाचार्य', gu: 'વૈદિક જ્યોતિષાચાર્ય', bn: 'বৈদিক জ্যোতিষাচার্য' }],
  ['ज्योतिषाचार्य', { en: 'Astrologer', sa: 'ज्योतिषाचार्यः', mr: 'ज्योतिषाचार्य', gu: 'જ્યોતિષાચાર્ય', bn: 'জ্যোতিষাচার্য' }],
  ['ज्योतिर्विद', { en: 'Astrologer', sa: 'ज्योतिर्विद्', mr: 'ज्योतिषी', gu: 'જ્યોતિષી', bn: 'জ্যোতিষী' }],
  ['वास्तु विशेषज्ञ', { en: 'Vastu Expert', sa: 'वास्तुविशेषज्ञः', mr: 'वास्तू तज्ज्ञ', gu: 'વાસ્તુ નિષ્ણાત', bn: 'বাস্তু বিশেষজ্ঞ' }],
  ['विशेषज्ञ', { en: 'Expert', sa: 'विशेषज्ञः', mr: 'तज्ज्ञ', gu: 'નિષ્ણાત', bn: 'বিশেষজ্ঞ' }],
  ['आचार्य', { en: 'Acharya', sa: 'आचार्यः', mr: 'आचार्य', gu: 'આચાર્ય', bn: 'আচার্য' }],
  ['पंडित जी', { en: 'Pandit Ji', sa: 'पण्डितवर्यः', mr: 'पंडितजी', gu: 'પંડિતજી', bn: 'পণ্ডিতজি' }],
  ['पंडित', { en: 'Pandit', sa: 'पण्डितः', mr: 'पंडित', gu: 'પંડિત', bn: 'পণ্ডিত' }],
  ['शास्त्री', { en: 'Shastri', sa: 'शास्त्री', mr: 'शास्त्री', gu: 'શાસ્ત્રી', bn: 'শাস্ত্রী' }],
  ['जोशी', { en: 'Joshi', sa: 'जोशी', mr: 'जोशी', gu: 'જોશી', bn: 'জোশী' }],
  ['त्रिवेदी', { en: 'Trivedi', sa: 'त्रिवेदी', mr: 'त्रिवेदी', gu: 'ત્રિવેદી', bn: 'ত্রিবেদী' }],
  ['राधेश्याम', { en: 'Radheshyam', sa: 'राधेश्यामः', mr: 'राधेश्याम', gu: 'રાધેશ્યામ', bn: 'রাধেশ্যাম' }],
  ['देवकीनंदन', { en: 'Devkinandan', sa: 'देवकीनन्दनः', mr: 'देवकीनंदन', gu: 'દેવકીનંદન', bn: 'দেবকীনন্দন' }],
  ['रामानंद', { en: 'Ramanand', sa: 'रामानन्दः', mr: 'रामानंद', gu: 'રામાનંદ', bn: 'রামানন্দ' }],
  ['पं.', { en: 'Pt.', sa: 'पं.', mr: 'पं.', gu: 'પં.', bn: 'পণ্ডিত' }],
  ['परामर्श', { en: 'Consultation', sa: 'परामर्शः', mr: 'सल्ला', gu: 'પરામર્શ', bn: 'পরামর্শ' }],
  ['दक्षिणा', { en: 'Fee', sa: 'दक्षिणा', mr: 'दक्षिणा', gu: 'દક્ષિણા', bn: 'দক্ষিণা' }],
  ['अनुभव', { en: 'Experience', sa: 'अनुभवः', mr: 'अनुभव', gu: 'અનુભવ', bn: 'অভিজ্ঞতা' }],
  ['पेमेंट', { en: 'Payment', sa: 'भुगतानम्', mr: 'पेमेंट', gu: 'પેમેન્ટ', bn: 'পেমেন্ট' }],
  ['ईमेल', { en: 'Email', sa: 'ईमेल', mr: 'ईमेल', gu: 'ઈમેલ', bn: 'ইমেল' }],
  ['मोबाइल नंबर', { en: 'Mobile Number', sa: 'चलदूरभाषसङ्ख्या', mr: 'मोबाईल नंबर', gu: 'મોબાઇલ નંબર', bn: 'মোবাইল নম্বর' }],
  ['मोबाइल', { en: 'Mobile', sa: 'चलदूरभाषः', mr: 'मोबाईल', gu: 'મોબાઇલ', bn: 'মোবাইল' }],
  ['स्थान', { en: 'Location', sa: 'स्थानम्', mr: 'स्थान', gu: 'સ્થળ', bn: 'স্থান' }],
  ['जन्म तिथि', { en: 'Birth Date', sa: 'जन्मतिथिः', mr: 'जन्म तारीख', gu: 'જન્મ તારીખ', bn: 'জন্ম তারিখ' }],
  ['जन्म समय', { en: 'Birth Time', sa: 'जन्मसमयः', mr: 'जन्म वेळ', gu: 'જન્મ સમય', bn: 'জন্ম সময়' }],
  ['जन्म स्थान', { en: 'Birth Place', sa: 'जन्मस्थानम्', mr: 'जन्म ठिकाण', gu: 'જન્મ સ્થળ', bn: 'জন্মস্থান' }],
  ['प्रमुख महापर्व', { en: 'Major Festival', sa: 'प्रमुखमहापर्व', mr: 'प्रमुख महापर्व', gu: 'મુખ્ય મહાપર્વ', bn: 'প্রধান মহাপর্ব' }],
  ['एकादशी एवं व्रत', { en: 'Ekadashi & Fast', sa: 'एकादशी-व्रतम्', mr: 'एकादशी व व्रत', gu: 'એકાદશી અને વ્રત', bn: 'একাদশী ও ব্রত' }],
  ['शक्ति एवं शिव पर्व', { en: 'Shakti & Shiva Festival', sa: 'शक्ति-शिवपर्व', mr: 'शक्ती व शिव पर्व', gu: 'શક્તિ અને શિવ પર્વ', bn: 'শক্তি ও শিব পর্ব' }],
  ['प्रमुख त्योहार', { en: 'Major Festival', sa: 'प्रमुखपर्व', mr: 'प्रमुख सण', gu: 'મુખ્ય તહેવાર', bn: 'প্রধান উৎসব' }],
  ['एकादशी व्रत', { en: 'Ekadashi Fast', sa: 'एकादशीव्रतम्', mr: 'एकादशी व्रत', gu: 'એકાદશી વ્રત', bn: 'একাদশী ব্রত' }],
  ['प्रदोष एवं शिव पर्व', { en: 'Pradosh & Shiva Festival', sa: 'प्रदोष-शिवपर्व', mr: 'प्रदोष व शिव पर्व', gu: 'પ્રદોષ અને શિવ પર્વ', bn: 'প্রদোষ ও শিব পর্ব' }],
  ['अमावस्या एवं पूर्णिमा', { en: 'Amavasya & Purnima', sa: 'अमावस्या-पूर्णिमा', mr: 'अमावस्या व पौर्णिमा', gu: 'અમાસ અને પૂર્ણિમા', bn: 'অমাবস্যা ও পূর্ণিমা' }],
  ['संक्रांति एवं जयंती', { en: 'Sankranti & Jayanti', sa: 'सङ्क्रान्ति-जयन्ती', mr: 'संक्रांती व जयंती', gu: 'સંક્રાંતિ અને જયંતી', bn: 'সংক্রান্তি ও জয়ন্তী' }],
  ['पर्व', { en: 'Festivals', sa: 'पर्वाणि', mr: 'सण', gu: 'પર્વ', bn: 'উৎসব' }],
  ['व्रत', { en: 'Fast', sa: 'व्रतम्', mr: 'व्रत', gu: 'વ્રત', bn: 'ব্রত' }],
  ['त्योहार', { en: 'Festivals', sa: 'पर्वाणि', mr: 'सण', gu: 'તહેવાર', bn: 'উৎসব' }],
  ['मास', { en: 'Month', sa: 'मासः', mr: 'महिना', gu: 'માસ', bn: 'মাস' }],
  ['तपोवन', { en: 'Tapovan', sa: 'तपोवनम्', mr: 'तपोवन', gu: 'તપોવન', bn: 'তপোবন' }],
  ['लक्ष्मण झूला मार्ग', { en: 'Lakshman Jhula Road', sa: 'लक्ष्मणझूलामार्गः', mr: 'लक्ष्मण झूला मार्ग', gu: 'લક્ષ્મણ ઝૂલા માર્ગ', bn: 'লক্ষ্মণ ঝুলা মার্গ' }],
  ['त्रिवेणी घाट मार्ग', { en: 'Triveni Ghat Road', sa: 'त्रिवेणीघाटमार्गः', mr: 'त्रिवेणी घाट मार्ग', gu: 'ત્રિવેણી ઘાટ માર્ગ', bn: 'ত্রিবেণী ঘাট মার্গ' }],
  ['स्वर्गाश्रम क्षेत्र', { en: 'Swargashram Area', sa: 'स्वर्गाश्रमक्षेत्रम्', mr: 'स्वर्गाश्रम क्षेत्र', gu: 'સ્વર્ગાશ્રમ ક્ષેત્ર', bn: 'স্বর্গাশ্রম ক্ষেত্র' }],
  ['ऋषिकेश', { en: 'Rishikesh', sa: 'हृषीकेशः', mr: 'ऋषिकेश', gu: 'ઋષિકેશ', bn: 'হৃষীকেশ' }],
  ['उत्तराखंड', { en: 'Uttarakhand', sa: 'उत्तराखण्डः', mr: 'उत्तराखंड', gu: 'ઉત્તરાખંડ', bn: 'উত্তরাখণ্ড' }],
  ['माह अमावस्यांत', { en: 'Amanta Month', sa: 'अमान्तमासः', mr: 'अमांत महिना', gu: 'અમાંત માસ', bn: 'অমান্ত মাস' }],
  ['माह पूर्णिमांत', { en: 'Purnimanta Month', sa: 'पूर्णिमान्तमासः', mr: 'पौर्णिमांत महिना', gu: 'પૂર્ણિમાંત માસ', bn: 'পূর্ণিমান্ত মাস' }],
  ['चंद्र राशि', { en: 'Moon Sign', sa: 'चन्द्रराशिः', mr: 'चंद्र राशी', gu: 'ચંદ્ર રાશિ', bn: 'চন্দ্র রাশি' }],
  ['सूर्य राशि', { en: 'Sun Sign', sa: 'सूर्यराशिः', mr: 'सूर्य राशी', gu: 'સૂર્ય રાશિ', bn: 'সূর্য রাশি' }],
  ['सूर्य नक्षत्र', { en: 'Sun Nakshatra', sa: 'सूर्यनक्षत्रम्', mr: 'सूर्य नक्षत्र', gu: 'સૂર્ય નક્ષત્ર', bn: 'সূর্য নক্ষত্র' }],
  ['चंद्र नक्षत्र', { en: 'Moon Nakshatra', sa: 'चन्द्रनक्षत्रम्', mr: 'चंद्र नक्षत्र', gu: 'ચંદ્ર નક્ષત્ર', bn: 'চন্দ্র নক্ষত্র' }],
  ['सौर प्रविष्टे', { en: 'Solar Day', sa: 'सौरप्रविष्टे', mr: 'सौर प्रविष्टे', gu: 'સૌર પ્રવિષ્ટે', bn: 'সৌর প্রবিষ্টে' }],
  ['विक्रम संवत', { en: 'Vikram Samvat', sa: 'विक्रमसंवत्', mr: 'विक्रम संवत', gu: 'વિક્રમ સંવત', bn: 'বিক্রম সংবৎ' }],
  ['संवत्सर', { en: 'Samvatsar', sa: 'संवत्सरः', mr: 'संवत्सर', gu: 'સંવત્સર', bn: 'সংবৎসর' }],
  ['शुक्ल पक्ष', { en: 'Shukla Paksha', sa: 'शुक्लपक्षः', mr: 'शुक्ल पक्ष', gu: 'શુક્લ પક્ષ', bn: 'শুক্ল পক্ষ' }],
  ['कृष्ण पक्ष', { en: 'Krishna Paksha', sa: 'कृष्णपक्षः', mr: 'कृष्ण पक्ष', gu: 'કૃષ્ણ પક્ષ', bn: 'কৃষ্ণ পক্ষ' }],
  ['उत्तरायण', { en: 'Uttarayana', sa: 'उत्तरायणम्', mr: 'उत्तरायण', gu: 'ઉત્તરાયણ', bn: 'উত্তরায়ণ' }],
  ['दक्षिणायन', { en: 'Dakshinayana', sa: 'दक्षिणायनम्', mr: 'दक्षिणायन', gu: 'દક્ષિણાયન', bn: 'দক্ষিণায়ন' }],
  ['वसंत', { en: 'Vasant (Spring)', sa: 'वसन्तः', mr: 'वसंत', gu: 'વસંત', bn: 'বসন্ত' }],
  ['ग्रीष्म', { en: 'Grishma (Summer)', sa: 'ग्रीष्मः', mr: 'ग्रीष्म', gu: 'ગ્રીષ્મ', bn: 'গ্রীষ্ম' }],
  ['वर्षा', { en: 'Varsha (Monsoon)', sa: 'वर्षा', mr: 'वर्षा', gu: 'વર્ષા', bn: 'বর্ষা' }],
  ['शरद', { en: 'Sharad (Autumn)', sa: 'शरद्', mr: 'शरद', gu: 'શरद', bn: 'শরৎ' }],
  ['हेमंत', { en: 'Hemant (Pre-Winter)', sa: 'हेमन्तः', mr: 'हेमंत', gu: 'હેમંત', bn: 'হেমন্ত' }],
  ['शिशिर', { en: 'Shishir (Winter)', sa: 'शिशिरः', mr: 'शिशिर', gu: 'શિશિર', bn: 'শিশির' }],
  ['चैत्र', { en: 'Chaitra', sa: 'चैत्रः', mr: 'चैत्र', gu: 'ચૈત્ર', bn: 'চৈত্র' }],
  ['वैशाख', { en: 'Vaishakha', sa: 'वैशाखः', mr: 'वैशाख', gu: 'વૈશાખ', bn: 'বৈশাখ' }],
  ['ज्येष्ठ', { en: 'Jyeshtha', sa: 'ज्येष्ठः', mr: 'ज्येष्ठ', gu: 'જ્યેષ્ઠ', bn: 'জ্যৈষ্ঠ' }],
  ['आषाढ़', { en: 'Ashadha', sa: 'आषाढः', mr: 'आषाढ', gu: 'અષાઢ', bn: 'আষাঢ়' }],
  ['श्रावण', { en: 'Shravana', sa: 'श्रावणः', mr: 'श्रावण', gu: 'શ્રાવણ', bn: 'শ্রাবণ' }],
  ['भाद्रपद', { en: 'Bhadrapada', sa: 'भाद्रपदः', mr: 'भाद्रपद', gu: 'ભાદ્રપદ', bn: 'ভাদ্র' }],
  ['आश्विन', { en: 'Ashwin', sa: 'आश्विनः', mr: 'आश्विन', gu: 'આશ્વિન', bn: 'আশ্বিন' }],
  ['कार्तिक', { en: 'Kartika', sa: 'कार्तिकः', mr: 'कार्तिक', gu: 'કાર્તિક', bn: 'কার্তিক' }],
  ['मार्गशीर्ष', { en: 'Margashirsha', sa: 'मार्गशीर्षः', mr: 'मार्गशीर्ष', gu: 'માગશર', bn: 'অগ্রহায়ণ' }],
  ['पौष', { en: 'Pausha', sa: 'पौषः', mr: 'पौष', gu: 'પોષ', bn: 'পৌষ' }],
  ['माघ', { en: 'Magha', sa: 'माघः', mr: 'माघ', gu: 'મહા', bn: 'মাঘ' }],
  ['फाल्गुन', { en: 'Phalguna', sa: 'फाल्गुनः', mr: 'फाल्गुन', gu: 'ફાગણ', bn: 'ফাল্গুন' }],
  ['प्रतिपदा', { en: 'Pratipada', sa: 'प्रतिपदा', mr: 'प्रतिपदा', gu: 'પ્રતિપદા', bn: 'প্রতিপদ' }],
  ['द्वितीया', { en: 'Dwitiya', sa: 'द्वितीया', mr: 'द्वितीया', gu: 'બીજ', bn: 'দ্বিতীয়া' }],
  ['तृतीया', { en: 'Tritiya', sa: 'तृतीया', mr: 'तृतीया', gu: 'ત્રીજ', bn: 'তৃতীয়া' }],
  ['चतुर्थी', { en: 'Chaturthi', sa: 'चतुर्थी', mr: 'चतुर्थी', gu: 'ચોથ', bn: 'চতুর্থী' }],
  ['पंचमी', { en: 'Panchami', sa: 'पञ्चमी', mr: 'पंचमी', gu: 'પાંચમ', bn: 'পঞ্চমী' }],
  ['षष्ठी', { en: 'Shashthi', sa: 'षष्ठी', mr: 'षष्ठी', gu: 'છઠ્ઠ', bn: 'ষষ্ঠী' }],
  ['सप्तमी', { en: 'Saptami', sa: 'सप्तमी', mr: 'सप्तमी', gu: 'સાતમ', bn: 'সপ্তমী' }],
  ['अष्टमी', { en: 'Ashtami', sa: 'अष्टमी', mr: 'अष्टमी', gu: 'આઠમ', bn: 'অষ্টমী' }],
  ['नवमी', { en: 'Navami', sa: 'नवमी', mr: 'नवमी', gu: 'નોમ', bn: 'নবমী' }],
  ['दशमी', { en: 'Dashami', sa: 'दशमी', mr: 'दशमी', gu: 'દશમ', bn: 'দশমী' }],
  ['एकादशी', { en: 'Ekadashi', sa: 'एकादशी', mr: 'एकादशी', gu: 'એકાદશી', bn: 'একাদশী' }],
  ['द्वादशी', { en: 'Dwadashi', sa: 'द्वादशी', mr: 'द्वादशी', gu: 'બારસ', bn: 'দ্বাদশী' }],
  ['त्रयोदशी', { en: 'Trayodashi', sa: 'त्रयोदशी', mr: 'त्रयोदशी', gu: 'તેરસ', bn: 'ত্রয়োদশী' }],
  ['चतुर्दशी', { en: 'Chaturdashi', sa: 'चतुर्दशी', mr: 'चतुर्दशी', gu: 'ચૌદશ', bn: 'চতুর্দশী' }],
  ['पूर्णिमा', { en: 'Purnima', sa: 'पूर्णिमा', mr: 'पौर्णिमा', gu: 'પૂર્ણિમા', bn: 'পূর্ণিমা' }],
  ['अमावस्या', { en: 'Amavasya', sa: 'अमावस्या', mr: 'अमावस्या', gu: 'અમાસ', bn: 'অমাবস্যা' }],
  ['रविवार', { en: 'Sunday', sa: 'रविवासरः', mr: 'रविवार', gu: 'રવિવાર', bn: 'রবিবার' }],
  ['सोमवार', { en: 'Monday', sa: 'सोमवासरः', mr: 'सोमवार', gu: 'સોમવાર', bn: 'সোমবার' }],
  ['मंगलवार', { en: 'Tuesday', sa: 'मङ्गलवासरः', mr: 'मंगळवार', gu: 'મંગળવાર', bn: 'মঙ্গলবার' }],
  ['बुधवार', { en: 'Wednesday', sa: 'बुधवासरः', mr: 'बुधवार', gu: 'બુધવાર', bn: 'বুধবার' }],
  ['गुरुवार', { en: 'Thursday', sa: 'गुरुवासरः', mr: 'गुरुवार', gu: 'ગુરુવાર', bn: 'বৃহস্পতিবার' }],
  ['शुक्रवार', { en: 'Friday', sa: 'शुक्रवासरः', mr: 'शुक्रवार', gu: 'શુક્રવાર', bn: 'শুক্রবার' }],
  ['शनिवार', { en: 'Saturday', sa: 'शनिवासरः', mr: 'शनिवार', gu: 'શનિવાર', bn: 'শনিবার' }],
  ['अश्विनी', { en: 'Ashwini', sa: 'अश्विनी', mr: 'अश्विनी', gu: 'અશ્વિની', bn: 'অশ্বিনী' }],
  ['भरणी', { en: 'Bharani', sa: 'भरणी', mr: 'भरणी', gu: 'ભરણી', bn: 'ভরণী' }],
  ['कृत्तिका', { en: 'Krittika', sa: 'कृत्तिका', mr: 'कृत्तिका', gu: 'કૃત્તિકા', bn: 'কৃত্তিকা' }],
  ['रोहिणी', { en: 'Rohini', sa: 'रोहिणी', mr: 'रोहिणी', gu: 'રોહિણી', bn: 'রোহিণী' }],
  ['मृगशिरा', { en: 'Mrigashira', sa: 'मृगशीर्षम्', mr: 'मृगशीर्ष', gu: 'મૃગશીર્ષ', bn: 'মৃগশিরা' }],
  ['आर्द्रा', { en: 'Ardra', sa: 'आर्द्रा', mr: 'आर्द्रा', gu: 'આર્દ્રા', bn: 'আর্দ্রা' }],
  ['पुनर्वसु', { en: 'Punarvasu', sa: 'पुनर्वसुः', mr: 'पुनर्वसू', gu: 'પુનર્વસુ', bn: 'পুনর্বসু' }],
  ['पुष्य', { en: 'Pushya', sa: 'पुष्यः', mr: 'पुष्य', gu: 'પુષ્ય', bn: 'পুষ্যা' }],
  ['आश्लेषा', { en: 'Ashlesha', sa: 'आश्लेषा', mr: 'आश्लेषा', gu: 'આશ્લેષા', bn: 'অশ্লেষা' }],
  ['मघा', { en: 'Magha', sa: 'मघा', mr: 'मघा', gu: 'મઘા', bn: 'মঘা' }],
  ['पूर्वाफाल्गुनी', { en: 'Purva Phalguni', sa: 'पूर्वाफाल्गुनी', mr: 'पूर्वा फाल्गुनी', gu: 'પૂર્વા ફાલ્ગુની', bn: 'পূর্ব ফাল্গুনী' }],
  ['उत्तराफाल्गुनी', { en: 'Uttara Phalguni', sa: 'उत्तराफाल्गुनी', mr: 'उत्तरा फाल्गुनी', gu: 'ઉત્તરા ફાલ્ગુની', bn: 'উত্তর ফাল্গুনী' }],
  ['हस्त', { en: 'Hasta', sa: 'हस्तः', mr: 'हस्त', gu: 'હસ્ત', bn: 'হস্তা' }],
  ['चित्रा', { en: 'Chitra', sa: 'चित्रा', mr: 'चित्रा', gu: 'ચિત્રા', bn: 'চিত্রা' }],
  ['स्वाती', { en: 'Swati', sa: 'स्वाती', mr: 'स्वाती', gu: 'સ્વાતિ', bn: 'স্বাতী' }],
  ['विशाखा', { en: 'Vishakha', sa: 'विशाखा', mr: 'विशाखा', gu: 'વિશાખા', bn: 'বিশাখা' }],
  ['अनुराधा', { en: 'Anuradha', sa: 'अनुराधा', mr: 'अनुराधा', gu: 'અનુરાધા', bn: 'অনুরাধা' }],
  ['ज्येष्ठा', { en: 'Jyeshtha', sa: 'ज्येष्ठा', mr: 'ज्येष्ठा', gu: 'જ્યેષ્ઠા', bn: 'জ্যেষ্ঠা' }],
  ['मूल', { en: 'Mula', sa: 'मूलम्', mr: 'मूळ', gu: 'મૂળ', bn: 'মূলা' }],
  ['पूर्वाषाढ़ा', { en: 'Purva Ashadha', sa: 'पूर्वाषाढा', mr: 'पूर्वाषाढा', gu: 'પૂર્વાષાઢા', bn: 'পূর্বাষাঢ়া' }],
  ['उत्तराषाढ़ा', { en: 'Uttara Ashadha', sa: 'उत्तराषाढा', mr: 'उत्तराषाढा', gu: 'ઉત્તરાષાઢા', bn: 'উত্তরাষাঢ়া' }],
  ['श्रवण', { en: 'Shravana', sa: 'श्रवणः', mr: 'श्रवण', gu: 'શ્રવણ', bn: 'শ্রবণা' }],
  ['धनिष्ठा', { en: 'Dhanishta', sa: 'धनिष्ठा', mr: 'धनिष्ठा', gu: 'ધનિષ્ઠા', bn: 'ধনিষ্ঠা' }],
  ['शतभिषा', { en: 'Shatabhisha', sa: 'शतभिषज्', mr: 'शततारका', gu: 'શતભિષા', bn: 'শতভিষা' }],
  ['पूर्वाभाद्रपद', { en: 'Purva Bhadrapada', sa: 'पूर्वाभाद्रपदा', mr: 'पूर्वा भाद्रपदा', gu: 'પૂર્વા ભાદ્રપદ', bn: 'পূর্ব ভাদ্রপদ' }],
  ['उत्तराभाद्रपद', { en: 'Uttara Bhadrapada', sa: 'उत्तराभाद्रपदा', mr: 'उत्तरा भाद्रपदा', gu: 'ઉત્તરા ભાદ્રપદ', bn: 'উত্তর ভাদ্রপদ' }],
  ['रेवती', { en: 'Revati', sa: 'रेवती', mr: 'रेवती', gu: 'રેવતી', bn: 'রেবতী' }],
  ['सूर्योदय', { en: 'Sunrise', sa: 'सूर्योदयः', mr: 'सूर्योदय', gu: 'સૂર્યોદય', bn: 'সূর্যোদয়' }],
  ['सूर्यास्त', { en: 'Sunset', sa: 'सूर्यास्तः', mr: 'सूर्यास्त', gu: 'સૂર્યાસ્ત', bn: 'সূর্যাস্ত' }],
  ['चंद्रोदय', { en: 'Moonrise', sa: 'चन्द्रोदयः', mr: 'चंद्रोदय', gu: 'ચંદ્રોદય', bn: 'চন্দ্রোদয়' }],
  ['चंद्रास्त', { en: 'Moonset', sa: 'चन्द्रास्तः', mr: 'चंद्रास्त', gu: 'ચંદ્રાસ્ત', bn: 'চন্দ্রাস্ত' }],
  ['समाप्ति', { en: 'Ends', sa: 'समाप्तिः', mr: 'समाप्ती', gu: 'સમાપ્તિ', bn: 'সমাপ্তি' }],
  ['तिथि', { en: 'Tithi', sa: 'तिथिः', mr: 'तिथी', gu: 'તિથિ', bn: 'তিথি' }],
  ['पक्ष', { en: 'Paksha', sa: 'पक्षः', mr: 'पक्ष', gu: 'પક્ષ', bn: 'পক্ষ' }],
  ['नक्षत्र', { en: 'Nakshatra', sa: 'नक्षत्रम्', mr: 'नक्षत्र', gu: 'નક્ષત્ર', bn: 'নক্ষত্র' }],
  ['योग', { en: 'Yoga', sa: 'योगः', mr: 'योग', gu: 'યોગ', bn: 'যোগ' }],
  ['करण', { en: 'Karana', sa: 'करणम्', mr: 'करण', gu: 'કરણ', bn: 'করণ' }],
  ['ऋतु', { en: 'Ritu', sa: 'ऋतुः', mr: 'ऋतू', gu: 'ઋતુ', bn: 'ঋতু' }],
  ['अयन', { en: 'Ayana', sa: 'अयनम्', mr: 'अयन', gu: 'અયન', bn: 'অয়ন' }],
  ['लग्न', { en: 'Lagna', sa: 'लग्नम्', mr: 'लग्न', gu: 'લગ્ન', bn: 'লগ্ন' }],
  ['राशि', { en: 'Zodiac Sign', sa: 'राशिः', mr: 'राशी', gu: 'રાશિ', bn: 'রাশি' }],
  ['स्वामी', { en: 'Lord', sa: 'स्वामी', mr: 'स्वामी', gu: 'સ્વામી', bn: 'স্বামী' }],
  ['चरण', { en: 'Pada', sa: 'चरणः', mr: 'चरण', gu: 'ચરણ', bn: 'চরণ' }],
  ['शुभ अंक', { en: 'Lucky Number', sa: 'शुभाङ्कः', mr: 'शुभ अंक', gu: 'શુભ અંક', bn: 'শুভ সংখ্যা' }],
  ['शुभ रंग', { en: 'Lucky Color', sa: 'शुभवर्णः', mr: 'शुभ रंग', gu: 'શુભ રંગ', bn: 'শুভ রঙ' }],
  ['शुभ समय', { en: 'Auspicious Time', sa: 'शुभसमयः', mr: 'शुभ वेळ', gu: 'શુભ સમય', bn: 'শুভ সময়' }],
  ['उपाय', { en: 'Remedy', sa: 'उपायः', mr: 'उपाय', gu: 'ઉપાય', bn: 'উপায়' }],
  ['वक्री', { en: 'Retrograde', sa: 'वक्री', mr: 'वक्री', gu: 'વક્રી', bn: 'বক্রী' }],
  ['अस्त', { en: 'Combust', sa: 'अस्तः', mr: 'अस्त', gu: 'અસ્ત', bn: 'অস্ত' }],
  ['मार्गी', { en: 'Direct', sa: 'मार्गी', mr: 'मार्गी', gu: 'માર્ગી', bn: 'মার্গী' }],
  ['महादशा', { en: 'Mahadasha', sa: 'महादशा', mr: 'महादशा', gu: 'મહાદશા', bn: 'মহাদশা' }],
  ['अंतर्दशा', { en: 'Antardasha', sa: 'अन्तर्दशा', mr: 'अंतर्दशा', gu: 'અંતર્દશા', bn: 'অন্তর্দশা' }],
  ['सक्रिय', { en: 'Active', sa: 'सक्रियः', mr: 'सक्रिय', gu: 'સક્રિય', bn: 'সক্রিয়' }],
  ['वर्ष', { en: 'Years', sa: 'वर्षाणि', mr: 'वर्षे', gu: 'વર્ષ', bn: 'বছর' }],
  ['अक्षांश', { en: 'Lat', sa: 'अक्षांशः', mr: 'अक्षांश', gu: 'અક્ષાંશ', bn: 'অক্ষাংশ' }],
  ['देशांतर', { en: 'Long', sa: 'देशान्तरः', mr: 'रेखांश', gu: 'રેખાંશ', bn: 'দ্রাঘিমাংশ' }],
  ['बंद करें', { en: 'Close', sa: 'पिधानम्', mr: 'बंद करा', gu: 'બંધ કરો', bn: 'বন্ধ করুন' }]
];

const SORTED_PHRASES = [...GLOBAL_PHRASE_MAP].sort((a, b) => b[0].length - a[0].length);
const SORTED_WORDS = [...WORD_VOCAB_MAP].sort((a, b) => b[0].length - a[0].length);

// Build Reverse Lookup from Dictionary (Hindi value -> translation in target language)
const DICT_HI_TO_LANG: Array<[string, Record<LanguageCode, string>]> = Object.keys(DICTIONARY.hi)
  .map((key) => {
    const hiVal = DICTIONARY.hi[key];
    return [
      hiVal,
      {
        hi: hiVal,
        en: DICTIONARY.en[key] || hiVal,
        sa: DICTIONARY.sa[key] || hiVal,
        mr: DICTIONARY.mr[key] || hiVal,
        gu: DICTIONARY.gu[key] || hiVal,
        bn: DICTIONARY.bn[key] || hiVal
      }
    ] as [string, Record<LanguageCode, string>];
  })
  .sort((a, b) => b[0].length - a[0].length);

const TERM_ENTRIES = Object.entries(TERM_MAP).sort((a, b) => b[0].length - a[0].length);

const DEVANAGARI_DIGITS: Record<string, Record<LanguageCode, string>> = {
  '0': { hi: '0', en: '0', sa: '०', mr: '०', gu: '૦', bn: '০' },
  '1': { hi: '1', en: '1', sa: '१', mr: '१', gu: '૧', bn: '১' },
  '2': { hi: '2', en: '2', sa: '२', mr: '२', gu: '૨', bn: '২' },
  '3': { hi: '3', en: '3', sa: '३', mr: '३', gu: '૩', bn: '৩' },
  '4': { hi: '4', en: '4', sa: '४', mr: '४', gu: '૪', bn: '৪' },
  '5': { hi: '5', en: '5', sa: '५', mr: '५', gu: '૫', bn: '৫' },
  '6': { hi: '6', en: '6', sa: '६', mr: '६', gu: '૬', bn: '৬' },
  '7': { hi: '7', en: '7', sa: '७', mr: '७', gu: '૭', bn: '৭' },
  '8': { hi: '8', en: '8', sa: '८', mr: '८', gu: '૮', bn: '৮' },
  '9': { hi: '9', en: '9', sa: '९', mr: '९', gu: '૯', bn: '৯' }
};

function normalizeLookupKey(s: string): string {
  return s
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const NORM_EXACT_EN_MAP = new Map<string, string>();
for (const [k, v] of Object.entries(EXACT_HI_TO_EN_MAP)) {
  const nk = normalizeLookupKey(k);
  if (nk && v) {
    NORM_EXACT_EN_MAP.set(nk, v);
  }
}

const EN_CACHE_STORAGE_KEY = 'jw_en_translation_cache_v3';
const clientEnCache = new Map<string, string>();

try {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(EN_CACHE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>;
      for (const [k, v] of Object.entries(parsed)) {
        if (k && v) clientEnCache.set(normalizeLookupKey(k), v);
      }
    }
  }
} catch {
  // Ignore storage errors
}

const pendingEnTexts = new Set<string>();
let batchTimer: ReturnType<typeof setTimeout> | null = null;
let lastRootElement: HTMLElement | null = null;
let lastActiveLang: LanguageCode = 'hi';

function scheduleAsyncEnglishTranslation(hiText: string): void {
  const clean = normalizeLookupKey(hiText);
  if (!clean || clientEnCache.has(clean) || NORM_EXACT_EN_MAP.has(clean) || pendingEnTexts.has(clean)) return;
  pendingEnTexts.add(clean);

  if (batchTimer) return;
  batchTimer = setTimeout(async () => {
    batchTimer = null;
    const batch = Array.from(pendingEnTexts).slice(0, 50);
    batch.forEach((t) => pendingEnTexts.delete(t));
    if (batch.length === 0) return;

    try {
      const resp = await fetch('/api/translate-en', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: batch })
      });
      if (resp.ok) {
        const data = await resp.json();
        const translations = (data && data.translations) || {};
        let updated = false;
        for (const [origHi, enVal] of Object.entries(translations)) {
          if (typeof enVal === 'string' && enVal.trim()) {
            clientEnCache.set(normalizeLookupKey(origHi), enVal.trim());
            updated = true;
          }
        }
        if (updated) {
          try {
            const obj: Record<string, string> = {};
            clientEnCache.forEach((v, k) => {
              obj[k] = v;
            });
            localStorage.setItem(EN_CACHE_STORAGE_KEY, JSON.stringify(obj));
          } catch {
            // Ignore storage quota
          }
          if (lastRootElement && lastActiveLang === 'en') {
            applyGlobalDomTranslation(lastRootElement, 'en');
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('jw-en-translations-updated'));
          }
        }
      }
    } catch {
      // Ignore network error
    }

    if (pendingEnTexts.size > 0) {
      const nextItem = pendingEnTexts.values().next().value;
      if (nextItem) {
        pendingEnTexts.delete(nextItem);
        scheduleAsyncEnglishTranslation(nextItem);
      }
    }
  }, 60);
}

/**
 * Translates any Hindi text string into genuine English (when lang === 'en').
 * Never uses phonetic Hinglish transliteration and never mixes a few English words into Hindi paragraphs.
 */
export function translateTextContent(input: string, lang: LanguageCode): string {
  if (!input || lang === 'hi') return input;

  // Handle multiline strings line-by-line if not matched as a whole block
  if (input.includes('\n')) {
    const wholeNorm = normalizeLookupKey(input);
    const wholeExact = NORM_EXACT_EN_MAP.get(wholeNorm) || clientEnCache.get(wholeNorm);
    if (wholeExact) return wholeExact;
    const lines = input.split('\n');
    return lines.map((line) => translateTextContent(line, lang)).join('\n');
  }

  const leadingMatch = input.match(/^\s*/);
  const trailingMatch = input.match(/\s*$/);
  const leadingWs = leadingMatch ? leadingMatch[0] : '';
  const trailingWs = trailingMatch ? trailingMatch[0] : '';

  const normKey = normalizeLookupKey(input);
  if (!normKey) return input;

  if (lang === 'en') {
    // 0a. Exact match in normalized comprehensive English corpus
    const exactMatch = NORM_EXACT_EN_MAP.get(normKey);
    if (exactMatch) {
      return `${leadingWs}${exactMatch}${trailingWs}`;
    }

    // 0b. Exact match in resolved dynamic translation cache
    const cachedEn = clientEnCache.get(normKey);
    if (cachedEn) {
      return `${leadingWs}${cachedEn}${trailingWs}`;
    }

    // 0c. Dynamic pattern match (Monthly/Yearly Horoscopes, Tyohar details, Dasha balance, etc.)
    const patternTranslated = translateDynamicHindiPatternsToEnglish(normKey);
    if (patternTranslated !== normKey && !/[\u0900-\u097F]/.test(patternTranslated)) {
      return `${leadingWs}${patternTranslated}${trailingWs}`;
    }

    // 0d. Strip leading/trailing punctuation, numbers, bullets, dashes (e.g., "1. ", "• ", " –", ":")
    const punctMatch = normKey.match(
      /^([0-9०-९]+[.)]\s*|•\s*|-\s*|–\s*|—\s*|\*\s*|\(\s*|"\s*|'\s*|“\s*|👉\s*|✨\s*|🚩\s*)?(.*?)(\s*[:：–—\-.!?,;)"'”।]+)?$/
    );
    if (punctMatch) {
      const prefix = (punctMatch[1] || '').replace(/[०-९]/g, (d) => DEVANAGARI_DIGITS[d]?.en || d);
      const core = (punctMatch[2] || '').trim();
      const rawSuffix = punctMatch[3] || '';
      const suffix = rawSuffix.replace(/।/g, '.');
      if (core && core !== normKey) {
        const coreExact = NORM_EXACT_EN_MAP.get(core) || clientEnCache.get(core);
        if (coreExact) {
          return `${leadingWs}${prefix}${coreExact}${suffix}${trailingWs}`;
        }
        const corePattern = translateDynamicHindiPatternsToEnglish(core);
        if (corePattern !== core && !/[\u0900-\u097F]/.test(corePattern)) {
          return `${leadingWs}${prefix}${corePattern}${suffix}${trailingWs}`;
        }
      }
    }

    // 0e. Multi-sentence or multi-clause split (by '।', ' – ', ': ')
    if (normKey.includes('।') || normKey.includes(' – ')) {
      const parts = normKey.split(/(।\s*|\s+–\s+)/);
      if (parts.length > 1) {
        let allTranslated = true;
        const translatedParts = parts.map((part) => {
          if (/^(।\s*|\s+–\s+)$/.test(part)) {
            return part.includes('।') ? '. ' : ' – ';
          }
          const pNorm = normalizeLookupKey(part);
          if (!pNorm) return part;
          if (!/[\u0900-\u097F]/.test(pNorm)) return part;
          const sub = translateTextContent(pNorm, 'en');
          if (/[\u0900-\u097F]/.test(sub)) {
            allTranslated = false;
          }
          return sub;
        });
        if (allTranslated) {
          return `${leadingWs}${translatedParts.join('').replace(/\.\s*\./g, '.').trim()}${trailingWs}`;
        }
      }
    }
  }

  // 1. Exact Dictionary match
  for (const [hiVal, map] of DICT_HI_TO_LANG) {
    if (normKey === hiVal && map[lang]) {
      return `${leadingWs}${map[lang]}${trailingWs}`;
    }
  }

  // 2. Exact Phrase match
  for (const [hiPhrase, map] of SORTED_PHRASES) {
    if (normKey === hiPhrase && map[lang]) {
      return `${leadingWs}${map[lang]}${trailingWs}`;
    }
  }

  // 3. Exact Term match
  if (TERM_MAP[normKey] && TERM_MAP[normKey][lang]) {
    return `${leadingWs}${TERM_MAP[normKey][lang]}${trailingWs}`;
  }

  let result = lang === 'en' ? translateDynamicHindiPatternsToEnglish(normKey) : normKey;

  // Replace exact corpus sentences embedded inside larger text blocks
  if (lang === 'en') {
    for (const [hiSent, enSent] of NORM_EXACT_EN_MAP.entries()) {
      if (hiSent.length > 10 && result.includes(hiSent)) {
        result = result.split(hiSent).join(enSent);
      }
    }
    if (!/[\u0900-\u097F]/.test(result)) {
      return `${leadingWs}${result}${trailingWs}`;
    }
  }

  // Build candidate with phrase/word/term replacements
  let candidate = result;

  // 4. Replace multi-word phrases
  for (const [hiPhrase, map] of SORTED_PHRASES) {
    if (candidate.includes(hiPhrase) && map[lang]) {
      candidate = candidate.split(hiPhrase).join(map[lang]);
    }
  }

  // 5. Replace dictionary phrases
  for (const [hiVal, map] of DICT_HI_TO_LANG) {
    if (hiVal.length > 2 && candidate.includes(hiVal) && map[lang]) {
      candidate = candidate.split(hiVal).join(map[lang]);
    }
  }

  // 6. Replace vocabulary words
  for (const [hiWord, map] of SORTED_WORDS) {
    if (candidate.includes(hiWord) && map[lang]) {
      candidate = candidate.split(hiWord).join(map[lang]);
    }
  }

  // 7. Replace astrological terms
  for (const [hiTerm, map] of TERM_ENTRIES) {
    if (candidate.includes(hiTerm) && map[lang]) {
      candidate = candidate.split(hiTerm).join(map[lang]);
    }
  }

  if (lang === 'en') {
    const stillHasHindi = /[\u0900-\u097F]/.test(candidate);
    if (!stillHasHindi) {
      return `${leadingWs}${candidate}${trailingWs}`;
    }

    // If it's a long Hindi sentence (> 3 words) and word-by-word replacement left Hindi words behind,
    // DO NOT return a half-Hindi/half-English sentence! Queue the pure Hindi sentence for full translation.
    const wordCount = normKey.split(/\s+/).length;
    scheduleAsyncEnglishTranslation(normKey);
    if (wordCount > 3) {
      return `${leadingWs}${result}${trailingWs}`;
    }
  }

  return `${leadingWs}${candidate}${trailingWs}`;
}

const origTextNodeMap = new WeakMap<Node, { origHi: string; lastApplied: string }>();

/**
 * Traverses the DOM inside `root` and translates every text node and attribute
 * into `lang` (or restores original Hindi when `lang === 'hi'`).
 */
export function applyGlobalDomTranslation(root: HTMLElement | null, lang: LanguageCode): void {
  if (!root) return;
  lastRootElement = root;
  lastActiveLang = lang;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.closest('[data-no-translate="true"]')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const node of textNodes) {
    const currentVal = node.nodeValue || '';
    if (!currentVal.trim()) continue;

    let entry = origTextNodeMap.get(node);
    // If this text node is new OR was updated by React (currentVal differs from what we last wrote)
    if (!entry || currentVal !== entry.lastApplied) {
      entry = { origHi: currentVal, lastApplied: currentVal };
      origTextNodeMap.set(node, entry);
    }

    const targetVal = lang === 'hi' ? entry.origHi : translateTextContent(entry.origHi, lang);
    if (node.nodeValue !== targetVal) {
      node.nodeValue = targetVal;
    }
    entry.lastApplied = targetVal;
  }

  // Translate attributes: placeholder, title, aria-label
  const elements = root.querySelectorAll<HTMLElement>('[placeholder], [title], [aria-label]');
  elements.forEach((el) => {
    if (el.closest('[data-no-translate="true"]')) return;
    (['placeholder', 'title', 'aria-label'] as const).forEach((attr) => {
      const val = el.getAttribute(attr);
      if (!val) return;
      const dataKey = `data-orig-${attr}`;
      const lastKey = `data-last-${attr}`;
      let orig = el.getAttribute(dataKey);
      const lastApplied = el.getAttribute(lastKey);
      if (!orig || val !== lastApplied) {
        orig = val;
        el.setAttribute(dataKey, orig);
      }
      const targetAttr = lang === 'hi' ? orig : translateTextContent(orig, lang);
      if (val !== targetAttr) {
        el.setAttribute(attr, targetAttr);
      }
      el.setAttribute(lastKey, targetAttr);
    });
  });

  // Preserve numeric formatting helper reference
  void DEVANAGARI_DIGITS;
}
