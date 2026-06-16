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
    <aside className="w-48 flex-shrink-0 h-screen sticky top-0 overflow-y-auto hidden xl:block bg-[#1a1a1a]">
      <div className="p-5 pt-8">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-4 font-mono">ON THIS PAGE</p>
        <nav className="space-y-0.5">
          {headings.map((h) => (
            <a
              key={h.slug}
              href={`#${h.slug}`}
              className={`block text-xs font-mono transition-colors leading-relaxed py-0.5 ${
                activeSlug === h.slug
                  ? 'text-[#e0e0e0] font-semibold'
                  : 'text-[#666] hover:text-[#aaa]'
              }`}
              style={{ paddingLeft: h.level === 1 ? 0 : h.level === 2 ? '0' : '10px' }}
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
