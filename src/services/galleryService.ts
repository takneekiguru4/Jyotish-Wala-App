export type GalleryCategory = string;

export interface GalleryPhotoItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  /**
   * Optional array of photos belonging to the same Puja / event group.
   * When length > 1, clicking the card opens the group viewer showing all photos in this group.
   */
  groupImages?: string[];
  location: string;
  date: string; // YYYY-MM-DD
  acharyaName?: string;
  description: string;
}

export interface GalleryPageMeta {
  pageTitle: string;
  pageTagline: string;
  countBadgeText: string;
  // Teal Inner Card Settings
  showTealBanner: boolean;
  organizationBannerBadge: string;
  organizationBannerTitle: string;
  organizationBannerSubtitle: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  // Category Tabs List
  categories: string[];
  // Bottom Contact Card Settings
  showBottomCard: boolean;
  bottomCardTitle: string;
  bottomCardDescription: string;
  bottomCardButtonText: string;
}

export const DEFAULT_GALLERY_CATEGORIES: string[] = [
  'पूजा-पाठ व अनुष्ठान',
  'महायज्ञ एवं हवन',
  'रुद्राभिषेक एवं शिव पूजन',
  'ज्योतिष परामर्श व सम्मेलन',
  'ग्रह शांति एवं रत्न संस्कार',
  'तीर्थ एवं मंदिर दर्शन'
];

export const GALLERY_CATEGORIES = DEFAULT_GALLERY_CATEGORIES;

export const DEFAULT_GALLERY_META: GalleryPageMeta = {
  pageTitle: 'पूजा-पाठ एवं संस्थान कार्य गैलरी',
  pageTagline:
    'JyotishWala संस्थान द्वारा संपन्न वैदिक पूजा-पाठ, रुद्राभिषेक, नवग्रह शांति महायज्ञ एवं ज्योतिषीय कार्यों की झलकियां',
  countBadgeText: 'दिव्य झलकियां',
  showTealBanner: true,
  organizationBannerBadge: 'संस्थान पूजा-पाठ एवं वैदिक अनुष्ठान दर्शन',
  organizationBannerTitle: 'प्रामाणिक काशी एवं ऋषिकेश परंपरा द्वारा वैदिक अनुष्ठान',
  organizationBannerSubtitle:
    'आचार्य परेश्वर भारद्वाज एवं विद्वान वैदिक आचार्यों के सान्निध्य में संपन्न धार्मिक अनुष्ठान, हवन, कथा एवं ज्योतिष सेवा कार्य।',
  stat1Value: '500+',
  stat1Label: 'संपन्न अनुष्ठान',
  stat2Value: 'काशी-ऋषिकेश',
  stat2Label: 'वैदिक परंपरा',
  stat3Value: '100%',
  stat3Label: 'शास्त्रीय विधि',
  categories: DEFAULT_GALLERY_CATEGORIES,
  showBottomCard: true,
  bottomCardTitle: 'वैदिक पूजा-पाठ, अनुष्ठान एवं ज्योतिष परामर्श हेतु संपर्क',
  bottomCardDescription:
    'JyotishWala संस्थान द्वारा काशी एवं ऋषिकेश के विद्वान आचार्यों के माध्यम से महारुद्राभिषेक, महामृत्युंजय जप, नवग्रह शांति, कालसर्प व मांगलिक दोष निवारण, वास्तु पूजन तथा जन्मकुंडली परामर्श पूर्ण शास्त्रीय विधि से संपन्न कराए जाते हैं।',
  bottomCardButtonText: 'पंडित जी से बात करें'
};

export const DEFAULT_GALLERY_PHOTOS: GalleryPhotoItem[] = [
  {
    id: 'gal_1',
    title: 'काशी विश्वनाथ धाम में महारुद्राभिषेक अनुष्ठान',
    category: 'रुद्राभिषेक एवं शिव पूजन',
    imageUrl:
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=85',
    groupImages: [
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85'
    ],
    location: 'वाराणसी (काशी), उत्तर प्रदेश',
    date: '2026-10-28',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'श्रावण एवं कार्तिक मास के विशेष पर्व पर ग्यारह वैदिक ब्राह्मणों द्वारा शुक्ल यजुर्वेदीय रुद्राष्टाध्यायी पाठ के साथ संपन्न दिव्य महारुद्राभिषेक एवं बिल्वपत्र अर्पण।'
  },
  {
    id: 'gal_2',
    title: 'ऋषिकेश गंगा तट पर नवग्रह शांति एवं महामृत्युंजय हवन',
    category: 'महायज्ञ एवं हवन',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
    groupImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85'
    ],
    location: 'परमार्थ निकेतन घाट, ऋषिकेश',
    date: '2026-10-22',
    acharyaName: 'आचार्य परेश्वर भारद्वाज एवं आचार्य मंडल',
    description:
      'यजमान परिवार के सकल मनोरथ सिद्धि, आरोग्य एवं दीर्घायु की कामना से सवा लाख महामृत्युंजय मंत्र जप के उपरांत दशांश हवन एवं पूर्णाहुति का भव्य दृश्य।'
  },
  {
    id: 'gal_3',
    title: 'दशाश्वमेध घाट वाराणसी में भव्य सांध्य गंगा आरती दर्शन',
    category: 'तीर्थ एवं मंदिर दर्शन',
    imageUrl:
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85',
    location: 'दशाश्वमेध घाट, वाराणसी',
    date: '2026-10-18',
    acharyaName: 'ज्योतिषवाला काशी केंद्र',
    description:
      'माँ भगवती गंगा के पावन तट पर सहस्र दीपों एवं शंखध्वनि के साथ संपन्न सांध्यकालीन महाआरती एवं विश्व कल्याण प्रार्थना।'
  },
  {
    id: 'gal_4',
    title: 'दीपावली महालक्ष्मी-कुबेर षोडशोपचार पूजन एवं श्रीसूक्त पाठ',
    category: 'पूजा-पाठ व अनुष्ठान',
    imageUrl:
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
    groupImages: [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85'
    ],
    location: 'वाराणसी, उत्तर प्रदेश',
    date: '2026-10-15',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'स्थिर वृषभ एवं सिंह लग्न में कमल पुष्पों, अष्टगंध एवं शुद्ध घृत दीपों द्वारा संपन्न श्री महालक्ष्मी-गणेश एवं कुबेर यंत्र अभिषेक अनुष्ठान।'
  },
  {
    id: 'gal_5',
    title: 'प्राचीन ताड़पत्र एवं हस्तलिखित जन्मकुंडली शास्त्र अनुसंधान',
    category: 'ज्योतिष परामर्श व सम्मेलन',
    imageUrl:
      'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=1200&q=85',
    location: 'सम्पूर्णानन्द संस्कृत विश्वविद्यालय परिसर, वाराणसी',
    date: '2026-10-10',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'बृहत्पाराशर होराशास्त्र, सूर्य सिद्धांत एवं प्राचीन पंचांग पांडुलिपियों के आधार पर सूक्ष्म ग्रह गणित व फलित ज्योतिष पर शोध कार्य।'
  },
  {
    id: 'gal_6',
    title: 'नवग्रह रत्न प्राण-प्रतिष्ठा एवं अभिमंत्रण संस्कार',
    category: 'ग्रह शांति एवं रत्न संस्कार',
    imageUrl:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85',
    location: 'ऋषिकेश, उत्तराखंड',
    date: '2026-10-05',
    acharyaName: 'आचार्य पं. रामकृष्ण शास्त्री',
    description:
      'जातक की कुंडली के अनुसार चयनित पुखराज, नीलम एवं माणिक्य रत्नों को पंचामृत स्नान व वैदिक बीज मंत्रों से अभिमंत्रित कर धारण कराने की विधि।'
  },
  {
    id: 'gal_7',
    title: 'शारदीय नवरात्रि दुर्गा सप्तशती पाठ एवं कन्या पूजन',
    category: 'पूजा-पाठ व अनुष्ठान',
    imageUrl:
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1200&q=85',
    groupImages: [
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=85'
    ],
    location: 'काशी शक्तिपीठ, वाराणसी',
    date: '2026-09-29',
    acharyaName: 'ज्योतिषवाला अनुष्ठान मंडल',
    description:
      'नवरात्रि के पावन अवसर पर अखंड ज्योति कलश स्थापना, शतचंडी दुर्गा सप्तशती पाठ एवं अष्टमी-नवमी हवन अनुष्ठान।'
  },
  {
    id: 'gal_8',
    title: 'वैदिक विवाह संस्कार एवं अष्टकूट कुंडली मिलान परामर्श',
    category: 'ज्योतिष परामर्श व सम्मेलन',
    imageUrl:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    location: 'जयपुर एवं दिल्ली केंद्र',
    date: '2026-09-24',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'वर-वधू के सुखद दाम्पत्य जीवन हेतु शास्त्रीय गुण मिलान, मांगलिक दोष परिहार एवं शुद्ध लग्न मुहूर्त में संपन्न वैदिक पाणिग्रहण संस्कार।'
  },
  {
    id: 'gal_9',
    title: 'हरिद्वार हर की पौड़ी पर पितृ तर्पण एवं नारायण बलि अनुष्ठान',
    category: 'पूजा-पाठ व अनुष्ठान',
    imageUrl:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
    location: 'हर की पौड़ी, हरिद्वार',
    date: '2026-09-18',
    acharyaName: 'आचार्य डॉ. विश्वनाथ द्विवेदी',
    description:
      'पितृ पक्ष में पूर्वजों की आत्मशांति एवं पितृ दोष निवारण हेतु गंगा तट पर विधिपूर्वक तर्पण, पिंडदान एवं ब्राह्मण भोजन सेवा।'
  },
  {
    id: 'gal_10',
    title: 'उज्जैन महाकालेश्वर क्षेत्र में कालसर्प एवं राहु-केतु शांति यज्ञ',
    category: 'ग्रह शांति एवं रत्न संस्कार',
    imageUrl:
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
    location: 'क्षिप्रा तट, उज्जैन (मध्य प्रदेश)',
    date: '2026-09-12',
    acharyaName: 'आचार्य पं. कैलाश नाथ त्रिपाठी',
    description:
      'जन्मकुंडली में स्थित राहु-केतु जनित दोषों एवं संघर्षों के निवारण हेतु वैदिक नाग सूक्त पाठ और रुद्राभिषेक पूजन।'
  },
  {
    id: 'gal_11',
    title: 'श्री सत्यनारायण व्रत कथा एवं नूतन गृह प्रवेश वास्तु पूजन',
    category: 'पूजा-पाठ व अनुष्ठान',
    imageUrl:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
    location: 'लखनऊ, उत्तर प्रदेश',
    date: '2026-09-05',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'शुभ मुहूर्त में वास्तु पुरुष पूजन, कलश यात्रा, द्वार तोरण वंदन एवं सपरिवार श्री सत्यनारायण भगवान की कथा व हवन।'
  },
  {
    id: 'gal_12',
    title: 'अखिल भारतीय वैदिक ज्योतिष एवं पंचांग विद्वत संगोष्ठी',
    category: 'ज्योतिष परामर्श व सम्मेलन',
    imageUrl:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=85',
    location: 'वाराणसी, उत्तर प्रदेश',
    date: '2026-08-27',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'काशी और ऋषिकेश के मूर्धन्य पंचांगकारों व ज्योतिषाचार्यों के साथ संवत्सर गणना, ग्रहण निर्णय एवं पर्व तिथियों पर विशेष चर्चा।'
  },
  {
    id: 'gal_13',
    title: 'प्रयागराज संगम तट पर माघी पूर्णिमा कल्पवास एवं महायज्ञ',
    category: 'महायज्ञ एवं हवन',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    location: 'त्रिवेणी संगम, प्रयागराज',
    date: '2026-08-19',
    acharyaName: 'ज्योतिषवाला सेवा ट्रस्ट',
    description:
      'गंगा, यमुना और अदृश्य सरस्वती के पावन संगम पर प्रातःकालीन स्नान, सूर्य अर्घ्य, विष्णु सहस्रनाम पाठ एवं अन्नदान सेवा।'
  },
  {
    id: 'gal_14',
    title: 'बगलामुखी एवं प्रत्यंगिरा कवच विशेष हवन अनुष्ठान',
    category: 'महायज्ञ एवं हवन',
    imageUrl:
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85',
    location: 'नलखेड़ा एवं काशी केंद्र',
    date: '2026-08-11',
    acharyaName: 'आचार्य पं. गिरिजा शंकर जोशी',
    description:
      'न्यायालयीय विवाद, शत्रु बाधा निवारण एवं व्यवसायिक उन्नति हेतु पीताम्बरा माँ बगलामुखी के छत्तीस हजार मंत्रों का जप व हरिद्रा हवन।'
  },
  {
    id: 'gal_15',
    title: 'केदारनाथ एवं बद्रीनाथ धाम यात्रा व अभिषेक दर्शन',
    category: 'तीर्थ एवं मंदिर दर्शन',
    imageUrl:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85',
    location: 'रुद्रप्रयाग / चमोली, उत्तराखंड',
    date: '2026-08-03',
    acharyaName: 'ज्योतिषवाला उत्तराखंड केंद्र',
    description:
      'हिमालय की गोद में स्थित द्वादश ज्योतिर्लिंग श्री केदारनाथ भगवान एवं श्री बद्रीविशाल के पावन दर्शन व विश्व शांति प्रार्थना।'
  },
  {
    id: 'gal_16',
    title: 'मंगल भात पूजन एवं अंगारक दोष निवारण अनुष्ठान',
    category: 'ग्रह शांति एवं रत्न संस्कार',
    imageUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85',
    location: 'मंगलनाथ मंदिर क्षेत्र, उज्जैन',
    date: '2026-07-26',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'कुंडली में उग्र मांगलिक दोष एवं भूमि-भवन संबंधी बाधाओं की शांति हेतु वैदिक मंगल स्तोत्र पाठ के साथ संपन्न विशेष अभिषेक।'
  },
  {
    id: 'gal_17',
    title: 'गुरु पूर्णिमा व्यास पूजन एवं संस्कृत बटुक सम्मान समारोह',
    category: 'ज्योतिष परामर्श व सम्मेलन',
    imageUrl:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85',
    location: 'वाराणसी (काशी), उत्तर प्रदेश',
    date: '2026-07-19',
    acharyaName: 'आचार्य परेश्वर भारद्वाज',
    description:
      'आषाढ़ पूर्णिमा (गुरु पूर्णिमा) के पावन पर्व पर महर्षि वेदव्यास जी का पूजन एवं वेद-ज्योतिष के मेधावी विद्यार्थियों को पंचांग व ग्रंथ भेंट।'
  },
  {
    id: 'gal_18',
    title: 'सुंदरकांड सामूहिक पाठ एवं श्री हनुमत महाआरती',
    category: 'पूजा-पाठ व अनुष्ठान',
    imageUrl:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
    location: 'संकटमोचन क्षेत्र, वाराणसी',
    date: '2026-07-11',
    acharyaName: 'ज्योतिषवाला भक्त मंडल',
    description:
      'शनि साढ़ेसाती, ढैय्या एवं अज्ञात भय के निवारण हेतु मंगलवार व शनिवार को आयोजित संगीतमय सुंदरकांड पाठ, सिंदूर चोला अर्पण एवं महाआरती।'
  }
];

const GALLERY_PHOTOS_STORAGE_KEY = 'jyotishwala_gallery_photos_v2';
const GALLERY_META_STORAGE_KEY = 'jyotishwala_gallery_meta_v2';

function notifyGalleryChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jyotishwala_gallery_changed'));
  }
}

export function getGalleryMeta(): GalleryPageMeta {
  try {
    const raw = localStorage.getItem(GALLERY_META_STORAGE_KEY);
    if (!raw) return DEFAULT_GALLERY_META;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_GALLERY_META,
      ...(parsed || {}),
      categories:
        Array.isArray(parsed?.categories) && parsed.categories.length > 0
          ? parsed.categories
          : DEFAULT_GALLERY_CATEGORIES
    };
  } catch {
    return DEFAULT_GALLERY_META;
  }
}

export function saveGalleryMeta(meta: Partial<GalleryPageMeta>): GalleryPageMeta {
  const current = getGalleryMeta();
  const updated: GalleryPageMeta = {
    ...current,
    ...meta,
    categories:
      Array.isArray(meta.categories) && meta.categories.length > 0
        ? meta.categories
        : current.categories
  };
  try {
    localStorage.setItem(GALLERY_META_STORAGE_KEY, JSON.stringify(updated));
    notifyGalleryChanged();
  } catch (err) {
    console.error('Failed to save gallery meta:', err);
  }
  return updated;
}

export function getGalleryPhotos(): GalleryPhotoItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_PHOTOS_STORAGE_KEY);
    if (!raw) return DEFAULT_GALLERY_PHOTOS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length > 0 || localStorage.getItem('jyotishwala_wp_gallery_synced') === '1') {
        return parsed;
      }
    }
    return DEFAULT_GALLERY_PHOTOS;
  } catch {
    return DEFAULT_GALLERY_PHOTOS;
  }
}

export function saveGalleryPhoto(item: GalleryPhotoItem): GalleryPhotoItem[] {
  const current = getGalleryPhotos();
  const normalizedGroup =
    Array.isArray(item.groupImages) && item.groupImages.filter(Boolean).length > 0
      ? item.groupImages.filter(Boolean)
      : [item.imageUrl];
  const normalizedItem: GalleryPhotoItem = {
    ...item,
    imageUrl: normalizedGroup[0] || item.imageUrl,
    groupImages: normalizedGroup.length > 1 ? normalizedGroup : undefined
  };

  const idx = current.findIndex((p) => p.id === normalizedItem.id);
  let updated: GalleryPhotoItem[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = normalizedItem;
  } else {
    updated = [normalizedItem, ...current];
  }
  try {
    localStorage.setItem(GALLERY_PHOTOS_STORAGE_KEY, JSON.stringify(updated));
    notifyGalleryChanged();
  } catch (err) {
    console.error('Failed to save gallery photo:', err);
  }
  return updated;
}

export function deleteGalleryPhoto(id: string): GalleryPhotoItem[] {
  const current = getGalleryPhotos();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(GALLERY_PHOTOS_STORAGE_KEY, JSON.stringify(updated));
    notifyGalleryChanged();
  } catch (err) {
    console.error('Failed to delete gallery photo:', err);
  }
  return updated;
}

export function resetGalleryToDefaults(): {
  meta: GalleryPageMeta;
  photos: GalleryPhotoItem[];
} {
  try {
    localStorage.removeItem(GALLERY_PHOTOS_STORAGE_KEY);
    localStorage.removeItem(GALLERY_META_STORAGE_KEY);
    notifyGalleryChanged();
  } catch (err) {
    console.error('Failed to reset gallery:', err);
  }
  return {
    meta: DEFAULT_GALLERY_META,
    photos: DEFAULT_GALLERY_PHOTOS
  };
}
