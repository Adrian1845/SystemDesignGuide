# System Design Guide

A guide to common patterns in system design, authored as isolated topic
packages and published as a static site.

## Development

The project has no runtime dependencies. With Node.js installed:

```text
npm run validate
npm run build
```

To launch a local preview after building:

```text
npm.cmd run build
npx.cmd --yes serve dist
```

Open the URL printed by `serve` (usually `http://localhost:3000`).

The generated site is written to `dist/`. Authored lesson content lives in
`content/topics/`, while diagram specifications remain separate under
`diagrams/`. Archify is currently used only as a bounded POC for the Monolith
vs Microservices topic; broader integration remains subject to that POC review.

The initial site is available in both languages:

```text
/en/
/es/
```

Topic translations use `en.mdx` and `es.mdx` files in each topic folder.
