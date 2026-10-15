# Caches topic architecture

- **Status:** Accepted
- **Date:** 2026-10-15
- **Owner:** architecture_lead
- **Approval:** The user approved the bilingual lesson and three diagram concepts.
  Archify 3.0.1 supported all three as `workflow` diagrams during implementation.

## Post-implementation cleanup — 2026-10-15

At the user's request, the original draft `content/topics/caches/caches.md` was
removed after its bilingual article was completed. Historical instructions below
to preserve that draft unchanged are superseded; the published `en.mdx` and
`es.mdx` files are the maintained content sources.

## Recommendation

Publish one bilingual introductory lesson under the stable slug `caches`, derived
from the user-authored `content/topics/caches/caches.md`. Preserve that file
unchanged. Add `content/topics/caches/en.mdx` and `es.mdx`, and three localized
Archify diagrams under `diagrams/caches/`: a cache-aside read, freshness and
invalidation, and a seat reservation boundary. Reuse the existing static build,
diagram metadata, and iframe integration. No runtime cache, database, or service
is needed for the educational website.

## Verified facts and constraints

- `content/topics/caches/caches.md` is Spanish prose without topic frontmatter.
  It supplies the fridge analogy, TTL, invalidation, duplicate events, sessions,
  and a ticket-seat example. The content reader only loads locale `.mdx` files.
- Publishable topics require paired `en.mdx` and `es.mdx` with `title`, `slug`,
  `translationOf`, `locale`, `summary`, and `status`. Directory, slug, and
  `translationOf` must agree; both pages must be `published` to validate.
- Pages refer to diagrams with `:::diagram id="..."` directives. The site reads
  `diagrams/<slug>/<id>/diagram.json`; diagram specs and generated HTML stay in
  the diagram folder, separate from page content.
- The existing Archify workflow uses localized `spec.en.json` and
  `spec.es.json`, self-contained generated HTML, localized metadata and fallback
  text, and complete renderer translation catalogs. Existing topics pin
  Archify 3.0.1 and use the `showcase` quality profile.

## Goals and scope

- Explain what a cache stores, why a copy closer to a reader can reduce latency
  or origin load, and why it adds freshness and failure trade-offs.
- Teach one concrete read pattern, cache-aside; show hit, miss, fill, TTL expiry,
  and explicit invalidation without implying those are the only strategies.
- Preserve the author's fridge anecdote, informal first-person voice, and
  closing signature in a technically accurate Spanish adaptation and an
  equivalent English version.
- Make the reservation example safe: a cache can help display availability or
  coordinate a temporary hold, but it is not automatically the authority that
  prevents double sales. A durable transactional reservation or equivalent
  atomic constraint must decide the winner.

The lesson does not cover all eviction policies, cache coherence protocols,
CDN internals, Redis operations, multi-region consistency, or a production seat
booking architecture. The website itself does not gain a cache or database.

## Content and route contract

| Item | Value |
| --- | --- |
| Slug and `translationOf` | `caches` |
| English title | Caches: faster reads and fresher data |
| Spanish title | Cachés: lecturas rápidas y datos actualizados |
| Routes | `/en/topics/caches/`, `/es/topics/caches/` |
| Source | `content/topics/caches/caches.md`, unchanged |
| Publishable pages | `content/topics/caches/en.mdx`, `es.mdx` |

Use the same section order and diagram IDs in both languages:

1. **The fridge analogy.** Retain the original story. Explain the kitchen
   fridge as a smaller, nearby copy and the storage-room fridge as origin.
2. **What a cache is.** Define a cache as a layer that keeps reusable data or
   computed results near a consumer. It need not be a database or RAM. Briefly
   distinguish browser, application, shared, and edge caches. Cookies are
   browser state and are not themselves a cache.
3. **Read path.** Show cache hit and miss, population from the origin, and
   the extra work of a miss. Insert `cache-aside-read` here.
4. **Freshness.** Explain TTL as an expiry policy, then explicit invalidation or
   update after a write. Expiry need not delete a value immediately; it makes
   the value ineligible or triggers refresh according to implementation.
   State the temporary stale-read trade-off. Insert `cache-freshness` here.
5. **Where it helps and where it hurts.** Cover repeated reads, upstream API
   response caching, sessions or deduplication as distinct uses with different
   correctness needs. Mention capacity, eviction, cold starts, stampedes, and
   unavailable cache behavior at introductory depth.
6. **Ticket seats.** Treat the original brand-specific story as a hypothetical
   concert booking example. Show availability display and optional short hold,
   then a transactional reservation in the durable source of truth. Insert
   `seat-reservation-boundary` here. Explain that low latency alone cannot
   guarantee exclusivity.
7. **Decision guide and closing.** Ask about access skew, acceptable staleness,
   invalidation trigger, capacity/TTL, and failure behavior. Preserve the
   author's humorous conclusion and signature.

Avoid unconditional millisecond figures. Actual latency depends on network,
payload, backend, location, and load. Avoid claims about how Ticketmaster
specifically implements reservation unless supported by a primary source;
the article can use an invented ticket service without that claim.

## Diagram contract

| ID | Teaching point | Minimum path |
| --- | --- | --- |
| `cache-aside-read` | A hit returns the cached value; a miss reads origin, fills cache, then responds. | Client → application → cache; hit response; miss → origin → cache fill → response. |
| `cache-freshness` | A cached copy moves from absent to fresh to expired/invalidated, then is reloaded. | Absent → loaded/fresh → expired or invalidated → reload. Mark the origin write and invalidation as separate actions. |
| `seat-reservation-boundary` | A fast availability read or optional hold is not the final booking guarantee. | Two buyers see availability; reservation service attempts an atomic durable claim; one succeeds, the other gets conflict; cache view is refreshed or invalidated. |

The design contract fixes each teaching point and ID rather than a specific
kind. The local Archify 3.0.1 implementation used `workflow` for all three
after checking renderer support and legibility.

Each ID gets `spec.en.json`, `spec.es.json`, `diagram.json`, localized generated
HTML, full localized Archify renderer copy, useful localized `altText` and
fallback, and the existing validation/delivery receipts. Logical node IDs and
edges remain language neutral. Diagrams must not imply a universal cache
latency, guaranteed freshness after TTL, or a cache-only double-sale safeguard.

## Alternatives and decision

- **Two diagrams:** enough for the generic cache mechanism, but leaves the
  source article's most consequential correctness claim unillustrated.
- **Three diagrams (recommended):** makes the cache benefit, freshness cost,
  and reservation boundary visible without turning the page into a survey of
  caching strategies.
- **Vendor-specific Redis architecture:** premature for an introductory,
  vendor-neutral lesson and would suggest that one product solves all cases.

## Technical references

These sources support the corrections in the editorial contract:

- [MDN, HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
  describes caching as storing and reusing a response, potentially near the
  browser, while reducing work at the origin. This supports the general cache
  model without defining every cache as an in-memory database.
- [MDN, Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies)
  defines cookies as limited browser state sent with later requests. Together
  with the HTTP caching guide, it supports treating cookies and cached
  responses as distinct mechanisms.
- [Redis, EXPIRE](https://redis.io/docs/latest/commands/expire/)
  documents passive and active expiration. The Redis example verifies that
  crossing a TTL does not require immediate physical deletion. The lesson
  must avoid presenting Redis behavior as universal for all caches.
- [PostgreSQL, unique constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
  documents durable uniqueness enforcement. Applying such a constraint or an
  equivalent atomic transaction to a seat claim is the design inference used
  in the hypothetical booking diagram; this is not a claim about a ticket
  vendor's implementation.

## Implementation verification

The coordinating agent reports that all six localized Archify artifacts (three
diagrams in English and Spanish) passed their checks, and the final content
validation and site build passed. Git status was verified with a command-local
`safe.directory` setting. This records the implementation result; it does not
authorize deployment or public release.

## Risks and acceptance criteria

The main editorial risk is retaining a relatable analogy while overstating
what caches guarantee. Review the bilingual text and diagrams together for
accurate scope, consistent terminology, and equivalent examples. Verify any
product-specific factual statement or replace it with a hypothetical example.

Implementation is ready for review when:

1. The original `caches.md` draft is retired, and both localized topic pages
   validate.
2. All three diagrams use the established build-time Archify contract; their
   visible controls, labels, accessibility copy, and fallback match page locale.
3. Validation and build complete successfully, and desktop/mobile browser
   review confirms diagrams fit, remain readable, and avoid nested scrolling.
4. A reader can explain hit versus miss, TTL versus invalidation, and why a
   durable atomic claim decides competing seat reservations.

This proposal authorizes no deployment or public release. Publication review
should compare the final adaptation with the user's original voice.
