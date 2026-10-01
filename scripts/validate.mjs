import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDiagram, readTopics, root, supportedLocales } from "./content.mjs";

const requiredFields = ["title", "slug", "summary", "status", "locale", "translationOf"];
const validStatuses = new Set(["draft", "published"]);
const validDiagramKinds = new Set(["architecture", "workflow", "sequence", "data-flow", "lifecycle"]);

function fail(message) {
  throw new Error(`Validation failed: ${message}`);
}

function validateLinks(body, topicSlugs, locale, filePath) {
  for (const match of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const href = match[1];
    if (!href.startsWith("/")) continue;
    const parts = href.split("/").filter(Boolean);
    const slug = parts[0] === "en" || parts[0] === "es" ? parts[2] : parts[1];
    if (parts[0] === "topics" || parts[1] === "topics") {
      if (!topicSlugs.has(slug)) fail(`${filePath}: link points to unknown topic '${slug}'`);
      if (parts[0] === "en" || parts[0] === "es") {
        if (parts[0] !== locale) fail(`${filePath}: internal link must preserve locale '${locale}'`);
      }
    }
  }
}

async function validateDiagram(topic, diagramId) {
  let diagram;
  try {
    diagram = await readDiagram(topic.data.slug, diagramId);
  } catch (error) {
    fail(`${topic.filePath}: diagram '${diagramId}' is missing or invalid (${error.message})`);
  }

  const { data } = diagram;
  for (const field of ["id", "kind", "artifact", "locales", "edges"]) {
    if (!(field in data)) fail(`${diagram.filePath}: missing '${field}'`);
  }
  if (data.id !== diagramId) fail(`${diagram.filePath}: id must match '${diagramId}'`);
  if (!validDiagramKinds.has(data.kind)) fail(`${diagram.filePath}: unsupported diagram kind '${data.kind}'`);
  if (!Array.isArray(data.edges)) fail(`${diagram.filePath}: edges must be an array`);
  const artifacts = data.artifacts ?? (typeof data.artifact === "string" ? Object.fromEntries(supportedLocales.map((locale) => [locale, data.artifact])) : null);
  if (artifacts !== null) {
    if (typeof artifacts !== "object") fail(`${diagram.filePath}: artifacts must be an object`);
    for (const locale of supportedLocales) {
      const artifactPath = artifacts[locale];
      if (typeof artifactPath !== "string" || !artifactPath) fail(`${diagram.filePath}: missing '${locale}' artifact path`);
      if (path.isAbsolute(artifactPath) || artifactPath.split(/[\\/]/).includes("..")) fail(`${diagram.filePath}: '${locale}' artifact path must stay inside its diagram folder`);
      const artifactFilePath = path.join(root, "diagrams", topic.data.slug, diagramId, artifactPath);
      try {
        await fs.access(artifactFilePath);
      } catch {
        fail(`${diagram.filePath}: '${locale}' artifact does not exist at '${artifactPath}'`);
      }
    }
  }
  for (const locale of supportedLocales) {
    const copy = data.locales[locale];
    if (!copy) fail(`${diagram.filePath}: missing '${locale}' copy`);
    for (const field of ["title", "altText", "fallback", "nodes"]) {
      if (!(field in copy)) fail(`${diagram.filePath}: missing '${locale}.${field}'`);
    }
    if (!Array.isArray(copy.nodes) || copy.nodes.length === 0) fail(`${diagram.filePath}: ${locale}.nodes must be a non-empty array`);
  }
}

export async function validateContent() {
  const topics = await readTopics();
  if (topics.length === 0) fail("no topic packages found");

  const topicSlugs = new Set();
  const localeKeys = new Set();
  for (const topic of topics) {
    for (const field of requiredFields) {
      if (!topic.data[field]) fail(`${topic.filePath}: missing '${field}'`);
    }
    if (topic.directory !== topic.data.slug) fail(`${topic.filePath}: slug must match its topic directory`);
    if (!validStatuses.has(topic.data.status)) fail(`${topic.filePath}: status must be draft or published`);
    if (topic.locale !== topic.data.locale) fail(`${topic.filePath}: filename locale must match frontmatter locale`);
    if (!supportedLocales.includes(topic.data.locale)) fail(`${topic.filePath}: unsupported locale '${topic.data.locale}'`);
    if (topic.data.translationOf !== topic.data.slug) fail(`${topic.filePath}: translationOf must match slug`);
    const localeKey = `${topic.data.slug}:${topic.data.locale}`;
    if (localeKeys.has(localeKey)) fail(`${topic.filePath}: duplicate locale '${topic.data.locale}' for '${topic.data.slug}'`);
    localeKeys.add(localeKey);
    topicSlugs.add(topic.data.slug);
  }

  for (const slug of topicSlugs) {
    const translations = topics.filter((topic) => topic.data.slug === slug);
    for (const locale of supportedLocales) {
      const translation = translations.find((topic) => topic.data.locale === locale);
      if (!translation) fail(`topic '${slug}' is missing '${locale}' translation`);
      if (translation.data.status !== "published") fail(`${translation.filePath}: both locale pages must be published together`);
    }
  }

  for (const topic of topics) {
    validateLinks(topic.body, topicSlugs, topic.data.locale, topic.filePath);
    for (const diagramId of topic.diagramIds) await validateDiagram(topic, diagramId);
  }

  return topics;
}

if (process.argv[1] && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])) {
  try {
    const topics = await validateContent();
    console.log(`Validated ${new Set(topics.map((topic) => topic.data.slug)).size} topic package${new Set(topics.map((topic) => topic.data.slug)).size === 1 ? "" : "s"} across ${topics.length} localized document${topics.length === 1 ? "" : "s"}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
