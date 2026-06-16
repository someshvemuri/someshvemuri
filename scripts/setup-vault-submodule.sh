#!/bin/bash

# Setup Git Submodule for My Vault
# This script initializes the my-vault repository as a git submodule

set -e

echo "🚀 Setting up my-vault as git submodule..."

# Check if we're in the portfolio directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the portfolio root directory."
    exit 1
fi

# Check if submodule already exists
if [ -d "public/vault/.git" ] || grep -q "public/vault" .gitmodules 2>/dev/null; then
    echo "⚠️  Vault submodule already configured."
    echo "Updating submodule..."
    git submodule update --remote --merge public/vault
else
    echo "📦 Adding my-vault as submodule..."
    
    # Create public/vault directory if needed
    mkdir -p public/vault
    
    # Add the submodule
    git submodule add https://github.com/someshvemuri/my-vault.git public/vault
    
    echo "✅ Submodule added!"
fi

# Generate vault manifest
echo "📚 Generating vault manifest..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review changes: git status"
echo "2. Commit the changes: git add . && git commit -m 'Add my-vault as submodule'"
echo "3. Push to GitHub: git push origin main"
echo ""
echo "To keep vault in sync:"
echo "- GitHub Actions will automatically sync daily"
echo "- Or manually run: git submodule update --remote --merge public/vault"
