# First milestone architecture: content-first guide foundation

**Status:** Proposed  
**Date:** 2026-09-18  
**Owner:** architecture_lead

## Recommendation

Build a statically generated, content-first guide intended for Vercel, with
MDX as the preferred authored lesson format and topic content plus diagram
source files kept in the repository. The first milestone should establish the
site shell, content contract, topic-folder convention, and a diagram embed
boundary; it should not introduce a backend, database, authentication, runtime
diagram service, or Archify dependency.

Treat Archify as a separately validated build-time producer. A later
integration may add generated interactive artifacts behind the same page-level
diagram contract, without making page content depend on Archify internals.

## Verified facts

- `README.md` currently contains only the project name and a short description
  of a guide to common system-design patterns.
- No application source, package manifest, content folders, diagram sources,
  generated artifacts, or architecture documents currently exist.
- `AGENTS.md` defines a content-first guide with interactive architecture,
  workflow, sequence, data-flow, and lifecycle diagrams.
- The repository workflow calls for architecture approval before implementation,
  separate Archify investigation, then one complete educational reference page.
- Ownership is split between `site_builder`, `archify_researcher`, and
  `architecture_lead`; this proposal does not change those boundaries.

## Captured direction

- Vercel is the intended hosting target for the small, public learning site.
- The frontend framework remains an implementation choice for `site_builder`,
  which should select it based on fit for the content model, diagrams,
  accessibility, and deployment needs.
- MDX is the preferred authored lesson format because lessons may need images
  and approved interactive components. The final component and security
  constraints remain implementation work.
- Search is excluded from the initial milestone. Add a build-time search index
  when the guide reaches approximately 5-6 published pages.
- The reference topic is **Monolith vs Microservices**, presented as a simple
  teaching example. The page is article-style and includes explanatory text
  plus two diagrams:
  - a monolith flow: classic API -> customer service -> payments service ->
    database -> response;
  - an asynchronous microservices flow: API -> SNS/Kafka -> customer and
    payments services, each with its own database, with responses from each
    service.
- Both diagrams require an accessible text fallback. No advanced interactive
  controls are required initially.
- Archify has now been validated as a bounded POC for the reference topic.
  Its source format, generated output, renderer-owned localization limits, and
  browser evidence are recorded in `docs/architecture/archify-investigation.md`.
  Broader adoption remains outside this foundation decision.

## Assumptions

- The first delivery is a public, read-only learning site and does not need
  user accounts, saved state, comments, or server-side personalization.
- Content authors will review changes through the repository rather than a CMS.
- Vercel or an equivalent build-and-publish environment will be available for
  the public static site.
- "Interactive" diagrams must have a readable explanation or fallback so the
  guide remains useful when scripting, embedding, or diagram generation fails.

## Goals

- Make a small number of educational pages easy to author, review, and publish.
- Give each topic a stable identity and an isolated home for its content,
  diagram sources, and supporting assets.
- Provide a page-level diagram contract that can consume a future build-time
  artifact without coupling content to a rendering tool.
- Keep generated output deterministic, cacheable, accessible, and deployable
  without a runtime service.
- Establish validation for content metadata, links, diagram references, and
  basic accessibility before expanding the guide.

## Non-goals

- No backend API, database, authentication, analytics pipeline, search service,
  comments, progress tracking, or user-generated content in the initial
  milestone. Search is a later addition triggered at approximately 5-6
  published pages.
- No decision to adopt a specific frontend framework or Archify integration
  mechanism before the relevant implementation/research work validates it.
- Vercel is the intended hosting target, but deployment details still need to
  be confirmed by the implementation work.
- No attempt to model every system-design topic or create a full design-system
  component library in the first milestone.
- No direct editing of generated diagram HTML as authored content.

## Recommended scope for the first milestone

Deliver a minimal site foundation with one fixture/reference topic used to
prove the contracts. The topic can be intentionally small; its purpose is to
exercise authoring, navigation, rendering, and validation rather than to
settle the guide's entire curriculum. Use Monolith vs Microservices as the
reference topic for this fixture.

Suggested repository boundaries:

```text
content/topics/<topic-id>/index.mdx      # authored lesson
content/topics/<topic-id>/assets/        # lesson-owned static assets
diagrams/<topic-id>/<diagram-id>/        # authored diagram source and notes
src/                                     # site shell and rendering code
public/                                  # copied static assets, if required
dist/                                    # generated publish output; never source
```

The exact frontend directory names remain an implementation concern for
`site_builder`; the content and diagram boundaries above are the architectural
contract.

## Components and ownership

| Boundary | Responsibility | Owner | Does not own |
| --- | --- | --- | --- |
| Site shell | Layout, navigation, route rendering, theme, focus behavior, responsive presentation, and diagram fallback UI | `site_builder` | Lesson meaning or diagram authoring |
| Content source | MDX lesson files, frontmatter, explanations, examples, images, and links | Content contributors, reviewed by parent agent | Generated HTML or runtime data |
| Topic package | One topic's lesson, local assets, diagram references, and validation scope | Topic contributor | Shared site chrome |
| Diagram source | Archify input/specification plus human-readable diagram metadata | `archify_researcher` with topic contributor | Page layout and runtime services |
| Build pipeline | Parse content, validate references, render site, and optionally invoke a validated diagram renderer | `site_builder`; Archify step owned by `archify_researcher` | Hosting operations |
| Published output | Static HTML, CSS, JavaScript, images, and generated diagram artifacts | Build output only | Authored source of truth |

### Content contract

Each topic must have a stable `<topic-id>` and an MDX entry document with at least:

```yaml
title: Human-readable title
slug: topic-id
summary: One-sentence learner-facing summary
status: draft | published
```

The document should also state learning objectives and include plain-language
explanations. MDX components should be limited to an approved site-level set
and rendered at build time. The final frontmatter schema should be checked by
the site build, but fields beyond this minimum should be added only when a page
needs them.

### Diagram contract

Content refers to a diagram by a stable logical ID, not by an Archify-specific
HTML fragment. A rendered diagram record should provide:

```text
id           stable topic-local diagram ID
kind         architecture | workflow | sequence | data-flow | lifecycle
artifact     build-relative path or embed target, when available
altText      concise description of the visual
fallback     learner-readable explanation or equivalent text
```

The page renderer owns the surrounding heading, caption, loading/error state,
and fallback. A diagram renderer owns only the artifact and its metadata. Until
Archify is validated, the artifact may be absent and the fallback must still
render.

## Important flows

1. A contributor adds or edits a topic package and its metadata.
2. The build validates metadata, internal links, topic-local assets, and
   diagram IDs.
3. The site renderer turns lessons into static routes and applies the shared
   accessible shell.
4. If a validated build-time diagram step is enabled, it renders diagram
   sources into publishable artifacts and emits the diagram records consumed by
   the page renderer.
5. The build emits a static directory for deployment. No request-time service
   is required to read lesson content or render diagrams.

## Alternatives considered

### Runtime application with an API and database

This would support accounts, personalization, and dynamic content workflows,
but none is currently required. It adds operational, security, and deployment
cost before the educational content model is known. Defer it until a concrete
requirement justifies it.

### Hard-code lessons in frontend components

This is quick for a single page but makes review, topic isolation, metadata
validation, and future authoring needlessly difficult. Repository-authored
content with a small schema better matches the project's content-first mission.

### Couple pages directly to Archify output

This would make the first page dependent on an unvalidated tool contract and
could expose generated HTML details to content authors. Keeping a logical ID,
artifact, and fallback boundary allows Archify to be tested independently and
replaced if necessary.

## Implementation phases and acceptance criteria

### Phase 0 - approve the baseline

- Approve this proposal. The reference-page decision is resolved; Archify
  details remain a later validation task rather than a foundation blocker.
- `site_builder` records the chosen frontend/build tool based on fit and
  confirms the Vercel deployment path.

**Acceptance:** the content contract, diagram boundary, and no-backend scope
are explicitly accepted or amended.

### Phase 1 - website and content foundation

- Create the site shell, a landing route, and one topic route.
- Add one topic fixture using the agreed metadata contract.
- Add validation for metadata, links, assets, and unknown diagram IDs.
- Produce static output suitable for deployment to Vercel.

**Acceptance:** a clean checkout can build the landing page and topic page;
the topic is navigable; invalid metadata or references fail the build; the
published pages remain readable without a diagram artifact; and automated
checks cover the new foundation.

### Phase 2 - Archify investigation (completed for the reference POC)

- `archify_researcher` evaluated the source format, rendering behavior, output
  stability, licensing, accessibility implications, and desktop browser
  evidence for the Monolith vs Microservices topic.
- The POC stays isolated to that topic and uses the existing logical-ID
  boundary.

**Acceptance:** the experiment has a reproducible input/output example and a
clear recommendation to adopt, defer, or replace Archify. The completed POC
recommends topic-local use while broader adoption remains pending.

### Phase 3 - diagram integration contract

- Agree how the build produces diagram records and artifacts.
- Add one diagram through the logical-ID contract, with caption, alt text, and
  a text fallback.

**Acceptance:** the site build consumes the agreed record without importing
  Archify internals into lesson content; missing or failed artifacts preserve a
  useful fallback; generated files are distinguishable from source files.

### Phase 4 - reference educational page

- Replace the fixture with one complete, reviewed lesson using the approved
  diagram path.
- Validate reading flow, keyboard access, responsive layout, and content
  accuracy.

**Acceptance:** the page is approved as the template for isolated topic
contributions and its checks are documented for future contributors.

## Risks and mitigations

- **Unclear content schema:** keep the minimum required fields small and let
  validation reject only fields that are truly required.
- **Diagram tool lock-in:** use logical IDs plus artifact metadata and retain a
  text fallback; do not expose renderer-specific markup to authors.
- **Accessibility regressions in interactive diagrams:** require alt text and a
  meaningful fallback before an artifact can be considered complete.
- **Build complexity too early:** keep the first pipeline static and local;
  introduce diagram generation only after the isolated experiment succeeds.
- **Topic inconsistency:** isolate each topic and validate it with the same
  repository checks before expanding the catalog.

## Post-milestone scale trigger

When the guide reaches approximately 5-6 published pages, add a build-time
search index and search UI as a separate scoped change. It should consume the
same authored content and static build output; it does not justify a runtime
search service by itself.

## Open questions and follow-up validation

1. Can a clean CI machine install or access the pinned Archify tool without
   relying on a mutable global installation or network access during the site
   build?
2. Does the page-level fallback remain useful when a generated artifact is
   missing or intentionally disabled?

### Archify evidence reconciled by the POC

The following evidence is now reflected in the POC and its investigation
record; it is not a blanket adoption decision for future topics:

- Archify is described as a Node.js rendering and validation system for Cursor,
  Claude Code, Codex CLI, and OpenCode. Agents produce typed JSON IR, which
  Archify deterministically compiles into HTML/SVG.
- Archify may GET a fixed stable manifest only to show an optional reminder;
  it reportedly never downloads or installs updates. Successful checks wait
  about 72 hours (+/-20%); active use retries failures after 6, then 24 hours.
  The server reportedly sees normal HTTP metadata (IP and time), but no
  version, agent, project data, prompts, account/device ID, or ETag. The user
  decides whether and when to update. `ARCHIFY_UPDATE_CHECK_DISABLED=1` is
  reported to disable networking and reminder-state writes.
- The README reportedly supports starting from a description without a
  repository, for example: Browser -> API -> Redis cache -> PostgreSQL
  fallback.
- For repository-based source evidence, the README reportedly recommends
  asking Archify to analyze a repository and create a high-level runtime
  architecture diagram with 8-12 core components, one primary path, external
  dependencies, and trust boundaries, while putting supporting detail in
  cards rather than adding more edges.
- The README reportedly supports focused refinements such as adding Redis,
  moving auth, or highlighting a rollback path while retaining typed source
  for iteration.

## Approval readiness and next action

The reference topic, article format, two-diagram scope, accessible fallback
requirement, and initial interactivity boundary are resolved. The Archify POC
is accepted for the reference topic only; broader integration still requires
an explicit follow-up decision.

After explicit approval, the exact next action for `site_builder` is to record
the selected frontend/build tool and implement Phase 1: the static site shell,
landing route, and Monolith vs Microservices topic route using the minimum
content contract, validation for metadata/links/assets/diagram IDs, and
diagram records that preserve the required text fallbacks. Any future Archify
use must remain behind the logical-ID contract and pass the same validation
and browser-evidence requirements.

## Documentation output

Created by this proposal:

- `docs/architecture/first-milestone.md` - this proposed baseline architecture.

No ADR is created yet. The proposal has not been approved, and no durable
implementation decision needs an ADR at this stage. If approved, create an ADR
only for a durable choice that warrants independent history (for example,
static delivery/content format or the accepted diagram integration boundary).


APPROVED
