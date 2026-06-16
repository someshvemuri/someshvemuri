import { redirect } from 'next/navigation';
import { loadVaultManifest } from '@/lib/vault-utils';

export default function VaultHomePage() {
  const manifest = loadVaultManifest();

  // Redirect to README if it exists
  const readme = manifest.files.find(
    (f) => f.type === 'file' && (f.path === 'README.md' || f.name.toLowerCase() === 'readme'),
  );

  if (readme) {
    redirect(`/vault/${readme.path}`);
  }

  // Otherwise show first file
  const firstFile = manifest.files.find((f) => f.type === 'file');
  if (firstFile) {
    redirect(`/vault/${firstFile.path}`);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center text-[#8b949e]">
        <p className="text-lg font-medium">Vault is empty</p>
        <p className="text-sm mt-2">Add markdown files to <code className="bg-[#161b22] px-2 py-1 rounded">public/vault</code> and rebuild.</p>
      </div>
    </div>
  );
}
