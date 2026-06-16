import { loadVaultFiles } from '@/lib/vault-loader';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const vaultFiles = await loadVaultFiles();
    return NextResponse.json(vaultFiles);
  } catch (error) {
    console.error('Error loading vault files:', error);
    return NextResponse.json({ error: 'Failed to load vault files' }, { status: 500 });
  }
}
