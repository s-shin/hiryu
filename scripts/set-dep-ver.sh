#!/bin/bash
set -eu

cd "$(dirname "$0")/.."

usage() {
  cat <<EOT
Usage: $0 <dep-pkg-name> <new-ver> [-x]
EOT
}

abort() { echo -e "ERROR: $*\n"; exit 1; }

opt_nargs=0
opt_dep=''
opt_ver=''
opt_execute=false

while (($# > 0)); do
  case "$1" in
    -x ) opt_execute=true;;
    -* ) abort "unknown option: $1";;
    * )
      case "$opt_nargs" in
        0 ) opt_dep="$1";;
        1 ) opt_ver="$1";;
        * ) abort 'too many arguments';;
      esac
      ((++opt_nargs))
  esac
  shift
done

if ! $opt_execute; then
  echo "### DRYRUN MODE ###"
fi

for pkg_path in packages/*; do
  _jq() { cat "${pkg_path}/package.json" | jq -r "$@"; }
  for key in dependencies devDependencies peerDependencies; do
    ver="$(_jq ".${key}.\"${opt_dep}\"")"
    new_ver="${opt_ver:-$ver}"
    if [[ "$ver" != 'null' ]]; then
      echo "${pkg_path} > ${key} > ${opt_dep}: ${ver} => ${new_ver}"
      if $opt_execute; then
        perl -i -pe "s|\\Q\"${opt_dep}\": \"${ver}\"\\E|\"${opt_dep}\": \"${new_ver}\"|" "${pkg_path}/package.json"
      fi
    fi
  done
done
