#!/bin/bash
set -eux

outdir="$1"
mkdir -p "$outdir"

key_path="${outdir}/server-key.pem"
csr_path="${outdir}/server-csr.pem"
crt_path="${outdir}/server-crt.pem"

openssl genrsa 2048 > "$key_path"
openssl req -new -sha256 -key "$key_path" -out "$csr_path" -subj "/C=JP/ST=Tokyo/L=Shibuya/O=MyOrg/OU=MyOrgUnit/CN=localhost"
openssl x509 -in "$csr_path" -out "$crt_path" -req -signkey "$key_path" -sha256 -days 3650
