#!/bin/bash
set -eu

if (($# != 1)); then
  cat <<EOT
Usage: $0 <game-url>
ex. https://kif-pona.heroz.jp/games/<game-id>
EOT
  exit 1
fi

url="$1"

curl -s "$url" | perl -ne 'print $_ if s/.*receiveMove\("([^"]+)"\);.*/$1/'
