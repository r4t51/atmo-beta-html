# ATMO.BY — project backlog

> Short, practical backlog — **source of truth for open tasks**.  
> History/rollback: `CHANGES.md` · Child theme: `kadence-child` · Prototypes: this repo.

---

## Done — ATMO shell/wiring phase (re-QA 2026-05-22)

Child theme wiring/shell complete for public Woo flows; read-only QA PASS (see `CHANGES.md` entries dated 2026-05-22). **Next phase:** product/LMS decisions + optional polish — not more shell wiring unless a functional gap appears.

| Area | Status |
|------|--------|
| Header / footer | ✅ ATMO child chrome |
| Catalog + goal chips | ✅ MVP + server-side `filter_goal` |
| PDP | ✅ simple + variable #3614 |
| Cart | ✅ `atmo-cart.css` + cross-sells |
| Checkout | ✅ `atmo-checkout.css`; gateways visible on Local (BLIK/Klarna) |
| Order received | ✅ `atmo-confirmation.css` |
| Account | ✅ passes 1–5 + dashboard + view-order meta (detail below) |
| Preview mu-plugin | ✅ **keep for now** — opt-in only (`?atmo_preview_shell=1`) |

**By design / not built:** `/payment-failed/` → 404; LMS/enrolled widgets; payment-token live QA.

### Account / Woo (detail)

- Logged-out auth shell + re-QA (`353346c`, pass 1)
- Logged-in account shell / nav / menu IA (`3122f4f`, `d4ee689`, pass 2a)
- Static dashboard shell — next step, courses CTA, profile, last order (`534b241`, pass 2b)
- Orders list + view-order shell CSS (pass 3); mobile orders actions fix (`fcca2e5`)
- Settings form (pass 4); hidden endpoints (pass 5)
- add-payment-method read-only audit (2026-05-22)
- Completed view-order fixture QA — #3801 (2026-05-22): line item shell, qty/total, customer details, order-again **visibility** verified (not clicked)
- View-order access-type meta pill — `тип-доступа` (`2da518f`, 2026-05-22): structured **Тип доступа: 60 дней** on #3801; Woo-skipped meta only; duplicate guard
- Address endpoints read-only QA (2026-05-22): `/edit-address/` index + billing/shipping forms PASS; empty r4t5 profile verified; #3801 order-level billing block sanity

---

## 1. Account / Woo — open

| Item | Notes |
|------|--------|
| Saved payment-methods table with stored cards | **Avoid unless explicit** — needs payment token / saved-card scope |
| Downloads list with real files | Pass 5 styled empty state only |
| Saved billing/shipping profile cards + edit links | r4t5 profile unconfigured; index shows add CTAs only — needs saved-address fixture |
| Filled address forms (all fields populated) | Billing/shipping shell QA done empty; populated layout unverified |
| View-order shipping customer block | Absent on #3801; billing order-level block verified on #3801 |
| Address save/validation flow | Out of scope unless explicit |
| Woo default dashboard `<p>` in DOM | Hidden by CSS when `.atmo-dash` present; template override optional later |

**Local fixtures**

- **#3801** — completed, 1 line item; order-again visible (not clicked); delete in WP Admin when done
- **#3800** — pending, 0 items; keep for empty/pending/cancel shell QA

---

## 2. LMS / Courses — blocked / deferred

**Discovery (2026-05-22, read-only QA):** see `CHANGES.md` → LMS adapter / «Мои курсы» route discovery.

### Current reality

| Fact | Detail |
|------|--------|
| `/courses/` | LearnDash **public CPT archive** — `post-type-archive-sfwd-courses`, `learndash-template-ld30`, h1 «Курсы», **18** cards, no progress/status UI |
| Logged-in behavior | Still shows all 18 public courses — **not** enrolled-only |
| Single course | e.g. `/courses/testmyself/` — LD single template, `.learndash-wrapper`, course contents / lesson links |
| Nav label **«Программы»** | Header, footer, account menu → **`/courses/`** (external LD URL via fake endpoint `atmo-courses`) — **interim relabel done 2026-05-22** |
| UX mismatch (interim) | **Resolved** for public archive link; name **«Мои курсы»** reserved for future enrolled route |
| CSS scope | `atmo-account.css` on `is_account_page()` only — **not** on `/courses/` |
| Primary runtime | LearnDash `sfwd-lms` 5.0.5 + Woo bridge |
| `atmo-lms-lite` | Active on Local v0.2.0, dev-only — no front-end assets observed |

### Product decisions

| # | Decision | Status |
|---|----------|--------|
| 1 | **Interim nav label** for public `/courses/` archive | **Done (2026-05-22):** **«Программы»** in header, footer, account menu — see `CHANGES.md` |
| 2 | **Target enrolled route** — where real **«Мои курсы»** lives | **Open** |
| 3 | **Adapter interface sign-off** — PHP adapter + ViewModel before enrolled UI | **Open** — draft spec: **`LMS_ADAPTER_SPEC.md` v0** |

**Recommendation:** keep `/courses/` public; enrolled UI waits on decisions 2–3 + adapter sign-off per spec checklist.

**Leaning guidance (not final):**

- Enrolled UI **inside account shell** → Woo endpoint `/my-account/my-courses/` — only after explicit rewrite/endpoint audit (same caution as hidden endpoints).
- Enrolled UI as **broader course hub** (closer to `courses.html` prototype) → standalone `/my-courses/` page + child template + adapter.

### Route options (active — pick one before build)

| Opt | Approach | Pros | Cons / risks |
|-----|----------|------|--------------|
| **A** | Keep `/courses/` public; relabel nav to «Все курсы» / «Программы» | Zero LD/Woo risk; honest UX; copy-only interim fix | Does not deliver enrolled view — **interim label applied: «Программы»** |
| **B** | Standalone `/my-courses/` enrolled route | Clean separation; matches `courses.html`; own shell/CSS | Needs adapter + new page; slug collision check |
| **C** | Woo endpoint `/my-account/my-courses/` | Shared account IA + `atmo-account.css` | Rewrite/endpoint audit; couples to WC routing |
| **D** | LearnDash shortcode/filtered WP page | Uses LD enrollment APIs | **High LD template coupling** — conflicts with adapter rule |
| **E** | Wait for `atmo-lms-lite` adapter | Avoids double migration | Nav mismatch persists; blocks dashboard widgets |

### Do not do yet

- LearnDash template overrides (`ld30`, course-grid, single course/lesson)
- Filter `/courses/` archive to enrolled-only without adapter + route decision
- Wire `courses.html` demo data or fake progress into WP
- Build critical UI on `atmo-lms-lite` without explicit decision
- Register new Woo endpoints or change rewrites without audit
- Deep-port `lesson.html` / `product-enrolled.html` until adapter interface is fixed
- Treat Woo order line items alone as enrollment UI (bridge + adapter must agree)

### Blocked items

| Item | Blocker |
|------|---------|
| Real LMS/enrolled dashboard widgets | Adapter + route decision (above) |
| «Мои курсы» enrolled view | Product decision 2 + adapter sign-off (decision 3) |
| LearnDash templates | Do not touch until adapter decided |
| `atmo-lms-lite` critical UI | Dev-only; no front-end without explicit decision |
| Course progress / next lesson / enrolled cards | Prototype in `courses.html` (demo off); `account.html` MVP-safe shell only |

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
| #3614 access-tier UI polish | **Optional** — variable `abdomen_pelvic` (#3614): Woo Variation Swatches **60 дней** / **Бессрочно** functional; hero may keep price range after tier pick. Re-QA PASS 2026-05-22 confirms wiring OK; polish only if product wants tier-specific hero price. See `CHANGES.md` → 2026-05-22 PDP QA. Pricing unchanged (399–799). |

---

## 6. Docs / Process

| Item | Notes |
|------|--------|
| Preview mu-plugin — remove later | **Decision (2026-05-22): keep for now** — low-risk legacy comparison tool. **Local-only / unversioned:** `wp-content/mu-plugins/atmo-redesign-preview.php`, `wp-content/mu-plugins/atmo-redesign/assets/css/atmo-preview.css`. **Runtime:** no-op without `?atmo_preview_shell=1`; normal pages use child header/footer; preview assets, body classes, and legacy header/footer only with query param. **Remove when all checked:** ☐ explicit sign-off that child header/footer are canonical ☐ `?atmo_preview_shell=1` compare no longer needed ☐ backup/snapshot 2 mu-plugin files before delete ☐ optional kadence-child cleanup: `body.atmo-preview-shell-enabled` rules in `atmo-header.css` / `atmo-footer.css` + preview-font comment in `functions.php`. Details/rollback: `CHANGES.md` → 2026-05-22 preview mu-plugin discovery. |
| Adapter / ViewModel interface | Gate for LMS + enrolled UI; **spec:** `LMS_ADAPTER_SPEC.md` v0 · summary fields in `WP_DEPENDENCY_MAP.md` · route options in §2 above |
| Code Snippets — export/version | **Before adapter implementation or snippet migration** — snippets live in DB `wp_snippets` only (not VCS); export/backup registry in `WP_DEPENDENCY_MAP.md`; audit `CHANGES.md` → 2026-05-22 Code Snippets audit |
| Cross-repo rollback notes | Keep `CHANGES.md` as source of truth for DB + kadence-child commits |

---

*Last synced from docs: 2026-05-22*
