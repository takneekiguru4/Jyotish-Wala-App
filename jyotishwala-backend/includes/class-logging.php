<?php
/**
 * Activity, API, Security & Calculation Logging + Rate Limiting.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Logging {

	/**
	 * Writes an entry into wp_jw_logs table.
	 *
	 * @param string $log_type 'api' | 'security' | 'kundli' | 'panchang' | 'system' | 'admin'.
	 * @param string $severity 'info' | 'warning' | 'error'.
	 * @param string $message  Human-readable log summary.
	 * @param array  $context  Optional structured metadata.
	 */
	public static function log( $log_type, $severity, $message, $context = array() ) {
		global $wpdb;
		$table = JW_Database::table( 'logs' );

		$user_id = get_current_user_id();
		$ip      = self::get_client_ip();

		$wpdb->insert(
			$table,
			array(
				'log_type'     => sanitize_key( $log_type ),
				'severity'     => sanitize_key( $severity ),
				'message'      => sanitize_text_field( $message ),
				'context_json' => ! empty( $context ) ? wp_json_encode( $context ) : null,
				'user_id'      => absint( $user_id ),
				'ip_address'   => sanitize_text_field( $ip ),
				'created_at'   => current_time( 'mysql' ),
			),
			array( '%s', '%s', '%s', '%s', '%d', '%s', '%s' )
		);
	}

	/**
	 * Fetches recent log entries with optional filtering.
	 *
	 * @param string $log_type Optional log type filter.
	 * @param int    $limit    Max rows.
	 * @return array
	 */
	public static function get_logs( $log_type = '', $limit = 100 ) {
		global $wpdb;
		$table = JW_Database::table( 'logs' );
		$limit = max( 1, min( 500, absint( $limit ) ) );

		if ( ! empty( $log_type ) ) {
			return $wpdb->get_results(
				$wpdb->prepare(
					"SELECT * FROM {$table} WHERE log_type = %s ORDER BY id DESC LIMIT %d", // phpcs:ignore
					sanitize_key( $log_type ),
					$limit
				),
				ARRAY_A
			);
		}

		return $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} ORDER BY id DESC LIMIT %d", // phpcs:ignore
				$limit
			),
			ARRAY_A
		);
	}

	/**
	 * Clears logs older than N days or all logs.
	 *
	 * @param int $days_to_keep 0 to clear all.
	 */
	public static function clear_logs( $days_to_keep = 0 ) {
		global $wpdb;
		$table = JW_Database::table( 'logs' );
		if ( $days_to_keep <= 0 ) {
			$wpdb->query( "TRUNCATE TABLE {$table}" ); // phpcs:ignore
		} else {
			$wpdb->query(
				$wpdb->prepare(
					"DELETE FROM {$table} WHERE created_at < DATE_SUB(NOW(), INTERVAL %d DAY)", // phpcs:ignore
					absint( $days_to_keep )
				)
			);
		}
	}

	/**
	 * Simple IP-based transient rate limiter for public REST endpoints.
	 *
	 * @param string $endpoint_key Identifier for the route.
	 * @param int    $max_requests Allowed requests per minute.
	 * @return bool True if allowed, false if rate-limited.
	 */
	public static function check_rate_limit( $endpoint_key, $max_requests = 60 ) {
		$sec = JW_Settings::get_security_settings();
		if ( empty( $sec['enable_rate_limiting'] ) ) {
			return true;
		}

		$limit     = ! empty( $sec['rate_limit_per_minute'] ) ? min( absint( $sec['rate_limit_per_minute'] ), absint( $max_requests ) ) : absint( $max_requests );
		$remote_ip = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '127.0.0.1';
		if ( ! filter_var( $remote_ip, FILTER_VALIDATE_IP ) ) {
			$remote_ip = '127.0.0.1';
		}
		$key = 'jw_rl_' . md5( $endpoint_key . '_' . $remote_ip );

		$current = (int) get_transient( $key );
		if ( $current >= $limit ) {
			self::log( 'security', 'warning', 'Rate limit exceeded for endpoint: ' . $endpoint_key, array( 'ip' => $remote_ip ) );
			return false;
		}

		set_transient( $key, $current + 1, MINUTE_IN_SECONDS );
		return true;
	}

	/**
	 * Safely resolves client IP address using validated REMOTE_ADDR first to prevent header spoofing.
	 *
	 * @return string
	 */
	public static function get_client_ip() {
		if ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$remote = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
			if ( filter_var( $remote, FILTER_VALIDATE_IP ) ) {
				return $remote;
			}
		}
		return '127.0.0.1';
	}
}
