'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, FileText, Folder, FolderOpen, BookOpen } from 'lucide-react';
import type { VaultFile } from '@/lib/vault-utils';

interface VaultSidebarProps {
  files: VaultFile[];
}

export default function VaultSidebar({ files }: VaultSidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // Auto-expand folders that contain the current path
    const current = pathname.replace('/vault/', '').replace('/vault', '');
    const parts = current.split('/');
    const initialExpanded = new Set<string>();
    parts.forEach((_, i) => {
      if (i < parts.length - 1) {
        initialExpanded.add(parts.slice(0, i + 1).join('/'));
      }
    });
    return initialExpanded;
  });

  const toggleFolder = (folderPath: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const getChildren = (parentPath: string) =>
    files.filter((f) => {
      const parts = f.path.split('/');
      const parent = parts.slice(0, -1).join('/');
      // Hide raw image files from the tree
      if (f.path.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) return false;
      return parent === parentPath;
    });

  const isActive = (filePath: string) => {
    const currentSlug = pathname.replace('/vault/', '').replace('/vault', '');
    return currentSlug === filePath;
  };

  const renderNode = (file: VaultFile, depth = 0) => {
    const isExpanded = expanded.has(file.path);
    const active = isActive(file.path);
    const children = file.type === 'folder' ? getChildren(file.path) : [];

    return (
      <div key={file.path}>
        {file.type === 'folder' ? (
          <button
            onClick={() => toggleFolder(file.path)}
            className="w-full flex items-center gap-1.5 px-3 py-1.5 text-sm text-left transition-colors hover:text-white text-[#8b949e]"
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            <ChevronRight
              className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
            />
            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-[#e3b341]" />
            ) : (
              <Folder className="w-3.5 h-3.5 flex-shrink-0 text-[#e3b341]" />
            )}
            <span className="truncate font-medium">{file.name}</span>
          </button>
        ) : (
          <Link
            href={`/vault/${file.path}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
              active
                ? 'text-white bg-[#1f6feb]/20 border-r-2 border-[#1f6feb]'
                : 'text-[#8b949e] hover:text-white hover:bg-white/5'
            }`}
            style={{ paddingLeft: `${depth * 12 + 24}px` }}
          >
            <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-[#58a6ff]' : 'text-[#8b949e]'}`} />
            <span className="truncate">{file.name}</span>
          </Link>
        )}

        {file.type === 'folder' && isExpanded && children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  const rootItems = files.filter(
    (f) => !f.path.includes('/') && f.path !== 'Images',
  );

  return (
    <aside className="w-60 flex-shrink-0 h-screen sticky top-0 overflow-y-auto bg-[#0d1117] border-r border-[#21262d] flex flex-col">
      {/* Logo / Title */}
      <div className="p-4 border-b border-[#21262d]">
        <Link href="/vault" className="flex items-center gap-2 text-white font-semibold hover:opacity-80">
          <BookOpen className="w-5 h-5 text-[#58a6ff]" />
          <span>Somesh&apos;s Vault</span>
        </Link>
      </div>

      {/* Back to portfolio */}
      <div className="px-3 pt-3">
        <Link
          href="/"
          className="text-xs text-[#8b949e] hover:text-white flex items-center gap-1 px-2 py-1 rounded transition-colors hover:bg-white/5"
        >
          &larr; Back to Portfolio
        </Link>
      </div>

      {/* File tree */}
      <nav className="flex-1 pt-4 pb-8">
        <p className="px-4 pb-2 text-xs font-semibold text-[#8b949e] uppercase tracking-widest">Content</p>
        {rootItems.map((file) => renderNode(file))}
      </nav>
    </aside>
  );
}
