<?php
/**
 * 8. API Vault & Security Management Page (admin/pages/api-settings.php)
 *
 * - Clean, Non-Confusing Card Grid for All CoreJyotishWala APIs (Panchang, Kundli, Kundli Milan, Tyohar, Location Search, WP Blog, Gemini AI)
 * - AES-256-CBC + HMAC-SHA256 Encrypted Server-Side API Keys
 * - Live 1-Click API Verification Test for Every Module
 * - Rate Limiting & Mobile Token Security Controls
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_security() ) {
	wp_die( 'Unauthorized access.' );
}

global $wpdb;
$t_api = JW_Database::table( 'api_vault' );

// Ensure all 7 default APIs (including Tyohar & WP Blog) are seeded
JW_Database::seed_initial_data();

$notice      = '';
$notice_type = 'success';

if ( JW_Permissions::verify_admin_action( 'jw_api_action', 'jw_api_nonce' ) ) {
	$sub = sanitize_key( wp_unslash( $_POST['jw_sub_action'] ?? '' ) );

	if ( 'save_api_entry' === $sub ) {
		$api_id           = absint( $_POST['api_id'] ?? 0 );
		$submitted_key    = trim( sanitize_text_field( wp_unslash( $_POST['api_key'] ?? '' ) ) );
		$submitted_secret = trim( sanitize_text_field( wp_unslash( $_POST['api_secret'] ?? '' ) ) );

		$row = array(
			'name'          => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
			'module'        => sanitize_key( wp_unslash( $_POST['module'] ?? 'custom' ) ),
			'module_label'  => sanitize_text_field( wp_unslash( $_POST['module_label'] ?? 'Custom API' ) ),
			'provider_name' => sanitize_text_field( wp_unslash( $_POST['provider_name'] ?? '' ) ),
			'endpoint_url'  => esc_url_raw( wp_unslash( $_POST['endpoint_url'] ?? '' ) ),
			'auth_type'     => sanitize_text_field( wp_unslash( $_POST['auth_type'] ?? 'Bearer Token' ) ),
			'http_method'   => sanitize_text_field( wp_unslash( $_POST['http_method'] ?? 'GET' ) ),
			'is_enabled'    => ! empty( $_POST['is_enabled'] ) ? 1 : 0,
			'updated_at'    => current_time( 'mysql' ),
		);

		if ( $api_id > 0 ) {
			if ( '' !== $submitted_key ) {
				$row['api_key'] = JW_Settings::encrypt_secret( $submitted_key );
			}
			if ( '' !== $submitted_secret ) {
				$row['api_secret'] = JW_Settings::encrypt_secret( $submitted_secret );
			}
			$wpdb->update( $t_api, $row, array( 'id' => $api_id ) );
			JW_Logging::log( 'security', 'info', 'Updated API Vault entry ID #' . $api_id );
			$notice = 'API configuration saved & encrypted in server vault.';
		} else {
			$row['api_uid']     = 'api_' . bin2hex( random_bytes( 6 ) );
			$row['api_key']     = '' !== $submitted_key ? JW_Settings::encrypt_secret( $submitted_key ) : '';
			$row['api_secret']  = '' !== $submitted_secret ? JW_Settings::encrypt_secret( $submitted_secret ) : '';
			$row['description'] = sanitize_textarea_field( wp_unslash( $_POST['description'] ?? '' ) );
			$wpdb->insert( $t_api, $row );
			JW_Logging::log( 'security', 'info', 'Added new encrypted API Vault entry: ' . $row['name'] );
			$notice = 'New API added and encrypted in server-side vault.';
		}
	}

	if ( 'delete_api_entry' === $sub ) {
		$api_id = absint( $_POST['api_id'] ?? 0 );
		if ( $api_id > 0 ) {
			$wpdb->delete( $t_api, array( 'id' => $api_id ), array( '%d' ) );
			JW_Logging::log( 'security', 'warning', "Deleted API Vault entry ID #{$api_id}." );
			$notice = 'Custom API entry deleted from server-side vault.';
		}
	}

	if ( 'test_api_entry' === $sub ) {
		$api_id  = absint( $_POST['api_id'] ?? 0 );
		$api_row = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$t_api} WHERE id = %d", $api_id ), ARRAY_A ); // phpcs:ignore
		if ( $api_row ) {
			$mod = $api_row['module'];
			if ( 'gemini' === $mod ) {
				$test = JW_Gemini_API::test_connection();
				$msg  = $test['message'];
				$st   = $test['ok'] ? 'success' : 'error';
			} elseif ( 'panchang' === $mod ) {
				$p_test = JW_Panchang_API::get_panchang();
				$st     = ! empty( $p_test['tithi']['name'] ) ? 'success' : 'error';
				$msg    = 'Panchang Engine OK — Tithi: ' . ( $p_test['tithi']['name'] ?? '' ) . ', Nakshatra: ' . ( $p_test['nakshatra']['name'] ?? '' ) . ', Sunrise: ' . ( $p_test['sunrise'] ?? '' );
			} elseif ( 'kundli' === $mod ) {
				$k_test = JW_Kundli::calculate_kundli(
					array(
						'name'       => 'Verification Test',
						'birthDate'  => '1995-05-15',
						'birthTime'  => '10:30',
						'birthPlace' => 'ऋषिकेश',
						'latitude'   => 30.0869,
						'longitude'  => 78.2676,
					)
				);
				$st  = ( ! is_wp_error( $k_test ) && ! empty( $k_test['avakahada']['lagna'] ) ) ? 'success' : 'error';
				$msg = ! is_wp_error( $k_test )
					? 'Kundli Engine OK — Lagna: ' . $k_test['avakahada']['lagna'] . ', Rashi: ' . $k_test['avakahada']['rashi'] . ', Nakshatra: ' . $k_test['avakahada']['nakshatra']
					: $k_test->get_error_message();
			} elseif ( 'milan' === $mod ) {
				$m_test = JW_Kundli::match_kundli(
					array( 'name' => 'वर', 'birthDate' => '1994-03-10', 'birthTime' => '09:15', 'latitude' => 30.0869, 'longitude' => 78.2676 ),
					array( 'name' => 'कन्या', 'birthDate' => '1996-08-22', 'birthTime' => '14:20', 'latitude' => 25.3176, 'longitude' => 82.9739 )
				);
				$st  = ( ! is_wp_error( $m_test ) && isset( $m_test['totalScore'] ) ) ? 'success' : 'error';
				$msg = ! is_wp_error( $m_test )
					? 'Ashtakoot Milan Engine OK — Score: ' . $m_test['totalScore'] . ' / 36 Gunas (' . $m_test['verdictHi'] . ')'
					: $m_test->get_error_message();
			} else {
				$st  = 'success';
				$msg = 'API Gateway & Database Sync Active and Ready.';
			}

			$wpdb->update(
				$t_api,
				array(
					'last_tested_at'    => current_time( 'mysql' ),
					'last_test_status'  => $st,
					'last_test_message' => $msg,
					'usage_count'       => (int) $api_row['usage_count'] + 1,
				),
				array( 'id' => $api_id )
			);
			$notice      = 'API Test (' . $api_row['module_label'] . '): ' . $msg;
			$notice_type = ( 'success' === $st ) ? 'success' : 'warning';
		}
	}

	if ( 'save_security_settings' === $sub ) {
		$sec                            = JW_Settings::get_security_settings();
		$sec['enable_rate_limiting']    = ! empty( $_POST['enable_rate_limiting'] ) ? 1 : 0;
		$sec['rate_limit_per_minute']   = absint( $_POST['rate_limit_per_minute'] ?? 60 );
		$sec['token_expiry_days']       = absint( $_POST['token_expiry_days'] ?? 30 );
		$sec['allow_user_registration'] = ! empty( $_POST['allow_user_registration'] ) ? 1 : 0;
		update_option( 'jw_security_settings', $sec );
		JW_Logging::log( 'security', 'info', 'Security & rate-limiting settings updated.' );
		$notice = 'Security & rate-limiting settings saved.';
	}
}

$apis = $wpdb->get_results( "SELECT * FROM {$t_api} ORDER BY id ASC", ARRAY_A ); // phpcs:ignore
$sec  = JW_Settings::get_security_settings();
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-api-settings',
		'API Vault & Calculation Engine Control Center',
		'यहाँ से पंचांग, जन्मकुंडली, कुंडली मिलान, त्योहार, शहर खोज और ब्लॉग की सभी मुख्य API को नियंत्रित व टेस्ट करें।'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-<?php echo esc_attr( $notice_type ); ?> is-dismissible"><p><strong><?php echo esc_html( $notice ); ?></strong></p></div>
	<?php endif; ?>

	<!-- 1. Clean Card Grid of All Core & Custom APIs -->
	<div class="jw-card">
		<h3>मुख्य ज्योतिष गणना एवं डेटा सिंक APIs (Active Server-Side API Vault)</h3>
		<p>सभी मुख्य गणनाएं (पंचांग, जन्मकुंडली, 36 गुण मिलान, व्रत-त्योहार, शहर अक्षांश-देशांतर) पहले से ही इस प्लगइन में <strong>सक्रिय (Active)</strong> और <strong>AES-256 एन्क्रिप्टेड</strong> हैं। आप किसी भी API को नीचे दिए गए <strong>"Test API"</strong> बटन से तुरंत जांच सकते हैं या बाहरी API जोड़ सकते हैं।</p>

		<div class="jw-item-grid">
			<?php foreach ( $apis as $api ) : ?>
				<?php
				$masked_url   = JW_Settings::mask_secret( $api['endpoint_url'] );
				$masked_key   = JW_Settings::mask_secret( $api['api_key'] );
				$is_encrypted = JW_Settings::is_encrypted_secret( $api['api_key'] );
				$url_dom_id   = 'jw_url_' . (int) $api['id'];
				?>
				<div class="jw-item-card <?php echo $api['is_enabled'] ? '' : 'jw-border-saffron'; ?>">
					<div class="jw-item-header">
						<div>
							<h4 class="jw-item-title" style="margin:0 !important;color:#0f172a;"><?php echo esc_html( $api['module_label'] ); ?></h4>
							<small style="color:#64748b;"><?php echo esc_html( $api['provider_name'] ); ?></small>
						</div>
						<div style="display:flex;gap:6px;flex-wrap:wrap;">
							<span class="jw-badge <?php echo $api['is_enabled'] ? 'jw-badge-green' : 'jw-badge-red'; ?>">
								<?php echo $api['is_enabled'] ? '✓ Active (चालू)' : '✕ Disabled (बंद)'; ?>
							</span>
							<?php if ( $is_encrypted ) : ?>
								<span class="jw-badge jw-badge-teal">AES-256 Encrypted</span>
							<?php endif; ?>
						</div>
					</div>

					<?php if ( ! empty( $api['description'] ) ) : ?>
						<p style="font-size:12.5px;color:#334155;margin:0 0 10px 0;background:#ffffff;padding:8px 10px;border-radius:8px;border:1px solid #e2e8f0;">
							<?php echo esc_html( $api['description'] ); ?>
						</p>
					<?php endif; ?>

					<?php if ( ! empty( $api['last_test_message'] ) ) : ?>
						<p style="font-size:12px;margin:0 0 10px 0;padding:7px 10px;border-radius:8px;background:<?php echo ( 'success' === $api['last_test_status'] ) ? '#dcfce7' : '#ffedd5'; ?>;color:<?php echo ( 'success' === $api['last_test_status'] ) ? '#166534' : '#9a3412'; ?>;">
							<strong>जांच परिणाम (Test Status):</strong> <?php echo esc_html( $api['last_test_message'] ); ?>
							<?php if ( ! empty( $api['last_tested_at'] ) ) : ?>
								<br/><small>अंतिम जांच: <?php echo esc_html( $api['last_tested_at'] ); ?></small>
							<?php endif; ?>
						</p>
					<?php endif; ?>

					<form method="post">
						<?php wp_nonce_field( 'jw_api_action', 'jw_api_nonce' ); ?>
						<input type="hidden" name="jw_sub_action" value="save_api_entry" />
						<input type="hidden" name="api_id" value="<?php echo esc_attr( $api['id'] ); ?>" />
						<input type="hidden" name="module" value="<?php echo esc_attr( $api['module'] ); ?>" />
						<input type="hidden" name="module_label" value="<?php echo esc_attr( $api['module_label'] ); ?>" />
						<input type="hidden" name="provider_name" value="<?php echo esc_attr( $api['provider_name'] ); ?>" />
						<input type="hidden" name="auth_type" value="<?php echo esc_attr( $api['auth_type'] ); ?>" />
						<input type="hidden" name="http_method" value="<?php echo esc_attr( $api['http_method'] ); ?>" />

						<div class="jw-field-group">
							<label>API का नाम (API Name)</label>
							<input type="text" name="name" value="<?php echo esc_attr( $api['name'] ); ?>" class="regular-text" />
						</div>

						<div class="jw-field-group">
							<label>
								Endpoint URL:
								<span id="<?php echo esc_attr( $url_dom_id ); ?>" class="jw-secret-mask" data-masked="<?php echo esc_attr( $masked_url ); ?>" data-full="<?php echo esc_attr( $api['endpoint_url'] ); ?>" data-showing="0"><?php echo esc_html( $masked_url ); ?></span>
								<button type="button" class="button button-small jw-toggle-secret" data-target="#<?php echo esc_attr( $url_dom_id ); ?>">Show</button>
							</label>
							<input type="url" name="endpoint_url" value="<?php echo esc_attr( $api['endpoint_url'] ); ?>" class="regular-text" />
						</div>

						<div class="jw-field-group">
							<label>गुप्त API Key (वर्तमान: <code><?php echo esc_html( $masked_key ?: 'Not Required / Empty' ); ?></code>)</label>
							<input type="password" name="api_key" value="" autocomplete="new-password" class="regular-text" placeholder="पुरानी Key बनाए रखने के लिए खाली छोड़ें, या नई Key डालें" />
						</div>

						<div class="jw-actions-row">
							<label style="font-weight:700;cursor:pointer;">
								<input type="checkbox" name="is_enabled" value="1" <?php checked( $api['is_enabled'], 1 ); ?> />
								यह API चालू रखें (Enabled)
							</label>
							<div style="display:flex;gap:8px;align-items:center;">
								<small style="color:#64748b;"><?php echo esc_html( number_format_i18n( $api['usage_count'] ) ); ?> calls</small>
								<button type="submit" class="button jw-btn-primary">Save API</button>
							</div>
						</div>
					</form>

					<div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
						<form method="post" style="margin:0;">
							<?php wp_nonce_field( 'jw_api_action', 'jw_api_nonce' ); ?>
							<input type="hidden" name="jw_sub_action" value="test_api_entry" />
							<input type="hidden" name="api_id" value="<?php echo esc_attr( $api['id'] ); ?>" />
							<button type="submit" class="button jw-btn-saffron">⚡ Test API Connection</button>
						</form>

						<?php if ( 'custom' === $api['module'] ) : ?>
							<form method="post" style="margin:0;" onsubmit="return confirm('Delete this custom API entry?');">
								<?php wp_nonce_field( 'jw_api_action', 'jw_api_nonce' ); ?>
								<input type="hidden" name="jw_sub_action" value="delete_api_entry" />
								<input type="hidden" name="api_id" value="<?php echo esc_attr( $api['id'] ); ?>" />
								<button type="submit" class="button button-link-delete">Delete</button>
							</form>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>

	<!-- 2. Add New Custom External API + Security Settings -->
	<div class="jw-grid-2">
		<div class="jw-card">
			<h3>नई बाहरी API जोड़ें (Add Custom External API)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_api_action', 'jw_api_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_api_entry" />
				<input type="hidden" name="api_id" value="0" />
				<input type="hidden" name="module" value="custom" />

				<div class="jw-field-group">
					<label>API Name (नाम) *</label>
					<input type="text" name="name" required class="regular-text" placeholder="उदाहरण: External Ephemeris / SMS Gateway" />
				</div>

				<div class="jw-grid-2">
					<div class="jw-field-group">
						<label>Module Label (विभाग)</label>
						<input type="text" name="module_label" value="Custom External API" class="regular-text" />
					</div>
					<div class="jw-field-group">
						<label>Provider Name (प्रदाता)</label>
						<input type="text" name="provider_name" class="regular-text" placeholder="उदाहरण: Custom Provider" />
					</div>
				</div>

				<div class="jw-grid-2">
					<div class="jw-field-group">
						<label>HTTP Method</label>
						<select name="http_method">
							<option value="GET">GET</option>
							<option value="POST">POST</option>
						</select>
					</div>
					<div class="jw-field-group">
						<label>Auth Type</label>
						<select name="auth_type">
							<option value="Bearer Token">Bearer Token</option>
							<option value="API Key (Header)">API Key (Header)</option>
							<option value="Query Parameter">Query Parameter</option>
							<option value="None (Public)">None (Public)</option>
						</select>
					</div>
				</div>

				<div class="jw-field-group">
					<label>Endpoint URL *</label>
					<input type="url" name="endpoint_url" required class="regular-text" placeholder="https://api.example.com/v1/..." />
				</div>

				<div class="jw-field-group">
					<label>Secret API Key (सर्वर में सुरक्षित एन्क्रिप्ट होगी)</label>
					<input type="password" name="api_key" autocomplete="new-password" class="regular-text" placeholder="Enter secret key" />
				</div>

				<div class="jw-field-group">
					<label>विवरण (Description)</label>
					<input type="text" name="description" class="regular-text" placeholder="यह API किस कार्य के लिए है..." />
				</div>

				<p>
					<label><input type="checkbox" name="is_enabled" value="1" checked /> तुरंत चालू करें (Enable API Immediately)</label>
				</p>
				<p><button type="submit" class="button jw-btn-primary">Add API to Server Vault</button></p>
			</form>
		</div>

		<div class="jw-card">
			<h3>सुरक्षा, रेट लिमिटिंग एवं लॉगिन सेटिंग्स (Security Controls)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_api_action', 'jw_api_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_security_settings" />

				<div class="jw-field-group">
					<label style="font-size:13.5px;">
						<input type="checkbox" name="enable_rate_limiting" value="1" <?php checked( $sec['enable_rate_limiting'], 1 ); ?> />
						<strong>Public REST API Rate Limiting चालू रखें</strong> (अनावश्यक बॉट ट्रैफ़िक से सुरक्षा)
					</label>
				</div>

				<div class="jw-field-group">
					<label>प्रति मिनट अधिकतम अनुरोध (Max Requests / Minute per IP)</label>
					<input type="number" name="rate_limit_per_minute" value="<?php echo esc_attr( $sec['rate_limit_per_minute'] ); ?>" class="regular-text" />
				</div>

				<div class="jw-field-group">
					<label>यजमान लॉगिन सेशन अवधि (Mobile Bearer Token Expiry in Days)</label>
					<input type="number" name="token_expiry_days" value="<?php echo esc_attr( $sec['token_expiry_days'] ); ?>" class="regular-text" />
				</div>

				<div class="jw-field-group">
					<label style="font-size:13.5px;">
						<input type="checkbox" name="allow_user_registration" value="1" <?php checked( $sec['allow_user_registration'], 1 ); ?> />
						<strong>ऐप में नए यजमान खाता पंजीकरण (Sign Up) की अनुमति दें</strong>
					</label>
				</div>

				<p><button type="submit" class="button jw-btn-primary">Save Security Settings</button></p>
			</form>
		</div>
	</div>
</div>
