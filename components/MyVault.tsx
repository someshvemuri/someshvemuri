'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Folder, FileText, Tag, Loader } from 'lucide-react';
import VaultExplorer from './VaultExplorer';
import VaultViewer from './VaultViewer';

interface VaultFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  tags?: string[];
  links?: string[];
  isExcalidraw?: boolean;
}

export default function MyVault() {
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load vault files from static manifest
  useEffect(() => {
    const loadVault = async () => {
      try {
        setLoading(true);
        const response = await fetch('/vault-manifest.json');
        if (!response.ok) {
          throw new Error('Failed to load vault manifest');
        }
        const data = await response.json();
        setVaultFiles(data.files || []);
        setError(null);
      } catch (err) {
        console.error('Error loading vault:', err);
        setError('Failed to load vault files. Make sure to run `npm run build` to generate the vault manifest.');
        setVaultFiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadVault();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    vaultFiles.forEach((file) => {
      file.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [vaultFiles]);

  const filteredFiles = useMemo(() => {
    return vaultFiles.filter((file) => {
      const matchesSearch =
        !searchQuery ||
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.content?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !selectedTag || file.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [vaultFiles, searchQuery, selectedTag]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <section id="my-vault" className="py-20 px-4 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4 text-white">My Vault</h2>
          <p className="text-slate-400 mb-8">A digital second brain - my personal knowledge management system</p>
          <div className="w-20 h-1 bg-gradient-to-r from-slate-900 to-sky-500 rounded-full mb-12" />
        </motion.div>

        {error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-300 mb-6">
            <p className="font-semibold">⚠️ Vault Loading Error</p>
            <p className="text-sm mt-2">{error}</p>
            <p className="text-xs text-red-400 mt-3">
              Run <code className="bg-slate-800 px-2 py-1">npm run build</code> to generate the vault manifest from your vault files.
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
          {/* Left Sidebar - Explorer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-slate-900 rounded-lg border border-slate-800 flex flex-col h-[600px] overflow-hidden"
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-white pl-10 pr-3 py-2 rounded border border-slate-700 focus:border-sky-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="p-4 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-400 mb-2">TAGS</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        selectedTag === tag
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* File Explorer */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="w-6 h-6 text-slate-400 animate-spin" />
                </div>
              ) : vaultFiles.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">
                  <p>No vault files found</p>
                  <p className="text-xs text-slate-600 mt-2">Add your vault to public/vault directory</p>
                </div>
              ) : (
                <VaultExplorer
                  files={filteredFiles}
                  selectedFile={selectedFile}
                  expandedFolders={expandedFolders}
                  onSelectFile={setSelectedFile}
                  onToggleFolder={toggleFolder}
                />
              )}
            </div>
          </motion.div>

          {/* Right Side - Viewer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col h-[600px]"
          >
            {selectedFile ? (
              <>
                {/* File Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedFile.type === 'file' ? (
                        <FileText className="w-5 h-5 text-sky-400" />
                      ) : (
                        <Folder className="w-5 h-5 text-sky-400" />
                      )}
                      <div>
                        <h3 className="font-semibold text-white">{selectedFile.name}</h3>
                        <p className="text-xs text-slate-400">{selectedFile.path}</p>
                      </div>
                    </div>
                    {selectedFile.tags && selectedFile.tags.length > 0 && (
                      <div className="flex gap-2">
                        {selectedFile.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <VaultViewer file={selectedFile} />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{loading ? 'Loading vault...' : 'Select a note to view'}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
