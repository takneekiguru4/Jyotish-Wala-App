/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdminUser, MemberInvite, UserRole } from '../types';

const STORAGE_KEY_ADMIN = 'jyotishwala_active_user';
const STORAGE_KEY_OWNER_PROFILE = 'jyotishwala_owner_profile_v1';
const STORAGE_KEY_OWNER_CREDS = 'jyotishwala_owner_creds_v3';
const STORAGE_KEY_MEMBERS = 'jyotishwala_team_members';
const STORAGE_KEY_INVITES = 'jyotishwala_member_invites';

export const DEFAULT_OWNER_AVATAR =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80';

// Default Owner Super Admin
export const OWNER_ADMIN: AdminUser = {
  id: 'admin_owner_001',
  name: 'आचार्य मुख्य व्यवस्थापक',
  email: 'takneekiguru4@gmail.com',
  role: 'super_admin',
  avatar: DEFAULT_OWNER_AVATAR,
  phone: '+91 98765 43210',
  designation: 'मुख्य ज्योतिषाचार्य एवं संस्थापक',
  address: 'ऋषिकेश, उत्तराखंड',
  bio: 'वैदिक ज्योतिष, सिद्धांत पंचांग एवं कुंडली विश्लेषण विशेषज्ञ।',
  isOwner: true,
  joinedAt: '2026-01-01'
};

export interface OwnerCredentials {
  email: string;
  password: string;
}

const DEFAULT_OWNER_CREDS: OwnerCredentials = {
  email: '',
  password: ''
};

export function getOwnerCredentials(): OwnerCredentials {
  return DEFAULT_OWNER_CREDS;
}

export function saveOwnerCredentials(email: string, password: string): OwnerCredentials {
  const updated: OwnerCredentials = {
    email: email.trim(),
    password: password.trim()
  };
  try {
    localStorage.setItem(STORAGE_KEY_OWNER_CREDS, JSON.stringify(updated));
    const currentProfile = getOwnerProfile();
    if (currentProfile.email !== updated.email) {
      saveOwnerProfile({ ...currentProfile, email: updated.email });
    }
  } catch {
    // Ignore storage error
  }
  return updated;
}

export function getOwnerProfile(): AdminUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OWNER_PROFILE);
    if (!raw) return OWNER_ADMIN;
    const parsed = JSON.parse(raw);
    return {
      ...OWNER_ADMIN,
      ...parsed,
      id: OWNER_ADMIN.id,
      role: 'super_admin',
      isOwner: true
    };
  } catch {
    return OWNER_ADMIN;
  }
}

export function saveOwnerProfile(updatedProfile: AdminUser): AdminUser {
  const merged: AdminUser = {
    ...getOwnerProfile(),
    ...updatedProfile,
    id: OWNER_ADMIN.id,
    role: 'super_admin',
    isOwner: true
  };
  try {
    localStorage.setItem(STORAGE_KEY_OWNER_PROFILE, JSON.stringify(merged));
    // Also sync active user if logged in
    const active = getActiveUser();
    if (active && (active.isOwner || active.id === OWNER_ADMIN.id)) {
      localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(merged));
    }
    // Sync team member list
    saveMember(merged);
  } catch {
    // Ignore storage error
  }
  return merged;
}

export function deleteOwnerProfileDetails(): AdminUser {
  const creds = getOwnerCredentials();
  const cleared: AdminUser = {
    id: OWNER_ADMIN.id,
    name: 'मुख्य व्यवस्थापक',
    email: creds.email,
    role: 'super_admin',
    avatar: DEFAULT_OWNER_AVATAR,
    phone: '',
    designation: '',
    address: '',
    bio: '',
    isOwner: true,
    joinedAt: OWNER_ADMIN.joinedAt
  };
  return saveOwnerProfile(cleared);
}

export function verifyOwnerLogin(
  emailInput: string,
  passwordInput: string
): { success: boolean; user?: AdminUser; error?: string } {
  const creds = getOwnerCredentials();
  const enteredEmail = emailInput.trim().toLowerCase();
  const enteredPass = passwordInput.trim();

  const validEmail = creds.email.trim().toLowerCase();
  const validPass = creds.password;

  if (enteredEmail === validEmail && enteredPass === validPass) {
    const profile = getOwnerProfile();
    const syncedProfile = { ...profile, email: creds.email };
    setActiveUser(syncedProfile);
    return { success: true, user: syncedProfile };
  }

  return {
    success: false,
    error: 'अमान्य Gmail ID या पासवर्ड। केवल अधिकृत व्यवस्थापक Gmail ID और पासवर्ड से ही लॉगिन संभव है।'
  };
}

const INITIAL_MEMBERS: AdminUser[] = [
  OWNER_ADMIN,
  {
    id: 'mem_002',
    name: 'पं. राधेश्याम शास्त्री',
    email: 'radheshyam.jyotish@gmail.com',
    role: 'astrologer_expert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    isOwner: false,
    joinedAt: '2026-02-15'
  },
  {
    id: 'mem_003',
    name: 'आचार्य देवकीनंदन',
    email: 'devkinandan.editor@gmail.com',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    isOwner: false,
    joinedAt: '2026-03-01'
  }
];

export function getActiveUser(): AdminUser | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ADMIN);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && (parsed.isOwner || parsed.id === OWNER_ADMIN.id)) {
      return getOwnerProfile();
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setActiveUser(user: AdminUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_ADMIN);
    }
  } catch {
    // Ignore storage error
  }
}

export function getAllMembers(): AdminUser[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    const list: AdminUser[] = JSON.parse(data);
    const owner = getOwnerProfile();
    return list.map((m) => (m.isOwner || m.id === OWNER_ADMIN.id ? owner : m));
  } catch {
    return INITIAL_MEMBERS;
  }
}

export function saveMember(member: AdminUser) {
  const members = getAllMembers();
  const index = members.findIndex((m) => m.id === member.id);
  if (index >= 0) {
    members[index] = member;
  } else {
    members.push(member);
  }
  localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
}

export function removeMember(memberId: string) {
  let members = getAllMembers();
  members = members.filter((m) => m.id !== memberId && !m.isOwner);
  localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
}

export function getAllInvites(): MemberInvite[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_INVITES);
    if (!data) {
      const sampleInvites: MemberInvite[] = [
        {
          id: 'inv_sample_1',
          email: 'shastriji.writer@gmail.com',
          role: 'writer',
          invitedBy: 'takneekiguru4@gmail.com',
          invitedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(),
          token: 'jwt_secure_tok_wrt_7749',
          status: 'pending'
        }
      ];
      localStorage.setItem(STORAGE_KEY_INVITES, JSON.stringify(sampleInvites));
      return sampleInvites;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function createInvite(email: string, role: UserRole, inviterEmail: string): MemberInvite {
  const invites = getAllInvites();
  const token = `inv_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const newInvite: MemberInvite = {
    id: `invite_${Date.now()}`,
    email,
    role,
    invitedBy: inviterEmail,
    invitedAt: new Date().toISOString(),
    expiresAt,
    token,
    status: 'pending'
  };

  invites.unshift(newInvite);
  localStorage.setItem(STORAGE_KEY_INVITES, JSON.stringify(invites));
  return newInvite;
}

export function revokeInvite(inviteId: string) {
  const invites = getAllInvites();
  const invite = invites.find((i) => i.id === inviteId);
  if (invite) {
    invite.status = 'revoked';
    localStorage.setItem(STORAGE_KEY_INVITES, JSON.stringify(invites));
  }
}

export function acceptInvite(token: string, name: string): { success: boolean; user?: AdminUser; error?: string } {
  const invites = getAllInvites();
  const invite = invites.find((i) => i.token === token);

  if (!invite) {
    return { success: false, error: 'अमान्य निमंत्रण लिंक' };
  }

  if (invite.status === 'revoked') {
    return { success: false, error: 'यह निमंत्रण रद्द कर दिया गया है' };
  }

  if (invite.status === 'accepted') {
    return { success: false, error: 'यह निमंत्रण पहले ही स्वीकार किया जा चुका है' };
  }

  if (new Date(invite.expiresAt).getTime() < Date.now()) {
    return { success: false, error: 'यह निमंत्रण लिंक समाप्त हो चुकी है' };
  }

  const newMember: AdminUser = {
    id: `mem_${Date.now()}`,
    name,
    email: invite.email,
    role: invite.role,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    isOwner: false,
    joinedAt: new Date().toISOString().split('T')[0]
  };

  saveMember(newMember);
  invite.status = 'accepted';
  localStorage.setItem(STORAGE_KEY_INVITES, JSON.stringify(invites));
  setActiveUser(newMember);

  return { success: true, user: newMember };
}

export function getRoleLabel(role: UserRole): { hi: string; en: string; badgeClass: string } {
  switch (role) {
    case 'super_admin':
      return { hi: 'मुख्य व्यवस्थापक', en: 'Super Admin', badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
    case 'admin':
      return { hi: 'प्रशासक', en: 'Admin', badgeClass: 'bg-teal-500/10 text-teal-600 border-teal-500/30' };
    case 'editor':
      return { hi: 'मुख्य संपादक', en: 'Editor', badgeClass: 'bg-purple-500/10 text-purple-600 border-purple-500/30' };
    case 'writer':
      return { hi: 'ज्योतिष लेखक', en: 'Writer', badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/30' };
    case 'astrologer_expert':
      return { hi: 'ज्योतिष विशेषज्ञ', en: 'Astrologer Expert', badgeClass: 'bg-orange-500/10 text-orange-600 border-orange-500/30' };
    default:
      return { hi: 'सदस्य', en: 'Member', badgeClass: 'bg-slate-500/10 text-slate-600 border-slate-500/30' };
  }
}
