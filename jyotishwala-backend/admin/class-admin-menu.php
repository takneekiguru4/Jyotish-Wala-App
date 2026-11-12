<?php
/**
 * Registers the "JyotishWala App Management" Main Menu and all 12 Admin Sections
 * inside the WordPress Administrator Dashboard.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Admin_Menu {

	/**
	 * Hooks menu registration and asset enqueuing.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'register_menus' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
	}

	/**
	 * Enqueues Teal (#008080) & Saffron (#FF7F33) Admin CSS/JS only on JyotishWala pages.
	 *
	 * @param string $hook Current WP Admin page hook.
	 */
	public static function enqueue_assets( $hook ) {
		if ( false === strpos( $hook, 'jw-app-' ) && false === strpos( $hook, 'jyotishwala-app' ) ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_style(
			'jw-backend-admin-css',
			JW_BACKEND_PLUGIN_URL . 'assets/css/admin.css',
			array(),
			JW_BACKEND_VERSION
		);
		wp_enqueue_script(
			'jw-backend-admin-js',
			JW_BACKEND_PLUGIN_URL . 'assets/js/admin.js',
			array( 'jquery' ),
			JW_BACKEND_VERSION,
			true
		);
	}

	/**
	 * Registers the main menu "JyotishWala App Management" and its submenus.
	 */
	public static function register_menus() {
		$admin_cap   = 'manage_options';
		$content_cap = JW_Permissions::CAP_MANAGE_CONTENT;
		$top_cap     = JW_Permissions::current_user_can_manage_app() ? $admin_cap : $content_cap;

		add_menu_page(
			'JyotishWala App Management',
			'JyotishWala App Management',
			$top_cap,
			'jyotishwala-app',
			JW_Permissions::current_user_can_manage_app() ? array( __CLASS__, 'render_dashboard_page' ) : array( __CLASS__, 'render_content_page' ),
			'dashicons-star-filled',
			26
		);

		$submenus = array(
			array( 'jyotishwala-app', '1. App Dashboard', '1. App Dashboard', $admin_cap, 'jyotishwala-app', array( __CLASS__, 'render_dashboard_page' ) ),
			array( 'jyotishwala-app', '2. App Content & Rashifal', '2. Content & Rashifal', $content_cap, 'jw-app-content', array( __CLASS__, 'render_content_page' ) ),
			array( 'jyotishwala-app', '3. Panchang Management', '3. Panchang Config', $admin_cap, 'jw-app-panchang', array( __CLASS__, 'render_panchang_page' ) ),
			array( 'jyotishwala-app', '4. Kundli & Jyotish Engine', '4. Kundli & Jyotish', $admin_cap, 'jw-app-kundli', array( __CLASS__, 'render_kundli_page' ) ),
			array( 'jyotishwala-app', '5. App Users (पंजीकृत यूज़र)', '5. App Users', $admin_cap, 'jw-app-users', array( __CLASS__, 'render_users_page' ) ),
			array( 'jyotishwala-app', '6. Home Screen & Banners', '6. Home & Banners', $admin_cap, 'jw-app-banners', array( __CLASS__, 'render_banners_page' ) ),
			array( 'jyotishwala-app', '7. Notification Management', '7. Notifications', $admin_cap, 'jw-app-notifications', array( __CLASS__, 'render_notifications_page' ) ),
			array( 'jyotishwala-app', '8. API Vault & Security', '8. API & Security', $admin_cap, 'jw-app-api-settings', array( __CLASS__, 'render_api_settings_page' ) ),
			array( 'jyotishwala-app', '9. App Settings', '9. App Settings', $admin_cap, 'jw-app-settings', array( __CLASS__, 'render_app_settings_page' ) ),
			array( 'jyotishwala-app', '10. Backup, Data & Logs', '10. Backup & Logs', $admin_cap, 'jw-app-logs', array( __CLASS__, 'render_logs_page' ) ),
			array( 'jyotishwala-app', '11. Sanatan Modules & Bookings', '11. Modules & Bookings', $admin_cap, 'jw-app-modules-hub', array( __CLASS__, 'render_modules_hub_page' ) ),
		);

		foreach ( $submenus as $s ) {
			add_submenu_page( $s[0], $s[1], $s[2], $s[3], $s[4], $s[5] );
		}
	}

	/**
	 * Renders top navigation header bar inside all JyotishWala Admin screens.
	 *
	 * @param string $active_slug Current page slug.
	 * @param string $title       Page title.
	 * @param string $subtitle    Page subtitle.
	 */
	public static function render_header( $active_slug, $title, $subtitle = '' ) {
		$tabs = array(
			'jyotishwala-app'     => 'Dashboard',
			'jw-app-content'      => 'Content, Rashifal, Tyohar & Gallery',
			'jw-app-panchang'     => 'Panchang (Rishikesh)',
			'jw-app-kundli'       => 'Kundli & Jyotish',
			'jw-app-users'        => 'Users (पंजीकृत यूज़र)',
			'jw-app-banners'      => 'Home Screen & Banners',
			'jw-app-notifications'=> 'Notifications',
			'jw-app-api-settings' => 'API Vault & Security',
			'jw-app-settings'     => 'App Settings',
			'jw-app-logs'         => 'Backup & Logs',
			'jw-app-modules-hub'  => 'Sanatan Modules & Bookings',
		);
		?>
		<div class="jw-admin-header">
			<div class="jw-admin-header-top">
				<div>
					<h1><?php echo esc_html( $title ); ?></h1>
					<?php if ( $subtitle ) : ?>
						<p><?php echo esc_html( $subtitle ); ?></p>
					<?php endif; ?>
				</div>
				<div class="jw-admin-badge">
					<span>JyotishWala Backend v<?php echo esc_html( JW_BACKEND_VERSION ); ?></span>
					<span class="jw-dot">•</span>
					<span>REST API: <code>/wp-json/jyotishwala/v1/</code></span>
				</div>
			</div>
			<nav class="jw-admin-tabs">
				<?php foreach ( $tabs as $slug => $label ) : ?>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . $slug ) ); ?>"
					   class="jw-tab <?php echo ( $active_slug === $slug ) ? 'active' : ''; ?>">
						<?php echo esc_html( $label ); ?>
					</a>
				<?php endforeach; ?>
			</nav>
		</div>
		<?php
	}

	public static function render_dashboard_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/dashboard.php';
	}

	public static function render_content_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/content.php';
	}

	public static function render_panchang_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/panchang.php';
	}

	public static function render_kundli_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/kundli.php';
	}

	public static function render_users_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/users.php';
	}

	public static function render_banners_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/banners.php';
	}

	public static function render_notifications_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/notifications.php';
	}

	public static function render_api_settings_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/api-settings.php';
	}

	public static function render_app_settings_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/app-settings.php';
	}

	public static function render_logs_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/logs.php';
	}

	public static function render_modules_hub_page() {
		require_once JW_BACKEND_PLUGIN_DIR . 'admin/pages/modules-hub.php';
	}
}
