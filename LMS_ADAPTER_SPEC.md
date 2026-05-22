# LMS Adapter Spec v0

> **Status:** route decided · **ViewModel sign-off done** · endpoint audit pending · **2026-05-22**  
> **Scope:** ViewModel contract + adapter boundaries only — no PHP implementation, no route registration, no WP changes.  
> **Related:** `BACKLOG.md` §2 · `WP_DEPENDENCY_MAP.md` LMS Map · prototypes `courses.html`, `account.html`, `product-enrolled.html`, `lesson.html`

---

## 1. Purpose

Define a stable **adapter interface** between ATMO child-theme UI and LMS/Woo backends so enrolled courses, progress, and access can ship without LearnDash HTML coupling or premature `atmo-lms-lite` dependency.

**Gate:** no enrolled UI, dashboard LMS widgets, or deep port of `lesson.html` / `product-enrolled.html` until ViewModel contract is signed off (**done 2026-05-22**) and **`my-courses`** endpoint audit is complete (`BACKLOG.md` §2).

---

## 2. Routes

| Route | Role | Status |
|-------|------|--------|
| `/courses/` | LearnDash **public CPT archive** — nav label **«Программы»** | **Live** (interim relabel 2026-05-22) — **not** enrolled UI |
| **`/my-account/my-courses/`** | **«Мои курсы»** — enrolled list + progress (MVP) | **Decided, not built** — Woo account endpoint |

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

**Implementation still blocked by:** `my-courses` endpoint registration audit, Code Snippets export — see §10. ViewModel contract signed off 2026-05-22 (§4.7).

**Reserved naming:** **«Мои курсы»** = `/my-account/my-courses/`. **«Программы»** = public `/courses/` only.

---

## 3. Adapter boundaries

### In scope (adapter layer)

- PHP service(s) that read enrollment, progress, access, and lesson navigation from backend(s).
- Normalized **ViewModels** (arrays/DTOs) returned to theme templates.
- Read-only pairing of Woo **order context** with LMS enrollment where needed for display (not SoT).

### UI layer rules

- Child theme **templates consume ViewModels only** — no `learndash_*`, no `.learndash-wrapper`, no LD shortcodes in ATMO chrome.
- Catalog `atmo_build_course_card()` (Woo products) remains separate; enrolled lists use **`EnrolledCourse`**, not raw WC product cards.
- **`atmo-lms-lite`:** not a critical UI backend until explicit product decision; adapter may stub or delegate later.

### Out of scope for v0 / MVP

- LearnDash template overrides (`ld30`, course-grid, single course/lesson).
- Registering Woo rewrites or new endpoints (implementation follows route decision).
- Mutating orders, payment tokens, enrollment, or snippet behavior.
- Wiring prototype demo data (`SHOW_ENROLLED_DEMO`, `shared/data.js`) into WP.

---

## 4. ViewModels

All shapes are **normalized display contracts**. Fields marked *(optional)* may be omitted when unknown; UI must degrade gracefully.

**MVP scope:** `/my-account/my-courses/` enrolled list + account dashboard «Следующий шаг» shell. **`LessonProgress[]` outline** and full **`product-enrolled.html`** hub are **post-MVP** — list MVP needs `EnrolledCourse` + optional `LessonRef` on `next_lesson` only.

**Field tiers:** **required** = adapter must return for MVP row/state; **optional** = omit or null when unknown; **deferred** = not used on enrolled list MVP.

**UI rule (confirmed):** child theme **never** reads LearnDash HTML, CSS classes (`.learndash-wrapper`, etc.), or LD shortcodes in ATMO chrome — ViewModels only (§3).

### 4.1 `CourseCard`

Shared course/program identity for lists and headers. Catalog cards today cover **Woo sell-side** only; enrolled UI may reuse overlapping fields from LMS course post.

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `id` | required | int | LMS course post ID (or future lite ID) |
| `slug` | required | string | URL slug |
| `title` | required | string | Display title |
| `permalink` | required | string | Public LD course URL or enrolled hub URL (context-dependent) |
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
| `order_completed_at` | optional | string \| null | ISO8601 — granting completed order (fallback start + traceability) |
| `access_type_label` | optional | string \| null | e.g. «60 дней», «Бессрочно» — from winning order line / variation |
| `access_duration_days` | optional | int \| null | Parsed days; **null** = lifetime |
| `expires_at` | optional | string \| null | ISO8601 end of finite access; **null** = lifetime — **canonical for list UI** |
| `source_order_id` | optional | int \| null | Woo order that granted the winning access window (support / view-order link) |
| `source_order_item_id` | optional | int \| null | Granting line item ID |
| `source` | required | enum | `learndash` \| `atmo-lms-lite` — which backend answered |

**SoT (today):** enrollment = LearnDash + bridge; access window = §5 (LD user meta + Woo duration); progress = LD user progress APIs/meta when present (fixture user **679** has enrollment but **no** progress meta — nulls are expected).

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
| `course_hub_url` | required | string | Enrolled course overview (maps to `product-enrolled.html` intent; may be LD course URL until hub port) |
| `product_permalink` | optional | string \| null | Woo PDP for renewal / «Купить снова» when `expired` or no access; from granting order product/variation |
| `last_lesson` | deferred | `LessonRef` \| null | Post-MVP outline / diary |
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
| `permalink` | required | string | Lesson URL (LD URL until ATMO lesson template) |
| `course_id` | required | int | Parent course |
| `order_index` | required | int | 1-based step in course outline |

**SoT (today):** LearnDash lessons + `learndash_get_course_lessons_list` / progress APIs. **Producible today:** yes when LD exposes next step; **null** `next_lesson` when progress API returns nothing.

**`LessonProgress`** extends `LessonRef` — **deferred for enrolled list MVP** (course hub outline post-MVP):

| Field | Tier | Type | Notes |
|-------|------|------|-------|
| `is_complete` | required | bool | |
| `is_accessible` | required | bool | false → locked in outline |
| `is_current` | optional | bool | Highlight in outline |
| `prev` | optional | `LessonRef` \| null | |
| `next` | optional | `LessonRef` \| null | |
| `content_html` | deferred | string \| null | Full lesson port post-MVP |

**Prototype mapping:** `product-enrolled.html` outline steps; `lesson.html` breadcrumb + prev/next.

### 4.5 `AccessData`

Effective access for gating UI (course hub, lesson entry). **Enrolled list MVP** uses **`EnrollmentState.status`** + `expires_at` for row copy; `AccessData` is for **`get_access()`** on hub/lesson routes (post-MVP deep port).

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
| `EnrolledCourse` | Compose LMS + optional order context | `OrderAccessContext` | Same interface, different driver |
| `LessonRef` / `LessonProgress` | LearnDash lessons + user progress | — | Lite lessons module |
| `AccessData` | LD enrollment + adapter-computed expiry (§5) | Woo non-completed order state | Lite access-gate |
| `OrderAccessContext` | WooCommerce order + line item meta (#15, `тип-доступа`) | — | Lite guest-orders / reconciler |

**Enrollment source of truth (today):** LearnDash + LearnDash WooCommerce bridge — confirmed Code Snippets audit (`CHANGES.md` 2026-05-22). Snippet **#5** inactive. **`atmo-lms-lite`** access tables **empty on Local** — not SoT for MVP.

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
| `get_course_outline( user_id, course_id )` | `LessonProgress[]` | `product-enrolled.html` outline (post-MVP) |
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

**Explicitly later (post-MVP):** list/grid toggle, goal grouping, course hub hero, full lesson port, diary/trainer widgets (`account.html` localStorage panels).

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
| **Route location** | ~~B vs C~~ | **Decided:** `/my-account/my-courses/` — endpoint audit still required before register |
| **Code Snippets** | Logic in DB, not VCS | Export/version before adapter impl — `WP_DEPENDENCY_MAP.md` registry |
| **Thank-you redirect** | Snippet #5 broken URL, inactive | Separate thank-you spec before any post-checkout redirect |
| **Product ↔ course map** | ~~Woo ID ≠ LD ID~~ | **Discovered:** `_related_course` + variation-first resolver — `CHANGES.md` 2026-05-22 |
| **Access expiry** | ~~LD `expire_access` off~~ | **Decided:** adapter computes from LD `starts_at` + Woo duration label — `CHANGES.md` 2026-05-22 |
| **Lesson URLs** | Deep port blocked until adapter fixed | MVP may link to LD lesson URLs via `permalink` until ATMO lesson template |
| **Dashboard widgets** | Diary/trainer from other plugins | Out of MVP; do not block enrolled list on diary data |

---

## 10. Sign-off checklist

Before any enrolled UI or route implementation:

- [x] Product approves ViewModel field list — **2026-05-22** (§4.7).
- [x] Enrolled route chosen: **`/my-account/my-courses/`** (`BACKLOG.md` #2 — 2026-05-22).
- [ ] Woo **`my-courses`** endpoint audit + registration plan (no implementation in spec commit).
- [x] Enrollment SoT documented for MVP — **LD + bridge** (`_related_course` resolver §5).
- [ ] Code Snippets export/backup completed.
- [x] Product ↔ course mapping discovered — **`_related_course`** + variation-first resolver (`CHANGES.md` 2026-05-22).
- [x] **Access expiry semantics** — LD access start + Woo duration label (`CHANGES.md` 2026-05-22).
- [x] **No LearnDash HTML in ATMO UI** — ViewModels only (§3, §4.7 #8).

**After sign-off:** implement adapter behind this contract only; theme work references this file, not LD internals. **Remaining gate:** endpoint audit + snippets export before PHP/route work.

---

*Spec v0 — 2026-05-22. Route, mapping, expiry, and ViewModel contract signed off; endpoint audit pending.*
