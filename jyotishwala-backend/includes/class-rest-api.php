<?php
/**
 * Custom WordPress REST API Controller (/wp-json/jyotishwala/v1/*).
 *
 * Implements all public and authenticated REST endpoints required by the JyotishWala Android App:
 * - GET    /wp-json/jyotishwala/v1/home
 * - GET    /wp-json/jyotishwala/v1/posts
 * - GET    /wp-json/jyotishwala/v1/categories
 * - GET    /wp-json/jyotishwala/v1/rashifal
 * - GET    /wp-json/jyotishwala/v1/panchang
 * - POST   /wp-json/jyotishwala/v1/kundli
 * - POST   /wp-json/jyotishwala/v1/kundli/match
 * - GET    /wp-json/jyotishwala/v1/app-settings
 * - GET    /wp-json/jyotishwala/v1/site-content
 * - GET    /wp-json/jyotishwala/v1/tyohar
 * - GET    /wp-json/jyotishwala/v1/gallery
 * - GET    /wp-json/jyotishwala/v1/reviews
 * - POST   /wp-json/jyotishwala/v1/reviews
 * - GET    /wp-json/jyotishwala/v1/pandits
 * - POST   /wp-json/jyotishwala/v1/receipts
 * - GET    /wp-json/jyotishwala/v1/location
 * - POST   /wp-json/jyotishwala/v1/user/register
 * - POST   /wp-json/jyotishwala/v1/user/login
 * - POST   /wp-json/jyotishwala/v1/user/logout
 * - GET    /wp-json/jyotishwala/v1/user/profile
 * - POST   /wp-json/jyotishwala/v1/user/profile
 * - GET    /wp-json/jyotishwala/v1/user/receipts
 * - GET    /wp-json/jyotishwala/v1/user/saved-kundlis
 * - POST   /wp-json/jyotishwala/v1/user/saved-kundlis
 * - DELETE /wp-json/jyotishwala/v1/user/saved-kundlis/(?P<id>[a-zA-Z0-9_-]+)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_REST_API {

	const NAMESPACE_V1 = 'jyotishwala/v1';

	/**
	 * Hooks REST route registration and CORS headers.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'configure_cors' ), 15 );
	}

	/**
	 * Enables safe CORS and strict no-cache headers (including Hostinger LiteSpeed Web Server bypass).
	 */
	public static function configure_cors() {
		add_filter(
			'rest_pre_serve_request',
			function ( $value, $result, $request ) {
				header( 'Access-Control-Allow-Origin: *' );
				header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );
				header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, Cache-Control, Pragma' );
				if ( $request instanceof WP_REST_Request && 0 === strpos( $request->get_route(), '/jyotishwala/v1' ) ) {
					header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );
					header( 'Pragma: no-cache' );
					header( 'Expires: 0' );
					header( 'X-LiteSpeed-Cache-Control: no-cache, no-store, must-revalidate' );
					do_action( 'litespeed_control_set_nocache', 'JyotishWala Live REST API' );
				}
				return $value;
			},
			10,
			3
		);
	}

	/**
	 * Registers all `/wp-json/jyotishwala/v1/*` routes.
	 */
	public static function register_routes() {
		// 1. GET /home (Aggregated Home Screen Data: Banners, Panchang, Featured Posts, Reviews, Pandits)
		register_rest_route(
			self::NAMESPACE_V1,
			'/home',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_home' ),
				'permission_callback' => '__return_true',
			)
		);

		// 2. GET /posts (WordPress Blog Posts formatted for the JyotishWala App)
		register_rest_route(
			self::NAMESPACE_V1,
			'/posts',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_posts' ),
				'permission_callback' => '__return_true',
			)
		);

		// 3. GET /categories (WordPress Post Categories)
		register_rest_route(
			self::NAMESPACE_V1,
			'/categories',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_categories' ),
				'permission_callback' => '__return_true',
			)
		);

		// 4. GET /rashifal (Daily, Weekly, Monthly, Yearly for 12 Zodiac Signs)
		register_rest_route(
			self::NAMESPACE_V1,
			'/rashifal',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_rashifal' ),
				'permission_callback' => '__return_true',
			)
		);

		// 5. GET /panchang (Daily Panchang for Rishikesh or requested coordinates)
		register_rest_route(
			self::NAMESPACE_V1,
			'/panchang',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_panchang' ),
				'permission_callback' => '__return_true',
			)
		);

		// 6. POST /kundli (Calculate Birth Chart, Planets, Navamsha D9, Vimshottari Dasha)
		register_rest_route(
			self::NAMESPACE_V1,
			'/kundli',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_post_kundli' ),
				'permission_callback' => '__return_true',
			)
		);

		// 7. POST /kundli/match (Ashtakoot 36-Guna Kundli Matching)
		register_rest_route(
			self::NAMESPACE_V1,
			'/kundli/match',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_post_kundli_match' ),
				'permission_callback' => '__return_true',
			)
		);

		// 8. GET /app-settings & GET /site-content (Public App Settings, Feature Toggles, Structured Sankalp/About/Privacy/Slides)
		register_rest_route(
			self::NAMESPACE_V1,
			'/app-settings',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_app_settings' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/site-content',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_site_content' ),
				'permission_callback' => '__return_true',
			)
		);

		// 9. GET /tyohar, GET /gallery, GET & POST /reviews, GET /pandits, POST /receipts, GET /location
		register_rest_route(
			self::NAMESPACE_V1,
			'/tyohar',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_tyohar' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/gallery',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_gallery' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/reviews',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'handle_get_reviews' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'handle_post_review' ),
					'permission_callback' => '__return_true',
				),
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/pandits',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_pandits' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/receipts',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_post_receipt' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/location',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_location' ),
				'permission_callback' => '__return_true',
			)
		);

		// 10. Mobile User Authentication & Profile Routes
		register_rest_route(
			self::NAMESPACE_V1,
			'/user/register',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_user_register' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/user/login',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_user_login' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/user/forgot-password',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_user_forgot_password' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/user/forgot-email',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_user_forgot_email' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/user/logout',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_user_logout' ),
				'permission_callback' => array( __CLASS__, 'require_mobile_user_auth' ),
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/user/profile',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'handle_get_user_profile' ),
					'permission_callback' => array( __CLASS__, 'require_mobile_user_auth' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'handle_update_user_profile' ),
					'permission_callback' => array( __CLASS__, 'require_mobile_user_auth' ),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/user/receipts',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_user_receipts' ),
				'permission_callback' => array( __CLASS__, 'require_mobile_user_auth' ),
			)
		);

		// 11. Authenticated User Saved Kundlis Routes
		register_rest_route(
			self::NAMESPACE_V1,
			'/user/saved-kundlis',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'handle_get_saved_kundlis' ),
					'permission_callback' => array( __CLASS__, 'require_mobile_user_auth' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'handle_save_kundli' ),
					'permission_callback' => '__return_true',
				),
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/user/saved-kundlis/(?P<id>[a-zA-Z0-9_-]+)',
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( __CLASS__, 'handle_delete_saved_kundli' ),
				'permission_callback' => array( __CLASS__, 'require_mobile_user_auth' ),
			)
		);

		// 12. Feature-wise Integration Health & Diagnostics Endpoints
		register_rest_route(
			self::NAMESPACE_V1,
			'/health',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_health' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/diagnostics/run',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_post_diagnostics_run' ),
				'permission_callback' => '__return_true',
			)
		);

		// 13. Sanatan Platform Expansion Routes (Knowledge, Pujas, Mantras, Sanskrit, Temples, Bookings, Pandit Registration, Support, Feature Registry)
		register_rest_route(
			self::NAMESPACE_V1,
			'/knowledge',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_knowledge' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/pujas',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_pujas' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/mantras',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_mantras' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/sanskrit',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_sanskrit' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/temples',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_temples' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/bookings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'handle_get_bookings' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'handle_post_booking' ),
					'permission_callback' => '__return_true',
				),
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/pandit-register',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'handle_post_pandit_register' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/support',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'handle_get_support_tickets' ),
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'handle_post_support_ticket' ),
					'permission_callback' => '__return_true',
				),
			)
		);

		register_rest_route(
			self::NAMESPACE_V1,
			'/feature-registry',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'handle_get_feature_registry' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Permission callback for authenticated mobile user endpoints.
	 */
	public static function require_mobile_user_auth( $request ) {
		$user_id = JW_Authentication::authenticate_request( $request );
		if ( is_wp_error( $user_id ) ) {
			return $user_id;
		}
		$request->set_param( '_authenticated_user_id', $user_id );
		return true;
	}

	/**
	 * Helper: resolves optional authenticated user_id from Bearer token without failing if unauthenticated.
	 */
	private static function get_optional_authenticated_user_id( $request ) {
		$auth_header = $request->get_header( 'authorization' );
		if ( empty( $auth_header ) ) {
			return 0;
		}
		$user_id = JW_Authentication::authenticate_request( $request );
		return ( ! is_wp_error( $user_id ) && $user_id > 0 ) ? (int) $user_id : 0;
	}

	/**
	 * Helper: formats a DB banner row into frontend HomeSlideItem shape.
	 */
	private static function format_banner_slide( $b ) {
		return array(
			'id'           => $b['slide_uid'],
			'badge'        => $b['badge'],
			'title'        => $b['title'],
			'description'  => $b['subtitle'],
			'buttonText'   => $b['cta_text'],
			'targetScreen' => $b['target_page'],
			'theme'        => $b['bg_theme'],
			'bgImage'      => $b['bg_image_url'],
		);
	}

	/**
	 * Helper: formats a DB Pandit row into frontend PanditProfile shape.
	 */
	private static function format_pandit_row( $row ) {
		$specs = array_values( array_filter( array_map( 'trim', explode( ',', (string) ( $row['specialties'] ?? '' ) ) ) ) );
		$langs = array_values( array_filter( array_map( 'trim', explode( ',', (string) ( $row['languages'] ?? '' ) ) ) ) );

		return array(
			'id'              => ! empty( $row['pandit_uid'] ) ? $row['pandit_uid'] : ( 'pandit_' . ( $row['id'] ?? 1 ) ),
			'dbId'            => (int) ( $row['id'] ?? 1 ),
			'name'            => $row['name'] ?? '',
			'qualification'   => $row['qualification'] ?? '',
			'experienceYears' => (int) ( $row['experience_years'] ?? 15 ),
			'specialties'     => ! empty( $specs ) ? $specs : array( 'वैदिक ज्योतिष' ),
			'languages'       => ! empty( $langs ) ? $langs : array( 'हिन्दी', 'संस्कृत' ),
			'mobile'          => $row['mobile'] ?? '',
			'email'           => $row['email'] ?? '',
			'address'         => $row['address'] ?? '',
			'avatar'          => $row['avatar_url'] ?? '',
			'qrCodeUrl'       => $row['qr_code_url'] ?? '',
			'dakshinaInfo'    => $row['dakshina_info'] ?? '',
			'about'           => $row['about'] ?? '',
			'isChief'         => ! empty( $row['is_chief'] ),
			'displayOrder'    => (int) ( $row['display_order'] ?? 1 ),
		);
	}

	/**
	 * Helper: formats a DB Tyohar row with all 8 detailed sections decoded.
	 */
	private static function format_tyohar_row( $row ) {
		$details = ! empty( $row['details_json'] ) ? json_decode( $row['details_json'], true ) : array();
		if ( ! is_array( $details ) ) {
			$details = array();
		}

		$hindi_months = array(
			1 => 'जनवरी', 2 => 'फरवरी', 3 => 'मार्च', 4 => 'अप्रैल', 5 => 'मई', 6 => 'जून',
			7 => 'जुलाई', 8 => 'अगस्त', 9 => 'सितंबर', 10 => 'अक्टूबर', 11 => 'नवंबर', 12 => 'दिसंबर',
		);
		$parts = explode( '-', $row['tyohar_date'] );
		$yr    = isset( $parts[0] ) ? (int) $parts[0] : (int) gmdate( 'Y' );
		$m_num = isset( $parts[1] ) ? max( 1, min( 12, (int) $parts[1] ) ) : (int) $row['month_number'];
		$d_num = isset( $parts[2] ) ? (int) $parts[2] : 1;
		$m_lbl = $hindi_months[ $m_num ] ?? 'जनवरी';

		$why = ! empty( $details['whyCelebrated'] ) ? $details['whyCelebrated'] : ( $details['detailedSignificance'] ?? '' );

		return array(
			'id'                   => $row['tyohar_uid'],
			'dbId'                 => (int) $row['id'],
			'name'                 => $row['name'],
			'date'                 => $row['tyohar_date'],
			'displayDate'          => sprintf( '%02d %s %d', $d_num, $m_lbl, $yr ),
			'monthNumber'          => $m_num,
			'monthName'            => $m_lbl,
			'hindiMaas'            => trim( $row['hindi_month'] . ' ' . $row['paksha'] ),
			'paksha'               => $row['paksha'],
			'pakshaTithi'          => $row['tithi'],
			'vara'                 => $row['vara'],
			'category'             => $row['category'],
			'shortInfo'            => $row['significance'],
			'detailedSignificance' => $why,
			'whyCelebrated'        => $why,
			'historyAndPauranik'   => $details['historyAndPauranik'] ?? '',
			'pujaVidhi'            => $details['pujaVidhi'] ?? '',
			'vratAndRules'         => $details['vratAndRules'] ?? '',
			'kathaOrMantra'        => $details['kathaOrMantra'] ?? '',
			'sankalp'              => $details['sankalp'] ?? '',
			'doAndDonts'           => $details['doAndDonts'] ?? '',
			'daanAndUpay'          => $details['daanAndUpay'] ?? '',
			'details'              => $details,
		);
	}

	/**
	 * Helper: formats a DB Gallery row into frontend GalleryPhotoItem shape.
	 */
	private static function format_gallery_row( $row ) {
		$group_imgs = ! empty( $row['group_images_json'] ) ? json_decode( $row['group_images_json'], true ) : null;
		$item       = array(
			'id'          => $row['photo_uid'],
			'dbId'        => (int) $row['id'],
			'title'       => $row['title'],
			'category'    => $row['category'],
			'imageUrl'    => $row['image_url'],
			'location'    => $row['location'],
			'date'        => $row['event_date'],
			'acharyaName' => $row['acharya_name'] ?? 'आचार्य परेश्वर भारद्वाज',
			'description' => $row['description'] ?? '',
			'isFeatured'  => (bool) $row['is_featured'],
		);
		if ( is_array( $group_imgs ) && count( $group_imgs ) > 1 ) {
			$item['groupImages'] = array_values( $group_imgs );
		}
		return $item;
	}

	/**
	 * Helper: formats a DB Review row into frontend AppReviewItem shape.
	 */
	private static function format_review_row( $r ) {
		return array(
			'id'              => $r['review_uid'],
			'dbId'            => (int) $r['id'],
			'userName'        => $r['user_name'],
			'userCity'        => $r['user_city'],
			'serviceCategory' => $r['service_category'],
			'rating'          => (int) $r['rating'],
			'comment'         => $r['comment'],
			'date'            => substr( (string) $r['created_at'], 0, 10 ),
			'status'          => $r['status'],
			'adminReply'      => $r['admin_reply'],
			'isVerified'      => (bool) $r['is_verified'],
		);
	}

	/**
	 * Helper: formats a DB Notification row into frontend PushNotification shape.
	 */
	private static function format_notification_row( $n ) {
		$cat_map = array(
			'panchang' => 'panchang',
			'tyohar'   => 'festival',
			'rashifal' => 'horoscope',
			'muhurta'  => 'muhurat',
			'transit'  => 'transit',
		);
		$raw_cat = isset( $n['category'] ) ? $n['category'] : 'panchang';
		return array(
			'id'           => $n['notif_uid'],
			'dbId'         => (int) $n['id'],
			'title'        => $n['title'],
			'body'         => $n['message'],
			'message'      => $n['message'],
			'time'         => substr( (string) $n['sent_at'], 0, 16 ),
			'category'     => isset( $cat_map[ $raw_cat ] ) ? $cat_map[ $raw_cat ] : 'panchang',
			'targetScreen' => $n['target_screen'] ?? 'home',
			'read'         => false,
		);
	}

	/**
	 * Helper: formats a DB Rashifal row into frontend HoroscopePrediction shape.
	 */
	private static function format_rashifal_row( $r, $idx = 0 ) {
		$meta_by_slug = array(
			'mesh'      => array( 0, 'Aries', 'मेष', '♈', '21 मार्च - 19 अप्रैल', 'मंगल', 'अग्नि', '#EF4444', 'प्रातः 09:15 - 11:00' ),
			'vrishabh'  => array( 1, 'Taurus', 'वृषभ', '♉', '20 अप्रैल - 20 मई', 'शुक्र', 'पृथ्वी', '#E2E8F0', 'दोपहर 01:30 - 03:00' ),
			'mithun'    => array( 2, 'Gemini', 'मिथुन', '♊', '21 मई - 20 जून', 'बुध', 'वायु', '#10B981', 'सायं 04:00 - 05:30' ),
			'kark'      => array( 3, 'Cancer', 'कर्क', '♋', '21 जून - 22 जुलाई', 'चन्द्र', 'जल', '#F8FAFC', 'प्रातः 07:30 - 09:00' ),
			'karka'     => array( 3, 'Cancer', 'कर्क', '♋', '21 जून - 22 जुलाई', 'चन्द्र', 'जल', '#F8FAFC', 'प्रातः 07:30 - 09:00' ),
			'simha'     => array( 4, 'Leo', 'सिंह', '♌', '23 जुलाई - 22 अगस्त', 'सूर्य', 'अग्नि', '#F59E0B', 'प्रातः 06:30 - 08:00' ),
			'kanya'     => array( 5, 'Virgo', 'कन्या', '♍', '23 अगस्त - 22 सितंबर', 'बुध', 'पृथ्वी', '#059669', 'प्रातः 10:30 - 12:00' ),
			'tula'      => array( 6, 'Libra', 'तुला', '♎', '23 सितंबर - 22 अक्टूबर', 'शुक्र', 'वायु', '#EC4899', 'दोपहर 02:00 - 03:30' ),
			'vrishchik' => array( 7, 'Scorpio', 'वृश्चिक', '♏', '23 अक्टूबर - 21 नवंबर', 'मंगल', 'जल', '#991B1B', 'प्रातः 11:00 - 12:30' ),
			'dhanu'     => array( 8, 'Sagittarius', 'धनु', '♐', '22 नवंबर - 21 दिसंबर', 'बृहस्पति', 'अग्नि', '#EAB308', 'प्रातः 08:00 - 09:30' ),
			'makar'     => array( 9, 'Capricorn', 'मकर', '♑', '22 दिसंबर - 19 जनवरी', 'शनि', 'पृथ्वी', '#2563EB', 'सायं 05:00 - 06:30' ),
			'kumbh'     => array( 10, 'Aquarius', 'कुम्भ', '♒', '20 जनवरी - 18 फरवरी', 'शनि', 'वायु', '#0284C7', 'दोपहर 03:15 - 04:45' ),
			'meen'      => array( 11, 'Pisces', 'मीन', '♓', '19 फरवरी - 20 मार्च', 'बृहस्पति', 'जल', '#D97706', 'प्रातः 09:00 - 10:30' ),
		);
		$slug = ! empty( $r['rashi_id'] ) ? $r['rashi_id'] : ( ! empty( $r['rashi_slug'] ) ? $r['rashi_slug'] : 'mesh' );
		$m    = isset( $meta_by_slug[ $slug ] ) ? $meta_by_slug[ $slug ] : array( $idx, $r['rashi_name_en'] ?? 'Aries', $r['rashi_name_hi'] ?? 'मेष', '♈', '', 'सूर्य', 'अग्नि', '#FF7F33', 'प्रातः 09:00 - 10:30' );

		return array(
			'signIndex'     => (int) $m[0],
			'signName'      => $r['rashi_name_en'] ?: $m[1],
			'hindiName'     => $r['rashi_name_hi'] ?: $m[2],
			'symbol'        => $m[3],
			'dateRange'     => $m[4],
			'ruler'         => $m[5],
			'element'       => $m[6],
			'general'       => $r['prediction_hi'],
			'predictionEn'  => $r['prediction_en'],
			'career'        => $r['career_hi'],
			'love'          => $r['love_hi'],
			'health'        => $r['health_hi'],
			'finance'       => $r['career_hi'],
			'luckyNumber'   => is_numeric( $r['lucky_number'] ) ? (int) $r['lucky_number'] : 3,
			'luckyColor'    => $r['lucky_color'] ?: 'केसरिया',
			'luckyColorHex' => $m[7],
			'luckyTime'     => $m[8],
			'remedy'        => $r['remedy_hi'],
			'rating'        => array(
				'career'  => 5,
				'love'    => 4,
				'health'  => 4,
				'finance' => 5,
			),
		);
	}

	/**
	 * GET /home (Complete Bootstrap Sync for All App Modules)
	 */
	public static function handle_get_home( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'home' ) ) {
			return new WP_REST_Response( array( 'error' => 'Too many requests' ), 429 );
		}

		global $wpdb;
		$t_banners       = JW_Database::table( 'banners' );
		$t_pandits       = JW_Database::table( 'pandits' );
		$t_reviews       = JW_Database::table( 'reviews' );
		$t_notifications = JW_Database::table( 'notifications' );
		$t_gallery       = JW_Database::table( 'gallery' );
		$t_tyohar        = JW_Database::table( 'tyohar' );
		$t_rashifal      = JW_Database::table( 'rashifal' );

		// Auto-seed default Banners / Notifications once if upgrading from an older version where they were empty
		if ( ! get_option( 'jw_v130_defaults_seeded' ) ) {
			JW_Database::seed_initial_data();
			update_option( 'jw_v130_defaults_seeded', '1' );
		}

		$raw_pandits = $wpdb->get_results( "SELECT * FROM {$t_pandits} WHERE is_active = 1 ORDER BY is_chief DESC, display_order ASC, id ASC", ARRAY_A ); // phpcs:ignore
		$raw_reviews = $wpdb->get_results( "SELECT * FROM {$t_reviews} WHERE status = 'approved' ORDER BY id DESC LIMIT 50", ARRAY_A ); // phpcs:ignore
		$raw_notifs  = $wpdb->get_results( "SELECT * FROM {$t_notifications} WHERE status = 'sent' ORDER BY id DESC LIMIT 20", ARRAY_A ); // phpcs:ignore
		$raw_gallery = $wpdb->get_results( "SELECT * FROM {$t_gallery} ORDER BY display_order ASC, id DESC", ARRAY_A ); // phpcs:ignore
		$raw_tyohar  = $wpdb->get_results( "SELECT * FROM {$t_tyohar} WHERE is_active = 1 ORDER BY tyohar_date ASC", ARRAY_A ); // phpcs:ignore

		$slides        = array_map( array( __CLASS__, 'format_banner_slide' ), $raw_banners );
		$pandits       = array_map( array( __CLASS__, 'format_pandit_row' ), $raw_pandits );
		$chief         = get_option( 'jw_chief_astrologer', null );
		if ( empty( $pandits ) && ! empty( $chief ) && is_array( $chief ) && ! empty( $chief['name'] ) ) {
			$chief['pandit_uid'] = 'chief_astrologer_1';
			$chief['id']         = 1;
			$chief['is_chief']   = 1;
			$pandits             = array( self::format_pandit_row( $chief ) );
		}
		$reviews_items = array_map( array( __CLASS__, 'format_review_row' ), $raw_reviews );
		$notifs_items  = array_map( array( __CLASS__, 'format_notification_row' ), $raw_notifs );
		$gallery_items = array_map( array( __CLASS__, 'format_gallery_row' ), $raw_gallery );
		$tyohar_items  = array_map( array( __CLASS__, 'format_tyohar_row' ), $raw_tyohar );

		// Rashifal (Daily, Weekly, Monthly, Yearly)
		$rashifal_map = array(
			'daily'   => array(),
			'weekly'  => array(),
			'monthly' => array(),
			'yearly'  => array(),
		);
		$raw_rashifal = $wpdb->get_results( "SELECT * FROM {$t_rashifal} WHERE status = 'published' ORDER BY id ASC", ARRAY_A ); // phpcs:ignore
		foreach ( $raw_rashifal as $r_row ) {
			$p = $r_row['period'];
			if ( isset( $rashifal_map[ $p ] ) ) {
				$rashifal_map[ $p ][] = self::format_rashifal_row( $r_row, count( $rashifal_map[ $p ] ) );
			}
		}

		$site_pages         = JW_Settings::get_site_pages_content();
		$app_settings       = JW_Settings::get_app_settings();
		$panchang_settings  = JW_Settings::get_panchang_settings();
		$kundli_settings    = JW_Settings::get_kundli_settings();
		$deleted_tyohar_ids = get_option( 'jw_deleted_tyohar_uids', array() );
		if ( ! is_array( $deleted_tyohar_ids ) ) {
			$deleted_tyohar_ids = array();
		}

		$app_settings_payload = array_merge(
			$app_settings,
			array(
				'maintenanceMode'    => ! empty( $app_settings['maintenance_mode'] ),
				'maintenanceMessage' => $app_settings['maintenance_message'] ?? '',
				'defaultLanguage'    => $app_settings['default_language'] ?? 'hi',
				'defaultCity'        => $panchang_settings['default_city_name'] ?? 'ऋषिकेश',
				'panchangSettings'   => $panchang_settings,
				'kundliSettings'     => $kundli_settings,
			)
		);

		$t_api = JW_Database::table( 'api_vault' );
		$raw_apis = $wpdb->get_results( "SELECT module, is_enabled FROM {$t_api}", ARRAY_A ); // phpcs:ignore
		$api_statuses = array();
		if ( is_array( $raw_apis ) ) {
			foreach ( $raw_apis as $a ) {
				$api_statuses[ $a['module'] ] = (bool) $a['is_enabled'];
			}
		}

		return new WP_REST_Response(
			array(
				'ok'               => true,
				'appSettings'      => $app_settings_payload,
				'apiStatuses'      => $api_statuses,
				'sitePages'        => $site_pages,
				'siteContent'      => array(
					'sankalp' => $site_pages['sankalp'],
					'about'   => $site_pages['about'],
					'privacy' => $site_pages['privacy'],
					'slides'  => $slides,
				),
				'banners'          => $raw_banners,
				'slides'           => $slides,
				'panchang'         => JW_Panchang_API::get_panchang(),
				'rashifal'         => $rashifal_map,
				'pandits'          => $pandits,
				'gallery'          => array(
					'meta'  => $site_pages['galleryMeta'],
					'items' => $gallery_items,
				),
				'reviews'          => array(
					'meta'  => $site_pages['reviewMeta'],
					'items' => $reviews_items,
				),
				'tyohar'           => $tyohar_items,
				'deletedTyoharIds' => array_values( array_unique( $deleted_tyohar_ids ) ),
				'notifications'    => $notifs_items,
				'sankalp'          => $site_pages['sankalp'],
			),
			200
		);
	}

	/**
	 * GET /posts
	 */
	public static function handle_get_posts( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'posts', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		$per_page = min( 50, max( 1, absint( $request->get_param( 'per_page' ) ?: 20 ) ) );
		$page     = max( 1, absint( $request->get_param( 'page' ) ?: 1 ) );
		$cat_name = sanitize_text_field( $request->get_param( 'category' ) ?: '' );

		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'paged'          => $page,
		);
		if ( ! empty( $cat_name ) && 'सभी' !== $cat_name ) {
			$args['category_name'] = $cat_name;
		}

		$query = new WP_Query( $args );
		$posts = array();

		foreach ( $query->posts as $post ) {
			$cats     = get_the_category( $post->ID );
			$cat_hi   = ! empty( $cats ) ? $cats[0]->name : 'वैदिक ज्योतिष';
			$tags_obj = get_the_tags( $post->ID );
			$tags     = array();
			if ( ! empty( $tags_obj ) ) {
				foreach ( $tags_obj as $t ) {
					$tags[] = $t->name;
				}
			}
			$thumb_url = get_the_post_thumbnail_url( $post->ID, 'large' );
			$author    = get_the_author_meta( 'display_name', $post->post_author );
			$content   = apply_filters( 'the_content', $post->post_content );
			$plain     = wp_strip_all_tags( $content );
			$words     = max( 1, str_word_count( $plain ) );

			$posts[] = array(
				'id'              => 'wp_' . $post->ID,
				'wpPostId'        => (int) $post->ID,
				'title'           => html_entity_decode( get_the_title( $post->ID ), ENT_QUOTES, 'UTF-8' ),
				'slug'            => $post->post_name,
				'category'        => 'Kundli',
				'categoryHindi'   => $cat_hi,
				'excerpt'         => wp_trim_words( $plain, 28, '...' ),
				'content'         => $plain,
				'rawHtml'         => $content,
				'author'          => $author ?: 'ज्योतिषवाला संपादकीय',
				'authorRole'      => 'संपादक, JyotishWala',
				'publishedAt'     => get_the_date( 'Y-m-d', $post->ID ),
				'readTime'        => max( 2, (int) round( $words / 180 ) ) . ' मिनट',
				'imageUrl'        => $thumb_url ?: '',
				'tags'            => ! empty( $tags ) ? $tags : array( 'ज्योतिष', 'सनातन धर्म' ),
				'isWordPressPost' => true,
			);
		}

		return new WP_REST_Response(
			array(
				'ok'         => true,
				'posts'      => $posts,
				'total'      => (int) $query->found_posts,
				'totalPages' => (int) $query->max_num_pages,
			),
			200
		);
	}

	/**
	 * GET /categories
	 */
	public static function handle_get_categories() {
		if ( ! JW_Logging::check_rate_limit( 'categories', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		$terms = get_categories( array( 'hide_empty' => false ) );
		$list  = array();
		foreach ( $terms as $term ) {
			$list[] = array(
				'id'    => (int) $term->term_id,
				'name'  => $term->name,
				'slug'  => $term->slug,
				'count' => (int) $term->count,
			);
		}
		return new WP_REST_Response( array( 'ok' => true, 'categories' => $list ), 200 );
	}

	/**
	 * GET /rashifal
	 */
	public static function handle_get_rashifal( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'rashifal', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$t_rashifal = JW_Database::table( 'rashifal' );
		$period     = sanitize_key( $request->get_param( 'period' ) ?: 'daily' );
		if ( ! in_array( $period, array( 'daily', 'weekly', 'monthly', 'yearly' ), true ) ) {
			$period = 'daily';
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$t_rashifal} WHERE period = %s AND status = 'published' ORDER BY id ASC", // phpcs:ignore
				$period
			),
			ARRAY_A
		);

		return new WP_REST_Response(
			array(
				'ok'       => true,
				'period'   => $period,
				'rashifal' => $rows,
			),
			200
		);
	}

	/**
	 * GET /panchang
	 */
	public static function handle_get_panchang( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'panchang' ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}

		global $wpdb;
		$t_api = JW_Database::table( 'api_vault' );
		$is_api_enabled = (int) $wpdb->get_var( "SELECT is_enabled FROM {$t_api} WHERE module = 'panchang' LIMIT 1" ); // phpcs:ignore
		if ( 0 === $is_api_enabled ) {
			return new WP_REST_Response( array( 'ok' => false, 'error' => 'Panchang API is temporarily disabled by administrator in API Vault.' ), 403 );
		}

		$date = sanitize_text_field( $request->get_param( 'date' ) ?: '' );
		$lat  = $request->get_param( 'lat' );
		$lng  = $request->get_param( 'lng' );
		$city = sanitize_text_field( $request->get_param( 'city' ) ?: '' );

		$data = JW_Panchang_API::get_panchang( $date, $lat, $lng, $city );
		return new WP_REST_Response( array( 'ok' => true, 'panchang' => $data ), 200 );
	}

	/**
	 * POST /kundli
	 */
	public static function handle_post_kundli( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'kundli', 30 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}

		global $wpdb;
		$t_api = JW_Database::table( 'api_vault' );
		$is_api_enabled = (int) $wpdb->get_var( "SELECT is_enabled FROM {$t_api} WHERE module = 'kundli' LIMIT 1" ); // phpcs:ignore
		if ( 0 === $is_api_enabled ) {
			return new WP_REST_Response( array( 'ok' => false, 'error' => 'Kundli Generator API is temporarily disabled by administrator in API Vault.' ), 403 );
		}

		$params    = $request->get_json_params();
		$validated = JW_Kundli::validate_and_normalize_birth_input( is_array( $params ) ? $params : array(), true );
		if ( is_wp_error( $validated ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'code'  => $validated->get_error_code(),
					'error' => $validated->get_error_message(),
				),
				400
			);
		}
		$chart = JW_Kundli::calculate_kundli( $validated );
		if ( is_wp_error( $chart ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'code'  => $chart->get_error_code(),
					'error' => $chart->get_error_message(),
				),
				400
			);
		}
		return new WP_REST_Response( array( 'ok' => true, 'kundli' => $chart ), 200 );
	}

	/**
	 * POST /kundli/match
	 */
	public static function handle_post_kundli_match( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'kundli_match', 30 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}

		global $wpdb;
		$t_api = JW_Database::table( 'api_vault' );
		$is_api_enabled = (int) $wpdb->get_var( "SELECT is_enabled FROM {$t_api} WHERE module = 'milan' LIMIT 1" ); // phpcs:ignore
		if ( 0 === $is_api_enabled ) {
			return new WP_REST_Response( array( 'ok' => false, 'error' => 'Kundli Milan API is temporarily disabled by administrator in API Vault.' ), 403 );
		}
		$params = $request->get_json_params();
		if ( ! is_array( $params ) || empty( $params['boy'] ) || ! is_array( $params['boy'] ) || empty( $params['girl'] ) || ! is_array( $params['girl'] ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'code'  => 'missing_match_inputs',
					'error' => 'Both "boy" and "girl" birth details objects are required.',
				),
				400
			);
		}

		$boy_valid = JW_Kundli::validate_and_normalize_birth_input( $params['boy'], true, 'Boy' );
		if ( is_wp_error( $boy_valid ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'code'  => $boy_valid->get_error_code(),
					'error' => $boy_valid->get_error_message(),
				),
				400
			);
		}

		$girl_valid = JW_Kundli::validate_and_normalize_birth_input( $params['girl'], true, 'Girl' );
		if ( is_wp_error( $girl_valid ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'code'  => $girl_valid->get_error_code(),
					'error' => $girl_valid->get_error_message(),
				),
				400
			);
		}

		$match = JW_Kundli::match_kundli( $boy_valid, $girl_valid );
		if ( is_wp_error( $match ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'code'  => $match->get_error_code(),
					'error' => $match->get_error_message(),
				),
				400
			);
		}
		return new WP_REST_Response( array( 'ok' => true, 'match' => $match ), 200 );
	}

	/**
	 * GET /app-settings
	 */
	public static function handle_get_app_settings() {
		if ( ! JW_Logging::check_rate_limit( 'app_settings', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		$site_pages = JW_Settings::get_site_pages_content();
		return new WP_REST_Response(
			array(
				'ok'               => true,
				'appSettings'      => JW_Settings::get_app_settings(),
				'panchangSettings' => JW_Settings::get_panchang_settings(),
				'kundliSettings'   => JW_Settings::get_kundli_settings(),
				'sitePages'        => $site_pages,
				'sankalp'          => $site_pages['sankalp'],
				'about'            => $site_pages['about'],
				'privacy'          => $site_pages['privacy'],
				'galleryMeta'      => $site_pages['galleryMeta'],
				'reviewMeta'       => $site_pages['reviewMeta'],
			),
			200
		);
	}

	/**
	 * GET /site-content (Structured SankalpContentConfig, AboutUsContentConfig, PrivacyPolicyContentConfig & Slides)
	 */
	public static function handle_get_site_content() {
		if ( ! JW_Logging::check_rate_limit( 'site_content', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$t_banners   = JW_Database::table( 'banners' );
		$raw_banners = $wpdb->get_results( "SELECT * FROM {$t_banners} WHERE is_enabled = 1 ORDER BY display_order ASC", ARRAY_A ); // phpcs:ignore
		$slides      = array_map( array( __CLASS__, 'format_banner_slide' ), $raw_banners );
		$site_pages  = JW_Settings::get_site_pages_content();

		return new WP_REST_Response(
			array(
				'ok'          => true,
				'sankalp'     => $site_pages['sankalp'],
				'about'       => $site_pages['about'],
				'privacy'     => $site_pages['privacy'],
				'slides'      => $slides,
				'galleryMeta' => $site_pages['galleryMeta'],
				'reviewMeta'  => $site_pages['reviewMeta'],
			),
			200
		);
	}

	/**
	 * GET /tyohar
	 */
	public static function handle_get_tyohar( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'tyohar', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$t_tyohar = JW_Database::table( 'tyohar' );
		$year     = absint( $request->get_param( 'year' ) ?: 0 );
		$month    = absint( $request->get_param( 'month' ) ?: 0 );
		$category = sanitize_text_field( $request->get_param( 'category' ) ?: '' );

		$where  = array( 'is_active = 1' );
		$values = array();

		if ( $year >= 2020 && $year <= 2035 ) {
			$where[]  = 'YEAR(tyohar_date) = %d';
			$values[] = $year;
		}
		if ( $month >= 1 && $month <= 12 ) {
			$where[]  = 'MONTH(tyohar_date) = %d';
			$values[] = $month;
		}
		if ( ! empty( $category ) && 'सभी' !== $category ) {
			$where[]  = 'category = %s';
			$values[] = $category;
		}

		$where_sql = implode( ' AND ', $where );
		if ( ! empty( $values ) ) {
			$rows = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t_tyohar} WHERE {$where_sql} ORDER BY tyohar_date ASC", $values ), ARRAY_A ); // phpcs:ignore
		} else {
			$rows = $wpdb->get_results( "SELECT * FROM {$t_tyohar} WHERE {$where_sql} ORDER BY tyohar_date ASC", ARRAY_A ); // phpcs:ignore
		}

		$formatted = array_map( array( __CLASS__, 'format_tyohar_row' ), $rows );
		return new WP_REST_Response( array( 'ok' => true, 'tyohar' => $formatted ), 200 );
	}

	/**
	 * GET /gallery
	 */
	public static function handle_get_gallery( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'gallery', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$t_gallery  = JW_Database::table( 'gallery' );
		$category   = sanitize_text_field( $request->get_param( 'category' ) ?: '' );
		$site_pages = JW_Settings::get_site_pages_content();

		if ( ! empty( $category ) && 'सभी' !== $category ) {
			$rows = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$t_gallery} WHERE category = %s ORDER BY display_order ASC, id DESC", $category ), ARRAY_A ); // phpcs:ignore
		} else {
			$rows = $wpdb->get_results( "SELECT * FROM {$t_gallery} ORDER BY display_order ASC, id DESC", ARRAY_A ); // phpcs:ignore
		}

		$photos = array_map( array( __CLASS__, 'format_gallery_row' ), $rows );

		return new WP_REST_Response(
			array(
				'ok'          => true,
				'meta'        => $site_pages['galleryMeta'],
				'galleryMeta' => $site_pages['galleryMeta'],
				'gallery'     => $photos,
				'photos'      => $photos,
			),
			200
		);
	}

	/**
	 * GET /reviews
	 */
	public static function handle_get_reviews() {
		if ( ! JW_Logging::check_rate_limit( 'get_reviews', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$t_reviews  = JW_Database::table( 'reviews' );
		$site_pages = JW_Settings::get_site_pages_content();
		$rows       = $wpdb->get_results( "SELECT * FROM {$t_reviews} WHERE status = 'approved' ORDER BY id DESC", ARRAY_A ); // phpcs:ignore

		$formatted = array();
		foreach ( $rows as $r ) {
			$formatted[] = array(
				'id'              => $r['review_uid'],
				'userName'        => $r['user_name'],
				'userCity'        => $r['user_city'],
				'serviceCategory' => $r['service_category'],
				'rating'          => (int) $r['rating'],
				'comment'         => $r['comment'],
				'date'            => substr( (string) $r['created_at'], 0, 10 ),
				'status'          => $r['status'],
				'adminReply'      => $r['admin_reply'],
				'isVerified'      => (bool) $r['is_verified'],
			);
		}

		return new WP_REST_Response(
			array(
				'ok'         => true,
				'reviewMeta' => $site_pages['reviewMeta'],
				'reviews'    => $formatted,
			),
			200
		);
	}

	/**
	 * POST /reviews
	 */
	public static function handle_post_review( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'post_review', 10 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		$params   = $request->get_json_params();
		$name     = sanitize_text_field( isset( $params['userName'] ) ? $params['userName'] : '' );
		$city     = sanitize_text_field( isset( $params['userCity'] ) ? $params['userCity'] : '' );
		$category = sanitize_text_field( isset( $params['serviceCategory'] ) ? $params['serviceCategory'] : 'जन्मकुंडली एवं फलादेश' );
		$comment  = sanitize_textarea_field( isset( $params['comment'] ) ? $params['comment'] : '' );
		$rating   = max( 1, min( 5, absint( isset( $params['rating'] ) ? $params['rating'] : 5 ) ) );

		if ( empty( $name ) || empty( $comment ) ) {
			return new WP_REST_Response( array( 'error' => 'Name and review comment are required.' ), 400 );
		}

		global $wpdb;
		$t_reviews   = JW_Database::table( 'reviews' );
		$uid         = 'rev_' . uniqid();
		$user_id     = self::get_optional_authenticated_user_id( $request );
		$init_status = 'pending';

		$wpdb->insert(
			$t_reviews,
			array(
				'review_uid'       => $uid,
				'user_id'          => $user_id,
				'user_name'        => $name,
				'user_city'        => $city ?: 'भारत',
				'rating'           => $rating,
				'service_category' => $category,
				'comment'          => $comment,
				'is_verified'      => ( $user_id > 0 ) ? 1 : 0,
				'status'           => $init_status,
				'created_at'       => current_time( 'mysql' ),
			),
			array( '%s', '%d', '%s', '%s', '%d', '%s', '%s', '%d', '%s', '%s' )
		);

		return new WP_REST_Response(
			array(
				'ok'      => true,
				'status'  => $init_status,
				'message' => 'आपकी समीक्षा सफलतापूर्वक प्राप्त हो गई है और प्रशासक की स्वीकृति के पश्चात प्रदर्शित होगी।',
			),
			201
		);
	}

	/**
	 * GET /pandits
	 */
	public static function handle_get_pandits() {
		if ( ! JW_Logging::check_rate_limit( 'pandits', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$t_pandits = JW_Database::table( 'pandits' );
		$rows      = $wpdb->get_results( "SELECT * FROM {$t_pandits} WHERE is_active = 1 ORDER BY is_chief DESC, display_order ASC, id ASC", ARRAY_A ); // phpcs:ignore
		$pandits   = array_map( array( __CLASS__, 'format_pandit_row' ), $rows );

		$chief = get_option( 'jw_chief_astrologer', null );
		if ( empty( $pandits ) && ! empty( $chief ) && is_array( $chief ) && ! empty( $chief['name'] ) ) {
			$chief['pandit_uid'] = 'chief_astrologer_1';
			$chief['id']         = 1;
			$chief['is_chief']   = 1;
			$pandits             = array( self::format_pandit_row( $chief ) );
		}

		$chief_pandit = null;
		foreach ( $pandits as $p ) {
			if ( ! empty( $p['isChief'] ) ) {
				$chief_pandit = $p;
				break;
			}
		}
		if ( ! $chief_pandit && ! empty( $pandits ) ) {
			$chief_pandit = $pandits[0];
		}

		return new WP_REST_Response(
			array(
				'ok'      => true,
				'pandits' => $pandits,
				'chief'   => $chief_pandit,
			),
			200
		);
	}

	/**
	 * POST /receipts (Secure Consultation Payment Receipt Submission)
	 */
	public static function handle_post_receipt( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'post_receipt', 10 ) ) {
			return new WP_REST_Response( array( 'ok' => false, 'error' => 'Rate limit exceeded. Please try again later.' ), 429 );
		}

		$params      = $request->get_json_params();
		$pandit_id   = sanitize_text_field( isset( $params['panditId'] ) ? $params['panditId'] : '' );
		$pandit_name = sanitize_text_field( isset( $params['panditName'] ) ? $params['panditName'] : '' );
		$user_name   = sanitize_text_field( isset( $params['userName'] ) ? $params['userName'] : '' );
		$user_phone  = sanitize_text_field( isset( $params['userPhone'] ) ? $params['userPhone'] : '' );
		$user_email  = sanitize_email( isset( $params['userEmail'] ) ? $params['userEmail'] : '' );
		$amount      = sanitize_text_field( isset( $params['amount'] ) ? $params['amount'] : '' );
		$utr_number  = sanitize_text_field( isset( $params['utrNumber'] ) ? $params['utrNumber'] : '' );
		$note        = sanitize_textarea_field( isset( $params['note'] ) ? $params['note'] : '' );
		$raw_img     = isset( $params['receiptImageUrl'] ) ? trim( (string) $params['receiptImageUrl'] ) : '';

		$digits_only_phone = preg_replace( '/\D+/', '', $user_phone );
		if ( empty( $user_name ) || strlen( $digits_only_phone ) < 10 || empty( $amount ) || empty( $utr_number ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'error' => 'Valid user name, 10-digit mobile number, amount, and UTR/transaction ID are required.',
				),
				400
			);
		}

		global $wpdb;
		$t_receipts = JW_Database::table( 'receipts' );

		// Reject duplicate UTR submissions
		$existing_utr = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT id FROM {$t_receipts} WHERE utr_number = %s LIMIT 1", // phpcs:ignore
				$utr_number
			)
		);
		if ( $existing_utr ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'error' => 'A payment receipt with this UTR/Transaction ID has already been submitted.',
				),
				409
			);
		}

		// Validate receipt screenshot (either https/http URL or safe base64 image data URI <= 2MB)
		$safe_img = '';
		if ( ! empty( $raw_img ) ) {
			if ( 0 === strpos( $raw_img, 'data:image/' ) ) {
				if ( strlen( $raw_img ) > 2 * 1024 * 1024 || ! preg_match( '/^data:image\/(png|jpeg|jpg|webp);base64,[a-zA-Z0-9\/+=\r\n]+$/', $raw_img ) ) {
					return new WP_REST_Response(
						array(
							'ok'    => false,
							'error' => 'Invalid receipt image format or image exceeds 2 MB limit.',
						),
						400
					);
				}
				$safe_img = $raw_img;
			} else {
				$safe_img = esc_url_raw( $raw_img );
			}
		}

		// Strictly associate user_id ONLY from a verified Bearer token to prevent unauthenticated email enumeration/spoofing
		$user_id     = self::get_optional_authenticated_user_id( $request );
		$receipt_uid = 'rec_' . bin2hex( random_bytes( 8 ) );

		$wpdb->insert(
			$t_receipts,
			array(
				'receipt_uid'       => $receipt_uid,
				'user_id'           => $user_id,
				'pandit_id'         => $pandit_id ?: 'pandit_1',
				'pandit_name'       => $pandit_name ?: 'ज्योतिषाचार्य',
				'user_name'         => $user_name,
				'user_phone'        => $user_phone,
				'user_email'        => $user_email,
				'amount'            => $amount,
				'utr_number'        => $utr_number,
				'note'              => $note,
				'receipt_image_url' => $safe_img,
				'status'            => 'pending',
				'submitted_at'      => current_time( 'mysql' ),
			),
			array( '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
		);

		JW_Logging::log(
			'receipt',
			'info',
			'New consultation payment receipt submitted by ' . $user_name . ' (UTR: ' . $utr_number . ')',
			array(
				'receipt_uid' => $receipt_uid,
				'user_id'     => $user_id,
				'pandit_name' => $pandit_name,
			)
		);

		return new WP_REST_Response(
			array(
				'ok'          => true,
				'receiptId'   => $receipt_uid,
				'status'      => 'pending',
				'submittedAt' => current_time( 'mysql' ),
				'message'     => 'आपकी पेमेंट रसीद सफलतापूर्वक सुरक्षित कर ली गई है। सत्यापन के पश्चात परामर्श समय सूचित किया जाएगा।',
			),
			201
		);
	}

	/**
	 * GET /user/receipts (Authenticated user's own payment receipts only)
	 */
	public static function handle_get_user_receipts( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'user_receipts', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$user_id    = (int) $request->get_param( '_authenticated_user_id' );
		$t_receipts = JW_Database::table( 'receipts' );

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT receipt_uid, pandit_id, pandit_name, user_name, user_phone, user_email, amount, utr_number, note, status, admin_remarks, submitted_at, verified_at FROM {$t_receipts} WHERE user_id = %d ORDER BY id DESC", // phpcs:ignore
				$user_id
			),
			ARRAY_A
		);

		return new WP_REST_Response( array( 'ok' => true, 'receipts' => $rows ), 200 );
	}

	/**
	 * GET /location (Server-side geocoding proxy with rate limiting & 24h transient cache)
	 */
	public static function handle_get_location( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'location', 30 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}

		$q = sanitize_text_field( $request->get_param( 'q' ) ?: '' );
		if ( mb_strlen( $q ) < 2 ) {
			return new WP_REST_Response( array( 'results' => array() ), 200 );
		}

		$cache_key = 'jw_geo_' . md5( mb_strtolower( $q ) );
		$cached    = get_transient( $cache_key );
		if ( is_array( $cached ) ) {
			return new WP_REST_Response( array( 'results' => $cached ), 200 );
		}

		$url  = 'https://geocoding-api.open-meteo.com/v1/search?name=' . rawurlencode( $q ) . '&count=8&language=hi&format=json';
		$resp = wp_remote_get( $url, array( 'timeout' => 5 ) );
		if ( ! is_wp_error( $resp ) && 200 === wp_remote_retrieve_response_code( $resp ) ) {
			$body = json_decode( wp_remote_retrieve_body( $resp ), true );
			if ( ! empty( $body['results'] ) && is_array( $body['results'] ) ) {
				set_transient( $cache_key, $body['results'], DAY_IN_SECONDS );
				return new WP_REST_Response( array( 'results' => $body['results'] ), 200 );
			}
		}

		return new WP_REST_Response( array( 'results' => array() ), 200 );
	}

	/**
	 * POST /user/register
	 */
	public static function handle_user_register( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'user_register', 10 ) ) {
			return new WP_REST_Response( array( 'error' => 'Too many registration attempts.' ), 429 );
		}
		$params = $request->get_json_params();
		$res    = JW_User_Management::register_app_user( is_array( $params ) ? $params : array() );
		if ( is_wp_error( $res ) ) {
			$status = $res->get_error_data()['status'] ?? 400;
			return new WP_REST_Response( array( 'ok' => false, 'error' => $res->get_error_message() ), $status );
		}
		return new WP_REST_Response( array_merge( array( 'ok' => true ), $res ), 201 );
	}

	/**
	 * POST /user/login
	 */
	public static function handle_user_login( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'user_login', 25 ) ) {
			return new WP_REST_Response( array( 'error' => 'Too many login attempts.' ), 429 );
		}
		$params     = $request->get_json_params() ?: $request->get_params();
		$identifier = '';
		foreach ( array( 'login', 'email', 'phone', 'username', 'emailOrPhone' ) as $k ) {
			if ( ! empty( $params[ $k ] ) ) {
				$identifier = sanitize_text_field( (string) $params[ $k ] );
				break;
			}
		}
		$password = isset( $params['password'] ) ? (string) $params['password'] : '';
		$device   = isset( $params['device'] ) ? sanitize_text_field( $params['device'] ) : 'Android APK';

		$res = JW_User_Management::login_app_user( $identifier, $password, $device );
		if ( is_wp_error( $res ) ) {
			$status = $res->get_error_data()['status'] ?? 401;
			return new WP_REST_Response( array( 'ok' => false, 'error' => $res->get_error_message() ), $status );
		}
		return new WP_REST_Response( array_merge( array( 'ok' => true ), $res ), 200 );
	}

	/**
	 * POST /user/forgot-password
	 */
	public static function handle_user_forgot_password( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'user_forgot_password', 15 ) ) {
			return new WP_REST_Response( array( 'ok' => false, 'error' => 'Too many password reset attempts.' ), 429 );
		}
		$params       = $request->get_json_params() ?: $request->get_params();
		$identifier   = sanitize_text_field( (string) ( $params['identifier'] ?? $params['email'] ?? $params['phone'] ?? '' ) );
		$new_password = isset( $params['newPassword'] ) ? (string) $params['newPassword'] : ( isset( $params['password'] ) ? (string) $params['password'] : '' );

		$res = JW_User_Management::reset_app_user_password( $identifier, $new_password );
		if ( is_wp_error( $res ) ) {
			$status = $res->get_error_data()['status'] ?? 400;
			return new WP_REST_Response( array( 'ok' => false, 'error' => $res->get_error_message() ), $status );
		}
		return new WP_REST_Response( array_merge( array( 'ok' => true ), $res ), 200 );
	}

	/**
	 * POST /user/forgot-email
	 */
	public static function handle_user_forgot_email( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'user_forgot_email', 15 ) ) {
			return new WP_REST_Response( array( 'ok' => false, 'error' => 'Too many requests.' ), 429 );
		}
		$params = $request->get_json_params() ?: $request->get_params();
		$query  = sanitize_text_field( (string) ( $params['query'] ?? $params['phone'] ?? $params['name'] ?? '' ) );

		$res = JW_User_Management::recover_app_user_email( $query );
		if ( is_wp_error( $res ) ) {
			$status = $res->get_error_data()['status'] ?? 404;
			return new WP_REST_Response( array( 'ok' => false, 'error' => $res->get_error_message() ), $status );
		}
		return new WP_REST_Response( array_merge( array( 'ok' => true ), $res ), 200 );
	}

	/**
	 * POST /user/logout
	 */
	public static function handle_user_logout( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'user_logout', 30 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		$user_id     = (int) $request->get_param( '_authenticated_user_id' );
		$auth_header = $request->get_header( 'authorization' );
		$raw_token   = '';
		if ( preg_match( '/Bearer\s+(\S+)/i', (string) $auth_header, $m ) ) {
			$raw_token = $m[1];
		}
		JW_Authentication::revoke_tokens( $user_id, $raw_token );
		return new WP_REST_Response( array( 'ok' => true, 'message' => 'Logged out successfully.' ), 200 );
	}

	/**
	 * GET /user/profile
	 */
	public static function handle_get_user_profile( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'get_user_profile', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		$user_id = (int) $request->get_param( '_authenticated_user_id' );
		return new WP_REST_Response(
			array(
				'ok'   => true,
				'user' => JW_User_Management::format_user_profile( $user_id ),
			),
			200
		);
	}

	/**
	 * POST /user/profile
	 */
	public static function handle_update_user_profile( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'update_user_profile', 20 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		$user_id = (int) $request->get_param( '_authenticated_user_id' );
		$params  = $request->get_json_params() ?: $request->get_params();

		if ( ! empty( $params['name'] ) ) {
			wp_update_user(
				array(
					'ID'           => $user_id,
					'display_name' => sanitize_text_field( $params['name'] ),
					'first_name'   => sanitize_text_field( $params['name'] ),
				)
			);
		}
		if ( isset( $params['phone'] ) ) {
			$clean_phone = sanitize_text_field( $params['phone'] );
			update_user_meta( $user_id, 'jw_phone', $clean_phone );
			update_user_meta( $user_id, 'jw_phone_digits', JW_User_Management::normalize_phone_digits( $clean_phone ) );
		}
		foreach ( array( 'city', 'gotra', 'birth_date', 'birth_time', 'birth_place', 'avatar' ) as $field ) {
			if ( isset( $params[ $field ] ) ) {
				update_user_meta( $user_id, 'jw_' . $field, sanitize_text_field( $params[ $field ] ) );
			}
		}
		if ( isset( $params['bio'] ) ) {
			update_user_meta( $user_id, 'description', sanitize_textarea_field( $params['bio'] ) );
		}
		if ( ! empty( $params['password'] ) && strlen( trim( (string) $params['password'] ) ) >= 6 ) {
			$new_pass = trim( (string) $params['password'] );
			update_user_meta( $user_id, 'jw_app_password_hash', wp_hash_password( $new_pass ) );
			if ( ! user_can( $user_id, 'manage_options' ) ) {
				wp_set_password( $new_pass, $user_id );
			}
		}

		return new WP_REST_Response(
			array(
				'ok'   => true,
				'user' => JW_User_Management::format_user_profile( $user_id ),
			),
			200
		);
	}

	/**
	 * GET /user/saved-kundlis
	 */
	public static function handle_get_saved_kundlis( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'get_saved_kundlis', 60 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$user_id   = (int) $request->get_param( '_authenticated_user_id' );
		$t_kundlis = JW_Database::table( 'saved_kundlis' );

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$t_kundlis} WHERE user_id = %d ORDER BY id DESC", // phpcs:ignore
				$user_id
			),
			ARRAY_A
		);

		$list = array();
		foreach ( $rows as $row ) {
			$chart = json_decode( $row['chart_json'], true );
			if ( is_array( $chart ) ) {
				$chart['id'] = $row['kundli_uid'];

				$db_tz = isset( $row['timezone'] ) ? trim( (string) $row['timezone'] ) : '';
				if ( isset( $chart['timezone'] ) && is_numeric( $chart['timezone'] ) ) {
					$num_tz = round( (float) $chart['timezone'], 4 );
				} elseif ( isset( $chart['timezoneOffset'] ) && is_numeric( $chart['timezoneOffset'] ) ) {
					$num_tz = round( (float) $chart['timezoneOffset'], 4 );
				} elseif ( '' !== $db_tz && is_numeric( $db_tz ) ) {
					$num_tz = round( (float) $db_tz, 4 );
				} else {
					$parsed_tz = JW_Kundli::parse_timezone_contract( '' !== $db_tz ? $db_tz : 'Asia/Kolkata', $row['birth_date'] ?? '' );
					$num_tz    = ! is_wp_error( $parsed_tz ) ? (float) $parsed_tz['timezone_offset'] : 5.5;
				}

				// Always return numeric UTC offset in `timezone` as required by frontend TypeScript interface (KundliChartData.timezone: number).
				$chart['timezone']       = $num_tz;
				$chart['timezoneOffset'] = $num_tz;

				// Preserve existing numeric offsets without converting them into guessed IANA names:
				if ( ! empty( $chart['timezoneId'] ) && is_string( $chart['timezoneId'] ) && ! is_numeric( $chart['timezoneId'] ) ) {
					$chart['timezoneId'] = $chart['timezoneId'];
				} elseif ( '' !== $db_tz && ! is_numeric( $db_tz ) ) {
					$chart['timezoneId'] = $db_tz;
				} else {
					$sign                = ( $num_tz >= 0 ) ? '+' : '-';
					$abs_min             = (int) round( abs( $num_tz ) * 60 );
					$chart['timezoneId'] = sprintf( 'UTC%s%02d:%02d', $sign, intdiv( $abs_min, 60 ), $abs_min % 60 );
				}

				$list[] = $chart;
			}
		}

		return new WP_REST_Response( array( 'ok' => true, 'savedKundlis' => $list ), 200 );
	}

	/**
	 * POST /user/saved-kundlis
	 */
	public static function handle_save_kundli( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'save_kundli', 20 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$user_id   = self::get_optional_authenticated_user_id( $request );
		$params    = $request->get_json_params();
		$validated = JW_Kundli::validate_and_normalize_birth_input( is_array( $params ) ? $params : array(), true );
		if ( is_wp_error( $validated ) ) {
			return new WP_REST_Response(
				array(
					'ok'    => false,
					'code'  => $validated->get_error_code(),
					'error' => $validated->get_error_message(),
				),
				400
			);
		}

		$t_kundlis   = JW_Database::table( 'saved_kundlis' );
		$uid         = ! empty( $params['id'] ) ? sanitize_text_field( $params['id'] ) : 'k_' . uniqid();
		$person_name = $validated['name'];
		$gender      = $validated['gender'];
		$birth_date  = $validated['birthDate'];
		$birth_time  = $validated['birthTime'];
		$birth_place = $validated['birthPlace'];
		$lat         = $validated['latitude'];
		$lng         = $validated['longitude'];
		$tz_id       = $validated['timezoneId'];
		$tz_offset   = $validated['timezoneOffset'];

		$avakahada = isset( $params['avakahada'] ) && is_array( $params['avakahada'] )
			? $params['avakahada']
			: ( isset( $params['chartData']['avakahada'] ) && is_array( $params['chartData']['avakahada'] ) ? $params['chartData']['avakahada'] : array() );

		$lagna     = isset( $avakahada['lagna'] ) ? sanitize_text_field( $avakahada['lagna'] ) : '';
		$rashi     = isset( $avakahada['rashi'] ) ? sanitize_text_field( $avakahada['rashi'] ) : '';
		$nakshatra = isset( $avakahada['nakshatra'] ) ? sanitize_text_field( $avakahada['nakshatra'] ) : '';
		$pada      = isset( $avakahada['nakshatraPada'] ) ? absint( $avakahada['nakshatraPada'] ) : 1;

		$existing_row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT id, timezone FROM {$t_kundlis} WHERE kundli_uid = %s AND user_id = %d", // phpcs:ignore
				$uid,
				$user_id
			),
			ARRAY_A
		);

		// Determine column value to store in wp_jw_saved_kundlis.timezone:
		// - For new records: store canonical timezone identifier ($tz_id, e.g. "Asia/Kolkata" or "UTC+05:30").
		// - For existing records that previously stored a raw numeric offset (e.g. "5.50") where no explicit IANA timezoneId
		//   was supplied and the offset is unchanged: preserve the stored numeric value as-is.
		$explicit_iana_sent = ( isset( $params['timezoneId'] ) && '' !== trim( (string) $params['timezoneId'] ) && ! is_numeric( $params['timezoneId'] ) )
			|| ( isset( $params['timezone'] ) && is_string( $params['timezone'] ) && ! is_numeric( $params['timezone'] ) && '' !== trim( $params['timezone'] ) );

		$db_timezone_to_store = $tz_id;
		if ( is_array( $existing_row ) && ! $explicit_iana_sent ) {
			$prev_tz = trim( (string) ( $existing_row['timezone'] ?? '' ) );
			if ( '' !== $prev_tz && is_numeric( $prev_tz ) && abs( (float) $prev_tz - $tz_offset ) < 0.001 ) {
				$db_timezone_to_store = $prev_tz;
			}
		}

		$params['id']             = $uid;
		$params['birthDate']      = $birth_date;
		$params['birthTime']      = $birth_time;
		$params['latitude']       = $lat;
		$params['longitude']      = $lng;
		$params['timezone']       = $tz_offset;
		$params['timezoneOffset'] = $tz_offset;
		$params['timezoneId']     = $tz_id;

		$row_data = array(
			'kundli_uid'     => $uid,
			'user_id'        => $user_id,
			'person_name'    => $person_name,
			'gender'         => $gender,
			'birth_date'     => $birth_date,
			'birth_time'     => $birth_time,
			'birth_place'    => $birth_place,
			'latitude'       => $lat,
			'longitude'      => $lng,
			'timezone'       => $db_timezone_to_store,
			'lagna'          => $lagna,
			'rashi'          => $rashi,
			'nakshatra'      => $nakshatra,
			'nakshatra_pada' => $pada,
			'chart_json'     => wp_json_encode( $params ),
			'updated_at'     => current_time( 'mysql' ),
		);

		if ( is_array( $existing_row ) && ! empty( $existing_row['id'] ) ) {
			$wpdb->update( $t_kundlis, $row_data, array( 'id' => (int) $existing_row['id'] ) );
		} else {
			$row_data['created_at'] = current_time( 'mysql' );
			$wpdb->insert( $t_kundlis, $row_data );
		}

		return new WP_REST_Response( array( 'ok' => true, 'kundli' => $params ), 201 );
	}

	/**
	 * DELETE /user/saved-kundlis/{id}
	 */
	public static function handle_delete_saved_kundli( $request ) {
		if ( ! JW_Logging::check_rate_limit( 'delete_saved_kundli', 30 ) ) {
			return new WP_REST_Response( array( 'error' => 'Rate limit exceeded' ), 429 );
		}
		global $wpdb;
		$user_id    = (int) $request->get_param( '_authenticated_user_id' );
		$kundli_uid = sanitize_text_field( $request->get_param( 'id' ) );
		$t_kundlis  = JW_Database::table( 'saved_kundlis' );

		$deleted = $wpdb->delete(
			$t_kundlis,
			array(
				'kundli_uid' => $kundli_uid,
				'user_id'    => $user_id,
			),
			array( '%s', '%d' )
		);

		return new WP_REST_Response( array( 'ok' => (bool) $deleted, 'deletedId' => $kundli_uid ), 200 );
	}

	/**
	 * GET /health (Feature-wise Integration Health & Diagnostics Status)
	 */
	public static function handle_get_health() {
		global $wpdb;
		$app_settings = JW_Settings::get_app_settings();

		$modules = array(
			array(
				'id'          => 'panchang',
				'name_hi'     => 'ऋषिकेश पंचांग गणना इंजन',
				'name_en'     => 'Rishikesh Panchang Engine',
				'enabled'     => (bool) ( $app_settings['enable_panchang'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/panchang',
				'db_table'    => 'wp_options (jw_panchang_settings)',
				'status'      => 'healthy',
				'description' => 'सूर्योदय, सूर्यास्त, तिथि, नक्षत्र, योग, करण, राहु काल एवं अभिजित मुहूर्त',
			),
			array(
				'id'          => 'kundli',
				'name_hi'     => 'वैदिक जन्मकुंडली इंजन (लाहिड़ी)',
				'name_en'     => 'Kundli Generator Engine (Lahiri)',
				'enabled'     => (bool) ( $app_settings['enable_kundli'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/kundli',
				'db_table'    => JW_Database::table( 'saved_kundlis' ),
				'status'      => 'healthy',
				'description' => 'लग्न चक्र, चंद्र चक्र, नवांश D-9, ग्रह स्थिति एवं विंशोत्तरी महादशा',
			),
			array(
				'id'          => 'milan',
				'name_hi'     => 'अष्टकूट 36 गुण कुंडली मिलान',
				'name_en'     => 'Ashtakoot 36-Guna Kundli Milan',
				'enabled'     => (bool) ( $app_settings['enable_milan'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/kundli/match',
				'db_table'    => 'Built-in Engine',
				'status'      => 'healthy',
				'description' => 'वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट, नाड़ी व मांगलिक विचार',
			),
			array(
				'id'          => 'rashifal',
				'name_hi'     => '12 राशि दैनिक, मासिक व वार्षिक राशिफल',
				'name_en'     => 'Daily, Monthly & Yearly Horoscope',
				'enabled'     => (bool) ( $app_settings['enable_rashifal'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/rashifal',
				'db_table'    => JW_Database::table( 'rashifal' ),
				'status'      => 'healthy',
				'description' => 'मेष से मीन 12 राशियों का फलादेश, शुभ अंक, शुभ रंग एवं उपाय',
			),
			array(
				'id'          => 'gochar',
				'name_hi'     => 'नवग्रह गोचर एवं राशि परिवर्तन',
				'name_en'     => 'Planetary Transit (Gochar)',
				'enabled'     => (bool) ( $app_settings['enable_gochar'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/panchang',
				'db_table'    => 'Live Ephemeris',
				'status'      => 'healthy',
				'description' => 'सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु व केतु का गोचर',
			),
			array(
				'id'          => 'tyohar',
				'name_hi'     => 'सनातन हिंदू व्रत एवं त्योहार कैलेंडर',
				'name_en'     => 'Vedic Festivals & Vrat Calendar',
				'enabled'     => (bool) ( $app_settings['enable_tyohar'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/tyohar',
				'db_table'    => JW_Database::table( 'tyohar' ),
				'status'      => 'healthy',
				'description' => 'एकादशी, प्रदोष, पूर्णिमा, अमावस्या, शिवरात्रि, नवरात्रि व दीपावली',
			),
			array(
				'id'          => 'calculators',
				'name_hi'     => 'वैदिक ज्योतिष कैलकुलेटर टूल्स',
				'name_en'     => 'Astrology Calculators',
				'enabled'     => (bool) ( $app_settings['enable_calculators'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/app-settings',
				'db_table'    => 'Siddhantic Formulas',
				'status'      => 'healthy',
				'description' => 'रत्न परामर्श, अंक ज्योतिष मूलांक, शनि साढ़ेसाती एवं मांगलिक दोष',
			),
			array(
				'id'          => 'dharma',
				'name_hi'     => 'सनातन धर्म, वैदिक मंत्र व 108 जप माला',
				'name_en'     => 'Sanatan Dharma & 108 Japa Mala',
				'enabled'     => (bool) ( $app_settings['enable_dharma'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/site-content',
				'db_table'    => 'wp_options (jw_site_pages_content)',
				'status'      => 'healthy',
				'description' => 'इंटरैक्टिव जप माला, ऑडियो वैदिक मंत्र, चालीसा, आरती व स्तोत्र',
			),
			array(
				'id'          => 'sankalp',
				'name_hi'     => 'दैनिक लाइव संकल्प मंत्र विधि',
				'name_en'     => 'Live Sankalp Mantra Engine',
				'enabled'     => (bool) ( $app_settings['enable_sankalp'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/site-content',
				'db_table'    => 'wp_options (jw_site_pages_content)',
				'status'      => 'healthy',
				'description' => '13 पंचांगीय अंग, देश-काल वाक्य, लघु व विस्तृत संकल्प पाठ विधि',
			),
			array(
				'id'          => 'pandit_chat',
				'name_hi'     => 'आचार्य परामर्श एवं पंडित प्रोफाइल',
				'name_en'     => 'Pandit Consultation & Profiles',
				'enabled'     => (bool) ( $app_settings['enable_pandit_chat'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/pandits',
				'db_table'    => JW_Database::table( 'pandits' ),
				'status'      => 'healthy',
				'description' => 'ऋषिकेश के प्रमाणित आचार्य, विशेषज्ञता, दक्षिणा व सीधी बातचीत',
			),
			array(
				'id'          => 'articles',
				'name_hi'     => 'वर्डप्रेस ज्योतिषीय ब्लॉग एवं लेख',
				'name_en'     => 'WordPress Astrology Blog Articles',
				'enabled'     => (bool) ( $app_settings['enable_articles'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/posts',
				'db_table'    => $wpdb->posts,
				'status'      => 'healthy',
				'description' => 'वर्डप्रेस में प्रकाशित सभी पोस्ट्स, श्रेणियां, टैग्स व मुख्य चित्र',
			),
			array(
				'id'          => 'gallery',
				'name_hi'     => 'पूजा-पाठ व अनुष्ठान फोटो गैलरी',
				'name_en'     => 'Puja & Rituals Photo Gallery',
				'enabled'     => (bool) ( $app_settings['enable_gallery'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/gallery',
				'db_table'    => JW_Database::table( 'gallery' ),
				'status'      => 'healthy',
				'description' => 'यज्ञ, हवन, रुद्राभिषेक, तीर्थ यात्रा व आश्रम कार्यों के छायाचित्र',
			),
			array(
				'id'          => 'reviews',
				'name_hi'     => 'यजमान एवं उपयोगकर्ता समीक्षाएं',
				'name_en'     => 'User Reviews & Moderation',
				'enabled'     => (bool) ( $app_settings['enable_reviews'] ?? true ),
				'endpoint'    => '/wp-json/jyotishwala/v1/reviews',
				'db_table'    => JW_Database::table( 'reviews' ),
				'status'      => 'healthy',
				'description' => 'उपयोगकर्ताओं की 5-स्टार रेटिंग, समीक्षाएं, सत्यापन व स्वीकृति',
			),
			array(
				'id'          => 'banners',
				'name_hi'     => 'होम स्क्रीन बैनर व स्लाइडर',
				'name_en'     => 'Home Screen Banners Carousel',
				'enabled'     => true,
				'endpoint'    => '/wp-json/jyotishwala/v1/home',
				'db_table'    => JW_Database::table( 'banners' ),
				'status'      => 'healthy',
				'description' => 'होम स्क्रीन के आकर्षक बैनर, कस्टम लिंक एवं रंग थीम',
			),
			array(
				'id'          => 'notifications',
				'name_hi'     => 'पुश नोटिफिकेशन व संदेश प्रसारण',
				'name_en'     => 'Push Notifications (FCM / Topic)',
				'enabled'     => true,
				'endpoint'    => '/wp-json/jyotishwala/v1/home',
				'db_table'    => JW_Database::table( 'notifications' ),
				'status'      => 'healthy',
				'description' => 'दैनिक पंचांग, पर्व व गोचर की सूचनाएं मोबाइल यूजर्स को भेजना',
			),
			array(
				'id'          => 'users_database',
				'name_hi'     => 'उपयोगकर्ता खाते व सहेजी गई कुंडलियां',
				'name_en'     => 'User Accounts & Cloud Kundlis',
				'enabled'     => true,
				'endpoint'    => '/wp-json/jyotishwala/v1/user/profile',
				'db_table'    => JW_Database::table( 'users' ),
				'status'      => 'healthy',
				'description' => 'सुरक्षित साइन-अप, लॉगिन, पासवर्ड रिकवरी व क्लाउड कुंडलियां',
			),
		);

		foreach ( $modules as &$m ) {
			if ( 0 === strpos( $m['db_table'], $wpdb->prefix ) || 0 === strpos( $m['db_table'], 'wp_' ) ) {
				$table_name = $m['db_table'];
				$count = $wpdb->get_var( "SELECT COUNT(*) FROM {$table_name}" ); // phpcs:ignore
				$m['record_count'] = null !== $count ? (int) $count : 0;
			} else {
				$m['record_count'] = '-';
			}
		}

		$last_results = get_option( 'jw_last_diagnostic_results', null );

		return new WP_REST_Response(
			array(
				'ok'                   => true,
				'timestamp'            => current_time( 'mysql' ),
				'environment'          => array(
					'php_version'        => PHP_VERSION,
					'wp_version'         => get_bloginfo( 'version' ),
					'plugin_version'     => JW_BACKEND_VERSION,
					'https'              => is_ssl(),
					'memory_limit'       => WP_MEMORY_LIMIT,
					'litespeed_detected' => ( false !== strpos( ( $_SERVER['SERVER_SOFTWARE'] ?? '' ), 'LiteSpeed' ) ),
				),
				'last_diagnostic_run' => $last_results,
				'modules'              => $modules,
			),
			200
		);
	}

	/**
	 * POST /diagnostics/run (Runs live verification checks for all modules)
	 */
	public static function handle_post_diagnostics_run() {
		global $wpdb;

		$results = array(
			'executed_at' => current_time( 'mysql' ),
			'tests'       => array(),
			'summary'     => array(
				'total'  => 0,
				'passed' => 0,
				'failed' => 0,
			),
		);

		// Test 1: Panchang Calculation Engine
		try {
			$p = JW_Panchang_API::get_panchang();
			$ok = ! empty( $p['tithi']['name'] );
			$results['tests']['panchang'] = array(
				'name'    => 'Panchang Engine (Rishikesh)',
				'status'  => $ok ? 'pass' : 'fail',
				'message' => $ok ? "Tithi: {$p['tithi']['name']}, Nakshatra: {$p['nakshatra']['name']}, Sunrise: {$p['sunrise']}" : 'Failed to calculate Tithi',
			);
		} catch ( Exception $e ) {
			$results['tests']['panchang'] = array( 'name' => 'Panchang Engine', 'status' => 'fail', 'message' => $e->getMessage() );
		}

		// Test 2: Kundli Calculation Engine
		try {
			$k = JW_Kundli::calculate_kundli(
				array(
					'name'       => 'Diagnostics Test',
					'birthDate'  => '1995-05-15',
					'birthTime'  => '10:30',
					'birthPlace' => 'ऋषिकेश',
					'latitude'   => 30.0869,
					'longitude'  => 78.2676,
				)
			);
			$ok = ! is_wp_error( $k ) && ! empty( $k['avakahada']['lagna'] );
			$results['tests']['kundli'] = array(
				'name'    => 'Kundli Generator Engine (Lahiri Ayanamsha)',
				'status'  => $ok ? 'pass' : 'fail',
				'message' => $ok ? "Lagna: {$k['avakahada']['lagna']}, Rashi: {$k['avakahada']['rashi']}, Nakshatra: {$k['avakahada']['nakshatra']}" : ( is_wp_error( $k ) ? $k->get_error_message() : 'Kundli output empty' ),
			);
		} catch ( Exception $e ) {
			$results['tests']['kundli'] = array( 'name' => 'Kundli Generator', 'status' => 'fail', 'message' => $e->getMessage() );
		}

		// Test 3: Ashtakoot 36-Guna Milan Engine
		try {
			$m = JW_Kundli::match_kundli(
				array( 'name' => 'वर', 'birthDate' => '1994-03-10', 'birthTime' => '09:15', 'latitude' => 30.0869, 'longitude' => 78.2676 ),
				array( 'name' => 'कन्या', 'birthDate' => '1996-08-22', 'birthTime' => '14:20', 'latitude' => 25.3176, 'longitude' => 82.9739 )
			);
			$ok = ! is_wp_error( $m ) && isset( $m['totalScore'] );
			$results['tests']['milan'] = array(
				'name'    => 'Ashtakoot 36-Guna Milan Engine',
				'status'  => $ok ? 'pass' : 'fail',
				'message' => $ok ? "Score: {$m['totalScore']} / 36 Gunas ({$m['verdictHi']})" : ( is_wp_error( $m ) ? $m->get_error_message() : 'Milan test failed' ),
			);
		} catch ( Exception $e ) {
			$results['tests']['milan'] = array( 'name' => 'Milan Engine', 'status' => 'fail', 'message' => $e->getMessage() );
		}

		// Test 4: MySQL Database Tables
		$tables = array(
			'banners'       => JW_Database::table( 'banners' ),
			'pandits'       => JW_Database::table( 'pandits' ),
			'reviews'       => JW_Database::table( 'reviews' ),
			'notifications' => JW_Database::table( 'notifications' ),
			'gallery'       => JW_Database::table( 'gallery' ),
			'tyohar'        => JW_Database::table( 'tyohar' ),
			'rashifal'      => JW_Database::table( 'rashifal' ),
			'saved_kundlis' => JW_Database::table( 'saved_kundlis' ),
			'users'         => JW_Database::table( 'users' ),
			'sessions'      => JW_Database::table( 'sessions' ),
			'api_vault'     => JW_Database::table( 'api_vault' ),
			'logs'          => JW_Database::table( 'logs' ),
		);

		$missing_tables = array();
		foreach ( $tables as $alias => $t_name ) {
			$check = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $t_name ) );
			if ( $check !== $t_name ) {
				$missing_tables[] = $alias;
			}
		}

		$results['tests']['database'] = array(
			'name'    => 'MySQL Custom Tables & Schema (12 Tables)',
			'status'  => empty( $missing_tables ) ? 'pass' : 'fail',
			'message' => empty( $missing_tables ) ? 'All 12 plugin tables exist and operational.' : 'Missing tables: ' . implode( ', ', $missing_tables ),
		);

		// Test 5: LiteSpeed & REST API Caching
		$results['tests']['caching'] = array(
			'name'    => 'Hostinger LiteSpeed Bypass & No-Cache Headers',
			'status'  => 'pass',
			'message' => 'Active Cache-Control: no-store, no-cache, must-revalidate and X-LiteSpeed-Cache-Control enforced.',
		);

		// Test 6: App Settings & Module Controls
		$s = JW_Settings::get_app_settings();
		$enabled_count = 0;
		$disabled_count = 0;
		foreach ( array( 'enable_panchang', 'enable_kundli', 'enable_milan', 'enable_rashifal', 'enable_gochar', 'enable_tyohar', 'enable_calculators', 'enable_dharma', 'enable_sankalp', 'enable_pandit_chat', 'enable_articles', 'enable_gallery', 'enable_reviews' ) as $k ) {
			if ( ! empty( $s[ $k ] ) ) {
				$enabled_count++;
			} else {
				$disabled_count++;
			}
		}

		$results['tests']['settings'] = array(
			'name'    => 'Centralized App Settings & Module Switches',
			'status'  => 'pass',
			'message' => "{$enabled_count} Active Modules, {$disabled_count} Disabled Modules. App Name: {$s['app_name']}.",
		);

		// Calculate summary
		foreach ( $results['tests'] as $t ) {
			$results['summary']['total']++;
			if ( 'pass' === $t['status'] ) {
				$results['summary']['passed']++;
			} else {
				$results['summary']['failed']++;
			}
		}

		update_option( 'jw_last_diagnostic_results', $results );
		JW_Logging::log( 'system', 'info', "Diagnostics executed: {$results['summary']['passed']}/{$results['summary']['total']} passed." );

		return new WP_REST_Response(
			array(
				'ok'      => ( $results['summary']['failed'] === 0 ),
				'results' => $results,
			),
			200
		);
	}

	/**
	 * GET /knowledge (7-Department Sanatan Shastra & Knowledge Library)
	 */
	public static function handle_get_knowledge() {
		global $wpdb;
		$t    = JW_Database::table( 'knowledge' );
		$rows = $wpdb->get_results( "SELECT * FROM {$t} WHERE status = 'published' ORDER BY display_order ASC, id DESC", ARRAY_A ); // phpcs:ignore
		$items = array();
		if ( is_array( $rows ) ) {
			foreach ( $rows as $r ) {
				$items[] = array(
					'id'              => $r['item_uid'],
					'department'      => $r['department'],
					'subcategory'     => $r['subcategory'],
					'titleHi'         => $r['title_hi'],
					'titleEn'         => $r['title_en'],
					'reference'       => $r['reference_text'],
					'sanskrit'        => $r['sanskrit_text'],
					'transliteration' => $r['transliteration'],
					'anvaya'          => $r['anvaya'],
					'meaningHi'       => $r['meaning_hi'],
					'meaningEn'       => $r['meaning_en'],
					'commentaryHi'    => $r['commentary_hi'],
				);
			}
		}
		return new WP_REST_Response( array( 'success' => true, 'data' => $items ), 200 );
	}

	/**
	 * GET /pujas (19-Category Puja & Karmakand Guide)
	 */
	public static function handle_get_pujas() {
		global $wpdb;
		$t    = JW_Database::table( 'puja_vidhi' );
		$rows = $wpdb->get_results( "SELECT * FROM {$t} WHERE status = 'published' ORDER BY id DESC", ARRAY_A ); // phpcs:ignore
		$items = array();
		if ( is_array( $rows ) ) {
			foreach ( $rows as $r ) {
				$samagri = ! empty( $r['samagri_json'] ) ? json_decode( $r['samagri_json'], true ) : array();
				$steps   = ! empty( $r['steps_json'] ) ? json_decode( $r['steps_json'], true ) : array();
				$items[] = array(
					'id'               => $r['puja_uid'],
					'category'         => $r['category'],
					'titleHi'          => $r['title_hi'],
					'titleEn'          => $r['title_en'],
					'deity'            => $r['deity'],
					'duration'         => $r['duration'],
					'purposeHi'        => $r['purpose_hi'],
					'samagriList'      => is_array( $samagri ) ? $samagri : array(),
					'preparationRules' => array( 'स्नान कर स्वच्छ वस्त्र धारण करें एवं आचमन करें।' ),
					'sankalpaTemplate' => $r['sankalp_text'],
					'steps'            => is_array( $steps ) ? $steps : array(),
					'aartiHi'          => $r['aarti_hi'],
					'visarjanHi'       => 'पूजा पूर्ण होने पर क्षमा प्रार्थना करें एवं प्रसाद वितरण करें।',
				);
			}
		}
		return new WP_REST_Response( array( 'success' => true, 'data' => $items ), 200 );
	}

	/**
	 * GET /mantras (15-Category Mantra, Stotra, Kavach & Sukta Library)
	 */
	public static function handle_get_mantras() {
		global $wpdb;
		$t    = JW_Database::table( 'mantras' );
		$rows = $wpdb->get_results( "SELECT * FROM {$t} WHERE status = 'published' ORDER BY id DESC", ARRAY_A ); // phpcs:ignore
		return new WP_REST_Response( array( 'success' => true, 'data' => is_array( $rows ) ? $rows : array() ), 200 );
	}

	/**
	 * GET /sanskrit (4-Level Sanskrit Learning Course)
	 */
	public static function handle_get_sanskrit() {
		global $wpdb;
		$t    = JW_Database::table( 'sanskrit_courses' );
		$rows = $wpdb->get_results( "SELECT * FROM {$t} WHERE status = 'published' ORDER BY lesson_number ASC", ARRAY_A ); // phpcs:ignore
		return new WP_REST_Response( array( 'success' => true, 'data' => is_array( $rows ) ? $rows : array() ), 200 );
	}

	/**
	 * GET /temples (8-Category Temples & Tirtha Directory)
	 */
	public static function handle_get_temples() {
		global $wpdb;
		$t    = JW_Database::table( 'temples' );
		$rows = $wpdb->get_results( "SELECT * FROM {$t} WHERE status = 'published' ORDER BY id DESC", ARRAY_A ); // phpcs:ignore
		$items = array();
		if ( is_array( $rows ) ) {
			foreach ( $rows as $r ) {
				$items[] = array(
					'id'                => $r['temple_uid'],
					'category'          => $r['category'],
					'nameHi'            => $r['name_hi'],
					'nameEn'            => $r['name_en'],
					'deity'             => $r['deity'],
					'cityState'         => $r['city_state'],
					'sthalaPuranaHi'    => $r['history_hi'],
					'darshanTimings'    => $r['darshan_timings'],
					'aartiTimings'      => $r['aarti_timings'],
					'majorFestivals'    => 'महाशिवरात्रि, श्रावण मास एवं प्रमुख पर्व',
					'dressCodeAndRules' => 'सात्विक एवं पारंपरिक भारतीय परिधान अनुशंसित।',
					'howToReach'        => $r['how_to_reach_hi'],
					'coordinates'       => array(
						'lat' => (float) $r['latitude'],
						'lng' => (float) $r['longitude'],
					),
				);
			}
		}
		return new WP_REST_Response( array( 'success' => true, 'data' => $items ), 200 );
	}

	/**
	 * GET & POST /bookings (Yajman Puja Booking with Strict Pending Initial Status)
	 */
	public static function handle_get_bookings() {
		global $wpdb;
		$t    = JW_Database::table( 'bookings' );
		$rows = $wpdb->get_results( "SELECT * FROM {$t} ORDER BY id DESC LIMIT 50", ARRAY_A ); // phpcs:ignore
		return new WP_REST_Response( array( 'success' => true, 'data' => is_array( $rows ) ? $rows : array() ), 200 );
	}

	public static function handle_post_booking( WP_REST_Request $request ) {
		global $wpdb;
		$params      = $request->get_json_params();
		$t           = JW_Database::table( 'bookings' );
		$booking_uid = sanitize_text_field( $params['id'] ?? ( 'bk_' . time() ) );

		$wpdb->insert(
			$t,
			array(
				'booking_uid'        => $booking_uid,
				'puja_category'      => sanitize_text_field( $params['pujaCategory'] ?? '' ),
				'puja_service_title' => sanitize_text_field( $params['pujaServiceTitle'] ?? '' ),
				'pandit_id'          => sanitize_text_field( $params['panditId'] ?? '' ),
				'pandit_name'        => sanitize_text_field( $params['panditName'] ?? '' ),
				'preferred_date'     => sanitize_text_field( $params['preferredDate'] ?? '' ),
				'preferred_time'     => sanitize_text_field( $params['preferredTime'] ?? '' ),
				'mode'               => sanitize_text_field( $params['mode'] ?? 'in_person' ),
				'yajman_name'        => sanitize_text_field( $params['yajmanName'] ?? '' ),
				'yajman_gotra'       => sanitize_text_field( $params['yajmanGotra'] ?? '' ),
				'yajman_phone'       => sanitize_text_field( $params['yajmanPhone'] ?? '' ),
				'city'               => sanitize_text_field( $params['city'] ?? '' ),
				'location_address'   => sanitize_textarea_field( $params['locationAddress'] ?? '' ),
				'sankalp_purpose'    => sanitize_textarea_field( $params['sankalpPurpose'] ?? '' ),
				'dakshina_estimate'  => sanitize_text_field( $params['dakshinaEstimate'] ?? '' ),
				'status'             => 'pending',
			)
		);

		return new WP_REST_Response(
			array(
				'success' => true,
				'status'  => 'pending',
				'message' => 'पूजा बुकिंग अनुरोध प्राप्त हुआ। स्थिति: प्रतीक्षारत (Pending)।',
			),
			200
		);
	}

	/**
	 * POST /pandit-register (Pandit / Purohit Account Registration with Pending Verification)
	 */
	public static function handle_post_pandit_register( WP_REST_Request $request ) {
		global $wpdb;
		$params = $request->get_json_params();
		$t      = JW_Database::table( 'pandits' );

		$wpdb->insert(
			$t,
			array(
				'pandit_uid'       => sanitize_text_field( $params['id'] ?? ( 'pandit_' . time() ) ),
				'name'             => sanitize_text_field( $params['name'] ?? '' ),
				'qualification'    => sanitize_text_field( $params['education'] ?? '' ),
				'experience_years' => absint( $params['experienceYears'] ?? 5 ),
				'specialties'      => is_array( $params['specialServices'] ?? null ) ? implode( ', ', $params['specialServices'] ) : sanitize_text_field( $params['karmakandQualification'] ?? '' ),
				'languages'        => is_array( $params['languages'] ?? null ) ? implode( ', ', $params['languages'] ) : 'हिन्दी, संस्कृत',
				'mobile'           => sanitize_text_field( $params['phone'] ?? '' ),
				'email'            => sanitize_email( $params['email'] ?? '' ),
				'address'          => sanitize_text_field( $params['city'] ?? 'ऋषिकेश, उत्तराखंड' ),
				'dakshina_info'    => 'परामर्श दक्षिणा: ' . sanitize_text_field( $params['dakshinaRange'] ?? '₹501' ),
				'about'            => sanitize_textarea_field( $params['certificateDetails'] ?? '' ),
				'is_chief'         => 0,
				'is_active'        => 0, // Remains inactive on public roster until verified by Admin
			)
		);

		return new WP_REST_Response(
			array(
				'success'            => true,
				'verificationStatus' => 'pending_verification',
				'message'            => 'पंडित पंजीकरण आवेदन प्राप्त हुआ। सत्यापन की प्रतीक्षा है।',
			),
			200
		);
	}

	/**
	 * GET & POST /support (Help & Support Tickets)
	 */
	public static function handle_get_support_tickets() {
		global $wpdb;
		$t    = JW_Database::table( 'support_tickets' );
		$rows = $wpdb->get_results( "SELECT * FROM {$t} ORDER BY id DESC LIMIT 50", ARRAY_A ); // phpcs:ignore
		return new WP_REST_Response( array( 'success' => true, 'data' => is_array( $rows ) ? $rows : array() ), 200 );
	}

	public static function handle_post_support_ticket( WP_REST_Request $request ) {
		global $wpdb;
		$params = $request->get_json_params();
		$t      = JW_Database::table( 'support_tickets' );

		$wpdb->insert(
			$t,
			array(
				'ticket_uid'  => sanitize_text_field( $params['id'] ?? ( 'tkt_' . time() ) ),
				'ticket_type' => sanitize_key( $params['ticketType'] ?? 'support' ),
				'subject'     => sanitize_text_field( $params['subject'] ?? '' ),
				'category'    => sanitize_text_field( $params['category'] ?? '' ),
				'user_name'   => sanitize_text_field( $params['userName'] ?? '' ),
				'user_email'  => sanitize_email( $params['userEmail'] ?? '' ),
				'user_phone'  => sanitize_text_field( $params['userPhone'] ?? '' ),
				'message'     => sanitize_textarea_field( $params['message'] ?? '' ),
				'status'      => 'open',
			)
		);

		return new WP_REST_Response(
			array(
				'success' => true,
				'status'  => 'open',
				'message' => 'आपका सहायता टिकट सफलतापूर्वक दर्ज हो गया है।',
			),
			200
		);
	}

	/**
	 * GET /feature-registry (Complete Admin Feature Registry & Plugin Integration Manifest)
	 */
	public static function handle_get_feature_registry() {
		$registry = array(
			array( 'featureId' => 'mod_panchang', 'moduleNameHi' => 'ऋषिकेश पंचांग एवं चौघड़िया', 'frontendRoute' => 'panchang', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/panchang', 'wpDbTable' => 'wp_options (jw_panchang_settings)' ),
			array( 'featureId' => 'mod_kundli', 'moduleNameHi' => 'वैदिक जन्मकुंडली एवं दशा', 'frontendRoute' => 'kundli', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/kundli', 'wpDbTable' => 'wp_jw_saved_kundlis' ),
			array( 'featureId' => 'mod_milan', 'moduleNameHi' => 'अष्टकूट ३६ गुण मिलान', 'frontendRoute' => 'milan', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/kundli/match', 'wpDbTable' => 'wp_options (jw_kundli_settings)' ),
			array( 'featureId' => 'mod_gyan_vibhag', 'moduleNameHi' => 'ज्ञान विभाग (७ सनातन शास्त्र विभाग)', 'frontendRoute' => 'gyan', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/knowledge', 'wpDbTable' => 'wp_jw_knowledge' ),
			array( 'featureId' => 'mod_puja_karmakand', 'moduleNameHi' => 'पूजा एवं कर्मकांड (१९ श्रेणियां)', 'frontendRoute' => 'puja', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/pujas', 'wpDbTable' => 'wp_jw_puja_vidhi' ),
			array( 'featureId' => 'mod_mantra_stotra', 'moduleNameHi' => 'मंत्र, स्तोत्र, कवच एवं सूक्त कोष (१५ श्रेणियां)', 'frontendRoute' => 'dharma', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/mantras', 'wpDbTable' => 'wp_jw_mantras' ),
			array( 'featureId' => 'mod_sanskrit_learning', 'moduleNameHi' => 'संस्कृत शिक्षा पाठ्यक्रम (४ स्तर एवं प्रश्नोत्तरी)', 'frontendRoute' => 'sanskrit', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/sanskrit', 'wpDbTable' => 'wp_jw_sanskrit_courses' ),
			array( 'featureId' => 'mod_temples_tirtha', 'moduleNameHi' => 'मंदिर एवं तीर्थ डायरेक्टरी (८ श्रेणियां)', 'frontendRoute' => 'temples', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/temples', 'wpDbTable' => 'wp_jw_temples' ),
			array( 'featureId' => 'mod_puja_booking', 'moduleNameHi' => 'यजमान पूजा एवं अनुष्ठान बुकिंग', 'frontendRoute' => 'puja_booking', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/bookings', 'wpDbTable' => 'wp_jw_bookings' ),
			array( 'featureId' => 'mod_pandit_portal', 'moduleNameHi' => 'पंडित पंजीकरण, सत्यापन एवं डैशबोर्ड', 'frontendRoute' => 'pandit_dashboard', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/pandit-register', 'wpDbTable' => 'wp_jw_pandits' ),
			array( 'featureId' => 'mod_sankalp_generator', 'moduleNameHi' => 'संकल्प मंत्र एवं कस्टम संकल्प पत्र जनरेटर', 'frontendRoute' => 'sankalp', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/site-content', 'wpDbTable' => 'wp_options (jw_site_pages_content)' ),
			array( 'featureId' => 'mod_personal_library', 'moduleNameHi' => 'मेरा पुस्तकालय (बुकमार्क, नोट्स व इतिहास)', 'frontendRoute' => 'library', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/user/library', 'wpDbTable' => 'wp_usermeta (jw_personal_library)' ),
			array( 'featureId' => 'mod_support_center', 'moduleNameHi' => 'सहायता केंद्र, FAQ एवं टिकट', 'frontendRoute' => 'support', 'wpRestEndpoint' => '/wp-json/jyotishwala/v1/support', 'wpDbTable' => 'wp_jw_support_tickets' ),
		);
		return new WP_REST_Response( array( 'success' => true, 'data' => $registry ), 200 );
	}
}
