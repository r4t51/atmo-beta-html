# ATMO shell + account/LMS MVP — milestone snapshot

> **Date:** 2026-05-22 baseline · **updated 2026-05-25** (prototype coverage + order-received layer)
> **Repos:** docs `beta html` · child theme `kadence-child` (Local)  
> **Purpose:** concise closure record — what shipped, what fixtures exist, what stays out of scope.  
> **Detail / rollback:** `CHANGES.md` · **open work:** `BACKLOG.md` · **adapter contract:** `LMS_ADAPTER_SPEC.md`

---

## 1. Status

| Phase | State |
|-------|--------|
| **ATMO shell / wiring** | **Complete** — header, footer, catalog, PDP, cart, checkout, order-received; account passes 1–5; re-QA PASS 2026-05-22 |
| **Account / LMS MVP** | **Complete** — `/my-account/my-courses/` endpoint + adapter MVP + dashboard CTA wiring + **account course hub v1 (`81c3a7d`)** + enrolled + zero-enrollment QA |

**Not a blocker:** preview mu-plugin kept for now (`?atmo_preview_shell=1` only). LD lesson chrome v1/v2 + lesson H1 number prefix (`caaaa96`) shipped without template overrides; remaining LMS work is optional polish / formal adapter work / future `atmo-lms-lite` cutover contract.

**Update 2026-05-23:** Catalog + PDP **public polish complete** — toolbar/cards, content cleanup, hero price sync, Woo tabs, Snippet 12 variable mitigation. Detail: `CHANGES.md` → *2026-05-23 — Catalog + PDP public polish milestone*.

**Update 2026-05-23 (LMS URL hygiene):** LearnDash public course join CTA + one body link — `atmoredesign.local.local` host typo resolved via WP Admin; logged-out crawl **18** course pages, **0** `local.local` on course HTML. Detail: `CHANGES.md` → *LearnDash public course URL hygiene*.

**Update 2026-05-23 (LMS hub v1):** Account enrolled course hub at **`/my-account/my-courses/?course_id={id}`** — child theme **`81c3a7d`**; no new rewrite; lessons still on LD routes. Detail: `CHANGES.md` → *LMS account course hub v1*.

**Update 2026-05-25 (LMS hub visual Phase 1):** Account hub visual polish — child theme **`b1d21b5`**; hero, continue card, progress strip, outline current state; same route and ViewModels as v1. Detail: `CHANGES.md` → *Account course hub visual Phase 1*.

**Update 2026-05-24–25 (prototype coverage):** Homepage v1 shipped (`075179f`, CSS compliance `214f6b6`), cart polish shipped (`3e4748f`), order-received PHP confirmation layer shipped (`f9a7b95`, owner browser QA PASS #3801), checkout progress steps shipped (`1203858`), branded WP 404 shipped (`64f2aa8`). Detail: `CHANGES.md`.

---

## 2. Closed surfaces

| Surface | Notes |
|---------|--------|
| Header / footer | ATMO child chrome; Kadence `#masthead` / `#colophon` hidden by CSS |
| Catalog + goal chips | MVP + **public polish complete 2026-05-23** (`6f4790b` + WP Admin content); card display titles **`4993bd9`** 2026-05-21; taxonomy-aware chip URLs **`7b163be`** 2026-05-24 — see `CHANGES.md` |
| PDP | Simple + variable `#3614`; **hero price sync + Woo tabs 2026-05-23** (`4132f1f`, `106250d`); Snippet 12 skips variable PDP **by design** (deferred 2026-05-24) |
| Homepage | `front-page.php` + `atmo-home.css` (`075179f`, CSS cleanup `214f6b6`); Social/testimonials deferred |
| Cart / checkout / order-received | Cart polish `3e4748f`; checkout shell + progress steps `1203858` (`inc/atmo-checkout.php`, `atmo-checkout.css`); order-received PHP layer `f9a7b95` + `atmo-confirmation.css` (owner visual QA PASS 2026-05-25) |
| Payment failed | `/payment-failed/` → **200** static page (WP **#3807** + `page-payment-failed.php` / `atmo-payment-failed.css`, `c9ac2b1`); Woo order-specific failed UX stays on order-received |
| WP 404 | Branded `404.php` + `atmo-404.css` (`64f2aa8`); `is_404()` enqueue only — see `CHANGES.md` 2026-05-25 |
| Woo My Account | Auth, dashboard, orders, view-order, settings, hidden endpoints — shell/wiring done |
| **`/my-account/my-courses/`** | Woo endpoint **`my-courses`** · adapter `get_enrolled_courses()` · empty + enrolled list · dashboard «Следующий шаг» wired |
| **`/my-account/my-courses/?course_id={id}`** | **Account course hub v1 + visual Phase 1** (`81c3a7d`, `b1d21b5`) — enrolled overview + lesson outline in account shell; denial when no access |

**By design (not bugs):** no course list/progress widgets on dashboard (CTAs only); no fake progress bars; `/courses/` stays public LD archive (not enrolled-only).

---

## 3. Key child theme commits

### LMS / my-courses (2026-05-22)

| Commit | Scope |
|--------|--------|
| **`ecfd8f5`** | Woo **`my-courses`** endpoint shell — register endpoint, 5-item nav IA, static empty `.atmo-my-courses`; drop fake `atmo-courses` sidebar slug |
| **`a352081`** | LMS adapter MVP — read-only Woo+LD `get_enrolled_courses()`, enrolled list UI, mapping/expiry rules, no fake 0% |
| **`648e562`** | Dashboard CTA wiring — «Следующий шаг» + courses panel → adapter / `/my-account/my-courses/` |
| **`81c3a7d`** | Account course hub v1 — `?course_id=` on existing endpoint; `.atmo-course-hub` in account shell; lesson outline via read-only LD API |
| **`b1d21b5`** | Hub visual Phase 1 — hero band, continue card, progress strip, outline anchor/current lesson |

### Lesson chrome + H1 prefix (2026-05-23–24)

| Commit | Scope |
|--------|--------|
| **`ed7afcf`** | Lesson chrome v1 — content card, nav, mark-complete pill, back-to-hub filter |
| **`1e08a3d`** | Lesson chrome v2 — first-lesson prev hidden; back label «Вернуться к программе» |
| **`897409c`** | Lesson hardening — LD hook guards + CSS cleanup |
| **`caaaa96`** | Lesson H1 number prefix — **`Урок N · {title}`** on Kadence entry H1 via title filter; hub outline order; logged-in only |

**Deploy note:** one-time permalink flush required after `ecfd8f5` on new environments (WP Admin → Settings → Permalinks → Save). No `flush_rewrite_rules()` in theme PHP.

### Account shell (reference)

| Commit | Scope |
|--------|--------|
| `353346c` | Auth forms |
| `3122f4f` | Logged-in account shell |
| `d4ee689` | Menu IA (5 items) |
| `534b241` | Dashboard static shell |
| `3704226` | Orders list + view-order CSS |
| `fcca2e5` | Mobile orders actions overflow |
| `d1748dc` | Settings form |
| `3135ddb` | Hidden endpoints (downloads, edit-address, payment-methods) |
| `2da518f` | View-order access-type meta pill (`тип-доступа`) |

Per-commit rollback: `git revert <hash>` in `kadence-child` — see `CHANGES.md` entries.

---

## 4. Local QA fixtures

| Fixture | Role | Notes |
|---------|------|--------|
| **r4t5 (679) / #3801** | **Enrolled path** | Completed order → variation **3628** → LD course **3616**; «60 дней»; dashboard continue CTA + my-courses card + **hub `?course_id=3616`** QA |
| **#3800** | Pending empty order | Pending, 0 line items — pending/cancel shell QA |
| **atmo-qa-empty (691)** | **Zero-enrollment path** | Customer, 0 orders, 0 LD meta; Local-only — dashboard + my-courses empty-state QA PASS |

**Pairing:** use **679/#3801** for enrolled flows; **691** for empty-state flows.

### Rollback / delete

| Action | How |
|--------|-----|
| Delete zero-enrollment fixture | WP Admin → Users → delete **atmo-qa-empty (691)** — or SQL on `wp_users` + `wp_usermeta`; no orders/enrollments to clean |
| Revert LMS work | `git revert 648e562` → `a352081` → `ecfd8f5` (reverse order if rolling back all); permalink flush after reverting `ecfd8f5` |
| Revert single phase | `648e562` only — no flush; adapter + endpoint remain |

---

## 5. Product decisions (locked for MVP)

| Topic | Decision |
|-------|----------|
| Public catalog route | **`/courses/`** — nav label **«Программы»** (header/footer only) |
| Enrolled route | **`/my-account/my-courses/`** — label **«Мои курсы»** in account nav |
| Product ↔ course mapping | Woo **`_related_course`** — **variation first**, else parent product; resolve by **course ID** |
| Access expiry | **`starts_at`** from LD access meta → **`expires_at`** = start + duration from order **`тип-доступа`**; lifetime → null |
| Progress UI | **No fake progress** — hide bar when `progress_percent` is null |
| ViewModels | UI consumes adapter ViewModels only — no LearnDash HTML/classes in ATMO chrome |
| Code Snippets | Exported to **`docs/snippets/`** (16 snippets, 2026-05-22); re-export when DB rows change |
| Snippet #5 | **Inactive** — do not re-enable thank-you redirect without safe spec |

Full contract: `LMS_ADAPTER_SPEC.md` §2–§5 · mapping: `WP_DEPENDENCY_MAP.md`.

---

## 6. Do not touch without separate decision

| Area | Why |
|------|-----|
| LearnDash templates | `ld30`, course-grid, single course/lesson — lesson chrome shipped via CSS/filters; no template overrides without scoped plan |
| `atmo-lms-lite` critical UI | Future replacement on Local; **bridge only** — empty tables; no theme UI dependency until explicit cutover |
| Payment / saved cards | Stripe tokens, saved payment-methods table, live gateway QA — env + scope, not theme CSS |
| Order / payment mutations | No new test orders, enrollments, or snippet toggles unless explicitly requested |
| Redirects / Snippet #5 | Broken thank-you redirect if re-enabled |
| New Woo rewrites | No endpoints beyond shipped **`my-courses`** without audit + docs |
| Filter `/courses/` to enrolled-only | Requires adapter + route decision — rejected for MVP |
| Wire prototype demo data | No `shared/data.js` / fake progress in WP |

---

## 7. Remaining backlog (summary)

**Canonical open tasks:** `BACKLOG.md` §0–§6a.

- **Account fixture polish:** **closed 2026-05-24** — no mandatory account theme work; dev pill removed (`dc1e2be`); see `CHANGES.md`
- **LMS polish:** lesson H1 number prefix **done `caaaa96`**; **`atmo-lms-lite` bridge decision** — defer runtime integration until stable read API + cutover
- **Prototype coverage:** static `/trainer/` + legal routes **paused** (content not approved); course hub/lesson visual polish — see `BACKLOG.md` §0
- **Optional polish:** PDP optional rows (full hero redesign cosmetic only)
- **Closed / config:** billing edit field subset — Checkout Field Editor + Woo settings; not child-theme work (2026-05-24)
- **Avoid unless explicit:** payments, saved cards, test orders; downloads/shipping blocks until real fixtures exist
- **Process:** preview mu-plugin removal when checkboxes met; re-export snippets when DB changes

Fixtures: **679/#3801** enrolled · **691** zero-enrollment · **#3800** pending ghost (0 items) — see §4.

---

## 8. Next recommended step

**Option A — pause implementation:** treat shell + account/LMS MVP as a stable baseline; pick polish or fixtures only when needed.

**Option B — one scoped backlog item:** choose **one** row from `BACKLOG.md` with explicit scope before coding — recommended first picks:

> Pick paused static routes (`/trainer/`, `/terms/`, `/privacy/`) after content sign-off, or optional PDP/LMS polish. `atmo-lms-lite` work waits for product-ready API/cutover scope.

Do **not** resume generic shell CSS unless a functional gap is found.

---

## Related docs

| Doc | Use |
|-----|-----|
| `CHANGES.md` | Dated entries, QA results, per-commit rollback |
| `BACKLOG.md` | Open tasks (active backlog) |
| `LMS_ADAPTER_SPEC.md` | ViewModel contract, route decision, phase sign-off |
| `ONBOARDING.md` | Developer entry, fixture list, next-step pointer |
| `WP_DEPENDENCY_MAP.md` | Stack map, snippet registry, Woo/LMS dependencies |
| `docs/snippets/` | Exported Code Snippets bodies + manifest |

---

*Snapshot v1.2 — baseline 2026-05-22 · prototype coverage update 2026-05-25. Keep narrative history in `CHANGES.md`; open tasks in `BACKLOG.md`.*
