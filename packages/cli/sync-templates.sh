#!/bin/bash

# Sync common files from vanilla to react template

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VANILLA_DIR="$SCRIPT_DIR/template-vanilla"
REACT_DIR="$SCRIPT_DIR/template-react"

echo "🔄 Syncing common files from vanilla to react template..."

# Sync experiences directory, but exclude all React-specific files/folders
# This preserves any file or folder with "react" in its name (case-insensitive)
rsync -av --delete \
    --exclude '*react*' \
    --exclude '*React*' \
    "$VANILLA_DIR/src/experiences/" "$REACT_DIR/src/experiences/"

# Sync public directory completely
rsync -av --delete "$VANILLA_DIR/public/" "$REACT_DIR/public/"

# Sync config files
cp "$VANILLA_DIR/.prettierrc" "$REACT_DIR/.prettierrc"
cp "$VANILLA_DIR/eslint.config.js" "$REACT_DIR/eslint.config.js"
cp "$VANILLA_DIR/.prettierignore" "$REACT_DIR/.prettierignore"

# Sync only the version from vanilla package.json to react package.json
VANILLA_VERSION=$(grep '"version":' "$VANILLA_DIR/package.json" | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
if [ -n "$VANILLA_VERSION" ]; then
    sed -i '' "s/\"version\": \".*\"/\"version\": \"$VANILLA_VERSION\"/" "$REACT_DIR/package.json"
    echo "📦 Synced version $VANILLA_VERSION to react template"
fi

echo "✅ Sync complete!"
