import { redirect } from 'next/navigation';

export default function VaultHomePage() {
  // Namespace vault app routes to avoid collisions with public/vault static files.
  // The catch-all route handles /vault/my-vault and redirects to the first note.
  redirect('/vault/my-vault');
}
