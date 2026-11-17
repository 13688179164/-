#!/bin/sh
set -eu

export NPM_CONFIG_REGISTRY='https://registry.npmjs.org/'
npm ci --include=dev --registry='https://registry.npmjs.org/'
npm run build
npm prune --omit=dev

mkdir -p dist/server
cp run.sh dist/run.sh
cp server/index.mjs dist/server/index.mjs
cp package.json package-lock.json dist/
cp -R node_modules dist/node_modules
chmod 755 dist/run.sh
