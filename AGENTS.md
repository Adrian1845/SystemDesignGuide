# System Design Guide agent instructions

## Project mission

This repository will become a content-first guide to system-design concepts,
supported by interactive architecture, workflow, sequence, data-flow, and
lifecycle diagrams.

## Current workflow

1. Use `architecture_lead` to propose the architecture for a requested feature or content area.
2. Review and approve the architecture before implementation.
3. Build and review the website foundation.
4. Investigate and validate Archify integration separately.
5. Agree on the integration design before connecting generated diagrams to pages.
6. Add one complete educational page as the reference implementation.
7. Expand content using isolated topic folders and validate each contribution.

## Agent ownership

- `site_builder` owns website structure, routes, layouts, components, and frontend checks.
- `archify_researcher` investigates Archify and must not modify frontend source files.
- `architecture_lead` owns architecture proposals and decision records, but must not implement application code.
- The parent agent coordinates integration decisions and resolves conflicts.

## General rules

- Inspect the repository before editing.
- Preserve unrelated user changes.
- Keep diagram source specifications separate from generated HTML artifacts.
- Do not claim a build, test, validation, delivery, browser check, or visual review passed unless it actually ran successfully.
- Avoid introducing a backend, database, authentication, or runtime service unless explicitly requested.
- Keep educational explanations precise and distinguish assumptions from verified facts.
- Prefer small, reversible changes and document important architectural decisions.
- On Windows, use `npm.cmd` and `npx.cmd` if PowerShell blocks the corresponding `.ps1` shims.
