<?php
/**
 * 4. Kundli & Jyotish Management Page (admin/pages/kundli.php)
 *
 * Configures Ayanamsha, House System, Planetary Nodes, Rashi/Bhava/Navamsha charts,
 * Vimshottari Dasha, Ashtakoot 36-Guna Matching threshold, and monitors calculation logs.
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

$notice = '';
if ( JW_Permissions::verify_admin_action( 'jw_kundli_action', 'jw_kundli_nonce' ) ) {
	$updated = array(
		'calculation_engine'       => sanitize_key( wp_unslash( $_POST['calculation_engine'] ?? 'built_in_lahiri' ) ),
		'ayanamsha'                => sanitize_key( wp_unslash( $_POST['ayanamsha'] ?? 'lahiri' ) ),
		'house_system'             => sanitize_key( wp_unslash( $_POST['house_system'] ?? 'whole_sign_equal' ) ),
		'chart_style_default'      => sanitize_key( wp_unslash( $_POST['chart_style_default'] ?? 'north_indian' ) ),
		'node_type'                => sanitize_key( wp_unslash( $_POST['node_type'] ?? 'mean_node' ) ),
		'dasha_system'             => sanitize_key( wp_unslash( $_POST['dasha_system'] ?? 'vimshottari_120' ) ),
		'dasha_year_length_days'   => (float) ( $_POST['dasha_year_length_days'] ?? 365.25 ),
		'enable_navamsha_d9'       => ! empty( $_POST['enable_navamsha_d9'] ) ? 1 : 0,
		'enable_chandra_chart'     => ! empty( $_POST['enable_chandra_chart'] ) ? 1 : 0,
		'enable_avakahada'         => ! empty( $_POST['enable_avakahada'] ) ? 1 : 0,
		'enable_ashtakoot_milan'   => ! empty( $_POST['enable_ashtakoot_milan'] ) ? 1 : 0,
		'enable_manglik_check'     => ! empty( $_POST['enable_manglik_check'] ) ? 1 : 0,
		'minimum_recommended_guna' => (float) ( $_POST['minimum_recommended_guna'] ?? 18 ),
	);
	update_option( 'jw_kundli_settings', $updated );
	JW_Logging::log( 'kundli', 'info', 'Kundli & Jyotish calculation settings updated.' );
	$notice = 'Kundli & Jyotish calculation settings saved.';
}

$k_settings = JW_Settings::get_kundli_settings();
$k_logs     = JW_Logging::get_logs( 'kundli', 20 );
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-kundli',
		'Kundli & Jyotish Calculation Management',
		'Configure Ayanamsha, House System, Planetary Nodes, Vimshottari Dasha, and Ashtakoot Matching.'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $notice ); ?></p></div>
	<?php endif; ?>

	<div class="jw-grid-2">
		<div class="jw-card">
			<h3>Kundli & Matching Calculation Preferences</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_kundli_action', 'jw_kundli_nonce' ); ?>
				<table class="form-table">
					<tr>
						<th>Calculation Engine</th>
						<td>
							<select name="calculation_engine">
								<option value="built_in_lahiri" <?php selected( $k_settings['calculation_engine'], 'built_in_lahiri' ); ?>>Built-in Astronomical Ephemeris Engine</option>
								<option value="external_api" <?php selected( $k_settings['calculation_engine'], 'external_api' ); ?>>External Horoscope API (Configured in API Vault)</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Ayanamsha Setting</th>
						<td>
							<select name="ayanamsha">
								<option value="lahiri" <?php selected( $k_settings['ayanamsha'], 'lahiri' ); ?>>Lahiri Chitra Paksha (Default Vedic)</option>
								<option value="raman" <?php selected( $k_settings['ayanamsha'], 'raman' ); ?>>B.V. Raman Ayanamsha</option>
								<option value="kp" <?php selected( $k_settings['ayanamsha'], 'kp' ); ?>>Krishnamurti Paddhati (KP)</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Bhava / House System</th>
						<td>
							<select name="house_system">
								<option value="whole_sign_equal" <?php selected( $k_settings['house_system'], 'whole_sign_equal' ); ?>>Whole-Sign / Equal Bhava (Parashari)</option>
								<option value="sripati" <?php selected( $k_settings['house_system'], 'sripati' ); ?>>Sripati Paddhati</option>
								<option value="placidus" <?php selected( $k_settings['house_system'], 'placidus' ); ?>>KP Placidus</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Default Chart Style</th>
						<td>
							<select name="chart_style_default">
								<option value="north_indian" <?php selected( $k_settings['chart_style_default'], 'north_indian' ); ?>>North Indian Diamond Chart</option>
								<option value="south_indian" <?php selected( $k_settings['chart_style_default'], 'south_indian' ); ?>>South Indian Square Chart</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Rahu / Ketu Node Calculation</th>
						<td>
							<select name="node_type">
								<option value="mean_node" <?php selected( $k_settings['node_type'], 'mean_node' ); ?>>Mean Node (मध्यम राहु-केतु)</option>
								<option value="true_node" <?php selected( $k_settings['node_type'], 'true_node' ); ?>>True Node (स्पष्ट राहु-केतु)</option>
							</select>
						</td>
					</tr>
					<tr>
						<th>Vimshottari Dasha Year Length</th>
						<td>
							<input type="number" step="0.01" name="dasha_year_length_days" value="<?php echo esc_attr( $k_settings['dasha_year_length_days'] ); ?>" style="width:110px;" /> days (365.25 Solar / 360 Savana)
						</td>
					</tr>
					<tr>
						<th>Minimum Recommended Gunas (Out of 36)</th>
						<td>
							<input type="number" step="0.5" min="1" max="36" name="minimum_recommended_guna" value="<?php echo esc_attr( $k_settings['minimum_recommended_guna'] ); ?>" style="width:90px;" /> Gunas
						</td>
					</tr>
					<tr>
						<th>Chart & Matching Modules</th>
						<td>
							<label><input type="checkbox" name="enable_navamsha_d9" value="1" <?php checked( $k_settings['enable_navamsha_d9'], 1 ); ?> /> Enable Navamsha (D9) Chart</label><br/>
							<label><input type="checkbox" name="enable_chandra_chart" value="1" <?php checked( $k_settings['enable_chandra_chart'], 1 ); ?> /> Enable Chandra (Moon) Chart</label><br/>
							<label><input type="checkbox" name="enable_avakahada" value="1" <?php checked( $k_settings['enable_avakahada'], 1 ); ?> /> Enable Avakahada Chakra</label><br/>
							<label><input type="checkbox" name="enable_ashtakoot_milan" value="1" <?php checked( $k_settings['enable_ashtakoot_milan'], 1 ); ?> /> Enable 36-Guna Ashtakoot Matching</label><br/>
							<label><input type="checkbox" name="enable_manglik_check" value="1" <?php checked( $k_settings['enable_manglik_check'], 1 ); ?> /> Enable Manglik Dosha Analysis</label>
						</td>
					</tr>
				</table>
				<p><button type="submit" class="button jw-btn-primary">Save Kundli & Jyotish Settings</button></p>
			</form>
		</div>

		<div class="jw-card">
			<h3>Kundli Calculation Logs & Monitoring</h3>
			<table class="jw-table">
				<thead>
					<tr>
						<th>Timestamp</th>
						<th>Severity</th>
						<th>Calculation Event</th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $k_logs ) ) : ?>
						<tr><td colspan="3">No Kundli calculations logged yet.</td></tr>
					<?php else : ?>
						<?php foreach ( $k_logs as $kl ) : ?>
							<tr>
								<td><?php echo esc_html( $kl['created_at'] ); ?></td>
								<td><?php echo esc_html( strtoupper( $kl['severity'] ) ); ?></td>
								<td><?php echo esc_html( $kl['message'] ); ?></td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	</div>
</div>
