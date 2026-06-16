# My Vault Integration Guide

This guide explains how to integrate your Obsidian vault into your portfolio as an Obsidian-like viewer with **automatic syncing** and **Vercel deployment support**.

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd portfolio
npm install
```

### 2. Add Vault as Git Submodule

Navigate to your portfolio directory and run the setup script:

**Windows (PowerShell):**
```powershell
scripts\setup-vault-submodule.ps1
```

**Mac/Linux (Bash):**
```bash
bash scripts/setup-vault-submodule.sh
```

This will:
- ✅ Add my-vault as a git submodule at `public/vault`
- ✅ Generate the vault manifest
- ✅ Build your portfolio

### 3. Commit and Push

```bash
git add .
git commit -m "Add my-vault as submodule with auto-sync"
git push origin main
```

### 4. Verify on Vercel

Your portfolio will automatically deploy. The vault manifest is generated during build time, so Vercel will create it without filesystem access issues.

---

## How It Works

### Architecture

```
Your my-vault repo (GitHub)
    ↓ (submodule)
portfolio/public/vault/ (git submodule)
    ↓ (build time)
Vault Manifest Generation (scripts/generate-vault-manifest.js)
    ↓
public/vault-manifest.json (static JSON)
    ↓ (deployed to Vercel)
Frontend MyVault Component (fetches static JSON)
    ↓
Browser displays your vault 🎉
```

### Automatic Syncing

GitHub Actions automatically:
- **Daily:** Syncs your vault from my-vault repo
- **Manual:** Trigger anytime via GitHub Actions UI
- **On Vercel:** Rebuilds with the latest vault content

No manual intervention needed! 🤖

### Vercel Deployment

Vercel automatically:

1. **Clones your repository** (including the submodule)
2. **Runs `npm install`** 
3. **Runs `npm run build`** which:
   - Generates `vault-manifest.json` from `public/vault`
   - Builds your Next.js app
4. **Deploys** the built app with the vault manifest

**No special configuration needed!** ✅

### GitHub Actions Auto-Sync

Once you push your changes, GitHub Actions will:

- **Every day at midnight UTC**: Check for updates in my-vault
- **Merge new changes** into your portfolio
- **Regenerate manifest** automatically
- **Deploy to Vercel** with the latest vault

To trigger sync manually:
1. Go to your portfolio repo on GitHub
2. Click **Actions** tab
3. Select **Sync Vault Submodule**
4. Click **Run workflow**

## Features

### ✅ Implemented Features

1. **File Explorer**
   - Hierarchical folder structure
   - File type icons
   - Expandable/collapsible folders
   - Click to view files

2. **Markdown Rendering**
   - Full markdown support (headings, bold, italic, lists, etc.)
   - Code blocks with syntax highlighting
   - Tables
   - Links (internal and external)

3. **Wiki Links**
   - Convert `[[Note Name]]` to clickable links
   - Automatically link to other notes

4. **Search Functionality**
   - Real-time search across note titles and content
   - Filter by tags

5. **Tags System**
   - Extract tags from frontmatter (YAML)
   - Filter notes by tags
   - Display tags on notes

6. **Obsidian-like Styling**
   - Dark theme matching Obsidian
   - Slate color palette
   - Syntax highlighting for code blocks
   - Responsive design

7. **Excalidraw Support**
   - Recognize `.excalidraw` files
   - Display as diagram files

8. **Image Support**
   - Display PNG, JPG, GIF, WebP, SVG images
   - Auto-linked from vault

9. **Automatic Syncing**
   - Daily updates from your my-vault repo
   - No manual intervention needed
   - GitHub Actions handles everything

## Adding Frontmatter to Your Notes

To add tags and metadata to your notes, use YAML frontmatter:

```markdown
---
tags: [learning, programming, python]
date: 2024-01-15
---

# My Note Title

Content goes here...
```

Supported frontmatter fields:
- `tags` (array) - Used for filtering and organization

## File Organization Tips

Organize your vault for best results:

```
public/vault/
├── README.md (entry point)
├── Inbox/ (new ideas)
├── Notes/ (reference material)
│   ├── Concepts/
│   ├── Learning/
│   └── ...
├── Projects/ (project-specific)
├── Excalidraw/ (diagrams)
├── Attachments/ (images, files)
│   └── images/
│   └── pdfs/
└── Archive/ (older content)
```

---

## Advanced Customization

### Styling

Edit markdown rendering in [components/VaultViewer.tsx](components/VaultViewer.tsx) to customize:
- Font sizes
- Colors  
- Code block appearance
- Table styling

### Adding Features

Potential enhancements:
- [ ] Back-linking (what links to this note?)
- [ ] Graph view (visualize connections)
- [ ] Full-text search with Fuse.js
- [ ] Dark/Light theme toggle
- [ ] Breadcrumb navigation
- [ ] Keyboard shortcuts
- [ ] Export notes as PDF
- [ ] Last modified dates

### Modify Sync Schedule

Edit `.github/workflows/sync-vault.yml`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
    # or
    - cron: '0 12 * * 1'   # Every Monday at noon
```

[Cron syntax reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#schedule)

---

## Troubleshooting

### Submodule Not Cloning

**Problem:** When you clone your portfolio, the vault folder is empty.

**Solution:**
```bash
# After cloning
git submodule update --init --recursive
```

Or clone with submodules from the start:
```bash
git clone --recurse-submodules https://github.com/someshvemuri/portfolio.git
```

### "Vault Loading Error" / Empty Manifest

**Problem:** The vault-manifest.json file is not found or empty.

**Solutions:**
1. Run the build: `npm run build`
2. Verify vault files exist: `ls -la public/vault/` (or `Get-ChildItem public/vault -Recurse` on Windows)
3. Check for errors: Look at the build output logs
4. Regenerate manifest: `npm run generate-vault`

### Vault Files Not Showing Up

**Problems & Solutions:**
1. **Files not found in explorer**
   - Verify files have `.md` or `.excalidraw` extensions
   - Check folder structure: `tree public/vault/`
   - Ensure no leading underscores or dots (except extensions)

2. **Markdown content not rendering**
   - Run `npm run build` after changing files
   - Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Check that frontmatter is valid YAML

3. **Tags not appearing**
   - Add tags to your markdown frontmatter:
     ```yaml
     ---
     tags: [tag1, tag2]
     ---
     ```
   - Run `npm run build` to regenerate manifest

### GitHub Actions Not Running

**Problem:** Sync workflow hasn't run yet.

**Solutions:**
1. Check Actions tab in GitHub for errors
2. Verify .github/workflows/sync-vault.yml exists
3. Manually trigger: Go to Actions → Sync Vault Submodule → Run workflow
4. Check if submodule URL is correct in .gitmodules

### Changes Not Appearing After Sync

**Problem:** You updated your my-vault repo but changes aren't showing.

**Solutions:**
1. Check GitHub Actions completed successfully
2. Vercel deployed the new build (check Vercel dashboard)
3. Hard refresh your browser
4. Try manually syncing:
   ```bash
   git submodule update --remote --merge public/vault
   npm run build
   git add .
   git commit -m "Manual vault sync"
   git push
   ```

### Styling Issues

1. Clear build cache: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Hard refresh browser (Ctrl+Shift+R)

---

## API Reference

### Vault Manifest Format

The generated `vault-manifest.json` has this structure:

```json
{
  "version": 1,
  "timestamp": "2026-06-16T12:00:00Z",
  "files": [
    {
      "path": "Notes/Learning.md",
      "name": "Learning",
      "type": "file",
      "content": "# Learning\n\n...",
      "tags": ["learning", "programming"],
      "links": ["[[Other Note]]"],
      "isExcalidraw": false
    },
    {
      "path": "Excalidraw",
      "name": "Excalidraw",
      "type": "folder"
    }
  ]
}
```

### Building Manifest Manually

```bash
npm run generate-vault
```

---

## Performance Notes

- **Build time:** 1-2 seconds for typical vaults (100+ notes)
- **Load time:** Instant (static JSON)
- **Search:** Real-time with React useMemo optimization
- **Large vaults (1000+ notes):** May need pagination or lazy loading

---

## Local Development vs Production

**Local (npm run dev):**
- Reads from `public/vault` on the fly
- Changes visible after hard refresh
- May be slower with large vaults

**Production (npm run build → npm run start):**
- Uses pre-built `vault-manifest.json`
- Faster performance
- Must rebuild after vault changes

---

## Next Steps Checklist

- [ ] ✅ Install dependencies: `npm install`
- [ ] ✅ Run setup script: `scripts/setup-vault-submodule.ps1`
- [ ] ✅ Verify vault shows locally: `npm run dev`
- [ ] ✅ Commit changes: `git add . && git commit -m "Add vault submodule"`
- [ ] ✅ Push to GitHub: `git push origin main`
- [ ] ✅ Check GitHub Actions for sync workflow
- [ ] ✅ Visit Vercel deployment and verify vault appears
- [ ] ✅ Update your my-vault repo and watch it auto-sync!

---

Enjoy your integrated Obsidian vault! 🧠✨
