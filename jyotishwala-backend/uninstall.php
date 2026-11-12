<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * By default, preserves user Kundlis and app data unless the administrator
 * explicitly enabled "Delete all app data on uninstall" in App Settings.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$jw_settings = get_option( 'jw_app_settings', array() );
$delete_on_uninstall = ! empty( $jw_settings['delete_data_on_uninstall'] );

if ( $delete_on_uninstall ) {
	global $wpdb;
	$tables = array(
		$wpdb->prefix . 'jw_saved_kundlis',
		$wpdb->prefix . 'jw_rashifal',
		$wpdb->prefix . 'jw_banners',
		$wpdb->prefix . 'jw_pandits',
		$wpdb->prefix . 'jw_receipts',
		$wpdb->prefix . 'jw_tyohar',
		$wpdb->prefix . 'jw_gallery',
		$wpdb->prefix . 'jw_reviews',
		$wpdb->prefix . 'jw_notifications',
		$wpdb->prefix . 'jw_api_vault',
		$wpdb->prefix . 'jw_user_tokens',
		$wpdb->prefix . 'jw_logs',
	);

	foreach ( $tables as $table ) {
		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "DROP TABLE IF EXISTS {$table}" );
	}

	delete_option( 'jw_app_settings' );
	delete_option( 'jw_panchang_settings' );
	delete_option( 'jw_kundli_settings' );
	delete_option( 'jw_security_settings' );
	delete_option( 'jw_site_pages_content' );
	delete_option( 'jw_backend_db_version' );
}
