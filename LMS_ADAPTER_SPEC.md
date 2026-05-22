# LMS Adapter Spec v0

> **Status:** route decided · adapter sign-off pending · **2026-05-22**  
> **Scope:** ViewModel contract + adapter boundaries only — no PHP implementation, no route registration, no WP changes.  
> **Related:** `BACKLOG.md` §2 · `WP_DEPENDENCY_MAP.md` LMS Map · prototypes `courses.html`, `account.html`, `product-enrolled.html`, `lesson.html`

---

## 1. Purpose

Define a stable **adapter interface** between ATMO child-theme UI and LMS/Woo backends so enrolled courses, progress, and access can ship without LearnDash HTML coupling or premature `atmo-lms-lite` dependency.

**Gate:** no enrolled UI, dashboard LMS widgets, or deep port of `lesson.html` / `product-enrolled.html` until this spec is signed off (product decision #3 in `BACKLOG.md` §2).

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

**Implementation still blocked by:** adapter sign-off (#3), endpoint registration audit, Code Snippets export, **access expiry semantics** (product decision) — see §10.

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

### 4.1 `CourseCard`

Shared course/program identity for lists and headers. Catalog cards today cover **Woo sell-side** only; enrolled UI may reuse overlapping fields from LMS course post.

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | LMS course post ID (or future lite ID) |
| `slug` | string | URL slug |
| `title` | string | Display title |
| `permalink` | string | Public or enrolled course hub URL (context-dependent) |
| `thumbnail_url` | string *(optional)* | Featured image |
| `excerpt` | string *(optional)* | Short summary |
| `goal_slug` | string *(optional)* | e.g. `pa_goal` mapping when available |
| `goal_label` | string *(optional)* | Human label |
| `duration_label` | string *(optional)* | e.g. «4 нед · 20 мин» — prototype only until CMS field exists |

### 4.2 `EnrollmentState`

Per-user enrollment + progress for one course.

| Field | Type | Notes |
|-------|------|-------|
| `course_id` | int | FK to course |
| `is_enrolled` | bool | User has active or recoverable access |
| `status` | enum | `none` \| `active` \| `expired` \| `completed` \| `pending` |
| `progress_percent` | int | 0–100; **real backend only** — no fabricated values |
| `completed_steps` | int | Lessons/steps complete |
| `total_steps` | int | Total lessons/steps in course |
| `expires_at` | string *(optional)* | ISO8601 or null (lifetime access) |
| `source` | enum | `learndash` \| `atmo-lms-lite` — which backend answered |

**Status semantics (MVP UI):**

- `none` — not enrolled; show empty / catalog CTA.
- `active` — can open course hub and continue lesson if `next_lesson` present.
- `pending` — paid or order exists but access not yet granted (bridge lag, manual review).
- `expired` — was enrolled; show renewal / support CTA, not lesson links.
- `completed` — 100% progress or LD complete flag; show «Пройдена», optional review CTA.

### 4.3 `EnrolledCourse`

`CourseCard` + `EnrollmentState` + navigation CTA for list/grid/dashboard rows.

| Field | Type | Notes |
|-------|------|-------|
| *(CourseCard fields)* | | |
| *(EnrollmentState fields)* | | |
| `last_lesson` | `LessonRef` *(optional)* | Last visited or last completed |
| `next_lesson` | `LessonRef` *(optional)* | **Only if backend provides** — UI must not invent |
| `cta_label` | string *(optional)* | e.g. «Продолжить», «Начать», «Пройдена» |
| `cta_url` | string *(optional)* | Target lesson or course hub; omit if no safe target |
| `course_hub_url` | string | Enrolled course overview (maps to `product-enrolled.html` intent) |

**Prototype mapping:** `courses.html` grid/list rows; `account.html` «Следующий шаг» hero (when adapter supplies `next_lesson`).

### 4.4 `LessonRef` / `LessonProgress`

Lightweight lesson pointer for nav, outline, and progress strip — not full lesson body.

**`LessonRef`**

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | Lesson post ID |
| `title` | string | Display title |
| `permalink` | string | Lesson URL (future ATMO lesson template or LD URL until port) |
| `course_id` | int | Parent course |
| `order_index` | int | 1-based step number in course outline |

**`LessonProgress`** extends `LessonRef`:

| Field | Type | Notes |
|-------|------|-------|
| `is_complete` | bool | |
| `is_accessible` | bool | false → show locked state in outline |
| `is_current` | bool *(optional)* | Highlight in course outline |
| `prev` | `LessonRef` *(optional)* | |
| `next` | `LessonRef` *(optional)* | |
| `content_html` | string *(optional)* | **Deferred** — full lesson port post-MVP; adapter may omit in v0 |

**Prototype mapping:** `product-enrolled.html` outline steps; `lesson.html` breadcrumb + prev/next.

### 4.5 `AccessData`

Effective access for gating UI (course hub, lesson entry).

| Field | Type | Notes |
|-------|------|-------|
| `has_access` | bool | |
| `reason` | enum | `enrolled` \| `purchase_pending` \| `expired` \| `guest` \| `none` |
| `expiry` | string *(optional)* | Display expiry |
| `product_id` | int *(optional)* | Linked Woo product |
| `order_id` | int *(optional)* | Granting order |

### 4.6 `OrderAccessContext`

Read-only Woo context for **display** alongside LMS enrollment — **not** enrollment source of truth.

| Field | Type | Notes |
|-------|------|-------|
| `order_id` | int | |
| `order_status` | string | Woo status slug |
| `product_id` | int | |
| `product_name` | string | |
| `variation_id` | int *(optional)* | From order line — use for `_related_course` lookup on variable products |
| `access_type_label` | string *(optional)* | From item meta `тип-доступа` (e.g. «60 дней», «Бессрочно») — **display / pairing only** |
| `quiz_meta` | object *(optional)* | Snippet #15 `_atmo_quiz` / `atmo_*` keys — display or support only |
| `purchased_at` | string *(optional)* | Order date |

**Rule:** adapter **pairs** `OrderAccessContext` with `EnrollmentState` for pills and empty/pending copy; must not treat order line or **`тип-доступа`** alone as enrolled. **`access_type_label`** is not enrollment SoT (confirmed #3801 fixture — `CHANGES.md` 2026-05-22 mapping discovery).

---

## 5. Source mapping

| ViewModel | Primary source (today) | Secondary / display | Future (`atmo-lms-lite`) |
|-----------|------------------------|---------------------|---------------------------|
| `CourseCard` (catalog) | Woo product (`atmo_build_course_card`) | — | Optional lite course link |
| `CourseCard` (LMS) | LearnDash `sfwd-courses` | Goal from product attribute if linked | Lite courses module |
| `EnrollmentState` | LearnDash user course access + progress APIs | — | Lite enrollment + access-rules |
| `EnrolledCourse` | Compose LMS + optional order context | `OrderAccessContext` | Same interface, different driver |
| `LessonRef` / `LessonProgress` | LearnDash lessons + user progress | — | Lite lessons module |
| `AccessData` | LD access check + expiry rules *(expiry computation open)* | Woo pending/failed order state | Lite access-gate |
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

### Access expiry (open — product decision)

**«60 дней»** appears in Woo variation attribute + order line meta **`тип-доступа`**. LD course **3616** has **`expire_access` off**; user **679** has no `course_*_access_expires`. Adapter must not invent `expires_at` until product picks: LD course settings vs order-date + label vs future `atmo-lms-lite` rules.

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
2. **Enrolled list** — one or more `EnrolledCourse` rows/cards: title, status, real `progress_percent` when available.
3. **Continue / next lesson CTA** — render **only** when adapter returns `next_lesson` + `cta_url`; otherwise generic «Открыть программу» or hub link only.
4. **Expired / pending** — distinct copy and disabled lesson links when `status` is `expired` or `pending`; surface `access_type_label` / order hint when `OrderAccessContext` exists.

**Explicitly later (post-MVP):** list/grid toggle, goal grouping, course hub hero, full lesson port, diary/trainer widgets (`account.html` localStorage panels).

---

## 8. Non-goals (v0)

- Fake or demo progress in production templates.
- LearnDash template overrides or LD shortcodes inside ATMO shell.
- Woo endpoint / rewrite registration (follows route decision).
- Payment token, order, or enrollment mutation from theme.
- Critical dependency on `atmo-lms-lite` front-end.
- Re-enabling Snippet #5 or changing snippet behavior as part of adapter v0.
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
| **Access expiry** | «60 дней» vs LD `expire_access` off | **Open product decision** — do not fabricate `expires_at`; pair label for display only until decided |
| **Lesson URLs** | Deep port blocked until adapter fixed | MVP may link to LD lesson URLs via `permalink` until ATMO lesson template |
| **Dashboard widgets** | Diary/trainer from other plugins | Out of MVP; do not block enrolled list on diary data |

---

## 10. Sign-off checklist

Before any enrolled UI or route implementation:

- [ ] Product approves this ViewModel field list (or documents deltas).
- [x] Enrolled route chosen: **`/my-account/my-courses/`** (`BACKLOG.md` #2 — 2026-05-22).
- [ ] Woo **`my-courses`** endpoint audit + registration plan (no implementation in spec commit).
- [ ] Enrollment SoT documented for MVP — **LD + bridge** (`_related_course` resolver above).
- [ ] Code Snippets export/backup completed.
- [x] Product ↔ course mapping discovered — **`_related_course`** + variation-first resolver (`CHANGES.md` 2026-05-22).
- [ ] **Access expiry semantics** agreed (e.g. «60 дней» → `expires_at` when LD `expire_access` off).

**After sign-off:** implement adapter behind this contract only; theme work references this file, not LD internals.

---

*Spec v0 — 2026-05-22. Route decided same day; adapter sign-off pending.*
