export type ReviewServiceCategory =
  | 'सम्पूर्ण ऐप अनुभव (JyotishWala)'
  | 'दैनिक पंचांग एवं मुहूर्त'
  | 'जन्मकुंडली एवं फलादेश'
  | 'कुंडली मिलान (अष्टकूट)'
  | 'पंडित जी से परामर्श'
  | 'पूजा-पाठ एवं वैदिक अनुष्ठान'
  | 'दैनिक व वार्षिक राशिफल'
  | 'संकल्प मंत्र एवं सनातन धर्म'
  | 'ज्योतिष कैलकुलेटर (रत्न/अंक/साढ़ेसाती)'
  | 'व्रत एवं त्योहार कैलेंडर';

export type ReviewStatus = 'approved' | 'pending' | 'declined';

export interface AppReviewItem {
  id: string;
  userName: string;
  userCity: string;
  serviceCategory: ReviewServiceCategory;
  rating: number; // 1 to 5
  comment: string;
  date: string; // YYYY-MM-DD
  status: ReviewStatus;
  adminReply?: string;
  isVerified?: boolean;
}

export interface ReviewSystemMeta {
  sectionTitle: string;
  sectionSubtitle: string;
  pageTitle: string;
  pageTagline: string;
  autoApproveNewReviews: boolean;
}

export const REVIEW_SERVICE_CATEGORIES: ReviewServiceCategory[] = [
  'सम्पूर्ण ऐप अनुभव (JyotishWala)',
  'दैनिक पंचांग एवं मुहूर्त',
  'जन्मकुंडली एवं फलादेश',
  'कुंडली मिलान (अष्टकूट)',
  'पंडित जी से परामर्श',
  'पूजा-पाठ एवं वैदिक अनुष्ठान',
  'दैनिक व वार्षिक राशिफल',
  'संकल्प मंत्र एवं सनातन धर्म',
  'ज्योतिष कैलकुलेटर (रत्न/अंक/साढ़ेसाती)',
  'व्रत एवं त्योहार कैलेंडर'
];

export const DEFAULT_REVIEW_META: ReviewSystemMeta = {
  sectionTitle: 'यजमान एवं उपयोगकर्ता समीक्षाएं (User Reviews)',
  sectionSubtitle:
    'पंचांग, जन्मकुंडली, कुंडली मिलान, पूजा-पाठ अनुष्ठान एवं पंडित परामर्श सेवाओं पर देशभर के उपयोगकर्ताओं के अनुभव',
  pageTitle: 'यजमान एवं उपयोगकर्ता समीक्षाएं',
  pageTagline:
    'JyotishWala की सभी ज्योतिषीय एवं वैदिक सेवाओं के लिए उपयोगकर्ताओं की प्रामाणिक राय व रेटिंग',
  autoApproveNewReviews: true
};

export const DEFAULT_REVIEWS: AppReviewItem[] = [
  {
    id: 'rev_1',
    userName: 'राजीव शर्मा',
    userCity: 'वाराणसी, उत्तर प्रदेश',
    serviceCategory: 'दैनिक पंचांग एवं मुहूर्त',
    rating: 5,
    comment:
      'काशी और ऋषिकेश परंपरा पर आधारित एकदम सटीक पंचांग है। तिथि, नक्षत्र, चौघड़िया और राहुकाल का समय शास्त्रीय पंचांग से पूर्णतः मेल खाता है। प्रतिदिन पूजा से पहले मैं इसी ऐप का उपयोग करता हूँ।',
    date: '2026-10-30',
    status: 'approved',
    adminReply:
      'सादर धन्यवाद राजीव जी! काशी एवं ऋषिकेश की शास्त्रीय गणना को आप तक शुद्ध रूप में पहुँचाना ही हमारा संकल्प है।',
    isVerified: true
  },
  {
    id: 'rev_2',
    userName: 'डॉ. अनुराधा मिश्रा',
    userCity: 'लखनऊ, उत्तर प्रदेश',
    serviceCategory: 'पंडित जी से परामर्श',
    rating: 5,
    comment:
      'आचार्य परेश्वर भारद्वाज जी से जन्मकुंडली एवं करियर के विषय में परामर्श लिया। उनके द्वारा बताए गए वैदिक उपाय अत्यंत सरल और प्रभावी हैं। बात करने का अनुभव बहुत ही संतोषजनक रहा।',
    date: '2026-10-27',
    status: 'approved',
    adminReply: 'हार्दिक आभार डॉ. अनुराधा जी! महादेव आपकी सभी मनोकामनाएं पूर्ण करें।',
    isVerified: true
  },
  {
    id: 'rev_3',
    userName: 'विकास अग्रवाल',
    userCity: 'जयपुर, राजस्थान',
    serviceCategory: 'कुंडली मिलान (अष्टकूट)',
    rating: 5,
    comment:
      'मेरे छोटे भाई के विवाह हेतु अष्टकूट 36 गुण मिलान और मांगलिक दोष की जांच इसी ऐप से की। भकूट, नाड़ी और गण दोष का विवरण बहुत साफ और सरल हिंदी में समझाया गया है।',
    date: '2026-10-24',
    status: 'approved',
    isVerified: true
  },
  {
    id: 'rev_4',
    userName: 'सुनीता बहुगुणा',
    userCity: 'ऋषिकेश, उत्तराखंड',
    serviceCategory: 'संकल्प मंत्र एवं सनातन धर्म',
    rating: 5,
    comment:
      'दैनिक संकल्प मंत्र वाला फीचर अद्भुत है! आज का संवत्सर, अयन, ऋतु, मास, पक्ष, तिथि और नक्षत्र अपने आप मंत्र में जुड़ जाते हैं, जिससे घर पर पूजा में संकल्प बोलना बहुत आसान हो गया है।',
    date: '2026-10-21',
    status: 'approved',
    adminReply: 'धन्यवाद सुनीता जी! दैनिक पूजा में प्रत्येक सनातनी आसानी से शुद्ध संकल्प ले सके, इसी उद्देश्य से यह सुविधा बनाई गई है।',
    isVerified: true
  },
  {
    id: 'rev_5',
    userName: 'आशुतोष तिवारी',
    userCity: 'प्रयागराज, उत्तर प्रदेश',
    serviceCategory: 'पूजा-पाठ एवं वैदिक अनुष्ठान',
    rating: 5,
    comment:
      'संस्थान के आचार्यों द्वारा हमारे परिवार के लिए रुद्राभिषेक एवं नवग्रह शांति अनुष्ठान पूर्ण वैदिक विधि से संपन्न कराया गया। गैलरी में अनुष्ठान की झलकियां देखकर मन प्रसन्न हो जाता है।',
    date: '2026-10-18',
    status: 'approved',
    isVerified: true
  },
  {
    id: 'rev_6',
    userName: 'नेहा कुलकर्णी',
    userCity: 'पुणे, महाराष्ट्र',
    serviceCategory: 'जन्मकुंडली एवं फलादेश',
    rating: 5,
    comment:
      'जन्मकुंडली चार्ट, ग्रह स्पष्ट, विंशोत्तरी दशा और फलादेश एक ही जगह तुरंत बन जाते हैं। साथ ही कुंडली को सुरक्षित सहेजने (Save) की सुविधा भी बहुत उपयोगी है।',
    date: '2026-10-14',
    status: 'approved',
    isVerified: true
  },
  {
    id: 'rev_7',
    userName: 'मनीष पाण्डेय',
    userCity: 'नई दिल्ली',
    serviceCategory: 'ज्योतिष कैलकुलेटर (रत्न/अंक/साढ़ेसाती)',
    rating: 4,
    comment:
      'रत्न परामर्श और शनि साढ़ेसाती कैलकुलेटर बहुत सटीक जानकारी देते हैं। किस रत्न को किस धातु और किस उंगली में धारण करना है, यह विस्तार से बताया गया है।',
    date: '2026-10-10',
    status: 'approved',
    isVerified: true
  },
  {
    id: 'rev_8',
    userName: 'प्रीति चतुर्वेदी',
    userCity: 'उज्जैन, मध्य प्रदेश',
    serviceCategory: 'व्रत एवं त्योहार कैलेंडर',
    rating: 5,
    comment:
      'त्योहार कैलेंडर में किसी भी तारीख का व्रत-त्योहार, उसकी पूजा विधि, कथा और महत्व पढ़ने को मिल जाता है। एकादशी और प्रदोष व्रत की तिथियां बिल्कुल प्रामाणिक हैं।',
    date: '2026-10-06',
    status: 'approved',
    isVerified: true
  },
  {
    id: 'rev_9',
    userName: 'सौरभ वर्मा',
    userCity: 'इंदौर, मध्य प्रदेश',
    serviceCategory: 'दैनिक व वार्षिक राशिफल',
    rating: 5,
    comment:
      'दैनिक, मासिक और वार्षिक राशिफल में करियर, स्वास्थ्य और वैदिक उपाय बहुत ही सटीक होते हैं। ऐप का डिजाइन और रंग आँखों को बहुत सुकून देते हैं।',
    date: '2026-10-02',
    status: 'approved',
    isVerified: true
  },
  {
    id: 'rev_10',
    userName: 'आचार्य गौरव शास्त्री',
    userCity: 'हरिद्वार, उत्तराखंड',
    serviceCategory: 'सम्पूर्ण ऐप अनुभव (JyotishWala)',
    rating: 5,
    comment:
      'ज्योतिष के विद्यार्थियों और सामान्य श्रद्धालुओं दोनों के लिए JyotishWala एक संपूर्ण ऐप है। पंचांग से लेकर ग्रह गोचर और जप माला तक सब कुछ एक ही स्थान पर उपलब्ध है।',
    date: '2026-09-28',
    status: 'approved',
    isVerified: true
  }
];

const REVIEWS_STORAGE_KEY = 'jyotishwala_reviews_list_v1';
const REVIEWS_META_STORAGE_KEY = 'jyotishwala_reviews_meta_v1';

function notifyReviewsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jyotishwala_reviews_changed'));
  }
}

export function getReviewMeta(): ReviewSystemMeta {
  try {
    const raw = localStorage.getItem(REVIEWS_META_STORAGE_KEY);
    if (!raw) return DEFAULT_REVIEW_META;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_REVIEW_META,
      ...(parsed || {})
    };
  } catch {
    return DEFAULT_REVIEW_META;
  }
}

export function saveReviewMeta(meta: Partial<ReviewSystemMeta>): ReviewSystemMeta {
  const current = getReviewMeta();
  const updated: ReviewSystemMeta = {
    ...current,
    ...meta
  };
  try {
    localStorage.setItem(REVIEWS_META_STORAGE_KEY, JSON.stringify(updated));
    notifyReviewsChanged();
  } catch (err) {
    console.error('Failed to save review meta:', err);
  }
  return updated;
}

export function getReviews(): AppReviewItem[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return DEFAULT_REVIEWS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length > 0 || localStorage.getItem('jyotishwala_wp_reviews_synced') === '1') {
        return parsed;
      }
    }
    return DEFAULT_REVIEWS;
  } catch {
    return DEFAULT_REVIEWS;
  }
}

export function getApprovedReviews(): AppReviewItem[] {
  return getReviews().filter((r) => r.status === 'approved');
}

export function saveReviewItem(item: AppReviewItem): AppReviewItem[] {
  const current = getReviews();
  const idx = current.findIndex((r) => r.id === item.id);
  let updated: AppReviewItem[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [item, ...current];
  }
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    notifyReviewsChanged();
  } catch (err) {
    console.error('Failed to save review:', err);
  }
  return updated;
}

export function submitUserReview(input: {
  userName: string;
  userCity: string;
  serviceCategory: ReviewServiceCategory;
  rating: number;
  comment: string;
}): { review: AppReviewItem; allReviews: AppReviewItem[] } {
  const meta = getReviewMeta();
  const todayIso = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().split('T')[0];
  const newReview: AppReviewItem = {
    id: `rev_user_${Date.now()}`,
    userName: input.userName.trim() || 'श्रद्धालु यजमान',
    userCity: input.userCity.trim() || 'भारत',
    serviceCategory: input.serviceCategory,
    rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
    comment: input.comment.trim(),
    date: todayIso,
    status: meta.autoApproveNewReviews ? 'approved' : 'pending',
    isVerified: true
  };
  const allReviews = saveReviewItem(newReview);
  void import('./wpApiClient')
    .then(({ submitReviewToWp }) => submitReviewToWp(input))
    .catch(() => undefined);
  return { review: newReview, allReviews };
}

export function updateReviewStatus(
  id: string,
  status: ReviewStatus
): AppReviewItem[] {
  const current = getReviews();
  const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    notifyReviewsChanged();
  } catch (err) {
    console.error('Failed to update review status:', err);
  }
  return updated;
}

export function deleteReviewItem(id: string): AppReviewItem[] {
  const current = getReviews();
  const updated = current.filter((r) => r.id !== id);
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    notifyReviewsChanged();
  } catch (err) {
    console.error('Failed to delete review:', err);
  }
  return updated;
}

export function resetReviewsToDefaults(): {
  meta: ReviewSystemMeta;
  reviews: AppReviewItem[];
} {
  try {
    localStorage.removeItem(REVIEWS_STORAGE_KEY);
    localStorage.removeItem(REVIEWS_META_STORAGE_KEY);
    notifyReviewsChanged();
  } catch (err) {
    console.error('Failed to reset reviews:', err);
  }
  return {
    meta: DEFAULT_REVIEW_META,
    reviews: DEFAULT_REVIEWS
  };
}
