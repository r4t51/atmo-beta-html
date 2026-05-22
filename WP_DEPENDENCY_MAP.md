# ATMO.BY — WordPress dependency map

Карта зависимостей для переноса HTML-прототипа на Local WordPress.

Дата: 2026-05-22  
Статус: child theme active; **shell/wiring phase complete (re-QA 2026-05-22)** — header, footer, catalog, PDP, cart, checkout, order-received, account; preview mu-plugin keep-for-now.

## Executive Summary

Рабочий сайт сейчас держится на Kadence + WooCommerce + LearnDash. Активна `ATMO Kadence Child 0.1.0`, parent — Kadence 1.4.5. Child theme снижает риск потери изменений при обновлении parent, но Kadence updates всё равно нужно тестировать отдельно.

Kadence не содержит WooCommerce или LearnDash template overrides, поэтому перенос можно вести инкрементально через child theme без миграции чужих theme templates.

`atmo-lms-lite` находится в разработке и **active** on Local; LearnDash остаётся primary для course/lesson UI. Course/lesson UI нельзя жёстко строить на LearnDash HTML или LearnDash-specific functions без adapter/ViewModel слоя.

## Current Stack

| Слой | Текущее состояние |
|---|---|
| WordPress | Local by Flywheel, `http://atmoredesign.local/` |
| PHP | 8.2.29; доступна 8.4.10 |
| Theme | Kadence 1.4.5 parent |
| Child theme | `ATMO Kadence Child 0.1.0`, active |
| WooCommerce | 10.7.0 |
| LearnDash | `sfwd-lms` 5.0.5, active current LMS |
| Future LMS | `atmo-lms-lite`, **active** on Local, in development (LearnDash still primary for course/lesson UI) |
| Code Snippets | бизнес-логика в БД, не в VCS |
| Preview layer | mu-plugin `atmo-redesign-preview`, temporary |

## Theme Layer

| Что | Путь / факт |
|---|---|
| Parent theme | `wp-content/themes/kadence/` |
| Child theme | `wp-content/themes/kadence-child/` |
| Child files | `style.css`, `functions.php`, `assets/css/atmo-base.css`, `assets/css/atmo-header.css`, `assets/js/atmo-header.js`, `inc/atmo-header.php`, `assets/css/atmo-footer.css`, `inc/atmo-footer.php`, `assets/css/atmo-catalog.css`, `inc/atmo-catalog.php`, `woocommerce/content-product.php`, `assets/css/atmo-product.css`, `inc/atmo-product.php`, `woocommerce/content-single-product.php`, `assets/css/atmo-cart.css`, `assets/css/atmo-checkout.css`, `assets/css/atmo-confirmation.css`, `assets/css/atmo-account.css`, `inc/atmo-account.php` |
| Header ID | `#masthead` (Kadence, скрыт CSS `body.atmo-header-active`) |
| Footer ID | `#colophon` (Kadence, скрыт CSS `body.atmo-footer-active`) |

Сделано:

- child theme создана и активирована;
- `atmo-base.css` содержит только безопасные `--atmo-*` design tokens;
- Google Fonts подключены в child theme;
- ATMO header заменён через `kadence_before_header` хук (inc/atmo-header.php);
- Kadence `#masthead` скрыт CSS-правилом `body.atmo-header-active #masthead { display: none !important; }`;
- ATMO footer заменён через `kadence_before_footer` хук (inc/atmo-footer.php);
- Kadence `#colophon` скрыт CSS-правилом `body.atmo-footer-active #colophon { display: none !important; }`;
- Preview shell: CSS скрывает `.atmo-site-header` и `.atmo-site-footer` когда активен `body.atmo-preview-shell-enabled`;
- ✅ Каталог MVP: `woocommerce/content-product.php` override рендерит `.atmo-product-card` внутри стандартной WC `ul.products li.product` разметки;
  - `inc/atmo-catalog.php`: `atmo_build_course_card()` ViewModel без LD coupling;
  - `assets/css/atmo-catalog.css`: грузится на is_shop/is_product_category/is_product_tag/is_product (для related products);
  - Snippet ID 10 (`.custom-main-price` + `.euro-hint`) учтён в CSS;
  - `pa_goal` / goal attribute on Local; 18 redesign products assigned; goal chips + server-side `filter_goal` (`CHANGES.md` 2026-05-20; re-QA PASS 2026-05-22). Chip URLs always `/каталог/` base — not category/tag-aware (optional future — `BACKLOG.md`). `atmo-catalog-filters.js` absent / not enqueued.
- ✅ Single product MVP: `woocommerce/content-single-product.php` override с ATMO hero layout;
  - `inc/atmo-product.php`: `atmo_build_product_page()` ViewModel — id, title, permalink, thumbnail_url, price_html, is_on_sale, short_description_html, categories; без LD coupling;
  - `assets/css/atmo-product.css`: hero 2-col grid (≥920px), buy box, price (`.custom-main-price`), WC add-to-cart button; грузится только на is_product();
  - WC mechanics сохранены: `woocommerce_before_single_product` (notices), `woocommerce_after_single_product_summary` (tabs + upsells + related), `woocommerce_after_single_product`;
  - Snippet 10 учтён в price CSS; Snippet 12 (bottom CTA) работает в description tab через `the_content`; Snippet 9 (`[course_info_card]`) рендерится в short_description_html;
  - Re-QA PASS 2026-05-22 (`CHANGES.md`): simple + variable (#3614) + recovery spot-check; asset scope confirmed — `atmo-product.css` + `atmo-catalog.css` (related) only; no account/cart/checkout/filter JS on PDP.
  - Optional: #3614 access-tier hero polish after tier pick — `BACKLOG.md` (not a wiring blocker).
  - LearnDash / enrolled / access state не включены.

- ✅ Woo My Account (`assets/css/atmo-account.css`, `inc/atmo-account.php`):
  - CSS на `is_account_page()` only; LearnDash `/courses/`, `/profile/`, `/reset-password/` not enqueued.
  - Menu filter (`d4ee689`): Обзор → `dashboard` · Программы → `/courses/` (external link, not Woo rewrite) · Заказы → `orders` · Настройки → `edit-account` · Выйти → `customer-logout`
  - Hidden from nav, direct URL only: `downloads`, `edit-address` (+ billing/shipping), `payment-methods`
  - Styled passes: auth (`353346c`), shell (`3122f4f`), dashboard static shell (`534b241`), orders (`3704226`), view-order access-type meta (`2da518f`), settings (`d1748dc`), hidden endpoints (`3135ddb`), mobile orders actions overflow (`fcca2e5`)
  - Account shell/wiring done; completed #3801 view-order QA (line item shell, qty/total, customer details, order-again visibility — not clicked); access-type meta pill on view-order (`2da518f`, item meta `тип-доступа`); saved payment-methods table not live-QA'd; real LMS/enrolled widgets deferred until adapter decision
  - Audited 2026-05-22 (read-only PASS): `/my-account/add-payment-method/` (shell/wiring OK; Stripe card/BLIK absent on Local — Woo/Stripe env, not theme CSS); dashboard static shell (`534b241`, desktop/mobile PASS; Woo default dashboard copy hidden by CSS when `.atmo-dash` present)
  - **Open tasks:** `BACKLOG.md`
  - Do not redirect Woo account endpoints without audit.

Не трогали:

- parent Kadence files;
- WooCommerce templates (кроме `content-product.php` и `content-single-product.php` overrides);
- LearnDash templates;
- Code Snippets;
- plugin activation state.

## Preview Layer

Временный mu-plugin:

| Что | Путь |
|---|---|
| PHP | `wp-content/mu-plugins/atmo-redesign-preview.php` |
| CSS | `wp-content/mu-plugins/atmo-redesign/assets/css/atmo-preview.css` |
| Включение shell | `?atmo_preview_shell=1` |

Без query param сайт использует ATMO child header/footer. Preview layer нужен только для старого shell preview и сравнения.  
С query param preview layer рендерит ATMO header/footer и скрывает Kadence chrome:

```css
body.atmo-preview-shell-enabled #masthead,
body.atmo-preview-shell-enabled #colophon {
  display: none !important;
}
```

Preview mu-plugin стабилизирован: `atmo-preview-fonts` и `atmo-preview-layer` CSS грузятся только при `?atmo_preview_shell=1`. `atmo-preview-layer` body class тоже только в preview mode. Дубля шрифтов на обычных страницах больше нет.

**VCS / deployment:** файлы только на Local; **не в git** (`kadence-child` или docs repo). Риск потери при rebuild/clone без backup.

**Decision (2026-05-22):** keep for now as low-risk legacy comparison tool; remove later after explicit sign-off that child header/footer are canonical. Checklist + removal steps: `BACKLOG.md`, `CHANGES.md` → 2026-05-22 preview mu-plugin discovery.

## WooCommerce Map

| Зона | Факт / риск |
|---|---|
| Cart URL | `/cart-2/`, нестандартный slug; shell `atmo-cart.css` + `atmo-catalog.css` (cross-sells); re-QA PASS 2026-05-22 |
| Checkout | `/checkout/` — **200** + full form when cart has items; empty cart may redirect to `/cart-2/` (Woo default; not re-tested 2026-05-22). Shell `atmo-checkout.css` (excludes order-received). Re-QA PASS 2026-05-22 with session item |
| Payment failed | `/payment-failed/` → **404** by design (no static page yet); standard 404 shell |
| Order received | `/checkout/order-received/` → `atmo-confirmation.css` only; excludes `atmo-checkout.css` |
| HPOS | таблицы созданы, custom order storage отключён |
| Orders storage | legacy `wp_posts` / `wp_postmeta` |
| Bridge | LearnDash WooCommerce bridge продаёт курсы через WC |
| My Account page | `/my-account/` + Woo endpoints; menu IA in `inc/atmo-account.php` |
| Account menu | 5 items — see Theme Layer Woo My Account block |
| Hidden account URLs | `/my-account/downloads/`, `/edit-address/`, `/payment-methods/` (reachable, not in nav) |
| `/courses/` from account nav | External LearnDash **public archive**; label **«Программы»** — not enrolled UI |
| **`/my-account/my-courses/`** | **Decided** enrolled **«Мои курсы»** MVP route — not registered yet; audit before endpoint — `LMS_ADAPTER_SPEC.md` §2 |

Активные WC-расширения, которые важно учитывать:

- WooCommerce Stripe;
- Woo Checkout Field Editor Pro;
- WooCommerce Variation Swatches;
- WC Price History;
- LearnDash WooCommerce bridge.

Не включать HPOS без отдельной миграции и проверки совместимости плагинов заказов.

## LMS Map

Текущий runtime для course/lesson UI: LearnDash.  
`atmo-lms-lite` **active** on Local, in development — candidate future runtime; не строить критичный UI на нём без явного решения; **no front-end assets observed** on course routes (2026-05-22 QA).

**Route reality (2026-05-22):** `/courses/` = LearnDash **public CPT archive** (18 cards). **«Программы»** → `/courses/` (interim relabel). **«Мои курсы»** enrolled MVP → **`/my-account/my-courses/`** (decided, not built) — `LMS_ADAPTER_SPEC.md` §2. **`/courses/` stays public.**

LearnDash CPTs:

- `sfwd-courses`;
- `sfwd-lessons`;
- `sfwd-topic`;
- `sfwd-quiz`;
- `groups`.

`atmo-lms-lite` active on Local, in development: modules include courses, lessons, mapping, migration, access-gate, access-rules, enrollment-hook, guest-orders, reconciler, refunds, run-log, status, woocommerce, work-queue, diagnostics. LearnDash templates/caution still applies for production UI until adapter decision.

Enrollment source of truth today: LearnDash + LearnDash WooCommerce bridge (not order line items alone). Snippet **#5** Thank You Redirect is **inactive** (`active = 0`); do not re-enable without safe thank-you spec — see Code Snippets registry.

### LMS Architecture Rule

**Adapter spec (v0):** `LMS_ADAPTER_SPEC.md` — ViewModel contract, MVP enrolled UI, route candidates, sign-off checklist. This section is a short field summary only.

Не копировать LearnDash HTML как финальный UI. Все course/lesson компоненты должны получать нормализованные данные через **adapter interface** (PHP), not LD DOM/classes:

| ViewModel | Минимальные данные |
|---|---|
| `CourseCard` | id, title, slug, permalink, thumbnail_url, excerpt, price_html?, categories[], goal_slug? |
| `EnrollmentState` | course_id, is_enrolled, status (`none`\|`active`\|`expired`\|`completed`), progress_percent, completed_steps, total_steps, expires_at?, source (`learndash`\|`atmo-lms`) |
| `EnrolledCourse` | CourseCard + EnrollmentState + last_lesson?, next_lesson?, cta_label, cta_url |
| `LessonRef` / `LessonProgress` | id, title, permalink, course_id, order_index, is_complete, is_accessible, prev?, next?, content_html? (deferred) |
| `AccessData` | has_access, reason (`enrolled`\|`purchase_pending`\|`expired`\|`guest`\|`none`), expiry?, product_id?, order_id? |
| `OrderAccessContext` | order_id, order_status, product_id, product_name, access_type_label?, quiz_meta?, purchased_at? — display only, not enrollment SoT |

**Today:** catalog ViewModel `atmo_build_course_card()` covers **Woo products** only — not LD course archive or enrolled lists.  
**Later:** adapter may delegate to LearnDash APIs now, `atmo-lms-lite` access modules later — UI consumes ViewModels only.

До sign-off **`LMS_ADAPTER_SPEC.md` v0** не начинать глубокий перенос `lesson.html`, `product-enrolled.html`, enrolled course dashboard, или access UI. **Do not touch LearnDash templates.**

## Custom ATMO Plugins

| Plugin | Статус | Важное |
|---|---|---|
| `atmo-reflection-forms` | active | shortcode `[atmo_reflection]`, таблица `wp_atmo_reflection_entries`, CSS/JS грузятся на всех страницах |
| `learndash-training-diary` | active | shortcode `[training_diary]`, таблица `wp_ld_training_diary`, связан с LearnDash |
| `atmo-redesign-preview` | mu-plugin | temporary preview/integration layer |
| `atmo-lms-lite` | active (in development) | candidate future LMS; do not build critical UI on it without explicit decision |

## Code Snippets

Сниппеты живут в таблице **`wp_snippets`** (Code Snippets plugin), **не в VCS**. Read-only audit **2026-05-22** via Local MariaDB — see `CHANGES.md`. **Export/version before adapter implementation or snippet migration.**

**LMS / routing (audit summary):** no **active** snippet controls LearnDash enrollment, `/courses/` route, `/my-account/` dashboard, or enrolled **«Мои курсы»** route. Enrollment SoT = LearnDash + Woo bridge (+ future `atmo-lms-lite` backend), not snippets.

### Snippet registry (Local, 2026-05-22)

| ID | Name | Active | Affects | Notes |
|----|------|--------|---------|-------|
| 1–4 | WP samples (filenames, admin bar, smilies, year) | No | — | Ignore unless activated |
| **5** | **Thank You Redirect** | **No** | Post-checkout | `template_redirect` → broken `atmoredesign.local.local/courses`; **do not re-enable** without safe thank-you spec |
| 7 | Login Log | Yes | Auth | `wp_login` → `uploads/login-log.csv` |
| 8 | Student's Journal | Yes | Content | `[student_review]` shortcode |
| **9** | **Course Info Card** | Yes | **PDP** | `[course_info_card]`; inline styles — theme strips leak in `atmo-product.php` |
| **10** | **Currency** | Yes | **Price HTML** | `woocommerce_get_price_html` → `.custom-main-price` + `.euro-hint`; theme CSS expects markup |
| 11 | Courses Carousel (old) | No | — | Superseded by **#14**; same `[featured_courses]` shortcode name |
| **12** | **Bottom Button** | Yes | **PDP** | `the_content` on product → duplicate add-to-cart in description tab |
| 13 | Google Search | Yes | `wp_head` | Site verification meta |
| **14** | **Courses Carousel NEW** | Yes | **Homepage** | `[featured_courses]` → **Woo product** PDPs, **not** LD `/courses/` |
| **15** | **ATMO Quiz → Order Meta** | Yes | **Cart/checkout/order** | `atmo_*` item meta + `_atmo_quiz`; adapter = **order context**, not enrollment SoT |
| **16** | META hide in E-mail | Yes | Order meta display | Hides `atmo_*` from `woocommerce_order_item_get_formatted_meta_data` |
| **17** | Before&After 33_Pelvic Floor | No (`-1`) | Checklist AJAX | Course-adjacent only if revived; custom DB table |

**Adapter / route decision:** proceed to LMS adapter spec; snippet fixes (**#5** re-enable, PDP migration) are **parallel**, not blockers. Pair order meta (#15, view-order `тип-доступа`) with LD enrollment in adapter — do not conflate.

## Frontend Assets Risks

На типовой странице грузятся Kadence, WooCommerce, LearnDash, `atmo-reflection-forms` и child theme CSS (base, header, footer, page-specific). Preview mu-plugin **не** грузится без `?atmo_preview_shell=1` (opt-in only). LearnDash и reflection forms сейчас добавляют CSS/JS шире, чем нужно.

Основные риски:

| # | Риск | Уровень |
|---|---|---|
| R1 | Зависимость от Kadence parent hooks/CSS | Средний |
| R2 | Code Snippets не в VCS | Высокий |
| R3 | `atmo-reflection-forms` грузит assets без условий | Средний |
| R4 | нестандартный cart URL `/cart-2/` | Средний |
| R5 | checkout empty-cart redirect vs full form — state-dependent (expected Woo); not a global 302 | Низкий |
| R6 | LearnDash -> atmo-lms-lite migration | Средний/высокий |
| R7 | HPOS таблицы есть, но storage отключён | Средний |
| R8 | Preview mu-plugin unversioned (Local-only) | Низкий/средний |

## Architecture Decision

Выбран инкрементальный путь:

1. Child theme от Kadence как UI/theme layer.
2. Preview mu-plugin временно остаётся для сравнения и безопасного shell preview.
3. LMS UI проектируется через adapter/ViewModel, чтобы LearnDash и `atmo-lms-lite` можно было менять без переписывания шаблонов.

Собственная standalone-тема пока не выбрана: она даст максимальный контроль, но потребует заново тестировать WooCommerce/LMS флоу и увеличит риск регресса.

## Выполнено

1. Создан и активирован `ATMO Kadence Child 0.1.0`.
2. Добавлен `assets/css/atmo-base.css` с `--atmo-*` tokens.
3. Подключены Fraunces, DM Sans, Space Mono.
4. ✅ ATMO header заменён: `inc/atmo-header.php` + `assets/css/atmo-header.css` + `assets/js/atmo-header.js`.
   - Рендер через `kadence_before_header` хук (приоритет 5).
   - Sticky nav: brand, 4 ссылки, корзина, burger + drawer.
   - Active state: `is_front_page()`, `is_shop()` / path-check, `sfwd-*`, `is_account_page()`.
   - Cart URL: `wc_get_cart_url()` с fallback `/cart-2/`.
   - Preview mode: `body.atmo-preview-shell-enabled .atmo-site-header { display: none }` — child header скрыт, preview shell остаётся.
5. ✅ ATMO footer заменён: `inc/atmo-footer.php` + `assets/css/atmo-footer.css`.
   - Рендер через `kadence_before_footer` хук (приоритет 5).
   - 4-колоночный grid: бренд + лид, Программы, Кабинет, Студия; правовые ссылки; год `date('Y')`.
   - Kadence `#colophon` скрыт: `body.atmo-footer-active #colophon { display: none !important }`.
   - Preview mode: `body.atmo-preview-shell-enabled .atmo-site-footer { display: none }`.
6. Проверено: основные URL отвечают 200; `/checkout/` with cart items → 200 + checkout form (re-QA 2026-05-22); empty cart may redirect to cart; `/payment-failed/` → 404 by design; preview shell работает; child footer скрыт в preview mode.
7. ✅ Каталог MVP: `woocommerce/content-product.php` + `inc/atmo-catalog.php` + `assets/css/atmo-catalog.css`.
   - ViewModel `atmo_build_course_card()`: id, title, permalink, thumbnail_url, price_html, excerpt, on_sale, categories, `goal_slug`/`goal_label` from `pa_goal`.
   - Карточка `.atmo-product-card` внутри стандартного WC `ul.products li.atmo-card-item`.
   - WC archive infrastructure (pagination, result count, ordering, visibility) не тронута.
   - CSS грузится на shop/category/tag архивах и single product (для related products).
   - Snippet ID 10 учтён: `.custom-main-price`, `.euro-hint`, `del`/`ins` обработаны в CSS.
   - Goal chips + server-side `filter_goal`; `pa_goal` on Local, 18 products assigned (`CHANGES.md` 2026-05-20).
8. ✅ Single product MVP: `woocommerce/content-single-product.php` + `inc/atmo-product.php` + `assets/css/atmo-product.css`.
   - ViewModel `atmo_build_product_page()`: id, title, permalink, thumbnail_url, price_html, is_on_sale, short_description_html, categories; без LD coupling.
   - Hero: 2-col grid (≥920px), изображение с aspect-ratio 4/5 (3/2 на мобайл), buy box с WC add-to-cart формой.
   - WC mechanics: `woocommerce_before_single_product` (notices), `woocommerce_after_single_product_summary` (tabs + upsells + related products), `woocommerce_after_single_product`.
   - Snippet 10 учтён в CSS (`.custom-main-price` Fraunces 44px); Snippet 12 продолжает работать в description tab; Snippet 9 рендерится в short_description_html.
   - Related products используют `.atmo-product-card` из atmo-catalog.css.
   - Re-QA PASS 2026-05-22 — simple, variable #3614 (Woo Variation Swatches), asset scope; optional #3614 polish — `BACKLOG.md`.
   - LearnDash / enrolled / access state не включены.
9. ✅ Woo My Account: `assets/css/atmo-account.css` + `inc/atmo-account.php`.
   - Passes 1–5 + mobile orders actions fix (`fcca2e5`); details in Theme Layer and `CHANGES.md`.
   - Menu IA, hidden endpoints, and caveats documented above.

Rollback для child theme:

```powershell
wp theme activate kadence
```

Rollback для base layer: убрать enqueue `atmo-fonts` и `atmo-base` из child `functions.php`, удалить `assets/css/atmo-base.css`.

Rollback для header: закомментировать `require_once .../inc/atmo-header.php` в `functions.php`, убрать enqueue `atmo-header` CSS/JS — Kadence `#masthead` вернётся автоматически.

Rollback для каталога: удалить `woocommerce/content-product.php`, убрать `require_once .../inc/atmo-catalog.php` и enqueue `atmo-catalog` из `functions.php` — WC вернётся к стандартному шаблону автоматически.

Rollback для single product: удалить `woocommerce/content-single-product.php`, убрать `require_once .../inc/atmo-product.php` и enqueue `atmo-product` из `functions.php` — WC вернётся к стандартному шаблону автоматически.

## Next Steps

**Shell/wiring phase complete (re-QA 2026-05-22).** Open work is product/LMS/payment-scope decisions and optional polish — see `BACKLOG.md`. Do not expand shell CSS without a functional gap.

**Architectural blockers (do not bypass):**

- LMS adapter / ViewModel decision — before real LMS/enrolled widgets on `/my-account/` or `/courses/`
- Do not touch LearnDash templates or build critical UI on `atmo-lms-lite` without explicit decision
- Saved-card / payment-token scope — requires explicit approval before live-QA or UI work
