<?php
/**
 * App User Management for JyotishWala Backend.
 *
 * Reuses WordPress `wp_users` and `wp_usermeta` tables for mobile app users
 * (with role `subscriber` + meta `jw_app_user = 1`), avoiding duplicate user tables.
 * Includes full support for Email/Phone Login, Forgot Password, and Forgot Email recovery.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_User_Management {

	/**
	 * Normalizes a phone number to its last 10 digits for reliable lookup.
	 *
	 * @param string $phone Raw phone input.
	 * @return string
	 */
	public static function normalize_phone_digits( $phone ) {
		$digits = preg_replace( '/\D+/', '', (string) $phone );
		if ( strlen( $digits ) > 10 ) {
			$digits = substr( $digits, -10 );
		}
		return $digits;
	}

	/**
	 * Finds a WordPress user by email, username, or mobile number (`jw_phone`).
	 *
	 * @param string $identifier Email, phone, or username.
	 * @return WP_User|false
	 */
	public static function find_user_by_identifier( $identifier ) {
		$raw = trim( (string) $identifier );
		if ( '' === $raw ) {
			return false;
		}

		// 1. Try Email
		if ( is_email( $raw ) || false !== strpos( $raw, '@' ) ) {
			$clean_email = sanitize_email( strtolower( $raw ) );
			$user        = get_user_by( 'email', $clean_email );
			if ( $user ) {
				return $user;
			}
		}

		// 2. Try Username / Login
		$user = get_user_by( 'login', sanitize_user( $raw ) );
		if ( $user ) {
			return $user;
		}

		// 3. Try Exact Phone Meta Match
		$users_by_phone = get_users(
			array(
				'meta_key'   => 'jw_phone',
				'meta_value' => sanitize_text_field( $raw ),
				'number'     => 1,
			)
		);
		if ( ! empty( $users_by_phone ) ) {
			return $users_by_phone[0];
		}

		// 4. Try Normalized 10-Digit Phone Meta Match
		$digits = self::normalize_phone_digits( $raw );
		if ( strlen( $digits ) >= 10 ) {
			$users_by_digits = get_users(
				array(
					'meta_key'   => 'jw_phone_digits',
					'meta_value' => $digits,
					'number'     => 1,
				)
			);
			if ( ! empty( $users_by_digits ) ) {
				return $users_by_digits[0];
			}

			// Fallback scan across users with jw_phone
			global $wpdb;
			$matched_uid = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = 'jw_phone' AND meta_value LIKE %s LIMIT 1",
					'%' . $wpdb->esc_like( $digits )
				)
			);
			if ( $matched_uid > 0 ) {
				return get_user_by( 'id', $matched_uid );
			}
		}

		return false;
	}

	/**
	 * Registers a new mobile app user using native WordPress user tables.
	 *
	 * @param array $data { name, email, password, phone, city, gotra, birth_date, birth_time, birth_place }.
	 * @return array|WP_Error
	 */
	public static function register_app_user( $data ) {
		$sec = JW_Settings::get_security_settings();
		if ( empty( $sec['allow_user_registration'] ) ) {
			return new WP_Error( 'jw_registration_disabled', 'नया खाता पंजीकरण वर्तमान में बंद है। (New user registration is disabled.)', array( 'status' => 403 ) );
		}

		$email    = sanitize_email( strtolower( trim( isset( $data['email'] ) ? (string) $data['email'] : '' ) ) );
		$password = trim( isset( $data['password'] ) ? (string) $data['password'] : '' );
		$name     = sanitize_text_field( trim( isset( $data['name'] ) ? (string) $data['name'] : '' ) );
		$phone    = sanitize_text_field( trim( isset( $data['phone'] ) ? (string) $data['phone'] : '' ) );

		if ( empty( $email ) || ! is_email( $email ) ) {
			return new WP_Error( 'jw_invalid_email', 'कृपया मान्य ईमेल पता दर्ज करें। (Please provide a valid email address.)', array( 'status' => 400 ) );
		}
		if ( strlen( $password ) < 6 ) {
			return new WP_Error( 'jw_weak_password', 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए। (Password must be at least 6 characters.)', array( 'status' => 400 ) );
		}

		$existing_user_id = email_exists( $email );
		if ( $existing_user_id ) {
			// If account already exists, check if they don't have an app password yet or are re-registering
			$existing_app_hash = get_user_meta( $existing_user_id, 'jw_app_password_hash', true );
			$existing_user     = get_user_by( 'id', $existing_user_id );
			if ( $existing_user && empty( $existing_app_hash ) && user_can( $existing_user_id, 'manage_options' ) ) {
				// Allow site owner to link their email to the mobile app without breaking their WP admin password
				update_user_meta( $existing_user_id, 'jw_app_user', 1 );
				update_user_meta( $existing_user_id, 'jw_app_password_hash', wp_hash_password( $password ) );
				if ( ! empty( $phone ) ) {
					update_user_meta( $existing_user_id, 'jw_phone', $phone );
					update_user_meta( $existing_user_id, 'jw_phone_digits', self::normalize_phone_digits( $phone ) );
				}
				if ( ! empty( $data['city'] ) ) {
					update_user_meta( $existing_user_id, 'jw_city', sanitize_text_field( $data['city'] ) );
				}
				if ( ! empty( $data['gotra'] ) ) {
					update_user_meta( $existing_user_id, 'jw_gotra', sanitize_text_field( $data['gotra'] ) );
				}
				$token_info = JW_Authentication::create_user_token( $existing_user_id, 'Android App Registration' );
				return array(
					'user'       => self::format_user_profile( $existing_user_id ),
					'token'      => $token_info['token'],
					'expires_at' => $token_info['expires_at'],
				);
			}

			return new WP_Error(
				'jw_email_exists',
				'यह ईमेल पता पहले से पंजीकृत है। कृपया "लॉगिन करें" या "पासवर्ड भूल गए?" का उपयोग करें।',
				array( 'status' => 409 )
			);
		}

		$base_user = sanitize_user( current( explode( '@', $email ) ), true );
		if ( empty( $base_user ) ) {
			$base_user = 'yajman';
		}
		$username = $base_user . '_' . wp_rand( 100, 9999 );
		while ( username_exists( $username ) ) {
			$username = $base_user . '_' . wp_rand( 1000, 99999 );
		}

		$user_id = wp_create_user( $username, $password, $email );
		if ( is_wp_error( $user_id ) ) {
			return $user_id;
		}

		wp_update_user(
			array(
				'ID'           => $user_id,
				'display_name' => ! empty( $name ) ? $name : $username,
				'first_name'   => $name,
				'role'         => 'subscriber',
			)
		);

		// Explicitly set password and store backup app password hash for 100% reliable login verification
		wp_set_password( $password, $user_id );
		update_user_meta( $user_id, 'jw_app_password_hash', wp_hash_password( $password ) );
		update_user_meta( $user_id, 'jw_app_user', 1 );
		update_user_meta( $user_id, 'jw_account_status', 'active' );
		update_user_meta( $user_id, 'jw_registered_at', current_time( 'mysql' ) );

		if ( ! empty( $phone ) ) {
			update_user_meta( $user_id, 'jw_phone', $phone );
			update_user_meta( $user_id, 'jw_phone_digits', self::normalize_phone_digits( $phone ) );
		}
		if ( ! empty( $data['city'] ) ) {
			update_user_meta( $user_id, 'jw_city', sanitize_text_field( $data['city'] ) );
		}
		if ( ! empty( $data['gotra'] ) ) {
			update_user_meta( $user_id, 'jw_gotra', sanitize_text_field( $data['gotra'] ) );
		}
		if ( ! empty( $data['birth_date'] ) ) {
			update_user_meta( $user_id, 'jw_birth_date', sanitize_text_field( $data['birth_date'] ) );
		}
		if ( ! empty( $data['birth_time'] ) ) {
			update_user_meta( $user_id, 'jw_birth_time', sanitize_text_field( $data['birth_time'] ) );
		}
		if ( ! empty( $data['birth_place'] ) ) {
			update_user_meta( $user_id, 'jw_birth_place', sanitize_text_field( $data['birth_place'] ) );
		}

		$token_info = JW_Authentication::create_user_token( $user_id, 'Android App Registration' );
		JW_Logging::log( 'security', 'info', 'New app user registered: ' . $email, array( 'user_id' => $user_id ) );

		return array(
			'user'       => self::format_user_profile( $user_id ),
			'token'      => $token_info['token'],
			'expires_at' => $token_info['expires_at'],
		);
	}

	/**
	 * Authenticates an app user via email, mobile number, or username and password.
	 *
	 * @param string $login       Email, phone number, or username.
	 * @param string $password    Plain password.
	 * @param string $device_info Device name.
	 * @return array|WP_Error
	 */
	public static function login_app_user( $login, $password, $device_info = 'Android App' ) {
		$clean_login = trim( (string) $login );
		$clean_pass  = trim( (string) $password );

		if ( '' === $clean_login || '' === $clean_pass ) {
			return new WP_Error( 'jw_missing_credentials', 'कृपया अपना ईमेल/मोबाइल नंबर और पासवर्ड दर्ज करें।', array( 'status' => 400 ) );
		}

		$user = self::find_user_by_identifier( $clean_login );
		if ( ! $user ) {
			JW_Logging::log( 'security', 'warning', 'Failed mobile login attempt (user not found): ' . sanitize_text_field( $clean_login ) );
			return new WP_Error( 'jw_invalid_credentials', 'यह ईमेल या मोबाइल नंबर पंजीकृत नहीं है। कृपया पहले नया खाता बनाएं या ईमेल खोजें।', array( 'status' => 401 ) );
		}

		// Verify against WordPress user_pass OR jw_app_password_hash (both trimmed and raw password)
		$app_hash = (string) get_user_meta( $user->ID, 'jw_app_password_hash', true );
		$pass_ok  = wp_check_password( $clean_pass, $user->user_pass, $user->ID )
			|| wp_check_password( (string) $password, $user->user_pass, $user->ID )
			|| ( '' !== $app_hash && wp_check_password( $clean_pass, $app_hash ) )
			|| ( '' !== $app_hash && wp_check_password( (string) $password, $app_hash ) );

		if ( ! $pass_ok ) {
			JW_Logging::log( 'security', 'warning', 'Failed mobile login attempt (wrong password) for: ' . $user->user_email );
			return new WP_Error( 'jw_invalid_credentials', 'पासवर्ड गलत है। यदि आप पासवर्ड भूल गए हैं तो "पासवर्ड भूल गए?" विकल्प चुनें।', array( 'status' => 401 ) );
		}

		$status = get_user_meta( $user->ID, 'jw_account_status', true );
		if ( 'deactivated' === $status ) {
			return new WP_Error( 'jw_account_deactivated', 'आपका खाता वर्तमान में निष्क्रिय है। (Your account is deactivated.)', array( 'status' => 403 ) );
		}

		// Sync jw_app_password_hash if not set yet so subsequent logins are instantaneous
		if ( '' === $app_hash ) {
			update_user_meta( $user->ID, 'jw_app_password_hash', wp_hash_password( $clean_pass ) );
		}

		update_user_meta( $user->ID, 'jw_app_user', 1 );
		update_user_meta( $user->ID, 'jw_last_login', current_time( 'mysql' ) );

		$token_info = JW_Authentication::create_user_token( $user->ID, $device_info );
		JW_Logging::log( 'security', 'info', 'App user logged in: ' . $user->user_email, array( 'user_id' => $user->ID ) );

		return array(
			'user'       => self::format_user_profile( $user->ID ),
			'token'      => $token_info['token'],
			'expires_at' => $token_info['expires_at'],
		);
	}

	/**
	 * Resets an app user's password via Email or Mobile Number (Forgot Password flow).
	 *
	 * @param string $identifier   Registered email or mobile number.
	 * @param string $new_password New password (min 6 chars).
	 * @return array|WP_Error
	 */
	public static function reset_app_user_password( $identifier, $new_password ) {
		$clean_id   = trim( (string) $identifier );
		$clean_pass = trim( (string) $new_password );

		if ( '' === $clean_id ) {
			return new WP_Error( 'jw_missing_identifier', 'कृपया अपना पंजीकृत ईमेल पता या मोबाइल नंबर दर्ज करें।', array( 'status' => 400 ) );
		}
		if ( strlen( $clean_pass ) < 6 ) {
			return new WP_Error( 'jw_weak_password', 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।', array( 'status' => 400 ) );
		}

		$user = self::find_user_by_identifier( $clean_id );
		if ( ! $user ) {
			return new WP_Error( 'jw_user_not_found', 'इस ईमेल या मोबाइल नंबर से कोई खाता नहीं मिला। कृपया सही विवरण दर्ज करें।', array( 'status' => 404 ) );
		}

		// Always update app password hash; if subscriber/non-admin, also update wp_users password
		update_user_meta( $user->ID, 'jw_app_password_hash', wp_hash_password( $clean_pass ) );
		if ( ! user_can( $user->ID, 'manage_options' ) ) {
			wp_set_password( $clean_pass, $user->ID );
		}

		update_user_meta( $user->ID, 'jw_app_user', 1 );
		update_user_meta( $user->ID, 'jw_last_login', current_time( 'mysql' ) );

		$token_info = JW_Authentication::create_user_token( $user->ID, 'Password Reset Auto-Login' );
		JW_Logging::log( 'security', 'info', 'App user password reset completed for: ' . $user->user_email, array( 'user_id' => $user->ID ) );

		return array(
			'user'       => self::format_user_profile( $user->ID ),
			'token'      => $token_info['token'],
			'expires_at' => $token_info['expires_at'],
			'message'    => 'आपका पासवर्ड सफलतापूर्वक बदल दिया गया है!',
		);
	}

	/**
	 * Recovers a user's registered Email address using their Mobile Number or Full Name (Forgot Email flow).
	 *
	 * @param string $query Mobile phone number or user's full name.
	 * @return array|WP_Error
	 */
	public static function recover_app_user_email( $query ) {
		$clean_q = trim( sanitize_text_field( (string) $query ) );
		if ( strlen( $clean_q ) < 3 ) {
			return new WP_Error( 'jw_invalid_query', 'कृपया अपना पंजीकृत मोबाइल नंबर या पूरा नाम दर्ज करें।', array( 'status' => 400 ) );
		}

		// 1. Try finding by Phone / Identifier first
		$user = self::find_user_by_identifier( $clean_q );
		if ( $user ) {
			return array(
				'email'   => $user->user_email,
				'name'    => $user->display_name,
				'phone'   => (string) get_user_meta( $user->ID, 'jw_phone', true ),
				'message' => 'आपका पंजीकृत ईमेल पता मिल गया है।',
			);
		}

		// 2. Search by Display Name or First Name
		$users = get_users(
			array(
				'search'         => '*' . $clean_q . '*',
				'search_columns' => array( 'display_name', 'user_nicename', 'user_login' ),
				'number'         => 5,
			)
		);

		if ( empty( $users ) ) {
			global $wpdb;
			$uid = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = 'first_name' AND meta_value LIKE %s LIMIT 1",
					'%' . $wpdb->esc_like( $clean_q ) . '%'
				)
			);
			if ( $uid > 0 ) {
				$found_u = get_user_by( 'id', $uid );
				if ( $found_u ) {
					$users = array( $found_u );
				}
			}
		}

		if ( ! empty( $users ) ) {
			$u = $users[0];
			return array(
				'email'   => $u->user_email,
				'name'    => $u->display_name,
				'phone'   => (string) get_user_meta( $u->ID, 'jw_phone', true ),
				'message' => 'आपका पंजीकृत ईमेल पता मिल गया है।',
			);
		}

		return new WP_Error(
			'jw_email_not_found',
			'इस मोबाइल नंबर या नाम से कोई पंजीकृत ईमेल नहीं मिला। कृपया नया खाता बनाएं।',
			array( 'status' => 404 )
		);
	}

	/**
	 * Formats a user profile for REST API / Admin view.
	 *
	 * @param int $user_id WordPress User ID.
	 * @return array
	 */
	public static function format_user_profile( $user_id ) {
		$user = get_userdata( $user_id );
		if ( ! $user ) {
			return array();
		}

		global $wpdb;
		$t_kundlis    = JW_Database::table( 'saved_kundlis' );
		$kundli_count = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$t_kundlis} WHERE user_id = %d", $user_id ) ); // phpcs:ignore

		return array(
			'id'            => (int) $user->ID,
			'name'          => $user->display_name,
			'email'         => $user->user_email,
			'phone'         => (string) get_user_meta( $user->ID, 'jw_phone', true ),
			'city'          => (string) get_user_meta( $user->ID, 'jw_city', true ),
			'gotra'         => (string) get_user_meta( $user->ID, 'jw_gotra', true ),
			'bio'           => (string) get_user_meta( $user->ID, 'description', true ),
			'avatar'        => (string) get_user_meta( $user->ID, 'jw_avatar', true ),
			'birthDate'     => (string) get_user_meta( $user->ID, 'jw_birth_date', true ),
			'birthTime'     => (string) get_user_meta( $user->ID, 'jw_birth_time', true ),
			'birthPlace'    => (string) get_user_meta( $user->ID, 'jw_birth_place', true ),
			'birth_date'    => (string) get_user_meta( $user->ID, 'jw_birth_date', true ),
			'birth_time'    => (string) get_user_meta( $user->ID, 'jw_birth_time', true ),
			'birth_place'   => (string) get_user_meta( $user->ID, 'jw_birth_place', true ),
			'status'        => get_user_meta( $user->ID, 'jw_account_status', true ) ?: 'active',
			'createdAt'     => $user->user_registered,
			'registered_at' => $user->user_registered,
			'last_login'    => (string) get_user_meta( $user->ID, 'jw_last_login', true ),
			'saved_kundlis' => $kundli_count,
		);
	}
}
