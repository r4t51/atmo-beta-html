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
| Adapter / ViewModel interface | Gate for LMS + enrolled UI; document before LD / atmo-lms-lite work |
| Cross-repo rollback notes | Keep `CHANGES.md` as source of truth for DB + kadence-child commits |

---

*Last synced from docs: 2026-05-22*
