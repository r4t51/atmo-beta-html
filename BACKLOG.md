# ATMO.BY — project backlog

> Short, practical backlog — **source of truth for open tasks**.  
> History/rollback: `CHANGES.md` · Child theme: `kadence-child` · Prototypes: this repo.

---

## Done (account / Woo shell)

- Logged-out auth shell + re-QA (`353346c`, pass 1)
- Logged-in account shell / nav / menu IA (`3122f4f`, `d4ee689`, pass 2a)
- Static dashboard shell — next step, courses CTA, profile, last order (`534b241`, pass 2b)
- Orders list + view-order shell CSS (pass 3); mobile orders actions fix (`fcca2e5`)
- Settings form (pass 4); hidden endpoints (pass 5)
- add-payment-method read-only audit (2026-05-22)
- Completed view-order fixture QA — #3801 (2026-05-22): line item shell, qty/total, customer details, order-again **visibility** verified (not clicked); structured meta pill **not** verified

---

## 1. Account / Woo — open

| Item | Notes |
|------|--------|
| Structured variation/meta pills on view-order | **Optional.** #3801 shows «60 дней» in product title/URL only; `wc-item-meta` / `variation` empty |
| Saved payment-methods table with stored cards | **Avoid unless explicit** — needs payment token / saved-card scope |
| Downloads list with real files | Pass 5 styled empty state only |
| `/edit-address/shipping/` form | Pass 5 not fully QA'd |
| Full billing/shipping address block | #3800/#3801 show partial billing (email + «Н/Д») |
| Woo default dashboard `<p>` in DOM | Hidden by CSS when `.atmo-dash` present; template override optional later |

**Local fixtures**

- **#3801** — completed, 1 line item; order-again visible (not clicked); delete in WP Admin when done
- **#3800** — pending, 0 items; keep for empty/pending/cancel shell QA

---

## 2. LMS / Courses — blocked / deferred

| Item | Blocker |
|------|---------|
| Real LMS/enrolled dashboard widgets | Adapter / ViewModel decision |
| «Мои курсы» → enrolled view vs public `/courses/` archive | Product/route decision; menu currently links to LD archive (18 courses) |
| LearnDash templates | Do not touch until adapter decided |
| `atmo-lms-lite` critical UI | Active on Local, in dev — no critical UI without explicit decision |
| Course progress / next lesson / enrolled cards | Prototype in `courses.html` flagged as future; beta `account.html` MVP-safe shell only |

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

## 4. Docs / Process

| Item | Notes |
|------|--------|
| Preview mu-plugin fate | When to remove temporary integration layer |
| Adapter / ViewModel interface | Gate for LMS + enrolled UI; document before LD / atmo-lms-lite work |
| Cross-repo rollback notes | Keep `CHANGES.md` as source of truth for DB + kadence-child commits |

---

*Last synced from docs: 2026-05-22*
