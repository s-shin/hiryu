#!/bin/bash
set -eu

cd "$(dirname "$0")"

for yaml_file in ../schema/*.yml; do
  schema_file="${yaml_file%.*}"
  schema_name="$(basename "$schema_file")"
  ./yaml2json.rb "$yaml_file" >"$schema_file"
  schema_ts="../src/${schema_name}/schema.ts"
  echo '/* tslint:disable */' >"$schema_ts"
  echo 'export default' >>"$schema_ts"
  cat "$schema_file" >>"$schema_ts"
done
