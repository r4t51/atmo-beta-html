# Snippet 1: Сделать имена загружаемых файлов строчными

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 1 |
| Name | Сделать имена загружаемых файлов строчными |
| Active | no (0) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2023-08-30 11:17:28 |
| Tags | sample, media |
| Source file | `snippet-01-wp-sample-lowercase-filenames.md` |

## Description

Убедитесь, что загружаемые изображения и файлы имеют имена файлов нижнего регистра.

Это образец сниппета. Вы можете использовать его, изменить или удалять.

## Code

```php
add_filter( 'sanitize_file_name', 'mb_strtolower' );
```
