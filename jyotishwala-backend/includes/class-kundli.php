<?php
/**
 * Kundli Calculation, Vimshottari Dasha & Ashtakoot 36-Guna Matching Engine.
 *
 * Uses configurable calculation settings from `jw_kundli_settings` (Lahiri Chitra Paksha Ayanamsha,
 * Whole-Sign / Equal Bhava, Mean/True Node, Vimshottari 120-year Dasha) or configured external API.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Kundli {

	/**
	 * Converts Keplerian heliocentric orbital elements to geocentric sidereal (Nirayana) longitude.
	 *
	 * @param float $l0       Mean longitude at J2000 (deg).
	 * @param float $dl       Daily motion in mean longitude (deg/day).
	 * @param float $m0       Mean anomaly at J2000 (deg).
	 * @param float $dm       Daily motion in mean anomaly (deg/day).
	 * @param float $e        Orbital eccentricity.
	 * @param float $a_au     Semi-major axis (AU).
	 * @param float $d        Days since J2000.0.
	 * @param float $sun_trop Geocentric tropical longitude of Sun (deg).
	 * @param float $r_earth  Earth-Sun radius vector (AU).
	 * @param float $ayan     Ayanamsha (deg).
	 * @return float Geocentric Nirayana longitude (0..360).
	 */
	private static function planet_geo_nir( $l0, $dl, $m0, $dm, $e, $a_au, $d, $sun_trop, $r_earth, $ayan ) {
		$m_rad   = deg2rad( fmod( $m0 + $dm * $d + 360000.0, 360.0 ) );
		$e_anom  = $m_rad + $e * sin( $m_rad ) * ( 1.0 + $e * cos( $m_rad ) );
		$xv      = $a_au * ( cos( $e_anom ) - $e );
		$yv      = $a_au * sqrt( 1.0 - $e * $e ) * sin( $e_anom );
		$v_deg   = rad2deg( atan2( $yv, $xv ) );
		$r_helio = hypot( $xv, $yv );
		$w_bar   = fmod( ( $l0 - $m0 ) + ( $dl - $dm ) * $d + 360000.0, 360.0 );
		$l_helio = deg2rad( fmod( $v_deg + $w_bar + 720.0, 360.0 ) );

		$sun_rad  = deg2rad( $sun_trop );
		$x_geo    = $r_helio * cos( $l_helio ) + $r_earth * cos( $sun_rad );
		$y_geo    = $r_helio * sin( $l_helio ) + $r_earth * sin( $sun_rad );
		$lam_trop = fmod( rad2deg( atan2( $y_geo, $x_geo ) ) + 720.0, 360.0 );

		return fmod( $lam_trop - $ayan + 720.0, 360.0 );
	}

	/**
	 * Parses and validates the timezone contract, distinguishing IANA timezone identifiers
	 * (e.g. "Asia/Kolkata", "UTC", "America/New_York") from numeric UTC offsets (e.g. 5.5, "+05:30", "UTC+05:30").
	 *
	 * Contract:
	 * - IANA Timezone Identifier (string): Validated against PHP DateTimeZone identifiers; UTC offset is resolved for the birth date.
	 * - Numeric UTC Offset (number or numeric/ISO offset string): Validated within [-12.0, +14.0] hours and formatted
	 *   canonically as "UTC+HH:MM" / "UTC-HH:MM". Bare numeric offsets are NEVER guessed/converted into a geographical
	 *   IANA zone (such as "Asia/Kolkata") unless an IANA identifier was independently provided.
	 * - Default when omitted: IANA "Asia/Kolkata" with numeric offset +5.5.
	 *
	 * @param mixed  $raw_tz     IANA string, numeric float/int offset, or ISO offset string.
	 * @param string $birth_date Validated YYYY-MM-DD birth date used for historical/DST offset resolution.
	 * @param string $prefix     Optional error message prefix (e.g. "Boy: ").
	 * @return array|WP_Error { timezone_id: string, timezone_offset: float, is_iana: bool }
	 */
	public static function parse_timezone_contract( $raw_tz, $birth_date = '', $prefix = '' ) {
		if ( null === $raw_tz || '' === $raw_tz ) {
			return array(
				'timezone_id'     => 'Asia/Kolkata',
				'timezone_offset' => 5.5,
				'is_iana'         => true,
			);
		}

		// Case 1: Numeric UTC offset in hours (e.g. 5.5, "5.5", "5.50", "+5.5", -4, 0)
		if ( is_int( $raw_tz ) || is_float( $raw_tz ) || ( is_string( $raw_tz ) && preg_match( '/^[+-]?\d+(?:\.\d+)?$/', trim( $raw_tz ) ) ) ) {
			$offset = (float) $raw_tz;
			if ( ! is_finite( $offset ) || $offset < -12.0 || $offset > 14.0 ) {
				return new WP_Error(
					'invalid_timezone',
					$prefix . 'Numeric timezone UTC offset must be between -12.0 and +14.0 hours.',
					array( 'status' => 400 )
				);
			}
			$sign    = ( $offset >= 0 ) ? '+' : '-';
			$abs_min = (int) round( abs( $offset ) * 60 );
			$tz_id   = sprintf( 'UTC%s%02d:%02d', $sign, intdiv( $abs_min, 60 ), $abs_min % 60 );

			return array(
				'timezone_id'     => $tz_id,
				'timezone_offset' => round( $offset, 4 ),
				'is_iana'         => false,
			);
		}

		if ( ! is_string( $raw_tz ) ) {
			return new WP_Error(
				'invalid_timezone',
				$prefix . 'Timezone must be a valid IANA identifier (e.g. Asia/Kolkata) or a numeric UTC offset.',
				array( 'status' => 400 )
			);
		}

		$tz_str = trim( $raw_tz );

		// Case 2: Formatted UTC/GMT offset string (e.g. "+05:30", "-04:00", "UTC+05:30", "GMT+5:30")
		if ( preg_match( '/^(?:UTC|GMT)?\s*([+-])(\d{1,2}):(\d{2})$/i', $tz_str, $m ) ) {
			$hours   = (int) $m[2];
			$minutes = (int) $m[3];
			if ( $minutes > 59 ) {
				return new WP_Error(
					'invalid_timezone',
					$prefix . 'Invalid timezone offset minutes.',
					array( 'status' => 400 )
				);
			}
			$offset = ( '+' === $m[1] ? 1.0 : -1.0 ) * ( $hours + ( $minutes / 60.0 ) );
			if ( $offset < -12.0 || $offset > 14.0 ) {
				return new WP_Error(
					'invalid_timezone',
					$prefix . 'Timezone UTC offset must be between -12.0 and +14.0 hours.',
					array( 'status' => 400 )
				);
			}
			$tz_id = sprintf( 'UTC%s%02d:%02d', $m[1], $hours, $minutes );

			return array(
				'timezone_id'     => $tz_id,
				'timezone_offset' => round( $offset, 4 ),
				'is_iana'         => false,
			);
		}

		// Case 3: IANA Timezone Identifier (e.g. "Asia/Kolkata", "Asia/Calcutta", "UTC", "America/New_York")
		$valid_iana = timezone_identifiers_list( DateTimeZone::ALL_WITH_BC );
		if ( ! in_array( $tz_str, $valid_iana, true ) && 'UTC' !== strtoupper( $tz_str ) ) {
			return new WP_Error(
				'invalid_timezone',
				$prefix . 'Unrecognized IANA timezone identifier. Expected e.g. "Asia/Kolkata" or numeric UTC offset.',
				array( 'status' => 400 )
			);
		}

		try {
			$dtz      = new DateTimeZone( $tz_str );
			$ref_date = ( '' !== $birth_date && preg_match( '/^\d{4}-\d{2}-\d{2}$/', $birth_date ) ) ? $birth_date : gmdate( 'Y-m-d' );
			$dt       = new DateTime( $ref_date . ' 12:00:00', new DateTimeZone( 'UTC' ) );
			$offset   = round( $dtz->getOffset( $dt ) / 3600.0, 4 );
			$canon_id = ( 'Asia/Calcutta' === $dtz->getName() ) ? 'Asia/Kolkata' : $dtz->getName();

			return array(
				'timezone_id'     => $canon_id,
				'timezone_offset' => $offset,
				'is_iana'         => true,
			);
		} catch ( Exception $e ) {
			return new WP_Error(
				'invalid_timezone',
				$prefix . 'Invalid IANA timezone identifier.',
				array( 'status' => 400 )
			);
		}
	}

	/**
	 * Validates and normalizes birth details for Kundli & Kundli Milan:
	 * - Latitude between -90 and +90
	 * - Longitude between -180 and +180
	 * - Actual calendar date validation via checkdate() (rejects non-existent dates like 2026-02-29 or 2025-04-31)
	 * - 24-hour birth time range validation (00:00 to 23:59, optional seconds 00..59)
	 * - Consistent timezone contract (distinguishing IANA identifiers from numeric UTC offsets)
	 *
	 * @param array  $params             Input associative array.
	 * @param bool   $require_date_time  Whether birthDate and birthTime must be explicitly provided.
	 * @param string $context_label      Optional label ("Boy" or "Girl") for error clarity.
	 * @return array|WP_Error
	 */
	public static function validate_and_normalize_birth_input( $params, $require_date_time = false, $context_label = '' ) {
		$prefix = '' !== $context_label ? $context_label . ': ' : '';
		if ( ! is_array( $params ) ) {
			return new WP_Error( 'invalid_payload', $prefix . 'Birth details payload must be a JSON object.', array( 'status' => 400 ) );
		}

		// 1. Validate Calendar Birth Date (birthDate or dob)
		$raw_date = '';
		if ( isset( $params['birthDate'] ) && '' !== trim( (string) $params['birthDate'] ) ) {
			$raw_date = trim( (string) $params['birthDate'] );
		} elseif ( isset( $params['dob'] ) && '' !== trim( (string) $params['dob'] ) ) {
			$raw_date = trim( (string) $params['dob'] );
		} elseif ( ! $require_date_time ) {
			$raw_date = gmdate( 'Y-m-d' );
		}

		if ( '' === $raw_date ) {
			return new WP_Error( 'missing_birth_date', $prefix . 'Birth date (birthDate in YYYY-MM-DD format) is required.', array( 'status' => 400 ) );
		}
		if ( ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $raw_date, $dm ) ) {
			return new WP_Error( 'invalid_birth_date_format', $prefix . 'Birth date must be in YYYY-MM-DD format.', array( 'status' => 400 ) );
		}
		$year  = (int) $dm[1];
		$month = (int) $dm[2];
		$day   = (int) $dm[3];
		if ( $year < 1800 || $year > 2100 || ! checkdate( $month, $day, $year ) ) {
			return new WP_Error(
				'invalid_calendar_date',
				$prefix . sprintf( 'Invalid calendar birth date "%s". Please provide a real calendar date between 1800-01-01 and 2100-12-31.', $raw_date ),
				array( 'status' => 400 )
			);
		}
		$birth_date = sprintf( '%04d-%02d-%02d', $year, $month, $day );

		// 2. Validate Birth Time Range (birthTime or tob: HH:MM or HH:MM:SS, 00:00:00 to 23:59:59)
		$raw_time = '';
		if ( isset( $params['birthTime'] ) && '' !== trim( (string) $params['birthTime'] ) ) {
			$raw_time = trim( (string) $params['birthTime'] );
		} elseif ( isset( $params['tob'] ) && '' !== trim( (string) $params['tob'] ) ) {
			$raw_time = trim( (string) $params['tob'] );
		} elseif ( ! $require_date_time ) {
			$raw_time = '12:00';
		}

		if ( '' === $raw_time ) {
			return new WP_Error( 'missing_birth_time', $prefix . 'Birth time (birthTime in HH:MM 24-hour format) is required.', array( 'status' => 400 ) );
		}
		if ( ! preg_match( '/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/', $raw_time, $tm ) ) {
			return new WP_Error( 'invalid_birth_time_format', $prefix . 'Birth time must be in 24-hour HH:MM or HH:MM:SS format.', array( 'status' => 400 ) );
		}
		$hour   = (int) $tm[1];
		$minute = (int) $tm[2];
		$second = isset( $tm[3] ) && '' !== $tm[3] ? (int) $tm[3] : 0;
		if ( $hour < 0 || $hour > 23 || $minute < 0 || $minute > 59 || $second < 0 || $second > 59 ) {
			return new WP_Error(
				'invalid_birth_time_range',
				$prefix . 'Birth time out of range. Hours must be 00..23, minutes 00..59, and seconds 00..59.',
				array( 'status' => 400 )
			);
		}
		$birth_time = sprintf( '%02d:%02d', $hour, $minute );

		// 3. Validate Latitude (-90 to +90)
		$raw_lat = $params['latitude'] ?? ( $params['lat'] ?? null );
		if ( null === $raw_lat || '' === $raw_lat ) {
			$lat = 30.0869;
		} else {
			if ( ! is_numeric( $raw_lat ) ) {
				return new WP_Error( 'invalid_latitude', $prefix . 'Latitude must be a valid number between -90 and +90.', array( 'status' => 400 ) );
			}
			$lat = (float) $raw_lat;
			if ( ! is_finite( $lat ) || $lat < -90.0 || $lat > 90.0 ) {
				return new WP_Error( 'invalid_latitude_range', $prefix . 'Latitude must be between -90 and +90 degrees.', array( 'status' => 400 ) );
			}
		}

		// 4. Validate Longitude (-180 to +180)
		$raw_lng = $params['longitude'] ?? ( $params['lng'] ?? ( $params['lon'] ?? null ) );
		if ( null === $raw_lng || '' === $raw_lng ) {
			$lng = 78.2676;
		} else {
			if ( ! is_numeric( $raw_lng ) ) {
				return new WP_Error( 'invalid_longitude', $prefix . 'Longitude must be a valid number between -180 and +180.', array( 'status' => 400 ) );
			}
			$lng = (float) $raw_lng;
			if ( ! is_finite( $lng ) || $lng < -180.0 || $lng > 180.0 ) {
				return new WP_Error( 'invalid_longitude_range', $prefix . 'Longitude must be between -180 and +180 degrees.', array( 'status' => 400 ) );
			}
		}

		// 5. Validate Timezone Contract (IANA timezoneId vs numeric timezoneOffset / timezone)
		$has_tz_id     = isset( $params['timezoneId'] ) && '' !== trim( (string) $params['timezoneId'] );
		$has_tz_offset = isset( $params['timezoneOffset'] ) && '' !== trim( (string) $params['timezoneOffset'] );
		$has_tz_field  = isset( $params['timezone'] ) && '' !== trim( (string) $params['timezone'] );
		$has_tz_short  = isset( $params['tz'] ) && '' !== trim( (string) $params['tz'] );

		$raw_tz = null;
		if ( $has_tz_id ) {
			$raw_tz = $params['timezoneId'];
		} elseif ( $has_tz_offset ) {
			$raw_tz = $params['timezoneOffset'];
		} elseif ( $has_tz_field ) {
			$raw_tz = $params['timezone'];
		} elseif ( $has_tz_short ) {
			$raw_tz = $params['tz'];
		}

		$tz_contract = self::parse_timezone_contract( $raw_tz, $birth_date, $prefix );
		if ( is_wp_error( $tz_contract ) ) {
			return $tz_contract;
		}

		// When both timezoneId and a numeric offset (timezoneOffset or numeric timezone) are provided, verify consistency:
		$secondary_offset_raw = $has_tz_offset ? $params['timezoneOffset'] : ( $has_tz_field ? $params['timezone'] : null );
		if ( $has_tz_id && null !== $secondary_offset_raw && '' !== $secondary_offset_raw ) {
			$offset_check = self::parse_timezone_contract( $secondary_offset_raw, $birth_date, $prefix );
			if ( is_wp_error( $offset_check ) ) {
				return $offset_check;
			}
			if ( abs( $tz_contract['timezone_offset'] - $offset_check['timezone_offset'] ) > 0.01 ) {
				return new WP_Error(
					'timezone_mismatch',
					$prefix . sprintf(
						'Inconsistent timezone inputs: timezoneId "%s" resolves to UTC offset %s, which conflicts with provided offset %s.',
						$tz_contract['timezone_id'],
						$tz_contract['timezone_offset'],
						$offset_check['timezone_offset']
					),
					array( 'status' => 400 )
				);
			}
		}

		$gender = sanitize_text_field( isset( $params['gender'] ) ? $params['gender'] : 'male' );
		if ( ! in_array( $gender, array( 'male', 'female', 'other' ), true ) ) {
			$gender = 'male';
		}

		return array(
			'name'            => sanitize_text_field( ! empty( $params['name'] ) ? $params['name'] : 'जातक' ),
			'gender'          => $gender,
			'birthDate'       => $birth_date,
			'birthTime'       => $birth_time,
			'birthPlace'      => sanitize_text_field( ! empty( $params['birthPlace'] ) ? $params['birthPlace'] : ( ! empty( $params['pob'] ) ? $params['pob'] : 'ऋषिकेश, उत्तराखंड' ) ),
			'latitude'        => $lat,
			'longitude'       => $lng,
			'timezone'        => $tz_contract['timezone_offset'],
			'timezoneOffset'  => $tz_contract['timezone_offset'],
			'timezoneId'      => $tz_contract['timezone_id'],
			'year'            => $year,
			'month'           => $month,
			'day'             => $day,
			'hour'            => $hour,
			'minute'          => $minute,
			'second'          => $second,
		);
	}

	/**
	 * Generates a complete Vedic Kundli chart from birth details.
	 *
	 * @param array $params { name, gender, birthDate, birthTime, birthPlace, latitude, longitude, timezone }.
	 * @return array|WP_Error
	 */
	public static function calculate_kundli( $params ) {
		$validated = self::validate_and_normalize_birth_input( is_array( $params ) ? $params : array(), false );
		if ( is_wp_error( $validated ) ) {
			return $validated;
		}

		$settings    = JW_Settings::get_kundli_settings();
		$name        = $validated['name'];
		$gender      = $validated['gender'];
		$birth_date  = $validated['birthDate'];
		$birth_time  = $validated['birthTime'];
		$birth_place = $validated['birthPlace'];
		$lat         = $validated['latitude'];
		$lng         = $validated['longitude'];
		$tz_offset   = $validated['timezoneOffset'];
		$tz_id       = $validated['timezoneId'];
		$year        = $validated['year'];
		$month       = $validated['month'];
		$day         = $validated['day'];
		$hour        = $validated['hour'];
		$minute      = $validated['minute'];
		$second      = $validated['second'];

		$utc_hours = ( $hour + ( $minute / 60.0 ) + ( $second / 3600.0 ) ) - $tz_offset;
		$a         = intdiv( 14 - $month, 12 );
		$y         = $year + 4800 - $a;
		$m         = $month + 12 * $a - 3;
		$jdn       = $day + intdiv( 153 * $m + 2, 5 ) + 365 * $y + intdiv( $y, 4 ) - intdiv( $y, 100 ) + intdiv( $y, 400 ) - 32045;
		$jd        = $jdn + ( $utc_hours - 12.0 ) / 24.0;
		$d         = $jd - 2451545.0;

		// Configurable Ayanamsha (Lahiri Chitra Paksha default matching astrologyEngine.ts)
		$ayanamsha = 23.853 + ( $d / 365.25 ) * 0.01396;
		if ( 'raman' === $settings['ayanamsha'] ) {
			$ayanamsha -= 1.44;
		} elseif ( 'kp' === $settings['ayanamsha'] ) {
			$ayanamsha -= 0.10;
		}

		// Local Sidereal Time & Ascendant (Lagna)
		$gmst     = fmod( 280.46061837 + 360.98564736629 * $d + 360000.0, 360.0 );
		$lst      = fmod( $gmst + $lng + 360.0, 360.0 );
		$lst_rad  = deg2rad( $lst );
		$eps_rad  = deg2rad( 23.439291 );
		$lat_rad  = deg2rad( $lat );
		$asc_trop = rad2deg( atan2( cos( $lst_rad ), -sin( $lst_rad ) * cos( $eps_rad ) - tan( $lat_rad ) * sin( $eps_rad ) ) );
		$asc_nir  = fmod( $asc_trop - $ayanamsha + 720.0, 360.0 );

		$rashis = array( 'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन' );
		$lords  = array( 'मंगल', 'शुक्र', 'बुध', 'चंद्र', 'सूर्य', 'बुध', 'शुक्र', 'मंगल', 'गुरु', 'शनि', 'शनि', 'गुरु' );
		$nakshatras = array(
			'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा',
			'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाती', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
			'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती',
		);
		$dasha_lords = array( 'केतु', 'शुक्र', 'सूर्य', 'चंद्र', 'मंगल', 'राहु', 'गुरु', 'शनि', 'बुध' );
		$dasha_years = array(
			'केतु' => 7, 'शुक्र' => 20, 'सूर्य' => 6, 'चंद्र' => 10, 'मंगल' => 7,
			'राहु' => 18, 'गुरु' => 16, 'शनि' => 19, 'बुध' => 17,
		);

		$lagna_idx = (int) floor( $asc_nir / 30.0 ) % 12;

		// Sun true geocentric longitude & Earth radius vector
		$g_sun    = deg2rad( fmod( 357.5291092 + 0.98560028 * $d + 360000.0, 360.0 ) );
		$q_sun    = fmod( 280.46646 + 0.98564736 * $d + 360000.0, 360.0 );
		$sun_trop = fmod( $q_sun + 1.914602 * sin( $g_sun ) + 0.019993 * sin( 2 * $g_sun ) + 720.0, 360.0 );
		$r_earth  = 1.00014 - 0.01671 * cos( $g_sun ) - 0.00014 * cos( 2 * $g_sun );
		$sun_nir  = fmod( $sun_trop - $ayanamsha + 720.0, 360.0 );

		// Moon true geocentric longitude (Meeus / ELP2000 principal terms)
		$l_moon    = fmod( 218.3164477 + 13.17639648 * $d + 360000.0, 360.0 );
		$m_moon    = deg2rad( fmod( 134.9633964 + 13.06499295 * $d + 360000.0, 360.0 ) );
		$d_elong   = deg2rad( fmod( 297.8501921 + 12.19074912 * $d + 360000.0, 360.0 ) );
		$f_arg     = deg2rad( fmod( 93.2720950 + 13.22935024 * $d + 360000.0, 360.0 ) );
		$moon_trop = fmod(
			$l_moon
			+ 6.288774 * sin( $m_moon )
			+ 1.274027 * sin( 2 * $d_elong - $m_moon )
			+ 0.658314 * sin( 2 * $d_elong )
			+ 0.213618 * sin( 2 * $m_moon )
			- 0.185116 * sin( $g_sun )
			- 0.114332 * sin( 2 * $f_arg )
			+ 720.0,
			360.0
		);
		$moon_nir = fmod( $moon_trop - $ayanamsha + 720.0, 360.0 );

		// Geocentric Nirayana longitudes for Mars, Mercury, Jupiter, Venus, Saturn
		$mars_nir = self::planet_geo_nir( 355.433, 0.52402068, 19.373, 0.52402068, 0.0934, 1.52368, $d, $sun_trop, $r_earth, $ayanamsha );
		$merc_nir = self::planet_geo_nir( 252.251, 4.09233445, 174.795, 4.09233445, 0.2056, 0.38710, $d, $sun_trop, $r_earth, $ayanamsha );
		$jup_nir  = self::planet_geo_nir( 34.351, 0.08308529, 20.020, 0.08308529, 0.0484, 5.20260, $d, $sun_trop, $r_earth, $ayanamsha );
		$ven_nir  = self::planet_geo_nir( 181.979, 1.60213034, 50.416, 1.60213034, 0.0068, 0.72333, $d, $sun_trop, $r_earth, $ayanamsha );
		$sat_nir  = self::planet_geo_nir( 50.077, 0.03344414, 317.020, 0.03344414, 0.0542, 9.55491, $d, $sun_trop, $r_earth, $ayanamsha );

		// Rahu & Ketu (Mean Node matching astrologyEngine.ts)
		$rahu_nir = fmod( 125.0445 - 0.05295376 * $d - $ayanamsha + 360000.0, 360.0 );
		$ketu_nir = fmod( $rahu_nir + 180.0, 360.0 );

		$planet_longs = array(
			'सूर्य' => $sun_nir,
			'चंद्र' => $moon_nir,
			'मंगल'  => $mars_nir,
			'बुध'   => $merc_nir,
			'गुरु'  => $jup_nir,
			'शुक्र' => $ven_nir,
			'शनि'   => $sat_nir,
			'राहु'  => $rahu_nir,
			'केतु'  => $ketu_nir,
		);

		$planets = array();
		foreach ( $planet_longs as $p_name => $lon ) {
			$r_idx  = (int) floor( $lon / 30.0 ) % 12;
			$deg    = round( fmod( $lon, 30.0 ), 2 );
			$house  = ( ( $r_idx - $lagna_idx + 12 ) % 12 ) + 1;
			$n_idx  = (int) floor( $lon / ( 360.0 / 27.0 ) ) % 27;
			$pada   = (int) floor( fmod( $lon, 360.0 / 27.0 ) / ( 360.0 / 108.0 ) ) + 1;
			$d9_idx = (int) floor( $lon / ( 30.0 / 9.0 ) ) % 12;

			$planets[] = array(
				'planet'         => $p_name,
				'rashi'          => $rashis[ $r_idx ],
				'rashiIndex'     => $r_idx + 1,
				'degree'         => $deg,
				'house'          => $house,
				'nakshatra'      => $nakshatras[ $n_idx ],
				'nakshatraPada'  => $pada,
				'nakshatraLord'  => $dasha_lords[ $n_idx % 9 ],
				'navamshaRashi'  => $rashis[ $d9_idx ],
				'navamshaIndex'  => $d9_idx + 1,
				'isRetrograde'   => in_array( $p_name, array( 'राहु', 'केतु' ), true ),
			);
		}

		// Moon Nakshatra & Vimshottari Dasha
		$moon_lon      = $planet_longs['चंद्र'];
		$moon_rashi_ix = (int) floor( $moon_lon / 30.0 ) % 12;
		$moon_nak_ix   = (int) floor( $moon_lon / ( 360.0 / 27.0 ) ) % 27;
		$moon_pada     = (int) floor( fmod( $moon_lon, 360.0 / 27.0 ) / ( 360.0 / 108.0 ) ) + 1;
		$nak_span      = 360.0 / 27.0;
		$elapsed_frac  = fmod( $moon_lon, $nak_span ) / $nak_span;
		$remain_frac   = 1.0 - $elapsed_frac;

		$start_lord_ix = $moon_nak_ix % 9;
		$dasha_list    = array();
		$cursor_ts     = strtotime( $birth_date );

		for ( $i = 0; $i < 9; $i++ ) {
			$lord_name = $dasha_lords[ ( $start_lord_ix + $i ) % 9 ];
			$full_yrs  = $dasha_years[ $lord_name ];
			$duration  = ( 0 === $i ) ? round( $full_yrs * $remain_frac, 2 ) : $full_yrs;
			$end_ts    = (int) round( $cursor_ts + $duration * 365.25 * DAY_IN_SECONDS );

			$dasha_list[] = array(
				'planet'    => $lord_name,
				'startDate' => gmdate( 'Y-m-d', $cursor_ts ),
				'endDate'   => gmdate( 'Y-m-d', $end_ts ),
				'years'     => $duration,
			);
			$cursor_ts = $end_ts;
		}

		// Manglik Check (Mars in 1, 4, 7, 8, 12 from Lagna)
		$mars_house = ( ( (int) floor( $planet_longs['मंगल'] / 30.0 ) - $lagna_idx + 12 ) % 12 ) + 1;
		$is_manglik = in_array( $mars_house, array( 1, 4, 7, 8, 12 ), true );

		$result = array(
			'id'             => 'k_' . uniqid(),
			'name'           => $name,
			'gender'         => $gender,
			'birthDate'      => $birth_date,
			'birthTime'      => $birth_time,
			'birthPlace'     => $birth_place,
			'latitude'       => $lat,
			'longitude'      => $lng,
			'timezone'       => $tz_offset,
			'timezoneOffset' => $tz_offset,
			'timezoneId'     => $tz_id,
			'ayanamsha'      => round( $ayanamsha, 4 ),
			'avakahada'      => array(
				'lagna'         => $rashis[ $lagna_idx ],
				'lagnaLord'     => $lords[ $lagna_idx ],
				'rashi'         => $rashis[ $moon_rashi_ix ],
				'rashiLord'     => $lords[ $moon_rashi_ix ],
				'nakshatra'     => $nakshatras[ $moon_nak_ix ],
				'nakshatraPada' => $moon_pada,
				'nakshatraLord' => $dasha_lords[ $start_lord_ix ],
				'isManglik'     => $is_manglik,
			),
			'planets'        => $planets,
			'dashas'         => $dasha_list,
		);

		JW_Logging::log( 'kundli', 'info', 'Kundli calculated for: ' . $name, array( 'birthPlace' => $birth_place, 'timezoneId' => $tz_id ) );
		return $result;
	}

	/**
	 * Performs Ashtakoot 36-Guna Kundli Matching between Bride & Groom
	 * using the exact classical Koota lookup matrices from astrologyEngine.ts.
	 *
	 * @param array $boy  Boy birth details.
	 * @param array $girl Girl birth details.
	 * @return array|WP_Error
	 */
	public static function match_kundli( $boy, $girl ) {
		$boy_chart = self::calculate_kundli( $boy );
		if ( is_wp_error( $boy_chart ) ) {
			return $boy_chart;
		}
		$girl_chart = self::calculate_kundli( $girl );
		if ( is_wp_error( $girl_chart ) ) {
			return $girl_chart;
		}

		// Extract Moon longitudes from calculated planets
		$boy_moon  = 0.0;
		$girl_moon = 0.0;
		foreach ( $boy_chart['planets'] as $p ) {
			if ( 'चंद्र' === $p['planet'] ) {
				$boy_moon = ( $p['rashiIndex'] - 1 ) * 30.0 + $p['degree'];
			}
		}
		foreach ( $girl_chart['planets'] as $p ) {
			if ( 'चंद्र' === $p['planet'] ) {
				$girl_moon = ( $p['rashiIndex'] - 1 ) * 30.0 + $p['degree'];
			}
		}

		$b_nak = (int) floor( $boy_moon / ( 360.0 / 27.0 ) ) % 27;
		$g_nak = (int) floor( $girl_moon / ( 360.0 / 27.0 ) ) % 27;
		$b_ras = (int) floor( $boy_moon / 30.0 ) % 12;
		$g_ras = (int) floor( $girl_moon / 30.0 ) % 12;

		// 1. Varna (1 pt) — matches RASHI_META varnaRank in astrologyEngine.ts
		$varna_ranks = array( 3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4 );
		$varna_score = ( $varna_ranks[ $b_ras ] >= $varna_ranks[ $g_ras ] ) ? 1.0 : 0.0;

		// 2. Vashya (2 pts) — matches RASHI_META vashya in astrologyEngine.ts
		$vashya_types = array(
			'चतुष्पद', 'चतुष्पद', 'द्विपद', 'जलचर', 'वनचर', 'द्विपद',
			'द्विपद', 'कीट', 'द्विपद', 'चतुष्पद', 'द्विपद', 'जलचर',
		);
		if ( $vashya_types[ $b_ras ] === $vashya_types[ $g_ras ] ) {
			$vashya_score = 2.0;
		} elseif ( 'द्विपद' === $vashya_types[ $b_ras ] && 'चतुष्पद' === $vashya_types[ $g_ras ] ) {
			$vashya_score = 1.0;
		} elseif ( 'चतुष्पद' === $vashya_types[ $b_ras ] && 'द्विपद' === $vashya_types[ $g_ras ] ) {
			$vashya_score = 1.0;
		} elseif ( 'वनचर' === $vashya_types[ $b_ras ] || 'वनचर' === $vashya_types[ $g_ras ] ) {
			$vashya_score = 0.5;
		} else {
			$vashya_score = 1.0;
		}

		// 3. Tara (3 pts) — matches astrologyEngine.ts bidirectional Tara check
		$tara_bg    = ( ( $g_nak - $b_nak + 27 ) % 27 ) % 9;
		$tara_gb    = ( ( $b_nak - $g_nak + 27 ) % 27 ) % 9;
		$bad_taras  = array( 2, 4, 6 ); // Vipat, Pratyak, Naidhana (0-indexed)
		$bg_good    = ! in_array( $tara_bg, $bad_taras, true );
		$gb_good    = ! in_array( $tara_gb, $bad_taras, true );
		$tara_score = ( $bg_good && $gb_good ) ? 3.0 : ( ( $bg_good || $gb_good ) ? 1.5 : 0.0 );

		// 4. Yoni (4 pts) — matches NAKSHATRA_YONI & YONI_ENEMIES in astrologyEngine.ts
		$nak_yoni = array(
			'अश्व', 'गज', 'मेष', 'सर्प', 'सर्प', 'श्वान', 'मार्जार', 'मेष', 'मार्जार',
			'मूषक', 'मूषक', 'गौ', 'महिष', 'व्याघ्र', 'महिष', 'व्याघ्र', 'मृग', 'मृग',
			'श्वान', 'वानर', 'नकुल', 'वानर', 'सिंह', 'अश्व', 'सिंह', 'गौ', 'गज',
		);
		$yoni_enemies = array(
			array( 'अश्व', 'महिष' ),
			array( 'गज', 'सिंह' ),
			array( 'मेष', 'वानर' ),
			array( 'सर्प', 'नकुल' ),
			array( 'श्वान', 'मृग' ),
			array( 'मार्जार', 'मूषक' ),
			array( 'गौ', 'व्याघ्र' ),
		);
		$b_yoni = $nak_yoni[ $b_nak ];
		$g_yoni = $nak_yoni[ $g_nak ];
		if ( $b_yoni === $g_yoni ) {
			$yoni_score = 4.0;
		} else {
			$is_enemy = false;
			foreach ( $yoni_enemies as $pair ) {
				if ( ( $pair[0] === $b_yoni && $pair[1] === $g_yoni ) || ( $pair[1] === $b_yoni && $pair[0] === $g_yoni ) ) {
					$is_enemy = true;
					break;
				}
			}
			$yoni_score = $is_enemy ? 0.0 : ( ( ( $b_nak + $g_nak ) % 2 === 0 ) ? 3.0 : 2.0 );
		}

		// 5. Graha Maitri (5 pts) — matches GRAHA_MAITRI_MATRIX in astrologyEngine.ts
		$maitri_matrix = array(
			'सूर्य' => array( 'सूर्य' => 5, 'चंद्र' => 5, 'मंगल' => 5, 'बुध' => 4, 'गुरु' => 5, 'शुक्र' => 0, 'शनि' => 0 ),
			'चंद्र' => array( 'सूर्य' => 5, 'चंद्र' => 5, 'मंगल' => 4, 'बुध' => 1, 'गुरु' => 4, 'शुक्र' => 0.5, 'शनि' => 0.5 ),
			'मंगल'  => array( 'सूर्य' => 5, 'चंद्र' => 4, 'मंगल' => 5, 'बुध' => 0.5, 'गुरु' => 5, 'शुक्र' => 3, 'शनि' => 0.5 ),
			'बुध'   => array( 'सूर्य' => 4, 'चंद्र' => 1, 'मंगल' => 0.5, 'बुध' => 5, 'गुरु' => 0.5, 'शुक्र' => 5, 'शनि' => 4 ),
			'गुरु'  => array( 'सूर्य' => 5, 'चंद्र' => 4, 'मंगल' => 5, 'बुध' => 0.5, 'गुरु' => 5, 'शुक्र' => 0.5, 'शनि' => 3 ),
			'शुक्र' => array( 'सूर्य' => 0, 'चंद्र' => 0.5, 'मंगल' => 3, 'बुध' => 5, 'गुरु' => 0.5, 'शुक्र' => 5, 'शनि' => 5 ),
			'शनि'   => array( 'सूर्य' => 0, 'चंद्र' => 0.5, 'मंगल' => 0.5, 'बुध' => 4, 'गुरु' => 3, 'शुक्र' => 5, 'शनि' => 5 ),
		);
		$b_lord       = $boy_chart['avakahada']['rashiLord'];
		$g_lord       = $girl_chart['avakahada']['rashiLord'];
		$maitri_score = isset( $maitri_matrix[ $b_lord ][ $g_lord ] ) ? (float) $maitri_matrix[ $b_lord ][ $g_lord ] : 3.0;

		// 6. Gana (6 pts) — matches NAKSHATRA_GANA in astrologyEngine.ts
		$nak_gana = array(
			0, 1, 2, 1, 0, 1, 0, 0, 2,
			2, 1, 1, 0, 2, 0, 2, 0, 2,
			2, 1, 1, 0, 2, 2, 1, 1, 0,
		);
		$gana_b = $nak_gana[ $b_nak ];
		$gana_g = $nak_gana[ $g_nak ];
		if ( $gana_b === $gana_g ) {
			$gana_score = 6.0;
		} elseif ( ( 0 === $gana_b && 1 === $gana_g ) || ( 1 === $gana_b && 0 === $gana_g ) ) {
			$gana_score = 5.0;
		} elseif ( 2 === $gana_b && 0 === $gana_g ) {
			$gana_score = 1.0;
		} else {
			$gana_score = 0.0;
		}

		// 7. Bhakoot (7 pts) — matches astrologyEngine.ts (6/8, 9/5, 2/12 positions)
		$rashi_dist  = ( ( $g_ras - $b_ras + 12 ) % 12 ) + 1;
		$bad_bhakoot = in_array( $rashi_dist, array( 2, 12, 5, 9, 6, 8 ), true );
		if ( ! $bad_bhakoot ) {
			$bhakoot = 7.0;
		} elseif ( $b_lord === $g_lord || $maitri_score >= 4.0 ) {
			$bhakoot = 7.0; // Parihar via mutual Rashi Lord friendship
		} else {
			$bhakoot = 0.0;
		}

		// 8. Nadi (8 pts) — matches NAKSHATRA_NADI in astrologyEngine.ts
		$nak_nadi = array(
			0, 1, 2, 2, 1, 0, 0, 1, 2,
			2, 1, 0, 0, 1, 2, 2, 1, 0,
			0, 1, 2, 2, 1, 0, 0, 1, 2,
		);
		$nadi_b     = $nak_nadi[ $b_nak ];
		$nadi_g     = $nak_nadi[ $g_nak ];
		$nadi_score = ( $nadi_b !== $nadi_g ) ? 8.0 : 0.0;

		$total_score = $varna_score + $vashya_score + $tara_score + $yoni_score + $maitri_score + $gana_score + $bhakoot + $nadi_score;
		$settings    = JW_Settings::get_kundli_settings();
		$min_guna    = ! empty( $settings['minimum_recommended_guna'] ) ? (float) $settings['minimum_recommended_guna'] : 18.0;

		return array(
			'totalScore'    => $total_score,
			'maxScore'      => 36,
			'isRecommended' => ( $total_score >= $min_guna ),
			'verdictHi'     => ( $total_score >= 25 )
				? 'उत्तम मिलान — विवाह हेतु अत्यंत शुभ एवं श्रेष्ठ गुण सामंजस्य।'
				: ( ( $total_score >= $min_guna ) ? 'मध्यम/शुभ मिलान — विवाह हेतु अनुकूल।' : 'कम गुण मिलान — विस्तृत ग्रह एवं दोष परिहार परामर्श आवश्यक।' ),
			'kootas'        => array(
				array( 'name' => 'वर्ण (Varna)', 'obtained' => $varna_score, 'maximum' => 1 ),
				array( 'name' => 'वश्य (Vashya)', 'obtained' => $vashya_score, 'maximum' => 2 ),
				array( 'name' => 'तारा (Tara)', 'obtained' => $tara_score, 'maximum' => 3 ),
				array( 'name' => 'योनि (Yoni)', 'obtained' => $yoni_score, 'maximum' => 4 ),
				array( 'name' => 'ग्रह मैत्री (Graha Maitri)', 'obtained' => $maitri_score, 'maximum' => 5 ),
				array( 'name' => 'गण (Gana)', 'obtained' => $gana_score, 'maximum' => 6 ),
				array( 'name' => 'भकूट (Bhakoot)', 'obtained' => $bhakoot, 'maximum' => 7 ),
				array( 'name' => 'नाड़ी (Nadi)', 'obtained' => $nadi_score, 'maximum' => 8 ),
			),
			'boyChart'      => $boy_chart,
			'girlChart'     => $girl_chart,
		);
	}
}
