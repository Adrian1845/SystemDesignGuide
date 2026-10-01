# Language toggle implementation proposal

- **Status:** Accepted
- **Date:** 2026-09-19
- **Owner:** architecture_lead
- **Scope:** English/Spanish static-site localization

## Decision

Approve a build-time, route-based language system for the guide. Each locale
is generated as a separate static page, and the header language control links
to the equivalent page in the other locale.

This proposal covers the language boundary only. It does not authorize a
client-side translation service, automatic translation, browser-language
redirects, or a runtime localization service.

## Recommendation

Use locale-prefixed canonical routes:

```text
/en/
/en/topics/monolith-vs-microservices/

/es/
/es/topics/monolith-vs-microservices/
```

Keep the current unprefixed English routes as compatibility aliases during
the migration. The generated locale-prefixed routes should be canonical.

The language control should use ordinary links styled as a compact toggle,
not buttons that require JavaScript:

```html
<nav aria-label="Language">
  <a href="/en/topics/monolith-vs-microservices/"
     hreflang="en" aria-current="page">EN</a>
  <a href="/es/topics/monolith-vs-microservices/"
     hreflang="es">ES</a>
</nav>
```

The selected language must preserve the current page whenever an equivalent
translation exists.

## Why this approach

Build-time locale pages fit the existing static architecture and provide:

- usable pages without JavaScript;
- stable, crawlable URLs for search engines;
- correct document language and metadata per page;
- simple deployment to Vercel or another static host;
- no runtime translation dependency or cache variation by browser language;
- a clear place to enforce translation completeness during the build.

A client-side content swap is not recommended because it weakens deep links,
non-JavaScript behavior, accessibility semantics, and search indexing. Automatic
browser-language redirects are also excluded because they make navigation
surprising and can produce inconsistent cached responses.

## Content model

Each topic gets one authored file per supported locale:

```text
content/topics/monolith-vs-microservices/
  en.mdx
  es.mdx
```

The files share a stable topic identity. The locale is explicit metadata:

```yaml
title: Monolith vs Microservices
slug: monolith-vs-microservices
locale: en
translationOf: monolith-vs-microservices
summary: Understand how deployment boundaries change as a system grows.
status: published
```

The minimum shared identity fields are `slug` and `translationOf`. The
following fields may differ by locale: `title`, `summary`, lesson prose,
captions, diagram labels, alt text, and fallback explanations.

Topic and diagram IDs must remain language-neutral. They are identifiers for
linking and validation, not learner-facing copy.

## Diagram localization

Diagram structure should remain separate from localized presentation text.
Future diagram source packages should distinguish structural data from copy,
for example:

```text
diagrams/<topic-id>/<diagram-id>/
  spec.json       # language-neutral nodes, edges, and diagram kind
  copy.en.json    # English title, labels, alt text, and fallback
  copy.es.json    # Spanish title, labels, alt text, and fallback
```

The current diagram records can be migrated to this shape when localization
is implemented. The page renderer selects the copy file using the page
locale, while the logical diagram ID remains unchanged.

Archify-specific output remains outside the authored content contract. A
future rendered artifact may be shared between locales only if its visible
and accessible text can be localized independently; otherwise it must be
generated per locale.

## Header and accessibility contract

Every generated page must:

- set `<html lang="en">` or `<html lang="es">` correctly;
- expose the language control through `nav[aria-label="Language"]`;
- mark the current locale with `aria-current="page"`;
- provide a real link to the equivalent localized route;
- preserve keyboard focus visibility and logical tab order;
- expose localized diagram alt text and fallback copy;
- avoid relying on flags or color alone to communicate language.

The toggle should be placed in the global header and remain available on the
landing page and all topic pages. On narrow screens it may wrap below the
primary navigation without changing its semantics.

## Routing and metadata

The build should generate a route mapping from the stable topic ID and locale:

```text
route(locale, topic) = /<locale>/topics/<topic-slug>/
```

Each localized page should emit:

- a locale-specific canonical URL;
- an `hreflang="en"` link to the English equivalent, when present;
- an `hreflang="es"` link to the Spanish equivalent, when present;
- an `hreflang="x-default"` link to the default English route;
- localized title and description metadata.

The existing `/` and `/topics/<topic-slug>/` pages may remain as English
compatibility aliases during migration. They should point canonical metadata
at their `/en/` equivalents and must not create a second content identity.

## Validation rules

The static build should fail when:

1. a locale is not in the supported locale list;
2. a localized file has no stable topic identity;
3. two files claim the same locale and topic identity;
4. a published language toggle points to a missing page;
5. a localized internal link points to a different or unknown locale route;
6. a published page has the wrong HTML language metadata;
7. a diagram reference has no copy for the current published locale;
8. an authored page silently falls back to another language.

During the initial rollout, an English topic may be published before its
Spanish translation. In that state, the Spanish toggle should be presented as
unavailable or marked as coming soon. Once a Spanish translation is marked
`published`, parity validation should require both locale routes and all
referenced diagram copy.

## Rollout plan

### Phase 1: routing and shell

- Add `en` and `es` to site configuration.
- Generate locale-prefixed English routes.
- Preserve current unprefixed routes as English aliases.
- Add the accessible header language control.
- Add locale-aware HTML and metadata generation.

### Phase 2: reference translation

- Rename the existing topic source to `en.mdx`.
- Add an approved Spanish translation as `es.mdx`.
- Localize the two diagram records' titles, labels, alt text, and fallbacks.
- Add route, parity, and diagram-copy validation.

### Phase 3: contribution workflow

- Document the translation file convention.
- Add locale status guidance for contributors.
- Require each new published translation to pass the same content and
  accessibility checks as English.

## Acceptance criteria

The implementation is ready for review when:

- `/en/` and `/es/` are generated as static routes;
- the equivalent topic pages switch language without losing page context;
- the header toggle works with keyboard navigation and without JavaScript;
- each page exposes correct `lang`, canonical, and `hreflang` metadata;
- missing translations are explicit and never silently mixed into a page;
- diagrams retain meaningful localized alt text and fallback explanations;
- validation fails for missing routes, invalid locales, broken translations, or
  missing localized diagram copy;
- current English URLs remain usable during the migration.

## Resolved decisions

1. The Spanish locale launches together with the English locale. Every page
   published in the initial multilingual release must exist in both languages;
   the site must not publish an English page without its Spanish equivalent.
2. Existing unprefixed English routes become compatibility redirects to their
   `/en/` equivalents after locale-prefixed routes are established.
3. The user reviews the Spanish translation for technical equivalence and
   educational accuracy. Automated validation checks structure and parity but
   does not replace human translation review.
