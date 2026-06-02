# ATMO prototype coverage audit

Last updated: 2026-06-02 (lesson parity audit)
Scope: redesign only, Local + Stage2 validation where noted
Current RC status: **NOT_READY**

This file maps every HTML prototype screen to the current WordPress/theme implementation. It is the gate for design completeness: do not call the redesign a release candidate while any required screen is `missing`, `partial`, or `blocked-by-content`.

## Status Key

| Status | Meaning |
|---|---|
| `implemented` | Visual/structural transfer is complete enough for current scope and recently checked. |
| `partial` | Route/template exists, but notable prototype parity gaps remain. |
| `missing` | No child-theme route/template/skin exists yet. |
| `blocked-by-content` | Implementation waits for approved copy/legal/content. |
| `temporary-reference` | Prototype helper output, not a user-facing screen to port. |

## Coverage Matrix

| Prototype file / screen | Intended WP URL/template | Status | Evidence | Gap / next action |
|---|---|---|---|---|
| `index.html` | `/` via `front-page.php` + `atmo-home.css` | `partial` | **Marketing parity audit PASS_LOCAL (2026-06-02):** Hero (eyebrow, H1, lead, stats, featured product card #3614), Featured (#atmo-featured), Paths (#atmo-paths ×3 → real PDPs); header CTAs `/каталог/` + `/courses/`; mobile 390 no overflow. QA read-only Local. | Section 04 Social (`parts/social.jsx`) **not shipped** — demo testimonials/before-after need owner/CMS sign-off; hero/featured images `.atmo-ph` where no WP thumbnail (#3614); variable price range on hero/featured; no closing ink CTA strip from prototype. |
| `catalog.html` | `/каталог/` Woo shop archive via `inc/atmo-catalog.php`, `woocommerce/content-product.php`, `atmo-catalog.css` | `implemented` | Local QA 2026-06-01; child commit `a8e81e5`. | Pagination remains because real Woo archive has more products than one static prototype view. |
| `product.html` | `/product/{slug}/` via `woocommerce/content-single-product.php` + `atmo-product.css` | `partial` | **Marketing parity audit PASS_LOCAL (2026-06-02):** hero grid/cover, breadcrumb, eyebrow/title/meta/lead, buy box (price + Klarna note + WVS access swatches + ATC + trust), stats grid, `[course_info_card]` block, Woo tabs, related «Если эта не подходит»; variation hero price sync (`4132f1f`); enrolled panel regression non-destructive (2026-06-02). QA: guest curl + **691** no-access + **679** owner + LevelUp **2903** + mobile 390. | Prototype-only: gift CTA/note; separate «Что это даёт» who-grid + native FAQ `<details>` (live copy in description/tabs); variable PDP bottom CTA (Snippet 12) deferred by design; minor eyebrow tick vs `with-tick`. |
| `product-enrolled.html` | Post-purchase/enrolled product or course access state | `partial` | **Dual surface (2026-06-02):** canonical hub `/my-account/my-courses/?course_id={id}` (full continue/progress/outline); logged-in PDP access panel on related Woo products (`inc/atmo-product.php`, `atmo-product.css`) — message, progress, continue/hub/review CTAs; purchase UI kept. | Prototype coral hero + sticky progress + lesson outline + video/tick-list not on PDP (hub-only); per-course accent; Теория/Практика grouping; drip locks. |
| `cart.html` | `/cart-2/` via `inc/atmo-cart.php` + `atmo-cart.css` | `partial` | **Marketing parity audit PASS_LOCAL (2026-06-02):** 1.4fr/1fr grid, line-item cards, eyebrow count, «Убрать из корзины», variation pills, sticky totals, coupon row, trust bullets, cross-sells; empty `.cart-empty` shell; checkout redirect with fixture. QA: empty guest curl + filled browser fixture **variation 3628** (60 дней). | Slug `/cart-2/`; empty state copy/CTAs vs prototype (icon + dual CTA); totals H2 «Сумма корзины» not «К оплате»; coupon in form actions not summary sidebar; no qty stepper (courses); no prototype bundle discount row. |
| `checkout.html` | `/checkout/` via `inc/atmo-checkout.php` + `atmo-checkout.css` | `partial` | **Marketing parity audit PASS_LOCAL (2026-06-02):** steps bar (Корзина/Оформление/Готово), H1, coupon/login toggles, billing «Платёжные реквизиты» + «Детали» (Instagram optional), order-review card «Ваш заказ», payment shell (BLIK default + Klarna), privacy + terms + «Подтвердить заказ»; empty cart → `/cart-2/`; mobile 390 no overflow. QA: session **679** fixture **3628**; no order submit. | Not pixel-perfect; prototype demo card form/UPE not ported; **Local** lacks card radio (BLIK/Klarna only — card on Stage2 per 2026-05-31); Woo two-column IA vs prototype payment inside summary card; Polish terms block inline; saved-payment checkbox noise. |
| `order-confirmation.html` | `/checkout/order-received/{id}/` via `inc/atmo-confirmation.php` + `atmo-confirmation.css` | `partial` | Layer + «Платёж» receipt card (real totals) on valid key + `completed`; owner QA #3801 2026-06-02. | No PDF «Скачать чек» (prototype demo-only); invalid/missing order → generic Woo shell; guest without key sees login/verify gate. |
| `payment-failed.html` | `/payment-failed/` via virtual route + `page-payment-failed.php` | `implemented` | Code-owned route `35806f0`; Stage2 smoke PASS. | Generic failure page by design. |
| `account.html` | `/my-account/` dashboard via `inc/atmo-account.php` + `atmo-account.css` | `partial` | Account shell and dashboard shipped. | Dashboard intentionally does not include full course/progress widgets. |
| `orders.html` | `/my-account/orders/` and `/my-account/view-order/{id}/` | `partial` | Pass 3b (2026-06-02): «Состав» column + access meta, RU headers, «Подробнее →», status dots, ATMO empty shell (691), view-order payment/email card; owner QA #3801 / 679. | Prototype modal detail vs separate view-order page; Woo status labels (e.g. «Выполнен» not «Оплачен»); no in-page modal. |
| `profile.html` | `/my-account/edit-account/` and related account settings | `partial` | Pass 4b (2026-06-02): «Настройки профиля» title, settings cards (личные данные + пароль), email hint, password strength UX, ink save CTA; owner QA user **679**; single Woo save form preserved. | No separate E-mail card (merged with personal); no notification toggles or delete-account zone (no user meta); per-section save CTAs deferred; LearnDash `/profile/` not skinned. |
| `auth.html` | Logged-out `/my-account/` Woo auth form | `implemented` | Auth shell v2 (`inc/atmo-auth-shell.php`, `atmo-account.css`, `atmo-auth-shell.js`): tabs, hero copy, visual quote, form cards. | No standalone `/auth/` route (Woo canonical). No social OAuth buttons from prototype. |
| `reset-password.html` | `/my-account/lost-password/` + Woo `action=rp` reset form | `partial` | Lost-password + reset shells styled; password toggle + strength meter JS on reset form when token present. | Valid reset token not QA'd locally (no email send); strength meter is UX-only, not enforced server-side. |
| `courses.html` | Account "Мои курсы" (prototype) + public programs browse | `partial` | `/my-account/my-courses/` + hub shipped; public `/courses/` skinned as «Программы» (`inc/atmo-courses.php`, `atmo-courses.css`) with IA copy vs Каталог/Мои курсы. | Prototype `courses.html` is aspirational enrolled UI (demo off); no fake progress on public archive. List/grid toggle and account-sidebar layout not ported to LD archive. |
| `lesson.html` | `/lessons/{slug}/` LearnDash lesson chrome | `partial` | **Parity audit PASS_LOCAL (2026-06-02):** content card (`.ld-layout__content`), H1 «Урок N ·», breadcrumbs, hub back link `?course_id=3616`, mark-complete + prev/next; diary `#ldtd` on `/lessons/01-2/`; first lesson `atmo-lesson--no-prev`. QA user **679** course **3616**; no progress submit. | No LD template override; prototype mock video/crumb layout differs; guest lesson **302**; adapter follow-up for direct `learndash_*` in `atmo-lesson.php` (outline prefix already uses `atmo_lms_*`). |
| `course-complete.html` | Course completion celebration (account hub) | `partial` | Option B shipped: `/my-account/my-courses/?course_id={id}` → `atmo_render_course_hub_completed` when `status=completed`. Review CTA → Woo `#reviews` (LD **3616** → `/product/abdomen_pelvic/#reviews`). QA fixture: **atmo-qa-completed** (ID **692**). | No inline review form; «Что дальше» = catalog CTA only (no product card grid); stats use real lessons/steps/days not prototype weeks/hours. |
| `404.html` | WP 404 via `404.php` + `atmo-404.css` | `implemented` | Branded 404 QA passed. | None for current scope. |
| `terms.html` | `/terms/` | `implemented` | Code-owned route + `page-legal.php` + `atmo-legal.css`; body from Stage2 `regulamin-sklepu-internetowego` (Polish legal, read-only export). | Prototype `terms.html` is Russian reference layout; live copy is Stage2 Polish regulamin, not Russian prototype text. Footer slug `/terms/` maps to portable theme route. |
| `privacy.html` | `/privacy/` | `implemented` | Code-owned route + shared legal template; body from Stage2 `polityka-prywatnosci` (Polish, read-only export). | Prototype `privacy.html` is Russian reference; live copy is Stage2 Polish policy. Optional later: Russian localization sign-off. |
| `_tmp_all.html`, `_tmp_energy.html`, `_tmp_p1.html`, `_tmp_p2.html` | None | `temporary-reference` | Generated prototype/reference outputs. | Do not port directly. |

Removed from scope:

- `trainer.html` / `/trainer/` removed on 2026-06-01 by product decision. Do not treat it as a missing or blocked release screen.

## Release Readiness

RC status: **NOT_READY**

Reasons:

- Required prototype screens remain `partial`: homepage, PDP, cart, checkout, order confirmation, account/orders/profile, courses/my-courses, lesson, reset password.
- `course-complete.html` remains `partial` (celebration hub shipped; no product-card «Что дальше» grid).
- `reset-password.html` partial — shell styled; full reset flow needs tokenized URL QA when mail available.
- `/terms/` and `/privacy/` implemented with Stage2-sourced Polish legal copy on prototype layout (2026-06-01).
- Public `/courses/` IA copy shipped (2026-06-01): catalog = purchase; my-courses = owned access; programs archive = browse structure before purchase.

## Recommended Design Slices

1. PDP marketing residual only (`product.html`: gift CTA, who-grid/FAQ layout split, variable bottom CTA); enrolled full-page hero/outline remains hub-first.
2. Auth/reset password flow (`auth.html`, `reset-password.html`).
3. ~~Public `/courses/` archive IA/skin~~ — Local skin shipped; enrolled list parity remains on `/my-account/my-courses/`.
4. Course completion flow (`course-complete.html`).
5. Homepage deferred blocks.
