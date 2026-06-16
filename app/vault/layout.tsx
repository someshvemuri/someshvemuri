import type { Metadata } from 'next';
import { loadVaultManifest } from '@/lib/vault-utils';
import VaultSidebar from '@/components/vault/VaultSidebar';

export const metadata: Metadata = {
  title: "Somesh's Vault",
  description: 'My personal knowledge management system - notes, diagrams, and learnings.',
};

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  const manifest = loadVaultManifest();

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <VaultSidebar files={manifest.files} />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
