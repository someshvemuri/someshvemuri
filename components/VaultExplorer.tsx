'use client';

import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';

interface VaultFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  tags?: string[];
  links?: string[];
  isExcalidraw?: boolean;
}

interface VaultExplorerProps {
  files: VaultFile[];
  selectedFile: VaultFile | null;
  expandedFolders: Set<string>;
  onSelectFile: (file: VaultFile) => void;
  onToggleFolder: (path: string) => void;
}

export default function VaultExplorer({
  files,
  selectedFile,
  expandedFolders,
  onSelectFile,
  onToggleFolder,
}: VaultExplorerProps) {
  // Build tree structure
  const getChildren = (parentPath: string): VaultFile[] => {
    return files.filter((file) => {
      const parts = file.path.split('/');
      const fileDirPath = parts.slice(0, -1).join('/');
      return fileDirPath === parentPath;
    });
  };

  const renderNode = (file: VaultFile, depth: number = 0) => {
    const isExpanded = expandedFolders.has(file.path);
    const isSelected = selectedFile?.path === file.path;
    const children = file.type === 'folder' ? getChildren(file.path) : [];

    return (
      <div key={file.path}>
        <div
          onClick={() => {
            if (file.type === 'folder') {
              onToggleFolder(file.path);
            } else {
              onSelectFile(file);
            }
          }}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-sm ${
            isSelected
              ? 'bg-sky-600/20 text-sky-400 border-l-2 border-sky-400'
              : 'text-slate-300 hover:bg-slate-800/50'
          }`}
          style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
        >
          {file.type === 'folder' ? (
            <>
              <ChevronRight
                className={`w-4 h-4 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 flex-shrink-0 text-yellow-500" />
              ) : (
                <Folder className="w-4 h-4 flex-shrink-0 text-yellow-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 flex-shrink-0 text-sky-400" />
            </>
          )}
          <span className="truncate">{file.name}</span>
        </div>

        {/* Render children if folder is expanded */}
        {file.type === 'folder' && isExpanded && children.length > 0 && (
          <div>
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get root level files
  const rootFiles = files.filter((file) => !file.path.includes('/'));

  return (
    <div className="p-2">
      {rootFiles.length === 0 ? (
        <p className="text-xs text-slate-500 p-4">No files found</p>
      ) : (
        rootFiles.map((file) => renderNode(file))
      )}
    </div>
  );
}
