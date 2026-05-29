# LMS Adapter Spec v0

> **Status:** route live (adapter MVP) · **adapter extracted (`ec5982c`)** · **manual LD entitlement fallback (`9bb70ed`)** · **stage2 entitlement QA PASS 2026-05-29** · account course hub v1 (`81c3a7d`) · hub visual Phase 1 (`b1d21b5`) · lesson plugin blocks CSS Phase 1 (`d37665b`) · endpoint shell (`ecfd8f5`) · adapter MVP (`a352081`) · dashboard wiring (`648e562`) · zero-enrollment QA (691) · **updated 2026-05-29**
> **Scope:** ViewModel contract + adapter boundaries + endpoint plan; phase 1 shell + phase 2 adapter MVP shipped in child theme.  
> **Related:** `BACKLOG.md` §2 · `WP_DEPENDENCY_MAP.md` LMS Map · prototypes `courses.html`, `account.html`, `product-enrolled.html`, `lesson.html`

> **Decision update (2026-05-29):** "Мои курсы" is **entitlement-first**. Woo order data enriches cards/hubs; it is not the sole visibility gate. **Shipped:** `ec5982c` (adapter in **`inc/atmo-lms-adapter.php`**) + `9bb70ed` (manual LD fallback, `grant_source=learndash_manual`). **Stage2 QA PASS 2026-05-29:** user **r4t5**, course **3616** — my-courses card, hub, lesson return link; guest gate PASS; LevelUp mapping confirmed (**2903** product → **2905** LD course) and hub works when enrolled. **Residual:** Woo enriched `woo_order` path needs a completed-order fixture on stage2 before read-only QA.

---

## 1. Purpose

Define a stable **adapter interface** between ATMO child-theme UI and LMS/Woo backends so enrolled courses, progress, and access can ship without LearnDash HTML coupling or premature `atmo-lms-lite` dependency.

**Gate:** adapter-backed enrolled list **shipped (`a352081` 2026-05-22)**; dashboard «Следующий шаг» CTA wiring **shipped (`648e562` 2026-05-22)**; account-shelled enrolled course hub v1 **shipped (`81c3a7d` 2026-05-23)**; hub visual Phase 1 **shipped (`b1d21b5` 2026-05-25)**; LD lesson chrome v1/v2 **shipped (`ed7afcf`, `1e08a3d`, hardened `897409c`)**; lesson H1 number prefix **shipped (`caaaa96` 2026-05-24)** via child lesson chrome title filter; lesson plugin blocks CSS Phase 1 **shipped (`d37665b` 2026-05-25)** via scoped `atmo-lesson.css` — no LD template overrides.

---

## 2. Routes

| Route | Role | Status |
|-------|------|--------|
| `/courses/` | LearnDash **public CPT archive** — nav label **«Программы»** | **Live** (stable public archive) — **not** enrolled UI |
| **`/my-account/my-courses/`** | **«Мои курсы»** — enrolled list (MVP) | **Live (adapter MVP)** — `get_enrolled_courses()` list UI — `a352081` |
| **`/my-account/my-courses/?course_id={id}`** | **Account course hub v1 + visual Phase 1** — enrolled overview + lesson outline | **Live** — existing endpoint + query arg; no new rewrite — `81c3a7d`, `b1d21b5` |
| `/lessons/{slug}/` | LearnDash lesson body | **Live (LD template)** — continue CTA from hub/list still lands here |

### Decision (2026-05-22): enrolled route = **`/my-account/my-courses/`**

**Chosen:** Woo account endpoint **B** — not standalone `/my-courses/`, not public `/courses/`.

| Option | URL | Verdict |
|--------|-----|---------|
| A | `/my-courses/` standalone hub | **Rejected** — prototype `courses.html` uses **account shell** (same `.account-wrap` / sidebar as `account.html`), not a separate course-hub chrome; would duplicate shell CSS and widen blast radius |
| **B** | **`/my-account/my-courses/`** | **Selected** — enrolled state belongs in account IA; reuses `atmo-account.css` + existing endpoint pattern |
| C | Unresolved | **Rejected** — enough evidence to decide; adapter spec + prototype align on account shell |

**Rationale (summary):**

- **UX:** «Мои курсы» = personalized access/progress — same class as orders and dashboard, not public catalog. Prototype nav block: Обзор · **Мои курсы** · Заказы · Настройки (`courses.html`, `account.html`).
- **Public archive stays separate:** header/footer/account **«Программы»** → `/courses/` unchanged.
- **Post-route nav IA (target, not implemented yet):**
  - Account menu: add real **«Мои курсы»** → `/my-account/my-courses/`; keep **«Программы»** → `/courses/` (external) or drop from account sidebar later — prototype omits «Программы» in account nav.
  - Site header: **«Программы»** → `/courses/` stays; optional future logged-in **«Мои курсы»** in header is polish, not MVP blocker.
- **Technical:** no LearnDash CPT slug collision; `is_account_page()` CSS scope already defined; hidden-endpoint audit precedent (`downloads`, `edit-address`, `payment-methods`).
- **Adapter / lite:** route choice does not bind backend — LearnDash today, `atmo-lms-lite` later via same ViewModels.

**Implementation sequence (§11):** (1) register **`my-courses`** endpoint + menu IA + static empty shell — **done `ecfd8f5`**; (2) adapter PHP + wire `get_enrolled_courses()` — **done `a352081`**; (3) dashboard «Следующий шаг» wiring — **done `648e562`**.

**Reserved naming:** **«Мои курсы»** = `/my-account/my-courses/`. **«Программы»** = public `/courses/` only.

---

## 3. Adapter boundaries

### In scope (adapter layer)

- **Implementation (child theme):** `inc/atmo-lms-adapter.php` — loaded from `functions.php` before account/lesson modules (`ec5982c` extraction).
- PHP service(s) that read enrollment, progress, access, and lesson navigation from backend(s).
- Normalized **ViewModels** (arrays/DTOs) returned to theme templates.
- Read-only pairing of Woo **order context** with LMS enrollment where needed for display (purchase/access enrichment, not the only entitlement gate).
- Entitlement fallback rows for backend access without Woo order context (e.g. manual LearnDash course access).

### UI layer rules

- Child theme **templates consume ViewModels only** — no `learndash_*`, no `.learndash-wrapper`, no LD shortcodes in ATMO chrome.
- Catalog `atmo_build_course_card()` (Woo products) remains separate; enrolled lists use **`EnrolledCourse`**, not raw WC product cards.
- **`atmo-lms-lite`:** future LMS replacement; **defer runtime integration (bridge only 2026-05-24)** — Local enrollment/access tables empty; no theme-facing front-end API/UI; adapter may delegate later behind same ViewModels — not direct theme calls.

### Out of scope for v0 / MVP

- LearnDash template overrides (`ld30`, course-grid, single course/lesson).
- Registering Woo rewrites or new endpoints (implementation follows route decision).
- Mutating orders, payment tokens, enrollment, or snippet behavior.
- Wiring prototype demo data (`SHOW_ENROLLED_DEMO`, `shared/data.js`) into WP.

---

## 4. ViewModels

All shapes are **normalized display contracts**. Fields marked *(optional)* may be omitted when unknown; UI must degrade gracefully.

**MVP scope:** `/my-account/my-courses/` enrolled list + account dashboard «Следующий шаг» CTAs — **both shipped**. **Account course hub v1** (`?course_id=`) — **shipped `81c3a7d`**. **LD lesson chrome v1/v2** — **shipped `ed7afcf` / `1e08a3d`, hardened `897409c`** via CSS + filters, no LD template override.

**Field tiers:** **required** = adapter must return for MVP row/state; **optional** = omit or null when unknown; **deferred** = not used on enrolled list MVP.

**UI rule (confirmed):** child theme **never** reads LearnDash HTML, CSS classes (`.learndash-wrapper`, etc.), or LD shortcodes in ATMO chrome — ViewModels only (§3).

### 4.1 `CourseCard`

Shared course/program identity for lists and headers. Catalog cards today cover **Woo sell-side** only; enrolled UI may reuse overlapping fields from LMS course post.

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `id` | required | int | LMS course post ID (or future lite ID) |
| `slug` | required | string | URL slug |
| `title` | required | string | Display title |
| `permalink` | required | string | **Public LD course URL** — unchanged on enrolled rows; use **`course_hub_url`** for account hub |
| `thumbnail_url` | optional | string \| null | Featured image; null → placeholder |
| `excerpt` | optional | string \| null | Short summary |
| `goal_slug` | deferred | string \| null | Goal grouping post-MVP (`courses.html` groups) |
| `goal_label` | deferred | string \| null | Human label |
| `duration_label` | optional | string \| null | e.g. «4 нед · 20 мин» — omit until CMS field exists |

**SoT (today):** LearnDash `sfwd-courses` post (+ linked Woo product attribute when available). **Producible today:** yes for id, slug, title, permalink, thumbnail.

### 4.2 `EnrollmentState`

Per-user enrollment + progress for one course. **Canonical access/expiry fields for enrolled list UI** — use these for status pills, expiry copy, and progress strip (not raw `OrderAccessContext` alone).

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `course_id` | required | int | FK to course |
| `is_enrolled` | required | bool | User has LD enrollment record (may still be `expired` / `pending`) |
| `status` | required | enum | `none` \| `active` \| `expired` \| `completed` \| `pending` |
| `progress_percent` | optional | int \| null | 0–100 when LD progress exists; **null** → hide progress bar (no fake 0%) |
| `completed_steps` | optional | int \| null | Lessons complete; **null** when progress unknown |
| `total_steps` | optional | int \| null | Total lessons; **null** when progress unknown |
| `starts_at` | optional | string \| null | ISO8601 — access window start (see §5 expiry) |
| `order_completed_at` | optional | string \| null | ISO8601 — granting completed order when present (traceability/enrichment) |
| `access_type_label` | optional | string \| null | e.g. «60 дней», «Бессрочно», «Доступ открыт» — from winning order line / variation when present; generic fallback for manual/backend grants |
| `access_duration_days` | optional | int \| null | Parsed days; **null** = lifetime |
| `expires_at` | optional | string \| null | ISO8601 end of finite access; **null** = lifetime — **canonical for list UI** |
| `source_order_id` | optional | int \| null | Woo order that granted the winning access window (support / view-order link) |
| `source_order_item_id` | optional | int \| null | Granting line item ID |
| `source` | required | enum | `learndash` \| `atmo-lms-lite` — which backend answered |
| `grant_source` | optional | enum | `woo_order` \| `learndash_manual` \| `atmo_lms_lite` \| `unknown` — why this row is visible in "Мои курсы" |

**SoT (today):** entitlement = LearnDash course access first (manual/admin enrollment and Woo bridge both count); access window = §5 when Woo duration/order context exists, otherwise unknown/lifetime display fallback; progress = LD user progress APIs/meta when present (fixture user **679** has enrollment but **no** progress meta — nulls are expected).

**Status semantics (MVP UI):**

- `none` — not enrolled; empty state or omit row.
- `active` — access valid (`expires_at` null or future); hub + continue CTA when `next_lesson` present.
- `pending` — no LD enrollment yet, or only non-completed / on-hold orders; generic «ожидание доступа» copy. **Do not** add separate `pending_payment` enum for MVP — unpaid/processing detail lives in `AccessData.reason` / paired `OrderAccessContext.order_status`.
- `expired` — LD enrollment exists but **`expires_at` in the past**; show renewal via `product_permalink`, not lesson links.
- `completed` — LD course complete flag **or** verifiable 100% progress only; show «Пройдена».

### 4.3 `EnrolledCourse`

`CourseCard` + `EnrollmentState` + navigation CTA for list/grid/dashboard rows.

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| *(CourseCard fields)* | | | see §4.1 |
| *(EnrollmentState fields)* | | | see §4.2 |
| `course_hub_url` | required | string | **Account hub URL** — `/my-account/my-courses/?course_id={id}` for enrolled courses (`81c3a7d`); not the public LD course URL |
| `product_permalink` | optional | string \| null | Woo PDP for renewal / «Купить снова» when `expired` or no access; from granting order product/variation |
| `last_lesson` | deferred | `LessonRef` \| null | Post-MVP diary / resume (hub v1 outline shipped via read-only lesson list) |
| `next_lesson` | optional | `LessonRef` \| null | **Null** when unknown — hide «Продолжить» CTA; never invent |
| `cta_label` | optional | string \| null | e.g. «Продолжить», «Начать», «Пройдена» — omit when no CTA |
| `cta_url` | optional | string \| null | Lesson or hub URL; omit when `next_lesson` null and status ≠ `active` |

**MVP UI rules:**

- **`progress_percent` null** → no progress bar / no «0%» (fixture #3616 / user 679).
- **`next_lesson` null** → no continue CTA; generic «Открыть программу» → `course_hub_url` only when `status === active`.
- **`status === expired`** → CTA → `product_permalink` or catalog; disable lesson links.
- **`status === pending`** → no lesson links; optional order hint from paired `OrderAccessContext`.

**Prototype mapping:** `courses.html` grid/list rows; `account.html` «Следующий шаг» hero (when adapter supplies `next_lesson`).

### 4.4 `LessonRef` / `LessonProgress`

Lightweight lesson pointer for nav, outline, and progress strip — not full lesson body.

**`LessonRef`** — used on enrolled list MVP via `EnrolledCourse.next_lesson` only.

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `id` | required | int | Lesson post ID |
| `title` | required | string | Display title |
| `permalink` | required | string | Lesson URL (current `/lessons/` route uses LD template with ATMO chrome CSS/filters) |
| `course_id` | required | int | Parent course |
| `order_index` | required | int | 1-based step in course outline |

**SoT (today):** LearnDash lessons + `learndash_get_course_lessons_list` / progress APIs. **Producible today:** yes when LD exposes next step; **null** `next_lesson` when progress API returns nothing.

**Account hub v1** (`81c3a7d`) uses a lightweight read-only lesson outline from LearnDash lesson-list APIs. Full **`LessonProgress[]`** adapter method remains optional/future:

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `is_complete` | required | bool | |
| `is_accessible` | required | bool | false → locked in outline |
| `is_current` | optional | bool | Highlight in outline |
| `prev` | optional | `LessonRef` \| null | |
| `next` | optional | `LessonRef` \| null | |
| `content_html` | deferred | string \| null | Full lesson body adapter port optional/future |

**Prototype mapping:** `product-enrolled.html` outline steps; `lesson.html` breadcrumb + prev/next.

### 4.5 `AccessData`

Effective access for gating UI (course hub, lesson entry). **Enrolled list + hub v1 denial** use **`EnrollmentState.status`** + enrollment check on `course_id`. **`AccessData` / `get_access()`** for richer hub/lesson gating remains optional polish.

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `has_access` | required | bool | |
| `reason` | required | enum | `enrolled` \| `purchase_pending` \| `expired` \| `guest` \| `none` |
| `expiry` | optional | string \| null | ISO8601 — mirrors `EnrollmentState.expires_at` for gating context |
| `product_id` | optional | int \| null | Linked Woo product |
| `order_id` | optional | int \| null | Granting or pending order |

**`purchase_pending`** covers unpaid/processing/on-hold Woo orders without LD enrollment — use for hub gating and support copy; enrolled list rows use `EnrollmentState.status === pending` instead of a separate enum value.

### 4.6 `OrderAccessContext`

Read-only Woo context for **display** alongside LMS enrollment — **not** enrollment source of truth. Per-order mirror of expiry fields; **list UI reads `EnrollmentState.expires_at`** after multi-order merge (§5).

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `order_id` | required | int | |
| `order_item_id` | optional | int \| null | Granting line item — pairs with `EnrollmentState.source_order_item_id` |
| `order_status` | required | string | Woo status slug |
| `product_id` | required | int | |
| `product_name` | required | string | |
| `variation_id` | optional | int \| null | From order line — use for `_related_course` lookup on variable products |
| `order_completed_at` | optional | string \| null | ISO8601 — Woo order completed timestamp |
| `access_type_label` | optional | string \| null | From item meta `тип-доступа` (e.g. «60 дней», «Бессрочно») |
| `access_duration_days` | optional | int \| null | Parsed from label; **null** = «Бессрочно» |
| `starts_at` | optional | string \| null | ISO8601 — computed per §5 for **this order** |
| `expires_at` | optional | string \| null | ISO8601 or **null** (lifetime) — computed per §5 for **this order** |
| `quiz_meta` | deferred | object \| null | Snippet #15 — display/support only |
| `purchased_at` | optional | string \| null | Order created date (informational; **not** access start for MVP) |

**Rule:** adapter **pairs** `OrderAccessContext` with `EnrollmentState` for pills and pending copy; must not treat order line or **`тип-доступа`** alone as enrolled. **`access_type_label`** is not enrollment SoT (confirmed #3801 fixture — `CHANGES.md` 2026-05-22 mapping discovery).

### 4.7 ViewModel sign-off decisions (2026-05-22)

Contract accepted for MVP **`/my-account/my-courses/`**. Specific answers:

| # | Question | Decision |
|---|----------|----------|
| 1 | `progress_percent` optional/nullable? | **Yes** — `int \| null`; hide bar when null |
| 2 | `completed_steps` / `total_steps` optional? | **Yes** — `int \| null`; omit step copy when null |
| 3 | `next_lesson` nullable; hide CTA when absent? | **Yes** — `LessonRef \| null`; no synthetic continue link |
| 4 | `expires_at` in `EnrollmentState`, `OrderAccessContext`, or both? | **Both** — `EnrollmentState` = canonical merged window for UI; `OrderAccessContext` = per-order computed values for traceability |
| 5 | Separate `pending_payment` in `status`? | **No for MVP** — keep `pending`; use `AccessData.reason = purchase_pending` + `order_status` when detail needed |
| 6 | `source_order_id` / `source_order_item_id`? | **Yes** — optional on `EnrollmentState`; `order_item_id` on `OrderAccessContext` |
| 7 | `product_permalink` for expired renewal CTA? | **Yes** — optional on `EnrolledCourse` |
| 8 | No UI reads LearnDash HTML/classes? | **Confirmed** — ViewModels only; LD URLs allowed in `permalink` fields until ATMO templates exist |

**MVP UI state coverage:**

| UI state | Primary fields |
|----------|----------------|
| Empty enrolled | `get_enrolled_courses()` → `[]` |
| Enrolled list row | `EnrolledCourse` + `CourseCard` + `EnrollmentState` |
| Active finite access | `status: active`, `expires_at` future, `access_type_label` |
| Lifetime access | `expires_at: null`, `access_duration_days: null`, label «Бессрочно» |
| Expired access | `status: expired`, `product_permalink` for renewal |
| Pending / no active access | `status: pending`, optional paired `OrderAccessContext` |
| Continue CTA | `next_lesson` + `cta_url` only when adapter provides |
| No fake progress | `progress_percent: null` → no bar |

---

## 5. Source mapping

| ViewModel | Primary source (today) | Secondary / display | Future (`atmo-lms-lite`) |
|-----------|------------------------|---------------------|---------------------------|
| `CourseCard` (catalog) | Woo product (`atmo_build_course_card`) | — | Optional lite course link |
| `CourseCard` (LMS) | LearnDash `sfwd-courses` | Goal from product attribute if linked | Lite courses module |
| `EnrollmentState` | LearnDash user course access + progress APIs | — | Lite enrollment + access-rules |
| `EnrolledCourse` | Compose backend entitlement + optional order context | `OrderAccessContext` | Same interface, different driver |
| `LessonRef` / `LessonProgress` | LearnDash lessons + user progress | — | Lite lessons module |
| `AccessData` | LD enrollment + adapter-computed expiry (§5) | Woo non-completed order state | Lite access-gate |
| `OrderAccessContext` | WooCommerce order + line item meta (#15, `тип-доступа`) | — | Lite guest-orders / reconciler |

**Enrollment source of truth (today):** LearnDash course access, including both manual/admin enrollment and LearnDash WooCommerce bridge. Woo orders supply access labels, duration, traceability, and renewal product context; they are enrichment, not the sole visibility gate. Snippet **#5** inactive. **`atmo-lms-lite`** access tables **empty on Local** — not SoT for MVP.

### Product ↔ course mapping (discovered 2026-05-22)

**Mechanism:** LearnDash WooCommerce bridge post meta **`_related_course`** (array of LD course post IDs).

**Redesign catalog:** 18 Woo products → 18 LD courses (17 simple 1:1 + variable **#3614** via variations **#3628** / **#3629** → course **#3616**). Legacy publish products without `_related_course` are out of redesign MVP scope.

**Adapter resolver (MVP):**

1. If order/line has **`variation_id`** → read **`_related_course`** on the **variation**.
2. Else → read **`_related_course`** on the **parent product**.
3. Resolve by **course ID** from meta — **not** slug/title matching (e.g. product `abdomen_pelvic` → course `abdominal_pelvicfloormuscles`).

**Verified fixture chain:** order **#3801** → variation **3628** → course **3616** → user **679** enrolled (`r4t5`); no progress usermeta on Local.

### Access expiry (decided 2026-05-22 — adapter MVP)

**Principle:** finite paid access (e.g. **«60 дней»**) is computed from **LearnDash access start**, **not** order completed date. LD course **#3616** has **`expire_access` off** on Local — adapter computes display/status for MVP **without mutating** LD course settings or user meta.

#### Access start (`starts_at`)

| Priority | Source |
|----------|--------|
| 1 | User meta **`course_{course_id}_access_from`** (Unix → ISO8601) |
| 2 | User meta **`learndash_course_{course_id}_enrolled_at`** |
| 3 | Woo **`order_completed_at`** from the **completed** order that granted access |

#### Duration and expiry

| Step | Rule |
|------|------|
| Label source | Order line meta **`тип-доступа`** → fallback variation **`attribute_тип-доступа`** |
| Parse | **`access_duration_days`** — e.g. «60 дней» → `60`; **«Бессрочно»** → `null` |
| Compute | **`expires_at = starts_at + access_duration_days`** (days); lifetime → **`expires_at = null`** |
| Status | **`expired`** when `expires_at` is set and now > `expires_at`; **`pending`** when no LD enrollment yet or only non-completed orders |

#### Order gating

Pending / failed / cancelled Woo orders **do not** grant **active** access. Enrollment SoT remains LD + bridge; orders supply duration labels and fallback start only.

#### Multiple completed orders → same LD course (MVP rule)

When several completed orders map to one course for one user:

1. **Lifetime** (`access_duration_days = null`) **beats** any finite window.
2. Else use the grant whose computed window yields the **latest `expires_at`** (longest remaining access).

Post-MVP: reconcile with refunds / `atmo-lms-lite` if rules diverge.

#### ViewModel fields

`EnrollmentState` and `OrderAccessContext` both expose: **`starts_at`**, **`order_completed_at`**, **`access_type_label`**, **`access_duration_days`**, **`expires_at`** (see §4.2, §4.6). **`EnrollmentState`** also carries optional **`source_order_id`** / **`source_order_item_id`**; **`EnrolledCourse`** adds optional **`product_permalink`** for renewal CTAs (§4.7).

---

## 6. Adapter interface (conceptual)

Implementation file/namespace TBD in child theme or small mu-plugin. v0 defines **required capabilities**, not PHP signatures.

| Capability | Returns | Used by |
|------------|---------|---------|
| `get_enrolled_courses( user_id )` | `EnrolledCourse[]` | «Мои курсы» list, dashboard course panel |
| `get_enrollment_state( user_id, course_id )` | `EnrollmentState` | Course hub, access banners |
| `get_access( user_id, course_id )` | `AccessData` | Gating, expired/pending UI |
| `get_course_outline( user_id, course_id )` | `LessonProgress[]` | Hub v1 uses **inline** lightweight outline (`81c3a7d`); formal adapter method / full `LessonProgress[]` optional future |
| `get_next_lesson( user_id, course_id )` | `LessonRef` \| null | Dashboard «Следующий шаг», continue CTA |
| `get_order_access_context( order_id )` | `OrderAccessContext` \| null | View-order pairing, pending access copy |

**Null/empty policy:** return empty arrays or explicit `status: none` — never synthetic progress.

---

## 7. MVP enrolled UI requirements

Minimum first ship once route + adapter are approved (maps to `courses.html` default empty state + future demo-off behavior):

1. **Empty enrolled state** — user with zero enrollments: honest copy + CTAs to catalog and/or «Программы» (`/courses/`); no fake rows.
2. **Enrolled list** — one or more `EnrolledCourse` rows/cards: title, status, `access_type_label` / `expires_at` when finite; **`progress_percent` only when non-null**.
3. **Continue / next lesson CTA** — render **only** when adapter returns non-null `next_lesson` + safe `cta_url`; otherwise hub link or «Открыть программу» when `status === active`.
4. **Expired / pending** — distinct copy and disabled lesson links when `status` is `expired` or `pending`; **`product_permalink`** for renewal; surface order hint when `OrderAccessContext` exists.

**Manual/backend grant fallback (decided 2026-05-29):** if the user has LearnDash course access but no Woo completed-order context, still render an `EnrolledCourse` row and allow the account hub. Use generic copy such as «Доступ открыт» / «Срок не указан», `grant_source=learndash_manual`, `source_order_id=null`, and `expires_at=null` unless backend expiry data exists. Do not show purchase/order metadata that is not known.

**Shipped beyond list MVP:** account course hub v1 at **`?course_id=`** — title, status, access meta, honest progress, lesson outline, continue CTA to LD lesson (`81c3a7d`).

**Explicitly later:** list/grid toggle, goal grouping, formal `LessonProgress[]` adapter method, diary/trainer widgets (`account.html` localStorage panels), optional full lesson body adapter port.

---

## 8. Non-goals (v0)

- Fake or demo progress in production templates.
- LearnDash template overrides or LD shortcodes inside ATMO shell.
- Woo endpoint / rewrite registration (follows route decision).
- Payment token, order, or enrollment mutation from theme.
- Critical dependency on `atmo-lms-lite` front-end.
- Re-enabling Snippet #5 or changing snippet behavior as part of adapter v0.
- Mutating LearnDash **`expire_access`** settings or writing LD expiry user meta from the adapter.
- HPOS migration or checkout flow changes.

---

## 9. Risks and open questions

| Topic | Risk / question | Mitigation |
|-------|-----------------|------------|
| **Enrollment SoT** | LD bridge today vs future `atmo-lms-lite` | Adapter interface stable; swap driver behind `source` field |
| **Route location** | ~~B vs C~~ | **Decided:** `/my-account/my-courses/` — endpoint plan §11 |
| **Rewrite flush** | New endpoint 404 until permalinks flushed | One-time flush after registration commit; do not flush on every `init` |
| **Fake `atmo-courses` menu** | ~~Label collision~~ | **Resolved `ecfd8f5`** — fake slug removed; **«Программы»** header/footer only |
| **Code Snippets** | Logic in DB, not VCS | **Done:** `docs/snippets/` export — re-export when DB changes |
| **Thank-you redirect** | Snippet #5 broken URL, inactive | Keep inactive. Canonical Woo `order-received` layer now lives in child theme (`f9a7b95`); no redirect needed |
| **Product ↔ course map** | ~~Woo ID ≠ LD ID~~ | **Discovered:** `_related_course` + variation-first resolver — `CHANGES.md` 2026-05-22 |
| **Access expiry** | ~~LD `expire_access` off~~ | **Decided:** adapter computes from LD `starts_at` + Woo duration label — `CHANGES.md` 2026-05-22 |
| **Lesson URLs** | Continue CTAs land on LD lesson URLs | **Current:** `/lessons/` keeps LD template with ATMO chrome CSS/filters (`ed7afcf`, `1e08a3d`, `897409c`); entry H1 **`Урок N · {title}`** via title filter (`caaaa96`); no child template override |
| **Dashboard widgets** | Diary/trainer from other plugins | Out of MVP; do not block enrolled list on diary data |

---

## 10. Sign-off checklist

Before any enrolled UI or route implementation:

- [x] Product approves ViewModel field list — **2026-05-22** (§4.7).
- [x] Enrolled route chosen: **`/my-account/my-courses/`** (`BACKLOG.md` #2 — 2026-05-22).
- [x] Woo **`my-courses`** endpoint shell (phase 1) — **`ecfd8f5` 2026-05-22** (§11 commit A).
- [x] LMS adapter PHP + wire endpoint to **`get_enrolled_courses()`** (§11 commit B) — **`a352081` 2026-05-22**.
- [x] Account regression QA after adapter MVP — **2026-05-22** (§11.0a · `CHANGES.md`).
- [x] Dashboard «Следующий шаг» CTA wiring (phase 3) — **`648e562` 2026-05-22** (§11.0b · `CHANGES.md`).
- [x] Zero-enrollment empty-state QA — fixture **691** / `atmo-qa-empty` — **2026-05-22** (§11.0c · `CHANGES.md`).
- [x] Enrollment SoT documented for MVP — **LD + bridge** (`_related_course` resolver §5).
- [x] Code Snippets export/backup completed — `docs/snippets/` (`CHANGES.md` 2026-05-22).
- [x] Product ↔ course mapping discovered — **`_related_course`** + variation-first resolver (`CHANGES.md` 2026-05-22).
- [x] **Access expiry semantics** — LD access start + Woo duration label (`CHANGES.md` 2026-05-22).
- [x] **No LearnDash HTML in ATMO UI** — ViewModels only (§3, §4.7 #8).
- [x] **Account course hub v1** — query URL on existing endpoint — **`81c3a7d` 2026-05-23** (§11.0d).
- [x] **Adapter extraction** — dedicated `inc/atmo-lms-adapter.php` — **`ec5982c` 2026-05-29** (§11.0e).
- [x] **Manual LD entitlement fallback** — Woo-first merge + `learndash_manual` rows — **`9bb70ed` 2026-05-29** (§11.0f).
- [x] **Stage2 entitlement QA** — manual LD course **3616** card + hub + return link — **2026-05-29** (§11.0f).

**After sign-off:** endpoint shell **shipped** (`ecfd8f5`); adapter MVP **shipped** (`a352081`); dashboard CTA wiring **shipped** (`648e562`); account course hub v1 **shipped** (`81c3a7d`); lesson chrome v1/v2 **shipped** (`ed7afcf`, `1e08a3d`, `897409c`); zero-enrollment empty-state QA **done** (fixture **691**); theme consumes ViewModels and scoped filters/CSS — no LD template overrides.

### 11.0 Phase 1 shipped (`ecfd8f5` 2026-05-22)

| Item | Status |
|------|--------|
| `add_rewrite_endpoint( 'my-courses', EP_ROOT \| EP_PAGES )` | **Live** |
| Account menu **Обзор · Мои курсы · Заказы · Настройки · Выйти** | **Live** |
| Fake **`atmo-courses`** + URL override removed | **Done** |
| Static empty **`.atmo-my-courses`** shell | **Live** — no adapter, no LD API, no fake progress |
| Header/footer **«Программы»** → `/courses/` | **Unchanged** |
| Local QA post-flush | **PASS** — see `CHANGES.md` |
| Permalink flush on deploy | **Manual one-time** — no PHP flush in theme |

**Rollback:** `git revert ecfd8f5` + manual permalink flush.

### 11.0a Phase 2 shipped (`a352081` 2026-05-22)

| Item | Status |
|------|--------|
| `atmo_get_enrolled_courses()` read-only adapter | **Live** |
| Completed Woo orders → `_related_course` (variation first) → LD enrollment meta | **Live** |
| Access type: item meta **`тип-доступа`** + variation attribute fallback | **Live** |
| Lifetime vs unknown duration handling | **Live** — explicit «Бессрочно» only |
| `starts_at` / `expires_at` per §5 | **Live** — adapter-computed, no LD meta mutation |
| Progress bar | **Hidden** unless real activity/completion — no fake 0% |
| «Продолжить» / `next_lesson` | **Live** when LD returns safe incomplete lesson |
| Enrolled list UI (`.atmo-my-courses__list`) | **Live** — empty state when `[]` |
| Local QA (#3801 / r4t5) | **PASS** — `CHANGES.md` |
| Account regression QA (post-`a352081`) | **PASS** — 8 routes × desktop/mobile; no blockers — `CHANGES.md` |

**Rollback:** `git revert a352081` — endpoint shell `ecfd8f5` remains.

### 11.0b Phase 3 shipped (`648e562` 2026-05-22)

| Item | Status |
|------|--------|
| Stale dashboard LMS-future copy removed | **Done** |
| «Следующий шаг» wired via `atmo_get_enrolled_courses()` | **Live** — read-only; no dashboard list/progress |
| Continue-lesson hero CTA | **Live** when adapter returns safe **«Продолжить»** (`next_lesson` + `cta_url`) |
| Fallback CTAs | **Live** — **`/my-account/my-courses/`** + catalog when no continue lesson |
| «Курсы» panel IA | **Live** — **Мои курсы** vs **Программы** clarified; dual CTAs |
| `/my-account/my-courses/` adapter page | **Unchanged** |
| Local QA (#3801 / r4t5) | **PASS** — dashboard + my-courses + `/courses/` desktop/mobile — `CHANGES.md` |

**Caveats:** dashboard calls adapter on every `/my-account/` load; multi-course hero = first active continue CTA (adapter sort).

**Rollback:** `git revert 648e562` — adapter `a352081` + endpoint `ecfd8f5` remain.

### 11.0c Zero-enrollment QA fixture + empty-state QA (691 / `atmo-qa-empty` 2026-05-22)

| Item | Status |
|------|--------|
| Local-only fixture user **691** / `atmo-qa-empty` | **Created** — customer; 0 orders; 0 LD enrollment meta |
| Enrolled-path pair fixture | **r4t5 / #3801** — unchanged |
| `/my-account/` empty dashboard | **QA PASS** — desktop + mobile — `CHANGES.md` |
| `/my-account/my-courses/` empty state | **QA PASS** — desktop + mobile — `CHANGES.md` |
| `/courses/` public archive | **QA PASS** — 18 programs unchanged — `CHANGES.md` |

**Rollback:** delete user **691** via WP Admin or SQL; no orders/enrollments to clean.

### 11.0e Adapter extraction shipped (`ec5982c` 2026-05-29)

| Item | Status |
|------|--------|
| `inc/atmo-lms-adapter.php` | **Live** — read-only adapter; no hooks/HTML |
| `inc/atmo-account.php` | **Slimmed** — display helpers only |
| `functions.php` require order | **Adapter before account/lesson/confirmation** |
| Runtime behavior | **Unchanged** — refactor/split only |
| PHP lint | **PASS** — Local |

**Rollback:** `git revert ec5982c` — restores inline adapter in account (if reverting without `9bb70ed`).

### 11.0f Manual LD entitlement fallback shipped (`9bb70ed` 2026-05-29)

| Item | Status |
|------|--------|
| `atmo_get_enrolled_courses()` merge order | **Woo grants first**, then manual LD IDs not in Woo map |
| `grant_source` | **`woo_order`** \| **`learndash_manual`** on `EnrolledCourse` |
| Manual row copy | «Доступ открыт» / «Срок не указан»; no fake order fields |
| Hub gate | **Same enrolled list** — manual courses get `?course_id=` hub |
| Stage2 QA | **PASS** — **r4t5** / course **3616** (card, hub, lesson return); guest gate PASS |
| LevelUp mapping | **2903** Woo product → **2905** LD course; hub works when **2905** is enrolled |
| Residual | Woo enriched `woo_order` path pending completed-order fixture on stage2 |

**Rollback:** `git revert 9bb70ed` after `ec5982c` — Woo-only enrolled list returns.

### 11.0d Account course hub v1 shipped (`81c3a7d` 2026-05-23)

| Item | Status |
|------|--------|
| Hub URL pattern | **`/my-account/my-courses/?course_id={LD course id}`** — no new rewrite endpoint |
| `EnrolledCourse.course_hub_url` | Points to account hub query URL — not public `/courses/...` |
| `EnrolledCourse.permalink` | Remains **public LD course URL** |
| Hub content | Adapter ViewModel + read-only `learndash_get_course_lessons_list()` outline — no scraped LD HTML |
| Continue CTA | **«Продолжить»** → existing LearnDash lesson URL (`cta_url` / `next_lesson`) |
| Denial state | Unknown / unauthorized `course_id` → **«Программа недоступна»** |
| LearnDash templates | **Not overridden** — hub is account shell only |
| Permalink flush | **Not required** |
| Local QA | **PASS** — r4t5 / atmo-qa-empty / public route regression — `CHANGES.md` |

**Rollback:** `git revert 81c3a7d` — enrolled list adapter (`a352081`) + endpoint (`ecfd8f5`) remain; **no permalink flush**.

### 11.0e Account course hub visual Phase 1 shipped (`b1d21b5` 2026-05-25)

| Item | Status |
|------|--------|
| Scope | Visual only — same hub URL and ViewModel data as v1 (`81c3a7d`) |
| Files | `inc/atmo-account.php`, `assets/css/atmo-account.css` |
| UI | Hero band, continue card, progress strip, `#atmo-course-hub-outline`, `.atmo-course-hub__outline-item--current` |
| Continue CTA | Unchanged — **«Продолжить»** → LD lesson URL; **«К содержанию»** → in-page outline anchor |
| Not shipped | Marketing body/video/tick-list; per-course accent; Теория/Практика grouping; `atmo-lms-lite` cutover |
| Local QA | **PASS** — r4t5 / course 3616 / desktop + mobile — `CHANGES.md` |

**Rollback:** `git revert b1d21b5` — hub v1 (`81c3a7d`) remains functional; **no permalink flush**.

### 11.0f Lesson plugin blocks CSS Phase 1 shipped (`d37665b` 2026-05-25)

| Item | Status |
|------|--------|
| Scope | CSS-only — plugin/content blocks inside LD lesson body; lesson chrome unchanged |
| File | `assets/css/atmo-lesson.css` only |
| Blocks | Diary `#ldtd`; reflection `.atmo-rf-wrap`; photos `.ldtd-photos-block`; compare `.ldtd-compare-block` |
| Not shipped | Plugin PHP; global enqueue tightening; `atmo-lms-lite`; LD template overrides |
| Local QA | **PASS** — r4t5 / course 3616 / desktop + mobile — `CHANGES.md` |

**Rollback:** `git revert d37665b` — lesson chrome commits remain; **no permalink flush**.

---

## 11. Woo `my-courses` endpoint plan (audit 2026-05-22)

> **Note:** §11.1–11.8 below is the **historical implementation plan** (pre-ship audit + phased rollout). Shipped state: §11.0–§11.0f · current routes: §2.

Read-only audit of `kadence-child/inc/atmo-account.php`, `functions.php`, `atmo-account.css`. **No PHP shipped in audit commit.**

### 11.1 Account menu mechanism (post-`ecfd8f5`)

| Piece | Current | File |
|-------|---------|------|
| Menu rebuild | `woocommerce_account_menu_items` @ priority 20 → 5 slugs | `atmo-account.php` |
| Endpoint **`my-courses`** | Label **«Мои курсы»** — real Woo rewrite | same |
| URL | Standard Woo endpoint URL — **no** `woocommerce_get_endpoint_url` override | — |
| Site chrome | Header + footer **«Программы»** → `/courses/` | `atmo-header.php`, `atmo-footer.php` |
| Retired **`atmo-courses`** | Removed from account sidebar in **`ecfd8f5`** | — |

### 11.1a Pre-ship state (reference — superseded by `ecfd8f5`)

| Piece | Today | File |
|-------|-------|------|
| Menu rebuild | `woocommerce_account_menu_items` @ priority 20 → 5 slugs | `atmo-account.php` |
| Fake slug **`atmo-courses`** | Label **«Программы»** — **not** a Woo rewrite endpoint | same |
| External URL | `woocommerce_get_endpoint_url` filter: `atmo-courses` → `home_url( '/courses/' )` | same |
| Direct `/my-account/atmo-courses/` | **No** `add_rewrite_endpoint` — URL is not a real account route; nav link works via filter only | — |
| Site chrome | Header + footer **«Программы»** → `/courses/` (`atmo-header.php`, `atmo-footer.php`) | separate from account menu |

**When real `/my-account/my-courses/` ships:**

1. Replace menu slug **`atmo-courses`** → **`my-courses`** with label **«Мои курсы»** (prototype IA: no **«Программы»** in account sidebar).
2. **Remove** `atmo_filter_account_endpoint_url` branch for `atmo-courses` (real endpoint generates URL).
3. **Register** rewrite endpoint **`my-courses`** (below).
4. Leave header/footer **«Программы»** → `/courses/` unchanged.
5. Follow-up: point dashboard CTAs from generic `/courses/` copy to **`my-courses`** where enrolled UX fits — **done `648e562`**.

### 11.2 Endpoint mechanics

**Proposed slug:** `my-courses` → URL **`/my-account/my-courses/`** (Woo account page + endpoint).

**Required hooks (child theme, `inc/atmo-account.php` or dedicated include):**

| Hook | Purpose |
|------|---------|
| `init` | `add_rewrite_endpoint( 'my-courses', EP_ROOT \| EP_PAGES );` — match Woo account endpoint pattern |
| `woocommerce_account_menu_items` | Insert **`my-courses`** after `dashboard`, before `orders`; drop **`atmo-courses`** |
| `woocommerce_account_my-courses_endpoint` | Render enrolled page content (shell first, adapter later) |

**Not needed for MVP:** `woocommerce_get_endpoint_url` override (standard slug), `template_redirect`, custom query vars beyond endpoint.

**Rewrite flush — when and how:**

- **Required once** after first deploy of endpoint registration; until flush, direct URL may 404 or fall back to account root.
- **Safe:** theme switch hook, manual **Settings → Permalinks → Save**, or one-off `wp rewrite flush` on Local.
- **Avoid:** `flush_rewrite_rules()` on every `init` — performance + race risk.
- **Rollback:** revert registration commit, then flush/save permalinks again.

**Collision / redirect avoidance:**

| Risk | Mitigation |
|------|------------|
| Slug **`my-courses`** vs LD CSS class names | No conflict — Woo query var only |
| Public **`/courses/`** CPT archive | Different path; no rewrite overlap |
| Retired **`atmo-courses`** fake slug | Remove from menu + URL filter in same commit as registration |
| LearnDash / plugins | No active plugin registers Woo endpoint **`my-courses`** on Local (grep 2026-05-22) |
| Logged-out access | Woo **`is_account_page()`** behavior unchanged — expect login prompt / redirect to auth shell (same as `/orders/`) |

### 11.3 Target account menu IA

| Label | Slug | URL |
|-------|------|-----|
| Обзор | `dashboard` | `/my-account/` |
| **Мои курсы** | **`my-courses`** | **`/my-account/my-courses/`** |
| Заказы | `orders` | `/my-account/orders/` |
| Настройки | `edit-account` | `/my-account/edit-account/` |
| Выйти | `customer-logout` | logout |

**«Программы» after endpoint ships:**

| Location | Keep? | Target |
|----------|-------|--------|
| Account sidebar | **No** (drop fake `atmo-courses`) | — |
| Site header | **Yes** | `/courses/` |
| Site footer | **Yes** | `/courses/` |
| Dashboard shell CTAs | **Live** — **«Мои курсы»** → `/my-account/my-courses/`; **«Программы»** → `/courses/`; catalog fallback — **`648e562`**

### 11.4 Rendering phases

| Phase | Content | Adapter |
|-------|---------|---------|
| **1 — Shell (recommended first ship)** | ATMO empty state: honest copy + CTAs to **«Программы»** / catalog; wrapper e.g. `.atmo-my-courses` | **Done `ecfd8f5`** |
| **2 — Adapter** | List rows from **`EnrolledCourse[]`** per §4.3 / §7 | **Done `a352081`** — `get_enrolled_courses()` |
| **3 — Dashboard** | «Следующий шаг» hero uses adapter when non-null `next_lesson` | **Done `648e562`** — read-only adapter reuse; no list/progress on dashboard |

**Shell rules:** no LearnDash HTML/classes; no fake progress rows; match MVP empty state in §7.

### 11.5 CSS scope

- **Reuse** `atmo-account.css` — already enqueued on `is_account_page()` in `functions.php`.
- **Scope new rules** under `.atmo-my-courses` (or `.atmo-enrolled-list`) inside existing `body.woocommerce-account.logged-in .woocommerce-MyAccount-content` patterns.
- **Do not** broaden selectors that hit orders, edit-account, edit-address, payment-methods, add-payment-method passes.
- Nav active state: Woo adds `is-active` on `li.woocommerce-MyAccount-navigation-link--my-courses` when endpoint matches — existing nav CSS applies.

### 11.6 QA plan (post-implementation)

| Check | Expected |
|-------|----------|
| `/my-account/my-courses/` logged in | 200, ATMO shell, empty state (phase 1) or enrolled list (phase 2) |
| Same URL logged out | Auth shell / login gating — consistent with other account endpoints |
| Nav | **«Мои курсы»** active on endpoint; **«Программы»** absent from sidebar; 5 items, no overflow (390×844) |
| Hidden endpoints | `/downloads/`, `/edit-address/`, `/payment-methods/` — still styled, unchanged |
| Public archive | `/courses/` — still LD archive, 18 cards, **not** enrolled-only |
| Dashboard | Still on `dashboard` only; no regression on orders/settings QA passes |
| Permalinks | Direct URL works after one flush |

**Account regression sweep (post-`a352081`, 2026-05-22):** **PASS** — `/my-account/` · `/my-account/my-courses/` · `/my-account/orders/` · `/view-order/3801/` · `/edit-account/` · `/edit-address/` · `/payment-methods/` · `/courses/` on desktop **1440×900** + mobile **390×844**; scope checks OK — `CHANGES.md`. Dashboard stale copy resolved in phase 3 **`648e562`**.

**Dashboard CTA wiring QA (post-`648e562`, 2026-05-22):** **PASS** — `/my-account/` · `/my-account/my-courses/` · `/courses/` desktop + mobile; no overflow — `CHANGES.md` (enrolled path: r4t5 / #3801).

**Zero-enrollment empty-state QA (691 / `atmo-qa-empty`, 2026-05-22):** **PASS** — `/my-account/` + `/my-account/my-courses/` empty paths desktop + mobile; `/courses/` archive unchanged — `CHANGES.md`.

### 11.7 Rollback

1. Revert child-theme commit(s): endpoint registration, menu filter, render callback, CSS.
2. **Flush permalinks** (save or CLI) so retired slug stops resolving.
3. Restore interim **`atmo-courses`** + **«Программы»** menu if rolling back before IA cutover.
4. Revert docs if needed (`CHANGES.md`, this file §11).

### 11.8 Implementation strategy decision

| Option | Verdict |
|--------|---------|
| **A — Endpoint shell first** (empty/static state, menu IA, rewrite) | **Recommended** — validates route, nav, CSS blast radius, and logged-out behavior before adapter complexity |
| B — Adapter first, endpoint second | **Rejected** — no safe place to QA adapter output; higher integration risk |
| C — Combined endpoint + adapter in one MVP | **Defer** — acceptable only if team accepts larger single PR; not safest |

**Safest sequence:**

1. **Docs** — endpoint plan (this section) ✓  
2. **Child theme commit A** — `add_rewrite_endpoint`, menu IA (**«Мои курсы»**), remove **`atmo-courses`**, static empty shell, scoped CSS — **done `ecfd8f5`** · one-time permalink flush documented in `CHANGES.md`  
3. **QA** — §11.6 — **PASS on Local 2026-05-22**  
4. **Child theme commit B** — LMS adapter PHP + wire `woocommerce_account_my-courses_endpoint` to **`get_enrolled_courses()`** — **done `a352081`** · QA PASS — `CHANGES.md`  
4a. **Account regression QA** (post-`a352081`) — **PASS 2026-05-22** — `CHANGES.md`  
5. **Commit C** — dashboard «Следующий шаг» + panel links to **`my-courses`** — **done `648e562`** · QA PASS — `CHANGES.md`  
6. **Zero-enrollment fixture + QA** — user **691** / `atmo-qa-empty`; empty dashboard + my-courses QA — **done 2026-05-22** — `CHANGES.md`

---

*Spec v0 — 2026-05-22–29. Adapter MVP, extraction (`ec5982c`), manual entitlement fallback (`9bb70ed`), stage2 entitlement QA, guest gate QA, hub/lesson chrome, and `atmo-lms-lite` bridge decision shipped/recorded. Follow-ups: Woo fixture QA, LD meta verification for specific test users, optional PHPUnit (Commit 3b). `atmo-lms-lite` API/cutover waits until product-ready.*
