#!/bin/bash
# Pull latest from GitHub and rebuild OpenReply on this VPS.
set -euo pipefail
cd /opt/openreply
git pull --ff-only origin main
docker compose build
docker compose up -d
docker compose ps
curl -fsS https://openreply.spikeiq.cloud/api/health
echo
