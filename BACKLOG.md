# ATMO.BY — project backlog

> Short, practical backlog — **source of truth for open tasks** + compact reference (not a second changelog).
> **Milestone:** `MILESTONE_SHELL_ACCOUNT_LMS.md` (baseline 2026-05-22 · updated 2026-05-25 order-received layer + prototype coverage).
> History/rollback: `CHANGES.md` · Child theme: `kadence-child` · Prototypes: this repo.

> **2026-05-26 safety reset:** VPS staging/deploy work is paused after production was restored from an OVH snapshot. Treat server-side changes after the snapshot as untrusted until re-audited. See `STAGING_POSTMORTEM_2026-05-26.md`.

---

## Done — ATMO shell/wiring phase (re-QA 2026-05-22)

Child theme wiring/shell complete for public Woo flows; read-only QA PASS (see `CHANGES.md`). **Account fixture polish closed 2026-05-24** — no mandatory account theme work. **Variable PDP bottom CTA deferred 2026-05-24** — not a functional blocker. **Prototype coverage audit 2026-05-24:** overall port is partial; use §0 for next work instead of drifting into isolated polish.

| Area | Status |
|------|--------|
| Header / footer | ✅ ATMO child chrome + nav active state polish `9d33b8a` (PDP/category/tag → Каталог; CPT archive → Программы); footer col 1 label «Обучение» |
| Catalog + goal chips | ✅ MVP + server-side `filter_goal` |
| PDP | ✅ simple + variable #3614 |
| Cart | ✅ `atmo-cart.css` + cross-sells · polish `3e4748f` (remove link, eyebrow, trust bullets, coupon centering) |
| Checkout | ✅ `atmo-checkout.css` + progress steps `1203858` (`inc/atmo-checkout.php`); gateways visible on Local (**BLIK** default, **Klarna**); cart-fixture QA PASS 2026-05-22 + steps QA 2026-05-25 |
| Order received | ✅ `inc/atmo-confirmation.php` + `atmo-confirmation.css` (`f9a7b95`); owner browser QA PASS #3801 / user 679 — `CHANGES.md` 2026-05-25 |
| Account | ✅ passes 1–5 + dashboard + view-order meta (detail below) |
| Preview mu-plugin | ✅ **keep for now** — opt-in only (`?atmo_preview_shell=1`) |
| WP 404 | ✅ `404.php` + `atmo-404.css` (`64f2aa8`); QA PASS 2026-05-25 — `CHANGES.md` |

**By design / not built:** dashboard course list/progress widgets (CTAs only — `648e562`); payment-token live QA.

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
- Snippet 12 variable PDP skip — runtime (WP Admin) + docs `ece38f6`; **deferred by design 2026-05-24** — see `CHANGES.md` → *Variable PDP bottom CTA deferred*
- QA PASS — see `CHANGES.md` → 2026-05-23 Catalog + PDP public polish milestone; **Add to cart/checkout/payment not clicked**

### LearnDash public course URL hygiene (2026-05-23)

- LearnDash Closed `#btn-join` custom URLs + one course body link — `atmoredesign.local.local` host typo fixed via WP Admin (runtime/content only)
- Logged-out crawl **18** course pages from `/courses/` — **0** remaining `local.local` in course HTML — see `CHANGES.md`
- Snippet **#5** (inactive) still has broken redirect URL in source — not part of this fix

### LMS account course hub visual Phase 1 (2026-05-25)

- Account hub visual polish on existing **`/my-account/my-courses/?course_id={id}`** — child theme **`b1d21b5`**
- Hero band, continue card, progress strip, outline anchor/current lesson — **`inc/atmo-account.php`** + **`assets/css/atmo-account.css`** only
- No backend/cutover; no `atmo-lms-lite`; marketing body/video/tick-list/per-course accent/grouped outline **not** implemented
- Owner QA PASS — r4t5 / course 3616 / desktop + mobile — see `CHANGES.md`

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

### Lesson plugin blocks CSS Phase 1 (2026-05-25)

- Plugin/content blocks inside LD lessons — child theme **`d37665b`**
- **`assets/css/atmo-lesson.css`** only — diary `#ldtd`, reflection `.atmo-rf-wrap`, photos `.ldtd-photos-block`, compare `.ldtd-compare-block`; scoped `body.single-sfwd-lessons`
- No PHP/plugin/DB changes in child theme; lesson chrome unchanged
- Owner QA PASS — r4t5 / course 3616 / desktop + mobile — see `CHANGES.md`

### Plugin asset enqueue tightening (2026-05-25)

- **Local runtime fix (outside git)** — `atmo-reflection-forms.php` + `learndash-training-diary.php` on Local only
- Reflection CSS/JS and `ldtd.css` now load only on logged-in `sfwd-lessons` posts with matching shortcodes; `ldtd-progress-photos.js` unchanged (already shortcode-scoped)
- Preserved patches under `docs/patches/plugin-enqueue/` (mirrored from `C:\tmp\atmo-handoff\`) — see `CHANGES.md`; **deploy:** apply patches or copy already-fixed Local plugin PHP files; **`.bak` = rollback only**; tracked plugin repo preferred long-term — not child-theme git pull
- Guest + owner QA PASS — r4t5 **9/9** routes — see `CHANGES.md`; R3 closed locally; **residual risk = deployment/documentation only**

### `atmo-lms-lite` bridge decision (2026-05-24)

- Future LearnDash replacement; active on Local but **defer runtime integration** — empty enrollment/access tables; no theme-facing front-end API/UI; stay LearnDash-backed ViewModels until stable read API + cutover readiness — see `CHANGES.md`

### LMS adapter entitlement fallback (2026-05-29) — **Done / Shipped**

- **Shipped:** child theme **`ec5982c`** (adapter → `inc/atmo-lms-adapter.php`) + **`9bb70ed`** (manual LD fallback, Woo-first merge, `grant_source=learndash_manual`).
- **Stage2 QA PASS (2026-05-29):** **r4t5**, course **3616** — my-courses card («Доступ открыт», «Срок не указан»), hub + 14 lessons, lesson return link to hub; no fatal/prod redirect.
- **Woo `woo_order` QA PASS (2026-05-29):** stage2 order **#3910** (`r4t5`, «Живот и Тазовое дно - 60 дней», 399zł, completed) — single Woo-enriched card, **60 дней**, finite dates, hub + lesson return link.
- **Follow-up (open):**
  - ~~Guest **`/my-account/my-courses/`** login gate check~~ — **PASS 2026-05-29** (Woo login form; no enrolled course content leaked).
  - Verify LD meta enrollment for test users when expecting specific courses; LevelUp mapping confirmed **2903 product → 2905 LD course**, and hub works when **2905** is in `learndash_get_user_courses_from_meta`.

### Payment-failed route (2026-05-24 template · 2026-05-30 code-owned)

- **`/payment-failed/`** — child theme virtual route (`inc/atmo-static-routes.php`) + `page-payment-failed.php` / `atmo-payment-failed.css` (`c9ac2b1` + `35806f0`)
- **No WP page required** for deploy; legacy Local page **#3807** optional/compatible
- Generic failure UX only; Woo order-specific failed flow stays on `/checkout/order-received/{id}/?key=...` (`atmo-confirmation.css`)
- QA PASS Local + Stage2 child **0.1.1** — see `CHANGES.md` 2026-05-30/31

### Catalog taxonomy-aware goal chips (2026-05-24)

- **`7b163be`**: goal chip URLs preserve shop/category/tag archive base; «Все» clears `filter_goal` + pagination params
- One file: `inc/atmo-catalog.php`; query/CSS/JS unchanged; product tags not live-tested (no tags on Local)
- QA PASS — see `CHANGES.md`

### Catalog card display titles (2026-05-21)

- **`4993bd9`**: `atmo_build_course_card()` uses `_atmo_display_title` with Woo name fallback; PDP ViewModel same pattern
- One file: `inc/atmo-catalog.php`; 18/18 redesign products have meta locally; 7 card titles differ from `post_title`
- QA PASS — see `CHANGES.md`

### Legacy `/catalog/` redirect (2026-05-25)

- Child theme **`a0ec00b`** — `inc/atmo-catalog.php` only
- **301** redirect `/catalog/` and `/catalog` → live `/каталог/`; query string preserved; product/category/tag routes unchanged
- HTTP QA PASS — see `CHANGES.md`; Kadence `#colophon` footer bleed audit claim **not visually confirmed** (hidden via CSS)

### LearnDash CSS dequeue on non-LD routes (2026-05-25)

- Child theme **`9d8c49e`** — `functions.php` only
- **`atmo_is_learndash_context()`** + **`atmo_dequeue_ld_css_on_non_ld()`** on `wp_print_styles` priority 100
- Dequeues **10** LD/Kadence CSS handles off non-LD routes; **`learndash-admin-bar`** kept for logged-in users only
- Does **not** touch LD JS (closed **`e12bdba`**) or custom plugin assets (`atmo-reflection-forms`, `ldtd`, photos JS)
- Guest + logged-in owner QA PASS — see `CHANGES.md`; closes deferred LearnDash global CSS bleed from `9d33b8a`
- **Residual:** handle list may need re-audit after LearnDash/Kadence updates

### LearnDash JS dequeue on non-LD routes (2026-05-25)

- Child theme **`e12bdba`** — `functions.php` only (+20 lines)
- **`atmo_dequeue_ld_js_on_non_ld()`** on `wp_print_scripts` priority 100; reuses **`atmo_is_learndash_context()`**
- Dequeues **5** LD script handles off non-LD routes: `learndash-front`, `learndash-main`, `learndash-breakpoints`, `learndash`, `learndash-course-grid-skin-grid`
- **`wp_dequeue_script()`** only — no deregister; separate from CSS dequeue **`9d8c49e`** and outside-git plugin enqueue fix
- Does **not** touch plugin assets (`atmo-reflection-forms`, `ldtd`, photos JS) or CSS dequeue logic
- Guest + logged-in owner QA PASS — see `CHANGES.md`; non-LD routes: **0** target LD JS + inline LD objects absent; LD archive/course/lesson routes preserve LD JS
- **Residual:** LearnDash/Kadence handle renames; future LD shortcodes/widgets on non-LD pages need re-audit/exception; outside-git plugin enqueue deploy risk unchanged

---

## 0. Prototype coverage — current next work

Coverage audit (2026-05-24) reset the roadmap around the original HTML prototype. Treat this section as the active shortlist.

**Latest coverage gate (2026-06-01):** see `PROTOTYPE_COVERAGE_AUDIT.md`. Current redesign status is **NOT_READY for release candidate**. Catalog prototype parity is now implemented locally in child theme commit `a8e81e5`, but multiple prototype screens remain partial, missing, or blocked by content.

**Operational blocker before any staging/deploy continuation:** complete a fresh read-only staging audit from the post-snapshot state. Current verified staging fingerprint must be `/var/www/staging` + `https://staging.atmo.by` + `DB_NAME=atmo_staging`. Do not continue deploy/runtime edits until the safety gate in `DEPLOY_CHECKLIST.md` is passed.

| Priority | Item | Notes |
|----------|------|-------|
| P1 | **Static missing routes (paused)** | Footer links `/trainer/`, `/terms/`, `/privacy/` — **content not approved**; routes still 404 (branded `404.php` shell). WP pages + templates deferred until copy sign-off. |
| P1 | **PDP prototype parity** | `product.html` is only partial; full hero/enrolled-state decisions still open. |
| P1 | **Auth/reset password prototype parity** | `reset-password.html` is missing; `auth.html` is only partial through Woo forms. |
| P1 | **Public `/courses/` IA / skin** | Prototype `courses.html` maps closer to account "Мои курсы"; live `/courses/` is LearnDash public archive. Needs explicit product/design decision. |
| P2 | **Course completion flow** | `course-complete.html` missing; decide LD completion hook/template or defer. |

Deferred / product decision: homepage Social testimonials, full PDP hero redesign, variable PDP bottom CTA, `atmo-lms-lite` runtime cutover, course hub marketing extras (body/video/tick-list, per-course accent, Теория/Практика grouping), legacy lesson post inline HTML cleanup.

Deploy risk (outside git): plugin enqueue fix is now **applied on Stage2** (2026-05-31) from fixed Local PHP / `docs/patches/plugin-enqueue/`; tracked plugin repo still preferred long-term (`.bak` = rollback only). Production/VPS runtime still requires separate safety-gated deploy/re-audit.

Closed PRE-RC gate (2026-05-31): Stage2 checkout payment methods + CSS polish — Stripe test-only (`pk_test`, no `pk_live`), card/BLIK/Klarna visible, child **0.1.2** re-QA PASS; saved-token UI noise accepted as low residual.

Closed PRE-RC hygiene (2026-05-31): Stage2 Snippet **#5 Thank You Redirect** disabled; invalid `/checkout/order-received/{id}/` no longer leaves `stage2.atmo.by`; keep snippet disabled unless a new valid-order redirect spec exists.

Closed PRE-RC runtime (2026-05-31): Stage2 plugin enqueue patches applied; logged-in negative route matrix clean; lesson-level reflection/diary/photos/compare scoping PASS.

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
| ~~Billing edit field subset~~ | ✅ **Closed / accepted no-op 2026-05-24** — Checkout Field Editor `wc_fields_billing` + Woo phone/company hidden; index cards show saved meta; **not** child-theme bug — see `CHANGES.md` |
| Address save/validation flow | Out of scope unless explicit |
| Child-theme billing/shipping field filters | **Do not add** unless explicitly scoped — use Checkout Field Editor / Woo settings for field changes |
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
| ~~**PHPUnit adapter unit tests (Commit 3b)**~~ | ✅ Done **`c2041d7`** 2026-05-29 — minimal PHPUnit 10 harness in `kadence-child` for pure helpers (`pick_winning_grant`, `parse_access_type`, expiry/status helpers); **19 tests PASS**; no CI / no WP integration tests |

**Next LMS work only when product-scoped:** explicit `atmo-lms-lite` API/cutover contract; optional plugin enqueue tightening or lesson post content cleanup. Do not treat LearnDash template overrides as the default path.

### Current routes (reference)

| Route | Role |
|-------|------|
| `/courses/` | LearnDash **public CPT archive** — nav **«Программы»** (header/footer); **18** cards; not enrolled-only |
| `/my-account/my-courses/` | Enrolled list — adapter `get_enrolled_courses()` — `a352081` |
| `/my-account/my-courses/?course_id={id}` | **Account hub v1 + visual Phase 1** — enrolled overview + lesson outline — `81c3a7d` · hero/continue/progress/outline current — `b1d21b5` |
| `/lessons/{slug}/` | LearnDash lesson body — **«Продолжить»** from hub/list lands here; ATMO lesson chrome + plugin block CSS Phase 1 (`d37665b`) |

Runtime: LearnDash `sfwd-lms` + Woo bridge · `atmo-account.css` on `is_account_page()` only · `atmo-lms-lite` active on Local (future replacement; **bridge only** — no theme UI dependency; Local tables empty).

**Rejected routes (archive):** standalone `/my-courses/` · LD shortcode enrolled page · wait-for-lite-only — see `LMS_ADAPTER_SPEC.md` §2.

### Do not do

- Do not build `kadence-child/learndash/` overrides without confirming Modern path support (discovery 2026-05-23: LD30 Modern uses `src/Core/Template` engine, classic override may not apply)
- Filter `/courses/` archive to enrolled-only
- Wire `courses.html` demo data or fake progress into WP
- Build critical UI on `atmo-lms-lite` without explicit decision
- Register new Woo endpoints or change rewrites without audit + docs
- Re-enable Snippet **#5** Thank You Redirect (broken URL in source)
- Re-enable Snippet **#12** variable branch or add a second `form.variations_form` on variable PDP without redesign (duplicate variation-form risk — see `CHANGES.md` 2026-05-24)
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
| Category/tag-aware goal chip URLs | ✅ Done **`7b163be`** 2026-05-24 — chips preserve shop/category/tag archive base — see `CHANGES.md` |
| `display_title` on catalog cards | ✅ Done **`4993bd9`** 2026-05-21 — `_atmo_display_title` in `atmo_build_course_card()` with Woo name fallback; PDP ViewModel same — see `CHANGES.md` |
| ~~Catalog ordering select styling~~ | ✅ Done **`9d33b8a`** 2026-05-25 — `.woocommerce-ordering select` ATMO pill style (tokens, SVG chevron, mobile full-width); scoped to `atmo-catalog.css` — see `CHANGES.md` |

---

## 5. PDP — optional / deferred

| Item | Notes |
|------|--------|
| Variable PDP bottom CTA (#3614) | **Deferred / product decision (2026-05-24)** — Snippet 12 variable skip is **intentional and safe**; not a functional blocker. Variable PDP: 0 `.app-bottom-checkout`, 1 hero `form.variations_form`, hero price sync PASS (`4132f1f`). Simple PDP keeps Snippet 12 bottom CTA. **Do not** remove Snippet 12 variable guard or duplicate Woo variation forms. If product wants bottom conversion later: child-theme **scroll/sticky CTA tied to hero form only** — see `CHANGES.md`. |
| Full PDP hero redesign | **Optional** — out of scope for 2026-05-23 polish; current hero + tabs + price sync accepted |

---

## 6. Homepage — open

| Item | Notes |
|------|-------|
| **Section 04 Social** — testimonials | Deferred 2026-05-24 — no hardcoded copy; needs real CMS-driven testimonials or product decision |
| Hero product card — real image | Product 3614 has no WP featured image set; shows `.atmo-ph` placeholder; add image via WP Admin Media when ready |
| Variable product price range on hero/featured | 3614 shows «399 zł – 799 zł» (WC variable); acceptable; can display min price only with `$p->get_variation_price('min')` if product decision |

---

## 6a. Static pages / legal — open (404 closed)

| Item | Notes |
|------|-------|
| `/trainer/` | Footer link exists; Local route **404** (branded `404.php`). **Paused** — needs approved content + WP page + `trainer.html` port. |
| `/terms/` | Footer link exists; Local route **404** (branded `404.php`). **Paused** — needs approved content + shared legal template/CSS. |
| `/privacy/` | Footer link exists; Local route **404** (branded `404.php`). **Paused** — needs approved content + shared legal template/CSS. |
| ~~WP 404~~ | ✅ Done **`64f2aa8`** — `404.php` + `atmo-404.css`; see `CHANGES.md` 2026-05-25 |

---

## 7. Docs / Process

| Item | Notes |
|------|--------|
| Preview mu-plugin — remove later | **Decision (2026-05-22): keep for now** — low-risk legacy comparison tool. **Local-only / unversioned:** `wp-content/mu-plugins/atmo-redesign-preview.php`, `wp-content/mu-plugins/atmo-redesign/assets/css/atmo-preview.css`. **Runtime:** no-op without `?atmo_preview_shell=1`; normal pages use child header/footer; preview assets, body classes, and legacy header/footer only with query param. **Remove when all checked:** ☐ explicit sign-off that child header/footer are canonical ☐ `?atmo_preview_shell=1` compare no longer needed ☐ backup/snapshot 2 mu-plugin files before delete ☐ optional kadence-child cleanup: `body.atmo-preview-shell-enabled` rules in `atmo-header.css` / `atmo-footer.css` + preview-font comment in `functions.php`. Details/rollback: `CHANGES.md` → 2026-05-22 preview mu-plugin discovery. |
| Code Snippets — export/version | Initial export **2026-05-22** in `docs/snippets/` — **re-export when DB snippets change** |
| Cross-repo rollback notes | Keep `CHANGES.md` as source of truth for DB + kadence-child commits |

---

*Last synced: 2026-05-29 (LMS adapter extraction `ec5982c`; manual LD fallback `9bb70ed`; PHPUnit `c2041d7`; stage2 manual + Woo #3910 QA PASS; Local post-adapter regression PASS)*
