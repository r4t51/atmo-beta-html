# ATMO.BY — project backlog

> Short, practical backlog — **source of truth for open tasks** + compact reference (not a second changelog).
> **Milestone:** `MILESTONE_SHELL_ACCOUNT_LMS.md` (baseline 2026-05-22 · updated 2026-05-24 account fixture polish closed).
> History/rollback: `CHANGES.md` · Child theme: `kadence-child` · Prototypes: this repo.

---

## Done — ATMO shell/wiring phase (re-QA 2026-05-22)

Child theme wiring/shell complete for public Woo flows; read-only QA PASS (see `CHANGES.md`). **Account fixture polish closed 2026-05-24** — no mandatory account theme work. **Next:** optional catalog/PDP polish or explicit `atmo-lms-lite` API/cutover contract later — not more shell wiring unless a functional gap appears.

| Area | Status |
|------|--------|
| Header / footer | ✅ ATMO child chrome |
| Catalog + goal chips | ✅ MVP + server-side `filter_goal` |
| PDP | ✅ simple + variable #3614 |
| Cart | ✅ `atmo-cart.css` + cross-sells |
| Checkout | ✅ `atmo-checkout.css`; gateways visible on Local (**BLIK** default, **Klarna**); cart-fixture QA PASS 2026-05-22 |
| Order received | ✅ `atmo-confirmation.css` |
| Account | ✅ passes 1–5 + dashboard + view-order meta (detail below) |
| Preview mu-plugin | ✅ **keep for now** — opt-in only (`?atmo_preview_shell=1`) |

**By design / not built:** `/payment-failed/` → 404; dashboard course list/progress widgets (CTAs only — `648e562`); payment-token live QA.

### Account / Woo (detail)

- Logged-out auth shell + re-QA (`353346c`, pass 1)
- Logged-in account shell / nav / menu IA (`3122f4f`, `d4ee689`, pass 2a)
- Static dashboard shell — next step, courses CTA, profile, last order (`534b241`, pass 2b); dashboard adapter CTA wiring (`648e562`, phase 3)
- Orders list + view-order shell CSS (pass 3); mobile orders actions fix (`fcca2e5`)
- Settings form (pass 4); hidden endpoints (pass 5)
- add-payment-method read-only audit (2026-05-22)
- Completed view-order fixture QA — #3801 (2026-05-22): line item shell, qty/total, customer details, order-again **visibility** verified (not clicked)
- View-order access-type meta pill — `тип-доступа` (`2da518f`, 2026-05-22): structured **Тип доступа: 60 дней** on #3801; Woo-skipped meta only; duplicate guard
- Address endpoints read-only QA (2026-05-22): `/edit-address/` index + billing/shipping forms PASS; empty r4t5 profile verified; #3801 order-level billing block sanity
- Account regression QA after adapter MVP (`a352081`, 2026-05-22): 8 routes × desktop/mobile PASS — see `CHANGES.md`; no functional regressions; view-order #3801 pill intact; `/courses/` public archive unchanged
- Dashboard CTA wiring for my-courses (`648e562`, 2026-05-22): stale LMS copy removed; «Следующий шаг» + courses panel wired to adapter / my-courses — see `CHANGES.md`; my-courses page unchanged
- Zero-enrollment empty-state QA (`691` / `atmo-qa-empty`, 2026-05-22): dashboard + my-courses empty paths PASS desktop/mobile — see `CHANGES.md`
- Account LMS copy polish (`4e180b9`, 2026-05-22): removed LearnDash + raw endpoint paths from user copy; CTAs/adapter unchanged — atmo-qa-empty QA PASS; r4t5 enrolled path re-QA superseded by hub v1 QA (`81c3a7d`, `CHANGES.md` 2026-05-23)
- Cart + checkout with cart fixture QA (2026-05-22): session **1× #3628**; checkout payment UI PASS desktop/mobile; BLIK/Klarna visible — see `CHANGES.md`

### Catalog + PDP public polish (2026-05-23)

- Catalog toolbar/cards — `6f4790b`: goal labels on cards; result count + grid/list toggle hidden; sort + pagination kept
- Catalog content cleanup (WP Admin, not VCS): `pa_goal energy` typo **Энергиѯ→Энергия**; product **Интенсив. Осанка, Шея, Лицо** — removed Misc, assigned **Тренировки**; **ФИТНЕС СЕЗОН 3** marketing short description
- PDP hero price sync — `4132f1f`: tier-specific hero price + reset restores range on `#3614`
- PDP Woo tabs ATMO styling — `106250d`
- Snippet 12 variable PDP skip — runtime (WP Admin) + docs `ece38f6`
- QA PASS — see `CHANGES.md` → 2026-05-23 Catalog + PDP public polish milestone; **Add to cart/checkout/payment not clicked**

### LearnDash public course URL hygiene (2026-05-23)

- LearnDash Closed `#btn-join` custom URLs + one course body link — `atmoredesign.local.local` host typo fixed via WP Admin (runtime/content only)
- Logged-out crawl **18** course pages from `/courses/` — **0** remaining `local.local` in course HTML — see `CHANGES.md`
- Snippet **#5** (inactive) still has broken redirect URL in source — not part of this fix

### LMS account course hub v1 (2026-05-23)

- Account enrolled course hub on existing **`/my-account/my-courses/?course_id={id}`** — child theme **`81c3a7d`**
- **`course_hub_url`** → account hub; **`permalink`** → public LD course; **«Продолжить»** → LD lesson URL
- No new rewrite · no permalink flush · no LD template overrides · no `atmo-lms-lite` front-end UI
- QA PASS — r4t5 / atmo-qa-empty / public route regression — see `CHANGES.md`

### LD lesson chrome v1+v2 (2026-05-23)

- **v1** — `ed7afcf`: `.ld-layout__header` suppressed; content card; nav; mark-complete pill; back link → account hub via `learndash_template_progression_step_back_to_course_url`
- **v2** — `1e08a3d`: first-lesson prev link hidden (`atmo-lesson--no-prev` body class via `learndash_previous_post_link()`); back label → «Вернуться к программе» via `learndash_template_progression_step_back_to_course_label`
- **Stabilization** — `897409c`: LearnDash hook guards + CSS rule cleanup (no viewport-scaled padding, no negative letter spacing)
- No LD template overrides; `kadence-child/learndash/` not created
- QA PASS — r4t5 / atmo-qa-empty / logged-out / hub + catalog regressions — see `CHANGES.md`

### Lesson H1 number prefix (2026-05-24)

- **`caaaa96`**: singular LD lesson Kadence entry H1 → **`Урок N · {title}`** via `the_title` filter + scope hooks; outline order from **`atmo_lms_get_course_lesson_outline()`**; logged-in only; user-aware cache guard
- No LD template overrides; no `atmo-lms-lite` integration
- QA PASS — Codex WP-CLI simulation + logged-out HTTP — see `CHANGES.md`

### `atmo-lms-lite` bridge decision (2026-05-24)

- Future LearnDash replacement; active on Local but **defer runtime integration** — empty enrollment/access tables; no theme-facing front-end API/UI; stay LearnDash-backed ViewModels until stable read API + cutover readiness — see `CHANGES.md`

---

## 1. Account / Woo — reference (fixture polish closed 2026-05-24)

| Item | Notes |
|------|--------|
| Saved payment-methods table with stored cards | **Avoid unless explicit** — 0 tokens in fixtures 679/691; needs payment token / saved-card scope |
| Downloads list with real files | **No action** until downloadable SKU/grant — Pass 5 empty state sufficient (0 products, 0 grants) |
| ~~Saved billing/shipping profile cards + edit links~~ | ✅ Done 2026-05-23 — r4t5 populated (Anastasiya Vidruk / Warszawa / PL / MZ) |
| ~~Filled address forms (all fields populated)~~ | ✅ Done 2026-05-23 — index cards + shipping form verified |
| ~~View-order shipping customer block~~ | **No action** — #3801 has no shipping meta (fixture absent); not a CSS/template bug |
| ~~Dashboard dev pill `WooCommerce · shell`~~ | ✅ Done `dc1e2be` 2026-05-24 — removed; **«Аккаунт активен»** kept |
| Billing edit field subset (optional) | Low priority Woo locale/config — billing edit UI omits address/state/phone; meta on index cards; no child-theme filter |
| Address save/validation flow | Out of scope unless explicit |
| Woo default dashboard `<p>` in DOM | Hidden by CSS when `.atmo-dash` present; template override optional later |

**Local fixtures**

- **r4t5 (679) / #3801** — enrolled path: completed, 1 line item → LD course 3616; order-again visible (not clicked)
- **atmo-qa-empty (691)** — zero-enrollment path: customer, 0 orders, 0 LD meta; Local-only QA fixture — delete in WP Admin when done
- **#3800** — pending, 0 items; keep for empty/pending/cancel shell QA

---

## 2. LMS / Courses — reference & open

**Closed LMS decisions (#1–12):** see Done block above · `CHANGES.md` · `LMS_ADAPTER_SPEC.md` §2 · `MILESTONE_SHELL_ACCOUNT_LMS.md` §5.

### Open

| Item | Notes |
|------|--------|
| ~~**Lesson-number prefix in title**~~ | ✅ Done **`caaaa96`** 2026-05-24 — «Урок N ·» on Kadence entry H1; hub outline order; logged-in only — see `CHANGES.md` |
| ~~Pending-order rows on my-courses~~ | ✅ Closed 2026-05-23 — #3800 is ghost (0 items); excluded by design; no UI change; keep #3800 for cancel/expired shell QA |
| **`atmo-lms-lite` runtime integration** | **Deferred / bridge only** — future replacement; Local tables empty; no current theme UI dependency; next step = explicit API/cutover contract when product-ready — not blocking redesign |

**Next likely (optional / product-scoped):** explicit `atmo-lms-lite` API/cutover contract · catalog/PDP optional polish · static `/payment-failed/` page — see §4–§5.

### Current routes (reference)

| Route | Role |
|-------|------|
| `/courses/` | LearnDash **public CPT archive** — nav **«Программы»** (header/footer); **18** cards; not enrolled-only |
| `/my-account/my-courses/` | Enrolled list — adapter `get_enrolled_courses()` — `a352081` |
| `/my-account/my-courses/?course_id={id}` | **Account hub v1** — enrolled overview + lesson outline — `81c3a7d` |
| `/lessons/{slug}/` | LearnDash lesson body — **«Продолжить»** from hub/list lands here |

Runtime: LearnDash `sfwd-lms` + Woo bridge · `atmo-account.css` on `is_account_page()` only · `atmo-lms-lite` active on Local (future replacement; **bridge only** — no theme UI dependency; Local tables empty).

**Rejected routes (archive):** standalone `/my-courses/` · LD shortcode enrolled page · wait-for-lite-only — see `LMS_ADAPTER_SPEC.md` §2.

### Do not do

- Do not build `kadence-child/learndash/` overrides without confirming Modern path support (discovery 2026-05-23: LD30 Modern uses `src/Core/Template` engine, classic override may not apply)
- Filter `/courses/` archive to enrolled-only
- Wire `courses.html` demo data or fake progress into WP
- Build critical UI on `atmo-lms-lite` without explicit decision
- Register new Woo endpoints or change rewrites without audit + docs
- Re-enable Snippet **#5** Thank You Redirect (broken URL in source)
- Treat Woo order line items alone as enrollment UI (bridge + adapter must agree)

---

## 3. Payments — avoid unless explicit

| Item | Notes |
|------|--------|
| Stripe card on Local (HTTP + live mode) | Env/config, not theme CSS |
| BLIK / Klarna gateway availability | Woo/Stripe settings |
| add-payment-method styling beyond shell | Audited PASS; no CSS follow-up for current wiring |
| Test orders / payment flows | Use existing fixtures; no new orders without explicit ask |
| Saved cards / payment tokens | See Account → saved payment-methods table |

---

## 4. Catalog — optional

| Item | Notes |
|------|--------|
| Category/tag-aware goal chip URLs | **Optional** — chips on category/tag archives currently link to main `/каталог/?filter_goal=…` (MVP). Re-QA PASS 2026-05-22 confirms intentional behavior; implement only if product decision. See `CHANGES.md` → 2026-05-22 catalog QA. |
| `display_title` on catalog cards | Optional — cards still use `post_title`; PDP may use `_atmo_display_title` separately |

---

## 5. PDP — optional

| Item | Notes |
|------|--------|
| Variable PDP bottom CTA replacement (#3614) | **Optional** — Snippet 12 skips variable PDP after 2026-05-23; simple PDP keeps bottom CTA. Future sticky/bottom CTA if product wants one on variable pages. |
| Full PDP hero redesign | **Optional** — out of scope for 2026-05-23 polish; current hero + tabs + price sync accepted |

---

## 6. Docs / Process

| Item | Notes |
|------|--------|
| Preview mu-plugin — remove later | **Decision (2026-05-22): keep for now** — low-risk legacy comparison tool. **Local-only / unversioned:** `wp-content/mu-plugins/atmo-redesign-preview.php`, `wp-content/mu-plugins/atmo-redesign/assets/css/atmo-preview.css`. **Runtime:** no-op without `?atmo_preview_shell=1`; normal pages use child header/footer; preview assets, body classes, and legacy header/footer only with query param. **Remove when all checked:** ☐ explicit sign-off that child header/footer are canonical ☐ `?atmo_preview_shell=1` compare no longer needed ☐ backup/snapshot 2 mu-plugin files before delete ☐ optional kadence-child cleanup: `body.atmo-preview-shell-enabled` rules in `atmo-header.css` / `atmo-footer.css` + preview-font comment in `functions.php`. Details/rollback: `CHANGES.md` → 2026-05-22 preview mu-plugin discovery. |
| Code Snippets — export/version | Initial export **2026-05-22** in `docs/snippets/` — **re-export when DB snippets change** |
| Cross-repo rollback notes | Keep `CHANGES.md` as source of truth for DB + kadence-child commits |

---

*Last synced: 2026-05-24 (LMS bridge decision + lesson prefix `caaaa96`)*
