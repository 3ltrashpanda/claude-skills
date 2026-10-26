# Changelog

Releases are git tags (`vX.Y.Z`). `/huddle-update` shows the entries between your version and the new one before it
installs anything. Sections: **Changed**, **Fixed**, **Schema** (anything that affects existing boards).

## 1.0.0 - 2026-10-26
### Changed
- Board page sorted by who has the ball (Your move / Claude's move / Done & parked) instead of a Waiting-on-you panel.
- Inline one-tap answers, undo, and a "Claude hasn't read this yet" marker.
- Claim badges (working / quiet / stale) with a comment-only lock and a take-back for stale claims.
- `/huddle groom` (propose, apply, undo), archive and restore.
- Shortcut skills: `/huddle-new`, `-sync`, `-review`, `-groom`, `-idea`, `-issue`, `-update`.
- Update notice at `/huddle` start and `/huddle-update` (confirm before installing, backup, rollback).
### Fixed
- Notes no longer lost when the page and Claude write at the same time; init errors shown; no false "nothing needs you"
  flash; no re-render while typing; stale `ask`/`decision` cleared on status change.
### Schema
- Board schema 2: notes are a keyed map, `claim`, `needsYouKind`, `archived`, `meta/groomPlan`, `meta/project.lastSyncAt`.
  Older boards keep working and are converted on the next sync.
