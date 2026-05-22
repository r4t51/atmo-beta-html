# Snippet 5: Thank You Redirect

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 5 |
| Name | Thank You Redirect |
| Active | no (0) |
| Scope | `front-end` |
| Priority | 10 |
| Modified | 2023-08-30 11:24:12 |
| Tags | — |
| Source file | `snippet-05-thank-you-redirect.md` |

## Code

```php

/* Redirect user after check out */
add_action( 'template_redirect', 'jay_custom_redirect_after_purchase' ); 
function jay_custom_redirect_after_purchase() {
	global $wp;
	
	if ( is_checkout() && ! empty( $wp->query_vars['order-received'] ) ) {
		wp_redirect( 'http://atmoredesign.local.local/courses' );
		exit;
	}
}
```
