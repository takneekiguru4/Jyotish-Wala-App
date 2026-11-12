<?php
/**
 * Plugin Name:       JyotishWala Backend
 * Plugin URI:        https://jyotishwala.com
 * Description:       Complete WordPress Backend, REST API (/wp-json/jyotishwala/v1/), MySQL Database Management, and Admin Dashboard ("JyotishWala App Management") for the JyotishWala Android Application.
 * Version:           1.3.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            JyotishWala Sansthan (Rishikesh)
 * Author URI:        https://jyotishwala.com
 * Text Domain:       jyotishwala-backend
 * License:           GPL v2 or later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'JW_BACKEND_VERSION', '1.3.0' );
define( 'JW_BACKEND_DB_VERSION', '1.3.0' );
define( 'JW_BACKEND_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'JW_BACKEND_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'JW_BACKEND_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// Load core includes
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-database.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-logging.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-permissions.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-settings.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-authentication.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-user-management.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-panchang-api.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-kundli.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-gemini-api.php';
require_once JW_BACKEND_PLUGIN_DIR . 'includes/class-rest-api.php';

// Load Admin classes when inside WordPress Dashboard
if ( is_admin() ) {
	require_once JW_BACKEND_PLUGIN_DIR . 'admin/class-dashboard.php';
	require_once JW_BACKEND_PLUGIN_DIR . 'admin/class-admin-menu.php';
}

/**
 * Plugin Activation Hook:
 * - Creates custom MySQL tables with proper prefix ($wpdb->prefix . 'jw_*')
 * - Seeds default App Settings, Rishikesh Panchang defaults, and capabilities
 */
function jw_backend_activate_plugin() {
	JW_Database::install_or_upgrade();
	JW_Permissions::register_capabilities();
	JW_Settings::ensure_defaults();
	JW_Logging::log( 'system', 'info', 'JyotishWala Backend plugin activated and database tables verified.' );
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'jw_backend_activate_plugin' );

/**
 * Plugin Deactivation Hook
 */
function jw_backend_deactivate_plugin() {
	JW_Logging::log( 'system', 'info', 'JyotishWala Backend plugin deactivated.' );
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'jw_backend_deactivate_plugin' );

/**
 * Initialize Plugin Components on plugins_loaded
 */
function jw_backend_init() {
	// Ensure DB schema, capabilities & default settings are up to date after plugin updates
	if ( get_option( 'jw_backend_db_version' ) !== JW_BACKEND_DB_VERSION ) {
		JW_Database::install_or_upgrade();
		JW_Permissions::register_capabilities();
		JW_Settings::ensure_defaults();
	}

	// Initialize REST API endpoints (/wp-json/jyotishwala/v1/*)
	JW_REST_API::init();

	// Initialize WordPress Admin Menu ("JyotishWala App Management")
	if ( is_admin() ) {
		JW_Admin_Menu::init();
	}
}
add_action( 'plugins_loaded', 'jw_backend_init' );
