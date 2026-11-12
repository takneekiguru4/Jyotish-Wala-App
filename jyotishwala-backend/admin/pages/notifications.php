<?php
/**
 * 7. Notification Management Page (admin/pages/notifications.php)
 *
 * - Create & publish in-app / push notifications
 * - View notification history
 * - Optional Firebase Cloud Messaging (FCM) configuration
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

global $wpdb;
$t_notifs = JW_Database::table( 'notifications' );
$notice   = '';

if ( JW_Permissions::verify_admin_action( 'jw_notifs_action', 'jw_notifs_nonce' ) ) {
	$sub = sanitize_key( wp_unslash( $_POST['jw_sub_action'] ?? '' ) );

	if ( 'send_notification' === $sub ) {
		$title    = sanitize_text_field( wp_unslash( $_POST['title'] ?? '' ) );
		$message  = sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) );
		$category = sanitize_key( wp_unslash( $_POST['category'] ?? 'panchang' ) );
		$screen   = sanitize_key( wp_unslash( $_POST['target_screen'] ?? 'home' ) );

		if ( ! empty( $title ) && ! empty( $message ) ) {
			$wpdb->insert(
				$t_notifs,
				array(
					'notif_uid'     => 'ntf_' . uniqid(),
					'title'         => $title,
					'message'       => $message,
					'category'      => $category,
					'target_screen' => $screen,
					'sent_at'       => current_time( 'mysql' ),
					'status'        => 'sent',
					'created_by'    => get_current_user_id(),
				)
			);
			JW_Logging::log( 'admin', 'info', 'Notification published: ' . $title );
			$notice = 'Notification published to app users.';
		}
	}

	if ( 'delete_notification' === $sub ) {
		$nid = absint( $_POST['notif_id'] ?? 0 );
		$wpdb->delete( $t_notifs, array( 'id' => $nid ) );
		$notice = 'Notification deleted.';
	}

	if ( 'bulk_delete_notifications' === $sub ) {
		$selected_ids = array_map( 'absint', (array) ( $_POST['selected_notifs'] ?? array() ) );
		$selected_ids = array_filter( $selected_ids );
		if ( ! empty( $selected_ids ) ) {
			$placeholders = implode( ',', array_fill( 0, count( $selected_ids ), '%d' ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM {$t_notifs} WHERE id IN ($placeholders)", ...$selected_ids ) ); // phpcs:ignore
			JW_Logging::log( 'admin', 'info', 'Bulk deleted ' . count( $selected_ids ) . ' notifications.' );
			$notice = count( $selected_ids ) . ' notifications deleted successfully.';
		}
	}

	if ( 'save_fcm_v1_config' === $sub ) {
		$sec                      = JW_Settings::get_security_settings();
		$sec['fcm_enabled']       = ! empty( $_POST['fcm_enabled'] ) ? 1 : 0;
		$sec['fcm_project_id']    = sanitize_text_field( wp_unslash( $_POST['fcm_project_id'] ?? '' ) );
		$sec['fcm_default_topic'] = sanitize_key( wp_unslash( $_POST['fcm_default_topic'] ?? 'jyotishwala_all' ) );

		$raw_sa_json = trim( wp_unslash( $_POST['fcm_service_account_json'] ?? '' ) ); // phpcs:ignore
		if ( '' !== $raw_sa_json ) {
			$decoded_sa = json_decode( $raw_sa_json, true );
			if ( is_array( $decoded_sa ) && ! empty( $decoded_sa['client_email'] ) && ! empty( $decoded_sa['private_key'] ) ) {
				$sec['fcm_service_account_enc'] = JW_Settings::encrypt_secret( $raw_sa_json );
				update_option( 'jw_security_settings', $sec );
				JW_Logging::log( 'security', 'info', 'Updated FCM HTTP v1 Service Account configuration (encrypted at rest).' );
				$notice = 'FCM HTTP v1 Service Account JSON validated and encrypted at rest.';
			} else {
				$notice = 'Error: Invalid Firebase Service Account JSON (must contain client_email and private_key).';
			}
		} else {
			update_option( 'jw_security_settings', $sec );
			$notice = 'FCM HTTP v1 settings updated.';
		}
	}
}

// 10-Item Pagination
$per_page     = 10;
$current_p    = max( 1, absint( $_GET['paged'] ?? 1 ) );
$total_notifs = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_notifs}" ); // phpcs:ignore
$total_pages  = max( 1, ceil( $total_notifs / $per_page ) );
$offset       = ( $current_p - 1 ) * $per_page;

$notifs = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t_notifs} ORDER BY id DESC LIMIT %d OFFSET %d", $per_page, $offset ), ARRAY_A ); // phpcs:ignore
$sec    = JW_Settings::get_security_settings();
$has_sa = ! empty( $sec['fcm_service_account_enc'] );
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-notifications',
		'Notification Management',
		'Broadcast Panchang, Ekadashi, Festival & Muhurta alerts to JyotishWala App users.'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $notice ); ?></p></div>
	<?php endif; ?>

	<div class="jw-grid-2">
		<div class="jw-card">
			<h3>Send New In-App Notification (Active via REST API)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_notifs_action', 'jw_notifs_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="send_notification" />
				<p>
					<label>Notification Title:<br/>
						<input type="text" name="title" required placeholder="एकादशी व्रत एवं शुभ मुहूर्त सूचना" class="large-text" />
					</label>
				</p>
				<p>
					<label>Notification Message:<br/>
						<textarea name="message" rows="3" required class="large-text" placeholder="आज का ऋषिकेश पंचांग, राहुकाल एवं अभिजीत मुहूर्त देखें..."></textarea>
					</label>
				</p>
				<p>
					<label>Category:
						<select name="category">
							<option value="panchang">Panchang & Tithi</option>
							<option value="tyohar">Vrat & Tyohar</option>
							<option value="rashifal">Daily Rashifal</option>
							<option value="muhurta">Shubh Muhurta</option>
						</select>
					</label>
					<label style="margin-left:12px;">Target Screen:
						<select name="target_screen">
							<option value="home">Home</option>
							<option value="panchang">Panchang</option>
							<option value="tyohar">Tyohar</option>
							<option value="rashifal">Rashifal</option>
						</select>
					</label>
				</p>
				<p><button type="submit" class="button jw-btn-primary">Publish In-App Notification</button></p>
			</form>
		</div>

		<div class="jw-card">
			<h3>Firebase Cloud Messaging (FCM HTTP v1 API — Pending Push Dispatcher)</h3>
			<p>
				<span class="jw-badge jw-badge-green">In-App REST Feed: Active</span>
				<span class="jw-badge jw-badge-saffron">FCM HTTP v1 Background Push: Pending Phase 2</span>
			</p>
			<p><small>The obsolete FCM Legacy Server Key API is not used. Background Android push notifications use <strong>FCM HTTP v1</strong> (<code>https://fcm.googleapis.com/v1/projects/{project_id}/messages:send</code>) authenticated via OAuth 2.0 Service Account JSON encrypted at rest with AES-256-CBC.</small></p>
			<form method="post">
				<?php wp_nonce_field( 'jw_notifs_action', 'jw_notifs_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_fcm_v1_config" />
				<p><label><input type="checkbox" name="fcm_enabled" value="1" <?php checked( ! empty( $sec['fcm_enabled'] ), true ); ?> /> Enable FCM HTTP v1 Configuration</label></p>
				<p>
					<label>Firebase Project ID:<br/>
						<input type="text" name="fcm_project_id" value="<?php echo esc_attr( $sec['fcm_project_id'] ?? '' ); ?>" placeholder="e.g. jyotishwala-mobile" class="regular-text" />
					</label>
					&nbsp;&nbsp;
					<label>Default Topic:<br/>
						<input type="text" name="fcm_default_topic" value="<?php echo esc_attr( $sec['fcm_default_topic'] ?? 'jyotishwala_all' ); ?>" class="regular-text" style="width:160px;" />
					</label>
				</p>
				<p>
					<label>Service Account JSON (Encrypted with AES-256-CBC on save; never exposed to APK or REST API):
						<?php if ( $has_sa ) : ?>
							<span class="jw-badge jw-badge-green">Encrypted Service Account Stored</span>
						<?php else : ?>
							<span class="jw-badge jw-badge-saffron">Not Configured</span>
						<?php endif; ?>
						<br/>
						<textarea name="fcm_service_account_json" rows="3" class="large-text code" placeholder="Paste Firebase Service Account JSON here (leave blank to keep existing encrypted JSON)..."></textarea>
					</label>
				</p>
				<p><button type="submit" class="button">Save Encrypted FCM HTTP v1 Config</button></p>
			</form>
		</div>
	</div>

	<div class="jw-card">
		<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
			<h3 style="margin:0 !important; border:none; padding:0;">Notification History (कुल: <?php echo esc_html( $total_notifs ); ?>)</h3>
			<?php if ( $total_pages > 1 ) : ?>
				<div style="display:flex; gap:6px; align-items:center; font-size:12px;">
					<span>Page <?php echo esc_html( $current_p ); ?> of <?php echo esc_html( $total_pages ); ?></span>
					<?php if ( $current_p > 1 ) : ?>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-notifications&paged=' . ( $current_p - 1 ) ) ); ?>" class="button button-small">« Prev</a>
					<?php endif; ?>
					<?php if ( $current_p < $total_pages ) : ?>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-notifications&paged=' . ( $current_p + 1 ) ) ); ?>" class="button button-small">Next »</a>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>

		<form method="post" id="jw_bulk_notifs_form" onsubmit="return confirm('क्या आप चयनित सभी नोटिफिकेशन्स को एक साथ हटाना चाहते हैं?');">
			<?php wp_nonce_field( 'jw_notifs_action', 'jw_notifs_nonce' ); ?>
			<input type="hidden" name="jw_sub_action" value="bulk_delete_notifications" />

			<div style="margin-bottom:8px; display:flex; align-items:center; gap:10px;">
				<button type="submit" class="button" style="color:#b91c1c; border-color:#fca5a5;">Delete Selected (चयनित हटाएं)</button>
				<span style="font-size:12px; color:#64748b;">(चेकबॉक्स चुनकर एक साथ हटाएं)</span>
			</div>

			<table class="jw-table">
				<thead>
					<tr>
						<th style="width:36px; text-align:center;">
							<input type="checkbox" id="jw_select_all_notifs" onclick="document.querySelectorAll('.jw-notif-cb').forEach(cb => cb.checked = this.checked);" />
						</th>
						<th>Sent At</th>
						<th>Category</th>
						<th>Title & Message</th>
						<th>Target Screen</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $notifs ) ) : ?>
						<tr><td colspan="6">No notifications sent yet.</td></tr>
					<?php else : ?>
						<?php foreach ( $notifs as $n ) : ?>
							<tr>
								<td style="text-align:center;">
									<input type="checkbox" name="selected_notifs[]" value="<?php echo esc_attr( $n['id'] ); ?>" class="jw-notif-cb" />
								</td>
								<td><?php echo esc_html( $n['sent_at'] ); ?></td>
								<td><code><?php echo esc_html( $n['category'] ); ?></code></td>
								<td><strong><?php echo esc_html( $n['title'] ); ?></strong><br/><?php echo esc_html( $n['message'] ); ?></td>
								<td><code><?php echo esc_html( $n['target_screen'] ); ?></code></td>
								<td>
									<button type="button" class="button" onclick="if(confirm('Delete this notification?')) { const f = document.createElement('form'); f.method='post'; f.innerHTML='<input type=\'hidden\' name=\'jw_notifs_nonce\' value=\'<?php echo wp_create_nonce( 'jw_notifs_action' ); ?>\'/><input type=\'hidden\' name=\'jw_sub_action\' value=\'delete_notification\'/><input type=\'hidden\' name=\'notif_id\' value=\'<?php echo esc_attr( $n['id'] ); ?>\'/>'; document.body.appendChild(f); f.submit(); }">Delete</button>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</form>

		<?php if ( $total_pages > 1 ) : ?>
			<div style="display:flex; justify-content:flex-end; gap:6px; align-items:center; margin-top:14px; font-size:12px;">
				<span>Page <?php echo esc_html( $current_p ); ?> of <?php echo esc_html( $total_pages ); ?>:</span>
				<?php for ( $i = 1; $i <= $total_pages; $i++ ) : ?>
					<?php if ( $i === $current_p ) : ?>
						<strong class="button button-small" style="background:#0f766e; color:#fff; border-color:#0f766e;"><?php echo $i; ?></strong>
					<?php else : ?>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-notifications&paged=' . $i ) ); ?>" class="button button-small"><?php echo $i; ?></a>
					<?php endif; ?>
				<?php endfor; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
