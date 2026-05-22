<?php
/**
 * ATMO Redesign child theme bootstrap.
 *
 * @package Kadence_Atmo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KADENCE_ATMO_VERSION', '0.1.0' );
define( 'KADENCE_ATMO_DIR', get_stylesheet_directory() );
define( 'KADENCE_ATMO_URI', get_stylesheet_directory_uri() );

require_once KADENCE_ATMO_DIR . '/inc/template-tags.php';

add_action( 'wp_enqueue_scripts', 'kadence_atmo_enqueue_assets', 20 );
/**
 * Load the prototype design system after the parent theme styles.
 */
function kadence_atmo_enqueue_assets(): void {
	wp_enqueue_style(
		'kadence-atmo-design',
		KADENCE_ATMO_URI . '/assets/css/atmo-design.css',
		[],
		KADENCE_ATMO_VERSION
	);

	wp_enqueue_style(
		'kadence-atmo-wp-adapter',
		KADENCE_ATMO_URI . '/assets/css/wp-adapter.css',
		[ 'kadence-atmo-design' ],
		KADENCE_ATMO_VERSION
	);

	wp_enqueue_script(
		'kadence-atmo-navigation',
		KADENCE_ATMO_URI . '/assets/js/navigation.js',
		[],
		KADENCE_ATMO_VERSION,
		true
	);
}

add_action( 'after_setup_theme', 'kadence_atmo_setup' );
/**
 * Register ATMO navigation locations without disturbing Kadence internals.
 */
function kadence_atmo_setup(): void {
	register_nav_menus(
		[
			'atmo_primary' => __( 'ATMO Primary Navigation', 'kadence-atmo' ),
			'atmo_footer'  => __( 'ATMO Footer Navigation', 'kadence-atmo' ),
		]
	);
}

