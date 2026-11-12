import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  Article,
  PanditProfile,
  HoroscopePrediction,
  RashifalPeriod,
  KundliChartData,
  PaymentReceiptSubmission,
  AdminUser
} from './types';

// Initialize Firebase App, Firestore & Auth
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Validation Constants synced verbatim with firebase-blueprint.json & firestore.rules
export const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
export const MAX_ID_LEN = 128;

export function sanitizeFirestoreId(rawId: string, fallbackPrefix = 'doc'): string {
  const cleaned = (rawId || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, MAX_ID_LEN);
  if (!cleaned || !VALID_ID_REGEX.test(cleaned)) {
    return `${fallbackPrefix}_${Date.now()}`;
  }
  return cleaned;
}

function truncateStr(val: string | undefined | null, maxLen: number, fallback = ''): string {
  const str = (val ?? fallback).toString().trim();
  return str.slice(0, maxLen);
}

// ============================================================================
// Mandatory Error Handler (Section 3 of firebase-integration-rpc)
// ============================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: boolean | string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// Mandatory Connection Test on Boot
// ============================================================================
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

// ============================================================================
// Google Sign-In Helper
// ============================================================================
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged };
export type { FirebaseUser };

// ============================================================================
// Firestore CRUD Helpers with Strict Blueprint Sanitization
// ============================================================================

export function isFirebaseVerifiedUser(): boolean {
  return Boolean(auth.currentUser && auth.currentUser.emailVerified);
}

export async function saveArticleToFirestore(article: Article): Promise<void> {
  if (!isFirebaseVerifiedUser() || !auth.currentUser) return;
  const articleId = sanitizeFirestoreId(article.id, 'art');
  const path = `articles/${articleId}`;
  const docRef = doc(db, 'articles', articleId);

  const validCategories = ['Panchang', 'Kundli', 'Vastu', 'Grah Gochar', 'Puja', 'Remedies'];
  const category = validCategories.includes(article.category) ? article.category : 'Kundli';
  const safeTags = (Array.isArray(article.tags) ? article.tags : [])
    .slice(0, 10)
    .map((t) => truncateStr(String(t), 60, 'ज्योतिष'))
    .filter(Boolean);

  try {
    const existingSnap = await getDoc(docRef);
    const payloadBase = {
      id: articleId,
      title: truncateStr(article.title, 300, 'ज्योतिष लेख'),
      slug: truncateStr(article.slug, 200, articleId),
      category,
      categoryHindi: truncateStr(article.categoryHindi, 80, 'ज्योतिष'),
      excerpt: truncateStr(article.excerpt, 1000, article.title || 'वैदिक ज्योतिष लेख'),
      content: truncateStr(article.content, 50000, article.excerpt || 'वैदिक ज्योतिष लेख'),
      author: truncateStr(article.author, 120, 'आचार्य'),
      authorRole: truncateStr(article.authorRole, 120, 'ज्योतिषाचार्य'),
      publishedAt: truncateStr(article.publishedAt, 40, new Date().toISOString().split('T')[0]),
      readTime: truncateStr(article.readTime, 40, '4 मिनट'),
      imageUrl: truncateStr(
        article.imageUrl,
        350000,
        'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80'
      ),
      imageAlt: truncateStr(article.imageAlt || article.title, 300, ''),
      tags: safeTags,
      views: Math.max(0, Math.floor(Number(article.views) || 0)),
      isPublished: true,
      authorUid: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    };

    if (existingSnap.exists()) {
      await updateDoc(docRef, {
        title: payloadBase.title,
        slug: payloadBase.slug,
        category: payloadBase.category,
        categoryHindi: payloadBase.categoryHindi,
        excerpt: payloadBase.excerpt,
        content: payloadBase.content,
        author: payloadBase.author,
        authorRole: payloadBase.authorRole,
        publishedAt: payloadBase.publishedAt,
        readTime: payloadBase.readTime,
        imageUrl: payloadBase.imageUrl,
        imageAlt: payloadBase.imageAlt,
        tags: payloadBase.tags,
        views: payloadBase.views,
        isPublished: payloadBase.isPublished,
        authorUid: payloadBase.authorUid,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        ...payloadBase,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteArticleFromFirestore(rawId: string): Promise<void> {
  if (!isFirebaseVerifiedUser()) return;
  const articleId = sanitizeFirestoreId(rawId, 'art');
  const path = `articles/${articleId}`;
  try {
    await deleteDoc(doc(db, 'articles', articleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function savePanditToFirestore(pandit: PanditProfile): Promise<void> {
  if (!isFirebaseVerifiedUser() || !auth.currentUser) return;
  const panditId = sanitizeFirestoreId(pandit.id, 'pandit');
  const path = `pandits/${panditId}`;
  const docRef = doc(db, 'pandits', panditId);

  const safeSpecs = (Array.isArray(pandit.specialties) && pandit.specialties.length > 0
    ? pandit.specialties
    : ['वैदिक ज्योतिष']
  )
    .slice(0, 10)
    .map((s) => truncateStr(s, 100, 'वैदिक ज्योतिष'));

  const safeLangs = (Array.isArray(pandit.languages) && pandit.languages.length > 0
    ? pandit.languages
    : ['हिन्दी', 'संस्कृत']
  )
    .slice(0, 10)
    .map((l) => truncateStr(l, 60, 'हिन्दी'));

  try {
    const existingSnap = await getDoc(docRef);
    const payloadBase = {
      id: panditId,
      name: truncateStr(pandit.name, 150, 'आचार्य जी'),
      qualification: truncateStr(pandit.qualification, 250, 'ज्योतिषाचार्य'),
      experienceYears: Math.min(100, Math.max(0, Math.floor(Number(pandit.experienceYears) || 10))),
      specialties: safeSpecs,
      languages: safeLangs,
      mobile: truncateStr(pandit.mobile, 40, '+91 98765 43210'),
      email: truncateStr(pandit.email, 254, 'info@jyotishwala.com'),
      address: truncateStr(pandit.address, 300, 'ऋषिकेश, उत्तराखंड'),
      avatar: truncateStr(
        pandit.avatar,
        350000,
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      ),
      qrCodeUrl: truncateStr(pandit.qrCodeUrl || '', 350000, ''),
      dakshinaInfo: truncateStr(pandit.dakshinaInfo, 150, 'परामर्श दक्षिणा: ₹501'),
      about: truncateStr(pandit.about || '', 3000, ''),
      isActive: true,
      updatedByUid: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    };

    if (existingSnap.exists()) {
      await updateDoc(docRef, {
        name: payloadBase.name,
        qualification: payloadBase.qualification,
        experienceYears: payloadBase.experienceYears,
        specialties: payloadBase.specialties,
        languages: payloadBase.languages,
        mobile: payloadBase.mobile,
        email: payloadBase.email,
        address: payloadBase.address,
        avatar: payloadBase.avatar,
        qrCodeUrl: payloadBase.qrCodeUrl,
        dakshinaInfo: payloadBase.dakshinaInfo,
        about: payloadBase.about,
        isActive: payloadBase.isActive,
        updatedByUid: payloadBase.updatedByUid,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        ...payloadBase,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePanditFromFirestore(rawId: string): Promise<void> {
  if (!isFirebaseVerifiedUser()) return;
  const panditId = sanitizeFirestoreId(rawId, 'pandit');
  const path = `pandits/${panditId}`;
  try {
    await deleteDoc(doc(db, 'pandits', panditId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveHoroscopeToFirestore(
  period: RashifalPeriod,
  prediction: HoroscopePrediction
): Promise<void> {
  if (!isFirebaseVerifiedUser() || !auth.currentUser) return;
  const signIdx = Math.min(11, Math.max(0, Math.floor(Number(prediction.signIndex) || 0)));
  const docId = `${period}_${signIdx}`;
  const path = `horoscopes/${docId}`;
  const docRef = doc(db, 'horoscopes', docId);

  try {
    const existingSnap = await getDoc(docRef);
    const payloadBase = {
      id: docId,
      period,
      signIndex: signIdx,
      signName: truncateStr(prediction.signName, 40, 'Aries'),
      hindiName: truncateStr(prediction.hindiName, 40, 'मेष'),
      symbol: truncateStr(prediction.symbol, 16, '♈'),
      dateRange: truncateStr(prediction.dateRange, 80, '21 मार्च - 19 अप्रैल'),
      ruler: truncateStr(prediction.ruler, 40, 'मंगल'),
      element: truncateStr(prediction.element, 40, 'अग्नि'),
      general: truncateStr(prediction.general, 3000, 'शुभ समय'),
      career: truncateStr(prediction.career, 2000, 'उन्नति'),
      love: truncateStr(prediction.love, 2000, 'सामंजस्य'),
      health: truncateStr(prediction.health, 2000, 'उत्तम'),
      finance: truncateStr(prediction.finance, 2000, 'लाभ'),
      luckyNumber: Math.min(99, Math.max(1, Math.floor(Number(prediction.luckyNumber) || 1))),
      luckyColor: truncateStr(prediction.luckyColor, 60, 'लाल'),
      luckyColorHex: truncateStr(prediction.luckyColorHex || '#EF4444', 16, '#EF4444'),
      luckyTime: truncateStr(prediction.luckyTime, 100, 'प्रातः 09:00 - 10:30'),
      remedy: truncateStr(prediction.remedy, 1000, 'ईश्वर उपासना करें'),
      isPublic: true,
      updatedByUid: auth.currentUser.uid,
      updatedAt: serverTimestamp()
    };

    if (existingSnap.exists()) {
      await updateDoc(docRef, {
        signName: payloadBase.signName,
        hindiName: payloadBase.hindiName,
        symbol: payloadBase.symbol,
        dateRange: payloadBase.dateRange,
        ruler: payloadBase.ruler,
        element: payloadBase.element,
        general: payloadBase.general,
        career: payloadBase.career,
        love: payloadBase.love,
        health: payloadBase.health,
        finance: payloadBase.finance,
        luckyNumber: payloadBase.luckyNumber,
        luckyColor: payloadBase.luckyColor,
        luckyColorHex: payloadBase.luckyColorHex,
        luckyTime: payloadBase.luckyTime,
        remedy: payloadBase.remedy,
        isPublic: payloadBase.isPublic,
        updatedByUid: payloadBase.updatedByUid,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        ...payloadBase,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveKundliToFirestore(chart: KundliChartData): Promise<void> {
  if (!isFirebaseVerifiedUser() || !auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const kundliId = sanitizeFirestoreId(chart.id, 'kundli');
  const path = `users/${userId}/savedKundlis/${kundliId}`;
  const docRef = doc(db, 'users', userId, 'savedKundlis', kundliId);

  const validGender = ['male', 'female', 'other'].includes(chart.gender) ? chart.gender : 'male';

  try {
    const existingSnap = await getDoc(docRef);
    const payloadBase = {
      id: kundliId,
      ownerId: userId,
      name: truncateStr(chart.name, 120, 'जातक'),
      gender: validGender,
      birthDate: truncateStr(chart.birthDate, 20, '1995-08-15'),
      birthTime: truncateStr(chart.birthTime, 12, '10:30'),
      birthPlace: truncateStr(chart.birthPlace, 200, 'ऋषिकेश, उत्तराखंड'),
      latitude: Math.min(90, Math.max(-90, Number(chart.latitude) || 30.0869)),
      longitude: Math.min(180, Math.max(-180, Number(chart.longitude) || 78.2676)),
      updatedAt: serverTimestamp()
    };

    if (existingSnap.exists()) {
      await updateDoc(docRef, {
        name: payloadBase.name,
        gender: payloadBase.gender,
        birthDate: payloadBase.birthDate,
        birthTime: payloadBase.birthTime,
        birthPlace: payloadBase.birthPlace,
        latitude: payloadBase.latitude,
        longitude: payloadBase.longitude,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        ...payloadBase,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteKundliFromFirestore(rawId: string): Promise<void> {
  if (!isFirebaseVerifiedUser() || !auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const kundliId = sanitizeFirestoreId(rawId, 'kundli');
  const path = `users/${userId}/savedKundlis/${kundliId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'savedKundlis', kundliId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function savePaymentReceiptToFirestore(
  receipt: PaymentReceiptSubmission
): Promise<void> {
  if (!isFirebaseVerifiedUser() || !auth.currentUser) return;
  const receiptId = sanitizeFirestoreId(receipt.id, 'receipt');
  const panditId = sanitizeFirestoreId(receipt.panditId, 'pandit_1');
  const path = `paymentReceipts/${receiptId}`;
  const docRef = doc(db, 'paymentReceipts', receiptId);

  try {
    // Ensure referenced pandit doc exists before creating receipt
    const panditSnap = await getDoc(doc(db, 'pandits', panditId));
    if (!panditSnap.exists()) return;

    await setDoc(docRef, {
      id: receiptId,
      submitterUid: auth.currentUser.uid,
      panditId,
      panditName: truncateStr(receipt.panditName, 150, 'पंडित जी'),
      userName: truncateStr(receipt.userName, 120, 'यूज़र'),
      userPhone: truncateStr(receipt.userPhone, 30, '+91'),
      userEmail: truncateStr(receipt.userEmail || '', 254, ''),
      amount: truncateStr(receipt.amount, 40, '₹501'),
      utrNumber: truncateStr(receipt.utrNumber, 80, 'UTR'),
      note: truncateStr(receipt.note || '', 1000, ''),
      receiptImageUrl: truncateStr(receipt.receiptImageUrl || '', 450000, ''),
      submittedAt: truncateStr(receipt.submittedAt, 80, new Date().toLocaleString('hi-IN')),
      adminEmail: truncateStr(receipt.adminEmail, 254, 'takneekiguru4@gmail.com'),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deletePaymentReceiptFromFirestore(rawId: string): Promise<void> {
  if (!isFirebaseVerifiedUser()) return;
  const receiptId = sanitizeFirestoreId(rawId, 'receipt');
  const path = `paymentReceipts/${receiptId}`;
  try {
    await deleteDoc(doc(db, 'paymentReceipts', receiptId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveAdminRoleToFirestore(member: AdminUser, uid: string): Promise<void> {
  if (!isFirebaseVerifiedUser()) return;
  const cleanUid = sanitizeFirestoreId(uid, 'admin');
  const path = `admins/${cleanUid}`;
  const docRef = doc(db, 'admins', cleanUid);

  try {
    const snap = await getDoc(docRef);
    const payload = {
      uid: cleanUid,
      email: truncateStr(member.email, 254, 'takneekiguru4@gmail.com'),
      name: truncateStr(member.name, 120, 'मुख्य व्यवस्थापक'),
      role: member.role,
      avatar: truncateStr(
        member.avatar,
        250000,
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
      ),
      updatedAt: serverTimestamp()
    };

    if (snap.exists()) {
      await updateDoc(docRef, {
        email: payload.email,
        name: payload.name,
        role: payload.role,
        avatar: payload.avatar,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export { collection, query, where, onSnapshot, getDocs, doc, getDoc };
