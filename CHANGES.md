# ATMO.BY — ручной журнал изменений

> Git в `kadence-child`: repo active (baseline `d61ca38`). Этот файл — source of truth для **DB** + cross-repo rollback notes.  
> Child theme path: `D:\Local Sites\atmo_redesign\app\public\wp-content\themes\kadence-child`  
> **Open tasks:** `BACKLOG.md` (active backlog; older entries here may be superseded)

---

## 2026-05-22 — Woo My Account completed view-order fixture QA

- **Scope:** read-only QA; no code/DB/Snippets/Woo settings changes; fixture order #3801 (manual WP Admin)
- **Pages:** `/my-account/orders/`, `/my-account/view-order/3801/`
- **Fixture:** #3801 completed, r4t5 / user 679, 1 item «Живот и Тазовое дно - 60 дней», qty 1, 399 PLN; #3800 unchanged (pending, 0 items)
- **Viewports:** desktop 1440×900, mobile 390×844
- **Result:** PASS — completed order row; line item shell; qty/total; customer details; order-again visible (not clicked); no pay/cancel on completed view; no page overflow; no `.atmo-dash` leak on view-order
- **Partial:** access type «60 дней» visible in product title/URL; no structured item meta row/pill (`wc-item-meta` / `variation` empty)
- **Still open (optional):** structured variation/meta pill rendering; saved payment-methods table with stored cards
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
- **Not fully QA'd:** `/edit-address/shipping/` form, downloads list with files, payment-methods table with saved cards
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
