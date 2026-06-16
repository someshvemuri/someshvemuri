/**
 * Generate Vault Manifest
 * 
 * This script runs during build time to read all vault files
 * and create a static manifest JSON file that can be served by Vercel.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const VAULT_DIR = path.join(process.cwd(), 'public', 'vault');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'vault-manifest.json');

function extractWikiLinks(content) {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function extractTags(frontmatter) {
  if (Array.isArray(frontmatter.tags)) {
    return frontmatter.tags;
  }
  if (typeof frontmatter.tags === 'string') {
    return frontmatter.tags.split(',').map(tag => tag.trim());
  }
  return [];
}

function readVaultFilesRecursive(dir, baseDir = '') {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.warn(`Vault directory not found: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip hidden files and common non-vault directories
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '__pycache__') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      files.push({
        path: relativePath,
        name: entry.name,
        type: 'folder',
      });

      // Recursively read subdirectories
      files.push(...readVaultFilesRecursive(fullPath, relativePath));
    } else if (
      entry.name.endsWith('.md') ||
      entry.name.endsWith('.excalidraw') ||
      entry.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)
    ) {
      let isExcalidraw = entry.name.endsWith('.excalidraw');
      let content = '';
      let tags = [];
      let links = [];

      if (entry.name.endsWith('.md')) {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
          const { data, content: mdContent } = matter(fileContent);
          tags = extractTags(data);

          // Detect Obsidian Excalidraw plugin .md files by frontmatter
          const isExcalidrawPlugin =
            data['excalidraw-plugin'] != null ||
            (Array.isArray(data.tags) && data.tags.includes('excalidraw'));

          if (isExcalidrawPlugin) {
            isExcalidraw = true;
            // Extract only the Text Elements section — strip element ID markers like ^Vcd44HRk
            const textMatch = mdContent.match(/##\s*Text Elements\s*\n([\s\S]*?)(?:\n##|\n# |$)/);
            content = textMatch
              ? textMatch[1].replace(/\^[A-Za-z0-9]{8,}\s*/g, '').trim()
              : '';
          } else {
            content = mdContent;
            links = extractWikiLinks(content);
          }
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error.message);
        }
      }

      files.push({
        path: relativePath,
        name: entry.name.replace(/\.(md|excalidraw)$/, ''),
        type: 'file',
        content,
        tags,
        links,
        isExcalidraw,
      });
    }
  }

  return files;
}

function generateVaultManifest() {
  try {
    console.log('📚 Generating vault manifest...');
    
    const vaultFiles = readVaultFilesRecursive(VAULT_DIR);
    
    if (vaultFiles.length === 0) {
      console.warn('⚠️  No vault files found. Creating empty manifest.');
    } else {
      console.log(`✅ Found ${vaultFiles.length} vault items`);
    }

    const manifest = {
      version: 1,
      timestamp: new Date().toISOString(),
      files: vaultFiles,
    };

    // Create public directory if it doesn't exist
    const publicDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    console.log(`✅ Vault manifest generated: ${OUTPUT_FILE}`);
    
    return manifest;
  } catch (error) {
    console.error('❌ Error generating vault manifest:', error);
    // Create empty manifest on error so build doesn't fail
    const emptyManifest = {
      version: 1,
      timestamp: new Date().toISOString(),
      files: [],
    };
    const publicDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(emptyManifest, null, 2));
    return emptyManifest;
  }
}

// Run if called directly
if (require.main === module) {
  generateVaultManifest();
}

module.exports = { generateVaultManifest };
