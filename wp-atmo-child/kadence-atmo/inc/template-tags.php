<?php
/**
 * Template helpers for ATMO chrome.
 *
 * @package Kadence_Atmo
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the inline ATMO mark SVG from the prototype.
 */
function kadence_atmo_mark( int $size = 24 ): string {
	return sprintf(
		'<svg width="%1$d" height="%1$d" viewBox="0 0 36 36" fill="none" aria-hidden="true" class="atmo-mark-svg"><line x1="18" y1="6" x2="27" y2="28" stroke="var(--primary)" stroke-width="7.5" stroke-linecap="round"/><line x1="18" y1="6" x2="6" y2="31" stroke="var(--secondary)" stroke-width="9" stroke-linecap="round"/><circle cx="6" cy="31" r="4.5" fill="var(--primary)"/></svg>',
		$size
	);
}

/**
 * Current cart count for the header badge.
 */
function kadence_atmo_cart_count(): int {
	if ( function_exists( 'WC' ) && WC()->cart ) {
		return (int) WC()->cart->get_cart_contents_count();
	}

	return 0;
}

/**
 * Prototype-aligned navigation links.
 */
function kadence_atmo_nav_links(): array {
	return [
		'home'    => [ 'label' => __( 'Главная', 'kadence-atmo' ), 'url' => home_url( '/' ) ],
		'catalog' => [ 'label' => __( 'Каталог', 'kadence-atmo' ), 'url' => home_url( '/catalog/' ) ],
		'courses' => [ 'label' => __( 'Мои курсы', 'kadence-atmo' ), 'url' => home_url( '/courses/' ) ],
		'account' => [ 'label' => __( 'Кабинет', 'kadence-atmo' ), 'url' => function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : home_url( '/my-account/' ) ],
	];
}

/**
 * Guess active navigation item from the current request.
 */
function kadence_atmo_active_nav_id(): string {
	if ( is_front_page() || is_home() ) {
		return 'home';
	}

	$path = trim( (string) wp_parse_url( add_query_arg( [] ), PHP_URL_PATH ), '/' );

	if (
		false !== strpos( $path, 'catalog' ) ||
		is_post_type_archive( 'product' ) ||
		( function_exists( 'is_shop' ) && is_shop() )
	) {
		return 'catalog';
	}

	if ( false !== strpos( $path, 'courses' ) || is_singular( 'sfwd-courses' ) || is_singular( 'atmo-course' ) ) {
		return 'courses';
	}

	if (
		false !== strpos( $path, 'account' ) ||
		false !== strpos( $path, 'my-account' ) ||
		( function_exists( 'is_account_page' ) && is_account_page() )
	) {
		return 'account';
	}

	return '';
}

/**
 * Render the main site header.
 */
function kadence_atmo_header(): void {
	$active     = kadence_atmo_active_nav_id();
	$cart_count = kadence_atmo_cart_count();
	?>
	<header class="page-nav atmo-header">
		<div class="container page-nav-row">
			<a class="brand-mark" href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php echo kadence_atmo_mark( 24 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<span class="brand-name">atmo</span>
				<span class="brand-sub">studio</span>
			</a>
			<nav class="nav-links" aria-label="<?php esc_attr_e( 'Основная навигация', 'kadence-atmo' ); ?>">
				<?php foreach ( kadence_atmo_nav_links() as $id => $link ) : ?>
					<a class="nav-link<?php echo $id === $active ? ' active' : ''; ?>" href="<?php echo esc_url( $link['url'] ); ?>">
						<?php echo esc_html( $link['label'] ); ?>
					</a>
				<?php endforeach; ?>
			</nav>
			<div class="atmo-header-actions">
				<a class="cart-btn" href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' ) ); ?>" aria-label="<?php esc_attr_e( 'Корзина', 'kadence-atmo' ); ?>">
					<span><?php esc_html_e( 'Корзина', 'kadence-atmo' ); ?></span>
					<span class="cart-count"><?php echo esc_html( (string) $cart_count ); ?></span>
				</a>
				<button class="nav-burger" type="button" data-atmo-drawer-open aria-label="<?php esc_attr_e( 'Меню', 'kadence-atmo' ); ?>" aria-expanded="false" aria-controls="nav-drawer">
					<span></span><span></span><span></span>
				</button>
			</div>
		</div>
	</header>
	<?php
}

/**
 * Render the footer.
 */
function kadence_atmo_footer(): void {
	?>
	<footer class="page-footer atmo-footer">
		<div class="container">
			<div class="footer-grid">
				<div>
					<div class="atmo-footer-brand">
						<?php echo kadence_atmo_mark( 22 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<span class="serif">atmo</span>
					</div>
					<p class="atmo-footer-copy">Спокойные структурированные программы для тела, в котором приятно жить.</p>
				</div>
				<div class="footer-col">
					<div class="footer-col-title">Программы</div>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/catalog/' ) ); ?>">Каталог</a></li>
						<li><a href="<?php echo esc_url( home_url( '/courses/' ) ); ?>">Мои курсы</a></li>
					</ul>
				</div>
				<div class="footer-col">
					<div class="footer-col-title">Кабинет</div>
					<ul>
						<li><a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : home_url( '/my-account/' ) ); ?>">Мой аккаунт</a></li>
						<li><a href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' ) ); ?>">Корзина</a></li>
						<li><a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : wp_login_url() ); ?>">Вход / Регистрация</a></li>
					</ul>
				</div>
				<div class="footer-col">
					<div class="footer-col-title">Студия</div>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/trainer/' ) ); ?>">Тренер и метод</a></li>
						<li><a href="https://www.instagram.com/atmo.by/" target="_blank" rel="noopener">Instagram</a></li>
						<li><span>Контакты</span></li>
					</ul>
				</div>
			</div>
			<div class="footer-base">
				<div class="mono atmo-footer-legal">© 2015 - 2026 ATMO Studio</div>
				<div class="atmo-footer-links">
					<a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>">Условия</a>
					<a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">Политика</a>
				</div>
			</div>
		</div>
	</footer>
	<?php
}

/**
 * Render the mobile drawer.
 */
function kadence_atmo_mobile_drawer(): void {
	$active     = kadence_atmo_active_nav_id();
	$cart_count = kadence_atmo_cart_count();
	?>
	<div class="nav-drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Навигация', 'kadence-atmo' ); ?>">
		<div class="nav-drawer-overlay" data-atmo-drawer-close></div>
		<div class="nav-drawer-panel" role="document">
			<div class="nav-drawer-header">
				<a class="brand-mark" href="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php echo kadence_atmo_mark( 22 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<span class="brand-name">atmo</span>
					<span class="brand-sub">studio</span>
				</a>
				<button class="nav-drawer-close" type="button" data-atmo-drawer-close aria-label="<?php esc_attr_e( 'Закрыть меню', 'kadence-atmo' ); ?>">×</button>
			</div>
			<div class="nav-drawer-links">
				<?php foreach ( kadence_atmo_nav_links() as $id => $link ) : ?>
					<a class="<?php echo $id === $active ? 'active' : ''; ?>" href="<?php echo esc_url( $link['url'] ); ?>">
						<?php echo esc_html( $link['label'] ); ?>
					</a>
				<?php endforeach; ?>
				<div class="drawer-sep"></div>
				<a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : wp_login_url() ); ?>">Войти</a>
			</div>
			<div class="nav-drawer-foot">
				<a class="btn btn-primary btn-block" href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' ) ); ?>">
					Корзина <span class="atmo-drawer-cart-count"><?php echo esc_html( (string) $cart_count ); ?></span>
				</a>
			</div>
		</div>
	</div>
	<?php
}
