import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import type { Sidebar } from "vocs";

interface FileEntry {
  name: string;
  isDirectory: boolean;
  path: string;
}

function formatTitle(filename: string): string {
  // Remove extension and convert kebab-case to Title Case
  return basename(filename, extname(filename))
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function pathToLink(path: string): string {
  // Convert file path to documentation link
  return `/docs/${path.split("/pages/docs/")[1].replace(/\.(mdx?|tsx?)$/, "")}`;
}

async function processDirectory(entry: FileEntry): Promise<any> {
  const contents = await readdir(entry.path, { withFileTypes: true });
  const items = await Promise.all(
    contents
      .filter((item) => !item.name.startsWith("."))
      .map(async (item) => {
        const path = join(entry.path, item.name);
        if (item.isDirectory()) {
          return {
            text: formatTitle(item.name),
            collapsed: true,
            items: await processDirectory({ name: item.name, isDirectory: true, path }),
          };
        }
        return {
          text: formatTitle(item.name),
          link: pathToLink(path),
        };
      }),
  );
  return items;
}

async function generateSidebarConfig(tree: FileEntry[]): Promise<Sidebar> {
  const sections = await Promise.all(
    tree
      .filter((entry) => !entry.name.startsWith("."))
      .map(async (entry) => {
        if (entry.isDirectory) {
          return {
            text: formatTitle(entry.name),
            collapsed: true,
            items: await processDirectory(entry),
          };
        }
        return {
          text: formatTitle(entry.name),
          link: pathToLink(entry.path),
        };
      }),
  );

  return {
    "/docs/": sections,
  } as const satisfies Sidebar;
}

async function main() {
  const docsPath = join(process.cwd(), "pages/docs");
  const tree = await getDocumentationTree(docsPath);
  const sidebarConfig = await generateSidebarConfig(tree);
  await updateSidebarFile(sidebarConfig);
}

main().catch(console.error);

async function getDocumentationTree(path: string): Promise<FileEntry[]> {
  const entries = await readdir(path, { withFileTypes: true });
  return entries
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      path: join(path, entry.name),
    }));
}

async function updateSidebarFile(sidebarConfig: Sidebar) {
  const sidebarPath = join(process.cwd(), "sidebar.ts");
  const content = `import type { Sidebar } from "vocs";\n\nexport const sidebar = ${JSON.stringify(sidebarConfig, null, 2)} as const satisfies Sidebar;\n`;
  await writeFile(sidebarPath, content);
}
