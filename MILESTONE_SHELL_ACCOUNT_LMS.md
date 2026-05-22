# ATMO shell + account/LMS MVP — milestone snapshot

> **Date:** 2026-05-22  
> **Repos:** docs `beta html` · child theme `kadence-child` (Local)  
> **Purpose:** concise closure record — what shipped, what fixtures exist, what stays out of scope.  
> **Detail / rollback:** `CHANGES.md` · **open work:** `BACKLOG.md` · **adapter contract:** `LMS_ADAPTER_SPEC.md`

---

## 1. Status

| Phase | State |
|-------|--------|
| **ATMO shell / wiring** | **Complete** — header, footer, catalog, PDP, cart, checkout, order-received; account passes 1–5; re-QA PASS 2026-05-22 |
| **Account / LMS MVP** | **Complete** — `/my-account/my-courses/` endpoint + adapter MVP + dashboard CTA wiring + enrolled + zero-enrollment QA |

**Not a blocker:** preview mu-plugin kept for now (`?atmo_preview_shell=1` only). Post-MVP hub/lesson port is the next *product* phase, not shell wiring.

---

## 2. Closed surfaces

| Surface | Notes |
|---------|--------|
| Header / footer | ATMO child chrome; Kadence `#masthead` / `#colophon` hidden by CSS |
| Catalog + goal chips | MVP cards + server-side `filter_goal`; chip URLs → main `/каталог/` base |
| PDP | Simple + variable `#3614`; Snippets #9/#10/#12 accounted for |
| Cart / checkout / order-received | `atmo-cart.css`, `atmo-checkout.css`, `atmo-confirmation.css`; re-QA PASS |
| Payment failed | `/payment-failed/` → **404 by design** (no static page) |
| Woo My Account | Auth, dashboard, orders, view-order, settings, hidden endpoints — shell/wiring done |
| **`/my-account/my-courses/`** | Woo endpoint **`my-courses`** · adapter `get_enrolled_courses()` · empty + enrolled states · dashboard «Следующий шаг» wired |

**By design (not bugs):** no course list/progress widgets on dashboard (CTAs only); no fake progress bars; `/courses/` stays public LD archive (not enrolled-only).

---

## 3. Key child theme commits

### LMS / my-courses (2026-05-22)

| Commit | Scope |
|--------|--------|
| **`ecfd8f5`** | Woo **`my-courses`** endpoint shell — register endpoint, 5-item nav IA, static empty `.atmo-my-courses`; drop fake `atmo-courses` sidebar slug |
| **`a352081`** | LMS adapter MVP — read-only Woo+LD `get_enrolled_courses()`, enrolled list UI, mapping/expiry rules, no fake 0% |
| **`648e562`** | Dashboard CTA wiring — «Следующий шаг» + courses panel → adapter / `/my-account/my-courses/` |

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
| **r4t5 (679) / #3801** | **Enrolled path** | Completed order → variation **3628** → LD course **3616**; «60 дней»; dashboard continue CTA + my-courses card QA |
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
| LearnDash templates | `ld30`, course-grid, single course/lesson — post-MVP hub/lesson port only |
| `atmo-lms-lite` critical UI | Dev-only on Local; not SoT; no front-end without explicit product choice |
| Payment / saved cards | Stripe tokens, saved payment-methods table, live gateway QA — env + scope, not theme CSS |
| Order / payment mutations | No new test orders, enrollments, or snippet toggles unless explicitly requested |
| Redirects / Snippet #5 | Broken thank-you redirect if re-enabled |
| New Woo rewrites | No endpoints beyond shipped **`my-courses`** without audit + docs |
| Filter `/courses/` to enrolled-only | Requires adapter + route decision — rejected for MVP |
| Wire prototype demo data | No `shared/data.js` / fake progress in WP |

---

## 7. Remaining backlog (grouped)

Source of truth: **`BACKLOG.md`**. Summary only — not a duplicate of `CHANGES.md`.

### Account / Woo fixtures

- Saved billing/shipping profile cards + filled address forms (needs saved-address fixture)
- Downloads list with real files (empty state styled only)
- View-order shipping customer block (absent on #3801)
- Address save/validation flow (out of scope unless explicit)
- Woo default dashboard `<p>` hidden by CSS when `.atmo-dash` — template override optional later

### Payments — avoid unless explicit

- Saved payment-methods table with stored cards
- Stripe card on Local (HTTP + live mode)
- BLIK / Klarna gateway availability
- Test orders / payment flows

### LMS post-MVP

- **Lesson / course hub port** (`product-enrolled.html`, `lesson.html`) — primary next product phase
- LearnDash template overrides
- Pending-order rows on my-courses (non-completed orders excluded from MVP)
- `atmo-lms-lite` as UI backend — decide when hub/lesson work starts
- Optional: goal grouping, list/grid toggle, `display_title` on catalog cards, #3614 tier hero polish

### Docs / process

- Preview mu-plugin removal (after explicit sign-off that child header/footer are canonical)
- Re-export Code Snippets when DB changes
- Cross-repo rollback notes stay in `CHANGES.md`

---

## 8. Next recommended step

**Option A — pause implementation:** treat shell + account/LMS MVP as a stable baseline; pick polish or fixtures only when needed.

**Option B — one scoped backlog item:** choose **one** row from `BACKLOG.md` with explicit scope before coding — recommended first pick:

> **Post-MVP lesson/course hub port** (`product-enrolled.html`, `lesson.html`) — requires written plan; do not touch LearnDash templates without adapter-backed scope.

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

*Snapshot v1 — 2026-05-22. Update this file when a new milestone closes; keep narrative history in `CHANGES.md`.*
