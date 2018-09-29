#!/bin/bash
set -eu

cd "$(dirname "$0")/.."

usage() {
  cat <<EOT
Usage: $0 <name>
EOT
}

run() { echo "RUN: $*"; "$@"; }

main() {
  local name="$1"
  run cp -R misc/skeleton-lib "packages/${name}"
  for file in package.json README.md; do
    run perl -i -sple 's/<pkg>/$name/g' -- -name="$name" "packages/${name}/${file}"
  done
  echo 'Done!'
}

main "$@"
