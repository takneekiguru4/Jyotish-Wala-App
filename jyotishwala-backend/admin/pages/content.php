<?php
/**
 * 2. App Content, Pandits, Receipts, Rashifal, Tyohar, Gallery, Reviews & Static Pages Management
 *    (admin/pages/content.php)
 *
 * Sub-tabs:
 * - pandits  : Pandit / Astrologer Management (Add, Edit, Delete, WP Media Avatar & QR Code Upload, Dakshina, Specialties, Experience, Mobile, Email)
 * - receipts : Consultation Payment Receipts (View, Filter, Verify, Reject, Remarks, Delete, Associated App User)
 * - tyohar   : Sanatan Vrat & Tyohar Management (Add, Edit, Delete, Year & Month Filters, All 8 Detailed Festival Fields)
 * - gallery  : Puja & Sansthan Photo Gallery (Add, Edit, Delete, Single & Multi-Photo Group Albums, Category Management, Teal Card & Bottom Card Settings)
 * - sankalp  : Complete SankalpContentConfig + Desh/Kala Clauses, Steps & Benefits
 * - about    : Complete AboutUsContentConfig + Features, Statistics & Acharya Message
 * - privacy  : Complete Structured PrivacyPolicyContentConfig (Sections 1-5)
 * - rashifal : 12 Zodiac Signs x 4 Periods (Daily, Weekly, Monthly, Yearly) + WordPress Articles Integration
 * - reviews  : User Reviews Moderation (Approve, Pending, Decline/Reject, Official Reply, Delete) & Review Section Meta
 */

if ( ! defined( 'ABSPATH' ) || ! JW_Permissions::current_user_can_manage_content() ) {
	wp_die( 'Unauthorized access.' );
}

global $wpdb;
$t_rashifal = JW_Database::table( 'rashifal' );
$t_tyohar   = JW_Database::table( 'tyohar' );
$t_gallery  = JW_Database::table( 'gallery' );
$t_reviews  = JW_Database::table( 'reviews' );
$t_pandits  = JW_Database::table( 'pandits' );
$t_receipts = JW_Database::table( 'receipts' );

$active_tab = isset( $_GET['tab'] ) ? sanitize_key( wp_unslash( $_GET['tab'] ) ) : 'pandits';
$valid_tabs = array( 'pandits', 'receipts', 'tyohar', 'gallery', 'sankalp', 'about', 'privacy', 'rashifal', 'reviews' );
if ( ! in_array( $active_tab, $valid_tabs, true ) ) {
	$active_tab = 'pandits';
}

$notice      = '';
$notice_type = 'success';
$site_pages  = JW_Settings::get_site_pages_content();

// Process POST Actions with Nonce & Capability Check
if ( JW_Permissions::verify_admin_action( 'jw_content_action', 'jw_content_nonce', true ) ) {
	$sub_action = isset( $_POST['jw_sub_action'] ) ? sanitize_key( wp_unslash( $_POST['jw_sub_action'] ) ) : '';

	// =========================================================================
	// 1. CHIEF ASTROLOGER & PANDIT MANAGEMENT (SUPER ADMIN ONLY)
	// =========================================================================
	if ( 'save_chief_astrologer' === $sub_action ) {
		if ( ! JW_Permissions::current_user_can_manage_app() ) {
			$notice      = 'Only a WordPress Administrator can configure Chief Astrologer profile.';
			$notice_type = 'error';
		} else {
			$chief_data = array(
				'name'             => sanitize_text_field( wp_unslash( $_POST['chief_name'] ?? '' ) ),
				'qualification'    => sanitize_text_field( wp_unslash( $_POST['chief_qualification'] ?? 'ज्योतिषाचार्य' ) ),
				'experience_years' => max( 0, absint( $_POST['chief_experience'] ?? 20 ) ),
				'specialties'      => sanitize_textarea_field( wp_unslash( $_POST['chief_specialties'] ?? 'जन्मकुंडली विश्लेषण, कुंडली मिलान, वास्तु दोष निवारण' ) ),
				'languages'        => sanitize_text_field( wp_unslash( $_POST['chief_languages'] ?? 'हिन्दी, संस्कृत' ) ),
				'mobile'           => sanitize_text_field( wp_unslash( $_POST['chief_mobile'] ?? '' ) ),
				'email'            => sanitize_email( wp_unslash( $_POST['chief_email'] ?? '' ) ),
				'address'          => sanitize_text_field( wp_unslash( $_POST['chief_address'] ?? 'ऋषिकेश, उत्तराखंड' ) ),
				'avatar_url'       => esc_url_raw( wp_unslash( $_POST['chief_avatar_url'] ?? '' ) ),
				'qr_code_url'      => esc_url_raw( wp_unslash( $_POST['chief_qr_code_url'] ?? '' ) ),
				'dakshina_info'    => sanitize_text_field( wp_unslash( $_POST['chief_dakshina_info'] ?? 'परामर्श दक्षिणा: ₹501' ) ),
				'about'            => sanitize_textarea_field( wp_unslash( $_POST['chief_about'] ?? '' ) ),
				'display_order'    => 1,
				'is_active'        => 1,
				'updated_at'       => current_time( 'mysql' ),
			);
			if ( empty( $chief_data['name'] ) ) {
				$notice      = 'Chief Astrologer name is required.';
				$notice_type = 'error';
			} else {
				$chief_data['is_chief'] = 1;
				update_option( 'jw_chief_astrologer', $chief_data );
				// Reset existing chief flags in database
				$wpdb->query( "UPDATE {$t_pandits} SET is_chief = 0" ); // phpcs:ignore
				// Also sync or insert as top pandit in table
				$first_p = $wpdb->get_row( "SELECT id FROM {$t_pandits} WHERE is_chief = 1 OR display_order = 1 LIMIT 1", ARRAY_A ); // phpcs:ignore
				if ( $first_p ) {
					$wpdb->update( $t_pandits, $chief_data, array( 'id' => $first_p['id'] ) );
				} else {
					$chief_data['pandit_uid'] = 'chief_astrologer_1';
					$wpdb->insert( $t_pandits, $chief_data );
				}
				JW_Logging::log( 'admin', 'info', 'Updated Chief Astrologer profile: ' . $chief_data['name'] );
				$notice = 'मुख्य ज्योतिषाचार्य की प्रोफ़ाइल सफलतापूर्वक सहेज ली गई है। ऐप होम स्क्रीन पर केवल यही प्रोफ़ाइल प्रदर्शित होगी।';
			}
		}
	}

	if ( 'set_chief_pandit' === $sub_action ) {
		if ( ! JW_Permissions::current_user_can_manage_app() ) {
			$notice      = 'Only a WordPress Administrator can assign the Chief Astrologer role.';
			$notice_type = 'error';
		} else {
			$pandit_id = absint( $_POST['pandit_id'] ?? 0 );
			if ( $pandit_id > 0 ) {
				$wpdb->query( "UPDATE {$t_pandits} SET is_chief = 0" ); // phpcs:ignore
				$wpdb->update( $t_pandits, array( 'is_chief' => 1 ), array( 'id' => $pandit_id ) );
				$chief_row = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$t_pandits} WHERE id = %d", $pandit_id ), ARRAY_A );
				if ( $chief_row ) {
					update_option( 'jw_chief_astrologer', $chief_row );
				}
				JW_Logging::log( 'admin', 'info', 'Designated Chief Astrologer: ID #' . $pandit_id );
				$notice = 'पंडित जी को सफलतापूर्वक "मुख्य ज्योतिषाचार्य" बनाया गया। अब ऐप के होम स्क्रीन पर केवल यही प्रोफाइल दिखाई देगी!';
			}
		}
	}

	if ( 'save_pandit' === $sub_action ) {
		if ( ! JW_Permissions::current_user_can_manage_app() ) {
			$notice      = 'Only a WordPress Administrator can add or modify Pandit profiles and payment QR codes.';
			$notice_type = 'error';
		} else {
			$pandit_id          = absint( $_POST['pandit_id'] ?? 0 );
			$is_chief_requested = ! empty( $_POST['p_is_chief'] ) ? 1 : 0;
			$p_data             = array(
				'name'             => sanitize_text_field( wp_unslash( $_POST['p_name'] ?? '' ) ),
				'qualification'    => sanitize_text_field( wp_unslash( $_POST['p_qualification'] ?? 'ज्योतिषाचार्य' ) ),
				'experience_years' => max( 0, absint( $_POST['p_experience'] ?? 15 ) ),
				'specialties'      => sanitize_textarea_field( wp_unslash( $_POST['p_specialties'] ?? 'जन्मकुंडली विश्लेषण, कुंडली मिलान' ) ),
				'languages'        => sanitize_text_field( wp_unslash( $_POST['p_languages'] ?? 'हिन्दी, संस्कृत' ) ),
				'mobile'           => sanitize_text_field( wp_unslash( $_POST['p_mobile'] ?? '' ) ),
				'email'            => sanitize_email( wp_unslash( $_POST['p_email'] ?? '' ) ),
				'address'          => sanitize_text_field( wp_unslash( $_POST['p_address'] ?? 'ऋषिकेश, उत्तराखंड' ) ),
				'avatar_url'       => esc_url_raw( wp_unslash( $_POST['p_avatar_url'] ?? '' ) ),
				'qr_code_url'      => esc_url_raw( wp_unslash( $_POST['p_qr_code_url'] ?? '' ) ),
				'dakshina_info'    => sanitize_text_field( wp_unslash( $_POST['p_dakshina_info'] ?? 'परामर्श दक्षिणा: ₹501' ) ),
				'about'            => sanitize_textarea_field( wp_unslash( $_POST['p_about'] ?? '' ) ),
				'display_order'    => max( 1, absint( $_POST['p_display_order'] ?? 1 ) ),
				'is_chief'         => $is_chief_requested,
				'is_active'        => ! empty( $_POST['p_is_active'] ) ? 1 : 0,
				'updated_at'       => current_time( 'mysql' ),
			);

			if ( empty( $p_data['name'] ) ) {
				$notice      = 'Pandit name is required.';
				$notice_type = 'error';
			} else {
				if ( $is_chief_requested ) {
					$wpdb->query( "UPDATE {$t_pandits} SET is_chief = 0" ); // phpcs:ignore
					update_option( 'jw_chief_astrologer', $p_data );
				}
				if ( $pandit_id > 0 ) {
					$wpdb->update( $t_pandits, $p_data, array( 'id' => $pandit_id ) );
					JW_Logging::log( 'admin', 'info', 'Updated Pandit profile: ' . $p_data['name'], array( 'id' => $pandit_id ) );
					$notice = 'Pandit profile updated successfully.' . ( $is_chief_requested ? ' (Marked as Chief Astrologer for App Home)' : '' );
				} else {
					$existing_count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_pandits}" );
					if ( 0 === $existing_count ) {
						$p_data['is_chief'] = 1;
						update_option( 'jw_chief_astrologer', $p_data );
					}
					$p_data['pandit_uid'] = 'pandit_' . uniqid();
					$wpdb->insert( $t_pandits, $p_data );
					JW_Logging::log( 'admin', 'info', 'Added new Pandit profile: ' . $p_data['name'] );
					$notice = 'New Pandit profile added successfully.' . ( ! empty( $p_data['is_chief'] ) ? ' (Marked as Chief Astrologer for App Home)' : '' );
				}
			}
		}
	}

	if ( 'delete_pandit' === $sub_action ) {
		if ( ! JW_Permissions::current_user_can_manage_app() ) {
			$notice      = 'Only a WordPress Administrator can delete Pandit profiles.';
			$notice_type = 'error';
		} else {
			$pandit_id = absint( $_POST['pandit_id'] ?? 0 );
			if ( $pandit_id > 0 ) {
				$was_chief = (int) $wpdb->get_var( $wpdb->prepare( "SELECT is_chief FROM {$t_pandits} WHERE id = %d", $pandit_id ) );
				$wpdb->delete( $t_pandits, array( 'id' => $pandit_id ), array( '%d' ) );
				if ( $was_chief ) {
					$next_p = $wpdb->get_row( "SELECT * FROM {$t_pandits} ORDER BY display_order ASC, id ASC LIMIT 1", ARRAY_A );
					if ( $next_p ) {
						$wpdb->update( $t_pandits, array( 'is_chief' => 1 ), array( 'id' => $next_p['id'] ) );
						update_option( 'jw_chief_astrologer', $next_p );
					}
				}
				JW_Logging::log( 'admin', 'info', 'Deleted Pandit ID #' . $pandit_id );
				$notice = 'Pandit profile deleted.';
			}
		}
	}

	if ( 'bulk_delete_pandits' === $sub_action ) {
		if ( ! JW_Permissions::current_user_can_manage_app() ) {
			$notice      = 'Only a WordPress Administrator can delete Pandit profiles.';
			$notice_type = 'error';
		} else {
			$selected_ids = array_map( 'absint', (array) ( $_POST['selected_pandits'] ?? array() ) );
			$selected_ids = array_filter( $selected_ids );
			if ( ! empty( $selected_ids ) ) {
				$placeholders = implode( ',', array_fill( 0, count( $selected_ids ), '%d' ) );
				$wpdb->query( $wpdb->prepare( "DELETE FROM {$t_pandits} WHERE id IN ($placeholders)", ...$selected_ids ) ); // phpcs:ignore
				JW_Logging::log( 'admin', 'info', 'Bulk deleted ' . count( $selected_ids ) . ' Pandits.' );
				$notice = count( $selected_ids ) . ' Pandit profile(s) deleted successfully.';
			}
		}
	}

	// =========================================================================
	// 2. CONSULTATION PAYMENT RECEIPTS (VERIFY / REJECT / DELETE — SUPER ADMIN ONLY)
	// =========================================================================
	if ( 'update_receipt' === $sub_action ) {
		if ( ! JW_Permissions::current_user_can_manage_app() ) {
			$notice      = 'Only a WordPress Administrator can verify, reject, or delete consultation payment receipts.';
			$notice_type = 'error';
		} else {
			$rec_id     = absint( $_POST['receipt_id'] ?? 0 );
			$rec_action = sanitize_key( wp_unslash( $_POST['receipt_status'] ?? 'pending' ) );
			$remarks    = sanitize_textarea_field( wp_unslash( $_POST['admin_remarks'] ?? '' ) );
			$assoc_uid  = absint( $_POST['associated_user_id'] ?? 0 );

			if ( $rec_id > 0 ) {
				if ( 'delete' === $rec_action ) {
					$wpdb->delete( $t_receipts, array( 'id' => $rec_id ), array( '%d' ) );
					JW_Logging::log( 'admin', 'info', 'Deleted payment receipt #' . $rec_id );
					$notice = 'Payment receipt deleted permanently.';
				} elseif ( in_array( $rec_action, array( 'pending', 'verified', 'rejected' ), true ) ) {
					$update_fields = array(
						'status'        => $rec_action,
						'admin_remarks' => $remarks,
						'user_id'       => $assoc_uid,
					);
					if ( 'verified' === $rec_action || 'rejected' === $rec_action ) {
						$update_fields['verified_by'] = get_current_user_id();
						$update_fields['verified_at'] = current_time( 'mysql' );
					}
					$wpdb->update( $t_receipts, $update_fields, array( 'id' => $rec_id ) );
					JW_Logging::log( 'admin', 'info', 'Updated payment receipt #' . $rec_id . ' status to ' . $rec_action );
					$notice = 'Payment receipt #' . $rec_id . ' updated (' . strtoupper( $rec_action ) . ').';
				}
			}
		}
	}

	// =========================================================================
	// 3. TYOHAR MANAGEMENT (ADD / EDIT / DELETE + 8 DETAILED FESTIVAL SECTIONS)
	// =========================================================================
	if ( 'save_tyohar' === $sub_action ) {
		$tyo_id   = absint( $_POST['tyohar_id'] ?? 0 );
		$tyo_date = sanitize_text_field( wp_unslash( $_POST['tyo_date'] ?? gmdate( 'Y-m-d' ) ) );
		$m_parts  = explode( '-', $tyo_date );
		$m_num    = isset( $m_parts[1] ) ? max( 1, min( 12, absint( $m_parts[1] ) ) ) : 1;

		$why_celebrated = sanitize_textarea_field( wp_unslash( $_POST['tyo_why_celebrated'] ?? '' ) );
		$details_payload = array(
			'whyCelebrated'        => $why_celebrated,
			'detailedSignificance' => $why_celebrated,
			'historyAndPauranik'   => sanitize_textarea_field( wp_unslash( $_POST['tyo_history_pauranik'] ?? '' ) ),
			'pujaVidhi'            => sanitize_textarea_field( wp_unslash( $_POST['tyo_puja_vidhi'] ?? '' ) ),
			'vratAndRules'         => sanitize_textarea_field( wp_unslash( $_POST['tyo_vrat_rules'] ?? '' ) ),
			'kathaOrMantra'        => sanitize_textarea_field( wp_unslash( $_POST['tyo_katha_mantra'] ?? '' ) ),
			'sankalp'              => sanitize_textarea_field( wp_unslash( $_POST['tyo_sankalp'] ?? '' ) ),
			'doAndDonts'           => sanitize_textarea_field( wp_unslash( $_POST['tyo_do_donts'] ?? '' ) ),
			'daanAndUpay'          => sanitize_textarea_field( wp_unslash( $_POST['tyo_daan_upay'] ?? '' ) ),
		);

		$tyo_row = array(
			'name'         => sanitize_text_field( wp_unslash( $_POST['tyo_name'] ?? '' ) ),
			'tyohar_date'  => $tyo_date,
			'month_number' => $m_num,
			'vara'         => sanitize_text_field( wp_unslash( $_POST['tyo_vara'] ?? 'रविवार' ) ),
			'hindi_month'  => sanitize_text_field( wp_unslash( $_POST['tyo_month'] ?? 'कार्तिक' ) ),
			'paksha'       => sanitize_text_field( wp_unslash( $_POST['tyo_paksha'] ?? 'शुक्ल पक्ष' ) ),
			'tithi'        => sanitize_text_field( wp_unslash( $_POST['tyo_tithi'] ?? 'पूर्णिमा' ) ),
			'category'     => sanitize_text_field( wp_unslash( $_POST['tyo_category'] ?? 'प्रमुख महापर्व' ) ),
			'significance' => sanitize_textarea_field( wp_unslash( $_POST['tyo_significance'] ?? '' ) ),
			'details_json' => wp_json_encode( $details_payload ),
			'is_active'    => ! empty( $_POST['tyo_is_active'] ) ? 1 : 0,
			'updated_at'   => current_time( 'mysql' ),
		);

		if ( empty( $tyo_row['name'] ) ) {
			$notice      = 'Festival name is required.';
			$notice_type = 'error';
		} elseif ( $tyo_id > 0 ) {
			$existing_tyo = $wpdb->get_row( $wpdb->prepare( "SELECT tyohar_uid, tyohar_date FROM {$t_tyohar} WHERE id = %d", $tyo_id ), ARRAY_A );
			$deleted_uids = get_option( 'jw_deleted_tyohar_uids', array() );
			if ( ! is_array( $deleted_uids ) ) {
				$deleted_uids = array();
			}
			$uid_key  = ! empty( $existing_tyo['tyohar_uid'] ) ? sanitize_text_field( $existing_tyo['tyohar_uid'] ) : '';
			$date_key = ! empty( $tyo_row['tyohar_date'] ) ? sanitize_text_field( $tyo_row['tyohar_date'] ) : '';
			if ( 0 === (int) $tyo_row['is_active'] ) {
				if ( '' !== $uid_key ) {
					$deleted_uids[] = $uid_key;
				}
				if ( '' !== $date_key ) {
					$deleted_uids[] = $date_key;
				}
				update_option( 'jw_deleted_tyohar_uids', array_values( array_unique( $deleted_uids ) ) );
			} else {
				$deleted_uids = array_values( array_diff( $deleted_uids, array_filter( array( $uid_key, $date_key ) ) ) );
				update_option( 'jw_deleted_tyohar_uids', $deleted_uids );
			}

			$wpdb->update( $t_tyohar, $tyo_row, array( 'id' => $tyo_id ) );
			$notice = 'Tyohar "' . $tyo_row['name'] . '" and all 8 detailed sections updated successfully.';
		} else {
			$tyo_row['tyohar_uid'] = 'tyo_' . uniqid();
			$wpdb->insert( $t_tyohar, $tyo_row );
			$notice = 'New Tyohar "' . $tyo_row['name'] . '" added to database.';
		}
	}

	if ( 'delete_tyohar' === $sub_action ) {
		$tyo_id = absint( $_POST['tyohar_id'] ?? 0 );
		if ( $tyo_id > 0 ) {
			$existing_tyo = $wpdb->get_row( $wpdb->prepare( "SELECT tyohar_uid, tyohar_date, name FROM {$t_tyohar} WHERE id = %d", $tyo_id ), ARRAY_A );
			if ( $existing_tyo ) {
				$deleted_uids = get_option( 'jw_deleted_tyohar_uids', array() );
				if ( ! is_array( $deleted_uids ) ) {
					$deleted_uids = array();
				}
				if ( ! empty( $existing_tyo['tyohar_uid'] ) ) {
					$deleted_uids[] = sanitize_text_field( $existing_tyo['tyohar_uid'] );
				}
				if ( ! empty( $existing_tyo['tyohar_date'] ) ) {
					$deleted_uids[] = sanitize_text_field( $existing_tyo['tyohar_date'] );
				}
				if ( ! empty( $existing_tyo['name'] ) ) {
					$deleted_uids[] = sanitize_text_field( $existing_tyo['name'] );
				}
				update_option( 'jw_deleted_tyohar_uids', array_values( array_unique( $deleted_uids ) ) );
			}
			$wpdb->delete( $t_tyohar, array( 'id' => $tyo_id ), array( '%d' ) );
			$notice = 'Tyohar record deleted from App and Database.';
		}
	}

	if ( 'reseed_default_data' === $sub_action ) {
		update_option( 'jw_deleted_tyohar_uids', array() );
		JW_Database::seed_default_data();
		$notice = 'All default App Content (Pandits, Tyohars, Gallery, Reviews, Rashifal) synced and restored.';
	}

	// =========================================================================
	// 4. GALLERY MANAGEMENT (CATEGORIES, META, ADD / EDIT / DELETE PHOTOS & ALBUMS)
	// =========================================================================
	if ( 'save_gallery_meta' === $sub_action ) {
		$gal_meta = $site_pages['galleryMeta'];
		$gal_meta['pageTitle']                  = sanitize_text_field( wp_unslash( $_POST['gal_page_title'] ?? '' ) );
		$gal_meta['pageTagline']                = sanitize_textarea_field( wp_unslash( $_POST['gal_page_tagline'] ?? '' ) );
		$gal_meta['countBadgeText']             = sanitize_text_field( wp_unslash( $_POST['gal_count_badge'] ?? '' ) );
		$gal_meta['showTealBanner']             = ! empty( $_POST['gal_show_teal_banner'] );
		$gal_meta['organizationBannerBadge']    = sanitize_text_field( wp_unslash( $_POST['gal_org_badge'] ?? '' ) );
		$gal_meta['organizationBannerTitle']    = sanitize_text_field( wp_unslash( $_POST['gal_org_title'] ?? '' ) );
		$gal_meta['organizationBannerSubtitle'] = sanitize_textarea_field( wp_unslash( $_POST['gal_org_subtitle'] ?? '' ) );
		$gal_meta['stat1Value']                 = sanitize_text_field( wp_unslash( $_POST['gal_stat1_val'] ?? '' ) );
		$gal_meta['stat1Label']                 = sanitize_text_field( wp_unslash( $_POST['gal_stat1_lbl'] ?? '' ) );
		$gal_meta['stat2Value']                 = sanitize_text_field( wp_unslash( $_POST['gal_stat2_val'] ?? '' ) );
		$gal_meta['stat2Label']                 = sanitize_text_field( wp_unslash( $_POST['gal_stat2_lbl'] ?? '' ) );
		$gal_meta['stat3Value']                 = sanitize_text_field( wp_unslash( $_POST['gal_stat3_val'] ?? '' ) );
		$gal_meta['stat3Label']                 = sanitize_text_field( wp_unslash( $_POST['gal_stat3_lbl'] ?? '' ) );
		$gal_meta['showBottomCard']             = ! empty( $_POST['gal_show_bottom_card'] );
		$gal_meta['bottomCardTitle']            = sanitize_text_field( wp_unslash( $_POST['gal_bottom_title'] ?? '' ) );
		$gal_meta['bottomCardDescription']      = sanitize_textarea_field( wp_unslash( $_POST['gal_bottom_desc'] ?? '' ) );
		$gal_meta['bottomCardButtonText']       = sanitize_text_field( wp_unslash( $_POST['gal_bottom_btn'] ?? '' ) );

		$site_pages['galleryMeta'] = $gal_meta;
		$site_pages                = JW_Settings::get_site_pages_content( $site_pages );
		update_option( 'jw_site_pages_content', $site_pages );
		$notice = 'Gallery Page Header, Teal Banner Card & Bottom Card settings updated.';
	}

	if ( 'add_gallery_category' === $sub_action ) {
		$new_cat = sanitize_text_field( wp_unslash( $_POST['new_gallery_category'] ?? '' ) );
		if ( ! empty( $new_cat ) && ! in_array( $new_cat, $site_pages['galleryMeta']['categories'], true ) ) {
			$site_pages['galleryMeta']['categories'][] = $new_cat;
			update_option( 'jw_site_pages_content', $site_pages );
			$notice = 'Gallery category "' . $new_cat . '" added.';
		}
	}

	if ( 'rename_gallery_category' === $sub_action ) {
		$old_cat = sanitize_text_field( wp_unslash( $_POST['old_category_name'] ?? '' ) );
		$new_cat = sanitize_text_field( wp_unslash( $_POST['new_category_name'] ?? '' ) );
		if ( ! empty( $old_cat ) && ! empty( $new_cat ) && $old_cat !== $new_cat ) {
			$cats = $site_pages['galleryMeta']['categories'];
			foreach ( $cats as $idx => $c_val ) {
				if ( $c_val === $old_cat ) {
					$cats[ $idx ] = $new_cat;
				}
			}
			$site_pages['galleryMeta']['categories'] = array_values( array_unique( $cats ) );
			update_option( 'jw_site_pages_content', $site_pages );
			$wpdb->update( $t_gallery, array( 'category' => $new_cat ), array( 'category' => $old_cat ) );
			$notice = 'Category renamed from "' . $old_cat . '" to "' . $new_cat . '" across all photos.';
		}
	}

	if ( 'delete_gallery_category' === $sub_action ) {
		$del_cat = sanitize_text_field( wp_unslash( $_POST['del_category_name'] ?? '' ) );
		if ( count( $site_pages['galleryMeta']['categories'] ) > 1 ) {
			$site_pages['galleryMeta']['categories'] = array_values(
				array_filter(
					$site_pages['galleryMeta']['categories'],
					function ( $c ) use ( $del_cat ) {
						return $c !== $del_cat;
					}
				)
			);
			update_option( 'jw_site_pages_content', $site_pages );
			$notice = 'Gallery category "' . $del_cat . '" removed.';
		}
	}

	if ( 'save_gallery' === $sub_action ) {
		$gal_id     = absint( $_POST['gallery_id'] ?? 0 );
		$cover_url  = esc_url_raw( wp_unslash( $_POST['gal_image_url'] ?? '' ) );
		$group_raw  = sanitize_textarea_field( wp_unslash( $_POST['gal_group_urls'] ?? '' ) );
		$group_list = array_values( array_filter( array_map( 'esc_url_raw', array_map( 'trim', preg_split( '/[\r\n,]+/', $group_raw ) ) ) ) );

		if ( empty( $cover_url ) && ! empty( $group_list ) ) {
			$cover_url = $group_list[0];
		}
		if ( ! empty( $cover_url ) && ! empty( $group_list ) && ! in_array( $cover_url, $group_list, true ) ) {
			array_unshift( $group_list, $cover_url );
		}

		$gal_row = array(
			'title'             => sanitize_text_field( wp_unslash( $_POST['gal_title'] ?? '' ) ),
			'category'          => sanitize_text_field( wp_unslash( $_POST['gal_category'] ?? 'पूजा-पाठ व अनुष्ठान' ) ),
			'location'          => sanitize_text_field( wp_unslash( $_POST['gal_location'] ?? 'ऋषिकेश, उत्तराखंड' ) ),
			'event_date'        => sanitize_text_field( wp_unslash( $_POST['gal_date'] ?? gmdate( 'Y-m-d' ) ) ),
			'acharya_name'      => sanitize_text_field( wp_unslash( $_POST['gal_acharya_name'] ?? 'आचार्य परेश्वर भारद्वाज' ) ),
			'description'       => sanitize_textarea_field( wp_unslash( $_POST['gal_description'] ?? '' ) ),
			'image_url'         => $cover_url,
			'group_images_json' => count( $group_list ) > 1 ? wp_json_encode( $group_list ) : null,
			'is_featured'       => ! empty( $_POST['gal_featured'] ) ? 1 : 0,
			'display_order'     => max( 1, absint( $_POST['gal_display_order'] ?? 1 ) ),
		);

		if ( empty( $gal_row['title'] ) || empty( $gal_row['image_url'] ) ) {
			$notice      = 'Gallery title and at least one photo URL are required.';
			$notice_type = 'error';
		} elseif ( $gal_id > 0 ) {
			$wpdb->update( $t_gallery, $gal_row, array( 'id' => $gal_id ) );
			$notice = 'Gallery photo / album updated successfully.';
		} else {
			$gal_row['photo_uid']  = 'gal_' . uniqid();
			$gal_row['created_at'] = current_time( 'mysql' );
			$wpdb->insert( $t_gallery, $gal_row );
			$notice = count( $group_list ) > 1
				? 'Multi-photo Puja Album (' . count( $group_list ) . ' photos) added to Gallery.'
				: 'Single photo added to Gallery.';
		}
	}

	if ( 'delete_gallery' === $sub_action ) {
		$gal_id = absint( $_POST['gallery_id'] ?? 0 );
		if ( $gal_id > 0 ) {
			$wpdb->delete( $t_gallery, array( 'id' => $gal_id ), array( '%d' ) );
			$notice = 'Gallery item deleted.';
		}
	}

	// =========================================================================
	// 5. SANKALP MANAGEMENT (FULL SankalpContentConfig + DESH/KALA, STEPS, BENEFITS)
	// =========================================================================
	if ( 'save_sankalp_content' === $sub_action ) {
		if ( ! empty( $_POST['reset_sankalp_defaults'] ) ) {
			$site_pages['sankalp'] = JW_Settings::default_sankalp_content();
			$notice                = 'Sankalp Mantra content restored to original Vedic defaults.';
		} else {
			$site_pages['sankalp'] = array(
				'title'           => sanitize_text_field( wp_unslash( $_POST['sk_title'] ?? '' ) ),
				'tagline'         => sanitize_text_field( wp_unslash( $_POST['sk_tagline'] ?? '' ) ),
				'laghuTitle'      => sanitize_text_field( wp_unslash( $_POST['sk_laghu_title'] ?? '' ) ),
				'laghuSubtitle'   => sanitize_text_field( wp_unslash( $_POST['sk_laghu_subtitle'] ?? '' ) ),
				'laghuText'       => sanitize_textarea_field( wp_unslash( $_POST['sk_laghu_text'] ?? '' ) ),
				'vistritTitle'    => sanitize_text_field( wp_unslash( $_POST['sk_vistrit_title'] ?? '' ) ),
				'vistritSubtitle' => sanitize_text_field( wp_unslash( $_POST['sk_vistrit_subtitle'] ?? '' ) ),
				'vistritText'     => sanitize_textarea_field( wp_unslash( $_POST['sk_vistrit_text'] ?? '' ) ),
				'deshKalaClauses' => sanitize_textarea_field( wp_unslash( $_POST['sk_desh_kala'] ?? '' ) ),
				'steps'           => sanitize_textarea_field( wp_unslash( $_POST['sk_steps'] ?? '' ) ),
				'benefits'        => sanitize_textarea_field( wp_unslash( $_POST['sk_benefits'] ?? '' ) ),
				'note1Title'      => sanitize_text_field( wp_unslash( $_POST['sk_note1_title'] ?? '' ) ),
				'note1Text'       => sanitize_textarea_field( wp_unslash( $_POST['sk_note1_text'] ?? '' ) ),
				'note2Title'      => sanitize_text_field( wp_unslash( $_POST['sk_note2_title'] ?? '' ) ),
				'note2Text'       => sanitize_textarea_field( wp_unslash( $_POST['sk_note2_text'] ?? '' ) ),
				'note3Title'      => sanitize_text_field( wp_unslash( $_POST['sk_note3_title'] ?? '' ) ),
				'note3Text'       => sanitize_textarea_field( wp_unslash( $_POST['sk_note3_text'] ?? '' ) ),
			);
			$notice = 'Sankalp Mantra content (Laghu, Vistrit, Desh/Kala clauses, Steps, Benefits & Notes) saved.';
		}
		$site_pages = JW_Settings::get_site_pages_content( $site_pages );
		update_option( 'jw_site_pages_content', $site_pages );
	}

	// =========================================================================
	// 6. ABOUT US MANAGEMENT (FULL AboutUsContentConfig + FEATURES, STATS, ACHARYA MSG)
	// =========================================================================
	if ( 'save_about_content' === $sub_action ) {
		if ( ! empty( $_POST['reset_about_defaults'] ) ) {
			$site_pages['about'] = JW_Settings::default_about_content();
			$notice              = 'About Us content restored to original defaults.';
		} else {
			$site_pages['about'] = array(
				'title'          => sanitize_text_field( wp_unslash( $_POST['ab_title'] ?? '' ) ),
				'tagline'        => sanitize_text_field( wp_unslash( $_POST['ab_tagline'] ?? '' ) ),
				'introTitle'     => sanitize_text_field( wp_unslash( $_POST['ab_intro_title'] ?? '' ) ),
				'introText'      => sanitize_textarea_field( wp_unslash( $_POST['ab_intro_text'] ?? '' ) ),
				'missionTitle'   => sanitize_text_field( wp_unslash( $_POST['ab_mission_title'] ?? '' ) ),
				'missionText'    => sanitize_textarea_field( wp_unslash( $_POST['ab_mission_text'] ?? '' ) ),
				'pillarsTitle'   => sanitize_text_field( wp_unslash( $_POST['ab_pillars_title'] ?? '' ) ),
				'pillar1Title'   => sanitize_text_field( wp_unslash( $_POST['ab_pillar1_title'] ?? '' ) ),
				'pillar1Text'    => sanitize_textarea_field( wp_unslash( $_POST['ab_pillar1_text'] ?? '' ) ),
				'pillar2Title'   => sanitize_text_field( wp_unslash( $_POST['ab_pillar2_title'] ?? '' ) ),
				'pillar2Text'    => sanitize_textarea_field( wp_unslash( $_POST['ab_pillar2_text'] ?? '' ) ),
				'pillar3Title'   => sanitize_text_field( wp_unslash( $_POST['ab_pillar3_title'] ?? '' ) ),
				'pillar3Text'    => sanitize_textarea_field( wp_unslash( $_POST['ab_pillar3_text'] ?? '' ) ),
				'traditionTitle' => sanitize_text_field( wp_unslash( $_POST['ab_tradition_title'] ?? '' ) ),
				'traditionText'  => sanitize_textarea_field( wp_unslash( $_POST['ab_tradition_text'] ?? '' ) ),
				'founderName'    => sanitize_text_field( wp_unslash( $_POST['ab_founder_name'] ?? '' ) ),
				'education'      => sanitize_text_field( wp_unslash( $_POST['ab_education'] ?? '' ) ),
				'university'     => sanitize_text_field( wp_unslash( $_POST['ab_university'] ?? '' ) ),
				'contactEmail'   => sanitize_email( wp_unslash( $_POST['ab_contact_email'] ?? '' ) ),
				'acharyaMessage' => sanitize_textarea_field( wp_unslash( $_POST['ab_acharya_message'] ?? '' ) ),
				'features'       => sanitize_textarea_field( wp_unslash( $_POST['ab_features'] ?? '' ) ),
				'statistics'     => sanitize_text_field( wp_unslash( $_POST['ab_statistics'] ?? '' ) ),
			);
			$notice = 'About Us content (Intro, Vision, 3 Pillars, Founder, Acharya Message, Features & Statistics) saved.';
		}
		$site_pages = JW_Settings::get_site_pages_content( $site_pages );
		update_option( 'jw_site_pages_content', $site_pages );
	}

	// =========================================================================
	// 7. PRIVACY POLICY MANAGEMENT (FULL PrivacyPolicyContentConfig SECTIONS 1-5)
	// =========================================================================
	if ( 'save_privacy_content' === $sub_action ) {
		if ( ! empty( $_POST['reset_privacy_defaults'] ) ) {
			$site_pages['privacy'] = JW_Settings::default_privacy_content();
			$notice                = 'Privacy Policy restored to original defaults.';
		} else {
			$site_pages['privacy'] = array(
				'title'         => sanitize_text_field( wp_unslash( $_POST['pr_title'] ?? '' ) ),
				'tagline'       => sanitize_text_field( wp_unslash( $_POST['pr_tagline'] ?? '' ) ),
				'badgeText'     => sanitize_text_field( wp_unslash( $_POST['pr_badge_text'] ?? '' ) ),
				'lastUpdated'   => sanitize_text_field( wp_unslash( $_POST['pr_last_updated'] ?? '' ) ),
				'section1Title' => sanitize_text_field( wp_unslash( $_POST['pr_sec1_title'] ?? '' ) ),
				'section1Text'  => sanitize_textarea_field( wp_unslash( $_POST['pr_sec1_text'] ?? '' ) ),
				'section2Title' => sanitize_text_field( wp_unslash( $_POST['pr_sec2_title'] ?? '' ) ),
				'section2Text'  => sanitize_textarea_field( wp_unslash( $_POST['pr_sec2_text'] ?? '' ) ),
				'section3Title' => sanitize_text_field( wp_unslash( $_POST['pr_sec3_title'] ?? '' ) ),
				'section3Text'  => sanitize_textarea_field( wp_unslash( $_POST['pr_sec3_text'] ?? '' ) ),
				'section4Title' => sanitize_text_field( wp_unslash( $_POST['pr_sec4_title'] ?? '' ) ),
				'section4Text'  => sanitize_textarea_field( wp_unslash( $_POST['pr_sec4_text'] ?? '' ) ),
				'section5Title' => sanitize_text_field( wp_unslash( $_POST['pr_sec5_title'] ?? '' ) ),
				'section5Text'  => sanitize_textarea_field( wp_unslash( $_POST['pr_sec5_text'] ?? '' ) ),
				'contactEmail'  => sanitize_email( wp_unslash( $_POST['pr_contact_email'] ?? '' ) ),
			);
			$notice = 'Privacy Policy (all 5 structured sections) saved.';
		}
		$site_pages = JW_Settings::get_site_pages_content( $site_pages );
		update_option( 'jw_site_pages_content', $site_pages );
	}

	// =========================================================================
	// 8. RASHIFAL & USER REVIEWS MODERATION
	// =========================================================================
	if ( 'save_rashifal' === $sub_action ) {
		$id = absint( $_POST['rashifal_id'] ?? 0 );
		if ( $id > 0 ) {
			$wpdb->update(
				$t_rashifal,
				array(
					'prediction_hi' => sanitize_textarea_field( wp_unslash( $_POST['prediction_hi'] ?? '' ) ),
					'prediction_en' => sanitize_textarea_field( wp_unslash( $_POST['prediction_en'] ?? '' ) ),
					'career_hi'     => sanitize_textarea_field( wp_unslash( $_POST['career_hi'] ?? '' ) ),
					'health_hi'     => sanitize_textarea_field( wp_unslash( $_POST['health_hi'] ?? '' ) ),
					'love_hi'       => sanitize_textarea_field( wp_unslash( $_POST['love_hi'] ?? '' ) ),
					'remedy_hi'     => sanitize_textarea_field( wp_unslash( $_POST['remedy_hi'] ?? '' ) ),
					'lucky_number'  => sanitize_text_field( wp_unslash( $_POST['lucky_number'] ?? '3' ) ),
					'lucky_color'   => sanitize_text_field( wp_unslash( $_POST['lucky_color'] ?? 'पीला' ) ),
					'status'        => sanitize_key( wp_unslash( $_POST['status'] ?? 'published' ) ),
					'updated_by'    => get_current_user_id(),
					'updated_at'    => current_time( 'mysql' ),
				),
				array( 'id' => $id )
			);
			$notice = 'Rashifal prediction updated successfully.';
		}
	}

	if ( 'moderate_review' === $sub_action ) {
		$rev_id       = absint( $_POST['review_id'] ?? 0 );
		$rev_status   = sanitize_key( wp_unslash( $_POST['review_status'] ?? 'pending' ) );
		$rev_reply    = sanitize_textarea_field( wp_unslash( $_POST['admin_reply'] ?? '' ) );
		$rev_verified = ! empty( $_POST['is_verified'] ) ? 1 : 0;
		if ( 'delete' === $rev_status ) {
			$wpdb->delete( $t_reviews, array( 'id' => $rev_id ) );
			$notice = 'Review deleted.';
		} else {
			if ( ! in_array( $rev_status, array( 'approved', 'pending', 'declined' ), true ) ) {
				$rev_status = 'pending';
			}
			$wpdb->update(
				$t_reviews,
				array(
					'status'      => $rev_status,
					'admin_reply' => $rev_reply,
					'is_verified' => $rev_verified,
				),
				array( 'id' => $rev_id )
			);
			$notice = 'Review status, verification badge & official reply updated.';
		}
	}

	if ( 'save_review_meta' === $sub_action ) {
		$site_pages['reviewMeta'] = array(
			'sectionTitle'          => sanitize_text_field( wp_unslash( $_POST['rev_sec_title'] ?? '' ) ),
			'sectionSubtitle'       => sanitize_textarea_field( wp_unslash( $_POST['rev_sec_subtitle'] ?? '' ) ),
			'pageTitle'             => sanitize_text_field( wp_unslash( $_POST['rev_page_title'] ?? '' ) ),
			'pageTagline'           => sanitize_textarea_field( wp_unslash( $_POST['rev_page_tagline'] ?? '' ) ),
			'autoApproveNewReviews' => ! empty( $_POST['rev_auto_approve'] ),
		);
		update_option( 'jw_site_pages_content', $site_pages );
		$notice = 'Review section titles & auto-approval settings updated.';
	}

	if ( 'add_admin_review' === $sub_action ) {
		$r_name     = sanitize_text_field( wp_unslash( $_POST['new_rev_name'] ?? '' ) );
		$r_city     = sanitize_text_field( wp_unslash( $_POST['new_rev_city'] ?? 'भारत' ) );
		$r_cat      = sanitize_text_field( wp_unslash( $_POST['new_rev_category'] ?? 'जन्मकुंडली एवं फलादेश' ) );
		$r_rating   = max( 1, min( 5, absint( $_POST['new_rev_rating'] ?? 5 ) ) );
		$r_comment  = sanitize_textarea_field( wp_unslash( $_POST['new_rev_comment'] ?? '' ) );
		$r_reply    = sanitize_textarea_field( wp_unslash( $_POST['new_rev_reply'] ?? '' ) );
		$r_verified = ! empty( $_POST['new_rev_verified'] ) ? 1 : 0;
		$r_status   = sanitize_key( wp_unslash( $_POST['new_rev_status'] ?? 'approved' ) );
		if ( ! in_array( $r_status, array( 'approved', 'pending', 'declined' ), true ) ) {
			$r_status = 'approved';
		}

		if ( ! empty( $r_name ) && ! empty( $r_comment ) ) {
			$wpdb->insert(
				$t_reviews,
				array(
					'review_uid'       => 'rev_' . uniqid(),
					'user_id'          => get_current_user_id(),
					'user_name'        => $r_name,
					'user_city'        => $r_city ?: 'भारत',
					'rating'           => $r_rating,
					'service_category' => $r_cat,
					'comment'          => $r_comment,
					'admin_reply'      => $r_reply,
					'is_verified'      => $r_verified,
					'status'           => $r_status,
					'created_at'       => current_time( 'mysql' ),
				)
			);
			$notice = 'New review added with status: ' . $r_status . '.';
		}
	}
}

$subtab_items = array(
	'pandits'  => '1. Pandits & QR Codes',
	'receipts' => '2. Consultation Receipts',
	'tyohar'   => '3. Tyohar (Festivals)',
	'gallery'  => '4. Puja Gallery & Categories',
	'sankalp'  => '5. Sankalp Mantra',
	'about'    => '6. About Us',
	'privacy'  => '7. Privacy Policy',
	'rashifal' => '8. Rashifal & WP Articles',
	'reviews'  => '9. User Reviews',
);
?>
<div class="wrap jw-wrap">
	<?php
	JW_Admin_Menu::render_header(
		'jw-app-content',
		'JyotishWala Content, Pandits, Receipts, Tyohar, Gallery & Static Pages',
		'Complete WordPress Admin Panel control over all JyotishWala App modules, media uploads, and database records.'
	);
	?>

	<nav class="jw-subtabs" style="justify-content:space-between;align-items:center;">
		<div style="display:flex;flex-wrap:wrap;gap:8px;">
			<?php foreach ( $subtab_items as $tab_key => $tab_label ) : ?>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=' . $tab_key ) ); ?>"
				   class="jw-subtab <?php echo ( $active_tab === $tab_key ) ? 'active' : ''; ?>">
					<?php echo esc_html( $tab_label ); ?>
				</a>
			<?php endforeach; ?>
		</div>
		<form method="post" style="margin:0;" onsubmit="return confirm('Restore any missing default App Content (Pandits, Tyohars, Gallery, Reviews, Rashifal)? Existing records will be preserved.');">
			<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
			<input type="hidden" name="jw_sub_action" value="reseed_default_data" />
			<button type="submit" class="button jw-btn-primary">🔄 Sync Default App Data</button>
		</form>
	</nav>

	<?php if ( $notice ) : ?>
		<div class="notice notice-<?php echo esc_attr( $notice_type ); ?> is-dismissible"><p><?php echo esc_html( $notice ); ?></p></div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 1: PANDIT MANAGEMENT (ADD, EDIT, DELETE, WP MEDIA AVATAR & QR CODE)
	// =============================================================================
	if ( 'pandits' === $active_tab ) :
		$chief_astrologer = get_option( 'jw_chief_astrologer', null );
		if ( empty( $chief_astrologer ) || ! is_array( $chief_astrologer ) ) {
			$chief_astrologer = $wpdb->get_row( "SELECT * FROM {$t_pandits} ORDER BY display_order ASC LIMIT 1", ARRAY_A ) ?: array(
				'name'             => 'पं. राधेश्याम शास्त्री',
				'qualification'    => 'ज्योतिषाचार्य, काशी हिन्दू विश्वविद्यालय',
				'experience_years' => 25,
				'specialties'      => 'जन्मकुंडली विश्लेषण, कुंडली मिलान, दोष निवारण अनुष्ठान, वैदिक कर्मकांड',
				'languages'        => 'हिन्दी, संस्कृत',
				'mobile'           => '+91 98765 43210',
				'email'            => 'radheshyam.shastri@jyotishwala.com',
				'address'          => 'तपोवन, लक्ष्मण झूला मार्ग, ऋषिकेश, उत्तराखंड',
				'avatar_url'       => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
				'qr_code_url'      => '',
				'dakshina_info'    => 'परामर्श दक्षिणा: ₹501',
				'about'            => 'काशी हिन्दू विश्वविद्यालय से ज्योतिष शास्त्र में आचार्य। विगत 25 वर्षों से ऋषिकेश एवं काशी से सटीक जन्मकुंडली फलादेश, विवाह मिलान तथा वैदिक अनुष्ठान मार्गदर्शन प्रदान कर रहे हैं।',
			);
		}

		$edit_pandit_id = absint( $_GET['edit_pandit'] ?? 0 );
		$editing_pandit = null;
		if ( $edit_pandit_id > 0 ) {
			$editing_pandit = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$t_pandits} WHERE id = %d", $edit_pandit_id ), ARRAY_A ); // phpcs:ignore
		}

		$paged_pandits = max( 1, absint( $_GET['paged_pandits'] ?? 1 ) );
		$per_page      = 10;
		$total_pandits = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_pandits}" ); // phpcs:ignore
		$total_pages   = max( 1, (int) ceil( $total_pandits / $per_page ) );
		$offset        = ( $paged_pandits - 1 ) * $per_page;

		$pandits_rows  = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t_pandits} ORDER BY is_chief DESC, display_order ASC, id ASC LIMIT %d OFFSET %d", $per_page, $offset ), ARRAY_A ); // phpcs:ignore
		?>
		<!-- Top Authoritative Card: Chief Astrologer Profile -->
		<div class="jw-card" style="border: 2px solid #008080; background:#f0fdfa; margin-bottom:24px;">
			<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
				<h3 style="margin:0 !important;color:#0f766e;border:none;padding:0;">
					⭐ मुख्य ज्योतिषाचार्य प्रोफाइल (Chief Astrologer — ऐप फ्रंटएंड पर केवल यही प्रोफाइल दिखेगी)
				</h3>
				<span class="jw-badge jw-badge-teal">App Frontend Primary</span>
			</div>
			<p style="margin-top:0;color:#334155;line-height:1.6;">
				यहाँ से मुख्य ज्योतिषाचार्य की पूरी प्रोफ़ाइल (नाम, योग्यता, मोबाइल, दक्षिणा, फोटो व QR कोड) सेट करें। <strong>ऐप के होम स्क्रीन (Home Screen) पर केवल यही एक मुख्य प्रोफ़ाइल दिखाई देगी</strong>, जबकि <strong>परामर्श डायरेक्टरी (Consultation Page) पर नीचे जोड़े गए सभी पंडित दिखाई देंगे।</strong> आप नीचे दी गई तालिका में से किसी भी पंडित को "⭐ Make Chief" बटन दबाकर 1-क्लिक में मुख्य ज्योतिषाचार्य बना सकते हैं।
			</p>

			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_chief_astrologer" />

				<table class="form-table">
					<tr>
						<th>आचार्य का नाम (Chief Astrologer Name) *</th>
						<td><input type="text" name="chief_name" required value="<?php echo esc_attr( $chief_astrologer['name'] ?? '' ); ?>" class="large-text" placeholder="पं. राधेश्याम शास्त्री" /></td>
					</tr>
					<tr>
						<th>पदवी / शैक्षणिक योग्यता (Qualification) *</th>
						<td><input type="text" name="chief_qualification" required value="<?php echo esc_attr( $chief_astrologer['qualification'] ?? 'ज्योतिषाचार्य, काशी हिन्दू विश्वविद्यालय' ); ?>" class="large-text" /></td>
					</tr>
					<tr>
						<th>अनुभव (Years) & भाषाएं</th>
						<td>
							<label>अनुभव वर्ष: <input type="number" name="chief_experience" min="0" max="80" value="<?php echo esc_attr( $chief_astrologer['experience_years'] ?? 20 ); ?>" style="width:80px;" /></label>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<label>परामर्श भाषाएं: <input type="text" name="chief_languages" value="<?php echo esc_attr( $chief_astrologer['languages'] ?? 'हिन्दी, संस्कृत' ); ?>" class="regular-text" /></label>
						</td>
					</tr>
					<tr>
						<th>विशेषज्ञता (Specialties — अल्पविराम से अलग करें)</th>
						<td><textarea name="chief_specialties" rows="2" class="large-text"><?php echo esc_textarea( is_array( $chief_astrologer['specialties'] ?? '' ) ? implode( ', ', $chief_astrologer['specialties'] ) : ( $chief_astrologer['specialties'] ?? 'जन्मकुंडली विश्लेषण, कुंडली मिलान, वास्तु दोष निवारण' ) ); ?></textarea></td>
					</tr>
					<tr>
						<th>मोबाइल / WhatsApp नंबर & ईमेल</th>
						<td>
							<input type="text" name="chief_mobile" required value="<?php echo esc_attr( $chief_astrologer['mobile'] ?? '+91 ' ); ?>" placeholder="+91 98765 43210" class="regular-text" /><br/><br/>
							<input type="email" name="chief_email" value="<?php echo esc_attr( $chief_astrologer['email'] ?? '' ); ?>" placeholder="astrologer@jyotishwala.com" class="regular-text" />
						</td>
					</tr>
					<tr>
						<th>परामर्श स्थान / पता (Address)</th>
						<td><input type="text" name="chief_address" value="<?php echo esc_attr( $chief_astrologer['address'] ?? 'ऋषिकेश, उत्तराखंड' ); ?>" class="large-text" /></td>
					</tr>
					<tr>
						<th>परामर्श दक्षिणा विवरण (Dakshina Info)</th>
						<td><input type="text" name="chief_dakshina_info" value="<?php echo esc_attr( $chief_astrologer['dakshina_info'] ?? 'परामर्श दक्षिणा: ₹501' ); ?>" class="regular-text" /></td>
					</tr>
					<tr>
						<th>ज्योतिषाचार्य प्रोफ़ाइल फोटो (WP Media Library)</th>
						<td>
							<input type="url" id="jw_chief_avatar_input" name="chief_avatar_url" value="<?php echo esc_attr( $chief_astrologer['avatar_url'] ?? ( $chief_astrologer['avatar'] ?? '' ) ); ?>" class="regular-text" placeholder="https://..." />
							<button type="button" class="button jw-media-upload-btn" data-input="#jw_chief_avatar_input" data-preview="#jw_chief_avatar_preview" data-title="Select Chief Astrologer Photo">Upload / Select Photo</button>
							<div style="margin-top:8px;">
								<img id="jw_chief_avatar_preview" src="<?php echo esc_url( $chief_astrologer['avatar_url'] ?? ( $chief_astrologer['avatar'] ?? '' ) ); ?>" class="jw-thumb-preview" style="<?php echo empty( $chief_astrologer['avatar_url'] ) && empty( $chief_astrologer['avatar'] ) ? 'display:none;' : ''; ?>" alt="Chief Avatar Preview" />
							</div>
						</td>
					</tr>
					<tr>
						<th>दक्षिणा भुगतान QR कोड इमेज (WP Media Library)</th>
						<td>
							<input type="url" id="jw_chief_qr_input" name="chief_qr_code_url" value="<?php echo esc_attr( $chief_astrologer['qr_code_url'] ?? '' ); ?>" class="regular-text" placeholder="https://..." />
							<button type="button" class="button jw-btn-saffron jw-media-upload-btn" data-input="#jw_chief_qr_input" data-preview="#jw_chief_qr_preview" data-title="Select Payment QR Code">Upload / Select QR Code</button>
							<div style="margin-top:8px;">
								<img id="jw_chief_qr_preview" src="<?php echo esc_url( $chief_astrologer['qr_code_url'] ?? '' ); ?>" class="jw-thumb-preview" style="<?php echo empty( $chief_astrologer['qr_code_url'] ) ? 'display:none;' : ''; ?>" alt="Chief QR Preview" />
							</div>
						</td>
					</tr>
					<tr>
						<th>विस्तृत परिचय / संदेश (Bio & Experience Details)</th>
						<td><textarea name="chief_about" rows="3" class="large-text"><?php echo esc_textarea( $chief_astrologer['about'] ?? '' ); ?></textarea></td>
					</tr>
				</table>

				<p>
					<button type="submit" class="button jw-btn-primary" style="padding:6px 18px;font-size:14px;">Save Chief Astrologer Profile (मुख्य ज्योतिषाचार्य प्रोफाइल सहेजें)</button>
				</p>
			</form>
		</div>

		<div class="jw-grid-2">
			<div class="jw-card">
				<h3><?php echo $editing_pandit ? 'Edit Pandit Profile: ' . esc_html( $editing_pandit['name'] ) : 'Add New Pandit / Astrologer Profile'; ?></h3>
				<form method="post">
					<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
					<input type="hidden" name="jw_sub_action" value="save_pandit" />
					<input type="hidden" name="pandit_id" value="<?php echo esc_attr( $editing_pandit['id'] ?? 0 ); ?>" />

					<table class="form-table">
						<tr>
							<th>Pandit Name (आचार्य का नाम) *</th>
							<td><input type="text" name="p_name" required value="<?php echo esc_attr( $editing_pandit['name'] ?? '' ); ?>" class="large-text" placeholder="पं. राधेश्याम शास्त्री" /></td>
						</tr>
						<tr>
							<th>Qualification (शैक्षणिक योग्यता) *</th>
							<td><input type="text" name="p_qualification" required value="<?php echo esc_attr( $editing_pandit['qualification'] ?? 'ज्योतिषाचार्य, काशी हिन्दू विश्वविद्यालय' ); ?>" class="large-text" /></td>
						</tr>
						<tr>
							<th>Experience (Years) & Order</th>
							<td>
								<label>Experience (Years): <input type="number" name="p_experience" min="0" max="80" value="<?php echo esc_attr( $editing_pandit['experience_years'] ?? 18 ); ?>" style="width:80px;" /></label>
								&nbsp;&nbsp;
								<label>Display Order: <input type="number" name="p_display_order" min="1" value="<?php echo esc_attr( $editing_pandit['display_order'] ?? 1 ); ?>" style="width:70px;" /></label>
								&nbsp;&nbsp;
								<label><input type="checkbox" name="p_is_active" value="1" <?php checked( isset( $editing_pandit['is_active'] ) ? (int) $editing_pandit['is_active'] : 1, 1 ); ?> /> Active in App</label>
							</td>
						</tr>
						<tr style="background:#f0fdfa;">
							<th>मुख्य ज्योतिषाचार्य पद (Chief Astrologer)</th>
							<td>
								<label style="font-weight:700;color:#0f766e;display:flex;align-items:center;gap:6px;">
									<input type="checkbox" name="p_is_chief" value="1" <?php checked( ! empty( $editing_pandit['is_chief'] ) ); ?> />
									⭐ मुख्य ज्योतिषाचार्य बनाएं (Mark as Chief Astrologer — Displays on App Home Screen)
								</label>
								<p class="description" style="margin:4px 0 0 0;color:#475569;">
									यदि इसे चेक करते हैं, तो ऐप के <strong>होम स्क्रीन (Home Screen)</strong> के मुख्य परामर्श कार्ड पर केवल यही ज्योतिषाचार्य दिखेंगे। <strong>परामर्श डायरेक्टरी (Consultation Page)</strong> पर सभी जोड़े गए पंडित दिखेंगे।
								</p>
							</td>
						</tr>
						<tr>
							<th>Specialties (विशेषज्ञता — comma separated)</th>
							<td><textarea name="p_specialties" rows="2" class="large-text"><?php echo esc_textarea( $editing_pandit['specialties'] ?? 'जन्मकुंडली विश्लेषण, कुंडली मिलान, दोष निवारण अनुष्ठान, वैदिक कर्मकांड' ); ?></textarea></td>
						</tr>
						<tr>
							<th>Languages (भाषाएं)</th>
							<td><input type="text" name="p_languages" value="<?php echo esc_attr( $editing_pandit['languages'] ?? 'हिन्दी, संस्कृत' ); ?>" class="regular-text" /></td>
						</tr>
						<tr>
							<th>Mobile / WhatsApp & Email</th>
							<td>
								<input type="text" name="p_mobile" required value="<?php echo esc_attr( $editing_pandit['mobile'] ?? '+91 ' ); ?>" placeholder="+91 98765 43210" class="regular-text" /><br/><br/>
								<input type="email" name="p_email" value="<?php echo esc_attr( $editing_pandit['email'] ?? '' ); ?>" placeholder="pandit@jyotishwala.com" class="regular-text" />
							</td>
						</tr>
						<tr>
							<th>Address (पता)</th>
							<td><input type="text" name="p_address" value="<?php echo esc_attr( $editing_pandit['address'] ?? 'तपोवन, ऋषिकेश, उत्तराखंड' ); ?>" class="large-text" /></td>
						</tr>
						<tr>
							<th>Dakshina Information (परामर्श दक्षिणा)</th>
							<td><input type="text" name="p_dakshina_info" value="<?php echo esc_attr( $editing_pandit['dakshina_info'] ?? 'परामर्श दक्षिणा: ₹501' ); ?>" class="regular-text" /></td>
						</tr>
						<tr>
							<th>Pandit Profile Photo (WP Media Library)</th>
							<td>
								<input type="url" id="jw_pandit_avatar_input" name="p_avatar_url" value="<?php echo esc_attr( $editing_pandit['avatar_url'] ?? '' ); ?>" class="regular-text" placeholder="https://..." />
								<button type="button" class="button jw-media-upload-btn" data-input="#jw_pandit_avatar_input" data-preview="#jw_pandit_avatar_preview" data-title="Select Pandit Profile Photo">Upload / Select Photo</button>
								<div style="margin-top:8px;">
									<img id="jw_pandit_avatar_preview" src="<?php echo esc_url( $editing_pandit['avatar_url'] ?? '' ); ?>" class="jw-thumb-preview" style="<?php echo empty( $editing_pandit['avatar_url'] ) ? 'display:none;' : ''; ?>" alt="Avatar Preview" />
								</div>
							</td>
						</tr>
						<tr>
							<th>Payment QR Code Image (WP Media Library)</th>
							<td>
								<input type="url" id="jw_pandit_qr_input" name="p_qr_code_url" value="<?php echo esc_attr( $editing_pandit['qr_code_url'] ?? '' ); ?>" class="regular-text" placeholder="https://..." />
								<button type="button" class="button jw-btn-saffron jw-media-upload-btn" data-input="#jw_pandit_qr_input" data-preview="#jw_pandit_qr_preview" data-title="Select Payment QR Code Image">Upload / Select QR Code</button>
								<div style="margin-top:8px;">
									<img id="jw_pandit_qr_preview" src="<?php echo esc_url( $editing_pandit['qr_code_url'] ?? '' ); ?>" class="jw-thumb-preview" style="<?php echo empty( $editing_pandit['qr_code_url'] ) ? 'display:none;' : ''; ?>" alt="QR Preview" />
								</div>
							</td>
						</tr>
						<tr>
							<th>About / Experience Bio (परिचय)</th>
							<td><textarea name="p_about" rows="3" class="large-text"><?php echo esc_textarea( $editing_pandit['about'] ?? '' ); ?></textarea></td>
						</tr>
					</table>

					<p>
						<button type="submit" class="button jw-btn-primary"><?php echo $editing_pandit ? 'Update Pandit Profile' : 'Add Pandit Profile'; ?></button>
						<?php if ( $editing_pandit ) : ?>
							<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=pandits' ) ); ?>" class="button">Cancel Edit</a>
						<?php endif; ?>
					</p>
				</form>
			</div>

			<div class="jw-card">
				<form method="post" onsubmit="return confirm('Delete selected Pandit profile(s)?');">
					<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
					<input type="hidden" name="jw_sub_action" value="bulk_delete_pandits" />

					<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
						<h3 style="margin:0 !important;border:none;padding:0;">Existing Pandits & Astrologers (<?php echo esc_html( $total_pandits ); ?>)</h3>
						<button type="submit" class="button button-secondary" style="color:#b32d2e;">Delete Selected</button>
					</div>

					<table class="jw-table">
						<thead>
							<tr>
								<th style="width:36px;"><input type="checkbox" id="jw-select-all-pandits" onclick="document.querySelectorAll('.jw-pandit-cb').forEach(c=>c.checked=this.checked);" /></th>
								<th>Pandit & Qualification</th>
								<th>Contact & Dakshina</th>
								<th>QR / Photo</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							<?php if ( empty( $pandits_rows ) ) : ?>
								<tr><td colspan="6">No Pandits found.</td></tr>
							<?php else : ?>
								<?php foreach ( $pandits_rows as $p ) : ?>
									<tr>
										<td>
											<input type="checkbox" name="selected_pandits[]" value="<?php echo esc_attr( $p['id'] ); ?>" class="jw-pandit-cb" />
										</td>
										<td>
											<strong><?php echo esc_html( $p['name'] ); ?></strong>
											<?php if ( ! empty( $p['is_chief'] ) ) : ?>
												<span class="jw-badge jw-badge-teal" style="font-weight:bold;margin-left:4px;">⭐ मुख्य ज्योतिषाचार्य (Home Screen)</span>
											<?php endif; ?>
											<br/>
											<small><?php echo esc_html( $p['qualification'] ); ?> (<?php echo esc_html( $p['experience_years'] ); ?> yrs)</small><br/>
											<small style="color:#008080;"><?php echo esc_html( $p['specialties'] ); ?></small>
										</td>
										<td>
											<strong><?php echo esc_html( $p['dakshina_info'] ); ?></strong><br/>
											<small><?php echo esc_html( $p['mobile'] ); ?></small><br/>
											<small><?php echo esc_html( $p['email'] ); ?></small>
										</td>
										<td>
											<?php if ( ! empty( $p['avatar_url'] ) ) : ?>
												<img src="<?php echo esc_url( $p['avatar_url'] ); ?>" class="jw-thumb-preview" title="Avatar" alt="Avatar" />
											<?php endif; ?>
											<?php if ( ! empty( $p['qr_code_url'] ) ) : ?>
												<img src="<?php echo esc_url( $p['qr_code_url'] ); ?>" class="jw-thumb-preview" title="QR Code" alt="QR Code" />
											<?php else : ?>
												<small>Default SVG QR</small>
											<?php endif; ?>
										</td>
										<td>
											<span class="jw-badge <?php echo $p['is_active'] ? 'jw-badge-green' : 'jw-badge-red'; ?>">
												<?php echo $p['is_active'] ? 'Active' : 'Hidden'; ?>
											</span>
										</td>
										<td>
											<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=pandits&edit_pandit=' . $p['id'] ) ); ?>" class="button button-small">Edit</a>
											<?php if ( empty( $p['is_chief'] ) ) : ?>
												<form method="post" style="display:inline-block;margin-left:4px;" onsubmit="return confirm('क्या आप इस ज्योतिषाचार्य को ऐप होम स्क्रीन के लिए मुख्य ज्योतिषाचार्य बनाना चाहते हैं?');">
													<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
													<input type="hidden" name="jw_sub_action" value="set_chief_pandit" />
													<input type="hidden" name="pandit_id" value="<?php echo esc_attr( $p['id'] ); ?>" />
													<button type="submit" class="button button-small" style="color:#008080;font-weight:bold;" title="होम पेज के लिए मुख्य ज्योतिषाचार्य बनाएं">⭐ Make Chief</button>
												</form>
											<?php endif; ?>
										</td>
									</tr>
								<?php endforeach; ?>
							<?php endif; ?>
						</tbody>
					</table>
				</form>

				<?php if ( $total_pages > 1 ) : ?>
					<div class="jw-pagination" style="margin-top:16px;display:flex;gap:8px;align-items:center;justify-content:center;">
						<?php if ( $paged_pandits > 1 ) : ?>
							<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=pandits&paged_pandits=' . ( $paged_pandits - 1 ) ) ); ?>" class="button">&laquo; Previous</a>
						<?php endif; ?>
						<span>Page <?php echo esc_html( $paged_pandits ); ?> of <?php echo esc_html( $total_pages ); ?></span>
						<?php if ( $paged_pandits < $total_pages ) : ?>
							<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=pandits&paged_pandits=' . ( $paged_pandits + 1 ) ) ); ?>" class="button">Next &raquo;</a>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 2: CONSULTATION PAYMENT RECEIPTS MANAGEMENT
	// =============================================================================
	if ( 'receipts' === $active_tab ) :
		$status_filter = isset( $_GET['rec_status'] ) ? sanitize_key( wp_unslash( $_GET['rec_status'] ) ) : 'all';
		if ( in_array( $status_filter, array( 'pending', 'verified', 'rejected' ), true ) ) {
			$receipts_rows = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t_receipts} WHERE status = %s ORDER BY id DESC LIMIT 100", $status_filter ), ARRAY_A ); // phpcs:ignore
		} else {
			$receipts_rows = $wpdb->get_results( "SELECT * FROM {$t_receipts} ORDER BY id DESC LIMIT 100", ARRAY_A ); // phpcs:ignore
		}
		?>
		<div class="jw-card">
			<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
				<h3 style="margin:0;border:none;padding:0;">Consultation Payment Receipts Verification & History</h3>
				<div>
					<?php foreach ( array( 'all' => 'All Receipts', 'pending' => 'Pending Verification', 'verified' => 'Verified', 'rejected' => 'Rejected' ) as $st_k => $st_label ) : ?>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=receipts&rec_status=' . $st_k ) ); ?>"
						   class="button <?php echo ( $status_filter === $st_k ) ? 'jw-btn-primary' : ''; ?>">
							<?php echo esc_html( $st_label ); ?>
						</a>
					<?php endforeach; ?>
				</div>
			</div>

			<p>App users submit consultation payment receipts via <code>POST /wp-json/jyotishwala/v1/receipts</code>. Each receipt is linked to the user's account (<code>user_id</code>) and selected Pandit.</p>

			<?php if ( empty( $receipts_rows ) ) : ?>
				<p>No consultation payment receipts found for this filter.</p>
			<?php else : ?>
				<div class="jw-item-grid">
					<?php foreach ( $receipts_rows as $rec ) : ?>
						<form method="post" class="jw-item-card">
							<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
							<input type="hidden" name="jw_sub_action" value="update_receipt" />
							<input type="hidden" name="receipt_id" value="<?php echo esc_attr( $rec['id'] ); ?>" />

							<div class="jw-item-header">
								<div>
									<h4 class="jw-item-title">
										Receipt: <code><?php echo esc_html( $rec['receipt_uid'] ); ?></code>
										• <span style="color:#008080;"><?php echo esc_html( $rec['amount'] ); ?></span>
									</h4>
									<span class="jw-item-meta">
										Submitted: <?php echo esc_html( $rec['submitted_at'] ); ?> • Pandit: <strong><?php echo esc_html( $rec['pandit_name'] ); ?></strong> (<code><?php echo esc_html( $rec['pandit_id'] ); ?></code>)
									</span>
								</div>
								<span class="jw-badge <?php echo 'verified' === $rec['status'] ? 'jw-badge-green' : ( 'rejected' === $rec['status'] ? 'jw-badge-red' : 'jw-badge-orange' ); ?>">
									<?php echo esc_html( strtoupper( $rec['status'] ) ); ?>
								</span>
							</div>

							<div class="jw-grid-3">
								<div class="jw-field-group">
									<label>App User Details</label>
									<div><strong><?php echo esc_html( $rec['user_name'] ); ?></strong></div>
									<div><small>Phone: <?php echo esc_html( $rec['user_phone'] ); ?></small></div>
									<?php if ( ! empty( $rec['user_email'] ) ) : ?>
										<div><small>Email: <?php echo esc_html( $rec['user_email'] ); ?></small></div>
									<?php endif; ?>
									<div style="margin-top:6px;">
										<label style="font-size:11px;">Linked WP User ID:</label>
										<input type="number" name="associated_user_id" value="<?php echo esc_attr( $rec['user_id'] ); ?>" />
									</div>
								</div>

								<div class="jw-field-group">
									<label>UTR Number & Screenshot</label>
									<div>UTR: <code><?php echo esc_html( $rec['utr_number'] ); ?></code></div>
									<?php if ( ! empty( $rec['note'] ) ) : ?>
										<div style="margin-top:4px;"><small>Note: <?php echo esc_html( $rec['note'] ); ?></small></div>
									<?php endif; ?>
									<div style="margin-top:8px;">
										<?php if ( ! empty( $rec['receipt_image_url'] ) ) : ?>
											<a href="<?php echo esc_url( $rec['receipt_image_url'] ); ?>" target="_blank" rel="noopener noreferrer" class="button">View Receipt Screenshot</a>
										<?php else : ?>
											<small>No screenshot attached</small>
										<?php endif; ?>
									</div>
								</div>

								<div class="jw-field-group">
									<label>Verification Status & Admin Remarks</label>
									<select name="receipt_status" style="margin-bottom:6px;">
										<option value="pending" <?php selected( $rec['status'], 'pending' ); ?>>Pending Verification</option>
										<option value="verified" <?php selected( $rec['status'], 'verified' ); ?>>Verified (Approve)</option>
										<option value="rejected" <?php selected( $rec['status'], 'rejected' ); ?>>Rejected</option>
										<option value="delete">Delete Permanently</option>
									</select>
									<input type="text" name="admin_remarks" value="<?php echo esc_attr( $rec['admin_remarks'] ?? '' ); ?>" placeholder="Admin verification note..." />
								</div>
							</div>

							<div class="jw-actions-row">
								<button type="submit" class="button jw-btn-primary">Save Receipt Status</button>
							</div>
						</form>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 3: TYOHAR MANAGEMENT (YEAR & MONTH FILTERS, EDIT/DELETE, 8 DETAILED FIELDS)
	// =============================================================================
	if ( 'tyohar' === $active_tab ) :
		$filter_year  = isset( $_GET['tyo_year'] ) ? absint( $_GET['tyo_year'] ) : 0;
		$filter_month = isset( $_GET['tyo_month_num'] ) ? absint( $_GET['tyo_month_num'] ) : 0;
		$edit_tyo_id  = isset( $_GET['edit_tyohar'] ) ? absint( $_GET['edit_tyohar'] ) : 0;

		$editing_tyo      = null;
		$editing_tyo_json = array();
		if ( $edit_tyo_id > 0 ) {
			$editing_tyo = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$t_tyohar} WHERE id = %d", $edit_tyo_id ), ARRAY_A ); // phpcs:ignore
			if ( $editing_tyo && ! empty( $editing_tyo['details_json'] ) ) {
				$decoded = json_decode( $editing_tyo['details_json'], true );
				if ( is_array( $decoded ) ) {
					$editing_tyo_json = $decoded;
				}
			}
		}

		$where_clauses = array( '1=1' );
		$where_values  = array();
		if ( $filter_year >= 2020 && $filter_year <= 2035 ) {
			$where_clauses[] = 'YEAR(tyohar_date) = %d';
			$where_values[]  = $filter_year;
		}
		if ( $filter_month >= 1 && $filter_month <= 12 ) {
			$where_clauses[] = 'MONTH(tyohar_date) = %d';
			$where_values[]  = $filter_month;
		}
		$where_sql = implode( ' AND ', $where_clauses );
		if ( ! empty( $where_values ) ) {
			$tyohar_rows = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t_tyohar} WHERE {$where_sql} ORDER BY tyohar_date ASC", $where_values ), ARRAY_A ); // phpcs:ignore
		} else {
			$tyohar_rows = $wpdb->get_results( "SELECT * FROM {$t_tyohar} ORDER BY tyohar_date ASC", ARRAY_A ); // phpcs:ignore
		}

		$hindi_months_map = array(
			0  => 'All 12 Months (संपूर्ण वर्ष)',
			1  => '1 - जनवरी (पौष–माघ)',
			2  => '2 - फरवरी (माघ–फाल्गुन)',
			3  => '3 - मार्च (फाल्गुन–चैत्र)',
			4  => '4 - अप्रैल (चैत्र–वैशाख)',
			5  => '5 - मई (वैशाख–ज्येष्ठ)',
			6  => '6 - जून (ज्येष्ठ–आषाढ़)',
			7  => '7 - जुलाई (आषाढ़–श्रावण)',
			8  => '8 - अगस्त (श्रावण–भाद्रपद)',
			9  => '9 - सितंबर (भाद्रपद–आश्विन)',
			10 => '10 - अक्टूबर (आश्विन–कार्तिक)',
			11 => '11 - नवंबर (कार्तिक–मार्गशीर्ष)',
			12 => '12 - दिसंबर (मार्गशीर्ष–पौष)',
		);
		?>
		<div class="jw-card">
			<h3><?php echo $editing_tyo ? 'Edit Vrat / Tyohar: ' . esc_html( $editing_tyo['name'] ) : 'Add New Sanatan Vrat / Tyohar (with All 8 Detailed Sections)'; ?></h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_tyohar" />
				<input type="hidden" name="tyohar_id" value="<?php echo esc_attr( $editing_tyo['id'] ?? 0 ); ?>" />

				<div class="jw-grid-3">
					<div>
						<label><strong>Festival Name (त्योहार का नाम) *</strong><br/>
						<input type="text" name="tyo_name" required value="<?php echo esc_attr( $editing_tyo['name'] ?? '' ); ?>" class="large-text" /></label>
					</div>
					<div>
						<label><strong>Date (YYYY-MM-DD) *</strong><br/>
						<input type="date" name="tyo_date" required value="<?php echo esc_attr( $editing_tyo['tyohar_date'] ?? gmdate( 'Y-m-d' ) ); ?>" class="regular-text" /></label>
					</div>
					<div>
						<label><strong>Category (पर्व श्रेणी) *</strong><br/>
						<select name="tyo_category" class="regular-text">
							<?php foreach ( array( 'प्रमुख महापर्व', 'एकादशी एवं व्रत', 'शक्ति एवं शिव पर्व', 'संक्रांति एवं जयंती' ) as $cat_opt ) : ?>
								<option value="<?php echo esc_attr( $cat_opt ); ?>" <?php selected( $editing_tyo['category'] ?? 'प्रमुख महापर्व', $cat_opt ); ?>><?php echo esc_html( $cat_opt ); ?></option>
							<?php endforeach; ?>
						</select></label>
					</div>
				</div>

				<div class="jw-grid-3">
					<div>
						<label><strong>Vara (वार)</strong><br/>
						<input type="text" name="tyo_vara" value="<?php echo esc_attr( $editing_tyo['vara'] ?? 'रविवार' ); ?>" class="regular-text" /></label>
					</div>
					<div>
						<label><strong>Hindi Maas & Paksha (वैदिक मास व पक्ष)</strong><br/>
						<input type="text" name="tyo_month" value="<?php echo esc_attr( $editing_tyo['hindi_month'] ?? 'कार्तिक' ); ?>" style="width:45%;" placeholder="कार्तिक" />
						<input type="text" name="tyo_paksha" value="<?php echo esc_attr( $editing_tyo['paksha'] ?? 'शुक्ल पक्ष' ); ?>" style="width:48%;" placeholder="शुक्ल पक्ष" /></label>
					</div>
					<div>
						<label><strong>Tithi (तिथि)</strong><br/>
						<input type="text" name="tyo_tithi" value="<?php echo esc_attr( $editing_tyo['tithi'] ?? 'पूर्णिमा तिथि' ); ?>" class="regular-text" /></label>
					</div>
				</div>

				<p>
					<label><strong>Short Significance Summary (संक्षिप्त महत्व — कार्ड पर दिखने वाला विवरण) *</strong><br/>
					<textarea name="tyo_significance" rows="2" class="large-text" required><?php echo esc_textarea( $editing_tyo['significance'] ?? '' ); ?></textarea></label>
				</p>

				<h4>All 8 Detailed Festival Sections (विस्तृत पर्व विवरण)</h4>
				<div class="jw-grid-2">
					<div>
						<p><label><strong>1. Why Celebrated & Religious Significance (क्यों मनाया जाता है / धार्मिक महत्व — whyCelebrated):</strong><br/>
						<textarea name="tyo_why_celebrated" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['whyCelebrated'] ?? ( $editing_tyo_json['detailedSignificance'] ?? '' ) ); ?></textarea></label></p>

						<p><label><strong>2. Pauranik History & Shastra Reference (पौराणिक इतिहास एवं शास्त्र प्रमाण — historyAndPauranik):</strong><br/>
						<textarea name="tyo_history_pauranik" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['historyAndPauranik'] ?? '' ); ?></textarea></label></p>

						<p><label><strong>3. Puja Vidhi & Shubh Muhurat (पूजा विधि एवं शुभ मुहूर्त — pujaVidhi):</strong><br/>
						<textarea name="tyo_puja_vidhi" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['pujaVidhi'] ?? '' ); ?></textarea></label></p>

						<p><label><strong>4. Vrat Rules & Parana Vidhi (व्रत के नियम एवं पारण विधि — vratAndRules):</strong><br/>
						<textarea name="tyo_vrat_rules" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['vratAndRules'] ?? '' ); ?></textarea></label></p>
					</div>
					<div>
						<p><label><strong>5. Katha & Upasana Mantra (कथा सार एवं विशेष मंत्र — kathaOrMantra):</strong><br/>
						<textarea name="tyo_katha_mantra" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['kathaOrMantra'] ?? '' ); ?></textarea></label></p>

						<p><label><strong>6. Festival Sankalp Mantra (पर्व विशेष संकल्प मंत्र — sankalp):</strong><br/>
						<textarea name="tyo_sankalp" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['sankalp'] ?? '' ); ?></textarea></label></p>

						<p><label><strong>7. Do's and Don'ts (क्या करें और क्या न करें — doAndDonts):</strong><br/>
						<textarea name="tyo_do_donts" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['doAndDonts'] ?? '' ); ?></textarea></label></p>

						<p><label><strong>8. Daan & Astrological Remedies (दान एवं ज्योतिषीय उपाय — daanAndUpay):</strong><br/>
						<textarea name="tyo_daan_upay" rows="3" class="large-text"><?php echo esc_textarea( $editing_tyo_json['daanAndUpay'] ?? '' ); ?></textarea></label></p>
					</div>
				</div>

				<p>
					<label><input type="checkbox" name="tyo_is_active" value="1" <?php checked( isset( $editing_tyo['is_active'] ) ? (int) $editing_tyo['is_active'] : 1, 1 ); ?> /> Published / Active in App Calendar</label>
				</p>

				<p>
					<button type="submit" class="button jw-btn-primary"><?php echo $editing_tyo ? 'Update Tyohar & 8 Detailed Sections' : 'Add Festival to Calendar'; ?></button>
					<?php if ( $editing_tyo ) : ?>
						<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=tyohar' ) ); ?>" class="button">Cancel Edit</a>
					<?php endif; ?>
				</p>
			</form>
		</div>

		<!-- Filter & Existing Tyohar Table -->
		<div class="jw-card">
			<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
				<h3 style="margin:0;border:none;padding:0;">Existing Vrat & Tyohar Records (<?php echo count( $tyohar_rows ); ?>)</h3>
				<form method="get" style="display:flex;gap:8px;align-items:center;">
					<input type="hidden" name="page" value="jw-app-content" />
					<input type="hidden" name="tab" value="tyohar" />
					<label>Year:
						<select name="tyo_year">
							<option value="0" <?php selected( $filter_year, 0 ); ?>>All Years</option>
							<?php foreach ( array( 2025, 2026, 2027, 2028 ) as $yr_opt ) : ?>
								<option value="<?php echo esc_attr( $yr_opt ); ?>" <?php selected( $filter_year, $yr_opt ); ?>><?php echo esc_html( $yr_opt ); ?></option>
							<?php endforeach; ?>
						</select>
					</label>
					<label>Month:
						<select name="tyo_month_num">
							<?php foreach ( $hindi_months_map as $m_idx => $m_lbl ) : ?>
								<option value="<?php echo esc_attr( $m_idx ); ?>" <?php selected( $filter_month, $m_idx ); ?>><?php echo esc_html( $m_lbl ); ?></option>
							<?php endforeach; ?>
						</select>
					</label>
					<button type="submit" class="button jw-btn-primary">Filter</button>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=tyohar' ) ); ?>" class="button">Reset</a>
				</form>
			</div>

			<table class="jw-table">
				<thead>
					<tr>
						<th>Date & Vara</th>
						<th>Festival Name & Category</th>
						<th>Vedic Maas, Paksha & Tithi</th>
						<th>Short Significance</th>
						<th>8 Detailed Sections</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $tyohar_rows ) ) : ?>
						<tr><td colspan="6">No festivals match the selected Year/Month filter.</td></tr>
					<?php else : ?>
						<?php foreach ( $tyohar_rows as $tyo ) : ?>
							<?php
							$det = ! empty( $tyo['details_json'] ) ? json_decode( $tyo['details_json'], true ) : array();
							$filled_sections = is_array( $det ) ? count( array_filter( $det ) ) : 0;
							?>
							<tr>
								<td>
									<strong><?php echo esc_html( $tyo['tyohar_date'] ); ?></strong><br/>
									<small><?php echo esc_html( $tyo['vara'] ); ?></small>
								</td>
								<td>
									<strong><?php echo esc_html( $tyo['name'] ); ?></strong><br/>
									<span class="jw-badge jw-badge-saffron"><?php echo esc_html( $tyo['category'] ); ?></span>
								</td>
								<td>
									<?php echo esc_html( $tyo['hindi_month'] . ' • ' . $tyo['paksha'] ); ?><br/>
									<small><?php echo esc_html( $tyo['tithi'] ); ?></small>
								</td>
								<td><small><?php echo esc_html( wp_trim_words( $tyo['significance'], 18 ) ); ?></small></td>
								<td><span class="jw-badge jw-badge-teal"><?php echo esc_html( $filled_sections ); ?> fields configured</span></td>
								<td>
									<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=tyohar&edit_tyohar=' . $tyo['id'] ) ); ?>" class="button">Edit</a>
									<form method="post" style="display:inline;" onsubmit="return confirm('Delete this Tyohar record?');">
										<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
										<input type="hidden" name="jw_sub_action" value="delete_tyohar" />
										<input type="hidden" name="tyohar_id" value="<?php echo esc_attr( $tyo['id'] ); ?>" />
										<button type="submit" class="button">Delete</button>
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 4: GALLERY MANAGEMENT (CATEGORIES, TEAL BANNER, SINGLE & GROUP ALBUMS)
	// =============================================================================
	if ( 'gallery' === $active_tab ) :
		$gal_meta     = $site_pages['galleryMeta'];
		$gal_cats     = $gal_meta['categories'];
		$edit_gal_id  = absint( $_GET['edit_gallery'] ?? 0 );
		$editing_gal  = null;
		$editing_urls = '';
		if ( $edit_gal_id > 0 ) {
			$editing_gal = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$t_gallery} WHERE id = %d", $edit_gal_id ), ARRAY_A ); // phpcs:ignore
			if ( $editing_gal && ! empty( $editing_gal['group_images_json'] ) ) {
				$arr = json_decode( $editing_gal['group_images_json'], true );
				if ( is_array( $arr ) ) {
					$editing_urls = implode( "\n", $arr );
				}
			}
		}
		$gallery_rows = $wpdb->get_results( "SELECT * FROM {$t_gallery} ORDER BY display_order ASC, id DESC", ARRAY_A ); // phpcs:ignore
		?>
		<div class="jw-grid-2">
			<!-- Add / Edit Photo or Multi-Photo Puja Group Album -->
			<div class="jw-card">
				<h3><?php echo $editing_gal ? 'Edit Gallery Photo / Album: ' . esc_html( $editing_gal['title'] ) : 'Add Gallery Photo or Multi-Photo Puja Album'; ?></h3>
				<form method="post">
					<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
					<input type="hidden" name="jw_sub_action" value="save_gallery" />
					<input type="hidden" name="gallery_id" value="<?php echo esc_attr( $editing_gal['id'] ?? 0 ); ?>" />

					<p>
						<label><strong>Title (शीर्षक — फोटो किस बारे में है) *</strong><br/>
						<input type="text" name="gal_title" required value="<?php echo esc_attr( $editing_gal['title'] ?? '' ); ?>" class="large-text" /></label>
					</p>

					<div class="jw-grid-2">
						<div>
							<label><strong>Category (श्रेणी) *</strong><br/>
							<select name="gal_category" class="regular-text">
								<?php foreach ( $gal_cats as $g_cat ) : ?>
									<option value="<?php echo esc_attr( $g_cat ); ?>" <?php selected( $editing_gal['category'] ?? '', $g_cat ); ?>><?php echo esc_html( $g_cat ); ?></option>
								<?php endforeach; ?>
							</select></label>
						</div>
						<div>
							<label><strong>Event Date & Order</strong><br/>
							<input type="date" name="gal_date" value="<?php echo esc_attr( $editing_gal['event_date'] ?? gmdate( 'Y-m-d' ) ); ?>" />
							<input type="number" name="gal_display_order" value="<?php echo esc_attr( $editing_gal['display_order'] ?? 1 ); ?>" style="width:65px;" title="Display Order" /></label>
						</div>
					</div>

					<div class="jw-grid-2">
						<div>
							<label><strong>Location (स्थान)</strong><br/>
							<input type="text" name="gal_location" value="<?php echo esc_attr( $editing_gal['location'] ?? 'ऋषिकेश, उत्तराखंड' ); ?>" class="regular-text" /></label>
						</div>
						<div>
							<label><strong>Acharya / Sansthan Name</strong><br/>
							<input type="text" name="gal_acharya_name" value="<?php echo esc_attr( $editing_gal['acharya_name'] ?? 'आचार्य परेश्वर भारद्वाज' ); ?>" class="regular-text" /></label>
						</div>
					</div>

					<p>
						<label><strong>Primary / Cover Photo URL *</strong><br/>
						<input type="url" id="jw_gal_img_input" name="gal_image_url" required value="<?php echo esc_attr( $editing_gal['image_url'] ?? '' ); ?>" class="regular-text" />
						<button type="button" class="button jw-media-upload-btn" data-input="#jw_gal_img_input" data-preview="#jw_gal_cover_preview">Select Cover Photo</button></label>
						<img id="jw_gal_cover_preview" src="<?php echo esc_url( $editing_gal['image_url'] ?? '' ); ?>" class="jw-thumb-preview" style="margin-top:6px;<?php echo empty( $editing_gal['image_url'] ) ? 'display:none;' : ''; ?>" alt="Cover Preview" />
					</p>

					<p>
						<label><strong>Group Album Photos (एक ही पूजा की 5-6+ फोटो समूह में दिखाने हेतु — 1 URL प्रति पंक्ति)</strong><br/>
						<textarea id="jw_gal_group_urls" name="gal_group_urls" rows="4" class="large-text" placeholder="Leave empty for a single photo, or add multiple URLs (one per line) for a multi-photo Puja album"><?php echo esc_textarea( $editing_urls ); ?></textarea></label>
						<button type="button" class="button jw-btn-saffron jw-media-multi-upload-btn" data-textarea="#jw_gal_group_urls" data-cover="#jw_gal_img_input">Add Multiple Photos from WP Media Library</button>
					</p>

					<p>
						<label><strong>Internal / Detailed Description (विवरण)</strong><br/>
						<textarea name="gal_description" rows="2" class="large-text"><?php echo esc_textarea( $editing_gal['description'] ?? '' ); ?></textarea></label>
					</p>

					<p>
						<label><input type="checkbox" name="gal_featured" value="1" <?php checked( isset( $editing_gal['is_featured'] ) ? (int) $editing_gal['is_featured'] : 0, 1 ); ?> /> Featured Album</label>
					</p>

					<p>
						<button type="submit" class="button jw-btn-primary"><?php echo $editing_gal ? 'Update Gallery Item' : 'Save to Gallery'; ?></button>
						<?php if ( $editing_gal ) : ?>
							<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=gallery' ) ); ?>" class="button">Cancel Edit</a>
						<?php endif; ?>
					</p>
				</form>
			</div>

			<!-- Gallery Category Management -->
			<div class="jw-card">
				<h3>Gallery Category Tabs Management (श्रेणियां प्रबंधन)</h3>
				<form method="post" style="margin-bottom:14px;display:flex;gap:8px;">
					<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
					<input type="hidden" name="jw_sub_action" value="add_gallery_category" />
					<input type="text" name="new_gallery_category" required placeholder="Add new category tab..." class="regular-text" />
					<button type="submit" class="button jw-btn-primary">Add Category</button>
				</form>

				<table class="jw-table">
					<thead>
						<tr>
							<th>Category Name</th>
							<th>Rename Category</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $gal_cats as $cat_name ) : ?>
							<tr>
								<td><strong><?php echo esc_html( $cat_name ); ?></strong></td>
								<td>
									<form method="post" style="display:flex;gap:6px;">
										<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
										<input type="hidden" name="jw_sub_action" value="rename_gallery_category" />
										<input type="hidden" name="old_category_name" value="<?php echo esc_attr( $cat_name ); ?>" />
										<input type="text" name="new_category_name" value="<?php echo esc_attr( $cat_name ); ?>" style="width:170px;" />
										<button type="submit" class="button">Rename</button>
									</form>
								</td>
								<td>
									<?php if ( count( $gal_cats ) > 1 ) : ?>
										<form method="post" onsubmit="return confirm('Remove this category tab?');">
											<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
											<input type="hidden" name="jw_sub_action" value="delete_gallery_category" />
											<input type="hidden" name="del_category_name" value="<?php echo esc_attr( $cat_name ); ?>" />
											<button type="submit" class="button">Delete</button>
										</form>
									<?php endif; ?>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Gallery Page Header, Teal Banner Card & Bottom Contact Card Settings -->
		<div class="jw-card">
			<h3>Gallery Page Header, Teal Inner Banner Card & Bottom Contact Card Settings</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_gallery_meta" />
				<div class="jw-grid-3">
					<div>
						<label><strong>Page Title</strong><br/><input type="text" name="gal_page_title" value="<?php echo esc_attr( $gal_meta['pageTitle'] ); ?>" class="large-text" /></label>
					</div>
					<div>
						<label><strong>Count Badge Text</strong><br/><input type="text" name="gal_count_badge" value="<?php echo esc_attr( $gal_meta['countBadgeText'] ); ?>" class="regular-text" /></label>
					</div>
					<div>
						<label><input type="checkbox" name="gal_show_teal_banner" value="1" <?php checked( ! empty( $gal_meta['showTealBanner'] ) ); ?> /> <strong>Show Teal Inner Card</strong></label><br/>
						<label><input type="checkbox" name="gal_show_bottom_card" value="1" <?php checked( ! empty( $gal_meta['showBottomCard'] ) ); ?> /> <strong>Show Bottom Contact Card</strong></label>
					</div>
				</div>
				<p><label><strong>Page Tagline</strong><br/><textarea name="gal_page_tagline" rows="2" class="large-text"><?php echo esc_textarea( $gal_meta['pageTagline'] ); ?></textarea></label></p>

				<div class="jw-grid-2">
					<div>
						<h4>Teal Inner Card Settings</h4>
						<p><label>Badge: <input type="text" name="gal_org_badge" value="<?php echo esc_attr( $gal_meta['organizationBannerBadge'] ); ?>" class="large-text" /></label></p>
						<p><label>Title: <input type="text" name="gal_org_title" value="<?php echo esc_attr( $gal_meta['organizationBannerTitle'] ); ?>" class="large-text" /></label></p>
						<p><label>Subtitle: <textarea name="gal_org_subtitle" rows="2" class="large-text"><?php echo esc_textarea( $gal_meta['organizationBannerSubtitle'] ); ?></textarea></label></p>
						<p>
							Stat 1: <input type="text" name="gal_stat1_val" value="<?php echo esc_attr( $gal_meta['stat1Value'] ); ?>" style="width:90px;" /> <input type="text" name="gal_stat1_lbl" value="<?php echo esc_attr( $gal_meta['stat1Label'] ); ?>" style="width:130px;" /><br/>
							Stat 2: <input type="text" name="gal_stat2_val" value="<?php echo esc_attr( $gal_meta['stat2Value'] ); ?>" style="width:90px;" /> <input type="text" name="gal_stat2_lbl" value="<?php echo esc_attr( $gal_meta['stat2Label'] ); ?>" style="width:130px;" /><br/>
							Stat 3: <input type="text" name="gal_stat3_val" value="<?php echo esc_attr( $gal_meta['stat3Value'] ); ?>" style="width:90px;" /> <input type="text" name="gal_stat3_lbl" value="<?php echo esc_attr( $gal_meta['stat3Label'] ); ?>" style="width:130px;" />
						</p>
					</div>
					<div>
						<h4>Bottom Contact Card Settings</h4>
						<p><label>Card Title: <input type="text" name="gal_bottom_title" value="<?php echo esc_attr( $gal_meta['bottomCardTitle'] ); ?>" class="large-text" /></label></p>
						<p><label>Description: <textarea name="gal_bottom_desc" rows="3" class="large-text"><?php echo esc_textarea( $gal_meta['bottomCardDescription'] ); ?></textarea></label></p>
						<p><label>Button Text: <input type="text" name="gal_bottom_btn" value="<?php echo esc_attr( $gal_meta['bottomCardButtonText'] ); ?>" class="regular-text" /></label></p>
					</div>
				</div>
				<p><button type="submit" class="button jw-btn-primary">Save Gallery Page & Teal Card Settings</button></p>
			</form>
		</div>

		<!-- Existing Gallery Photos & Group Albums Table -->
		<div class="jw-card">
			<h3>Existing Gallery Photos & Group Albums (<?php echo count( $gallery_rows ); ?>)</h3>
			<table class="jw-table">
				<thead>
					<tr>
						<th>Preview</th>
						<th>Title & Category</th>
						<th>Type (Single / Group Album)</th>
						<th>Location & Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $gallery_rows as $g_row ) : ?>
						<?php
						$grp_arr   = ! empty( $g_row['group_images_json'] ) ? json_decode( $g_row['group_images_json'], true ) : array();
						$grp_count = is_array( $grp_arr ) ? count( $grp_arr ) : 1;
						?>
						<tr>
							<td><img src="<?php echo esc_url( $g_row['image_url'] ); ?>" class="jw-thumb-preview" alt="Gallery" /></td>
							<td>
								<strong><?php echo esc_html( $g_row['title'] ); ?></strong><br/>
								<span class="jw-badge jw-badge-teal"><?php echo esc_html( $g_row['category'] ); ?></span>
							</td>
							<td>
								<?php if ( $grp_count > 1 ) : ?>
									<span class="jw-badge jw-badge-saffron">Group Album (<?php echo esc_html( $grp_count ); ?> Photos)</span>
								<?php else : ?>
									<span class="jw-badge jw-badge-green">Single Photo</span>
								<?php endif; ?>
							</td>
							<td>
								<?php echo esc_html( $g_row['location'] ); ?><br/>
								<small><?php echo esc_html( $g_row['event_date'] ); ?></small>
							</td>
							<td>
								<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=gallery&edit_gallery=' . $g_row['id'] ) ); ?>" class="button">Edit</a>
								<form method="post" style="display:inline;" onsubmit="return confirm('Delete this photo/album from Gallery?');">
									<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
									<input type="hidden" name="jw_sub_action" value="delete_gallery" />
									<input type="hidden" name="gallery_id" value="<?php echo esc_attr( $g_row['id'] ); ?>" />
									<button type="submit" class="button">Delete</button>
								</form>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 5: SANKALP MANAGEMENT (COMPLETE SankalpContentConfig + DESH/KALA, STEPS, BENEFITS)
	// =============================================================================
	if ( 'sankalp' === $active_tab ) :
		$sk = $site_pages['sankalp'];
		?>
		<div class="jw-card">
			<h3>Sankalp Mantra Management (संकल्प मंत्र — लघु, विस्तृत, देश/काल, विधि एवं लाभ)</h3>
			<p>Dynamic Panchang placeholders supported inside Sankalp templates: <code>{संवत्सर}</code>, <code>{अयन}</code>, <code>{ऋतु}</code>, <code>{मास}</code>, <code>{पक्ष}</code>, <code>{तिथि}</code>, <code>{वार}</code>, <code>{नक्षत्र}</code>, <code>{योग}</code>, <code>{करण}</code>, <code>{चन्द्र_राशि}</code>, <code>{सूर्य_राशि}</code>, <code>{बृहस्पति_राशि}</code>.</p>
			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_sankalp_content" />

				<div class="jw-grid-2">
					<div>
						<label><strong>Page Title (शीर्षक)</strong><br/>
						<input type="text" name="sk_title" value="<?php echo esc_attr( $sk['title'] ); ?>" class="large-text" /></label>
					</div>
					<div>
						<label><strong>Page Tagline (उपशीर्षक)</strong><br/>
						<input type="text" name="sk_tagline" value="<?php echo esc_attr( $sk['tagline'] ); ?>" class="large-text" /></label>
					</div>
				</div>

				<div class="jw-grid-2">
					<div>
						<h4>Laghu Sankalp (लघु संकल्प — दैनिक पूजा हेतु)</h4>
						<p><label>Laghu Title:<br/><input type="text" name="sk_laghu_title" value="<?php echo esc_attr( $sk['laghuTitle'] ); ?>" class="large-text" /></label></p>
						<p><label>Laghu Subtitle:<br/><input type="text" name="sk_laghu_subtitle" value="<?php echo esc_attr( $sk['laghuSubtitle'] ); ?>" class="large-text" /></label></p>
						<p><label>Laghu Sankalp Mantra Text:<br/><textarea name="sk_laghu_text" rows="6" class="large-text"><?php echo esc_textarea( $sk['laghuText'] ); ?></textarea></label></p>
					</div>
					<div>
						<h4>Vistrit Sankalp (विस्तृत संकल्प — महापूजा एवं अनुष्ठान हेतु)</h4>
						<p><label>Vistrit Title:<br/><input type="text" name="sk_vistrit_title" value="<?php echo esc_attr( $sk['vistritTitle'] ); ?>" class="large-text" /></label></p>
						<p><label>Vistrit Subtitle:<br/><input type="text" name="sk_vistrit_subtitle" value="<?php echo esc_attr( $sk['vistritSubtitle'] ); ?>" class="large-text" /></label></p>
						<p><label>Vistrit Sankalp Mantra Text:<br/><textarea name="sk_vistrit_text" rows="6" class="large-text"><?php echo esc_textarea( $sk['vistritText'] ); ?></textarea></label></p>
					</div>
				</div>

				<h4>Desh/Kala Clauses, Step-by-Step Vidhi & Spiritual Benefits</h4>
				<div class="jw-grid-3">
					<div>
						<label><strong>Desh / Kala Clauses (देश एवं काल वाक्यांश)</strong><br/>
						<textarea name="sk_desh_kala" rows="4" class="large-text"><?php echo esc_textarea( $sk['deshKalaClauses'] ); ?></textarea></label>
					</div>
					<div>
						<label><strong>Sankalp Vidhi Steps (संकल्प लेने की चरणबद्ध विधि)</strong><br/>
						<textarea name="sk_steps" rows="4" class="large-text"><?php echo esc_textarea( $sk['steps'] ); ?></textarea></label>
					</div>
					<div>
						<label><strong>Sankalp Benefits (संकल्प का शास्त्रीय महत्व व लाभ)</strong><br/>
						<textarea name="sk_benefits" rows="4" class="large-text"><?php echo esc_textarea( $sk['benefits'] ); ?></textarea></label>
					</div>
				</div>

				<h4>Sankalp Important Notes (संकल्प मार्गदर्शिका नोट्स 1, 2, 3)</h4>
				<div class="jw-grid-3">
					<div>
						<p><label>Note 1 Title:<br/><input type="text" name="sk_note1_title" value="<?php echo esc_attr( $sk['note1Title'] ); ?>" class="large-text" /></label></p>
						<p><label>Note 1 Text:<br/><textarea name="sk_note1_text" rows="4" class="large-text"><?php echo esc_textarea( $sk['note1Text'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label>Note 2 Title:<br/><input type="text" name="sk_note2_title" value="<?php echo esc_attr( $sk['note2Title'] ); ?>" class="large-text" /></label></p>
						<p><label>Note 2 Text:<br/><textarea name="sk_note2_text" rows="4" class="large-text"><?php echo esc_textarea( $sk['note2Text'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label>Note 3 Title:<br/><input type="text" name="sk_note3_title" value="<?php echo esc_attr( $sk['note3Title'] ); ?>" class="large-text" /></label></p>
						<p><label>Note 3 Text:<br/><textarea name="sk_note3_text" rows="4" class="large-text"><?php echo esc_textarea( $sk['note3Text'] ); ?></textarea></label></p>
					</div>
				</div>

				<p>
					<button type="submit" class="button jw-btn-primary">Save Sankalp Content</button>
					<button type="submit" name="reset_sankalp_defaults" value="1" class="button" onclick="return confirm('Reset Sankalp content to original Vedic defaults?');">Reset to Defaults</button>
				</p>
			</form>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 6: ABOUT US MANAGEMENT (COMPLETE AboutUsContentConfig + FEATURES, STATS, ACHARYA MSG)
	// =============================================================================
	if ( 'about' === $active_tab ) :
		$ab = $site_pages['about'];
		?>
		<div class="jw-card">
			<h3>About Us Management (हमारे बारे में — संपूर्ण विवरण, स्तंभ, विशेषताएं एवं आचार्य संदेश)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_about_content" />

				<div class="jw-grid-2">
					<div>
						<p><label><strong>Page Title</strong><br/><input type="text" name="ab_title" value="<?php echo esc_attr( $ab['title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Introduction Heading (introTitle)</strong><br/><input type="text" name="ab_intro_title" value="<?php echo esc_attr( $ab['introTitle'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Introduction Text (introText)</strong><br/><textarea name="ab_intro_text" rows="4" class="large-text"><?php echo esc_textarea( $ab['introText'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label><strong>Page Tagline</strong><br/><input type="text" name="ab_tagline" value="<?php echo esc_attr( $ab['tagline'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Vision / Mission Heading (missionTitle)</strong><br/><input type="text" name="ab_mission_title" value="<?php echo esc_attr( $ab['missionTitle'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Vision / Mission Text (missionText)</strong><br/><textarea name="ab_mission_text" rows="4" class="large-text"><?php echo esc_textarea( $ab['missionText'] ); ?></textarea></label></p>
					</div>
				</div>

				<p><label><strong>Core Pillars Section Heading (pillarsTitle)</strong><br/><input type="text" name="ab_pillars_title" value="<?php echo esc_attr( $ab['pillarsTitle'] ); ?>" class="regular-text" /></label></p>
				<div class="jw-grid-3">
					<div>
						<p><label><strong>Pillar 1 Title</strong><br/><input type="text" name="ab_pillar1_title" value="<?php echo esc_attr( $ab['pillar1Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Pillar 1 Description</strong><br/><textarea name="ab_pillar1_text" rows="3" class="large-text"><?php echo esc_textarea( $ab['pillar1Text'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label><strong>Pillar 2 Title</strong><br/><input type="text" name="ab_pillar2_title" value="<?php echo esc_attr( $ab['pillar2Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Pillar 2 Description</strong><br/><textarea name="ab_pillar2_text" rows="3" class="large-text"><?php echo esc_textarea( $ab['pillar2Text'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label><strong>Pillar 3 Title</strong><br/><input type="text" name="ab_pillar3_title" value="<?php echo esc_attr( $ab['pillar3Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Pillar 3 Description</strong><br/><textarea name="ab_pillar3_text" rows="3" class="large-text"><?php echo esc_textarea( $ab['pillar3Text'] ); ?></textarea></label></p>
					</div>
				</div>

				<div class="jw-grid-2">
					<div>
						<p><label><strong>Tradition & Technology Heading (traditionTitle)</strong><br/><input type="text" name="ab_tradition_title" value="<?php echo esc_attr( $ab['traditionTitle'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Tradition & Technology Text (traditionText)</strong><br/><textarea name="ab_tradition_text" rows="3" class="large-text"><?php echo esc_textarea( $ab['traditionText'] ); ?></textarea></label></p>
						<p><label><strong>Acharya Message (आचार्य संदेश — acharyaMessage)</strong><br/><textarea name="ab_acharya_message" rows="3" class="large-text"><?php echo esc_textarea( $ab['acharyaMessage'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label><strong>Key App Features (प्रमुख विशेषताएं — features)</strong><br/><textarea name="ab_features" rows="4" class="large-text"><?php echo esc_textarea( $ab['features'] ); ?></textarea></label></p>
						<p><label><strong>Sansthan Statistics Summary (statistics)</strong><br/><input type="text" name="ab_statistics" value="<?php echo esc_attr( $ab['statistics'] ); ?>" class="large-text" /></label></p>
						<p>
							<label><strong>Founder / Acharya Name:</strong> <input type="text" name="ab_founder_name" value="<?php echo esc_attr( $ab['founderName'] ); ?>" class="regular-text" /></label><br/><br/>
							<label><strong>Education:</strong> <input type="text" name="ab_education" value="<?php echo esc_attr( $ab['education'] ); ?>" class="regular-text" /></label><br/><br/>
							<label><strong>University:</strong> <input type="text" name="ab_university" value="<?php echo esc_attr( $ab['university'] ); ?>" class="regular-text" /></label><br/><br/>
							<label><strong>Contact Email:</strong> <input type="email" name="ab_contact_email" value="<?php echo esc_attr( $ab['contactEmail'] ); ?>" class="regular-text" /></label>
						</p>
					</div>
				</div>

				<p>
					<button type="submit" class="button jw-btn-primary">Save About Us Content</button>
					<button type="submit" name="reset_about_defaults" value="1" class="button" onclick="return confirm('Reset About Us content to original defaults?');">Reset to Defaults</button>
				</p>
			</form>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 7: PRIVACY POLICY MANAGEMENT (COMPLETE PrivacyPolicyContentConfig)
	// =============================================================================
	if ( 'privacy' === $active_tab ) :
		$pr = $site_pages['privacy'];
		?>
		<div class="jw-card">
			<h3>Privacy Policy Management (गोपनीयता नीति — संपूर्ण 5 अनुभाग)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_privacy_content" />

				<div class="jw-grid-3">
					<div>
						<label><strong>Page Title</strong><br/><input type="text" name="pr_title" value="<?php echo esc_attr( $pr['title'] ); ?>" class="large-text" /></label>
					</div>
					<div>
						<label><strong>Security Badge Text</strong><br/><input type="text" name="pr_badge_text" value="<?php echo esc_attr( $pr['badgeText'] ); ?>" class="large-text" /></label>
					</div>
					<div>
						<label><strong>Last Updated & Contact Email</strong><br/>
						<input type="text" name="pr_last_updated" value="<?php echo esc_attr( $pr['lastUpdated'] ); ?>" style="width:45%;" />
						<input type="email" name="pr_contact_email" value="<?php echo esc_attr( $pr['contactEmail'] ); ?>" style="width:50%;" /></label>
					</div>
				</div>
				<p><label><strong>Page Tagline</strong><br/><input type="text" name="pr_tagline" value="<?php echo esc_attr( $pr['tagline'] ); ?>" class="large-text" /></label></p>

				<div class="jw-grid-2">
					<div>
						<p><label><strong>Section 1 Title</strong><br/><input type="text" name="pr_sec1_title" value="<?php echo esc_attr( $pr['section1Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Section 1 Text</strong><br/><textarea name="pr_sec1_text" rows="3" class="large-text"><?php echo esc_textarea( $pr['section1Text'] ); ?></textarea></label></p>

						<p><label><strong>Section 2 Title</strong><br/><input type="text" name="pr_sec2_title" value="<?php echo esc_attr( $pr['section2Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Section 2 Text</strong><br/><textarea name="pr_sec2_text" rows="3" class="large-text"><?php echo esc_textarea( $pr['section2Text'] ); ?></textarea></label></p>

						<p><label><strong>Section 3 Title</strong><br/><input type="text" name="pr_sec3_title" value="<?php echo esc_attr( $pr['section3Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Section 3 Text</strong><br/><textarea name="pr_sec3_text" rows="3" class="large-text"><?php echo esc_textarea( $pr['section3Text'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label><strong>Section 4 Title</strong><br/><input type="text" name="pr_sec4_title" value="<?php echo esc_attr( $pr['section4Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Section 4 Text</strong><br/><textarea name="pr_sec4_text" rows="3" class="large-text"><?php echo esc_textarea( $pr['section4Text'] ); ?></textarea></label></p>

						<p><label><strong>Section 5 Title</strong><br/><input type="text" name="pr_sec5_title" value="<?php echo esc_attr( $pr['section5Title'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Section 5 Text</strong><br/><textarea name="pr_sec5_text" rows="3" class="large-text"><?php echo esc_textarea( $pr['section5Text'] ); ?></textarea></label></p>
					</div>
				</div>

				<p>
					<button type="submit" class="button jw-btn-primary">Save Privacy Policy</button>
					<button type="submit" name="reset_privacy_defaults" value="1" class="button" onclick="return confirm('Reset Privacy Policy to original defaults?');">Reset to Defaults</button>
				</p>
			</form>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 8: RASHIFAL (12 ZODIAC SIGNS X 4 PERIODS) & WORDPRESS ARTICLES
	// =============================================================================
	if ( 'rashifal' === $active_tab ) :
		$active_period = sanitize_key( $_GET['rashi_period'] ?? 'daily' );
		if ( ! in_array( $active_period, array( 'daily', 'weekly', 'monthly', 'yearly' ), true ) ) {
			$active_period = 'daily';
		}
		$rashifal_rows = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t_rashifal} WHERE period = %s ORDER BY id ASC", $active_period ), ARRAY_A ); // phpcs:ignore
		?>
		<div class="jw-card">
			<h3>WordPress Articles & Categories Integration</h3>
			<p>Your JyotishWala Android App fetches published WordPress articles and categories via <code>/wp-json/jyotishwala/v1/posts</code> and <code>/wp-json/jyotishwala/v1/categories</code>.</p>
			<p>
				<a href="<?php echo esc_url( admin_url( 'edit.php' ) ); ?>" class="button jw-btn-primary">Manage WordPress Articles (Posts)</a>
				<a href="<?php echo esc_url( admin_url( 'post-new.php' ) ); ?>" class="button jw-btn-saffron">Write New Article</a>
				<a href="<?php echo esc_url( admin_url( 'edit-tags.php?taxonomy=category' ) ); ?>" class="button">Manage Categories</a>
			</p>
		</div>

		<div class="jw-card">
			<h3>Rashifal Management (12 Zodiac Signs — Daily, Weekly, Monthly, Yearly)</h3>
			<p>
				<?php foreach ( array( 'daily' => 'Daily (दैनिक)', 'weekly' => 'Weekly (साप्ताहिक)', 'monthly' => 'Monthly (मासिक)', 'yearly' => 'Yearly (वार्षिक)' ) as $p_key => $p_label ) : ?>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=jw-app-content&tab=rashifal&rashi_period=' . $p_key ) ); ?>"
					   class="button <?php echo ( $active_period === $p_key ) ? 'jw-btn-primary' : ''; ?>">
						<?php echo esc_html( $p_label ); ?>
					</a>
				<?php endforeach; ?>
			</p>

			<div class="jw-item-grid">
				<?php foreach ( $rashifal_rows as $r_row ) : ?>
					<form method="post" class="jw-item-card">
						<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
						<input type="hidden" name="jw_sub_action" value="save_rashifal" />
						<input type="hidden" name="rashifal_id" value="<?php echo esc_attr( $r_row['id'] ); ?>" />

						<div class="jw-item-header">
							<div>
								<h4 class="jw-item-title">
									<?php echo esc_html( $r_row['rashi_name_hi'] . ' (' . $r_row['rashi_name_en'] . ')' ); ?>
								</h4>
								<span class="jw-item-meta">Period: <strong><?php echo esc_html( strtoupper( $active_period ) ); ?></strong> • Slug: <code><?php echo esc_html( $r_row['rashi_id'] ?? '' ); ?></code></span>
							</div>
							<span class="jw-badge <?php echo 'published' === $r_row['status'] ? 'jw-badge-green' : 'jw-badge-orange'; ?>">
								<?php echo esc_html( strtoupper( $r_row['status'] ) ); ?>
							</span>
						</div>

						<div class="jw-grid-2">
							<div class="jw-field-group">
								<label>Hindi Prediction (हिंदी राशिफल)</label>
								<textarea name="prediction_hi" rows="3" class="large-text"><?php echo esc_textarea( $r_row['prediction_hi'] ); ?></textarea>
							</div>
							<div class="jw-field-group">
								<label>English Prediction</label>
								<textarea name="prediction_en" rows="3" class="large-text"><?php echo esc_textarea( $r_row['prediction_en'] ); ?></textarea>
							</div>
						</div>

						<div class="jw-grid-2" style="margin-top:10px;">
							<div class="jw-field-group">
								<label>Career / Finance (करियर एवं धन)</label>
								<input type="text" name="career_hi" value="<?php echo esc_attr( $r_row['career_hi'] ); ?>" placeholder="Career prediction..." />
							</div>
							<div class="jw-field-group">
								<label>Family / Love (परिवार एवं संबंध)</label>
								<input type="text" name="love_hi" value="<?php echo esc_attr( $r_row['love_hi'] ); ?>" placeholder="Family/Love prediction..." />
							</div>
							<div class="jw-field-group">
								<label>Health (स्वास्थ्य)</label>
								<input type="text" name="health_hi" value="<?php echo esc_attr( $r_row['health_hi'] ); ?>" placeholder="Health prediction..." />
							</div>
							<div class="jw-field-group">
								<label>Vedic Remedy (वैदिक उपाय)</label>
								<input type="text" name="remedy_hi" value="<?php echo esc_attr( $r_row['remedy_hi'] ); ?>" placeholder="Vedic Remedy..." />
							</div>
						</div>

						<div class="jw-grid-3" style="margin-top:10px;">
							<div class="jw-field-group">
								<label>Lucky Number (शुभ अंक)</label>
								<input type="text" name="lucky_number" value="<?php echo esc_attr( $r_row['lucky_number'] ); ?>" />
							</div>
							<div class="jw-field-group">
								<label>Lucky Color (शुभ रंग)</label>
								<input type="text" name="lucky_color" value="<?php echo esc_attr( $r_row['lucky_color'] ); ?>" />
							</div>
							<div class="jw-field-group">
								<label>Publish Status</label>
								<select name="status">
									<option value="published" <?php selected( $r_row['status'], 'published' ); ?>>Published (Visible in App)</option>
									<option value="draft" <?php selected( $r_row['status'], 'draft' ); ?>>Draft / Hidden</option>
								</select>
							</div>
						</div>

						<div class="jw-actions-row">
							<button type="submit" class="button jw-btn-primary">Save <?php echo esc_html( $r_row['rashi_name_hi'] ); ?> Rashifal</button>
						</div>
					</form>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endif; ?>

	<?php
	// =============================================================================
	// TAB 9: USER REVIEWS MODERATION & SECTION META
	// =============================================================================
	if ( 'reviews' === $active_tab ) :
		$reviews_rows = $wpdb->get_results( "SELECT * FROM {$t_reviews} ORDER BY id DESC LIMIT 60", ARRAY_A ); // phpcs:ignore
		$rev_meta     = $site_pages['reviewMeta'];
		?>
		<div class="jw-card">
			<h3>Review Section Heading & Moderation Settings</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="save_review_meta" />
				<div class="jw-grid-2">
					<div>
						<p><label><strong>Home / Slider Section Title</strong><br/><input type="text" name="rev_sec_title" value="<?php echo esc_attr( $rev_meta['sectionTitle'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Home / Slider Section Subtitle</strong><br/><textarea name="rev_sec_subtitle" rows="2" class="large-text"><?php echo esc_textarea( $rev_meta['sectionSubtitle'] ); ?></textarea></label></p>
					</div>
					<div>
						<p><label><strong>Dedicated Reviews Page Title</strong><br/><input type="text" name="rev_page_title" value="<?php echo esc_attr( $rev_meta['pageTitle'] ); ?>" class="large-text" /></label></p>
						<p><label><strong>Dedicated Reviews Page Tagline</strong><br/><textarea name="rev_page_tagline" rows="2" class="large-text"><?php echo esc_textarea( $rev_meta['pageTagline'] ); ?></textarea></label></p>
						<p><label><input type="checkbox" name="rev_auto_approve" value="1" <?php checked( ! empty( $rev_meta['autoApproveNewReviews'] ) ); ?> /> Auto-Approve New User Reviews Immediately</label></p>
					</div>
				</div>
				<p><button type="submit" class="button jw-btn-primary">Save Review Settings</button></p>
			</form>
		</div>

		<div class="jw-card">
			<h3>Add Verified User Review (Admin Manual Entry)</h3>
			<form method="post">
				<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
				<input type="hidden" name="jw_sub_action" value="add_admin_review" />
				<div class="jw-grid-3">
					<div>
						<label><strong>User Name *</strong><br/><input type="text" name="new_rev_name" required placeholder="यजमान का नाम" class="regular-text" /></label>
					</div>
					<div>
						<label><strong>City / State</strong><br/><input type="text" name="new_rev_city" placeholder="ऋषिकेश, उत्तराखंड" class="regular-text" /></label>
					</div>
					<div>
						<label><strong>Service Category & Rating</strong><br/>
						<input type="text" name="new_rev_category" value="जन्मकुंडली एवं फलादेश" style="width:65%;" />
						<select name="new_rev_rating" style="width:30%;">
							<option value="5">5 ★</option>
							<option value="4">4 ★</option>
							<option value="3">3 ★</option>
							<option value="2">2 ★</option>
							<option value="1">1 ★</option>
						</select></label>
					</div>
				</div>
				<div class="jw-grid-2">
					<div>
						<label><strong>Review Comment *</strong><br/><textarea name="new_rev_comment" rows="2" required class="large-text"></textarea></label>
					</div>
					<div>
						<label><strong>Official JyotishWala Reply (Optional)</strong><br/><textarea name="new_rev_reply" rows="2" class="large-text"></textarea></label>
					</div>
				</div>
				<p>
					<label><input type="checkbox" name="new_rev_verified" value="1" checked /> Mark as Verified User Review (<code>is_verified = 1</code>)</label>
				</p>
				<p><button type="submit" class="button jw-btn-primary">Add Review</button></p>
			</form>
		</div>

		<div class="jw-card">
			<h3>User Reviews Moderation & Official JyotishWala Replies (<?php echo count( $reviews_rows ); ?>)</h3>
			<div class="jw-item-grid">
				<?php foreach ( $reviews_rows as $rev ) : ?>
					<form method="post" class="jw-item-card">
						<?php wp_nonce_field( 'jw_content_action', 'jw_content_nonce' ); ?>
						<input type="hidden" name="jw_sub_action" value="moderate_review" />
						<input type="hidden" name="review_id" value="<?php echo esc_attr( $rev['id'] ); ?>" />

						<div class="jw-item-header">
							<div>
								<h4 class="jw-item-title">
									<?php echo esc_html( $rev['user_name'] ); ?>
									<span style="color:#FF7F33; margin-left:6px;"><?php echo esc_html( $rev['rating'] ); ?> ★</span>
								</h4>
								<span class="jw-item-meta">
									City: <?php echo esc_html( $rev['user_city'] ?: '—' ); ?> • Category: <?php echo esc_html( $rev['service_category'] ); ?> • Date: <?php echo esc_html( $rev['created_at'] ); ?>
								</span>
							</div>
							<span class="jw-badge <?php echo 'approved' === $rev['status'] ? 'jw-badge-green' : ( 'declined' === $rev['status'] ? 'jw-badge-red' : 'jw-badge-orange' ); ?>">
								<?php echo esc_html( strtoupper( $rev['status'] ) ); ?>
							</span>
						</div>

						<div class="jw-grid-2">
							<div class="jw-field-group">
								<label>User Review Comment</label>
								<div style="background:#FAF7F2; border:1px solid rgba(0,128,128,0.18); border-radius:8px; padding:10px; font-size:13px;">
									<?php echo esc_html( $rev['comment'] ); ?>
								</div>
							</div>
							<div class="jw-field-group">
								<label>Official Reply (JyotishWala)</label>
								<textarea name="admin_reply" rows="3" class="large-text" placeholder="Write official reply..."><?php echo esc_textarea( $rev['admin_reply'] ); ?></textarea>
							</div>
						</div>

						<div class="jw-grid-2" style="margin-top:10px;">
							<div class="jw-field-group">
								<label>Verification Badge</label>
								<label style="display:flex;align-items:center;gap:8px;font-weight:600;margin-top:4px;">
									<input type="checkbox" name="is_verified" value="1" <?php checked( (int) $rev['is_verified'], 1 ); ?> />
									<span>Show Verified User Badge in App</span>
								</label>
							</div>
							<div class="jw-field-group">
								<label>Moderation Action</label>
								<select name="review_status">
									<option value="approved" <?php selected( $rev['status'], 'approved' ); ?>>Approved (Visible in App)</option>
									<option value="pending" <?php selected( $rev['status'], 'pending' ); ?>>Pending Moderation</option>
									<option value="declined" <?php selected( $rev['status'], 'declined' ); ?>>Declined / Hidden</option>
									<option value="delete">Delete Permanently</option>
								</select>
							</div>
						</div>

						<div class="jw-actions-row">
							<button type="submit" class="button jw-btn-primary">Save Review & Reply</button>
						</div>
					</form>
				<?php endforeach; ?>
			</div>
		</div>
	<?php endif; ?>
</div>
