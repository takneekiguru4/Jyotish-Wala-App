/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PanditProfile, PaymentReceiptSubmission } from '../types';

const STORAGE_KEY_PANDITS = 'jyotishwala_pandit_profiles_v3';
const LEGACY_STORAGE_KEY_PANDITS = 'jyotishwala_pandit_profiles_v2';
const STORAGE_KEY_PAYMENT_RECEIPTS = 'jyotishwala_payment_receipts_v1';
export const ADMIN_RECEIPT_EMAIL = 'takneekiguru4@gmail.com';

// Reliable self-contained Vedic Pandit portrait SVG data URIs (guaranteed to load offline & online)
function createPanditAvatarSvg(
  bgStart: string,
  bgEnd: string,
  shawlColor: string,
  skinColor: string,
  beardColor: string,
  tilakColor: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgStart}"/>
        <stop offset="100%" stop-color="${bgEnd}"/>
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="120" fill="url(#bg)"/>
    <circle cx="120" cy="108" r="76" fill="none" stroke="#FFF4D6" stroke-opacity="0.32" stroke-width="3" stroke-dasharray="6 4"/>
    <!-- Shoulders & Saffron Angavastram -->
    <path d="M32 240 C38 176 74 156 120 156 C166 156 202 176 208 240 Z" fill="#FFF8EB"/>
    <path d="M46 240 C56 182 84 162 120 162 C156 162 184 182 194 240 Z" fill="${shawlColor}"/>
    <!-- Sacred Upavita / Border -->
    <path d="M84 166 L132 240" stroke="#FFD166" stroke-width="5" stroke-linecap="round"/>
    <!-- Rudraksha Mala -->
    <path d="M88 164 Q120 198 152 164" fill="none" stroke="#6B3E26" stroke-width="6" stroke-dasharray="3 7" stroke-linecap="round"/>
    <!-- Neck -->
    <rect x="102" y="134" width="36" height="32" rx="14" fill="${skinColor}"/>
    <!-- Ears -->
    <ellipse cx="72" cy="108" rx="9" ry="15" fill="${skinColor}"/>
    <ellipse cx="168" cy="108" rx="9" ry="15" fill="${skinColor}"/>
    <circle cx="72" cy="119" r="3.5" fill="#FFD166"/>
    <circle cx="168" cy="119" r="3.5" fill="#FFD166"/>
    <!-- Head -->
    <path d="M74 96 C74 58 94 44 120 44 C146 44 166 58 166 96 C166 134 146 152 120 152 C94 152 74 134 74 96 Z" fill="${skinColor}"/>
    <!-- Hair / Shikha Topknot Hint -->
    <path d="M75 88 C76 54 96 42 120 42 C144 42 164 54 165 88 C156 64 140 54 120 54 C100 54 84 64 75 88 Z" fill="${beardColor}"/>
    <!-- Tripundra & Kumkum Tilak on Forehead -->
    <line x1="100" y1="74" x2="140" y2="74" stroke="#FFF9E6" stroke-width="3" stroke-linecap="round"/>
    <line x1="97" y1="80" x2="143" y2="80" stroke="#FFF9E6" stroke-width="3" stroke-linecap="round"/>
    <line x1="100" y1="86" x2="140" y2="86" stroke="#FFF9E6" stroke-width="3" stroke-linecap="round"/>
    <circle cx="120" cy="80" r="5.5" fill="${tilakColor}"/>
    <!-- Eyebrows & Calm Eyes -->
    <path d="M90 95 Q102 90 112 95" fill="none" stroke="${beardColor}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M128 95 Q138 90 150 95" fill="none" stroke="${beardColor}" stroke-width="3.2" stroke-linecap="round"/>
    <circle cx="102" cy="103" r="4.2" fill="#1E293B"/>
    <circle cx="138" cy="103" r="4.2" fill="#1E293B"/>
    <circle cx="100.5" cy="101.5" r="1.3" fill="#FFFFFF"/>
    <circle cx="136.5" cy="101.5" r="1.3" fill="#FFFFFF"/>
    <!-- Nose -->
    <path d="M120 101 L117 117 L124 119" fill="none" stroke="#B07248" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Dignified Beard & Mustache -->
    <path d="M78 118 C80 146 98 160 120 160 C142 160 160 146 162 118 C152 130 138 136 120 136 C102 136 88 130 78 118 Z" fill="${beardColor}" fill-opacity="0.9"/>
    <path d="M98 126 Q120 120 142 126" fill="none" stroke="${beardColor}" stroke-width="4" stroke-linecap="round"/>
    <!-- Gentle Smile -->
    <path d="M108 131 Q120 138 132 131" fill="none" stroke="#8C3B2B" stroke-width="2.8" stroke-linecap="round"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PANDIT_AVATAR_1 = createPanditAvatarSvg('#006666', '#008080', '#FF7F33', '#F2C19E', '#E2E8F0', '#DC2626');
export const PANDIT_AVATAR_2 = createPanditAvatarSvg('#0D4A4A', '#007777', '#D97706', '#EBB48E', '#334155', '#E11D48');
export const PANDIT_AVATAR_3 = createPanditAvatarSvg('#005959', '#008080', '#EA580C', '#F4C6A8', '#CBD5E1', '#DC2626');
export const FALLBACK_PANDIT_AVATAR = PANDIT_AVATAR_1;

// Default clean SVG QR code data URI for initial sample
const SAMPLE_QR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="#ffffff" stroke="#008080" stroke-width="6"/>
    <rect x="20" y="20" width="50" height="50" fill="none" stroke="#008080" stroke-width="8"/>
    <rect x="35" y="35" width="20" height="20" fill="#008080"/>
    <rect x="130" y="20" width="50" height="50" fill="none" stroke="#008080" stroke-width="8"/>
    <rect x="145" y="35" width="20" height="20" fill="#008080"/>
    <rect x="20" y="130" width="50" height="50" fill="none" stroke="#008080" stroke-width="8"/>
    <rect x="35" y="145" width="20" height="20" fill="#008080"/>
    <rect x="85" y="85" width="30" height="30" fill="#FF7F33"/>
    <rect x="85" y="30" width="12" height="35" fill="#0D1B1E"/>
    <rect x="105" y="45" width="12" height="20" fill="#0D1B1E"/>
    <rect x="30" y="85" width="35" height="12" fill="#0D1B1E"/>
    <rect x="130" y="90" width="40" height="12" fill="#0D1B1E"/>
    <rect x="130" y="130" width="20" height="20" fill="#0D1B1E"/>
    <rect x="160" y="150" width="20" height="25" fill="#0D1B1E"/>
    <rect x="90" y="135" width="25" height="40" fill="#0D1B1E"/>
  </svg>`
)}`;

export const INITIAL_PANDITS: PanditProfile[] = [
  {
    id: 'pandit_1',
    name: 'पं. राधेश्याम शास्त्री',
    qualification: 'ज्योतिषाचार्य, काशी हिन्दू विश्वविद्यालय',
    experienceYears: 25,
    specialties: ['जन्मकुंडली विश्लेषण', 'कुंडली मिलान', 'दोष निवारण अनुष्ठान', 'वैदिक कर्मकांड'],
    languages: ['हिन्दी', 'संस्कृत'],
    mobile: '+91 98765 43210',
    email: 'radheshyam.shastri@jyotishwala.com',
    address: 'तपोवन, लक्ष्मण झूला मार्ग, ऋषिकेश, उत्तराखंड - 249192',
    avatar: PANDIT_AVATAR_1,
    qrCodeUrl: SAMPLE_QR_SVG,
    dakshinaInfo: 'परामर्श दक्षिणा: ₹501',
    about: 'काशी हिन्दू विश्वविद्यालय से ज्योतिष शास्त्र में आचार्य। विगत 25 वर्षों से ऋषिकेश एवं काशी से सटीक जन्मकुंडली फलादेश, विवाह मिलान तथा वैदिक अनुष्ठान मार्गदर्शन प्रदान कर रहे हैं।',
    isChief: true,
    displayOrder: 1
  },
  {
    id: 'pandit_2',
    name: 'आचार्य देवकीनंदन जोशी',
    qualification: 'वास्तु एवं धर्मशास्त्र विशेषज्ञ, संपूर्णानंद संस्कृत विश्वविद्यालय',
    experienceYears: 19,
    specialties: ['वास्तु शास्त्र', 'प्रश्न कुंडली', 'मुहूर्त निर्णय', 'व्यापार वृद्धि उपाय'],
    languages: ['हिन्दी', 'संस्कृत', 'मराठी'],
    mobile: '+91 98111 22334',
    email: 'devkinandan.joshi@jyotishwala.com',
    address: 'त्रिवेणी घाट मार्ग, ऋषिकेश, उत्तराखंड - 249201',
    avatar: PANDIT_AVATAR_2,
    qrCodeUrl: SAMPLE_QR_SVG,
    dakshinaInfo: 'परामर्श दक्षिणा: ₹351',
    about: 'उत्तराखंड के सुप्रसिद्ध ज्योतिर्विद एवं वास्तु विशेषज्ञ। भवन, कार्यालय एवं औद्योगिक वास्तु दोषों के वैदिक निवारण तथा शुभ मुहूर्त गणना में विशेष दक्षता।',
    isChief: false,
    displayOrder: 2
  },
  {
    id: 'pandit_3',
    name: 'पं. रामानंद त्रिवेदी',
    qualification: 'फलित ज्योतिष एवं रुद्राभिषेक आचार्य',
    experienceYears: 22,
    specialties: ['शुभ मुहूर्त निर्णय', 'महामृत्युंजय अनुष्ठान', 'कालसर्प व पितृ दोष', 'नामकरण संस्कार'],
    languages: ['हिन्दी', 'संस्कृत'],
    mobile: '+91 94120 55667',
    email: 'ramanand.trivedi@jyotishwala.com',
    address: 'स्वर्गाश्रम क्षेत्र, ऋषिकेश, उत्तराखंड - 249304',
    avatar: PANDIT_AVATAR_3,
    qrCodeUrl: SAMPLE_QR_SVG,
    dakshinaInfo: 'परामर्श दक्षिणा: ₹401',
    about: 'गंगा तट ऋषिकेश के परंपरागत पुरोहित कुल से। गृह प्रवेश, विवाह संस्कार, मुंडन एवं ग्रह शांति अनुष्ठानों के वरिष्ठ मार्गदर्शक।',
    isChief: false,
    displayOrder: 3
  }
];

export const VERIFIED_ASTROLOGERS = INITIAL_PANDITS;

function normalizePanditAvatar(pandit: PanditProfile, idx: number): PanditProfile {
  const defaultAvatars = [PANDIT_AVATAR_1, PANDIT_AVATAR_2, PANDIT_AVATAR_3];
  const fallback = defaultAvatars[idx % defaultAvatars.length];
  const rawAvatar = (pandit.avatar || '').trim();
  const isValidCustomImage =
    rawAvatar.startsWith('data:image/') ||
    rawAvatar.startsWith('https://') ||
    rawAvatar.startsWith('http://') ||
    rawAvatar.startsWith('/');
  const rawQr = (pandit.qrCodeUrl || '').trim();
  const isValidCustomQr =
    rawQr.startsWith('data:image/') ||
    rawQr.startsWith('https://') ||
    rawQr.startsWith('http://') ||
    rawQr.startsWith('/');
  return {
    ...pandit,
    avatar: isValidCustomImage ? rawAvatar : fallback,
    qrCodeUrl: isValidCustomQr ? rawQr : SAMPLE_QR_SVG
  };
}

export const STORAGE_KEY_CHIEF_ASTROLOGER = 'jyotishwala_chief_astrologer_v2';

export function getPandits(): PanditProfile[] {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY_PANDITS) ||
      localStorage.getItem('jyotishwala_pandits_v2');
    let list: PanditProfile[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed.map((p, idx) => normalizePanditAvatar(p, idx));
      }
    }

    if (list.length === 0) {
      list = INITIAL_PANDITS.map((p, idx) => normalizePanditAvatar(p, idx));
    }

    // Check if separate chief astrologer record exists in localStorage
    const rawChief = localStorage.getItem(STORAGE_KEY_CHIEF_ASTROLOGER);
    let chiefId: string | null = null;
    if (rawChief) {
      try {
        const parsedChief = JSON.parse(rawChief);
        if (parsedChief && parsedChief.id) {
          chiefId = parsedChief.id;
        }
      } catch {
        // ignore
      }
    }

    // Ensure exactly one Chief Astrologer is designated
    const hasChief = list.some((p) => p.isChief);
    if (!hasChief) {
      if (chiefId) {
        list = list.map((p) => ({ ...p, isChief: p.id === chiefId }));
      } else {
        list[0].isChief = true;
      }
    }

    // Sort so Chief Astrologer always appears first, followed by displayOrder
    return list.sort((a, b) => {
      if (a.isChief && !b.isChief) return -1;
      if (!a.isChief && b.isChief) return 1;
      return (a.displayOrder || 99) - (b.displayOrder || 99);
    });
  } catch {
    return INITIAL_PANDITS.map((p, idx) => normalizePanditAvatar(p, idx));
  }
}

export function getChiefAstrologer(): PanditProfile {
  const list = getPandits();
  return list.find((p) => p.isChief) || list[0];
}

export function saveChiefAstrologer(profile: PanditProfile): PanditProfile {
  const clean = normalizePanditAvatar(profile, 0);
  clean.isChief = true;
  localStorage.setItem(STORAGE_KEY_CHIEF_ASTROLOGER, JSON.stringify(clean));

  const list = getPandits();
  const index = list.findIndex((p) => p.id === clean.id);
  let updatedList: PanditProfile[];
  if (index >= 0) {
    updatedList = list.map((p) =>
      p.id === clean.id ? { ...clean, isChief: true } : { ...p, isChief: false }
    );
  } else {
    updatedList = [clean, ...list.map((p) => ({ ...p, isChief: false }))];
  }

  localStorage.setItem(STORAGE_KEY_PANDITS, JSON.stringify(updatedList));
  localStorage.setItem('jyotishwala_pandits_v2', JSON.stringify(updatedList));
  localStorage.setItem('jyotishwala_wp_pandits_synced', '1');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jyotishwala_pandits_changed'));
  }
  return clean;
}

export function setChiefAstrologer(panditId: string): void {
  const list = getPandits();
  const updatedList = list.map((p) => ({
    ...p,
    isChief: p.id === panditId
  }));
  const chief = updatedList.find((p) => p.id === panditId);
  if (chief) {
    localStorage.setItem(STORAGE_KEY_CHIEF_ASTROLOGER, JSON.stringify(chief));
  }
  localStorage.setItem(STORAGE_KEY_PANDITS, JSON.stringify(updatedList));
  localStorage.setItem('jyotishwala_pandits_v2', JSON.stringify(updatedList));
  localStorage.setItem('jyotishwala_wp_pandits_synced', '1');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jyotishwala_pandits_changed'));
  }
}

export function savePandit(pandit: PanditProfile): PanditProfile {
  const clean = normalizePanditAvatar(pandit, 0);
  const list = getPandits();
  const index = list.findIndex((p) => p.id === clean.id);

  let updatedList: PanditProfile[];
  if (clean.isChief) {
    if (index >= 0) {
      updatedList = list.map((p) =>
        p.id === clean.id ? { ...clean, isChief: true } : { ...p, isChief: false }
      );
    } else {
      updatedList = [{ ...clean, isChief: true }, ...list.map((p) => ({ ...p, isChief: false }))];
    }
    localStorage.setItem(STORAGE_KEY_CHIEF_ASTROLOGER, JSON.stringify(clean));
  } else {
    if (index >= 0) {
      updatedList = list.map((p) => (p.id === clean.id ? clean : p));
    } else {
      updatedList = [...list, clean];
    }
    // If no pandit is chief, make the first chief
    if (!updatedList.some((p) => p.isChief)) {
      updatedList[0].isChief = true;
    }
  }

  localStorage.setItem(STORAGE_KEY_PANDITS, JSON.stringify(updatedList));
  localStorage.setItem('jyotishwala_pandits_v2', JSON.stringify(updatedList));
  localStorage.setItem('jyotishwala_wp_pandits_synced', '1');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jyotishwala_pandits_changed'));
  }
  return clean;
}

export function deletePandit(id: string) {
  let list = getPandits().filter((p) => p.id !== id);
  if (list.length > 0 && !list.some((p) => p.isChief)) {
    list[0].isChief = true;
  }
  localStorage.setItem('jyotishwala_wp_pandits_synced', '1');
  localStorage.setItem(STORAGE_KEY_PANDITS, JSON.stringify(list));
  localStorage.setItem('jyotishwala_pandits_v2', JSON.stringify(list));
  window.dispatchEvent(new Event('jyotishwala_pandits_changed'));
}

export function getPaymentReceipts(): PaymentReceiptSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENT_RECEIPTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePaymentReceipt(receipt: PaymentReceiptSubmission): PaymentReceiptSubmission {
  const list = getPaymentReceipts();
  const updated = [receipt, ...list];
  try {
    localStorage.setItem(STORAGE_KEY_PAYMENT_RECEIPTS, JSON.stringify(updated));
  } catch {
    // Ignore storage quota issues
  }
  void import('./wpApiClient')
    .then(({ submitPaymentReceiptToWp }) => submitPaymentReceiptToWp(receipt))
    .catch(() => undefined);
  return receipt;
}

export function deletePaymentReceipt(id: string) {
  const list = getPaymentReceipts().filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_PAYMENT_RECEIPTS, JSON.stringify(list));
  } catch {
    // Ignore storage issues
  }
}

export function buildAdminReceiptMailtoUrl(receipt: PaymentReceiptSubmission): string {
  const subject = `JyotishWala पेमेंट रसीद - ${receipt.userName} (${receipt.panditName})`;
  const bodyLines = [
    `नमस्ते एडमिन,`,
    ``,
    `ज्योतिष परामर्श दक्षिणा भुगतान की रसीद का विवरण नीचे दिया गया है:`,
    `--------------------------------------------------`,
    `• यजमान / उपयोगकर्ता का नाम: ${receipt.userName}`,
    `• मोबाइल / व्हाट्सएप नंबर: ${receipt.userPhone}`,
    receipt.userEmail ? `• ईमेल पता: ${receipt.userEmail}` : '',
    `• चयनित पंडित जी: ${receipt.panditName}`,
    `• भुगतान की गई राशि: ${receipt.amount}`,
    `• UTR / ट्रांजेक्शन ID: ${receipt.utrNumber}`,
    `• भुगतान समय: ${receipt.submittedAt}`,
    receipt.note ? `• परामर्श विषय / विवरण: ${receipt.note}` : '',
    receipt.receiptImageUrl ? `• रसीद स्क्रीनशॉट: ऐप के व्यवस्थापक पैनल (पेमेंट रसीदें अनुभाग) में संलग्न है।` : '',
    `--------------------------------------------------`,
    `कृपया भुगतान सत्यापित कर परामर्श समय निश्चित करने की कृपा करें।`
  ].filter(Boolean);

  return `mailto:${ADMIN_RECEIPT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
}

export const getPanditRoster = getPandits;
export const getUserPaymentReceipts = getPaymentReceipts;




