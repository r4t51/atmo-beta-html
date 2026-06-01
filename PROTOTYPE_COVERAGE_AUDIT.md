# ATMO prototype coverage audit

Last updated: 2026-06-01 (legal routes)
Scope: redesign only, Local + Stage2 validation where noted
Current RC status: **NOT_READY**

This file maps every HTML prototype screen to the current WordPress/theme implementation. It is the gate for design completeness: do not call the redesign a release candidate while any required screen is `missing`, `partial`, or `blocked-by-content`.

## Status Key

| Status | Meaning |
|---|---|
| `implemented` | Visual/structural transfer is complete enough for current scope and recently checked. |
| `partial` | Route/template exists, but notable prototype parity gaps remain. |
| `missing` | No child-theme route/template/skin exists yet. |
| `blocked-by-content` | Implementation waits for approved copy/legal/content. |
| `temporary-reference` | Prototype helper output, not a user-facing screen to port. |

## Coverage Matrix

| Prototype file / screen | Intended WP URL/template | Status | Evidence | Gap / next action |
|---|---|---|---|---|
| `index.html` | `/` via `front-page.php` + `atmo-home.css` | `partial` | Homepage v1 shipped; child theme has front-page layer. | Social/testimonials block still deferred; not full marketing parity. |
| `catalog.html` | `/каталог/` Woo shop archive via `inc/atmo-catalog.php`, `woocommerce/content-product.php`, `atmo-catalog.css` | `implemented` | Local QA 2026-06-01; child commit `a8e81e5`. | Pagination remains because real Woo archive has more products than one static prototype view. |
| `product.html` | `/product/{slug}/` via `woocommerce/content-single-product.php` + `atmo-product.css` | `partial` | PDP MVP + price sync + tabs shipped. | Full prototype hero parity still open; variable PDP bottom CTA intentionally deferred. |
| `product-enrolled.html` | Post-purchase/enrolled product or course access state | `partial` | Closest current surface is `/my-account/my-courses/?course_id={id}` hub. | No product URL enrolled-state hero; decide whether enrolled state belongs on PDP or account hub. |
| `cart.html` | `/cart-2/` via `inc/atmo-cart.php` + `atmo-cart.css` | `partial` | Cart fixture QA passed earlier. | Non-standard slug remains; minor visual deltas against static prototype. |
| `checkout.html` | `/checkout/` via `inc/atmo-checkout.php` + `atmo-checkout.css` | `partial` | Stage2 Stripe test UI PASS; checkout shell implemented. | Not pixel-perfect; empty-cart redirect is expected Woo behavior. |
| `order-confirmation.html` | `/checkout/order-received/{id}/` via `inc/atmo-confirmation.php` + `atmo-confirmation.css` | `partial` | Valid order layer shipped and QA'd. | Invalid/missing order still falls back to generic Woo shell. |
| `payment-failed.html` | `/payment-failed/` via virtual route + `page-payment-failed.php` | `implemented` | Code-owned route `35806f0`; Stage2 smoke PASS. | Generic failure page by design. |
| `account.html` | `/my-account/` dashboard via `inc/atmo-account.php` + `atmo-account.css` | `partial` | Account shell and dashboard shipped. | Dashboard intentionally does not include full course/progress widgets. |
| `orders.html` | `/my-account/orders/` and `/my-account/view-order/{id}/` | `partial` | Orders and view-order styling shipped; order fixtures QA'd. | Needs fresh visual parity pass if this slice is reopened. |
| `profile.html` | `/my-account/edit-account/` and related account settings | `partial` | Woo settings styling shipped. | LearnDash `/profile/` remains separate/default; account CSS does not skin it. |
| `auth.html` | Logged-out `/my-account/` Woo auth form | `partial` | Auth shell shipped. | Uses Woo forms, not a standalone `/auth/` route. |
| `reset-password.html` | Woo lost-password / reset-password flow | `missing` | No child route/template/skin. | Add ATMO auth/reset slice. |
| `courses.html` | Account "Мои курсы" / enrolled programs experience | `partial` | `/my-account/my-courses/` + hub shipped and QA'd. | Public `/courses/` is LearnDash archive and remains a different screen; IA needs explicit decision. |
| `lesson.html` | `/lessons/{slug}/` LearnDash lesson chrome | `partial` | ATMO lesson chrome, H1 prefix, plugin block CSS shipped. | No LearnDash template override; core LD markup still underneath. |
| `course-complete.html` | Course completion / certificate moment | `missing` | No child completion route/template. | Design LearnDash completion hook/template or defer explicitly. |
| `404.html` | WP 404 via `404.php` + `atmo-404.css` | `implemented` | Branded 404 QA passed. | None for current scope. |
| `trainer.html` | `/trainer/` | `blocked-by-content` | Currently branded 404. | Requires approved trainer copy/content before page/template. |
| `terms.html` | `/terms/` | `implemented` | Code-owned route + `page-legal.php` + `atmo-legal.css`; body from Stage2 `regulamin-sklepu-internetowego` (Polish legal, read-only export). | Prototype `terms.html` is Russian reference layout; live copy is Stage2 Polish regulamin, not Russian prototype text. Footer slug `/terms/` maps to portable theme route. |
| `privacy.html` | `/privacy/` | `implemented` | Code-owned route + shared legal template; body from Stage2 `polityka-prywatnosci` (Polish, read-only export). | Prototype `privacy.html` is Russian reference; live copy is Stage2 Polish policy. Optional later: Russian localization sign-off. |
| `_tmp_all.html`, `_tmp_energy.html`, `_tmp_p1.html`, `_tmp_p2.html` | None | `temporary-reference` | Generated prototype/reference outputs. | Do not port directly. |

## Release Readiness

RC status: **NOT_READY**

Reasons:

- Required prototype screens remain `partial`: homepage, PDP, cart, checkout, order confirmation, account/orders/profile/auth, courses/my-courses, lesson.
- Required prototype screens remain `missing`: reset password, course completion.
- Static/legal page `/trainer/` remains `blocked-by-content`.
- `/terms/` and `/privacy/` implemented with Stage2-sourced Polish legal copy on prototype layout (2026-06-01).
- `/catalog/` and `/courses/` IA still needs plain-user wording and possibly navigation refinement: catalog is shop/purchase; my courses/account is owned access; public `/courses/` is LearnDash archive.

## Recommended Design Slices

1. Static routes `/trainer/`, `/terms/`, `/privacy/` after copy/legal sign-off.
2. PDP parity, including clear decision for `product-enrolled.html`.
3. Auth/reset password flow (`auth.html`, `reset-password.html`).
4. Public `/courses/` archive IA/skin decision versus Woo catalog.
5. Course completion flow (`course-complete.html`).
6. Homepage deferred blocks.
