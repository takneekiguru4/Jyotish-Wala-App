<?php
/**
 * Panchang Calculation & External Provider Gateway for JyotishWala Backend.
 *
 * - Default Location: Rishikesh, Uttarakhand, India (30.0869°N, 78.2676°E)
 * - Default Timezone: Asia/Kolkata
 * - Supports external Panchang API (if configured & enabled in API Vault) OR
 *   deterministic astronomical Lahiri Chitra Paksha calculation (no fake/random data).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Panchang_API {

	/**
	 * Computes or fetches daily Panchang for given date and coordinates.
	 *
	 * @param string $date_str  YYYY-MM-DD.
	 * @param float  $lat       Latitude.
	 * @param float  $lng       Longitude.
	 * @param string $city_name Location label.
	 * @return array
	 */
	public static function get_panchang( $date_str = '', $lat = null, $lng = null, $city_name = '' ) {
		$settings = JW_Settings::get_panchang_settings();

		if ( empty( $date_str ) || ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date_str ) ) {
			$tz       = new DateTimeZone( $settings['default_timezone'] ?: 'Asia/Kolkata' );
			$now      = new DateTime( 'now', $tz );
			$date_str = $now->format( 'Y-m-d' );
		}

		$lat       = ( null !== $lat && '' !== $lat ) ? (float) $lat : (float) $settings['default_latitude'];
		$lng       = ( null !== $lng && '' !== $lng ) ? (float) $lng : (float) $settings['default_longitude'];
		$city_name = ! empty( $city_name ) ? sanitize_text_field( $city_name ) : $settings['default_city_name'];

		// 1. Check if an external Panchang API is configured & selected
		if ( 'external_api' === $settings['calculation_provider'] ) {
			$ext = self::call_external_panchang_api( $date_str, $lat, $lng, $city_name );
			if ( ! is_wp_error( $ext ) && ! empty( $ext ) ) {
				return $ext;
			}
			JW_Logging::log( 'panchang', 'warning', 'External Panchang API unavailable; using built-in Lahiri astronomical engine.' );
		}

		// 2. Built-in Astronomical Siddhantic Calculation (Lahiri Chitra Paksha Ayanamsha)
		return self::calculate_astronomical_panchang( $date_str, $lat, $lng, $city_name, $settings );
	}

	/**
	 * Calls external Panchang provider configured in wp_jw_api_vault (if enabled).
	 */
	private static function call_external_panchang_api( $date_str, $lat, $lng, $city_name ) {
		global $wpdb;
		$t_api = JW_Database::table( 'api_vault' );
		$api   = $wpdb->get_row( "SELECT * FROM {$t_api} WHERE module = 'panchang' AND is_enabled = 1 LIMIT 1", ARRAY_A ); // phpcs:ignore

		if ( ! $api || empty( $api['endpoint_url'] ) || false !== strpos( $api['endpoint_url'], '/wp-json/jyotishwala/v1/panchang' ) ) {
			return new WP_Error( 'no_external_panchang_api', 'No external Panchang endpoint configured.' );
		}

		$headers   = array( 'Accept' => 'application/json' );
		$plain_key = ! empty( $api['api_key'] ) ? JW_Settings::decrypt_secret( $api['api_key'] ) : '';
		if ( ! empty( $plain_key ) ) {
			if ( 'Bearer Token' === $api['auth_type'] ) {
				$headers['Authorization'] = 'Bearer ' . $plain_key;
			} else {
				$headers['X-API-Key'] = $plain_key;
			}
		}

		$response = wp_remote_post(
			$api['endpoint_url'],
			array(
				'timeout' => 8,
				'headers' => $headers,
				'body'    => wp_json_encode(
					array(
						'date'      => $date_str,
						'latitude'  => $lat,
						'longitude' => $lng,
						'location'  => $city_name,
						'timezone'  => 'Asia/Kolkata',
					)
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			JW_Logging::log( 'panchang', 'error', 'External Panchang API error: ' . $response->get_error_message() );
			return $response;
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		$wpdb->query( $wpdb->prepare( "UPDATE {$t_api} SET usage_count = usage_count + 1 WHERE id = %d", (int) $api['id'] ) ); // phpcs:ignore

		if ( 200 === $code && is_array( $body ) ) {
			return $body;
		}

		return new WP_Error( 'external_panchang_bad_status', 'HTTP ' . $code );
	}

	/**
	 * Deterministic Lahiri Chitra Paksha astronomical Panchang calculation for any date & coordinates.
	 */
	public static function calculate_astronomical_panchang( $date_str, $lat, $lng, $city_name, $settings ) {
		$parts = array_map( 'intval', explode( '-', $date_str ) );
		$year  = $parts[0];
		$month = $parts[1];
		$day   = $parts[2];

		// Julian Day at 06:00 IST (00:30 UTC)
		$a  = intdiv( 14 - $month, 12 );
		$y  = $year + 4800 - $a;
		$m  = $month + 12 * $a - 3;
		$jd = $day + intdiv( 153 * $m + 2, 5 ) + 365 * $y + intdiv( $y, 4 ) - intdiv( $y, 100 ) + intdiv( $y, 400 ) - 32045 - 0.4791667;

		$d = $jd - 2451545.0;

		// Lahiri Ayanamsha
		$ayanamsha = 23.85 + ( $d / 365.25 ) * 0.01397;

		// Sun true longitude
		$g_sun     = deg2rad( fmod( 357.529 + 0.98560028 * $d, 360.0 ) );
		$q_sun     = fmod( 280.459 + 0.98564736 * $d, 360.0 );
		$sun_trop  = fmod( $q_sun + 1.915 * sin( $g_sun ) + 0.020 * sin( 2 * $g_sun ) + 360.0, 360.0 );
		$sun_nir   = fmod( $sun_trop - $ayanamsha + 360.0, 360.0 );

		// Moon true longitude
		$l_moon    = fmod( 218.316 + 13.176396 * $d, 360.0 );
		$m_moon    = deg2rad( fmod( 134.963 + 13.064993 * $d, 360.0 ) );
		$d_elong   = deg2rad( fmod( 297.850 + 12.190749 * $d, 360.0 ) );
		$moon_trop = fmod( $l_moon + 6.289 * sin( $m_moon ) + 1.274 * sin( 2 * $d_elong - $m_moon ) + 0.658 * sin( 2 * $d_elong ) + 360.0, 360.0 );
		$moon_nir  = fmod( $moon_trop - $ayanamsha + 360.0, 360.0 );

		// Tithi (1..30)
		$diff      = fmod( $moon_nir - $sun_nir + 360.0, 360.0 );
		$tithi_num = (int) floor( $diff / 12.0 ) + 1;
		$paksha    = ( $tithi_num <= 15 ) ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';

		$tithi_names = array(
			1  => 'प्रतिपदा', 2 => 'द्वितीया', 3 => 'तृतीया', 4 => 'चतुर्थी', 5 => 'पंचमी',
			6  => 'षष्ठी', 7 => 'सप्तमी', 8 => 'अष्टमी', 9 => 'नवमी', 10 => 'दशमी',
			11 => 'एकादशी', 12 => 'द्वादशी', 13 => 'त्रयोदशी', 14 => 'चतुर्दशी', 15 => 'पूर्णिमा',
			16 => 'प्रतिपदा', 17 => 'द्वितीया', 18 => 'तृतीया', 19 => 'चतुर्थी', 20 => 'पंचमी',
			21 => 'षष्ठी', 22 => 'सप्तमी', 23 => 'अष्टमी', 24 => 'नवमी', 25 => 'दशमी',
			26 => 'एकादशी', 27 => 'द्वादशी', 28 => 'त्रयोदशी', 29 => 'चतुर्दशी', 30 => 'अमावस्या',
		);

		$nakshatras = array(
			'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा',
			'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
			'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती',
		);
		$nak_idx  = (int) floor( $moon_nir / ( 360.0 / 27.0 ) ) % 27;
		$nak_pada = (int) floor( fmod( $moon_nir, 360.0 / 27.0 ) / ( 360.0 / 108.0 ) ) + 1;

		$yogas = array(
			'विष्कुम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल',
			'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र', 'सिद्धि', 'व्यतीपात', 'वरीयान',
			'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ', 'शुक्ल', 'ब्रह्म', 'ऐन्द्र', 'वैधृति',
		);
		$yoga_idx = (int) floor( fmod( $sun_nir + $moon_nir, 360.0 ) / ( 360.0 / 27.0 ) ) % 27;

		$karanas = array( 'बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि (भद्रा)' );
		$karana_name = $karanas[ (int) floor( $diff / 6.0 ) % 7 ];

		$rashis = array( 'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन' );
		$chandra_rashi = $rashis[ (int) floor( $moon_nir / 30.0 ) % 12 ];
		$surya_rashi   = $rashis[ (int) floor( $sun_nir / 30.0 ) % 12 ];

		$vara_names = array( 'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार' );
		$dow        = (int) gmdate( 'w', strtotime( $date_str ) );

		// Sunrise / Sunset calculation adjusted for latitude & longitude (IST UTC+5:30)
		$decl      = deg2rad( 23.44 * sin( deg2rad( fmod( ( 284 + (int) gmdate( 'z', strtotime( $date_str ) ) ) * 360.0 / 365.0, 360.0 ) ) ) );
		$lat_rad   = deg2rad( $lat );
		$cos_omega = -tan( $lat_rad ) * tan( $decl );
		$cos_omega = max( -0.95, min( 0.95, $cos_omega ) );
		$omega_deg = rad2deg( acos( $cos_omega ) );

		$lon_offset_min = ( 82.5 - $lng ) * 4.0;
		$sunrise_min    = (int) round( ( 12.0 - $omega_deg / 15.0 ) * 60.0 + $lon_offset_min );
		$sunset_min     = (int) round( ( 12.0 + $omega_deg / 15.0 ) * 60.0 + $lon_offset_min );

		// Rahu Kaal, Yamaganda, Gulika Kaal slots (8 parts of daytime)
		$day_dur   = $sunset_min - $sunrise_min;
		$part_min  = $day_dur / 8.0;
		$rahu_part = array( 8, 2, 7, 5, 6, 4, 3 )[ $dow ];
		$yama_part = array( 5, 4, 3, 2, 1, 7, 6 )[ $dow ];
		$guli_part = array( 7, 6, 5, 4, 3, 2, 1 )[ $dow ];

		return array(
			'date'            => $date_str,
			'location'        => array(
				'name'      => $city_name,
				'latitude'  => $lat,
				'longitude' => $lng,
				'timezone'  => $settings['default_timezone'] ?: 'Asia/Kolkata',
			),
			'ayanamsha'       => round( $ayanamsha, 4 ),
			'vara'            => $vara_names[ $dow ],
			'paksha'          => $paksha,
			'tithi'           => array(
				'number' => $tithi_num,
				'name'   => $tithi_names[ $tithi_num ],
				'paksha' => $paksha,
			),
			'nakshatra'       => array(
				'name' => $nakshatras[ $nak_idx ],
				'pada' => $nak_pada,
			),
			'yoga'            => $yogas[ $yoga_idx ],
			'karana'          => $karana_name,
			'chandra_rashi'   => $chandra_rashi,
			'surya_rashi'     => $surya_rashi,
			'sunrise'         => self::format_minutes_hhmm( $sunrise_min ),
			'sunset'          => self::format_minutes_hhmm( $sunset_min ),
			'rahu_kaal'       => self::format_slot( $sunrise_min, $part_min, $rahu_part ),
			'yamaganda'       => self::format_slot( $sunrise_min, $part_min, $yama_part ),
			'gulika_kaal'     => self::format_slot( $sunrise_min, $part_min, $guli_part ),
			'abhijit_muhurta' => self::format_minutes_hhmm( (int) round( ( $sunrise_min + $sunset_min ) / 2 - 24 ) ) . ' - ' . self::format_minutes_hhmm( (int) round( ( $sunrise_min + $sunset_min ) / 2 + 24 ) ),
		);
	}

	private static function format_minutes_hhmm( $total_min ) {
		$h = (int) floor( $total_min / 60 ) % 24;
		$m = (int) ( $total_min % 60 );
		return sprintf( '%02d:%02d', $h, $m );
	}

	private static function format_slot( $sunrise_min, $part_min, $part_index_1based ) {
		$start = (int) round( $sunrise_min + ( $part_index_1based - 1 ) * $part_min );
		$end   = (int) round( $sunrise_min + $part_index_1based * $part_min );
		return self::format_minutes_hhmm( $start ) . ' - ' . self::format_minutes_hhmm( $end );
	}
}
