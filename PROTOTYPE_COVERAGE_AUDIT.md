# ATMO prototype coverage audit

Last updated: 2026-06-06 (Stage2 homepage 0.1.6 smoke)
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
| `index.html` | `/` via `front-page.php` + `atmo-home.css` | `partial` | **Stage2 smoke PASS (2026-06-06):** child 0.1.6 / `860cb2b` active; hero 3 stats + YouTube pill; real approved Woo reviews via `inc/atmo-home-social.php` (`db25c75` + diversity `b6e4566`), no avatars/fake testimonials, excerpt + expand, newest-first with max one reviewer and one product/course; Social→Closing spacing fixed. | Social before/after transformation row remains content-blocked; rich hero card body/summary still deferred; overall homepage still partial until final visual regression/RC gate. |
| `catalog.html` | `/каталог/` Woo shop archive via `inc/atmo-catalog.php`, `woocommerce/content-product.php`, `atmo-catalog.css` | `implemented` | Local QA 2026-06-01; child commit `a8e81e5`. | Pagination remains because real Woo archive has more products than one static prototype view. |
| `product.html` | `/product/{slug}/` via `woocommerce/content-single-product.php` + `atmo-product.css` | `partial` | **Micro-parity PASS_LOCAL (2026-06-02):** pass 3 CSS. **PDP who/FAQ PASS_LOCAL (2026-06-03):** theme registry `inc/atmo-pdp-content.php` — **18/18** approved slugs (`b7e5556` pilot + `dde8dcf` wave 2). **Hero trust PASS_LOCAL:** `35a6fc9` kind-aware copy for course / diagnostic / service. **Seam polish PASS_LOCAL:** child `05fc665` FAQ→tabs CSS + diagnostic short-info (`testmyself`); operator CMS dedupe sheet `PDP_CMS_CLEANUP_CHECKLIST.md` (not executed). | Gift CTA/FAQ still blocked; prototype «Не подходит» column not implemented; Woo `_atmo_*` meta + legacy tab description dedupe need operator/CMS pass; variable bottom CTA hidden via CSS (Snippet 12). |
| `product-enrolled.html` | Post-purchase/enrolled product or course access state | `partial` | **Dual surface (2026-06-02):** canonical hub `/my-account/my-courses/?course_id={id}` (full continue/progress/outline); logged-in PDP access panel on related Woo products (`inc/atmo-product.php`, `atmo-product.css`) — message, progress, continue/hub/review CTAs; purchase UI kept. | Prototype coral hero + sticky progress + lesson outline + video/tick-list not on PDP (hub-only); per-course accent; Теория/Практика grouping; drip locks. |
| `cart.html` | `/cart-2/` via `inc/atmo-cart.php` + `atmo-cart.css` | `partial` | **Coupon-in-summary PASS_LOCAL (2026-06-03):** promo row in `.cart_totals` before order total (separate POST form); Woo actions coupon hidden CSS; fixture **3628**; remove item OK. Prior: empty shell + «К оплате» (2026-06-02). | Slug `/cart-2/`; prototype bundle discount row (fake); no qty stepper; hidden Woo actions coupon still in DOM (disabled visually, not template-removed). |
| `checkout.html` | `/checkout/` via `inc/atmo-checkout.php` + `atmo-checkout.css` | `partial` | **Payment-in-summary micro-parity PASS_LOCAL (2026-06-02):** `.atmo-checkout-summary` wrapper (heading + `#order_review` + `#payment` — Woo DOM unchanged); unified order card + sticky sidebar ≥920px; terms footer divider; steps/coupon/billing/payment shell/«Подтвердить заказ»; empty cart → `/cart-2/`; mobile 390. QA: guest fixture **3628**; no `#place_order`. | Not pixel-perfect; prototype demo card form/UPE not ported; **Local** no card radio (BLIK/Klarna — card on Stage2); Polish terms inline; saved-payment checkbox noise; no fake secure-note emoji. |
| `order-confirmation.html` | `/checkout/order-received/{id}/` via `inc/atmo-confirmation.php` + `atmo-confirmation.css` | `partial` | **Micro-parity PASS_LOCAL (2026-06-02):** success layer (hero, courses, «Платёж» receipt, «Что дальше», CTAs); branded **unavailable** shell `/order-received/999/` (no fake totals); **processing** shell for valid key + non-completed; owner QA **#3801** key + user **679** — course CTA `course_id=3616`. | No PDF «Скачать чек» (demo-only); guest without key → Woo login/verify gate (unchanged); success «Что дальше» icons pre-existing. |
| `payment-failed.html` | `/payment-failed/` via virtual route + `page-payment-failed.php` | `implemented` | Code-owned route `35806f0`; Stage2 smoke PASS. | Generic failure page by design. |
| `account.html` | `/my-account/` dashboard via `inc/atmo-account.php` + `atmo-account.css` | `partial` | **Parity audit PASS_LOCAL (2026-06-02):** Kadence account nav IA (Обзор/Мои курсы/Заказы/Настройки/Выйти); `.atmo-dash` greeting+date; next-step hero from adapter (`Продолжить` for **679**); courses panel; profile + last-order (real Woo for **679**, empty copy for **691**). QA read-only; my-courses + orders regression. | Prototype-only: diary progress + trainer-reply widgets (localStorage demo); program rows/stats/streak/circle hero; nav SVG icons; no fake widgets on live by design. |
| `orders.html` | `/my-account/orders/` and `/my-account/view-order/{id}/` | `partial` | Pass 3b (2026-06-02): «Состав» column + access meta, RU headers, «Подробнее →», status dots, ATMO empty shell (691), view-order payment/email card; owner QA #3801 / 679. | Prototype modal detail vs separate view-order page; Woo status labels (e.g. «Выполнен» not «Оплачен»); no in-page modal. |
| `profile.html` | `/my-account/edit-account/` and related account settings | `partial` | Pass 4b (2026-06-02): «Настройки профиля» title, settings cards (личные данные + пароль), email hint, password strength UX, ink save CTA; owner QA user **679**; single Woo save form preserved. | No separate E-mail card (merged with personal); no notification toggles or delete-account zone (no user meta); per-section save CTAs deferred; LearnDash `/profile/` not skinned. |
| `auth.html` | Logged-out `/my-account/` Woo auth form | `implemented` | Auth shell v2 (`inc/atmo-auth-shell.php`, `atmo-account.css`, `atmo-auth-shell.js`): tabs, hero copy, visual quote, form cards. | No standalone `/auth/` route (Woo canonical). No social OAuth buttons from prototype. |
| `reset-password.html` | `/my-account/lost-password/` + Woo reset cookie flow (`show-reset-form` + `key`/`login` → cookie → form) | `partial` | **Micro-parity PASS_LOCAL (2026-06-02):** shells + pass 3 residual (`inc/atmo-account.php` gettext + logged-in redirect; `atmo-account.css` reset/sent tabs hidden, notice cards, match hints without symbols, mobile clip). Prior: `inc/atmo-auth-shell.php`, `atmo-auth-shell.js`. QA: logged-out `/my-account/` + `/lost-password/`; logged-in **679** redirect off lost-password; dashboard regression; mobile 390. **No** mail submit / password change. | Prototype demo success screen not ported (Woo post-submit only); E2E mail + real reset submit deferred; OAuth; JS strength UX-only (WP/Woo enforce). |
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
- `reset-password.html` partial — shells + micro-parity residual PASS_LOCAL (2026-06-02); deferred: prototype success UI, mail E2E.
- `/terms/` and `/privacy/` implemented with Stage2-sourced Polish legal copy on prototype layout (2026-06-01).
- Public `/courses/` IA copy shipped (2026-06-01): catalog = purchase; my-courses = owned access; programs archive = browse structure before purchase.

## Recommended Design Slices

1. ~~**PDP FAQ/who implementation**~~ — **shipped Local** 2026-06-03 (`inc/atmo-pdp-content.php`, 18/18); gift FAQ still blocked until gift contract.
2. ~~Order-confirmation funnel micro-parity~~ — invalid/processing shells + receipt polish **shipped** 2026-06-02; PDF чек deferred.
3. ~~Auth/reset residual~~ — submit copy, logged-in redirect, reset tabs/notice polish shipped 2026-06-02; prototype success UI + mail E2E deferred.
4. ~~Cart micro-parity~~ — empty dual CTA + «К оплате» shipped 2026-06-02; coupon-in-summary deferred.
5. ~~Homepage residual / Social~~ — closing CTA + price/thumb polish shipped 2026-06-03; real Woo review Social shipped `db25c75`; diversity filter shipped `b6e4566`; Stage2 homepage 0.1.6 smoke PASS 2026-06-06 (`860cb2b`).
