# Sync, async, and threading topic scope

**Status:** Accepted  
**Date:** 2026-10-01  
**Owner:** architecture_lead

## Recommendation

Prepare the source article as the guide's second isolated bilingual topic under
the stable slug `sync-async-threading`. Reuse the existing static content,
localized route, diagram-record, and iframe boundaries without adding a new
frontend component or runtime dependency. Implementation ends at a local
preview for explicit user approval; this decision does not authorize public
publication or deployment.

Start with the minimum two localized Archify diagrams needed to teach the
examples clearly:

1. a registration flow that contrasts a synchronous critical path with an
   asynchronous welcome-email path; and
2. an invoice flow that contrasts sequential dependency calls with concurrent
   fan-out and join.

The lesson must first separate two independent axes: synchronous versus
asynchronous describes coordination and waiting, while single-threaded versus
multithreaded describes execution resources. The published copy should not use
FIFO, round-robin, queues, or brokers as synonyms for either axis.

The opening anecdote and informal first-person personality are part of the
article and must be retained. Editing may restructure the lesson and add clear
technical corrections, but should not flatten it into generic documentation.

Every visible or accessible string inside a Spanish diagram artifact must be
Spanish. Generate this topic with Archify `v3.0.1`, set `meta.locale` to `es`
for each Spanish source, and provide the complete Spanish renderer translation
catalog required by that version. English sources must set `meta.locale` to
`en` and use the complete English catalog. If validation or browser review
finds missing catalog entries, fallback English, or untranslated
renderer-owned chrome, Spanish Archify delivery is blocked; the artifact must
not be hand-edited and the topic must not be presented for publication
approval until the locale source/catalog is corrected.

This is a controlled, topic-level extension of the existing Archify proof of
concept. It is not a repository-wide decision to make Archify mandatory for
every future topic.

## Resolved decisions

1. Retain the opening anecdote and the article's informal personality while
   explicitly correcting the technical model.
2. Author an English adaptation and submit both languages for final user
   equivalence review.
3. Use `sync-async-threading` as the stable slug. Use the concrete titles
   **Synchronous vs. asynchronous: single-threaded vs. multithreaded** and
   **Síncrono vs. asíncrono: monohilo vs. multihilo**.
4. Treat sync/async and thread count as independent axes. Present FIFO and
   round-robin only as limited analogies, not definitions.
5. Describe the invoice example as concurrent I/O that does not inherently
   prove multithreading.
6. Diagram count is flexible, but the architecture selects the minimum useful
   set: the two diagrams below. Add another only if review identifies a
   teaching gap that prose and these diagrams cannot close.
7. Registration succeeds only after the database registration completes. The
   welcome email is always deferred and is never part of the required blocking
   response path.
8. Both diagrams may use Archify `dataflow`; a sequence-style composition is
   allowed when evidence shows it is clearer.
9. Restore or recreate the Archify checkout at the newly approved `v3.0.1`
   tag, retain `showcase` checks and receipts, and commit approved localized
   artifacts. This supersedes the earlier `2.17.0-dev.1` pin and requires new
   compatibility and browser evidence for all artifacts.
10. Spanish artifacts require complete page-language parity; English
    renderer-owned chrome is not acceptable.
11. The implementation must stop at a local preview and wait for explicit user
    approval before publication or deployment.

### Superseding Archify version decision

On 2026-10-01 the user explicitly approved changing this topic's Archify pin
from `2.17.0-dev.1` to `v3.0.1` so the renderer can use Spanish locale support.
This supersedes the answer to original approval question 14 below. The original
question and answer remain unchanged as decision history; they are no longer
the operative version instruction.

For this topic, `v3.0.1` is a complete generation contract, not only a CLI
version:

- Spanish specifications set `meta.locale` to `es`.
- English specifications set `meta.locale` to `en`.
- The complete renderer catalog for each locale accompanies generation using
  the v3.0.1-supported catalog mechanism; partial catalogs are invalid.
- Authored labels, renderer-owned controls, accessibility text, document
  metadata, and fallback strings inside each artifact match its page language.
- Receipts record Archify `v3.0.1`, source/catalog identity or hashes, artifact
  hashes, validation results, and browser evidence.
- No artifact may be post-processed or hand-edited to simulate localization.

## Goals

- Turn `origin/sync_async_sthread_mthread.md` into a precise, approachable
  English and Spanish lesson.
- Give learners a clear mental model for the two independent axes before
  discussing implementation techniques.
- Illustrate the article's registration and invoice examples with diagrams
  that make waiting and concurrency visible.
- Preserve the current static build, accessible fallback, localization, and
  no-runtime-service boundaries.
- Keep content, Archify source specifications, site-facing diagram records,
  and generated artifacts separate and reviewable.
- Establish checks sufficient to publish the topic without weakening the
  standards applied to the current reference page.

## Non-goals

- No backend, database, authentication, queue, broker, worker, or other runtime
  service will be added to the guide itself.
- No general-purpose concurrency simulator or interactive code playground is
  proposed.
- No new route registry, page template, content framework, or diagram runtime
  is needed.
- The article will not attempt to teach language-specific thread APIs, event
  loop internals, locks, memory models, or every messaging delivery guarantee.
- The diagrams will not claim that concurrent I/O necessarily uses multiple
  application threads.
- This proposal does not accept Archify as a mandatory renderer for future
  topics and does not change the existing Archify architecture decision.

## Verified repository constraints

- `scripts/content.mjs` discovers localized topic files at
  `content/topics/<slug>/<locale>.mdx` and extracts diagram references written
  as `:::diagram id="..."` blocks.
- `scripts/validate.mjs` currently requires every topic to have both `en` and
  `es` files, matching `slug` and `translationOf` values, and `published`
  status in both locales.
- The supported locale list is exactly `en` and `es`.
- `scripts/build.mjs` automatically generates locale-prefixed topic routes,
  landing-page cards, navigation links, and an unprefixed English compatibility
  redirect. A new topic does not require manual route registration.
- The current Markdown renderer supports level-two through level-four
  headings, flat `-` lists, strong text, inline code, links, blockquotes, and
  diagram directives. It does not correctly render the source article's
  italic markup, `*` lists, nested lists, or thematic rules.
- Pages consume a site-facing `diagram.json`; the builder does not consume an
  Archify source specification directly.
- Each localized Archify artifact is copied into `dist/` and embedded in a
  lazy-loaded iframe. Localized title, alt text, and learner-readable fallback
  copy remain part of the surrounding page contract.
- The existing Monolith vs Microservices topic keeps `spec.en.json` and
  `spec.es.json` separate from generated HTML and records Archify validation,
  artifact hashes, browser evidence, and renderer version in a receipt.
- The existing Monolith vs Microservices POC historically used Archify
  `2.17.0-dev.1` with the `showcase` quality profile. Its architecture document
  explicitly leaves broader adoption pending. Those artifacts and receipts
  remain historical evidence and are not silently regenerated by this topic.
- The earlier `2.17.0-dev.1` viewer evidence did not provide Spanish
  renderer-owned chrome. This topic therefore has an approved, isolated
  `v3.0.1` pin and must supply `meta.locale: "es"` plus the complete Spanish
  renderer catalog. That capability still requires real validation and browser
  evidence before acceptance; the version decision alone is not proof.
- `origin/sync_async_sthread_mthread.md` is Spanish source material, not a
  publishable topic package. It has no frontmatter or English equivalent and
  currently conflates synchronization, threading, and queue scheduling.

## Content and route contract

### Stable identity

Accepted topic identity:

```text
slug / translationOf: sync-async-threading

English title: Synchronous vs. asynchronous: single-threaded vs. multithreaded
Spanish title: Síncrono vs. asíncrono: monohilo vs. multihilo
```

Canonical routes:

```text
/en/topics/sync-async-threading/
/es/topics/sync-async-threading/
```

The build should also generate the existing English compatibility route:

```text
/topics/sync-async-threading/ -> /en/topics/sync-async-threading/
```

### Topic package

```text
content/topics/sync-async-threading/
  en.mdx
  es.mdx
```

Each file must contain `title`, `slug`, `translationOf`, `locale`, `summary`,
and `status` frontmatter. Both localized files must reference the same minimum
diagram set in equivalent teaching positions.

The source should be normalized to the Markdown subset already supported by
the builder. Extending the renderer solely to preserve ornamental italics,
nested bullets, or horizontal rules is not justified for this topic.

### Recommended lesson sequence

1. **Opening anecdote:** retain the source's anecdote and informal personality,
   then use a clear transition to distinguish its playful scheduling analogies
   from the actual technical definitions.
2. **The short version:** establish that coordination and execution model are
   independent axes.
3. **Synchronous versus asynchronous:** explain whether a caller waits for an
   outcome and when each model is appropriate.
4. **Registration example:** show that registration waits for the database
   write but never waits for the welcome email.
5. **Single-threaded versus multithreaded:** explain worker capacity, parallel
   execution, resource limits, and shared-state hazards.
6. **Invoice example:** compare sequential dependency requests with concurrent
   fan-out and join without claiming that concurrency implies threads.
7. **Common misconceptions:** explicitly correct the FIFO, round-robin,
   broker, and thread equivalences present in the source.
8. **Decision guide:** relate dependency ordering, latency, CPU-bound versus
   I/O-bound work, backpressure, retries, idempotency, shared state, and
   operational complexity to the choice.

The gym/one-machine analogy remains a prose aid. Two diagrams are the minimum
recommended set; a third is allowed only if review identifies a specific
teaching gap.

## Diagram contract

Accepted package layout:

```text
diagrams/sync-async-threading/
  registration-response-paths/
    diagram.json
    spec.en.json
    spec.es.json
    generated/
      registration-response-paths.en.<renderer-output>
      registration-response-paths.es.<renderer-output>
      archify-receipts.json
  invoice-fetch-strategies/
    diagram.json
    spec.en.json
    spec.es.json
    generated/
      invoice-fetch-strategies.en.<renderer-output>
      invoice-fetch-strategies.es.<renderer-output>
      archify-receipts.json
```

Both `diagram.json` records must retain the existing page-facing contract:

- a language-neutral `id` matching its directory and MDX reference;
- a site-supported `kind`;
- locale-specific artifact paths;
- renderer name, exact version, quality profile, and source-spec paths;
- localized title, alt text, fallback, and node labels for `en` and `es`;
- language-neutral logical edges.

The Archify source and localization contract is also mandatory:

- use only the approved `v3.0.1` checkout for this topic;
- set `meta.locale` to `en` in English specs and `es` in Spanish specs;
- provide every renderer-owned translation key through the complete English
  and Spanish v3.0.1 catalogs, using the renderer's supported catalog
  mechanism;
- fail validation for a missing key rather than falling back to another
  language; and
- record source/catalog identity and hashes in the delivery receipt.

Generated output must never be hand-edited. A receipt must tie each artifact
to its source and catalog hashes and the exact Archify `v3.0.1` version that
produced it. If the supported v3.0.1 localization path cannot produce a fully
Spanish artifact, this phase is blocked rather than waived.

### Diagram 1: `registration-response-paths`

Recommended Archify form: `dataflow`, unless the Archify researcher proves a
sequence composition is materially clearer and equally well supported.

The composition should distinguish the required registration work from the
deferred side effect:

- **Required critical path:** browser -> registration API -> user database ->
  successful database acknowledgement -> success response.
- **Deferred email path:** after the registration is durably accepted, an
  event/outbox -> queue or broker -> email worker -> provider path proceeds
  independently of the already-completable response.

The diagram must visually distinguish the user-visible response path from
deferred work and must never show delivery of the welcome email as a condition
of registration success. A short card may mention retries and idempotency, but
the main flow should stay focused. The fallback must explain that a broker is
one implementation of asynchronous work, not its definition.

### Diagram 2: `invoice-fetch-strategies`

Recommended Archify form: `dataflow` with two comparable views or lanes.

- **Sequential:** invoice service -> user data -> order data -> combine ->
  invoice.
- **Concurrent:** invoice service fans out to user data and order data, waits
  for both results, then joins them to create the invoice.

Labels and fallback copy must call the second path **concurrent**, not
automatically **multithreaded**. It may be implemented through asynchronous
I/O on one event-loop thread, a thread pool, or another execution model. The
diagram must also show that the join cannot finish until both required results
arrive.

## Ownership boundaries

- `architecture_lead` owns this accepted scope and any resulting durable
  architecture record; it does not implement the topic or diagrams.
- `site_builder` owns `content/topics/sync-async-threading/`, integration with
  the existing page shell, and site-level validation/build/browser checks.
  It should avoid changing the generic renderer unless a separately reviewed
  need appears.
- `archify_researcher` owns topic-local Archify specs, validation, delivery,
  receipts, and diagram-focused browser evidence. It must not modify frontend
  source files.
- The parent agent coordinates content/diagram integration, protects unrelated
  user work, and resolves any contract mismatch.
- The user approves editorial framing, technical corrections, titles, English
  equivalence, diagrams, and publication readiness.

## Implementation phases

### Phase 1: approve editorial and technical scope

- Record the user's answers without deleting the original Q&A.
- Reconcile stable identity, titles, lesson sequence, technical corrections,
  minimum diagram set, language parity, and preview gate into this contract.

**Exit criterion:** complete. The resolved decisions above are accepted.

### Phase 2: author the bilingual topic

- Create equivalent `en.mdx` and `es.mdx` files with valid frontmatter.
- Correct the technical conflations while preserving the approved voice.
- Insert the two diagram directives at equivalent positions.
- Normalize markup to the existing renderer contract.

**Exit criterion:** both localized documents pass content review before they
depend on generated artifacts.

### Phase 3: author and deliver diagrams

- Create English and Spanish Archify sources for both diagram IDs.
- Set `meta.locale: "en"` and `meta.locale: "es"` in the corresponding specs
  and provide complete v3.0.1 English and Spanish renderer catalogs.
- Validate and deliver with the approved `v3.0.1` checkout and `showcase`
  profile, with no cross-locale fallback.
- Create site-facing diagram records and store validation/delivery receipts.
- Produce a Spanish artifact with no English visible or accessible
  renderer-owned UI.
- Stop and report a blocking constraint if v3.0.1 plus its complete Spanish
  catalog cannot satisfy full Spanish parity without modifying generated
  output.

**Exit criterion:** all four artifact variants are traceable, valid, readable,
consistent with their page fallbacks, and fully match their page language.

### Phase 4: integrate and validate

- Run the repository validation and build commands.
- Check both routes, locale switching, landing-page cards, navigation, iframe
  sizing, fallbacks, and responsive behavior.
- Perform keyboard, focus, contrast, unavailable-artifact, and no-JavaScript
  checks proportionate to the existing diagram contract.
- Obtain human technical and translation review.
- Serve the completed build locally and provide a preview for user review.
- Do not publish or deploy as part of this phase.

**Exit criterion:** every implementation acceptance criterion below has
evidence and the local preview is ready. Work then stops for explicit user
approval; publication/deployment is a separate authorized action.

## Acceptance criteria

- English and Spanish topic files exist with matching identity and equivalent
  preview content. Because the current validator requires paired `published`
  metadata to build topic routes, that metadata may be used as a local build
  state; it does not authorize public deployment.
- The two canonical localized routes build, and the unprefixed compatibility
  route points to English.
- The topic is automatically present on both localized landing pages and in
  navigation without a new route registry.
- Each localized lesson references the minimum approved set,
  `registration-response-paths` and `invoice-fetch-strategies`. Another
  diagram is permitted only when review records a concrete teaching gap.
- The lesson explicitly states that synchronous/asynchronous and
  single-threaded/multithreaded are independent axes.
- The lesson does not equate async with brokers, single-threading with FIFO,
  multithreading with round-robin, or concurrent I/O with multiple threads.
- Four localized Archify sources set the correct `meta.locale`, use complete
  v3.0.1 locale catalogs, and pass the approved `showcase` validation and
  delivery process without fallback-language warnings.
- Four generated artifacts and complete source/artifact receipts exist.
- Both site-facing `diagram.json` records identify renderer version `v3.0.1`
  and point to the corresponding localized sources and artifacts.
- Every receipt identifies Archify `v3.0.1` and records the source, locale
  catalog, and artifact identity or hashes.
- The generated artifacts match their `diagram.json` locale paths and the
  visible flow agrees with alt text and fallback copy.
- Both fallbacks teach the intended concept without the iframe or JavaScript.
- Every visible and accessible string inside the Spanish artifact is Spanish;
  English renderer-owned chrome is a release blocker.
- The surrounding site and artifacts are checked on a narrow viewport and at
  1440x900 and 1920x1080 without horizontal page overflow or illegible labels.
- Iframe titles, keyboard access, focus visibility, contrast, reduced-motion
  behavior, and unavailable-artifact behavior have been checked.
- `npm.cmd run validate` and `npm.cmd run build` complete successfully.
- Human review confirms Spanish accuracy, English equivalence, technical
  accuracy, and preview suitability.
- A local preview is delivered for explicit user approval, and no public
  publication or deployment occurs before that approval.

## Risks and mitigations

### Technical conflation

The source treats sync/async, thread count, and scheduling policy as one
spectrum. Publishing it unchanged would teach an incorrect mental model.

**Mitigation:** organize the page around two axes and require the misconception
section and diagram wording described above.

### Editorial framing

The opening uses gender stereotypes as its central analogy. This may distract
or alienate readers and implies biological support for the technical model.

**Mitigation:** the accepted direction is to retain the anecdote and informal
personality. Follow it immediately with precise definitions so readers can
distinguish the author's playful analogy from the technical model. Technical
corrections may restructure the surrounding explanation but must not erase the
voice the user approved.

### Translation drift

The repository requires two published locales, while the origin material is
Spanish only. An unreviewed English adaptation may change technical meaning or
voice.

**Mitigation:** author against a shared section/diagram outline and require a
human bilingual equivalence review before publication.

### Diagram overclaiming

The invoice example can accidentally imply that overlapping I/O proves
multithreading, and the registration example can imply that every async design
requires a broker.

**Mitigation:** use precise labels, localized fallbacks, and explicit caveats
in both page copy and diagram summary cards.

### Archify reproducibility and provenance

The current integration used a temporary checkout rather than a repository
dependency. A missing or changed checkout can make new artifacts inconsistent
with the reference topic.

**Mitigation:** restore or obtain the exact `v3.0.1` checkout for this topic,
record the tag/version plus source, catalog, and artifact hashes, retain
receipts, and never hand-edit output. Do not regenerate the earlier topic's
`2.17.0-dev.1` artifacts as an incidental part of this work.

### Localization limitation

The historical `2.17.0-dev.1` viewer places English renderer-owned chrome
around Spanish authored labels. The user explicitly rejected mixed-language
artifacts and approved `v3.0.1` to provide Spanish renderer localization.

**Mitigation:** set `meta.locale: "es"`, supply the complete Spanish v3.0.1
translation catalog, fail on missing keys instead of accepting fallback
English, and visually inspect every renderer-owned control and accessibility
string. If this supported path still produces mixed-language output, report
the Spanish diagram as blocked. Site-level copy does not waive this condition,
and generated output must not be patched by hand.

### Artifact weight and page density

Each self-contained Archify artifact is relatively large. Adding unnecessary
diagrams increases repository/deployment size and cognitive load.

**Mitigation:** start with two lazy-loaded diagrams and keep the gym example in
prose. Add an artifact only when review records a teaching need that the
minimum set cannot meet.

## Questions for approval

The original questions and the user's inline answers are preserved below for
traceability. The operative interpretation is the **Resolved decisions**
section above.

1. **Editorial opening:** Should the gender-stereotype anecdote be removed and
   replaced with a neutral queue/gym opening, or retained only as an explicitly
   rejected example of a bad analogy?
- Do not remove any anecdote, its part of the personality the website has
2. **Editorial voice:** May the implementation substantially restructure and
   tighten the source while retaining its informal first-person tone, rather
   than treating the origin file as near-verbatim copy?
- Same as answer in 1
3. **English translation:** Should the implementation author an English
   adaptation alongside the Spanish revision, with the user providing final
   human equivalence approval?
- Yes
4. **Slug:** Is `sync-async-threading` approved as the stable,
   language-neutral topic identity and route segment?
- Yes
5. **Titles:** Are `Synchronous, asynchronous, and threading models` and
   `Sincronía, asincronía y modelos de ejecución` approved, or should the
   public titles stay closer to the origin filename?
- I would like to stay closer to the origin filename
6. **Technical corrections:** Is it approved to explicitly correct the source
   by treating sync/async and thread count as independent axes, separating
   FIFO/round-robin from both, and stating that async does not require a
   broker?
- Sure, fifo and round robin are just analogies
7. **Invoice terminology:** Is it approved to describe the invoice fan-out as
   concurrent I/O that may or may not use multiple threads, even though the
   source currently presents it as the multithreaded example?
- Yes
8. **Diagram count:** Is the two-diagram limit approved, leaving the gym analogy
   as prose rather than creating a third artifact?
- We can create as much as needed
9. **Registration diagram:** Is the proposed comparison of a blocking
   welcome-email critical path with an immediate response plus deferred
   event/outbox/queue/email-worker path the intended example?
- The welcome email doesnt need to be in the blocking path, just the register on the db
10. **Invoice diagram:** Is the proposed sequential-versus-concurrent fan-out
    and join comparison the intended example, including the explicit wait for
    both required results?
- Yes
11. **Diagram types:** May the Archify researcher use `dataflow` for both
    diagrams, changing one to a sequence-style composition only if validation
    and readability evidence show it is better?
- Yes
12. **Archify scope:** Does the request authorize this controlled use of
    Archify for the second topic while leaving repository-wide adoption
    pending?
- Yes
13. **Checkout restoration:** May the Archify researcher restore or recreate
    the temporary approved Archify checkout needed to validate and deliver the
    artifacts, without adding it as a site runtime dependency?
- Yes
14. **Version:** Should generation remain pinned to the evidenced
    `2.17.0-dev.1` version, with any version change requiring the receipts and
    compatibility checks to be redone and documented?
- Yes
15. **Generated artifacts:** Is committing four localized self-contained HTML
    artifacts plus per-diagram receipts approved despite their repository and
    deployment size?
- Yes
16. **Browser evidence:** Are narrow-screen, 1440x900, and 1920x1080 checks of
    the surrounding pages and both locale artifacts sufficient, together with
    keyboard, focus, contrast, reduced-motion, and unavailable-artifact checks?
- Yes
17. **Spanish viewer chrome:** Is English renderer-owned chrome acceptable on
    Spanish artifacts when authored labels and all site-owned accessible copy
    are Spanish and the limitation is visually reviewed?
- No, the artifacts should be in the same language as the page
18. **Publication:** Should both locales be marked `published` immediately once
    all acceptance criteria pass, or should implementation stop for a final
    user preview and explicit publication approval?
- I would like a preview and approval
## Follow-up work

After this topic is complete, compare the second-topic evidence with
`docs/architecture/archify-investigation.md`. If two topics demonstrate stable
generation, localization, fallback, clean-environment reproducibility, and
browser behavior, propose a separate durable decision about broader Archify
adoption. Do not fold that decision into this article implementation.
