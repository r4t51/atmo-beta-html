# ATMO.BY — staging/prod incident postmortem (2026-05-26)

## Status

**Production was restored from an OVH snapshot taken around 10:00.**

This means all server-side work after that snapshot is **not trusted as current state** unless it is re-audited after restore. Treat the project as **pre-staging** again.

Do not continue the previous staging deploy workflow. It is paused.

## Current verified state after snapshot restore

Read-only checks after restore showed:

| Area | Current value |
|---|---|
| Production nginx root | `/var/www/atmo` |
| Staging nginx root | `/var/www/staging` |
| Production DB | `wordpress` |
| Staging DB | `atmo_staging` |
| Production `siteurl/home` | `https://atmo.by` / `https://atmo.by` |
| Staging `siteurl/home` | `https://staging.atmo.by` / `https://staging.atmo.by` |
| Production theme options | `stylesheet=kadence`, `template=kadence` |
| Staging theme options | `stylesheet=kadence`, `template=kadence` |
| SSH agent key | Not present after restore; `authorized_keys` empty |

Important: after restore, `kadence-child` is **not active** on production or staging. Any earlier child-theme activation/upload on the VPS must be considered rolled back unless re-verified.

## What went wrong

Production showed the new ATMO header/footer before the restore, then hit a WordPress critical error after theme switching in WP Admin.

The most likely chain:

1. Staging was created by copying production files and DB.
2. During staging setup, real `wp search-replace` commands were run in both directions.
3. At one point, staging DB was changed from `https://staging.atmo.by` back to `https://atmo.by`.
4. That could make staging admin/browser flows redirect or appear as production.
5. A later WP Admin theme action likely affected production instead of staging.
6. Production was recovered by OVH snapshot restore, not by an in-place fix.

Confirmed from shell history: real mutation commands were run on both `/var/www/staging` and `/var/www/atmo`. Do not repeat this workflow.

## What is still valid

The local repositories and Local WP redesign work remain the canonical development source:

- child theme git commits are still valid as local/staging candidates;
- docs/prototype repo remains valid;
- local QA notes remain useful as Local evidence.

What is **not** valid without re-audit:

- any VPS/staging runtime changes performed after the snapshot;
- any claim that staging has the child theme active;
- any claim that plugin patches, CookieYes changes, snippets, product meta, or `/payment-failed/` exist on staging after restore.

## Immediate rules

No server-side write operation may run unless these checks are printed and explicitly confirmed first:

```bash
pwd
wp option get siteurl --skip-themes --skip-plugins
grep DB_NAME wp-config.php
```

For staging writes, the expected fingerprint is:

```text
/var/www/staging
https://staging.atmo.by
define( 'DB_NAME', 'atmo_staging' );
```

For production, no writes are allowed unless this is an explicit production/emergency task.

## WP Admin rules

- Before any WP Admin change, confirm the browser address bar.
- Staging admin must be `https://staging.atmo.by/wp-admin/`.
- Production admin is `https://atmo.by/wp-admin/`.
- If staging redirects to production, stop immediately.
- Do not activate the parent `Kadence` theme directly. With a child theme, the active theme should be the child; the parent only needs to exist on disk.

## Search-replace rules

No real `wp search-replace` during setup until a dry run is reviewed:

```bash
wp search-replace 'https://atmo.by' 'https://staging.atmo.by' --all-tables --dry-run --report-changed-only --skip-themes --skip-plugins
```

Only after review may an explicit write command be approved.

## Security note

A staging DB password appeared in shell history/chat during incident debugging. Rotate staging-only DB credentials before treating staging as durable or sharing broader access.

## Next safe step

Rebuild a staging plan from this state:

1. Read-only staging fingerprint.
2. Read-only staging audit.
3. Written deploy plan with commands.
4. Manual approval for each write phase.
5. Post-write smoke.
6. Documentation update.

