/**
 * Phase 0 Test Runner for Firestore Security Rules ("Dirty Dozen" Payloads)
 * Verifies that all 12 adversarial payloads are rejected with PERMISSION_DENIED.
 */

export interface AdversarialTestCase {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TEST_CASES: AdversarialTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Article',
    collectionPath: '/articles/art_1',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'takneekiguru4@gmail.com', email_verified: true },
    payload: { id: 'art_1', isVerifiedGhostField: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 2,
    name: 'Unverified Admin Email Spoofing',
    collectionPath: '/articles/art_1',
    operation: 'delete',
    auth: { uid: 'spoof_1', email: 'takneekiguru4@gmail.com', email_verified: false },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 3,
    name: 'Cross-User Kundli Read / PII Leak',
    collectionPath: '/users/user_A/savedKundlis/k_1',
    operation: 'get',
    auth: { uid: 'user_B', email: 'userb@gmail.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 4,
    name: 'Identity Spoofing on Saved Kundli',
    collectionPath: '/users/user_A/savedKundlis/k_1',
    operation: 'create',
    auth: { uid: 'user_A', email: 'usera@gmail.com', email_verified: true },
    payload: { id: 'k_1', ownerId: 'user_B' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 5,
    name: 'ID Poisoning on Saved Kundli',
    collectionPath: `/users/user_A/savedKundlis/${'x'.repeat(200)}`,
    operation: 'create',
    auth: { uid: 'user_A', email: 'usera@gmail.com', email_verified: true },
    payload: { id: 'x'.repeat(200), ownerId: 'user_A' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 6,
    name: 'Value Poisoning on Pandit Update',
    collectionPath: '/pandits/pandit_1',
    operation: 'update',
    auth: { uid: 'admin_1', email: 'takneekiguru4@gmail.com', email_verified: true },
    payload: { experienceYears: 'invalid_string_number' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 7,
    name: 'Unbounded Tag Array DoS on Article',
    collectionPath: '/articles/art_9',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'takneekiguru4@gmail.com', email_verified: true },
    payload: { tags: new Array(25).fill('tag') },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 8,
    name: 'Client Timestamp Forgery on Saved Kundli',
    collectionPath: '/users/user_A/savedKundlis/k_2',
    operation: 'create',
    auth: { uid: 'user_A', email: 'usera@gmail.com', email_verified: true },
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 9,
    name: 'Immortal Field Mutation on Saved Kundli',
    collectionPath: '/users/user_A/savedKundlis/k_1',
    operation: 'update',
    auth: { uid: 'user_A', email: 'usera@gmail.com', email_verified: true },
    payload: { ownerId: 'user_B' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 10,
    name: 'Self-Assigned Admin Privilege Escalation',
    collectionPath: '/admins/user_B',
    operation: 'create',
    auth: { uid: 'user_B', email: 'userb@gmail.com', email_verified: true },
    payload: { uid: 'user_B', role: 'super_admin' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 11,
    name: 'Cross-User Payment Receipt Scraping',
    collectionPath: '/paymentReceipts/rec_1',
    operation: 'get',
    auth: { uid: 'user_B', email: 'userb@gmail.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 12,
    name: 'Unpublished Article Read by Anonymous Visitor',
    collectionPath: '/articles/draft_hidden',
    operation: 'get',
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  }
];
