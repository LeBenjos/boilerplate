# 📦 Publishing Guide

## Development Workflow

**Update Version:**
```bash
cd $(git rev-parse --show-toplevel)
npm run version patch # patch: (1.0.x) / minor: (1.x.0) / major: (x.0.0)
```

**Develop Vanilla:**
```bash
cd packages/create-boilerplate/template-vanilla
npm install
npm run dev
```

**Develop React:**
```bash
cd packages/create-boilerplate/template-react
npm install
npm run dev
```

**Publish to npm:**
```bash
npm login
cd packages/create-boilerplate
npm publish --access public
```
