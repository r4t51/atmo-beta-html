# Snippet 3: Разрешить смайлики

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 3 |
| Name | Разрешить смайлики |
| Active | no (0) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2023-08-30 11:17:28 |
| Tags | sample |
| Source file | `snippet-03-wp-sample-smilies.md` |

## Description

Позволяет конвертировать смайлики в непонятные места.

Это образец сниппета. Вы можете использовать его, изменить или удалять.

## Code

```php
add_filter( 'widget_text', 'convert_smilies' );
add_filter( 'the_title', 'convert_smilies' );
add_filter( 'wp_title', 'convert_smilies' );
add_filter( 'get_bloginfo', 'convert_smilies' );
```
