import fs from "node:fs/promises";
import path from "node:path";
import { readDiagram, root, supportedLocales } from "./content.mjs";
import { validateContent } from "./validate.mjs";

const dist = path.join(root, "dist");

const localeCopy = {
  en: {
    siteName: "System Design Guide", home: "Home", language: "Language", switchTo: "Switch to Spanish", skip: "Skip to content", diagram: "diagram", topicGuide: "Topic guide", foundations: "Foundations",
    footerOne: "Clear foundations for designing reliable systems.", footerTwo: "Static, repository-authored, and built for learning.",
    heroEyebrow: "A practical systems library", heroTitle: "Design with clarity.<br><em>Build with confidence.</em>",
    heroSummary: "A growing, visual guide to the trade-offs behind the systems we build—from the first request to the last stored record.",
    explore: "Explore topics", startHere: "Start here", sectionTitle: "Topics that make the big picture click.",
    sectionSummary: "Each guide connects a clear mental model to the decisions you’ll make in real systems.", readGuide: "Read the guide",
  },
  es: {
    siteName: "Guía de Diseño de Sistemas", home: "Inicio", language: "Idioma", switchTo: "Cambiar a inglés", skip: "Saltar al contenido", diagram: "diagrama", topicGuide: "Guía temática", foundations: "Fundamentos",
    footerOne: "Fundamentos claros para diseñar sistemas fiables.", footerTwo: "Estático, escrito en el repositorio y creado para aprender.",
    heroEyebrow: "Una biblioteca práctica de sistemas", heroTitle: "Diseña con claridad.<br><em>Construye con confianza.</em>",
    heroSummary: "Una guía visual en crecimiento sobre las decisiones y compensaciones de los sistemas que construimos, desde la primera petición hasta el último registro almacenado.",
    explore: "Explorar temas", startHere: "Empieza aquí", sectionTitle: "Temas que hacen comprensible el conjunto.",
    sectionSummary: "Cada guía conecta un modelo mental claro con las decisiones que tomarás en sistemas reales.", readGuide: "Leer la guía",
  },
};

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

function renderMarkdown(body, diagrams, locale, topicSlug) {
  const lines = body.split("\n");
  const output = [];
  let paragraph = [];
  let list = [];
  const flushParagraph = () => { if (paragraph.length) { output.push(`<p>${paragraph.map(inlineMarkdown).join(" ")}</p>`); paragraph = []; } };
  const flushList = () => { if (list.length) { output.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`); list = []; } };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const diagramStart = line.match(/^:::diagram\s+id=["']([^"']+)["']\s*$/);
    if (diagramStart) {
      flushParagraph(); flushList();
      const diagramId = diagramStart[1];
      while (index + 1 < lines.length && !/^\s*:::\s*$/.test(lines[index + 1])) index += 1;
      if (index + 1 < lines.length) index += 1;
      output.push(renderDiagram(diagrams.get(diagramId), locale, topicSlug));
      continue;
    }
    if (!line.trim()) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); output.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`); continue; }
    if (line.startsWith("- ")) { flushParagraph(); list.push(line.slice(2)); continue; }
    if (line.startsWith("> ")) { flushParagraph(); flushList(); output.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`); continue; }
    paragraph.push(line);
  }
  flushParagraph(); flushList();
  return output.join("\n");
}

function routeFor(locale, slug = "") {
  return `/${locale}/${slug ? `topics/${slug}/` : ""}`;
}

function renderDiagram(diagram, locale, topicSlug) {
  const copy = diagram.locales[locale];
  const nodes = copy.nodes.map((node) => `<span class="diagram-node">${escapeHtml(node.label)}</span>`).join('<span class="diagram-arrow" aria-hidden="true">&rarr;</span>');
  const artifactPath = diagram.artifacts?.[locale] ?? diagram.artifact;
  const artifactUrl = artifactPath ? `/diagrams/${topicSlug}/${diagram.id}/${artifactPath.split("\\").join("/")}` : null;
  const visual = artifactUrl
    ? `<iframe class="diagram-frame" src="${escapeHtml(artifactUrl)}" title="${escapeHtml(copy.altText)}" loading="lazy"></iframe>`
    : `<div class="diagram-preview" role="img" aria-label="${escapeHtml(copy.altText)}">${nodes}</div>`;
  return `<figure class="diagram-card" aria-labelledby="diagram-${escapeHtml(diagram.id)}-title">
    <div class="diagram-heading"><div><p class="eyebrow">${escapeHtml(diagram.kind)} ${escapeHtml(localeCopy[locale].diagram)}</p><h3 id="diagram-${escapeHtml(diagram.id)}-title">${escapeHtml(copy.title)}</h3></div></div>
    ${visual}
    <figcaption>${escapeHtml(copy.fallback)}</figcaption>
  </figure>`;
}

function layout({ title, description, locale, route, content, topics, activeSlug = "", alternateRoutes }) {
  const copy = localeCopy[locale];
  const navigation = topics.map((topic) => `<a class="${topic.data.slug === activeSlug ? "active" : ""}" href="${routeFor(locale, topic.data.slug)}">${escapeHtml(topic.data.title)}</a>`).join("");
  const nextLocale = supportedLocales.find((candidate) => candidate !== locale) ?? locale;
  const languageSwitch = `<a class="language-switch" href="${alternateRoutes[nextLocale]}" hreflang="${nextLocale}" aria-label="${escapeHtml(copy.switchTo)}"><span class="language-option ${locale === "en" ? "active" : ""}">EN</span><span class="language-option ${locale === "es" ? "active" : ""}">ES</span></a>`;
  const homeRoute = routeFor(locale);
  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${route}">
    ${supportedLocales.map((candidate) => `<link rel="alternate" hreflang="${candidate}" href="${alternateRoutes[candidate]}">`).join("\n    ")}
    <link rel="alternate" hreflang="x-default" href="${alternateRoutes.en}">
    <title>${escapeHtml(title)} · ${escapeHtml(copy.siteName)}</title><link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main-content">${escapeHtml(copy.skip)}</a>
    <header class="site-header"><div class="shell header-inner">
      <a class="brand" href="${homeRoute}"><span class="brand-mark">SD</span><span>${escapeHtml(copy.siteName)}</span></a>
      <div class="header-actions"><nav aria-label="Primary navigation"><a class="${route === homeRoute ? "active" : ""}" href="${homeRoute}">${escapeHtml(copy.home)}</a>${navigation}</nav><nav class="language-nav" aria-label="${escapeHtml(copy.language)}">${languageSwitch}</nav></div>
    </div></header>
    <main id="main-content">${content}</main>
    <footer class="site-footer"><div class="shell"><p>${escapeHtml(copy.footerOne)}</p><p>${escapeHtml(copy.footerTwo)}</p></div></footer>
  </body>
</html>`;
}

function landingContent(topics, locale) {
  const copy = localeCopy[locale];
  const cards = topics.map((topic) => `<a class="topic-card" href="${routeFor(locale, topic.data.slug)}"><span class="eyebrow">${escapeHtml(copy.topicGuide)}</span><h2>${escapeHtml(topic.data.title)}</h2><p>${escapeHtml(topic.data.summary)}</p><span class="card-link">${escapeHtml(copy.readGuide)} <span aria-hidden="true">&rarr;</span></a>`).join("");
  return `<section class="hero shell"><div class="hero-copy"><p class="eyebrow">${escapeHtml(copy.heroEyebrow)}</p><h1>${copy.heroTitle}</h1><p class="hero-summary">${escapeHtml(copy.heroSummary)}</p><a class="button" href="#topics">${escapeHtml(copy.explore)} <span aria-hidden="true">&darr;</span></a></div><div class="hero-orbit" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit-core">01<br><small>foundations</small></div><span class="orbit-dot dot-one"></span><span class="orbit-dot dot-two"></span><span class="orbit-dot dot-three"></span></div></section><section class="section shell" id="topics"><div class="section-heading"><div><p class="eyebrow">${escapeHtml(copy.startHere)}</p><h2>${escapeHtml(copy.sectionTitle)}</h2></div><p>${escapeHtml(copy.sectionSummary)}</p></div><div class="topic-grid">${cards}</div></section>`;
}

async function writeRedirect(relativePath, destination) {
  const outputPath = path.join(dist, relativePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `<!doctype html><html lang="en"><head><meta http-equiv="refresh" content="0;url=${destination}"><link rel="canonical" href="${destination}"><title>Redirecting…</title></head><body><p>Redirecting to <a href="${destination}">${destination}</a>.</p></body></html>`);
}

async function build() {
  const pages = await validateContent();
  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(dist, { recursive: true });
  await fs.writeFile(path.join(dist, "styles.css"), await fs.readFile(path.join(root, "src", "styles.css"), "utf8"));
  const publishedPages = pages.filter((page) => page.data.status === "published");

  for (const locale of supportedLocales) {
    const localeTopics = publishedPages.filter((page) => page.data.locale === locale);
    const outputDirectory = path.join(dist, locale);
    await fs.mkdir(outputDirectory, { recursive: true });
    await fs.writeFile(path.join(outputDirectory, "index.html"), layout({ title: localeCopy[locale].home, description: localeCopy[locale].heroSummary, locale, route: routeFor(locale), alternateRoutes: Object.fromEntries(supportedLocales.map((candidate) => [candidate, routeFor(candidate)])), content: landingContent(localeTopics, locale), topics: localeTopics }));

    for (const topic of localeTopics) {
      const diagrams = new Map();
      for (const diagramId of topic.diagramIds) {
        const diagram = (await readDiagram(topic.data.slug, diagramId)).data;
        diagrams.set(diagramId, diagram);
        const artifactPaths = diagram.artifacts ?? { [locale]: diagram.artifact };
        for (const artifactPath of Object.values(artifactPaths)) {
          if (!artifactPath) continue;
          const sourcePath = path.join(root, "diagrams", topic.data.slug, diagramId, artifactPath);
          const targetPath = path.join(dist, "diagrams", topic.data.slug, diagramId, artifactPath);
          await fs.mkdir(path.dirname(targetPath), { recursive: true });
          await fs.copyFile(sourcePath, targetPath);
        }
      }
      const route = routeFor(locale, topic.data.slug);
      const topicContent = `<article class="article shell"><div class="article-header"><p class="eyebrow">${escapeHtml(localeCopy[locale].topicGuide)} · ${escapeHtml(localeCopy[locale].foundations)}</p><h1>${escapeHtml(topic.data.title)}</h1><p class="article-summary">${escapeHtml(topic.data.summary)}</p></div><div class="article-body">${renderMarkdown(topic.body, diagrams, locale, topic.data.slug)}</div></article>`;
      const topicOutputDirectory = path.join(dist, locale, "topics", topic.data.slug);
      await fs.mkdir(topicOutputDirectory, { recursive: true });
      await fs.writeFile(path.join(topicOutputDirectory, "index.html"), layout({ title: topic.data.title, description: topic.data.summary, locale, route, alternateRoutes: Object.fromEntries(supportedLocales.map((candidate) => [candidate, routeFor(candidate, topic.data.slug)])), activeSlug: topic.data.slug, content: topicContent, topics: localeTopics }));
    }
  }

  await writeRedirect("index.html", "/en/");
  for (const topic of publishedPages.filter((page) => page.data.locale === "en")) await writeRedirect(path.join("topics", topic.data.slug, "index.html"), routeFor("en", topic.data.slug));
  console.log(`Built ${supportedLocales.length} locales and ${publishedPages.length} localized topic pages in dist/.`);
}

try { await build(); } catch (error) { console.error(error.message); process.exitCode = 1; }
