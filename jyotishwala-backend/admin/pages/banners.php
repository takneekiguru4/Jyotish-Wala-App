<?php
/**
 * 6. Home Screen & Banners Management (admin/pages/banners.php)
 *
 * - Clean, valid HTML5 card forms for each Home Screen Slide/Banner (no invalid <form> inside <tr>)
 * - Auto-seeds the 5 default Home Screen Banners if empty
 * - Full WordPress Media Library image upload support
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

global $wpdb;
$t_banners = JW_Database::table( 'banners' );

// Ensure default 5 banners exist ONLY on initial installation
$initial_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_banners}" ); // phpcs:ignore
if ( 0 === $initial_count && ! get_option( 'jw_v130_defaults_seeded', false ) ) {
	JW_Database::seed_initial_data();
	update_option( 'jw_v130_defaults_seeded', '1' );
}

$notice = '';
$app_settings = JW_Settings::get_app_settings();

if ( JW_Permissions::verify_admin_action( 'jw_banners_action', 'jw_banners_nonce' ) ) {
	$sub = sanitize_key( wp_unslash( $_POST['jw_sub_action'] ?? '' ) );

	if ( 'toggle_banners_module' === $sub ) {
		$app_settings['enable_banners'] = ! empty( $_POST['enable_banners'] ) ? 1 : 0;
		update_option( 'jw_app_settings', $app_settings );
		JW_Logging::log( 'admin', 'info', 'Home screen banners module toggled to: ' . $app_settings['enable_banners'] );
		$notice = 'Home Screen Banners module setting saved successfully.';
	}

	if ( 'save_banner' === $sub ) {
		$banner_id = absint( $_POST['banner_id'] ?? 0 );
		$row_data  = array(
			'badge'         => sanitize_text_field( wp_unslash( $_POST['badge'] ?? '' ) ),
			'title'         => sanitize_text_field( wp_unslash( $_POST['title'] ?? '' ) ),
			'subtitle'      => sanitize_textarea_field( wp_unslash( $_POST['subtitle'] ?? '' ) ),
			'cta_text'      => sanitize_text_field( wp_unslash( $_POST['cta_text'] ?? 'अभी देखें' ) ),
			'target_page'   => sanitize_key( wp_unslash( $_POST['target_page'] ?? 'kundli' ) ),
			'bg_theme'      => sanitize_key( wp_unslash( $_POST['bg_theme'] ?? 'teal' ) ),
			'bg_image_url'  => esc_url_raw( wp_unslash( $_POST['bg_image_url'] ?? '' ) ),
			'display_order' => max( 1, absint( $_POST['display_order'] ?? 1 ) ),
			'is_enabled'    => ! empty( $_POST['is_enabled'] ) ? 1 : 0,
			'updated_at'    => current_time( 'mysql' ),
		);

		if ( $banner_id > 0 ) {
			$wpdb->update( $t_banners, $row_data, array( 'id' => $banner_id ) );
			$notice = 'Home screen banner "' . $row_data['title'] . '" updated successfully.';
		} else {
			$row_data['slide_uid'] = 'slide_' . uniqid();
			$wpdb->insert( $t_banners, $row_data );
			$notice = 'New home screen banner added.';
		}
	}

	if ( 'delete_banner' === $sub ) {
		$banner_id = absint( $_POST['banner_id'] ?? 0 );
		if ( $banner_id > 0 ) {
			$wpdb->delete( $t_banners, array( 'id' => $banner_id ) );
			$notice = 'Home screen banner deleted.';
		}
	}

	if ( 'bulk_delete_banners' === $sub ) {
		$selected_ids = array_map( 'absint', (array) ( $_POST['selected_banners'] ?? array() ) );
		$selected_ids = array_filter( $selected_ids );
		if ( ! empty( $selected_ids ) ) {
			$placeholders = implode( ',', array_fill( 0, count( $selected_ids ), '%d' ) );
			$wpdb->query( $wpdb->prepare( "DELETE FROM {$t_banners} WHERE id IN ($placeholders)", ...$selected_ids ) ); // phpcs:ignore
			JW_Logging::log( 'admin', 'info', 'Bulk deleted ' . count( $selected_ids ) . ' banners.' );
			$notice = count( $selected_ids ) . ' banner slide(s) deleted successfully.';
		}
	}
}

$banners = $wpdb->get_results( "SELECT * FROM {$t_banners} ORDER BY display_order ASC, id ASC", ARRAY_A ); // phpcs:ignore
$target_options = array(
	'kundli'      => 'Kundli Generator (जन्मकुंडली)',
	'panchang'    => 'Daily Panchang (दैनिक पंचांग)',
	'milan'       => 'Kundli Milan (कुंडली मिलान)',
	'chat'        => 'Talk to Pandit (पंडित परामर्श)',
	'rashifal'    => 'Rashifal (राशिफल)',
	'tyohar'      => 'Vrat & Tyohar (त्योहार)',
	'dharma'      => 'Sanatan Dharma & Mala (सनातन धर्म)',
	'sankalp'     => 'Sankalp Mantra (संकल्प मंत्र)',
	'calculators' => 'Calculators (ज्योतिष कैलकुलेटर)',
	'gallery'     => 'Puja Gallery (पूजा गैलरी)',
	'articles'    => 'Articles (ज्योतिष लेख)',
);
$theme_options = array(
	'teal'    => 'Teal (#008080)',
	'saffron' => 'Saffron (#FF7F33)',
	'dark'    => 'Deep Slate (#112226)',
	'emerald' => 'Emerald Green',
	'indigo'  => 'Royal Indigo',
);
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-banners',
		'Home Screen Banners & Promotional Slides',
		'ऐप के होम पेज पर सबसे ऊपर दिखने वाले स्लाइडर बैनर, शीर्षक, बटन और बैकग्राउंड फोटो यहाँ से बदलें या नए बैनर जोड़ें।'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-success is-dismissible"><p><strong><?php echo esc_html( $notice ); ?></strong></p></div>
	<?php endif; ?>

	<!-- 0. Module Enable / Disable Toggle Card -->
	<div class="jw-card" style="margin-bottom:20px;border-left:4px solid #008080;">
		<form method="post" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
			<?php wp_nonce_field( 'jw_banners_action', 'jw_banners_nonce' ); ?>
			<input type="hidden" name="jw_sub_action" value="toggle_banners_module" />
			<div>
				<h3 style="margin:0 0 4px 0 !important;border:none;padding:0;">Home Screen Banners Carousel (होम स्क्रीन बैनर चालू / बंद करें)</h3>
				<p style="margin:0;color:#64748b;font-size:13px;">ऐप के होम स्क्रीन पर सबसे ऊपर दिखने वाले स्लाइडर बैनर को चालू या बंद करें। बंद करने पर ऐप में बैनर नहीं दिखेगा।</p>
			</div>
			<div style="display:flex;align-items:center;gap:12px;">
				<label style="font-weight:700;font-size:14px;cursor:pointer;">
					<input type="checkbox" name="enable_banners" value="1" <?php checked( ! empty( $app_settings['enable_banners'] ), true ); ?> />
					होम स्क्रीन पर बैनर चालू रखें (Enable Banners)
				</label>
				<button type="submit" class="button jw-btn-primary">Save Toggle</button>
			</div>
		</form>
	</div>

	<!-- 1. Add New Banner Slide -->
	<div class="jw-card">
		<h3>नया होम स्क्रीन बैनर / स्लाइड जोड़ें (Add New Banner Slide)</h3>
		<form method="post">
			<?php wp_nonce_field( 'jw_banners_action', 'jw_banners_nonce' ); ?>
			<input type="hidden" name="jw_sub_action" value="save_banner" />

			<div class="jw-grid-3">
				<div class="jw-field-group">
					<label>छोटा बैज (Top Badge) *</label>
					<input type="text" name="badge" placeholder="वैदिक जन्मकुंडली एवं लग्न चक्र" required class="regular-text" />
				</div>
				<div class="jw-field-group">
					<label>मुख्य शीर्षक (Main Title) *</label>
					<input type="text" name="title" placeholder="निःशुल्क विस्तृत जन्मकुंडली व ग्रह विश्लेषण" required class="regular-text" />
				</div>
				<div class="jw-field-group">
					<label>बटन का नाम (Button Text) *</label>
					<input type="text" name="cta_text" value="कुंडली बनाएं" required class="regular-text" />
				</div>
			</div>

			<div class="jw-field-group">
				<label>उप-शीर्षक विवरण (Subtitle Description) *</label>
				<input type="text" name="subtitle" placeholder="जन्म तिथि, समय और स्थान से सटीक लग्न कुंडली व दशा प्राप्त करें।" required class="large-text" />
			</div>

			<div class="jw-grid-3">
				<div class="jw-field-group">
					<label>बटन क्लिक पर कौन सा पेज खुले? (Target Screen)</label>
					<select name="target_page">
						<?php foreach ( $target_options as $t_key => $t_lbl ) : ?>
							<option value="<?php echo esc_attr( $t_key ); ?>"><?php echo esc_html( $t_lbl ); ?></option>
						<?php endforeach; ?>
					</select>
				</div>
				<div class="jw-field-group">
					<label>कार्ड थीम रंग (Theme Color)</label>
					<select name="bg_theme">
						<?php foreach ( $theme_options as $th_key => $th_lbl ) : ?>
							<option value="<?php echo esc_attr( $th_key ); ?>"><?php echo esc_html( $th_lbl ); ?></option>
						<?php endforeach; ?>
					</select>
				</div>
				<div class="jw-field-group">
					<label>क्रम संख्या (Display Order)</label>
					<input type="number" name="display_order" value="<?php echo esc_attr( count( $banners ) + 1 ); ?>" min="1" class="regular-text" />
				</div>
			</div>

			<div class="jw-field-group">
				<label>बैकग्राउंड फोटो URL (Background Image URL)</label>
				<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
					<div style="flex:1 1 260px;">
						<input type="url" id="jw_new_banner_bg" name="bg_image_url" placeholder="https://..." class="regular-text" />
					</div>
					<button type="button" class="button jw-media-upload-btn" data-input="#jw_new_banner_bg">Upload / Choose Image</button>
				</div>
			</div>

			<p>
				<label><input type="checkbox" name="is_enabled" value="1" checked /> ऐप में दिखाएं (Enabled)</label>
			</p>
			<p><button type="submit" class="button jw-btn-primary">Add Banner Slide</button></p>
		</form>
	</div>

	<!-- 2. Existing Home Screen Banners (Clean Valid Card Forms) -->
	<div class="jw-card">
		<form method="post" id="jw-bulk-banners-form" onsubmit="return confirm('Delete selected banner slide(s)?');">
			<?php wp_nonce_field( 'jw_banners_action', 'jw_banners_nonce' ); ?>
			<input type="hidden" name="jw_sub_action" value="bulk_delete_banners" />

			<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
				<h3 style="margin:0 !important;border:none;padding:0;">मौजूदा होम स्क्रीन बैनर / स्लाइड्स (<?php echo count( $banners ); ?>)</h3>
				<div style="display:flex;align-items:center;gap:12px;">
					<label style="font-size:13px;font-weight:600;cursor:pointer;">
						<input type="checkbox" id="jw-select-all-banners" onclick="document.querySelectorAll('.jw-banner-cb').forEach(c=>c.checked=this.checked);" /> सभी चुनें (Select All)
					</label>
					<button type="submit" class="button button-secondary" style="color:#b32d2e;">Delete Selected</button>
				</div>
			</div>
		</form>
		<div class="jw-item-grid">
			<?php foreach ( $banners as $b ) : ?>
				<?php $bg_input_id = 'jw_banner_bg_' . (int) $b['id']; ?>
				<div class="jw-item-card <?php echo $b['is_enabled'] ? '' : 'jw-border-saffron'; ?>">
					<div class="jw-item-header">
						<label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;">
							<input type="checkbox" name="selected_banners[]" value="<?php echo esc_attr( $b['id'] ); ?>" form="jw-bulk-banners-form" class="jw-banner-cb" />
							<span class="jw-badge jw-badge-teal">Slide #<?php echo esc_html( $b['display_order'] ); ?></span>
						</label>
						<span class="jw-badge <?php echo $b['is_enabled'] ? 'jw-badge-green' : 'jw-badge-red'; ?>">
							<?php echo $b['is_enabled'] ? 'Active in App' : 'Hidden'; ?>
						</span>
					</div>

					<form method="post">
						<?php wp_nonce_field( 'jw_banners_action', 'jw_banners_nonce' ); ?>
						<input type="hidden" name="jw_sub_action" value="save_banner" />
						<input type="hidden" name="banner_id" value="<?php echo esc_attr( $b['id'] ); ?>" />

						<div class="jw-field-group">
							<label>बैज (Badge)</label>
							<input type="text" name="badge" value="<?php echo esc_attr( $b['badge'] ); ?>" required class="regular-text" />
						</div>

						<div class="jw-field-group">
							<label>शीर्षक (Title)</label>
							<input type="text" name="title" value="<?php echo esc_attr( $b['title'] ); ?>" required class="regular-text" />
						</div>

						<div class="jw-field-group">
							<label>विवरण (Subtitle)</label>
							<textarea name="subtitle" rows="2" required class="large-text"><?php echo esc_textarea( $b['subtitle'] ); ?></textarea>
						</div>

						<div class="jw-grid-2">
							<div class="jw-field-group">
								<label>बटन टेक्स्ट (Button Text)</label>
								<input type="text" name="cta_text" value="<?php echo esc_attr( $b['cta_text'] ); ?>" required class="regular-text" />
							</div>
							<div class="jw-field-group">
								<label>Target Screen</label>
								<select name="target_page">
									<?php foreach ( $target_options as $t_key => $t_lbl ) : ?>
										<option value="<?php echo esc_attr( $t_key ); ?>" <?php selected( $b['target_page'], $t_key ); ?>><?php echo esc_html( $t_lbl ); ?></option>
									<?php endforeach; ?>
								</select>
							</div>
						</div>

						<div class="jw-grid-2">
							<div class="jw-field-group">
								<label>Theme Color</label>
								<select name="bg_theme">
									<?php foreach ( $theme_options as $th_key => $th_lbl ) : ?>
										<option value="<?php echo esc_attr( $th_key ); ?>" <?php selected( $b['bg_theme'], $th_key ); ?>><?php echo esc_html( $th_lbl ); ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="jw-field-group">
								<label>Order (क्रम)</label>
								<input type="number" name="display_order" value="<?php echo esc_attr( $b['display_order'] ); ?>" min="1" class="regular-text" />
							</div>
						</div>

						<div class="jw-field-group">
							<label>Background Image URL</label>
							<input type="url" id="<?php echo esc_attr( $bg_input_id ); ?>" name="bg_image_url" value="<?php echo esc_attr( $b['bg_image_url'] ); ?>" class="regular-text" />
							<button type="button" class="button button-small jw-media-upload-btn" style="margin-top:4px;" data-input="#<?php echo esc_attr( $bg_input_id ); ?>">Choose Media</button>
						</div>

						<div class="jw-actions-row">
							<label style="font-weight:700;cursor:pointer;">
								<input type="checkbox" name="is_enabled" value="1" <?php checked( $b['is_enabled'], 1 ); ?> />
								Enabled (दिखाएं)
							</label>
							<button type="submit" class="button jw-btn-primary">Save Changes</button>
						</div>
					</form>

					<form method="post" style="margin-top:8px;text-align:right;" onsubmit="return confirm('Delete this banner slide?');">
						<?php wp_nonce_field( 'jw_banners_action', 'jw_banners_nonce' ); ?>
						<input type="hidden" name="jw_sub_action" value="delete_banner" />
						<input type="hidden" name="banner_id" value="<?php echo esc_attr( $b['id'] ); ?>" />
						<button type="submit" class="button button-link-delete">Delete Slide</button>
					</form>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>
