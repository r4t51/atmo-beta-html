# ATMO.BY — onboarding

Короткий вход в проект редизайна ATMO.BY.

## Где что лежит

| Что | Путь / URL |
|---|---|
| HTML-прототип | `D:\!redesign ATMO_BY\beta html` |
| WordPress Local | `D:\Local Sites\atmo_redesign\app\public` |
| Local URL | `http://atmoredesign.local/` |
| WP architecture map | `WP_DEPENDENCY_MAP.md` |
| Milestone snapshot | `MILESTONE_SHELL_ACCOUNT_LMS.md` |

## Перед работой

1. Читать этот файл.
2. **Milestone (2026-05-22, updated 2026-05-25):** shell + account/LMS MVP complete; prototype coverage pass active — см. `MILESTONE_SHELL_ACCOUNT_LMS.md` (fixtures, closed surfaces, do-not-touch).
3. Читать `WP_DEPENDENCY_MAP.md`, если задача касается WordPress, WooCommerce, LMS, темы, плагинов или интеграции.
4. Работать маленькими обратимыми шагами.
5. Не удалять чужие изменения.
6. Проверять через HTTP, не через `file://`.

## Прототип

Запуск:

```powershell
npx http-server . -p 3333 --cors -c-1
```

Не использовать `npx serve`: он может редиректить clean URLs и срезать query params у `lesson.html?course=...&step=...`.

### Source of truth HTML

| Файл | Назначение |
|---|---|
| `index.html` | Главная / landing |
| `catalog.html` | Каталог программ |
| `product.html` | Страница продажи курса |
| `product-enrolled.html` | Купленный курс |
| `lesson.html` | Урок LMS, режимы через query params |
| `course-complete.html` | Завершение курса |
| `trainer.html` | Страница тренера |
| `cart.html` | Корзина |
| `checkout.html` | Оформление |
| `order-confirmation.html` | Подтверждение заказа |
| `payment-failed.html` | Ошибка оплаты |
| `account.html` | Кабинет, обзор |
| `courses.html` | Мои курсы |
| `orders.html` | Заказы |
| `profile.html` | Профиль |
| `auth.html` | Вход / регистрация |
| `reset-password.html` | Новый пароль |
| `terms.html` | Условия |
| `privacy.html` | Политика |
| `404.html` | 404 |

Черновики не переносить. Если появляются новые варианты, держать их вне корня, например в `drafts/`.

### Общие файлы прототипа

| Файл | Назначение |
|---|---|
| `shared/styles.css` | Дизайн-система прототипа |
| `shared/layout.js` | Общий header/footer и карточки продуктов |
| `shared/data.js` | Временные данные: продукты, цели, цены |
| `parts/*.jsx` | Компоненты лендинга |
| `tweaks-panel.jsx` | Внутренняя панель настроек лендинга |

## Дизайн-система

Главные цвета и шрифты:

| Token | Значение / роль |
|---|---|
| `--primary` | `#20bec4`, брендовый teal, CTA |
| `--secondary` | `#7377e3`, violet |
| `--lime` | `#a3c44a`, energy |
| `--rose` | `#e04f6b`, recovery |
| `--warm-accent` | `#cdb38a`, mobility |
| `--steel` | `#7a8496`, neutral |
| `--bg` | `#f4f5f6` |
| `--bg-warm` | `#eaebec` |
| `--ink` | основной текст |

Шрифты:

- Fraunces — заголовки.
- DM Sans — основной текст.
- Space Mono — метки, бейджи, числа.

Старые имена шрифтов (`Instrument Serif`, `Inter Tight`, `JetBrains Mono`) не использовать.

## Данные прототипа

`shared/data.js` содержит:

- `ATMO.PRODUCTS` — временный каталог программ.
- `ATMO.GOALS` — цели и цвета.
- `ATMO.formatPrice()`.
- `ATMO.pillClass()`.
- `ATMO.goalIcon()`.

На рабочем WordPress эти данные должны прийти из WooCommerce/LMS/CMS. Не копировать массивы `shared/data.js` как финальный backend.

## LMS posture

Сейчас рабочий сайт использует LearnDash для course/lesson UI. `atmo-lms-lite` **active** on Local as **future replacement**, still in development — **bridge decision (2026-05-24):** defer runtime integration; Local enrollment/access tables empty; no theme-facing front-end API/UI; stay LearnDash-backed ViewModels until stable read API + cutover.

**`/courses/` vs «Мои курсы» (2026-05-22):**

- Live **`/courses/`** = LearnDash **public archive** (18 courses, no enrolled filter, no progress UI).
- **«Программы»** → `/courses/` in **header + footer only** (not account sidebar since `ecfd8f5`).
- **`/my-account/my-courses/`** = real Woo endpoint **`my-courses`** — **adapter MVP live** (`get_enrolled_courses()` enrolled list) — **`a352081`** · shell **`ecfd8f5`** · `CHANGES.md`.
- `atmo-account.css` does **not** load on `/courses/`.

Правило: не строить финальные course/lesson шаблоны на LearnDash HTML. Course/lesson UI должен идти через adapter/ViewModel слой:

- `CourseCard`
- `EnrollmentState`
- `EnrolledCourse`
- `LessonProgress` / `LessonData`
- `AccessData`

Adapter interface signed off 2026-05-22. **Enrolled list MVP shipped `a352081`**; **dashboard CTA wiring shipped `648e562`**; **account hub v1 shipped `81c3a7d`**; **lesson chrome v1/v2 shipped `ed7afcf` / `1e08a3d`**; stabilization shipped `897409c`; **lesson H1 number prefix shipped `caaaa96`**. **Variable PDP bottom CTA deferred 2026-05-24** — not mandatory. Open: explicit `atmo-lms-lite` API/cutover contract when product-ready — `BACKLOG.md` §2.

## WordPress Local

| Параметр | Значение |
|---|---|
| Активная тема | ATMO Kadence Child 0.1.0 |
| Parent theme | Kadence 1.4.5 |
| Child theme | `wp-content/themes/kadence-child/` |
| Base CSS | `wp-content/themes/kadence-child/assets/css/atmo-base.css` |
| Preview mu-plugin | `wp-content/mu-plugins/atmo-redesign-preview.php` (Local-only, **not in git**) |
| Preview CSS | `wp-content/mu-plugins/atmo-redesign/assets/css/atmo-preview.css` (Local-only, **not in git**) |
| Cart URL | `/cart-2/` |

Preview shell включается только через:

```text
?atmo_preview_shell=1
```

Обычный сайт без query param — ATMO child header/footer; Kadence #masthead/#colophon остаются в DOM, но скрыты CSS.

В preview-режиме Kadence chrome скрывается CSS из mu-plugin; ATMO child header скрывается CSS из child theme:

```css
/* в atmo-header.css: */
body.atmo-header-active #masthead { display: none !important; }
body.atmo-preview-shell-enabled .atmo-site-header,
body.atmo-preview-shell-enabled .atmo-nav-drawer { display: none !important; }
```

## Что уже сделано в WP

- Создана и активирована `ATMO Kadence Child 0.1.0`.
- Добавлен `assets/css/atmo-base.css` с безопасными `--atmo-*` design tokens.
- Google Fonts подключены в child theme.
- ✅ Header перенесён: `inc/atmo-header.php` (хук `kadence_before_header`), `assets/css/atmo-header.css`, `assets/js/atmo-header.js`.
  - Sticky nav: brand, 4 ссылки (Главная / Каталог / Программы / Кабинет), корзина `/cart-2/`, burger + drawer.
  - Active state: `is_front_page()`, `is_shop()`, `sfwd-*`, `is_account_page()`.
  - Drawer: overlay + Escape + ✕ закрывают.
- ✅ Footer перенесён: `inc/atmo-footer.php` (хук `kadence_before_footer`), `assets/css/atmo-footer.css`.
  - 4-колоночный grid: бренд + лид, Программы, Кабинет, Студия.
  - Правовые ссылки: `/terms/`, `/privacy/`. Год динамический через `date('Y')`.
  - Kadence `#colophon` скрыт CSS: `body.atmo-footer-active #colophon { display: none !important }`.
  - В preview-режиме child footer скрыт CSS: `body.atmo-preview-shell-enabled .atmo-site-footer { display: none !important }`.
- Preview mu-plugin: **keep for now** as low-risk legacy comparison tool (`?atmo_preview_shell=1` only); remove later per `BACKLOG.md` / `CHANGES.md`.
- ✅ Главная v1 — `front-page.php` + `assets/css/atmo-home.css`.
  - Hero, featured product, paths shipped (`075179f`); CSS compliance cleanup (`214f6b6`).
  - Section 04 Social/testimonials deferred — no hardcoded testimonials until CMS/product source exists.
- ✅ Каталог — MVP карточки: `woocommerce/content-product.php` override + `inc/atmo-catalog.php` + `assets/css/atmo-catalog.css`.
  - `atmo_build_course_card()` ViewModel: id, title (`_atmo_display_title` → Woo name fallback, **`4993bd9`**), permalink, thumbnail, price_html, excerpt, on_sale, categories, `goal_slug`/`goal_label` from `pa_goal`.
  - Карточки `.atmo-product-card` внутри стандартной WC-разметки `ul.products li.product`.
  - CSS грузится на `is_shop()` / `is_product_category()` / `is_product_tag()` / `is_product()` (для related products на single product).
  - Snippet ID 10 (`.custom-main-price` + `.euro-hint`) учтён в CSS.
  - Goal chips + server-side `filter_goal` on shop/category/tag archives (`pa_goal` on Local; 18 redesign products assigned). Taxonomy-aware chip URLs **`7b163be`** 2026-05-24 — chips stay on current archive base. Details: `CHANGES.md` → `2026-05-20 — pa_goal + goal chips`, `Server-side goal filter`, `2026-05-24 — Catalog taxonomy-aware goal chip URLs`.
- ✅ Страница продукта — MVP: `woocommerce/content-single-product.php` override + `inc/atmo-product.php` + `assets/css/atmo-product.css`.
  - `atmo_build_product_page()` ViewModel: id, title (`_atmo_display_title` fallback), permalink, thumbnail_url, price_html, is_on_sale, short_description_html, categories.
  - Hero: 2-колоночный grid (изображение + сводка), `h1.atmo-pdp-title`, `.atmo-pdp-desc`, buy box с ценой и WC add-to-cart формой.
  - Сохранены WC mechanics: notices (`woocommerce_before_single_product`), add-to-cart форма, tabs, upsells, related products.
  - Snippet 10 (price wrapping) учтён в CSS через `.custom-main-price` + `.euro-hint`.
  - Snippet 12 (bottom CTA) продолжает работать в description tab через `the_content` filter — **simple in-stock PDP only**; variable PDP skip intentional (2026-05-23 mitigation, **deferred by design 2026-05-24**).
  - Snippet 9 (`[course_info_card]`) рендерится в `.atmo-pdp-desc` через `apply_filters('woocommerce_short_description', ...)`.
  - Snippet 12 duplicate add-to-cart in description-tab CTA — by design on **simple** PDP (hero + bottom form). **Do not** add a second variable `form.variations_form` — use scroll/sticky CTA to hero if product requests it later.
  - Variable access-tier (#3614 `abdomen_pelvic`): Woo Variation Swatches for **тип-доступа**; hero price sync **`4132f1f`**; re-QA PASS 2026-05-22 / 2026-05-24 — see `CHANGES.md`; bottom CTA deferred — `BACKLOG.md` §5.
  - LearnDash / enrolled / access state НЕ включены.
  - CSS: `atmo-product.css` on `is_product()`; `atmo-catalog.css` on PDP for related cards only.
- ✅ Корзина — shell: `assets/css/atmo-cart.css` (+ `atmo-catalog.css` для cross-sells); re-QA PASS 2026-05-22 — `CHANGES.md`.
- ✅ Checkout — shell: `assets/css/atmo-checkout.css` + progress steps `1203858` (`inc/atmo-checkout.php`); cart-fixture QA PASS 2026-05-22 — BLIK/Klarna visible, payment UI not hidden; steps QA PASS 2026-05-25 — `CHANGES.md`.
- ✅ Order received — `inc/atmo-confirmation.php` + `assets/css/atmo-confirmation.css` (`f9a7b95`).
  - Renders ATMO layer only for valid key + `completed` order when Woo full order flow is available.
  - Course card CTA targets account hub (`/my-account/my-courses/?course_id=...`), not direct `/lessons/`.
  - Owner browser QA PASS for #3801 at 1440×900 and 390×844 (2026-05-25).
  - **`/payment-failed/`** → static page **#3807** + `page-payment-failed.php` + `atmo-payment-failed.css` (`c9ac2b1`, 2026-05-24).
- ✅ Woo My Account — passes 1–5 + mobile orders fix: `assets/css/atmo-account.css`, `inc/atmo-account.php` (menu filter in `functions.php`).
  - CSS только на `is_account_page()`; `/courses/`, `/profile/`, `/reset-password/` (LearnDash) **не** enqueued.
  - **Меню (5 пунктов):** Обзор → `dashboard` · **Мои курсы** → **`my-courses`** (real Woo endpoint) · Заказы → `orders` · Настройки → `edit-account` · Выйти → `customer-logout` — **`ecfd8f5`**
  - **«Программы»** → `/courses/` in header/footer only (removed from account sidebar in `ecfd8f5`)
  - **Скрыты из меню, доступны по прямому URL:** `/my-account/downloads/`, `/my-account/edit-address/` (+ `billing`/`shipping`), `/my-account/payment-methods/`
  - **Адреса (`edit-address`):** index cards показывают сохранённый meta; billing edit subset — **Checkout Field Editor** `wc_fields_billing` + Woo phone hidden (**config decision 2026-05-24**, not child-theme bug) — do not add theme billing field filters unless explicitly scoped
  - Commits: `353346c` auth · `3122f4f` shell · `d4ee689` menu · `3704226` orders · `d1748dc` settings · `3135ddb` hidden endpoints · `fcca2e5` mobile orders actions · `534b241` dashboard shell · `2da518f` view-order access-type meta · **`ecfd8f5` my-courses endpoint shell** · **`a352081` LMS adapter MVP** · **`648e562` dashboard CTA wiring** · **`81c3a7d` account hub v1** · **`dc1e2be` dashboard dev pill removal** · **`ed7afcf` lesson chrome v1** · **`1e08a3d` lesson chrome v2** · **`897409c` lesson hardening** · **`caaaa96` lesson H1 number prefix**
  - **`/my-account/my-courses/` (`a352081`):** adapter-backed enrolled list; empty state when `[]`; fixture #3801 QA PASS — `CHANGES.md`
  - **`/my-account/my-courses/?course_id={id}` (`81c3a7d`):** account hub v1 — enrolled overview + lesson outline; denial when no access — `CHANGES.md`
  - **Local QA fixtures:** **r4t5 / #3801** = enrolled path · **691 / `atmo-qa-empty`** = zero-enrollment path — empty-state QA PASS 2026-05-22 — `CHANGES.md`
  - **`/my-account/my-courses/` shell (`ecfd8f5`):** endpoint + menu IA; one-time permalink flush on deploy
  - **Dashboard (`534b241` + `648e562`):** «Следующий шаг» + courses panel wired to adapter / **`/my-account/my-courses/`**; no dashboard list/progress — `CHANGES.md`
  - **Account status:** shell/wiring done; my-courses adapter MVP live (`a352081`); dashboard CTAs wired (`648e562`); account hub v1 live (`81c3a7d`); **account fixture polish closed 2026-05-24** — no mandatory account theme work; dashboard dev pill removed (`dc1e2be`); enrolled + zero-enrollment empty-state QA done; #3801 view-order QA; access-type meta pill (`2da518f`); downloads/payment-methods empty states sufficient (no fixtures); lesson chrome v1/v2 live (`ed7afcf`, `1e08a3d`) with hardening (`897409c`) and **lesson H1 prefix live (`caaaa96`)** — `/lessons/` pages styled with ATMO card/nav/button chrome via CSS + filters; Kadence entry H1 shows **`Урок N · {title}`** when outline order resolvable (logged-in only)
  - **Caveats:** не редиректить Woo endpoints без аудита; `/my-account/add-payment-method/` audited 2026-05-22 (read-only PASS; Stripe card/BLIK absent on Local — env, not theme); Woo default dashboard copy hidden by CSS when `.atmo-dash` present
  - **Open tasks:** `BACKLOG.md`
  - Rollback: см. `CHANGES.md` по commit; menu PHP: `git revert d4ee689`
- ✅ LearnDash lesson chrome v1/v2 + H1 prefix — `inc/atmo-lesson.php` · `assets/css/atmo-lesson.css` · **`ed7afcf`**, **`1e08a3d`**, hardening **`897409c`**, prefix **`caaaa96`**
  - CSS scoped to `body.single-sfwd-lessons`: content card, nav row, mark-complete violet pill, back link.
  - Filter `learndash_template_progression_step_back_to_course_url` → account hub.
  - Filter `the_title` → **`Урок N · {title}`** on Kadence entry H1 only (hub outline order; logged-in only).
  - No LD template overrides; `kadence-child/learndash/` not created.
  - Rollback: `git revert caaaa96`, `git revert 897409c`, `git revert 1e08a3d`, `git revert ed7afcf` in reverse order — no DB or flush required.

Google Fonts и preview CSS грузятся только при `?atmo_preview_shell=1`. На обычных страницах дубля нет.

Rollback header: закомментировать `require_once .../inc/atmo-header.php` и убрать enqueue `atmo-header` из `functions.php`.

Rollback footer: закомментировать `require_once .../inc/atmo-footer.php` и убрать enqueue `atmo-footer` из `functions.php`. Kadence `#colophon` вернётся автоматически.

Rollback каталога: удалить или переименовать `woocommerce/content-product.php`, убрать `require_once .../inc/atmo-catalog.php` и enqueue `atmo-catalog` из `functions.php`. WC вернётся к стандартному шаблону автоматически.

Rollback страницы продукта: удалить или переименовать `woocommerce/content-single-product.php`, убрать `require_once .../inc/atmo-product.php` и enqueue `atmo-product` из `functions.php`. WC вернётся к стандартному шаблону автоматически.

Rollback Woo My Account: см. `CHANGES.md` — per-commit `git revert` для `atmo-account.css`; menu IA: `git revert d4ee689`.

## Следующий безопасный шаг

**Shell/wiring phase complete (2026-05-22):** header, footer, catalog, PDP, cart, checkout, account — re-QA PASS; preview mu-plugin keep-for-now decision documented. Prototype coverage pass is now active; use `BACKLOG.md` §0 for next work.

**Pick next work from `BACKLOG.md` by scope:**

1. **Prototype coverage** — static `/trainer/` + `/terms/` + `/privacy/`, WP 404, course hub/lesson visual polish.
2. **Optional polish / product-scoped** — full PDP hero redesign (cosmetic), homepage Social testimonials when CMS/source exists.
3. **LMS / product (later)** — explicit `atmo-lms-lite` API/cutover contract when product-ready (`atmo-lms-lite` bridge decision: defer runtime integration — see `CHANGES.md` 2026-05-24).
4. **Avoid unless explicit** — payment tokens, saved cards, test orders, address save flows; downloads/shipping UI until real fixtures exist.
5. **Closed no-op items** — account fixture polish, variable PDP bottom CTA, billing edit field subset; do not revive without product scope.

**Do not bypass without explicit scope:**

- LearnDash **lesson** template overrides
- Critical UI on `atmo-lms-lite` without explicit decision
- Saved-card / payment-token scope — requires explicit approval before live-QA or UI work

## Голос

Аудитория 35-55 лет. На сайте использовать уважительное «вы». Ты-формы в интерфейсных текстах считаются багом.
