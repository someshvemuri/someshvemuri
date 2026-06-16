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
        .vault-content { color: #d4d4d4; font-size: 1rem; line-height: 1.85; font-family: 'Courier New', 'Courier', monospace; max-width: 720px; }
        .vault-content h1 { font-size: 1.5rem; font-weight: 700; color: #f0f0f0; margin: 2.5rem 0 1rem; letter-spacing: -0.01em; }
        .vault-content h2 { font-size: 1.2rem; font-weight: 600; color: #e8e8e8; margin: 2rem 0 0.6rem; }
        .vault-content h3 { font-size: 1.05rem; font-weight: 600; color: #e0e0e0; margin: 1.5rem 0 0.5rem; }
        .vault-content h4, .vault-content h5, .vault-content h6 { font-weight: 600; color: #e0e0e0; margin: 1.2rem 0 0.4rem; }
        .vault-content p { margin: 0.9rem 0; color: #d4d4d4; }
        .vault-content a { color: #79b8ff; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.15s; }
        .vault-content a:hover { border-bottom-color: #79b8ff; }
        .vault-content code { background: #2a2a2a; border-radius: 3px; padding: 0.15em 0.45em; font-family: 'Courier New', monospace; font-size: 0.875em; color: #e2a0a0; }
        .vault-content pre { background: #1e1e1e; border-left: 3px solid #444; border-radius: 0; padding: 1.25rem 1.5rem; overflow-x: auto; margin: 1.5rem 0; }
        .vault-content pre code { background: none; padding: 0; color: #d4d4d4; font-size: 0.875rem; }
        .vault-content blockquote { border-left: 3px solid #555; padding: 0.5rem 1rem; color: #999; margin: 1.2rem 0; font-style: italic; }
        .vault-content ul, .vault-content ol { padding-left: 1.5rem; margin: 0.75rem 0; }
        .vault-content li { margin: 0.35rem 0; color: #d4d4d4; }
        .vault-content li > ul, .vault-content li > ol { margin: 0.2rem 0; }
        .vault-content table { border-collapse: collapse; width: 100%; margin: 1.2rem 0; font-size: 0.9rem; }
        .vault-content th { background: #222; border: 1px solid #333; padding: 0.5rem 0.8rem; text-align: left; color: #e8e8e8; font-weight: 600; }
        .vault-content td { border: 1px solid #333; padding: 0.5rem 0.8rem; color: #d4d4d4; }
        .vault-content tr:nth-child(even) td { background: #1e1e1e; }
        .vault-content img { max-width: 100%; border-radius: 4px; margin: 1.2rem 0; }
        .vault-content hr { border: none; border-top: 1px solid #333; margin: 2rem 0; }
        .vault-content input[type="checkbox"] { margin-right: 0.5rem; accent-color: #79b8ff; }
        .vault-content strong { color: #f0f0f0; }
        .vault-content em { color: #c0c0c0; }
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
