# Snippet 13: Google Search

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 13 |
| Name | Google Search |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-02-25 18:19:52 |
| Tags | — |
| Source file | `snippet-13-google-search.md` |

## Code

```php
add_action('wp_head', 'custom_google_verification');
function custom_google_verification() {
    echo '<meta name="google-site-verification" content="Kk9ilJvRKhho99hBuWFPGPPVcn5pFWoKON9NcpJPO0o" />';
}
```
