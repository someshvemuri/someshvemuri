# Setup Git Submodule for My Vault
# This script initializes the my-vault repository as a git submodule

Write-Host "🚀 Setting up my-vault as git submodule..." -ForegroundColor Cyan

# Check if we're in the portfolio directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the portfolio root directory." -ForegroundColor Red
    exit 1
}

# Check if submodule already exists
$submoduleExists = (Test-Path "public/vault/.git") -or ((git config --file .gitmodules --get-regexp path) -match "public/vault")

if ($submoduleExists) {
    Write-Host "⚠️  Vault submodule already configured." -ForegroundColor Yellow
    Write-Host "Updating submodule..." -ForegroundColor Yellow
    git submodule update --remote --merge public/vault
}
else {
    Write-Host "📦 Adding my-vault as submodule..." -ForegroundColor Cyan
    
    # Create public/vault directory if needed
    if (-not (Test-Path "public/vault")) {
        New-Item -ItemType Directory -Path "public/vault" -Force | Out-Null
    }
    
    # Add the submodule
    git submodule add https://github.com/someshvemuri/my-vault.git public/vault
    
    Write-Host "✅ Submodule added!" -ForegroundColor Green
}

# Generate vault manifest
Write-Host "📚 Generating vault manifest..." -ForegroundColor Cyan
npm run build

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review changes: git status"
Write-Host "2. Commit the changes: git add . && git commit -m 'Add my-vault as submodule'"
Write-Host "3. Push to GitHub: git push origin main"
Write-Host ""
Write-Host "To keep vault in sync:" -ForegroundColor Cyan
Write-Host "- GitHub Actions will automatically sync daily"
Write-Host "- Or manually run: git submodule update --remote --merge public/vault"
