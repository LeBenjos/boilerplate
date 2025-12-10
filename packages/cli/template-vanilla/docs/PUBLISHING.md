# 📦 Publishing Guide

## Workflow Overview

**Develop at root** → **Sync templates** → **Git push** → **npm publish**

## Complete Workflow

```bash
# 1. Sync root to vanilla template (if common files modified)
rsync -av --exclude='node_modules' --exclude='.git' --exclude='packages' --exclude='improvements.md' ./ packages/cli/template-vanilla/

# 2. Sync vanilla to react (common files only)
cd packages/cli
npm run sync

# 3. Git commit and push
cd ../..
git add .
git commit -m "Update boilerplate"
git push

# 4. Publish to npm
cd packages/cli
npm version patch  # or minor/major
npm publish --access public
```

## What to Edit Where

### Common Files (edit at root)

- `src/experiences/` - Three.js code
- `public/` - Assets
- Config files (tsconfig, eslint, prettier)

### React-Specific Files (edit in template-react)

- `src/main.tsx`
- `src/App.tsx`
- `package.json`
- `vite.config.ts`
- `index.html`

## Version Types

- `patch` → 1.0.0 → 1.0.1 (bug fixes)
- `minor` → 1.0.0 → 1.1.0 (new features)
- `major` → 1.0.0 → 2.0.0 (breaking changes)

## First Publish

```bash
npm login
cd packages/cli
npm publish --access public
```
