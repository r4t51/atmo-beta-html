# Snippet 12: Bottom Button

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 12 |
| Name | Bottom Button |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-02-22 10:34:39 |
| Tags | — |
| Source file | `snippet-12-bottom-button.md` |

## Code

```php
add_filter( 'the_content', 'custom_append_bottom_checkout_to_description' );

function custom_append_bottom_checkout_to_description( $content ) {
    if ( ! is_singular( 'product' ) || ! in_the_loop() || ! is_main_query() ) {
        return $content;
    }

    global $product;
    if ( ! $product || ! $product->is_in_stock() ) {
        return $content;
    }

    ob_start();
    ?>
    <div class="app-bottom-checkout">
        <h3 class="app-checkout-title">Готовы начать тренировки?</h3>
        <div class="app-checkout-price">
            <?php echo $product->get_price_html(); ?>
        </div>
        <div class="app-checkout-action">
            <?php woocommerce_template_single_add_to_cart(); ?>
        </div>
    </div>
    <style>
        .app-bottom-checkout {
            margin: 40px 0 0 0 !important;
            padding: 40px 20px !important;
            text-align: center !important;
            background: #ffffff !important;
            border-radius: 12px !important;
            border: 1px solid #e5e7eb !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
            clear: both !important;
        }
        .app-checkout-title {
            font-size: 24px !important;
            color: #111827 !important;
            margin: 0 0 20px 0 !important;
            font-weight: 800 !important;
            border: none !important;
            padding: 0 !important;
            text-align: center !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            line-height: 1.3 !important;
        }
        
        /* Цена */
        .app-checkout-price {
            margin-bottom: 24px !important;
            width: 100% !important;
            text-align: center !important;
            display: block !important;
        }
        .app-checkout-price .price,
        .app-checkout-price p.price,
        .app-checkout-price span.price {
            display: inline-block !important;
            margin: 0 auto !important;
            padding: 0 !important;
            text-align: center !important;
        }
        .app-checkout-price del,
        .app-checkout-price ins {
            display: inline-block !important;
            margin: 0 6px !important;
            vertical-align: baseline !important;
            line-height: 1.2 !important;
        }
        
        /* Обертка для кнопки */
        .app-checkout-action {
            width: 100% !important;
            display: block !important;
            text-align: center !important;
            clear: both !important;
        }
        
        /* УБИВАЕМ FLOAT ДЛЯ ФОРМЫ */
        .app-checkout-action form.cart {
            display: block !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
            text-align: center !important;
            float: none !important; 
        }
        
        .app-checkout-action div.quantity {
            display: none !important;
        }
        
        /* УБИВАЕМ FLOAT ДЛЯ КНОПКИ */
        .app-checkout-action button.single_add_to_cart_button {
            background-color: #20bec4 !important;
            color: #ffffff !important;
            font-size: 18px !important;
            font-weight: 700 !important;
            padding: 16px 24px !important;
            height: auto !important;
            line-height: 1.3 !important;
            border-radius: 8px !important;
            border: none !important;
            cursor: pointer !important;
            width: 100% !important;
            max-width: 300px !important;
            margin: 0 auto !important;
            display: inline-block !important; 
            text-align: center !important;
            box-sizing: border-box !important;
            float: none !important; 
        }
        .app-checkout-action button.single_add_to_cart_button:hover {
            background-color: #1aa6ab !important;
            transform: translateY(-2px) !important;
        }

        /* Мобильная адаптация */
        @media (max-width: 640px) {
            .app-bottom-checkout {
                padding: 24px 16px !important;
                margin: 24px 0 0 0 !important;
            }
            .app-checkout-title {
                font-size: 20px !important;
            }
            .app-checkout-action button.single_add_to_cart_button {
                max-width: 100% !important;
                font-size: 16px !important;
                padding: 14px 20px !important;
            }
        }
    </style>
    <?php
    $checkout_block = ob_get_clean();

    return $content . $checkout_block;
}
```
