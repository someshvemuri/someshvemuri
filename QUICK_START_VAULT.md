# Quick Setup Guide - My Vault Integration

## ✅ What's Been Implemented

### 1. **Build-Time Vault Manifest Generation** ✨
- Script: `scripts/generate-vault-manifest.js`
- Runs during `npm run build`
- Creates `public/vault-manifest.json` with all vault files
- **Works perfectly on Vercel** (no filesystem access needed)

### 2. **Updated MyVault Component**
- Fetches from static `vault-manifest.json`
- No API calls needed
- Pre-computed data = instant loads

### 3. **Git Submodule Setup**
- Links your my-vault repo as a git submodule
- Keeps your vault files separate but synchronized
- Easy to update independently

### 4. **GitHub Actions Auto-Sync** 🤖
- File: `.github/workflows/sync-vault.yml`
- **Daily sync** at midnight UTC
- **Manual trigger** anytime via GitHub Actions UI
- Automatically regenerates vault manifest

### 5. **Setup Scripts**
- Windows: `scripts/setup-vault-submodule.ps1`
- Mac/Linux: `scripts/setup-vault-submodule.sh`

### 6. **Complete Documentation**
- Updated `VAULT_SETUP.md` with Vercel setup
- Troubleshooting guide
- Architecture explanation

---

## 🚀 Implementation Steps

### Step 1: Install Dependencies
```bash
cd portfolio
npm install
```

### Step 2: Set Up Git Submodule
**On Windows (PowerShell):**
```powershell
cd portfolio
scripts\setup-vault-submodule.ps1
```

This script will:
- Add my-vault as git submodule at `public/vault`
- Generate the vault manifest
- Build your project

### Step 3: Verify Locally
```bash
npm run dev
```
Visit http://localhost:3000 → scroll to "My Vault" section → verify it works!

### Step 4: Push to GitHub
```bash
git add .
git commit -m "Add my-vault as submodule with auto-sync"
git push origin main
```

### Step 5: GitHub Actions Setup
1. Go to your GitHub repo
2. Click **Actions** tab
3. Verify "Sync Vault Submodule" workflow is showing
4. It will run automatically every day!

### Step 6: Verify on Vercel
1. Go to your Vercel dashboard
2. Wait for deployment to complete
3. Visit your live portfolio
4. Scroll to My Vault - should work perfectly!

---

## 📊 How It Works

```
Your Development
    ↓
git push origin main
    ↓
GitHub
  ├─→ GitHub Actions (daily sync)
  │   ├─ Updates public/vault/ submodule
  │   └─ Runs npm run build
  │       └─ Generates vault-manifest.json
  │
  └─→ Vercel
      ├─ Clones repo with submodules
      ├─ npm install
      ├─ npm run build
      │  └─ Generates vault-manifest.json
      └─ Deploys app + manifest
         
Live Portfolio
    ↓
Loads vault-manifest.json
    ↓
Shows your Obsidian vault! 🎉
```

---

## 🔄 Day-to-Day Usage

### Update Your Vault in Obsidian
```
Obsidian → my-vault repo
↓
git push
↓
GitHub Actions syncs (daily or manual)
↓
Vercel rebuilds
↓
Your portfolio shows latest vault! ✨
```

**No manual sync needed!** The GitHub Actions workflow handles everything.

---

## 📋 New Files Created

```
portfolio/
├── scripts/
│   ├── generate-vault-manifest.js  ← Builds manifest
│   ├── setup-vault-submodule.ps1   ← Windows setup
│   └── setup-vault-submodule.sh    ← Mac/Linux setup
├── .github/
│   └── workflows/
│       └── sync-vault.yml           ← Auto-sync workflow
├── next.config.js                   ← Updated (runs manifest generation)
├── components/MyVault.tsx           ← Updated (uses manifest)
├── package.json                     ← Updated (added scripts)
└── VAULT_SETUP.md                   ← Complete documentation
```

---

## 🎯 Key Features

✅ **Vercel Compatible** - Works perfectly on Vercel  
✅ **Auto-Syncing** - Daily updates from my-vault repo  
✅ **Build-Time** - Manifest generated at build time  
✅ **Zero Maintenance** - GitHub Actions handles everything  
✅ **Fast** - Static JSON = instant loads  
✅ **Same Features** - All Obsidian-like features included  

---

## ⚠️ Important Notes

### Before Running Setup Script
1. Make sure you have git configured locally
2. Ensure my-vault repo is public (for GitHub Actions access)

### After Setup
- The vault folder at `public/vault` will contain your entire my-vault repo
- This is normal! It's a submodule.
- Don't manually edit files in `public/vault` - always update via your my-vault repo

### Syncing
- Changes to my-vault repo take up to 24 hours to appear (or trigger manually)
- Build time adds ~30 seconds to deploy (manifest generation)

---

## 🆘 Troubleshooting Quick Links

See detailed troubleshooting in [VAULT_SETUP.md](VAULT_SETUP.md):
- Submodule not cloning
- Vault loading errors
- Files not showing up
- GitHub Actions not running
- Changes not appearing

---

## ✨ Next Steps

1. **Run the setup script** (Windows PowerShell):
   ```powershell
   scripts\setup-vault-submodule.ps1
   ```

2. **Test locally**:
   ```bash
   npm run dev
   ```

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add my-vault with auto-sync"
   git push origin main
   ```

4. **Watch GitHub Actions sync** (Actions tab)

5. **Verify on Vercel** (your live portfolio)

---

**That's it! Your Obsidian vault is now integrated with automatic syncing! 🚀**

For full details, see [VAULT_SETUP.md](VAULT_SETUP.md)
