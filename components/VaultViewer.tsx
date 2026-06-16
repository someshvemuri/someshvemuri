'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

interface VaultFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  tags?: string[];
  links?: string[];
  isExcalidraw?: boolean;
}

interface VaultViewerProps {
  file: VaultFile;
}

export default function VaultViewer({ file }: VaultViewerProps) {
  const handleWikiLink = (linkText: string) => {
    // TODO: Implement wiki link navigation
    console.log('Wiki link clicked:', linkText);
  };

  const processContent = (content: string) => {
    // Convert wiki links [[Note Name]] to markdown links
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
      return `[${linkText}](/${linkText.replace(/\s+/g, '-').toLowerCase()})`;
    });
  };

  if (!file.content) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No content available</p>
        </div>
      </div>
    );
  }

  // Check if it's an Excalidraw file
  if (file.path.endsWith('.excalidraw')) {
    return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-300 mb-4">
            <ImageIcon className="w-5 h-5" />
            <p className="text-sm">Excalidraw Diagram</p>
          </div>
          <p className="text-slate-400 text-sm">
            Excalidraw files are stored in your vault. Open the file directly to edit or view interactive diagrams.
          </p>
          <p className="text-slate-500 text-xs mt-4 font-mono">{file.path}</p>
        </div>
      </div>
    );
  }

  // Check if it's an image file
  if (file.path.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex items-center justify-center min-h-[400px]">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={`/vault/${file.path}`} className="max-w-full max-h-full rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto prose prose-invert prose-sm max-w-none">
      <style>{`
        .prose {
          color: rgb(226 232 240);
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: rgb(226 232 240);
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .prose h1 {
          font-size: 2em;
          border-bottom: 1px solid rgb(51 65 85);
          padding-bottom: 0.3em;
        }
        .prose h2 {
          font-size: 1.5em;
          border-bottom: 1px solid rgb(51 65 85);
          padding-bottom: 0.2em;
        }
        .prose code {
          background-color: rgb(30 41 59);
          border: 1px solid rgb(51 65 85);
          border-radius: 0.25em;
          padding: 0.2em 0.4em;
          color: rgb(165 243 252);
          font-size: 0.9em;
        }
        .prose pre {
          background-color: rgb(15 23 42);
          border: 1px solid rgb(51 65 85);
          border-radius: 0.5em;
          padding: 1em;
          overflow-x: auto;
        }
        .prose blockquote {
          border-left: 4px solid rgb(6 182 212);
          color: rgb(148 163 184);
          padding-left: 1em;
        }
        .prose a {
          color: rgb(6 182 212);
          text-decoration: underline;
        }
        .prose a:hover {
          color: rgb(34 211 238);
        }
        .prose ul, .prose ol {
          color: rgb(203 213 225);
        }
        .prose li {
          margin: 0.5em 0;
        }
        .prose table {
          border-collapse: collapse;
          width: 100%;
        }
        .prose th {
          background-color: rgb(30 41 59);
          border: 1px solid rgb(51 65 85);
          padding: 0.5em;
          text-align: left;
        }
        .prose td {
          border: 1px solid rgb(51 65 85);
          padding: 0.5em;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              {children}
              {href?.startsWith('http') && <ExternalLink className="w-3 h-3 inline ml-1" />}
            </a>
          ),
        }}
      >
        {processContent(file.content)}
      </ReactMarkdown>
    </div>
  );
}
