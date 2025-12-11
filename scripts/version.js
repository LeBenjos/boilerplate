#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const versionType = process.argv[2];

if (!['patch', 'minor', 'major'].includes(versionType)) {
    console.error('❌ Usage: npm run version <patch|minor|major>');
    process.exit(1);
}

function updateVersion(version, type) {
    const parts = version.split('.').map(Number);
    switch (type) {
        case 'major':
            parts[0]++;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1]++;
            parts[2] = 0;
            break;
        case 'patch':
            parts[2]++;
            break;
    }
    return parts.join('.');
}

function updatePackageVersion(filePath, newVersion) {
    const content = JSON.parse(readFileSync(filePath, 'utf-8'));
    content.version = newVersion;
    writeFileSync(filePath, JSON.stringify(content, null, 4) + '\n');
}

function runCommand(command, cwd) {
    console.log(`📦 Running: ${command} in ${cwd}`);
    execSync(command, { cwd, stdio: 'inherit' });
}

try {
    // 1. Lire la version actuelle à la racine
    const rootPackagePath = join(ROOT_DIR, 'package.json');
    const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf-8'));
    const currentVersion = rootPackage.version;
    const newVersion = updateVersion(currentVersion, versionType);

    console.log(`\n🚀 Mise à jour de la version: ${currentVersion} → ${newVersion}\n`);

    // 2. Mettre à jour la version à la racine
    console.log('📝 Mise à jour du package.json racine...');
    updatePackageVersion(rootPackagePath, newVersion);

    // 3. npm install à la racine
    console.log('\n📦 Installation des dépendances à la racine...');
    runCommand('npm install', ROOT_DIR);

    // 4. Mettre à jour packages/create-boilerplate/package.json
    const createBoilerplatePath = join(ROOT_DIR, 'packages/create-boilerplate/package.json');
    console.log('\n📝 Mise à jour de packages/create-boilerplate/package.json...');
    updatePackageVersion(createBoilerplatePath, newVersion);

    // 5. npm install dans packages/create-boilerplate
    console.log('\n📦 Installation des dépendances dans packages/create-boilerplate...');
    runCommand('npm install', join(ROOT_DIR, 'packages/create-boilerplate'));

    // 6. Mettre à jour template-react
    const templateReactPath = join(ROOT_DIR, 'packages/create-boilerplate/template-react/package.json');
    console.log('\n📝 Mise à jour de template-react/package.json...');
    updatePackageVersion(templateReactPath, newVersion);

    // 7. npm install dans template-react
    console.log('\n📦 Installation des dépendances dans template-react...');
    runCommand('npm install', join(ROOT_DIR, 'packages/create-boilerplate/template-react'));

    // 8. Mettre à jour template-vanilla
    const templateVanillaPath = join(ROOT_DIR, 'packages/create-boilerplate/template-vanilla/package.json');
    console.log('\n📝 Mise à jour de template-vanilla/package.json...');
    updatePackageVersion(templateVanillaPath, newVersion);

    // 9. npm install dans template-vanilla
    console.log('\n📦 Installation des dépendances dans template-vanilla...');
    runCommand('npm install', join(ROOT_DIR, 'packages/create-boilerplate/template-vanilla'));

    console.log(`\n✅ Toutes les versions ont été mises à jour vers ${newVersion} !`);
    console.log('\n💡 N\'oubliez pas de commit et push vos changements.');

} catch (error) {
    console.error('\n❌ Erreur lors de la mise à jour des versions:', error.message);
    process.exit(1);
}
