# Snippet 16: META hide in E-mail

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 16 |
| Name | META hide in E-mail |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-04-15 13:59:33 |
| Tags | — |
| Source file | `snippet-16-meta-hide-in-e-mail.md` |

## Code

```php
add_filter( 'woocommerce_order_item_get_formatted_meta_data', 'atmo_hide_technical_meta_from_emails', 10, 2 );

function atmo_hide_technical_meta_from_emails( $formatted_meta, $item ) {
    foreach ( $formatted_meta as $key => $meta ) {
        // Проверяем, начинается ли ключ с нашего технического префикса atmo_
        if ( strpos( $meta->key, 'atmo_' ) === 0 ) {
            unset( $formatted_meta[$key] );
        }
    }
    return $formatted_meta;
}
```
