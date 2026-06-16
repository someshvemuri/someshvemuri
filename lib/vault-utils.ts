import fs from 'fs';
import path from 'path';

export interface VaultFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  tags?: string[];
  links?: string[];
  isExcalidraw?: boolean;
}

export interface VaultManifest {
  version: number;
  timestamp: string;
  files: VaultFile[];
}

export interface Heading {
  level: number;
  text: string;
  slug: string;
}

export function loadVaultManifest(): VaultManifest {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'vault-manifest.json');
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { version: 1, timestamp: new Date().toISOString(), files: [] };
  }
}

export function getFileBySlug(files: VaultFile[], slug: string[]): VaultFile | null {
  const targetPath = slug.join('/');
  return files.find((f) => f.path === targetPath) ?? null;
}

export function slugToPath(slug: string[]): string {
  return slug.join('/');
}

export function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    headings.push({ level, text, slug });
  }

  return headings;
}

export function buildBreadcrumb(slug: string[]): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [{ label: 'vault', href: '/vault' }];

  slug.forEach((part, i) => {
    crumbs.push({
      label: part.replace(/-/g, ' ').replace(/_/g, ' '),
      href: '/vault/' + slug.slice(0, i + 1).join('/'),
    });
  });

  return crumbs;
}

export function getAllVaultPaths(files: VaultFile[]): string[][] {
  return files
    .filter((f) => f.type === 'file')
    .map((f) => f.path.split('/'));
}
