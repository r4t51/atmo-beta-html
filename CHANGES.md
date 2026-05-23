# ATMO.BY — ручной журнал изменений

> Git в `kadence-child`: repo active (baseline `d61ca38`). Этот файл — source of truth для **DB** + cross-repo rollback notes.  
> Child theme path: `D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child`  
> **Open tasks:** `BACKLOG.md` (active backlog; older entries here may be superseded)

---

## 2026-05-23 — LMS account course hub v1

- **Scope:** docs-only record; child theme commit below; **no** rewrite endpoint, permalink flush, LearnDash template overrides, or `atmo-lms-lite` front-end UI
- **Commit:** `81c3a7d` — Add account course hub for enrolled LMS courses (`kadence-child`)
- **Files:** `inc/atmo-account.php` · `assets/css/atmo-account.css`
- **Route:** existing Woo endpoint **`/my-account/my-courses/`** + query arg **`?course_id={LD course id}`** — fixture hub `/my-account/my-courses/?course_id=3616`
- **Behavior:** enrolled list **`course_hub_url`** → account hub; **`permalink`** stays public LD course URL; **«Продолжить»** → next LearnDash lesson URL; hub renders from adapter ViewModel + read-only LD lesson list API (no scraped LD HTML, no `.learndash-wrapper` on hub)
- **Not shipped:** new rewrite endpoint · LD single course/lesson template overrides · lesson body port
- **QA `r4t5` / 679** (desktop **1440×900** + mobile **390×844**): `/my-account/my-courses/` — **1** enrolled card; title + **К программе** → `?course_id=3616`; **Продолжить** → `/lessons/план-программы/`; hub `.atmo-course-hub` with title/status/access meta, honest null progress (no fake **0%**), **13** lesson outline links, no mark-complete controls, no overflow
- **QA `atmo-qa-empty` / 691:** `?course_id=3616` → **Программа недоступна**; no `.learndash-wrapper`; no overflow desktop/mobile
- **Public regression** `/courses/abdominal_pelvicfloormuscles/` (logged-out): no `.atmo-course-hub`; ATMO header/footer + LearnDash wrapper present
- **Rollback:** `git revert 81c3a7d` in `kadence-child` — **no permalink flush**
- **Still open:** lesson port / LD lesson chrome — `BACKLOG.md` §2 · `LMS_ADAPTER_SPEC.md`
- **Docs:** `LMS_ADAPTER_SPEC.md` · `MILESTONE_SHELL_ACCOUNT_LMS.md` · `BACKLOG.md` · `WP_DEPENDENCY_MAP.md`

---

## 2026-05-23 — LearnDash public course URL hygiene (runtime/content)

- **Scope:** runtime/content only via WP Admin; **no** child theme, snippets, plugin settings, or repo code changes; **no** commit in this step
- **Issue:** LearnDash Closed course **`URL кнопки`** (`custom_button_url`) stored `http://atmoredesign.local.local/product/...`; one inline body link on **Level Up: Нейросила** had the same host typo
- **Fix:** per-course LearnDash settings — replace host `atmoredesign.local.local` → `atmoredesign.local`; preserve product paths; one Gutenberg paragraph link `«Level Up: Твоя Сила»` on `/courses/levelup_neuropower/` → `/product/levelup_your_strenght/`
- **QA (logged-out, plain fetch — no cache-bust):** `/courses/` archive → **18** unique course pages (+ `/courses/feed/` RSS excluded); **0** pages with `atmoredesign.local.local`; **0** `#btn-join` hrefs with `local.local`; `/courses/levelup_neuropower/` inline link OK · `#btn-join` → `/product/levelup_neuropower/` · **join/product links not clicked**
- **Residual:** Snippet **#5** Thank You Redirect (inactive) still contains broken `atmoredesign.local.local/courses` in snippet source — out of scope; do not re-enable without safe thank-you spec
- **Docs:** `BACKLOG.md` · `MILESTONE_SHELL_ACCOUNT_LMS.md` · `WP_DEPENDENCY_MAP.md`

---

## 2026-05-23 — Catalog + PDP public polish milestone

- **Scope:** docs-only record; child theme commits below; catalog content + Snippet 12 runtime via WP Admin/DB (not VCS)
- **Catalog code:** `6f4790b` — archive toolbar polish, goal labels on cards, hide result count + grid/list toggle
- **Catalog content (WP Admin):** `pa_goal energy` **Энергиѯ→Энергия**; **Интенсив. Осанка, Шея, Лицо** — removed Misc, assigned **Тренировки**; **ФИТНЕС СЕЗОН 3** — marketing short description
- **PDP code:** `4132f1f` hero price sync · `106250d` Woo tabs ATMO styling
- **Snippet 12:** variable PDP skip (runtime) + docs `ece38f6` — see entry below
- **QA catalog** `/каталог/` (1440×900 / 390×844): 16 cards · no **Энергиѯ** / **Misc** · marketing excerpt visible · sort + pagination visible · no overflow · **Add to cart/checkout/payment not clicked**
- **QA PDP** `/product/abdomen_pelvic/`: one variation form · no `.app-bottom-checkout` · hero price sync + styled Woo tabs · `/product/testmyself/` keeps bottom CTA · **Add to cart not clicked**

---

## 2026-05-23 — Snippet 12 variable PDP mitigation (docs record)

- **Scope:** docs-only record; runtime change was made via WP Admin / Code Snippets; **no** child theme edits; **no** commit in this step
- **Change:** Snippet 12 **Bottom Button** now skips variable products (`$product->is_type( 'variable' )` early return)
- **Reason:** prevent duplicate independent variation forms and stale bottom price on variable PDP
- **QA variable PDP** `/product/abdomen_pelvic/` (desktop **1440×900**, mobile **390×844**): `.app-bottom-checkout` absent · one `form.variations_form` · hero price sync **399zł – 799zł** → **60 дней** `399zł (~ 94 €)` → **Бессрочно** `799zł (~ 188 €)` → reset restores range · no horizontal overflow · **Add to cart not clicked**
- **QA simple PDP** `/product/testmyself/`: bottom CTA remains · price **18zł (~ 4 €)** · **Add to cart not clicked**
- **Docs:** `docs/snippets/snippet-12-bottom-button.md` · `WP_DEPENDENCY_MAP.md`

---

## 2026-05-22 — CookieYes RU banner + preference panel QA

- **Scope:** docs-only record; CookieYes plugin/runtime settings only; **no** child theme, repo code, WP Admin manual DB edits, or git commit for the runtime change
- **Source:** CookieYes | GDPR Cookie Consent (`cookie-law-info`); default language **`ru`**; copy from plugin settings + `wp-content/uploads/cookieyes/languages/banners/ru.json`
- **Storage (runtime, not VCS):** `wp_options` (`cky_settings`, `cky_banner_template`) · `wp_cky_banners` · `wp_cky_cookie_categories` · uploads `cookieyes/languages/banners/ru.json`
- **Visible RU:** notice bar (title, body, **Настроить** / **Отклонить все** / **Принять все**) · revisit **Настройки cookie** · preference panel after **Настроить** (title, body, category names/descriptions, buttons, toggles, audit empty state)
- **QA pages:** `/` · `/каталог/` · `/my-account/`
- **Viewports:** desktop **1440×900** + mobile **390×844**
- **Result:** **PASS (6/6)** — RU notice bar · RU preference panel after **Настроить** · **0** English CookieYes strings detected · no horizontal overflow · **Accept / Reject / Save not clicked**
- **Git/code impact:** child theme unchanged · runtime/plugin settings only · no code commit for the CookieYes change
- **Docs:** `WP_DEPENDENCY_MAP.md`

---

## 2026-05-22 — Cart + checkout with cart fixture QA (follow-up)

- **Scope:** read-only browser QA; no code/DB/snippets/Woo/Stripe settings changes; no checkout submit; **`#place_order` not clicked**; no order created
- **Cart fixture (session only):** started empty · added **1×** «Живот и Тазовое дно - 60 дней» (variation **3628**, parent **3614**) · **399zł**
- **Add method:** direct URL `?add-to-cart=3628&quantity=1` — automation click on «60 дней» + «В корзину» did not persist `variation_id` (hidden `<select>` / WC variations form)
- **Pages:** `/cart-2/` · `/checkout/` · sanity `/payment-failed/` · `/checkout/order-received/999/`
- **Viewports:** desktop **1440×900** + mobile **390×844**
- **Result:** **PASS** — cart + checkout visibility; no horizontal overflow/clipping
- **`/cart-2/`:** item row · access label in title · subtotal/total · **«Оформить заказ»** → `/checkout/` · cross-sells visible · no overflow
- **`/checkout/`:** `form.checkout` · billing fields · order review item/total · `#payment` · `.wc_payment_methods` · `#place_order` visible; theme does **not** hide payment UI (computed styles `display:block`, `visibility:visible`)
- **Gateways (Local):** **BLIK** visible + default (`stripe_blik`) · **Klarna** visible (`stripe_klarna`) · **Stripe card not present** (env/config, not theme CSS)
- **`/payment-failed/`:** **404** by design
- **`/checkout/order-received/999/`:** **200** generic Woo thank-you only — partial sanity; no order details for fake `#999`
- **No CSS/PHP follow-up** for cart/checkout/payment visibility
- **Session cleanup:** fixture item may still be in browser cart — remove via cart UI or clear session cookies (optional)
- **Docs:** `BACKLOG.md` · `WP_DEPENDENCY_MAP.md`

---

## 2026-05-22 — Account LMS copy polish

- **Scope:** child theme only — `inc/atmo-account.php`; customer-facing copy only; no CSS, adapter logic, routes, DB, snippets, or settings
- **Commit:** `4e180b9` — fix(account): replace backend LMS copy with customer-facing Russian text (`kadence-child`)
- **Changed:**
  - removed **LearnDash** from user-visible copy on dashboard «Курсы» panel and `/my-account/my-courses/` empty state (+ enrolled lead line)
  - removed raw endpoint paths (`/my-account/my-courses/`, `/courses/`) from dashboard panel note
  - CTAs unchanged: **Мои курсы** → `/my-account/my-courses/` · **Программы** → `/courses/` · empty state **К программам** / **Каталог**
- **QA (Local, user atmo-qa-empty, 5/5 PASS):**
  - **`/my-account/`** desktop **1440×900** + mobile **390×844** — new panel note · CTAs correct · no stale copy · no overflow
  - **`/my-account/my-courses/`** desktop + mobile — new empty-state copy · CTAs correct · **0** cards · no overflow
  - **`/my-account/my-courses/`** logged out — login gate only; no `.atmo-my-courses` shell leak
- **Not live-QA:** r4t5 enrolled path — no Local password available; adapter/dashboard logic unchanged; prior r4t5 QA (`648e562`, `a352081`) still valid
- **Rollback:** `git revert 4e180b9` in `kadence-child` — **no permalink flush**
- **Docs:** `BACKLOG.md`

---

## 2026-05-22 — Zero-enrollment QA fixture + empty-state QA

- **Scope:** Local-only WP user fixture + read-only browser QA; no child theme, docs-only record here; no orders/enrollments created
- **Fixture user:** **`atmo-qa-empty`** (ID **691**) · `atmo-qa-empty@local.test` · display **ATMO QA Empty** · role **customer** · Local-only
- **Verification (MariaDB read-only):** **0** Woo orders · **0** completed orders · **0** LD enrollment meta (`course_*_access_from`, `learndash_course_*_enrolled_at`) · **0** `_sfwd-course_progress`
- **Pairing:** **r4t5 / #3801** = enrolled path fixture · **691 / atmo-qa-empty** = zero-enrollment path fixture
- **QA (Local, user atmo-qa-empty, 6/6 PASS):**
  - **`/my-account/`** desktop **1440×900** + mobile **390×844** — empty dashboard copy **«Выберите программу или откройте доступ»** · primary **«Мои курсы»** → `/my-account/my-courses/` · secondary **«Каталог»** · «Последний заказ» placeholder · no cards/progress · no overflow
  - **`/my-account/my-courses/`** desktop + mobile — empty state **«Пока нет программ с доступом»** · CTAs **«К программам»** → `/courses/` · **«Каталог»** · **0** cards · **0** progress · no overflow
  - **`/courses/`** desktop + mobile — public LD archive unchanged (**18** programs) · no overflow
- **Rollback:** delete user **691** via WP Admin or SQL (`wp_usermeta` + `wp_users`); no orders/enrollments to clean; temp QA password Local-only — rotate/delete with user
- **Still open:** post-MVP lesson/course hub port; pending-order rows; `atmo-lms-lite` decision — `BACKLOG.md` §2
- **Docs:** `BACKLOG.md` · `LMS_ADAPTER_SPEC.md` §11.0c · `ONBOARDING.md`

---

## 2026-05-22 — Account dashboard CTA wiring for my-courses (phase 3)

- **Scope:** child theme only — `inc/atmo-account.php`; read-only adapter reuse; no DB, snippets, settings, CSS, LD template overrides, or `atmo-lms-lite`
- **Commit:** `648e562` — Update account dashboard CTAs for my-courses (`kadence-child`)
- **Implemented:**
  - removed stale dashboard LMS-future copy («после подключения LMS», «будущий экран»)
  - **«Следующий шаг»** card wired via existing `atmo_get_enrolled_courses()` + `atmo_get_dashboard_continue_course()` — no dashboard course list, no progress bars
  - when active course has safe **«Продолжить»** CTA (`next_lesson` + `cta_url`): primary → real LD lesson URL; secondary → **`/my-account/my-courses/`**
  - when enrolled without continue lesson: primary → **`/my-account/my-courses/`**; secondary → catalog
  - when no enrollments: primary → **`/my-account/my-courses/`**; secondary → catalog
  - **«Курсы»** panel clarifies **Мои курсы** = personal access list **`/my-account/my-courses/`** vs **Программы** = public LD archive **`/courses/`**; dual CTAs added
  - **`/my-account/my-courses/`** adapter page unchanged
- **QA (Local, user r4t5, fixture #3801):**
  - **`/my-account/`** desktop **1440×900** + mobile **390×844** **PASS** — «Продолжите программу» · primary **Продолжить** → LD lesson · secondary **Мои курсы** → `/my-account/my-courses/` · courses panel CTAs correct · no stale copy · no dashboard list/progress · `.atmo-dash` only · no overflow
  - **`/my-account/my-courses/`** desktop + mobile **PASS** — unchanged: one card, no fake progress
  - **`/courses/`** desktop + mobile **PASS** — public LD archive unchanged
- **Caveats:** dashboard calls `atmo_get_enrolled_courses()` on every `/my-account/` load; multi-course users — hero picks first active course with safe continue CTA (adapter sort); zero-enrollment path QA — see zero-enrollment fixture entry same date
- **Rollback:** `git revert 648e562` in `kadence-child` — **no permalink flush** (endpoint `ecfd8f5` + adapter `a352081` remain)
- **Still open:** post-MVP lesson/course hub port; pending-order rows; `atmo-lms-lite` decision — `BACKLOG.md` §2
- **Docs:** `BACKLOG.md` · `LMS_ADAPTER_SPEC.md` §11 commit C · `WP_DEPENDENCY_MAP.md` · `ONBOARDING.md`

---

## 2026-05-22 — Account regression QA after LMS adapter MVP

- **Scope:** read-only QA; no code/DB/snippets/settings changes; repos clean before/after (`beta html`, `kadence-child`)
- **Baseline:** child commit **`a352081`** (adapter MVP)
- **User/fixture:** r4t5 · completed order **#3801** (variation 3628 → LD course 3616, 60 days)
- **Viewports:** desktop **1440×900** + mobile **390×844**
- **Pages:** `/my-account/` · `/my-account/my-courses/` · `/my-account/orders/` · `/my-account/view-order/3801/` · `/my-account/edit-account/` · `/my-account/edit-address/` · `/my-account/payment-methods/` · `/courses/`
- **Result:** **PASS** — no functional regressions or blockers
- **`/my-account/my-courses/`:** one card **«Живот и Тазовое дно»** · **Доступ активен** · **60 дней** · **2 мая 2026 → 1 июля 2026** · **Продолжить** → real LD lesson URL · **К программе** → LD course URL · no progress bar / no 0% · no order/payment links in card
- **`/view-order/3801/`:** access-type pill **«Тип доступа: 60 дней»** still visible; order-again visible (not clicked); no `.atmo-my-courses` leak
- **`/courses/`:** public LearnDash archive; no account shell
- **Scope checks:** `.atmo-dash` only on dashboard · `.atmo-my-courses` only on my-courses · 5-item nav on account pages · no horizontal overflow
- **Known optional (not blockers):** dashboard stale copy/CTA still references LMS future and links to `/courses/` — phase 3 optional; hidden endpoints (`edit-address`, `payment-methods`) nav active state unchanged/pre-existing
- **CSS/PHP follow-up:** none for regression
- **Docs:** `BACKLOG.md` · `LMS_ADAPTER_SPEC.md` §11

---

## 2026-05-22 — LMS adapter MVP for account `my-courses` (phase 2)

- **Scope:** child theme only — `inc/atmo-account.php`, `assets/css/atmo-account.css`; read-only Woo + LearnDash; no DB, snippets, settings, LD template overrides, or `atmo-lms-lite`
- **Commit:** `a352081` — Add LMS adapter MVP for account my-courses (`kadence-child`)
- **Implemented:**
  - read-only adapter MVP at **`/my-account/my-courses/`** — `atmo_get_enrolled_courses()` + enrolled list UI (`.atmo-my-courses__list`)
  - completed Woo orders → line items → **`_related_course`** (variation first, else product) → LD enrollment meta gate
  - access type label: order item meta **`тип-доступа`** via `atmo_get_order_item_access_meta()` → fallback variation attribute / post meta
  - **explicit lifetime vs unknown:** «Бессрочно» only when label says so; empty/unknown → no «Срок: Бессрочно»; unknown does not beat finite in multi-order merge
  - **`starts_at`:** `course_{id}_access_from` → `learndash_course_{id}_enrolled_at` → order completed date
  - **`expires_at`:** `starts_at + access_duration_days` when finite; lifetime → null
  - progress hidden unless real activity (`completed > 0`, LD status completed, or `learndash_course_completed()`) — **no fake 0%**
  - **`next_lesson` / «Продолжить»** only when LD returns safe incomplete lesson URL; else hub CTA when active
  - empty state unchanged when adapter returns `[]`
- **QA (Local, user r4t5, fixture #3801):** one course **«Живот и Тазовое дно»** — status **Доступ активен** · access **60 дней** · **2 мая 2026 → 1 июля 2026** · no progress bar / no 0% · **Продолжить** + **К программе** visible · desktop **1440×900** + mobile **390×844** PASS · no overflow · 5-item nav · no `.atmo-dash`
- **Not done:** dashboard «Следующий шаг» wiring (phase 3 optional); full lesson/course hub port; `atmo-lms-lite`; LearnDash template overrides; pending-order rows; empty-state live QA with another zero-enrollment user
- **Rollback:** `git revert a352081` in `kadence-child` — **no permalink flush** (endpoint shell `ecfd8f5` remains)
- **Next optional:** dashboard wiring to **`/my-account/my-courses/`** + adapter `next_lesson` — `LMS_ADAPTER_SPEC.md` §11 commit C
- **Docs:** `BACKLOG.md` §2 · `LMS_ADAPTER_SPEC.md` §11 · `WP_DEPENDENCY_MAP.md` · `ONBOARDING.md`

---

## 2026-05-22 — Woo `my-courses` endpoint shell (phase 1)

- **Scope:** child theme only — `inc/atmo-account.php`, `assets/css/atmo-account.css`; no adapter, LD API, lite, DB, snippets, or PHP flush
- **Commit:** `ecfd8f5` — Add Woo my-courses account endpoint shell (`kadence-child`)
- **Implemented:**
  - real Woo account endpoint **`my-courses`** → `/my-account/my-courses/`
  - account nav: **Обзор · Мои курсы · Заказы · Настройки · Выйти**
  - removed fake **`atmo-courses`** slug + `woocommerce_get_endpoint_url` override from account sidebar
  - header/footer **«Программы»** → `/courses/` unchanged
  - static empty shell **`.atmo-my-courses`** — honest copy + CTAs to `/courses/` and `/каталог/`; no fake progress or enrolled cards
- **Permalink flush:** one-time manual flush performed on Local for QA (WP Admin → Settings → Permalinks → Save); **required on other environments** before endpoint QA; **no** `flush_rewrite_rules()` in theme PHP
- **QA (Local, user r4t5, post-flush):** `/my-account/my-courses/` desktop + mobile PASS — loads, 5-item nav, **«Мои курсы»** active, shell visible, no `.atmo-dash`, no LD cards/progress
- **Regression PASS:** `/my-account/`, `/my-account/orders/`, `/my-account/edit-account/`, `/my-account/payment-methods/`, `/courses/` (public LD archive)
- **Rollback:** `git revert ecfd8f5` in `kadence-child`, then one-time manual permalink flush
- **Next blocker:** ~~LMS adapter PHP (phase 2)~~ — **done `a352081`**; optional dashboard wiring (phase 3)
- **Docs:** `BACKLOG.md` §2 · `LMS_ADAPTER_SPEC.md` §11 · `WP_DEPENDENCY_MAP.md` Woo row · `ONBOARDING.md`

---

## 2026-05-22 — Woo `my-courses` endpoint audit + plan

- **Scope:** read-only audit of `kadence-child/inc/atmo-account.php` + docs; no PHP/rewrite/DB changes
- **Current fake menu:** slug **`atmo-courses`** (label **«Программы»**) — menu-only + `woocommerce_get_endpoint_url` → `/courses/`; **not** a registered rewrite endpoint
- **Target slug:** **`my-courses`** → `/my-account/my-courses/`; menu label **«Мои курсы»**; drop **`atmo-courses`** from account sidebar
- **Hooks (future):** `init` + `add_rewrite_endpoint`, `woocommerce_account_menu_items`, `woocommerce_account_my-courses_endpoint`
- **Flush:** one-time permalink save/flush after registration — not on every `init`
- **IA:** **«Программы»** stays header/footer → `/courses/`; account nav = Обзор · Мои курсы · Заказы · Настройки · Выйти
- **Strategy:** **A — endpoint shell first** (empty state + CSS), then adapter PHP; reject adapter-first (B) and defer combined MVP (C)
- **Docs:** `LMS_ADAPTER_SPEC.md` §11 · `BACKLOG.md` §2 decision #6 · `WP_DEPENDENCY_MAP.md` Woo row

---

## 2026-05-22 — Code Snippets export to docs repo

- **Scope:** read-only MariaDB export → `docs/snippets/`; no DB/WP/snippet setting changes
- **Count:** 16 snippets (IDs 1–17, no ID 6); UTF-8 markdown + `_manifest.json`
- **Prior audit:** `d2f7262` — LMS-Woo routing audit unchanged; export adds full code bodies to VCS
- **High-impact:** see `docs/snippets/README.md` (#5, #9–#12, #14–#17)
- **Re-export:** when `wp_snippets` rows change on Local/staging

---

## 2026-05-22 — LMS Adapter ViewModel contract sign-off (MVP)

- **Scope:** docs review/sign-off only; no WP/PHP/DB/LD/lite settings changes
- **Decision:** ViewModel contract in `LMS_ADAPTER_SPEC.md` **accepted** for MVP **`/my-account/my-courses/`**
- **Progress fields:** `progress_percent`, `completed_steps`, `total_steps` → **optional `int | null`**; UI hides bar when null (no fake 0%)
- **Continue CTA:** `next_lesson` → **`LessonRef | null`**; hide continue link when absent
- **Expiry:** **`expires_at` on both** `EnrollmentState` (canonical merged window) and `OrderAccessContext` (per-order)
- **Pending:** keep single `pending` status; **`pending_payment`** deferred — use `AccessData.reason = purchase_pending` for order detail
- **Traceability:** optional **`source_order_id`**, **`source_order_item_id`** on `EnrollmentState`; **`order_item_id`** on `OrderAccessContext`
- **Renewal CTA:** optional **`product_permalink`** on `EnrolledCourse` for expired / no-access rows
- **LD coupling:** confirmed — ATMO UI consumes ViewModels only; no LearnDash HTML/classes in theme chrome
- **Still blocked:** ~~`my-courses` endpoint implementation~~ — shell done `ecfd8f5`; ~~**LMS adapter PHP** (phase 2)~~ — **done `a352081`**
- **Docs:** `LMS_ADAPTER_SPEC.md` §4.7 · `BACKLOG.md` §2 decision #3

---

## 2026-05-22 — Access expiry semantics (adapter MVP)

- **Scope:** docs-only product decision; no WP/PHP/DB/LD/lite settings changes
- **Decision:** finite paid access (e.g. **«60 дней»**) → **`expires_at = starts_at + access_duration_days`**; **`starts_at` from LearnDash access start**, not order completed date
- **`starts_at` priority:** (1) `course_{course_id}_access_from` usermeta → (2) `learndash_course_{course_id}_enrolled_at` → (3) Woo **`order_completed_at`** from granting completed order
- **Duration source:** order line **`тип-доступа`** first → fallback variation **`attribute_тип-доступа`** → parse **`access_duration_days`** (e.g. «60 дней» → `60`); **«Бессрочно»** → `access_duration_days = null`, **`expires_at = null`**
- **Order gating:** pending / failed / cancelled orders do **not** grant active access
- **LD course #3616:** `expire_access` **off** on Local — adapter computes MVP display/status **independently**; **must not mutate** LD course settings or user meta
- **Multi-order (MVP rule):** same LD course from multiple completed orders → **lifetime beats finite**; else active window with **latest `expires_at`**
- **ViewModels:** `EnrollmentState` + `OrderAccessContext` expose `starts_at`, `order_completed_at`, `access_type_label`, `access_duration_days`, `expires_at`
- **Docs:** `LMS_ADAPTER_SPEC.md` §5 · `BACKLOG.md` §2 decision #5

---

## 2026-05-22 — Woo product ↔ LearnDash course mapping discovery

- **Scope:** read-only audit via Local MariaDB (`127.0.0.1:10022`, DB `local`); docs only; no code/DB/snippet/Woo/LD/lite settings changes
- **Redesign catalog:** **18** Woo sell-side products → **18** LD courses via LearnDash WooCommerce bridge meta **`_related_course`**
- **Resolver (adapter MVP):** (1) if line has `variation_id` → variation `_related_course`; (2) else parent product `_related_course`; (3) use **course ID**, not slug/title match
- **Variable product #3614:** parent has **no** `_related_course`; variations **#3628** / **#3629** both → LD course **#3616** (`abdominal_pelvicfloormuscles`); slugs differ from product `abdomen_pelvic`
- **Fixture #3801:** order → variation **3628** → course **3616** → user **679** (`r4t5` / `atmo-admin`) enrolled; line meta **`тип-доступа` = 60 дней** (display / `OrderAccessContext`, not enrollment SoT)
- **r4t5 (679):** enrolled in course **3616** only; no LD progress usermeta found
- **`atmo-lms-lite`:** `wp_atmo_lms_access_rules` / enrollments **empty** on Local — not SoT today
- **Open (superseded):** ~~access expiry semantics~~ — decided same day; see entry above
- **Docs:** `LMS_ADAPTER_SPEC.md` §5 · `WP_DEPENDENCY_MAP.md` LMS Map

---

## 2026-05-22 — Enrolled «Мои курсы» route decision

- **Scope:** docs/prototype decision only; no WP/PHP/endpoint/DB changes
- **Decision:** enrolled MVP lives at **`/my-account/my-courses/`** (Woo account endpoint)
- **Rejected:** standalone `/my-courses/`; public `/courses/` as enrolled view; LD shortcode page; wait-for-lite-only
- **Why:** `courses.html` uses **account shell** (same sidebar IA as `account.html`); enrolled state = user account data; reuses `atmo-account.css` + existing endpoint audit pattern; no LD slug collision
- **Unchanged:** `/courses/` stays public LearnDash archive — nav **«Программы»** (header, footer, account menu)
- **Still blocked (superseded):** ~~adapter sign-off~~ — done 2026-05-22; **`my-courses`** endpoint registration audit; Code Snippets export
- **Docs:** `LMS_ADAPTER_SPEC.md` §2 · `BACKLOG.md` §2 decision #2

---

## 2026-05-22 — Code Snippets / LMS–Woo routing audit

- **Scope:** read-only audit via Local MariaDB `wp_snippets` (`127.0.0.1:10022`, DB `local`); docs only; no code/DB/snippet/Woo/LD settings changes
- **Storage:** Code Snippets plugin — table **`wp_snippets`**, **not in VCS** (operational risk)
- **Inventory:** 16 rows (IDs 1–17, no ID 6); 9 active, 7 inactive — full registry in `WP_DEPENDENCY_MAP.md`
- **#5 Thank You Redirect** — **`active = 0`** confirmed; `template_redirect` → broken `http://atmoredesign.local.local/courses`; **do not re-enable** without safe thank-you spec (see `CHANGES.md` → 2026-05-21)
- **LMS / routing:** no **active** snippet controls LearnDash enrollment, `/courses/` route, `/my-account/` dashboard, or **«Мои курсы»** enrolled route
- **PDP:** **#9** `[course_info_card]`, **#10** Currency (`.custom-main-price` + `.euro-hint`), **#12** Bottom Button (duplicate add-to-cart in description tab) — child theme already accounts for these
- **Homepage:** **#14** `[featured_courses]` — Woo **product** carousel → PDP URLs, **not** LD `/courses/` archive (**#11** inactive duplicate shortcode)
- **Orders:** **#15** ATMO Quiz → Order Meta — cart/checkout/order hooks; `atmo_*` line meta + `_atmo_quiz`; adapter should treat as **order context**, not enrollment source of truth
- **#16** hides `atmo_*` from formatted item meta (emails/display filter)
- **#17** inactive checklist/AJAX (`active = -1`); course-adjacent only if revived
- **Recommendation:** proceed to **LMS adapter spec**; snippet fixes are **parallel**, not a blocker; **export/version snippets** before adapter implementation or snippet migration — see `BACKLOG.md` §6

---

## 2026-05-22 — Interim nav relabel: `/courses/` → «Программы»

- **Scope:** label-only in kadence-child; docs update; no route/endpoint/LD/prototype changes
- **Commit:** `be90ec5` — Relabel courses archive nav to Programs
- **WP files:** `inc/atmo-header.php`, `inc/atmo-footer.php`, `inc/atmo-account.php` — visible label **«Мои курсы»** → **«Программы»** for `/courses/` links; href and endpoint slug `atmo-courses` unchanged
- **Unchanged:** dashboard card **«Курсы»**; CTAs **«К программам»** / **«Смотреть программы»**; shell note reserving future **«Мои курсы»** enrolled screen
- **QA (r4t5, read-only):** `/`, `/courses/`, `/my-account/` — desktop 1440×900 + mobile 390×844 — PASS
  - Header, footer, account menu: **«Программы»** → `/courses/`
  - No **«Мои курсы»** in ATMO header/footer/account nav
  - `/courses/` still public LD archive (h1 «Курсы», 18 cards); no layout overflow observed
- **Note:** hidden legacy Kadence menu may still show **«Все Курсы»** in DOM — not ATMO child nav
- **Decision:** BACKLOG option A interim fix applied; real **«Мои курсы»** enrolled route still open — see `BACKLOG.md` §2

---

## 2026-05-22 — LMS adapter / «Мои курсы» route discovery

- **Scope:** read-only discovery + docs decision record; no code/DB/plugin settings/LearnDash template/atmo-lms-lite UI changes; no commit in this step
- **Pages (logged in as r4t5):** `/courses/`, `/courses/testmyself/`, `/my-account/` (nav href check only)
- **Result:** `/courses/` is LearnDash **public CPT archive**, not enrolled «Мои курсы»
  - `body.post-type-archive-sfwd-courses`, `learndash-template-ld30`, h1 **«Курсы»**
  - **18** public course cards (`.sfwd-courses`); **0** `.ld-progress` / `.ld-status` — no enrolled-only filter even when logged in
  - `atmo-account.css` **not** loaded on `/courses/`
- **Course detail:** `/courses/testmyself/` — `single-sfwd-courses`, `.learndash-wrapper`, h2 **«Курс Содержимое»**, lesson links; no progress UI
- **Nav mismatch (confirmed, intentional pending decision):** header, footer, and account menu label **«Мои курсы»** → `/courses/` (fake Woo endpoint `atmo-courses` URL filter in `inc/atmo-account.php`)
- **Runtime:** LearnDash `sfwd-lms` 5.0.5 primary; LearnDash WooCommerce bridge for purchase → enrollment; `atmo-lms-lite` 0.2.0 active on Local (dev-only) — **no front-end assets observed**
- **Prototypes:** `courses.html` = future enrolled view (demo disabled); `account.html` = MVP-safe shell; `product-enrolled.html` / `lesson.html` blocked until adapter
- **Decision (docs only):** no implementation yet; `/courses/` stays public LD archive until product picks interim nav label + target enrolled route
- **Adapter gate:** ViewModels `CourseCard`, `EnrollmentState`, `EnrolledCourse`, `LessonProgress`/`LessonData`, `AccessData` — see `WP_DEPENDENCY_MAP.md`; route options A–E in `BACKLOG.md` §2
- **Leaning guidance (not final):** enrolled UI inside account shell → Woo endpoint `/my-account/my-courses/` after explicit rewrite audit; broader course hub → standalone `/my-courses/`
- **Do not do yet:** LearnDash template overrides; filter `/courses/` to enrolled-only; wire prototype demo data; atmo-lms-lite critical UI; new Woo endpoints without audit
- **Open product decisions:** see `BACKLOG.md` §2

---

## 2026-05-22 — Preview mu-plugin discovery / retirement criteria

- **Scope:** read-only discovery; docs update only; no mu-plugin / kadence-child code changes
- **Files (Local-only, unversioned):**
  - `wp-content/mu-plugins/atmo-redesign-preview.php`
  - `wp-content/mu-plugins/atmo-redesign/assets/css/atmo-preview.css`
- **Runtime:**
  - Without `?atmo_preview_shell=1`: full no-op for assets/DOM; normal pages use child header/footer
  - With query param: preview CSS/fonts, body classes `atmo-preview-layer` + `atmo-preview-shell-enabled`, legacy preview header/footer render; child header/footer hidden via child CSS; Kadence `#masthead` / `#colophon` hidden via mu-plugin CSS
- **Decision:** keep for now as low-risk legacy comparison tool; remove later after explicit sign-off that child header/footer are canonical and preview compare is no longer needed
- **Risks:** unversioned Local code; stale/dead child CSS rules (`body.atmo-preview-shell-enabled` in `atmo-header.css`, `atmo-footer.css`) and preview-font comment in `functions.php` after removal
- **Removal (later, not now):** backup/delete 2 mu-plugin files; optional kadence-child cleanup of preview-mode CSS/comments; `?atmo_preview_shell=1` will then behave like normal site (child chrome)
- **Docs fixed:** `WP_DEPENDENCY_MAP.md` stale claim that preview layer loads on every page
- **Open checklist:** see `BACKLOG.md` → Preview mu-plugin — remove later

---

## 2026-05-22 — Catalog routes + goal chips read-only QA

- **Scope:** read-only QA; no code/DB/Snippets/Woo settings/product edits; no CSS/PHP follow-up for current wiring
- **Pages:** `/каталог/`, `/каталог/?filter_goal={energy,mobility,strength,recovery,unknown}`, `/каталог/page/2/`, `/product-category/training/`; PDP sanity `/product/levelup_neuropower/`
- **Viewports:** desktop 1440×900, mobile 390×844 (catalog main + `filter_goal=energy`; PDP desktop + mobile)
- **Result:** PASS — shop grid, goal chips, server-side `filter_goal`, pagination, category filter bar, PDP price/related cards; no page-level horizontal overflow
- **Counts (server-side `pa_goal`):** energy **3** · mobility **3** · strength **8** · recovery **4** · total **18** redesign products
- **Invalid filter:** `?filter_goal=unknown` → full catalog (18), chip «Все» active (known behavior)
- **Pagination:** `/каталог/page/2/` → 2 cards (17–18 of 18); `/каталог/page/2/?filter_goal=strength` → **404** (strength fits one page — expected)
- **Category archive:** `/product-category/training/` — filter bar present; chip hrefs intentionally jump to main `/каталог/` base (MVP limitation, not a bug)
- **PDP:** no goal filter bar; `atmo-catalog.css` on related cards only; Woo price visible
- **Asset scope:** `atmo-catalog.css` on shop/category/tag/PDP related/cart cross-sells; `atmo-catalog-filters.js` absent / not enqueued
- **Optional future:** category/tag-aware goal chip URLs — see `BACKLOG.md`
- **Open items:** see `BACKLOG.md`

---

## 2026-05-22 — PDP product pages + variable access-tier read-only QA

- **Scope:** read-only QA; no code/DB/Snippets/Woo settings/product edits; no cart/add-to-cart clicks
- **Pages:** `/product/abdomen_pelvic/` (#3614 variable), `/product/levelup_neuropower/` (simple), `/product/facial_support/` (recovery spot-check)
- **Viewports:** desktop 1440×900; mobile 390×844 for #3614 and levelup_neuropower
- **Result:** PASS — ATMO PDP hero, Woo/Snippet 10 price, add-to-cart forms visible (not clicked), tabs/description/reviews, related catalog cards, notices wrapper visible; no page-level horizontal overflow
- **#3614 variable:** Woo Variation Swatches for **тип-доступа** — **60 дней** / **Бессрочно**; native `<select>` hidden (swatch pattern); initial hero price range **399–799** PLN (~ 94 € – 188 €); functional for wiring/shell
- **Simple PDP (levelup_neuropower):** price **399zł (~ 94 €)**; `_atmo_display_title` in hero; meta pills / lead / eyebrow OK
- **Recovery spot-check (facial_support):** **389zł (~ 92 €)**; goal eyebrow **Восстановление**
- **Asset scope:** `atmo-product.css` + `atmo-catalog.css` (related cards) on PDP; `atmo-account` / `atmo-cart` / `atmo-checkout` / `atmo-catalog-filters.js` not loaded
- **By design:** Snippet 12 second add-to-cart form in description-tab CTA
- **Optional future:** #3614 access-tier UI polish / tier-specific hero price after selection — see `BACKLOG.md` (polish, not blocker)
- **Open items:** see `BACKLOG.md`

---

## 2026-05-22 — Cart + checkout + payment-failed shell read-only QA

- **Scope:** read-only QA; no code/DB/Snippets/Woo/Stripe settings changes; no add/remove cart items; no checkout submit; no billing/payment save; no orders placed
- **Session cart (pre-existing, untouched):** 1 line — «Живот и Тазовое дно - 60 дней»; total **399zł**
- **Pages:** `/cart-2/`, `/checkout/`, `/payment-failed/`; sanity `/checkout/order-received/999/`
- **Viewports:** desktop 1440×900 + mobile 390×844 for cart, checkout, payment-failed
- **Result:** PASS — cart/checkout shells, asset scope, payment-failed expected 404; no page-level horizontal overflow
- **Cart:** `.woocommerce-cart-form`, `.cart_totals`, `.wc-proceed-to-checkout`, cross-sells (2) visible; notices wrapper visible
- **Checkout (with item):** billing / `#order_review` / `#payment` visible; `#place_order` visible (not clicked); gateways **BLIK** + **Klarna** visible; Stripe card absent on Local (HTTP + live Stripe env — not theme CSS hiding payment); coupon info notice visible
- **Payment-failed:** `/payment-failed/` → **404** by design (standard Kadence 404 shell); no ATMO cart/checkout CSS
- **Order-received sanity:** `/checkout/order-received/999/` → **200**, generic thank-you; `atmo-confirmation.css` only; no ATMO success hero; no redirect to `/courses`
- **Asset scope:** cart → `atmo-cart.css` + `atmo-catalog.css` (cross-sells); checkout → `atmo-checkout.css`; order-received → `atmo-confirmation.css`; payment-failed → no ATMO cart/checkout CSS
- **Not re-tested:** empty-cart checkout redirect (prior docs: Woo may redirect to cart when empty)
- **Follow-up:** explicit cart-fixture QA same date — see cart-fixture QA entry (`variation 3628` add via URL)
- **Docs fixed:** `WP_DEPENDENCY_MAP.md` stale claim that `/checkout/` is globally 302
- **No CSS/PHP follow-up** for current wiring
- **Open items:** see `BACKLOG.md` (payment-token guardrails unchanged)

---

## 2026-05-22 — Woo My Account address endpoints read-only QA

- **Scope:** read-only QA; no code/DB/Snippets/Woo settings changes; no form save/submit
- **Pages:** `/my-account/edit-address/`, `/edit-address/billing/`, `/edit-address/shipping/`; sanity `/view-order/3801/`
- **Viewports:** desktop 1440×900, mobile 390×844
- **Result:** PASS — address index (billing + shipping empty cards, add CTAs); billing form (7 rows, save visible); shipping form (8 rows, save visible); no overflow/overlap; 5-item nav; no `.atmo-dash` leak
- **Profile state (r4t5):** billing unconfigured — email only on form; shipping unconfigured — all fields empty; index shows «Добавить …» for both types
- **Order #3801 sanity:** order-level billing block has name/street/city/postcode/email; shipping customer block absent
- **No CSS follow-up** for current empty/partial states
- **Still open (data/fixture):** saved profile address cards with edit links; filled address forms; view-order shipping block; save/validation flow (out of scope unless explicit)
- **Open items:** see `BACKLOG.md`

---

## 2026-05-22 — Woo My Account view-order access-type meta display

- **Commit:** `2da518f` — Add account order access-type meta display
- **Files:** `inc/atmo-account.php`, `assets/css/atmo-account.css`
- **Behavior:**
  - On `/my-account/view-order/`, access type renders as structured pill/row when Woo skips default item meta (e.g. #3801: **Тип доступа: 60 дней**)
  - Data from real order item meta key `тип-доступа`; scoped to account view-order only; no fake data; no DB/order mutations
  - Duplicate guard if Woo default `wc-item-meta` renders the same attribute in future
- **Caveats:** attribute slug `тип-доступа` hardcoded (matches current ATMO variable products); #3801 fixture still in WP Admin; saved payment-methods table still open (payment-token scope)
- **QA:** `/view-order/3801/` desktop 1440×900 + mobile 390×844 PASS; sanity `/view-order/3800/` + `/orders/` PASS; order-again visible (not clicked); no overflow/overlap; 5-item nav; no `.atmo-dash` leak
- **Rollback:** `git revert 2da518f`

---

## 2026-05-22 — Woo My Account completed view-order fixture QA

- **Scope:** read-only QA; no code/DB/Snippets/Woo settings changes; fixture order #3801 (manual WP Admin)
- **Pages:** `/my-account/orders/`, `/my-account/view-order/3801/`
- **Fixture:** #3801 completed, r4t5 / user 679, 1 item «Живот и Тазовое дно - 60 дней», qty 1, 399 PLN; #3800 unchanged (pending, 0 items)
- **Viewports:** desktop 1440×900, mobile 390×844
- **Result:** PASS — completed order row; line item shell; qty/total; customer details; order-again visible (not clicked); no pay/cancel on completed view; no page overflow; no `.atmo-dash` leak on view-order
- **Partial:** access type «60 дней» visible in product title/URL; no structured item meta row/pill (`wc-item-meta` / `variation` empty) — **addressed in `2da518f`**
- **Still open (optional):** saved payment-methods table with stored cards
- **Rollback fixture:** delete order #3801 in WP Admin if no longer needed
- **Open items:** see `BACKLOG.md`

---

## 2026-05-22 — Woo My Account static dashboard shell

- **Commit:** `534b241` — Add static ATMO account dashboard shell
- **Files:** `inc/atmo-account.php`, `assets/css/atmo-account.css`
- **Behavior:**
  - logged-in `/my-account/` dashboard has static ATMO shell cards
  - next step card, courses CTA, profile/status, recent order summary
  - last order uses read-only Woo API summary only (number/date/status), no actions
  - no LMS progress, no fake enrolled course data
  - `/courses/` remains public LearnDash archive; real LMS widgets deferred until adapter decision
- **Caveats:** Woo default dashboard paragraphs remain in DOM but hidden by CSS when `.atmo-dash` exists; real LMS/enrolled progress still deferred; saved cards table, line/meta pills, completed order-again still not live-QA'd
- **QA:** desktop 1440×900 + mobile 390×844; `/my-account/` PASS; sanity `/orders/`, `/edit-account/`, `/payment-methods/` PASS; dashboard shell only on dashboard endpoint; no overflow/overlap; 5-item menu present
- **Rollback:** `git revert 534b241`

---

## 2026-05-22 — Woo My Account add-payment-method read-only audit

- **Scope:** read-only audit; no code/DB/Snippets/Woo/Stripe settings changes
- **Page:** `/my-account/add-payment-method/`
- **Viewports:** desktop 1440×900, mobile 390×844
- **Result:** PASS — direct URL loads; 5-item account nav; form/container visible; submit visible (not clicked); no overflow/clipping; theme does not hide payment UI (computed styles visible); Klarna visible
- **Local note:** Stripe card and BLIK not in DOM — Woo/Stripe config/environment, not theme CSS; no CSS follow-up for current shell/wiring
- **Not fully QA'd:** saved payment-methods table with stored cards; line items/meta pills; completed order/order-again; real LMS/enrolled widgets (deferred until adapter decision)

---

## 2026-05-22 — Woo My Account logged-out auth shell/wiring QA

- **Scope:** read-only logged-out regression; no code/DB/Snippets/Woo settings changes
- **Pages:** `/my-account/` (login + register), `/my-account/lost-password/`
- **Viewports:** desktop 1440×900, mobile 390×844
- **Result:** PASS — auth forms visible; register enabled; no logged-in leakage; no overflow/clipping; no blockers
- **Repos:** beta html + kadence-child clean
- **Closes:** logged-out auth re-QA follow-up from pass 2a (`3122f4f`)

---

## 2026-05-22 — Woo My Account mobile orders actions overflow fix

- **Commit:** `fcca2e5` — Fix mobile account order actions overflow
- **Files:** `assets/css/atmo-account.css`
- **Behavior:** CSS-only — mobile `/my-account/orders/` action cell stacks View/Cancel full-width; desktop unchanged
- **Scope:** fixes 390×844 clip on `.woocommerce-button.button.view` / `.cancel`; no PHP/DB changes
- **QA:** 3/3 PASS — desktop 1440×900 `/my-account/orders/`; mobile 390×844 `/my-account/orders/` + sanity `/my-account/view-order/3800/`; no overflow/overlap; View + Cancel visible; no action clicks
- **Note:** closes account regression WARN on mobile `/orders/` (sweep 16/16 after fix)
- **Rollback:** `git revert fcca2e5`

---

## 2026-05-22 — Woo My Account hidden endpoints (pass 5)

- **Commit:** `3135ddb` — Style hidden Woo account endpoints
- **Files:** `assets/css/atmo-account.css`
- **Behavior:** CSS-only — address index cards, billing/shipping form fields, downloads empty/list, payment-methods empty/table/add CTA
- **Scope:** menu-hidden endpoints still reachable by direct URL; no PHP/DB changes
- **QA:** 6/6 PASS — desktop 1440×900 (`/edit-address/`, `/edit-address/billing/`, `/downloads/`, `/payment-methods/`); mobile 390×844 (`/edit-address/`, `/downloads/`); no overflow/overlap; notices/empty states/forms visible; no save/add-payment/logout clicks
- **Not fully QA'd:** downloads list with files, payment-methods table with saved cards; `/edit-address/shipping/` form — **read-only QA 2026-05-22 PASS** (see CHANGES entry)
- **Rollback:** `git revert 3135ddb`

---

## 2026-05-22 — Woo My Account settings form (pass 4)

- **Commit:** `d1748dc` — Style Woo account settings form
- **Files:** `assets/css/atmo-account.css`
- **Behavior:** CSS-only `/my-account/edit-account/` — fields, password fieldset, save CTA
- **Scope:** no form submit / no data changes
- **Rollback:** `git revert d1748dc`

---

## 2026-05-22 — Woo My Account orders views (pass 3)

- **Commit:** `3704226` — Style Woo account orders views
- **Files:** `assets/css/atmo-account.css`
- **Behavior:** CSS-only — orders empty state, table, view-order, error, customer details
- **QA:** `/my-account/orders/` + `/my-account/view-order/3800/`; desktop/mobile no page overflow; mobile orders row-action clip fixed later in `fcca2e5`
- **Not fully QA'd:** line items/meta pills, completed order/order-again
- **Rollback:** `git revert 3704226`

---

## 2026-05-21 — Woo My Account menu IA

- **Commit:** `d4ee689` — Simplify Woo account menu
- **Files:** `functions.php`, `inc/atmo-account.php`
- **Behavior:**
  - меню: Обзор / Мои курсы / Заказы / Настройки / Выйти
  - скрыты только из меню: Downloads, Address, Payment Methods
  - прямые URL скрытых endpoints остаются рабочими
  - `/courses/` — внешний link, без rewrite endpoint
- **Rollback:** `git revert d4ee689`

---

## 2026-05-21 — Woo My Account logged-in shell (pass 2a)

- **Commit:** `3122f4f` — Style Woo account dashboard shell
- **Files:** `assets/css/atmo-account.css`
- **Behavior:** logged-in grid shell (nav left ≥920px), horizontal scroll nav mobile, content card, nav active/logout styling, notices/empty states; auth pass 1 unchanged
- **Scope not touched:** PHP menu filters, DB, Snippets, form fields, LearnDash pages
- **Rollback:** `git revert 3122f4f`
- **Follow-ups (remaining):** real LMS/enrolled widgets deferred until adapter decision (static dashboard shell shipped in `534b241`)

---

## 2026-05-21 — Woo My Account auth shell

- **Commits:**
  - `a7bd7fd` — Scaffold ATMO account stylesheet
  - `353346c` — Style Woo account auth forms
- **Files:** `functions.php`, `assets/css/atmo-account.css`
- **Behavior:**
  - `atmo-account.css` enqueued on `is_account_page()` only (Woo `/my-account/` + endpoints)
  - logged-out pass 1: login + register cards, lost-password form, account notices
  - scoped to `body.woocommerce-account:not(.logged-in)` for auth forms; logged-in nav/dashboard not styled yet
  - `/courses/`, `/profile/`, `/reset-password/` (LearnDash) — **not** enqueued
  - checkout / cart / catalog / PDP / order-received — **not** enqueued
- **Scope not touched:** DB, Snippets, templates/hooks, user/password logic, LearnDash pages
- **Rollback:** `git revert 353346c` · `git revert a7bd7fd` (remove scaffold + enqueue)
- **Follow-ups:** logged-in dashboard shell, orders endpoint, sidebar nav, enrolled courses view

---

## 2026-05-21 — Purchase-flow regression sweep green

- **Baseline commit:** `abc2ef1` — Style Woo checkout and payment failure notices
- **Snippet #5** Thank You Redirect — disabled confirmed (`active = 0`)
- **Checked areas (read-only, all PASS):**
  - catalog filters / pagination
  - simple PDP
  - variable PDP
  - cart full + empty
  - checkout BLIK/Klarna
  - order-received invalid
  - order-received guest pre-verify
  - order-received guest verified #3241
  - `/payment-failed/` 404 by design
- **Asset scope:** green
- **No code/DB changes during sweep**
- **Known low follow-ups:**
  - variable PDP hero still shows range after tier pick
  - card method hidden on Local due HTTP + live Stripe
  - static `/payment-failed/` not implemented
  - post-purchase custom hero/steps optional later

---

## 2026-05-21 — Checkout / order confirmation: payment failure notices

- **Commit:** `abc2ef1` — Style Woo checkout and payment failure notices
- Woo error/failed payment notices styled; no redirects/payment logic.
- **Files:** `atmo-checkout.css` (checkout `.woocommerce-error` / `.woocommerce-message` / `.woocommerce-info`); `atmo-confirmation.css` (`.woocommerce-thankyou-order-failed` branch; success hero selector unchanged)
- **Rollback:** `git revert abc2ef1`

---

## 2026-05-21 — Woo order confirmation visual shell

### Theme commits

| Commit | Message |
|---|---|
| `117e2cc` | Style Woo order confirmation shell |
| `3e4d0de` | Scaffold ATMO order confirmation stylesheet |

**Theme files (`3e4d0de` / `117e2cc`):**

| File | Change |
|---|---|
| `functions.php` | Enqueue `atmo-confirmation.css` on `is_checkout() && is_wc_endpoint_url('order-received')`; exclude `atmo-checkout.css` on order-received |
| `assets/css/atmo-confirmation.css` | Scaffold → scoped ATMO order confirmation visual shell (pass 1) |

### Context

- **Snippet #5** `Thank You Redirect` — disabled manually earlier (`active = 0`); order-received stays on canonical Woo endpoint for QA

### Behavior

| Page / scope | Assets / styling |
|---|---|
| `/checkout/order-received/{id}/?key=…` | loads `atmo-confirmation.css` |
| `/checkout/` (non–order-received) | does **not** load `atmo-confirmation.css` |
| `/checkout/order-received/` | does **not** load `atmo-checkout.css` |
| `/cart-2/` | does **not** load `atmo-confirmation.css` |

**Success hero:** applies only when full verified order DOM is present — selector  
`body.woocommerce-order-received .woocommerce-order:has(.woocommerce-order-overview) .woocommerce-thankyou-order-received`  
Pre-verify email gate and invalid/generic order-received (e.g. `/checkout/order-received/999/`) do **not** get ATMO success hero card.

### Explicitly not touched

- no new orders created
- no payment settings changes
- no Code Snippets changes
- no PHP hooks / template overrides
- no DB writes

### QA (green)

| Check | Result |
|---|---|
| Guest order **#3241** — session-only email verification | PASS |
| Full `.woocommerce-order` DOM styled (overview, details, custom fields, billing) | PASS |
| Pre-verification gate readable (form + info; no hero card) | PASS |
| Invalid `/checkout/order-received/999/` — no hero reinforcement | PASS |
| Desktop 1440 — no horizontal overflow | PASS |
| Mobile 390 — no horizontal overflow | PASS |
| `atmo-checkout.css` excluded from order-received | PASS |

### Rollback

**Theme (visual shell only):**

```powershell
git -C "D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child" revert 117e2cc
```

**Theme (remove scaffold + enqueue too):**

```powershell
git -C "D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child" revert 3e4d0de
```

### Known follow-ups

- Optional PHP hook for custom ATMO hero / post-purchase steps (page title still «Оформление заказа»)
- Static `/payment-failed/` page — not implemented; failed branch + checkout notices styled (`abc2ef1`)
- Real staging/prod checkout success QA (Local HTTP + live Stripe limits card method)

---

## 2026-05-21 — Disabled broken Thank You Redirect snippet

- **Snippet #5** `Thank You Redirect` — disabled manually in WP admin (`active = 0`)
- **Reason:** redirected `order-received` to broken `http://atmoredesign.local.local/courses` and could block Stripe return handling on `template_redirect`
- **Scope:** Snippet only — no theme / DB schema / payment settings changes
- **Verification (read-only):** `active = 0`; `/checkout/order-received/999/` → **200**, no redirect to `/courses`; `/checkout/` → normal Woo redirect to cart when empty; `/cart-2/` → **200**; child theme git clean
- **Rollback:** re-enable Snippet #5 — **not recommended** unless redirect is rewritten safely (correct host, after Stripe `wp` handling, or on canonical thank-you UI)
- **Follow-up:** build thank-you UI on canonical Woo `order-received` endpoint

---

## 2026-05-21 — Woo checkout ATMO visual shell

### Theme commits

| Commit | Message |
|---|---|
| `8f98db0` | Tighten mobile checkout spacing |
| `1b00a0c` | Style Woo checkout with ATMO visual shell |
| `38da60d` | Scaffold ATMO checkout stylesheet *(prior scaffold)* |

**Theme files (`1b00a0c` / `38da60d`):**

| File | Change |
|---|---|
| `functions.php` | Enqueue `atmo-checkout.css` on checkout only; exclude order-received |
| `assets/css/atmo-checkout.css` | **NEW** — scoped ATMO checkout visual shell |

### Behavior

| Page / scope | Assets |
|---|---|
| `/checkout/` | loads `atmo-checkout.css` |
| `/checkout/order-received/` | does **not** load `atmo-checkout.css` |
| `/cart-2/` | does **not** load `atmo-checkout.css` |
| `/каталог/` | does **not** load `atmo-checkout.css` |
| PDP | does **not** load `atmo-checkout.css` |

### Explicitly not touched

- payment logic
- Stripe UPE internals
- Code Snippets
- DB
- order submit / test orders
- terms collapse
- sticky mobile CTA
- order-received / payment failed pages

### QA (green)

| Check | Result |
|---|---|
| Checkout — desktop | PASS |
| Checkout — mobile | PASS |
| BLIK / Klarna visible | PASS |
| Stripe UPE not clipped | PASS |
| `#terms` visible / clickable | PASS |
| Single `#place_order` | PASS |
| 390px — no horizontal overflow | PASS |
| Asset scope (cart / catalog / PDP / order-received) | PASS |

### Mobile spacing — Option B+ (`8f98db0`)

CSS-only pass in `atmo-checkout.css` under `@media (max-width: 640px)`: tighter login/coupon/billing/review/payment padding; terms label tap area ≥44px; `#place_order` stays `static` (no sticky). At 390×844: `#place_order` top **2084px → 1956px** (−128px); doc height **3000px → 2852px** (−148px). Sticky CTA and terms collapse still out of scope.

**Rollback:** `git revert 8f98db0`

### Stripe Card — Local vs prod (read-only audit, doc only)

- **Local** (`http://atmoredesign.local`): **Card hidden** — expected when **HTTP + Stripe live mode**; WooCommerce Stripe hides main `payment_method_stripe` when `!is_ssl() && !testmode`. **BLIK / Klarna** remain visible as separate UPE gateways.
- **Prod (HTTPS):** **Card + BLIK + Klarna** shown.
- **Card UI QA:** run on **HTTPS staging/prod**, or Local with **Stripe test mode** / Local HTTPS — not on HTTP live Local.
- **Theme:** `atmo-checkout.css` does **not** hide card; no theme/Stripe settings changed for this note.

### Rollback

**Theme:**

```powershell
git -C "D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child" revert 1b00a0c
```

**Theme (remove scaffold too):**

```powershell
git -C "D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child" revert 38da60d
```

### Known follow-ups

- **Mobile CTA reachability** — compact spacing done (`8f98db0`); sticky CTA deferred
- **Terms / link-only decision** — collapse vs link-only UX TBD
- **Snippet #5:** thank-you redirect before order-confirmation work
- **Payment failed** — static `/payment-failed/` page not implemented; checkout/failed thank-you notices styled (`abc2ef1`)

---

## 2026-05-21 — Woo cart ATMO layout shell

### Theme commit

| Commit | Message |
|---|---|
| `064a478` | Style Woo cart with ATMO layout shell |

**Theme files (`064a478`):**

| File | Change |
|---|---|
| `functions.php` | Enqueue `atmo-cart.css` on cart only; keep `atmo-catalog.css` on cart for cross-sells |
| `assets/css/atmo-cart.css` | **NEW** — scoped ATMO cart layout shell |

### Behavior

| Page / scope | Assets |
|---|---|
| `/cart-2/` | loads `atmo-cart.css` |
| `/cart-2/` (cross-sells) | intentionally loads `atmo-catalog.css` |
| checkout | does **not** load `atmo-cart.css` |
| PDP | does **not** load `atmo-cart.css` |
| catalog | does **not** load `atmo-cart.css` |

### Explicitly not touched

- checkout templates / flow
- payment logic
- Code Snippets
- DB
- order-received / payment failed pages

### QA (green)

| Check | Result |
|---|---|
| Cart with item — desktop | PASS |
| Cart with item — mobile | PASS |
| Empty cart | PASS |
| 390px — no horizontal overflow | PASS |
| Checkout asset scope (no `atmo-cart.css`) | PASS |

### Rollback

**Theme:**

```powershell
git -C "D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child" revert 064a478
```

### Known follow-ups

- **Checkout:** done — ATMO visual shell (`1b00a0c`) + mobile compact spacing (`8f98db0`); see **2026-05-21 — Woo checkout ATMO visual shell**
- **Snippet #5:** thank-you redirect before order-confirmation work

---

## 2026-05-21 — Price policy — Woo canonical, prototype non-authoritative

### Business decision (confirmed)

| Rule | Detail |
|---|---|
| **Source of truth** | WooCommerce prices only — canonical for storefront, cart, checkout |
| **Prototype / `shared/data.js`** | Non-authoritative placeholder data from WordPress migration; **ignore** `price` / `oldPrice` for Woo updates |
| **Do not** | Change Woo prices to match prototype; create sale prices from prototype `oldPrice`; bulk automatic price updates |
| **Audit mismatches** | **Closed as intentional** — Woo wins; no repair SQL planned |

### Product decisions (Woo unchanged)

| ID | slug | Woo (keep) | Prototype (ignore) |
|---:|---|---|---|
| **24** | `kurs-vse-o-beremennosti` | **299** | 499 — do not change |
| **32** | `fitnes-sezon-1-zabota` | **389** (no sale) | `oldPrice` 499 — do not add strikethrough |
| **3614** | `abdomen_pelvic` | **399–799** access-tier | single-SKU promo model — no repair SQL |
| **1121** | `testmyself` | **17.99** | 18 — do not change |

All **18** redesign products: **aligned with Woo** for pricing purposes.

### Rollback

N/A — `CHANGES.md` only.

---

## 2026-05-21 — Price audit correction (read-only, doc only)

### Scope

Read-only price audit follow-up for 18 redesign products. **Documentation only** — no DB changes, no price repair SQL, no theme/code/Snippets/cart/checkout/catalog changes.

### ID 3614 `abdomen_pelvic` — categorization corrected

| Was (initial audit) | Now (confirmed) |
|---|---|
| Missing/broken price; variable/edge case; repair candidate | **Variable access-tier product** — intentional pricing model |

- **Woo source of truth:** price range **399–799** PLN is correct — variation **60 дней** = 399, **Бессрочно** = 799 (`product_variation` IDs 3628 / 3629).
- **Prototype `oldPrice: 799` does not apply** — `data.js` models a single SKU promo; live Woo uses tiered access, not sale/strikethrough.
- Parent duplicate `_price` rows (399 + 799) reflect variation min/max sync, not a data defect.
- **No price repair SQL** for 3614. **No DB changes.**

### Updated audit stats (18 products) — **closed**

| Category | Count | Notes |
|---|---:|---|
| **Aligned with Woo** | **18** | All redesign IDs; Woo is canonical (see **Price policy** above) |
| **Mismatch** (vs prototype) | **0** | Former gaps **closed** — not defects |
| **oldPrice gap** | **0** | **32** — no sale from prototype `oldPrice` |
| **Broken / missing price** | **0** | **3614** — access-tier 399–799, not broken |

**Former audit items (now closed):**

| ID | Was | Status |
|---:|---|---|
| **24** | 299 vs prototype 499 | **Aligned with Woo** — keep 299 |
| **1121** | 17.99 vs prototype 18 | **Aligned with Woo** — keep 17.99 |
| **32** | prototype `oldPrice` 499 absent in Woo | **Closed** — no sale/strikethrough from prototype |
| **3614** | edge / repair candidate | **Closed** — variable access-tier; no repair SQL |

Prior audit: 14 aligned, 2 mismatch, 1 oldPrice gap (32), 3614 edge case → superseded; final closure in **Price policy** entry.

### Follow-up (future, not now)

- **PDP variable product UI polish** for access-tier selector (3614) — separate task; **pricing unchanged**.
- **No** Woo price updates, sale creation from prototype, or bulk price sync planned.

### Rollback

N/A — `CHANGES.md` only.

---

## 2026-05-21 — PDP hero metadata from `_atmo_*` meta

### Theme commit

| Commit | Message |
|---|---|
| `805e07f` | Render PDP hero metadata from ATMO meta |

**Theme files (`805e07f`):**

| File | Change |
|---|---|
| `inc/atmo-product.php` | `atmo_get_pdp_goal()`, `atmo_get_pdp_meta_pills()`, extended `atmo_build_product_page()` ViewModel |
| `woocommerce/content-single-product.php` | Hero: goal eyebrow, badge, lead summary, meta pills (before `[course_info_card]`) |
| `assets/css/atmo-product.css` | Scoped `.atmo-pdp-badge`, `.atmo-pdp-lead`, `.atmo-pdp-meta`, goal-colored eyebrow |

### Data changes (Local MariaDB, port `10022`, database `local`)

**Meta keys populated:**

- `_atmo_display_title`
- `_atmo_hero_summary`
- `_atmo_badge` (only when prototype `subtitle` non-null)
- `_atmo_duration`
- `_atmo_sessions_per_week`
- `_atmo_session_length`
- `_atmo_level` (MVP default: `Любой` for all)

| Phase | Products | Rows | Notes |
|---|---|---:|---|
| Pilot | ID **32** `fitnes-sezon-1-zabota` | **7** | Custom `_atmo_hero_summary` (not `data.js` verbatim) |
| Batch | Remaining **17** redesign IDs | **105** | ID 32 **excluded** from batch DELETE/INSERT |
| **Total** | **18** redesign products | **112** | 14×6 + 4×7 (badges on 32, 2056, 3159, 3614) |

**17 batch product IDs:** 24, 727, 859, 964, 1121, 1275, 1418, 1541, 1745, 1877, 2056, 2418, 2660, 2903, 3159, 3288, 3614.

**Method:** UTF-8 SQL (`SET NAMES utf8mb4`), idempotent `DELETE` (explicit meta_key whitelist) + `INSERT`.  
Post-batch fix: ID 3614 `_atmo_badge` corrected via `UNHEX('D09DD0BED0B2D0B8D0BDD0BAD0B0')` (typo in SQL file only; DB verified clean).

### Explicitly not touched

- `post_title` (Woo product name unchanged)
- Woo `_regular_price` / `_sale_price`
- `pa_goal` assignments
- Code Snippets (9/10/12)
- LearnDash templates / meta
- Cart / checkout templates
- Catalog filter / chips logic

### QA (green)

| Check | Result |
|---|---|
| 18/18 PDP HTTP | 200 |
| H1 + hero lead + 4 meta pills | 18/18 |
| Badges only on expected IDs | 32 «Хит», 2056 «Новинка», 3159 «Скидка», 3614 «Новинка» |
| Overflow (390px + 1440px) | **36/36** — no h-overflow, no empty badge/lead |
| `/каталог/` | 200, filters unchanged |
| `/cart-2/` | 200, no `atmo-product.css` / `atmo-catalog.css` |
| Child theme git | clean at `805e07f` |

### Rollback

**Theme:**

```powershell
git -C "D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child" revert 805e07f
```

**DB — batch 17 IDs only:**

```sql
SET NAMES utf8mb4;

DELETE FROM wp_postmeta
WHERE post_id IN (24,727,859,964,1121,1275,1418,1541,1745,1877,2056,2418,2660,2903,3159,3288,3614)
  AND meta_key IN (
    '_atmo_display_title',
    '_atmo_hero_summary',
    '_atmo_badge',
    '_atmo_duration',
    '_atmo_sessions_per_week',
    '_atmo_session_length',
    '_atmo_level'
  );
```

**DB — ID 32 pilot (if needed):**

```sql
SET NAMES utf8mb4;

DELETE FROM wp_postmeta
WHERE post_id = 32
  AND meta_key IN (
    '_atmo_display_title',
    '_atmo_hero_summary',
    '_atmo_badge',
    '_atmo_duration',
    '_atmo_sessions_per_week',
    '_atmo_session_length',
    '_atmo_level'
  );
```

### Known follow-ups

- **Pricing:** closed — Woo canonical; see **2026-05-21 — Price policy** (no Woo price / sale changes from prototype).
- **Catalog cards** still use `post_title`; showing `_atmo_display_title` on cards is a separate decision
- **Admin UX:** optional meta box for `_atmo_*` editing in child theme (later)

---

## 2026-05-20 — Server-side goal filter (`filter_goal`)

### Scope

Replace client-side chips MVP with server-side `pa_goal` filtering via query param `filter_goal`.  
Catalog baseline unchanged: 18 redesign products, hidden `[28, 36]`, `data-goal` on cards kept.

### Theme files

| File | Change |
|---|---|
| `inc/atmo-catalog.php` | Capture/strip `filter_goal` on `init`; `pa_goal` `tax_query` on `woocommerce_product_query` (20); chip `<a>` links + `aria-current`; server counter; pagination `add_args`; filter bar on `woocommerce_before_main_content` |
| `functions.php` | Removed enqueue `atmo-catalog-filters.js` (file kept for rollback) |
| `assets/css/atmo-catalog.css` | Chip link styles (`text-decoration`, `:visited`) |
| `assets/js/atmo-catalog-filters.js` | **Not deleted** — client MVP retired, no enqueue |

**Не тронуто:** DB, PDP templates, checkout, Snippets, LearnDash, exclude list `[28, 36]`.

### Query param

| Key | Values | Invalid |
|---|---|---|
| `filter_goal` | `energy`, `mobility`, `strength`, `recovery` | treated as «Все» (18 products) |

Chip URLs (MVP): always `/каталог/` base — category/tag-aware chip URLs **not** implemented.

### WC compatibility note

WooCommerce treats `filter_*` as layered-nav. `filter_goal` hits attribute `goal` / `pa_goal` via lookup table → 0 products (table not indexed for this attribute).  
Fix: capture valid `filter_goal` on `init`, `unset` from `$_GET`, apply theme `tax_query` on `woocommerce_product_query`.

### Rollback

1. Restore `woocommerce_before_shop_loop` hook for filter bar; remove `init` capture + `woocommerce_product_query` goal callback + pagination filter
2. Restore chip `<button>` + empty counter span; re-enable `atmo-catalog-filters.js` enqueue in `functions.php`
3. Remove chip link CSS additions

### QA (green)

| URL | Expected | Result |
|---|---|---|
| `/каталог/` | 18, Все active | PASS |
| `?filter_goal=energy` | 3, ID 32 present, Энергия active | PASS |
| `?filter_goal=mobility` | 3 | PASS |
| `?filter_goal=strength` | 8 | PASS |
| `?filter_goal=recovery` | 4 | PASS |
| `?filter_goal=invalid` | 18, Все active | PASS |
| Hidden 28/36 | absent on all filters | PASS |
| Chip links | `<a href="/каталог/?filter_goal=…">`, no `/page/N/` | PASS |
| Pagination | `add_args['filter_goal']` when active | implemented |
| PDP / cart | no filter JS; cart no catalog CSS | PASS |

### Known limitation

- Chip hrefs always point to main shop `/каталог/` (not current category/tag archive).
- Client-side filter JS file remains on disk until VCS; enqueue disabled.

---

## 2026-05-20 — Catalog alignment: restore ID 32, exclude ID 36 from shop loop

### Scope

Align shop loop with 18 redesign products from `shared/data.js` / `CHANGES.md` pa_goal set.  
**ID 32** `fitnes-sezon-1-zabota`: restore WooCommerce catalog visibility (DB).  
**ID 36** `video_plan`: exclude from shop loop via child theme `post__not_in` (DB visibility unchanged).  
**ID 28** remains excluded via theme hook. No PDP / checkout / Snippets / LearnDash / chips changes.

### DB change (ID 32 only)

Removed `product_visibility` relationships for `object_id=32`:

| term_taxonomy_id | slug |
|---:|---|
| 7 | exclude-from-catalog |
| 6 | exclude-from-search |

```sql
-- Pre-check
SELECT tr.object_id, tr.term_taxonomy_id, t.slug
FROM wp_term_relationships tr
JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
JOIN wp_terms t ON tt.term_id = t.term_id
WHERE tr.object_id = 32 AND tt.taxonomy = 'product_visibility';

-- Apply
START TRANSACTION;
DELETE FROM wp_term_relationships
WHERE object_id = 32 AND term_taxonomy_id IN (6, 7);
COMMIT;
```

### Theme change

| File | Change |
|---|---|
| `inc/atmo-catalog.php` | `atmo_get_catalog_excluded_product_ids()` → `[28, 36]` |

### Rollback

**DB (restore ID 32 hidden visibility):**

```sql
START TRANSACTION;
INSERT INTO wp_term_relationships (object_id, term_taxonomy_id, term_order)
VALUES (32, 7, 0), (32, 6, 0);
COMMIT;
```

**Theme (remove ID 36 from exclude list):**

```php
return [ 28 ]; // course-healthy-joints-en only
```

### QA (green)

| Check | Result |
|---|---|
| `/каталог/` | 200 |
| `/каталог/page/2/` | 200 |
| Pagination | p1 «1–16 из 18», p2 «17–18 из 18» |
| Shop loop total | 16 + 2 = **18** |
| Product IDs | 24,32,727,859,964,1121,1275,1418,1541,1745,1877,2056,2418,2660,2903,3159,3288,3614 — matches redesign set |
| ID 32 in loop | yes (page 2), `data-goal="energy"` |
| ID 36 in product loop | absent (nav menu link may remain) |
| ID 28 in product loop | absent |
| pa_goal / data-goal | **18/18** cards |
| `/product/fitnes-sezon-1-zabota/` | 200 |
| `/product/video_plan/` | 200 |
| `/product/course-healthy-joints-en/` | 200 |
| `/cart-2/` | 200, no `atmo-catalog.css` / `atmo-catalog-filters.js` |

---

## 2026-05-20 — Hide out-of-scope products from catalog shop loop (theme-only)

### Scope

Query-level exclusion of `product_id=28` / `course-healthy-joints-en` and `product_id=36` / `video_plan` from WooCommerce catalog archives only.  
Both products remain in DB (`publish`, `catalog_visibility=visible`); direct PDP URLs unchanged; no DB / pa_goal / chips / PDP / checkout / Snippets / LearnDash changes for ID 36.

### Theme files

| File | Change |
|---|---|
| `inc/atmo-catalog.php` | `atmo_get_catalog_excluded_product_ids()` → `[28, 36]` + `woocommerce_product_query` hook with `post__not_in` on shop/category/tag |

### Hook choice

`woocommerce_product_query` (priority 10) — WooCommerce-native hook for main product loop on `is_shop()` / `is_product_category()` / `is_product_tag()`.  
Guarded by existing `atmo_is_catalog_archive_page()`. Does not affect PDP related products, search, or direct product URLs.

### Rollback

1. In `inc/atmo-catalog.php`: remove `add_action( 'woocommerce_product_query', ... )`, `atmo_get_catalog_excluded_product_ids()`, and `atmo_exclude_redesign_out_of_scope_products()`.
2. Catalog again shows 20 products (incl. ID 28 + ID 36 on page 2); pagination reverts to «из 20».

### QA (green)

| Check | Result |
|---|---|
| `/каталог/` | 200 |
| `/каталог/page/2/` | 200 |
| Pagination p1 | «Отображение 1–16 **из 18**» (was «из 19») |
| Pagination p2 | «Отображение 17–18 **из 18**» |
| Cards p1 + p2 | 16 + 2 = **18** |
| ID 28 in product loop | absent (only nav menu link remains) |
| ID 36 in product loop | absent (only nav menu link remains) |
| `/product/course-healthy-joints-en/` | 200 (PDP intact) |
| `/product/video_plan/` | 200 (PDP intact) |
| `/product/fitnes-sezon-1-zabota/` | 200, `.atmo-pdp`, add-to-cart |
| ID 32 in product loop | present on page 2, `data-goal="energy"` |
| `/cart-2/` | 200, no catalog CSS/filter JS |
| Chips | 5 chips + `atmo-catalog-filters.js` on catalog only |

### DB fix (ID 32 only, 2026-05-20)

Removed WooCommerce `product_visibility` terms `exclude-from-catalog` / `exclude-from-search` from `fitnes-sezon-1-zabota` (ID 32).  
`catalog_visibility=visible`, `pa_goal=energy` unchanged. No DB changes for ID 36.

---

## 2026-05-20 — pa_goal + goal chips (catalog MVP)

### DB changes (Local MariaDB, port `10022`, database `local`)

1. **Attribute `goal` / taxonomy `pa_goal`**
   - `wp_woocommerce_attribute_taxonomies`: `attribute_name=goal`, `attribute_label=Цель` (UNHEX `D0A6D0B5D0BBD18C`)
   - Terms in `pa_goal`:

     | slug | label | term_id | term_taxonomy_id |
     |---|---|---:|---:|
     | energy | Энергия | 27 | 27 |
     | mobility | Мобильность | 28 | 28 |
     | strength | Сила | 29 | 30 |
     | recovery | Восстановление | 30 | 29 |

   - После INSERT/UPDATE attribute: purge `_transient_wc_attribute_taxonomies*`

2. **18 product assignments** (`wp_term_relationships`, taxonomy `pa_goal`)

   | product_id | slug | goal_slug | term_taxonomy_id |
   |---:|---|---|---:|
   | 32 | fitnes-sezon-1-zabota | energy | 27 |
   | 727 | cardio_1st_grade | energy | 27 |
   | 1541 | 4weeks | energy | 27 |
   | 3159 | intensive_bs | mobility | 28 |
   | 1877 | pilates_medball | mobility | 28 |
   | 2660 | express_minibands | mobility | 28 |
   | 3288 | levelup_neuropower | strength | 30 |
   | 2903 | levelup_your_strenght | strength | 30 |
   | 1275 | fastform_pha | strength | 30 |
   | 2056 | fastform20 | strength | 30 |
   | 1418 | slim_stomach | strength | 30 |
   | 2418 | athleticbody | strength | 30 |
   | 859 | fs3 | strength | 30 |
   | 1745 | functional_medball | strength | 30 |
   | 24 | kurs-vse-o-beremennosti | recovery | 29 |
   | 3614 | abdomen_pelvic | recovery | 29 |
   | 964 | facial_support | recovery | 29 |
   | 1121 | testmyself | recovery | 29 |

   **Исключено:** `product_id=28` / `course-healthy-joints-en` (вне scope редизайна).

   Term counts после назначения: energy=3, mobility=3, strength=8, recovery=4.

### Theme files changed (goal chips)

| File | Change |
|---|---|
| `inc/atmo-catalog.php` | `goal_slug`/`goal_label` из `pa_goal`; filter bar hook `woocommerce_before_shop_loop` (15) |
| `woocommerce/content-product.php` | `data-goal` на `li.atmo-card-item` (если slug есть) |
| `assets/css/atmo-catalog.css` | `.atmo-catalog-filters`, chips, `--filtered-out` |
| `assets/js/atmo-catalog-filters.js` | **NEW** — client-side filter |
| `functions.php` | enqueue `atmo-catalog-filters` только на shop/category/tag |

**Не тронуто:** `content-single-product.php`, `inc/atmo-product.php`, `atmo-product.css`, cart/checkout, Snippets, LearnDash.

### QA (green)

- `/каталог/` 200; filter bar + 5 chips
- Page 1: `data-goal` на 16/16 карточках
- `ID 28` healthy-joints: без `data-goal`
- JS filter: energy/mobility/strength/recovery/all работает
- PDP: `atmo-catalog.css` да (related), filter JS нет
- Cart: catalog CSS и filter JS нет
- Mobile 390px: chips scroll, без overflow

### Known limitation

**Client-side filter (MVP):** chips фильтруют только карточки **текущей страницы пагинации**.  
Пример: на page 1 chip «Энергия» показывает 2 карточки, не 3 — третья (`fitnes-sezon-1-zabota`) на page 2.  
Server-side filter (`pre_get_posts` / query param) — отдельный следующий этап.

### Rollback

#### Rollback chips (theme only)

1. Удалить enqueue `atmo-catalog-filters` из `functions.php`
2. Удалить `assets/js/atmo-catalog-filters.js`
3. В `inc/atmo-catalog.php`: убрать hook, chip helpers, goal fields → вернуть `goal => null`
4. В `content-product.php`: убрать `data-goal` с `<li>`
5. В `atmo-catalog.css`: удалить блок `.atmo-catalog-filters` … `--filtered-out`

#### Rollback step 3 (DB assignments only)

```sql
START TRANSACTION;

DELETE tr FROM wp_term_relationships tr
INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
WHERE tt.taxonomy = 'pa_goal'
  AND tr.object_id IN (
    24, 32, 727, 859, 964, 1121, 1275, 1418, 1541,
    1745, 1877, 2056, 2418, 2660, 2903, 3159, 3288, 3614
  );

UPDATE wp_term_taxonomy tt
SET count = (
  SELECT COUNT(*) FROM wp_term_relationships tr
  WHERE tr.term_taxonomy_id = tt.term_taxonomy_id
)
WHERE tt.taxonomy = 'pa_goal';

COMMIT;
```

#### Rollback step 2 (DB attribute + terms, slug-based)

```sql
START TRANSACTION;

DELETE tr FROM wp_term_relationships tr
INNER JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
WHERE tt.taxonomy = 'pa_goal';

DELETE FROM wp_term_taxonomy WHERE taxonomy = 'pa_goal';

DELETE FROM wp_terms
WHERE slug IN ('energy', 'mobility', 'strength', 'recovery');

DELETE FROM wp_woocommerce_attribute_taxonomies WHERE attribute_name = 'goal';

DELETE FROM wp_options
WHERE option_name IN (
  '_transient_wc_attribute_taxonomies',
  '_transient_timeout_wc_attribute_taxonomies'
)
OR option_name LIKE '_transient_wc_attribute_taxonomies%';

COMMIT;
```

---

## 2026-05-20 — PDP: fix Snippet 9 CSS leak (earlier QA)

### Theme files

| File | Change |
|---|---|
| `inc/atmo-product.php` | `atmo_clean_course_info_card_html()` — strip inline `<style>` / orphaned CSS before output |
| `assets/css/atmo-product.css` | scoped `.custom-info-card` styles in `.atmo-pdp-desc` |

### Rollback

Убрать helper + CSS block `.custom-info-card`; Snippet 9 снова «течёт» через `wp_kses_post`.

---

## Рекомендуемый следующий шаг

**Cart:** done — ATMO layout shell (`064a478`); see **2026-05-21 — Woo cart ATMO layout shell**.  
**Checkout:** done — ATMO visual shell (`1b00a0c`) + mobile compact spacing (`8f98db0`); see **2026-05-21 — Woo checkout ATMO visual shell**.  
**Checkout follow-ups (next):** terms/link-only decision; static `/payment-failed/` page not implemented (notices styled in `abc2ef1`). Mobile compact spacing done (`8f98db0`); sticky CTA deferred.  
**Pricing:** closed — Woo canonical; prototype `price` / `oldPrice` non-authoritative (see **2026-05-21 — Price policy**). No bulk price updates planned.  
**PDP (optional):** variable access-tier UI polish for 3614 — separate from pricing.  
**Catalog (optional):** `display_title` on catalog cards; category/tag-aware chip URLs; remove retired `atmo-catalog-filters.js` (already deleted in `aba83cd`).
