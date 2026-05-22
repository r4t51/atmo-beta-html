# Snippet 2: Отключить панель администратора

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 2 |
| Name | Отключить панель администратора |
| Active | no (0) |
| Scope | `front-end` |
| Priority | 10 |
| Modified | 2023-08-30 11:17:28 |
| Tags | sample, admin-bar |
| Source file | `snippet-02-wp-sample-disable-admin-bar.md` |

## Description

Отключает панель администратора WordPress для всех, кроме администраторов.

Это образец сниппета. Вы можете использовать его, изменить или удалять.

## Code

```php
add_action( 'wp', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		show_admin_bar( false );
	}
} );
```
