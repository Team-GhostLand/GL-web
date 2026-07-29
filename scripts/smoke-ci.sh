#!/bin/bash
set -e
echo "=== via resolve ==="
curl -4 -sk --resolve ghostland.ovh:443:127.0.0.1 -o /tmp/ci.json -w "code=%{http_code} size=%{size_download}\n" \
  -H "Accept: application/json" \
  "https://ghostland.ovh/modules/ci/"
echo "body:"
cat /tmp/ci.json
echo
echo "=== public ==="
curl -4 -s -o /tmp/ci2.json -w "code=%{http_code} size=%{size_download}\n" \
  -H "Accept: application/json" \
  "https://ghostland.ovh/modules/ci/"
echo "body:"
head -c 500 /tmp/ci2.json
echo
echo "=== file download head ==="
curl -4 -sk --resolve ghostland.ovh:443:127.0.0.1 -o /dev/null -w "code=%{http_code} size=%{size_download}\n" \
  -I "https://ghostland.ovh/modules/ci/modpacks/GhostLand%207.1.2.mrpack"
