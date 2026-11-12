<?php
/**
 * Database Schema & Table Management for JyotishWala Backend.
 *
 * Uses existing WordPress MySQL database and native tables (wp_posts, wp_users, wp_usermeta, wp_terms, wp_options)
 * wherever appropriate, and creates custom tables only for app-specific entities using dbDelta().
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Database {

	/**
	 * Returns prefixed custom table name.
	 *
	 * @param string $short_name Short table identifier.
	 * @return string
	 */
	public static function table( $short_name ) {
		global $wpdb;
		return $wpdb->prefix . 'jw_' . $short_name;
	}

	/**
	 * Creates or upgrades all custom MySQL tables and seeds initial data if empty.
	 */
	public static function install_or_upgrade() {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset_collate = $wpdb->get_charset_collate();

		$t_kundlis       = self::table( 'saved_kundlis' );
		$t_rashifal      = self::table( 'rashifal' );
		$t_banners       = self::table( 'banners' );
		$t_pandits       = self::table( 'pandits' );
		$t_receipts      = self::table( 'receipts' );
		$t_tyohar        = self::table( 'tyohar' );
		$t_gallery       = self::table( 'gallery' );
		$t_reviews       = self::table( 'reviews' );
		$t_notifications = self::table( 'notifications' );
		$t_api_vault     = self::table( 'api_vault' );
		$t_tokens        = self::table( 'user_tokens' );
		$t_logs          = self::table( 'logs' );
		$t_knowledge     = self::table( 'knowledge' );
		$t_puja_vidhi    = self::table( 'puja_vidhi' );
		$t_mantras       = self::table( 'mantras' );
		$t_sanskrit      = self::table( 'sanskrit_courses' );
		$t_temples       = self::table( 'temples' );
		$t_bookings      = self::table( 'bookings' );
		$t_support       = self::table( 'support_tickets' );

		// 1. Saved Kundlis Table
		$sql_kundlis = "CREATE TABLE {$t_kundlis} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			kundli_uid varchar(64) NOT NULL,
			user_id bigint(20) unsigned NOT NULL DEFAULT 0,
			person_name varchar(191) NOT NULL,
			gender varchar(20) NOT NULL DEFAULT 'male',
			birth_date varchar(20) NOT NULL,
			birth_time varchar(20) NOT NULL,
			birth_place varchar(191) NOT NULL,
			latitude decimal(10,6) NOT NULL DEFAULT 30.086900,
			longitude decimal(10,6) NOT NULL DEFAULT 78.267600,
			timezone varchar(64) NOT NULL DEFAULT 'Asia/Kolkata',
			lagna varchar(64) DEFAULT '',
			rashi varchar(64) DEFAULT '',
			nakshatra varchar(64) DEFAULT '',
			nakshatra_pada tinyint(2) unsigned DEFAULT 1,
			chart_json longtext NOT NULL,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY kundli_uid (kundli_uid),
			KEY user_id (user_id),
			KEY person_name (person_name)
		) {$charset_collate};";

		// 2. Rashifal Table (12 Rashis x 4 Periods: daily, weekly, monthly, yearly)
		$sql_rashifal = "CREATE TABLE {$t_rashifal} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			rashi_id varchar(32) NOT NULL,
			rashi_name_hi varchar(64) NOT NULL,
			rashi_name_en varchar(64) NOT NULL,
			period varchar(20) NOT NULL DEFAULT 'daily',
			reference_date varchar(20) NOT NULL DEFAULT '',
			prediction_hi text NOT NULL,
			prediction_en text,
			career_hi text,
			health_hi text,
			love_hi text,
			remedy_hi text,
			lucky_number varchar(32) DEFAULT '3',
			lucky_color varchar(64) DEFAULT 'पीला',
			compatibility varchar(64) DEFAULT '',
			status varchar(20) NOT NULL DEFAULT 'published',
			updated_by bigint(20) unsigned DEFAULT 0,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY rashi_period (rashi_id,period),
			KEY period (period)
		) {$charset_collate};";

		// 3. Home Screen Banners / Slides Table
		$sql_banners = "CREATE TABLE {$t_banners} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			slide_uid varchar(64) NOT NULL,
			badge varchar(120) NOT NULL,
			title varchar(255) NOT NULL,
			subtitle text NOT NULL,
			cta_text varchar(120) NOT NULL,
			target_page varchar(64) NOT NULL DEFAULT 'kundli',
			bg_theme varchar(32) NOT NULL DEFAULT 'teal',
			bg_image_url text,
			display_order int(11) NOT NULL DEFAULT 1,
			is_enabled tinyint(1) NOT NULL DEFAULT 1,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY slide_uid (slide_uid),
			KEY display_order (display_order)
		) {$charset_collate};";

		// 4. Pandits / Astrologers Table
		$sql_pandits = "CREATE TABLE {$t_pandits} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			pandit_uid varchar(64) NOT NULL,
			name varchar(191) NOT NULL,
			qualification varchar(191) NOT NULL,
			experience_years int(11) NOT NULL DEFAULT 10,
			specialties text NOT NULL,
			languages varchar(255) NOT NULL DEFAULT 'हिन्दी, संस्कृत',
			mobile varchar(64) NOT NULL,
			email varchar(191) DEFAULT '',
			address varchar(255) DEFAULT 'ऋषिकेश, उत्तराखंड',
			avatar_url longtext,
			qr_code_url longtext,
			dakshina_info varchar(191) DEFAULT 'परामर्श दक्षिणा: ₹501',
			about text,
			is_chief tinyint(1) NOT NULL DEFAULT 0,
			is_active tinyint(1) NOT NULL DEFAULT 1,
			display_order int(11) NOT NULL DEFAULT 1,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY pandit_uid (pandit_uid)
		) {$charset_collate};";

		// 5. Consultation Payment Receipts Table (Associated with App Users & Pandits)
		$sql_receipts = "CREATE TABLE {$t_receipts} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			receipt_uid varchar(64) NOT NULL,
			user_id bigint(20) unsigned NOT NULL DEFAULT 0,
			pandit_id varchar(64) NOT NULL,
			pandit_name varchar(191) NOT NULL,
			user_name varchar(191) NOT NULL,
			user_phone varchar(64) NOT NULL,
			user_email varchar(191) DEFAULT '',
			amount varchar(64) NOT NULL,
			utr_number varchar(128) NOT NULL,
			note text,
			receipt_image_url longtext,
			status varchar(20) NOT NULL DEFAULT 'pending',
			admin_remarks text,
			verified_by bigint(20) unsigned NOT NULL DEFAULT 0,
			verified_at datetime DEFAULT NULL,
			submitted_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY receipt_uid (receipt_uid),
			KEY user_id (user_id),
			KEY pandit_id (pandit_id),
			KEY utr_number (utr_number),
			KEY status (status)
		) {$charset_collate};";

		// 6. Sanatan Vrat & Tyohar Table (with Year/Month & 8 Detailed Festival Sections in details_json)
		$sql_tyohar = "CREATE TABLE {$t_tyohar} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			tyohar_uid varchar(64) NOT NULL,
			name varchar(191) NOT NULL,
			tyohar_date date NOT NULL,
			month_number tinyint(2) unsigned NOT NULL DEFAULT 1,
			vara varchar(64) NOT NULL,
			hindi_month varchar(64) NOT NULL,
			paksha varchar(64) NOT NULL,
			tithi varchar(64) NOT NULL,
			category varchar(64) NOT NULL DEFAULT 'प्रमुख महापर्व',
			significance text NOT NULL,
			details_json longtext,
			is_active tinyint(1) NOT NULL DEFAULT 1,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY tyohar_uid (tyohar_uid),
			KEY tyohar_date (tyohar_date),
			KEY month_number (month_number),
			KEY category (category)
		) {$charset_collate};";

		// 7. Puja & Sansthan Photo Gallery Table (Single Photos & Multi-Photo Group Albums)
		$sql_gallery = "CREATE TABLE {$t_gallery} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			photo_uid varchar(64) NOT NULL,
			title varchar(255) NOT NULL,
			category varchar(120) NOT NULL DEFAULT 'पूजा-पाठ व अनुष्ठान',
			location varchar(191) DEFAULT 'ऋषिकेश, उत्तराखंड',
			event_date varchar(32) DEFAULT '',
			acharya_name varchar(191) DEFAULT 'आचार्य परेश्वर भारद्वाज',
			description text,
			image_url longtext NOT NULL,
			group_images_json longtext,
			is_featured tinyint(1) NOT NULL DEFAULT 0,
			display_order int(11) NOT NULL DEFAULT 1,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY photo_uid (photo_uid),
			KEY category (category)
		) {$charset_collate};";

		// 8. User Reviews Table
		$sql_reviews = "CREATE TABLE {$t_reviews} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			review_uid varchar(64) NOT NULL,
			user_id bigint(20) unsigned DEFAULT 0,
			user_name varchar(191) NOT NULL,
			user_city varchar(191) NOT NULL,
			rating tinyint(1) unsigned NOT NULL DEFAULT 5,
			service_category varchar(120) NOT NULL DEFAULT 'जन्मकुंडली एवं फलादेश',
			comment text NOT NULL,
			admin_reply text,
			is_verified tinyint(1) NOT NULL DEFAULT 0,
			status varchar(20) NOT NULL DEFAULT 'pending',
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY review_uid (review_uid),
			KEY status (status)
		) {$charset_collate};";

		// 9. Push & In-App Notifications Table
		$sql_notifications = "CREATE TABLE {$t_notifications} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			notif_uid varchar(64) NOT NULL,
			title varchar(255) NOT NULL,
			message text NOT NULL,
			category varchar(64) NOT NULL DEFAULT 'panchang',
			target_screen varchar(64) DEFAULT 'home',
			scheduled_at datetime DEFAULT NULL,
			sent_at datetime DEFAULT CURRENT_TIMESTAMP,
			status varchar(20) NOT NULL DEFAULT 'sent',
			created_by bigint(20) unsigned DEFAULT 0,
			PRIMARY KEY  (id),
			UNIQUE KEY notif_uid (notif_uid),
			KEY status (status)
		) {$charset_collate};";

		// 10. Server-Side Private API Vault Table
		$sql_api_vault = "CREATE TABLE {$t_api_vault} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			api_uid varchar(64) NOT NULL,
			name varchar(191) NOT NULL,
			module varchar(64) NOT NULL,
			module_label varchar(191) NOT NULL,
			provider_name varchar(191) NOT NULL,
			endpoint_url text NOT NULL,
			api_key text NOT NULL,
			api_secret text,
			auth_type varchar(64) NOT NULL DEFAULT 'Bearer Token',
			http_method varchar(10) NOT NULL DEFAULT 'GET',
			is_enabled tinyint(1) NOT NULL DEFAULT 1,
			description text,
			technical_notes text,
			last_tested_at datetime DEFAULT NULL,
			last_test_status varchar(20) DEFAULT '',
			last_test_message text,
			usage_count bigint(20) unsigned NOT NULL DEFAULT 0,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY api_uid (api_uid),
			KEY module (module)
		) {$charset_collate};";

		// 11. Mobile App User Authentication Tokens Table (Bearer Tokens with Expiry & Revocation)
		$sql_tokens = "CREATE TABLE {$t_tokens} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			user_id bigint(20) unsigned NOT NULL,
			token_hash varchar(128) NOT NULL,
			device_info varchar(255) DEFAULT 'Android App',
			ip_address varchar(64) DEFAULT '',
			expires_at datetime NOT NULL,
			is_revoked tinyint(1) NOT NULL DEFAULT 0,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			last_used_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY token_hash (token_hash),
			KEY user_id (user_id),
			KEY expires_at (expires_at)
		) {$charset_collate};";

		// 12. System, Calculation, Security & API Logs Table
		$sql_logs = "CREATE TABLE {$t_logs} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			log_type varchar(32) NOT NULL DEFAULT 'api',
			severity varchar(20) NOT NULL DEFAULT 'info',
			message text NOT NULL,
			context_json longtext,
			user_id bigint(20) unsigned DEFAULT 0,
			ip_address varchar(64) DEFAULT '',
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			KEY log_type (log_type),
			KEY severity (severity),
			KEY created_at (created_at)
		) {$charset_collate};";

		dbDelta( $sql_kundlis );
		dbDelta( $sql_rashifal );
		dbDelta( $sql_banners );
		dbDelta( $sql_pandits );
		dbDelta( $sql_receipts );
		dbDelta( $sql_tyohar );
		dbDelta( $sql_gallery );
		dbDelta( $sql_reviews );
		dbDelta( $sql_notifications );
		dbDelta( $sql_api_vault );
		dbDelta( $sql_tokens );
		dbDelta( $sql_logs );

		// 13. Knowledge / Shastra Library Table (7 Departments)
		$sql_knowledge = "CREATE TABLE {$t_knowledge} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			item_uid varchar(64) NOT NULL,
			department varchar(64) NOT NULL DEFAULT 'veda',
			subcategory varchar(120) NOT NULL DEFAULT '',
			title_hi varchar(255) NOT NULL,
			title_en varchar(255) DEFAULT '',
			reference_text varchar(191) DEFAULT '',
			sanskrit_text longtext NOT NULL,
			transliteration text,
			anvaya text,
			meaning_hi longtext NOT NULL,
			meaning_en longtext,
			commentary_hi longtext,
			status varchar(20) NOT NULL DEFAULT 'published',
			display_order int(11) NOT NULL DEFAULT 1,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY item_uid (item_uid),
			KEY department (department)
		) {$charset_collate};";

		// 14. Puja & Karmakand Guide Table (19 Categories)
		$sql_puja_vidhi = "CREATE TABLE {$t_puja_vidhi} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			puja_uid varchar(64) NOT NULL,
			category varchar(120) NOT NULL,
			title_hi varchar(255) NOT NULL,
			title_en varchar(255) DEFAULT '',
			deity varchar(191) NOT NULL,
			duration varchar(120) DEFAULT '45 मिनट',
			purpose_hi text NOT NULL,
			samagri_json longtext,
			steps_json longtext,
			sankalp_text text,
			aarti_hi text,
			status varchar(20) NOT NULL DEFAULT 'published',
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY puja_uid (puja_uid),
			KEY category (category)
		) {$charset_collate};";

		// 15. Mantra, Stotra, Kavach & Sukta Library Table (15 Categories)
		$sql_mantras = "CREATE TABLE {$t_mantras} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			mantra_uid varchar(64) NOT NULL,
			category varchar(120) NOT NULL,
			title_hi varchar(255) NOT NULL,
			title_en varchar(255) DEFAULT '',
			deity varchar(191) DEFAULT '',
			rishi_chhanda varchar(255) DEFAULT '',
			sanskrit_text longtext NOT NULL,
			meaning_hi longtext NOT NULL,
			japa_vidhi_hi text,
			audio_url text,
			status varchar(20) NOT NULL DEFAULT 'published',
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY mantra_uid (mantra_uid),
			KEY category (category)
		) {$charset_collate};";

		// 16. Sanskrit Learning Course Table (4 Levels & Quizzes)
		$sql_sanskrit = "CREATE TABLE {$t_sanskrit} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			lesson_uid varchar(64) NOT NULL,
			course_level varchar(32) NOT NULL DEFAULT 'beginner',
			lesson_number int(11) NOT NULL DEFAULT 1,
			title_hi varchar(255) NOT NULL,
			title_en varchar(255) DEFAULT '',
			grammar_rule_hi longtext NOT NULL,
			vocabulary_json longtext,
			quiz_json longtext,
			status varchar(20) NOT NULL DEFAULT 'published',
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY lesson_uid (lesson_uid),
			KEY course_level (course_level)
		) {$charset_collate};";

		// 17. Temples & Tirtha Directory Table (8 Categories)
		$sql_temples = "CREATE TABLE {$t_temples} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			temple_uid varchar(64) NOT NULL,
			category varchar(120) NOT NULL,
			name_hi varchar(255) NOT NULL,
			name_en varchar(255) DEFAULT '',
			deity varchar(191) NOT NULL,
			city_state varchar(191) NOT NULL,
			darshan_timings varchar(255) DEFAULT '',
			aarti_timings varchar(255) DEFAULT '',
			history_hi longtext,
			how_to_reach_hi text,
			latitude decimal(10,6) DEFAULT 30.086900,
			longitude decimal(10,6) DEFAULT 78.267600,
			status varchar(20) NOT NULL DEFAULT 'published',
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY temple_uid (temple_uid),
			KEY category (category)
		) {$charset_collate};";

		// 18. Yajman Puja Bookings Table (Strict Pending Initial Status)
		$sql_bookings = "CREATE TABLE {$t_bookings} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			booking_uid varchar(64) NOT NULL,
			puja_category varchar(120) NOT NULL,
			puja_service_title varchar(255) NOT NULL,
			pandit_id varchar(64) NOT NULL,
			pandit_name varchar(191) NOT NULL,
			preferred_date varchar(32) NOT NULL,
			preferred_time varchar(32) NOT NULL,
			mode varchar(32) NOT NULL DEFAULT 'in_person',
			yajman_name varchar(191) NOT NULL,
			yajman_gotra varchar(120) DEFAULT '',
			yajman_phone varchar(64) NOT NULL,
			city varchar(191) NOT NULL,
			location_address text,
			sankalp_purpose text,
			dakshina_estimate varchar(64) DEFAULT '',
			status varchar(32) NOT NULL DEFAULT 'pending',
			admin_remarks text,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY booking_uid (booking_uid),
			KEY status (status),
			KEY pandit_id (pandit_id)
		) {$charset_collate};";

		// 19. Help & Support Tickets / Issue Reports Table
		$sql_support = "CREATE TABLE {$t_support} (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			ticket_uid varchar(64) NOT NULL,
			ticket_type varchar(32) NOT NULL DEFAULT 'support',
			subject varchar(255) NOT NULL,
			category varchar(120) NOT NULL,
			user_name varchar(191) NOT NULL,
			user_email varchar(191) DEFAULT '',
			user_phone varchar(64) DEFAULT '',
			message longtext NOT NULL,
			status varchar(32) NOT NULL DEFAULT 'open',
			admin_response text,
			created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id),
			UNIQUE KEY ticket_uid (ticket_uid),
			KEY status (status)
		) {$charset_collate};";

		dbDelta( $sql_knowledge );
		dbDelta( $sql_puja_vidhi );
		dbDelta( $sql_mantras );
		dbDelta( $sql_sanskrit );
		dbDelta( $sql_temples );
		dbDelta( $sql_bookings );
		dbDelta( $sql_support );

		// Safe non-destructive schema & encryption upgrades for existing installations:
		// 1. Ensure wp_jw_reviews.is_verified defaults to 0 and status defaults to 'pending' without deleting or modifying existing review rows.
		$wpdb->query( "ALTER TABLE {$t_reviews} MODIFY COLUMN is_verified tinyint(1) NOT NULL DEFAULT 0" ); // phpcs:ignore
		$wpdb->query( "ALTER TABLE {$t_reviews} MODIFY COLUMN status varchar(20) NOT NULL DEFAULT 'pending'" ); // phpcs:ignore

		// 2. Ensure wp_jw_saved_kundlis.timezone is VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata'.
		// If an earlier installation created timezone as DECIMAL(5,2), MySQL converts existing numeric values (e.g. 5.50)
		// directly into their exact string representations ('5.50') without deleting rows or guessing IANA identifiers.
		$kundli_tz_col = $wpdb->get_row( "SHOW COLUMNS FROM {$t_kundlis} LIKE 'timezone'", ARRAY_A ); // phpcs:ignore
		if ( is_array( $kundli_tz_col ) ) {
			$col_type = strtolower( (string) ( $kundli_tz_col['Type'] ?? '' ) );
			$col_def  = (string) ( $kundli_tz_col['Default'] ?? '' );
			if ( false === strpos( $col_type, 'varchar(64)' ) || 'Asia/Kolkata' !== $col_def ) {
				$wpdb->query( "ALTER TABLE {$t_kundlis} MODIFY COLUMN timezone varchar(64) NOT NULL DEFAULT 'Asia/Kolkata'" ); // phpcs:ignore
			}
		}

		// 3. Ensure wp_jw_api_vault.api_key and api_secret are TEXT columns (upgrading any legacy VARCHAR(500) columns without data loss).
		$vault_cols = $wpdb->get_col( "SHOW COLUMNS FROM {$t_api_vault}", 0 ); // phpcs:ignore
		if ( is_array( $vault_cols ) ) {
			if ( ! in_array( 'api_secret', $vault_cols, true ) ) {
				$wpdb->query( "ALTER TABLE {$t_api_vault} ADD COLUMN api_secret text AFTER api_key" ); // phpcs:ignore
			} else {
				$wpdb->query( "ALTER TABLE {$t_api_vault} MODIFY COLUMN api_secret text" ); // phpcs:ignore
			}
		// 4. Ensure wp_jw_pandits has is_chief column
		$t_pandits = self::table( 'pandits' );
		$pandit_cols = $wpdb->get_col( "SHOW COLUMNS FROM {$t_pandits}", 0 ); // phpcs:ignore
		if ( is_array( $pandit_cols ) && ! in_array( 'is_chief', $pandit_cols, true ) ) {
			$wpdb->query( "ALTER TABLE {$t_pandits} ADD COLUMN is_chief tinyint(1) NOT NULL DEFAULT 0 AFTER about" ); // phpcs:ignore
			$wpdb->query( "UPDATE {$t_pandits} SET is_chief = 1 WHERE display_order = 1 LIMIT 1" ); // phpcs:ignore
		}

		self::seed_initial_data();

		// 3. Automatically encrypt any non-empty plaintext api_key or api_secret values in wp_jw_api_vault using AES-256-CBC + HMAC-SHA256.
		if ( class_exists( 'JW_Settings' ) ) {
			$vault_rows = $wpdb->get_results( "SELECT id, api_key, api_secret FROM {$t_api_vault}", ARRAY_A ); // phpcs:ignore
			if ( is_array( $vault_rows ) ) {
				foreach ( $vault_rows as $v_row ) {
					$updates = array();
					$formats = array();
					$raw_k   = trim( (string) ( $v_row['api_key'] ?? '' ) );
					$raw_s   = trim( (string) ( $v_row['api_secret'] ?? '' ) );
					if ( '' !== $raw_k && ! JW_Settings::is_encrypted_secret( $raw_k ) ) {
						$updates['api_key'] = JW_Settings::encrypt_secret( $raw_k );
						$formats[]          = '%s';
					}
					if ( '' !== $raw_s && ! JW_Settings::is_encrypted_secret( $raw_s ) ) {
						$updates['api_secret'] = JW_Settings::encrypt_secret( $raw_s );
						$formats[]             = '%s';
					}
					if ( ! empty( $updates ) ) {
						$wpdb->update(
							$t_api_vault,
							$updates,
							array( 'id' => (int) $v_row['id'] ),
							$formats,
							array( '%d' )
						);
					}
				}
			}
		}

		update_option( 'jw_backend_db_version', JW_BACKEND_DB_VERSION );
	}

	/**
	 * Builds default detailed festival sections JSON for any seeded Tyohar record.
	 *
	 * @param string $name         Festival name.
	 * @param string $hindi_month  Vedic month & paksha.
	 * @param string $tithi        Tithi name.
	 * @param string $vara         Vara name.
	 * @param string $category     Festival category.
	 * @param string $significance Short significance.
	 * @return string JSON encoded associative array of all 8 detailed festival fields.
	 */
	public static function build_default_tyohar_details_json( $name, $hindi_month, $tithi, $vara, $category, $significance ) {
		$why_celebrated = "{$name} सनातन वैदिक परंपरा का अत्यंत पावन पर्व है, जो {$hindi_month} की {$tithi} ({$vara}) के शुभ संयोग में मनाया जाता है। {$significance} शास्त्रों के अनुसार इस पावन तिथि पर श्रद्धापूर्वक व्रत, देव-आराधना एवं दान-पुण्य करने से साधक के कष्टों का निवारण होता है और परिवार में सुख, शांति, आरोग्य तथा ऐश्वर्य की वृद्धि होती है।";
		$history        = "पद्म पुराण, स्कंद पुराण एवं धर्मसिंधु के अनुसार {$name} की परंपरा वैदिक काल से चली आ रही है। प्राचीन ऋषि-मुनियों ने इस तिथि को खगोलीय ऊर्जा एवं आध्यात्मिक जागृति के लिए अत्यंत सिद्ध माना है।";
		$puja_vidhi     = "1. प्रातः ब्रह्म मुहूर्त में उठकर पवित्र नदी या गंगाजल मिश्रित जल से स्नान करें और स्वच्छ वस्त्र धारण करें।\n2. पूजा स्थल को शुद्ध कर दीप प्रज्वलित करें तथा हाथ में जल, अक्षत और पुष्प लेकर वैदिक संकल्प लें।\n3. इष्ट देव का षोडशोपचार या पंचोपचार पूजन (चंदन, अक्षत, पुष्प, धूप, दीप एवं नैवेद्य) करें।\n4. सायंकाल आरती के पश्चात प्रसाद वितरण करें।";
		$vrat_rules     = "व्रती को दिनभर सात्विक आचरण, ब्रह्मचर्य एवं सत्य भाषण का पालन करना चाहिए। फलाहार या जलाहार रहकर इष्ट मंत्र का जप करें तथा अगले दिन शुभ मुहूर्त में व्रत का पारण करें।";
		$katha_mantra   = "• मूल उपासना मंत्र: \"ॐ नमो भगवते वासुदेवाय नमः\" / \"ॐ नमः शिवाय\"\n• सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥";
		$sankalp        = "अद्य भारतवर्षे भरतखण्डे आर्यावर्तैकदेशान्तर्गते पुण्यप्रदेशे {$hindi_month} मासे {$tithi} तिथौ {$vara} वासरे श्रीपरमेश्वरप्रीत्यर्थं {$name} पर्वणि विधिवत् पूजनं व्रतम् च करिष्ये।";
		$do_and_donts   = "• क्या करें: ब्रह्म मुहूर्त में स्नान, इष्ट ध्यान, गो-सेवा एवं सात्विक दान करें।\n• क्या न करें: तामसिक भोजन, क्रोध, निंदा एवं अशुद्ध आचरण से दूर रहें।";
		$daan_upay      = "इस पावन पर्व पर अन्न, तिल, गुड़, घी, पीले या लाल वस्त्र, धार्मिक पुस्तकें तथा दक्षिणा का सुपात्र ब्राह्मण या जरूरतमंद को दान करना अत्यंत कल्याणकारी है।";

		return wp_json_encode(
			array(
				'whyCelebrated'        => $why_celebrated,
				'detailedSignificance' => $why_celebrated,
				'historyAndPauranik'   => $history,
				'pujaVidhi'            => $puja_vidhi,
				'vratAndRules'         => $vrat_rules,
				'kathaOrMantra'        => $katha_mantra,
				'sankalp'              => $sankalp,
				'doAndDonts'           => $do_and_donts,
				'daanAndUpay'          => $daan_upay,
			)
		);
	}

	/**
	 * Alias for seed_initial_data() used by admin re-sync action.
	 */
	public static function seed_default_data() {
		self::seed_initial_data();
	}

	/**
	 * Seeds initial API Vault entries, Home Screen Banners, Rashifal, Pandits, Tyohar, Gallery, Reviews, and Notifications
	 * if the tables are newly created or missing core entries. Preserves all existing records.
	 */
	public static function seed_initial_data() {
		global $wpdb;

		// 1. Seed API Vault core entries if missing
		$t_api        = self::table( 'api_vault' );
		$default_apis = array(
			array(
				'api_uid'         => 'api_panchang_core',
				'name'            => 'वैदिक पंचांग एवं मुहूर्त गणना API (Panchang Engine)',
				'module'          => 'panchang',
				'module_label'    => '1. पंचांग एवं शुभ मुहूर्त (Panchang API)',
				'provider_name'   => 'JyotishWala Vedic Ephemeris Engine (Lahiri Chitra Paksha)',
				'endpoint_url'    => home_url( '/wp-json/jyotishwala/v1/panchang' ),
				'api_key'         => wp_generate_password( 28, false ),
				'auth_type'       => 'Bearer Token',
				'http_method'     => 'GET',
				'is_enabled'      => 1,
				'description'     => 'तिथि, नक्षत्र, योग, करण, सूर्योदय-सूर्यास्त, चौघड़िया, राहुकाल एवं संकल्प मंत्र के लिए दैनिक पंचांग डेटा प्रदान करता है।',
				'technical_notes' => 'ऋषिकेश (30.0869°N, 78.2676°E) एवं Asia/Kolkata टाइमज़ोन के साथ लाहिड़ी चित्रापक्ष अयनांश आधारित गणना।',
			),
			array(
				'api_uid'         => 'api_kundli_core',
				'name'            => 'जन्मकुंडली, लग्न चक्र एवं विंशोत्तरी दशा API (Kundli Engine)',
				'module'          => 'kundli',
				'module_label'    => '2. जन्मकुंडली निर्माण (Kundli Generator API)',
				'provider_name'   => 'JyotishWala Horoscope & Vargas Chart Engine',
				'endpoint_url'    => home_url( '/wp-json/jyotishwala/v1/kundli' ),
				'api_key'         => wp_generate_password( 28, false ),
				'auth_type'       => 'Bearer Token',
				'http_method'     => 'POST',
				'is_enabled'      => 1,
				'description'     => 'लग्न कुंडली, चंद्र कुंडली, नवमांश (D9), ग्रह स्पष्ट डिग्री, अवकहड़ा चक्र और विंशोत्तरी महादशा तैयार करता है।',
				'technical_notes' => 'जन्म दिनांक, जन्म समय और जन्म स्थान के अक्षांश-देशांतर से 12 भावों व नवग्रहों की सटीक गणना।',
			),
			array(
				'api_uid'         => 'api_milan_core',
				'name'            => 'वर-वधू अष्टकूट 36 गुण एवं मांगलिक मिलान API (Kundli Milan)',
				'module'          => 'milan',
				'module_label'    => '3. कुंडली मिलान (Ashtakoot 36-Guna API)',
				'provider_name'   => 'JyotishWala Ashtakoot Gun Milan Engine',
				'endpoint_url'    => home_url( '/wp-json/jyotishwala/v1/kundli/match' ),
				'api_key'         => wp_generate_password( 28, false ),
				'auth_type'       => 'Bearer Token',
				'http_method'     => 'POST',
				'is_enabled'      => 1,
				'description'     => 'वर और कन्या के 8 कूट (वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट, नाड़ी) के 36 गुणों एवं मांगलिक दोष की जांच करता है।',
				'technical_notes' => 'जन्म विवरण तथा नक्षत्र-चरण दोनों विधियों से अष्टकूट मिलान करता है।',
			),
			array(
				'api_uid'         => 'api_tyohar_core',
				'name'            => 'सनातन व्रत एवं त्योहार कैलेंडर API (Tyohar & Parva API)',
				'module'          => 'tyohar',
				'module_label'    => '4. सनातन व्रत एवं त्योहार (Tyohar Calendar API)',
				'provider_name'   => 'JyotishWala Sanatan Parva & Panchang Calendar',
				'endpoint_url'    => home_url( '/wp-json/jyotishwala/v1/tyohar' ),
				'api_key'         => wp_generate_password( 28, false ),
				'auth_type'       => 'Bearer Token',
				'http_method'     => 'GET',
				'is_enabled'      => 1,
				'description'     => 'संपूर्ण वर्ष के प्रमुख सनातन महापर्व, एकादशी, प्रदोष, संक्रांति एवं उनके 8 विस्तृत शास्त्रीय अनुभाग ऐप में सिंक करता है।',
				'technical_notes' => 'WordPress Admin से जोड़े या संपादित किए गए सभी पर्व तुरंत ऐप में अपडेट होते हैं।',
			),
			array(
				'api_uid'         => 'api_location_geocoding',
				'name'            => 'विश्व शहर एवं अक्षांश-देशांतर खोज API (Location Geocoding)',
				'module'          => 'location',
				'module_label'    => '5. शहर एवं अक्षांश-देशांतर खोज (Location API)',
				'provider_name'   => 'Open-Meteo & Nominatim Geocoding Gateway',
				'endpoint_url'    => 'https://geocoding-api.open-meteo.com/v1/search',
				'api_key'         => 'public_verified_geocoding',
				'auth_type'       => 'Public / Internal Signed',
				'http_method'     => 'GET',
				'is_enabled'      => 1,
				'description'     => 'पंचांग, जन्मकुंडली और कुंडली मिलान में किसी भी शहर या गाँव का सटीक अक्षांश (Latitude) व देशांतर (Longitude) खोजता है।',
				'technical_notes' => 'सर्वर प्रॉक्सी के माध्यम से सुरक्षित रूप से कॉल होता है।',
			),
			array(
				'api_uid'         => 'api_wp_blog_core',
				'name'            => 'ज्योतिष लेख एवं ब्लॉग सिंक API (WordPress Posts API)',
				'module'          => 'articles',
				'module_label'    => '6. ज्योतिष लेख एवं ब्लॉग (WP Posts API)',
				'provider_name'   => 'WordPress Native Posts & Categories REST Bridge',
				'endpoint_url'    => home_url( '/wp-json/jyotishwala/v1/posts' ),
				'api_key'         => wp_generate_password( 24, false ),
				'auth_type'       => 'Public / Internal Signed',
				'http_method'     => 'GET',
				'is_enabled'      => 1,
				'description'     => 'WordPress के Posts सेक्शन में लिखे गए सभी ज्योतिष व धर्म लेख सीधे ऐप के "ज्योतिष लेख" पेज पर दिखाता है।',
				'technical_notes' => 'Featured Image, Category और Author विवरण सहित लाइव सिंक।',
			),
			array(
				'api_uid'         => 'api_gemini_optional',
				'name'            => 'Google Gemini Jyotish API (Optional AI Assistant)',
				'module'          => 'gemini',
				'module_label'    => '7. Gemini AI API (सर्वर-साइड वैकल्पिक)',
				'provider_name'   => 'Google Gemini API',
				'endpoint_url'    => 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
				'api_key'         => '',
				'auth_type'       => 'API Key Header',
				'http_method'     => 'POST',
				'is_enabled'      => 0,
				'description'     => 'यदि भविष्य में किसी स्मार्ट ज्योतिष सहायता के लिए Gemini API की आवश्यकता हो तो यहाँ गुप्त कुंजी सुरक्षित रखें।',
				'technical_notes' => 'यह कुंजी AES-256-CBC से एन्क्रिप्ट रहती है और कभी भी फ्रंटएंड या APK में नहीं भेजी जाती।',
			),
		);

		foreach ( $default_apis as $api_row ) {
			$exists_api = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$t_api} WHERE api_uid = %s", $api_row['api_uid'] ) ); // phpcs:ignore
			if ( ! $exists_api ) {
				$wpdb->insert( $t_api, $api_row );
			}
		}

		// 2. Seed Home Banners if empty
		$t_banners    = self::table( 'banners' );
		$banner_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_banners}" ); // phpcs:ignore
		if ( 0 === $banner_count ) {
			$default_banners = array(
				array(
					'slide_uid'     => 'slide_kundli',
					'badge'         => 'वैदिक जन्मकुंडली एवं लग्न चक्र',
					'title'         => 'निःशुल्क विस्तृत जन्मकुंडली व ग्रह विश्लेषण',
					'subtitle'      => 'जन्म तिथि, समय और स्थान से सटीक लग्न कुंडली, नवमांश, विंशोत्तरी दशा एवं दोष विश्लेषण प्राप्त करें।',
					'cta_text'      => 'कुंडली बनाएं',
					'target_page'   => 'kundli',
					'bg_theme'      => 'teal',
					'bg_image_url'  => 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=1200&q=80',
					'display_order' => 1,
					'is_enabled'    => 1,
				),
				array(
					'slide_uid'     => 'slide_panchang',
					'badge'         => 'शुद्ध ऋषिकेश एवं काशी पंचांग',
					'title'         => 'दैनिक पंचांग, चौघड़िया एवं शुभ मुहूर्त',
					'subtitle'      => 'तिथि, नक्षत्र, योग, करण, राहुकाल, अभिजीत मुहूर्त एवं सौर प्रविष्टे की प्रतिदिन सटीक गणना।',
					'cta_text'      => 'पंचांग देखें',
					'target_page'   => 'panchang',
					'bg_theme'      => 'saffron',
					'bg_image_url'  => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
					'display_order' => 2,
					'is_enabled'    => 1,
				),
				array(
					'slide_uid'     => 'slide_milan',
					'badge'         => 'वैवाहिक अष्टकूट गुण मिलान',
					'title'         => 'वर-वधू कुंडली मिलान एवं मांगलिक दोष जांच',
					'subtitle'      => '36 गुणों का शास्त्रीय मिलान, नाड़ी-भकूट दोष परिहार एवं सुखद वैवाहिक जीवन हेतु सटीक परामर्श।',
					'cta_text'      => 'कुंडली मिलान करें',
					'target_page'   => 'milan',
					'bg_theme'      => 'dark',
					'bg_image_url'  => 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
					'display_order' => 3,
					'is_enabled'    => 1,
				),
				array(
					'slide_uid'     => 'slide_pandit',
					'badge'         => 'प्रमाणित ज्योतिषाचार्य परामर्श',
					'title'         => 'अनुभवी वैदिक आचार्यों से सीधा संवाद',
					'subtitle'      => 'काशी व ऋषिकेश के विद्वान आचार्यों से कुंडली, वास्तु, करियर व ग्रह शांति हेतु फोन या व्हाट्सएप पर बात करें।',
					'cta_text'      => 'पंडित जी से बात करें',
					'target_page'   => 'chat',
					'bg_theme'      => 'emerald',
					'bg_image_url'  => 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
					'display_order' => 4,
					'is_enabled'    => 1,
				),
				array(
					'slide_uid'     => 'slide_dharma',
					'badge'         => 'सनातन धर्म, मंत्र एवं साधना',
					'title'         => '108 रुद्राक्ष जप माला, नवग्रह मंत्र एवं संकल्प',
					'subtitle'      => 'डिजिटल रुद्राक्ष माला से मंत्र जप करें तथा दैनिक पूजा हेतु शुद्ध वैदिक संकल्प मंत्र व पर्व कैलेंडर देखें।',
					'cta_text'      => 'धर्म एवं मंत्र देखें',
					'target_page'   => 'dharma',
					'bg_theme'      => 'indigo',
					'bg_image_url'  => 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=80',
					'display_order' => 5,
					'is_enabled'    => 1,
				),
			);

			foreach ( $default_banners as $banner ) {
				$wpdb->insert( $t_banners, $banner );
			}
		}

		// 3. Seed 12 Rashi Predictions if empty
		$t_rashifal  = self::table( 'rashifal' );
		$rashi_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_rashifal}" ); // phpcs:ignore
		if ( 0 === $rashi_count ) {
			$rashis = array(
				array( 'mesh', 'मेष', 'Aries', 'आज आपका आत्मविश्वास प्रबल रहेगा। रुके हुए कार्य गति पकड़ेंगे और कार्यक्षेत्र में आपकी प्रशंसा होगी।', 'Your self-confidence will remain strong today. Stalled tasks will gain momentum and you will be appreciated at work.', '9', 'लाल' ),
				array( 'vrishabh', 'वृषभ', 'Taurus', 'आर्थिक पक्ष सुदृढ़ होगा। परिवार में मांगलिक कार्य की रूपरेखा बनेगी और वाणी की मधुरता से लाभ मिलेगा।', 'Your financial position will strengthen. Auspicious family plans will take shape and polite speech will bring benefits.', '6', 'सफेद' ),
				array( 'mithun', 'मिथुन', 'Gemini', 'बौद्धिक कार्यों एवं व्यापार में नई सफलता मिलेगी। मित्रों का सहयोग प्राप्त होगा और नया निवेश लाभकारी रहेगा।', 'New success in intellectual pursuits and business. Support from friends and profitable new investments are indicated.', '5', 'हरा' ),
				array( 'kark', 'कर्क', 'Cancer', 'मन शांत एवं प्रसन्न रहेगा। माता-पिता के आशीर्वाद से संपत्ति संबंधी विवाद हल होंगे।', 'Your mind will remain calm and cheerful. Property matters will be resolved with the blessings of parents.', '2', 'दूधिया सफेद' ),
				array( 'simha', 'सिंह', 'Leo', 'नेतृत्व क्षमता में वृद्धि होगी। शासन-प्रशासन व उच्चाधिकारियों से सहयोग प्राप्त होगा।', 'Leadership abilities will grow. You will receive cooperation from authorities and senior officials.', '1', 'सुनहरा नारंगी' ),
				array( 'kanya', 'कन्या', 'Virgo', 'योजनाबद्ध तरीके से किए गए कार्यों में उत्तम फल मिलेगा। स्वास्थ्य के प्रति सचेत रहें।', 'Planned tasks will yield excellent results. Stay mindful of your health and routine.', '5', 'हल्का हरा' ),
				array( 'tula', 'तुला', 'Libra', 'दांपत्य जीवन में मधुरता बढ़ेगी। साझेदारी के व्यवसाय में विशेष धन लाभ के योग हैं।', 'Harmony in marital life will increase. Special financial gains are indicated in partnership ventures.', '6', 'गुलाबी' ),
				array( 'vrishchik', 'वृश्चिक', 'Scorpio', 'साहस और पराक्रम से कठिन कार्य भी सिद्ध होंगे। गुप्त शत्रुओं पर विजय प्राप्त होगी।', 'Even difficult tasks will succeed through courage and determination. Victory over hidden obstacles is assured.', '9', 'केसरिया' ),
				array( 'dhanu', 'धनु', 'Sagittarius', 'धर्म-अध्यात्म और शिक्षा के क्षेत्र में उन्नति होगी। गुरुजनों का मार्गदर्शन नई दिशा देगा।', 'Progress in spirituality, dharma, and education. Guidance from mentors will open a new direction.', '3', 'पीला' ),
				array( 'makar', 'मकर', 'Capricorn', 'परिश्रम का पूर्ण फल प्राप्त होगा। भूमि, भवन या वाहन खरीदने के शुभ योग बन रहे हैं।', 'Hard work will bring full rewards. Auspicious yogas for acquiring land, property, or vehicle are forming.', '8', 'नीला' ),
				array( 'kumbh', 'कुंभ', 'Aquarius', 'सामाजिक प्रतिष्ठा में वृद्धि होगी। नई तकनीकी या व्यावसायिक योजनाओं से आय के स्रोत बढ़ेंगे।', 'Social prestige will rise. New technical or business plans will expand your sources of income.', '8', 'आसमानी' ),
				array( 'meen', 'मीन', 'Pisces', 'आध्यात्मिक शांति और रचनात्मकता का अनुभव करेंगे। संतान पक्ष से शुभ समाचार प्राप्त होगा।', 'You will experience spiritual peace and creativity. Good news from children is indicated.', '3', 'हल्दी पीला' ),
			);

			foreach ( array( 'daily', 'weekly', 'monthly', 'yearly' ) as $period ) {
				foreach ( $rashis as $r ) {
					$wpdb->insert(
						$t_rashifal,
						array(
							'rashi_id'       => $r[0],
							'rashi_name_hi'  => $r[1],
							'rashi_name_en'  => $r[2],
							'period'         => $period,
							'reference_date' => current_time( 'Y-m-d' ),
							'prediction_hi'  => $r[3],
							'prediction_en'  => $r[4],
							'career_hi'      => 'कार्यक्षेत्र में सकारात्मक प्रगति एवं वरिष्ठों का सहयोग मिलेगा।',
							'health_hi'      => 'स्वास्थ्य उत्तम रहेगा, नियमित योग एवं प्राणायाम करें।',
							'love_hi'        => 'पारिवारिक एवं वैवाहिक संबंधों में आपसी विश्वास बढ़ेगा।',
							'remedy_hi'      => 'प्रातः सूर्य देव को अर्घ्य दें एवं इष्ट मंत्र का 108 बार जप करें।',
							'lucky_number'   => $r[5],
							'lucky_color'    => $r[6],
							'status'         => 'published',
						)
					);
				}
			}
		}

		// 4. Seed all 3 Original Pandits if missing
		$t_pandits = self::table( 'pandits' );
		$default_pandits = array(
			array(
				'pandit_uid'       => 'pandit_1',
				'name'             => 'पं. राधेश्याम शास्त्री',
				'qualification'    => 'ज्योतिषाचार्य, काशी हिन्दू विश्वविद्यालय',
				'experience_years' => 25,
				'specialties'      => 'जन्मकुंडली विश्लेषण, कुंडली मिलान, दोष निवारण अनुष्ठान, वैदिक कर्मकांड',
				'languages'        => 'हिन्दी, संस्कृत',
				'mobile'           => '+91 98765 43210',
				'email'            => 'radheshyam.shastri@jyotishwala.com',
				'address'          => 'तपोवन, लक्ष्मण झूला मार्ग, ऋषिकेश, उत्तराखंड - 249192',
				'avatar_url'       => '',
				'qr_code_url'      => '',
				'dakshina_info'    => 'परामर्श दक्षिणा: ₹501',
				'about'            => 'काशी हिन्दू विश्वविद्यालय से ज्योतिष शास्त्र में आचार्य। विगत 25 वर्षों से ऋषिकेश एवं काशी से सटीक जन्मकुंडली फलादेश, विवाह मिलान तथा वैदिक अनुष्ठान मार्गदर्शन प्रदान कर रहे हैं।',
				'is_active'        => 1,
				'display_order'    => 1,
			),
			array(
				'pandit_uid'       => 'pandit_2',
				'name'             => 'आचार्य देवकीनंदन जोशी',
				'qualification'    => 'वास्तु एवं धर्मशास्त्र विशेषज्ञ, संपूर्णानंद संस्कृत विश्वविद्यालय',
				'experience_years' => 19,
				'specialties'      => 'वास्तु शास्त्र, प्रश्न कुंडली, मुहूर्त निर्णय, व्यापार वृद्धि उपाय',
				'languages'        => 'हिन्दी, संस्कृत, मराठी',
				'mobile'           => '+91 98111 22334',
				'email'            => 'devkinandan.joshi@jyotishwala.com',
				'address'          => 'त्रिवेणी घाट मार्ग, ऋषिकेश, उत्तराखंड - 249201',
				'avatar_url'       => '',
				'qr_code_url'      => '',
				'dakshina_info'    => 'परामर्श दक्षिणा: ₹351',
				'about'            => 'उत्तराखंड के सुप्रसिद्ध ज्योतिर्विद एवं वास्तु विशेषज्ञ। भवन, कार्यालय एवं औद्योगिक वास्तु दोषों के वैदिक निवारण तथा शुभ मुहूर्त गणना में विशेष दक्षता।',
				'is_active'        => 1,
				'display_order'    => 2,
			),
			array(
				'pandit_uid'       => 'pandit_3',
				'name'             => 'पं. रामानंद त्रिवेदी',
				'qualification'    => 'फलित ज्योतिष एवं रुद्राभिषेक आचार्य',
				'experience_years' => 22,
				'specialties'      => 'शुभ मुहूर्त निर्णय, महामृत्युंजय अनुष्ठान, कालसर्प व पितृ दोष, नामकरण संस्कार',
				'languages'        => 'हिन्दी, संस्कृत',
				'mobile'           => '+91 94120 55667',
				'email'            => 'ramanand.trivedi@jyotishwala.com',
				'address'          => 'स्वर्गाश्रम क्षेत्र, ऋषिकेश, उत्तराखंड - 249304',
				'avatar_url'       => '',
				'qr_code_url'      => '',
				'dakshina_info'    => 'परामर्श दक्षिणा: ₹401',
				'about'            => 'गंगा तट ऋषिकेश के परंपरागत पुरोहित कुल से। गृह प्रवेश, विवाह संस्कार, मुंडन एवं ग्रह शांति अनुष्ठानों के वरिष्ठ मार्गदर्शक।',
				'is_active'        => 1,
				'display_order'    => 3,
			),
		);
		foreach ( $default_pandits as $p_row ) {
			$exists = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$t_pandits} WHERE pandit_uid = %s", $p_row['pandit_uid'] ) ); // phpcs:ignore
			if ( ! $exists ) {
				$wpdb->insert( $t_pandits, $p_row );
			}
		}

		// 5. Seed Initial Tyohar Records if empty (preserving any existing records)
		$t_tyohar     = self::table( 'tyohar' );
		$tyohar_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_tyohar}" ); // phpcs:ignore
		if ( 0 === $tyohar_count ) {
			$default_tyohars = array(
				array( 'ty_jan_1', 'मकर संक्रांति एवं उत्तरायण महापर्व', '2026-01-14', 1, 'बुधवार', 'माघ', 'कृष्ण पक्ष', 'एकादशी / मकर संक्रांति', 'संक्रांति एवं जयंती', 'सूर्य देव के धनु राशि से मकर राशि में प्रवेश करने और उत्तरायण प्रारंभ होने का पावन पर्व। इस दिन गंगा स्नान, तिल-गुड़ और खिचड़ी दान करने से अक्षय पुण्य की प्राप्ति होती है।' ),
				array( 'ty_jan_4', 'बसंत पंचमी (श्री सरस्वती पूजा)', '2026-01-23', 1, 'शुक्रवार', 'माघ', 'शुक्ल पक्ष', 'पंचमी तिथि', 'प्रमुख महापर्व', 'विद्या, ज्ञान और संगीत की अधिष्ठात्री देवी मां सरस्वती के प्राकट्य का पावन पर्व। यह दिन विद्यारंभ, गृह प्रवेश और समस्त मांगलिक कार्यों के लिए अबूझ मुहूर्त होता है।' ),
				array( 'ty_feb_3', 'महाशिवरात्रि महापर्व', '2026-02-15', 2, 'रविवार', 'फाल्गुन', 'कृष्ण पक्ष', 'चतुर्दशी तिथि', 'शक्ति एवं शिव पर्व', 'भगवान शिव और माता पार्वती के दिव्य विवाह की पावन रात्रि। चारों प्रहर में शिवलिंग का रुद्राभिषेक, बिल्वपत्र अर्पण और पंचाक्षरी मंत्र जाप से मोक्ष व मनोकामना सिद्धि होती है।' ),
				array( 'ty_mar_2', 'होलिका दहन एवं फाल्गुन पूर्णिमा', '2026-03-03', 3, 'मंगलवार', 'फाल्गुन', 'शुक्ल पक्ष', 'पूर्णिमा तिथि', 'प्रमुख महापर्व', 'भक्त प्रह्लाद की रक्षा और अधर्म के विनाश का प्रतीक पावन पर्व।' ),
				array( 'ty_mar_5', 'चैत्र नवरात्रि प्रारंभ एवं हिंदू नववर्ष (विक्रम संवत 2083)', '2026-03-19', 3, 'गुरुवार', 'चैत्र', 'शुक्ल पक्ष', 'प्रतिपदा तिथि', 'शक्ति एवं शिव पर्व', 'नवसंवत्सर का शुभारंभ एवं कलश स्थापना के साथ मां जगदंबा के नौ स्वरूपों की आराधना का महापर्व।' ),
				array( 'ty_mar_7', 'श्री राम नवमी महापर्व', '2026-03-27', 3, 'शुक्रवार', 'चैत्र', 'शुक्ल पक्ष', 'नवमी तिथि', 'प्रमुख महापर्व', 'मर्यादा पुरुषोत्तम भगवान श्रीराम के जन्मोत्सव एवं चैत्र नवरात्रि की पूर्णाहुति का पावन पर्व।' ),
				array( 'ty_apr_4', 'अक्षय तृतीया (आखा तीज) एवं परशुराम जयंती', '2026-04-19', 4, 'रविवार', 'वैशाख', 'शुक्ल पक्ष', 'तृतीया तिथि', 'प्रमुख महापर्व', 'स्वयंसिद्ध अबूझ मुहूर्त। इस दिन किया गया जप, यज्ञ, दान और स्वर्ण क्रय अक्षय फल प्रदान करता है।' ),
				array( 'ty_may_4', 'निर्जला (भीमसेनी) एकादशी व्रत', '2026-05-27', 5, 'बुधवार', 'ज्येष्ठ', 'शुक्ल पक्ष', 'एकादशी तिथि', 'एकादशी एवं व्रत', 'वर्ष की समस्त चौबीस एकादशियों का फल प्रदान करने वाला सर्वश्रेष्ठ निर्जला व्रत एवं जल-घट दान पर्व।' ),
				array( 'ty_jul_2', 'देवशयनी आषाढ़ी एकादशी (चातुर्मास प्रारंभ)', '2026-07-25', 7, 'शनिवार', 'आषाढ़', 'शुक्ल पक्ष', 'एकादशी तिथि', 'एकादशी एवं व्रत', 'भगवान श्री हरि विष्णु के योगनिद्रा में जाने और चार मास के पावन चातुर्मास नियम का शुभारंभ।' ),
				array( 'ty_jul_3', 'गुरु पूर्णिमा (व्यास पूर्णिमा) महापर्व', '2026-07-29', 7, 'बुधवार', 'आषाढ़', 'शुक्ल पक्ष', 'पूर्णिमा तिथि', 'प्रमुख महापर्व', 'महर्षि वेदव्यास जी की जयंती एवं गुरु पूजन का पावन पर्व।' ),
				array( 'ty_aug_4', 'रक्षाबंधन एवं श्रावणी उपाकर्म', '2026-08-28', 8, 'शुक्रवार', 'श्रावण', 'शुक्ल पक्ष', 'पूर्णिमा तिथि', 'प्रमुख महापर्व', 'भाई-बहन के पवित्र स्नेह एवं वैदिक यज्ञोपवीत धारण करने का पावन पर्व।' ),
				array( 'ty_sep_1', 'श्री कृष्ण जन्माष्टमी महापर्व', '2026-09-04', 9, 'शुक्रवार', 'भाद्रपद', 'कृष्ण पक्ष', 'अष्टमी तिथि (रोहिणी नक्षत्र)', 'प्रमुख महापर्व', 'भगवान श्रीकृष्ण के दिव्य प्राकट्य का महापर्व। मध्यरात्रि जन्मोत्सव, अभिषेक एवं व्रत से समस्त मनोरथ पूर्ण होते हैं।' ),
				array( 'ty_sep_3', 'श्री गणेश चतुर्थी (विनायक चतुर्थी) महोत्सव', '2026-09-14', 9, 'सोमवार', 'भाद्रपद', 'शुक्ल पक्ष', 'चतुर्थी तिथि', 'प्रमुख महापर्व', 'प्रथम पूज्य विघ्नहर्ता भगवान श्री गणेश जी की स्थापना एवं दस दिवसीय विशेष आराधना का महापर्व।' ),
				array( 'ty_oct_2', 'शारदीय नवरात्रि प्रारंभ (घटस्थापना)', '2026-10-11', 10, 'रविवार', 'आश्विन', 'शुक्ल पक्ष', 'प्रतिपदा तिथि', 'शक्ति एवं शिव पर्व', 'आदिशक्ति मां दुर्गा के नौ स्वरूपों की आराधना, कलश स्थापना एवं दुर्गा सप्तशती पाठ का महापर्व।' ),
				array( 'ty_oct_5', 'विजयादशमी (दशहरा) महापर्व', '2026-10-20', 10, 'मंगलवार', 'आश्विन', 'शुक्ल पक्ष', 'दशमी तिथि', 'प्रमुख महापर्व', 'अधर्म पर धर्म की विजय, शस्त्र पूजन एवं अपराजिता देवी पूजन का पावन पर्व।' ),
				array( 'ty_nov_1', 'धनतेरस (धन्वंतरि जयंती) एवं यम दीपदान', '2026-11-06', 11, 'शुक्रवार', 'कार्तिक', 'कृष्ण पक्ष', 'त्रयोदशी तिथि', 'प्रमुख महापर्व', 'भगवान धन्वंतरि, मां लक्ष्मी एवं कुबेर पूजन के साथ पांच दिवसीय दीपोत्सव का शुभारंभ।' ),
				array( 'ty_nov_3', 'दीपावली (महालक्ष्मी पूजन) महापर्व', '2026-11-08', 11, 'रविवार', 'कार्तिक', 'कृष्ण पक्ष', 'अमावस्या तिथि', 'प्रमुख महापर्व', 'प्रदोष एवं स्थिर लग्न में भगवती महालक्ष्मी, श्री गणेश एवं कुबेर पूजन तथा दीपमालिका प्रज्वलन का सर्वोच्च महापर्व।' ),
				array( 'ty_nov_5', 'देवउठनी (प्रबोधिनी) एकादशी एवं तुलसी विवाह', '2026-11-20', 11, 'शुक्रवार', 'कार्तिक', 'शुक्ल पक्ष', 'एकादशी तिथि', 'एकादशी एवं व्रत', 'भगवान विष्णु के योगनिद्रा से जागने और चातुर्मास समाप्ति के साथ समस्त मांगलिक कार्यों का पुनः शुभारंभ।' ),
				array( 'ty_nov_6', 'कार्तिक पूर्णिमा (देव दीपावली) महापर्व', '2026-11-24', 11, 'मंगलवार', 'कार्तिक', 'शुक्ल पक्ष', 'पूर्णिमा तिथि', 'प्रमुख महापर्व', 'काशी एवं ऋषिकेश में गंगा तट पर कोटि दीपदान, पवित्र गंगा स्नान एवं त्रिपुरारी शिव पूजन का दिव्य पर्व।' ),
				array( 'ty_dec_2', 'मोक्षदा एकादशी एवं श्रीमद्भगवद्गीता जयंती', '2026-12-20', 12, 'रविवार', 'मार्गशीर्ष', 'शुक्ल पक्ष', 'एकादशी तिथि', 'एकादशी एवं व्रत', 'भगवान श्रीकृष्ण द्वारा अर्जुन को गीता उपदेश देने की पावन तिथि एवं पितरों को मोक्ष प्रदान करने वाली एकादशी।' ),
			);

			foreach ( $default_tyohars as $t ) {
				$wpdb->insert(
					$t_tyohar,
					array(
						'tyohar_uid'   => $t[0],
						'name'         => $t[1],
						'tyohar_date'  => $t[2],
						'month_number' => $t[3],
						'vara'         => $t[4],
						'hindi_month'  => $t[5],
						'paksha'       => $t[6],
						'tithi'        => $t[7],
						'category'     => $t[8],
						'significance' => $t[9],
						'details_json' => self::build_default_tyohar_details_json( $t[1], $t[5] . ' ' . $t[6], $t[7], $t[4], $t[8], $t[9] ),
						'is_active'    => 1,
					)
				);
			}
		}

		// 6. Seed Gallery Photos (Single & Group Albums) if empty
		$t_gallery = self::table( 'gallery' );
		$gal_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_gallery}" ); // phpcs:ignore
		if ( 0 === $gal_count ) {
			$default_gallery = array(
				array(
					'photo_uid'         => 'gal_1',
					'title'             => 'काशी विश्वनाथ धाम में महारुद्राभिषेक अनुष्ठान',
					'category'          => 'रुद्राभिषेक एवं शिव पूजन',
					'location'          => 'वाराणसी (काशी), उत्तर प्रदेश',
					'event_date'        => '2026-10-28',
					'acharya_name'      => 'आचार्य परेश्वर भारद्वाज',
					'description'       => 'श्रावण एवं कार्तिक मास के विशेष पर्व पर ग्यारह वैदिक ब्राह्मणों द्वारा शुक्ल यजुर्वेदीय रुद्राष्टाध्यायी पाठ के साथ संपन्न दिव्य महारुद्राभिषेक एवं बिल्वपत्र अर्पण।',
					'image_url'         => 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=85',
					'group_images_json' => wp_json_encode(
						array(
							'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85',
						)
					),
					'is_featured'       => 1,
					'display_order'     => 1,
				),
				array(
					'photo_uid'         => 'gal_2',
					'title'             => 'ऋषिकेश गंगा तट पर नवग्रह शांति एवं महामृत्युंजय हवन',
					'category'          => 'महायज्ञ एवं हवन',
					'location'          => 'परमार्थ निकेतन घाट, ऋषिकेश',
					'event_date'        => '2026-10-22',
					'acharya_name'      => 'आचार्य परेश्वर भारद्वाज एवं आचार्य मंडल',
					'description'       => 'यजमान परिवार के सकल मनोरथ सिद्धि, आरोग्य एवं दीर्घायु की कामना से सवा लाख महामृत्युंजय मंत्र जप के उपरांत दशांश हवन एवं पूर्णाहुति का भव्य दृश्य।',
					'image_url'         => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
					'group_images_json' => wp_json_encode(
						array(
							'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
						)
					),
					'is_featured'       => 1,
					'display_order'     => 2,
				),
				array(
					'photo_uid'         => 'gal_3',
					'title'             => 'दशाश्वमेध घाट वाराणसी में भव्य सांध्य गंगा आरती दर्शन',
					'category'          => 'तीर्थ एवं मंदिर दर्शन',
					'location'          => 'दशाश्वमेध घाट, वाराणसी',
					'event_date'        => '2026-10-18',
					'acharya_name'      => 'ज्योतिषवाला काशी केंद्र',
					'description'       => 'माँ भगवती गंगा के पावन तट पर सहस्र दीपों एवं शंखध्वनि के साथ संपन्न सांध्यकालीन महाआरती एवं विश्व कल्याण प्रार्थना।',
					'image_url'         => 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85',
					'group_images_json' => null,
					'is_featured'       => 0,
					'display_order'     => 3,
				),
				array(
					'photo_uid'         => 'gal_4',
					'title'             => 'दीपावली महालक्ष्मी-कुबेर षोडशोपचार पूजन एवं श्रीसूक्त पाठ',
					'category'          => 'पूजा-पाठ व अनुष्ठान',
					'location'          => 'वाराणसी, उत्तर प्रदेश',
					'event_date'        => '2026-10-15',
					'acharya_name'      => 'आचार्य परेश्वर भारद्वाज',
					'description'       => 'स्थिर वृषभ एवं सिंह लग्न में कमल पुष्पों, अष्टगंध एवं शुद्ध घृत दीपों द्वारा संपन्न श्री महालक्ष्मी-गणेश एवं कुबेर यंत्र अभिषेक अनुष्ठान।',
					'image_url'         => 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
					'group_images_json' => wp_json_encode(
						array(
							'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1200&q=85',
							'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
						)
					),
					'is_featured'       => 1,
					'display_order'     => 4,
				),
				array(
					'photo_uid'         => 'gal_5',
					'title'             => 'प्राचीन ताड़पत्र एवं हस्तलिखित जन्मकुंडली शास्त्र अनुसंधान',
					'category'          => 'ज्योतिष परामर्श व सम्मेलन',
					'location'          => 'सम्पूर्णानन्द संस्कृत विश्वविद्यालय परिसर, वाराणसी',
					'event_date'        => '2026-10-10',
					'acharya_name'      => 'आचार्य परेश्वर भारद्वाज',
					'description'       => 'बृहत्पाराशर होराशास्त्र, सूर्य सिद्धांत एवं प्राचीन पंचांग पांडुलिपियों के आधार पर सूक्ष्म ग्रह गणित व फलित ज्योतिष पर शोध कार्य।',
					'image_url'         => 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=1200&q=85',
					'group_images_json' => null,
					'is_featured'       => 0,
					'display_order'     => 5,
				),
			);

			foreach ( $default_gallery as $gal_row ) {
				$wpdb->insert( $t_gallery, $gal_row );
			}
		}

		// 7. Seed Reviews if empty
		$t_reviews = self::table( 'reviews' );
		$rev_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_reviews}" ); // phpcs:ignore
		if ( 0 === $rev_count ) {
			$default_reviews = array(
				array(
					'review_uid'       => 'rev_1',
					'user_name'        => 'राजीव शर्मा',
					'user_city'        => 'वाराणसी, उत्तर प्रदेश',
					'rating'           => 5,
					'service_category' => 'दैनिक पंचांग एवं मुहूर्त',
					'comment'          => 'काशी और ऋषिकेश परंपरा पर आधारित एकदम सटीक पंचांग है। तिथि, नक्षत्र, चौघड़िया और राहुकाल का समय शास्त्रीय पंचांग से पूर्णतः मेल खाता है। प्रतिदिन पूजा से पहले मैं इसी ऐप का उपयोग करता हूँ।',
					'admin_reply'      => 'सादर धन्यवाद राजीव जी! काशी एवं ऋषिकेश की शास्त्रीय गणना को आप तक शुद्ध रूप में पहुँचाना ही हमारा संकल्प है।',
					'is_verified'      => 1,
					'status'           => 'approved',
				),
				array(
					'review_uid'       => 'rev_2',
					'user_name'        => 'डॉ. अनुराधा मिश्रा',
					'user_city'        => 'लखनऊ, उत्तर प्रदेश',
					'rating'           => 5,
					'service_category' => 'पंडित जी से परामर्श',
					'comment'          => 'आचार्य परेश्वर भारद्वाज जी से जन्मकुंडली एवं करियर के विषय में परामर्श लिया। उनके द्वारा बताए गए वैदिक उपाय अत्यंत सरल और प्रभावी हैं।',
					'admin_reply'      => 'हार्दिक आभार डॉ. अनुराधा जी! महादेव आपकी सभी मनोकामनाएं पूर्ण करें।',
					'is_verified'      => 1,
					'status'           => 'approved',
				),
				array(
					'review_uid'       => 'rev_3',
					'user_name'        => 'विकास अग्रवाल',
					'user_city'        => 'जयपुर, राजस्थान',
					'rating'           => 5,
					'service_category' => 'कुंडली मिलान (अष्टकूट)',
					'comment'          => 'मेरे छोटे भाई के विवाह हेतु अष्टकूट 36 गुण मिलान और मांगलिक दोष की जांच इसी ऐप से की। भकूट, नाड़ी और गण दोष का विवरण बहुत साफ और सरल हिंदी में समझाया गया है।',
					'admin_reply'      => '',
					'is_verified'      => 1,
					'status'           => 'approved',
				),
			);
			foreach ( $default_reviews as $rev_row ) {
				$wpdb->insert( $t_reviews, $rev_row );
			}
		}

		// 8. Seed Default Notifications if empty
		$t_notifs    = self::table( 'notifications' );
		$notif_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_notifs}" ); // phpcs:ignore
		if ( 0 === $notif_count ) {
			$default_notifs = array(
				array(
					'notif_uid'     => 'ntf_seed_1',
					'title'         => 'ऋषिकेश अभिजीत मुहूर्त अलर्ट',
					'message'       => 'आज दोपहर अभिजीत मुहूर्त में शुभ कार्य प्रारंभ करने का श्रेष्ठ समय है।',
					'category'      => 'muhurta',
					'target_screen' => 'panchang',
					'status'        => 'sent',
				),
				array(
					'notif_uid'     => 'ntf_seed_2',
					'title'         => 'शनि एवं गुरु गोचर विशेष अपडेट',
					'message'       => 'ग्रह गोचर का आपकी चंद्र राशि पर प्रभाव एवं वैदिक उपाय देखें।',
					'category'      => 'transit',
					'target_screen' => 'gochar',
					'status'        => 'sent',
				),
				array(
					'notif_uid'     => 'ntf_seed_3',
					'title'         => 'दैनिक पंचांग एवं तिथि अपडेट',
					'message'       => 'आज के सूर्योदय, तिथि, नक्षत्र, योग, करण एवं चौघड़िया की संपूर्ण गणना उपलब्ध है।',
					'category'      => 'panchang',
					'target_screen' => 'panchang',
					'status'        => 'sent',
				),
				array(
					'notif_uid'     => 'ntf_seed_4',
					'title'         => 'दैनिक राशिफल सूचना',
					'message'       => 'मेष से मीन तक सभी 12 राशियों का आज का दैनिक राशिफल अपडेट हो गया है।',
					'category'      => 'rashifal',
					'target_screen' => 'rashifal',
					'status'        => 'sent',
				),
				array(
					'notif_uid'     => 'ntf_seed_5',
					'title'         => 'आगामी एकादशी एवं प्रमुख पर्व',
					'message'       => 'इस माह के प्रमुख सनातन व्रत एवं त्योहारों की तिथि व पूजा विधि देखें।',
					'category'      => 'tyohar',
					'target_screen' => 'tyohar',
					'status'        => 'sent',
				),
			);
			foreach ( $default_notifs as $nf_row ) {
				$wpdb->insert( $t_notifs, $nf_row );
			}
		}
	}
}
