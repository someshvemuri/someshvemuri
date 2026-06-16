'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';

interface VaultContentProps {
  content: string;
  wikiLinkMap?: Record<string, string>;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Resolve [[wiki links]] to /vault/my-vault/ paths
// Resolve ![[image.png]] Obsidian embeds to <img> tags
function processObsidianSyntax(content: string, wikiLinkMap: Record<string, string> = {}) {
  // Image embeds first: ![[filename.png]]
  let processed = content.replace(/!\[\[([^\]]+)\]\]/g, (_, src) => {
    const cleanSrc = src.trim();
    // If it's an image file, resolve to /vault/Images/ path
    if (cleanSrc.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
      return `![${cleanSrc}](/vault/Images/${encodeURIComponent(cleanSrc)})`;
    }
    // Otherwise treat as a wiki link embed
    const href = '/vault/my-vault/' + cleanSrc.replace(/\s+/g, '-');
    return `[${cleanSrc}](${href})`;
  });
  // Wiki links: [[Note Name]] or [[Note Name|alias]]
  processed = processed.replace(/\[\[([^\]]+)\]\]/g, (_, linkText) => {
    const [target, alias] = linkText.split('|');
    const targetTrimmed = target.trim();
    const display = alias?.trim() || targetTrimmed;
    // Try to resolve to actual path via wikiLinkMap
    const resolved = wikiLinkMap[targetTrimmed.toLowerCase()];
    const href = resolved
      ? `/vault/my-vault/${resolved}`
      : `/vault/my-vault/${targetTrimmed.replace(/\s+/g, '-')}`;
    return `[${display}](${href})`;
  });
  return processed;
}

export default function VaultContent({ content, wikiLinkMap }: VaultContentProps) {
  const processed = processObsidianSyntax(content, wikiLinkMap);

  return (
    <div className="vault-content max-w-none">
      <style>{`
        .vault-content { color: #c9d1d9; font-size: 0.9375rem; line-height: 1.75; }
        .vault-content h1 { font-size: 1.75rem; font-weight: 600; color: #e6edf3; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #21262d; }
        .vault-content h2 { font-size: 1.35rem; font-weight: 600; color: #e6edf3; margin: 1.75rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid #21262d; }
        .vault-content h3 { font-size: 1.1rem; font-weight: 600; color: #e6edf3; margin: 1.5rem 0 0.5rem; }
        .vault-content h4, .vault-content h5, .vault-content h6 { font-weight: 600; color: #e6edf3; margin: 1rem 0 0.5rem; }
        .vault-content p { margin: 0.75rem 0; }
        .vault-content a { color: #58a6ff; text-decoration: none; }
        .vault-content a:hover { text-decoration: underline; }
        .vault-content code { background: #161b22; border: 1px solid #30363d; border-radius: 4px; padding: 0.15em 0.4em; font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; font-size: 0.85em; color: #ff7b72; }
        .vault-content pre { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 1.25rem; overflow-x: auto; margin: 1.25rem 0; }
        .vault-content pre code { background: none; border: none; padding: 0; color: #c9d1d9; font-size: 0.875rem; }
        .vault-content blockquote { border-left: 3px solid #388bfd; padding-left: 1rem; color: #8b949e; margin: 1rem 0; background: #161b22; border-radius: 0 6px 6px 0; padding: 0.75rem 1rem; }
        .vault-content ul, .vault-content ol { padding-left: 1.5rem; margin: 0.75rem 0; }
        .vault-content li { margin: 0.4rem 0; }
        .vault-content li > ul, .vault-content li > ol { margin: 0.25rem 0; }
        .vault-content table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.875rem; }
        .vault-content th { background: #161b22; border: 1px solid #30363d; padding: 0.6rem 0.8rem; text-align: left; color: #e6edf3; font-weight: 600; }
        .vault-content td { border: 1px solid #30363d; padding: 0.6rem 0.8rem; }
        .vault-content tr:nth-child(even) td { background: #0d1117; }
        .vault-content img { max-width: 100%; border-radius: 8px; border: 1px solid #30363d; margin: 1rem 0; }
        .vault-content hr { border: none; border-top: 1px solid #21262d; margin: 2rem 0; }
        .vault-content input[type="checkbox"] { margin-right: 0.5rem; }
      `}</style>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const text = String(children);
            return <h1 id={slugify(text)}>{children}</h1>;
          },
          h2: ({ children }) => {
            const text = String(children);
            return <h2 id={slugify(text)}>{children}</h2>;
          },
          h3: ({ children }) => {
            const text = String(children);
            return <h3 id={slugify(text)}>{children}</h3>;
          },
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
                {children}
                {isExternal && <ExternalLink className="inline w-3 h-3 ml-1 opacity-60" />}
              </a>
            );
          },
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
