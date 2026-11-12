# Security Specification & Hardened Red Team Audit (`security_spec.md`)

## 1. Data Invariants
1. **Default-Deny Catch-All**: All unspecified paths (`/{document=**}`) deny all reads and writes (`allow read, write: if false;`).
2. **Verified Identity**: Every write operation requires a signed-in user with a verified email (`request.auth != null && request.auth.token.email_verified == true`).
3. **Bootstrapped & Trusted Admin Role (`isAdmin()`)**: Admin privileges are granted ONLY if `request.auth.token.email == 'takneekiguru4@gmail.com' && request.auth.token.email_verified == true` OR if `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` is true.
4. **Private Kundli Isolation (`/users/{userId}/savedKundlis/{kundliId}`)**: A saved Kundli can only be created, read, updated, or deleted by the authenticated user whose `request.auth.uid == userId` and `ownerId == request.auth.uid`.
5. **PII Isolation on Payment Receipts (`/paymentReceipts/{receiptId}`)**: Payment receipts contain user phone numbers and emails; read access (`get`/`list`) is strictly restricted to the submitting user (`resource.data.submitterUid == request.auth.uid`) or a verified admin (`isAdmin()`).
6. **Temporal Integrity**: Every `create` operation enforces `incoming().createdAt == request.time`, and every `update` operation enforces `incoming().createdAt == existing().createdAt` (immutable) and `incoming().updatedAt == request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Shadow Field Injection on Article)**: Authenticated admin sends `isVerified: true` extra key to `/articles/art_1`. Rejected by `data.keys().hasOnly(...)`.
2. **Payload 2 (Unverified Admin Email Spoofing)**: Attacker with `email: 'takneekiguru4@gmail.com'` and `email_verified: false` attempts to write to `/articles/art_1`. Rejected by `isVerifiedUser()`.
3. **Payload 3 (Cross-User Kundli Read / PII Leak)**: Authenticated `user_B` attempts `get` or `list` on `/users/user_A/savedKundlis/k_1`. Rejected by `request.auth.uid == userId && existing().ownerId == request.auth.uid`.
4. **Payload 4 (Identity Spoofing on Saved Kundli)**: Authenticated `user_A` attempts to create `/users/user_A/savedKundlis/k_1` with `ownerId: 'user_B'`. Rejected by `data.ownerId == request.auth.uid`.
5. **Payload 5 (ID Poisoning / 2KB Document ID)**: Attacker sends a 1500-char document ID or invalid characters (`../`) to `/users/user_A/savedKundlis/{badId}`. Rejected by `isValidId(kundliId)`.
6. **Payload 6 (Value Poisoning on Update)**: Admin updates `/pandits/pandit_1` with `experienceYears: "twenty"` (string instead of number). Rejected because `isValidPandit(incoming())` wraps the entire `allow update` block.
7. **Payload 7 (Unbounded Tag Array DoS)**: Admin creates `/articles/art_9` with 50 tags in `tags` array. Rejected by `data.tags.size() <= 10`.
8. **Payload 8 (Client Timestamp Forgery)**: User creates `/users/user_A/savedKundlis/k_2` with a past/future `createdAt` instead of `request.time`. Rejected by `incoming().createdAt == request.time`.
9. **Payload 9 (Immortal Field Mutation)**: User updates `/users/user_A/savedKundlis/k_1` and modifies `createdAt` or `ownerId`. Rejected by `incoming().createdAt == existing().createdAt && incoming().ownerId == existing().ownerId`.
10. **Payload 10 (Privilege Escalation in `/admins`)**: Non-admin user attempts to create `/admins/{theirUid}` with `role: 'super_admin'`. Rejected by `isAdmin()`.
11. **Payload 11 (Cross-User Payment Receipt Scraping)**: Non-admin `user_B` attempts `list` on `/paymentReceipts` without filtering by `submitterUid == request.auth.uid`. Rejected by `existing().submitterUid == request.auth.uid`.
12. **Payload 12 (Unpublished Article Read by Public)**: Anonymous visitor attempts `get` or `list` on `/articles/draft_1` where `isPublished == false`. Rejected by `existing().isPublished == true`.

## 3. Hardened Red Team Conflict Report
- `/admins/{adminId}`: Identity Spoofing PASS, State Shortcutting PASS, Resource Poisoning PASS, Value Poisoning PASS.
- `/articles/{articleId}`: Identity Spoofing PASS, State Shortcutting PASS, Resource Poisoning PASS, Value Poisoning PASS.
- `/pandits/{panditId}`: Identity Spoofing PASS, State Shortcutting PASS, Resource Poisoning PASS, Value Poisoning PASS.
- `/horoscopes/{horoscopeId}`: Identity Spoofing PASS, State Shortcutting PASS, Resource Poisoning PASS, Value Poisoning PASS.
- `/users/{userId}/savedKundlis/{kundliId}`: Identity Spoofing PASS, State Shortcutting PASS, Resource Poisoning PASS, Value Poisoning PASS.
- `/paymentReceipts/{receiptId}`: Identity Spoofing PASS, State Shortcutting PASS, Resource Poisoning PASS, Value Poisoning PASS.
