<?php
/**
 * Footer for the ATMO child theme.
 *
 * @package Kadence_Atmo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'kadence_after_content' );
?>
	</main>
	<?php
	do_action( 'kadence_before_footer' );
	kadence_atmo_footer();
	kadence_atmo_mobile_drawer();
	do_action( 'kadence_after_footer' );
	?>
</div>
<?php do_action( 'kadence_after_wrapper' ); ?>
<?php wp_footer(); ?>
</body>
</html>

