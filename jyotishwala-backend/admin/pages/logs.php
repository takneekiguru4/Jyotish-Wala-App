<?php
/**
 * 10. Backup, Data Management & Logs Page (admin/pages/logs.php)
 *
 * - JSON Data Export / Import
 * - Activity Logs, Security Logs, Calculation Logs & Error Logs
 * - Safe log cleanup
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

global $wpdb;
$notice      = '';
$export_json = '';

if ( JW_Permissions::verify_admin_action( 'jw_logs_action', 'jw_logs_nonce' ) ) {
	$sub = sanitize_key( wp_unslash( $_POST['jw_sub_action'] ?? '' ) );

	if ( 'clear_logs' === $sub ) {
		JW_Logging::clear_logs( 0 );
		$notice = 'All activity and error logs cleared.';
	}

	if ( 'generate_export' === $sub ) {
		$export_data = array(
			'plugin_version'    => JW_BACKEND_VERSION,
			'exported_at'       => current_time( 'mysql' ),
			'app_settings'      => JW_Settings::get_app_settings(),
			'panchang_settings' => JW_Settings::get_panchang_settings(),
			'kundli_settings'   => JW_Settings::get_kundli_settings(),
			'site_pages'        => JW_Settings::get_site_pages_content(),
			'banners'           => $wpdb->get_results( 'SELECT * FROM ' . JW_Database::table( 'banners' ), ARRAY_A ), // phpcs:ignore
			'rashifal'          => $wpdb->get_results( 'SELECT * FROM ' . JW_Database::table( 'rashifal' ), ARRAY_A ), // phpcs:ignore
			'pandits'           => $wpdb->get_results( 'SELECT * FROM ' . JW_Database::table( 'pandits' ), ARRAY_A ), // phpcs:ignore
			'receipts'          => $wpdb->get_results( 'SELECT * FROM ' . JW_Database::table( 'receipts' ), ARRAY_A ), // phpcs:ignore
			'tyohar'            => $wpdb->get_results( 'SELECT * FROM ' . JW_Database::table( 'tyohar' ), ARRAY_A ), // phpcs:ignore
			'gallery'           => $wpdb->get_results( 'SELECT * FROM ' . JW_Database::table( 'gallery' ), ARRAY_A ), // phpcs:ignore
			'reviews'           => $wpdb->get_results( 'SELECT * FROM ' . JW_Database::table( 'reviews' ), ARRAY_A ), // phpcs:ignore
		);
		$export_json = wp_json_encode( $export_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
		$notice      = 'Backup JSON generated below. Copy and save it for safe storage.';
	}

	if ( 'import_backup' === $sub && ! empty( $_POST['import_json_payload'] ) ) {
		$raw_import = wp_unslash( $_POST['import_json_payload'] ); // phpcs:ignore
		$decoded    = json_decode( $raw_import, true );
		if ( is_array( $decoded ) ) {
			if ( ! empty( $decoded['app_settings'] ) ) {
				update_option( 'jw_app_settings', $decoded['app_settings'] );
			}
			if ( ! empty( $decoded['panchang_settings'] ) ) {
				update_option( 'jw_panchang_settings', $decoded['panchang_settings'] );
			}
			if ( ! empty( $decoded['kundli_settings'] ) ) {
				update_option( 'jw_kundli_settings', $decoded['kundli_settings'] );
			}
			if ( ! empty( $decoded['site_pages'] ) ) {
				update_option( 'jw_site_pages_content', $decoded['site_pages'] );
			}
			JW_Logging::log( 'system', 'info', 'Configuration backup imported by administrator.' );
			$notice = 'Backup JSON configuration restored successfully.';
		}
	}
}

$filter_type = sanitize_key( $_GET['log_type'] ?? '' );
$logs        = JW_Logging::get_logs( $filter_type, 100 );
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-logs',
		'Backup, Data Export/Import & Activity Logs',
		'Export or import JyotishWala database configurations and monitor API, calculation, and security logs.'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $notice ); ?></p></div>
	<?php endif; ?>

	<div class="jw-grid-2">
		<div class="jw-card">
			<h3>Export App Data & Settings Backup (JSON)</h3>
			<p>Compatible with Hostinger phpMyAdmin backups as well as portable JSON snapshots.</p>
			<form method="post">
				<?php wp_nonce_field( 'jw_logs_action', 'jw_logs_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="generate_export" />
				<p><button type="submit" class="button jw-btn-primary">Generate Backup JSON</button></p>
			</form>
			<?php if ( $export_json ) : ?>
				<textarea rows="8" class="large-text code" readonly><?php echo esc_textarea( $export_json ); ?></textarea>
			<?php endif; ?>
		</div>

		<div class="jw-card">
			<h3>Import / Restore Backup JSON</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_logs_action', 'jw_logs_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="import_backup" />
				<textarea name="import_json_payload" rows="5" class="large-text code" placeholder="Paste exported JyotishWala JSON backup here..."></textarea>
				<p><button type="submit" class="button jw-btn-saffron">Restore from JSON</button></p>
			</form>
		</div>
	</div>

	<div class="jw-card">
		<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
			<h3 style="margin:0;border:none;padding:0;">System, API, Security & Calculation Logs</h3>
			<form method="post" onsubmit="return confirm('Clear all logs?');">
				<?php wp_nonce_field( 'jw_logs_action', 'jw_logs_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="clear_logs" />
				<button type="submit" class="button">Clear All Logs</button>
			</form>
		</div>

		<table class="jw-table">
			<thead>
				<tr>
					<th>ID</th>
					<th>Timestamp</th>
					<th>Module</th>
					<th>Severity</th>
					<th>Message</th>
					<th>User / IP</th>
				</tr>
			</thead>
			<tbody>
				<?php if ( empty( $logs ) ) : ?>
					<tr><td colspan="6">No log entries found.</td></tr>
				<?php else : ?>
					<?php foreach ( $logs as $l ) : ?>
						<tr>
							<td>#<?php echo esc_html( $l['id'] ); ?></td>
							<td><?php echo esc_html( $l['created_at'] ); ?></td>
							<td><code><?php echo esc_html( $l['log_type'] ); ?></code></td>
							<td><strong><?php echo esc_html( strtoupper( $l['severity'] ) ); ?></strong></td>
							<td><?php echo esc_html( $l['message'] ); ?></td>
							<td>User #<?php echo esc_html( $l['user_id'] ); ?> • <?php echo esc_html( $l['ip_address'] ); ?></td>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
			</tbody>
		</table>
	</div>
</div>
