# ATMO.BY — project backlog

> Short, practical backlog — **source of truth for open tasks**.  
> **Milestone snapshot (2026-05-22):** `MILESTONE_SHELL_ACCOUNT_LMS.md` — closed shell + account/LMS MVP, fixtures, do-not-touch.  
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
- Account LMS copy polish (`4e180b9`, 2026-05-22): removed LearnDash + raw endpoint paths from user copy; CTAs/adapter unchanged — atmo-qa-empty QA PASS; r4t5 not re-QA (no password) — see `CHANGES.md`
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

- **r4t5 (679) / #3801** — enrolled path: completed, 1 line item → LD course 3616; order-again visible (not clicked)
- **atmo-qa-empty (691)** — zero-enrollment path: customer, 0 orders, 0 LD meta; Local-only QA fixture — delete in WP Admin when done
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
| Nav label **«Программы»** | Header + footer → **`/courses/`** (public LD archive) — **not** in account sidebar since `ecfd8f5` |
| **`/my-account/my-courses/`** | **Live (adapter MVP)** — real Woo endpoint + read-only **`get_enrolled_courses()`** list — `a352081` |
| UX mismatch (interim) | **Resolved** — **«Мои курсы»** = enrolled route; **«Программы»** = public archive (header/footer) |
| CSS scope | `atmo-account.css` on `is_account_page()` only — **not** on `/courses/` |
| Primary runtime | LearnDash `sfwd-lms` 5.0.5 + Woo bridge |
| `atmo-lms-lite` | Active on Local v0.2.0, dev-only — no front-end assets observed |

### Product decisions

| # | Decision | Status |
|---|----------|--------|
| 1 | **Interim nav label** for public `/courses/` archive | **Done (2026-05-22):** **«Программы»** in header + footer — see `CHANGES.md`; removed from account sidebar in `ecfd8f5` |
| 2 | **Target enrolled route** — where real **«Мои курсы»** lives | **Done (2026-05-22):** **`/my-account/my-courses/`** Woo endpoint — see `LMS_ADAPTER_SPEC.md` §2, `CHANGES.md` |
| 3 | **Adapter interface sign-off** — PHP adapter + ViewModel before enrolled UI | **Done (2026-05-22):** ViewModel contract accepted — `LMS_ADAPTER_SPEC.md` §4.7 · `CHANGES.md` |
| 4 | **Product ↔ course mapping** — Woo sell-side → LD course ID | **Done (2026-05-22):** `_related_course` + variation-first resolver — `CHANGES.md` mapping discovery · `LMS_ADAPTER_SPEC.md` §5 |
| 5 | **Access expiry semantics** — «60 дней» / `expires_at` when LD `expire_access` off | **Done (2026-05-22):** `starts_at` from LD access meta + duration from `тип-доступа` — `LMS_ADAPTER_SPEC.md` §5 · `CHANGES.md` |
| 6 | **`my-courses` endpoint plan** — Woo rewrite + menu IA + shell-first sequence | **Done (2026-05-22):** audit + plan — `LMS_ADAPTER_SPEC.md` §11 · `CHANGES.md` |
| 7 | **`my-courses` endpoint shell (phase 1)** — register endpoint + empty UI | **Done (2026-05-22):** `ecfd8f5` — real endpoint, menu IA, `.atmo-my-courses` shell; Local QA PASS post-flush — `CHANGES.md` |
| 8 | **LMS adapter MVP (phase 2)** — wire `get_enrolled_courses()` + enrolled list UI | **Done (2026-05-22):** `a352081` — read-only Woo+LD adapter; fixture #3801 QA PASS — `CHANGES.md` |
| 9 | **Account regression QA after adapter MVP** — full account sweep post-`a352081` | **Done (2026-05-22):** 8 routes × desktop/mobile PASS; no blockers — `CHANGES.md` |
| 10 | **Dashboard CTA wiring (phase 3)** — «Следующий шаг» + courses panel to my-courses / adapter | **Done (2026-05-22):** `648e562` — read-only adapter reuse; fixture #3801 QA PASS — `CHANGES.md` |
| 11 | **Zero-enrollment empty-state QA** — fixture user + dashboard/my-courses empty paths | **Done (2026-05-22):** fixture **691** / `atmo-qa-empty`; 6/6 PASS desktop/mobile — `CHANGES.md` |

**Recommendation:** keep `/courses/` public **«Программы»** (header/footer); **next:** post-MVP lesson/course hub port; `atmo-lms-lite` decision when hub/lesson work starts.

### Route options (reference)

| Opt | Approach | Status |
|-----|----------|--------|
| Public archive | `/courses/` + nav **«Программы»** | **Live** — not enrolled UI |
| **A** | Standalone `/my-courses/` | **Rejected** — see `LMS_ADAPTER_SPEC.md` §2 |
| **B** | Woo **`/my-account/my-courses/`** | **Live (adapter MVP)** — enrolled list from `get_enrolled_courses()` — `a352081` |
| LD shortcode page | Filtered WP page | **Rejected** — LD template coupling |
| Wait for lite only | No route until `atmo-lms-lite` | **Rejected** — blocks MVP; adapter handles backend swap |

### Do not do yet

- LearnDash template overrides (`ld30`, course-grid, single course/lesson)
- Filter `/courses/` archive to enrolled-only without adapter + route decision
- Wire `courses.html` demo data or fake progress into WP
- Build critical UI on `atmo-lms-lite` without explicit decision
- Register new Woo endpoints or change rewrites without plan — **`my-courses` shell shipped** (`ecfd8f5`); further endpoint changes need audit
- Deep-port `lesson.html` / `product-enrolled.html` until adapter MVP is stable (list shipped `a352081`)
- Treat Woo order line items alone as enrollment UI (bridge + adapter must agree)

### Blocked items

| Item | Blocker |
|------|---------|
| ~~Real LMS/enrolled dashboard widgets~~ | **Done `648e562`** — dashboard CTAs wired; no list/progress on dashboard — `CHANGES.md` |
| ~~«Мои курсы» enrolled list (real data)~~ | **Done `a352081`** — see `CHANGES.md` |
| LearnDash templates | Do not touch — post-MVP hub/lesson port |
| `atmo-lms-lite` critical UI | Dev-only; no front-end without explicit decision |
| Pending-order rows on my-courses | Not in MVP — non-completed orders excluded |
| ~~Empty-state with zero-enrollment user~~ | **Done 2026-05-22** — fixture **691** / `atmo-qa-empty`; dashboard + my-courses empty QA PASS — `CHANGES.md` |
| Course hub / lesson deep port | Post-MVP — MVP links to LD URLs via ViewModel |

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
| Adapter / ViewModel interface | **Signed off 2026-05-22** — `LMS_ADAPTER_SPEC.md` §4.7 · summary in `WP_DEPENDENCY_MAP.md` |
| **`my-courses` endpoint shell** | **Done (2026-05-22):** `ecfd8f5` — see `CHANGES.md`; one-time permalink flush on deploy |
| **LMS adapter MVP (phase 2)** | **Done (2026-05-22):** `a352081` — see `CHANGES.md` |
| **Account regression QA after adapter MVP** | **Done (2026-05-22):** post-`a352081` sweep PASS — `CHANGES.md` |
| **Dashboard adapter wiring (phase 3)** | **Done (2026-05-22):** `648e562` — `LMS_ADAPTER_SPEC.md` §11 commit C · `CHANGES.md` |
| Code Snippets — export/version | **Done (2026-05-22):** `docs/snippets/` — see README; re-export when DB snippets change |
| Cross-repo rollback notes | Keep `CHANGES.md` as source of truth for DB + kadence-child commits |

---

*Last synced from docs: 2026-05-23*
