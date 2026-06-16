import { notFound } from 'next/navigation';
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
  return getAllVaultPaths(manifest.files).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const manifest = loadVaultManifest();
  const file = getFileBySlug(manifest.files, params.slug);
  return {
    title: file ? `${file.name} — Somesh's Vault` : "Somesh's Vault",
  };
}

export default function VaultFilePage({ params }: PageProps) {
  const manifest = loadVaultManifest();
  const file = getFileBySlug(manifest.files, params.slug);

  if (!file) notFound();

  const breadcrumbs = buildBreadcrumb(params.slug);

  // Folder view: list children
  if (file.type === 'folder') {
    const children = manifest.files.filter((f) => {
      const parts = f.path.split('/');
      const parent = parts.slice(0, -1).join('/');
      return parent === file.path;
    });

    return (
      <div className="flex">
        <main className="flex-1 min-w-0 max-w-4xl px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-[#8b949e] mb-8 flex-wrap">
            <Link href="/vault" className="hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            {breadcrumbs.slice(1).map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5" />
                {i === breadcrumbs.length - 2 ? (
                  <span className="text-[#e6edf3]">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white transition-colors capitalize">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-2xl font-semibold text-[#e6edf3] mb-6">{file.name}</h1>
          <div className="grid gap-3">
            {children.map((child) => (
              <Link
                key={child.path}
                href={`/vault/${child.path}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-[#21262d] hover:border-[#388bfd] hover:bg-[#161b22] transition-all text-[#8b949e] hover:text-white"
              >
                <span className="capitalize font-medium">{child.name}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
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
        <main className="flex-1 min-w-0 px-8 py-10 overflow-hidden">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-[#8b949e] mb-8 flex-wrap">
            <Link href="/vault" className="hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            {breadcrumbs.slice(1).map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5" />
                {i === breadcrumbs.length - 2 ? (
                  <span className="text-[#e6edf3] capitalize">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white transition-colors capitalize">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Title + badge */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-[#e6edf3]">{file.name}</h1>
            <span className="text-xs bg-[#161b22] border border-[#30363d] text-[#8b949e] px-2 py-0.5 rounded-full">
              Excalidraw
            </span>
          </div>
          <p className="text-sm text-[#8b949e] mb-8">
            Interactive diagram — open in Obsidian to view the drawing. Text elements extracted below.
          </p>

          {/* Text elements from the diagram */}
          {file.content ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 text-[#c9d1d9] text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {file.content}
            </div>
          ) : (
            <div className="border border-[#21262d] rounded-xl p-8 bg-[#161b22] text-center text-[#8b949e]">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
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
      <main className="flex-1 min-w-0 px-8 py-10 overflow-hidden">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[#8b949e] mb-8 flex-wrap">
          <Link href="/vault" className="hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          {breadcrumbs.slice(1).map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5" />
              {i === breadcrumbs.length - 2 ? (
                <span className="text-[#e6edf3] capitalize">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-white transition-colors capitalize">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Tags */}
        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {file.tags.map((tag) => (
              <span key={tag} className="text-xs bg-[#161b22] border border-[#30363d] text-[#58a6ff] px-2.5 py-1 rounded-full">
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
