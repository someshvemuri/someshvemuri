'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/vault-utils';

interface VaultTOCProps {
  headings: Heading[];
}

export default function VaultTOC({ headings }: VaultTOCProps) {
  const [activeSlug, setActiveSlug] = useState<string>(headings[0]?.slug ?? '');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-10% 0% -80% 0%' },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="w-52 flex-shrink-0 h-screen sticky top-0 overflow-y-auto hidden xl:block">
      <div className="p-6">
        <p className="text-xs font-semibold text-[#8b949e] uppercase tracking-widest mb-4">On This Page</p>
        <nav className="space-y-1">
          {headings.map((h) => (
            <a
              key={h.slug}
              href={`#${h.slug}`}
              className={`block text-sm transition-colors leading-snug py-0.5 ${
                activeSlug === h.slug
                  ? 'text-[#58a6ff] font-medium'
                  : 'text-[#8b949e] hover:text-[#c9d1d9]'
              }`}
              style={{ paddingLeft: h.level === 1 ? 0 : h.level === 2 ? '0' : '12px' }}
              onClick={() => setActiveSlug(h.slug)}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
