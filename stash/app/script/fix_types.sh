#!/bin/bash
set -eu

cd "$(dirname "$0")/.."

rm -r node_modules/@types/shogi.js
mkdir -p node_modules/@types/shogi.js
cp node_modules/shogi.js/lib/shogi.d.ts node_modules/@types/shogi.js/index.d.ts

rm -r node_modules/@types/json-kifu-format
mkdir -p node_modules/@types/json-kifu-format
cp node_modules/json-kifu-format/lib/*.d.ts \
  node_modules/json-kifu-format/src/*.d.ts \
  node_modules/@types/json-kifu-format
mv node_modules/@types/json-kifu-format/jkfplayer.d.ts \
  node_modules/@types/json-kifu-format/index.d.ts

rm -r node_modules/@types/JSONKifuFormat

