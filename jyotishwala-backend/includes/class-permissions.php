<?php
/**
 * WordPress Role & Capability Permissions for JyotishWala App Management.
 *
 * Uses native WordPress administrator capabilities (`manage_options` and custom `jw_manage_app`)
 * and registers custom JyotishWala editorial/astrologer roles (`jw_astrologer_expert`, `jw_editor`, `jw_writer`).
 * Never uses hardcoded Gmail/password credentials.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Permissions {

	const CAP_MANAGE_APP     = 'jw_manage_app';
	const CAP_MANAGE_CONTENT = 'jw_manage_content';
	const CAP_MANAGE_APIS    = 'jw_manage_apis';

	/**
	 * Grants custom capabilities to the WordPress Administrator role and registers
	 * custom JyotishWala team roles on activation/upgrade.
	 */
	public static function register_capabilities() {
		$admin_role = get_role( 'administrator' );
		if ( $admin_role ) {
			$admin_role->add_cap( self::CAP_MANAGE_APP );
			$admin_role->add_cap( self::CAP_MANAGE_CONTENT );
			$admin_role->add_cap( self::CAP_MANAGE_APIS );
		}

		$editor_role = get_role( 'editor' );
		if ( $editor_role ) {
			$editor_role->add_cap( self::CAP_MANAGE_CONTENT );
		}

		// Register custom JyotishWala Team roles matching original UserRole types
		add_role(
			'jw_astrologer_expert',
			'JyotishWala Astrologer Expert (ज्योतिषाचार्य)',
			array(
				'read'                   => true,
				'edit_posts'             => true,
				'publish_posts'          => true,
				'upload_files'           => true,
				self::CAP_MANAGE_CONTENT => true,
			)
		);

		add_role(
			'jw_editor',
			'JyotishWala Content Editor (संपादक)',
			array(
				'read'                   => true,
				'edit_posts'             => true,
				'edit_others_posts'      => true,
				'publish_posts'          => true,
				'upload_files'           => true,
				self::CAP_MANAGE_CONTENT => true,
			)
		);

		add_role(
			'jw_writer',
			'JyotishWala Article Writer (लेखक)',
			array(
				'read'          => true,
				'edit_posts'    => true,
				'upload_files'  => true,
			)
		);
	}

	/**
	 * Returns human-readable role labels for JyotishWala team management.
	 *
	 * @return array
	 */
	public static function get_team_roles() {
		return array(
			'administrator'        => 'Super Admin / Administrator (मुख्य व्यवस्थापक)',
			'jw_editor'            => 'JyotishWala Editor (संपादक — पंचांग/राशिफल/लेख/गैलरी)',
			'jw_astrologer_expert' => 'Astrologer Expert (ज्योतिषाचार्य विशेषज्ञ)',
			'jw_writer'            => 'Article Writer (ज्योतिष लेखक)',
			'editor'               => 'WordPress Editor',
			'author'               => 'WordPress Author',
			'subscriber'           => 'App User / Subscriber (ऐप उपयोगकर्ता)',
		);
	}

	/**
	 * Checks whether current WordPress user can manage the JyotishWala App.
	 *
	 * @return bool
	 */
	public static function current_user_can_manage_app() {
		return current_user_can( 'manage_options' ) || current_user_can( self::CAP_MANAGE_APP );
	}

	/**
	 * Checks whether current WordPress user can manage app content (articles, rashifal, tyohar, gallery).
	 *
	 * @return bool
	 */
	public static function current_user_can_manage_content() {
		return self::current_user_can_manage_app() || current_user_can( self::CAP_MANAGE_CONTENT );
	}

	/**
	 * Checks whether current WordPress user can manage sensitive API keys & security settings.
	 *
	 * @return bool
	 */
	public static function current_user_can_manage_security() {
		return current_user_can( 'manage_options' ) || current_user_can( self::CAP_MANAGE_APIS );
	}

	/**
	 * Verifies admin form nonce + capability before processing POST actions in WP Admin.
	 *
	 * @param string $nonce_action Action name.
	 * @param string $nonce_field  Form field name.
	 * @param bool   $content_only Allow content managers (jw_manage_content) as well as full app admins.
	 * @return bool
	 */
	public static function verify_admin_action( $nonce_action = 'jw_admin_action', $nonce_field = 'jw_admin_nonce', $content_only = false ) {
		$allowed = $content_only ? self::current_user_can_manage_content() : self::current_user_can_manage_app();
		if ( ! $allowed ) {
			return false;
		}
		if ( empty( $_POST[ $nonce_field ] ) ) {
			return false;
		}
		$verified = (bool) wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ $nonce_field ] ) ), $nonce_action );
		if ( $verified ) {
			add_action(
				'shutdown',
				function () {
					if ( function_exists( 'wp_cache_flush' ) ) {
						wp_cache_flush();
					}
					do_action( 'litespeed_purge_all' );
				}
			);
		}
		return $verified;
	}
}
