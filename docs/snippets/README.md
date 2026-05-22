# Code Snippets export (read-only)

> **Exported:** 2026-05-22 from Local WordPress **`wp_snippets`** table (Code Snippets plugin).  
> **Prior audit:** commit `d2f7262` — `docs: record Code Snippets LMS-Woo routing audit`  
> **Purpose:** versioned reference before LMS adapter PHP work — **not** a deployment source.

## Warnings

- **Read-only reference.** Production snippets live in the database, not git. Editing files here does **not** change WordPress.
- **Do not paste back blindly.** Re-import requires Code Snippets UI or a controlled migration; diff against live DB first.
- **No credentials** in this folder. Re-export from your Local/staging environment when snippets change.
- **Encoding:** UTF-8. Cyrillic strings in snippet code (PDP copy, quiz admin labels, etc.) are preserved.
- **ID gap:** rows **1–17** exist; **no ID 6** in Local export (matches prior audit).

## Active values

| `active` | Meaning (Local) |
|----------|-----------------|
| `1` | On |
| `0` | Off |
| `-1` | Off / disabled in plugin UI (see **#17**) |

## Inventory (16 snippets)

| ID | Name | Active | Scope | File |
|----|------|--------|-------|------|
| 1 | Сделать имена загружаемых файлов строчными | no | global | [snippet-01-wp-sample-lowercase-filenames.md](snippet-01-wp-sample-lowercase-filenames.md) |
| 2 | Отключить панель администратора | no | front-end | [snippet-02-wp-sample-disable-admin-bar.md](snippet-02-wp-sample-disable-admin-bar.md) |
| 3 | Разрешить смайлики | no | global | [snippet-03-wp-sample-smilies.md](snippet-03-wp-sample-smilies.md) |
| 4 | Текущий год | no | content | [snippet-04-wp-sample-current-year.md](snippet-04-wp-sample-current-year.md) |
| 5 | Thank You Redirect | no | front-end | [snippet-05-thank-you-redirect.md](snippet-05-thank-you-redirect.md) |
| 7 | Login Log | yes | global | [snippet-07-login-log.md](snippet-07-login-log.md) |
| 8 | Student's Journal | yes | global | [snippet-08-student-s-journal.md](snippet-08-student-s-journal.md) |
| 9 | Course Info Card | yes | global | [snippet-09-course-info-card.md](snippet-09-course-info-card.md) |
| 10 | Currency | yes | global | [snippet-10-currency.md](snippet-10-currency.md) |
| 11 | Courses Carousel for mainpage | no | global | [snippet-11-courses-carousel-for-mainpage.md](snippet-11-courses-carousel-for-mainpage.md) |
| 12 | Bottom Button | yes | global | [snippet-12-bottom-button.md](snippet-12-bottom-button.md) |
| 13 | Google Search | yes | global | [snippet-13-google-search.md](snippet-13-google-search.md) |
| 14 | Courses Carousel for mainpage NEW | yes | global | [snippet-14-courses-carousel-for-mainpage-new.md](snippet-14-courses-carousel-for-mainpage-new.md) |
| 15 | ATMO Quiz → Order Meta | yes | global | [snippet-15-atmo-quiz-order-meta.md](snippet-15-atmo-quiz-order-meta.md) |
| 16 | META hide in E-mail | yes | global | [snippet-16-meta-hide-in-e-mail.md](snippet-16-meta-hide-in-e-mail.md) |
| 17 | Before&After for 33_Pelvic Floor | no (-1) | global | [snippet-17-before-after-for-33-pelvic-floor.md](snippet-17-before-after-for-33-pelvic-floor.md) |

Machine-readable index: [`_manifest.json`](_manifest.json).

## High-impact snippets (LMS / Woo / ATMO)

### #5 Thank You Redirect — **inactive — do not re-enable**

- **Status:** `active = 0`
- **Hook:** `template_redirect` on order-received
- **Target:** broken URL `http://atmoredesign.local.local/courses`
- **Action:** keep off until a separate thank-you / post-checkout spec exists (`CHANGES.md` → 2026-05-21)

### #9 / #10 / #12 — PDP output

| ID | Role | Theme coupling |
|----|------|----------------|
| **9** | `[course_info_card]` shortcode — inline HTML/CSS on product pages | `kadence-child/inc/atmo-product.php` strips some inline styles |
| **10** | `woocommerce_get_price_html` → `.custom-main-price` + `.euro-hint` | `atmo-catalog.css` / `atmo-product.css` expect this markup |
| **12** | `the_content` on product — duplicate add-to-cart block in description tab | overlaps hero buy box; intentional duplicate today |

### #14 — Homepage `[featured_courses]`

- **Active** carousel; links to **Woo product PDPs**, not LearnDash `/courses/` archive
- **#11** inactive duplicate shortcode name — superseded by **#14**

### #15 — ATMO Quiz → Order Meta

- Cart/checkout hooks; stores `atmo_*` line meta + order-level `_atmo_quiz`
- **Adapter rule:** order context / display only — **not** enrollment source of truth
- Pairs with Woo view-order `тип-доступа` display in child theme

### #16 — Hides `atmo_*` from formatted order item meta

- Filter: `woocommerce_order_item_get_formatted_meta_data`
- Hides technical quiz keys from customer-facing emails/display

### #17 — Before&After checklist / AJAX — **inactive (`-1`)**

- Custom table `wp_user_checklists`, AJAX `save_checklist`, shortcode `[get_checklist_do]`
- Course-adjacent only if revived; not on MVP enrolled path today

## LMS / routing (unchanged from audit)

No **active** snippet controls LearnDash enrollment, `/courses/` archive, `/my-account/` dashboard, or **«Мои курсы»** route. See `WP_DEPENDENCY_MAP.md` Code Snippets registry and `LMS_ADAPTER_SPEC.md`.

## Re-export (when snippets change)

1. Read-only query against Local `wp_snippets` (Code Snippets plugin table).
2. Regenerate `snippet-*.md` + `_manifest.json` + this README inventory table.
3. Do **not** commit DB credentials; verify UTF-8 Cyrillic in spot-check files (#9, #12, #15).

## Related docs

- `WP_DEPENDENCY_MAP.md` — Code Snippets registry
- `BACKLOG.md` §6 — export/version task
- `CHANGES.md` — 2026-05-22 Code Snippets audit
- `LMS_ADAPTER_SPEC.md` — `OrderAccessContext` / quiz meta pairing
