# PDP CMS cleanup checklist (operator / WP Admin later)

**Status:** NOT DONE — documentation only. Theme who/FAQ registry is canonical on PDP; this sheet guides **manual** Woo product description edits in WP Admin.

**Date:** 2026-06-03  
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
| `abdomen_pelvic` | Remove legacy block «Кому идеально подойдет…» / duplicate who grid from **Описание** tab. Keep principles, inventory (`app-card`, lists) if still useful. | NOT DONE |
| `facial_support` | Review tab copy: 180 days vs **3-month** access in registry; soften «омоложение» / salon superlatives; align with cautious FAQ. Remove duplicate «Кому подходит» if present. | NOT DONE |
| `fastform_pha` | Fix typo **PHAT → PHA**; remove/soften «сжигать жир», «эффект печки»; remove duplicate who block + bottom duplicate CTA if present. | NOT DONE |
| `slim_stomach` | Soften «исчезает…» and similar absolutes; remove duplicate who semantics vs theme «Кому подойдёт». | NOT DONE |
| `testmyself` | Make tab **diagnostic**, not full program: remove course-like hype, misleading CTA, program-length promises. Short description: theme now shows diagnostic card — align tab body with FAQ. | NOT DONE |
| `video_plan` | **Local:** tab description empty — **OK**. Maintain service process only in short info + theme FAQ; do not add LMS/course enrollment copy. | OK (Local) |

---

## Global pass — all 18 registry slugs

For **each** slug in `PDP_CONTENT_APPROVALS.md`, in WP Admin → Product → **Описание** (post content):

| # | Slug | Operator checklist |
|---|------|-------------------|
| 1 | `abdomen_pelvic` | See wave 1 above |
| 2 | `levelup_your_strenght` | Remove duplicate «Кому» / FAQ; keep equipment (25 cm step) consistent with registry |
| 3 | `levelup_neuropower` | Remove duplicate who/FAQ; duration 8 weeks — reconcile with hero `_atmo_*` if conflict |
| 4 | `cardio_1st_grade` | Remove duplicate who/FAQ; keep 30 days / 3× week facts |
| 5 | `facial_support` | See wave 1 above |
| 6 | `fastform20` | Remove duplicate who/FAQ; keep AMRAP explanation if unique to tab |
| 7 | `fastform_pha` | See wave 1 above |
| 8 | `fs3` | Remove references to S1/S2 as required; 4 weeks duration |
| 9 | `athleticbody` | Remove duplicate who; mini bands + 2 months |
| 10 | `functional_medball` | No rehab/injury-prevention promises; medball sizing cautious |
| 11 | `pilates_medball` | No «minus X cm»; calm tone |
| 12 | `express_minibands` | 2 months / ~18 min session — no duplicate who |
| 13 | `intensive_bs` | Contraindications broad; no unsupported diagnosis list |
| 14 | `slim_stomach` | See wave 1 above |
| 15 | `4weeks` | Daily habit + 2 flexible rest days — no fake urgency |
| 16 | `kurs-vse-o-beremennosti` | Sensitive pregnancy copy — not a doctor replacement; remove duplicate who |
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
- Woo `_atmo_*` meta / prices / variations / Stripe / LMS / gift logic.
- Global CSS hiding of `.app-card`, `#tab-description`, or reviews tab.
