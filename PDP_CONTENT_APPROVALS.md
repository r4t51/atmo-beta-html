# ATMO.BY — PDP Content Approvals

Status: owner-approved decision sheet
Date: 2026-06-03
Scope: content source for PDP "Кому подойдёт" / FAQ implementation. Not implemented in WP/theme yet.

Use this file instead of raw draft artifacts in `C:\tmp\atmo-handoff\` when planning PDP FAQ/who implementation.

## Global Rules

- Do not publish gift FAQ until gift contract is implemented.
- Do not publish bundle discount; owner decided there is no two-course discount.
- Avoid treatment, diagnosis, rehab, injury-prevention guarantees, and "doctor approved" claims.
- Pricing/access copy must follow actual PDP variation/access settings.
- If source duration conflicts and one source says "2 months", use 2 months unless a product-specific correction below says otherwise.

## Approved Products

| # | Slug | Approved facts / corrections | Caution |
|---|---|---|---|
| 1 | `abdomen_pelvic` | Approved as drafted. Postpartum wording: after doctor's permission; start depends on recovery, delivery type, and wellbeing. | Medical review needed; no treatment claims. |
| 2 | `levelup_your_strenght` | 8 weeks; 2-3 times/week; equipment: 25 cm foot platform/step. | No hard prerequisite claims. |
| 3 | `levelup_neuropower` | "Твоя Сила" is recommended, not mandatory; 8 weeks; 2-3 times/week. | Keep as next-step positioning, not a gate. |
| 4 | `cardio_1st_grade` | 30 days / 4 weeks; 3 times/week; about 20 minutes if session length remains confirmed. | No gift FAQ yet. |
| 5 | `facial_support` | Equipment: facial oil; access: 3 months; contraindications: skin diseases, active inflammation. | Medical/cosmetic caution. |
| 6 | `fastform20` | AMRAP is important: explain as timed quality rounds/reps at current level; `fastform_pha` is not required; session 30 minutes. | No fake prerequisite. |
| 7 | `fastform_pha` | Very suitable for beginners; dumbbells from 2 kg and higher depending on preparation level. | Keep scaling language. |
| 8 | `fs3` | Duration: 4 weeks; Seasons 1 and 2 are not required and are out of rotation. | Do not mention old seasons as required. |
| 9 | `athleticbody` | Equipment: closed mini bands; duration: 2 months. | No joint-pain guarantees. |
| 10 | `functional_medball` | Medball 2-3 kg, up to about 20 cm; actual diameter may vary; duration 2 months; active functional training, not rehabilitation. | Do not promise injury prevention. |
| 11 | `pilates_medball` | Duration 2 months; 4 full trainings appear correct; calmer Pilates tone; medball 2-3 kg, 15-20 cm. | No "minus X cm" claims. |
| 12 | `express_minibands` | Duration 2 months; session about 18 minutes; equipment: mini bands. | Follow global 2-month rule. |
| 13 | `intensive_bs` | Acute pain / active inflammation is a contraindication; first remove inflammation / acute condition, then start. | Keep broad; avoid unsupported diagnosis list. |
| 14 | `slim_stomach` | Harder than `abdomen_pelvic`; for more prepared users; focus on functional core; 3 times/week; basic/facultative abdominal massage; diastasis allowed. | No treatment claims. |
| 15 | `4weeks` | Daily habit format with 2 flexible rest/skip days per week; 7/10/12/15 minutes by week; no equipment; full body. | Missed day is okay within the 2 flexible days. |
| 16 | `kurs-vse-o-beremennosti` | Can start after first ultrasound, including first trimester if pregnancy is proceeding normally and there are no medical restrictions. | Sensitive; not a doctor replacement. |
| 17 | `testmyself` | No equipment needed. Diagnostic product, not a full program. | Keep recommendations separate from purchase of full program. |
| 18 | `video_plan` | Full individual video recorded for client's goals; about one month of individual work; two meetings (beginning + middle); unlimited access via downloadable video link; can be sold as normal product; no LMS/course enrollment. | Individual service/product; avoid treatment claims. |

## Implementation Notes

- PDP FAQ/who implementation should be a separate child-theme slice after content placement is designed.
- `video_plan` must not be treated as an LMS course/enrollment product.
- Gift purchase UX/FAQ remains blocked until the gift entitlement contract is designed and implemented.
- Raw draft files in `C:\tmp\atmo-handoff\pdp-faq-drafts.md` are not canonical after these approvals.
