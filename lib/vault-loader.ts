import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface VaultFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  tags?: string[];
  links?: string[];
  isExcalidraw?: boolean;
}

const VAULT_DIR = path.join(process.cwd(), 'public', 'vault');

function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function extractTags(frontmatter: Record<string, unknown>): string[] {
  if (Array.isArray(frontmatter.tags)) {
    return frontmatter.tags as string[];
  }
  return [];
}

function readVaultFilesRecursive(dir: string, baseDir: string = ''): VaultFile[] {
  const files: VaultFile[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files and common non-vault directories
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      files.push({
        path: relativePath,
        name: entry.name,
        type: 'folder',
      });

      // Recursively read subdirectories
      files.push(...readVaultFilesRecursive(fullPath, relativePath));
    } else if (
      entry.name.endsWith('.md') ||
      entry.name.endsWith('.excalidraw') ||
      entry.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)
    ) {
      const isExcalidraw = entry.name.endsWith('.excalidraw');
      let content = '';
      let tags: string[] = [];
      let links: string[] = [];

      if (entry.name.endsWith('.md')) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data, content: mdContent } = matter(fileContent);
        content = mdContent;
        tags = extractTags(data);
        links = extractWikiLinks(content);
      }

      files.push({
        path: relativePath,
        name: entry.name.replace(/\.(md|excalidraw)$/, ''),
        type: 'file',
        content,
        tags,
        links,
        isExcalidraw,
      });
    }
  }

  return files;
}

export async function loadVaultFiles(): Promise<VaultFile[]> {
  try {
    return readVaultFilesRecursive(VAULT_DIR);
  } catch (error) {
    console.error('Error loading vault files:', error);
    return [];
  }
}

export function searchVault(files: VaultFile[], query: string): VaultFile[] {
  const lowerQuery = query.toLowerCase();

  return files.filter(
    (file) =>
      file.name.toLowerCase().includes(lowerQuery) ||
      file.path.toLowerCase().includes(lowerQuery) ||
      file.content?.toLowerCase().includes(lowerQuery),
  );
}

export function getFileTags(files: VaultFile[]): string[] {
  const tags = new Set<string>();

  for (const file of files) {
    file.tags?.forEach((tag) => tags.add(tag));
  }

  return Array.from(tags).sort();
}

export function filterByTag(files: VaultFile[], tag: string): VaultFile[] {
  return files.filter((file) => file.tags?.includes(tag));
}
