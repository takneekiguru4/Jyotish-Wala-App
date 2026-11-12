/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SankalpContentConfig {
  title: string;
  tagline: string;
  laghuTitle: string;
  laghuSubtitle: string;
  laghuText: string;
  vistritTitle: string;
  vistritSubtitle: string;
  vistritText: string;
  note1Title: string;
  note1Text: string;
  note2Title: string;
  note2Text: string;
  note3Title: string;
  note3Text: string;
}

export interface AboutUsContentConfig {
  title: string;
  tagline: string;
  introTitle: string;
  introText: string;
  missionTitle: string;
  missionText: string;
  pillarsTitle: string;
  pillar1Title: string;
  pillar1Text: string;
  pillar2Title: string;
  pillar2Text: string;
  pillar3Title: string;
  pillar3Text: string;
  traditionTitle: string;
  traditionText: string;
  contactEmail: string;
  founderName: string;
  education: string;
  university: string;
}

export interface PrivacyPolicyContentConfig {
  title: string;
  tagline: string;
  badgeText: string;
  lastUpdated: string;
  section1Title: string;
  section1Text: string;
  section2Title: string;
  section2Text: string;
  section3Title: string;
  section3Text: string;
  section4Title: string;
  section4Text: string;
  section5Title: string;
  section5Text: string;
  contactEmail: string;
}

export interface HomeSlideItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  targetScreen: string;
  theme: 'teal' | 'saffron' | 'indigo' | 'emerald' | 'dark';
  bgImage?: string;
}

export interface SiteContentConfig {
  sankalp: SankalpContentConfig;
  about: AboutUsContentConfig;
  privacy: PrivacyPolicyContentConfig;
  slides: HomeSlideItem[];
}

export const CATEGORY_SLIDE_IMAGES: Record<string, string> = {
  kundli: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=1200&q=80',
  panchang: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  milan: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
  chat: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  dharma: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=80',
  sankalp: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  calculators: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  gochar: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
  tyohar: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
  rashifal: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  articles: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80'
};

export function getSlideBackgroundImage(slide: HomeSlideItem): string {
  if (slide.bgImage && slide.bgImage.trim()) {
    return slide.bgImage.trim();
  }
  return CATEGORY_SLIDE_IMAGES[slide.targetScreen] || CATEGORY_SLIDE_IMAGES.kundli;
}

export const DEFAULT_HOME_SLIDES: HomeSlideItem[] = [
  {
    id: 'slide_kundli',
    badge: 'वैदिक जन्मकुंडली एवं लग्न चक्र',
    title: 'निःशुल्क विस्तृत जन्मकुंडली व ग्रह विश्लेषण',
    description: 'जन्म तिथि, समय और स्थान से सटीक लग्न कुंडली, नवमांश, विंशोत्तरी दशा एवं दोष विश्लेषण प्राप्त करें।',
    buttonText: 'कुंडली बनाएं',
    targetScreen: 'kundli',
    theme: 'teal',
    bgImage: CATEGORY_SLIDE_IMAGES.kundli
  },
  {
    id: 'slide_panchang',
    badge: 'शुद्ध ऋषिकेश एवं काशी पंचांग',
    title: 'दैनिक पंचांग, चौघड़िया एवं शुभ मुहूर्त',
    description: 'तिथि, नक्षत्र, योग, करण, राहुकाल, अभिजीत मुहूर्त एवं सौर प्रविष्टे की प्रतिदिन सटीक गणना।',
    buttonText: 'पंचांग देखें',
    targetScreen: 'panchang',
    theme: 'saffron',
    bgImage: CATEGORY_SLIDE_IMAGES.panchang
  },
  {
    id: 'slide_milan',
    badge: 'वैवाहिक अष्टकूट गुण मिलान',
    title: 'वर-वधू कुंडली मिलान एवं मांगलिक दोष जांच',
    description: '36 गुणों का शास्त्रीय मिलान, नाड़ी-भकूट दोष परिहार एवं सुखद वैवाहिक जीवन हेतु सटीक परामर्श।',
    buttonText: 'कुंडली मिलान करें',
    targetScreen: 'milan',
    theme: 'dark',
    bgImage: CATEGORY_SLIDE_IMAGES.milan
  },
  {
    id: 'slide_pandit',
    badge: 'प्रमाणित ज्योतिषाचार्य परामर्श',
    title: 'अनुभवी वैदिक आचार्यों से सीधा संवाद',
    description: 'काशी व ऋषिकेश के विद्वान आचार्यों से कुंडली, वास्तु, करियर व ग्रह शांति हेतु फोन या व्हाट्सएप पर बात करें।',
    buttonText: 'पंडित जी से बात करें',
    targetScreen: 'chat',
    theme: 'emerald',
    bgImage: CATEGORY_SLIDE_IMAGES.chat
  },
  {
    id: 'slide_dharma',
    badge: 'सनातन धर्म, मंत्र एवं साधना',
    title: '108 रुद्राक्ष जप माला, नवग्रह मंत्र एवं संकल्प',
    description: 'डिजिटल रुद्राक्ष माला से मंत्र जप करें तथा दैनिक पूजा हेतु शुद्ध वैदिक संकल्प मंत्र व पर्व कैलेंडर देखें।',
    buttonText: 'धर्म एवं मंत्र देखें',
    targetScreen: 'dharma',
    theme: 'indigo',
    bgImage: CATEGORY_SLIDE_IMAGES.dharma
  }
];

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  sankalp: {
    title: 'संकल्प मंत्र',
    tagline: 'दैनिक पूजा, व्रत एवं अनुष्ठान हेतु प्रामाणिक वैदिक संकल्प विधि',
    laghuTitle: 'नित्य दैनिक पूजा हेतु संक्षिप्त संकल्प',
    laghuSubtitle: 'प्रातःकाल अथवा सांध्यकालीन नित्य देवपूजन, दीप प्रज्वलन व जप हेतु',
    laghuText:
      'ॐ विष्णुर्विष्णुर्विष्णुः श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य, अद्य ब्रह्मणो द्वितीये परार्धे, श्रीश्वेतवाराहकल्पे, वैवस्वतमन्वन्तरे, अष्टाविंशतितमे कलियुगे, कलिप्रथमचरणे, जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, आर्यावर्तैकदेशान्तर्गत पुण्यप्रदेशे, {संवत्सर} नाम संवत्सरे, {अयन}े, {ऋतु} ऋतौ, महामांगल्यप्रदे {मास} मासे, {पक्ष}े, {तिथि} तिथौ, {वार} वासरे, {नक्षत्र} नक्षत्रे, {योग} योगे, {करण} करणे, {चन्द्र_राशि} राशिस्थे चन्द्रे, {सूर्य_राशि} राशिस्थे सूर्ये, {बृहस्पति_राशि} राशिस्थे देवगुरौ, [अमुक] गोत्रोत्पन्नः [अमुक] नामाऽहं, मम सकलदुरितोपशमनार्थं, श्रीपरमेश्वरप्रीत्यर्थं [अमुक] देवस्य पूजनं/जपं करिष्ये।',
    vistritTitle: 'महापूजा, अनुष्ठान व हवन हेतु विस्तृत संकल्प',
    vistritSubtitle: 'सत्यनारायण कथा, रुद्राभिषेक, नवग्रह शांति, यज्ञ एवं विशेष व्रत अनुष्ठान हेतु',
    vistritText:
      'ॐ तत्सत्। ॐ अद्य ब्रह्मणोऽह्नि द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे कलिप्रथमचरणे बौद्धसप्ताहे जम्बूद्वीपे भारतवर्षे भरतखण्डे आर्यावर्तैकदेशान्तर्गत-पुण्यप्रदेशे, पवित्र-तीर्थक्षेत्रे, {संवत्सर} नाम संवत्सरे, {अयन}े, {ऋतु} ऋतौ, महामांगल्यप्रदे {मास} मासे, {पक्ष}े, {तिथि} तिथौ, {वार} वासरे, {नक्षत्र} नक्षत्रे, {योग} योगे, {करण} करणे, {चन्द्र_राशि} राशिस्थे चन्द्रे, {सूर्य_राशि} राशिस्थे सूर्ये, {बृहस्पति_राशि} राशिस्थे देवगुरौ शेषेषु ग्रहेषु यथायथा राशिस्थानस्थितेषु सत्सु एवं ग्रहगुणविशेषेण विशिष्टायां शुभपुण्यतिथौ, [अमुक] गोत्रोत्पन्नः [अमुक] नामाऽहं, ममोपात्त-दुरितक्षयद्वारा श्रीपरमेश्वर-प्रीतिकामनया, मम सपरिवारस्य ऐहिक-पारलौकिक-सकल-मनोरथ-सिद्ध्यर्थं, धर्मार्थकाममोक्ष-फलप्राप्त्यर्थं, आयुर्बल-यशः-श्री-कीर्ति-प्रवृद्ध्यर्थं, सर्वोपद्रव-शान्तिपूर्वक-दीर्घायुष्य-आरोग्य-अभिवृद्ध्यर्थं च अद्य [अमुक] देवस्य षोडशोपचार-पूजनं/हवनं करिष्ये। ॐ तत्सत् न मम्।',
    note1Title: '1. संकल्प के अंदर कोष्ठक में [अमुक] की जगह क्या बोलें?',
    note1Text:
      '• [अमुक] गोत्र: अपने वंश का मूल गोत्र बोलें (जैसे: भारद्वाज, कश्यप, वशिष्ठ आदि)। यदि गोत्र ज्ञात न हो तो ‘कश्यप गोत्र’ बोलें।\n• [अमुक] नाम: अपना स्वयं का वास्तविक या जन्म नाम बोलें (जैसे: परेश्वर शर्मा)।\n• [अमुक] देवस्य: जिस देवी या देवता की पूजा कर रहे हैं उनका नाम लें (जैसे: श्रीगणेश, शिवजी, हनुमानजी, महालक्ष्मी आदि)।',
    note2Title: '2. पूजा में संकल्प क्यों किया जाता है?',
    note2Text:
      'शास्त्रों में कहा गया है: ‘विना संकल्पात् कर्म न सिद्ध्यति’ अर्थात् बिना संकल्प के किया गया कोई भी धार्मिक कर्म निष्फल हो जाता है। संकल्प द्वारा व्यक्ति ब्रह्मांडीय देश, काल (समय, संवत, नक्षत्र) और अपने अस्तित्व (गोत्र, नाम) को साक्षी मानकर ईश्वर के प्रति अपनी भक्ति व कार्य का दायित्व तय करता है।',
    note3Title: '3. संकल्प लेते समय हाथ में क्या सामग्री रखनी चाहिए?',
    note3Text:
      'दाएं हाथ की हथेली में थोड़ा जल, अक्षत (बिना टूटे चावल), पुष्प, दूर्वा, रोली और तांबे या चांदी का सिक्का/द्रव्य लेकर संकल्प पाठ करें। संकल्प पूर्ण होने पर समस्त सामग्री को ताम्रपात्र में अथवा भगवान के सम्मुख समर्पित कर दें।'
  },
  about: {
    title: 'हमारे बारे में (About Us)',
    tagline: 'JyotishWala — वैदिक ज्योतिष, शुद्ध पंचांग एवं सनातन संस्कृति का प्रामाणिक मंच',
    introTitle: 'JyotishWala (ज्योतिषवाला) का परिचय',
    introText:
      'JyotishWala एक आधुनिक, विश्वसनीय और पूर्णतः शास्त्रीय वैदिक मंच है जिसका निर्माण प्राचीन भारतीय ऋषियों के खगोलीय व ज्योतिषीय ज्ञान को प्रत्येक श्रद्धालु और जिज्ञासु तक सरल, निष्पक्ष और पारदर्शी रूप से पहुँचाने के लिए किया गया है। यहाँ आपको पंचांग, जन्मकुंडली निर्माण, गुण मिलान, ग्रह गोचर, दैनिक राशिफल एवं धार्मिक साधनाएं बिना किसी भ्रामक विज्ञापन या अंधविश्वास के उपलब्ध कराई जाती हैं।',
    missionTitle: 'हमारा उद्देश्य एवं वैदिक दृष्टि (Our Vision)',
    missionText:
      'हमारा मुख्य ध्येय सनातन धर्म के गहन खगोल-विज्ञान और ज्योतिष-दर्शन को आधुनिक वैज्ञानिक सटीकता के साथ प्रस्तुत करना है। आमजन को जटिल पंचांगीय गणनाओं और पूजा-अनुष्ठानों में कोई कठिनाई न हो, इसी उद्देश्य से हमने शुद्ध पंचांग, दैनिक संकल्प मंत्र और दोष-निवारण जैसी सुविधाओं को अत्यंत सुगम बनाया है।',
    pillarsTitle: 'हमारे तीन मुख्य आधार स्तंभ',
    pillar1Title: 'विशुद्ध गणितीय गणना',
    pillar1Text:
      'ऋषिकेश एवं काशी की प्रामाणिक अक्षांश-देशांतर पद्धति पर आधारित सूक्ष्म सूर्य-चंद्र व नवग्रह स्थितियां।',
    pillar2Title: 'शास्त्रीय प्रामाणिकता',
    pillar2Text:
      'बृहत्पाराशर होराशास्त्र, जातक पारिजात एवं मुहूर्तमार्तण्ड के शास्त्रीय सिद्धांतों का अक्षरशः पालन।',
    pillar3Title: 'पारदर्शी एवं निःशुल्क सेवा',
    pillar3Text:
      'बिना किसी छिपे शुल्क अथवा अनावश्यक भ्रामक दावों के सभी मुख्य वैदिक उपकरणों की सुलभ उपलब्धता।',
    traditionTitle: 'परंपरा और आधुनिक तकनीक का अद्भुत संगम',
    traditionText:
      'ज्योतिष केवल भविष्य जानने का साधन नहीं, बल्कि आत्म-सुधार और काल-ज्ञान का एक दिव्य दर्पण है। JyotishWala के माध्यम से हमारा प्रयास है कि भारत की यह अमूल्य धरोहर आधुनिक डिजिटल युग में भी अपनी संपूर्ण गरिमा और पवित्रता के साथ जन-जन तक पहुँचे।',
    contactEmail: 'jyotishwaala@gmail.com',
    founderName: 'आचार्य परेश्वर भारद्वाज (Pareshwar Bhardwaj)',
    education: 'आचार्य इन पुराणेतिहास (Acharya in Puranetihas)',
    university: 'सम्पूर्णानन्द संस्कृत विश्वविद्यालय, वाराणसी (उत्तर प्रदेश)'
  },
  privacy: {
    title: 'गोपनीयता नीति (Privacy Policy)',
    tagline: 'JyotishWala पर आपकी व्यक्तिगत जानकारी, कुंडली विवरण एवं डेटा सुरक्षा नीति',
    badgeText: 'डेटा गोपनीयता हमारी सर्वोच्च प्रतिबद्धता है',
    lastUpdated: '5 नवंबर 2026',
    section1Title: '1. हम कौन सा डेटा एकत्र करते हैं?',
    section1Text:
      'जब आप JyotishWala का उपयोग करते हैं, तो हम केवल वही जानकारी लेते हैं जो आपकी कुंडली, मिलान या पंचांग गणना के लिए अनिवार्य होती है—जैसे नाम, जन्म तिथि, जन्म समय और शहर। यदि आप ज्योतिषी से परामर्श लेते हैं, तो संपर्क हेतु आपका ईमेल अथवा मोबाइल नंबर दर्ज किया जाता है।',
    section2Title: '2. आपकी जन्म कुंडली और डेटा का भंडारण (Local Storage)',
    section2Text:
      'आपकी सहेजी गई जन्म कुंडलियां और व्यक्तिगत सेटिंग्स मुख्य रूप से आपके अपने डिवाइस (ब्राउज़र / ऐप लोकल स्टोरेज) में ही सुरक्षित रहती हैं। हम आपकी अनुमति के बिना आपकी कुंडलियों या व्यक्तिगत डेटा को किसी तीसरे पक्ष (Third Party) के साथ न तो साझा करते हैं और न ही बेचते हैं।',
    section3Title: '3. डेटा सुरक्षा एवं एन्क्रिप्शन',
    section3Text:
      'JyotishWala आधुनिक SSL/TLS सुरक्षा प्रोटोकॉल का पालन करता है। सभी नेटवर्क अनुरोध सुरक्षित एवं एन्क्रिप्टेड होते हैं ताकि आपके डेटा की अखंडता बनी रहे।',
    section4Title: '4. कुकीज़ एवं अनुमतियाँ',
    section4Text:
      'हम केवल ऐप की प्राथमिक प्राथमिकताओं जैसे भाषा (हिंदी/अंग्रेजी), डार्क मोड थीम और पसंदीदा शहर को याद रखने के लिए स्थानीय भंडारण (Local Storage) का उपयोग करते हैं। हम किसी भी प्रकार के अनचाहे विज्ञापनों या क्रॉस-साइट ट्रैकिंग के लिए कुकीज़ का उपयोग नहीं करते हैं।',
    section5Title: '5. संपर्क एवं शिकायत निवारण',
    section5Text:
      'यदि आपके पास हमारी गोपनीयता नीति या अपने डेटा से संबंधित कोई प्रश्न अथवा सुझाव है, तो आप सीधे हमारे आधिकारिक ईमेल पते पर संपर्क कर सकते हैं। हमारी तकनीकी एवं ज्योतिषीय टीम 24-48 घंटों के भीतर आपकी सहायता करेगी।',
    contactEmail: 'jyotishwaala@gmail.com'
  },
  slides: DEFAULT_HOME_SLIDES
};

const STORAGE_KEY = 'jyotishwala_site_content_config';

export const getSiteContent = (): SiteContentConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    const isWpSynced = localStorage.getItem('jyotishwala_wp_slides_synced') === '1';
    return {
      sankalp: { ...DEFAULT_SITE_CONTENT.sankalp, ...(parsed.sankalp || {}) },
      about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
      privacy: { ...DEFAULT_SITE_CONTENT.privacy, ...(parsed.privacy || {}) },
      slides: Array.isArray(parsed.slides)
        ? (parsed.slides.length === 0 && !isWpSynced ? DEFAULT_HOME_SLIDES : parsed.slides)
        : DEFAULT_HOME_SLIDES
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
};

export const saveSiteContent = (config: SiteContentConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('jyotishwala_site_content_changed', { detail: config }));
  } catch (err) {
    console.error('Failed to save site content to localStorage', err);
  }
};

export const updateSankalpContent = (sankalp: Partial<SankalpContentConfig>): SiteContentConfig => {
  const current = getSiteContent();
  const updated: SiteContentConfig = {
    ...current,
    sankalp: { ...current.sankalp, ...sankalp }
  };
  saveSiteContent(updated);
  return updated;
};

export const updateAboutUsContent = (about: Partial<AboutUsContentConfig>): SiteContentConfig => {
  const current = getSiteContent();
  const updated: SiteContentConfig = {
    ...current,
    about: { ...current.about, ...about }
  };
  saveSiteContent(updated);
  return updated;
};

export const updatePrivacyContent = (privacy: Partial<PrivacyPolicyContentConfig>): SiteContentConfig => {
  const current = getSiteContent();
  const updated: SiteContentConfig = {
    ...current,
    privacy: { ...current.privacy, ...privacy }
  };
  saveSiteContent(updated);
  return updated;
};

export const updateHomeSlides = (slides: HomeSlideItem[]): SiteContentConfig => {
  const current = getSiteContent();
  const updated: SiteContentConfig = {
    ...current,
    slides
  };
  saveSiteContent(updated);
  return updated;
};

export const resetSiteContent = (): SiteContentConfig => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent('jyotishwala_site_content_changed', { detail: DEFAULT_SITE_CONTENT })
    );
  } catch (err) {
    console.error('Failed to reset site content', err);
  }
  return DEFAULT_SITE_CONTENT;
};

