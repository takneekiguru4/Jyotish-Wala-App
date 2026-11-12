<?php
/**
 * 5. App Users Management (admin/pages/users.php)
 *
 * - View all Registered App Users (Subscribers)
 * - Direct Password Reset for Any Registered User
 * - Account Activation / Deactivation
 * - Clean, focused user management (Saved Kundlis & Team roles removed as requested)
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

global $wpdb;
$t_receipts = JW_Database::table( 'receipts' );
$notice      = '';
$notice_type = 'success';

if ( JW_Permissions::verify_admin_action( 'jw_users_action', 'jw_users_nonce' ) ) {
	$sub = sanitize_key( wp_unslash( $_POST['jw_sub_action'] ?? '' ) );

	// 1. Reset Registered User Password
	if ( 'reset_user_password' === $sub || 'create_or_update_user' === $sub ) {
		$u_email = sanitize_email( wp_unslash( $_POST['u_email'] ?? '' ) );
		$u_pass  = wp_unslash( $_POST['u_password'] ?? '' ); // phpcs:ignore

		if ( empty( $u_email ) || ! is_email( $u_email ) ) {
			$notice      = 'कृपया सही ईमेल पता दर्ज करें (Valid email is required).';
			$notice_type = 'error';
		} elseif ( empty( $u_pass ) || strlen( $u_pass ) < 6 ) {
			$notice      = 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए (Password must be at least 6 characters).';
			$notice_type = 'error';
		} else {
			$user_id = email_exists( $u_email );
			if ( ! $user_id ) {
				$notice      = 'इस ईमेल (' . $u_email . ') से कोई पंजीकृत यूज़र खाता नहीं मिला।';
				$notice_type = 'error';
			} else {
				wp_set_password( $u_pass, $user_id );
				update_user_meta( $user_id, 'jw_account_status', 'active' );
				JW_Logging::log( 'users', 'info', 'Password reset by admin for user #' . $user_id . ' (' . $u_email . ')' );
				$notice = 'यूज़र (' . $u_email . ') का पासवर्ड सफलतापूर्वक बदल दिया गया है।';
			}
		}
	}

	// 2. Toggle User Active / Deactivated Status
	if ( 'toggle_user_status' === $sub ) {
		$target_uid = absint( $_POST['target_user_id'] ?? 0 );
		$new_status = sanitize_key( wp_unslash( $_POST['new_status'] ?? 'active' ) );
		if ( $target_uid > 0 && ! user_can( $target_uid, 'manage_options' ) ) {
			update_user_meta( $target_uid, 'jw_account_status', $new_status );
			if ( 'deactivated' === $new_status ) {
				JW_Authentication::revoke_tokens( $target_uid );
			}
			$notice = 'User account status updated to ' . strtoupper( $new_status ) . '.';
		}
	}

	// 3. Inline Password Reset from User Card
	if ( 'inline_password_reset' === $sub ) {
		$target_uid  = absint( $_POST['target_user_id'] ?? 0 );
		$inline_pass = trim( wp_unslash( $_POST['inline_new_password'] ?? '' ) ); // phpcs:ignore
		if ( $target_uid > 0 && '' !== $inline_pass && strlen( $inline_pass ) >= 6 && ! user_can( $target_uid, 'manage_options' ) ) {
			wp_set_password( $inline_pass, $target_uid );
			$notice = 'User #' . $target_uid . ' new password updated successfully.';
			JW_Logging::log( 'admin', 'info', 'Password reset for user #' . $target_uid );
		}
	}
}

$search_q  = sanitize_text_field( wp_unslash( $_GET['s_user'] ?? '' ) );
$user_args = array(
	'number'  => 60,
	'orderby' => 'registered',
	'order'   => 'DESC',
);
if ( ! empty( $search_q ) ) {
	$user_args['search'] = '*' . $search_q . '*';
}
$users = get_users( $user_args );
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-users',
		'App Users Management (पंजीकृत यूज़र)',
		'यहाँ से ऐप के सभी पंजीकृत यूज़र्स (सब्सक्राइबर्स) को देखें, पासवर्ड रीसेट करें अथवा अकाउंट एक्टिव/डीएक्टिवेट करें।'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-<?php echo esc_attr( $notice_type ); ?> is-dismissible"><p><strong><?php echo esc_html( $notice ); ?></strong></p></div>
	<?php endif; ?>

	<!-- 1. Reset Registered User Password -->
	<div class="jw-card">
		<h3>यूज़र पासवर्ड रीसेट करें (Reset User Password)</h3>
		<p>यदि कोई पंजीकृत यूज़र अपना पासवर्ड भूल गया हो तो उसका पंजीकृत ईमेल और नया पासवर्ड यहाँ दर्ज करें।</p>
		<form method="post">
			<?php wp_nonce_field( 'jw_users_action', 'jw_users_nonce' ); ?>
			<input type="hidden" name="jw_sub_action" value="reset_user_password" />

			<div class="jw-grid-2">
				<div class="jw-field-group">
					<label>पंजीकृत ईमेल पता (Registered Email ID) *</label>
					<input type="email" name="u_email" required placeholder="user@example.com" class="regular-text" />
				</div>
				<div class="jw-field-group">
					<label>नया पासवर्ड (New Password — कम से कम 6 अक्षर) *</label>
					<input type="text" name="u_password" required placeholder="नया पासवर्ड लिखें" class="regular-text" />
				</div>
			</div>

			<p><button type="submit" class="button jw-btn-primary">Reset Password</button></p>
		</form>
	</div>

	<!-- 2. Registered Users List -->
	<div class="jw-card">
		<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
			<h3 style="margin:0 !important;border:none;padding:0;">पंजीकृत ऐप यूज़र्स (<?php echo count( $users ); ?>)</h3>
			<form method="get" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
				<input type="hidden" name="page" value="jw-app-users" />
				<input type="search" name="s_user" value="<?php echo esc_attr( $search_q ); ?>" placeholder="नाम या ईमेल से खोजें..." style="width:240px;" />
				<button type="submit" class="button jw-btn-primary">Search</button>
			</form>
		</div>

		<div class="jw-item-grid">
			<?php foreach ( $users as $u ) : ?>
				<?php
				$prof      = JW_User_Management::format_user_profile( $u->ID );
				$status    = $prof['status'];
				$rec_count = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$t_receipts} WHERE user_id = %d", $u->ID ) ); // phpcs:ignore
				?>
				<div class="jw-item-card">
					<div class="jw-item-header">
						<div>
							<h4 class="jw-item-title" style="margin:0 !important;">#<?php echo esc_html( $u->ID ); ?> — <?php echo esc_html( $u->display_name ); ?></h4>
							<small style="color:#0f766e;font-weight:700;"><?php echo esc_html( $u->user_email ); ?></small>
							<?php if ( ! empty( $prof['phone'] ) ) : ?>
								<br/><small>मोबाइल: <?php echo esc_html( $prof['phone'] ); ?></small>
							<?php endif; ?>
							<?php if ( ! empty( $prof['city'] ) ) : ?>
								<small> • शहर: <?php echo esc_html( $prof['city'] ); ?></small>
							<?php endif; ?>
						</div>
						<span class="jw-badge <?php echo ( 'active' === $status ) ? 'jw-badge-green' : 'jw-badge-red'; ?>">
							<?php echo esc_html( strtoupper( $status ) ); ?>
						</span>
					</div>

					<p style="font-size:12px;margin:0 0 10px 0;color:#475569;">
						पंजीकरण तिथि: <strong><?php echo esc_html( substr( $u->user_registered, 0, 10 ) ); ?></strong> •
						परामर्श रसीदें: <strong><?php echo esc_html( $rec_count ); ?></strong>
					</p>

					<?php if ( ! user_can( $u->ID, 'manage_options' ) ) : ?>
						<form method="post">
							<?php wp_nonce_field( 'jw_users_action', 'jw_users_nonce' ); ?>
							<input type="hidden" name="jw_sub_action" value="inline_password_reset" />
							<input type="hidden" name="target_user_id" value="<?php echo esc_attr( $u->ID ); ?>" />

							<div class="jw-field-group">
								<label>नया पासवर्ड सेट करें (Set New Password)</label>
								<div style="display:flex;gap:8px;align-items:center;">
									<input type="text" name="inline_new_password" required placeholder="नया पासवर्ड (कम से कम 6 अक्षर)" class="regular-text" style="flex:1;" />
									<button type="submit" class="button jw-btn-primary">Update Password</button>
								</div>
							</div>
						</form>

						<form method="post" style="margin-top:10px;text-align:right;">
							<?php wp_nonce_field( 'jw_users_action', 'jw_users_nonce' ); ?>
							<input type="hidden" name="jw_sub_action" value="toggle_user_status" />
							<input type="hidden" name="target_user_id" value="<?php echo esc_attr( $u->ID ); ?>" />
							<input type="hidden" name="new_status" value="<?php echo ( 'active' === $status ) ? 'deactivated' : 'active'; ?>" />
							<button type="submit" class="button">
								<?php echo ( 'active' === $status ) ? 'Deactivate Account' : 'Activate Account'; ?>
							</button>
						</form>
					<?php else : ?>
						<p style="margin:0;"><span class="jw-badge jw-badge-teal">Super Admin (व्यवस्थापक — Protected)</span></p>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>
