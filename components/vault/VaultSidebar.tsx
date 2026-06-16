'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { VaultFile } from '@/lib/vault-utils';

interface VaultSidebarProps {
  files: VaultFile[];
}

export default function VaultSidebar({ files }: VaultSidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // Auto-expand folders that contain the current path
    const current = pathname
      .replace('/vault/my-vault/', '')
      .replace('/vault/my-vault', '')
      .replace('/vault/', '')
      .replace('/vault', '');
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
    const currentSlug = pathname
      .replace('/vault/my-vault/', '')
      .replace('/vault/my-vault', '')
      .replace('/vault/', '')
      .replace('/vault', '');
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
            className="w-full flex items-center gap-1 py-1 text-sm text-left transition-colors text-[#999] hover:text-[#e0e0e0]"
            style={{ paddingLeft: `${depth * 14 + 16}px` }}
          >
            <ChevronRight
              className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 opacity-60 ${isExpanded ? 'rotate-90' : ''}`}
            />
            <span className="truncate font-medium">{file.name}</span>
          </button>
        ) : (
          <Link
            href={`/vault/my-vault/${file.path}`}
            className={`flex items-center py-1 text-sm transition-colors ${
              active
                ? 'text-[#f0f0f0] font-medium bg-[#2a2a2a]'
                : 'text-[#888] hover:text-[#d4d4d4]'
            }`}
            style={{ paddingLeft: `${depth * 14 + 28}px` }}
          >
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
    <aside className="w-52 flex-shrink-0 h-screen sticky top-0 overflow-y-auto bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col font-mono">
      {/* Logo / Title */}
      <div className="px-4 py-4 border-b border-[#2a2a2a]">
        <Link href="/vault/my-vault" className="text-[#e0e0e0] font-semibold text-sm hover:text-white transition-colors">
          Somesh&apos;s Vault
        </Link>
      </div>

      {/* Back to portfolio */}
      <div className="px-4 pt-3 pb-1">
        <Link
          href="/"
          className="text-xs text-[#666] hover:text-[#aaa] transition-colors"
        >
          &larr; portfolio
        </Link>
      </div>

      {/* File tree */}
      <nav className="flex-1 pt-3 pb-8">
        <p className="px-4 pb-2 text-xs text-[#555] uppercase tracking-widest">CONTENT</p>
        {rootItems.map((file) => renderNode(file))}
      </nav>
    </aside>
  );
}
