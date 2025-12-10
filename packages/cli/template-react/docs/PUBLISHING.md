# 📦 Publishing Guide

## First Publish

```bash
npm login
cd packages/cli
npm run build
npm publish --access public
```

## Updates

```bash
cd packages/cli
npm version patch  # or minor/major
npm publish --access public
```

## Version Types

- `patch` → 1.0.0 → 1.0.1 (bug fixes)
- `minor` → 1.0.0 → 1.1.0 (new features)
- `major` → 1.0.0 → 2.0.0 (breaking changes)

## Test Before Publishing

```bash
npm pack --dry-run
```
