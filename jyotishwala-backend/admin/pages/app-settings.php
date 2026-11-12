<?php
/**
 * 9. App Settings Page (admin/pages/app-settings.php)
 *
 * - App Name, App Logo, App Version
 * - Default Language (Hindi / English)
 * - Contact Info, Privacy Policy URL, Terms URL
 * - Maintenance Mode & Feature Enable/Disable Controls
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

$notice = '';
if ( JW_Permissions::verify_admin_action( 'jw_app_settings_action', 'jw_app_settings_nonce' ) ) {
	$updated = array(
		'app_name'                 => sanitize_text_field( wp_unslash( $_POST['app_name'] ?? 'JyotishWala' ) ),
		'app_tagline_hi'           => sanitize_text_field( wp_unslash( $_POST['app_tagline_hi'] ?? '' ) ),
		'app_tagline_en'           => sanitize_text_field( wp_unslash( $_POST['app_tagline_en'] ?? '' ) ),
		'app_logo_url'             => esc_url_raw( wp_unslash( $_POST['app_logo_url'] ?? '' ) ),
		'app_version'              => sanitize_text_field( wp_unslash( $_POST['app_version'] ?? '2.5.0' ) ),
		'default_language'         => sanitize_key( wp_unslash( $_POST['default_language'] ?? 'hi' ) ),
		'supported_languages'      => array( 'hi', 'en' ),
		'contact_email'            => sanitize_email( wp_unslash( $_POST['contact_email'] ?? '' ) ),
		'contact_phone'            => sanitize_text_field( wp_unslash( $_POST['contact_phone'] ?? '' ) ),
		'contact_address'          => sanitize_text_field( wp_unslash( $_POST['contact_address'] ?? '' ) ),
		'privacy_policy_url'       => esc_url_raw( wp_unslash( $_POST['privacy_policy_url'] ?? '' ) ),
		'terms_url'                => esc_url_raw( wp_unslash( $_POST['terms_url'] ?? '' ) ),
		'maintenance_mode'         => ! empty( $_POST['maintenance_mode'] ) ? 1 : 0,
		'maintenance_message'      => sanitize_textarea_field( wp_unslash( $_POST['maintenance_message'] ?? '' ) ),
		'enable_panchang'          => ! empty( $_POST['enable_panchang'] ) ? 1 : 0,
		'enable_kundli'            => ! empty( $_POST['enable_kundli'] ) ? 1 : 0,
		'enable_milan'             => ! empty( $_POST['enable_milan'] ) ? 1 : 0,
		'enable_rashifal'          => ! empty( $_POST['enable_rashifal'] ) ? 1 : 0,
		'enable_gochar'            => ! empty( $_POST['enable_gochar'] ) ? 1 : 0,
		'enable_tyohar'            => ! empty( $_POST['enable_tyohar'] ) ? 1 : 0,
		'enable_calculators'       => ! empty( $_POST['enable_calculators'] ) ? 1 : 0,
		'enable_dharma'            => ! empty( $_POST['enable_dharma'] ) ? 1 : 0,
		'enable_sankalp'           => ! empty( $_POST['enable_sankalp'] ) ? 1 : 0,
		'enable_pandit_chat'       => ! empty( $_POST['enable_pandit_chat'] ) ? 1 : 0,
		'enable_articles'          => ! empty( $_POST['enable_articles'] ) ? 1 : 0,
		'enable_gallery'           => ! empty( $_POST['enable_gallery'] ) ? 1 : 0,
		'enable_reviews'           => ! empty( $_POST['enable_reviews'] ) ? 1 : 0,
		'enable_banners'           => ! empty( $_POST['enable_banners'] ) ? 1 : 0,
		'enable_gyan'              => ! empty( $_POST['enable_gyan'] ) ? 1 : 0,
		'enable_puja_vidhi'        => ! empty( $_POST['enable_puja_vidhi'] ) ? 1 : 0,
		'enable_sanskrit'          => ! empty( $_POST['enable_sanskrit'] ) ? 1 : 0,
		'enable_temples'           => ! empty( $_POST['enable_temples'] ) ? 1 : 0,
		'enable_puja_booking'      => ! empty( $_POST['enable_puja_booking'] ) ? 1 : 0,
		'enable_personal_library'  => ! empty( $_POST['enable_personal_library'] ) ? 1 : 0,
		'enable_support_tickets'   => ! empty( $_POST['enable_support_tickets'] ) ? 1 : 0,
		'home_sections_order'      => sanitize_text_field( wp_unslash( $_POST['home_sections_order'] ?? '' ) ),
		'delete_data_on_uninstall' => ! empty( $_POST['delete_data_on_uninstall'] ) ? 1 : 0,
	);
	update_option( 'jw_app_settings', $updated );
	JW_Logging::log( 'admin', 'info', 'App Settings updated by administrator.' );
	$notice = 'App settings saved successfully.';
}

$s = JW_Settings::get_app_settings();
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-settings',
		'JyotishWala App Settings',
		'Configure branding, Hindi/English language defaults, contact details, maintenance mode & feature toggles.'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $notice ); ?></p></div>
	<?php endif; ?>

	<div class="jw-card">
		<h3>General App Configuration & Feature Controls</h3>
		<form method="post">
			<?php wp_nonce_field( 'jw_app_settings_action', 'jw_app_settings_nonce' ); ?>
			<table class="form-table">
				<tr>
					<th>App Name & Version</th>
					<td>
						<div style="display:flex; flex-wrap:wrap; gap:10px; width:100%; max-width:100%;">
							<div style="flex:1 1 220px; min-width:0;">
								<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">App Name</label>
								<input type="text" name="app_name" value="<?php echo esc_attr( $s['app_name'] ); ?>" class="regular-text" style="width:100%;" />
							</div>
							<div style="flex:0 1 120px; min-width:90px;">
								<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">Version</label>
								<input type="text" name="app_version" value="<?php echo esc_attr( $s['app_version'] ); ?>" style="width:100%;" />
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<th>Tagline (Hindi & English)</th>
					<td>
						<div style="margin-bottom:8px;">
							<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">Hindi Tagline</label>
							<input type="text" name="app_tagline_hi" value="<?php echo esc_attr( $s['app_tagline_hi'] ); ?>" class="large-text" style="width:100%;" />
						</div>
						<div>
							<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">English Tagline</label>
							<input type="text" name="app_tagline_en" value="<?php echo esc_attr( $s['app_tagline_en'] ); ?>" class="large-text" style="width:100%;" />
						</div>
					</td>
				</tr>
				<tr>
					<th>App Logo URL</th>
					<td>
						<div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; width:100%;">
							<input type="url" id="jw_app_logo_input" name="app_logo_url" value="<?php echo esc_attr( $s['app_logo_url'] ); ?>" class="regular-text" style="flex:1 1 260px; min-width:0;" />
							<button type="button" class="button jw-media-upload-btn" data-input="#jw_app_logo_input" style="flex-shrink:0;">Select Logo</button>
						</div>
					</td>
				</tr>
				<tr>
					<th>Default App Language</th>
					<td>
						<select name="default_language" style="max-width:320px; width:100%;">
							<option value="hi" <?php selected( $s['default_language'], 'hi' ); ?>>Hindi (हिंदी — Default)</option>
							<option value="en" <?php selected( $s['default_language'], 'en' ); ?>>English</option>
						</select>
					</td>
				</tr>
				<tr>
					<th>Contact Email, Phone & Address</th>
					<td>
						<div style="display:flex; flex-wrap:wrap; gap:10px; width:100%; margin-bottom:8px;">
							<div style="flex:1 1 200px; min-width:0;">
								<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">Support Email</label>
								<input type="email" name="contact_email" value="<?php echo esc_attr( $s['contact_email'] ); ?>" class="regular-text" style="width:100%;" />
							</div>
							<div style="flex:1 1 200px; min-width:0;">
								<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">Phone Number</label>
								<input type="text" name="contact_phone" value="<?php echo esc_attr( $s['contact_phone'] ); ?>" class="regular-text" style="width:100%;" />
							</div>
						</div>
						<div>
							<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">Office / Temple Address</label>
							<input type="text" name="contact_address" value="<?php echo esc_attr( $s['contact_address'] ); ?>" class="large-text" style="width:100%;" />
						</div>
					</td>
				</tr>
				<tr>
					<th>Privacy Policy & Terms URLs</th>
					<td>
						<div style="display:flex; flex-wrap:wrap; gap:10px; width:100%;">
							<div style="flex:1 1 220px; min-width:0;">
								<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">Privacy Policy URL</label>
								<input type="url" name="privacy_policy_url" value="<?php echo esc_attr( $s['privacy_policy_url'] ); ?>" class="regular-text" placeholder="https://yourdomain.com/privacy" style="width:100%;" />
							</div>
							<div style="flex:1 1 220px; min-width:0;">
								<label style="font-size:11px; color:#64748b; font-weight:600; display:block; margin-bottom:3px;">Terms of Service URL</label>
								<input type="url" name="terms_url" value="<?php echo esc_attr( $s['terms_url'] ); ?>" class="regular-text" placeholder="https://yourdomain.com/terms" style="width:100%;" />
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<th>Maintenance Mode</th>
					<td>
						<label><input type="checkbox" name="maintenance_mode" value="1" <?php checked( $s['maintenance_mode'], 1 ); ?> /> Enable Maintenance Mode</label><br/><br/>
						<textarea name="maintenance_message" rows="2" class="large-text"><?php echo esc_textarea( $s['maintenance_message'] ); ?></textarea>
					</td>
				</tr>
				<tr>
					<th>Feature Enable / Disable Controls</th>
					<td>
						<label><input type="checkbox" name="enable_panchang" value="1" <?php checked( $s['enable_panchang'], 1 ); ?> /> Panchang (पंचांग)</label><br/>
						<label><input type="checkbox" name="enable_kundli" value="1" <?php checked( $s['enable_kundli'], 1 ); ?> /> Kundli Generator (जन्मकुंडली)</label><br/>
						<label><input type="checkbox" name="enable_milan" value="1" <?php checked( $s['enable_milan'], 1 ); ?> /> Kundli Milan (कुंडली मिलान)</label><br/>
						<label><input type="checkbox" name="enable_rashifal" value="1" <?php checked( $s['enable_rashifal'], 1 ); ?> /> Rashifal (राशिफल)</label><br/>
						<label><input type="checkbox" name="enable_gochar" value="1" <?php checked( $s['enable_gochar'], 1 ); ?> /> Grah Gochar (ग्रह गोचर)</label><br/>
						<label><input type="checkbox" name="enable_tyohar" value="1" <?php checked( $s['enable_tyohar'], 1 ); ?> /> Vrat & Tyohar (त्योहार)</label><br/>
						<label><input type="checkbox" name="enable_calculators" value="1" <?php checked( $s['enable_calculators'], 1 ); ?> /> Jyotish Calculators (ज्योतिष कैलकुलेटर)</label><br/>
						<label><input type="checkbox" name="enable_dharma" value="1" <?php checked( $s['enable_dharma'], 1 ); ?> /> Sanatan Dharma & Mala (सनातन धर्म व जप माला)</label><br/>
						<label><input type="checkbox" name="enable_sankalp" value="1" <?php checked( $s['enable_sankalp'], 1 ); ?> /> Sankalp Mantra (संकल्प मंत्र)</label><br/>
						<label><input type="checkbox" name="enable_pandit_chat" value="1" <?php checked( $s['enable_pandit_chat'], 1 ); ?> /> Pandit Consultation (आचार्य परामर्श)</label><br/>
						<label><input type="checkbox" name="enable_articles" value="1" <?php checked( $s['enable_articles'], 1 ); ?> /> Blog Articles (ज्योतिष लेख)</label><br/>
						<label><input type="checkbox" name="enable_gallery" value="1" <?php checked( $s['enable_gallery'], 1 ); ?> /> Puja Photo Gallery (गैलरी)</label><br/>
						<label><input type="checkbox" name="enable_reviews" value="1" <?php checked( $s['enable_reviews'], 1 ); ?> /> User Reviews (समीक्षाएं)</label><br/>
						<label><input type="checkbox" name="enable_banners" value="1" <?php checked( $s['enable_banners'], 1 ); ?> /> Home Screen Banners Carousel (होम स्क्रीन बैनर स्लाइडर)</label><br/>
						<label><input type="checkbox" name="enable_gyan" value="1" <?php checked( ! empty( $s['enable_gyan'] ), true ); ?> /> Knowledge & Shastra Library (ज्ञान विभाग — वेद, उपनिषद, गीता, पुराण)</label><br/>
						<label><input type="checkbox" name="enable_puja_vidhi" value="1" <?php checked( ! empty( $s['enable_puja_vidhi'] ), true ); ?> /> Puja & Karmakand Guide (पूजा एवं कर्मकांड विधि — 19 श्रेणियां)</label><br/>
						<label><input type="checkbox" name="enable_sanskrit" value="1" <?php checked( ! empty( $s['enable_sanskrit'] ), true ); ?> /> Sanskrit Learning Course (संस्कृत शिक्षा पाठ्यक्रम — 4 स्तर)</label><br/>
						<label><input type="checkbox" name="enable_temples" value="1" <?php checked( ! empty( $s['enable_temples'] ), true ); ?> /> Temples & Tirtha Directory (मंदिर एवं तीर्थ डायरेक्टरी)</label><br/>
						<label><input type="checkbox" name="enable_puja_booking" value="1" <?php checked( ! empty( $s['enable_puja_booking'] ), true ); ?> /> Yajman Puja Booking (यजमान पूजा एवं अनुष्ठान बुकिंग)</label><br/>
						<label><input type="checkbox" name="enable_personal_library" value="1" <?php checked( ! empty( $s['enable_personal_library'] ), true ); ?> /> Personal Library & Bookmarks (मेरा पुस्तकालय एवं पठन इतिहास)</label><br/>
						<label><input type="checkbox" name="enable_support_tickets" value="1" <?php checked( ! empty( $s['enable_support_tickets'] ), true ); ?> /> Help & Support Center (सहायता केंद्र एवं शिकायत टिकट)</label>
					</td>
				</tr>
				<tr>
					<th>Home Screen Section Order</th>
					<td><input type="text" name="home_sections_order" value="<?php echo esc_attr( $s['home_sections_order'] ); ?>" class="large-text" /></td>
				</tr>
			</table>
			<p><button type="submit" class="button jw-btn-primary">Save App Settings</button></p>
		</form>
	</div>
</div>
