# Snippet 10: Currency

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 10 |
| Name | Currency |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-04-13 09:52:33 |
| Tags | — |
| Source file | `snippet-10-currency.md` |

## Code

```php
add_filter( 'woocommerce_get_price_html', 'custom_append_euro_price_hint', 10, 2 );

function custom_append_euro_price_hint( $price, $product ) {
    if ( is_admin() ) return $price; 
    
    $exchange_rate = 4.25; 
    $euro_hint = '';

    if ( $product->is_type( 'variable' ) ) {
        $min_pln = $product->get_variation_price( 'min', true );
        $max_pln = $product->get_variation_price( 'max', true );

        if ( $min_pln && $max_pln && $min_pln !== $max_pln ) {
            $min_euro = round( $min_pln / $exchange_rate );
            $max_euro = round( $max_pln / $exchange_rate );
            $euro_hint = ' <span class="euro-hint">(~ ' . $min_euro . ' € – ' . $max_euro . ' €)</span>';
        } elseif ( $min_pln ) {
            $min_euro = round( $min_pln / $exchange_rate );
            $euro_hint = ' <span class="euro-hint">(~ ' . $min_euro . ' €)</span>';
        }
    } else {
        $pln_price = $product->get_price();
        if ( $pln_price ) {
            $euro_price = round( $pln_price / $exchange_rate );
            $euro_hint = ' <span class="euro-hint">(~ ' . $euro_price . ' €)</span>';
        }
    }
    
    // Оборачиваем всю цену в специальный класс для управления через CSS
    return '<span class="custom-main-price">' . $price . $euro_hint . '</span>';
}
```
