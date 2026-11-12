<?php
/**
 * Mobile App User Authentication (Token-Based with Expiry & Revocation).
 *
 * - Never exposes WordPress administrator credentials or Application Passwords to the mobile app.
 * - Issues cryptographically random Bearer tokens stored as SHA-256 hashes in `wp_jw_user_tokens`.
 * - Supports token expiry, device tracking, and instant revocation.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Authentication {

	/**
	 * Issues a new Bearer token for an authenticated app user.
	 *
	 * @param int    $user_id     WordPress User ID.
	 * @param string $device_info Device identifier.
	 * @return array { token: string, expires_at: string }
	 */
	public static function create_user_token( $user_id, $device_info = 'Android APK' ) {
		global $wpdb;
		$table = JW_Database::table( 'user_tokens' );
		$sec   = JW_Settings::get_security_settings();
		$days  = ! empty( $sec['token_expiry_days'] ) ? absint( $sec['token_expiry_days'] ) : 30;

		$raw_token  = 'jw_usr_' . bin2hex( random_bytes( 32 ) );
		$token_hash = hash( 'sha256', $raw_token );
		$expires_at = gmdate( 'Y-m-d H:i:s', time() + ( $days * DAY_IN_SECONDS ) );

		$wpdb->insert(
			$table,
			array(
				'user_id'      => absint( $user_id ),
				'token_hash'   => $token_hash,
				'device_info'  => sanitize_text_field( $device_info ),
				'ip_address'   => JW_Logging::get_client_ip(),
				'expires_at'   => $expires_at,
				'is_revoked'   => 0,
				'created_at'   => current_time( 'mysql' ),
				'last_used_at' => current_time( 'mysql' ),
			),
			array( '%d', '%s', '%s', '%s', '%s', '%d', '%s', '%s' )
		);

		return array(
			'token'      => $raw_token,
			'expires_at' => $expires_at,
		);
	}

	/**
	 * Extracts Bearer token from Authorization header and validates it against `wp_jw_user_tokens`.
	 *
	 * @param WP_REST_Request $request REST request object.
	 * @return int|WP_Error Authenticated WordPress user_id or WP_Error.
	 */
	public static function authenticate_request( $request ) {
		$auth_header = $request->get_header( 'authorization' );
		if ( empty( $auth_header ) && ! empty( $_SERVER['HTTP_AUTHORIZATION'] ) ) {
			$auth_header = sanitize_text_field( wp_unslash( $_SERVER['HTTP_AUTHORIZATION'] ) );
		}

		if ( empty( $auth_header ) || ! preg_match( '/Bearer\s+(\S+)/i', $auth_header, $matches ) ) {
			return new WP_Error( 'jw_missing_token', 'Authentication token required.', array( 'status' => 401 ) );
		}

		$raw_token  = trim( $matches[1] );
		$token_hash = hash( 'sha256', $raw_token );

		global $wpdb;
		$table = JW_Database::table( 'user_tokens' );

		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$table} WHERE token_hash = %s AND is_revoked = 0 LIMIT 1", // phpcs:ignore
				$token_hash
			),
			ARRAY_A
		);

		if ( ! $row ) {
			return new WP_Error( 'jw_invalid_token', 'Invalid or revoked authentication token.', array( 'status' => 401 ) );
		}

		if ( strtotime( $row['expires_at'] ) < time() ) {
			return new WP_Error( 'jw_expired_token', 'Session expired. Please log in again.', array( 'status' => 401 ) );
		}

		$user_id = (int) $row['user_id'];
		$status  = get_user_meta( $user_id, 'jw_account_status', true );
		if ( 'deactivated' === $status ) {
			return new WP_Error( 'jw_account_deactivated', 'This user account has been deactivated.', array( 'status' => 403 ) );
		}

		// Update last_used_at timestamp
		$wpdb->update(
			$table,
			array( 'last_used_at' => current_time( 'mysql' ) ),
			array( 'id' => (int) $row['id'] ),
			array( '%s' ),
			array( '%d' )
		);

		return $user_id;
	}

	/**
	 * Revokes a single token or all tokens for a user.
	 *
	 * @param int    $user_id   User ID.
	 * @param string $raw_token Optional specific raw token.
	 */
	public static function revoke_tokens( $user_id, $raw_token = '' ) {
		global $wpdb;
		$table = JW_Database::table( 'user_tokens' );

		if ( ! empty( $raw_token ) ) {
			$token_hash = hash( 'sha256', $raw_token );
			$wpdb->update(
				$table,
				array( 'is_revoked' => 1 ),
				array(
					'user_id'    => absint( $user_id ),
					'token_hash' => $token_hash,
				),
				array( '%d' ),
				array( '%d', '%s' )
			);
		} else {
			$wpdb->update(
				$table,
				array( 'is_revoked' => 1 ),
				array( 'user_id' => absint( $user_id ) ),
				array( '%d' ),
				array( '%d' )
			);
		}
	}
}
