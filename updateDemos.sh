#!/usr/bin/env bash
set -euo pipefail

cp -f ../Mascot/index.html static/gallery.html
cp -r -f ../Mascot/demos/*.json static/demos/
cp -r -f ../Mascot/demos/static/*.js static/demos/static/
cp -r -f ../Mascot/demos/interactive/*.js static/demos/interactive/
cp -r -f ../Mascot/demos/img/*.png static/demos/img/
cp -r -f ../Mascot/demos/thumbnails/*.png static/demos/thumbnails/
cp -f ../Mascot/datasets/csv/*.csv static/datasets/csv/
cp -f ../Mascot/datasets/graphjson/*.json static/datasets/graphjson/
cp -f ../Mascot/datasets/treejson/*.json static/datasets/treejson/
cp -f ../Mascot/lib/*.js static/lib/
cp -f ../Mascot/js/*.js static/js/

# --- dist/*.js: pulled from the published npm package (not a local Mascot
#     build), since dist/ is gitignored in Mascot and a local build can drift
#     from what's actually published. This guarantees static/dist always
#     matches the live npm release exactly. ---
TMP_DIR="$(mktemp -d)"
npm pack mascot-vis@latest --pack-destination "$TMP_DIR" --silent
tar -xzf "$TMP_DIR"/mascot-vis-*.tgz -C "$TMP_DIR"
cp -f "$TMP_DIR"/package/dist/*.js static/dist/
rm -rf "$TMP_DIR"
cp -f static/dist/mascot-umd.js static/dist/mascot-min.js
