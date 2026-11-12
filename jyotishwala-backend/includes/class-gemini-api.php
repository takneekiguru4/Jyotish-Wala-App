<?php
/**
 * Server-Side Optional Gemini API Proxy for JyotishWala Backend.
 *
 * Keeps the Gemini API key strictly inside the WordPress database (`wp_jw_api_vault`).
 * Never exposes the API key to the Android APK or frontend JavaScript.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Gemini_API {

	/**
	 * Retrieves the Gemini API configuration from `wp_jw_api_vault`.
	 *
	 * @return array|null
	 */
	public static function get_config() {
		global $wpdb;
		$t_api = JW_Database::table( 'api_vault' );
		$row   = $wpdb->get_row( "SELECT * FROM {$t_api} WHERE module = 'gemini' LIMIT 1", ARRAY_A ); // phpcs:ignore
		if ( is_array( $row ) && ! empty( $row['api_key'] ) ) {
			$row['api_key'] = JW_Settings::decrypt_secret( $row['api_key'] );
		}
		return $row;
	}

	/**
	 * Tests the Gemini API connection from the WordPress backend.
	 *
	 * @return array { ok: bool, message: string }
	 */
	public static function test_connection() {
		$cfg = self::get_config();
		if ( ! $cfg || empty( $cfg['api_key'] ) ) {
			return array(
				'ok'      => false,
				'message' => 'Gemini API Key is not configured or could not be decrypted from API Vault.',
			);
		}

		$url  = add_query_arg( 'key', rawurlencode( $cfg['api_key'] ), $cfg['endpoint_url'] );
		$resp = wp_remote_post(
			$url,
			array(
				'timeout' => 8,
				'headers' => array( 'Content-Type' => 'application/json' ),
				'body'    => wp_json_encode(
					array(
						'contents' => array(
							array(
								'parts' => array( array( 'text' => 'नमस्ते' ) ),
							),
						),
					)
				),
			)
		);

		if ( is_wp_error( $resp ) ) {
			return array(
				'ok'      => false,
				'message' => $resp->get_error_message(),
			);
		}

		$code = wp_remote_retrieve_response_code( $resp );
		if ( $code >= 200 && $code < 300 ) {
			return array(
				'ok'      => true,
				'message' => 'Gemini API connection verified successfully (HTTP ' . $code . ').',
			);
		}

		return array(
			'ok'      => false,
			'message' => 'Gemini API returned HTTP ' . $code,
		);
	}
}
