# PDP CMS cleanup checklist (operator / WP Admin later)

**Status:** Wave 1 **DONE** (Local, 2026-06-03). Wave 2a Local CMS cleanup **DONE** (5 slugs, 2026-06-04). Local `_atmo_*` meta pass **DONE** (10 products / 12 fields, 2026-06-04). **Remaining:** owner-decision items (`facial_support`, `testmyself`, `video_plan`, pregnancy duration on `kurs-vse-o-beremennosti`) + P2 tone review on slugs not edited in wave 2a — not a global unknown backlog. **stage2/prod:** tab content and `_atmo_*` DB values from these Local passes are **not** updated until explicit transfer.

**Date:** 2026-06-04 (status); wave 1 baseline 2026-06-03
**Canonical content:** `PDP_CONTENT_APPROVALS.md` + `inc/atmo-pdp-content.php` (18 slugs)  
**Local reference:** `C:\tmp\atmo-handoff\pdp-dedupe-tabs-audit2.json`

---

## Rules

1. **Do not** remove theme blocks (`.atmo-pdp-extra--who`, `.atmo-pdp-extra--faq`) — they are the approved source.
2. **Do not** hide Woo tabs or reviews globally in theme/CSS.
3. Clean **product post content** (tab «Описание») and optionally **short description** when it duplicates who/FAQ or misstates product kind.
4. Keep concrete structure: equipment lists, duration, program outline, inventory — when not duplicated above the fold.
5. Soften or remove aggressive claims; align tone with `PDP_CONTENT_APPROVALS.md`.
6. No gift FAQ, no bundle discount copy, no fake testimonials.
7. Mark each row **operator/WP Admin** when executing; re-QA PDP desktop + mobile 390 after edits.

---

## Inspected slugs (wave 1 — priority)

| Slug | Action (operator/WP Admin later) | Status |
|------|----------------------------------|--------|
| `abdomen_pelvic` | Remove legacy block «Кому идеально подойдет…» / duplicate who grid from **Описание** tab. Keep principles, inventory (`app-card`, lists) if still useful. | DONE 2026-06-03 |
| `facial_support` | Review tab copy: 180 days vs **3-month** access in registry; soften «омоложение» / salon superlatives; align with cautious FAQ. Remove duplicate «Кому подходит» if present. **Follow-up:** excerpt short-info (was `[course_info_card days="180"]`). | DONE 2026-06-03 + follow-up |
| `fastform_pha` | Fix typo **PHAT → PHA**; remove/soften «сжигать жир», «эффект печки»; remove duplicate who block + bottom duplicate CTA if present. | DONE 2026-06-03 |
| `slim_stomach` | Soften «исчезает…» and similar absolutes; remove duplicate who semantics vs theme «Кому подойдёт». | DONE 2026-06-03 |
| `testmyself` | Make tab **diagnostic**, not full program: remove course-like hype, misleading CTA, program-length promises. Short description: theme now shows diagnostic card — align tab body with FAQ. **Follow-up:** Snippet #12 skip `testmyself` (no `.app-bottom-checkout` in tab). | DONE 2026-06-03 + follow-up |
| `video_plan` | **Local:** tab description empty on PDP — **OK**. Post content in DB unchanged (verify only). | OK (Local, verified) |

---

## Wave 2a — Local CMS cleanup (2026-06-04)

Applied via WP Admin product **Описание** (`post_content`) on Local only. Artifacts: `C:\tmp\atmo-handoff\pdp-cms-before-wave2a\`, `pdp-cms-after-wave2a\`, `pdp-wave2a-apply-report.json`, `pdp-wave2a-verify.json`.

| Slug | Change (tab «Описание») | CMS status | Meta follow-up |
|------|-------------------------|------------|----------------|
| `kurs-vse-o-beremennosti` | Removed legacy duplicate «Кому подходит» block in tab | **DONE** 2026-06-04 | `9 мес` pregnancy span kept (owner policy) |
| `functional_medball` | Removed/smoothed injury-risk / injury-prevention claims | **DONE** 2026-06-04 | `_atmo_duration` 6 нед → **2 мес** (meta pass) |
| `athleticbody` | Removed rehab/prevention quote language | **DONE** 2026-06-04 | `_atmo_duration` 6 нед → **2 мес** (meta pass) |
| `express_minibands` | Removed fat-burn hype | **DONE** 2026-06-04 | `_atmo_duration` 3 нед → **2 мес**; `_atmo_session_length` 15 мин → **~18 мин** (meta pass) |
| `levelup_your_strenght` | Removed legacy `[student_review]` blocks from `post_content` | **DONE** 2026-06-04 | `_atmo_sessions_per_week` 4 → **3** (meta pass) |
| `fs3` | No tab edit in wave 2a (blocker was hero duration vs registry) | **N/A** tab | `_atmo_duration` 8 нед → **4 нед** (meta pass 2026-06-04) |

Catalog card verification: redesign archive is **`/каталог/`** (not `/shop/`). Local `/каталог/` checked for updated card snippets on `fs3`, `functional_medball`, `express_minibands`.

---

## Local `_atmo_*` meta pass (2026-06-04)

Direct Local DB update (`wp_postmeta`) — **12 fields / 10 products**. No child theme commit. Artifacts: `pdp-atmo-meta-before-update.json`, `pdp-atmo-meta-after-update.json`, `pdp-atmo-meta-verify-frontend.json`.

| post_id | slug | meta_key | old → new |
|---------|------|----------|-----------|
| 2903 | `levelup_your_strenght` | `_atmo_sessions_per_week` | 4 → 3 |
| 3288 | `levelup_neuropower` | `_atmo_duration` | 6 нед → 8 нед |
| 727 | `cardio_1st_grade` | `_atmo_duration` | 6 нед → 4 нед |
| 727 | `cardio_1st_grade` | `_atmo_sessions_per_week` | 4 → 3 |
| 2056 | `fastform20` | `_atmo_session_length` | 25 мин → 30 мин |
| 859 | `fs3` | `_atmo_duration` | 8 нед → 4 нед |
| 2418 | `athleticbody` | `_atmo_duration` | 6 нед → 2 мес |
| 1745 | `functional_medball` | `_atmo_duration` | 6 нед → 2 мес |
| 1877 | `pilates_medball` | `_atmo_duration` | 6 нед → 2 мес |
| 2660 | `express_minibands` | `_atmo_duration` | 3 нед → 2 мес |
| 2660 | `express_minibands` | `_atmo_session_length` | 15 мин → ~18 мин |
| 1418 | `slim_stomach` | `_atmo_sessions_per_week` | 4 → 3 |

Live hero pills on all 10 PDPs: **PASS** (see handoff verify JSON). **stage2/prod:** values unchanged until operator transfer.

---

## Owner-decision / not touched (Local passes)

| Slug | Notes |
|------|-------|
| `facial_support` | Hero `4 нед` vs ~3-month access — decide course duration vs access period |
| `testmyself` | Diagnostic product — decide whether to keep/empty course-like meta pills |
| `video_plan` | Service/product, not LMS course — no `_atmo_*` duration meta expected |
| `kurs-vse-o-beremennosti` | `9 мес` pregnancy span kept |
| `abdomen_pelvic`, `fastform_pha`, `intensive_bs` | No confirmed meta conflict in 2026-06-04 pass |

---

## Global pass — all 18 registry slugs

For **each** slug in `PDP_CONTENT_APPROVALS.md`, in WP Admin → Product → **Описание** (post content):

| # | Slug | Operator checklist |
|---|------|-------------------|
| 1 | `abdomen_pelvic` | See wave 1 above |
| 2 | `levelup_your_strenght` | Wave 2a: `[student_review]` removed; meta 3×/week — see tables above |
| 3 | `levelup_neuropower` | Meta `_atmo_duration` → 8 нед (2026-06-04); tab dedupe still operator if duplicate who/FAQ |
| 4 | `cardio_1st_grade` | Meta 4 нед / 3× week (2026-06-04); tab dedupe still operator if needed |
| 5 | `facial_support` | See wave 1 above |
| 6 | `fastform20` | Remove duplicate who/FAQ; keep AMRAP explanation if unique to tab |
| 7 | `fastform_pha` | See wave 1 above |
| 8 | `fs3` | Meta duration **4 нед** (2026-06-04); tab S1/S2 references still operator if present |
| 9 | `athleticbody` | Wave 2a tab cleanup + meta **2 мес** |
| 10 | `functional_medball` | Wave 2a tab cleanup + meta **2 мес** |
| 11 | `pilates_medball` | Meta **2 мес** (2026-06-04); tab tone still operator |
| 12 | `express_minibands` | Wave 2a tab cleanup + meta **2 мес** / **~18 мин** |
| 13 | `intensive_bs` | Contraindications broad; no unsupported diagnosis list |
| 14 | `slim_stomach` | See wave 1 above |
| 15 | `4weeks` | Daily habit + 2 flexible rest days — no fake urgency |
| 16 | `kurs-vse-o-beremennosti` | Wave 2a: duplicate «Кому подходит» removed; `9 мес` meta kept |
| 17 | `testmyself` | See wave 1 above |
| 18 | `video_plan` | See wave 1 above |

**Per slug — always check:**

- [ ] No second «Кому подходит/подойдёт» block in tab when theme who exists
- [ ] No second FAQ accordion in tab when theme FAQ exists
- [ ] No fake before/after, medical cure, or «doctor approved» claims
- [ ] No gift purchase FAQ until gift contract ships
- [ ] No bundle / two-course discount wording
- [ ] Snippet 12 bottom cart in tab: leave hidden by theme CSS; do not re-add duplicate buy forms

---

## After operator pass

1. Re-run Local QA on control URLs (see handoff `cursor-report.md`).
2. Grep rendered HTML or tab text for «Кому подходит» on registry slugs — should only appear in `.atmo-pdp-extra--who`.
3. Update this file: set rows to **DONE** with date and operator initials.

---

## Out of scope (this checklist)

- Child theme who/FAQ registry text changes (needs new owner approval).
- Woo **prices / variations / Stripe / LMS / gift logic** (still operator/deploy outside this sheet).
- **Woo `_atmo_*` meta:** was out of scope for the original CMS-only checklist; **Local meta pass completed 2026-06-04** (table above). stage2/prod `_atmo_*` still require explicit DB/WP Admin transfer — not in git.
- Global CSS hiding of `.app-card`, `#tab-description`, or reviews tab.
