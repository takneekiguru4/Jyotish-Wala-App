<?php
/**
 * 3. Panchang Management Page (admin/pages/panchang.php)
 *
 * - Default Location: Rishikesh, Uttarakhand, India (30.0869°N, 78.2676°E)
 * - Time zone: Asia/Kolkata
 * - Tithi, Vara, Nakshatra, Yoga, Karana, Sunrise/Sunset, Rahu Kaal, Yamaganda, Gulika toggles
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

$notice = '';
if ( JW_Permissions::verify_admin_action( 'jw_panchang_action', 'jw_panchang_nonce' ) ) {
	$updated = array(
		'default_city_name'      => sanitize_text_field( wp_unslash( $_POST['default_city_name'] ?? 'ऋषिकेश (Rishikesh), उत्तराखंड, भारत' ) ),
		'default_latitude'       => (float) ( $_POST['default_latitude'] ?? 30.0869 ),
		'default_longitude'      => (float) ( $_POST['default_longitude'] ?? 78.2676 ),
		'default_timezone'       => sanitize_text_field( wp_unslash( $_POST['default_timezone'] ?? 'Asia/Kolkata' ) ),
		'calculation_provider'   => sanitize_key( wp_unslash( $_POST['calculation_provider'] ?? 'built_in_siddhantic' ) ),
		'panchang_paksha_system' => sanitize_key( wp_unslash( $_POST['panchang_paksha_system'] ?? 'purnimanta' ) ),
		'ayanamsha_type'         => sanitize_key( wp_unslash( $_POST['ayanamsha_type'] ?? 'lahiri_chitra_paksha' ) ),
		'show_tithi'             => ! empty( $_POST['show_tithi'] ) ? 1 : 0,
		'show_vara'              => ! empty( $_POST['show_vara'] ) ? 1 : 0,
		'show_nakshatra'         => ! empty( $_POST['show_nakshatra'] ) ? 1 : 0,
		'show_yoga'              => ! empty( $_POST['show_yoga'] ) ? 1 : 0,
		'show_karana'            => ! empty( $_POST['show_karana'] ) ? 1 : 0,
		'show_sunrise_sunset'    => ! empty( $_POST['show_sunrise_sunset'] ) ? 1 : 0,
		'show_rahu_kaal'         => ! empty( $_POST['show_rahu_kaal'] ) ? 1 : 0,
		'show_yamaganda'         => ! empty( $_POST['show_yamaganda'] ) ? 1 : 0,
		'show_gulika'            => ! empty( $_POST['show_gulika'] ) ? 1 : 0,
		'show_abhijit_muhurta'   => ! empty( $_POST['show_abhijit_muhurta'] ) ? 1 : 0,
		'show_chaughadiya'       => ! empty( $_POST['show_chaughadiya'] ) ? 1 : 0,
	);
	update_option( 'jw_panchang_settings', $updated );
	JW_Logging::log( 'panchang', 'info', 'Panchang settings updated by administrator.' );
	$notice = 'Panchang settings saved successfully.';
}

$p_settings = JW_Settings::get_panchang_settings();
$preview    = JW_Panchang_API::get_panchang();
$p_logs     = JW_Logging::get_logs( 'panchang', 15 );
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-panchang',
		'Panchang Management (Default: Rishikesh, Uttarakhand)',
		'Configure default Panchang coordinates, Asia/Kolkata timezone, calculation provider, and Panchang elements.'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $notice ); ?></p></div>
	<?php endif; ?>

	<div class="jw-grid-2">
		<div class="jw-card">
			<h3>Panchang Configuration & Default Location</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_panchang_action', 'jw_panchang_nonce' ); ?>
				<table class="form-table">
					<tr>
						<th>Default Location Name</th>
						<td><input type="text" name="default_city_name" value="<?php echo esc_attr( $p_settings['default_city_name'] ); ?>" class="regular-text" /></td>
					</tr>
					<tr>
						<th>Default Latitude & Longitude</th>
						<td>
							<input type="number" step="0.0001" name="default_latitude" value="<?php echo esc_attr( $p_settings['default_latitude'] ); ?>" style="width:120px;" /> °N
							<input type="number" step="0.0001" name="default_longitude" value="<?php echo esc_attr( $p_settings['default_longitude'] ); ?>" style="width:120px;" /> °E
						</td>
					</tr>
					<tr>
						<th>Time Zone</th>
						<td><input type="text" name="default_timezone" value="<?php echo esc_attr( $p_settings['default_timezone'] ); ?>" class="regular-text" /></td>
					</tr>
					<tr>
						<th>Calculation Provider</th>
						<td>
							<select name="calculation_provider">
								<option value="built_in_siddhantic" <?php selected( $p_settings['calculation_provider'], 'built_in_siddhantic' ); ?>>Built-in Lahiri Siddhantic Astronomical Engine</option>
								<option value="external_api" <?php selected( $p_settings['calculation_provider'], 'external_api' ); ?>>External Panchang API (Configured in API Vault)</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Lunar Month System</th>
						<td>
							<select name="panchang_paksha_system">
								<option value="purnimanta" <?php selected( $p_settings['panchang_paksha_system'], 'purnimanta' ); ?>>Purnimanta (North India / Kashi / Rishikesh)</option>
								<option value="amanta" <?php selected( $p_settings['panchang_paksha_system'], 'amanta' ); ?>>Amanta (Western / Southern India)</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Enabled Panchang Elements</th>
						<td>
							<label><input type="checkbox" name="show_tithi" value="1" <?php checked( $p_settings['show_tithi'], 1 ); ?> /> Tithi (तिथि)</label><br/>
							<label><input type="checkbox" name="show_vara" value="1" <?php checked( $p_settings['show_vara'], 1 ); ?> /> Vara (वार)</label><br/>
							<label><input type="checkbox" name="show_nakshatra" value="1" <?php checked( $p_settings['show_nakshatra'], 1 ); ?> /> Nakshatra (नक्षत्र)</label><br/>
							<label><input type="checkbox" name="show_yoga" value="1" <?php checked( $p_settings['show_yoga'], 1 ); ?> /> Yoga (योग)</label><br/>
							<label><input type="checkbox" name="show_karana" value="1" <?php checked( $p_settings['show_karana'], 1 ); ?> /> Karana (करण)</label><br/>
							<label><input type="checkbox" name="show_sunrise_sunset" value="1" <?php checked( $p_settings['show_sunrise_sunset'], 1 ); ?> /> Sunrise & Sunset (सूर्योदय / सूर्यास्त)</label><br/>
							<label><input type="checkbox" name="show_rahu_kaal" value="1" <?php checked( $p_settings['show_rahu_kaal'], 1 ); ?> /> Rahu Kaal (राहुकाल)</label><br/>
							<label><input type="checkbox" name="show_yamaganda" value="1" <?php checked( $p_settings['show_yamaganda'], 1 ); ?> /> Yamaganda (यमगण्ड)</label><br/>
							<label><input type="checkbox" name="show_gulika" value="1" <?php checked( $p_settings['show_gulika'], 1 ); ?> /> Gulika Kaal (गुलिक काल)</label><br/>
							<label><input type="checkbox" name="show_abhijit_muhurta" value="1" <?php checked( $p_settings['show_abhijit_muhurta'], 1 ); ?> /> Abhijit Muhurta (अभिजित मुहूर्त)</label><br/>
							<label><input type="checkbox" name="show_chaughadiya" value="1" <?php checked( $p_settings['show_chaughadiya'], 1 ); ?> /> Chaughadiya (चौघड़िया)</label>
						</td>
					</tr>
				</table>
				<p><button type="submit" class="button jw-btn-primary">Save Panchang Settings</button></p>
			</form>
		</div>

		<div class="jw-card">
			<h3>Live Calculation Output & Panchang Logs</h3>
			<table class="jw-table">
				<tbody>
					<tr><th>Location</th><td><?php echo esc_html( $preview['location']['name'] ); ?></td></tr>
					<tr><th>Date & Vara</th><td><?php echo esc_html( $preview['date'] . ' (' . $preview['vara'] . ')' ); ?></td></tr>
					<tr><th>Tithi & Paksha</th><td><?php echo esc_html( $preview['tithi']['name'] . ' • ' . $preview['paksha'] ); ?></td></tr>
					<tr><th>Nakshatra</th><td><?php echo esc_html( $preview['nakshatra']['name'] . ' (Pada ' . $preview['nakshatra']['pada'] . ')' ); ?></td></tr>
					<tr><th>Yoga & Karana</th><td><?php echo esc_html( $preview['yoga'] . ' • ' . $preview['karana'] ); ?></td></tr>
					<tr><th>Sunrise / Sunset</th><td><?php echo esc_html( $preview['sunrise'] . ' / ' . $preview['sunset'] ); ?></td></tr>
					<tr><th>Rahu / Yamaganda / Gulika</th><td><?php echo esc_html( $preview['rahu_kaal'] . ' | ' . $preview['yamaganda'] . ' | ' . $preview['gulika_kaal'] ); ?></td></tr>
				</tbody>
			</table>

			<h3 style="margin-top:20px;">Recent Panchang API & Calculation Logs</h3>
			<table class="jw-table">
				<thead><tr><th>Time</th><th>Severity</th><th>Message</th></tr></thead>
				<tbody>
					<?php if ( empty( $p_logs ) ) : ?>
						<tr><td colspan="3">No Panchang errors recorded.</td></tr>
					<?php else : ?>
						<?php foreach ( $p_logs as $pl ) : ?>
							<tr>
								<td><?php echo esc_html( $pl['created_at'] ); ?></td>
								<td><?php echo esc_html( $pl['severity'] ); ?></td>
								<td><?php echo esc_html( $pl['message'] ); ?></td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	</div>
</div>
