# Plugin enqueue patches

These patches preserve the Local 2026-05-25 enqueue tightening for ATMO custom plugins that are not currently versioned as plugin repositories.

## Scope

- `plugin-enqueue-tightening-atmo-reflection-forms.patch`
  - Target: `wp-content/plugins/atmo-reflection-forms/atmo-reflection-forms.php`
  - Effect: load reflection CSS/JS only for logged-in LearnDash lessons containing `[atmo_reflection]`.
- `plugin-enqueue-tightening-learndash-training-diary.patch`
  - Target: `wp-content/plugins/learndash-training-diary/learndash-training-diary.php`
  - Effect: load `ldtd.css` only for logged-in LearnDash lessons containing diary/photos/compare shortcodes.

## Important

- The `.bak` files in `C:\tmp\atmo-handoff\` are rollback/audit files only. Copying them into plugin directories reverts the fix.
- Do not apply these patches to production or VPS staging without the post-incident safety gate in `DEPLOY_CHECKLIST.md`.
- Prefer a tracked plugin repository later. These patches are a preservation step so the fixes are recoverable from GitHub.

## Verify After Apply

- Guest `/` and catalog routes: no `atmo-reflection-forms` assets and no `ldtd.css`.
- Logged-in LD lesson with `[atmo_reflection]`: reflection assets present.
- Logged-in LD lesson with diary/photos/compare shortcode: `ldtd.css` present.
- Photos JS remains shortcode-render scoped.
