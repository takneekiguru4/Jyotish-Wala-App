<?php
/**
 * Dashboard Statistics & Aggregated Metrics for JyotishWala App Management.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Dashboard {

	/**
	 * Returns real-time statistics for the WordPress Admin Dashboard.
	 *
	 * @return array
	 */
	public static function get_stats() {
		global $wpdb;

		$t_kundlis  = JW_Database::table( 'saved_kundlis' );
		$t_tokens   = JW_Database::table( 'user_tokens' );
		$t_apis     = JW_Database::table( 'api_vault' );
		$t_reviews  = JW_Database::table( 'reviews' );
		$t_pandits  = JW_Database::table( 'pandits' );
		$t_receipts = JW_Database::table( 'receipts' );
		$t_banners  = JW_Database::table( 'banners' );

		$user_counts   = count_users();
		$total_users   = isset( $user_counts['total_users'] ) ? (int) $user_counts['total_users'] : 0;
		$active_tokens = (int) $wpdb->get_var( "SELECT COUNT(DISTINCT user_id) FROM {$t_tokens} WHERE is_revoked = 0 AND expires_at > NOW()" ); // phpcs:ignore

		// Users registered in last 30 days
		$new_regs = (int) $wpdb->get_var(
			"SELECT COUNT(*) FROM {$wpdb->users} WHERE user_registered >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
		);

		$total_kundlis    = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_kundlis}" ); // phpcs:ignore
		$api_total_calls  = (int) $wpdb->get_var( "SELECT COALESCE(SUM(usage_count), 0) FROM {$t_apis}" ); // phpcs:ignore
		$pending_reviews  = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_reviews} WHERE status = 'pending'" ); // phpcs:ignore
		$pending_receipts = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_receipts} WHERE status = 'pending'" ); // phpcs:ignore
		$total_receipts   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_receipts}" ); // phpcs:ignore
		$active_pandits   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_pandits} WHERE is_active = 1" ); // phpcs:ignore
		$active_banners   = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$t_banners} WHERE is_enabled = 1" ); // phpcs:ignore

		$post_counts     = wp_count_posts( 'post' );
		$published_posts = isset( $post_counts->publish ) ? (int) $post_counts->publish : 0;

		return array(
			'total_users'       => $total_users,
			'active_users'      => max( 1, $active_tokens ),
			'new_registrations' => $new_regs,
			'total_kundlis'     => $total_kundlis,
			'api_calls'         => $api_total_calls,
			'pending_reviews'   => $pending_reviews,
			'pending_receipts'  => $pending_receipts,
			'total_receipts'    => $total_receipts,
			'active_pandits'    => $active_pandits,
			'active_banners'    => $active_banners,
			'published_posts'   => $published_posts,
			'php_version'       => PHP_VERSION,
			'wp_version'        => get_bloginfo( 'version' ),
			'https_active'      => is_ssl(),
		);
	}
}
