# ADR-001: Choose a dependency-light static site foundation

- **Status:** Accepted
- **Date:** 2026-09-19
- **Decision owner:** site_builder, coordinated by the parent agent

## Context

The approved first milestone calls for a public, read-only learning site with
repository-authored topic content, static deployment, accessible diagram
fallbacks, and no backend or runtime diagram service. The repository has no
existing frontend framework or package manifest.

## Decision

Use a small Node.js build script with no runtime dependencies for the first
foundation. Author lessons as `.mdx` files with the minimum agreed
frontmatter contract, render the supported educational Markdown subset at
build time, and emit static HTML/CSS into `dist/`.

Keep topic content under `content/topics/<topic-id>/` and diagram source and
metadata under `diagrams/<topic-id>/<diagram-id>/`. Pages refer to diagrams by
logical ID. Validated generated artifacts may be present for the bounded
Monolith vs Microservices Archify POC, but every diagram still renders a
useful text fallback.

## Consequences

- The first site can be built and deployed without a backend, package install,
  runtime service, or unvalidated diagram dependency.
- The build owns metadata, diagram, and internal-link validation.
- The supported Markdown/MDX surface is intentionally small until a concrete
  component need justifies adopting a full MDX toolchain.
- A future renderer can replace the diagram placeholder behind the existing
  logical-ID and metadata boundary.
