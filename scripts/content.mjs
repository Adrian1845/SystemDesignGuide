import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const supportedLocales = ["en", "es"];

export function parseFrontmatter(source, filePath) {
  if (!source.startsWith("---\n")) {
    throw new Error(`${filePath}: frontmatter must start with ---`);
  }

  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error(`${filePath}: frontmatter must close with ---`);
  }

  const frontmatter = {};
  for (const line of source.slice(4, end).split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      frontmatter[key] = rawValue.slice(1, -1).split(",").map((value) => value.trim()).filter(Boolean);
    } else {
      frontmatter[key] = rawValue.replace(/^['"]|['"]$/g, "");
    }
  }

  return {
    data: frontmatter,
    body: source.slice(end + 4).trim(),
  };
}

export function extractDiagramIds(body) {
  return [...body.matchAll(/:::diagram\s+id=["']([^"']+)["']\s*\n?\s*:::/g)].map((match) => match[1]);
}

export async function readTopics() {
  const topicsRoot = path.join(root, "content", "topics");
  let topicDirectories = [];
  try {
    topicDirectories = await fs.readdir(topicsRoot, { withFileTypes: true });
  } catch {
    return [];
  }

  const topics = [];
  for (const entry of topicDirectories) {
    if (!entry.isDirectory()) continue;
    const files = await fs.readdir(path.join(topicsRoot, entry.name));
    for (const fileName of files.filter((name) => /^\w+\.mdx$/.test(name))) {
      const locale = path.basename(fileName, ".mdx");
      const filePath = path.join(topicsRoot, entry.name, fileName);
      const source = await fs.readFile(filePath, "utf8");
      const parsed = parseFrontmatter(source, filePath);
      topics.push({
        directory: entry.name,
        fileName,
        filePath,
        locale,
        ...parsed,
        diagramIds: extractDiagramIds(parsed.body),
      });
    }
  }
  return topics;
}

export async function readDiagram(topicSlug, diagramId) {
  const filePath = path.join(root, "diagrams", topicSlug, diagramId, "diagram.json");
  const source = await fs.readFile(filePath, "utf8");
  return { filePath, data: JSON.parse(source) };
}

export function relativeUrl(fromRoute, target) {
  if (target.startsWith("/")) return target;
  return new URL(target, `https://system-design-guide.local${fromRoute}`).pathname;
}
