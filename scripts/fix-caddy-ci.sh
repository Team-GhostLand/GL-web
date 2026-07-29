#!/bin/bash
set -e
FILE=/etc/caddy/sites-enabled/ghostland.caddy
cp "$FILE" "${FILE}.bak.$(date +%Y%m%d%H%M%S)"
cat > "$FILE" <<'EOF'
ghostland.ovh, www.ghostland.ovh, http://ghostland.localhost {
    # jifocc-site:ghostland

    handle /modules/ci* {
        reverse_proxy 127.0.0.1:2137
    }

    handle /__l5e/* {
        root * /home/jifo/websites/ghostland/.output/public
        file_server
    }
    handle {
        reverse_proxy 127.0.0.1:8083
    }
}
EOF
echo "=== config ==="
cat "$FILE"
echo "=== validate ==="
caddy validate --config /etc/caddy/Caddyfile
echo "=== reload ==="
if sudo -n systemctl reload caddy 2>/dev/null; then
  echo "reloaded via sudo -n systemctl"
elif caddy reload --config /etc/caddy/Caddyfile 2>/dev/null; then
  echo "reloaded via caddy reload"
else
  echo "WARN: could not reload caddy automatically"
  # Try admin API on 2019
  if curl -sf http://127.0.0.1:2019/config/ >/dev/null 2>&1; then
    ADAPTED=$(caddy adapt --config /etc/caddy/Caddyfile)
    curl -sf -X POST http://127.0.0.1:2019/load -H "Content-Type: application/json" -d "$ADAPTED" && echo "reloaded via admin API" || echo "admin API load failed"
  fi
fi
sleep 1
echo "=== smoke host ==="
curl -sk -H "Accept: application/json" -H "Host: ghostland.ovh" https://127.0.0.1/modules/ci/ | head -c 400
echo
echo "=== smoke public ==="
curl -s -H "Accept: application/json" https://ghostland.ovh/modules/ci/ | head -c 400
echo
