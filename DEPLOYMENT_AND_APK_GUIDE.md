# JyotishWala — Phase 4 & Phase 5 Complete Deployment & Android APK Guide

This guide covers:
1. **WordPress Backend Plugin Deployment on Hostinger Shared Hosting (`https://jyotishwala.com`)**
2. **Hostinger `wp-config.php` Encryption Key & Cron Setup**
3. **WordPress Admin Dashboard & REST API Verification Checklist**
4. **Building the Signed Android APK / Google Play AAB (`com.jyotishwala.app`)**

---

## PART 1: WordPress Backend Plugin Deployment (Hostinger Shared Hosting)

### Step 1.1: Download or Locate `jyotishwala-backend.zip`
The complete, audited WordPress plugin (`v1.1.0`, DB schema `v1.1.3`, 27 files) is already packaged in this project at:
- `/jyotishwala-backend.zip` (Root directory)
- `/public/jyotishwala-backend.zip` (Directly downloadable from `/jyotishwala-backend.zip` in the preview server)

### Step 1.2: Configure `wp-config.php` on Hostinger (Recommended Security Step)
1. Log in to **Hostinger hPanel** -> **Files** -> **File Manager**.
2. Open `public_html/wp-config.php`.
3. Above the line `/* That's all, stop editing! Happy publishing. */`, add a strong 64-character secret key for the API Vault AES-256-CBC + HMAC-SHA256 encryption:
   ```php
   define( 'JW_API_VAULT_SECRET_KEY', 'replace-with-your-64-char-random-secret-key-for-jyotishwala-vault' );
   ```
   *(Note: If you skip this, the plugin automatically falls back to WordPress `AUTH_KEY . SECURE_AUTH_KEY` salts, so it will still work out of the box.)*

### Step 1.3: Upload & Activate the Plugin in WordPress
1. Log in to your WordPress Admin Dashboard: `https://jyotishwala.com/wp-admin`
2. Go to **Settings -> Permalinks**, select **Post name** (`/%postname%/`), and click **Save Changes** (this ensures `/wp-json/jyotishwala/v1/*` routes resolve properly).
3. Go to **Plugins -> Add New Plugin -> Upload Plugin**.
4. Select `jyotishwala-backend.zip` and click **Install Now**.
5. Click **Activate Plugin**.
6. Upon activation, the plugin automatically creates all **12 custom MySQL tables** (`{$wpdb->prefix}jw_*`), seeds initial Panchang/Rashifal/Pandit/Gallery/Review/Sankalp data, and adds **JyotishWala** to your left WordPress Admin menu.

### Step 1.4: Hostinger Cron Job Setup (Optional — for Daily Cache & Log Maintenance)
1. In **Hostinger hPanel**, go to **Advanced -> Cron Jobs**.
2. Add a Cron Job to run **Twice Daily** (`0 */12 * * *`):
   ```bash
   wget -q -O - https://jyotishwala.com/wp-cron.php?doing_wp_cron >/dev/null 2>&1
   ```

---

## PART 2: Live WordPress REST API Verification Checklist

After activating the plugin on `https://jyotishwala.com`, test these URLs in your browser:

1. **System Health Check**:
   `https://jyotishwala.com/wp-json/jyotishwala/v1/health`
   - Expected: `{"success":true,"data":{"status":"healthy","version":"1.1.0","dbVersion":"1.1.3",...}}`
2. **Home Bootstrap Endpoint**:
   `https://jyotishwala.com/wp-json/jyotishwala/v1/home`
   - Expected: Returns `appSettings`, `siteContent`, `rashifal`, `pandits`, `gallery`, `reviews`, `tyohar`, `notifications`, and `sankalp`.
3. **Daily Panchang Calculation**:
   `https://jyotishwala.com/wp-json/jyotishwala/v1/panchang?date=2026-11-07&lat=30.0869&lng=78.2676`
4. **Blog Posts Sync**:
   `https://jyotishwala.com/wp-json/jyotishwala/v1/posts`

---

## PART 3: Building the Android APK / Google Play Store AAB (Phase 4)

The frontend application is now **100% separated from the Admin Panel**:
- `AdminView.tsx`, `AdminInviteModal.tsx`, and `ArticleEditorModal.tsx` have been completely removed from the frontend bundle.
- Zero private API keys (Gemini, external Panchang, or FCM server keys) are present in the frontend code.
- Regular app users log in via `UserAuthModal.tsx` (`/wp-json/jyotishwala/v1/user/login` & `/user/register`) to sync their Saved Kundlis and Consultation Payment Receipts.

### Step 3.1: Install Capacitor Dependencies (On Your Local Computer)
Export/download this project to your computer, open a terminal in the project folder, and run:
```bash
npm install
npm install @capacitor/core @capacitor/android @capacitor/status-bar @capacitor/splash-screen @capacitor/push-notifications
npm install -D @capacitor/cli
```

### Step 3.2: Build Production Web Bundle Connected to `https://jyotishwala.com`
```bash
npm run build:apk-web
```
*(This sets `VITE_WP_API_BASE_URL=https://jyotishwala.com/wp-json/jyotishwala/v1` and compiles the production bundle into `dist/`.)*

### Step 3.3: Initialize Android Platform & Copy Manifest/Security Templates
```bash
npx cap add android
cp android-template/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
mkdir -p android/app/src/main/res/xml
cp android-template/network_security_config.xml android/app/src/main/res/xml/network_security_config.xml
npx cap sync android
```

### Step 3.4: Generate Signed APK / AAB in Android Studio
1. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```
2. In Android Studio, go to **Build -> Generate Signed Bundle / APK...**
3. Select **Android App Bundle (AAB)** for Google Play Store or **APK** for direct device installation.
4. Choose your Keystore key and select the **release** build variant.
5. Install the generated APK on your Android phone and verify:
   - Daily Panchang, Kundli Generator, Kundli Milan, Rashifal, Gochar, Calculators, 108 Jap Mala, and Sankalp Mantra.
   - Hindi / English language switcher popup (with leading Hindi image hidden in English articles).
   - Pandit Ji QR Code & Payment Receipt submission (`POST /wp-json/jyotishwala/v1/receipts`).
   - User Registration, Login, Profile Photo Upload, and Cloud Saved Kundlis sync.
