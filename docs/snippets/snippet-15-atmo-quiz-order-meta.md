# Snippet 15: ATMO Quiz → Order Meta

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 15 |
| Name | ATMO Quiz → Order Meta |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-03-01 12:18:14 |
| Tags | — |
| Source file | `snippet-15-atmo-quiz-order-meta.md` |

## Code

```php
/**
 * ATMO Quiz → WooCommerce Order Meta (for Code Snippets)
 * Stores quiz answers & recommended courses inside each order.
 *
 * Expected URL params on add-to-cart:
 *  src=quiz
 *  quiz_main=1275
 *  quiz_alt=859
 *  focus=A|B|C|D|E|F
 *  equip=NONE|BANDS|MEDBALL|ALL
 *  level=ZERO|BASE|ADV|PREGNANT
 *  time=T15|T30|T60
 *  result=MIRROR|ENERGY|CONTROL|RELIEF|STRUCTURE
 *  barrier=TIME_LACK|BURNOUT|TOO_HARD|FEAR|MOTIVATION|NO_SYSTEM
 */

if ( ! defined('ABSPATH') ) { exit; }

/**
 * Small helper: get sanitized query param
 */
function atmo_quiz_get_qp($key) {
    if (!isset($_GET[$key])) return '';
    $val = wp_unslash($_GET[$key]);
    if (is_array($val)) return '';
    return sanitize_text_field($val);
}

/**
 * 1) Capture URL params into cart item data on add-to-cart
 */
add_filter('woocommerce_add_cart_item_data', function($cart_item_data, $product_id, $variation_id) {

    // Require explicit src=quiz to avoid polluting normal orders
    $src = atmo_quiz_get_qp('src');
    if ($src !== 'quiz') return $cart_item_data;

    $keys = ['src','quiz_main','quiz_alt','focus','equip','level','time','result','barrier'];

    foreach ($keys as $k) {
        $v = atmo_quiz_get_qp($k);
        if ($v !== '') {
            $cart_item_data['atmo_'.$k] = $v;
        }
    }

    // Prevent merging different quiz sessions into one line item
    $cart_item_data['atmo_unique'] = wp_generate_uuid4();

    return $cart_item_data;
}, 10, 3);

/**
 * 2) Show quiz meta on cart/checkout line item (optional)
 */
add_filter('woocommerce_get_item_data', function($item_data, $cart_item) {

    if (empty($cart_item['atmo_src']) || $cart_item['atmo_src'] !== 'quiz') return $item_data;

    $map = [
        'atmo_focus'     => 'Quiz: focus',
        'atmo_equip'     => 'Quiz: equip',
        'atmo_level'     => 'Quiz: level',
        'atmo_time'      => 'Quiz: time',
        'atmo_result'    => 'Quiz: result',
        'atmo_barrier'   => 'Quiz: barrier',
        'atmo_quiz_main' => 'Quiz: main ID',
        'atmo_quiz_alt'  => 'Quiz: alt ID',
    ];

    foreach ($map as $key => $label) {
        if (!empty($cart_item[$key])) {
            $item_data[] = [
                'name'  => $label,
                'value' => wc_clean($cart_item[$key]),
            ];
        }
    }
    return $item_data;
}, 10, 2);

/**
 * 3) Copy quiz meta from cart item to order line item meta
 */
add_action('woocommerce_checkout_create_order_line_item', function($item, $cart_item_key, $values, $order) {

    if (empty($values['atmo_src']) || $values['atmo_src'] !== 'quiz') return;

    foreach ($values as $k => $v) {
        if (strpos($k, 'atmo_') === 0 && $v !== '') {
            // Store under readable keys in order item meta (without exposing internal "unique")
            if ($k === 'atmo_unique') continue;
            $item->add_meta_data($k, $v, true);
        }
    }

}, 10, 4);

/**
 * 4) Store an order-level summary (_atmo_quiz)
 * We take the first cart item that has atmo_src=quiz.
 */
add_action('woocommerce_checkout_update_order_meta', function($order_id) {

    if (empty(WC()->cart)) return;

    $summary = null;

    foreach (WC()->cart->get_cart() as $cart_item) {
        if (!empty($cart_item['atmo_src']) && $cart_item['atmo_src'] === 'quiz') {
            $summary = [
                'src'    => $cart_item['atmo_src'] ?? '',
                'main'   => $cart_item['atmo_quiz_main'] ?? '',
                'alt'    => $cart_item['atmo_quiz_alt'] ?? '',
                'focus'  => $cart_item['atmo_focus'] ?? '',
                'equip'  => $cart_item['atmo_equip'] ?? '',
                'level'  => $cart_item['atmo_level'] ?? '',
                'time'   => $cart_item['atmo_time'] ?? '',
                'result' => $cart_item['atmo_result'] ?? '',
                'barrier'=> $cart_item['atmo_barrier'] ?? '',
                'ts'     => time(),
            ];
            break;
        }
    }

    if ($summary) {
        update_post_meta($order_id, '_atmo_quiz', $summary);
    }

}, 10);

/**
 * 5) Show quiz summary inside admin order screen
 */
add_action('woocommerce_admin_order_data_after_order_details', function($order) {

    if (!is_a($order, 'WC_Order')) return;

    $data = get_post_meta($order->get_id(), '_atmo_quiz', true);
    if (empty($data) || !is_array($data) || ($data['src'] ?? '') !== 'quiz') return;

    $main_id = !empty($data['main']) ? (int)$data['main'] : 0;
    $alt_id  = !empty($data['alt'])  ? (int)$data['alt']  : 0;

    $main_title = $main_id ? get_the_title($main_id) : '';
    $alt_title  = $alt_id  ? get_the_title($alt_id)  : '';

    echo '<div class="order_data_column" style="width:100%; margin-top:12px;">';
    echo '<h3 style="margin:0 0 8px;">ATMO Quiz</h3>';
    echo '<p style="margin:0 0 6px;"><strong>Источник:</strong> quiz</p>';

    if ($main_id) {
        echo '<p style="margin:0 0 6px;"><strong>Рекомендация (main):</strong> ' . esc_html($main_id) .
             ($main_title ? ' — ' . esc_html($main_title) : '') . '</p>';
    }
    if ($alt_id) {
        echo '<p style="margin:0 0 6px;"><strong>Альтернатива (alt):</strong> ' . esc_html($alt_id) .
             ($alt_title ? ' — ' . esc_html($alt_title) : '') . '</p>';
    }

    $fields = [
        'focus'   => 'Фокус',
        'equip'   => 'Инвентарь',
        'level'   => 'Уровень',
        'time'    => 'Время',
        'result'  => 'Признак результата',
        'barrier' => 'Барьер'
    ];

    echo '<p style="margin:8px 0 0;"><strong>Ответы:</strong></p>';
    echo '<ul style="margin:6px 0 0 18px;">';
    foreach ($fields as $k => $label) {
        if (!empty($data[$k])) {
            echo '<li>' . esc_html($label) . ': ' . esc_html($data[$k]) . '</li>';
        }
    }
    echo '</ul>';
    echo '</div>';

}, 10, 1);
```
