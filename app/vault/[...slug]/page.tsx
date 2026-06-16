import { notFound, redirect } from 'next/navigation';
import { Home, ChevronRight, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { loadVaultManifest, getFileBySlug, extractHeadings, buildBreadcrumb, getAllVaultPaths, buildWikiLinkMap } from '@/lib/vault-utils';
import VaultContent from '@/components/vault/VaultContent';
import VaultTOC from '@/components/vault/VaultTOC';

interface PageProps {
  params: { slug: string[] };
}

export async function generateStaticParams() {
  const manifest = loadVaultManifest();
  return getAllVaultPaths(manifest.files).map((slug) => ({ slug: ['my-vault', ...slug] }));
}

export async function generateMetadata({ params }: PageProps) {
  const manifest = loadVaultManifest();
  const normalizedSlug = params.slug[0] === 'my-vault' ? params.slug.slice(1) : params.slug;
  const file = getFileBySlug(manifest.files, normalizedSlug);
  return {
    title: file ? `${file.name} — Somesh's Vault` : "Somesh's Vault",
  };
}

export default function VaultFilePage({ params }: PageProps) {
  const manifest = loadVaultManifest();
  const normalizedSlug = params.slug[0] === 'my-vault' ? params.slug.slice(1) : params.slug;

  if (normalizedSlug.length === 0) {
    const firstNote = manifest.files.find(
      (f) => f.type === 'file' && f.path.endsWith('.md') && !f.path.startsWith('Images/'),
    );
    if (firstNote) {
      redirect(`/vault/my-vault/${firstNote.path}`);
    }
    const firstFile = manifest.files.find((f) => f.type === 'file');
    if (firstFile) {
      redirect(`/vault/my-vault/${firstFile.path}`);
    }
    notFound();
  }

  const file = getFileBySlug(manifest.files, normalizedSlug);

  if (!file) notFound();

  const breadcrumbs = buildBreadcrumb(normalizedSlug);

  // Shared breadcrumb component
  const Breadcrumb = () => (
    <nav className="flex items-center gap-1.5 text-xs text-[#555] mb-8 flex-wrap font-mono">
      <Link href="/vault/my-vault" className="hover:text-[#aaa] transition-colors">
        <Home className="w-3 h-3 inline" />
      </Link>
      {breadcrumbs.slice(1).map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 opacity-40" />
          {i === breadcrumbs.length - 2 ? (
            <span className="text-[#aaa] capitalize">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-[#aaa] transition-colors capitalize">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );

  // Folder view: list children
  if (file.type === 'folder') {
    const children = manifest.files.filter((f) => {
      const parts = f.path.split('/');
      const parent = parts.slice(0, -1).join('/');
      return parent === file.path;
    });

    return (
      <div className="flex">
        <main className="flex-1 min-w-0 max-w-3xl px-10 py-10 font-mono">
          <Breadcrumb />
          <h1 className="text-xl font-semibold text-[#e0e0e0] mb-6">{file.name}</h1>
          <div className="grid gap-1">
            {children.map((child) => (
              <Link
                key={child.path}
                href={`/vault/my-vault/${child.path}`}
                className="flex items-center py-2 px-3 text-sm text-[#888] hover:text-[#d4d4d4] hover:bg-[#242424] rounded transition-all"
              >
                <span className="capitalize">{child.name}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Excalidraw file
  if (file.isExcalidraw) {
    const excalidrawHeadings = extractHeadings(file.content ?? '');
    return (
      <div className="flex">
        <main className="flex-1 min-w-0 px-10 py-10 overflow-hidden font-mono">
          <Breadcrumb />
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-semibold text-[#e0e0e0]">{file.name}</h1>
            <span className="text-xs text-[#555] border border-[#333] px-2 py-0.5 rounded">Excalidraw</span>
          </div>
          <p className="text-xs text-[#555] mb-8">
            Interactive diagram — open in Obsidian to view the drawing. Text elements below.
          </p>
          {file.content ? (
            <pre className="bg-[#1e1e1e] border-l-2 border-[#444] p-5 text-[#d4d4d4] text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
              {file.content}
            </pre>
          ) : (
            <div className="p-8 text-center text-[#555] border border-[#2a2a2a] rounded">
              <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No text elements found in this diagram.</p>
            </div>
          )}
        </main>
        <VaultTOC headings={excalidrawHeadings} />
      </div>
    );
  }

  // Markdown file
  const headings = extractHeadings(file.content ?? '');
  const wikiLinkMap = buildWikiLinkMap(manifest.files);

  return (
    <div className="flex">
      {/* Main Content */}
      <main className="flex-1 min-w-0 px-10 py-10 overflow-hidden">
        <Breadcrumb />

        {/* Tags */}
        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {file.tags.map((tag) => (
              <span key={tag} className="text-xs text-[#666] border border-[#333] px-2.5 py-0.5 rounded font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Markdown content */}
        <VaultContent content={file.content ?? ''} wikiLinkMap={wikiLinkMap} />
      </main>

      {/* TOC */}
      <VaultTOC headings={headings} />
    </div>
  );
}
