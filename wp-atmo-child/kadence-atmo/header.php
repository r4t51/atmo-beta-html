<?php
/**
 * Header for the ATMO child theme.
 *
 * Keeps Kadence wrapper hooks in place, but renders the ATMO prototype chrome.
 *
 * @package Kadence_Atmo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?><!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class( 'atmo-wp' ); ?>>
<?php wp_body_open(); ?>
<?php do_action( 'kadence_before_wrapper' ); ?>
<div id="wrapper" class="site wp-site-blocks atmo-site">
	<?php
	do_action( 'kadence_before_header' );
	kadence_atmo_header();
	do_action( 'kadence_after_header' );
	?>

	<main id="inner-wrap" class="wrap kt-clear atmo-main" role="main">
		<?php do_action( 'kadence_before_content' ); ?>

