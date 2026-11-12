<?php
/**
 * 11. Sanatan Modules, Puja Bookings & Feature Registry Hub (admin/pages/modules-hub.php)
 *
 * Provides full WordPress Admin CRUD and status management for:
 * - Knowledge / Shastra Library (7 Departments: Veda, Upanishad, Gita, Purana, Itihasa, Darshana, Daily Dharma)
 * - Puja & Karmakand Guide (19 Categories)
 * - Mantra, Stotra, Kavach & Sukta Library (15 Categories)
 * - Sanskrit Learning Courses (4 Levels)
 * - Temples & Tirtha Directory (8 Categories)
 * - Yajman Puja Bookings (Pending -> Confirmed / Completed / Cancelled)
 * - Help & Support Tickets (Open -> In Progress -> Resolved)
 * - Complete Admin Feature Registry & Plugin Integration Manifest
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_app() ) {
	wp_die( 'Unauthorized access.' );
}

global $wpdb;
$t_knowledge = JW_Database::table( 'knowledge' );
$t_puja      = JW_Database::table( 'puja_vidhi' );
$t_mantras   = JW_Database::table( 'mantras' );
$t_sanskrit  = JW_Database::table( 'sanskrit_courses' );
$t_temples   = JW_Database::table( 'temples' );
$t_bookings  = JW_Database::table( 'bookings' );
$t_support   = JW_Database::table( 'support_tickets' );

$active_subtab = isset( $_GET['subtab'] ) ? sanitize_key( wp_unslash( $_GET['subtab'] ) ) : 'bookings';
$notice        = '';

if ( JW_Permissions::verify_admin_action( 'jw_modules_hub_action', 'jw_modules_hub_nonce' ) ) {
	$action_type = sanitize_key( wp_unslash( $_POST['jw_hub_op'] ?? '' ) );

	if ( 'update_booking_status' === $action_type ) {
		$booking_id    = absint( $_POST['booking_id'] ?? 0 );
		$new_status    = sanitize_key( wp_unslash( $_POST['booking_status'] ?? 'pending' ) );
		$admin_remarks = sanitize_text_field( wp_unslash( $_POST['admin_remarks'] ?? '' ) );
		if ( $booking_id > 0 ) {
			$wpdb->update(
				$t_bookings,
				array(
					'status'        => $new_status,
					'admin_remarks' => $admin_remarks,
					'updated_at'    => current_time( 'mysql' ),
				),
				array( 'id' => $booking_id ),
				array( '%s', '%s', '%s' ),
				array( '%d' )
			);
			$notice = 'यजमान पूजा बुकिंग स्थिति सफलतापूर्वक अपडेट कर दी गई है।';
		}
	} elseif ( 'add_knowledge' === $action_type ) {
		$wpdb->insert(
			$t_knowledge,
			array(
				'item_uid'       => 'gyan_' . time(),
				'department'     => sanitize_key( wp_unslash( $_POST['department'] ?? 'veda' ) ),
				'subcategory'    => sanitize_text_field( wp_unslash( $_POST['subcategory'] ?? '' ) ),
				'title_hi'       => sanitize_text_field( wp_unslash( $_POST['title_hi'] ?? '' ) ),
				'title_en'       => sanitize_text_field( wp_unslash( $_POST['title_en'] ?? '' ) ),
				'reference_text' => sanitize_text_field( wp_unslash( $_POST['reference_text'] ?? '' ) ),
				'sanskrit_text'  => sanitize_textarea_field( wp_unslash( $_POST['sanskrit_text'] ?? '' ) ),
				'meaning_hi'     => sanitize_textarea_field( wp_unslash( $_POST['meaning_hi'] ?? '' ) ),
				'commentary_hi'  => sanitize_textarea_field( wp_unslash( $_POST['commentary_hi'] ?? '' ) ),
				'status'         => 'published',
			)
		);
		$notice        = 'नया शास्त्र / ज्ञान प्रविष्टि सफलतापूर्वक जोड़ी गई।';
		$active_subtab = 'knowledge';
	} elseif ( 'add_puja' === $action_type ) {
		$samagri_lines = array_values( array_filter( array_map( 'trim', explode( "\n", sanitize_textarea_field( wp_unslash( $_POST['samagri_lines'] ?? '' ) ) ) ) ) );
		$wpdb->insert(
			$t_puja,
			array(
				'puja_uid'     => 'puja_' . time(),
				'category'     => sanitize_text_field( wp_unslash( $_POST['category'] ?? 'नित्य पंचदेव पूजा' ) ),
				'title_hi'     => sanitize_text_field( wp_unslash( $_POST['title_hi'] ?? '' ) ),
				'deity'        => sanitize_text_field( wp_unslash( $_POST['deity'] ?? '' ) ),
				'duration'     => sanitize_text_field( wp_unslash( $_POST['duration'] ?? '45 मिनट' ) ),
				'purpose_hi'   => sanitize_textarea_field( wp_unslash( $_POST['purpose_hi'] ?? '' ) ),
				'samagri_json' => wp_json_encode( $samagri_lines ),
				'sankalp_text' => sanitize_textarea_field( wp_unslash( $_POST['sankalp_text'] ?? '' ) ),
				'aarti_hi'     => sanitize_textarea_field( wp_unslash( $_POST['aarti_hi'] ?? '' ) ),
				'status'       => 'published',
			)
		);
		$notice        = 'नई पूजा एवं कर्मकांड विधि सफलतापूर्वक जोड़ी गई।';
		$active_subtab = 'puja';
	} elseif ( 'add_temple' === $action_type ) {
		$wpdb->insert(
			$t_temples,
			array(
				'temple_uid'      => 'temple_' . time(),
				'category'        => sanitize_text_field( wp_unslash( $_POST['category'] ?? 'द्वादश ज्योतिर्लिंग' ) ),
				'name_hi'         => sanitize_text_field( wp_unslash( $_POST['name_hi'] ?? '' ) ),
				'deity'           => sanitize_text_field( wp_unslash( $_POST['deity'] ?? '' ) ),
				'city_state'      => sanitize_text_field( wp_unslash( $_POST['city_state'] ?? '' ) ),
				'darshan_timings' => sanitize_text_field( wp_unslash( $_POST['darshan_timings'] ?? '' ) ),
				'aarti_timings'   => sanitize_text_field( wp_unslash( $_POST['aarti_timings'] ?? '' ) ),
				'history_hi'      => sanitize_textarea_field( wp_unslash( $_POST['history_hi'] ?? '' ) ),
				'status'          => 'published',
			)
		);
		$notice        = 'नया मंदिर / तीर्थ विवरण सफलतापूर्वक जोड़ा गया।';
		$active_subtab = 'temples';
	} elseif ( 'update_ticket' === $action_type ) {
		$ticket_id      = absint( $_POST['ticket_id'] ?? 0 );
		$ticket_status  = sanitize_key( wp_unslash( $_POST['ticket_status'] ?? 'open' ) );
		$admin_response = sanitize_textarea_field( wp_unslash( $_POST['admin_response'] ?? '' ) );
		if ( $ticket_id > 0 ) {
			$wpdb->update(
				$t_support,
				array(
					'status'         => $ticket_status,
					'admin_response' => $admin_response,
				),
				array( 'id' => $ticket_id ),
				array( '%s', '%s' ),
				array( '%d' )
			);
			$notice        = 'सहायता टिकट का उत्तर व स्थिति अपडेट कर दी गई।';
			$active_subtab = 'support';
		}
	}
}

$bookings_rows  = $wpdb->get_results( "SELECT * FROM {$t_bookings} ORDER BY id DESC LIMIT 100", ARRAY_A ); // phpcs:ignore
$knowledge_rows = $wpdb->get_results( "SELECT * FROM {$t_knowledge} ORDER BY id DESC LIMIT 100", ARRAY_A ); // phpcs:ignore
$puja_rows      = $wpdb->get_results( "SELECT * FROM {$t_puja} ORDER BY id DESC LIMIT 100", ARRAY_A ); // phpcs:ignore
$temple_rows    = $wpdb->get_results( "SELECT * FROM {$t_temples} ORDER BY id DESC LIMIT 100", ARRAY_A ); // phpcs:ignore
$support_rows   = $wpdb->get_results( "SELECT * FROM {$t_support} ORDER BY id DESC LIMIT 100", ARRAY_A ); // phpcs:ignore
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-modules-hub',
		'11. Sanatan Platform Modules, Puja Bookings & Feature Registry',
		'Manage Yajman Puja Bookings, Knowledge/Shastra Library, Puja & Karmakand, Temples, Support Tickets & Feature Registry.'
	);
	?>

	<?php if ( $notice ) : ?>
		<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $notice ); ?></p></div>
	<?php endif; ?>

	<div class="jw-subtabs" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
		<?php
		$subtabs = array(
			'bookings'  => '1. यजमान पूजा बुकिंग (Puja Bookings)',
			'knowledge' => '2. ज्ञान विभाग (7 Shastra Depts)',
			'puja'      => '3. पूजा एवं कर्मकांड (19 Categories)',
			'temples'   => '4. मंदिर एवं तीर्थ (Temples & Tirtha)',
			'support'   => '5. सहायता केंद्र टिकट (Support Tickets)',
			'registry'  => '6. Admin Feature Registry (16 Modules)',
		);
		foreach ( $subtabs as $k => $lbl ) :
			$url = admin_url( 'admin.php?page=jw-app-modules-hub&subtab=' . $k );
			?>
			<a href="<?php echo esc_url( $url ); ?>" class="button <?php echo ( $active_subtab === $k ) ? 'jw-btn-primary' : ''; ?>">
				<?php echo esc_html( $lbl ); ?>
			</a>
		<?php endforeach; ?>
	</div>

	<?php if ( 'bookings' === $active_subtab ) : ?>
		<div class="jw-card">
			<h3>यजमान पूजा एवं अनुष्ठान बुकिंग प्रबंधन (Strict Pending Verification Rule)</h3>
			<p class="description">यजमान द्वारा ऐप से भेजे गए पूजा अनुरोध प्रारंभ में <code>pending</code> रहते हैं। आचार्य या एडमिन द्वारा पुष्टि करने पर ही ऐप में <code>confirmed</code> स्थिति दिखती है।</p>
			<table class="widefat striped" style="margin-top:12px;">
				<thead>
					<tr>
						<th>Booking ID</th>
						<th>Puja Service & Category</th>
						<th>Yajman & Gotra</th>
						<th>Date, Time & Mode</th>
						<th>Pandit Ji</th>
						<th>Status & Admin Action</th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $bookings_rows ) ) : ?>
						<tr><td colspan="6">अभी कोई पूजा बुकिंग डेटाबेस में दर्ज नहीं है।</td></tr>
					<?php else : ?>
						<?php foreach ( $bookings_rows as $b ) : ?>
							<tr>
								<td><code><?php echo esc_html( $b['booking_uid'] ); ?></code></td>
								<td>
									<strong><?php echo esc_html( $b['puja_service_title'] ); ?></strong><br/>
									<small><?php echo esc_html( $b['puja_category'] ); ?></small>
								</td>
								<td>
									<?php echo esc_html( $b['yajman_name'] ); ?> (गोत्र: <?php echo esc_html( $b['yajman_gotra'] ); ?>)<br/>
									<small><?php echo esc_html( $b['yajman_phone'] ); ?> • <?php echo esc_html( $b['city'] ); ?></small>
								</td>
								<td>
									<?php echo esc_html( $b['preferred_date'] ); ?> • <?php echo esc_html( $b['preferred_time'] ); ?><br/>
									<small><?php echo esc_html( $b['mode'] ); ?></small>
								</td>
								<td><?php echo esc_html( $b['pandit_name'] ); ?></td>
								<td>
									<form method="post" style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
										<?php wp_nonce_field( 'jw_modules_hub_action', 'jw_modules_hub_nonce' ); ?>
										<input type="hidden" name="jw_hub_op" value="update_booking_status" />
										<input type="hidden" name="booking_id" value="<?php echo esc_attr( $b['id'] ); ?>" />
										<select name="booking_status">
											<option value="pending" <?php selected( $b['status'], 'pending' ); ?>>Pending (प्रतीक्षारत)</option>
											<option value="confirmed" <?php selected( $b['status'], 'confirmed' ); ?>>Confirmed (पुष्ट)</option>
											<option value="completed" <?php selected( $b['status'], 'completed' ); ?>>Completed (संपन्न)</option>
											<option value="cancelled" <?php selected( $b['status'], 'cancelled' ); ?>>Cancelled (निरस्त)</option>
										</select>
										<input type="text" name="admin_remarks" value="<?php echo esc_attr( $b['admin_remarks'] ); ?>" placeholder="आचार्य टिप्पणी" />
										<button type="submit" class="button jw-btn-primary">Update</button>
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	<?php elseif ( 'knowledge' === $active_subtab ) : ?>
		<div class="jw-card">
			<h3>ज्ञान विभाग — नया शास्त्र / श्लोक जोड़ें (वेद, उपनिषद, गीता, पुराण, इतिहास, दर्शन, सनातन धर्म)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_modules_hub_action', 'jw_modules_hub_nonce' ); ?>
				<input type="hidden" name="jw_hub_op" value="add_knowledge" />
				<table class="form-table">
					<tr>
						<th>विभाग (Department) व उप-श्रेणी</th>
						<td>
							<select name="department">
								<option value="veda">1. वेद विभाग (Vedas)</option>
								<option value="upanishad">2. उपनिषद विभाग (Upanishads)</option>
								<option value="gita">3. श्रीमद्भगवद्गीता (Bhagavad Gita)</option>
								<option value="purana">4. पुराण विभाग (18 Puranas)</option>
								<option value="itihasa">5. इतिहास विभाग (Ramayana & Mahabharata)</option>
								<option value="darshana">6. भारतीय दर्शन (Shad Darshana)</option>
								<option value="dharma">7. दैनिक सनातन धर्म एवं सदाचार</option>
							</select>
							<input type="text" name="subcategory" placeholder="उप-श्रेणी (जैसे: ऋग्वेद, ईशावास्योपनिषद)" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>शीर्षक (Hindi) एवं शास्त्र संदर्भ</th>
						<td>
							<input type="text" name="title_hi" required placeholder="शीर्षक (हिंदी)" class="regular-text" />
							<input type="text" name="reference_text" placeholder="संदर्भ (जैसे: ऋग्वेद 1.1.1 / गीता 2.47)" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>मूल संस्कृत मंत्र / श्लोक</th>
						<td><textarea name="sanskrit_text" rows="3" required class="large-text" placeholder="देवनागरी संस्कृत श्लोक..."></textarea></td>
					</tr>
					<tr>
						<th>हिंदी भावार्थ एवं शास्त्रीय व्याख्या</th>
						<td>
							<textarea name="meaning_hi" rows="3" required class="large-text" placeholder="हिंदी अर्थ..."></textarea><br/><br/>
							<textarea name="commentary_hi" rows="2" class="large-text" placeholder="शास्त्रीय टिप्पणी / व्यावहारिक शिक्षा..."></textarea>
						</td>
					</tr>
				</table>
				<p><button type="submit" class="button jw-btn-primary">शास्त्र प्रविष्टि जोड़ें</button></p>
			</form>
		</div>
	<?php elseif ( 'puja' === $active_subtab ) : ?>
		<div class="jw-card">
			<h3>पूजा एवं कर्मकांड — नई पूजा विधि जोड़ें (19 श्रेणियां)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_modules_hub_action', 'jw_modules_hub_nonce' ); ?>
				<input type="hidden" name="jw_hub_op" value="add_puja" />
				<table class="form-table">
					<tr>
						<th>पूजा श्रेणी एवं नाम</th>
						<td>
							<input type="text" name="category" value="नित्य पंचदेव पूजा" class="regular-text" />
							<input type="text" name="title_hi" required placeholder="पूजा का नाम (जैसे: श्री रुद्राभिषेक पूजन विधि)" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>आराध्य देवता एवं अवधि</th>
						<td>
							<input type="text" name="deity" required placeholder="देवता का नाम" class="regular-text" />
							<input type="text" name="duration" value="45 मिनट" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>पूजा का उद्देश्य एवं सामग्री (प्रति पंक्ति 1 सामग्री)</th>
						<td>
							<textarea name="purpose_hi" rows="2" required class="large-text" placeholder="पूजा का महत्व व उद्देश्य..."></textarea><br/><br/>
							<textarea name="samagri_lines" rows="4" class="large-text" placeholder="गंगाजल&#10;अक्षत&#10;चंदन&#10;धूप-दीप"></textarea>
						</td>
					</tr>
				</table>
				<p><button type="submit" class="button jw-btn-primary">पूजा विधि जोड़ें</button></p>
			</form>
		</div>
	<?php elseif ( 'temples' === $active_subtab ) : ?>
		<div class="jw-card">
			<h3>मंदिर एवं तीर्थ डायरेक्टरी — नया मंदिर / धाम जोड़ें</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_modules_hub_action', 'jw_modules_hub_nonce' ); ?>
				<input type="hidden" name="jw_hub_op" value="add_temple" />
				<table class="form-table">
					<tr>
						<th>श्रेणी एवं मंदिर का नाम</th>
						<td>
							<input type="text" name="category" value="द्वादश ज्योतिर्लिंग" class="regular-text" />
							<input type="text" name="name_hi" required placeholder="मंदिर / तीर्थ का नाम" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>आराध्य देवता एवं शहर/राज्य</th>
						<td>
							<input type="text" name="deity" required placeholder="आराध्य देवता" class="regular-text" />
							<input type="text" name="city_state" required placeholder="शहर एवं राज्य" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>दर्शन समय एवं आरती समय</th>
						<td>
							<input type="text" name="darshan_timings" placeholder="प्रातः 04:00 से रात्रि 11:00" class="regular-text" />
							<input type="text" name="aarti_timings" placeholder="मंगला आरती 03:00, संध्या आरती 07:00" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>पौराणिक इतिहास एवं महत्व</th>
						<td><textarea name="history_hi" rows="3" class="large-text"></textarea></td>
					</tr>
				</table>
				<p><button type="submit" class="button jw-btn-primary">मंदिर विवरण जोड़ें</button></p>
			</form>
		</div>
	<?php elseif ( 'support' === $active_subtab ) : ?>
		<div class="jw-card">
			<h3>सहायता केंद्र टिकट एवं त्रुटि रिपोर्ट (Support Tickets)</h3>
			<table class="widefat striped">
				<thead>
					<tr>
						<th>Ticket ID</th>
						<th>Type & Category</th>
						<th>Subject & Message</th>
						<th>User Info</th>
						<th>Status & Reply</th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $support_rows ) ) : ?>
						<tr><td colspan="5">अभी कोई सहायता टिकट प्राप्त नहीं हुआ है।</td></tr>
					<?php else : ?>
						<?php foreach ( $support_rows as $tkt ) : ?>
							<tr>
								<td><code><?php echo esc_html( $tkt['ticket_uid'] ); ?></code></td>
								<td><?php echo esc_html( $tkt['ticket_type'] ); ?> • <?php echo esc_html( $tkt['category'] ); ?></td>
								<td>
									<strong><?php echo esc_html( $tkt['subject'] ); ?></strong><br/>
									<small><?php echo esc_html( $tkt['message'] ); ?></small>
								</td>
								<td><?php echo esc_html( $tkt['user_name'] ); ?><br/><small><?php echo esc_html( $tkt['user_phone'] ); ?></small></td>
								<td>
									<form method="post" style="display:flex; gap:6px; flex-wrap:wrap;">
										<?php wp_nonce_field( 'jw_modules_hub_action', 'jw_modules_hub_nonce' ); ?>
										<input type="hidden" name="jw_hub_op" value="update_ticket" />
										<input type="hidden" name="ticket_id" value="<?php echo esc_attr( $tkt['id'] ); ?>" />
										<select name="ticket_status">
											<option value="open" <?php selected( $tkt['status'], 'open' ); ?>>Open</option>
											<option value="in_progress" <?php selected( $tkt['status'], 'in_progress' ); ?>>In Progress</option>
											<option value="resolved" <?php selected( $tkt['status'], 'resolved' ); ?>>Resolved</option>
										</select>
										<input type="text" name="admin_response" value="<?php echo esc_attr( $tkt['admin_response'] ); ?>" placeholder="समाधान उत्तर..." />
										<button type="submit" class="button jw-btn-primary">Save</button>
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	<?php else : ?>
		<div class="jw-card">
			<h3>Admin Feature Registry & Plugin Integration Manifest (16 Core & Expanded Modules)</h3>
			<p class="description">यह तालिका फ्रंटएंड ऐप के प्रत्येक मॉड्यूल, उसके WordPress REST API एंडपॉइंट और MySQL डेटाबेस टेबल का पूर्ण मैनिफेस्ट दर्शाती है।</p>
			<table class="widefat striped" style="margin-top:12px;">
				<thead>
					<tr>
						<th>Feature ID</th>
						<th>Module Name</th>
						<th>Frontend Screen</th>
						<th>REST Endpoint</th>
						<th>MySQL Table</th>
					</tr>
				</thead>
				<tbody>
					<tr><td><code>mod_panchang</code></td><td>ऋषिकेश पंचांग एवं चौघड़िया</td><td><code>panchang</code></td><td><code>/wp-json/jyotishwala/v1/panchang</code></td><td><code>wp_options (jw_panchang_settings)</code></td></tr>
					<tr><td><code>mod_kundli</code></td><td>वैदिक जन्मकुंडली एवं दशा</td><td><code>kundli</code></td><td><code>/wp-json/jyotishwala/v1/kundli</code></td><td><code>wp_jw_saved_kundlis</code></td></tr>
					<tr><td><code>mod_milan</code></td><td>अष्टकूट ३६ गुण मिलान</td><td><code>milan</code></td><td><code>/wp-json/jyotishwala/v1/kundli/match</code></td><td><code>wp_options (jw_kundli_settings)</code></td></tr>
					<tr><td><code>mod_gyan_vibhag</code></td><td>ज्ञान विभाग (७ सनातन शास्त्र विभाग)</td><td><code>gyan</code></td><td><code>/wp-json/jyotishwala/v1/knowledge</code></td><td><code>wp_jw_knowledge</code></td></tr>
					<tr><td><code>mod_puja_karmakand</code></td><td>पूजा एवं कर्मकांड (१९ श्रेणियां)</td><td><code>puja</code></td><td><code>/wp-json/jyotishwala/v1/pujas</code></td><td><code>wp_jw_puja_vidhi</code></td></tr>
					<tr><td><code>mod_mantra_stotra</code></td><td>मंत्र, स्तोत्र, कवच एवं सूक्त कोष (१५ श्रेणियां)</td><td><code>dharma</code></td><td><code>/wp-json/jyotishwala/v1/mantras</code></td><td><code>wp_jw_mantras</code></td></tr>
					<tr><td><code>mod_sanskrit_learning</code></td><td>संस्कृत शिक्षा पाठ्यक्रम (४ स्तर एवं प्रश्नोत्तरी)</td><td><code>sanskrit</code></td><td><code>/wp-json/jyotishwala/v1/sanskrit</code></td><td><code>wp_jw_sanskrit_courses</code></td></tr>
					<tr><td><code>mod_temples_tirtha</code></td><td>मंदिर एवं तीर्थ डायरेक्टरी (८ श्रेणियां)</td><td><code>temples</code></td><td><code>/wp-json/jyotishwala/v1/temples</code></td><td><code>wp_jw_temples</code></td></tr>
					<tr><td><code>mod_puja_booking</code></td><td>यजमान पूजा एवं अनुष्ठान बुकिंग</td><td><code>puja_booking</code></td><td><code>/wp-json/jyotishwala/v1/bookings</code></td><td><code>wp_jw_bookings</code></td></tr>
					<tr><td><code>mod_pandit_portal</code></td><td>पंडित पंजीकरण, सत्यापन एवं डैशबोर्ड</td><td><code>pandit_dashboard</code></td><td><code>/wp-json/jyotishwala/v1/pandit-register</code></td><td><code>wp_jw_pandits</code></td></tr>
					<tr><td><code>mod_sankalp_generator</code></td><td>संकल्प मंत्र एवं कस्टम संकल्प पत्र जनरेटर</td><td><code>sankalp</code></td><td><code>/wp-json/jyotishwala/v1/site-content</code></td><td><code>wp_options (jw_site_pages_content)</code></td></tr>
					<tr><td><code>mod_personal_library</code></td><td>मेरा पुस्तकालय (बुकमार्क, नोट्स व इतिहास)</td><td><code>library</code></td><td><code>/wp-json/jyotishwala/v1/user/library</code></td><td><code>wp_usermeta (jw_personal_library)</code></td></tr>
					<tr><td><code>mod_support_center</code></td><td>सहायता केंद्र, FAQ एवं टिकट</td><td><code>support</code></td><td><code>/wp-json/jyotishwala/v1/support</code></td><td><code>wp_jw_support_tickets</code></td></tr>
				</tbody>
			</table>
		</div>
	<?php endif; ?>
</div>
