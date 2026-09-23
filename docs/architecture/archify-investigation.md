# Archify investigation

**Status:** POC complete for the reference topic; broader adoption pending  
**Date:** 2026-09-21  
**Owner:** archify_researcher  
**Recommendation:** Keep it as an optional, pinned build-time diagram
producer for this topic while broader adoption is reviewed.

## Question

Can Archify generate trustworthy, portable diagrams for this guide while
preserving the existing static-site, localized-content, diagram-fallback, and
no-runtime-service boundaries?

## Investigation method

This investigation reviewed the public `tt-a1i/archify` repository on
2026-09-21, including its README, `archify/SKILL.md`, schema reference,
authoring cookbook, and MIT license. The repository's current diagram records
and build contract were also inspected.

The upstream documentation was sufficient to define an integration design.
The POC then installed a temporary checkout of Archify and executed its real
CLI against four topic-local sources. The temporary checkout was not added to
the site repository.

The POC verified source validation, artifact delivery, and automated browser
evidence. It did not validate a clean-machine CI install or a production
deployment, so those remain broader-adoption tasks.

## POC result

The POC covers both existing diagrams in the Monolith vs Microservices topic,
in English and Spanish:

| Source | Archify type | Validation | Delivery |
| --- | --- | --- | --- |
| `monolith-flow/spec.en.json` | architecture | showcase pass, 9/9 checks | self-contained HTML |
| `monolith-flow/spec.es.json` | architecture | showcase pass, 9/9 checks | self-contained HTML |
| `microservices-flow/spec.en.json` | dataflow | showcase pass, 9/9 checks | self-contained HTML |
| `microservices-flow/spec.es.json` | dataflow | showcase pass, 9/9 checks | self-contained HTML |

Archify version: `2.17.0-dev.1`. The delivered artifact hashes and byte
counts are recorded in each diagram's `generated/archify-receipts.json`.

The four exact delivered HTML files also passed Archify's automated browser
check in Chrome at 1440×900, 1600×1000, 1920×1080, and 2048×1320, in light and
dark themes, with no overflow, viewer-chrome collision, or readability
diagnostic. Representative screenshots were manually inspected for the
English monolith, English microservices, and Spanish microservices artifacts.

The POC exposes one localization limitation: authored Spanish labels render
correctly, but Archify's renderer-owned viewer chrome remains in English
because the documented renderer locale list does not include Spanish. The
page-level title, iframe title, and fallback remain localized by this site.

## Builder standard: Archify presentation size

Archify diagrams must be presented as a primary visual, not as a small inline
preview. For every page that embeds an Archify artifact, the builder must:

- let the diagram card use the site shell width, up to 1120px on desktop;
- keep surrounding explanatory prose at the normal readable article width;
- use a responsive iframe height large enough to show the diagram and its
  summary content together; the current reference implementation uses a
  560px minimum, a viewport-responsive size, and an 800px maximum;
- avoid making the reader scroll inside a cramped diagram frame where the
  surrounding page can accommodate a larger frame;
- preserve the iframe title, localized fallback, and readable caption even
  when the artifact is unavailable;
- check the result at 1440×900 and 1920×1080 at minimum, including narrow
  screens, and confirm that labels remain legible without horizontal page
  overflow.

This sizing standard applies to future Archify diagrams unless a topic has a
documented reason to use a different composition.

## Findings

### What Archify is

Archify is an agent-oriented Node.js skill and CLI. An agent authors a typed
JSON intermediate representation (IR), and Archify validates and renders that
IR into a self-contained HTML diagram with inline SVG. The documented diagram
types are architecture, workflow, sequence, data flow, and lifecycle.

The project describes five useful properties for this guide:

- the source is structured JSON rather than an opaque HTML fragment;
- schema and layout checks run before delivery;
- `deliver` produces a checked artifact and replaces the target atomically;
- the generated HTML is intended to work without an Archify runtime or server;
- the source can be revised without hand-editing the generated HTML.

The generated viewer also documents themes, navigation, search/focus,
relationship tracing, and optional finite motion. Those features are useful
for exploration, but they are not substitutes for the guide's text fallback.

### Input contract

Archify's input is not the same shape as the current repository files under
`diagrams/`. The current guide records use a small logical record:

```text
id, kind, artifact, locales, edges
```

Archify sources instead require a `schema_version`, `diagram_type`, a titled
`meta` object, and renderer-specific structural collections. For example,
architecture diagrams use components, boundaries, and connections, while
workflow diagrams use lanes, phases, groups, paths, nodes, and edges.

This is a healthy separation. The page should continue to refer to a stable
logical diagram ID. A future build adapter can translate a topic-local Archify
specification into the site's diagram record and artifact fields. Lesson
content should not import Archify schemas or renderer internals.

### Validation and delivery

The documented command surface is suitable for a build-time experiment:

```text
node bin/archify.mjs doctor
node bin/archify.mjs validate architecture path/to/spec.json --quality showcase --json
node bin/archify.mjs deliver architecture path/to/spec.json path/to/output.html --quality showcase --json
node bin/archify.mjs visual-check path/to/output.html --json
```

The checks have distinct meanings:

1. `validate` checks the authored JSON and renderer diagnostics.
2. `deliver` validates and commits a deterministic artifact; it does not
   exercise the viewer in a browser.
3. `visual-check` provides bounded automated browser evidence when Chrome or
   Chromium is available.
4. Human visual review is still a separate claim.

The project recommends the `showcase` quality profile for handoff artifacts.
Its skill documentation says a showcase pass must report all nine artifact
checks, zero composition errors, and zero warnings. The integration must
record the JSON receipt rather than treating a generated HTML file alone as
proof of quality.

### Portability and runtime boundary

The documented output is a standalone HTML file. Viewing it does not require
an Archify installation. That matches the guide's static hosting model and
means an artifact can be copied into `dist/` as a generated file.

The generation step still requires Node.js. Archify's authoring cookbook
states Node.js 18 or later, while the current guide intentionally has no
runtime dependencies. The build should therefore treat Archify as an
optional toolchain capability, not as a browser dependency or a required
runtime service.

For reproducible CI, do not run an unpinned `main` checkout or rely on a
mutable global skill installation. Any broader integration should pin an
Archify release or commit, make the exact source available to the build, and
fail clearly when the renderer is unavailable. The fallback page must remain
useful when diagram generation is disabled or fails.

### Network and update-check implications

The upstream README says Archify's optional update check may GET a fixed
manifest, does not download or install updates, and can be disabled with
`ARCHIFY_UPDATE_CHECK_DISABLED=1`. It also describes retry and reminder-state
behavior.

This should be treated as an operational boundary, not as an assumption that
the build is completely offline. CI should set the disable flag unless an
explicitly approved update check is part of the workflow. The build should
not invoke `npx skills add` during a production site build. Install or cache
the pinned tool in a separate, reviewed setup step.

### Localization

Archify's documented `meta.locale` values are `en` and `zh-CN`, and the field
localizes renderer-owned UI, accessibility copy, document title, and HTML
language metadata. It does not translate authored labels or explanatory
content.

The guide supports English and Spanish. Consequently, an Archify artifact
cannot be shared between the two locales merely by setting a page locale.
The integration must choose one of these approaches:

- generate one Archify source/artifact per site locale; or
- keep Archify output language-neutral and expose localized title, alt text,
  labels, and fallback copy through the site's surrounding record, only if
  the artifact's visible labels remain acceptable in both pages.

The first approach is safer for educational diagrams. A shared artifact is
acceptable only after a browser review proves that its visible and accessible
text does not undermine the localized page.

### Accessibility and educational fallback

Archify documents accessibility semantics, keyboard-oriented viewer features,
and reduced-motion behavior. Those claims are promising but not yet locally
verified for this project.

The site's existing contract remains stricter at the page boundary:

- every diagram has localized `altText` and `fallback` copy;
- missing artifacts do not break the article;
- the fallback explains the system in learner-readable prose;
- motion is optional and must respect reduced-motion preferences;
- a browser check must verify focus order, keyboard access, contrast, and
  behavior when JavaScript or the artifact is unavailable.

Archify can satisfy the artifact part of this contract, but it cannot remove
the need for the page-level fallback.

### Licensing and source evidence

Archify is published under the MIT license and identifies its origin as a
rewrite/fork of Cocoon-AI's MIT-licensed architecture diagram generator. If
the renderer or skill is vendored into this repository, preserve the required
license and copyright notices and review any bundled third-party assets.

Archify also supports optional revision-pinned repository evidence. That is
useful for engineering documentation, but it should not be enabled by default
for this educational guide: a topic diagram should explain a concept, not
imply that its teaching example is a verified runtime map of this repository.
Use source evidence only for a deliberately source-backed page.

## Fit against this repository

| Requirement | Finding | Decision |
| --- | --- | --- |
| Static Vercel-compatible output | Self-contained HTML is documented and delivered in the POC | Fits for this POC |
| No runtime diagram service | Rendering is build/local time; viewer is standalone | Fits |
| Separate source and generated output | Typed JSON source and generated HTML are separate | Fits |
| Current logical diagram IDs | Archify has a different schema | Add an adapter; do not replace the page contract |
| English/Spanish pages | Renderer UI documents English and Chinese, not Spanish | Generate per locale or retain a safe fallback |
| Accessible educational pages | Viewer semantics are documented; local verification absent | Keep mandatory page fallback and browser checks |
| Dependency-light foundation | Archify needs Node 18+ for generation | Keep it optional and pinned |
| Deterministic CI | Validation and atomic delivery are documented | Pin version/commit and archive receipts |

## Proposed integration boundary

```text
topic content + localized diagram copy
                 |
                 v
      topic-local Archify JSON source
                 |
                 v
    pinned Archify validate / deliver
                 |
       +---------+---------+
       |                   |
       v                   v
 generated HTML/SVG     validation receipt
       |                   |
       +---------+---------+
                 v
 site diagram record: id, artifact, altText, fallback
                 |
                 v
       static page with fallback
```

The adapter should own the mapping from Archify's `diagram_type` and
artifact path to the site's `kind` and `artifact` fields. It should also
copy the validation receipt into build diagnostics or a generated sidecar;
the receipt should not become authored lesson content.

Suggested future topic package shape:

```text
diagrams/<topic-id>/<diagram-id>/
  spec.en.json             # Archify source for English, if needed
  spec.es.json             # Archify source for Spanish, if needed
  copy.en.json             # title, alt text, fallback
  copy.es.json
  diagram.json             # site-facing logical record, or generated record
```

The exact filenames are not a decision yet. The durable decision is the
boundary: Archify source and generated artifacts remain separate from lesson
prose, and pages consume a stable site record rather than renderer-specific
markup.

## Decision

**Use Archify for this reference topic as a bounded POC; defer broader
integration.** The POC is good evidence that Archify can produce the two
current diagram types, preserve localized authored labels, and fit the static
site through generated iframe artifacts. It is not yet evidence that every
future topic should depend on Archify.

The completed proof produced:

1. four pinned Archify source files;
2. four successful `validate --quality showcase --json` receipts;
3. four successful `deliver --quality showcase --json` receipts;
4. four generated HTML artifacts under the topic's `generated/` folders;
5. automated browser evidence in Chrome at the required desktop sizes;
6. representative manual screenshot review in English and Spanish.

The remaining follow-up proof is a deliberate test of the fallback when an
artifact is absent, plus a clean-machine/CI run with update checks disabled.

If that proof passes, integrate behind the existing logical-ID contract. If
it fails on portability, accessibility, localization, or reproducibility,
keep the current placeholder/fallback path and evaluate another renderer.

## What this document does not claim

- Archify was not installed globally; the POC used a temporary checkout.
- The POC artifacts were browser-tested, but the surrounding site was not
  tested in a browser as part of this change.
- No decision has been made to use Archify for topics beyond the reference
  topic.
- The upstream README's networking description is documented evidence from
  the project, not an independent network capture by this repository.

## Sources

- [Archify repository and README](https://github.com/tt-a1i/archify)
- [`archify/SKILL.md` authoring and delivery contract](https://github.com/tt-a1i/archify/blob/main/archify/SKILL.md)
- [Archify JSON schema reference](https://github.com/tt-a1i/archify/blob/main/archify/schemas/README.md)
- [Archify authoring cookbook](https://github.com/tt-a1i/archify/blob/main/docs/authoring-cookbook.md)
- [Archify MIT license](https://github.com/tt-a1i/archify/blob/main/LICENSE)
