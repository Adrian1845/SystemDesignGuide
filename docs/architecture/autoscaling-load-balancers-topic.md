# Autoscaling and load balancers topic architecture

- **Status:** Accepted
- **Date:** 2026-10-08
- **Decision owner:** architecture_lead, coordinated by the parent agent
- **Implementation owners:** site_builder and archify_researcher

## Recommendation

Add `autoscaling-load-balancers` as a bilingual topic in the existing static
content architecture. Derive the publishable Spanish lesson and its English
adaptation from `content/autoscaling-load-balancers/es.mdx`, but preserve that
user-authored staging file unchanged.

Teach the topic with three vendor-neutral, bilingual Archify diagrams:

1. `scaling-directions`, comparing vertical and horizontal scaling;
2. `autoscaling-control-loop`, showing how a bounded scaling policy repeatedly
   observes and adjusts capacity; and
3. `load-balancing-health`, separating load-balancer traffic routing
   from health-driven capacity replacement.

Use the established Archify `v3.0.1` build-time workflow, including complete
English and Spanish renderer catalogs, localized self-contained artifacts,
validation and delivery receipts, and browser evidence. Archify remains an
authoring and rendering tool, not a site runtime dependency or service.

Implementation must stop after a validated local preview. This decision does
not authorize deployment or public release.

## Resolved decisions

The user approved the complete proposed scope and all three diagrams.

- The stable topic identity is `autoscaling-load-balancers`.
- The public titles stay close to the headings in the authored source:
  - English: **Autoscaling and load balancers**
  - Spanish: **Escalado automático y balanceadores de carga**
- The lesson will be published as equivalent English and Spanish pages.
- The implementation may restructure the material and add technical
  clarification, but must preserve the anecdotes, jokes, informal first-person
  voice, and closing signature.
- `content/autoscaling-load-balancers/es.mdx` remains unchanged as the staging
  source. Publishable content is derived into the standard topic package.
- All three proposed diagrams are approved.
- Diagrams remain vendor-neutral rather than being modeled specifically on
  AWS, Azure, or Google Cloud products.
- New diagrams use the existing pinned Archify `v3.0.1` bilingual workflow.
- Six self-contained localized artifacts and their validation, delivery, and
  browser evidence are approved despite their repository size.
- Work stops for explicit user review after a local preview. Deployment needs
  separate authorization.

## Goals

- Turn the Spanish staging material into one coherent introductory lesson on
  elasticity, load balancing, and health-aware capacity management.
- Explain vertical and horizontal scaling without implying that either is
  unlimited, instantaneous, or always automatic.
- Show how load balancing and autoscaling cooperate while keeping their
  responsibilities distinct.
- Explain the difference between user traffic, health probes, scaling signals,
  and instance replacement.
- Preserve the personality of the original article while preventing its
  simplifications from becoming incorrect technical claims.
- Provide equivalent English and Spanish learning paths with diagrams and
  fallbacks in the page language.
- Keep the site static, content-first, accessible, and independent of a
  runtime diagram service.

## Non-goals

- This is not a cloud certification course or a catalog of provider products.
- It does not prescribe AWS Auto Scaling Groups, Azure Virtual Machine Scale
  Sets, Google Managed Instance Groups, Kubernetes autoscalers, or any other
  vendor-specific implementation.
- It does not introduce a backend, database, authentication system, queue,
  runtime diagram renderer, or new frontend framework.
- It does not attempt to cover global traffic management, service meshes,
  database sharding, queue-based load leveling, or every load-balancing
  algorithm in depth.
- It does not claim that all workloads need a user-managed load balancer or
  autoscaling group.
- It does not modify the generic content or diagram contract unless an
  independently reviewed need is found.
- It does not delete, move, normalize, or rewrite the user-authored staging
  file.
- It does not deploy or publish the completed preview.

## Verified repository constraints

- `content/autoscaling-load-balancers/es.mdx` is UTF-8 Spanish prose without
  topic frontmatter or diagram directives. It is outside `content/topics/`, so
  the current content reader does not treat it as a site topic.
- Publishable topics live under `content/topics/<slug>/` and require paired
  `en.mdx` and `es.mdx` files.
- Each localized document requires `title`, `slug`, `translationOf`, `locale`,
  `summary`, and `status` frontmatter.
- The topic directory, `slug`, and `translationOf` values must match. The
  filename locale must match the frontmatter locale.
- The current validator requires both locale documents for a topic and
  requires both to have `status: published` before the topic can build. That
  metadata is a local build state and does not authorize deployment.
- Topic pages refer to diagrams through logical `:::diagram id="..."`
  directives. Page content does not import Archify schemas or generated HTML.
- A site-facing `diagram.json` requires a stable ID, a supported kind,
  localized artifact paths, localized title/alt/fallback/node copy, and a
  language-neutral logical edge list.
- The supported site diagram kinds are `architecture`, `workflow`, `sequence`,
  `data-flow`, and `lifecycle`.
- Generated Archify artifacts are self-contained HTML files consumed through
  the existing diagram boundary. Every page must still provide a useful text
  fallback.
- The existing `sync-async-threading` topic demonstrates the Archify `v3.0.1`
  workflow with per-locale specs, complete renderer translation catalogs,
  localized artifacts, receipts, and browser evidence.
- The site is intentionally dependency-light and has no runtime backend or
  diagram service.

Git worktree status could not be verified during architecture review because
Git rejected the checkout as having dubious ownership. No global Git setting
was changed to bypass that protection.

## Stable identity and route contract

```text
slug:          autoscaling-load-balancers
translationOf: autoscaling-load-balancers
```

Titles:

```text
English: Autoscaling and load balancers
Spanish: Escalado automático y balanceadores de carga
```

Canonical localized routes:

```text
/en/topics/autoscaling-load-balancers/
/es/topics/autoscaling-load-balancers/
```

The existing compatibility behavior should also produce:

```text
/topics/autoscaling-load-balancers/ -> /en/topics/autoscaling-load-balancers/
```

Recommended summaries:

```text
EN: Learn how to add or remove capacity, distribute traffic, and remove
    unhealthy instances without conflating scaling, load balancing, and
    health checks.

ES: Aprende a aumentar o reducir capacidad, repartir tráfico y retirar
    instancias no saludables sin confundir escalado, balanceo y comprobaciones
    de salud.
```

## Content package and source boundary

The staging source and publishable topic have different responsibilities:

```text
content/autoscaling-load-balancers/es.mdx       # unchanged user source

content/topics/autoscaling-load-balancers/
  en.mdx                                        # publishable adaptation
  es.mdx                                        # publishable adaptation
```

The new topic files may correct, order, and expand the source, but the staging
file is evidence of the user's original authorship and must not be rewritten or
removed as an incidental implementation step.

Both publishable files must use the same section order and diagram IDs in
equivalent teaching positions. The English file is an adaptation that
preserves meaning and voice, not a separate lesson with different claims.

## Recommended lesson sequence

### 1. Opening cloud-course anecdote

Retain the course anecdote, self-deprecating “sharpest pencil” line, CPD
question, and conversational transition into the logistics analogy. Add a
short correction: physical machines exist underneath cloud systems, but cloud
computing is not merely a remote physical server behind a pleasant web UI.

### 2. The short version

Define the three separate responsibilities before expanding them:

- scaling changes available capacity;
- load balancing chooses where eligible traffic goes; and
- health evaluation determines whether a target should receive traffic or
  remain part of the capacity pool.

Clarify that the controls cooperate but are not one mechanism.

### 3. Vertical and horizontal scaling

Keep the car, van, truck, and fleet analogy.

- **Scale up/down:** change the capacity of one resource.
- **Scale out/in:** change the number of resources serving the workload.

Explain physical, economic, quota, state, and downstream limits. Vertical
changes may require restart or replacement; horizontal changes require a way
to distribute work and handle state safely.

Place `scaling-directions` after both definitions.

### 4. How autoscaling decides

Describe autoscaling as automatic capacity adjustment driven by a declared
policy. Present minimum, maximum, and desired capacity as a common group model,
not a universal cloud interface.

Distinguish:

- reactive or target-tracking policies based on observed signals;
- scheduled policies for known demand windows; and
- predictive policies as an optional platform capability, not a guarantee.

Mention warm-up, cooldown or stabilization, limits, and the no-change case so
the reader does not infer instant, cost-free elasticity.

Place `autoscaling-control-loop` after this explanation.

### 5. Load balancers

Retain the “one machine drowning while another scratches its belly” language,
but state that a balancer distributes requests or connections according to an
algorithm; it does not guarantee equal CPU or 50/50 utilization.

Explain the load balancer as a stable entry tier. DNS, a CDN, WAF, or API
gateway may still precede it. Mention round-robin and least-connections only as
examples rather than an exhaustive algorithm catalog.

Correct the protocol model:

- a layer-4 balancer routes TCP or UDP flows without understanding HTTP and
  may pass TLS through; and
- a layer-7 balancer understands application protocols such as HTTP/HTTPS and
  gRPC over HTTP/2, and commonly terminates TLS.

TLS must not be presented simply as a layer-4 transport protocol.

### 6. Health checks

Retain the truck-in-the-shop analogy while separating two decisions:

- a load balancer stops routing new traffic to an unhealthy or unready target;
- a capacity controller or instance group may replace capacity based on its
  configured health signals.

These mechanisms may share signals but do not necessarily use the same probe
or act at the same time. Health checks are configurable within platform
constraints, not “100% configurable.” Briefly distinguish shallow reachability
from application readiness and warn against checks that amplify a downstream
failure.

Place `load-balancing-health` after this section.

### 7. Common mistakes

Use a concise correction list:

- cloud computing is more than remote access to a physical server;
- autoscaling is automatic policy-driven adjustment, not a synonym for any
  manual upgrade;
- horizontal scaling is not infinite;
- balanced traffic does not guarantee balanced resource utilization;
- a load balancer is not always the first public hop;
- load-balancer health and replacement health are different decisions; and
- not every system needs a user-managed autoscaling group and load balancer.

### 8. Practical decision guide

Ask the reader to consider:

- demand variability and burst shape;
- startup and warm-up time;
- useful leading or lagging metrics;
- state, sessions, connection draining, and graceful shutdown;
- quotas, regional capacity, and cost bounds;
- database and downstream bottlenecks;
- retry and failure behavior; and
- whether the team can observe and operate the control loop.

### 9. Level up

Retain the public-administration joke, old-office-laptop image, signature, and
subscription closing. Replace the universal claim with a precise conclusion:
autoscaling and load balancing are common patterns to evaluate when variable
demand and availability requirements justify them, not boxes that must appear
in every system design.

## Technical clarification contract

The implementation must preserve the author's personality while making the
following distinctions explicit.

### Cloud abstraction

Physical data centers and machines underpin cloud systems, but users commonly
consume virtual machines, containers, functions, storage, networks, and
managed services through control planes and APIs. A web console is one client
of that control plane, not the definition of cloud computing.

### Scaling vocabulary

Autoscaling means a policy adjusts capacity automatically. Vertical and
horizontal scaling describe the direction of a capacity change whether the
change is manual or automatic. Vertical autoscaling is not equally available
for all resources and can require disruptive replacement or restart.

### Finite elasticity

Horizontal capacity is bounded by quotas, available provider capacity, money,
startup time, application state, coordination, and downstream services.
Neither prose nor diagrams may imply an infinite pool.

### Capacity settings and policies

Minimum, maximum, and desired counts are common for groups of interchangeable
instances. They are not guaranteed properties of every autoscaler. Scheduled
scaling anticipates a known time window; target tracking reacts to observations;
predictive scaling forecasts future need when a platform supports it.

### Traffic distribution

Load balancers distribute connections or requests, not utilization itself.
Long-lived connections, uneven request cost, caches, heterogeneous instances,
and algorithm choice can produce unequal utilization.

### Protocol layers

Layer 4 uses transport and connection metadata, principally TCP and UDP.
Layer 7 understands application protocols. TLS can be passed through or
terminated at different tiers and must not be labeled as though it were simply
a transport-layer protocol.

### Health and replacement

Removing a target from load-balancer rotation and replacing capacity are
separate control actions. The same or different health sources may inform them.
Draining and readiness matter because an immediate kill can interrupt active
requests, while premature routing can send traffic to an unready replacement.

### Applicability

The article may strongly recommend knowing these patterns, but may not say
that every medium or large company uses the same architecture or that every
system design must contain these components. Stable provisioned capacity,
serverless products, and managed services can expose different operational
boundaries.

## Diagram package layout

```text
diagrams/autoscaling-load-balancers/
  scaling-directions/
    diagram.json
    spec.en.json
    spec.es.json
    generated/
      scaling-directions.en.html
      scaling-directions.es.html
      archify-receipts.json
      ...validation and browser evidence

  autoscaling-control-loop/
    diagram.json
    spec.en.json
    spec.es.json
    generated/
      autoscaling-control-loop.en.html
      autoscaling-control-loop.es.html
      archify-receipts.json
      ...validation and browser evidence

  load-balancing-health/
    diagram.json
    spec.en.json
    spec.es.json
    generated/
      load-balancing-health.en.html
      load-balancing-health.es.html
      archify-receipts.json
      ...validation and browser evidence
```

The exact evidence subdirectory names may follow the current v3.0.1 topic
convention. The durable contract is separate authored specs, generated
artifacts, and traceable receipts for each locale. Generated HTML must never be
hand-edited.

## Diagram 1: `scaling-directions`

- **Archify type:** `architecture`
- **Site kind:** `architecture`
- **Placement:** immediately after the vertical and horizontal scaling
  definitions.
- **Teaching purpose:** compare the resource changed by scale up/down with the
  resource changed by scale out/in.

The composition uses two clearly separated views or groups:

### Vertical view

- Begin with one application instance of a defined small capacity.
- Show scale up as the same logical role receiving more CPU/memory capacity.
- Show scale down as reducing that capacity.
- Label a finite machine or service-tier ceiling.
- A note may state that resizing can require restart or replacement.

### Horizontal view

- Place multiple interchangeable application instances behind one stable
  routing endpoint.
- Show scale out as adding instances and scale in as draining/removing them.
- Label quotas, cost, state, and downstream capacity as practical bounds.

The diagram must not:

- imply that a bigger instance and more instances are operationally identical;
- depict horizontal capacity as infinite;
- imply that a load balancer itself decides desired capacity; or
- use a provider-specific product icon or name.

The localized fallback must explain both directions and their limits without
requiring the visual.

## Diagram 2: `autoscaling-control-loop`

- **Archify type:** `lifecycle`
- **Site kind:** `lifecycle`
- **Placement:** after minimum, maximum, desired, reactive, and scheduled policy
  prose.
- **Teaching purpose:** show autoscaling as a repeated, bounded control loop
  rather than a one-time “add machines” action.

Required logical states and transitions:

1. observe a metric or receive a scheduled trigger;
2. evaluate the scaling policy;
3. clamp the proposed desired capacity to minimum and maximum bounds;
4. choose scale out, no change, or scale in;
5. provision and warm a target, or drain and remove a target;
6. enter stabilization or cooldown where applicable; and
7. return to observation.

The visual must make the no-change path first-class. It should distinguish a
reactive signal from a scheduled trigger without presenting predictive scaling
as universally available.

The diagram must not:

- promise instant capacity;
- imply that every metric spike should cause a scaling action;
- omit minimum/maximum bounds;
- show removal without draining; or
- use a particular cloud provider's policy names.

The localized fallback must describe the complete loop, including bounds,
warm-up or draining, stabilization, and repeated observation.

## Diagram 3: `load-balancing-health`

- **Archify type:** `architecture`
- **Site kind:** `architecture`
- **Placement:** after the health-check section.
- **Teaching purpose:** show how the load balancer's data plane and the
  autoscaling group's control plane cooperate without conflating routing with
  replacement.

Required components:

- client;
- optional generic edge/DNS tier;
- load balancer;
- a capacity group containing at least two healthy targets and one unhealthy
  or draining target;
- health probes or health-signal source;
- autoscaling policy/controller; and
- a warming replacement target.

Required relationships:

- user traffic reaches the stable load-balancing tier;
- only ready, healthy targets receive new traffic;
- probes or health signals inform routing eligibility;
- capacity and health signals reach the autoscaling controller;
- an unhealthy target leaves rotation and is drained or removed;
- a replacement is created and warmed; and
- the replacement becomes eligible before it receives user traffic.

User traffic must be visually distinct from health probes and scaling or
replacement control signals.

The diagram must not:

- promise perfectly equal utilization;
- imply that a failed health check always causes immediate destruction;
- route production traffic to the warming target;
- imply zero dropped requests under every failure; or
- imply that the load balancer and autoscaler are one component.

The localized fallback must independently explain the healthy routing path and
the separate replacement loop.

## Archify v3.0.1 localization and delivery contract

Each diagram has separate English and Spanish Archify source specs and
artifacts.

- Use only the approved Archify `v3.0.1` toolchain for this topic.
- Record the exact version and resolved revision in every site-facing diagram
  record and delivery receipt. The current reference topic identifies revision
  `2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c`; implementation must verify the
  checkout rather than assume it.
- A different version or revision requires compatibility validation,
  regenerated receipts, and parent coordination before acceptance.
- Set `meta.locale` to `en` in English specs and `es` in Spanish specs.
- Supply the complete matching v3.0.1 renderer catalog for each locale through
  the renderer's supported translation mechanism.
- Treat a missing translation key or fallback into another language as a
  failure, not a warning to waive.
- Every visible and accessible renderer-owned string in the Spanish artifact
  must be Spanish. The equivalent rule applies to English artifacts.
- Localize authored labels, titles, descriptions, notes, cards, accessible
  text, and fallbacks; do not share English authored copy with the Spanish
  artifact.
- Validate and deliver every spec with the `showcase` quality profile.
- Retain structured validation, delivery, finalize, visual, and browser
  evidence according to the established workflow.
- Receipts must tie each artifact to the exact source spec, translation
  catalog, renderer version/revision, and hashes or equivalent immutable
  identity.
- Disable any optional network update check during reproducible generation.
- Never modify generated HTML by hand to repair localization or layout.
- Archify is not added to the browser bundle and no Archify runtime service is
  introduced.

If the pinned supported path cannot produce a fully localized, readable
artifact, the affected diagram is blocked. Page-level copy does not waive
mixed-language renderer chrome.

## Page integration and fallback contract

- Both MDX files reference all three approved logical IDs once, in equivalent
  teaching positions.
- The page consumes `diagram.json`, not renderer-specific source fields.
- Each locale has a localized diagram title, iframe title, alt text, node copy,
  and explanatory fallback.
- Fallback prose must teach the intended concept if the artifact is missing,
  JavaScript is unavailable, or the iframe cannot load.
- Diagram cards may use the site's established wide visual area while normal
  prose remains at the readable article width.
- Artifacts should be lazy-loaded where the existing page contract supports
  it, limiting the cost of six self-contained HTML files.
- The page must not fail because an artifact is unavailable.

## Ownership boundaries

### architecture_lead

- Owns this accepted scope and any later architecture amendment.
- Does not implement application code, publishable topic content, Archify
  sources, or generated artifacts.

### site_builder

- Owns `content/topics/autoscaling-load-balancers/` and site integration.
- Derives the Spanish lesson without modifying the staging source.
- Authors the English adaptation against the shared lesson structure.
- Runs content validation, site build, and surrounding-page browser checks.
- Does not change the generic renderer or route architecture unless a newly
  discovered need receives separate review.

### archify_researcher

- Owns the three topic-local diagram packages, Archify source specs,
  localization catalogs in the specs, generated artifacts, receipts, and
  diagram-focused browser evidence.
- Must not modify frontend source files.
- Must report toolchain or localization limitations rather than hand-editing
  generated output.

### Parent agent

- Coordinates content and diagram integration.
- Resolves contract mismatches and protects unrelated user changes.
- Confirms that evidence supports each validation or visual-review claim.
- Delivers the local preview and stops for user approval.

### User

- Reviews the bilingual lesson, editorial voice, technical framing, diagrams,
  and preview.
- Separately authorizes any deployment or public release.

## Implementation phases

### Phase 1: bilingual lesson authoring

- Create the standard topic package without changing the staging file.
- Add valid, matching frontmatter for both locales.
- Apply the approved lesson sequence and technical corrections.
- Preserve anecdotes, jokes, signature, and first-person tone.
- Insert all three diagram directives in equivalent locations.

**Exit criterion:** English and Spanish drafts have equivalent structure and
meaning, contain the approved corrections, and pass editorial and bilingual
review independent of generated artifacts.

### Phase 2: diagram authoring

- Create the three `diagram.json` records and six localized Archify specs.
- Follow the exact component, relationship, exclusion, and fallback contracts
  in this document.
- Use complete English and Spanish v3.0.1 catalogs.

**Exit criterion:** all source specs validate structurally and their authored
copy agrees with the corresponding page explanation and fallback.

### Phase 3: diagram delivery and evidence

- Verify the pinned `v3.0.1` checkout and revision.
- Run showcase validation and delivery for all six specs.
- Produce self-contained localized artifacts and retain structured receipts.
- Run strict/finalize, browser, and visual checks used by the established v3
  workflow.
- Inspect English and Spanish renderer-owned visible and accessible text.

**Exit criterion:** six traceable artifacts pass the approved checks with no
fallback-language warning, composition error, or hand edit.

### Phase 4: site integration and validation

- Integrate the diagram records behind the three logical IDs.
- Run `npm.cmd run validate` and `npm.cmd run build`.
- Check canonical routes, compatibility route, landing cards, navigation,
  locale switching, iframe sizing, and localized fallbacks.
- Check a narrow viewport, 1440x900, and 1920x1080.
- Check keyboard access, focus visibility, contrast, reduced motion, missing
  artifacts, and no-JavaScript fallback behavior proportionately to the
  existing contract.
- Perform human technical, Spanish, English-equivalence, and visual review.

**Exit criterion:** every acceptance criterion below has actual evidence and a
local preview is ready.

### Phase 5: preview gate

- Serve the completed static build locally.
- Provide the English and Spanish preview routes and representative screenshots
  to the user.
- Stop and wait for explicit approval.

**Exit criterion:** user approves the preview or requests changes. Deployment
is not part of this architecture record.

## Acceptance criteria

### Content and routes

- `content/autoscaling-load-balancers/es.mdx` is byte-for-byte unchanged.
- `content/topics/autoscaling-load-balancers/en.mdx` and `es.mdx` exist with
  valid matching identity and equivalent section order.
- Both localized files contain the approved titles and accurate summaries.
- Both localized files reference `scaling-directions`,
  `autoscaling-control-loop`, and `load-balancing-health` in the
  approved teaching positions.
- The two canonical localized routes build successfully.
- The unprefixed compatibility route resolves to the English topic according
  to existing behavior.
- Landing-page and navigation discovery work through the existing content
  model without adding a route registry.
- The anecdotes, logistics analogy, public-site joke, signature, and informal
  voice remain recognizable.
- The lesson includes every clarification in the technical clarification
  contract and does not introduce a contradictory claim in either locale.

### Diagram sources and artifacts

- Three site-facing diagram records and six localized source specs exist.
- The diagram IDs, types, site kinds, nodes, relationships, fallbacks, and
  exclusions match this contract.
- All six specs use the correct `meta.locale` and complete v3.0.1 catalogs.
- Six self-contained localized HTML artifacts exist at their declared paths.
- All six pass the approved `showcase` validation and delivery process.
- Strict/finalize, browser, and visual evidence is retained according to the
  established v3 workflow.
- Receipts identify exact renderer version/revision, source, locale catalog,
  output artifact, and hashes or equivalent immutable identity.
- Spanish artifacts contain no English visible or accessible renderer-owned
  text; English artifacts contain no unintended Spanish renderer-owned text.
- Generated artifacts were not hand-edited.

### Teaching accuracy

- Vertical and horizontal scaling are distinguished from automatic policy
  execution.
- Horizontal scaling is shown as finite and constrained.
- Minimum, maximum, and desired capacity are described as a common group
  model, not a universal interface.
- Reactive, scheduled, and optional predictive behavior are not conflated.
- Traffic distribution is not claimed to guarantee equal utilization.
- TLS is not labeled simply as a layer-4 transport protocol.
- Load-balancer routing health and capacity replacement are represented as
  separate decisions.
- Warming and draining appear wherever capacity enters or leaves live traffic.
- The lesson does not claim that every system needs this architecture.

### Accessibility, responsiveness, and failure behavior

- Every diagram has a localized iframe title, alt text, and learner-readable
  fallback.
- Every fallback conveys the lesson without the iframe or JavaScript.
- The article and diagram cards have no horizontal page overflow on the checked
  narrow and desktop viewports.
- Labels remain legible at the checked sizes.
- Keyboard access, focus visibility, contrast, and reduced-motion behavior are
  checked in both locales.
- Missing or unavailable artifacts do not break the article.

### Validation and review

- `npm.cmd run validate` completes successfully.
- `npm.cmd run build` completes successfully.
- Human review confirms Spanish accuracy, English equivalence, technical
  accuracy, preserved voice, and visual suitability.
- Claims of validation, build success, browser checks, or visual review are
  made only when the corresponding commands or reviews actually completed.
- A local preview is delivered for explicit user approval.
- No deployment or public release occurs under this decision.

## Risks and mitigations

### Staging source is mistaken for publishable content

The new file is under `content/` but outside the standard topic tree, which can
make its status unclear.

**Mitigation:** treat it explicitly as immutable staging input and derive the
publishable package under `content/topics/`. Do not move or delete it.

### Technical corrections flatten the author's voice

Replacing every simplification with formal cloud terminology could make the
lesson accurate but unlike the rest of the guide.

**Mitigation:** retain every anecdote and analogy, then attach short,
plain-language qualifications near the affected claim. Restructure only where
needed for a correct learning sequence.

### Three diagrams increase artifact weight and page density

Six self-contained localized artifacts add repository and deployment weight.

**Mitigation:** keep exactly these three distinct teaching visuals, lazy-load
them through the existing page contract, and leave secondary examples in
prose. Add no fourth diagram without a documented teaching gap.

### Scaling appears instantaneous or unlimited

A simple before/after picture can hide startup delays, quotas, stabilization,
and cost.

**Mitigation:** label bounds in `scaling-directions` and show warm-up, draining,
no-change, and stabilization in `autoscaling-control-loop`.

### Routing and replacement are conflated

Using one health-check arrow for both mechanisms could teach that a load
balancer directly destroys a failed instance.

**Mitigation:** distinguish traffic/data-plane edges from health and
control-plane edges and show independent routing and capacity decisions in
`load-balancing-health`.

### Translation drift

The original material exists only in Spanish, while publication requires an
English equivalent.

**Mitigation:** share one section and diagram contract, keep diagram IDs and
placement aligned, and require human bilingual equivalence review.

### Renderer localization regresses

A missing v3.0.1 translation key could introduce English viewer chrome into a
Spanish artifact.

**Mitigation:** use complete locale catalogs, fail on fallback-language
warnings, retain receipts, and inspect visible and accessible renderer text.

### Toolchain provenance is not reproducible

Archify is not a normal site dependency and a mutable or missing checkout can
produce untraceable output.

**Mitigation:** pin and verify `v3.0.1` plus its resolved revision, disable
update checks, record hashes and receipts, and never regenerate from an
unidentified checkout.

### Downstream bottlenecks are hidden

Adding application instances can increase load on a database or dependent
service and make a system less stable.

**Mitigation:** include downstream limits in lesson prose and the practical
decision guide; do not depict application capacity as sufficient evidence that
the whole system can scale.

## Publication gate

`status: published` is required by the current validator to build paired local
topic routes. In this repository, that frontmatter value does not itself deploy
the site.

The authorized endpoint for this implementation is a validated local preview
with evidence. The parent agent must stop there and request explicit user
approval. A deployment, release, or other public-state change requires a new
user instruction.
