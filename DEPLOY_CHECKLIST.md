# ATMO.BY — Deploy checklist (staging / production)

**Date:** 2026-05-25
**Local baseline:** child theme **`e12bdba`** · docs **`0ffdfcd`**
**Purpose:** ordered runbook for staging/production parity with the current Local ATMO.BY redesign
**Scope note:** deploying **`kadence-child` via git is necessary but not sufficient** — non-git runtime steps below must also be applied.

> **PAUSED / superseded by incident note (2026-05-26):** an attempted VPS staging workflow ended in a production critical error and production was restored from an OVH snapshot. Treat all server-side actions after the snapshot as untrusted unless re-audited. Before using this checklist again, read `STAGING_POSTMORTEM_2026-05-26.md` and complete the safety gate in section 0 below.

**References:** `CHANGES.md` · `BACKLOG.md` · `WP_DEPENDENCY_MAP.md` · `ONBOARDING.md` · `docs/snippets/` · `docs/patches/plugin-enqueue/` · handoff `C:\tmp\atmo-handoff\`

---

## 0. Mandatory safety gate after 2026-05-26 incident

- [ ] Confirm current work is staging, not production.
- [ ] Print and review the staging fingerprint before any write:

```bash
cd /var/www/staging
pwd
wp option get siteurl --skip-themes --skip-plugins
grep DB_NAME wp-config.php
```

Expected:

```text
/var/www/staging
https://staging.atmo.by
define( 'DB_NAME', 'atmo_staging' );
```

- [ ] Confirm production fingerprint separately if needed; production writes are forbidden unless explicitly scoped as production/emergency.
- [ ] Do not use Cursor/agent write SSH access by default.
- [ ] Do not run real `wp search-replace` before a reviewed `--dry-run --report-changed-only`.
- [ ] Confirm WP Admin address bar before any admin change: staging must be `https://staging.atmo.by/wp-admin/`.
- [ ] Do not activate parent `Kadence` directly. If using a child theme, activate `Kadence Child`; parent `Kadence` only needs to exist.

## 1. Preflight

- [ ] Target has **Kadence parent** theme installed and available.
- [ ] Target has required plugins: **WooCommerce**, **LearnDash** (+ Woo bridge), **CookieYes** (`cookie-law-info`), **Code Snippets**, **ATMO custom plugins** (`atmo-reflection-forms`, `learndash-training-diary`, others per `WP_DEPENDENCY_MAP.md`).
- [ ] **Full backup** of DB + `wp-content` (files) before any deploy step.
- [ ] Confirm core routes exist and respond (may 404/redirect until content wired): `/`, `/каталог/`, `/courses/`, `/my-account/`, `/cart-2/`, `/checkout/`.
- [ ] **No live payment, order placement, file upload, delete, or checkout submit** during smoke unless explicitly scoped and approved.
- [ ] Operator has access to: child theme git, handoff patches, WP Admin, snippet import/export, CookieYes settings.

---

## 2. Git deploy — child theme

### 2.1 Deploy steps

- [ ] Deploy **`kadence-child`** at or after commit **`e12bdba`** (`Dequeue LearnDash JS off non-LD routes`).
- [ ] Activate **Kadence Child** with **Kadence** as parent.
- [ ] Confirm `functions.php` loads without PHP fatal (front page + one account page).
- [ ] **Docs repo** (`beta html`) is **reference only** — do not deploy to runtime; use for rollback notes and snippet exports.

### 2.2 What ships in this theme (by area)

| Area | Key commits (floor) | Notes |
|------|---------------------|-------|
| **Shell / homepage / header / footer** | shell wiring, `075179f`, `214f6b6`, `be90ec5`, `9d33b8a` | ATMO chrome; homepage `front-page.php`; nav «Программы» → `/courses/` |
| **Catalog / PDP / cart / checkout / order-received / payment-failed / 404** | `4993bd9`…`9d33b8a`, `4132f1f`, `106250d`, `3e4748f`, `1203858`, `f9a7b95`, `c9ac2b1`, `35806f0`, `64f2aa8` | Shop `/каталог/`; cart `/cart-2/`; `/payment-failed/` **code-owned** by child theme (`inc/atmo-static-routes.php`) — **no WP page required** |
| **Account / my-courses / hub / lesson chrome / plugin block CSS** | `353346c`…`dc1e2be`, `ecfd8f5`, `a352081`, `81c3a7d`, `b1d21b5`, `ed7afcf`…`caaaa96`, `d37665b` | Hub `?course_id=`; no `kadence-child/learndash/` overrides |
| **Redirect `/catalog/` → `/каталог/`** | `a0ec00b` | 301; query string preserved |
| **LD CSS/JS dequeues (non-LD routes)** | `9d8c49e`, `e12bdba` | 10 CSS + 5 JS handles; LD archive/course/lesson unchanged |

---

## 3. Non-git runtime steps — must not be missed

Apply after (or in parallel with) child theme deploy. **Git pull alone does not complete the redesign.**

| Item | Required action | Source / reference | Risk if skipped | Verify |
|------|-----------------|-------------------|-----------------|--------|
| **Plugin enqueue — reflection** | Apply patch or copy fixed PHP into `wp-content/plugins/atmo-reflection-forms/` | `docs/patches/plugin-enqueue/plugin-enqueue-tightening-atmo-reflection-forms.patch` · `CHANGES.md` 2026-05-25 | Reflection CSS/JS loads site-wide on all pages | Guest `/`, `/каталог/`: no reflection assets; lesson with shortcode: assets present |
| **Plugin enqueue — training diary** | Apply patch or copy fixed PHP into `wp-content/plugins/learndash-training-diary/` | `docs/patches/plugin-enqueue/plugin-enqueue-tightening-learndash-training-diary.patch` · `CHANGES.md` | `ldtd.css` loads site-wide | Guest non-LD routes: no `ldtd.css`; diary lesson: `#ldtd` + CSS |
| **Plugin `.bak` files** | **Do not deploy** — rollback/audit only | `atmo-reflection-forms.php.bak`, `learndash-training-diary.php.bak` in handoff | Reverts enqueue fix if copied to plugins | N/A |
| **Code Snippets DB sync** | Import/sync active snippets from export; confirm Snippet **12** variable PDP skip and Snippet **#5** remains **inactive** | `docs/snippets/` · `_manifest.json` (exported 2026-05-22 — re-export if Local changed) · `WP_DEPENDENCY_MAP.md` | PDP pricing/bottom CTA/quiz meta diverges; broken thank-you redirect if #5 enabled | Snippet 12 active; #5 inactive; variable PDP: 1 hero `form.variations_form`, 0 duplicate bottom form |
| **CookieYes RU banner** | Replicate plugin settings: default lang **ru**, banner + preference panel copy | `CHANGES.md` 2026-05-22 CookieYes QA · `wp_options` / `wp_cky_*` / uploads `cookieyes/` | English banner or wrong consent UX | RU notice bar; «Настроить» opens RU panel; no EN CookieYes strings |
| **WP page `/payment-failed/`** | **Not required** — virtual route in child theme (`inc/atmo-static-routes.php`); optional legacy page **#3807** still compatible | `35806f0` · `CHANGES.md` 2026-05-30 | `/payment-failed/` 404 if theme deploy missing static-routes module | GET `/payment-failed/` → **200** + «Не удалось провести платёж.» · `atmo-payment-failed.css` only |
| **`pa_goal` term `energy`** | Set display title **Энергия** (was typo on Local) | `CHANGES.md` 2026-05-23 catalog content | Wrong goal chip label on catalog cards | Catalog chip/filter shows «Энергия» |
| **Product «Интенсив. Осанка, Шея, Лицо»** | Remove Misc category; assign **Тренировки** | `CHANGES.md` 2026-05-23 | Wrong catalog categorization | Product categories match Local intent |
| **Product «ФИТНЕС СЕЗОН 3 – Форма и Осанка»** | Set marketing short description per Local | `CHANGES.md` 2026-05-23 | Card/PDP copy mismatch | Short description visible on catalog/PDP |
| **`_atmo_display_title` product meta** | Migrate meta for redesign products (18/18 on Local) | `4993bd9` · `CHANGES.md` | Cards fall back to `post_title` | Catalog card titles match intended display names |
| **LearnDash Closed button URLs** | Fix host typos (`atmoredesign.local.local` → production host); fix inline course body links | `CHANGES.md` 2026-05-23 LD URL hygiene | Broken join/buy links on `/courses/` | Crawl course pages: **0** `local.local`; `#btn-join` hrefs valid |
| **Preview mu-plugin** | **Optional — skip for production** unless comparison tool needed | `wp-content/mu-plugins/atmo-redesign-preview.php` · `BACKLOG.md` §7 | None for normal traffic | Normal pages: child header/footer only |
| **Local QA fixtures** | **Do not migrate** (r4t5/679, atmo-qa-empty/691, test orders) | `BACKLOG.md` fixtures | Test users/orders in production | N/A |
| **Local port / PHP imagick** | **Ignore** — environment-specific, not project deploy | N/A | N/A | N/A |

---

## 4. Post-deploy smoke checklist

Mark each row after deploy. Use read-only checks unless explicitly scoped.

### 4.1 Guest / public

| Route | Check |
|-------|-------|
| `/` | **200** · ATMO header/footer · **0** target LD CSS/JS on non-LD (`9d8c49e`/`e12bdba` handles) · no reflection/ldtd bleed |
| `/каталог/` | **200** · ~**16** visible product cards if same catalog data · goal chips / sort / pagination · **0** target LD CSS/JS bleed |
| `/catalog/` | **301** → `/каталог/` · query string preserved (e.g. `?filter_goal=…`) |
| PDP variable **#3614** (or equivalent) | Hero price sync on variation change · **one** hero `form.variations_form` · Snippet 12 bottom CTA absent on variable (by design) |
| `/cart-2/` | **200** · `atmo-cart.css` scope · no LD/plugin bleed |
| `/checkout/` | With cart fixture if available: form visible · progress steps · **`#place_order` not clicked** |
| `/payment-failed/` | **200** code-owned route · `atmo-payment-failed.css` only (not checkout/confirmation CSS) |
| `/courses/` | **200** · LD archive · LD CSS/JS **preserved** |

### 4.2 Logged-in owner / enrolled customer

| Route | Check |
|-------|-------|
| `/my-account/` | Dashboard shell · **0** target LD CSS/JS bleed |
| `/my-account/my-courses/` | Enrolled list (or empty state) · no LD bleed |
| `/my-account/my-courses/?course_id=3616` (or equivalent) | Course hub visible · mobile **390×844** no horizontal overflow if practical |
| `/lessons/01-2/` (or diary lesson) | LD JS preserved · `#ldtd` if shortcode present |
| Reflection lesson (e.g. 3700) | `.atmo-rf-wrap` + reflection plugin JS |
| Photos lesson (e.g. 3725) | `.ldtd-photos-block` + `ldtd-progress-photos.js` |
| Compare lesson (e.g. 3708) | Compare block visible |

### 4.3 Negative / paused

| Route | Expected |
|-------|----------|
| `/trainer/`, `/terms/`, `/privacy/` | **Not complete** until content approval · branded **404** acceptable |
| Payment / order / submit / upload / delete | **Do not perform** in smoke unless explicitly scoped |

---

## 5. Rollback notes

| Layer | Rollback |
|-------|----------|
| **Child theme** | Redeploy previous theme release or `git revert` to commit before `e12bdba` / full pre-redesign tag |
| **Plugin enqueue patches** | Restore from `.bak` in handoff **only if understood** — copies **revert** the fix; prefer re-apply forward patch |
| **CookieYes** | Restore from DB backup or plugin settings export |
| **Code Snippets** | Restore from DB backup or re-import prior export |
| **WP content** (pages, products, LD URLs, meta) | Restore from DB backup or re-run content migration |
| **`/payment-failed/` route** | Revert `inc/atmo-static-routes.php` + related `functions.php` hooks; optional unpublish legacy page **#3807** |

---

## 6. Do-not-do guardrails

- **Do not enable Snippet #5** (Thank You Redirect — broken URL in inactive source).
- **Do not remove Snippet 12 variable guard** or add a second `form.variations_form` on variable PDPs.
- **Do not filter `/courses/`** archive to enrolled-only.
- **Do not add LearnDash template overrides** (`kadence-child/learndash/`) by default.
- **Do not wire `atmo-lms-lite`** into theme UI until explicit API/cutover decision.
- **Do not migrate Local QA fixtures** (test users, ghost orders) to production.
- **Do not treat Woo order line items alone** as enrollment source of truth (LD bridge + adapter must agree).

---

## 7. Deploy status

| State | Meaning |
|-------|---------|
| **Ready for staging rehearsal** | When this checklist is printed/filled and operator has backups + patch access. |
| **Not production-complete** | Until **all required non-git runtime steps (§3)** are applied **and** post-deploy smoke (§4) passes. |

**Operator sign-off**

| Step | Done | Date | Initials |
|------|------|------|----------|
| Preflight (§1) | ☐ | | |
| Child theme @ `e12bdba`+ (§2) | ☐ | | |
| Non-git runtime (§3) | ☐ | | |
| Smoke PASS (§4) | ☐ | | |
